import assert from "node:assert/strict";
import test from "node:test";

import { GET } from "../app/api/internal/command-center/mailchimp/route.ts";

const ENV_NAMES = [
  "COMMAND_CENTER_METRICS_TOKEN",
  "MAILCHIMP_API_KEY",
  "MAILCHIMP_AUDIENCE_ID",
  "MAILCHIMP_SERVER_PREFIX",
] as const;

const TEST_ENV = {
  COMMAND_CENTER_METRICS_TOKEN: "test-command-center-token",
  MAILCHIMP_API_KEY: "test-mailchimp-key",
  MAILCHIMP_AUDIENCE_ID: "a1b2c3d4e5",
  MAILCHIMP_SERVER_PREFIX: "us21",
};

async function withTestBoundary(run: () => Promise<void>): Promise<void> {
  const previousFetch = globalThis.fetch;
  const previousEnv = Object.fromEntries(
    ENV_NAMES.map((name) => [name, process.env[name]]),
  ) as Record<(typeof ENV_NAMES)[number], string | undefined>;

  Object.assign(process.env, TEST_ENV);

  try {
    await run();
  } finally {
    globalThis.fetch = previousFetch;
    for (const name of ENV_NAMES) {
      if (previousEnv[name] === undefined) delete process.env[name];
      else process.env[name] = previousEnv[name];
    }
  }
}

function request(authorization?: string, query = ""): Request {
  const headers = authorization ? { Authorization: authorization } : undefined;
  return new Request(
    `https://www.innovatinghighered.com/api/internal/command-center/mailchimp${query}`,
    { headers },
  );
}

test("missing, malformed, and invalid authorization share one 401 and never call Mailchimp", async () => {
  await withTestBoundary(async () => {
    let fetchCalls = 0;
    globalThis.fetch = (async () => {
      fetchCalls += 1;
      throw new Error("Mailchimp must not be called");
    }) as typeof fetch;

    const responses = await Promise.all([
      GET(request()),
      GET(request("Basic test-command-center-token")),
      GET(request("Bearer wrong-token")),
    ]);

    for (const response of responses) {
      assert.equal(response.status, 401);
      assert.equal(response.headers.get("cache-control"), "private, no-store, max-age=0");
      assert.deepEqual(await response.json(), { error: "Unauthorized" });
    }
    assert.equal(fetchCalls, 0);
  });
});

test("authorized requests call only the two fixed endpoints and return aggregate allowlisted fields", async () => {
  await withTestBoundary(async () => {
    const calls: Array<{ url: string; options?: RequestInit }> = [];
    const activity = Array.from({ length: 31 }, (_, index) => ({
      day: `2026-08-${String(index + 1).padStart(2, "0")}`,
      subs: index,
      unsubs: index + 1,
      emails_sent: index + 2,
      unique_opens: index + 3,
      recipient_clicks: index + 4,
      hard_bounce: index + 5,
      soft_bounce: index + 6,
      other_adds: index + 7,
      other_removes: index + 8,
      email_address: "private@example.com",
      member_id: "private-contact-id",
      unexpected_field: "must-not-pass-through",
    }));

    globalThis.fetch = (async (input, options) => {
      const url = String(input);
      calls.push({ url, options });

      if (url.includes("/activity?count=30")) {
        return Response.json({
          activity,
          list_id: "private-list-id",
          email_address: "private@example.com",
        });
      }

      return Response.json({
        id: "private-list-id",
        stats: {
          member_count: 14,
          unsubscribe_count: 2,
          cleaned_count: 3,
          private_metric: 999,
        },
        contact: { company: "Private Company" },
      });
    }) as typeof fetch;

    const response = await GET(
      request(
        "Bearer test-command-center-token",
        "?audience=attacker-list&count=999&path=/members",
      ),
    );
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "private, no-store, max-age=0");
    assert.deepEqual(
      calls.map(({ url }) => url),
      [
        "https://us21.api.mailchimp.com/3.0/lists/a1b2c3d4e5?fields=id,stats.member_count,stats.unsubscribe_count,stats.cleaned_count",
        "https://us21.api.mailchimp.com/3.0/lists/a1b2c3d4e5/activity?count=30",
      ],
    );
    for (const call of calls) {
      assert.equal(call.options?.method, "GET");
      assert.equal(call.options?.cache, "no-store");
      assert.ok(call.options?.signal instanceof AbortSignal);
      assert.match(new Headers(call.options?.headers).get("authorization") ?? "", /^Basic /);
    }

    assert.deepEqual(Object.keys(body), [
      "memberCount",
      "unsubscribeCount",
      "cleanedCount",
      "activity",
    ]);
    assert.equal(body.memberCount, 14);
    assert.equal(body.unsubscribeCount, 2);
    assert.equal(body.cleanedCount, 3);
    assert.equal(body.activity.length, 30);
    assert.deepEqual(body.activity[0], {
      date: "2026-08-01",
      newConfirmed: 0,
      otherAdds: 7,
      unsubscribes: 1,
      otherRemoves: 8,
    });
    assert.doesNotMatch(
      JSON.stringify(body),
      /private@example\.com|private-contact-id|private-list-id|unexpected_field|private_metric|Private Company|emailsSent|uniqueOpens|recipientClicks|hardBounces|softBounces/,
    );
  });
});

test("invalid Mailchimp routing configuration fails closed before fetch", async () => {
  await withTestBoundary(async () => {
    let fetchCalls = 0;
    globalThis.fetch = (async () => {
      fetchCalls += 1;
      throw new Error("Mailchimp must not be called");
    }) as typeof fetch;

    process.env.MAILCHIMP_SERVER_PREFIX = "us21.attacker.example";
    const badPrefix = await GET(request("Bearer test-command-center-token"));
    assert.equal(badPrefix.status, 503);
    assert.deepEqual(await badPrefix.json(), { error: "Service unavailable" });

    process.env.MAILCHIMP_SERVER_PREFIX = "us21";
    process.env.MAILCHIMP_AUDIENCE_ID = "audience/../../members";
    const badAudience = await GET(request("Bearer test-command-center-token"));
    assert.equal(badAudience.status, 503);
    assert.deepEqual(await badAudience.json(), { error: "Service unavailable" });
    assert.equal(fetchCalls, 0);
  });
});

test("upstream status and response-shape failures expose only one generic error", async () => {
  await withTestBoundary(async () => {
    let mode: "status" | "shape" = "status";
    globalThis.fetch = (async (input) => {
      if (mode === "status" && String(input).includes("?fields=")) {
        return Response.json(
          { detail: "private@example.com and upstream internals" },
          { status: 429 },
        );
      }

      if (mode === "shape" && String(input).includes("?fields=")) {
        return Response.json({ stats: { member_count: "private@example.com" } });
      }

      return Response.json({ activity: [] });
    }) as typeof fetch;

    const statusFailure = await GET(request("Bearer test-command-center-token"));
    assert.equal(statusFailure.status, 502);
    assert.deepEqual(await statusFailure.json(), { error: "Unable to retrieve metrics" });

    mode = "shape";
    const shapeFailure = await GET(request("Bearer test-command-center-token"));
    assert.equal(shapeFailure.status, 502);
    const shapeBody = await shapeFailure.json();
    assert.deepEqual(shapeBody, { error: "Unable to retrieve metrics" });
    assert.doesNotMatch(JSON.stringify(shapeBody), /private@example\.com|upstream internals/);
  });
});

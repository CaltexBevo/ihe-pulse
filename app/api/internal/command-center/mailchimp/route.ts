import { createHash, timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const UPSTREAM_TIMEOUT_MS = 5_000;
const MAX_ACTIVITY_ROWS = 30;
const SERVER_PREFIX_PATTERN = /^us[1-9]\d{0,2}$/;
const AUDIENCE_ID_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;

const RESPONSE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  Vary: "Authorization",
};

type JsonRecord = Record<string, unknown>;

type DailyActivity = {
  date: string;
  newConfirmed: number;
  otherAdds: number;
  unsubscribes: number;
  otherRemoves: number;
};

type MetricsResponse = {
  memberCount: number;
  unsubscribeCount: number;
  cleanedCount: number;
  activity: DailyActivity[];
};

const ACTIVITY_FIELDS = [
  ["subs", "newConfirmed"],
  ["other_adds", "otherAdds"],
  ["unsubs", "unsubscribes"],
  ["other_removes", "otherRemoves"],
] as const;

function json(body: object, status: number, extraHeaders?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...RESPONSE_HEADERS, ...extraHeaders },
  });
}

function unauthorized(): Response {
  return json({ error: "Unauthorized" }, 401, { "WWW-Authenticate": "Bearer" });
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonNegativeInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? value
    : null;
}

function tokenMatches(provided: string, expected: string): boolean {
  const providedDigest = createHash("sha256").update(provided, "utf8").digest();
  const expectedDigest = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(providedDigest, expectedDigest);
}

function authorized(request: Request): boolean {
  const header = request.headers.get("authorization");
  const match = header?.match(/^Bearer ([^\s]{1,512})$/i);
  const expected = process.env.COMMAND_CENTER_METRICS_TOKEN;

  return Boolean(match && expected && tokenMatches(match[1], expected));
}

function sanitizeActivityRow(value: unknown): DailyActivity | null {
  if (!isRecord(value) || typeof value.day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value.day)) {
    return null;
  }

  const row: Record<string, string | number> = { date: value.day };

  for (const [upstreamName, responseName] of ACTIVITY_FIELDS) {
    const metric = nonNegativeInteger(value[upstreamName]);
    if (metric === null) return null;

    row[responseName] = metric;
  }

  return row as DailyActivity;
}

function sanitizeMetrics(listValue: unknown, activityValue: unknown): MetricsResponse | null {
  if (!isRecord(listValue) || !isRecord(listValue.stats) || !isRecord(activityValue)) {
    return null;
  }

  const memberCount = nonNegativeInteger(listValue.stats.member_count);
  const unsubscribeCount = nonNegativeInteger(listValue.stats.unsubscribe_count);
  const cleanedCount = nonNegativeInteger(listValue.stats.cleaned_count);
  const upstreamActivity = activityValue.activity;

  if (
    memberCount === null ||
    unsubscribeCount === null ||
    cleanedCount === null ||
    !Array.isArray(upstreamActivity)
  ) {
    return null;
  }

  const activity: DailyActivity[] = [];
  for (const value of upstreamActivity.slice(0, MAX_ACTIVITY_ROWS)) {
    const row = sanitizeActivityRow(value);
    if (!row) return null;
    activity.push(row);
  }

  return { memberCount, unsubscribeCount, cleanedCount, activity };
}

export async function GET(request: Request): Promise<Response> {
  if (!authorized(request)) return unauthorized();

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

  if (
    !apiKey ||
    !audienceId ||
    !serverPrefix ||
    !AUDIENCE_ID_PATTERN.test(audienceId) ||
    !SERVER_PREFIX_PATTERN.test(serverPrefix)
  ) {
    return json({ error: "Service unavailable" }, 503);
  }

  const audience = encodeURIComponent(audienceId);
  const baseUrl = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audience}`;
  const upstreamAuthorization = Buffer.from(`command-center:${apiKey}`, "utf8").toString("base64");
  const signal = AbortSignal.timeout(UPSTREAM_TIMEOUT_MS);
  const upstreamOptions: RequestInit = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${upstreamAuthorization}`,
    },
    cache: "no-store",
    signal,
  };

  try {
    const [listResponse, activityResponse] = await Promise.all([
      fetch(
        `${baseUrl}?fields=id,stats.member_count,stats.unsubscribe_count,stats.cleaned_count`,
        upstreamOptions,
      ),
      fetch(`${baseUrl}/activity?count=30`, upstreamOptions),
    ]);

    if (!listResponse.ok || !activityResponse.ok) {
      return json({ error: "Unable to retrieve metrics" }, 502);
    }

    const metrics = sanitizeMetrics(
      await listResponse.json(),
      await activityResponse.json(),
    );

    return metrics
      ? json(metrics, 200)
      : json({ error: "Unable to retrieve metrics" }, 502);
  } catch {
    return json({ error: "Unable to retrieve metrics" }, 502);
  }
}

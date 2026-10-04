import assert from 'node:assert/strict';
import test from 'node:test';

import {
  consumeChallengeToken,
  FetchTimeoutError,
  NEWSLETTER_BROWSER_TIMEOUT_MS,
  nextChallengeReset,
  postNewsletter,
  readNewsletterReadiness,
} from '../lib/newsletterClient.ts';
import { NEWSLETTER_SERVER_DEADLINE_MS } from '../lib/newsletterSecurity.ts';

const BODY = {
  email: 'person@example.edu',
  firstName: 'Q',
  lastName: 'Li',
  _gotcha: '',
  turnstileToken: 'single-use-token',
};

test('client preserves explicit grants-only choices and criteria without changing legacy payloads', async () => {
  for (const body of [BODY, { ...BODY, preferences: { pulse: false, grants: true }, grantCriteria: { audiences: ['community-colleges'], locations: ['CA'], areas: [], minimumAwardUsd: 5000 } }]) {
    const result = await postNewsletter(body, (async (url, init) => {
      assert.equal(url, '/api/newsletter');
      assert.equal(init?.method, 'POST');
      assert.deepEqual(JSON.parse(String(init?.body)), body);
      return Response.json({ success: true, preferencesUrl: '/email-preferences' });
    }) as typeof fetch);
    assert.equal(result.data.preferencesUrl, '/email-preferences');
  }
});

test('browser retry deadline leaves a deterministic margin after the total server deadline', () => {
  const timeoutMargin = NEWSLETTER_BROWSER_TIMEOUT_MS - NEWSLETTER_SERVER_DEADLINE_MS;
  assert.equal(NEWSLETTER_SERVER_DEADLINE_MS, 7_000);
  assert.equal(NEWSLETTER_BROWSER_TIMEOUT_MS, 10_000);
  assert.ok(timeoutMargin >= 3_000);
});

test('consumes each Turnstile token once and advances a bounded reset signal', () => {
  assert.deepEqual(consumeChallengeToken('single-use-token'), {
    submissionToken: 'single-use-token',
    remainingToken: '',
  });
  assert.deepEqual(consumeChallengeToken('').submissionToken, '');
  assert.equal(nextChallengeReset(0), 1);
  assert.equal(nextChallengeReset(4), 5);
  assert.equal(nextChallengeReset(Number.NaN), 1);
});

test('browser newsletter request aborts a stalled fetch within the supplied bound', async () => {
  let aborted = false;
  const fetchImplementation = (async (_input: string | URL | Request, init?: RequestInit) => (
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => {
        aborted = true;
        reject(new Error('aborted'));
      }, { once: true });
    })
  )) as typeof fetch;

  await assert.rejects(
    postNewsletter(BODY, fetchImplementation, 5),
    (error: unknown) => error instanceof FetchTimeoutError,
  );
  assert.equal(aborted, true);
});

test('browser timeout remains active while a response body stalls', async () => {
  let aborted = false;
  const fetchImplementation = (async (_input: string | URL | Request, init?: RequestInit) => ({
    ok: true,
    json: () => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => {
        aborted = true;
        reject(new Error('aborted'));
      }, { once: true });
    }),
  } as Response)) as typeof fetch;

  await assert.rejects(
    postNewsletter(BODY, fetchImplementation, 5),
    (error: unknown) => error instanceof FetchTimeoutError,
  );
  assert.equal(aborted, true);
});

test("readiness uses same-origin uncached GET and accepts only an explicit successful boolean", async () => {
  for (const [body, status, expected] of [[{ready:true},200,true],[{ready:false},200,false],[{ready:"true"},200,false],[null,200,false],[{ready:true},503,false]] as const) {
    assert.equal(await readNewsletterReadiness((async (url, init) => {
      assert.equal(url, "/api/newsletter");
      assert.equal(init?.method, "GET");
      assert.equal(init?.cache, "no-store");
      assert.equal(init?.credentials, "same-origin");
      return Response.json(body, {status});
    }) as typeof fetch), expected);
  }
  assert.equal(await readNewsletterReadiness((async () => { throw new Error("offline"); }) as typeof fetch), false);
  assert.equal(await readNewsletterReadiness((async () => new Response("invalid JSON")) as typeof fetch), false);
  assert.equal(await readNewsletterReadiness((async (_url, init) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener("abort", () => reject(new Error("timeout")), {once:true});
  })) as typeof fetch, 5), false);
});

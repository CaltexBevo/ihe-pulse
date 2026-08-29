import assert from 'node:assert/strict';
import test from 'node:test';

import {
  consumeChallengeToken,
  FetchTimeoutError,
  NEWSLETTER_BROWSER_TIMEOUT_MS,
  nextChallengeReset,
  postNewsletter,
} from '../lib/newsletterClient.ts';
import { NEWSLETTER_SERVER_DEADLINE_MS } from '../lib/newsletterSecurity.ts';

const BODY = {
  email: 'person@example.edu',
  firstName: 'Q',
  lastName: 'Li',
  _gotcha: '',
  turnstileToken: 'single-use-token',
};

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

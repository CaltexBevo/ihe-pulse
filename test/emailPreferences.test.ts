import test from 'node:test';
import assert from 'node:assert/strict';
import { handleNewsletterPost } from '../lib/newsletterSecurity.ts';
import { readStoredGrantCriteria } from '../lib/server/mailchimpPreferences.ts';
import { setupEmailPreferences } from '../scripts/setup-email-preferences.ts';
import { MailchimpMarketing } from '../lib/server/mailchimpMarketing.ts';
const env = { NODE_ENV: 'test', TURNSTILE_SECRET_KEY: 'fixture', MAILCHIMP_API_KEY: 'fixture', MAILCHIMP_AUDIENCE_ID: 'abc123', MAILCHIMP_SERVER_PREFIX: 'us1', MAILCHIMP_PREFERENCES_SCHEMA: 'v1' };
const base = { email: 'person@example.edu', firstName: 'Jane', lastName: 'Doe', turnstileToken: 'fixture-token-valid', _gotcha: '', grantCriteria: { audiences: [], locations: [], areas: [], minimumAwardUsd: null } };
const request = (body: unknown) => new Request('http://localhost:3000/api/newsletter', { method: 'POST', headers: { origin: 'http://localhost:3000', 'content-type': 'application/json' }, body: JSON.stringify(body) });

const privateSchema = ['IHEPULSE', 'IHEGRANTS', 'IHEAUD', 'IHELOC', 'IHEAREA', 'IHEMIN', 'IHESTART'].map((tag, index) => ({
  tag, type: index < 2 ? 'dropdown' : 'text', public: false, required: false,
  ...(index < 2 ? { options: { choices: ['YES', 'NO'] } } : {}),
}));

test('setup accepts all seven private fields without a visibility mutation', async () => {
  const methods: string[] = [];
  const client = new MailchimpMarketing(env, (async (_url, init) => {
    methods.push(init?.method ?? 'GET');
    return Response.json({ merge_fields: privateSchema, total_items: privateSchema.length });
  }) as typeof fetch);
  assert.deepEqual(await setupEmailPreferences(client), { mode: 'dry-run', missing: [], existing: 7 });
  assert.deepEqual(await setupEmailPreferences(client, true), { mode: 'apply', missing: [], existing: 7 });
  assert.deepEqual(methods, ['GET', 'GET']);
});

test('setup rejects unexpected public exposure before creating or changing any field', async () => {
  for (const exposed of privateSchema) {
    const methods: string[] = [];
    const client = new MailchimpMarketing(env, (async (_url, init) => {
      methods.push(init?.method ?? 'GET');
      // Other fields are missing: conflict must stop even their creation.
      return Response.json({ merge_fields: [{ ...exposed, public: true }], total_items: 1 });
    }) as typeof fetch);
    await assert.rejects(setupEmailPreferences(client, true), /configuration conflicts/);
    assert.deepEqual(methods, ['GET']);
  }
});

test('setup creates missing fields private and optional while preserving consent dropdown choices', async () => {
  const created: Record<string, unknown>[] = [];
  const client = new MailchimpMarketing(env, (async (_url, init) => {
    if (init?.method === 'POST') { created.push(JSON.parse(String(init.body))); return Response.json({}); }
    return Response.json({ merge_fields: [], total_items: 0 });
  }) as typeof fetch);
  await setupEmailPreferences(client, true);
  assert.deepEqual(created.map(({ tag, type, public: visibility, required, options }) => ({ tag, type, public: visibility, required, ...(options ? { options } : {}) })), privateSchema);
  assert.equal(created.some(field => 'default_value' in field), false);
});
test('Pulse, grants and both are persisted independently with pending double opt-in', async () => {
  for (const preferences of [{ pulse: true, grants: false }, { pulse: false, grants: true }, { pulse: true, grants: true }]) {
    const calls: { url: string; init?: RequestInit }[] = [];
    const result = await handleNewsletterPost(request({ ...base, preferences }), { env, fetch: (async (url, init) => {
      calls.push({ url: String(url), init });
      return calls.length === 1 ? Response.json({ success: true, action: 'newsletter_signup', hostname: 'localhost' }) : Response.json({ id: 'fixture' });
    }) as typeof fetch });
    assert.equal(result.status, 200);
    const body = JSON.parse(String(calls[1].init?.body));
    assert.equal(body.status, 'pending');
    assert.equal(body.merge_fields.IHEPULSE, preferences.pulse ? 'YES' : 'NO');
    assert.equal(body.merge_fields.IHEGRANTS, preferences.grants ? 'YES' : 'NO');
    assert.equal(body.tags.includes('Innovation Pulse'), preferences.pulse);
  }
});
test('missing schema, no consent, malformed criteria fail before provider requests', async () => {
  for (const [body, environment, expected] of [
    [{ ...base, preferences: { pulse: false, grants: true } }, { ...env, MAILCHIMP_PREFERENCES_SCHEMA: undefined }, 503],
    [{ ...base, preferences: { pulse: false, grants: false } }, env, 400],
    [{ ...base, preferences: { pulse: false, grants: true }, grantCriteria: { ...base.grantCriteria, minimumAwardUsd: 'bogus' } }, env, 400],
  ] as const) {
    const response = await handleNewsletterPost(request(body), { env: environment, fetch: (async () => { throw new Error('No provider calls allowed'); }) as typeof fetch });
    assert.equal(response.status, expected);
  }
});
test('existing subscriber collision never patches preferences or reveals membership', async () => {
  const outputs = [];
  for (const exists of [false, true]) {
    let calls = 0;
    const response = await handleNewsletterPost(request({ ...base, preferences: { pulse: false, grants: true } }), { env, fetch: (async (_url, init) => {
      assert.equal(init?.method, 'POST'); calls++;
      return calls === 1 ? Response.json({ success: true, action: 'newsletter_signup', hostname: 'localhost' }) : exists ? Response.json({ title: 'Member Exists' }, { status: 400 }) : Response.json({ id: 'fixture' });
    }) as typeof fetch });
    outputs.push(await response.json()); assert.equal(calls, 2);
  }
  assert.deepEqual(outputs[0], outputs[1]);
});
test('corrupt stored criteria do not fall back to any', () => {
  const fields = { IHEAUD: '', IHELOC: '', IHEAREA: '', IHEMIN: '' };
  assert.ok(readStoredGrantCriteria(fields));
  for (const change of [{ IHEMIN: 'abc' }, { IHEAUD: 'unknown' }, { IHELOC: undefined }, { IHEAREA: 'x'.repeat(256) }]) assert.equal(readStoredGrantCriteria({ ...fields, ...change }), null);
});
test('legacy forms remain Pulse-only and gain explicit consent fields only after setup', async () => {
  const legacy = { email: base.email, firstName: base.firstName, lastName: base.lastName, turnstileToken: base.turnstileToken, _gotcha: '' };
  for (const schema of [undefined, 'v1']) {
    const bodies: Record<string, unknown>[] = [];
    const response = await handleNewsletterPost(request(legacy), { env: { ...env, MAILCHIMP_PREFERENCES_SCHEMA: schema }, fetch: (async (_url, init) => {
      bodies.push(bodies.length === 0 ? {} : JSON.parse(String(init?.body)));
      return bodies.length === 1 ? Response.json({ success: true, action: 'newsletter_signup', hostname: 'localhost' }) : Response.json({ id: 'fixture' });
    }) as typeof fetch });
    assert.equal(response.status, 200);
    assert.equal(bodies[1].status, 'pending');
    const fields = bodies[1].merge_fields as Record<string, unknown>;
    assert.equal(fields.IHEPULSE, schema ? 'YES' : undefined);
    assert.equal(fields.IHEGRANTS, schema ? 'NO' : undefined);
  }
});
test('criteria cannot silently enroll a legacy contact or accompany a Pulse-only choice', async () => {
  for (const body of [base, { ...base, preferences: { pulse: true, grants: false }, grantCriteria: { ...base.grantCriteria, locations: ['CA'] } }]) {
    let calls = 0;
    const response = await handleNewsletterPost(request(body), { env, fetch: (async () => { calls++; throw new Error('unexpected provider call'); }) as typeof fetch });
    assert.equal(response.status, 400);
    assert.equal(calls, 0);
  }
});

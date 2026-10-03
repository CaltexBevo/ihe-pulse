import test from 'node:test';
import assert from 'node:assert/strict';
import { assertAccountContactCapacity, buildDigestPlan, planFingerprint, prepareDigestCampaigns, sendDigestCampaigns, type DigestMember } from '../lib/server/grantDigest.ts';
import { MailchimpMarketing } from '../lib/server/mailchimpMarketing.ts';
import { getPublicInnovationGrants } from '../lib/data/innovation-grants-public.ts';
const env = { MAILCHIMP_API_KEY: 'fixture', MAILCHIMP_SERVER_PREFIX: 'us1', MAILCHIMP_AUDIENCE_ID: 'abc123' };
const window = { sinceInclusive: '2026-09-21', untilExclusive: '2026-09-28', asOf: new Date('2026-09-26T16:00:00Z') };
const member: DigestMember = { id: 'a'.repeat(32), email_address: 'fixture@example.edu', status: 'subscribed', merge_fields: { IHEPULSE: 'NO', IHEGRANTS: 'YES', IHEAUD: '', IHELOC: '', IHEAREA: '', IHEMIN: '', IHESTART: '2026-09-19T00:00:00Z' } };
const grants = getPublicInnovationGrants();
test('only explicit confirmed grant opt-in gets a nonempty custom digest; retry plans are stable', () => {
  const eligible = buildDigestPlan('abc123', [member], grants, window);
  assert.ok(eligible.cohorts.length > 0);
  assert.match(eligible.cohorts[0].html, /\*\|UPDATE_PROFILE\|\*/);
  assert.match(eligible.cohorts[0].html, /\*\|UNSUB\|\*/);
  assert.equal(planFingerprint(eligible), planFingerprint(buildDigestPlan('abc123', [member], grants, window)));
  for (const invalid of [{ ...member, status: 'pending' }, { ...member, status: 'unsubscribed' }, { ...member, merge_fields: { ...member.merge_fields, IHEGRANTS: 'NO' } }, { ...member, merge_fields: { ...member.merge_fields, IHEMIN: 'unknown' } }]) assert.equal(buildDigestPlan('abc123', [invalid], grants, window).cohorts.length, 0);
  assert.equal(buildDigestPlan('abc123', [member], [], window).cohorts.length, 0);
});
test('same grant set creates one exact static cohort; provider preparation never sends', async () => {
  const second = { ...member, id: 'b'.repeat(32), email_address: 'second@example.edu' };
  const plan = buildDigestPlan('abc123', [member, second], grants, window);
  assert.equal(plan.cohorts.length, 1);
  const calls: { path: string; method?: string; body: Record<string, unknown> }[] = [];
  const client = new MailchimpMarketing(env, (async (url, init) => {
    calls.push({ path: String(url), method: init?.method, body: JSON.parse(String(init?.body)) });
    if (String(url).endsWith('/segments')) return Response.json({ id: 7 });
    if (String(url).endsWith('/campaigns')) return Response.json({ id: 'campaign1' });
    return Response.json({});
  }) as typeof fetch);
  await prepareDigestCampaigns(client, plan, [member, second], { fromName: 'Innovating Higher Ed', replyTo: 'fixture@example.edu' }, async () => {});
  assert.deepEqual(calls[0].body.static_segment, [member.email_address, second.email_address]);
  assert.deepEqual(calls[1].body.recipients, { list_id: 'abc123', segment_opts: { saved_segment_id: 7 } });
  assert.equal(calls[2].body.html, plan.cohorts[0].html);
  assert.ok(calls.every(c => !c.path.includes('/actions/send')));
  await prepareDigestCampaigns(client, plan, [member, second], { fromName: 'Innovating Higher Ed', replyTo: 'fixture@example.edu' }, async () => {});
  assert.equal(calls.length, 3);
});
test('lost creation response is never blindly retried', async () => {
  const plan = buildDigestPlan('abc123', [member], grants, window);
  let calls = 0;
  const client = new MailchimpMarketing(env, (async () => { calls++; throw new Error('timeout'); }) as typeof fetch);
  const prepare = () => prepareDigestCampaigns(client, plan, [member], { fromName: 'Innovating Higher Ed', replyTo: 'fixture@example.edu' }, async () => {});
  await assert.rejects(prepare());
  assert.equal(plan.cohorts[0].phase, 'creating-segment');
  await assert.rejects(prepare(), /uncertain/); assert.equal(calls, 1);
});
test('send validates exact consent/content/recipients and reconciles a lost send response without repeating', async () => {
  const plan = buildDigestPlan('abc123', [member], grants, window);
  const cohort = plan.cohorts[0]; cohort.phase = 'ready'; cohort.segmentId = 7; cohort.campaignId = 'campaign1';
  let sends = 0; let providerStatus = 'save';
  const client = new MailchimpMarketing(env, (async (url, init) => {
    const path = new URL(String(url)).pathname;
    if (path.endsWith('/lists')) return Response.json({ lists: [{ id: 'abc123' }], total_items: 1 });
    if (path.endsWith('/abc123/members')) return Response.json({ total_items: 1 });
    if (path.endsWith('/actions/send')) { sends++; providerStatus = 'sent'; throw new Error('response lost after acceptance'); }
    if (path.endsWith('/send-checklist')) return Response.json({ is_ready: true });
    if (path.endsWith('/content')) return Response.json({ html: cohort.html });
    if (path.includes('/segments/7/members')) return Response.json({ members: [{ id: member.id }], total_items: 1 });
    if (path.endsWith('/campaign1')) return Response.json({ status: providerStatus, recipients: { list_id: 'abc123', recipient_count: 1, segment_opts: { saved_segment_id: 7 } } });
    if (init?.method === 'GET' && path.endsWith('/campaigns')) return Response.json({ campaigns: [], total_items: 0 });
    throw new Error('Unexpected API request');
  }) as typeof fetch);
  const options = { approvedFingerprint: planFingerprint(plan), verifiedRemainingSends: 20, verifiedBillableContacts: 11, budgetVerifiedAt: window.asOf.toISOString(), now: window.asOf, clock: () => window.asOf };
  const revalidate = async () => buildDigestPlan('abc123', [member], grants, window);
  await assert.rejects(sendDigestCampaigns(client, plan, options, revalidate, async () => {}), /response lost/);
  assert.equal(cohort.phase, 'submitting');
  await sendDigestCampaigns(client, plan, options, revalidate, async () => {});
  assert.equal(cohort.phase, 'sent'); assert.equal(sends, 1);
});
test('changed consent, missing exact approval, and exhausted account budget block sending', async () => {
  const plan = buildDigestPlan('abc123', [member], grants, window);
  plan.cohorts[0].phase = 'ready'; plan.cohorts[0].segmentId = 7; plan.cohorts[0].campaignId = 'campaign1';
  const client = new MailchimpMarketing(env, (async () => Response.json({ campaigns: [], lists: [], total_items: 0 })) as typeof fetch);
  const options = { approvedFingerprint: planFingerprint(plan), verifiedRemainingSends: 0, verifiedBillableContacts: 11, budgetVerifiedAt: window.asOf.toISOString(), now: window.asOf, clock: () => window.asOf };
  await assert.rejects(sendDigestCampaigns(client, plan, { ...options, approvedFingerprint: 'wrong' }, async () => plan, async () => {}), /approval/);
  await assert.rejects(sendDigestCampaigns(client, plan, options, async () => plan, async () => {}), /budget/);
  await assert.rejects(sendDigestCampaigns(client, plan, { ...options, verifiedRemainingSends: 20 }, async () => buildDigestPlan('abc123', [], grants, window), async () => {}), /consent/);
});
test('all-audience all-status metadata counts protect contact capacity without retrieving other contacts', async () => {
  const calls: string[] = [];
  const client = new MailchimpMarketing(env, (async url => {
    const text = String(url); calls.push(text);
    if (new URL(text).pathname.endsWith('/lists')) return Response.json({ lists: [{ id: 'abc123' }, { id: 'other123' }], total_items: 2 });
    assert.match(text, /fields=total_items/);
    assert.equal(text.includes('status=subscribed'), false);
    return Response.json({ total_items: 300 });
  }) as typeof fetch);
  await assert.rejects(assertAccountContactCapacity(client), /contact capacity/);
  assert.equal(calls.length, 3);
});
test('stale budget fails before any provider request', async () => {
  const plan = buildDigestPlan('abc123', [member], grants, window);
  const client = new MailchimpMarketing(env, (async () => { throw new Error('Unexpected provider call'); }) as typeof fetch);
  await assert.rejects(sendDigestCampaigns(client, plan, { approvedFingerprint: planFingerprint(plan), verifiedRemainingSends: 4000, budgetVerifiedAt: window.asOf.toISOString(), now: window.asOf, clock: () => new Date(window.asOf.getTime() + 16 * 60_000) }, async () => plan, async () => {}), /Fresh/);
});
test('scheduled prepare/send attempts reconcile asynchronous cohorts and never resubmit sent cohorts', async () => {
  const plan = buildDigestPlan('abc123', [member], grants, window);
  const first = plan.cohorts[0];
  first.phase = 'ready'; first.segmentId = 7; first.campaignId = 'campaign1';
  const second = { ...structuredClone(first), key: `${first.key}-second`, members: ['b'.repeat(32)], segmentId: 8, campaignId: 'campaign2' };
  plan.cohorts.push(second);
  const statuses: Record<string, string> = { campaign1: 'save', campaign2: 'save' };
  const submissions: string[] = [];
  const client = new MailchimpMarketing(env, (async (url, init) => {
    const path = new URL(String(url)).pathname;
    if (path.endsWith('/lists')) return Response.json({ lists: [{ id: 'abc123' }], total_items: 1 });
    if (path.endsWith('/abc123/members')) return Response.json({ total_items: 2 });
    const cohort = path.includes('campaign2') || path.includes('/segments/8/') ? second : first;
    if (path.endsWith('/actions/send')) {
      assert.equal(init?.method, 'POST');
      submissions.push(cohort.campaignId!); statuses[cohort.campaignId!] = 'sending';
      return new Response(null, { status: 204 });
    }
    if (path.endsWith('/send-checklist')) return Response.json({ is_ready: true });
    if (path.endsWith('/content')) return Response.json({ html: cohort.html });
    if (path.includes('/segments/')) return Response.json({ members: cohort.members.map(id => ({ id })), total_items: cohort.members.length });
    if (/\/campaign[12]$/.test(path)) return Response.json({ status: statuses[cohort.campaignId!], recipients: { list_id: 'abc123', recipient_count: cohort.members.length, segment_opts: { saved_segment_id: cohort.segmentId } } });
    if (path.endsWith('/campaigns')) return Response.json({ campaigns: Object.entries(statuses).filter(([, status]) => status !== 'save').map(([id, status]) => ({ id, status, emails_sent: 1, send_time: window.asOf.toISOString() })), total_items: Object.values(statuses).filter(s => s !== 'save').length });
    throw new Error('Unexpected API request');
  }) as typeof fetch);
  const options = { approvedFingerprint: planFingerprint(plan), verifiedRemainingSends: 100, budgetVerifiedAt: window.asOf.toISOString(), now: window.asOf, clock: () => window.asOf };
  const save = async () => {};
  const attempt = async () => {
    if (await prepareDigestCampaigns(client, plan, [member], { fromName: 'Innovating Higher Ed', replyTo: 'fixture@example.edu' }, save)) {
      await sendDigestCampaigns(client, plan, options, async () => structuredClone(plan), save);
    }
  };
  await attempt();
  assert.deepEqual(submissions, ['campaign1']);
  await attempt(); // Provider still sending; prepare waits without creating or sending.
  assert.deepEqual(submissions, ['campaign1']);
  statuses.campaign1 = 'sent';
  await attempt();
  assert.equal(first.phase, 'sent'); assert.deepEqual(submissions, ['campaign1', 'campaign2']);
  statuses.campaign2 = 'sent';
  await attempt(); await attempt();
  assert.equal(second.phase, 'sent'); assert.deepEqual(submissions, ['campaign1', 'campaign2']);
});

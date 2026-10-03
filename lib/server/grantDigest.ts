import 'server-only';
import { createHash } from 'node:crypto';
import { chooseNewMatchingGrants } from '../grantAlertMatching.ts';
import type { InnovationGrantOpportunity } from '../innovation-grants-shared.ts';
import { readStoredGrantCriteria } from './mailchimpPreferences.ts';
import { MailchimpMarketing } from './mailchimpMarketing.ts';

export type DigestMember = { id: string; email_address: string; status: string; merge_fields: Record<string, unknown>; timestamp_opt?: string; timestamp_signup?: string };
export type DigestCohort = { key: string; members: string[]; grants: number[]; html: string; segmentId?: number; campaignId?: string; phase: 'planned' | 'creating-segment' | 'segment-ready' | 'creating-campaign' | 'campaign-ready' | 'ready' | 'submitting' | 'sent' };
export type DigestPlan = { version: 1; listId: string; sinceInclusive: string; untilExclusive: string; cohorts: DigestCohort[] };
const hash = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const esc = (value: string) => value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
function safeUrl(value: string) { const url = new URL(value); if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Grant link is not safe.'); return url.href; }

export function buildDigestPlan(listId: string, members: readonly DigestMember[], grants: readonly InnovationGrantOpportunity[], window: { sinceInclusive: string; untilExclusive: string; asOf: Date }): DigestPlan {
  if (!/^[a-z0-9]+$/i.test(listId)) throw new Error('Invalid audience.');
  const seen = new Set<string>();
  const groups = new Map<string, { members: string[]; matches: InnovationGrantOpportunity[] }>();
  for (const member of members) {
    if (!/^[a-f0-9]{32}$/.test(member.id) || seen.has(member.id)) throw new Error('Invalid or duplicate member snapshot.');
    seen.add(member.id);
    if (member.status !== 'subscribed' || member.merge_fields.IHEGRANTS !== 'YES') continue;
    const criteria = readStoredGrantCriteria(member.merge_fields);
    if (!criteria) continue; // Invalid hosted edits never broaden matching.
    const subscribedAt = String(member.merge_fields.IHESTART || member.timestamp_opt || member.timestamp_signup || '');
    if (!/^\d{4}-\d\d-\d\dT/.test(subscribedAt) || !Number.isFinite(Date.parse(subscribedAt))) continue;
    const matches = chooseNewMatchingGrants(grants, criteria, { ...window, subscribedAt }).sort((a, b) => a.id - b.id);
    if (!matches.length) continue;
    const matchKey = matches.map(g => g.id).join(',');
    const group = groups.get(matchKey) ?? { members: [], matches };
    group.members.push(member.id); groups.set(matchKey, group);
  }
  const cohorts = [...groups.values()].map(group => {
    const members = group.members.sort();
    const ids = group.matches.map(g => g.id);
    const html = `<h1>New grants matching your interests</h1><p>Your weekly Innovating Higher Ed grant alerts.</p>${group.matches.map(g => `<h2><a href="${esc(safeUrl(g.officialUrl))}">${esc(g.title)}</a></h2><p>${esc(g.whatItFunds)}</p><p>${esc(g.awardAmount)}</p>`).join('')}<p><a href="https://www.innovatinghighered.com/innovation-grants">Explore the Grant Portal</a></p><p><a href="*|UPDATE_PROFILE|*">Update your preferences</a> · <a href="*|UNSUB|*">Unsubscribe</a></p><p>*|LIST:ADDRESS|*</p>`;
    return { key: `ihe-grants-${window.sinceInclusive}-${hash([listId, members, ids]).slice(0, 20)}`, members, grants: ids, html, phase: 'planned' as const };
  }).sort((a, b) => a.key.localeCompare(b.key));
  return { version: 1, listId, sinceInclusive: window.sinceInclusive, untilExclusive: window.untilExclusive, cohorts };
}

export function planFingerprint(plan: DigestPlan) {
  return hash({ ...plan, cohorts: plan.cohorts.map(({ key, members, grants, html }) => ({ key, members, grants, html })) });
}

export async function readDigestMembers(client: MailchimpMarketing): Promise<DigestMember[]> {
  const members = await client.all(`/lists/${client.listId}/members?status=subscribed`, 'members');
  if (members.length > 500) throw new Error('Audience exceeds the reviewed 500-contact limit.');
  return members as DigestMember[];
}

export async function assertAccountContactCapacity(client: MailchimpMarketing) {
  const audiences = await client.all('/lists?fields=lists.id,total_items', 'lists');
  let count = 0;
  for (const audience of audiences) {
    if (typeof audience.id !== 'string' || !/^[a-z0-9]+$/i.test(audience.id)) throw new Error('Invalid account audience identity.');
    const result = await client.request(`/lists/${audience.id}/members?count=1&fields=total_items`);
    if (!Number.isSafeInteger(result.total_items) || (result.total_items as number) < 0) throw new Error('Account contact count is incomplete.');
    count += result.total_items as number;
  }
  // Includes every returned status, so this deliberately over-counts rather than
  // omit unsubscribed/non-subscribed billable contacts or another audience.
  if (count > 500) throw new Error('Account contact capacity exceeds the reviewed tier.');
  return count;
}

export async function reconcileSubmittedDigests(client: MailchimpMarketing, plan: DigestPlan, save: () => Promise<void>): Promise<boolean> {
  if (client.listId !== plan.listId) throw new Error('Audience mismatch.');
  let waiting = false;
  for (const cohort of plan.cohorts.filter(c => c.phase === 'submitting')) {
    if (!cohort.campaignId) throw new Error('Submitted campaign identity is missing.');
    const campaign = await client.request(`/campaigns/${cohort.campaignId}`);
    if (campaign.status === 'sent') {
      cohort.phase = 'sent'; await save();
    } else if (campaign.status === 'sending') {
      waiting = true;
    } else {
      throw new Error('Prior send is uncertain. Reconcile it before retry.');
    }
  }
  return !waiting;
}

export async function prepareDigestCampaigns(client: MailchimpMarketing, plan: DigestPlan, members: readonly DigestMember[], settings: { fromName: string; replyTo: string }, save: () => Promise<void>): Promise<boolean> {
  if (client.listId !== plan.listId) throw new Error('Audience mismatch.');
  // Scheduled runs enter through prepare, including retries after an accepted send.
  // Prove the old result before preparing or submitting any remaining cohort.
  if (!await reconcileSubmittedDigests(client, plan, save)) return false;
  for (const cohort of plan.cohorts) {
    if (cohort.phase === 'sent' || cohort.phase === 'ready') continue;
    if (['creating-segment', 'creating-campaign', 'submitting'].includes(cohort.phase)) throw new Error('An uncertain provider mutation requires manual reconciliation before retry.');
    if (cohort.phase === 'planned') {
      const emails = cohort.members.map(id => {
        const m = members.find(member => member.id === id);
        if (!m || m.status !== 'subscribed' || m.merge_fields.IHEGRANTS !== 'YES') throw new Error('Recipient consent changed; prepare a new reviewed plan.');
        return m.email_address;
      });
      // Persist intent first: a timeout must never create a second segment on retry.
      cohort.phase = 'creating-segment'; await save();
      const segment = await client.request(`/lists/${client.listId}/segments`, 'POST', { name: cohort.key, static_segment: emails });
      if (!Number.isSafeInteger(segment.id)) throw new Error('Segment identity missing.');
      cohort.segmentId = segment.id as number; cohort.phase = 'segment-ready'; await save();
    }
    if (cohort.phase === 'segment-ready') {
      cohort.phase = 'creating-campaign'; await save();
      const campaign = await client.request('/campaigns', 'POST', { type: 'regular', recipients: { list_id: client.listId, segment_opts: { saved_segment_id: cohort.segmentId } }, settings: { title: cohort.key, subject_line: 'New grants matching your interests', from_name: settings.fromName, reply_to: settings.replyTo } });
      if (typeof campaign.id !== 'string' || !/^[a-z0-9]+$/i.test(campaign.id)) throw new Error('Campaign identity missing.');
      cohort.campaignId = campaign.id; cohort.phase = 'campaign-ready'; await save();
    }
    if (cohort.phase === 'campaign-ready') {
      await client.request(`/campaigns/${cohort.campaignId}/content`, 'PUT', { html: cohort.html });
      cohort.phase = 'ready'; await save();
    }
  }
  return true;
}

export async function sendDigestCampaigns(client: MailchimpMarketing, plan: DigestPlan, options: { approvedFingerprint: string; verifiedRemainingSends: number; budgetVerifiedAt: string; now: Date; clock?: () => Date }, revalidate: () => Promise<DigestPlan>, save: () => Promise<void>) {
  if (client.listId !== plan.listId || options.approvedFingerprint !== planFingerprint(plan)) throw new Error('Exact plan approval is required.');
  const checkBudgetAge = () => {
    const age = (options.clock?.() ?? new Date()).getTime() - Date.parse(options.budgetVerifiedAt);
    if (!Number.isFinite(age) || age < 0 || age > 15 * 60_000) throw new Error('Fresh account-wide budget is required.');
  };
  checkBudgetAge();
  if (!Number.isSafeInteger(options.verifiedRemainingSends) || options.verifiedRemainingSends < 0 || options.verifiedRemainingSends > 5000) throw new Error('Verified account-wide send capacity is required.');
  // A send can be accepted while its response is lost. Reconcile; never blindly repeat it.
  if (!await reconcileSubmittedDigests(client, plan, save)) return;
  let remaining = options.verifiedRemainingSends;
  for (const cohort of plan.cohorts) {
    if (cohort.phase === 'sent') continue;
    if (cohort.phase !== 'ready' || !cohort.campaignId || !cohort.segmentId) throw new Error('Campaign is not prepared.');
    checkBudgetAge();
    await assertAccountContactCapacity(client);
    if (planFingerprint(await revalidate()) !== planFingerprint(plan)) throw new Error('Recipient consent or grant content changed; a new review is required.');
    const campaigns = await client.all('/campaigns', 'campaigns');
    if (campaigns.some(c => ['sending', 'schedule', 'paused'].includes(String(c.status)))) throw new Error('Another pending send must finish or be reconciled first.');
    const cutoff = options.now.getTime() - 31 * 86400_000;
    let sent = 0;
    for (const campaign of campaigns) {
      if (campaign.status !== 'sent') continue;
      if (!Number.isFinite(Date.parse(String(campaign.send_time)))) throw new Error('Account send usage is incomplete.');
      if (Date.parse(String(campaign.send_time)) >= cutoff) {
        if (!Number.isSafeInteger(campaign.emails_sent) || (campaign.emails_sent as number) < 0) throw new Error('Account send usage is incomplete.');
        sent += campaign.emails_sent as number;
      }
    }
    if (cohort.members.length > remaining || sent + cohort.members.length > 5000) throw new Error('Account-wide send budget would be exceeded.');
    const campaign = await client.request(`/campaigns/${cohort.campaignId}`);
    const recipients = campaign.recipients as { list_id?: string; recipient_count?: number; segment_opts?: { saved_segment_id?: number } } | undefined;
    if (campaign.status !== 'save' || recipients?.list_id !== client.listId || recipients?.segment_opts?.saved_segment_id !== cohort.segmentId || recipients?.recipient_count !== cohort.members.length) throw new Error('Campaign recipients or state changed.');
    const segmentMembers = await client.all(`/lists/${client.listId}/segments/${cohort.segmentId}/members`, 'members');
    if (JSON.stringify(segmentMembers.map(m => m.id).sort()) !== JSON.stringify(cohort.members)) throw new Error('Exact segment membership mismatch.');
    const content = await client.request(`/campaigns/${cohort.campaignId}/content`);
    if (content.html !== cohort.html) throw new Error('Campaign content differs from approval.');
    const checklist = await client.request(`/campaigns/${cohort.campaignId}/send-checklist`);
    if (checklist.is_ready !== true) throw new Error('Mailchimp send checklist is not ready.');
    checkBudgetAge();
    cohort.phase = 'submitting'; await save();
    await client.request(`/campaigns/${cohort.campaignId}/actions/send`, 'POST');
    remaining -= cohort.members.length;
    // Leave submitting until the provider proves sent. One submission per attempt
    // lets a later scheduled attempt reconcile asynchronous delivery before continuing.
    return;
  }
}

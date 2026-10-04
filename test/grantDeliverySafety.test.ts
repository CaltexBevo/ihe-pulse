import type { InnovationGrantOpportunity } from "../lib/innovation-grants-shared.ts";
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, chmod, writeFile, readFile, stat, symlink, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { ensurePrivateJournalDirectory, readPrivateJournal, savePrivateJournal } from '../lib/server/grantDigestJournal.ts';
import { grantCycleFingerprint, grantsWithPublicationReceipts, type GrantPublicationLedger } from '../lib/server/grantPublicationLedger.ts';
import { getPublicInnovationGrants } from '../lib/data/innovation-grants-public.ts';
import { drainScheduledDigest, initializeDigestBaseline, runScheduledDigest, runWeeklyDigest } from '../scripts/weekly-grant-digest.ts';
import { observePublicGrants } from '../lib/server/grantPublicationLedger.ts';
import { publicGrantSnapshot, readLivePublicGrants, PUBLIC_GRANT_FEED } from '../lib/server/publicGrantSnapshot.ts';
import { buildDigestPlan, type DigestMember } from '../lib/server/grantDigest.ts';

test('private journal enforces permissions and refuses symlinks and stale pending files', async () => {
  const directory = await mkdtemp(resolve('.grant-journal-test-'));
  try {
    await chmod(directory, 0o700);
    await ensurePrivateJournalDirectory(directory);
    const path = join(directory, 'week.json');
    await savePrivateJournal(directory, path, { phase: 'submitting' });
    assert.equal((await stat(path)).mode & 0o777, 0o600);
    assert.equal(JSON.parse(await readPrivateJournal(path)).phase, 'submitting');
    await chmod(path, 0o644);
    await assert.rejects(readPrivateJournal(path), /0600/);
    await symlink(path, join(directory, 'link.json'));
    await assert.rejects(readPrivateJournal(join(directory, 'link.json')));
    await writeFile(`${path}.pending`, 'preserve');
    await assert.rejects(savePrivateJournal(directory, path, { phase: 'sent' }));
    assert.equal(await readFile(`${path}.pending`, 'utf8'), 'preserve');
    await chmod(directory, 0o755);
    await assert.rejects(ensurePrivateJournalDirectory(directory), /0700/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('first active publication uses an explicit call-bound receipt, never ordinary inventory addition', () => {
  const grant = getPublicInnovationGrants()[0];
  const ledger: GrantPublicationLedger = { version: 1, cycles: [{ grantId: grant.id, cycleKey: 'fixture-cycle', firstObservedActiveDate: '2026-09-28', sourceFingerprint: grantCycleFingerprint(grant), releaseEvidence: 'offline fixture receipt' }] };
  assert.equal(grantsWithPublicationReceipts([grant], ledger)[0].portalAddedDate, '2026-09-28');
  assert.deepEqual(grantsWithPublicationReceipts([grant], { version: 1, cycles: [] }), []);
  assert.throws(() => grantsWithPublicationReceipts([{ ...grant, officialUrl: `${grant.officialUrl}/new-call` }], ledger), /identity changed/);
  assert.throws(() => grantsWithPublicationReceipts([grant], { ...ledger, cycles: [...ledger.cycles, ...ledger.cycles] }), /ambiguous/);
  assert.throws(() => grantsWithPublicationReceipts([grant], { ...ledger, cycles: [{ ...ledger.cycles[0], firstObservedActiveDate: '2026-02-30' }] }), /Invalid/);
});

test('scheduled activation is disabled by default and hosted-profile proof is mandatory', async () => {
  assert.deepEqual(await runScheduledDigest('scripts/grant-digest-activation.example.json'), { mode: 'scheduled-disabled', recipients: 0 });
  const directory = await mkdtemp(resolve('.grant-activation-test-'));
  try {
    const path = join(directory, 'activation.json');
    await writeFile(path, JSON.stringify({ enabled: true, hostedProfileEditingVerified: false }));
    await assert.rejects(runScheduledDigest(path), /activation is incomplete/);
    const members = join(directory, 'members.json');
    await writeFile(members, '[]');
    const result = await runWeeklyDigest(['--since', '2026-09-21', '--until', '2026-09-28', '--canonical', '--members', members]);
    assert.equal(result.mode, 'dry-run'); assert.equal(result.recipients, 0);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('weekly observations baseline silently, detect new active calls, and never retrigger edits or reopens', () => {
  const grant = { ...getPublicInnovationGrants()[0], applicationStatus: 'open-now' as const, finalDeadlineDate: undefined, priorityDeadlineDate: undefined, openDate: undefined };
  const watchlist = { ...grant, id: 99991, applicationStatus: 'recurring-watchlist' as const };
  const observe = (grants: InnovationGrantOpportunity[], prior: GrantPublicationLedger | null, day: string) => observePublicGrants(grants, prior, { snapshotSha256: publicGrantSnapshot(grants, day).sha256, releaseReference: 'fixture-public-release', now: new Date(`${day}T16:00:00Z`) });
  const baseline = observe([grant, watchlist], null, '2026-09-21');
  assert.equal(baseline.cycles.length, 0);
  const activated = { ...watchlist, applicationStatus: 'open-now' as const };
  const next = observe([grant, activated], baseline, '2026-09-28');
  assert.equal(next.cycles.length, 1);
  assert.equal(next.cycles[0].firstObservedActiveDate, '2026-09-28');
  assert.equal(observe([grant, { ...activated, title: 'Edited public title' }], next, '2026-09-28').cycles.length, 1);
  const closed = observe([grant, watchlist], next, '2026-10-05');
  assert.equal(observe([grant, activated], closed, '2026-10-12').cycles.length, 1);
});

test('Tuesday signup receives a genuinely new Thursday grant on Monday; uncertain watchlist activation retains cutoff', () => {
  const grant = { ...getPublicInnovationGrants().find(grant => grant.locationEligibility?.scope === 'nationwide')!, applicationStatus: 'open-now' as const, finalDeadlineDate: undefined, priorityDeadlineDate: undefined, openDate: undefined };
  const watchlist = { ...grant, id: 99991, applicationStatus: 'recurring-watchlist' as const, portalAddedDate: '2026-09-28' };
  const observe = (grants: InnovationGrantOpportunity[], previous: GrantPublicationLedger | null, day: string) => observePublicGrants(grants, previous, { snapshotSha256: publicGrantSnapshot(grants, day).sha256, releaseReference: 'fixture-public-release', now: new Date(`${day}T16:00:00Z`) });
  const baseline = observe([grant, watchlist], null, '2026-09-28');
  const added = { ...grant, id: 99992, portalAddedDate: '2026-10-01' };
  const activated = { ...watchlist, applicationStatus: 'open-now' as const, portalAddedDate: '2026-10-01' };
  const current = [grant, activated, added];
  const observed = observe(current, baseline, '2026-10-05');
  assert.equal(observed.cycles.find(cycle => cycle.grantId === added.id)?.newPublicAdditionDate, '2026-10-01');
  assert.equal(observed.cycles.find(cycle => cycle.grantId === activated.id)?.newPublicAdditionDate, undefined);
  const member: DigestMember = { id: 'a'.repeat(32), email_address: 'fixture@example.edu', status: 'subscribed', merge_fields: { IHEPULSE: 'NO', IHEGRANTS: 'YES', IHEAUD: '', IHELOC: '', IHEAREA: '', IHEMIN: '', IHESTART: '2026-09-29T16:00:00Z' } };
  const matches = (timestamp: string) => buildDigestPlan('fixture', [{ ...member, merge_fields: { ...member.merge_fields, IHESTART: timestamp } }], grantsWithPublicationReceipts(current, observed), { sinceInclusive: '2026-10-05', untilExclusive: '2026-10-12', asOf: new Date('2026-10-05T16:00:00Z') }).cohorts.flatMap(cohort => cohort.grants);
  assert.deepEqual(matches('2026-09-29T16:00:00Z'), [added.id]);
  assert.deepEqual(matches('2026-10-01T16:00:00Z'), []); // Same Pacific addition day.
  assert.deepEqual(matches('2026-10-02T16:00:00Z'), []);
  assert.deepEqual(matches('2026-09-27T16:00:00Z'), [activated.id, added.id]);
  assert.equal(observed.cycles.every(cycle => cycle.firstObservedActiveDate === '2026-10-05'), true);
});

test('unsupported midweek observation leaves no lost receipt; next Monday observes and delivers without another weekly delay', () => {
  const grant = { ...getPublicInnovationGrants().find(grant => grant.locationEligibility?.scope === 'nationwide')!, applicationStatus: 'open-now' as const, finalDeadlineDate: undefined, priorityDeadlineDate: undefined, openDate: undefined };
  const observe = (grants: InnovationGrantOpportunity[], previous: GrantPublicationLedger | null, day: string) => observePublicGrants(grants, previous, { snapshotSha256: publicGrantSnapshot(grants, day).sha256, releaseReference: 'fixture-public-release', now: new Date(`${day}T16:00:00Z`) });
  const baseline = observe([grant], null, '2026-09-28');
  const before = structuredClone(baseline);
  const added = { ...grant, id: 99993, portalAddedDate: '2026-09-29' };
  assert.throws(() => observe([grant, added], baseline, '2026-09-29'), /Monday-only/);
  assert.deepEqual(baseline, before);
  const observed = observe([grant, added], baseline, '2026-10-05');
  const member: DigestMember = { id: 'b'.repeat(32), email_address: 'fixture@example.edu', status: 'subscribed', merge_fields: { IHEGRANTS: 'YES', IHEAUD: '', IHELOC: '', IHEAREA: '', IHEMIN: '', IHESTART: '2026-09-27T16:00:00Z' } };
  const matches = buildDigestPlan('fixture', [member], grantsWithPublicationReceipts([grant, added], observed), { sinceInclusive: '2026-10-05', untilExclusive: '2026-10-12', asOf: new Date('2026-10-05T16:00:00Z') });
  assert.deepEqual(matches.cohorts.flatMap(cohort => cohort.grants), [added.id]);
  assert.equal(observed.cycles[0].firstObservedActiveDate, '2026-10-05');
});

test('one-time Tuesday launch baseline preserves Thursday additions for later Tuesday signups and refuses reinitialization', async () => {
  const directory = await mkdtemp(resolve('.grant-launch-baseline-test-'));
  try {
    await chmod(directory, 0o700);
    const grant = { ...getPublicInnovationGrants().find(grant => grant.locationEligibility?.scope === 'nationwide')!, applicationStatus: 'open-now' as const, finalDeadlineDate: undefined, priorityDeadlineDate: undefined, openDate: undefined };
    const snapshot = publicGrantSnapshot([grant], new Date().toISOString().slice(0, 10));
    let feedReads = 0;
    const readSnapshot = () => readLivePublicGrants((async url => {
      assert.equal(url, PUBLIC_GRANT_FEED); // No contact/campaign/provider request.
      feedReads++;
      return Response.json(snapshot);
    }) as typeof fetch);
    const launchedAt = new Date('2026-09-29T16:00:00Z');
    assert.deepEqual(await initializeDigestBaseline(directory, readSnapshot, () => launchedAt), {
      mode: 'initialized-silent-baseline', initializedAt: launchedAt.toISOString(), recipients: 0, cycles: 0,
    });
    const path = join(directory, 'publication-ledger.json');
    const originalBytes = await readPrivateJournal(path);
    const baseline = JSON.parse(originalBytes) as GrantPublicationLedger;
    assert.deepEqual(baseline.cycles, []);
    assert.equal(baseline.observation?.lastObservedAt, launchedAt.toISOString());
    await assert.rejects(initializeDigestBaseline(directory, readSnapshot, () => new Date('2026-09-30T16:00:00Z')), /already exists/);
    assert.equal(feedReads, 1);
    assert.equal(await readPrivateJournal(path), originalBytes);
    const added = { ...grant, id: 99994, portalAddedDate: '2026-10-01' };
    const current = [grant, added];
    const evidence = { snapshotSha256: publicGrantSnapshot(current, '2026-10-05').sha256, releaseReference: 'fixture-live-feed', now: new Date('2026-09-30T16:00:00Z') };
    assert.throws(() => observePublicGrants(current, baseline, evidence), /Monday-only/);
    const observed = observePublicGrants(current, baseline, { ...evidence, now: new Date('2026-10-05T16:00:00Z') });
    const member: DigestMember = { id: 'c'.repeat(32), email_address: 'fixture@example.edu', status: 'subscribed', merge_fields: { IHEGRANTS: 'YES', IHEAUD: '', IHELOC: '', IHEAREA: '', IHEMIN: '', IHESTART: '2026-09-29T18:00:00Z' } };
    const plan = buildDigestPlan('fixture', [member], grantsWithPublicationReceipts(current, observed), { sinceInclusive: '2026-10-05', untilExclusive: '2026-10-12', asOf: new Date('2026-10-05T16:00:00Z') });
    assert.deepEqual(plan.cohorts.flatMap(cohort => cohort.grants), [added.id]);
    assert.equal(observed.cycles.some(cycle => cycle.grantId === grant.id), false);
    assert.equal(observed.observation?.initializedAt, launchedAt.toISOString());
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('live inventory reads only canonical HTTPS public feed and rejects stale or corrupted snapshots', async () => {
  const snapshot = publicGrantSnapshot(getPublicInnovationGrants(), new Date().toISOString().slice(0, 10));
  const result = await readLivePublicGrants((async (url, options) => {
    assert.equal(url, PUBLIC_GRANT_FEED); assert.equal(options?.redirect, 'error'); assert.equal(options?.cache, 'no-store');
    return Response.json(snapshot);
  }) as typeof fetch);
  assert.equal(result.sha256, snapshot.sha256);
  await assert.rejects(readLivePublicGrants((async () => Response.json({ ...snapshot, sha256: 'bad' })) as typeof fetch), /Invalid/);
  await assert.rejects(readLivePublicGrants((async () => Response.json({ ...snapshot, verifiedOn: '2000-01-01' })) as typeof fetch), /stale/);
});

test('weekly drain reconciles pending cohorts, terminates on completion and stops immediately on uncertainty', async () => {
  let attempts = 0;
  const result = await drainScheduledDigest('fixture', async () => ({ mode: ++attempts < 3 ? 'waiting-for-provider' : 'delivery-complete' }), async () => {});
  assert.equal(attempts, 3); assert.equal(result.mode, 'delivery-complete');
  await assert.rejects(drainScheduledDigest('fixture', async () => { throw new Error('uncertain mutation'); }, async () => {}), /uncertain/);
});

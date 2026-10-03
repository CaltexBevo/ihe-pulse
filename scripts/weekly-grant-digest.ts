import { PUBLIC_GRANT_FEED, readLivePublicGrants } from "../lib/server/publicGrantSnapshot.ts";
import { ensurePrivateJournalDirectory, readPrivateJournal, savePrivateJournal } from "../lib/server/grantDigestJournal.ts";
import { initializePublicGrantBaseline, isWeeklyObservationDay, observePublicGrants, grantsWithPublicationReceipts, type GrantPublicationLedger } from "../lib/server/grantPublicationLedger.ts";
import { mkdir, readFile, rmdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { assertAccountContactCapacity, buildDigestPlan, planFingerprint, prepareDigestCampaigns, readDigestMembers, sendDigestCampaigns, type DigestMember, type DigestPlan } from '../lib/server/grantDigest.ts';
import { MailchimpMarketing } from '../lib/server/mailchimpMarketing.ts';
import type { InnovationGrantOpportunity } from '../lib/innovation-grants-shared.ts';
import { getPublicInnovationGrants } from '../lib/data/innovation-grants-public.ts';
import { getInnovationGrantPacificCalendarDate } from '../lib/innovation-grants-shared.ts';

export async function runWeeklyDigest(args: string[]): Promise<Record<string, string | number>> {
  if (args[0] === '--initialize-baseline' && args.length === 2) return initializeDigestBaseline(args[1]);
  if (args[0] === '--scheduled-drain' && args.length === 2) return drainScheduledDigest(args[1]);
  if (args[0] === '--scheduled' && args.length === 2) return runScheduledDigest(args[1]);
  const allowed = new Set(['--since', '--until', '--members', '--grants', '--canonical', '--journal', '--live-read', '--prepare', '--send', '--approved', '--remaining-sends', '--budget-verified-at', '--publication-ledger']);
  const values: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    if (!allowed.has(key) || key in values) throw new Error('Unknown or duplicate argument.');
    if (['--live-read', '--prepare', '--send', '--canonical'].includes(key)) values[key] = 'true';
    else { if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error('Missing argument.'); values[key] = args[++i]; }
  }
  const since = values['--since'], until = values['--until'];
  if (![since, until].every(d => /^\d{4}-\d\d-\d\d$/.test(d || '') && new Date(`${d}T00:00:00Z`).toISOString().slice(0, 10) === d) || Date.parse(until) - Date.parse(since) !== 7 * 86400_000) throw new Error('An exact seven-day window is required.');
  if (new Date(`${since}T00:00:00Z`).getUTCDay() !== 1) throw new Error('Digest windows must start Monday to prevent overlapping weekly sends.');
  if (values['--send'] && values['--prepare']) throw new Error('Prepare and send are separate reviewed operations.');
  if (Boolean(values['--grants']) === Boolean(values['--canonical'])) throw new Error('Choose a public snapshot JSON or the canonical projection.');
  let grants = values['--canonical'] ? getPublicInnovationGrants() : JSON.parse(await readFile(values['--grants'], 'utf8')) as InnovationGrantOpportunity[];
  if (!Array.isArray(grants)) throw new Error('Invalid grant snapshot.');
  const live = Boolean(values['--live-read']);
  if (live) {
    if (!values['--canonical']) throw new Error('Live delivery reads only the current public feed.');
    grants = (await readLivePublicGrants()).grants;
  }
  if ((values['--prepare'] || values['--send']) && !live) throw new Error('Mutations require explicit live-read mode and a fresh consent snapshot.');
  if ((values['--prepare'] || values['--send']) && since > getInnovationGrantPacificCalendarDate()) throw new Error('Future weekly windows cannot be prepared or sent.');
  if (live && process.env.MAILCHIMP_PREFERENCES_SCHEMA !== 'v1') throw new Error('Preference schema rollout is not enabled.');
  if (live && values['--members']) throw new Error('Live mode cannot use fixture members.');
  const client = live ? new MailchimpMarketing(process.env) : undefined;
  if (!client && !values['--members']) throw new Error('Dry-run requires --members fixture, or explicitly choose --live-read.');
  const members = client ? await readDigestMembers(client) : JSON.parse(await readFile(values['--members'], 'utf8')) as DigestMember[];
  if (live && !values['--publication-ledger']) throw new Error('Live delivery requires verified first-public-active cycle receipts.');
  const matchingGrants = values['--publication-ledger'] ? grantsWithPublicationReceipts(grants, JSON.parse(await readPrivateJournal(values['--publication-ledger'])) as GrantPublicationLedger) : grants;
  const now = new Date();
  const window = { sinceInclusive: since, untilExclusive: until, asOf: now };
  const plan = buildDigestPlan(client?.listId ?? 'fixture', members, matchingGrants, window);
  const summary = { mode: 'dry-run', fingerprint: planFingerprint(plan), cohorts: plan.cohorts.length, recipients: plan.cohorts.reduce((n, c) => n + c.members.length, 0), matches: [...new Set(plan.cohorts.flatMap(c => c.grants))].length };
  if (!values['--prepare'] && !values['--send']) return summary;
  if (!values['--journal']) throw new Error('A private durable journal directory is required.');
  const directory = resolve(values['--journal']);
  await ensurePrivateJournalDirectory(directory);
  const lock = join(directory, '.lock');
  await mkdir(lock, { mode: 0o700 }); // Atomic exclusion. Stale locks require investigation, never auto-clear.
  try {
    const path = join(directory, `${client!.listId}-${since}.json`);
    let stored: DigestPlan;
    try { stored = JSON.parse(await readPrivateJournal(path)) as DigestPlan; }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT' || values['--send']) throw error; stored = plan; }
    if (planFingerprint(stored) !== planFingerprint(plan)) throw new Error('This week already has a different journal. Reconcile it; never overwrite and resend.');
    const save = () => savePrivateJournal(directory, path, stored);
    await save();
    if (values['--prepare']) {
      const replyTo = process.env.MAILCHIMP_REPLY_TO;
      if (!replyTo || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replyTo)) throw new Error('The existing verified sender reply-to is required.');
      const ready = await prepareDigestCampaigns(client!, stored, members, { fromName: 'Innovating Higher Ed', replyTo }, save);
      if (!ready) return { ...summary, mode: 'waiting-for-provider' };
    } else {
      await sendDigestCampaigns(client!, stored, { approvedFingerprint: values['--approved'], verifiedRemainingSends: Number(values['--remaining-sends']), budgetVerifiedAt: values['--budget-verified-at'], now },
        async () => {
          const fresh = await readLivePublicGrants();
          if (JSON.stringify(fresh.grants) !== JSON.stringify(grants)) throw new Error('Public inventory changed during preparation; reconcile before sending.');
          return buildDigestPlan(client!.listId, await readDigestMembers(client!), matchingGrants, { ...window, asOf: new Date() });
        }, save);
    }
    return { ...summary, mode: values['--send'] ? (stored.cohorts.every(cohort => cohort.phase === 'sent') ? 'delivery-complete' : 'send-submitted-check-provider-status') : 'prepared-not-sent' };
  } finally { await rmdir(lock); }
}

export async function initializeDigestBaseline(journalDirectory: string, readSnapshot = readLivePublicGrants, clock = () => new Date()): Promise<Record<string, string | number>> {
  if (!journalDirectory || !journalDirectory.startsWith('/')) throw new Error('Baseline initialization requires an absolute private journal directory.');
  const directory = resolve(journalDirectory);
  await ensurePrivateJournalDirectory(directory);
  const lock = join(directory, '.lock');
  await mkdir(lock, { mode: 0o700 });
  try {
    const path = join(directory, 'publication-ledger.json');
    try {
      await readPrivateJournal(path);
      throw new Error('Publication baseline already exists; initialization never overwrites it.');
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
    // This path reads only the fixed public feed. No Mailchimp client is created,
    // credentials are unnecessary, and no contacts or campaigns are requested.
    const snapshot = await readSnapshot();
    const ledger = initializePublicGrantBaseline(snapshot.grants, { releaseReference: `${PUBLIC_GRANT_FEED}#${snapshot.sha256}`, snapshotSha256: snapshot.sha256, now: clock() });
    await savePrivateJournal(directory, path, ledger);
    return { mode: 'initialized-silent-baseline', initializedAt: ledger.observation!.initializedAt, recipients: 0, cycles: 0 };
  } finally { await rmdir(lock); }
}

// A single weekly host invocation can finish asynchronous exact cohorts. Bound
// both duration and retry count; uncertain mutations throw and stop immediately.
export async function drainScheduledDigest(configPath: string, run = runScheduledDigest, pause = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))) {
  const started = Date.now();
  for (let attempt = 0; attempt < 600 && Date.now() - started < 6 * 60 * 60_000; attempt++) {
    const result = await run(configPath);
    if (!['waiting-for-provider', 'send-submitted-check-provider-status'].includes(String(result.mode))) return result;
    await pause(30_000);
  }
  throw new Error('Weekly delivery did not complete within the bounded drain. Preserve the journal and reconcile provider state.');
}

export async function runScheduledDigest(configPath: string): Promise<Record<string, string | number>> {
  const config = JSON.parse(await readFile(configPath, 'utf8')) as Record<string, unknown>;
  if (config.enabled !== true) return { mode: 'scheduled-disabled', recipients: 0 };
  if (config.scope !== 'weekly-new-public-matching-grants-v1' || typeof config.approvalReference !== 'string' || !config.approvalReference.trim() || typeof config.journalDirectory !== 'string' || !config.journalDirectory.startsWith('/') || config.audienceId !== process.env.MAILCHIMP_AUDIENCE_ID || config.maximum31DaySends !== 4000 || config.reserveSends !== 1000 || config.hostedProfileEditingVerified !== true || typeof config.profileVerificationReference !== 'string' || !config.profileVerificationReference.trim()) throw new Error('Scheduled scope activation is incomplete.');
  if (!isWeeklyObservationDay(new Date())) throw new Error('Scheduled delivery is Monday-only in Pacific time; preserve any unfinished journal for reconciliation.');
  const directory = resolve(config.journalDirectory as string);
  await ensurePrivateJournalDirectory(directory);
  const ledgerPath = join(directory, 'publication-ledger.json');
  const observationLock = join(directory, '.lock');
  await mkdir(observationLock, { mode: 0o700 });
  try {
    let previous: GrantPublicationLedger;
    try { previous = JSON.parse(await readPrivateJournal(ledgerPath)); }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw new Error('Initialize the silent launch baseline before admitting signups; scheduled runs never initialize it.');
      throw error;
    }
    const snapshot = await readLivePublicGrants();
    const ledger = observePublicGrants(snapshot.grants, previous, { releaseReference: `${PUBLIC_GRANT_FEED}#${snapshot.sha256}`, snapshotSha256: snapshot.sha256, now: new Date() });
    await savePrivateJournal(directory, ledgerPath, ledger);
  } finally { await rmdir(observationLock); }
  const day = new Date(`${getInnovationGrantPacificCalendarDate()}T00:00:00Z`);
  const daysSinceMonday = (day.getUTCDay() + 6) % 7;
  day.setUTCDate(day.getUTCDate() - daysSinceMonday);
  const since = day.toISOString().slice(0, 10);
  day.setUTCDate(day.getUTCDate() + 7);
  const until = day.toISOString().slice(0, 10);
  const common = ['--since', since, '--until', until, '--canonical', '--live-read', '--journal', config.journalDirectory, '--publication-ledger', ledgerPath];
  const prepared = await runWeeklyDigest([...common, '--prepare']);
  if (prepared.mode === 'waiting-for-provider') return prepared;
  if (config.sendEnabled !== true || !('fingerprint' in prepared)) return prepared;
  const client = new MailchimpMarketing(process.env);
  await assertAccountContactCapacity(client);
  const campaigns = await client.all('/campaigns', 'campaigns');
  const now = new Date();
  const cutoff = now.getTime() - 31 * 86400_000;
  let recentSent = 0;
  for (const campaign of campaigns) {
    if (['sending', 'schedule', 'paused'].includes(String(campaign.status))) throw new Error('Another send is pending.');
    if (campaign.status !== 'sent') continue;
    if (!Number.isFinite(Date.parse(String(campaign.send_time))) || !Number.isSafeInteger(campaign.emails_sent) || (campaign.emails_sent as number) < 0) throw new Error('Campaign usage is incomplete.');
    if (Date.parse(String(campaign.send_time)) >= cutoff) recentSent += campaign.emails_sent as number;
  }
  // This is a conservative usage allowance, not a claim to read Mailchimp's billing meter.
  const allowance = Math.max(0, 4000 - recentSent);
  return runWeeklyDigest([...common, '--send', '--approved', String(prepared.fingerprint), '--remaining-sends', String(allowance), '--budget-verified-at', now.toISOString()]);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runWeeklyDigest(process.argv.slice(2)).then(result => console.log(JSON.stringify(result))).catch(() => {
    console.error('Grant digest stopped safely. Review configuration, approval, private journal, consent, and provider status; no contact details are logged.'); process.exitCode = 1;
  });
}

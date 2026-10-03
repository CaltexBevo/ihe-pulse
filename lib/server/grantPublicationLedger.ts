import 'server-only';
import { createHash } from 'node:crypto';
import type { InnovationGrantOpportunity } from '../innovation-grants-shared.ts';
import { getInnovationGrantLifecycle, getInnovationGrantPacificAsOfDate, getInnovationGrantPacificCalendarDate } from '../innovation-grants-shared.ts';

export type GrantPublicationLedger = {
  version: 1;
  cycles: { grantId: number; cycleKey: string; firstObservedActiveDate: string; sourceFingerprint: string; releaseEvidence: string; eligibleSubscribersBefore?: string; newPublicAdditionDate?: string }[];
  observation?: { initializedAt: string; lastObservedAt: string; snapshotSha256: string; releaseEvidence: string; everActiveIds: number[]; everPublicIds: number[] };
};

function validDateOnly(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}

export function isWeeklyObservationDay(now: Date): boolean {
  return Number.isFinite(now.getTime()) && new Date(`${getInnovationGrantPacificCalendarDate(now)}T00:00:00Z`).getUTCDay() === 1;
}

// Bind the receipt to the particular call. Verification-date/copy edits do not
// create a new cycle; changed official call identity must be reconciled explicitly.
export function grantCycleFingerprint(grant: InnovationGrantOpportunity): string {
  return createHash('sha256').update(JSON.stringify([grant.id, grant.officialUrl])).digest('hex');
}

/** One-time launch baseline, using the real observation time on any day. It
 * creates no alert receipts and is persisted only by the exclusive initializer. */
export function initializePublicGrantBaseline(grants: readonly InnovationGrantOpportunity[], evidence: { releaseReference: string; snapshotSha256: string; now: Date }): GrantPublicationLedger {
  const digest = createHash('sha256').update(JSON.stringify(grants)).digest('hex');
  if (digest !== evidence.snapshotSha256 || !evidence.releaseReference.trim() || !Number.isFinite(evidence.now.getTime())) throw new Error('Exact verified public snapshot evidence is required.');
  const activeIds = grants.filter(grant => ['open-now', 'closing-soon'].includes(getInnovationGrantLifecycle(grant, getInnovationGrantPacificAsOfDate(evidence.now)))).map(grant => grant.id);
  return { version: 1, cycles: [], observation: {
    initializedAt: evidence.now.toISOString(), lastObservedAt: evidence.now.toISOString(), snapshotSha256: digest, releaseEvidence: evidence.releaseReference,
    everActiveIds: activeIds.sort((a, b) => a - b), everPublicIds: grants.map(grant => grant.id).sort((a, b) => a - b),
  } };
}

/** First observation establishes a silent baseline. Later observed first active
 * states gain the actual observation date, never an inferred historical date. */
export function observePublicGrants(grants: readonly InnovationGrantOpportunity[], previous: GrantPublicationLedger | null, evidence: { releaseReference: string; snapshotSha256: string; now: Date }): GrantPublicationLedger {
  // Only the weekly runner observes. A midweek observation would fall outside
  // the following Monday's delivery bucket, so reject it before changing state.
  if (!isWeeklyObservationDay(evidence.now)) throw new Error('Public grant observation is Monday-only in Pacific time.');
  const digest = createHash('sha256').update(JSON.stringify(grants)).digest('hex');
  if (digest !== evidence.snapshotSha256 || !evidence.releaseReference.trim() || !Number.isFinite(evidence.now.getTime())) throw new Error('Exact verified public snapshot evidence is required.');
  const active = grants.filter(grant => ['open-now', 'closing-soon'].includes(getInnovationGrantLifecycle(grant, getInnovationGrantPacificAsOfDate(evidence.now))));
  if (previous && (!previous.observation || !Array.isArray(previous.observation.everPublicIds) || evidence.now.toISOString() < previous.observation.lastObservedAt)) throw new Error('Observation history is missing or clock moved backwards.');
  if (previous) grantsWithPublicationReceipts(grants, previous);
  const seen = new Set(previous?.observation?.everActiveIds ?? active.map(grant => grant.id));
  const publicIds = new Set(previous?.observation?.everPublicIds ?? grants.map(grant => grant.id));
  const observationDay = getInnovationGrantPacificCalendarDate(evidence.now);
  const cycles = [...(previous?.cycles ?? [])];
  for (const grant of active) {
    if (seen.has(grant.id)) continue;
    const previousDay = getInnovationGrantPacificCalendarDate(new Date(previous!.observation!.lastObservedAt));
    // A genuinely new public ID with an addition date inside the observed
    // interval establishes signup ordering. Previously public watchlist calls
    // still have an uncertain active date and retain the conservative cutoff.
    const additionKnown = !publicIds.has(grant.id) && validDateOnly(grant.portalAddedDate) && grant.portalAddedDate > previousDay && grant.portalAddedDate <= observationDay;
    cycles.push({ grantId: grant.id, cycleKey: `grant-${grant.id}`, firstObservedActiveDate: observationDay, sourceFingerprint: grantCycleFingerprint(grant), releaseEvidence: evidence.releaseReference,
      ...(additionKnown ? { newPublicAdditionDate: grant.portalAddedDate } : { eligibleSubscribersBefore: previous!.observation!.lastObservedAt }) });
    seen.add(grant.id);
  }
  for (const grant of grants) publicIds.add(grant.id);
  return { version: 1, cycles, observation: { initializedAt: previous?.observation?.initializedAt ?? evidence.now.toISOString(), lastObservedAt: evidence.now.toISOString(), snapshotSha256: digest, releaseEvidence: evidence.releaseReference, everActiveIds: [...seen].sort((a, b) => a - b), everPublicIds: [...publicIds].sort((a, b) => a - b) } };
}

export function grantsWithPublicationReceipts(grants: readonly InnovationGrantOpportunity[], ledger: GrantPublicationLedger): InnovationGrantOpportunity[] {
  if (ledger?.version !== 1 || !Array.isArray(ledger.cycles)) throw new Error('A verified publication ledger is required.');
  const ids = new Set<number>();
  const keys = new Set<string>();
  for (const cycle of ledger.cycles) {
    const day = cycle.firstObservedActiveDate;
    if (!Number.isSafeInteger(cycle.grantId) || cycle.grantId < 1 || ids.has(cycle.grantId) ||
        typeof cycle.cycleKey !== 'string' || !/^[a-zA-Z0-9_-]{1,120}$/.test(cycle.cycleKey) || keys.has(cycle.cycleKey) ||
        !validDateOnly(day) || (cycle.newPublicAdditionDate !== undefined && (!validDateOnly(cycle.newPublicAdditionDate) || cycle.newPublicAdditionDate > day || cycle.eligibleSubscribersBefore !== undefined)) ||
        !/^[a-f0-9]{64}$/.test(cycle.sourceFingerprint) || typeof cycle.releaseEvidence !== 'string' || !cycle.releaseEvidence.trim()) {
      throw new Error('Invalid or ambiguous publication receipt.');
    }
    ids.add(cycle.grantId); keys.add(cycle.cycleKey);
  }
  return grants.flatMap(grant => {
    const receipt = ledger.cycles.find(cycle => cycle.grantId === grant.id);
    if (!receipt) return []; // Never guess first active publication from an inventory date.
    if (receipt.sourceFingerprint !== grantCycleFingerprint(grant)) throw new Error('Grant call identity changed; reconcile the publication receipt.');
    return [{ ...grant, portalAddedDate: receipt.firstObservedActiveDate, alertSubscriberCutoff: receipt.eligibleSubscribersBefore, alertPublicAdditionDate: receipt.newPublicAdditionDate }];
  });
}

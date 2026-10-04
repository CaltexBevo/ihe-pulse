import {
  getInnovationGrantLifecycle,
  getInnovationGrantPacificAsOfDate,
  getInnovationGrantPacificCalendarDate,
  type InnovationGrantOpportunity,
} from "./innovation-grants-shared";
import { matchesInnovationGrantLocation } from "./innovation-grants-directory";
import {
  parseGrantAlertPreferences,
  type GrantAlertPreferences,
} from "./grantAlertPreferences";

export interface GrantAlertMatchingWindow {
  /** Inclusive Pacific calendar date supplied by the weekly/digest runner. */
  sinceInclusive: string;
  /** Exclusive Pacific calendar date supplied by the weekly/digest runner. */
  untilExclusive: string;
  /** Mailing-list signup timestamp. Date-only inventory cannot resolve same-day ordering. */
  subscribedAt: string;
  /** Exclusive inventory date covered by the previous successful digest. */
  lastCoveredUntilExclusive?: string | null;
  /** Explicit clock input keeps matching deterministic and lifecycle-aware. */
  asOf: Date;
}

const awardAmountToken = String.raw`\$\s*(\d{1,3}(?:,\d{3})+|\d+)`;
const awardRangePattern = new RegExp(
  `${awardAmountToken}\\s*(?:-|to)\\s*${awardAmountToken}\\s+(?:per[- ]award|each[- ]award)\\b`,
  "i",
);
const singleAwardPattern = new RegExp(
  `${awardAmountToken}\\s+(?:per[- ]award|each[- ]award)\\b`,
  "i",
);
const allDollarAmountsPattern = /\$\s*\d{1,3}(?:,\d{3})+|\$\s*\d+/g;

function parseMoneyToken(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value.replaceAll(",", ""));
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

/**
 * Read only explicit per-award USD language. Program-pool fields and ambiguous
 * dollar values are intentionally not consulted. A range returns its upper
 * endpoint because it is the largest individually available award supported
 * by the displayed per-award range.
 */
export function getInnovationGrantPerAwardCeilingUsd(awardAmount: unknown): number | null {
  if (typeof awardAmount !== "string" || awardAmount.length > 2_000) return null;
  const normalized = awardAmount.replace(/[\u2010-\u2015\u2212]/g, "-");
  // Only the explicit award clause supplies the amount. Other clauses must
  // clearly identify a program total so competing award figures fail closed.
  const clauses = normalized.split(/[;\n]/);
  const awardClauses = clauses.filter(clause => /(?:per[- ]award|each[- ]award)\b/i.test(clause));
  if (awardClauses.length !== 1) return null;
  if (clauses.some(clause => clause !== awardClauses[0] && /\$/.test(clause) && !/(?:program (?:pool|funding|total)|total|current program funding)/i.test(clause))) return null;
  const awardClause = awardClauses[0];
  const dollarAmounts = awardClause.match(allDollarAmountsPattern) ?? [];

  const range = awardClause.match(awardRangePattern);
  if (range && dollarAmounts.length === 2) {
    const [first, second] = range.slice(1).map(parseMoneyToken);
    if (first === null || second === null || first > second) return null;
    return second;
  }

  const single = awardClause.match(singleAwardPattern);
  if (single && dollarAmounts.length === 1) {
    return parseMoneyToken(single[1]);
  }

  return null;
}

function parseDateOnly(value: unknown): string | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const candidate = new Date(timestamp);
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    return null;
  }
  return value;
}

function isIsoTimestamp(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{1,9})?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.test(value)
  ) {
    return false;
  }

  const [datePart] = value.split("T");
  return parseDateOnly(datePart) !== null && Number.isFinite(Date.parse(value));
}

function nextDate(dateOnly: string): string {
  const [year, month, day] = dateOnly.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return [next.getUTCFullYear(), String(next.getUTCMonth() + 1).padStart(2, "0"), String(next.getUTCDate()).padStart(2, "0")].join("-");
}

function laterDate(left: string, right: string): string {
  return left > right ? left : right;
}

function parseInventoryDate(value: unknown): string | null {
  return parseDateOnly(value);
}

function hasSelectedAudience(
  opportunity: InnovationGrantOpportunity,
  preferences: GrantAlertPreferences,
): boolean {
  return preferences.audiences.length === 0 ||
    preferences.audiences.some((audience) => opportunity.audiences.includes(audience));
}

function hasSelectedArea(
  opportunity: InnovationGrantOpportunity,
  preferences: GrantAlertPreferences,
): boolean {
  return preferences.areas.length === 0 ||
    preferences.areas.some((area) => opportunity.innovationAreas.includes(area));
}

function hasSelectedLocation(
  opportunity: InnovationGrantOpportunity,
  preferences: GrantAlertPreferences,
): boolean {
  // Institution-only opportunities cannot be matched to a subscriber's actual
  // institution with the available profile fields, even when no state is selected.
  if (opportunity.locationEligibility?.scope === "institution-only") return false;
  return preferences.locations.length === 0 ||
    preferences.locations.some((location) => matchesInnovationGrantLocation(opportunity, location));
}

function validClock(value: Date): boolean {
  return value instanceof Date && Number.isFinite(value.getTime());
}

/**
 * Select newly added public grants in a Pacific-date window. Filters are ANDed
 * across audience, geography, subject area, award threshold, window, and active
 * lifecycle; multiple selected values within one category are ORed. Inventory
 * verification dates and program-pool totals do not participate.
 */
export function chooseNewMatchingGrants(
  grants: readonly InnovationGrantOpportunity[],
  preferencesInput: GrantAlertPreferences,
  window: GrantAlertMatchingWindow,
): InnovationGrantOpportunity[] {
  if (!Array.isArray(grants) || typeof window !== "object" || window === null) return [];
  const normalized = parseGrantAlertPreferences(preferencesInput);
  if (!normalized.ok || !validClock(window.asOf)) return [];

  const startDate = parseDateOnly(window.sinceInclusive);
  const endDate = parseDateOnly(window.untilExclusive);
  if (!startDate || !endDate || startDate >= endDate) return [];
  if (!isIsoTimestamp(window.subscribedAt)) return [];
  if (window.lastCoveredUntilExclusive !== undefined && window.lastCoveredUntilExclusive !== null && !parseDateOnly(window.lastCoveredUntilExclusive)) {
    return [];
  }

  let effectiveStart = laterDate(
    startDate,
    nextDate(getInnovationGrantPacificCalendarDate(new Date(window.subscribedAt))),
  );
  if (window.lastCoveredUntilExclusive) {
    effectiveStart = laterDate(
      effectiveStart,
      window.lastCoveredUntilExclusive,
    );
  }
  if (effectiveStart >= endDate) return [];

  const criteria = normalized.preferences;
  const lifecycleAsOf = getInnovationGrantPacificAsOfDate(window.asOf);
  const idCounts = new Map<number, number>();
  for (const grant of grants) {
    if (Number.isSafeInteger(grant.id) && grant.id > 0) {
      idCounts.set(grant.id, (idCounts.get(grant.id) ?? 0) + 1);
    }
  }

  return grants
    .filter((grant) => {
      if (!Number.isSafeInteger(grant.id) || grant.id <= 0 || idCounts.get(grant.id) !== 1) return false;
      // Observation only proves a call became active between snapshots. Exclude
      // subscribers who joined within that uncertainty interval.
      const cutoff = (grant as InnovationGrantOpportunity & { alertSubscriberCutoff?: string }).alertSubscriberCutoff;
      if (cutoff !== undefined && (!isIsoTimestamp(cutoff) || Date.parse(window.subscribedAt) > Date.parse(cutoff))) return false;
      const additionDate = (grant as InnovationGrantOpportunity & { alertPublicAdditionDate?: string }).alertPublicAdditionDate;
      if (additionDate !== undefined && (!parseDateOnly(additionDate) || getInnovationGrantPacificCalendarDate(new Date(window.subscribedAt)) >= additionDate)) return false;
      if (grant.scopeDisposition !== "included") return false;
      // Only the server-built public projection adds this exhaustive structured
      // eligibility metadata. Raw inventory, including launch-held records,
      // cannot be treated as public merely because its disposition is included.
      if (!grant.locationEligibility) return false;
      const addedDate = parseInventoryDate(grant.portalAddedDate);
      if (!addedDate || addedDate < effectiveStart || addedDate >= endDate) return false;

      const lifecycle = getInnovationGrantLifecycle(grant, lifecycleAsOf);
      if (lifecycle !== "open-now" && lifecycle !== "closing-soon") return false;
      if (!hasSelectedAudience(grant, criteria)) return false;
      if (!hasSelectedLocation(grant, criteria)) return false;
      if (!hasSelectedArea(grant, criteria)) return false;

      if (criteria.minimumAwardUsd !== null) {
        const perAwardCeiling = getInnovationGrantPerAwardCeilingUsd(grant.awardAmount);
        if (perAwardCeiling === null || perAwardCeiling < criteria.minimumAwardUsd) return false;
      }
      return true;
    })
    .sort((left, right) => {
      const leftDate = left.portalAddedDate;
      const rightDate = right.portalAddedDate;
      return leftDate.localeCompare(rightDate) || left.id - right.id;
    });
}

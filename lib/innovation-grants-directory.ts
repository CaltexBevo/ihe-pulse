import {
  getInnovationGrantDaysUntilDeadline,
  getInnovationGrantLifecycle,
  isInnovationGrantNewThisWeek,
  type InnovationGrantArea,
  type InnovationGrantAudience,
  type InnovationGrantOpportunity,
} from "./innovation-grants-shared";

export type InnovationGrantStatusFilter =
  | "active"
  | "all"
  | "closing-soon"
  | "open-now"
  | "opening-soon"
  | "recurring-watchlist";

export type InnovationGrantDeadlineFilter =
  | "any"
  | "closing-14"
  | "30-plus"
  | "60-plus"
  | "90-plus"
  | "rolling";

export type InnovationGrantCostShareFilter =
  | "all"
  | "required"
  | "not-required"
  | "not-stated";

export type InnovationGrantFreshnessFilter =
  | "all"
  | "new-this-week"
  | "recently-added";

export type InnovationGrantCostShareClassification =
  | "required"
  | "not-required"
  | "not-stated";

export interface InnovationGrantDirectoryFilters {
  keyword: string;
  audience: "all" | InnovationGrantAudience;
  area: "all" | InnovationGrantArea;
  status: InnovationGrantStatusFilter;
  /** The exact verified geography string, or "all". */
  geography: string;
  deadline: InnovationGrantDeadlineFilter;
  costShare: InnovationGrantCostShareFilter;
  freshness: InnovationGrantFreshnessFilter;
}

export const DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS: InnovationGrantDirectoryFilters = {
  keyword: "",
  audience: "all",
  area: "all",
  status: "active",
  geography: "all",
  deadline: "any",
  costShare: "all",
  freshness: "all",
};

type CostShareRecord = Pick<InnovationGrantOpportunity, "costShareRequirement">;

function normalizeSearchText(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * Classify only language that makes a cost-share conclusion explicit. The
 * field is intentionally treated as unknown when the source uses tentative,
 * indirect, or otherwise ambiguous wording.
 */
export function classifyInnovationGrantCostShare(
  record: CostShareRecord,
): InnovationGrantCostShareClassification {
  const value = normalizeSearchText(record.costShareRequirement ?? "");
  if (!value) return "not-stated";

  const costShareTerm = "(?:cost[ -]?share|cost[ -]?sharing|match(?:ing)?|matching funds)";

  // These patterns describe a direct absence of a requirement or a direct
  // prohibition. Do this before the generic "not stated" check so that a
  // source can say "not stated; cost share is prohibited" without losing the
  // explicit prohibition.
  const explicitlyNotRequired = [
    new RegExp(`\\bno (?:general )?(?:required )?${costShareTerm}(?=\\s*(?:$|[.;,:]|(?:is|are|was|were)?\\s*(?:required|mandatory|prohibited|forbidden|not allowed|not required|not mandatory|requirement|obligation)\\b))`),
    new RegExp(`\\b${costShareTerm}\\s+(?:is|are|was|were)?\\s*(?:not required|not mandatory|prohibited|forbidden|not allowed)\\b`),
    new RegExp(`\\b${costShareTerm}\\b[^.;,]*\\b(?:allowed|permitted)\\b[^.;,]*\\b(?:not required|not mandatory)\\b`),
    new RegExp(`\\b(?:no|without) (?:a )?(?:general )?${costShareTerm} (?:requirement|obligation)\\b`),
    /^(?:not required|not mandatory)(?:\b|[.;,])/,
  ];
  if (explicitlyNotRequired.some((pattern) => pattern.test(value))) {
    return "not-required";
  }

  const explicitlyNotStated = [
    /\b(?:not stated|not yet stated|not specified|unspecified|unknown)\b/,
    new RegExp(`\\bno (?:general )?(?:required )?${costShareTerm} stated\\b`),
  ];
  if (explicitlyNotStated.some((pattern) => pattern.test(value))) {
    return "not-stated";
  }

  const explicitlyRequired = [
    new RegExp(`\\b${costShareTerm}\\s+(?:is|are|was|were)?\\s*required\\b`),
    new RegExp(`\\brequired\\s+${costShareTerm}\\b`),
    new RegExp(`\\b(?:must|mandatory)\\b[^.;,]*\\b${costShareTerm}\\b`),
    new RegExp(`\\b${costShareTerm}\\b[^.;,]*\\bmust\\b`),
  ];
  if (explicitlyRequired.some((pattern) => pattern.test(value))) {
    return "required";
  }

  return "not-stated";
}

type RollingRecord = Pick<InnovationGrantOpportunity, "deadline"> & {
  qualifiers?: readonly string[];
};

/**
 * Return true only when the source explicitly identifies a rolling or
 * no-fixed-deadline path. Missing structured dates are not evidence of a
 * rolling opportunity.
 */
export function isInnovationGrantRolling(record: RollingRecord): boolean {
  const text = normalizeSearchText(
    [record.deadline, ...(record.qualifiers ?? [])].filter(Boolean).join(" "),
  );

  return (
    /\brolling\b/.test(text) ||
    /\bno[- ]fixed[- ]deadline(?:s)?\b/.test(text) ||
    /\bno[- ](?:specific|set)[- ]deadline(?:s)?\b/.test(text)
  );
}

function searchableInnovationGrantText(opportunity: InnovationGrantOpportunity): string {
  return normalizeSearchText(
    [
      opportunity.title,
      opportunity.source,
      opportunity.officialUrl,
      opportunity.applicationUrl,
      opportunity.applicationStatus,
      opportunity.announcedDate,
      opportunity.announcedDateIso,
      opportunity.portalAddedDate,
      opportunity.announcementWindow,
      opportunity.awardAmount,
      opportunity.eligibility,
      opportunity.whatItFunds,
      opportunity.geography,
      opportunity.costShareRequirement,
      opportunity.applicationAccess,
      opportunity.deadline,
      opportunity.deadlineTimeZone,
      opportunity.lastVerified,
      opportunity.finalDeadlineDate,
      opportunity.priorityDeadlineDate,
      opportunity.openDate,
      ...opportunity.qualifiers,
      opportunity.bestFit,
      opportunity.eligibilityBadge,
      opportunity.inventoryOrigin,
      opportunity.recurringLabel,
      opportunity.recurrenceEvidence,
      opportunity.sourceNotes,
    ]
      .filter((value): value is string => typeof value === "string")
      .join(" "),
  );
}

function matchesKeyword(
  opportunity: InnovationGrantOpportunity,
  keyword: string,
): boolean {
  const normalizedKeyword = normalizeSearchText(keyword);
  return !normalizedKeyword || searchableInnovationGrantText(opportunity).includes(normalizedKeyword);
}

function matchesStatus(
  opportunity: InnovationGrantOpportunity,
  status: InnovationGrantStatusFilter,
  asOf: Date,
): boolean {
  if (status === "all") return true;

  const lifecycle = getInnovationGrantLifecycle(opportunity, asOf);
  if (status === "active") {
    return (
      lifecycle === "closing-soon" ||
      lifecycle === "open-now" ||
      lifecycle === "opening-soon"
    );
  }

  return lifecycle === status;
}

function matchesDeadline(
  opportunity: InnovationGrantOpportunity,
  deadline: InnovationGrantDeadlineFilter,
  asOf: Date,
): boolean {
  if (deadline === "any") return true;
  if (deadline === "rolling") return isInnovationGrantRolling(opportunity);

  const daysUntilDeadline = getInnovationGrantDaysUntilDeadline(opportunity, asOf);
  if (daysUntilDeadline === undefined) return false;

  if (deadline === "closing-14") {
    return daysUntilDeadline >= 0 && daysUntilDeadline <= 14;
  }
  if (deadline === "30-plus") return daysUntilDeadline >= 30;
  if (deadline === "60-plus") return daysUntilDeadline >= 60;
  return daysUntilDeadline >= 90;
}

function matchesFreshness(
  opportunity: InnovationGrantOpportunity,
  freshness: InnovationGrantFreshnessFilter,
  asOf: Date,
): boolean {
  if (freshness === "all") return true;
  if (freshness === "new-this-week") {
    return isInnovationGrantNewThisWeek(opportunity, asOf);
  }

  const addedDate = parseDateOnly(opportunity.portalAddedDate);
  if (addedDate === undefined) return false;

  const asOfDay = dateOnlyUtc(asOf);
  const ageInDays = Math.round((asOfDay - addedDate) / 86_400_000);
  return ageInDays >= 0 && ageInDays < 30;
}

function parseDateOnly(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const timestamp = Date.UTC(year, month - 1, day);
  const candidate = new Date(timestamp);
  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    return undefined;
  }
  return timestamp;
}

function dateOnlyUtc(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

/**
 * Apply every supplied directory filter as an AND. The returned array is a
 * new array in input order, and evidence-only inventory rows never pass.
 */
export function filterInnovationGrantOpportunities(
  opportunities: readonly InnovationGrantOpportunity[],
  filters: InnovationGrantDirectoryFilters,
  asOf: Date,
): InnovationGrantOpportunity[] {
  return opportunities.filter((opportunity) => {
    if (opportunity.scopeDisposition !== "included") return false;
    if (!matchesKeyword(opportunity, filters.keyword)) return false;
    if (!matchesStatus(opportunity, filters.status, asOf)) return false;
    if (!matchesDeadline(opportunity, filters.deadline, asOf)) return false;
    if (filters.costShare !== "all" && classifyInnovationGrantCostShare(opportunity) !== filters.costShare) {
      return false;
    }
    if (!matchesFreshness(opportunity, filters.freshness, asOf)) return false;
    if (filters.audience !== "all" && !opportunity.audiences.includes(filters.audience)) {
      return false;
    }
    if (filters.area !== "all" && !opportunity.innovationAreas.includes(filters.area)) {
      return false;
    }
    if (filters.geography !== "all" && opportunity.geography !== filters.geography) {
      return false;
    }
    return true;
  });
}

export function countInnovationGrantActiveFilters(
  filters: InnovationGrantDirectoryFilters,
): number {
  let count = normalizeSearchText(filters.keyword) ? 1 : 0;
  if (filters.audience !== "all") count += 1;
  if (filters.area !== "all") count += 1;
  if (filters.status !== DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS.status) count += 1;
  if (filters.geography !== "all") count += 1;
  if (filters.deadline !== "any") count += 1;
  if (filters.costShare !== "all") count += 1;
  if (filters.freshness !== "all") count += 1;
  return count;
}

export function getInnovationGrantGeographyOptions(
  opportunities: readonly InnovationGrantOpportunity[],
): string[] {
  const geographies = new Set<string>();
  for (const opportunity of opportunities) {
    if (opportunity.scopeDisposition !== "included") continue;
    if (opportunity.geography.trim()) geographies.add(opportunity.geography);
  }
  return [...geographies].sort();
}

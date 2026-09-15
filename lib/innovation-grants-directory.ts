import {
  getInnovationGrantDaysUntilDeadline,
  getInnovationGrantLifecycle,
  isInnovationGrantNewThisWeek,
  type InnovationGrantArea,
  type InnovationGrantAudience,
  type InnovationGrantJurisdictionCode,
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
  /** Inclusive institution location, or "all". */
  location: "all" | InnovationGrantJurisdictionCode;
  deadline: InnovationGrantDeadlineFilter;
  costShare: InnovationGrantCostShareFilter;
  freshness: InnovationGrantFreshnessFilter;
}

export const DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS: InnovationGrantDirectoryFilters = {
  keyword: "",
  audience: "all",
  area: "all",
  status: "active",
  location: "all",
  deadline: "any",
  costShare: "all",
  freshness: "all",
};

type CostShareRecord = Pick<InnovationGrantOpportunity, "costShareRequirement">;

function normalizeSearchText(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export const INNOVATION_GRANT_JURISDICTIONS: ReadonlyArray<{
  code: InnovationGrantJurisdictionCode;
  label: string;
  kind: "state-or-dc" | "territory";
}> = [
  { code: "AL", label: "Alabama", kind: "state-or-dc" },
  { code: "AK", label: "Alaska", kind: "state-or-dc" },
  { code: "AZ", label: "Arizona", kind: "state-or-dc" },
  { code: "AR", label: "Arkansas", kind: "state-or-dc" },
  { code: "CA", label: "California", kind: "state-or-dc" },
  { code: "CO", label: "Colorado", kind: "state-or-dc" },
  { code: "CT", label: "Connecticut", kind: "state-or-dc" },
  { code: "DE", label: "Delaware", kind: "state-or-dc" },
  { code: "DC", label: "District of Columbia", kind: "state-or-dc" },
  { code: "FL", label: "Florida", kind: "state-or-dc" },
  { code: "GA", label: "Georgia", kind: "state-or-dc" },
  { code: "HI", label: "Hawaii", kind: "state-or-dc" },
  { code: "ID", label: "Idaho", kind: "state-or-dc" },
  { code: "IL", label: "Illinois", kind: "state-or-dc" },
  { code: "IN", label: "Indiana", kind: "state-or-dc" },
  { code: "IA", label: "Iowa", kind: "state-or-dc" },
  { code: "KS", label: "Kansas", kind: "state-or-dc" },
  { code: "KY", label: "Kentucky", kind: "state-or-dc" },
  { code: "LA", label: "Louisiana", kind: "state-or-dc" },
  { code: "ME", label: "Maine", kind: "state-or-dc" },
  { code: "MD", label: "Maryland", kind: "state-or-dc" },
  { code: "MA", label: "Massachusetts", kind: "state-or-dc" },
  { code: "MI", label: "Michigan", kind: "state-or-dc" },
  { code: "MN", label: "Minnesota", kind: "state-or-dc" },
  { code: "MS", label: "Mississippi", kind: "state-or-dc" },
  { code: "MO", label: "Missouri", kind: "state-or-dc" },
  { code: "MT", label: "Montana", kind: "state-or-dc" },
  { code: "NE", label: "Nebraska", kind: "state-or-dc" },
  { code: "NV", label: "Nevada", kind: "state-or-dc" },
  { code: "NH", label: "New Hampshire", kind: "state-or-dc" },
  { code: "NJ", label: "New Jersey", kind: "state-or-dc" },
  { code: "NM", label: "New Mexico", kind: "state-or-dc" },
  { code: "NY", label: "New York", kind: "state-or-dc" },
  { code: "NC", label: "North Carolina", kind: "state-or-dc" },
  { code: "ND", label: "North Dakota", kind: "state-or-dc" },
  { code: "OH", label: "Ohio", kind: "state-or-dc" },
  { code: "OK", label: "Oklahoma", kind: "state-or-dc" },
  { code: "OR", label: "Oregon", kind: "state-or-dc" },
  { code: "PA", label: "Pennsylvania", kind: "state-or-dc" },
  { code: "RI", label: "Rhode Island", kind: "state-or-dc" },
  { code: "SC", label: "South Carolina", kind: "state-or-dc" },
  { code: "SD", label: "South Dakota", kind: "state-or-dc" },
  { code: "TN", label: "Tennessee", kind: "state-or-dc" },
  { code: "TX", label: "Texas", kind: "state-or-dc" },
  { code: "UT", label: "Utah", kind: "state-or-dc" },
  { code: "VT", label: "Vermont", kind: "state-or-dc" },
  { code: "VA", label: "Virginia", kind: "state-or-dc" },
  { code: "WA", label: "Washington", kind: "state-or-dc" },
  { code: "WV", label: "West Virginia", kind: "state-or-dc" },
  { code: "WI", label: "Wisconsin", kind: "state-or-dc" },
  { code: "WY", label: "Wyoming", kind: "state-or-dc" },
  { code: "AS", label: "American Samoa", kind: "territory" },
  { code: "GU", label: "Guam", kind: "territory" },
  { code: "MP", label: "Northern Mariana Islands", kind: "territory" },
  { code: "PR", label: "Puerto Rico", kind: "territory" },
  { code: "VI", label: "U.S. Virgin Islands", kind: "territory" },
];

const jurisdictionByCode = new Map(
  INNOVATION_GRANT_JURISDICTIONS.map((jurisdiction) => [jurisdiction.code, jurisdiction]),
);

export function isInnovationGrantJurisdictionCode(
  value: string,
): value is InnovationGrantJurisdictionCode {
  return jurisdictionByCode.has(value as InnovationGrantJurisdictionCode);
}

export function getInnovationGrantJurisdictionLabel(
  code: InnovationGrantJurisdictionCode,
): string {
  return jurisdictionByCode.get(code)?.label ?? code;
}

export function matchesInnovationGrantLocation(
  opportunity: InnovationGrantOpportunity,
  location: "all" | InnovationGrantJurisdictionCode,
): boolean {
  if (location === "all") return true;
  const eligibility = opportunity.locationEligibility;
  if (!eligibility || eligibility.scope === "institution-only" || eligibility.scope === "unresolved") {
    return false;
  }
  if (eligibility.scope === "nationwide") {
    const jurisdiction = jurisdictionByCode.get(location);
    return jurisdiction?.kind === "state-or-dc" || eligibility.includesTerritories;
  }
  return eligibility.jurisdictions.includes(location);
}

export function getInnovationGrantLocationBadge(
  opportunity: InnovationGrantOpportunity,
  selectedLocation: "all" | InnovationGrantJurisdictionCode = "all",
): string {
  const eligibility = opportunity.locationEligibility;
  if (!eligibility || eligibility.scope === "unresolved") return "Location review needed";
  if (eligibility.scope === "institution-only") return "Institution-specific";
  if (eligibility.scope === "nationwide") {
    return eligibility.includesTerritories ? "Nationwide + territories" : "Nationwide";
  }
  if (eligibility.scope === "state-or-territory") {
    const only = eligibility.jurisdictions[0];
    return `${only ? getInnovationGrantJurisdictionLabel(only) : "Location"} only`;
  }
  if (selectedLocation !== "all" && eligibility.jurisdictions.includes(selectedLocation)) {
    return `Regional · Includes ${getInnovationGrantJurisdictionLabel(selectedLocation)}`;
  }
  return "Regional eligibility";
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
    if (!matchesInnovationGrantLocation(opportunity, filters.location)) return false;
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
  if (filters.location !== "all") count += 1;
  if (filters.deadline !== "any") count += 1;
  if (filters.costShare !== "all") count += 1;
  if (filters.freshness !== "all") count += 1;
  return count;
}

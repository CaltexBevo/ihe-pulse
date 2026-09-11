/**
 * Browser-safe Innovation Grants domain API.
 *
 * This module intentionally contains no inventory records and must never
 * import the inventory-bearing `lib/data/innovation-grants` module. Client
 * components can use these types and helpers without bundling evidence-only
 * research records into public JavaScript.
 */

export type InnovationGrantLifecycle =
  | "closing-soon"
  | "open-now"
  | "opening-soon"
  | "recurring-watchlist"
  | "closed";

export type InnovationGrantApplicationStatus =
  | "open-now"
  | "opening-soon"
  | "recurring-watchlist";

export type InnovationGrantInventoryOrigin =
  | "weekly-new"
  | "rolling-inventory"
  | "bootstrap-search"
  | "recurring-watchlist";

export type InnovationGrantAudience =
  | "community-colleges"
  | "four-year-colleges-universities"
  | "faculty-teaching-centers"
  | "students-graduate-researchers";

export type InnovationGrantArea =
  | "ai-emerging-technology"
  | "teaching-learning"
  | "student-success"
  | "workforce-pathways"
  | "community-college-innovation"
  | "digital-transformation-infrastructure"
  | "research-evidence-building"
  | "faculty-development";

export type InnovationGrantSort =
  | "recommended"
  | "deadline"
  | "newest"
  | "recently-added";

export type InnovationGrantScopeDisposition = "included" | "evidence-only";

export interface InnovationGrantOpportunity {
  id: number;
  title: string;
  source: string;
  officialUrl: string;
  applicationUrl?: string;
  applicationStatus: InnovationGrantApplicationStatus;
  announcedDate: string;
  announcedDateIso?: string;
  /** The date this record was added to the public directory, not its funder announcement date. */
  portalAddedDate: string;
  /** Published current-call cash pool used for the directory's directional total. */
  publishedProgramPoolUsd?: number;
  /** True when the official source describes the program-level pool as approximate. */
  publishedProgramPoolApproximate?: boolean;
  announcementWindow: string;
  awardAmount: string;
  eligibility: string;
  whatItFunds: string;
  geography: string;
  costShareRequirement: string;
  applicationAccess: string;
  deadline: string;
  deadlineTimeZone: string;
  lastVerified: string;
  finalDeadlineDate?: string;
  priorityDeadlineDate?: string;
  openDate?: string;
  qualifiers: string[];
  recommendationRank: number;
  audiences: InnovationGrantAudience[];
  innovationAreas: InnovationGrantArea[];
  scopeDisposition: InnovationGrantScopeDisposition;
  scopeExclusionReason?: string;
  bestFit: string;
  eligibilityBadge?: string;
  inventoryOrigin: InnovationGrantInventoryOrigin;
  recurringLabel?: string;
  recurrenceEvidence?: string;
  sourceNotes?: string;
}

export const INNOVATION_GRANTS_VERIFIED_ON = "Sep 11, 2026";
export const INNOVATION_GRANTS_VERIFICATION_DATE = "2026-09-11";
export const INNOVATION_GRANTS_FULL_SEARCH_DATE = "Sep 7, 2026";
export const INNOVATION_GRANTS_FULL_SEARCH_DATE_ISO = "2026-09-07";
export const INNOVATION_GRANTS_TIME_ZONE = "America/Los_Angeles";
export const INNOVATION_GRANTS_SCOPE =
  "Actionable higher-ed innovation funding across AI & Emerging Technology, Teaching & Learning, Student Success, Workforce/Pathways, Community College Innovation, Digital Transformation/Infrastructure, Research/Evidence-Building, and Faculty Development";
export const INNOVATION_GRANTS_ACTIVE_LOOKBACK_MONTHS = 6;
export const INNOVATION_GRANTS_RECURRING_LOOKBACK_MONTHS = 12;
export const INNOVATION_GRANTS_RESEARCH_EVIDENCE_ONLY_COUNT = 77;
export const INNOVATION_GRANTS_BOOTSTRAP_POLICY =
  "The completed bootstrap search covers six months for still-open or opening-soon calls, plus a narrower twelve-month sweep for officially recurring or announced future cycles.";
export const INNOVATION_GRANTS_K12_POLICY =
  "K-12 opportunities belong only when higher ed can apply or partner, or when the work materially connects to teacher preparation, dual enrollment, college access, or workforce pathways.";
export const INNOVATION_GRANTS_EXCLUSION_POLICY =
  "Exclude pure K-12, scholarships, procurement, closed or awarded active listings, and generic research without a clear education-innovation fit.";

export const INNOVATION_GRANTS_AUDIENCE_FILTERS: Array<{
  id: "all" | InnovationGrantAudience;
  label: string;
}> = [
  { id: "all", label: "All" },
  { id: "community-colleges", label: "Community Colleges" },
  { id: "four-year-colleges-universities", label: "Four-Year Colleges & Universities" },
  { id: "faculty-teaching-centers", label: "Faculty & Teaching Centers" },
  { id: "students-graduate-researchers", label: "Students / Graduate Researchers" },
];

export const INNOVATION_GRANTS_AREA_FILTERS: Array<{
  id: "all" | InnovationGrantArea;
  label: string;
}> = [
  { id: "all", label: "All areas" },
  { id: "ai-emerging-technology", label: "AI & Emerging Technology" },
  { id: "teaching-learning", label: "Teaching & Learning" },
  { id: "student-success", label: "Student Success" },
  { id: "workforce-pathways", label: "Workforce/Pathways" },
  { id: "community-college-innovation", label: "Community College Innovation" },
  { id: "digital-transformation-infrastructure", label: "Digital Transformation/Infrastructure" },
  { id: "research-evidence-building", label: "Research/Evidence-Building" },
  { id: "faculty-development", label: "Faculty Development" },
];

function utcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function isoDay(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return Date.UTC(year, month - 1, day);
}

/**
 * Return the page's calendar date in Pacific time, independent of the server's
 * local timezone. The date-only lifecycle helpers consume the returned ISO day.
 */
export function getInnovationGrantPacificCalendarDate(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: INNOVATION_GRANTS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = parts.reduce<Record<string, string>>((result, part) => {
    if (part.type === "year" || part.type === "month" || part.type === "day") {
      result[part.type] = part.value;
    }
    return result;
  }, {});

  if (!values.year || !values.month || !values.day) {
    throw new Error("Unable to determine the Innovation Grants Pacific calendar date.");
  }

  return `${values.year}-${values.month}-${values.day}`;
}

/** Normalize the Pacific calendar date to UTC midnight for date-only comparisons. */
export function getInnovationGrantPacificAsOfDate(date: Date = new Date()): Date {
  const [year, month, day] = getInnovationGrantPacificCalendarDate(date).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function getInnovationGrantDaysUntilDeadline(
  opportunity: InnovationGrantOpportunity,
  asOf: Date = new Date(),
): number | undefined {
  const today = utcDay(asOf);
  const priorityDeadline = isoDay(opportunity.priorityDeadlineDate);
  const finalDeadline = isoDay(opportunity.finalDeadlineDate);
  const nextDeadline =
    priorityDeadline !== undefined && priorityDeadline >= today
      ? priorityDeadline
      : finalDeadline;
  if (nextDeadline === undefined) return undefined;
  return Math.round((nextDeadline - today) / 86_400_000);
}

export function getInnovationGrantInventoryLabel(
  opportunity: InnovationGrantOpportunity,
): string {
  if (opportunity.recurringLabel) return opportunity.recurringLabel;
  if (opportunity.inventoryOrigin === "weekly-new") return "Weekly discovery";
  if (opportunity.inventoryOrigin === "rolling-inventory") return "Rolling inventory";
  if (opportunity.inventoryOrigin === "bootstrap-search") return "Six-month bootstrap";
  return "Recurring watchlist";
}

/**
 * “New this week” means one of the seven calendar dates ending on the page's
 * as-of date. Included records only; evidence-only records never qualify.
 */
export function isInnovationGrantNewThisWeek(
  opportunity: InnovationGrantOpportunity,
  asOf: Date = new Date(),
): boolean {
  if (opportunity.scopeDisposition !== "included") return false;

  const addedDate = isoDay(opportunity.portalAddedDate);
  if (addedDate === undefined) return false;

  const ageInDays = Math.round((utcDay(asOf) - addedDate) / 86_400_000);
  return ageInDays >= 0 && ageInDays < 7;
}

export function matchesInnovationGrantAudience(
  opportunity: InnovationGrantOpportunity,
  audience: InnovationGrantAudience | "all",
): boolean {
  return audience === "all" || opportunity.audiences.includes(audience);
}

export function matchesInnovationGrantArea(
  opportunity: InnovationGrantOpportunity,
  area: InnovationGrantArea | "all",
): boolean {
  return area === "all" || opportunity.innovationAreas.includes(area);
}

export function sortInnovationGrantOpportunities(
  opportunities: InnovationGrantOpportunity[],
  sort: InnovationGrantSort,
  asOf: Date = new Date(),
): InnovationGrantOpportunity[] {
  const sorted = [...opportunities];
  const byRecommendation = (left: InnovationGrantOpportunity, right: InnovationGrantOpportunity) =>
    left.recommendationRank - right.recommendationRank || left.id - right.id;

  if (sort === "recently-added") {
    sorted.sort((left, right) => {
      return right.portalAddedDate.localeCompare(left.portalAddedDate) || byRecommendation(left, right);
    });
    return sorted;
  }

  if (sort === "newest") {
    sorted.sort((left, right) => {
      const leftDate = left.announcedDateIso ?? "0000-00-00";
      const rightDate = right.announcedDateIso ?? "0000-00-00";
      return rightDate.localeCompare(leftDate) || byRecommendation(left, right);
    });
    return sorted;
  }

  if (sort === "deadline") {
    sorted.sort((left, right) => {
      const leftDays = getInnovationGrantDaysUntilDeadline(left, asOf);
      const rightDays = getInnovationGrantDaysUntilDeadline(right, asOf);
      return (leftDays ?? Number.POSITIVE_INFINITY) -
        (rightDays ?? Number.POSITIVE_INFINITY) || byRecommendation(left, right);
    });
    return sorted;
  }

  sorted.sort(byRecommendation);
  return sorted;
}

/**
 * Closing Soon means an included opportunity has 14 calendar days or fewer
 * before its next structured deadline. Watchlist records never become open
 * merely because an older solicitation contains a recurring cadence.
 */
export function getInnovationGrantLifecycle(
  opportunity: InnovationGrantOpportunity,
  asOf: Date = new Date(),
): InnovationGrantLifecycle {
  if (opportunity.applicationStatus === "recurring-watchlist") {
    return "recurring-watchlist";
  }

  const today = utcDay(asOf);
  const finalDeadline = isoDay(opportunity.finalDeadlineDate);
  const priorityDeadline = isoDay(opportunity.priorityDeadlineDate);
  const openingDate = isoDay(opportunity.openDate);

  if (finalDeadline !== undefined && finalDeadline < today) return "closed";
  if (
    (openingDate !== undefined && openingDate > today) ||
    (opportunity.applicationStatus === "opening-soon" && openingDate === undefined)
  ) {
    return "opening-soon";
  }

  const nextDeadline =
    priorityDeadline !== undefined && priorityDeadline >= today
      ? priorityDeadline
      : finalDeadline;
  if (nextDeadline !== undefined) {
    const daysUntilDeadline = Math.round((nextDeadline - today) / 86_400_000);
    if (daysUntilDeadline >= 0 && daysUntilDeadline <= 14) return "closing-soon";
  }

  return "open-now";
}

export interface InnovationGrantFundingSnapshot {
  /** Sum of explicitly published, current-call cash pools only. */
  publishedProgramPoolUsd: number;
  publishedProgramPoolCount: number;
  approximatePoolCount: number;
  /** Open now includes the closing-soon subset. */
  openOpportunityCount: number;
  openNowCount: number;
  closingSoonCount: number;
  openingSoonCount: number;
  /** Current included calls omitted from the directional total because no pool was stated. */
  currentCallsWithoutPublishedPool: number;
}

/**
 * Build the reader-facing funding snapshot without guessing from award ranges.
 * Only included calls with an open-now or closing-soon lifecycle and an explicit
 * structured program pool contribute to the total. Opening-soon, watchlist,
 * closed, evidence-only, per-award-only, and in-kind records do not contribute.
 */
export function getInnovationGrantFundingSnapshot(
  opportunities: InnovationGrantOpportunity[],
  asOf: Date = new Date(),
): InnovationGrantFundingSnapshot {
  const snapshot: InnovationGrantFundingSnapshot = {
    publishedProgramPoolUsd: 0,
    publishedProgramPoolCount: 0,
    approximatePoolCount: 0,
    openOpportunityCount: 0,
    openNowCount: 0,
    closingSoonCount: 0,
    openingSoonCount: 0,
    currentCallsWithoutPublishedPool: 0,
  };

  for (const opportunity of opportunities) {
    if (opportunity.scopeDisposition !== "included") continue;

    const lifecycle = getInnovationGrantLifecycle(opportunity, asOf);
    if (lifecycle === "opening-soon") {
      snapshot.openingSoonCount += 1;
    }
    if (lifecycle === "open-now") {
      snapshot.openNowCount += 1;
      snapshot.openOpportunityCount += 1;
    }
    if (lifecycle === "closing-soon") {
      snapshot.closingSoonCount += 1;
      snapshot.openOpportunityCount += 1;
    }

    if (lifecycle !== "open-now" && lifecycle !== "closing-soon") continue;
    if (opportunity.publishedProgramPoolUsd === undefined) {
      snapshot.currentCallsWithoutPublishedPool += 1;
      continue;
    }

    snapshot.publishedProgramPoolUsd += opportunity.publishedProgramPoolUsd;
    snapshot.publishedProgramPoolCount += 1;
    if (opportunity.publishedProgramPoolApproximate) {
      snapshot.approximatePoolCount += 1;
    }
  }

  return snapshot;
}

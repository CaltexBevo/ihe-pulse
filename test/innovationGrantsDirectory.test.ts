import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyInnovationGrantCostShare,
  countInnovationGrantActiveFilters,
  DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS,
  filterInnovationGrantOpportunities,
  getInnovationGrantLocationBadge,
  INNOVATION_GRANT_JURISDICTIONS,
  isInnovationGrantJurisdictionCode,
  isInnovationGrantRolling,
} from "../lib/innovation-grants-directory.ts";
import type {
  InnovationGrantOpportunity,
} from "../lib/innovation-grants-shared.ts";

const AS_OF = new Date("2026-09-01T00:00:00.000Z");

let nextId = 1;

// Test-only factory. Production records continue to come from the verified
// inventory in lib/data/innovation-grants.ts.
function grant(overrides: Partial<InnovationGrantOpportunity> = {}): InnovationGrantOpportunity {
  const id = nextId;
  nextId += 1;

  return {
    id,
    title: `Test opportunity ${id}`,
    source: "Test source",
    officialUrl: `https://example.test/opportunity/${id}`,
    applicationStatus: "open-now",
    announcedDate: "Aug. 1, 2026",
    portalAddedDate: "2026-08-31",
    announcementWindow: "Test fixture",
    awardAmount: "$10,000",
    eligibility: "U.S. colleges and universities",
    whatItFunds: "Teaching and learning innovation",
    geography: "United States",
    locationEligibility: { scope: "nationwide", includesTerritories: false },
    costShareRequirement: "Not stated",
    applicationAccess: "Apply through the official source",
    deadline: "Application due Oct. 1, 2026",
    deadlineTimeZone: "Pacific Time",
    lastVerified: "Sept. 1, 2026",
    finalDeadlineDate: "2026-10-01",
    qualifiers: [],
    recommendationRank: id,
    audiences: ["four-year-colleges-universities"],
    innovationAreas: ["teaching-learning"],
    scopeDisposition: "included",
    bestFit: "Higher-ed teams building practical learning improvements.",
    inventoryOrigin: "weekly-new",
    ...overrides,
  };
}

function withFilters(
  overrides: Partial<typeof DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS> = {},
) {
  return { ...DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS, ...overrides };
}

test("status filters use lifecycle semantics and always exclude evidence-only rows", () => {
  const closing = grant({ title: "Closing", finalDeadlineDate: "2026-09-10" });
  const open = grant({ title: "Open", finalDeadlineDate: "2026-10-01" });
  const opening = grant({
    title: "Opening",
    applicationStatus: "opening-soon",
    openDate: "2026-09-03",
    finalDeadlineDate: "2026-10-09",
  });
  const watchlist = grant({
    title: "Watchlist",
    applicationStatus: "recurring-watchlist",
    finalDeadlineDate: undefined,
  });
  const closed = grant({ title: "Closed", finalDeadlineDate: "2026-08-31" });
  const evidenceOnly = grant({
    title: "Evidence only",
    scopeDisposition: "evidence-only",
  });
  const records = [closing, open, opening, watchlist, closed, evidenceOnly];

  assert.deepEqual(
    filterInnovationGrantOpportunities(records, withFilters(), AS_OF).map((record) => record.id),
    [closing.id, open.id, opening.id],
  );
  assert.deepEqual(
    filterInnovationGrantOpportunities(records, withFilters({ status: "all" }), AS_OF).map(
      (record) => record.id,
    ),
    [closing.id, open.id, opening.id, watchlist.id, closed.id],
  );

  assert.deepEqual(
    filterInnovationGrantOpportunities(records, withFilters({ status: "closing-soon" }), AS_OF).map(
      (record) => record.id,
    ),
    [closing.id],
  );
  assert.deepEqual(
    filterInnovationGrantOpportunities(records, withFilters({ status: "open-now" }), AS_OF).map(
      (record) => record.id,
    ),
    [open.id],
  );
  assert.deepEqual(
    filterInnovationGrantOpportunities(records, withFilters({ status: "opening-soon" }), AS_OF).map(
      (record) => record.id,
    ),
    [opening.id],
  );
  assert.deepEqual(
    filterInnovationGrantOpportunities(
      records,
      withFilters({ status: "recurring-watchlist" }),
      AS_OF,
    ).map((record) => record.id),
    [watchlist.id],
  );
});

test("keyword, audience, area, and inclusive location eligibility combine as AND filters", () => {
  const match = grant({
    title: "Retention Lab",
    source: "Campus Innovation Fund",
    whatItFunds: "Evidence-based student retention pilots",
    geography: "Oregon",
    locationEligibility: { scope: "state-or-territory", jurisdictions: ["OR"] },
    audiences: ["community-colleges", "faculty-teaching-centers"],
    innovationAreas: ["student-success"],
  });
  const wrongAudience = grant({
    title: "Retention Lab for Universities",
    whatItFunds: "Evidence-based student retention pilots",
    geography: "Oregon",
    locationEligibility: { scope: "state-or-territory", jurisdictions: ["OR"] },
    audiences: ["four-year-colleges-universities"],
    innovationAreas: ["student-success"],
  });
  const wrongGeography = grant({
    title: "Retention Lab elsewhere",
    whatItFunds: "Evidence-based student retention pilots",
    geography: "California",
    locationEligibility: { scope: "state-or-territory", jurisdictions: ["CA"] },
    audiences: ["community-colleges", "faculty-teaching-centers"],
    innovationAreas: ["student-success"],
  });
  const evidenceOnly = grant({
    title: "Retention Lab evidence-only",
    whatItFunds: "Evidence-based student retention pilots",
    geography: "Oregon",
    locationEligibility: { scope: "state-or-territory", jurisdictions: ["OR"] },
    audiences: ["community-colleges", "faculty-teaching-centers"],
    innovationAreas: ["student-success"],
    scopeDisposition: "evidence-only",
  });
  const records = [match, wrongAudience, wrongGeography, evidenceOnly];

  const filters = withFilters({
    keyword: "EVIDENCE-BASED",
    audience: "community-colleges",
    area: "student-success",
    location: "OR",
  });
  assert.deepEqual(
    filterInnovationGrantOpportunities(records, filters, AS_OF).map((record) => record.id),
    [match.id],
  );
  assert.deepEqual(
    filterInnovationGrantOpportunities(
      [match],
      withFilters({ location: "CA" }),
      AS_OF,
    ),
    [],
  );
});

test("deadline modes use inclusive calendar-day boundaries and explicit rolling evidence", () => {
  const today = grant({ title: "Today", finalDeadlineDate: "2026-09-01" });
  const fourteen = grant({ title: "Fourteen", finalDeadlineDate: "2026-09-15" });
  const thirty = grant({ title: "Thirty", finalDeadlineDate: "2026-10-01" });
  const sixty = grant({ title: "Sixty", finalDeadlineDate: "2026-10-31" });
  const ninety = grant({ title: "Ninety", finalDeadlineDate: "2026-11-30" });
  const rollingDeadline = grant({
    title: "Rolling deadline",
    deadline: "Rolling; no fixed deadline stated",
    finalDeadlineDate: undefined,
  });
  const rollingQualifier = grant({
    title: "Rolling qualifier",
    deadline: "Applications accepted while the program is open",
    qualifiers: ["Rolling LOI"],
    finalDeadlineDate: undefined,
  });
  const missingDates = grant({
    title: "Missing dates",
    deadline: "Next cycle date not posted",
    finalDeadlineDate: undefined,
  });
  const records = [today, fourteen, thirty, sixty, ninety, rollingDeadline, rollingQualifier, missingDates];
  const idsFor = (deadline: "any" | "closing-14" | "30-plus" | "60-plus" | "90-plus" | "rolling") =>
    filterInnovationGrantOpportunities(records, withFilters({ deadline }), AS_OF).map(
      (record) => record.id,
    );

  assert.deepEqual(idsFor("any"), records.map((record) => record.id));
  assert.deepEqual(idsFor("closing-14"), [today.id, fourteen.id]);
  assert.deepEqual(idsFor("30-plus"), [thirty.id, sixty.id, ninety.id]);
  assert.deepEqual(idsFor("60-plus"), [sixty.id, ninety.id]);
  assert.deepEqual(idsFor("90-plus"), [ninety.id]);
  assert.deepEqual(idsFor("rolling"), [rollingDeadline.id, rollingQualifier.id]);
  assert.equal(isInnovationGrantRolling(rollingDeadline), true);
  assert.equal(isInnovationGrantRolling(rollingQualifier), true);
  assert.equal(isInnovationGrantRolling(missingDates), false);
});

test("cost-share classification remains narrow and feeds each cost-share bucket", () => {
  const required = grant({ costShareRequirement: "Cost share is required" });
  const requiredByMust = grant({ costShareRequirement: "Applicant must provide matching funds" });
  const notRequired = grant({ costShareRequirement: "No cost share required" });
  const prohibited = grant({ costShareRequirement: "Voluntary committed cost share is prohibited" });
  const allowedButNotRequired = grant({
    costShareRequirement: "Voluntary committed cost share is allowed but not required",
  });
  const notStated = grant({ costShareRequirement: "Not stated in the official source" });
  const indirectCostsOnly = grant({ costShareRequirement: "Not stated; indirect costs are prohibited" });
  const unknown = grant({ costShareRequirement: "The amount is not required" });
  const records = [
    required,
    requiredByMust,
    notRequired,
    prohibited,
    allowedButNotRequired,
    notStated,
    indirectCostsOnly,
    unknown,
  ];

  assert.equal(classifyInnovationGrantCostShare(required), "required");
  assert.equal(classifyInnovationGrantCostShare(requiredByMust), "required");
  assert.equal(classifyInnovationGrantCostShare(notRequired), "not-required");
  assert.equal(classifyInnovationGrantCostShare(prohibited), "not-required");
  assert.equal(classifyInnovationGrantCostShare(allowedButNotRequired), "not-required");
  assert.equal(classifyInnovationGrantCostShare(notStated), "not-stated");
  assert.equal(classifyInnovationGrantCostShare(indirectCostsOnly), "not-stated");
  assert.equal(classifyInnovationGrantCostShare(unknown), "not-stated");

  assert.deepEqual(
    filterInnovationGrantOpportunities(records, withFilters({ costShare: "required", status: "all" }), AS_OF).map(
      (record) => record.id,
    ),
    [required.id, requiredByMust.id],
  );
  assert.deepEqual(
    filterInnovationGrantOpportunities(
      records,
      withFilters({ costShare: "not-required", status: "all" }),
      AS_OF,
    ).map((record) => record.id),
    [notRequired.id, prohibited.id, allowedButNotRequired.id],
  );
  assert.deepEqual(
    filterInnovationGrantOpportunities(records, withFilters({ costShare: "not-stated", status: "all" }), AS_OF).map(
      (record) => record.id,
    ),
    [notStated.id, indirectCostsOnly.id, unknown.id],
  );
});

test("freshness uses inclusive Pacific-normalized calendar boundaries", () => {
  const thisWeekStart = grant({ title: "Six days old", portalAddedDate: "2026-08-26" });
  const thisWeekEnd = grant({ title: "Added today", portalAddedDate: "2026-09-01" });
  const weekTooOld = grant({ title: "Seven days old", portalAddedDate: "2026-08-25" });
  const thirtyDayStart = grant({ title: "Twenty-nine days old", portalAddedDate: "2026-08-03" });
  const thirtyDayTooOld = grant({ title: "Thirty days old", portalAddedDate: "2026-08-02" });
  const future = grant({ title: "Future addition", portalAddedDate: "2026-09-02" });
  const evidenceOnly = grant({
    title: "Evidence-only recent",
    portalAddedDate: "2026-08-31",
    scopeDisposition: "evidence-only",
  });
  const records = [
    thisWeekStart,
    thisWeekEnd,
    weekTooOld,
    thirtyDayStart,
    thirtyDayTooOld,
    future,
    evidenceOnly,
  ];

  assert.deepEqual(
    filterInnovationGrantOpportunities(records, withFilters({ freshness: "new-this-week" }), AS_OF).map(
      (record) => record.id,
    ),
    [thisWeekStart.id, thisWeekEnd.id],
  );
  assert.deepEqual(
    filterInnovationGrantOpportunities(records, withFilters({ freshness: "recently-added" }), AS_OF).map(
      (record) => record.id,
    ),
    [thisWeekStart.id, thisWeekEnd.id, weekTooOld.id, thirtyDayStart.id],
  );
});

test("active-filter count ignores the empty keyword and default values", () => {
  assert.equal(countInnovationGrantActiveFilters(DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS), 0);
  assert.equal(
    countInnovationGrantActiveFilters({
      ...DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS,
      keyword: "   ",
      status: "active",
    }),
    0,
  );
  assert.equal(
    countInnovationGrantActiveFilters({
      ...DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS,
      keyword: "AI",
      audience: "community-colleges",
      area: "student-success",
      status: "all",
      location: "OR",
      deadline: "rolling",
      costShare: "required",
      freshness: "recently-added",
    }),
    8,
  );
});

test("state and territory options are unique and query codes validate fail closed", () => {
  const codes = INNOVATION_GRANT_JURISDICTIONS.map(({ code }) => code);
  assert.equal(codes.length, 56);
  assert.equal(new Set(codes).size, codes.length);
  assert.equal(isInnovationGrantJurisdictionCode("CA"), true);
  assert.equal(isInnovationGrantJurisdictionCode("PR"), true);
  assert.equal(isInnovationGrantJurisdictionCode("California"), false);
  assert.equal(isInnovationGrantJurisdictionCode("ca"), false);
});

test("California includes nationwide and California records but excludes other, institution-only, and unresolved records", () => {
  const nationwide = grant({ title: "Nationwide" });
  const california = grant({
    title: "California",
    geography: "California",
    locationEligibility: { scope: "state-or-territory", jurisdictions: ["CA"] },
  });
  const regional = grant({
    title: "Regional",
    geography: "Western member states",
    locationEligibility: { scope: "regional", jurisdictions: ["CA", "OR", "WA"] },
  });
  const texas = grant({
    title: "Texas",
    geography: "Texas",
    locationEligibility: { scope: "state-or-territory", jurisdictions: ["TX"] },
  });
  const institutionOnly = grant({
    title: "Stanford only",
    geography: "Stanford University only",
    locationEligibility: { scope: "institution-only" },
  });
  const unresolved = grant({
    title: "Unresolved states",
    locationEligibility: { scope: "unresolved" },
  });
  const missing = grant({ title: "Missing metadata", locationEligibility: undefined });
  const records = [nationwide, california, regional, texas, institutionOnly, unresolved, missing];

  assert.deepEqual(
    filterInnovationGrantOpportunities(records, withFilters({ location: "CA" }), AS_OF).map(
      (record) => record.id,
    ),
    [nationwide.id, california.id, regional.id],
  );
  assert.deepEqual(
    filterInnovationGrantOpportunities(records, withFilters({ location: "all" }), AS_OF).map(
      (record) => record.id,
    ),
    records.map((record) => record.id),
  );
  assert.equal(getInnovationGrantLocationBadge(nationwide, "CA"), "Nationwide");
  assert.equal(getInnovationGrantLocationBadge(california, "CA"), "California only");
  assert.equal(getInnovationGrantLocationBadge(regional, "CA"), "Regional · Includes California");
  assert.equal(getInnovationGrantLocationBadge(institutionOnly, "all"), "Institution-specific");
  assert.equal(getInnovationGrantLocationBadge(unresolved, "all"), "Location review needed");
});

test("territories match only opportunities whose verified scope explicitly includes territories", () => {
  const statesOnly = grant({ title: "States only" });
  const territories = grant({
    title: "States and territories",
    locationEligibility: { scope: "nationwide", includesTerritories: true },
  });
  const puertoRicoOnly = grant({
    title: "Puerto Rico only",
    locationEligibility: { scope: "state-or-territory", jurisdictions: ["PR"] },
  });

  assert.deepEqual(
    filterInnovationGrantOpportunities(
      [statesOnly, territories, puertoRicoOnly],
      withFilters({ location: "PR" }),
      AS_OF,
    ).map((record) => record.id),
    [territories.id, puertoRicoOnly.id],
  );
});

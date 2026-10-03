import assert from "node:assert/strict";
import { register } from "node:module";
import test from "node:test";

register("./innovationGrantsTestLoader.mjs", import.meta.url);

const {
  chooseNewMatchingGrants,
  getInnovationGrantPerAwardCeilingUsd,
} = await import("../lib/grantAlertMatching.ts");
const {
  MAX_GRANT_ALERT_CSV_BYTES,
  parseGrantAlertPreferences,
} = await import("../lib/grantAlertPreferences.ts");
const { INNOVATION_GRANTS_AUDIENCE_FILTERS, INNOVATION_GRANTS_AREA_FILTERS } = await import(
  "../lib/innovation-grants-shared.ts"
);
const { INNOVATION_GRANT_JURISDICTIONS } = await import("../lib/innovation-grants-directory.ts");
import type { InnovationGrantOpportunity } from "../lib/innovation-grants-shared.ts";
import type { GrantAlertPreferences } from "../lib/grantAlertPreferences.ts";

let nextId = 1;

function grant(overrides: Partial<InnovationGrantOpportunity> = {}): InnovationGrantOpportunity {
  const id = nextId;
  nextId += 1;

  return {
    id,
    title: `Grant ${id}`,
    source: "Test source",
    officialUrl: `https://example.test/grant/${id}`,
    applicationStatus: "open-now",
    announcedDate: "Sep. 1, 2026",
    portalAddedDate: "2026-09-22",
    announcementWindow: "Current call",
    awardAmount: "$10,000 per award",
    eligibility: "U.S. higher education institutions",
    whatItFunds: "Teaching and learning innovation",
    geography: "United States",
    locationEligibility: { scope: "nationwide", includesTerritories: false },
    costShareRequirement: "Not stated",
    applicationAccess: "Apply through the official source",
    deadline: "Applications due Oct. 1, 2026",
    deadlineTimeZone: "Pacific Time",
    lastVerified: "Sep. 26, 2026",
    finalDeadlineDate: "2026-10-01",
    qualifiers: [],
    recommendationRank: id,
    audiences: ["community-colleges"],
    innovationAreas: ["ai-emerging-technology"],
    scopeDisposition: "included",
    bestFit: "A test opportunity for grant-alert matching.",
    inventoryOrigin: "weekly-new",
    ...overrides,
  };
}

function preferences(overrides: Partial<GrantAlertPreferences> = {}): GrantAlertPreferences {
  return {
    audiences: [],
    locations: [],
    areas: [],
    minimumAwardUsd: null,
    ...overrides,
  };
}

function window(overrides: Partial<Parameters<typeof chooseNewMatchingGrants>[2]> = {}) {
  return {
    sinceInclusive: "2026-09-20",
    untilExclusive: "2026-09-27",
    subscribedAt: "2026-09-18T10:00:00-07:00",
    asOf: new Date("2026-09-26T18:00:00.000Z"),
    ...overrides,
  };
}

test("preferences accept only bounded allowlisted IDs and normalize UI arrays or stored CSV", () => {
  const parsed = parseGrantAlertPreferences({
    audiences: "community-colleges,four-year-colleges-universities",
    locations: ["CA", "TX"],
    areas: "ai-emerging-technology,teaching-learning",
    minimumAwardUsd: "25000",
  });
  assert.deepEqual(parsed, {
    ok: true,
    preferences: {
      audiences: ["community-colleges", "four-year-colleges-universities"],
      locations: ["CA", "TX"],
      areas: ["ai-emerging-technology", "teaching-learning"],
      minimumAwardUsd: 25_000,
    },
  });

  assert.deepEqual(
    parseGrantAlertPreferences({ audiences: "", locations: "", areas: [], minimumAwardUsd: "" }),
    { ok: true, preferences: { audiences: [], locations: [], areas: [], minimumAwardUsd: null } },
  );
});

test("preferences reject malformed fields, unknown tokens, duplicates, and unbounded values", () => {
  assert.equal(parseGrantAlertPreferences(null).ok, false);
  assert.deepEqual(
    parseGrantAlertPreferences({ audiences: [], locations: [], areas: [] }),
    { ok: false, reason: "missing-field" },
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: ["all"], locations: [], areas: [], minimumAwardUsd: null }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: ["community-colleges", "community-colleges"], locations: [], areas: [], minimumAwardUsd: null }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: [], locations: ["XX"], areas: [], minimumAwardUsd: null }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: [], locations: [], areas: ["free text"], minimumAwardUsd: null }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: [], locations: [], areas: [], minimumAwardUsd: "5,000" }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: [], locations: [], areas: [], minimumAwardUsd: 1_000_000_001 }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: [], locations: [], areas: [], minimumAwardUsd: null, note: "extra" }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: "x".repeat(MAX_GRANT_ALERT_CSV_BYTES + 1), locations: [], areas: [], minimumAwardUsd: null }).ok,
    false,
  );
});

test("all supported UI choices fit the stored CSV byte limit when arrays are serialized", () => {
  const parsed = parseGrantAlertPreferences({
    audiences: INNOVATION_GRANTS_AUDIENCE_FILTERS.map(({ id }) => id).filter((id) => id !== "all"),
    locations: INNOVATION_GRANT_JURISDICTIONS.map(({ code }) => code),
    areas: INNOVATION_GRANTS_AREA_FILTERS.map(({ id }) => id).filter((id) => id !== "all"),
    minimumAwardUsd: null,
  });

  assert.equal(parsed.ok, true);
  if (parsed.ok) {
    assert.ok(new TextEncoder().encode(parsed.preferences.audiences.join(",")).byteLength <= MAX_GRANT_ALERT_CSV_BYTES);
    assert.ok(new TextEncoder().encode(parsed.preferences.locations.join(",")).byteLength <= MAX_GRANT_ALERT_CSV_BYTES);
    assert.ok(new TextEncoder().encode(parsed.preferences.areas.join(",")).byteLength <= MAX_GRANT_ALERT_CSV_BYTES);
  }
});

test("per-award parsing ignores program-pool totals and returns null for ambiguous amounts", () => {
  assert.equal(getInnovationGrantPerAwardCeilingUsd("Up to $125,000 per award"), 125_000);
  assert.equal(getInnovationGrantPerAwardCeilingUsd("Awards range from $5,000–$20,000 per award"), 20_000);
  assert.equal(getInnovationGrantPerAwardCeilingUsd("$7,500 each award"), 7_500);
  assert.equal(getInnovationGrantPerAwardCeilingUsd("$2,500,000 current program pool"), null);
  assert.equal(getInnovationGrantPerAwardCeilingUsd("$5,000 to $20,000"), null);
  assert.equal(getInnovationGrantPerAwardCeilingUsd("$20,000 per award; $2,000,000 program pool"), 20_000);
  assert.equal(getInnovationGrantPerAwardCeilingUsd("$228,571 per award; approximately $8 million in current program funding"), 228_571);
  assert.equal(getInnovationGrantPerAwardCeilingUsd("Up to $750,000 per award; $10.75 million total program funding"), 750_000);
  assert.equal(getInnovationGrantPerAwardCeilingUsd("$20,000 per award; $30,000 for another award"), null);
});

test("minimum award uses explicit individual awards and never the published program pool", () => {
  const explicit = grant({
    id: 201,
    awardAmount: "Up to $75,000 per award",
    publishedProgramPoolUsd: 1_500_000,
  });
  const poolOnly = grant({
    id: 202,
    awardAmount: "$1,500,000 current program pool",
    publishedProgramPoolUsd: 1_500_000,
  });
  const below = grant({ id: 203, awardAmount: "$7,500 per award" });
  const unknown = grant({ id: 204, awardAmount: "Amount varies by project" });

  assert.deepEqual(
    chooseNewMatchingGrants(
      [explicit, poolOnly, below, unknown],
      preferences({ minimumAwardUsd: 50_000 }),
      window(),
    ).map(({ id }) => id),
    [201],
  );
});

test("categories AND across kinds and OR within selected values", () => {
  const fitsFirstOptions = grant({
    id: 301,
    audiences: ["community-colleges"],
    innovationAreas: ["teaching-learning"],
    locationEligibility: { scope: "state-or-territory", jurisdictions: ["CA"] },
  });
  const fitsOtherOptions = grant({
    id: 302,
    audiences: ["four-year-colleges-universities"],
    innovationAreas: ["ai-emerging-technology"],
    locationEligibility: { scope: "state-or-territory", jurisdictions: ["TX"] },
  });
  const wrongArea = grant({
    id: 303,
    audiences: ["community-colleges"],
    innovationAreas: ["workforce-pathways"],
    locationEligibility: { scope: "state-or-territory", jurisdictions: ["TX"] },
  });
  const wrongAudience = grant({
    id: 304,
    audiences: ["faculty-teaching-centers"],
    innovationAreas: ["teaching-learning"],
    locationEligibility: { scope: "state-or-territory", jurisdictions: ["CA"] },
  });

  const result = chooseNewMatchingGrants(
    [fitsOtherOptions, wrongArea, fitsFirstOptions, wrongAudience],
    preferences({
      audiences: ["community-colleges", "four-year-colleges-universities"],
      areas: ["ai-emerging-technology", "teaching-learning"],
      locations: ["CA", "TX"],
    }),
    window(),
  );
  assert.deepEqual(result.map(({ id }) => id), [301, 302]);
});

test("unknown selected geography and institution-only opportunities fail closed", () => {
  const unknown = grant({ id: 401, locationEligibility: { scope: "unresolved" } });
  const missing = grant({ id: 402, locationEligibility: undefined });
  const institutionOnly = grant({ id: 403, locationEligibility: { scope: "institution-only" } });

  assert.deepEqual(
    chooseNewMatchingGrants(
      [unknown, missing, institutionOnly],
      preferences({ audiences: ["community-colleges"], locations: ["CA"] }),
      window(),
    ),
    [],
  );
  // Unresolved geography can match when the subscriber has not selected a location.
  assert.deepEqual(
    chooseNewMatchingGrants([unknown, missing, institutionOnly], preferences(), window()).map(({ id }) => id),
    [401],
  );
});

test("evidence-only, launch-held/raw, closed, watchlist, and future opportunities are excluded", () => {
  const evidence = grant({ id: 501, scopeDisposition: "evidence-only" });
  const rawUnprojected = grant({ id: 502, locationEligibility: undefined });
  const closed = grant({ id: 503, finalDeadlineDate: "2026-09-25" });
  const watchlist = grant({ id: 504, applicationStatus: "recurring-watchlist" });
  const future = grant({ id: 505, applicationStatus: "opening-soon", openDate: "2026-09-27" });

  assert.deepEqual(
    chooseNewMatchingGrants([evidence, rawUnprojected, closed, watchlist, future], preferences(), window()),
    [],
  );
});

test("date-only weekly windows are inclusive/exclusive and signup/digest cutoffs are conservative", () => {
  const onStart = grant({ id: 601, portalAddedDate: "2026-09-20" });
  const beforeEnd = grant({ id: 602, portalAddedDate: "2026-09-26" });
  const atEnd = grant({ id: 603, portalAddedDate: "2026-09-27" });
  const sameSignupDay = grant({ id: 604, portalAddedDate: "2026-09-20" });

  assert.deepEqual(
    chooseNewMatchingGrants([onStart, beforeEnd, atEnd], preferences(), window()).map(({ id }) => id),
    [601, 602],
  );
  assert.deepEqual(
    chooseNewMatchingGrants(
      [sameSignupDay, onStart, beforeEnd],
      preferences(),
      window({ subscribedAt: "2026-09-20T10:00:00-07:00", lastCoveredUntilExclusive: "2026-09-22" }),
    ).map(({ id }) => id),
    [602],
  );
  assert.deepEqual(
    chooseNewMatchingGrants(
      [onStart],
      preferences(),
      window({ subscribedAt: "not a timestamp" }),
    ),
    [],
  );
});

test("active lifecycle uses the supplied Pacific calendar day", () => {
  const expiresSeptember26 = grant({ id: 701, finalDeadlineDate: "2026-09-26" });
  const beforePacificMidnight = chooseNewMatchingGrants(
    [expiresSeptember26],
    preferences(),
    window({ asOf: new Date("2026-09-27T06:59:00.000Z") }),
  );
  const afterPacificMidnight = chooseNewMatchingGrants(
    [expiresSeptember26],
    preferences(),
    window({ asOf: new Date("2026-09-27T07:01:00.000Z") }),
  );

  assert.deepEqual(beforePacificMidnight.map(({ id }) => id), [701]);
  assert.deepEqual(afterPacificMidnight, []);
});

test("consecutive weekly coverage keeps grants added on the previous send date", () => {
  const sendDayGrant = grant({ id: 750, portalAddedDate: "2026-09-26", finalDeadlineDate: "2026-10-30" });
  assert.deepEqual(chooseNewMatchingGrants([sendDayGrant], preferences(), window({ sinceInclusive: "2026-09-19", untilExclusive: "2026-09-26" })), []);
  assert.deepEqual(chooseNewMatchingGrants([sendDayGrant], preferences(), window({ sinceInclusive: "2026-09-26", untilExclusive: "2026-10-03", lastCoveredUntilExclusive: "2026-09-26", asOf: new Date("2026-10-03T18:00:00Z") })).map(({ id }) => id), [750]);
});

test("results have deterministic portal-added date then stable id ordering and no duplicate ids", () => {
  const newerHigh = grant({ id: 802, portalAddedDate: "2026-09-24" });
  const older = grant({ id: 801, portalAddedDate: "2026-09-22" });
  const newerLow = grant({ id: 803, portalAddedDate: "2026-09-24" });
  const duplicateId = grant({ id: 803, portalAddedDate: "2026-09-23" });

  assert.deepEqual(
    chooseNewMatchingGrants([newerHigh, older, newerLow, duplicateId], preferences(), window()).map(({ id }) => id),
    [801, 802],
  );
});

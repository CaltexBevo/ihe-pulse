import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { register } from "node:module";

register("./innovationGrantsTestLoader.mjs", import.meta.url);

const {
  getPublicInnovationGrantFundingSnapshot,
  getPublicInnovationGrants,
  INNOVATION_GRANTS_LAUNCH_HELD_IDS,
} = await import("../lib/data/innovation-grants-public.ts");
const { getInnovationGrantLifecycle, getInnovationGrantFundingSnapshot } = await import("../lib/innovation-grants-shared.ts");
const {
  DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS,
  filterInnovationGrantOpportunities,
} = await import("../lib/innovation-grants-directory.ts");
const { innovationGrants, INNOVATION_GRANTS_VERIFIED_ON, INNOVATION_GRANTS_FULL_SEARCH_DATE } = await import("../lib/data/innovation-grants.ts");

const AS_OF = new Date("2026-09-15T00:00:00.000Z");

test("verification copy discloses retained review flags rather than claiming every uncertain path is hidden", () => {
  for (const path of ["../app/innovation-grants/page.tsx", "../app/innovation-grants/directory/InnovationGrantsDirectory.tsx"]) {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.ok(source.includes("Temporary access problems and unresolved source discrepancies are flagged in listing details, without advancing the last full-verification date. Some records remain withheld until their release checks are resolved."));
    assert.ok(!source.includes("Unresolved source conflicts and unavailable application paths are held for review and do not appear in this launch."));
  }
});

test("September 17 archives expired funding without deleting records or refreshing uncertain sources", () => {
  const records = getPublicInnovationGrants();
  const today = new Date("2026-09-17T00:00:00.000Z");
  const snapshot = getPublicInnovationGrantFundingSnapshot(today);
  assert.equal(snapshot.publishedProgramPoolUsd, 49_982_403);
  assert.equal(snapshot.publishedProgramPoolCount, 12);
  assert.equal(snapshot.approximatePoolCount, 7);
  assert.equal(snapshot.openOpportunityCount, 33);
  assert.equal(snapshot.closingSoonCount, 9);
  assert.equal(snapshot.openingSoonCount, 0);
  assert.equal(records.length, 46);
  assert.equal(records.filter((record) => getInnovationGrantLifecycle(record, today) === "closed").length, 8);
  const nj = records.find((record) => record.id === 68);
  assert.equal(getInnovationGrantLifecycle(nj, new Date("2026-09-16T00:00:00.000Z")), "closing-soon");
  assert.equal(getInnovationGrantLifecycle(nj, today), "closed");
  assert.equal(nj.deadlineTimeZone, "Eastern Time");
  assert.match(nj.sourceNotes, /official grants index explicitly supplies Eastern Time/);
  assert.equal(records.find((record) => record.id === 67).lastVerified, "Sep 20, 2026");
  assert.match(records.find((record) => record.id === 67).sourceNotes, /Sept\. 18 Q&A now answers question 21/);
  assert.match(records.find((record) => record.id === 67).eligibility, /20 U\.S\.C\. §1001/);
  assert.equal(records.find((record) => record.id === 79).lastVerified, "Sep 9, 2026");
  assert.equal(records.find((record) => record.id === 83).lastVerified, "Sep 14, 2026");
  const coi = records.find((record) => record.id === 77);
  assert.match(coi.eligibility, /free ECI community registration/);
  assert.match(coi.applicationAccess, /does not allow generative or assistive AI/);
  assert.match(coi.deadline, /September 2026 through June 2028/);
});

test("daily verification preserves source dates and holds the conflicted EPA record outside public payloads", () => {
  assert.equal(INNOVATION_GRANTS_VERIFIED_ON, "Sep 20, 2026");
  assert.equal(INNOVATION_GRANTS_FULL_SEARCH_DATE, "Sep 14, 2026");
  const verifiedIds = [38, 43, 44, 53, 54, 55, 59, 61, 62, 64, 67, 69, 71, 76, 77, 81, 89, 90, 91];
  assert.deepEqual(innovationGrants.filter((record) => record.id < 92 && record.lastVerified === "Sep 20, 2026").map((record) => record.id), verifiedIds);
  assert.equal(innovationGrants.find((record) => record.id === 79).lastVerified, "Sep 9, 2026");
  const epa = innovationGrants.find((record) => record.id === 66);
  assert.equal(epa.lastVerified, "Sep 8, 2026");
  assert.ok(epa.publishedProgramPoolUsd > 0);
  assert.ok(!JSON.stringify(getPublicInnovationGrants()).includes(epa.title));
  const publicRecords = getPublicInnovationGrants();
  for (const [id, pool] of [[54, 4_850_000], [65, 8_000_000]]) {
    const record = publicRecords.find((opportunity) => opportunity.id === id);
    assert.equal(record.publishedProgramPoolUsd, pool);
    assert.equal(record.publishedProgramPoolApproximate, true);
  }
  const counts = publicRecords.filter((record) => record.id < 92).reduce((result, record) => {
    const status = getInnovationGrantLifecycle(record, AS_OF);
    result[status] = (result[status] ?? 0) + 1;
    return result;
  }, {});
  assert.deepEqual(counts, { "closing-soon": 6, "open-now": 20, closed: 7, "recurring-watchlist": 4 });
});

test("September 12 closes Gates and Arnold while TCRGP advances to its next phase", () => {
  const records = getPublicInnovationGrants();
  const nextDay = new Date("2026-09-12T00:00:00.000Z");
  for (const id of [42, 86]) {
    const record = records.find((opportunity) => opportunity.id === id);
    assert.equal(getInnovationGrantLifecycle(record, new Date("2026-09-11T00:00:00.000Z")), "closing-soon");
    assert.equal(getInnovationGrantLifecycle(record, nextDay), "closed");
  }
  assert.equal(getInnovationGrantLifecycle(records.find((record) => record.id === 80), nextDay), "open-now");
});

test("public projection contains exactly the Sep. 14 cleared launch subset", () => {
  const records = getPublicInnovationGrants().filter((record) => record.id < 92);
  const ids = records.map((record) => record.id);

  assert.equal(innovationGrants.filter((record) => record.id < 92).length, 54);
  assert.equal(records.length, 37);
  assert.deepEqual(ids, [38, 42, 43, 44, 51, 52, 53, 54, 55, 59, 61, 62, 63, 64, 65, 67, 68, 69, 71, 72, 73, 75, 76, 77, 78, 79, 80, 81, 82, 83, 85, 86, 87, 88, 89, 90, 91]);
  assert.ok(records.every((record) => record.scopeDisposition === "included"));
  assert.deepEqual([...INNOVATION_GRANTS_LAUNCH_HELD_IDS], [48, 56, 57, 58, 60, 66, 70, 74, 84]);
  assert.ok(INNOVATION_GRANTS_LAUNCH_HELD_IDS.every((id) => !ids.includes(id)));
  assert.ok([61, 78, 79, 80].every((id) => ids.includes(id)));
  assert.ok(records.every((record) => record.locationEligibility));
});

test("public California filtering includes national and California opportunities while failing closed", () => {
  const records = getPublicInnovationGrants();
  const matches = filterInnovationGrantOpportunities(
    records,
    {
      ...DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS,
      status: "all",
      location: "CA",
    },
    AS_OF,
  );
  const ids = matches.map((record) => record.id);

  assert.ok(ids.includes(42));
  assert.ok(ids.includes(59));
  assert.ok(ids.includes(90));
  assert.ok(!ids.some((id) => [38, 43, 52, 54, 55, 68, 76, 82, 85, 89].includes(id)));
  assert.ok(matches.every((record) => record.locationEligibility.scope !== "institution-only"));
  assert.ok(matches.every((record) => record.locationEligibility.scope !== "unresolved"));
});

test("new discovery records preserve pool scope, dates, and rolling submission semantics", () => {
  const records = getPublicInnovationGrants();
  const crsm = records.find((record) => record.id === 89);
  const rn = records.find((record) => record.id === 90);
  const cer = records.find((record) => record.id === 91);
  assert.equal(new Set(innovationGrants.filter((record) => record.id < 92).map((record) => record.id)).size, 54);
  assert.deepEqual(innovationGrants.filter((record) => record.portalAddedDate === "2026-09-14").map((record) => record.id), [89, 90, 91]);
  assert.equal(crsm.publishedProgramPoolUsd, 2_000_000);
  assert.equal(crsm.publishedProgramPoolApproximate, true);
  assert.equal(crsm.priorityDeadlineDate, undefined);
  assert.equal(rn.publishedProgramPoolUsd, 2_725_000);
  assert.equal(rn.priorityDeadlineDate, "2026-10-08");
  assert.equal(rn.finalDeadlineDate, "2026-10-22");
  assert.equal(cer.publishedProgramPoolUsd, undefined);
  assert.equal(cer.finalDeadlineDate, undefined);
  assert.equal(getInnovationGrantLifecycle(cer, AS_OF), "open-now");
});

test("ACS recovery and ECMC hold preserve the researched canonical evidence", () => {
  const acs = getPublicInnovationGrants().find((record) => record.id === 53);
  const ecmc = innovationGrants.find((record) => record.id === 60);
  assert.equal(acs.finalDeadlineDate, "2026-10-07");
  assert.equal(acs.applicationUrl, "https://www.grantinterface.com/Home/Logon?urlkey=acs");
  assert.equal(acs.portalAddedDate, "2026-08-30");
  assert.equal(ecmc.lastVerified, "Sep 11, 2026");
  assert.match(ecmc.applicationAccess, /disabled/);
  assert.ok(!JSON.stringify(getPublicInnovationGrants()).includes(ecmc.title));
});

test("September 15 non-corporate funding snapshot preserves the cleared records", () => {
  const snapshot = getInnovationGrantFundingSnapshot(getPublicInnovationGrants().filter((record) => record.id < 92), AS_OF);
  assert.equal(snapshot.publishedProgramPoolUsd, 46_782_403);
  assert.equal(snapshot.publishedProgramPoolCount, 12);
  assert.equal(snapshot.approximatePoolCount, 6);
  assert.equal(snapshot.openOpportunityCount, 26);
  assert.equal(snapshot.closingSoonCount, 6);
  assert.equal(snapshot.openingSoonCount, 0);
  assert.equal(snapshot.currentCallsWithoutPublishedPool, 14);
});

test("focused corporate additions preserve whole-inventory freshness and inclusive location semantics", () => {
  const records = getPublicInnovationGrants();
  const additions = records.filter((record) => record.id >= 92);
  const today = new Date("2026-09-15T00:00:00.000Z");
  assert.equal(innovationGrants.length, 63);
  assert.equal(new Set(innovationGrants.map((record) => record.id)).size, 63);
  assert.equal(records.length, 46);
  assert.deepEqual(additions.map((record) => record.id), [92, 93, 94, 95, 96, 97, 98, 99, 100]);
  assert.ok(additions.every((record) => record.portalAddedDate === "2026-09-15"));
  assert.ok(additions.every((record) => record.lastVerified === (record.id === 99 ? "Sep 15, 2026" : record.id === 96 ? "Sep 17, 2026" : "Sep 20, 2026")));
  assert.equal(INNOVATION_GRANTS_VERIFIED_ON, "Sep 20, 2026");
  assert.equal(INNOVATION_GRANTS_FULL_SEARCH_DATE, "Sep 14, 2026");
  const californiaIds = filterInnovationGrantOpportunities(records, {
    ...DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS, location: "CA", status: "all",
  }, today).map((record) => record.id);
  assert.ok([92, 93, 94, 95, 96, 97, 98, 100].every((id) => californiaIds.includes(id)));
  assert.ok(!californiaIds.includes(99));
  assert.equal(getInnovationGrantLifecycle(additions.find((record) => record.id === 99), today), "recurring-watchlist");
  assert.equal(getInnovationGrantLifecycle(additions.find((record) => record.id === 92), new Date("2026-09-22T00:00:00.000Z")), "closed");
  assert.ok(!JSON.stringify(records).includes("Teen Development Research Grant"));
});

test("corporate cash tally excludes credits, requested caps, broad commitments, and watchlists", () => {
  const today = new Date("2026-09-15T00:00:00.000Z");
  const records = getPublicInnovationGrants();
  const additions = records.filter((record) => record.id >= 92);
  const inKind = additions.filter((record) => record.fundingType === "in-kind");
  assert.equal(inKind.length, 7);
  assert.ok(inKind.every((record) => record.publishedProgramPoolUsd === undefined));
  assert.ok(inKind.filter((record) => record.id !== 99).every((record) => /not cash/.test(record.awardAmount) && /not cash/.test(record.eligibilityBadge)));
  assert.equal(additions.find((record) => record.id === 93).publishedProgramPoolUsd, undefined);
  const corporate = getInnovationGrantFundingSnapshot(additions, today);
  assert.equal(corporate.publishedProgramPoolUsd, 5_000_000);
  assert.equal(corporate.approximatePoolCount, 1);
  assert.equal(corporate.openOpportunityCount, 8);
  const snapshot = getPublicInnovationGrantFundingSnapshot(today);
  assert.equal(snapshot.publishedProgramPoolUsd, 51_782_403);
  assert.equal(snapshot.publishedProgramPoolCount, 13);
  assert.equal(snapshot.approximatePoolCount, 7);
  assert.equal(snapshot.openOpportunityCount, 34);
  assert.equal(snapshot.closingSoonCount, 7);
  assert.equal(snapshot.openingSoonCount, 0);
  // A mistakenly populated in-kind pool must still fail closed for cash.
  assert.equal(getInnovationGrantFundingSnapshot([{ ...inKind[0], publishedProgramPoolUsd: 100_000_000 }], today).publishedProgramPoolUsd, 0);
});

test("recovered records retain evidence and exclude scope-mixed pools", () => {
  const records = getPublicInnovationGrants();
  const tcup = records.find((opportunity) => opportunity.id === 61);
  const hec = records.find((opportunity) => opportunity.id === 78);
  const nlgca = records.find((opportunity) => opportunity.id === 79);
  const tcrgp = records.find((opportunity) => opportunity.id === 80);

  assert.ok(tcup && hec && nlgca && tcrgp);
  assert.equal(tcup.publishedProgramPoolUsd, undefined);
  assert.equal(tcrgp.publishedProgramPoolUsd, undefined);
  assert.equal(hec.publishedProgramPoolUsd, 5_700_000);
  assert.equal(hec.publishedProgramPoolApproximate, true);
  assert.equal(nlgca.publishedProgramPoolUsd, 5_700_000);
  assert.equal(nlgca.publishedProgramPoolApproximate, true);
  assert.match(tcup.lastVerified, /Sep 20, 2026/);
  assert.match(tcup.deadline, /submitting-organization local time/);
  assert.match(tcup.applicationAccess, /Research\.gov/);
  assert.doesNotMatch(tcup.awardAmount, /10\.3 million/);
  assert.match(hec.eligibility, /four-year or graduate-level/);
  assert.match(hec.eligibility, /research foundations maintained/);
  assert.match(nlgca.awardAmount, /up to \$30,000/);
  assert.match(nlgca.awardAmount, /minimum differs/);
  assert.match(nlgca.awardAmount, /up to \$150,000/);
  assert.match(nlgca.awardAmount, /up to \$300,000/);
  assert.match(nlgca.awardAmount, /up to \$750,000/);
  assert.doesNotMatch(tcrgp.awardAmount, /11\.574 million/);
  assert.match(tcrgp.deadline, /Phase II closed/);
  assert.match(tcrgp.deadline, /Phase III submission deadline/);
  assert.equal(tcrgp.priorityDeadlineDate, "2026-09-11");
  assert.equal(tcrgp.finalDeadlineDate, "2026-12-31");
});

test("lifecycle rolls off Sep. 9 and advances TCRGP by phase", () => {
  const record = getPublicInnovationGrants().find((opportunity) => opportunity.id === 51);
  assert.ok(record);
  assert.equal(getInnovationGrantLifecycle(record, new Date("2026-09-08T00:00:00.000Z")), "closing-soon");
  assert.equal(getInnovationGrantLifecycle(record, new Date("2026-09-09T00:00:00.000Z")), "closing-soon");
  assert.equal(getInnovationGrantLifecycle(record, new Date("2026-09-15T00:00:00.000Z")), "closed");

  const redArchive = getPublicInnovationGrants().find((opportunity) => opportunity.id === 63);
  const tipArchive = getPublicInnovationGrants().find((opportunity) => opportunity.id === 85);
  const tcrgp = getPublicInnovationGrants().find((opportunity) => opportunity.id === 80);
  assert.ok(redArchive && tipArchive && tcrgp);
  assert.equal(getInnovationGrantLifecycle(redArchive, AS_OF), "closed");
  assert.equal(getInnovationGrantLifecycle(tipArchive, AS_OF), "closed");
  assert.equal(getInnovationGrantLifecycle(tcrgp, new Date("2026-09-10T00:00:00.000Z")), "closing-soon");
  assert.equal(getInnovationGrantLifecycle(tcrgp, new Date("2026-09-11T00:00:00.000Z")), "closing-soon");
  assert.equal(getInnovationGrantLifecycle(tcrgp, new Date("2026-09-12T00:00:00.000Z")), "open-now");
  assert.equal(getInnovationGrantLifecycle(tcrgp, new Date("2026-12-30T00:00:00.000Z")), "closing-soon");
  assert.equal(getInnovationGrantLifecycle(tcrgp, new Date("2027-01-01T00:00:00.000Z")), "closed");
});
test("BJA continuation requires the completed first step and uses JustGrants", () => {
  const record = getPublicInnovationGrants().find((opportunity) => opportunity.id === 81);
  assert.equal(record.applicationUrl, "https://justgrants.usdoj.gov");
  assert.match(record.eligibility, /must have completed the Sept\. 14 Grants\.gov first step/);
  assert.equal(record.eligibilityBadge, "Prior first-step submission required");
  assert.match(record.applicationAccess, /Only applicants who submitted that first step by Sept\. 14/);
  assert.equal(record.finalDeadlineDate, "2026-09-21");
  assert.equal(getInnovationGrantLifecycle(record, AS_OF), "closing-soon");
});

test("Wake Forest stays on the planning watchlist until its actual application entry is verified", () => {
  const record = getPublicInnovationGrants().find((opportunity) => opportunity.id === 83);
  assert.equal(record.lastVerified, "Sep 14, 2026");
  assert.equal(record.applicationStatus, "recurring-watchlist");
  assert.equal(getInnovationGrantLifecycle(record, AS_OF), "recurring-watchlist");
  assert.match(record.applicationAccess, /no application link was available/);
  assert.match(record.deadline, /mandatory LOI/);
  assert.equal(record.publishedProgramPoolUsd, undefined);
});

test("September 20 keeps degraded application routes and source conflicts visibly flagged without false freshness", () => {
  const records = getPublicInnovationGrants();
  const today = new Date("2026-09-20T00:00:00.000Z");
  const snapshot = getPublicInnovationGrantFundingSnapshot(today);
  assert.equal(snapshot.publishedProgramPoolUsd, 49_982_403);
  assert.equal(snapshot.openOpportunityCount, 33);
  assert.equal(snapshot.publishedProgramPoolCount, 12);
  assert.equal(snapshot.approximatePoolCount, 7);
  assert.equal(records.filter((record) => getInnovationGrantLifecycle(record, today) === "closed").length, 8);
  assert.equal(innovationGrants.filter((record) => record.lastVerified === "Sep 20, 2026").length, 26);
  for (const id of [65, 78, 79, 80, 87, 88]) {
    const record = records.find((item) => item.id === id);
    assert.equal(record.lastVerified, id === 79 ? "Sep 9, 2026" : "Sep 17, 2026");
    assert.match(record.applicationAccess, /Access review needed \(Sep\. 20, 2026\)/);
    assert.match(record.applicationAccess, /Sept\. 21 at 6 a\.m\. ET/);
    assert.match(record.applicationAccess, /Submission access is not verified/);
    assert.ok(record.qualifiers.includes("Application access needs recheck"));
    assert.notEqual(getInnovationGrantLifecycle(record, today), "closed");
  }
  const credits = records.find((record) => record.id === 96);
  assert.equal(credits.lastVerified, "Sep 17, 2026");
  assert.match(credits.sourceNotes, /Sep\. 20, 2026 partial recheck/);
  const doe = records.find((record) => record.id === 67);
  assert.doesNotMatch(doe.eligibility, /under DOE review/);
  assert.match(doe.sourceNotes, /dfb8bdff-57a3-4d00-8002-613cd7fe7483/);
  assert.match(doe.eligibility, /principal investigator must be an employee of the prime applicant/);
  const ev = records.find((record) => record.id === 55);
  assert.equal(ev.publishedProgramPoolApproximate, true);
  assert.match(ev.awardAmount, /estimated program funding/);
});

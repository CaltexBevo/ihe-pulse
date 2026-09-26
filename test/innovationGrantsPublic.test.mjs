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

test("current inventory evaluated at the September 17 cutoff archives expired funding", () => {
  const records = getPublicInnovationGrants().filter((record) => record.id < 101);
  const today = new Date("2026-09-17T00:00:00.000Z");
  const snapshot = getInnovationGrantFundingSnapshot(records, today);
  assert.equal(snapshot.publishedProgramPoolUsd, 49_982_403);
  assert.equal(snapshot.publishedProgramPoolCount, 12);
  assert.equal(snapshot.approximatePoolCount, 7);
  assert.equal(snapshot.openOpportunityCount, 36);
  assert.equal(snapshot.closingSoonCount, 9);
  assert.equal(snapshot.openingSoonCount, 0);
  assert.equal(records.length, 47);
  assert.equal(records.filter((record) => getInnovationGrantLifecycle(record, today) === "closed").length, 8);
  const nj = records.find((record) => record.id === 68);
  assert.equal(getInnovationGrantLifecycle(nj, new Date("2026-09-16T00:00:00.000Z")), "closing-soon");
  assert.equal(getInnovationGrantLifecycle(nj, today), "closed");
  assert.equal(nj.deadlineTimeZone, "Eastern Time");
  assert.match(nj.sourceNotes, /official grants index explicitly supplies Eastern Time/);
  assert.equal(records.find((record) => record.id === 67).lastVerified, "Sep 26, 2026");
  assert.match(records.find((record) => record.id === 67).sourceNotes, /Sept\. 18 Q&A now answers question 21/);
  assert.match(records.find((record) => record.id === 67).eligibility, /20 U\.S\.C\. §1001/);
  assert.equal(records.find((record) => record.id === 79).lastVerified, "Sep 9, 2026");
  assert.equal(records.find((record) => record.id === 83).lastVerified, "Sep 26, 2026");
  const coi = records.find((record) => record.id === 77);
  assert.match(coi.eligibility, /free ECI community registration/);
  assert.match(coi.applicationAccess, /does not allow generative or assistive AI/);
  assert.match(coi.deadline, /September 2026 through June 2028/);
});

test("daily verification preserves source dates and holds the conflicted EPA record outside public payloads", () => {
  assert.equal(INNOVATION_GRANTS_VERIFIED_ON, "Sep 26, 2026");
  assert.equal(INNOVATION_GRANTS_FULL_SEARCH_DATE, "Sep 21, 2026");
  const verifiedIds = [38, 44, 53, 55, 61, 62, 64, 65, 67, 69, 71, 72, 76, 77, 78, 80, 83, 84, 87, 88, 89, 91];
  assert.deepEqual(innovationGrants.filter((record) => record.id < 92 && record.lastVerified === "Sep 26, 2026").map((record) => record.id), verifiedIds);
  assert.equal(innovationGrants.find((record) => record.id === 54).lastVerified, "Sep 25, 2026");
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
  assert.deepEqual(counts, { "closing-soon": 6, "open-now": 23, closed: 7, "recurring-watchlist": 2 });
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

test("public projection contains the current cleared non-corporate subset", () => {
  const records = getPublicInnovationGrants().filter((record) => record.id < 92);
  const ids = records.map((record) => record.id);

  assert.equal(innovationGrants.filter((record) => record.id < 92).length, 54);
  assert.equal(records.length, 38);
  assert.deepEqual(ids, [38, 42, 43, 44, 51, 52, 53, 54, 55, 59, 61, 62, 63, 64, 65, 67, 68, 69, 71, 72, 73, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91]);
  assert.ok(records.every((record) => record.scopeDisposition === "included"));
  assert.deepEqual([...INNOVATION_GRANTS_LAUNCH_HELD_IDS].filter((id) => id < 101), [48, 56, 57, 58, 60, 66, 70, 74]);
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

test("current non-corporate inventory evaluated at the September 15 cutoff preserves pool scope", () => {
  const snapshot = getInnovationGrantFundingSnapshot(getPublicInnovationGrants().filter((record) => record.id < 92), AS_OF);
  assert.equal(snapshot.publishedProgramPoolUsd, 46_782_403);
  assert.equal(snapshot.publishedProgramPoolCount, 12);
  assert.equal(snapshot.approximatePoolCount, 6);
  assert.equal(snapshot.openOpportunityCount, 29);
  assert.equal(snapshot.closingSoonCount, 6);
  assert.equal(snapshot.openingSoonCount, 0);
  assert.equal(snapshot.currentCallsWithoutPublishedPool, 17);
});

test("focused corporate additions preserve whole-inventory freshness and inclusive location semantics", () => {
  const records = getPublicInnovationGrants();
  const additions = records.filter((record) => record.id >= 92 && record.id < 101);
  const today = new Date("2026-09-15T00:00:00.000Z");
  assert.equal(innovationGrants.length, 70);
  assert.equal(new Set(innovationGrants.map((record) => record.id)).size, 70);
  assert.equal(records.filter((record) => record.id < 101).length, 47);
  assert.deepEqual(additions.map((record) => record.id), [92, 93, 94, 95, 96, 97, 98, 99, 100]);
  assert.ok(additions.every((record) => record.portalAddedDate === "2026-09-15"));
  assert.ok(additions.every((record) => record.lastVerified === (record.id === 96 ? "Sep 17, 2026" : record.id === 99 ? "Sep 21, 2026" : record.id === 92 ? "Sep 22, 2026" : "Sep 26, 2026")));
  assert.equal(INNOVATION_GRANTS_VERIFIED_ON, "Sep 26, 2026");
  assert.equal(INNOVATION_GRANTS_FULL_SEARCH_DATE, "Sep 21, 2026");
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
  const additions = records.filter((record) => record.id >= 92 && record.id < 101);
  const inKind = additions.filter((record) => record.fundingType === "in-kind");
  assert.equal(inKind.length, 7);
  assert.ok(inKind.every((record) => record.publishedProgramPoolUsd === undefined));
  assert.ok(inKind.filter((record) => record.id !== 99).every((record) => /not cash/.test(record.awardAmount) && /not cash/.test(record.eligibilityBadge)));
  assert.equal(additions.find((record) => record.id === 93).publishedProgramPoolUsd, undefined);
  const corporate = getInnovationGrantFundingSnapshot(additions, today);
  assert.equal(corporate.publishedProgramPoolUsd, 5_000_000);
  assert.equal(corporate.approximatePoolCount, 1);
  assert.equal(corporate.openOpportunityCount, 8);
  const snapshot = getInnovationGrantFundingSnapshot(records.filter((record) => record.id < 101), today);
  assert.equal(snapshot.publishedProgramPoolUsd, 51_782_403);
  assert.equal(snapshot.publishedProgramPoolCount, 13);
  assert.equal(snapshot.approximatePoolCount, 7);
  assert.equal(snapshot.openOpportunityCount, 37);
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
  assert.match(tcup.lastVerified, /Sep 26, 2026/);
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
test("BJA archived record preserves the first-step restriction and closed application notice", () => {
  const record = getPublicInnovationGrants().find((opportunity) => opportunity.id === 81);
  assert.equal(record.applicationUrl, "https://justgrants.usdoj.gov");
  assert.match(record.eligibility, /must have completed the Sept\. 14 Grants\.gov first step/);
  assert.equal(record.eligibilityBadge, "Prior first-step submission required");
  assert.match(record.applicationAccess, /BJA marks this opportunity Closed/);
  assert.equal(record.finalDeadlineDate, "2026-09-21");
  assert.equal(getInnovationGrantLifecycle(record, AS_OF), "closing-soon");
});

test("Wake Forest uses the verified mandatory LOI entry without a misleading later cutoff", () => {
  const record = getPublicInnovationGrants().find((opportunity) => opportunity.id === 83);
  assert.equal(record.lastVerified, "Sep 26, 2026");
  assert.equal(record.applicationStatus, "open-now");
  assert.equal(record.applicationUrl, "https://2027-ii-loi.zapier.app/");
  assert.equal(record.priorityDeadlineDate, undefined);
  assert.match(record.applicationAccess, /cannot save drafts/);
  assert.match(record.deadline, /Mandatory letter of intent/);
  assert.equal(record.publishedProgramPoolUsd, undefined);
});

test("promoted track and cycle deadlines close new entry without changing provenance", () => {
  for (const [id, added, cutoff] of [[72, "2026-08-30", "2027-01-21"], [83, "2026-08-31", "2026-11-17"], [84, "2026-09-22", "2027-05-04"]]) {
    const record = getPublicInnovationGrants().find((item) => item.id === id);
    assert.equal(record.portalAddedDate, added);
    assert.equal(record.publishedProgramPoolUsd, undefined);
    assert.equal(getInnovationGrantLifecycle(record, new Date("2026-09-21T00:00:00Z")), "open-now");
    assert.equal(getInnovationGrantLifecycle(record, new Date(cutoff + "T00:00:00Z")), "closed");
  }
  const alaska = getPublicInnovationGrants().find((item) => item.id === 84);
  assert.deepEqual(alaska.locationEligibility, { scope: "state-or-territory", jurisdictions: ["AK"] });
  assert.match(alaska.deadline, /7:59 p.m. AKST/);
  assert.match(alaska.applicationAccess, /PKG00292479/);
});

test("September 22 lifecycle snapshot preserves today's full-verification dates and source conflicts", () => {
  const records = getPublicInnovationGrants();
  const today = new Date("2026-09-22T00:00:00.000Z");
  const snapshot = getPublicInnovationGrantFundingSnapshot(today);
  assert.equal(snapshot.publishedProgramPoolUsd, 101_574_990);
  assert.equal(snapshot.openOpportunityCount, 40);
  assert.equal(snapshot.closingSoonCount, 10);
  assert.equal(snapshot.publishedProgramPoolCount, 11);
  assert.equal(snapshot.approximatePoolCount, 7);
  assert.equal(records.filter((record) => getInnovationGrantLifecycle(record, today) === "closed").length, 11);
  assert.equal(innovationGrants.filter((record) => record.lastVerified === "Sep 26, 2026").length, 35);
  for (const id of [65, 78, 80, 87]) {
    const record = records.find((item) => item.id === id);
    assert.equal(record.lastVerified, "Sep 26, 2026");
    assert.match(record.applicationAccess, /Public Grants.gov login entry checked Sept. 26/);
    assert.match(record.applicationAccess, /authenticated submission not tested/);
    assert.ok(!record.qualifiers.includes("Application access needs recheck"));
    assert.notEqual(getInnovationGrantLifecycle(record, today), "closed");
  }
  const nlgca = records.find((record) => record.id === 79);
  assert.equal(nlgca.lastVerified, "Sep 9, 2026");
  assert.match(nlgca.applicationAccess, /Public Grants.gov login entry checked Sept. 26/);
  const bjaEducation = records.find((record) => record.id === 88);
  assert.equal(bjaEducation.lastVerified, "Sep 26, 2026");
  assert.equal(bjaEducation.applicationUrl, "https://justgrants.usdoj.gov");
  assert.match(bjaEducation.bestFit, /submitted the Grants\.gov SF-424 by Sept\. 24/);
  assert.equal(bjaEducation.eligibilityBadge, "Prior Grants.gov step required");
  assert.match(bjaEducation.applicationAccess, /first step has passed/);
  assert.match(bjaEducation.applicationAccess, /Applicants who submitted on time may complete/);
  const credits = records.find((record) => record.id === 96);
  for (const [id, date] of [[59, "Sep 20, 2026"], [90, "Sep 20, 2026"], [79, "Sep 9, 2026"], [96, "Sep 17, 2026"]]) {
    assert.equal(records.find((record) => record.id === id).lastVerified, date);
  }
  assert.equal(records.filter((record) => getInnovationGrantLifecycle(record, today) === "recurring-watchlist").length, 3);
  assert.ok(records.find((record) => record.id === 79).qualifiers.includes("Planning/workshop minimum conflict: under review"));
  assert.ok(records.find((record) => record.id === 90).qualifiers.includes("New-program application scope needs review"));
  assert.equal(credits.lastVerified, "Sep 17, 2026");
  assert.match(credits.sourceNotes, /Sep\. 26, 2026 partial recheck/);
  const doe = records.find((record) => record.id === 67);
  assert.doesNotMatch(doe.eligibility, /under DOE review/);
  assert.match(doe.sourceNotes, /dfb8bdff-57a3-4d00-8002-613cd7fe7483/);
  assert.match(doe.eligibility, /principal investigator must be an employee of the prime applicant/);
  const ev = records.find((record) => record.id === 55);
  assert.equal(ev.publishedProgramPoolApproximate, true);
  assert.match(ev.awardAmount, /estimated program funding/);
});

test("September 23 daily snapshot preserves pools and archive while two more calls enter closing soon", () => {
  const today = new Date("2026-09-23T00:00:00Z");
  const records = getPublicInnovationGrants();
  const snapshot = getPublicInnovationGrantFundingSnapshot(today);
  assert.equal(records.length, 54);
  assert.equal(snapshot.openOpportunityCount, 40);
  assert.equal(snapshot.closingSoonCount, 12);
  assert.equal(snapshot.publishedProgramPoolUsd, 101_574_990);
  assert.equal(snapshot.publishedProgramPoolCount, 11);
  assert.equal(snapshot.approximatePoolCount, 7);
  assert.equal(records.filter((record) => getInnovationGrantLifecycle(record, today) === "closed").length, 11);
  assert.deepEqual(records.filter((record) => record.lastVerified === "Sep 26, 2026").map((record) => record.id), [38, 44, 53, 55, 61, 62, 64, 65, 67, 69, 71, 72, 76, 77, 78, 80, 83, 84, 87, 88, 89, 91, 93, 94, 95, 97, 98, 100, 101, 102, 103, 104, 105, 106, 107]);
});

test("September 25 rolls the passed NSAW call into Closed/Past and removes its pool from active funding", () => {
  const today = new Date("2026-09-25T18:00:00Z");
  const records = getPublicInnovationGrants();
  const snapshot = getPublicInnovationGrantFundingSnapshot(today);
  const nsaw = records.find((record) => record.id === 54);
  assert.ok(nsaw);
  assert.equal(getInnovationGrantLifecycle(nsaw, today), "closed");
  assert.equal(nsaw.portalAddedDate, "2026-08-30");
  assert.match(nsaw.applicationAccess, /deadline has passed/);
  assert.equal(records.length, 54);
  assert.equal(records.filter((record) => getInnovationGrantLifecycle(record, today) === "closed").length, 12);
  assert.equal(snapshot.publishedProgramPoolUsd, 96_724_990);
  assert.equal(snapshot.publishedProgramPoolCount, 10);
  assert.equal(snapshot.approximatePoolCount, 6);
  assert.equal(snapshot.openOpportunityCount, 39);
  assert.equal(snapshot.closingSoonCount, 12);
});

test("September 26 rolls Rev Up EV into Closed/Past and removes its estimated pool from active funding", () => {
  const today = new Date("2026-09-26T18:00:00Z");
  const records = getPublicInnovationGrants();
  const snapshot = getPublicInnovationGrantFundingSnapshot(today);
  const ev = records.find((record) => record.id === 55);
  assert.ok(ev);
  assert.equal(ev.lastVerified, "Sep 26, 2026");
  assert.equal(ev.portalAddedDate, "2026-08-30");
  assert.equal(getInnovationGrantLifecycle(ev, today), "closed");
  assert.match(ev.applicationAccess, /deadline has passed/);
  assert.match(ev.applicationAccess, /remains published and reachable/);
  assert.equal(records.length, 54);
  assert.equal(records.filter((record) => getInnovationGrantLifecycle(record, today) === "closed").length, 13);
  assert.equal(snapshot.publishedProgramPoolUsd, 94_224_990);
  assert.equal(snapshot.publishedProgramPoolCount, 9);
  assert.equal(snapshot.approximatePoolCount, 5);
  assert.equal(snapshot.openOpportunityCount, 38);
  assert.equal(snapshot.closingSoonCount, 11);
  assert.equal(INNOVATION_GRANTS_FULL_SEARCH_DATE, "Sep 21, 2026");
});

test("Monday additions use actual publication dates, restricted geography, and only current-call cash pools", () => {
  const additions = getPublicInnovationGrants().filter((record) => record.id >= 101);
  assert.deepEqual(additions.map((record) => record.id), [101, 102, 103, 104, 105, 106, 107]);
  assert.ok(additions.every((record) => record.portalAddedDate === "2026-09-22" && record.lastVerified === "Sep 26, 2026"));
  assert.ok(additions.every((record) => record.locationEligibility));
  assert.deepEqual(additions.filter((record) => record.publishedProgramPoolUsd).map((record) => [record.id, record.publishedProgramPoolUsd, record.publishedProgramPoolApproximate]), [[104, 2_000_000, true], [106, 55_849_990, false]]);
  const california = filterInnovationGrantOpportunities(additions, { ...DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS, location: "CA", status: "all" }, new Date("2026-09-22T00:00:00Z"));
  assert.deepEqual(california.map((record) => record.id).sort(), [101, 102, 103, 106]);
  const nsf = additions.find((record) => record.id === 101);
  assert.equal(nsf.finalDeadlineDate, "2026-12-15");
  assert.equal(getInnovationGrantLifecycle(nsf, new Date("2026-12-16T00:00:00Z")), "closed");
  const workshop = additions.find((record) => record.id === 103);
  assert.equal(workshop.announcedDateIso, "2026-01-20");
  assert.match(workshop.deadline, /255 days.*210 days.*5 p.m. Eastern Time/);
  assert.match(additions.find((record) => record.id === 104).deadlineTimeZone, /EST.*confirm/);
  assert.match(additions.find((record) => record.id === 106).deadlineTimeZone, /PDT.*confirm/);
  assert.equal(additions.find((record) => record.id === 105).deadlineTimeZone, "Not stated in the official source");
  assert.equal(additions.find((record) => record.id === 107).locationEligibility.scope, "unresolved");
});

test("three September 21 deadlines archive without deleting records or refreshing added dates", () => {
  const records = getPublicInnovationGrants();
  const before = new Date("2026-09-21T00:00:00Z");
  const after = new Date("2026-09-22T00:00:00Z");
  for (const [id, added] of [[43, "2026-08-29"], [81, "2026-08-31"], [92, "2026-09-15"]]) {
    const record = records.find((item) => item.id === id);
    assert.ok(record);
    assert.equal(record.portalAddedDate, added);
    assert.equal(getInnovationGrantLifecycle(record, before), "closing-soon");
    assert.equal(getInnovationGrantLifecycle(record, after), "closed");
    assert.equal(record.lastVerified, "Sep 22, 2026");
  }
  assert.equal(getPublicInnovationGrantFundingSnapshot(before).publishedProgramPoolUsd -
    getPublicInnovationGrantFundingSnapshot(after).publishedProgramPoolUsd, 6_257_403);
  assert.match(records.find((record) => record.id === 92).applicationAccess, /no longer accepting responses/);
  assert.match(records.find((record) => record.id === 89).sourceNotes, /up to 50%.*conflicting RFA 25%/);
  assert.equal(INNOVATION_GRANTS_FULL_SEARCH_DATE, "Sep 21, 2026");
});

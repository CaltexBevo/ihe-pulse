import assert from "node:assert/strict";
import test from "node:test";
import { register } from "node:module";

register("./innovationGrantsTestLoader.mjs", import.meta.url);

const {
  getPublicInnovationGrantFundingSnapshot,
  getPublicInnovationGrants,
  INNOVATION_GRANTS_LAUNCH_HELD_IDS,
} = await import("../lib/data/innovation-grants-public.ts");
const { getInnovationGrantLifecycle } = await import("../lib/innovation-grants-shared.ts");

const AS_OF = new Date("2026-09-09T00:00:00.000Z");

test("public projection contains exactly the Sep. 9 cleared launch subset", () => {
  const records = getPublicInnovationGrants();
  const ids = records.map((record) => record.id);

  assert.equal(records.length, 35);
  assert.deepEqual(ids, [38, 42, 43, 44, 51, 52, 54, 55, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 75, 76, 77, 78, 79, 80, 81, 82, 83, 85, 86, 87, 88]);
  assert.ok(records.every((record) => record.scopeDisposition === "included"));
  assert.deepEqual([...INNOVATION_GRANTS_LAUNCH_HELD_IDS], [48, 53, 56, 57, 58, 70, 74, 84]);
  assert.ok(INNOVATION_GRANTS_LAUNCH_HELD_IDS.every((id) => !ids.includes(id)));
  assert.ok([61, 78, 79, 80].every((id) => ids.includes(id)));
});

test("public funding snapshot is derived from the cleared records", () => {
  const snapshot = getPublicInnovationGrantFundingSnapshot(AS_OF);
  assert.equal(snapshot.publishedProgramPoolUsd, 40_007_403);
  assert.equal(snapshot.publishedProgramPoolCount, 9);
  assert.equal(snapshot.approximatePoolCount, 2);
  assert.equal(snapshot.openOpportunityCount, 28);
  assert.equal(snapshot.openingSoonCount, 1);
  assert.equal(snapshot.currentCallsWithoutPublishedPool, 19);
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
  assert.match(tcup.lastVerified, /Sep 9, 2026/);
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
  assert.match(tcrgp.deadline, /Phase II submission deadline/);
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

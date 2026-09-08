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

const AS_OF = new Date("2026-09-08T00:00:00.000Z");

test("public projection contains exactly the cleared launch subset", () => {
  const records = getPublicInnovationGrants();
  const ids = records.map((record) => record.id);

  assert.equal(records.length, 31);
  assert.deepEqual(ids, [38, 42, 43, 44, 51, 52, 54, 55, 59, 60, 62, 63, 64, 65, 66, 67, 68, 69, 71, 72, 73, 75, 76, 77, 81, 82, 83, 85, 86, 87, 88]);
  assert.ok(records.every((record) => record.scopeDisposition === "included"));
  assert.ok(INNOVATION_GRANTS_LAUNCH_HELD_IDS.every((id) => !ids.includes(id)));
});

test("public funding snapshot is derived from the cleared records", () => {
  const snapshot = getPublicInnovationGrantFundingSnapshot(AS_OF);
  assert.equal(snapshot.publishedProgramPoolUsd, 28_607_403);
  assert.equal(snapshot.publishedProgramPoolCount, 7);
  assert.equal(snapshot.approximatePoolCount, 0);
  assert.equal(snapshot.openOpportunityCount, 26);
  assert.equal(snapshot.openingSoonCount, 1);
  assert.equal(snapshot.currentCallsWithoutPublishedPool, 19);
});

test("lifecycle remains date-only at the Pacific calendar boundary", () => {
  const record = getPublicInnovationGrants().find((opportunity) => opportunity.id === 51);
  assert.ok(record);
  assert.equal(getInnovationGrantLifecycle(record, new Date("2026-09-08T00:00:00.000Z")), "closing-soon");
  assert.equal(getInnovationGrantLifecycle(record, new Date("2026-09-09T00:00:00.000Z")), "closing-soon");
  assert.equal(getInnovationGrantLifecycle(record, new Date("2026-09-15T00:00:00.000Z")), "closed");
});

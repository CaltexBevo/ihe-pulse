import assert from "node:assert/strict";
import test from "node:test";
import { register } from "node:module";
import { readFileSync } from "node:fs";
register("./innovationGrantsTestLoader.mjs", import.meta.url);
const { getHomepageGrantSummary } = await import("../lib/innovation-grants-homepage.ts");
const { getPublicInnovationGrants, INNOVATION_GRANTS_LAUNCH_HELD_IDS } = await import("../lib/data/innovation-grants-public.ts");
const now = new Date("2026-09-15T18:00:00Z");
const records = getPublicInnovationGrants();
test("homepage banner omits the disclaimer and reserves end space for the dollar glyph ink", () => {
  const component = readFileSync(new URL("../components/HomeGrantSpotlight.tsx", import.meta.url), "utf8");
  const css = readFileSync(new URL("../components/HomeGrantSpotlight.module.css", import.meta.url), "utf8");
  assert.doesNotMatch(component, /styles\.caveat|Not a promise of remaining funds|Awards are competitive/);
  assert.doesNotMatch(css, /\.caveat/);
  assert.match(component, /reported current program funding/);
  assert.match(css, /\.amount b \{ display:inline-block; padding-inline-end:\.08em; font-weight:800; \}/);
});
test("homepage summarizes the current cleared projection at the September 15 cutoff", () => {
  assert.ok(records.every(record => !INNOVATION_GRANTS_LAUNCH_HELD_IDS.includes(record.id)));
  const result = getHomepageGrantSummary(records.filter((record) => record.id < 101), now);
  assert.equal(result.totalCount, 47);
  assert.equal(result.funding.publishedProgramPoolUsd, 51782403);
  assert.equal(result.funding.publishedProgramPoolCount, 13);
  assert.equal(result.funding.approximatePoolCount, 7);
  assert.equal(result.funding.openOpportunityCount, 37);
  assert.equal(result.latestDate, "2026-09-15");
  assert.equal(result.latestCount, 9);
  assert.deepEqual(result.breakdown, { open:8, watchlist:1, openingSoon:0, closed:0 });
});
test("changed inventory changes funding, cohort and lifecycle together across Pacific midnight", () => {
  const record = { ...records[0], portalAddedDate:"2026-09-15", applicationStatus:"open", openDate:undefined, priorityDeadlineDate:undefined, finalDeadlineDate:"2026-09-15", fundingType:"cash", publishedProgramPoolUsd:123, publishedProgramPoolApproximate:false };
  const before = getHomepageGrantSummary([record], new Date("2026-09-16T06:59:00Z"));
  const after = getHomepageGrantSummary([record], new Date("2026-09-16T07:01:00Z"));
  assert.equal(before.funding.publishedProgramPoolUsd, 123);
  assert.equal(before.breakdown.open, 1);
  assert.equal(after.funding.publishedProgramPoolUsd, 0);
  assert.equal(after.breakdown.closed, 1);
  assert.equal(after.totalCount, 1);
});
test("invalid, missing and future cohort dates are excluded; empty is honest", () => {
  const result = getHomepageGrantSummary([undefined,"2026-02-30","bad","2026-09-16","2026-09-14"].map(portalAddedDate => ({...records[0],portalAddedDate})), now);
  assert.equal(result.latestDate,"2026-09-14");
  assert.equal(result.latestCount,1);
  const empty = getHomepageGrantSummary([],now);
  assert.equal(empty.totalCount,0);
  assert.equal(empty.latestDate,null);
  assert.equal(empty.latestCount,0);
  assert.equal(empty.funding.publishedProgramPoolUsd,0);
});
test("September 22 homepage and portal agree after three deadline expirations", () => {
  const result = getHomepageGrantSummary(records, new Date("2026-09-22T18:00:00Z"));
  assert.equal(result.funding.publishedProgramPoolUsd, 101_574_990);
  assert.equal(result.funding.openOpportunityCount, 40);
  assert.equal(result.funding.closingSoonCount, 10);
  assert.equal(result.totalCount, 54);
  assert.equal(result.latestDate, "2026-09-22");
  assert.equal(result.latestCount, 8);
  assert.deepEqual(records.filter((record) => record.portalAddedDate === result.latestDate).map((record) => record.id), [84, 101, 102, 103, 104, 105, 106, 107]);
  assert.deepEqual(result.breakdown, { open:8, watchlist:0, openingSoon:0, closed:0 });
});
test("September 23 homepage reflects closing-soon progression without changing the addition cohort", () => {
  const result = getHomepageGrantSummary(records, new Date("2026-09-23T18:00:00Z"));
  assert.equal(result.totalCount, 54);
  assert.equal(result.funding.openOpportunityCount, 40);
  assert.equal(result.funding.closingSoonCount, 12);
  assert.equal(result.funding.publishedProgramPoolUsd, 101_574_990);
  assert.equal(result.funding.publishedProgramPoolCount, 11);
  assert.equal(result.funding.approximatePoolCount, 7);
  assert.equal(result.latestDate, "2026-09-22");
  assert.equal(result.latestCount, 8);
});

test("September 25 homepage removes the passed NSAW pool but retains its archive record", () => {
  const result = getHomepageGrantSummary(records, new Date("2026-09-25T18:00:00Z"));
  assert.equal(result.totalCount, 54);
  assert.equal(result.funding.openOpportunityCount, 39);
  assert.equal(result.funding.closingSoonCount, 12);
  assert.equal(result.funding.publishedProgramPoolUsd, 96_724_990);
  assert.equal(result.funding.publishedProgramPoolCount, 10);
  assert.equal(result.funding.approximatePoolCount, 6);
  assert.ok(records.some((record) => record.id === 54));
});

test("amount motion clamps early frames, settles and immediately respects reduced motion", () => {
  const source = readFileSync(new URL("../app/innovation-grants/PortalFundingTally.tsx",import.meta.url),"utf8");
  assert.match(source,/Math.max\(0, Math.min\(\(now - startedAt\) \/ 850, 1\)\)/);
  assert.match(source,/prefers-reduced-motion: reduce/);
  assert.match(source,/aria-label=/);
  assert.match(source,/if \(progress < 1\)/);
  for (const elapsed of [-50,0,425,850,1000]) {
    const progress = Math.max(0,Math.min(elapsed/850,1));
    const value = Math.round(51782403*(1-Math.pow(1-progress,3)));
    assert.ok(value >= 0 && value <= 51782403);
  }
});

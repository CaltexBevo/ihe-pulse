import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { register } from "node:module";
register("./innovationGrantsTestLoader.mjs", import.meta.url);
const { getPublicInnovationGrants } = await import("../lib/data/innovation-grants-public.ts");
const { getInnovationGrantPacificAsOfDate, getInnovationGrantLifecycle, getInnovationGrantNextDeadlineAt, getInnovationGrantFundingSnapshot } = await import("../lib/innovation-grants-shared.ts");
const { getHomepageGrantSummary } = await import("../lib/innovation-grants-homepage.ts");
const { filterInnovationGrantOpportunities, DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS } = await import("../lib/innovation-grants-directory.ts");
const records = getPublicInnovationGrants().filter((record) => record.id < 125);
const rit = records.find(({ id }) => id === 123);
const triC = records.find(({ id }) => id === 105);

test("verified Eastern cutoff closes RIT at the actual instant throughout public caller paths", () => {
  assert.equal(rit.finalDeadlineAt, "2026-10-13T03:59:00Z");
  for (const [iso, closed] of [["2026-10-13T03:58:59Z", false], ["2026-10-13T03:59:00Z", true], ["2026-10-13T04:00:00Z", true], ["2026-10-13T06:59:59Z", true]]) {
    const now = new Date(iso);
    const asOf = getInnovationGrantPacificAsOfDate(now);
    assert.equal(getInnovationGrantLifecycle(rit, asOf), closed ? "closed" : "closing-soon", iso);
    assert.equal(getInnovationGrantLifecycle(triC, asOf), "closing-soon", "date-only remains active through Pacific deadline day");
    const summary = getHomepageGrantSummary(records, now);
    assert.equal(summary.funding.openOpportunityCount, closed ? 44 : 45);
    assert.equal(summary.breakdown.closed, closed ? 1 : 0);
    assert.equal(getInnovationGrantFundingSnapshot(records, asOf).openOpportunityCount, closed ? 44 : 45);
    const active = filterInnovationGrantOpportunities(records, DEFAULT_INNOVATION_GRANT_DIRECTORY_FILTERS, asOf);
    assert.equal(active.some(({ id }) => id === 123), !closed);
    assert.equal(getInnovationGrantNextDeadlineAt(records, now), closed ? undefined : rit.finalDeadlineAt);
  }
  assert.equal(getInnovationGrantLifecycle(triC, getInnovationGrantPacificAsOfDate(new Date("2026-10-13T07:00:00Z"))), "closed");
  assert.deepEqual(records.filter(record => record.finalDeadlineAt).map(record => record.id), [123]);
});

test("renderers preserve real instant and schedule exact-cutoff refresh on all three surfaces", () => {
  const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
  assert.match(read("../app/innovation-grants/directory/page.tsx"), /asOfInstant=\{now.toISOString\(\)\}/);
  assert.match(read("../app/innovation-grants/directory/InnovationGrantsDirectory.tsx"), /getInnovationGrantPacificAsOfDate\(new Date\(asOfInstant\)\)/);
  for (const path of ["../components/HomeGrantSpotlight.tsx", "../app/innovation-grants/page.tsx", "../app/innovation-grants/directory/page.tsx"]) {
    assert.match(read(path), /<PortalDayRefresh[^>]*refreshAt=/);
  }
  const refresh = read("../app/innovation-grants/PortalDayRefresh.tsx");
  assert.match(refresh, /Date.now\(\) >= cutoff/);
  assert.match(refresh, /window.setInterval\(refreshAfterCutoff, 1000\)/);
  assert.match(refresh, /visibilitychange/);
});

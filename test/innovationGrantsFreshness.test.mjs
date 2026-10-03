import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { register } from "node:module";
register("./innovationGrantsTestLoader.mjs", import.meta.url);
const metadata = await import("../lib/innovation-grants-shared.ts");
const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("all three grant surfaces display the shared released-update date", () => {
  for (const path of ["../components/HomeGrantSpotlight.tsx", "../app/innovation-grants/page.tsx", "../app/innovation-grants/directory/InnovationGrantsDirectory.tsx"]) {
    const source = read(path);
    assert.ok(source.includes('import GrantUpdatedDate from "@/components/GrantUpdatedDate"'), path);
    assert.ok(source.includes("<GrantUpdatedDate />"), path);
  }
  const component = read("../components/GrantUpdatedDate.tsx");
  assert.ok(component.includes('from "@/lib/innovation-grants-shared"'));
  assert.ok(component.includes("Last updated <time data-grant-updated dateTime={INNOVATION_GRANTS_UPDATED_DATE}>{INNOVATION_GRANTS_UPDATED_ON}</time>"));
});

test("release freshness is explicit metadata, distinct from inventory and discovery checks", () => {
  assert.equal(metadata.INNOVATION_GRANTS_UPDATED_DATE, "2026-10-03");
  assert.equal(metadata.INNOVATION_GRANTS_UPDATED_ON, "Oct 3, 2026");
  const source = read("../lib/innovation-grants-shared.ts");
  assert.match(source, /INNOVATION_GRANTS_UPDATED_DATE = "\d{4}-\d{2}-\d{2}"/);
  for (const path of ["../app/innovation-grants/page.tsx", "../app/innovation-grants/directory/InnovationGrantsDirectory.tsx"]) {
    const page = read(path);
    assert.ok(page.includes("Latest inventory check {INNOVATION_GRANTS_VERIFIED_ON}"));
    assert.ok(page.includes("Full discovery search {INNOVATION_GRANTS_FULL_SEARCH_DATE}"));
    assert.ok(page.includes("Individual records retain their own dates."));
  }
});

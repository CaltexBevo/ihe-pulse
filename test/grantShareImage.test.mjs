import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("grant sharing image uses the current headline and public funding calculation", () => {
  const image = readFileSync(new URL("../app/innovation-grants/opengraph-image.tsx", import.meta.url), "utf8");
  assert.match(image, /getHomepageGrantSummary\(getPublicInnovationGrants\(\)\)/);
  assert.match(image, /funding\.publishedProgramPoolUsd/);
  assert.match(image, /Your innovation\./);
  assert.match(image, /Our grant portal\./);
  assert.match(image, /reported current program funding/);
  assert.match(image, /Includes approximate program totals/);
  assert.match(image, /As of \{asOfDate\}/);
  assert.match(image, /force-dynamic/);
  assert.doesNotMatch(image, /Every kind of change|101,574,990|101574990/);
});

test("share metadata versions the image by design, Pacific day and total", () => {
  const page = readFileSync(new URL("../app/innovation-grants/page.tsx", import.meta.url), "utf8");
  assert.match(page, /export function generateMetadata/);
  assert.match(page, /hero-total-v2-\$\{summary.asOfDate\}-\$\{summary.funding.publishedProgramPoolUsd\}/);
  assert.match(page, /imageWidth: 1200/);
  assert.match(page, /imageHeight: 630/);
});

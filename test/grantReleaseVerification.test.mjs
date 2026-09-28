import test from "node:test";
import assert from "node:assert/strict";
import { verifyGrantHtml, verifyGrantRelease } from "../scripts/verify-grant-release.mjs";

const expected = { date: "2026-09-28", verification: "2026-09-28", discovery: "2026-09-28", funding: 125124990, total: 56, open: 40 };
const html = '<p>Last updated <time data-grant-updated="true" dateTime="2026-09-28">Sep 28, 2026</time></p><b>$125,124,990</b><p>56<!-- --> grants &amp; support programs</p><p>40 currently open</p><p>Latest inventory check Sep 28, 2026 · Full discovery search Sep 28, 2026</p>';

test("release verification accepts published expected content on all three surfaces", async () => {
  const seen = [];
  const result = await verifyGrantRelease(expected, async url => { seen.push(url.pathname); return new Response(html); });
  assert.equal(result.success, true);
  assert.deepEqual(seen, ["/", "/innovation-grants", "/innovation-grants/directory"]);
});
test("stale production and correct data hidden in scripts cannot pass", () => {
  const stale = html.replaceAll("2026-09-28", "2026-09-27").replace("$125,124,990", "$94,224,990");
  const failures = verifyGrantHtml(`${stale}<script>${html}</script>`, expected, "/");
  assert.ok(failures.some(failure => failure.includes("date")));
  assert.ok(failures.includes("Funding total mismatch"));
});
test("a failed destination or unavailable network fails the whole release", async () => {
  const result = await verifyGrantRelease(expected, async url => {
    if (url.pathname === "/") throw new Error("Network unavailable");
    return new Response(html, { status: url.pathname.endsWith("directory") ? 503 : 200 });
  });
  assert.equal(result.success, false);
  assert.equal(result.results.length, 3);
  assert.equal(result.results[1].failures.length, 0);
});
test("inventory and discovery dates cannot silently lag the released update", () => {
  const failures = verifyGrantHtml(html.replace("Full discovery search Sep 28", "Full discovery search Sep 21"), expected, "/innovation-grants");
  assert.deepEqual(failures, ["Full discovery search mismatch"]);
});

import { pathToFileURL } from "node:url";
import { readFileSync } from "node:fs";

const routes = ["/", "/innovation-grants", "/innovation-grants/directory"];

export function verifyGrantHtml(html, expected, route) {
  // Ignore scripts so serialized future data cannot masquerade as visible publication.
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  const text = markup.replace(/<!--.*?-->/gs, "").replace(/<[^>]*>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
  const times = [...markup.matchAll(/<time\b([^>]*)>([\s\S]*?)<\/time>/gi)];
  const updated = times.find(([, attrs]) => /\bdata-grant-updated(?:\s|=|$)/.test(attrs));
  const failures = [];
  if (!updated || !new RegExp(`\\bdatetime=["']${expected.date}["']`, "i").test(updated[1])) failures.push("Published update date does not match expected release");
  const updateLabel = new Date(`${expected.date}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
  if (!updated || updated[2].replace(/<!--.*?-->/gs, "").replace(/<[^>]*>/g, "").trim() !== updateLabel) failures.push("Visible update date does not match expected release");
  if (!text.includes("Last updated")) failures.push("Visible Last updated label missing");
  if (route !== "/innovation-grants/directory") {
    if (!text.includes(`$${Number(expected.funding).toLocaleString("en-US")}`)) failures.push("Funding total mismatch");
    if (!text.includes(`${expected.total} grants & support programs`)) failures.push("Inventory count mismatch");
    if (!text.includes(`${expected.open} currently open`)) failures.push("Open count mismatch");
  }
  if (route !== "/") {
    for (const [key, label] of [["verification", "Latest inventory check"], ["discovery", "Full discovery search"]]) {
      const dateLabel = new Date(`${expected[key]}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
      if (!text.includes(`${label} ${dateLabel}`)) failures.push(`${label} mismatch`);
    }
  }
  return failures;
}

export async function verifyGrantRelease(expected, fetchPage = fetch, browserReceipt) {
  const results = [];
  for (const route of routes) {
    const url = new URL(route, expected.base || "https://www.innovatinghighered.com");
    try {
      const response = await fetchPage(url, { cache: "no-store", signal: AbortSignal.timeout(20000) });
      const page = browserReceipt?.pages?.filter(page => page.route === route);
      const evidence = page?.length === 1 ? page[0] : undefined;
      const failures = response.ok ? verifyGrantHtml(evidence?.html ?? await response.text(), expected, route) : [`HTTP ${response.status}`];
      const finalUrl = new URL(response.url);
      const sameHost = finalUrl.hostname.replace(/^www\./, "") === url.hostname.replace(/^www\./, "");
      if (!sameHost || finalUrl.protocol !== url.protocol || finalUrl.port !== url.port || finalUrl.pathname !== url.pathname || finalUrl.search !== url.search) failures.push("Unexpected final destination after redirect");
      if (browserReceipt) {
        const age = Date.now() - Date.parse(evidence?.capturedAt);
        if (!evidence || evidence.url !== finalUrl.href || evidence.visible !== true || !Number.isFinite(age) || age < -60000 || age > 15 * 60000) failures.push("Missing, stale, hidden, or wrong-destination browser evidence");
      }
      results.push({ route, url: url.href, status: response.status, failures });
    } catch (error) {
      results.push({ route, url: url.href, failures: [`Request failed: ${error.message}`] });
    }
  }
  return { checkedAt: new Date().toISOString(), evidenceMode: browserReceipt ? "rendered-browser-and-http" : "server-html-and-http", expected, success: results.every(result => result.failures.length === 0), results };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const expected = {};
  for (let i = 2; i < process.argv.length; i += 2) expected[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
  for (const key of ["date", "verification", "discovery"]) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expected[key] || "") || new Date(`${expected[key]}T12:00:00Z`).toISOString().slice(0, 10) !== expected[key]) throw new Error(`Valid --${key} date required`);
  }
  for (const key of ["funding", "total", "open"]) if (!/^\d+$/.test(expected[key] || "")) throw new Error(`Nonnegative integer --${key} required`);
  const browserReceipt = expected["browser-receipt"] ? JSON.parse(readFileSync(expected["browser-receipt"], "utf8")) : undefined;
  const result = await verifyGrantRelease(expected, fetch, browserReceipt);
  console.log(JSON.stringify(result, null, 2));
  if (!result.success) process.exitCode = 1;
}

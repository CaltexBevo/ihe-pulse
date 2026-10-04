import assert from 'node:assert/strict';
import test from 'node:test';
import { MAX_GRANT_ALERT_CSV_BYTES, parseGrantAlertPreferences } from '../lib/grantAlertPreferences.ts';
import { INNOVATION_GRANTS_AUDIENCE_FILTERS, INNOVATION_GRANTS_AREA_FILTERS } from '../lib/innovation-grants-shared.ts';
import { INNOVATION_GRANT_JURISDICTIONS } from '../lib/innovation-grants-directory.ts';
test("preferences accept only bounded allowlisted IDs and normalize UI arrays or stored CSV", () => {
  const parsed = parseGrantAlertPreferences({
    audiences: "community-colleges,four-year-colleges-universities",
    locations: ["CA", "TX"],
    areas: "ai-emerging-technology,teaching-learning",
    minimumAwardUsd: "25000",
  });
  assert.deepEqual(parsed, {
    ok: true,
    preferences: {
      audiences: ["community-colleges", "four-year-colleges-universities"],
      locations: ["CA", "TX"],
      areas: ["ai-emerging-technology", "teaching-learning"],
      minimumAwardUsd: 25_000,
    },
  });

  assert.deepEqual(
    parseGrantAlertPreferences({ audiences: "", locations: "", areas: [], minimumAwardUsd: "" }),
    { ok: true, preferences: { audiences: [], locations: [], areas: [], minimumAwardUsd: null } },
  );
});

test("preferences reject malformed fields, unknown tokens, duplicates, and unbounded values", () => {
  assert.equal(parseGrantAlertPreferences(null).ok, false);
  assert.deepEqual(
    parseGrantAlertPreferences({ audiences: [], locations: [], areas: [] }),
    { ok: false, reason: "missing-field" },
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: ["all"], locations: [], areas: [], minimumAwardUsd: null }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: ["community-colleges", "community-colleges"], locations: [], areas: [], minimumAwardUsd: null }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: [], locations: ["XX"], areas: [], minimumAwardUsd: null }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: [], locations: [], areas: ["free text"], minimumAwardUsd: null }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: [], locations: [], areas: [], minimumAwardUsd: "5,000" }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: [], locations: [], areas: [], minimumAwardUsd: 1_000_000_001 }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: [], locations: [], areas: [], minimumAwardUsd: null, note: "extra" }).ok,
    false,
  );
  assert.equal(
    parseGrantAlertPreferences({ audiences: "x".repeat(MAX_GRANT_ALERT_CSV_BYTES + 1), locations: [], areas: [], minimumAwardUsd: null }).ok,
    false,
  );
});

test("all supported UI choices fit the stored CSV byte limit when arrays are serialized", () => {
  const parsed = parseGrantAlertPreferences({
    audiences: INNOVATION_GRANTS_AUDIENCE_FILTERS.map(({ id }) => id).filter((id) => id !== "all"),
    locations: INNOVATION_GRANT_JURISDICTIONS.map(({ code }) => code),
    areas: INNOVATION_GRANTS_AREA_FILTERS.map(({ id }) => id).filter((id) => id !== "all"),
    minimumAwardUsd: null,
  });

  assert.equal(parsed.ok, true);
  if (parsed.ok) {
    assert.ok(new TextEncoder().encode(parsed.preferences.audiences.join(",")).byteLength <= MAX_GRANT_ALERT_CSV_BYTES);
    assert.ok(new TextEncoder().encode(parsed.preferences.locations.join(",")).byteLength <= MAX_GRANT_ALERT_CSV_BYTES);
    assert.ok(new TextEncoder().encode(parsed.preferences.areas.join(",")).byteLength <= MAX_GRANT_ALERT_CSV_BYTES);
  }
});

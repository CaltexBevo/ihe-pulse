import {
  INNOVATION_GRANTS_AUDIENCE_FILTERS,
  INNOVATION_GRANTS_AREA_FILTERS,
  type InnovationGrantArea,
  type InnovationGrantAudience,
  type InnovationGrantJurisdictionCode,
} from "./innovation-grants-shared";
import {
  INNOVATION_GRANT_JURISDICTIONS,
} from "./innovation-grants-directory";

/**
 * Normalized, browser-safe criteria for Innovation Grant email alerts.
 * Empty arrays mean that the subscriber accepts any value in that category.
 */
export interface GrantAlertPreferences {
  audiences: InnovationGrantAudience[];
  locations: InnovationGrantJurisdictionCode[];
  areas: InnovationGrantArea[];
  minimumAwardUsd: number | null;
}

export type GrantAlertPreferencesParseResult =
  | { ok: true; preferences: GrantAlertPreferences }
  | { ok: false; reason: GrantAlertPreferencesValidationError };

export type GrantAlertPreferencesValidationError =
  | "invalid-object"
  | "unknown-field"
  | "missing-field"
  | "invalid-audiences"
  | "invalid-locations"
  | "invalid-areas"
  | "invalid-minimum-award";

export const MAX_GRANT_ALERT_AUDIENCES = 4;
export const MAX_GRANT_ALERT_LOCATIONS = 56;
export const MAX_GRANT_ALERT_AREAS = 8;
export const MAX_GRANT_ALERT_CSV_BYTES = 255;
export const MAX_GRANT_ALERT_MINIMUM_AWARD_USD = 1_000_000_000;

const audienceIds = new Set<InnovationGrantAudience>(
  INNOVATION_GRANTS_AUDIENCE_FILTERS
    .map(({ id }) => id)
    .filter((id): id is InnovationGrantAudience => id !== "all"),
);
const locationIds = new Set<InnovationGrantJurisdictionCode>(
  INNOVATION_GRANT_JURISDICTIONS.map(({ code }) => code),
);
const areaIds = new Set<InnovationGrantArea>(
  INNOVATION_GRANTS_AREA_FILTERS
    .map(({ id }) => id)
    .filter((id): id is InnovationGrantArea => id !== "all"),
);

const requiredFields = ["audiences", "locations", "areas", "minimumAwardUsd"] as const;
const allowedFields = new Set<string>(requiredFields);

function csvByteLength(value: string): number {
  return new TextEncoder().encode(value).byteLength;
}

function parseIdList<T extends string>(
  value: unknown,
  allowedIds: ReadonlySet<T>,
  maxCount: number,
): T[] | null {
  if (typeof value === "string") {
    if (csvByteLength(value) > MAX_GRANT_ALERT_CSV_BYTES) return null;
    if (value === "") return [];
    const entries = value.split(",");
    return parseIdEntries(entries, allowedIds, maxCount);
  }

  if (!Array.isArray(value) || value.length > maxCount) return null;
  const parsed = parseIdEntries(value, allowedIds, maxCount);
  if (!parsed || csvByteLength(parsed.join(",")) > MAX_GRANT_ALERT_CSV_BYTES) return null;
  return parsed;
}

function parseIdEntries<T extends string>(
  entries: readonly unknown[],
  allowedIds: ReadonlySet<T>,
  maxCount: number,
): T[] | null {
  if (entries.length > maxCount) return null;
  const parsed: T[] = [];
  const seen = new Set<string>();

  for (const entry of entries) {
    if (typeof entry !== "string") return null;
    const id = entry.trim();
    if (!id || !allowedIds.has(id as T) || seen.has(id)) return null;
    seen.add(id);
    parsed.push(id as T);
  }

  return parsed;
}

function parseMinimumAwardUsd(value: unknown): number | null | undefined {
  if (value === null) return null;
  if (typeof value === "number") {
    if (
      Number.isSafeInteger(value) &&
      value > 0 &&
      value <= MAX_GRANT_ALERT_MINIMUM_AWARD_USD
    ) {
      return value;
    }
    return undefined;
  }
  if (typeof value !== "string") return undefined;
  if (value === "" || value.trim() === "") return null;
  if (!/^\d+$/.test(value)) return undefined;

  const parsed = Number(value);
  if (
    Number.isSafeInteger(parsed) &&
    parsed > 0 &&
    parsed <= MAX_GRANT_ALERT_MINIMUM_AWARD_USD
  ) {
    return parsed;
  }
  return undefined;
}

/**
 * Parse form values or stored CSV fields into bounded allowlisted criteria.
 * The object must contain all four fields so an absent stored value cannot
 * silently widen into an "any" preference.
 */
export function parseGrantAlertPreferences(value: unknown): GrantAlertPreferencesParseResult {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return { ok: false, reason: "invalid-object" };
  }

  let keys: string[];
  try {
    const prototype = Object.getPrototypeOf(value);
    if (prototype !== Object.prototype && prototype !== null) {
      return { ok: false, reason: "invalid-object" };
    }
    keys = Object.keys(value);
    if (Reflect.ownKeys(value).length !== keys.length) {
      return { ok: false, reason: "invalid-object" };
    }
  } catch {
    return { ok: false, reason: "invalid-object" };
  }

  if (keys.some((key) => !allowedFields.has(key))) {
    return { ok: false, reason: "unknown-field" };
  }
  if (requiredFields.some((key) => !Object.prototype.hasOwnProperty.call(value, key))) {
    return { ok: false, reason: "missing-field" };
  }

  try {
    const input = value as Record<(typeof requiredFields)[number], unknown>;
    const audiences = parseIdList(
      input.audiences,
      audienceIds,
      MAX_GRANT_ALERT_AUDIENCES,
    );
    if (!audiences) return { ok: false, reason: "invalid-audiences" };

    const locations = parseIdList(
      input.locations,
      locationIds,
      MAX_GRANT_ALERT_LOCATIONS,
    );
    if (!locations) return { ok: false, reason: "invalid-locations" };

    const areas = parseIdList(input.areas, areaIds, MAX_GRANT_ALERT_AREAS);
    if (!areas) return { ok: false, reason: "invalid-areas" };

    const minimumAwardUsd = parseMinimumAwardUsd(input.minimumAwardUsd);
    if (minimumAwardUsd === undefined) {
      return { ok: false, reason: "invalid-minimum-award" };
    }

    return {
      ok: true,
      preferences: { audiences, locations, areas, minimumAwardUsd },
    };
  } catch {
    // Treat throwing getters or malformed host objects as invalid stored data.
    return { ok: false, reason: "invalid-object" };
  }
}

import "server-only";

import {
  getInnovationGrantFundingSnapshot,
  getInnovationGrantPacificAsOfDate,
  innovationGrants,
} from "./innovation-grants";
import type {
  InnovationGrantLocationEligibility,
  InnovationGrantOpportunity,
} from "../innovation-grants-shared";

/**
 * Launch holds are a release boundary, not inventory classifications. The
 * canonical records stay in innovation-grants.ts for local research and later
 * review, while this server-only projection keeps them out of public payloads.
 * Keep this module imported only from server components; client components
 * receive its already-filtered return value as their narrow route prop.
 */
export const INNOVATION_GRANTS_LAUNCH_HELD_IDS = [
  48, 56, 57, 58, 60, 66, 70, 74, 84,
] as const;

const launchHeldIds = new Set<number>(INNOVATION_GRANTS_LAUNCH_HELD_IDS);

const nationwide = (includesTerritories = false): InnovationGrantLocationEligibility => ({
  scope: "nationwide",
  includesTerritories,
});

/**
 * Structured only from the geography evidence already retained on each cleared
 * public record. This projection is intentionally exhaustive: a newly cleared
 * record cannot enter a location-filtered public payload until it is classified.
 */
const LOCATION_ELIGIBILITY_BY_ID: Readonly<Record<number, InnovationGrantLocationEligibility>> = {
  38: { scope: "institution-only" },
  42: nationwide(),
  43: { scope: "state-or-territory", jurisdictions: ["OR"] },
  44: nationwide(),
  51: nationwide(),
  52: { scope: "state-or-territory", jurisdictions: ["TX"] },
  53: nationwide(),
  54: { scope: "state-or-territory", jurisdictions: ["IL"] },
  55: { scope: "state-or-territory", jurisdictions: ["IL"] },
  59: { scope: "state-or-territory", jurisdictions: ["CA"] },
  61: nationwide(),
  62: nationwide(),
  63: nationwide(),
  64: nationwide(),
  65: nationwide(),
  67: nationwide(),
  68: { scope: "state-or-territory", jurisdictions: ["NJ"] },
  69: nationwide(),
  71: nationwide(),
  72: nationwide(),
  73: nationwide(),
  75: nationwide(),
  76: {
    scope: "regional",
    jurisdictions: ["IL", "IN", "IA", "KS", "MI", "MN", "MO", "NE", "ND", "OH", "WI"],
  },
  77: nationwide(),
  78: nationwide(),
  79: nationwide(),
  80: nationwide(),
  81: nationwide(),
  82: { scope: "unresolved" },
  83: nationwide(),
  85: { scope: "institution-only" },
  86: nationwide(),
  87: nationwide(),
  88: nationwide(true),
  89: { scope: "state-or-territory", jurisdictions: ["TX"] },
  90: { scope: "state-or-territory", jurisdictions: ["CA"] },
  91: nationwide(),
  92: nationwide(),
  93: nationwide(),
  94: nationwide(),
  95: nationwide(),
  96: nationwide(),
  97: nationwide(),
  98: nationwide(),
  // Future IBM call geography is unannounced, not inherited from the 2026 call.
  99: { scope: "unresolved" },
  100: nationwide(),
};

export function getPublicInnovationGrants(): InnovationGrantOpportunity[] {
  return innovationGrants
    .filter(
      (opportunity) =>
        opportunity.scopeDisposition === "included" && !launchHeldIds.has(opportunity.id),
    )
    .map((opportunity) => {
      const locationEligibility = LOCATION_ELIGIBILITY_BY_ID[opportunity.id];
      if (!locationEligibility) {
        throw new Error(`Missing public location eligibility for grant ${opportunity.id}.`);
      }
      return { ...opportunity, locationEligibility };
    });
}

export function getPublicInnovationGrantAsOfDate(): Date {
  return getInnovationGrantPacificAsOfDate(new Date());
}

export function getPublicInnovationGrantFundingSnapshot(asOf: Date = getPublicInnovationGrantAsOfDate()) {
  return getInnovationGrantFundingSnapshot(getPublicInnovationGrants(), asOf);
}

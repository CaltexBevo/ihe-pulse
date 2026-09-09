import "server-only";

import {
  getInnovationGrantFundingSnapshot,
  getInnovationGrantPacificAsOfDate,
  innovationGrants,
} from "./innovation-grants";
import type { InnovationGrantOpportunity } from "../innovation-grants-shared";

/**
 * Launch holds are a release boundary, not inventory classifications. The
 * canonical records stay in innovation-grants.ts for local research and later
 * review, while this server-only projection keeps them out of public payloads.
 * Keep this module imported only from server components; client components
 * receive its already-filtered return value as their narrow route prop.
 */
export const INNOVATION_GRANTS_LAUNCH_HELD_IDS = [
  48, 53, 56, 57, 58, 70, 74, 84,
] as const;

const launchHeldIds = new Set<number>(INNOVATION_GRANTS_LAUNCH_HELD_IDS);

export function getPublicInnovationGrants(): InnovationGrantOpportunity[] {
  return innovationGrants.filter(
    (opportunity) =>
      opportunity.scopeDisposition === "included" && !launchHeldIds.has(opportunity.id),
  );
}

export function getPublicInnovationGrantAsOfDate(): Date {
  return getInnovationGrantPacificAsOfDate(new Date());
}

export function getPublicInnovationGrantFundingSnapshot(asOf: Date = getPublicInnovationGrantAsOfDate()) {
  return getInnovationGrantFundingSnapshot(getPublicInnovationGrants(), asOf);
}

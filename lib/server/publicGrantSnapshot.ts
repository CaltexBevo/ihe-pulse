import 'server-only';
import { createHash } from 'node:crypto';
import type { InnovationGrantOpportunity } from '../innovation-grants-shared.ts';

export const PUBLIC_GRANT_FEED = 'https://www.innovatinghighered.com/api/public/grant-inventory';
export function publicGrantSnapshot(grants: InnovationGrantOpportunity[], verifiedOn: string) {
  return { version: 1, verifiedOn, sha256: createHash('sha256').update(JSON.stringify(grants)).digest('hex'), grants };
}
export async function readLivePublicGrants(transport: typeof fetch = fetch) {
  const response = await transport(PUBLIC_GRANT_FEED, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error('Current public grant inventory unavailable.');
  const body = await response.json();
  if (body.version !== 1 || !Array.isArray(body.grants) || body.grants.length > 2000 || typeof body.verifiedOn !== 'string' || body.sha256 !== publicGrantSnapshot(body.grants, body.verifiedOn).sha256) throw new Error('Invalid public grant inventory.');
  const age = Date.now() - Date.parse(body.verifiedOn);
  if (!Number.isFinite(age) || age < -86400_000 || age > 8 * 86400_000) throw new Error('Public grant inventory verification is stale.');
  const ids = new Set<number>();
  for (const grant of body.grants) {
    if (!Number.isSafeInteger(grant.id) || ids.has(grant.id) || grant.scopeDisposition !== 'included' || !grant.locationEligibility || !Array.isArray(grant.audiences) || !Array.isArray(grant.innovationAreas)) throw new Error('Invalid public grant record.');
    ids.add(grant.id);
  }
  return body as { version: 1; verifiedOn: string; sha256: string; grants: InnovationGrantOpportunity[] };
}

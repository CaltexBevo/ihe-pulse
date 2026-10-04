import { getPublicInnovationGrants } from '@/lib/data/innovation-grants-public';
import { INNOVATION_GRANTS_VERIFIED_ON } from '@/lib/innovation-grants-shared';
import { publicGrantSnapshot } from '@/lib/server/publicGrantSnapshot';

export const dynamic = 'force-static';

export async function GET() {
  // Exactly the already-public projection, never the raw/held inventory.
  return Response.json(publicGrantSnapshot(getPublicInnovationGrants(), INNOVATION_GRANTS_VERIFIED_ON), { headers: { 'Cache-Control': 'no-cache' } });
}

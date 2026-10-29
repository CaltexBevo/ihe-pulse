import { internalAnalyticsContextResponse } from '@/lib/internalAnalytics';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export function GET(request: Request) {
  return internalAnalyticsContextResponse(request.headers, process.env.INTERNAL_ANALYTICS_IP_HASHES);
}

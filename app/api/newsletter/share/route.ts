import 'server-only';
import { handleShare } from '@/lib/server/newsletterShare/core';
import { dependencies } from '@/lib/server/newsletterShare/adapters';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;
export async function POST(request: Request) { return handleShare(request, dependencies()); }

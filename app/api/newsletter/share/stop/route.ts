import 'server-only';
import { handleStop } from '@/lib/server/newsletterShare/core';
import { dependencies } from '@/lib/server/newsletterShare/adapters';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST(request: Request) { return handleStop(request, dependencies()); }

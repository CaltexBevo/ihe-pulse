import { handleNewsletterPost, handleNewsletterReadiness } from '@/lib/newsletterSecurity';

export async function POST(request: Request) {
  return handleNewsletterPost(request);
}

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handleNewsletterReadiness(request);
}

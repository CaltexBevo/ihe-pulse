import { handleNewsletterPost } from '@/lib/newsletterSecurity';

export async function POST(request: Request) {
  return handleNewsletterPost(request);
}

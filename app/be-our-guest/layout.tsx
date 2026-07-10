import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'Be Our Guest — Podcast Guest Application | Innovating Higher Ed',
  description:
    'Apply to be a guest on the Innovating Higher Ed podcast. Share your story about AI in higher education with our community of educators and innovators.',
  path: '/be-our-guest',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

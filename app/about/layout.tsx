import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'About | Innovating Higher Ed',
  description:
    'Human Imagination. Shared Progress. Technology to Enrich Learning and Advance Discovery. Meet the team behind Innovating Higher Ed.',
  path: '/about',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

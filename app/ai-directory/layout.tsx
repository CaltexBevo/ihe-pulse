import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'AI Tools Directory — Curated for Higher Ed | Innovating Higher Ed',
  description:
    'Explore AI tool records for higher education with transparent review status. Filter by use case to compare teaching, research, and administration tools.',
  path: '/ai-directory',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

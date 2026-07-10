import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'AI Tools Directory — Curated for Higher Ed | Innovating Higher Ed',
  description:
    'Discover vetted and reviewed AI tools for higher education. Filter by use case to find the right tools for teaching, research, and administration.',
  path: '/ai-directory',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

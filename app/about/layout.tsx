import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/og';

export const metadata: Metadata = pageMetadata({
  title: 'About | Innovating Higher Ed',
  description:
    'Built by educators, powered by AI, made for you. Meet the team behind Innovating Higher Ed and the A.I. briefing trusted by higher ed professionals across the country.',
  path: '/about',
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

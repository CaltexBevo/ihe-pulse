import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Tools Directory — Curated for Higher Ed | IHE PULSE',
  description:
    'Discover vetted and reviewed AI tools for higher education. Filter by use case to find the right tools for teaching, research, and administration.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

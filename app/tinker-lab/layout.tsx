import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tinker Lab — AI Experiments & Ideas | Innovating Higher Ed',
  description:
    'Explore raw insights from the frontier of AI in education. We test, break, and review AI tools and pedagogical approaches.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

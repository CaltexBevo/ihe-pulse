import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tinker Lab — AI Experiments & Ideas | IHE PULSE',
  description:
    'Explore raw insights from the frontier of AI in education. Dr. Norma Jones tests, breaks, and reviews AI tools and pedagogical approaches.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Pulse — AI News for Higher Ed | IHE PULSE',
  description:
    'Daily AI news and analysis curated for higher education leaders, faculty, and innovators. Stay informed on the latest in AI and teaching.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

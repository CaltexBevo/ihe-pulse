import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Podcast — AI in Higher Education | Innovating Higher Ed',
  description:
    'Listen to weekly conversations on AI in higher education. Practical insights for faculty, administrators, and innovators.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

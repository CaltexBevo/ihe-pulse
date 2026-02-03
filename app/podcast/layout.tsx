import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Podcast — AI in Higher Education | IHE PULSE',
  description:
    'Listen to weekly conversations on AI in higher education with Dr. Norma Jones. Practical insights for faculty, administrators, and innovators.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

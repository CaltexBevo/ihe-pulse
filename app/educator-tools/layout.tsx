import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Educator Tools — Templates & Resources | Innovating Higher Ed',
  description:
    'Download ready-to-use syllabus templates, assessment rubrics, AI policy guides, and workshop materials for higher education faculty.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

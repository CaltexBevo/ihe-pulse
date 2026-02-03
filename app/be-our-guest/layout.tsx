import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Be Our Guest — Podcast Guest Application | IHE PULSE',
  description:
    'Apply to be a guest on the IHE PULSE podcast. Share your story about AI in higher education with our community of educators and innovators.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

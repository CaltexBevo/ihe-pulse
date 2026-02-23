import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prompt Navigator — Curated AI Prompts | Innovating Higher Ed',
  description:
    'Browse expert-crafted AI prompts for teaching, research, and administration. Copy, customize, and deploy in your favorite AI tool.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

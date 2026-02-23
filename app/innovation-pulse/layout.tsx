import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Innovation Pulse — Daily AI & Innovation in Higher Ed | Innovating Higher Ed',
  description:
    'Your daily briefing on what\'s happening in AI and higher education — curated, analyzed, and delivered by the Innovating Higher Ed team. Not just headlines — the stories that matter.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

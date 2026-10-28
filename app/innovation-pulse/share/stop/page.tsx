import type { Metadata } from 'next';
import StopSharedEmail from './StopSharedEmail';
export const metadata: Metadata = { title: 'Stop shared newsletters | Innovating Higher Ed', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export default function StopPage() {
  return <section className="max-w-2xl mx-auto px-5 py-20"><h1 className="text-4xl font-bold mb-6">Stop shared newsletters</h1><p className="text-[var(--text-secondary)] mb-8">Confirm below to block future newsletters shared to this address. This does not change any newsletter subscription you chose separately.</p><StopSharedEmail /></section>;
}

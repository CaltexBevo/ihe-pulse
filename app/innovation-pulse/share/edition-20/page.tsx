import type { Metadata } from 'next';
import ShareNewsletterForm from '../edition-21/ShareNewsletterForm';
import { configured } from '@/lib/server/newsletterShare/core';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Share Edition 20 | Innovating Higher Ed', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export default function ShareNewsletterPage() {
  return <section className="max-w-2xl mx-auto px-5 py-16 sm:py-24">
    <p className="text-[var(--cyan)] text-sm font-semibold tracking-wider uppercase mb-4">The Innovation Pulse: Edition 20</p>
    <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text)] mb-6">Send the full newsletter</h1>
    <p className="text-lg leading-relaxed text-[var(--text-secondary)] mb-8">Give a colleague the complete edition to read and listen to: stories, the selected Feature preview, images and listening links in their email.</p>
    <ShareNewsletterForm edition="edition-20" available={configured(process.env)} />
  </section>;
}

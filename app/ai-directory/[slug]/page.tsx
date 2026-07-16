import { notFound } from 'next/navigation';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import { pageMetadata } from '@/lib/og';
import { paletteFor } from '@/lib/palette';
import {
  ArrowLeft,
  ExternalLink,
  BadgeCheck,
  CheckCircle,
  XCircle,
  Target,
  Puzzle,
  DollarSign,
  Calendar,
  Zap,
  Lightbulb,
} from 'lucide-react';

// ── Types ───────────────────────────────────────────────────

interface AiTool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  accent: string;
  badge: string | null;
  values: string[];
  tasks: string[];
  roles: string[];
  pricing: {
    model: string;
    startingPrice?: string;
    details: string;
  };
  keyFeatures?: string[];
  pros?: string[];
  cons?: string[];
  bestFor?: string[];
  strengths?: string[] | null;
  limitations?: string[] | null;
  quickstart?: string | null;
  integrations?: string[];
  domain: string;
  platformUrl: string;
  lastUpdated: string;
  verified: boolean;
  staffPick: boolean;
}

interface AiAppsData {
  tools: AiTool[];
  categories: string[];
  lastUpdated: string;
}

// ── Data loading ────────────────────────────────────────────

function getAppsData(): AiAppsData {
  const filePath = path.join(process.cwd(), 'public', 'data', 'ai-apps.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContents);
}

function getAppBySlug(slug: string): AiTool | undefined {
  const data = getAppsData();
  return data.tools.find((app) => app.slug === slug);
}

function getAllSlugs(): string[] {
  const data = getAppsData();
  return data.tools.map((app) => app.slug);
}

// ── Static params & metadata ────────────────────────────────

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) return {};
  return pageMetadata({
    title: `${app.name} — AI Directory | Innovating Higher Ed`,
    description: app.tagline,
    path: `/ai-directory/${slug}`,
  });
}

// ── Components ──────────────────────────────────────────────

function PricingBadge({ model }: { model: string }) {
  const styles: Record<string, string> = {
    free: 'bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/20',
    freemium: 'bg-[var(--purple)]/10 text-[var(--purple)] border-[var(--purple)]/20',
    paid: 'bg-[var(--amber)]/10 text-[var(--amber)] border-[var(--amber)]/20',
  };
  const labels: Record<string, string> = {
    free: 'Free',
    freemium: 'Freemium',
    paid: 'Paid',
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[model] ?? styles.paid}`}
    >
      {labels[model] ?? model}
    </span>
  );
}

function ToolBadge({ badge }: { badge: string }) {
  const styles: Record<string, string> = {
    new: 'bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/20',
    trending: 'bg-[var(--amber)]/10 text-[var(--amber)] border-[var(--amber)]/20',
    updated: 'bg-[var(--purple)]/10 text-[var(--purple)] border-[var(--purple)]/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded text-[0.7rem] font-semibold uppercase tracking-wider border font-mono ${styles[badge] ?? styles.new}`}>
      {badge}
    </span>
  );
}

// ── Page ────────────────────────────────────────────────────

export default async function AppDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const app = getAppBySlug(slug);

  if (!app) {
    notFound();
  }

  const logoUrl = `https://www.google.com/s2/favicons?domain=${app.domain}&sz=128`;
  const hasDetailedReview = app.strengths && app.limitations && app.quickstart;
  // Palette-locked accent (Rule 17.3): derived from slug, never from data-driven hex.
  const accent = paletteFor(app.slug);
  // WCAG AA: magenta fails 4.5:1 as small text on dark cards and as a bg for
  // dark text. Use the text-safe token for headings and white text on CTAs.
  const isMagenta = accent === "var(--magenta)";
  const accentText = isMagenta ? "var(--magenta-text)" : accent;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/ai-directory"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to AI Directory
        </Link>

        {/* ── Header with accent ─────────────────────────── */}
        <div
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[18px] overflow-hidden mb-6"
          style={{ '--tool-accent': accent } as React.CSSProperties}
        >
          {/* Accent strip */}
          <div className="h-1 rounded-t-[18px]" style={{ background: accent }} />

          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div
                className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden border border-[var(--border)]"
                style={{ borderColor: `color-mix(in srgb, ${accent} 30%, transparent)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt={`${app.name} logo`}
                  className="w-11 h-11 object-contain"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)]">
                    {app.name}
                  </h1>
                  {app.badge && <ToolBadge badge={app.badge} />}
                </div>
                <p className="text-[0.84rem] text-[var(--text-muted)]">{app.category}</p>
                <div className="flex items-center gap-3 mt-3 flex-wrap">
                  <PricingBadge model={app.pricing.model} />
                  {app.verified && (
                    <span className="flex items-center gap-1 text-[var(--cyan)] text-sm font-medium">
                      <BadgeCheck size={16} />
                      Verified
                    </span>
                  )}
                  {app.pricing.startingPrice && (
                    <span className="text-xs text-[var(--text-muted)]">
                      From {app.pricing.startingPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── CTA ────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href={app.platformUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[0.9rem] ${isMagenta ? "text-white" : "text-[var(--bg)]"} transition-all hover:opacity-90 hover:-translate-y-[1px]`}
                style={{ background: accent }}
              >
                Visit {app.name}
                <ExternalLink size={15} />
              </a>
              <div className="flex items-center gap-2 px-4 py-3 text-xs text-[var(--text-muted)]">
                <Calendar size={13} />
                Last updated{' '}
                {new Date(app.lastUpdated).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── What It Does ───────────────────────────────── */}
        <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 sm:p-8 mb-6">
          <h2
            className="text-[0.82rem] font-semibold uppercase tracking-[1.5px] mb-3"
            style={{ color: accentText }}
          >
            What It Does
          </h2>
          <p className="text-[0.94rem] text-[var(--text-muted)] leading-[1.7]">{app.description}</p>
        </section>

        {/* ── Why It Matters for Higher Ed ───────────────── */}
        <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 sm:p-8 mb-6">
          <h2
            className="text-[0.82rem] font-semibold uppercase tracking-[1.5px] mb-4"
            style={{ color: accentText }}
          >
            Why It Matters for Higher Ed
          </h2>
          <ul className="space-y-3">
            {app.values.map((value, i) => (
              <li key={i} className="flex items-start gap-3 text-[0.92rem] text-[var(--text-muted)]">
                <span
                  className="mt-[7px] w-[7px] h-[7px] rounded-sm shrink-0 opacity-70"
                  style={{ background: accent }}
                />
                {value}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Best For (if available) ────────────────────── */}
        {app.bestFor && app.bestFor.length > 0 && (
          <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 sm:p-8 mb-6">
            <h2
              className="text-[0.82rem] font-semibold uppercase tracking-[1.5px] mb-4"
              style={{ color: accentText }}
            >
              Best For
            </h2>
            <p className="text-[0.94rem] text-[var(--text-muted)] leading-[1.7]">
              {typeof app.bestFor === 'string' ? app.bestFor : app.bestFor.join('. ') + '.'}
            </p>
          </section>
        )}

        {/* ── Strengths & Limitations (detailed review) ──── */}
        {hasDetailedReview && (
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <section className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[14px] p-5">
              <h3 className="text-[0.88rem] font-semibold text-[var(--cyan)] mb-3 flex items-center gap-2">
                <CheckCircle size={16} />
                What It Does Well
              </h3>
              <ul className="space-y-2">
                {app.strengths!.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[0.86rem] text-[var(--text-muted)]">
                    <span className="mt-2 w-[6px] h-[6px] rounded-full bg-[var(--cyan)] shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[14px] p-5">
              <h3 className="text-[0.88rem] font-semibold text-[var(--amber)] mb-3 flex items-center gap-2">
                <XCircle size={16} />
                Where It Falls Short
              </h3>
              <ul className="space-y-2">
                {app.limitations!.map((l, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[0.86rem] text-[var(--text-muted)]">
                    <span className="mt-2 w-[6px] h-[6px] rounded-full bg-[var(--amber)] shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* ── Key Features (if available) ────────────────── */}
        {app.keyFeatures && app.keyFeatures.length > 0 && (
          <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 sm:p-8 mb-6">
            <h2
              className="text-[0.82rem] font-semibold uppercase tracking-[1.5px] mb-4"
              style={{ color: accentText }}
            >
              Key Features
            </h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {app.keyFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span
                    className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                    style={{ background: `linear-gradient(135deg, ${accent}, var(--magenta))` }}
                  />
                  <span className="text-[0.88rem] text-[var(--text-secondary)]">{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── Pros & Cons (if available) ─────────────────── */}
        {app.pros && app.cons && (
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5">
              <h3 className="text-[0.88rem] font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-[var(--cyan)]" />
                Pros
              </h3>
              <ul className="space-y-2">
                {app.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={14} className="text-[var(--cyan)] mt-0.5 shrink-0" />
                    <span className="text-[0.86rem] text-[var(--text-secondary)]">{pro}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5">
              <h3 className="text-[0.88rem] font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
                <XCircle size={16} className="text-[var(--amber)]" />
                Cons
              </h3>
              <ul className="space-y-2">
                {app.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <XCircle size={14} className="text-[var(--amber)] mt-0.5 shrink-0" />
                    <span className="text-[0.86rem] text-[var(--text-secondary)]">{con}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* ── Pricing Breakdown ──────────────────────────── */}
        <section className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[14px] p-5 mb-6">
          <h3 className="text-[0.88rem] font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
            <DollarSign size={16} style={{ color: accent }} />
            Pricing Breakdown
          </h3>
          <p className="text-[0.88rem] text-[var(--text-muted)] leading-[1.6]">
            {app.pricing.details}
          </p>
        </section>

        {/* ── Getting Started (quickstart) ───────────────── */}
        {app.quickstart ? (
          <section
            className="rounded-[14px] p-5 mb-6 border"
            style={{
              background: `linear-gradient(135deg, rgba(0,212,255,0.04), rgba(200,80,192,0.03))`,
              borderColor: `rgba(0,212,255,0.12)`,
            }}
          >
            <h3 className="text-[0.88rem] font-semibold text-[var(--cyan)] mb-2 flex items-center gap-2">
              <Lightbulb size={16} />
              Getting Started
            </h3>
            <p className="text-[0.88rem] text-[var(--text-muted)] leading-[1.6]">
              {app.quickstart}
            </p>
          </section>
        ) : (
          <section className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[14px] p-5 mb-6">
            <h3 className="text-[0.88rem] font-semibold text-[var(--text-muted)] mb-2">
              Full Review Coming Soon
            </h3>
            <p className="text-[0.88rem] text-[var(--text-muted)] leading-[1.6]">
              Our editorial team is preparing an in-depth review of {app.name} with strengths, limitations, and getting-started guidance for higher ed use.
            </p>
          </section>
        )}

        {/* ── Integrations ───────────────────────────────── */}
        {app.integrations && app.integrations.length > 0 && (
          <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 mb-6">
            <h3 className="text-[0.88rem] font-semibold text-[var(--text)] mb-3 flex items-center gap-2">
              <Puzzle size={16} style={{ color: accent }} />
              Integrations
            </h3>
            <div className="flex flex-wrap gap-2">
              {app.integrations.map((int, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-[var(--text-muted)] border border-white/5"
                >
                  {int}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ── Role badges ────────────────────────────────── */}
        <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 mb-6">
          <h3 className="text-[0.88rem] font-semibold text-[var(--text)] mb-3">
            Designed For
          </h3>
          <div className="flex flex-wrap gap-2">
            {app.roles.map((role) => (
              <span
                key={role}
                className="px-4 py-1.5 rounded-full text-sm font-medium bg-white/5 text-[var(--text-secondary)] border border-white/5 capitalize"
              >
                {role === 'faculty'
                  ? 'Faculty'
                  : role === 'administrator'
                    ? 'Administrator'
                    : 'Student'}
              </span>
            ))}
          </div>
        </section>

        {/* ── Visit CTA ──────────────────────────────────── */}
        <div className="text-center mb-8">
          <a
            href={app.platformUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-[0.95rem] ${isMagenta ? "text-white" : "text-[var(--bg)]"} transition-all hover:opacity-90 hover:-translate-y-[1px]`}
            style={{ background: accent }}
          >
            Visit {app.name}
            <ExternalLink size={16} />
          </a>
        </div>

        {/* ── Back link ──────────────────────────────────── */}
        <div className="pt-6 border-t border-[var(--border)]">
          <Link
            href="/ai-directory"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to AI Directory
          </Link>
        </div>
      </div>
    </div>
  );
}

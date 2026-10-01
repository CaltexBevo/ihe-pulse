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
  Puzzle,
  DollarSign,
  Calendar,
  Lightbulb,
} from 'lucide-react';
import {
  assertValidAiDirectoryData,
  formatAiDirectoryDate,
  getAiDirectoryReviewLabel,
  type AiDirectoryData,
  type AiDirectoryTool,
  type AiDirectoryReview,
} from '@/lib/data/ai-directory-schema';

type AiTool = AiDirectoryTool;
type AiAppsData = AiDirectoryData;

// ── Data loading ────────────────────────────────────────────

function getAppsData(): AiAppsData {
  const filePath = path.join(process.cwd(), 'public', 'data', 'ai-apps.json');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data: unknown = JSON.parse(fileContents);
  assertValidAiDirectoryData(data);
  return data;
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

// Only the current curated inventory has public detail routes.
export const dynamicParams = false;

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
    'institutional-quote': 'Institutional quote',
    unknown: 'Check pricing',
  };
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[model] ?? styles.paid}`}
    >
      {labels[model] ?? model}
    </span>
  );
}

function ToolBadge({ badge }: { badge: NonNullable<AiTool['badge']> }) {
  const styles: Record<string, string> = {
    new: 'bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/20',
    updated: 'bg-[var(--purple)]/10 text-[var(--purple)] border-[var(--purple)]/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded text-[0.7rem] font-semibold uppercase tracking-wider border font-mono ${styles[badge] ?? styles.new}`}>
      {badge}
    </span>
  );
}

function ReviewStatusBadge({ review }: { review: AiDirectoryReview }) {
  const isCurrent = review.status === 'current' && Boolean(review.reviewedAt);
  const className = isCurrent
    ? 'bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/20'
    : review.status === 'limited'
      ? 'bg-[var(--purple)]/10 text-[var(--purple)] border-[var(--purple)]/20'
      : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${className}`}
      title={review.status === 'blocked' ? review.unresolvedClaims.join(' ') : undefined}
    >
      {isCurrent && <BadgeCheck size={14} aria-hidden="true" />}
      {getAiDirectoryReviewLabel(review)}
    </span>
  );
}

function ToolLogo({ app }: { app: AiTool }) {
  const accent = paletteFor(app.slug);
  const initial = app.name.trim().charAt(0).toUpperCase() || '?';

  return (
    <div
      role="img"
      aria-label={`${app.name} initial`}
      className="w-11 h-11 flex items-center justify-center rounded-lg overflow-hidden text-[1.1rem] font-bold"
      style={{
        color: accent,
      }}
    >
      <span aria-hidden="true">{initial}</span>
    </div>
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

  const hasDetailedReview = app.strengths.length > 0 || app.limitations.length > 0;
  const officialSources = getAppsData().sources.filter((source) => app.review.evidenceIds.includes(source.id));
  const visitUrl = app.review.status === 'retire-candidate'
    ? officialSources.find((source) => source.sourceType === 'official-status')?.url ?? app.platformUrl
    : app.platformUrl;
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
                <ToolLogo app={app} />
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
                  {app.review.status !== 'retire-candidate' && <PricingBadge model={app.pricing.model} />}
                  <ReviewStatusBadge review={app.review} />
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
                href={visitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[0.9rem] text-white transition-all hover:opacity-90 hover:-translate-y-[1px]"
                style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--purple) 65%, black), color-mix(in srgb, var(--magenta) 65%, black))' }}
              >
                {app.review.status === 'retire-candidate' ? 'Read service notice' : `Visit ${app.name}`}
                <ExternalLink size={15} />
              </a>
              <div className="flex items-center gap-2 px-4 py-3 text-xs text-[var(--text-muted)]">
                <Calendar size={13} />
                Content updated{' '}
                {formatAiDirectoryDate(app.review.contentUpdatedAt)}
              </div>
            </div>
            {app.review.status !== 'current' && (
              <p className="mt-4 rounded-lg border border-[var(--cyan)]/20 bg-[var(--cyan)]/[0.04] px-3 py-2 text-xs leading-5 text-[var(--text-muted)]" role="note">
                {app.review.unresolvedClaims.join(' ')}
              </p>
            )}
          </div>
        </div>

        {/* ── What It Does ───────────────────────────────── */}
        <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 sm:p-8 mb-6">
          <h2
            className="text-[0.82rem] font-semibold uppercase tracking-[1.5px] mb-3"
            style={{ color: accentText }}
          >
            {app.review.status === 'retire-candidate' ? 'Service Status' : 'What It Does'}
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
        {app.review.status !== 'retire-candidate' && app.bestFor.length > 0 && (
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
            {app.strengths.length > 0 && (
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
            )}
            {app.limitations.length > 0 && (
            <section className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[14px] p-5">
              <h3 className="text-[0.88rem] font-semibold text-[var(--amber)] mb-3 flex items-center gap-2">
                <XCircle size={16} />
                Limitations to Check
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
            )}
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
        {app.pros.length > 0 && app.cons.length > 0 && (
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
          <h2 className="text-[0.88rem] font-semibold text-[var(--text)] mb-2 flex items-center gap-2">
            <DollarSign size={16} style={{ color: accent }} />
            Pricing Breakdown
          </h2>
          <p className="text-[0.88rem] text-[var(--text-muted)] leading-[1.6]">
            {app.pricing.details}
          </p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">Access information checked {formatAiDirectoryDate(app.pricing.checkedAt)}. {app.review.status === 'retire-candidate' ? 'Read the official notice for the service timeline.' : 'Confirm the current plan before subscribing.'}</p>
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
        ) : null}

        <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 mb-6">
          <h2 className="font-semibold text-[var(--cyan)] mb-2">Sources and review</h2>
          <p className="text-sm text-[var(--text-muted)] mb-3">Official information checked {formatAiDirectoryDate(app.review.reviewedAt)}. Practical uses are editorial suggestions. This is not a hands-on product test or an institutional endorsement.</p>
          <ul className="space-y-2 text-sm">
            {officialSources.filter((source, index, all) => all.findIndex(item => item.url === source.url) === index).map(source => (
              <li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer" className="text-[var(--cyan)] underline underline-offset-4">{source.title}</a></li>
            ))}
          </ul>
        </section>

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
            href={visitUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-[0.95rem] text-white transition-all hover:opacity-90 hover:-translate-y-[1px]"
            style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--purple) 65%, black), color-mix(in srgb, var(--magenta) 65%, black))' }}
          >
            {app.review.status === 'retire-candidate' ? 'Read service notice' : `Visit ${app.name}`}
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

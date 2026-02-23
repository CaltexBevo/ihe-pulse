import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Brain,
  ExternalLink,
  BadgeCheck,
  CheckCircle,
  XCircle,
  Target,
  Puzzle,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { aiApps, getAppBySlug, getCategoryColors } from '@/lib/data/ai-apps';

export function generateStaticParams() {
  return aiApps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) return {};
  return {
    title: `${app.name} — AI Directory | Innovating Higher Ed`,
    description: app.tagline,
  };
}

function PricingBadge({ model }: { model: string }) {
  const styles: Record<string, string> = {
    free: 'bg-green-500/10 text-green-400 border-green-500/20',
    freemium: 'bg-pulse/10 text-pulse border-pulse/20',
    paid: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
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

  const categoryColors = getCategoryColors(app.category);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/ai-directory"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-pulse transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to AI Directory
        </Link>

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-start gap-4 mb-8">
          <div
            className={`shrink-0 w-16 h-16 rounded-2xl ${categoryColors.bg} flex items-center justify-center shadow-lg overflow-hidden`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={app.logoUrl}
              alt={`${app.name} logo`}
              className="w-10 h-10 object-contain"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">
                {app.name}
              </h1>
              {app.verified && (
                <span className="flex items-center gap-1 text-pulse text-sm font-medium">
                  <BadgeCheck size={16} />
                  Verified by IHE
                </span>
              )}
            </div>
            <p className="text-lg text-gray-400">{app.tagline}</p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <PricingBadge model={app.pricing.model} />
              <span className={`text-xs font-medium ${categoryColors.text}`}>
                {app.category}
              </span>
              {app.pricing.startingPrice && (
                <span className="text-xs text-gray-400">
                  From {app.pricing.startingPrice}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── CTA ────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 mb-10">
          <a
            href={app.platformUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pulse to-synapse text-white font-medium text-sm hover:shadow-lg hover:shadow-pulse/20 transition-all"
          >
            Visit {app.name}
            <ExternalLink size={15} />
          </a>
          <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-500">
            <Calendar size={13} />
            Last updated{' '}
            {new Date(app.lastUpdated).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>

        {/* ── Description ────────────────────────────────── */}
        <section className="glass rounded-xl p-6 sm:p-8 mb-6 card-glow-cyan">
          <h2 className="text-xl font-bold text-white mb-3">Overview</h2>
          <p className="text-gray-300 leading-relaxed">{app.description}</p>

          {/* Role badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {app.roles.map((role) => (
              <span
                key={role}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/5 capitalize"
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

        {/* ── Key Features ───────────────────────────────── */}
        <section className="glass rounded-xl p-6 sm:p-8 mb-6 card-glow-fuchsia">
          <h2 className="text-xl font-bold text-white mb-4">Key Features</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {app.keyFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-br from-pulse to-synapse shrink-0" />
                <span className="text-sm text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Pros & Cons ────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <section className="glass rounded-xl p-6 card-glow-cyan">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-400" />
              Pros
            </h2>
            <ul className="space-y-2.5">
              {app.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle
                    size={14}
                    className="text-green-400 mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-gray-300">{pro}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass rounded-xl p-6 card-glow-amber">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <XCircle size={18} className="text-amber-400" />
              Cons
            </h2>
            <ul className="space-y-2.5">
              {app.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <XCircle
                    size={14}
                    className="text-amber-400 mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-gray-300">{con}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ── Best For ───────────────────────────────────── */}
        <section className="glass rounded-xl p-6 sm:p-8 mb-6 card-glow-fuchsia">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target size={18} className="text-synapse" />
            Best For
          </h2>
          <ul className="space-y-2.5">
            {app.bestFor.map((use, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-synapse shrink-0" />
                <span className="text-sm text-gray-300">{use}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Pricing & Integrations ─────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <section className="glass rounded-xl p-6 card-glow-cyan">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <DollarSign size={18} className="text-pulse" />
              Pricing
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {app.pricing.details}
            </p>
          </section>

          <section className="glass rounded-xl p-6 card-glow-cyan">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <Puzzle size={18} className="text-pulse" />
              Integrations
            </h2>
            <div className="flex flex-wrap gap-2">
              {app.integrations.map((int, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/5"
                >
                  {int}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* ── Back link ──────────────────────────────────── */}
        <div className="pt-6 border-t border-white/5">
          <Link
            href="/ai-directory"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-pulse transition-colors"
          >
            <ArrowLeft size={16} />
            Back to AI Directory
          </Link>
        </div>
      </div>
    </div>
  );
}

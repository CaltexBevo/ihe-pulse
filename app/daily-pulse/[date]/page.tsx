import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Zap, Mic, Quote, ExternalLink, Calendar } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import {
  briefings,
  getBriefingByDate,
  getRecentDates,
  formatPulseDate,
  formatShortDate,
  categoryColors,
  type PulseCategory,
  type PulseStory,
} from '@/lib/data/daily-pulse';

// ── Static Params ────────────────────────────────────────────

export function generateStaticParams() {
  return briefings.map((b) => ({ date: b.date }));
}

// ── Metadata ─────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const briefing = getBriefingByDate(date);
  if (!briefing) {
    return { title: 'Briefing Not Found | IHE PULSE' };
  }
  return {
    title: `Daily Pulse — ${formatPulseDate(date)} | IHE PULSE`,
  };
}

// ── Inline Components ────────────────────────────────────────

function CategoryBadge({ category }: { category: PulseCategory }) {
  const colors = categoryColors[category];
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded text-xs font-semibold ${colors.bg} ${colors.text}`}
    >
      {category}
    </span>
  );
}

function StoryCard({ story }: { story: PulseStory }) {
  const colors = categoryColors[story.category];

  return (
    <article className="glass rounded-xl overflow-hidden group hover:border-pulse/20 transition-all hover:-translate-y-0.5">
      {/* Category color band */}
      <div className="h-1" style={{ background: colors.hex }} />

      <div className="p-5 sm:p-6">
        <CategoryBadge category={story.category} />

        <h3 className="text-lg font-semibold text-white mt-3 mb-2 group-hover:text-pulse transition-colors">
          {story.title}
        </h3>

        <p className="text-sm text-gray-400 leading-relaxed mb-4">
          {story.summary}
        </p>

        {/* IHE Perspective */}
        <div className="rounded-lg bg-gradient-to-br from-pulse/5 to-synapse/5 border border-white/5 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Quote size={14} className="text-synapse" />
            <span className="text-xs font-semibold text-synapse uppercase tracking-wider">
              IHE Perspective
            </span>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed italic">
            &ldquo;{story.ihePerspective}&rdquo;
          </p>
          <p className="text-xs text-gray-500 mt-2">&mdash; Dr. Norma Jones</p>
        </div>

        {/* Source */}
        <a
          href={story.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-pulse hover:text-pulse/80 font-medium transition-colors"
        >
          Read Full Story at {story.source}
          <ExternalLink size={12} />
        </a>
      </div>
    </article>
  );
}

// ── Page Component ───────────────────────────────────────────

export default async function DailyPulseDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const briefing = getBriefingByDate(date);

  if (!briefing) {
    notFound();
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-7xl">
        {/* ── Back Link ─────────────────────────────── */}
        <Link
          href="/daily-pulse"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-pulse transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Daily Pulse
        </Link>

        {/* ── Date Heading ──────────────────────────── */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={18} className="text-pulse" />
            <p className="text-sm font-mono text-pulse uppercase tracking-widest">
              Daily Pulse Archive
            </p>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-2">
            {formatPulseDate(date)}
          </h1>
          <p className="text-lg text-gray-400">
            {briefing.stories.length} stor
            {briefing.stories.length !== 1 ? 'ies' : 'y'} curated by Dr. Norma
            Jones.
          </p>
        </div>

        {/* ── Audio Briefing ────────────────────────── */}
        <section className="mb-12">
          <div className="glass rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-pulse/5 via-transparent to-synapse/5">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="shrink-0">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pulse/20 to-synapse/20 border border-white/10 flex items-center justify-center">
                  <Mic size={28} className="text-pulse" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono text-pulse bg-pulse/10 px-2 py-0.5 rounded">
                    MORNING BRIEFING
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {formatPulseDate(briefing.date)}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  {briefing.greeting}
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Dr. Norma Jones&apos;s morning roundup of what matters in AI
                  and higher education.
                </p>
                <AudioPlayer
                  duration={briefing.audioDuration}
                  barCount={50}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Story Grid ────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6">
          {briefing.stories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        {briefing.stories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">
              No stories available for this date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

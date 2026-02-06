import Link from 'next/link';
import {
  Zap,
  Mic,
  Quote,
  ExternalLink,
  Calendar,
  RotateCcw,
  Eye,
  Clock,
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import AudioPlayer from '@/components/AudioPlayer';
import EditorialLensBadge from '@/components/EditorialLensBadge';
import {
  getAllEpisodes,
  getLatestEpisode,
  formatPulseDate,
  formatShortDate,
  categoryColors,
  type StoryCategory,
  type InnovationPulseEpisode,
  type DeepDive,
  type QuickHit,
  type StoryWatching,
} from '@/lib/data/innovation-pulse';

// ── Category Badge Component ─────────────────────────────────────────────────

function CategoryBadge({ category }: { category: StoryCategory }) {
  const colors = categoryColors[category];
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${colors.bg} ${colors.text}`}
    >
      {category}
    </span>
  );
}

// ── Deep Dive Card Component ─────────────────────────────────────────────────

function DeepDiveCard({ deepDive }: { deepDive: DeepDive }) {
  const colors = categoryColors[deepDive.category];

  return (
    <article className="glass rounded-2xl overflow-hidden group hover:border-pulse/20 transition-all">
      {/* Top bar with DEEP DIVE badge */}
      <div
        className="h-1.5"
        style={{ background: `linear-gradient(90deg, ${colors.hex}, #c850c0)` }}
      />

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-pulse/20 to-synapse/20 text-pulse border border-pulse/30">
            <Zap size={12} />
            Deep Dive
          </span>

          {deepDive.isCallback && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
              <RotateCcw size={10} />
              Callback
            </span>
          )}

          <CategoryBadge category={deepDive.category} />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-pulse transition-colors">
          {deepDive.title}
        </h2>

        <p className="text-base text-gray-300 leading-relaxed mb-6">
          {deepDive.summary}
        </p>

        {deepDive.isCallback && deepDive.callbackFirstCovered && (
          <p className="text-xs text-gray-500 mb-4 font-mono">
            First covered: {formatPulseDate(deepDive.callbackFirstCovered)}
          </p>
        )}

        <a
          href={deepDive.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-pulse hover:text-pulse/80 font-medium transition-colors"
        >
          Read Full Story at {deepDive.source}
          <ExternalLink size={14} />
        </a>
      </div>
    </article>
  );
}

// ── Quick Hit Card Component ─────────────────────────────────────────────────

function QuickHitCard({ hit }: { hit: QuickHit }) {
  const colors = categoryColors[hit.category];

  return (
    <article className="glass rounded-xl overflow-hidden group hover:border-pulse/20 transition-all hover:-translate-y-0.5">
      <div className="h-1" style={{ background: colors.hex }} />

      <div className="p-5">
        <CategoryBadge category={hit.category} />

        <h3 className="text-base font-semibold text-white mt-3 mb-2 group-hover:text-pulse transition-colors leading-snug">
          {hit.title}
        </h3>

        <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
          {hit.summary}
        </p>

        <a
          href={hit.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-pulse hover:text-pulse/80 font-medium transition-colors"
        >
          {hit.source}
          <ExternalLink size={10} />
        </a>
      </div>
    </article>
  );
}

// ── Stories We're Watching Component ─────────────────────────────────────────

function StoriesWatching({ stories }: { stories: StoryWatching[] }) {
  if (stories.length === 0) return null;

  return (
    <section className="glass rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-synapse/5 to-transparent">
      <div className="flex items-center gap-2 mb-6">
        <Eye size={18} className="text-synapse" />
        <h2 className="text-lg font-bold text-white">Stories We&apos;re Watching</h2>
      </div>

      <div className="space-y-4">
        {stories.map((story) => (
          <div
            key={story.threadId}
            className="glass rounded-xl p-4 border-l-2 border-synapse/50"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-sm font-semibold text-white">{story.label}</h3>
              <span className="flex items-center gap-1.5 text-[10px] font-mono text-synapse shrink-0">
                <span className="w-2 h-2 rounded-full bg-synapse animate-pulse" />
                Day {story.daysSinceFirstCovered + 1}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {story.update}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Closing Thought Component ────────────────────────────────────────────────

function ClosingThought({ thought }: { thought: string }) {
  return (
    <section className="glass rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-pulse/5 via-transparent to-synapse/5 border-l-4 border-gradient-to-b from-pulse to-synapse">
      <div className="flex items-start gap-4">
        <Quote size={24} className="text-synapse shrink-0 mt-1" />
        <div>
          <p className="text-lg text-gray-200 leading-relaxed italic mb-4">
            &ldquo;{thought}&rdquo;
          </p>
          <p className="text-sm text-gray-500">— Dr. Norma Jones</p>
        </div>
      </div>
    </section>
  );
}

// ── Episode Archive Card ─────────────────────────────────────────────────────

function EpisodeArchiveCard({ episode }: { episode: InnovationPulseEpisode }) {
  const storyCount =
    1 + episode.quickHits.length + episode.storiesWatching.length;

  return (
    <Link
      href={`/innovation-pulse/${episode.date}`}
      className="glass rounded-xl p-5 group hover:border-pulse/20 transition-all hover:-translate-y-0.5 block"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-lg font-bold text-white group-hover:text-pulse transition-colors">
            {formatShortDate(episode.date)}
          </p>
          <p className="text-xs text-gray-500 font-mono">{episode.dayOfWeek}</p>
        </div>
        <EditorialLensBadge lens={episode.editorialLens} size="sm" />
      </div>

      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
        {episode.editorialHook}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {storyCount} {storyCount === 1 ? 'story' : 'stories'}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-500">
          <Clock size={12} />
          {episode.audioDuration}
        </span>
      </div>
    </Link>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────────

export default function InnovationPulsePage() {
  const episode = getLatestEpisode();
  const allEpisodes = getAllEpisodes();
  const archiveEpisodes = allEpisodes.slice(1); // Exclude today's episode

  if (!episode) {
    return (
      <PageTransition>
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              No Episodes Yet
            </h1>
            <p className="text-gray-400">Check back soon for the latest news.</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          {/* ── Hero Section ──────────────────────────────────── */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-pulse" />
              <p className="text-sm font-mono text-pulse uppercase tracking-widest">
                The Innovation Pulse
              </p>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-4">
              Daily AI &{' '}
              <span className="gradient-text">Innovation</span>
              <br />
              in Higher Education
            </h1>
            <p className="text-lg text-gray-400 max-w-3xl">
              Your daily briefing on what&apos;s happening in AI and higher education
              — curated, analyzed, and delivered by Dr. Norma Jones. Not just
              headlines — the stories that matter, the questions nobody&apos;s asking,
              and the developments worth watching.
            </p>
          </div>

          {/* ── Today's Episode Header ────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-gray-500 flex items-center gap-1">
                <Calendar size={12} />
                {formatPulseDate(episode.date)}
              </span>
              <EditorialLensBadge lens={episode.editorialLens} />
            </div>
          </div>

          {/* ── Editorial Hook ────────────────────────────────── */}
          <div className="glass rounded-2xl p-6 sm:p-8 mb-8 bg-gradient-to-br from-pulse/5 via-transparent to-synapse/5">
            <p className="text-xl sm:text-2xl text-white font-medium leading-relaxed">
              {episode.editorialHook}
            </p>
          </div>

          {/* ── Audio Player ──────────────────────────────────── */}
          <section className="mb-12">
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pulse/20 to-synapse/20 border border-white/10 flex items-center justify-center">
                    <Mic size={28} className="text-pulse" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-pulse bg-pulse/10 px-2 py-0.5 rounded">
                      LISTEN NOW
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {episode.audioDuration}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-1">
                    Today&apos;s Briefing
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Dr. Norma Jones&apos;s daily roundup of what matters in AI and
                    higher education.
                  </p>
                  <AudioPlayer
                    duration={episode.audioDuration}
                    barCount={50}
                    audioSrc={episode.audioUrl}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* ── Deep Dive Section ─────────────────────────────── */}
          <section className="mb-12">
            <DeepDiveCard deepDive={episode.deepDive} />
          </section>

          {/* ── Quick Hits Section ────────────────────────────── */}
          {episode.quickHits.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap size={18} className="text-pulse" />
                Quick Hits
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {episode.quickHits.map((hit, i) => (
                  <QuickHitCard key={i} hit={hit} />
                ))}
              </div>
            </section>
          )}

          {/* ── Stories We're Watching ────────────────────────── */}
          {episode.storiesWatching.length > 0 && (
            <section className="mb-12">
              <StoriesWatching stories={episode.storiesWatching} />
            </section>
          )}

          {/* ── Closing Thought ───────────────────────────────── */}
          <section className="mb-16">
            <ClosingThought thought={episode.closingThought} />
          </section>

          {/* ── AI Voice Disclaimer ───────────────────────────── */}
          <div className="text-center mb-16">
            <p className="text-xs text-gray-600 italic">
              The Innovation Pulse is produced using AI voice technology based on
              Dr. Norma Jones&apos; voice, with editorial oversight by Dr. Jones.
            </p>
          </div>

          {/* ── Episode Archive ───────────────────────────────── */}
          {archiveEpisodes.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar size={18} className="text-pulse" />
                Episode Archive
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {archiveEpisodes.map((ep) => (
                  <EpisodeArchiveCard key={ep.date} episode={ep} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

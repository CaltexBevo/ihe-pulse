'use client';

import { useState, useMemo } from 'react';
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
  ChevronRight,
  ChevronDown,
  Grid3X3,
} from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import EditorialLensBadge from '@/components/EditorialLensBadge';
import {
  categoryColors,
  formatPulseDate,
  formatShortDate,
  editorialLensColors,
  type StoryCategory,
  type InnovationPulseEpisode,
  type DeepDive,
  type StoryWatching,
} from '@/lib/data/innovation-pulse-types';

// ── Types for aggregated stories ────────────────────────────────────────────

interface AggregatedStory {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: StoryCategory;
  date: string;
  type: 'deepDive' | 'quickHit';
  isCallback?: boolean;
}

// ── Category Constants ──────────────────────────────────────────────────────

const ALL_CATEGORIES: StoryCategory[] = [
  'Teaching & Learning',
  'Policy & Ethics',
  'Infrastructure & Operations',
  'Tools & Products',
  'Research & Innovation',
  'Student Experience',
  'Leadership & Strategy',
];

// ── Premium Hero Audio Container ────────────────────────────────────────────

function PremiumHeroAudio({
  episode,
}: {
  episode: InnovationPulseEpisode;
}) {
  const lensColors = editorialLensColors[episode.editorialLens];
  const isGradientLens = episode.editorialLens === "The Innovator's Edge";

  return (
    <div className="relative mb-12">
      {/* Outer glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pulse/30 via-synapse/20 to-pulse/30 rounded-3xl blur-xl opacity-50" />

      {/* Main container */}
      <div className="relative glass rounded-2xl overflow-hidden border border-white/10">
        {/* Top gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-pulse via-synapse to-pulse" />

        <div className="p-6 sm:p-8 lg:p-10">
          {/* Header row */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <Mic size={18} className="text-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-pulse">
                The Innovation Pulse
              </span>
            </div>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400 font-mono">
              {episode.dayOfWeek}, {formatShortDate(episode.date)}
            </span>
            <EditorialLensBadge lens={episode.editorialLens} size="sm" />
          </div>

          {/* Editorial Hook - the star of the show */}
          <div className={`relative pl-5 mb-8 ${isGradientLens ? 'border-l-4 border-pulse' : `border-l-4 ${lensColors.border}`}`}>
            <p className="text-xl sm:text-2xl lg:text-3xl text-white font-medium leading-relaxed italic">
              &ldquo;{episode.editorialHook}&rdquo;
            </p>
          </div>

          {/* Audio Player Section */}
          <div className="bg-black/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-pulse/20 to-synapse/20 text-pulse border border-pulse/30">
                <span className="w-2 h-2 rounded-full bg-pulse animate-pulse" />
                Listen Now
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={12} />
                {episode.audioDuration}
              </span>
            </div>
            <AudioPlayer
              duration={episode.audioDuration}
              barCount={60}
              audioSrc={episode.audioUrl}
            />
            <p className="text-xs text-gray-500 mt-3">
              Dr. Norma Jones • The Innovation Pulse
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Category Filter Pills ───────────────────────────────────────────────────

function CategoryFilterPills({
  selectedCategory,
  onCategoryChange,
  storyCounts,
}: {
  selectedCategory: StoryCategory | 'all';
  onCategoryChange: (category: StoryCategory | 'all') => void;
  storyCounts: Record<StoryCategory, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onCategoryChange('all')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          selectedCategory === 'all'
            ? 'bg-gradient-to-r from-pulse to-synapse text-white'
            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
        }`}
      >
        All Stories
      </button>
      {ALL_CATEGORIES.map((category) => {
        const colors = categoryColors[category];
        const count = storyCounts[category] || 0;
        if (count === 0) return null;

        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === category
                ? `${colors.bg} ${colors.text} border ${colors.border}`
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors.hex }}
            />
            {category}
            <span className="text-xs opacity-60">({count})</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Compact Story Card ──────────────────────────────────────────────────────

function CompactStoryCard({ story }: { story: AggregatedStory }) {
  const colors = categoryColors[story.category];

  return (
    <article className="glass rounded-xl overflow-hidden group hover:border-pulse/20 transition-all hover:-translate-y-0.5">
      <div className="h-1" style={{ background: colors.hex }} />
      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: colors.hex }}
          />
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${colors.text}`}>
            {story.category}
          </span>
          {story.isCallback && (
            <span className="text-[10px] text-amber-400 flex items-center gap-1">
              <RotateCcw size={10} />
            </span>
          )}
        </div>

        <h3 className="text-sm sm:text-base font-semibold text-white mb-2 group-hover:text-pulse transition-colors leading-snug line-clamp-2">
          {story.title}
        </h3>

        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-3 line-clamp-2">
          {story.summary}
        </p>

        <div className="flex items-center justify-between">
          <a
            href={story.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-pulse hover:text-pulse/80 font-medium transition-colors"
          >
            {story.source}
            <ExternalLink size={10} />
          </a>
          <span className="text-[10px] text-gray-600 font-mono">
            {formatShortDate(story.date)}
          </span>
        </div>
      </div>
    </article>
  );
}

// ── Category Section with Show More ─────────────────────────────────────────

function CategorySection({
  category,
  stories,
  initialCount = 3,
}: {
  category: StoryCategory;
  stories: AggregatedStory[];
  initialCount?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const colors = categoryColors[category];
  const displayedStories = expanded ? stories : stories.slice(0, initialCount);
  const hasMore = stories.length > initialCount;

  return (
    <div className="mb-10">
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: colors.hex }}
        />
        <h3 className="text-lg font-bold text-white">{category}</h3>
        <span className="text-xs text-gray-500">
          ({stories.length} {stories.length === 1 ? 'story' : 'stories'})
        </span>
      </div>

      {/* Stories Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedStories.map((story, i) => (
          <CompactStoryCard key={`${story.date}-${i}`} story={story} />
        ))}
      </div>

      {/* Show More Button */}
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${colors.bg} ${colors.text} hover:opacity-80`}
        >
          {expanded ? (
            <>
              Show less
              <ChevronDown size={16} className="rotate-180" />
            </>
          ) : (
            <>
              View all {stories.length} stories
              <ChevronRight size={16} />
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ── Deep Dive Card Component ────────────────────────────────────────────────

function DeepDiveCard({ deepDive }: { deepDive: DeepDive }) {
  const colors = categoryColors[deepDive.category];

  return (
    <article className="glass rounded-2xl overflow-hidden group hover:border-pulse/20 transition-all">
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

          <span
            className={`inline-flex px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${colors.bg} ${colors.text}`}
          >
            {deepDive.category}
          </span>
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

// ── Stories We're Watching Component ────────────────────────────────────────

function StoriesWatching({ stories }: { stories: StoryWatching[] }) {
  if (stories.length === 0) return null;

  return (
    <section className="glass rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-synapse/5 to-transparent">
      <div className="flex items-center gap-2 mb-6">
        <Eye size={18} className="text-synapse" />
        <h2 className="text-lg font-bold text-white">Stories We&apos;re Watching</h2>
        <span className="text-xs text-gray-500 font-mono">(Friday Edition)</span>
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

// ── Closing Thought Component ───────────────────────────────────────────────

function ClosingThought({ thought }: { thought: string }) {
  return (
    <section className="relative">
      {/* Subtle glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pulse/10 via-synapse/10 to-pulse/10 rounded-3xl blur-xl opacity-50" />

      <div className="relative glass rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-pulse/5 via-transparent to-synapse/5 overflow-hidden">
        {/* Gradient border on left */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pulse to-synapse" />

        <div className="flex items-start gap-4 pl-4">
          <Quote size={28} className="text-synapse shrink-0 mt-1 opacity-50" />
          <div>
            <p className="text-lg sm:text-xl text-gray-200 leading-relaxed italic mb-4">
              &ldquo;{thought}&rdquo;
            </p>
            <p className="text-sm text-gray-500">— Dr. Norma Jones, The Innovation Pulse</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Episode Archive Card ────────────────────────────────────────────────────

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

// ── Main Client Component ───────────────────────────────────────────────────

interface InnovationPulseClientProps {
  episode: InnovationPulseEpisode | null;
  allEpisodes: InnovationPulseEpisode[];
  storiesByCategory: Record<StoryCategory, AggregatedStory[]>;
}

export default function InnovationPulseClient({
  episode,
  allEpisodes,
  storiesByCategory,
}: InnovationPulseClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | 'all'>('all');

  const archiveEpisodes = allEpisodes.slice(1);

  const storyCounts = useMemo(() => {
    const counts: Record<StoryCategory, number> = {} as Record<StoryCategory, number>;
    for (const category of ALL_CATEGORIES) {
      counts[category] = storiesByCategory[category]?.length || 0;
    }
    return counts;
  }, [storiesByCategory]);

  // Check if it's Friday for Stories We're Watching
  const isFriday = episode?.dayOfWeek === 'Friday';

  if (!episode) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            No Episodes Yet
          </h1>
          <p className="text-gray-400">Check back soon for the latest news.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-7xl">
        {/* ── Hero Section ──────────────────────────────────── */}
        <div className="mb-8">
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
            — curated, analyzed, and delivered by Dr. Norma Jones.
          </p>
        </div>

        {/* ── Premium Hero Audio Container with Hook ───────── */}
        <PremiumHeroAudio episode={episode} />

        {/* ── Deep Dive Section ─────────────────────────────── */}
        <section className="mb-12">
          <DeepDiveCard deepDive={episode.deepDive} />
        </section>

        {/* ── Stories We're Watching (Friday only) ──────────── */}
        {isFriday && episode.storiesWatching.length > 0 && (
          <section className="mb-12">
            <StoriesWatching stories={episode.storiesWatching} />
          </section>
        )}

        {/* ── Category-Based Story Grid ─────────────────────── */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Grid3X3 size={18} className="text-pulse" />
            <h2 className="text-xl font-bold text-white">All Stories</h2>
          </div>

          <CategoryFilterPills
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            storyCounts={storyCounts}
          />

          {selectedCategory === 'all' ? (
            // Show all categories with 3 stories each
            ALL_CATEGORIES.map((category) => {
              const stories = storiesByCategory[category] || [];
              if (stories.length === 0) return null;
              return (
                <CategorySection
                  key={category}
                  category={category}
                  stories={stories}
                  initialCount={3}
                />
              );
            })
          ) : (
            // Show only selected category
            <CategorySection
              category={selectedCategory}
              stories={storiesByCategory[selectedCategory] || []}
              initialCount={6}
            />
          )}
        </section>

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
  );
}

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Zap,
  Mic,
  Quote,
  ExternalLink,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import AudioPlayer from '@/components/AudioPlayer';
import {
  getTodayBriefing,
  getRecentDates,
  formatPulseDate,
  formatShortDate,
  pulseCategories,
  categoryColors,
  type PulseCategory,
  type PulseStory,
} from '@/lib/data/daily-pulse';

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
          <p className="text-xs text-gray-500 mt-2">— Dr. Norma Jones</p>
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

export default function DailyPulsePage() {
  const [activeCategory, setActiveCategory] = useState<PulseCategory | 'All'>(
    'All'
  );

  const briefing = getTodayBriefing();
  const recentDates = getRecentDates();

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return briefing.stories;
    return briefing.stories.filter((s) => s.category === activeCategory);
  }, [activeCategory, briefing.stories]);

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          {/* ── Hero ─────────────────────────────────── */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-pulse" />
              <p className="text-sm font-mono text-pulse uppercase tracking-widest">
                The Daily Pulse
              </p>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-4">
              Your Daily{' '}
              <span className="gradient-text">AI Briefing</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              AI in higher education news, curated and contextualized by Dr.
              Norma Jones. Updated every weekday morning.
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

          {/* ── Category Filters ──────────────────────── */}
          <section className="mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'All'
                    ? 'bg-gradient-to-r from-pulse to-synapse text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                All Stories
              </button>
              {pulseCategories.map((cat) => {
                const colors = categoryColors[cat];
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? `${colors.bg} ${colors.text} ${colors.border} border`
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Results count ─────────────────────────── */}
          <div className="mb-6 text-sm text-gray-500">
            {filtered.length} stor{filtered.length !== 1 ? 'ies' : 'y'}{' '}
            {activeCategory !== 'All' && (
              <>
                in <span className={categoryColors[activeCategory].text}>{activeCategory}</span>
              </>
            )}
          </div>

          {/* ── Story Grid ────────────────────────────── */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {filtered.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 mb-16">
              <p className="text-gray-500">
                No stories in this category today.
              </p>
            </div>
          )}

          {/* ── Previous Briefings ────────────────────── */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-pulse" />
              Previous Briefings
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {recentDates.map((dateStr, i) => {
                const isToday = i === 0;
                return (
                  <Link
                    key={dateStr}
                    href={`/daily-pulse/${dateStr}`}
                    className={`glass rounded-xl p-4 text-center group hover:border-pulse/20 transition-all hover:-translate-y-0.5 ${
                      isToday ? 'border-pulse/30' : ''
                    }`}
                  >
                    <p className="text-lg font-bold text-white group-hover:text-pulse transition-colors">
                      {formatShortDate(dateStr)}
                    </p>
                    {isToday && (
                      <span className="text-[10px] font-mono text-pulse uppercase">
                        Today
                      </span>
                    )}
                    <ChevronRight
                      size={14}
                      className="mx-auto mt-1 text-gray-600 group-hover:text-pulse transition-colors"
                    />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

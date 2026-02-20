"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import AudioPlayer from "@/components/AudioPlayer";
import Card from "@/components/Card";
import {
  categoryColors,
  formatPulseDate,
  formatShortDate,
  type StoryCategory,
  type InnovationPulseEpisode,
} from "@/lib/data/innovation-pulse-types";

// Types for aggregated stories
interface AggregatedStory {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: StoryCategory;
  date: string;
  type: "deepDive" | "quickHit";
  isCallback?: boolean;
}

// Category Constants
const ALL_CATEGORIES: StoryCategory[] = [
  "Teaching & Learning",
  "Policy & Ethics",
  "Infrastructure & Operations",
  "Tools & Products",
  "Research & Innovation",
  "Student Experience",
  "Leadership & Strategy",
];

// Main Client Component
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
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory | "all">("all");

  const archiveEpisodes = allEpisodes.slice(1);

  const storyCounts = useMemo(() => {
    const counts: Record<StoryCategory, number> = {} as Record<StoryCategory, number>;
    for (const category of ALL_CATEGORIES) {
      counts[category] = storiesByCategory[category]?.length || 0;
    }
    return counts;
  }, [storiesByCategory]);

  const allStories = useMemo(() => {
    const stories: AggregatedStory[] = [];
    for (const category of ALL_CATEGORIES) {
      stories.push(...(storiesByCategory[category] || []));
    }
    return stories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [storiesByCategory]);

  const filteredStories = selectedCategory === "all"
    ? allStories
    : storiesByCategory[selectedCategory] || [];

  if (!episode) {
    return (
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-12 text-center">
        <h1 className="text-[2rem] font-bold text-[var(--text)] mb-4">
          No Briefings Yet
        </h1>
        <p className="text-[var(--text-secondary)]">Check back soon for the latest news.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════
          PAGE HEADER
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-6 animate-[fadeUp_0.7s_ease-out_both]">
        <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--cyan)] mb-2 flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" />
          THE INNOVATION PULSE
        </div>
        <h1 className="font-serif italic text-[clamp(2rem,5vw,2.8rem)] font-normal leading-[1.1] text-[var(--text)] mb-3">
          AI Innovation for Higher Ed
        </h1>
        <p className="text-[0.92rem] text-[var(--text-secondary)] max-w-[620px] leading-[1.6]">
          Daily briefings on what matters most in AI and higher education.
          Curated, contextualized, and delivered with the perspective of
          someone who&apos;s been in the classroom.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════
          LATEST EPISODE HERO
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-10">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

          <div className="grid lg:grid-cols-[1fr_320px]">
            {/* Main Content */}
            <div className="p-6 lg:p-8">
              {/* Date & Lens */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="font-mono text-[0.62rem] tracking-[0.06em] text-[var(--text-muted)]">
                  {formatPulseDate(episode.date)}
                </span>
                <span className="font-mono text-[0.58rem] font-semibold px-2 py-[3px] rounded-[4px] bg-[var(--cyan-dim)] text-[var(--cyan)]">
                  {episode.editorialLens}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="text-[1.15rem] leading-[1.65] text-[var(--text)] mb-6 max-w-[680px]">
                &ldquo;{episode.editorialHook}&rdquo;
              </blockquote>

              {/* Audio Player */}
              <AudioPlayer
                duration={episode.audioDuration}
                credit="Dr. Norma Jones"
              />

              {/* Lead Story */}
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <div className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-[var(--magenta)] mb-2">
                  Lead Story
                </div>
                <h2 className="text-[1.1rem] font-bold leading-[1.25] mb-2">
                  {episode.deepDive.title}
                </h2>
                <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.6] mb-3">
                  {episode.deepDive.summary}
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href={episode.deepDive.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.58rem] text-[var(--cyan)] hover:underline"
                  >
                    {episode.deepDive.source} &#8599;
                  </a>
                  <span
                    className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px]"
                    style={{
                      backgroundColor: `${categoryColors[episode.deepDive.category]?.hex}20`,
                      color: categoryColors[episode.deepDive.category]?.hex,
                    }}
                  >
                    {episode.deepDive.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="bg-[var(--bg-elevated)] p-6 lg:p-8 border-l border-[var(--border)]">
              <div className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
                Also in Today&apos;s Briefing
              </div>

              <ul className="space-y-4">
                {episode.quickHits.map((hit, i) => (
                  <li key={i} className="pb-4 border-b border-[var(--border)] last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-[4px] h-[4px] rounded-full"
                        style={{ backgroundColor: categoryColors[hit.category]?.hex }}
                      />
                      <span
                        className="font-mono text-[0.48rem] tracking-[0.06em] uppercase"
                        style={{ color: categoryColors[hit.category]?.hex }}
                      >
                        {hit.category}
                      </span>
                    </div>
                    <p className="text-[0.82rem] text-[var(--text)] leading-[1.35] line-clamp-2">
                      {hit.title}
                    </p>
                    <a
                      href={hit.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[0.52rem] text-[var(--text-muted)] hover:text-[var(--cyan)] mt-1 block"
                    >
                      {hit.source}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Closing Thought */}
              {episode.closingThought && (
                <div className="mt-6 pt-4 border-t border-[var(--border)]">
                  <div className="font-mono text-[0.55rem] tracking-[0.06em] uppercase text-[var(--amber)] mb-2">
                    Closing Thought
                  </div>
                  <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] italic">
                    &ldquo;{episode.closingThought}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CATEGORY FILTERS
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[0.58rem] text-[var(--text-muted)] tracking-[0.08em] uppercase min-w-[60px]">
            Category
          </span>
          <button
            onClick={() => setSelectedCategory("all")}
            className={`filter-pill ${selectedCategory === "all" ? "active" : ""}`}
          >
            All
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const count = storyCounts[cat] || 0;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                style={{
                  borderColor: selectedCategory === cat ? categoryColors[cat]?.hex : undefined,
                  color: selectedCategory === cat ? categoryColors[cat]?.hex : undefined,
                  backgroundColor: selectedCategory === cat ? `${categoryColors[cat]?.hex}15` : undefined,
                }}
              >
                {cat}
                <span className="opacity-60 ml-1">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          ALL STORIES GRID
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
          {selectedCategory === "all" ? "Recent Stories" : selectedCategory}
          <span className="text-[var(--cyan)] ml-2">({filteredStories.length})</span>
        </div>

        <div className="grid-3">
          {filteredStories.slice(0, 9).map((story, i) => (
            <Card
              key={`${story.date}-${i}`}
              title={story.title}
              teaser={story.summary}
              fullContent={story.summary}
              category={story.category}
              categoryColor={categoryColors[story.category]?.hex}
              source={story.source}
              date={formatShortDate(story.date)}
              badgeText={story.type === "deepDive" ? "Lead Story" : undefined}
              badgeColor="var(--magenta)"
              expandable={true}
            />
          ))}
        </div>

        {filteredStories.length > 9 && (
          <div className="text-center mt-8">
            <button className="btn-secondary">Load more stories</button>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          ARCHIVE SECTION
          ═══════════════════════════════════════════════════════ */}
      {archiveEpisodes.length > 0 && (
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
          <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
            Briefing Archive
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {archiveEpisodes.slice(0, 8).map((ep) => (
              <Link
                key={ep.date}
                href={`/innovation-pulse/${ep.date}`}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 hover:border-[var(--border-hover)] hover:-translate-y-[2px] transition-all duration-300 block group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                    {formatShortDate(ep.date)}
                  </span>
                  <span className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[var(--cyan-dim)] text-[var(--cyan)]">
                    {ep.editorialLens.split(" ").slice(0, 2).join(" ")}
                  </span>
                </div>
                <p className="text-[0.85rem] text-[var(--text)] leading-[1.4] line-clamp-2 group-hover:text-[var(--cyan)] transition-colors">
                  {ep.deepDive.title}
                </p>
                <div className="flex items-center gap-3 mt-2 font-mono text-[0.55rem] text-[var(--text-muted)]">
                  <span>{ep.audioDuration}</span>
                  <span>{ep.quickHits.length + 1} stories</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          NEWSLETTER CTA
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

          <h2 className="font-sans text-[1.4rem] font-bold mb-2">
            Get the Innovation Pulse Delivered
          </h2>
          <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[480px] mx-auto mb-6">
            Every morning, the most important AI developments in higher
            education — curated, contextualized, and ready in under 5 minutes.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-[400px] mx-auto">
            <input
              type="email"
              placeholder="your@email.edu"
              className="input flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* AI Voice Disclaimer */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12 text-center">
        <p className="text-[0.68rem] text-[var(--text-muted)] italic">
          The Innovation Pulse is produced using AI voice technology based on
          Dr. Norma Jones&apos; voice, with editorial oversight by Dr. Jones.
        </p>
      </div>
    </div>
  );
}

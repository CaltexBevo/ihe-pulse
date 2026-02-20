"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
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

// Placeholder images for story cards
const storyImages = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=340&fit=crop",
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
          HERO SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          {/* Left: Episode Content */}
          <div className="animate-[fadeUp_0.8s_ease-out_both]">
            {/* Label */}
            <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--cyan)] mb-4 flex items-center gap-2">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" />
              THE INNOVATION PULSE
            </div>

            {/* Date + Lens Badge */}
            <div className="font-mono text-[0.75rem] text-[var(--text-muted)] mb-3 flex items-center gap-3">
              <span>{formatPulseDate(episode.date)}</span>
              <span className="inline-flex items-center gap-[0.35rem] px-[0.65rem] py-[0.2rem] rounded-full text-[0.68rem] font-semibold bg-[var(--magenta-dim)] text-[var(--magenta)]">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--magenta)]" />
                {episode.editorialLens}
              </span>
            </div>

            {/* Hook Quote with Gradient Border */}
            <blockquote className="relative pl-6 mb-6">
              <div className="absolute left-0 top-[0.3rem] bottom-[0.3rem] w-[3px] rounded-[2px] bg-gradient-to-b from-[var(--cyan)] to-[var(--magenta)]" />
              <p className="font-sans italic text-[clamp(1.6rem,3.2vw,2.3rem)] leading-[1.3] font-bold text-[var(--text)]">
                &ldquo;{episode.editorialHook}&rdquo;
              </p>
            </blockquote>

            {/* Audio Player */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                {/* Live Badge - JetBrains Mono */}
                <div className="flex items-center gap-[0.35rem] bg-[rgba(74,222,128,0.1)] text-[var(--green)] px-[0.6rem] py-[0.2rem] rounded-full text-[0.65rem] font-semibold font-mono tracking-[0.06em]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" />
                  LISTEN NOW
                </div>
                {/* Duration */}
                <span className="font-mono text-[0.7rem] text-[var(--text-muted)]">
                  {episode.audioDuration}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Play Button */}
                <button className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(0,212,255,0.2)] transition-all hover:scale-[1.06] hover:shadow-[0_6px_28px_rgba(0,212,255,0.3)]">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-[2px]">
                    <polygon points="6,3 20,12 6,21" />
                  </svg>
                </button>
                {/* Waveform */}
                <div className="flex-1 flex items-center h-[44px] gap-[1.5px]">
                  {Array.from({ length: 80 }, (_, i) => {
                    const h = 6 + Math.random() * 30 + Math.sin(i * 0.25) * 10 + Math.cos(i * 0.12) * 6;
                    return (
                      <div
                        key={i}
                        className="w-[3px] rounded-[2px] bg-[var(--surface-2)]"
                        style={{ height: `${Math.max(4, h)}px` }}
                      />
                    );
                  })}
                </div>
                {/* Time */}
                <span className="font-mono text-[0.7rem] text-[var(--text-muted)] shrink-0 min-w-[72px] text-right">
                  0:00 / {episode.audioDuration}
                </span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: TOC */}
          <div className="animate-[fadeUp_0.8s_0.15s_ease-out_both]">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-5">
              <div className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
                In This Issue
              </div>

              <ul className="space-y-0">
                {/* Lead Story */}
                <li className="flex items-start gap-3 py-3 border-b border-[var(--border)] cursor-pointer group">
                  <span className="font-mono text-[0.58rem] tracking-[0.06em] font-medium px-[0.45rem] py-[0.15rem] rounded-[4px] whitespace-nowrap mt-[0.15rem] bg-[var(--cyan-dim)] text-[var(--cyan)]">
                    LEAD STORY
                  </span>
                  <div>
                    <p className="text-[0.8rem] text-[var(--text-secondary)] leading-[1.35] group-hover:text-[var(--cyan)] transition-colors">
                      {episode.deepDive.title}
                    </p>
                    <span className="text-[0.62rem] text-[var(--text-muted)] font-mono mt-1">
                      {episode.deepDive.category}
                    </span>
                  </div>
                </li>

                {/* Quick Hits */}
                {episode.quickHits.slice(0, 4).map((hit, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 py-3 border-b border-[var(--border)] last:border-b-0 cursor-pointer group"
                  >
                    <span className="font-mono text-[0.58rem] tracking-[0.06em] font-medium px-[0.45rem] py-[0.15rem] rounded-[4px] whitespace-nowrap mt-[0.15rem] bg-[var(--magenta-dim)] text-[var(--magenta)]">
                      ALSO TODAY
                    </span>
                    <div>
                      <p className="text-[0.8rem] text-[var(--text-secondary)] leading-[1.35] group-hover:text-[var(--cyan)] transition-colors">
                        {hit.title}
                      </p>
                      <span className="text-[0.62rem] text-[var(--text-muted)] font-mono mt-1">
                        {hit.category}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          CATEGORY FILTERS
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-8">
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
          ALL STORIES GRID - EVERY CARD HAS IMAGE
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)]">
            {selectedCategory === "all" ? "Recent Stories" : selectedCategory}
            <span className="text-[var(--cyan)] ml-2">({filteredStories.length})</span>
          </div>
          <Link
            href="#"
            className="font-mono text-[0.62rem] text-[var(--cyan)] tracking-[0.06em] hover:text-[var(--text)] transition-colors"
          >
            MORE &rarr;
          </Link>
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
              imageUrl={storyImages[i % storyImages.length]}
              badgeText={story.type === "deepDive" ? "Lead Story" : "Story"}
              badgeColor={story.type === "deepDive" ? "rgba(200,80,192,0.85)" : "rgba(0,180,220,0.85)"}
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
                <p className="text-[0.85rem] font-bold text-[var(--text)] leading-[1.4] line-clamp-2 group-hover:text-[var(--cyan)] transition-colors">
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

          <h2 className="font-sans text-[1.6rem] font-bold mb-2">
            Never Miss a Pulse
          </h2>
          <p className="text-[0.85rem] text-[var(--text-secondary)] max-w-[480px] mx-auto mb-6">
            Get the daily briefing delivered to your inbox. Curated AI news for higher education — no fluff, no hype.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-[400px] mx-auto mb-2">
            <input
              type="email"
              placeholder="your@university.edu"
              className="input flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe Free
            </button>
          </form>

          <p className="text-[0.68rem] text-[var(--text-muted)]">
            Join 1,200+ educators. No spam. Unsubscribe anytime.
          </p>
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

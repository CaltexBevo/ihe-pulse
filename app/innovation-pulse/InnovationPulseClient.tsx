"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
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
  callbackDate?: string;
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

// Category badge text mapping
const CATEGORY_BADGE_TEXT: Record<StoryCategory, string> = {
  "Teaching & Learning": "TOP STORY",
  "Student Experience": "STUDENT",
  "Leadership & Strategy": "LEADERSHIP",
  "Tools & Products": "PRODUCT",
  "Research & Innovation": "RESEARCH",
  "Policy & Ethics": "POLICY",
  "Infrastructure & Operations": "INFRA",
};

// Category badge colors
const CATEGORY_BADGE_COLORS: Record<StoryCategory, string> = {
  "Teaching & Learning": "rgba(0,212,255,0.85)",
  "Student Experience": "rgba(46,230,168,0.85)",
  "Leadership & Strategy": "rgba(200,80,192,0.85)",
  "Tools & Products": "rgba(139,92,246,0.85)",
  "Research & Innovation": "rgba(59,130,246,0.85)",
  "Policy & Ethics": "rgba(245,166,35,0.85)",
  "Infrastructure & Operations": "rgba(249,115,22,0.85)",
};

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [newsletterFrequency, setNewsletterFrequency] = useState<"daily" | "weekly">("daily");
  const waveformRef = useRef<HTMLDivElement>(null);

  const archiveEpisodes = allEpisodes.slice(1);

  const storyCounts = useMemo(() => {
    const counts: Record<StoryCategory, number> = {} as Record<StoryCategory, number>;
    for (const category of ALL_CATEGORIES) {
      counts[category] = storiesByCategory[category]?.length || 0;
    }
    return counts;
  }, [storiesByCategory]);

  // Get stories organized by category for grouped display
  const categorizedStories = useMemo(() => {
    const result: { category: StoryCategory; stories: AggregatedStory[] }[] = [];
    for (const category of ALL_CATEGORIES) {
      const stories = storiesByCategory[category] || [];
      if (stories.length > 0) {
        result.push({ category, stories: stories.slice(0, 3) });
      }
    }
    return result;
  }, [storiesByCategory]);

  const allStories = useMemo(() => {
    const stories: AggregatedStory[] = [];
    for (const category of ALL_CATEGORIES) {
      stories.push(...(storiesByCategory[category] || []));
    }
    return stories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [storiesByCategory]);

  // Scroll to category section
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Toggle play state
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

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

  // Get the lead story for the featured section
  const leadStory = episode.deepDive;

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

            {/* FIX 5: Hook Quote with larger font - Updated sizing */}
            <div className="hero-quote-card mb-6">
              <p className="text-[clamp(1.5rem,3vw,2.1rem)] leading-[1.3] font-bold italic relative pl-6 before:content-[''] before:absolute before:left-0 before:top-[0.3rem] before:bottom-[0.3rem] before:w-[3px] before:rounded-[2px] before:bg-gradient-to-b before:from-[var(--cyan)] before:to-[var(--magenta)]">
                &ldquo;{episode.editorialHook}&rdquo;
              </p>
            </div>

            {/* FIX 6: Audio Player with Credit Line and Volume Icon */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                {/* Live Badge */}
                <div className="flex items-center gap-[0.35rem] bg-[rgba(74,222,128,0.1)] text-[var(--green)] px-[0.6rem] py-[0.2rem] rounded-full text-[0.65rem] font-semibold font-mono tracking-[0.06em]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" />
                  LISTEN NOW
                </div>
                {/* Duration */}
                <span className="font-mono text-[0.7rem] text-[var(--text-muted)]">
                  {episode.audioDuration}
                </span>
                {/* Credit Line */}
                <span className="font-mono text-[0.72rem] text-[var(--text-muted)] ml-auto">
                  Dr. Norma Jones &middot; The Innovation Pulse
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* FIX 10: Interactive Play Button */}
                <button
                  onClick={togglePlay}
                  className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(0,212,255,0.2)] transition-all hover:scale-[1.06] hover:shadow-[0_6px_28px_rgba(0,212,255,0.3)]"
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-[2px]">
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                  )}
                </button>
                {/* FIX 10: Animated Waveform */}
                <div ref={waveformRef} className="flex-1 flex items-center h-[44px] gap-[1.5px]">
                  {Array.from({ length: 80 }, (_, i) => {
                    const h = 6 + Math.random() * 30 + Math.sin(i * 0.25) * 10 + Math.cos(i * 0.12) * 6;
                    const isPlayed = i < 14;
                    const isActive = isPlaying && i >= 12 && i < 18;
                    return (
                      <div
                        key={i}
                        className={`w-[3px] rounded-[2px] transition-colors ${
                          isActive
                            ? "bg-gradient-to-t from-[var(--cyan)] to-[var(--magenta)] animate-[waveform_0.8s_ease-in-out_infinite]"
                            : isPlayed
                              ? "bg-[var(--cyan)]"
                              : "bg-[var(--surface-2)]"
                        }`}
                        style={{
                          height: `${Math.max(4, h)}px`,
                          animationDelay: isActive ? `${Math.random() * 0.5}s` : undefined
                        }}
                      />
                    );
                  })}
                </div>
                {/* Time */}
                <span className="font-mono text-[0.7rem] text-[var(--text-muted)] shrink-0 min-w-[72px] text-right">
                  0:00 / {episode.audioDuration}
                </span>
                {/* FIX 6: Volume Icon */}
                <svg
                  className="w-7 h-7 stroke-[var(--text-muted)] hover:stroke-[var(--text)] cursor-pointer transition-colors shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth="1.5"
                >
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Dr. Norma Card + TOC */}
          <div className="animate-[fadeUp_0.8s_0.15s_ease-out_both] space-y-5">
            {/* FIX 1: Dr. Norma Author Card */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-5">
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar with gradient placeholder */}
                <div className="w-[52px] h-[52px] rounded-full border-2 border-[var(--border)] bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center text-white text-[1.2rem] font-bold">
                  NJ
                </div>
                <div>
                  <h3 className="text-[0.9rem] font-semibold text-[var(--text)]">Dr. Norma Jones</h3>
                  <span className="font-mono text-[0.72rem] text-[var(--cyan)]">Host & Founder</span>
                </div>
              </div>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55]">
                Your daily guide to AI in higher education. Connecting the dots between innovation and practice.
              </p>
            </div>

            {/* FIX 8: TOC Card - Changed title to "Today's Stories" */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-5">
              <div className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
                Today&apos;s Stories
              </div>

              <ul className="space-y-0">
                {/* Lead Story */}
                <li className="flex items-start gap-3 py-3 border-b border-[var(--border)] cursor-pointer group">
                  <span className="font-mono text-[0.55rem] tracking-[0.06em] font-semibold px-[0.45rem] py-[0.15rem] rounded-[4px] whitespace-nowrap mt-[0.15rem] bg-[var(--cyan-dim)] text-[var(--cyan)]">
                    LEAD
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

                {/* Quick Hits with FIX 9: CALLBACK support */}
                {episode.quickHits.slice(0, 4).map((hit, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 py-3 border-b border-[var(--border)] last:border-b-0 cursor-pointer group"
                  >
                    <span className={`font-mono text-[0.55rem] tracking-[0.06em] font-semibold px-[0.45rem] py-[0.15rem] rounded-[4px] whitespace-nowrap mt-[0.15rem] ${
                      hit.isCallback
                        ? "bg-[var(--amber-dim)] text-[var(--amber)]"
                        : "bg-[var(--magenta-dim)] text-[var(--magenta)]"
                    }`}>
                      {hit.isCallback ? "CALLBACK" : "STORY"}
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
          FIX 2: FEATURED STORY SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
        <div className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-[var(--text-muted)] flex items-center gap-2 mb-6">
          <span className="text-[var(--cyan)]">LEAD STORY</span> — Today&apos;s Featured
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] overflow-hidden grid md:grid-cols-2 hover:border-[var(--border-hover)] transition-colors">
          {/* Image Side */}
          <div className="relative min-h-[280px] md:min-h-[360px] overflow-hidden">
            <img
              src={storyImages[0]}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-600 hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[rgba(8,8,15,0.4)] to-[rgba(8,8,15,0.1)]" />
            {/* Badges */}
            <div className="absolute top-5 left-5 flex gap-2">
              <span className="font-mono text-[0.62rem] font-semibold tracking-[0.05em] px-[0.6rem] py-[0.25rem] rounded-[6px] bg-[rgba(0,212,255,0.85)] text-[#08080f]">
                LEAD STORY
              </span>
              <span className="font-mono text-[0.62rem] font-semibold tracking-[0.05em] px-[0.6rem] py-[0.25rem] rounded-[6px] bg-[rgba(255,255,255,0.12)] text-[var(--text)] backdrop-blur-[8px]">
                {leadStory.category}
              </span>
            </div>
          </div>

          {/* Content Side */}
          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-[1.5rem] font-bold leading-[1.25] mb-4">
              {leadStory.title}
            </h2>
            <p className="text-[0.88rem] leading-[1.7] text-[var(--text-secondary)] mb-5">
              {leadStory.summary}
            </p>

            {/* Source Link */}
            <a
              href={leadStory.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[0.75rem] text-[var(--cyan)] font-mono px-3 py-[0.35rem] rounded-[8px] bg-[var(--cyan-dim)] hover:bg-[rgba(0,212,255,0.2)] transition-colors w-fit mb-6"
            >
              {leadStory.source}
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>

            {/* Dr. Norma's Take */}
            {leadStory.editorialCallout && (
              <div className="border-t border-[var(--border)] pt-5">
                <div className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-[var(--magenta)] mb-2">
                  Dr. Norma&apos;s Take — {episode.editorialLens}
                </div>
                <p className="italic text-[0.95rem] text-[var(--text)] leading-[1.6]">
                  {leadStory.editorialCallout}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          FIX 3: CATEGORY FILTERS (scroll to sections)
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-8">
        <div className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-[var(--text-muted)] flex items-center gap-2 mb-6">
          <span className="text-[var(--cyan)]">CURATED NEWS</span> — AI in Education & Beyond
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`filter-pill ${selectedCategory === "all" ? "active" : ""}`}
          >
            All Stories
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const count = storyCounts[cat] || 0;
            if (count === 0) return null;
            const catId = cat.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  scrollToCategory(catId);
                }}
                className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                style={{
                  borderColor: selectedCategory === cat ? categoryColors[cat]?.hex : undefined,
                  color: selectedCategory === cat ? categoryColors[cat]?.hex : undefined,
                  backgroundColor: selectedCategory === cat ? `${categoryColors[cat]?.hex}15` : undefined,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FIX 3: GROUPED CATEGORY SECTIONS
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        {categorizedStories.map(({ category, stories }, sectionIdx) => {
          const catId = category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
          const catColor = categoryColors[category]?.hex || "var(--cyan)";

          return (
            <div key={category} id={catId} className="mb-8">
              {/* FIX 3: Category Row Header */}
              <div className="flex items-center gap-[0.6rem] mb-4 mt-8 first:mt-0">
                <span
                  className="w-[7px] h-[7px] rounded-full"
                  style={{ background: catColor }}
                />
                <span
                  className="font-mono text-[0.7rem] tracking-[0.12em] uppercase font-semibold"
                  style={{ color: catColor }}
                >
                  {category}
                </span>
                <Link
                  href="#"
                  className="ml-auto font-mono text-[0.62rem] text-[var(--cyan)] tracking-[0.08em] hover:text-[var(--text)] transition-colors"
                >
                  MORE &rarr;
                </Link>
              </div>

              {/* Story Cards Grid */}
              <div className="grid-3">
                {stories.map((story, i) => (
                  <Card
                    key={`${story.date}-${i}`}
                    title={story.title}
                    teaser={story.summary}
                    fullContent={story.summary}
                    category={story.category}
                    categoryColor={categoryColors[story.category]?.hex}
                    source={story.source}
                    date={formatShortDate(story.date)}
                    imageUrl={storyImages[(sectionIdx * 3 + i) % storyImages.length]}
                    /* FIX 4: Category-specific badge text */
                    badgeText={
                      story.isCallback
                        ? "CALLBACK"
                        : story.type === "deepDive"
                          ? "LEAD"
                          : CATEGORY_BADGE_TEXT[story.category]
                    }
                    badgeColor={
                      story.isCallback
                        ? "rgba(245,166,35,0.85)"
                        : story.type === "deepDive"
                          ? "rgba(0,212,255,0.85)"
                          : CATEGORY_BADGE_COLORS[story.category]
                    }
                    /* FIX 9: Pass callback info */
                    isCallback={story.isCallback}
                    callbackDate={story.callbackDate}
                    expandable={true}
                  />
                ))}
              </div>
            </div>
          );
        })}
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
          FIX 7: NEWSLETTER CTA with Daily/Weekly Toggle
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[24px] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] via-[var(--magenta)] to-[var(--cyan)] bg-[length:200%_100%]" />

          <h2 className="font-sans text-[1.8rem] font-bold mb-2">
            Never Miss a Pulse
          </h2>
          <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[520px] mx-auto mb-6">
            Get the Innovation Pulse delivered to your inbox. Curated AI news for higher education — no fluff, no hype.
          </p>

          {/* FIX 7: Newsletter Frequency Toggle */}
          <div className="flex justify-center gap-4 mb-5">
            <button
              onClick={() => setNewsletterFrequency("daily")}
              className={`font-mono text-[0.7rem] px-4 py-[0.4rem] rounded-full border transition-all ${
                newsletterFrequency === "daily"
                  ? "bg-[var(--cyan-dim)] text-[var(--cyan)] border-[rgba(0,212,255,0.3)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setNewsletterFrequency("weekly")}
              className={`font-mono text-[0.7rem] px-4 py-[0.4rem] rounded-full border transition-all ${
                newsletterFrequency === "weekly"
                  ? "bg-[var(--cyan-dim)] text-[var(--cyan)] border-[rgba(0,212,255,0.3)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
              }`}
            >
              Weekly Digest
            </button>
          </div>

          <form className="flex flex-col sm:flex-row gap-3 max-w-[440px] mx-auto mb-3">
            <input
              type="email"
              placeholder="your@university.edu"
              className="input flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe Free
            </button>
          </form>

          <p className="text-[0.72rem] text-[var(--text-muted)]">
            Join 1,200+ educators. No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>

      {/* AI Voice Disclaimer */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12 text-center border-t border-[var(--border)] pt-4">
        <p className="text-[0.72rem] text-[var(--text-muted)]">
          The Innovation Pulse is produced using AI voice technology based on
          Dr. Norma Jones&apos; voice, with editorial oversight by Dr. Jones.
          <br />
          <Link href="#" className="text-[var(--cyan)] hover:underline">
            Learn more about how we use AI responsibly at Innovating Higher Ed.
          </Link>
        </p>
      </div>
    </div>
  );
}

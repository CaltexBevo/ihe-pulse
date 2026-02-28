"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import NewsletterSignup from "@/components/NewsletterSignup";
import {
  formatPulseDate,
  formatShortDate,
  type InnovationPulseEpisode,
} from "@/lib/data/innovation-pulse-types";
import { getStoryImage, StoryImageAssigner } from "@/lib/utils/story-images";

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

// Helper to render text with paragraph breaks
function renderParagraphs(text: string, className: string): React.ReactNode {
  if (!text) return null;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  if (paragraphs.length <= 1) {
    return <p className={className}>{text}</p>;
  }
  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => (
        <p key={i} className={className}>{para.trim()}</p>
      ))}
    </div>
  );
}

// V4 Category System
type V4Category =
  | "Insights & Trends"
  | "Case Study"
  | "Practical Tips"
  | "Ethical AI"
  | "Latest AI Products"
  | "Beyond Ed"
  | "Week in Review";

const V4_CATEGORIES: V4Category[] = [
  "Insights & Trends",
  "Case Study",
  "Practical Tips",
  "Ethical AI",
  "Latest AI Products",
  "Beyond Ed",
  "Week in Review",
];

const V4_CATEGORY_COLORS: Record<V4Category, { hex: string; bg: string; text: string }> = {
  "Insights & Trends": { hex: "#00d4ff", bg: "rgba(0,212,255,0.15)", text: "text-[#00d4ff]" },
  "Case Study": { hex: "#10b981", bg: "rgba(16,185,129,0.15)", text: "text-[#10b981]" },
  "Practical Tips": { hex: "#f59e0b", bg: "rgba(245,158,11,0.15)", text: "text-[#f59e0b]" },
  "Ethical AI": { hex: "#f43f5e", bg: "rgba(244,63,94,0.15)", text: "text-[#f43f5e]" },
  "Latest AI Products": { hex: "#8b5cf6", bg: "rgba(139,92,246,0.15)", text: "text-[#8b5cf6]" },
  "Beyond Ed": { hex: "#0ea5e9", bg: "rgba(14,165,233,0.15)", text: "text-[#0ea5e9]" },
  "Week in Review": { hex: "#c850c0", bg: "rgba(200,80,192,0.15)", text: "text-[#c850c0]" },
};

const V4_BADGE_TEXT: Record<V4Category, string> = {
  "Insights & Trends": "INSIGHTS",
  "Case Study": "CASE STUDY",
  "Practical Tips": "TIPS",
  "Ethical AI": "ETHICS",
  "Latest AI Products": "PRODUCTS",
  "Beyond Ed": "BEYOND ED",
  "Week in Review": "WEEK REVIEW",
};

const V4_CATEGORY_SLUGS: Record<V4Category, string> = {
  "Insights & Trends": "insights-and-trends",
  "Case Study": "case-study",
  "Practical Tips": "practical-tips",
  "Ethical AI": "ethical-ai",
  "Latest AI Products": "latest-ai-products",
  "Beyond Ed": "beyond-ed",
  "Week in Review": "week-in-review",
};

const OLD_TO_V4_MAP: Record<string, V4Category> = {
  "Research & Innovation": "Insights & Trends",
  "Infrastructure & Operations": "Case Study",
  "Teaching & Learning": "Practical Tips",
  "Policy & Ethics": "Ethical AI",
  "Tools & Products": "Latest AI Products",
  "Student Experience": "Beyond Ed",
  "Leadership & Strategy": "Insights & Trends",
  "Insights & Trends": "Insights & Trends",
  "Case Study": "Case Study",
  "Practical Tips": "Practical Tips",
  "Ethical AI": "Ethical AI",
  "Latest AI Products": "Latest AI Products",
  "Beyond Ed": "Beyond Ed",
  "Week in Review": "Week in Review",
};

function mapToV4Category(oldCategory: string): V4Category {
  return OLD_TO_V4_MAP[oldCategory] || "Insights & Trends";
}

// Types
interface AggregatedStory {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: string;
  date: string;
  type: "deepDive" | "quickHit";
  isCallback?: boolean;
  callbackDate?: string;
}

interface AggregatedStoryWithV4 extends AggregatedStory {
  v4Category: V4Category;
}

interface InnovationPulseClientProps {
  episode: InnovationPulseEpisode | null;
  allEpisodes: InnovationPulseEpisode[];
  storiesByCategory: Record<string, AggregatedStory[]>;
}

// Editorial lens colors
const LENS_COLORS: Record<string, { bg: string; text: string }> = {
  "The Hard Question": { bg: "bg-[var(--amber-dim)]", text: "text-[var(--amber)]" },
  "The Student Experience": { bg: "bg-[var(--green-dim)]", text: "text-[var(--green)]" },
  "The Practitioner's Playbook": { bg: "bg-[var(--cyan-dim)]", text: "text-[var(--cyan)]" },
  "Connecting the Dots": { bg: "bg-[var(--magenta-dim)]", text: "text-[var(--magenta)]" },
  "The Innovator's Edge": { bg: "bg-gradient-to-r from-[var(--cyan-dim)] to-[var(--magenta-dim)]", text: "text-[var(--text)]" },
};

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function InnovationPulseClient({
  episode,
  allEpisodes,
  storiesByCategory,
}: InnovationPulseClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<V4Category | "all">("all");
  const [expandedStory, setExpandedStory] = useState<string | null>(null);

  // Audio state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);

  // Last 5 episodes (sliding window)
  const recentEpisodes = useMemo(() => {
    return allEpisodes.slice(0, 5);
  }, [allEpisodes]);

  // Currently selected episode
  const currentEpisode = recentEpisodes[selectedIndex] || episode;
  const lensColors = currentEpisode ? LENS_COLORS[currentEpisode.editorialLens] || LENS_COLORS["The Hard Question"] : LENS_COLORS["The Hard Question"];

  // Image assigner for page deduplication
  const imageAssigner = useMemo(() => new StoryImageAssigner(), []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration > 0) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setAudioProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentEpisode]);

  // Reload audio when episode changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentEpisode?.audioUrl) {
      audio.load();
      setCurrentTime(0);
      setAudioProgress(0);
      setDuration(0);
      setIsPlaying(false);
    }
  }, [currentEpisode?.audioUrl]);

  const selectDay = useCallback((index: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
    setSelectedIndex(index);
    setExpandedStory(null);
    imageAssigner.reset();
  }, [imageAssigner]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * duration;
  };

  // Get ALL stories aggregated with V4 categories
  const allStoriesWithV4 = useMemo((): AggregatedStoryWithV4[] => {
    const stories: AggregatedStoryWithV4[] = [];
    for (const category of Object.keys(storiesByCategory)) {
      const categoryStories = storiesByCategory[category] || [];
      for (const story of categoryStories) {
        stories.push({
          ...story,
          v4Category: mapToV4Category(story.category),
        });
      }
    }
    return stories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [storiesByCategory]);

  // Group stories by V4 category
  const storiesByV4Category = useMemo(() => {
    const result: Record<V4Category, AggregatedStoryWithV4[]> = {} as Record<V4Category, AggregatedStoryWithV4[]>;
    for (const cat of V4_CATEGORIES) {
      result[cat] = [];
    }
    for (const story of allStoriesWithV4) {
      if (result[story.v4Category]) {
        result[story.v4Category].push(story);
      }
    }
    return result;
  }, [allStoriesWithV4]);

  // Get categorized stories for display
  const categorizedStories = useMemo(() => {
    const result: { category: V4Category; stories: AggregatedStoryWithV4[] }[] = [];
    for (const category of V4_CATEGORIES) {
      const stories = storiesByV4Category[category] || [];
      if (stories.length > 0) {
        result.push({ category, stories: stories.slice(0, 3) });
      }
    }
    return result;
  }, [storiesByV4Category]);

  // Archive episodes (after the first 5)
  const archiveEpisodes = useMemo(() => {
    return allEpisodes.slice(5);
  }, [allEpisodes]);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!episode) {
    return (
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-12 text-center">
        <h1 className="text-[2rem] font-bold text-[var(--text)] mb-4">No Briefings Yet</h1>
        <p className="text-[var(--text-secondary)]">Check back soon for the latest news.</p>
      </div>
    );
  }

  // Get top 3 stories for the 3-card layout
  const leadStory = currentEpisode?.deepDive;
  const topQuickHits = currentEpisode?.quickHits.slice(0, 2) || [];
  const remainingQuickHits = currentEpisode?.quickHits.slice(2) || [];

  return (
    <div className="min-h-screen">
      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={currentEpisode?.audioUrl} preload="metadata" />

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-10">
          {/* Left: Episode Content */}
          <div className="animate-[fadeUp_0.8s_ease-out_both]">
            {/* Label */}
            <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--cyan)] mb-4 flex items-center gap-2">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" />
              THE INNOVATION PULSE
            </div>

            {/* Date + Lens Badge */}
            <div className="font-mono text-[0.75rem] text-[var(--text-muted)] mb-3 flex items-center gap-3">
              <span>{formatPulseDate(currentEpisode?.date || episode.date)}</span>
              <span className={`inline-flex items-center gap-[0.35rem] px-[0.65rem] py-[0.2rem] rounded-full text-[0.68rem] font-semibold ${lensColors.bg} ${lensColors.text}`}>
                <span className="w-[5px] h-[5px] rounded-full bg-current" />
                {currentEpisode?.editorialLens || episode.editorialLens}
              </span>
            </div>

            {/* Hook Quote */}
            <div className="hero-quote-card mb-6">
              <p className="text-[clamp(1.1rem,2vw,1.5rem)] leading-[1.35] font-bold italic relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.2rem] before:bottom-[0.2rem] before:w-[3px] before:rounded-[2px] before:bg-gradient-to-b before:from-[var(--cyan)] before:to-[var(--magenta)]">
                &ldquo;{currentEpisode?.editorialHook || episode.editorialHook}&rdquo;
              </p>
            </div>

            {/* Audio Player */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-5 mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-[0.35rem] bg-[rgba(74,222,128,0.1)] text-[var(--green)] px-[0.6rem] py-[0.2rem] rounded-full text-[0.65rem] font-semibold font-mono tracking-[0.06em]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" />
                  LISTEN NOW
                </div>
                <span className="font-mono text-[0.7rem] text-[var(--text-muted)]">
                  {duration > 0 ? formatTime(duration) : currentEpisode?.audioDuration}
                </span>
                {selectedIndex > 0 && (
                  <span className="font-mono text-[0.65rem] text-[var(--amber)] bg-[var(--amber-dim)] px-2 py-[0.15rem] rounded-full">
                    {formatShortDate(currentEpisode?.date || "")}
                  </span>
                )}
                <span className="font-mono text-[0.68rem] text-[var(--text-muted)] ml-auto hidden sm:block">
                  Innovating Higher Ed
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(0,212,255,0.2)] transition-all hover:scale-[1.06]"
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

                <div className="flex-1 h-[44px] relative cursor-pointer group" onClick={handleProgressClick}>
                  <div className="absolute inset-0 flex items-center gap-[1.5px]">
                    {Array.from({ length: 60 }, (_, i) => {
                      const h = 6 + Math.random() * 26 + Math.sin(i * 0.25) * 8;
                      const progressPercent = (i / 60) * 100;
                      const isPlayed = progressPercent <= audioProgress;
                      return (
                        <div
                          key={i}
                          className={`w-[3px] rounded-[2px] transition-colors ${
                            isPlayed ? "bg-[var(--cyan)]" : "bg-[var(--surface-2)] group-hover:bg-[var(--surface-3)]"
                          }`}
                          style={{ height: `${Math.max(4, h)}px` }}
                        />
                      );
                    })}
                  </div>
                </div>

                <span className="font-mono text-[0.7rem] text-[var(--text-muted)] shrink-0 min-w-[60px] text-right hidden sm:block">
                  {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : currentEpisode?.audioDuration}
                </span>
              </div>
            </div>

            {/* Last 5 Days Pills - Sliding Window */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[0.6rem] text-[var(--text-muted)] tracking-[0.08em] uppercase mr-1">
                Recent:
              </span>
              {recentEpisodes.map((ep, index) => {
                const isSelected = index === selectedIndex;
                const epDate = new Date(ep.date + 'T12:00:00');
                const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][epDate.getDay()];
                const dayNum = epDate.getDate();

                return (
                  <button
                    key={ep.date}
                    onClick={() => selectDay(index)}
                    className={`flex items-center gap-2 px-3 py-[0.4rem] rounded-full border transition-all ${
                      isSelected
                        ? "bg-[var(--cyan-dim)] border-[var(--cyan)] text-[var(--cyan)]"
                        : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    <span className="font-mono text-[0.65rem] font-semibold">{dayName} {dayNum}</span>
                    <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)]" />
                    <span className="font-mono text-[0.6rem]">{ep.audioDuration}</span>
                  </button>
                );
              })}
              <Link href="/innovation-pulse/archive" className="font-mono text-[0.6rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors ml-2">
                Full archive →
              </Link>
            </div>
          </div>

          {/* Right Sidebar: About Card */}
          <div className="animate-[fadeUp_0.8s_0.15s_ease-out_both] hidden lg:block">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-5 sticky top-20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-[52px] h-[52px] rounded-full border-2 border-[var(--border)] bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center text-white text-[1.2rem] font-bold">
                  IP
                </div>
                <div>
                  <h3 className="text-[0.9rem] font-semibold text-[var(--text)]">The Innovation Pulse</h3>
                  <span className="font-mono text-[0.72rem] text-[var(--cyan)]">by Innovating Higher Ed</span>
                </div>
              </div>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55]">
                Your daily guide to A.I. in higher education. Connecting the dots between innovation and practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          TOP STORIES — 3 Card Layout
          ═══════════════════════════════════════════════════════ */}
      <section className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-[var(--text-muted)] flex items-center gap-2">
            <span className="text-[var(--cyan)]">TODAY&apos;S TOP STORIES</span>
            <span>—</span>
            <span>{formatShortDate(currentEpisode?.date || episode.date)}</span>
          </div>
          <Link href="/innovation-pulse/stories" className="font-mono text-[0.65rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors">
            View all lead stories →
          </Link>
        </div>

        {/* 3-Card Grid */}
        <div className="grid-3 mb-8">
          {/* Lead Story Card */}
          {leadStory && (
            <Card
              title={leadStory.title}
              teaser={leadStory.summary}
              fullContent={leadStory.summary}
              editorialCallout={leadStory.editorialCallout}
              category={mapToV4Category(leadStory.category)}
              categoryColor={V4_CATEGORY_COLORS[mapToV4Category(leadStory.category)]?.hex}
              source={leadStory.source}
              sourceUrl={leadStory.sourceUrl}
              date={formatShortDate(currentEpisode?.date || episode.date)}
              imageUrl={imageAssigner.getImage(leadStory.title, leadStory.category)}
              badgeText="LEAD"
              badgeColor="rgba(200,80,192,0.9)"
              expandable={true}
              href={`/innovation-pulse/story/${generateSlug(leadStory.title)}`}
            />
          )}

          {/* Top 2 Quick Hits */}
          {topQuickHits.map((hit, i) => (
            <Card
              key={i}
              title={hit.title}
              teaser={hit.summary}
              fullContent={hit.summary}
              category={mapToV4Category(hit.category)}
              categoryColor={V4_CATEGORY_COLORS[mapToV4Category(hit.category)]?.hex}
              source={hit.source}
              sourceUrl={hit.sourceUrl}
              date={formatShortDate(currentEpisode?.date || episode.date)}
              imageUrl={imageAssigner.getImage(hit.title, hit.category)}
              badgeText="STORY"
              badgeColor={V4_CATEGORY_COLORS[mapToV4Category(hit.category)]?.hex || "rgba(0,212,255,0.9)"}
              expandable={true}
            />
          ))}
        </div>

        {/* OUR TAKE - Always visible for lead story */}
        {leadStory?.editorialCallout && (
          <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-[16px] p-6 relative overflow-hidden mb-8">
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--magenta)] to-[var(--cyan)]" />
            <div className="pl-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase font-semibold text-[var(--magenta)]">
                  Our Take
                </span>
                <span className="font-mono text-[0.6rem] px-[0.55rem] py-[0.18rem] rounded-[4px] bg-[var(--magenta-dim)] text-[var(--magenta)]">
                  {currentEpisode?.editorialLens}
                </span>
              </div>
              <div className="text-[1rem] text-[var(--text)] leading-[1.7] italic max-w-[800px]">
                {renderParagraphs(leadStory.editorialCallout, "")}
              </div>
            </div>
          </div>
        )}

        {/* Remaining Quick Hits */}
        {remainingQuickHits.length > 0 && (
          <div className="mb-8">
            <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
              Also Today
            </div>
            <div className="space-y-3">
              {remainingQuickHits.map((hit, i) => {
                const v4Cat = mapToV4Category(hit.category);
                const isExpanded = expandedStory === hit.title;

                return (
                  <div
                    key={i}
                    className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-4 hover:border-[var(--border-hover)] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className="font-mono text-[0.55rem] font-semibold px-[0.5rem] py-[0.15rem] rounded-[4px] uppercase"
                            style={{ backgroundColor: V4_CATEGORY_COLORS[v4Cat]?.bg, color: V4_CATEGORY_COLORS[v4Cat]?.hex }}
                          >
                            {v4Cat}
                          </span>
                          <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">{hit.source}</span>
                        </div>
                        <h3 className="font-sans text-[0.95rem] font-bold leading-[1.3] mb-2">{hit.title}</h3>
                        <p className={`text-[0.82rem] text-[var(--text-secondary)] leading-[1.6] ${isExpanded ? "" : "line-clamp-2"}`}>
                          {hit.summary}
                        </p>
                        {hit.summary.length > 150 && (
                          <button
                            onClick={() => setExpandedStory(isExpanded ? null : hit.title)}
                            className="font-mono text-[0.68rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors mt-2"
                          >
                            {isExpanded ? "Show less ↑" : "Read more ↓"}
                          </button>
                        )}
                      </div>
                      <a
                        href={hit.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[0.65rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors shrink-0"
                      >
                        Source ↗
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          NEWSLETTER SIGNUP
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-8">
        <NewsletterSignup variant="inline" />
      </div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          V4 CATEGORY FILTERS
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
          {V4_CATEGORIES.map((cat) => {
            const count = storiesByV4Category[cat]?.length || 0;
            const hasStories = count > 0;
            const catId = cat.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
            const catColor = V4_CATEGORY_COLORS[cat];

            if (hasStories) {
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    scrollToCategory(catId);
                  }}
                  className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                  style={{
                    borderColor: selectedCategory === cat ? catColor?.hex : undefined,
                    color: selectedCategory === cat ? catColor?.hex : undefined,
                    backgroundColor: selectedCategory === cat ? `${catColor?.hex}15` : undefined,
                  }}
                >
                  {cat}
                </button>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CATEGORY SECTIONS
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        {categorizedStories.map(({ category, stories }) => {
          const catId = category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
          const catColor = V4_CATEGORY_COLORS[category]?.hex || "var(--cyan)";
          const catSlug = V4_CATEGORY_SLUGS[category];

          return (
            <div key={category} id={catId} className="mb-8">
              <div className="flex items-center gap-[0.6rem] mb-4 mt-8 first:mt-0">
                <span className="w-[7px] h-[7px] rounded-full" style={{ background: catColor }} />
                <span className="font-mono text-[0.7rem] tracking-[0.12em] uppercase font-semibold" style={{ color: catColor }}>
                  {category}
                </span>
                <Link href={`/innovation-pulse/category/${catSlug}`} className="ml-auto font-mono text-[0.65rem] text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors">
                  View all →
                </Link>
              </div>

              <div className="grid-3">
                {stories.map((story, i) => (
                  <Card
                    key={`${story.date}-${i}`}
                    title={story.title}
                    teaser={story.summary}
                    fullContent={story.summary}
                    category={story.v4Category}
                    categoryColor={V4_CATEGORY_COLORS[story.v4Category]?.hex}
                    source={story.source}
                    sourceUrl={story.sourceUrl}
                    date={formatShortDate(story.date)}
                    imageUrl={imageAssigner.getImage(story.title, story.category)}
                    badgeText={story.isCallback ? "CALLBACK" : story.type === "deepDive" ? "LEAD" : V4_BADGE_TEXT[story.v4Category]}
                    badgeColor={story.isCallback ? "rgba(245,166,35,0.85)" : story.type === "deepDive" ? "rgba(0,212,255,0.85)" : V4_CATEGORY_COLORS[story.v4Category]?.hex}
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
                  <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">{formatShortDate(ep.date)}</span>
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
        <NewsletterSignup variant="card" />
      </div>

      {/* AI Voice Disclaimer */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12 text-center border-t border-[var(--border)] pt-4">
        <p className="text-[0.72rem] text-[var(--text-muted)]">
          The Innovation Pulse is produced using A.I. voice technology with editorial oversight by the Innovating Higher Ed team.
          <br />
          <Link href="/ai-disclosure" className="text-[var(--cyan)] hover:underline">
            Learn more about how we use A.I. responsibly.
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import NewsletterSignup from "@/components/NewsletterSignup";
import FiveMinuteEdge from "@/components/FiveMinuteEdge";
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

  // Previous lead stories (from days before today, for the PREVIOUS LEAD STORIES section)
  const previousLeadStories = useMemo(() => {
    // Skip the first episode (today) and get the next 3 lead stories
    return allEpisodes.slice(1, 4).map((ep) => ({
      title: ep.deepDive.title,
      summary: ep.deepDive.summary,
      source: ep.deepDive.source,
      sourceUrl: ep.deepDive.sourceUrl,
      category: ep.deepDive.category,
      editorialCallout: ep.deepDive.editorialCallout,
      date: ep.date,
      editorialLens: ep.editorialLens,
    }));
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
            {/* Page Title */}
            <div className="mb-4">
              <h1
                className="text-[clamp(1.5rem,3vw,1.85rem)] font-bold text-[var(--cyan)] leading-[1.2] flex items-center gap-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span className="w-[6px] h-[6px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" aria-hidden="true" />
                The Innovation Pulse
              </h1>
              <p className="text-[0.9rem] text-[var(--text-secondary)] mt-1 ml-[18px]">
                Your daily A.I. briefing for higher ed
              </p>
            </div>

            {/* Date + Lens Badge */}
            <div className="font-mono text-[0.75rem] text-[var(--text-muted)] mb-3 flex items-center gap-3">
              <span>{formatPulseDate(currentEpisode?.date || episode.date)}</span>
              <span className={`inline-flex items-center gap-[0.35rem] px-[0.65rem] py-[0.2rem] rounded-full text-[0.68rem] font-semibold ${lensColors.bg} ${lensColors.text}`}>
                <span className="w-[5px] h-[5px] rounded-full bg-current" />
                {currentEpisode?.editorialLens || episode.editorialLens}
              </span>
            </div>

            {/* Lead Story Teaser - show headline if available */}
            {(currentEpisode?.deepDive?.title || episode.deepDive?.title) && (
              <div className="mb-6">
                <h2
                  className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold text-[var(--magenta)] leading-[1.2] mb-2"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Lead Story
                </h2>
                <p className="text-[clamp(1rem,1.8vw,1.25rem)] leading-[1.4] text-[var(--text)] relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.2rem] before:bottom-[0.2rem] before:w-[3px] before:rounded-[2px] before:bg-gradient-to-b before:from-[var(--cyan)] before:to-[var(--magenta)]">
                  {currentEpisode?.deepDive?.title || episode.deepDive?.title}
                </p>
              </div>
            )}

            {/* Audio Player */}
            <div
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-5 mb-5"
              role="region"
              aria-label="Audio player"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-[0.35rem] bg-[rgba(74,222,128,0.1)] text-[var(--green)] px-[0.6rem] py-[0.2rem] rounded-full text-[0.65rem] font-semibold font-mono tracking-[0.06em]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" aria-hidden="true" />
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
                  aria-label={isPlaying ? "Pause episode" : "Play episode"}
                  className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(0,212,255,0.2)] transition-all hover:scale-[1.06]"
                >
                  {isPlaying ? (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white" aria-hidden="true">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white ml-[2px]" aria-hidden="true">
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                  )}
                </button>

                <div
                  className="flex-1 h-[44px] relative cursor-pointer group"
                  onClick={handleProgressClick}
                  role="slider"
                  aria-label="Audio progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(audioProgress)}
                  aria-valuetext={`${formatTime(currentTime)} of ${duration > 0 ? formatTime(duration) : currentEpisode?.audioDuration}`}
                  tabIndex={0}
                >
                  <div className="absolute inset-0 flex items-center gap-[1.5px]" aria-hidden="true">
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

          {/* Right Sidebar: Recent Episodes */}
          <div className="animate-[fadeUp_0.8s_0.15s_ease-out_both] hidden lg:block">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-5 sticky top-20">
              <div className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4 flex items-center gap-2">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)]" />
                Recent Episodes
              </div>
              <div className="space-y-3">
                {/* Show only previous 4 episodes (skip today at index 0) */}
                {recentEpisodes.slice(1, 5).map((ep, i) => {
                  const actualIndex = i + 1; // Offset by 1 since we skipped index 0
                  const isActive = actualIndex === selectedIndex;
                  const epDate = new Date(ep.date + 'T12:00:00');
                  const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][epDate.getDay()];
                  const monthDay = epDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const epLensColors = LENS_COLORS[ep.editorialLens] || LENS_COLORS["The Hard Question"];

                  return (
                    <button
                      key={ep.date}
                      onClick={() => selectDay(actualIndex)}
                      className={`w-full text-left p-3 rounded-[10px] border transition-all ${
                        isActive
                          ? "bg-[var(--cyan-dim)] border-[var(--cyan)]"
                          : "border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-1)]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`font-mono text-[0.68rem] font-semibold ${isActive ? "text-[var(--cyan)]" : "text-[var(--text)]"}`}>
                          {dayName}, {monthDay}
                        </span>
                        <span className="font-mono text-[0.6rem] text-[var(--text-muted)]">{ep.audioDuration}</span>
                      </div>
                      <p className={`text-[0.78rem] leading-[1.4] line-clamp-2 mb-2 ${isActive ? "text-[var(--text)]" : "text-[var(--text-secondary)]"}`}>
                        {ep.deepDive.title}
                      </p>
                      <span className={`inline-flex items-center gap-[0.3rem] px-[0.5rem] py-[0.15rem] rounded-full text-[0.58rem] font-semibold ${epLensColors.bg} ${epLensColors.text}`}>
                        <span className="w-[4px] h-[4px] rounded-full bg-current" />
                        {ep.editorialLens}
                      </span>
                    </button>
                  );
                })}
              </div>
              <Link
                href="/innovation-pulse/archive"
                className="block mt-4 pt-3 border-t border-[var(--border)] font-mono text-[0.65rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors text-center"
              >
                View full archive →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          TODAY'S TOP STORIES — Lead Story 3-Column Layout
          ═══════════════════════════════════════════════════════ */}
      <section className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-start gap-4">
            <div className="w-[3px] h-[2.2rem] bg-gradient-to-b from-[var(--cyan)] to-[var(--magenta)] rounded-full mt-1" />
            <div>
              <h2
                className="text-[clamp(1.5rem,3vw,1.85rem)] font-bold text-[var(--cyan)] leading-[1.2]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Today&apos;s Top Stories
              </h2>
              <p className="text-[0.82rem] text-[var(--text-muted)] mt-1">
                {formatPulseDate(currentEpisode?.date || episode.date)} — Today's top stories and coverage
              </p>
            </div>
          </div>
          <Link href="/innovation-pulse/stories" className="font-mono text-[0.72rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors">
            View all lead stories →
          </Link>
        </div>

        {/* Lead Story — Image Left, Content Right (matches homepage) */}
        {leadStory && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] overflow-hidden mb-8">
            <div className="grid lg:grid-cols-[40%_60%]">
              {/* Image Side */}
              <div className="relative aspect-[16/9] lg:aspect-[3/4] overflow-hidden bg-[var(--surface-1)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageAssigner.getImage(leadStory.title, leadStory.category, currentEpisode?.date)}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,15,0.4)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[rgba(10,10,15,0.3)]" />
                {/* Mobile badges overlay */}
                <div className="lg:hidden absolute top-4 left-4 flex gap-2">
                  <span className="font-mono text-[0.6rem] font-semibold px-[0.6rem] py-[0.25rem] rounded-[6px] bg-[var(--magenta)] text-white uppercase">
                    Lead Story
                  </span>
                  <span
                    className="font-mono text-[0.6rem] font-semibold px-[0.6rem] py-[0.25rem] rounded-[6px] text-white uppercase"
                    style={{ backgroundColor: V4_CATEGORY_COLORS[mapToV4Category(leadStory.category)]?.hex }}
                  >
                    {mapToV4Category(leadStory.category)}
                  </span>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-6 lg:p-8 flex flex-col">
                {/* Desktop badges */}
                <div className="hidden lg:flex gap-2 mb-4">
                  <span className="font-mono text-[0.62rem] font-semibold tracking-[0.06em] px-[0.65rem] py-[0.25rem] rounded-[6px] bg-[var(--magenta)] text-white uppercase">
                    Lead Story
                  </span>
                  <span
                    className="font-mono text-[0.62rem] font-semibold tracking-[0.06em] px-[0.65rem] py-[0.25rem] rounded-[6px] text-white uppercase"
                    style={{ backgroundColor: V4_CATEGORY_COLORS[mapToV4Category(leadStory.category)]?.hex }}
                  >
                    {mapToV4Category(leadStory.category)}
                  </span>
                </div>
                <h2
                  className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold leading-[1.2] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {leadStory.title}
                </h2>
                <div className="text-[0.9rem] text-[var(--text-secondary)] leading-[1.7] mb-4">
                  {(() => {
                    const paragraphs = leadStory.summary.split(/\n\n+/).filter(p => p.trim());
                    const preview = paragraphs.slice(0, 2).join('\n\n');
                    const hasMore = paragraphs.length > 2;
                    const isExpanded = expandedStory === `lead-${leadStory.title}`;

                    return (
                      <>
                        {renderParagraphs(isExpanded ? leadStory.summary : preview, "")}
                        {hasMore && (
                          <button
                            onClick={() => setExpandedStory(isExpanded ? null : `lead-${leadStory.title}`)}
                            className="font-mono text-[0.72rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors mt-3 block flex items-center gap-1"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                            <svg
                              viewBox="0 0 24 24"
                              className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-auto pt-4 border-t border-[var(--border)]">
                  <Link
                    href={`/innovation-pulse/story/${generateSlug(leadStory.title)}`}
                    className="btn-primary text-[0.75rem]"
                  >
                    Full story →
                  </Link>
                  <a
                    href={leadStory.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[0.75rem] text-[var(--cyan)] font-mono hover:text-[var(--text)] transition-colors"
                  >
                    {leadStory.source}
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ALSO TODAY — Quick Hit Cards (up to 6 in 2 rows of 3) */}
        {currentEpisode?.quickHits && currentEpisode.quickHits.length > 0 && (
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-[3px] h-[1.8rem] bg-[var(--cyan)] rounded-full mt-1" />
              <div>
                <h3
                  className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold text-[var(--cyan)] leading-[1.2]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Also Today
                </h3>
                <p className="text-[0.78rem] text-[var(--text-muted)] mt-0.5">
                  More stories from today&apos;s briefing
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentEpisode.quickHits.slice(0, 6).map((hit, i) => {
                const v4Cat = mapToV4Category(hit.category);
                const isExpanded = expandedStory === `quick-${hit.title}`;

                return (
                  <div
                    key={i}
                    className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden hover:border-[var(--border-hover)] transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-[var(--surface-1)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageAssigner.getImage(hit.title, hit.category, currentEpisode?.date)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                      <span
                        className="absolute top-3 left-3 font-mono text-[0.55rem] font-semibold px-[0.5rem] py-[0.18rem] rounded-[4px] text-white uppercase"
                        style={{ backgroundColor: V4_CATEGORY_COLORS[v4Cat]?.hex }}
                      >
                        {v4Cat}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-sans text-[0.92rem] font-bold leading-[1.35] mb-2 line-clamp-2">
                        {hit.title}
                      </h3>
                      <p className={`text-[0.8rem] text-[var(--text-secondary)] leading-[1.55] mb-3 ${isExpanded ? "" : "line-clamp-2"}`}>
                        {hit.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <a
                          href={hit.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[0.65rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors"
                        >
                          Full story →
                        </a>
                        <span className="font-mono text-[0.6rem] text-[var(--text-muted)]">
                          {hit.source}
                        </span>
                      </div>
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
        <div className="flex items-start gap-4 mb-6">
          <div className="w-[3px] h-[2.2rem] bg-gradient-to-b from-[var(--cyan)] to-[var(--magenta)] rounded-full mt-1" />
          <div>
            <h2
              className="text-[clamp(1.5rem,3vw,1.85rem)] font-bold text-[var(--cyan)] leading-[1.2]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Curated News
            </h2>
            <p className="text-[0.82rem] text-[var(--text-muted)] mt-1">
              AI in education and beyond — browse by category
            </p>
          </div>
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
        {/* PREVIOUS LEAD STORIES — First position */}
        {previousLeadStories.length > 0 && (
          <div id="previous-lead-stories" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="w-[3px] h-[1.8rem] bg-[var(--magenta)] rounded-full mt-1" />
                <div>
                  <h3
                    className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold text-[var(--magenta)] leading-[1.2]"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Previous Lead Stories
                  </h3>
                  <p className="text-[0.78rem] text-[var(--text-muted)] mt-0.5">
                    Deep dives from recent episodes
                  </p>
                </div>
              </div>
              <Link href="/innovation-pulse/stories" className="font-mono text-[0.72rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors">
                View all →
              </Link>
            </div>

            <div className="grid-3">
              {previousLeadStories.map((story, i) => {
                const v4Cat = mapToV4Category(story.category);
                const storyLensColors = LENS_COLORS[story.editorialLens] || LENS_COLORS["The Hard Question"];

                return (
                  <div
                    key={`prev-lead-${i}`}
                    className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden hover:border-[var(--border-hover)] transition-colors"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-[var(--surface-1)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageAssigner.getImage(story.title, story.category, story.date)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="font-mono text-[0.55rem] font-semibold px-[0.5rem] py-[0.18rem] rounded-[4px] bg-[var(--magenta)] text-white uppercase">
                          Lead
                        </span>
                        <span
                          className="font-mono text-[0.55rem] font-semibold px-[0.5rem] py-[0.18rem] rounded-[4px] text-white uppercase"
                          style={{ backgroundColor: V4_CATEGORY_COLORS[v4Cat]?.hex }}
                        >
                          {v4Cat}
                        </span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                          {formatShortDate(story.date)}
                        </span>
                        <span className={`font-mono text-[0.52rem] px-[0.4rem] py-[0.1rem] rounded-full ${storyLensColors.bg} ${storyLensColors.text}`}>
                          {story.editorialLens}
                        </span>
                      </div>
                      <h3 className="font-sans text-[0.92rem] font-bold leading-[1.35] mb-2 line-clamp-2">
                        {story.title}
                      </h3>
                      <p className="text-[0.8rem] text-[var(--text-secondary)] leading-[1.55] mb-3 line-clamp-2">
                        {story.summary}
                      </p>
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/innovation-pulse/story/${generateSlug(story.title)}`}
                          className="font-mono text-[0.65rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors"
                        >
                          Full story →
                        </Link>
                        <a
                          href={story.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[0.6rem] text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors"
                        >
                          {story.source} ↗
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Category Sections */}
        {categorizedStories.map(({ category, stories }) => {
          const catId = category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
          const catColor = V4_CATEGORY_COLORS[category]?.hex || "var(--cyan)";
          const catSlug = V4_CATEGORY_SLUGS[category];

          return (
            <div key={category} id={catId} className="mb-10 mt-10 first:mt-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-[3px] h-[1.8rem] rounded-full mt-1" style={{ background: catColor }} />
                  <div>
                    <h3
                      className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold leading-[1.2]"
                      style={{ fontFamily: "var(--font-heading)", color: catColor }}
                    >
                      {category}
                    </h3>
                    <p className="text-[0.78rem] text-[var(--text-muted)] mt-0.5">
                      {category === "Insights & Trends" && "Research, data, and emerging patterns"}
                      {category === "Case Study" && "Real-world implementations and outcomes"}
                      {category === "Practical Tips" && "Actionable strategies for educators"}
                      {category === "Ethical AI" && "Policy, ethics, and responsible AI use"}
                      {category === "Latest AI Products" && "New tools and platform updates"}
                      {category === "Beyond Ed" && "AI trends from outside higher education"}
                      {category === "Week in Review" && "Weekly roundup and analysis"}
                    </p>
                  </div>
                </div>
                <Link href={`/innovation-pulse/category/${catSlug}`} className="font-mono text-[0.72rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors">
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
                    imageUrl={imageAssigner.getImage(story.title, story.category, story.date)}
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
          THE 5-MINUTE EDGE - Audio CTA
          ═══════════════════════════════════════════════════════ */}
      <FiveMinuteEdge
        storyCount={1 + (currentEpisode?.quickHits?.length || episode.quickHits?.length || 0)}
        audioDuration={currentEpisode?.audioDuration || episode.audioDuration || "5:00"}
        audioUrl={currentEpisode?.audioUrl || episode.audioUrl}
        onPlay={() => {
          // Scroll to top audio player and start playing
          const audioPlayer = document.querySelector('[role="region"][aria-label="Audio player"]');
          if (audioPlayer) {
            audioPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              const audio = audioRef.current;
              if (audio && !isPlaying) {
                audio.play();
                setIsPlaying(true);
              }
            }, 500);
          }
        }}
      />

      {/* Section Divider */}
      <div className="section-divider" />

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

"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import {
  formatPulseDate,
  formatShortDate,
  type InnovationPulseEpisode,
} from "@/lib/data/innovation-pulse-types";

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

// ═══════════════════════════════════════════════════════════════════════════
// V4 CATEGORY SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

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

// V4 Category colors
const V4_CATEGORY_COLORS: Record<V4Category, { hex: string; bg: string; text: string }> = {
  "Insights & Trends": { hex: "#00d4ff", bg: "rgba(0,212,255,0.15)", text: "text-[#00d4ff]" },
  "Case Study": { hex: "#10b981", bg: "rgba(16,185,129,0.15)", text: "text-[#10b981]" },
  "Practical Tips": { hex: "#f59e0b", bg: "rgba(245,158,11,0.15)", text: "text-[#f59e0b]" },
  "Ethical AI": { hex: "#f43f5e", bg: "rgba(244,63,94,0.15)", text: "text-[#f43f5e]" },
  "Latest AI Products": { hex: "#8b5cf6", bg: "rgba(139,92,246,0.15)", text: "text-[#8b5cf6]" },
  "Beyond Ed": { hex: "#0ea5e9", bg: "rgba(14,165,233,0.15)", text: "text-[#0ea5e9]" },
  "Week in Review": { hex: "#c850c0", bg: "rgba(200,80,192,0.15)", text: "text-[#c850c0]" },
};

// V4 Category badge text
const V4_BADGE_TEXT: Record<V4Category, string> = {
  "Insights & Trends": "INSIGHTS",
  "Case Study": "CASE STUDY",
  "Practical Tips": "TIPS",
  "Ethical AI": "ETHICS",
  "Latest AI Products": "PRODUCTS",
  "Beyond Ed": "BEYOND ED",
  "Week in Review": "WEEK REVIEW",
};

// V4 Category slugs for archive links
const V4_CATEGORY_SLUGS: Record<V4Category, string> = {
  "Insights & Trends": "insights-and-trends",
  "Case Study": "case-study",
  "Practical Tips": "practical-tips",
  "Ethical AI": "ethical-ai",
  "Latest AI Products": "latest-ai-products",
  "Beyond Ed": "beyond-ed",
  "Week in Review": "week-in-review",
};

// Map old categories to V4 categories
const OLD_TO_V4_MAP: Record<string, V4Category> = {
  // Direct mappings
  "Research & Innovation": "Insights & Trends",
  "Infrastructure & Operations": "Case Study",
  "Teaching & Learning": "Practical Tips",
  "Policy & Ethics": "Ethical AI",
  "Tools & Products": "Latest AI Products",
  "Student Experience": "Beyond Ed",
  "Leadership & Strategy": "Insights & Trends",
  // Already V4
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

// Types for aggregated stories (from data layer)
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

// Extended type with V4 category
interface AggregatedStoryWithV4 extends AggregatedStory {
  v4Category: V4Category;
}

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
  storiesByCategory: Record<string, AggregatedStory[]>;
}

// Editorial lens colors for badges
const LENS_COLORS: Record<string, { bg: string; text: string }> = {
  "The Hard Question": { bg: "bg-[var(--amber-dim)]", text: "text-[var(--amber)]" },
  "The Student Experience": { bg: "bg-[var(--green-dim)]", text: "text-[var(--green)]" },
  "The Practitioner's Playbook": { bg: "bg-[var(--cyan-dim)]", text: "text-[var(--cyan)]" },
  "Connecting the Dots": { bg: "bg-[var(--magenta-dim)]", text: "text-[var(--magenta)]" },
  "The Innovator's Edge": { bg: "bg-gradient-to-r from-[var(--cyan-dim)] to-[var(--magenta-dim)]", text: "text-[var(--text)]" },
};

// Format time for audio player
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
  const [newsletterFrequency, setNewsletterFrequency] = useState<"daily" | "weekly">("daily");
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Audio state - now supports selecting different days
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedAudioDate, setSelectedAudioDate] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);

  // Get the currently selected episode's audio info
  const selectedAudioEpisode = useMemo(() => {
    if (!selectedAudioDate) return episode;
    const found = allEpisodes.find(ep => ep.date === selectedAudioDate);
    return found || episode;
  }, [selectedAudioDate, allEpisodes, episode]);

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

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

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
  }, [selectedAudioEpisode]);

  // Handle selecting a different day's audio
  const selectAudioDay = useCallback((date: string) => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
    setSelectedAudioDate(date);
    setCurrentTime(0);
    setAudioProgress(0);
    setDuration(0);
  }, []);

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

  // Separate this week's episodes from the archive
  const thisWeekEpisodes = useMemo(() => {
    if (!episode) return [];
    const todayDate = new Date(episode.date + "T12:00:00");
    const dayOfWeek = todayDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const mondayDate = new Date(todayDate);
    mondayDate.setDate(todayDate.getDate() + mondayOffset);

    return allEpisodes.filter(ep => {
      const epDate = new Date(ep.date + "T12:00:00");
      return epDate >= mondayDate && epDate < todayDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allEpisodes, episode]);

  const archiveEpisodes = useMemo(() => {
    if (!episode) return allEpisodes.slice(1);
    const todayDate = new Date(episode.date + "T12:00:00");
    const dayOfWeek = todayDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const mondayDate = new Date(todayDate);
    mondayDate.setDate(todayDate.getDate() + mondayOffset);

    return allEpisodes.filter(ep => {
      const epDate = new Date(ep.date + "T12:00:00");
      return epDate < mondayDate;
    });
  }, [allEpisodes, episode]);

  // Get all stories from current week only, mapped to V4 categories
  const thisWeekStories = useMemo((): AggregatedStoryWithV4[] => {
    if (!episode) return [];
    const todayDate = new Date(episode.date + "T12:00:00");
    const dayOfWeek = todayDate.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const mondayDate = new Date(todayDate);
    mondayDate.setDate(todayDate.getDate() + mondayOffset);
    const mondayStr = mondayDate.toISOString().split("T")[0];

    const stories: AggregatedStoryWithV4[] = [];
    for (const category of Object.keys(storiesByCategory)) {
      const categoryStories = storiesByCategory[category] || [];
      for (const story of categoryStories) {
        if (story.date >= mondayStr) {
          stories.push({
            ...story,
            v4Category: mapToV4Category(story.category),
          });
        }
      }
    }
    return stories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [storiesByCategory, episode]);

  // Group stories by V4 category
  const storiesByV4Category = useMemo(() => {
    const result: Record<V4Category, AggregatedStoryWithV4[]> = {} as Record<V4Category, AggregatedStoryWithV4[]>;
    for (const cat of V4_CATEGORIES) {
      result[cat] = [];
    }
    for (const story of thisWeekStories) {
      if (result[story.v4Category]) {
        result[story.v4Category].push(story);
      }
    }
    return result;
  }, [thisWeekStories]);

  // Get V4 categories with stories
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

  // Scroll to category section
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
  const leadStoryV4Category = mapToV4Category(leadStory.category);

  return (
    <div className="min-h-screen">
      {/* Hidden Audio Element - uses selected episode's audio */}
      <audio
        ref={audioRef}
        src={selectedAudioEpisode?.audioUrl || episode.audioUrl}
        preload="metadata"
      />

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

            {/* Hero Hook Quote */}
            <div className="hero-quote-card mb-6">
              <p className="text-[clamp(1.15rem,2.2vw,1.6rem)] leading-[1.3] font-bold italic relative pl-6 before:content-[''] before:absolute before:left-0 before:top-[0.3rem] before:bottom-[0.3rem] before:w-[3px] before:rounded-[2px] before:bg-gradient-to-b before:from-[var(--cyan)] before:to-[var(--magenta)]">
                &ldquo;{episode.editorialHook}&rdquo;
              </p>
            </div>

            {/* REAL Audio Player */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-5 mb-6">
              <div className="flex items-center gap-2 mb-3">
                {/* Live Badge */}
                <div className="flex items-center gap-[0.35rem] bg-[rgba(74,222,128,0.1)] text-[var(--green)] px-[0.6rem] py-[0.2rem] rounded-full text-[0.65rem] font-semibold font-mono tracking-[0.06em]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" />
                  LISTEN NOW
                </div>
                {/* Duration */}
                <span className="font-mono text-[0.7rem] text-[var(--text-muted)]">
                  {duration > 0 ? formatTime(duration) : (selectedAudioEpisode?.audioDuration || episode.audioDuration)}
                </span>
                {/* Date indicator when playing different day */}
                {selectedAudioDate && (
                  <span className="font-mono text-[0.65rem] text-[var(--amber)] bg-[var(--amber-dim)] px-2 py-[0.15rem] rounded-full">
                    {formatShortDate(selectedAudioDate)}
                  </span>
                )}
                {/* Credit Line */}
                <span className="font-mono text-[0.72rem] text-[var(--text-muted)] ml-auto">
                  The Innovation Pulse &middot; Innovating Higher Ed
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Play Button */}
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

                {/* Progress Bar / Waveform - CLICKABLE */}
                <div
                  className="flex-1 h-[44px] relative cursor-pointer group"
                  onClick={handleProgressClick}
                >
                  {/* Background waveform */}
                  <div className="absolute inset-0 flex items-center gap-[1.5px]">
                    {Array.from({ length: 80 }, (_, i) => {
                      const h = 6 + Math.random() * 30 + Math.sin(i * 0.25) * 10 + Math.cos(i * 0.12) * 6;
                      const progressPercent = (i / 80) * 100;
                      const isPlayed = progressPercent <= audioProgress;
                      return (
                        <div
                          key={i}
                          className={`w-[3px] rounded-[2px] transition-colors ${
                            isPlayed
                              ? "bg-[var(--cyan)]"
                              : "bg-[var(--surface-2)] group-hover:bg-[var(--surface-3)]"
                          }`}
                          style={{ height: `${Math.max(4, h)}px` }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Time Display */}
                <span className="font-mono text-[0.7rem] text-[var(--text-muted)] shrink-0 min-w-[72px] text-right">
                  {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : (selectedAudioEpisode?.audioDuration || episode.audioDuration)}
                </span>

                {/* Volume Icon */}
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

            {/* ═══════════════════════════════════════════════════════
                DAY PILLS - Quick access to this week's audio
                ═══════════════════════════════════════════════════════ */}
            {thisWeekEpisodes.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="font-mono text-[0.6rem] text-[var(--text-muted)] tracking-[0.08em] uppercase mr-1">
                  This Week:
                </span>
                {/* Today's pill (always first) */}
                <button
                  onClick={() => setSelectedAudioDate(null)}
                  className={`flex items-center gap-2 px-3 py-[0.4rem] rounded-full border transition-all ${
                    !selectedAudioDate
                      ? "bg-[var(--cyan-dim)] border-[var(--cyan)] text-[var(--cyan)]"
                      : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                  }`}
                >
                  <span className="font-mono text-[0.65rem] font-semibold">
                    {episode.dayOfWeek.slice(0, 3)} {new Date(episode.date + "T12:00:00").getDate()}
                  </span>
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)]" />
                  <span className="font-mono text-[0.6rem]">{episode.audioDuration}</span>
                </button>
                {/* Previous days */}
                {thisWeekEpisodes.map((ep) => (
                  <button
                    key={ep.date}
                    onClick={() => selectAudioDay(ep.date)}
                    className={`flex items-center gap-2 px-3 py-[0.4rem] rounded-full border transition-all ${
                      selectedAudioDate === ep.date
                        ? "bg-[var(--cyan-dim)] border-[var(--cyan)] text-[var(--cyan)]"
                        : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    <span className="font-mono text-[0.65rem] font-semibold">
                      {ep.dayOfWeek.slice(0, 3)} {new Date(ep.date + "T12:00:00").getDate()}
                    </span>
                    <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)]" />
                    <span className="font-mono text-[0.6rem]">{ep.audioDuration}</span>
                  </button>
                ))}
                {/* Archive link */}
                <Link
                  href="/innovation-pulse/archive"
                  className="font-mono text-[0.6rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors ml-2"
                >
                  Full archive →
                </Link>
              </div>
            )}
          </div>

          {/* Right Sidebar: About Card + TOC */}
          <div className="animate-[fadeUp_0.8s_0.15s_ease-out_both] space-y-5">
            {/* About Card */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-5">
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

            {/* TOC Card */}
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
                      {leadStoryV4Category}
                    </span>
                  </div>
                </li>

                {/* Quick Hits */}
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
                        {mapToV4Category(hit.category)}
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
          FEATURED STORY SECTION
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
              <span
                className="font-mono text-[0.62rem] font-semibold tracking-[0.05em] px-[0.6rem] py-[0.25rem] rounded-[6px] text-[#08080f]"
                style={{ backgroundColor: V4_CATEGORY_COLORS[leadStoryV4Category]?.hex || "#00d4ff" }}
              >
                {leadStoryV4Category}
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

            {/* Action Links */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Link
                href={`/innovation-pulse/story/${generateSlug(leadStory.title)}`}
                className="btn-primary text-[0.75rem]"
              >
                Read full story →
              </Link>
              <a
                href={leadStory.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[0.75rem] text-[var(--cyan)] font-mono px-3 py-[0.35rem] rounded-[8px] bg-[var(--cyan-dim)] hover:bg-[rgba(0,212,255,0.2)] transition-colors"
              >
                {leadStory.source}
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>

            {/* Our Take */}
            {leadStory.editorialCallout && (
              <div className="border-t border-[var(--border)] pt-5">
                <div className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-[var(--magenta)] mb-2">
                  OUR TAKE — {episode.editorialLens}
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
            if (count === 0) return null;
            const catId = cat.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
            const catColor = V4_CATEGORY_COLORS[cat];
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
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          V4 GROUPED CATEGORY SECTIONS WITH VIEW ALL LINKS
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        {categorizedStories.map(({ category, stories }, sectionIdx) => {
          const catId = category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
          const catColor = V4_CATEGORY_COLORS[category]?.hex || "var(--cyan)";
          const catSlug = V4_CATEGORY_SLUGS[category];

          return (
            <div key={category} id={catId} className="mb-8">
              {/* Category Row Header with View All Link */}
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
                  href={`/innovation-pulse/category/${catSlug}`}
                  className="ml-auto font-mono text-[0.65rem] text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors"
                >
                  View all →
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
                    category={story.v4Category}
                    categoryColor={V4_CATEGORY_COLORS[story.v4Category]?.hex}
                    source={story.source}
                    sourceUrl={story.sourceUrl}
                    date={formatShortDate(story.date)}
                    imageUrl={storyImages[(sectionIdx * 3 + i) % storyImages.length]}
                    badgeText={
                      story.isCallback
                        ? "CALLBACK"
                        : story.type === "deepDive"
                          ? "LEAD"
                          : V4_BADGE_TEXT[story.v4Category]
                    }
                    badgeColor={
                      story.isCallback
                        ? "rgba(245,166,35,0.85)"
                        : story.type === "deepDive"
                          ? "rgba(0,212,255,0.85)"
                          : V4_CATEGORY_COLORS[story.v4Category]?.hex || "rgba(0,212,255,0.85)"
                    }
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
          EARLIER THIS WEEK SECTION
          ═══════════════════════════════════════════════════════ */}
      {thisWeekEpisodes.length > 0 && (
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
          <div className="section-divider mb-8" />
          <div className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-[var(--text-muted)] flex items-center gap-2 mb-6">
            <span className="text-[var(--cyan)]">EARLIER THIS WEEK</span> — Catch Up
          </div>

          <div className="space-y-3">
            {thisWeekEpisodes.map((ep) => {
              const isExpanded = expandedDay === ep.date;
              const lensColors = LENS_COLORS[ep.editorialLens] || { bg: "bg-[var(--surface-2)]", text: "text-[var(--text-secondary)]" };
              const storyCount = 1 + ep.quickHits.length;

              return (
                <div key={ep.date} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] overflow-hidden">
                  {/* Day Card Header - Always Visible */}
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : ep.date)}
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-[var(--surface-1)] transition-colors"
                  >
                    {/* Date Column */}
                    <div className="shrink-0 w-[60px] text-center">
                      <div className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-[var(--text-muted)]">
                        {ep.dayOfWeek.slice(0, 3)}
                      </div>
                      <div className="text-[1.4rem] font-bold text-[var(--text)]">
                        {new Date(ep.date + "T12:00:00").getDate()}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-[1px] h-[40px] bg-[var(--border)]" />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-[0.3rem] px-[0.5rem] py-[0.15rem] rounded-full text-[0.6rem] font-semibold ${lensColors.bg} ${lensColors.text}`}>
                          <span className="w-[4px] h-[4px] rounded-full bg-current" />
                          {ep.editorialLens}
                        </span>
                        <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                          {storyCount} stories
                        </span>
                      </div>
                      <p className="text-[0.95rem] font-semibold text-[var(--text)] leading-[1.35] truncate">
                        {ep.deepDive.title}
                      </p>
                    </div>

                    {/* Mini Audio Duration */}
                    <div className="shrink-0 flex items-center gap-2">
                      <div className="flex items-center gap-[0.35rem] bg-[var(--surface-2)] px-[0.6rem] py-[0.25rem] rounded-full">
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[var(--cyan)]">
                          <polygon points="6,3 20,12 6,21" />
                        </svg>
                        <span className="font-mono text-[0.6rem] text-[var(--text-secondary)]">
                          {ep.audioDuration}
                        </span>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-5 h-5 stroke-[var(--text-muted)] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-[var(--border)] p-5 bg-[var(--surface-1)] animate-[fadeUp_0.3s_ease-out_both]">
                      {/* Editorial Hook */}
                      <p className="text-[0.88rem] italic text-[var(--text-secondary)] leading-[1.5] mb-5 pl-4 border-l-2 border-[var(--cyan)]">
                        &ldquo;{ep.editorialHook}&rdquo;
                      </p>

                      {/* Stories List */}
                      <div className="space-y-3">
                        {/* Deep Dive */}
                        <Link
                          href={`/innovation-pulse/${ep.date}`}
                          className="flex items-start gap-3 p-3 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors group"
                        >
                          <span className="font-mono text-[0.5rem] font-semibold px-[0.4rem] py-[0.15rem] rounded-[4px] bg-[var(--cyan-dim)] text-[var(--cyan)] mt-[0.2rem]">
                            LEAD
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[0.82rem] font-semibold text-[var(--text)] leading-[1.35] group-hover:text-[var(--cyan)] transition-colors">
                              {ep.deepDive.title}
                            </p>
                            <span className="text-[0.62rem] text-[var(--text-muted)] font-mono">
                              {mapToV4Category(ep.deepDive.category)} · {ep.deepDive.source}
                            </span>
                          </div>
                        </Link>

                        {/* Quick Hits */}
                        {ep.quickHits.map((hit, i) => (
                          <Link
                            key={i}
                            href={`/innovation-pulse/${ep.date}`}
                            className="flex items-start gap-3 p-3 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors group"
                          >
                            <span className={`font-mono text-[0.5rem] font-semibold px-[0.4rem] py-[0.15rem] rounded-[4px] mt-[0.2rem] ${
                              hit.isCallback
                                ? "bg-[var(--amber-dim)] text-[var(--amber)]"
                                : "bg-[var(--magenta-dim)] text-[var(--magenta)]"
                            }`}>
                              {hit.isCallback ? "CALLBACK" : "STORY"}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[0.82rem] font-semibold text-[var(--text)] leading-[1.35] group-hover:text-[var(--cyan)] transition-colors">
                                {hit.title}
                              </p>
                              <span className="text-[0.62rem] text-[var(--text-muted)] font-mono">
                                {mapToV4Category(hit.category)} · {hit.source}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>

                      {/* View Full Briefing */}
                      <Link
                        href={`/innovation-pulse/${ep.date}`}
                        className="mt-4 inline-flex items-center gap-2 font-mono text-[0.7rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors"
                      >
                        View Full Briefing
                        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[24px] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] via-[var(--magenta)] to-[var(--cyan)] bg-[length:200%_100%]" />

          <h2 className="font-sans text-[1.8rem] font-bold mb-2">
            Never Miss a Pulse
          </h2>
          <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[520px] mx-auto mb-6">
            Get the Innovation Pulse delivered to your inbox. Curated AI news for higher education — no fluff, no hype.
          </p>

          {/* Newsletter Frequency Toggle */}
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
          The Innovation Pulse is produced using A.I. voice technology with
          editorial oversight by the Innovating Higher Ed team.
          <br />
          <Link href="/about" className="text-[var(--cyan)] hover:underline">
            Learn more about how we use A.I. responsibly at Innovating Higher Ed.
          </Link>
        </p>
      </div>
    </div>
  );
}

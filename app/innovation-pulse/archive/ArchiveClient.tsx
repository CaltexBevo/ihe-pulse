"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface QuickHit {
  title: string;
  category: string;
  source: string;
}

interface EpisodeData {
  date: string;
  dayOfWeek: string;
  editorialLens: string;
  editorialHook: string;
  audioUrl: string;
  audioDuration: string;
  deepDiveTitle: string;
  deepDiveSlug: string;
  deepDiveCategory: string;
  storyCount: number;
  quickHits: QuickHit[];
}

interface ArchiveClientProps {
  episode: EpisodeData;
  lensColor: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatFullDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ArchiveClient({ episode, lensColor }: ArchiveClientProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
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
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * duration;
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] overflow-hidden">
      <audio ref={audioRef} src={episode.audioUrl} preload="metadata" />

      {/* Main Row - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-[var(--surface-1)] transition-colors"
      >
        {/* Date Column */}
        <div className="shrink-0 w-[60px] text-center">
          <div className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-[var(--text-muted)]">
            {episode.dayOfWeek.slice(0, 3)}
          </div>
          <div className="text-[1.4rem] font-bold text-[var(--text)]">
            {new Date(episode.date + "T12:00:00").getDate()}
          </div>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-[40px] bg-[var(--border)]" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-flex items-center gap-[0.3rem] px-[0.5rem] py-[0.15rem] rounded-full text-[0.6rem] font-semibold"
              style={{ backgroundColor: `${lensColor}20`, color: lensColor }}
            >
              <span
                className="w-[4px] h-[4px] rounded-full"
                style={{ backgroundColor: lensColor }}
              />
              {episode.editorialLens}
            </span>
            <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
              {episode.storyCount} stories
            </span>
          </div>
          <p className="text-[0.95rem] font-semibold text-[var(--text)] leading-[1.35] truncate">
            {episode.deepDiveTitle}
          </p>
        </div>

        {/* Play Button & Duration */}
        <div className="shrink-0 flex items-center gap-3">
          <button
            onClick={togglePlay}
            className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center hover:scale-[1.08] transition-transform"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white ml-[1px]">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            )}
          </button>
          <span className="font-mono text-[0.6rem] text-[var(--text-secondary)] min-w-[36px]">
            {isPlaying ? formatTime(currentTime) : episode.audioDuration}
          </span>
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
          {/* Audio Progress Bar */}
          {(isPlaying || progress > 0) && (
            <div className="mb-4">
              <div
                className="h-[4px] bg-[var(--surface-2)] rounded-[2px] cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] rounded-[2px]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[0.55rem] text-[var(--text-muted)] mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{duration > 0 ? formatTime(duration) : episode.audioDuration}</span>
              </div>
            </div>
          )}

          {/* Editorial Hook */}
          <p className="text-[0.88rem] italic text-[var(--text-secondary)] leading-[1.5] mb-5 pl-4 border-l-2 border-[var(--cyan)]">
            &ldquo;{episode.editorialHook}&rdquo;
          </p>

          {/* Stories List */}
          <div className="space-y-2">
            {/* Lead Story */}
            <Link
              href={`/innovation-pulse/story/${episode.deepDiveSlug}`}
              className="flex items-start gap-3 p-3 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors group"
            >
              <span className="font-mono text-[0.5rem] font-semibold px-[0.4rem] py-[0.15rem] rounded-[4px] bg-[var(--cyan-dim)] text-[var(--cyan)] mt-[0.2rem]">
                LEAD
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[0.82rem] font-semibold text-[var(--text)] leading-[1.35] group-hover:text-[var(--cyan)] transition-colors">
                  {episode.deepDiveTitle}
                </p>
                <span className="text-[0.62rem] text-[var(--text-muted)] font-mono">
                  {episode.deepDiveCategory}
                </span>
              </div>
            </Link>

            {/* Quick Hits */}
            {episode.quickHits.map((hit, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)]"
              >
                <span className="font-mono text-[0.5rem] font-semibold px-[0.4rem] py-[0.15rem] rounded-[4px] bg-[var(--magenta-dim)] text-[var(--magenta)] mt-[0.2rem]">
                  STORY
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.82rem] font-semibold text-[var(--text)] leading-[1.35]">
                    {hit.title}
                  </p>
                  <span className="text-[0.62rem] text-[var(--text-muted)] font-mono">
                    {hit.category} · {hit.source}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* View Full Briefing Link */}
          <Link
            href={`/innovation-pulse/${episode.date}`}
            className="mt-4 inline-flex items-center gap-2 font-mono text-[0.7rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors"
          >
            View full briefing
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}

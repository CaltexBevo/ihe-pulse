'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';
import { formatPulseDate, formatShortDate } from '@/lib/data/innovation-pulse-types';

// Editorial lens colors
const LENS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "The Hard Question": { bg: "bg-[var(--amber-dim)]", text: "text-[var(--amber)]", dot: "bg-[var(--amber)]" },
  "The Student Experience": { bg: "bg-[var(--green-dim)]", text: "text-[var(--green)]", dot: "bg-[var(--green)]" },
  "The Practitioner's Playbook": { bg: "bg-[var(--cyan-dim)]", text: "text-[var(--cyan)]", dot: "bg-[var(--cyan)]" },
  "Connecting the Dots": { bg: "bg-[var(--magenta-dim)]", text: "text-[var(--magenta)]", dot: "bg-[var(--magenta)]" },
  "The Innovator's Edge": { bg: "bg-gradient-to-r from-[var(--cyan-dim)] to-[var(--magenta-dim)]", text: "text-[var(--text)]", dot: "bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" },
};

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface HomeHeroClientProps {
  latestEpisode: InnovationPulseEpisode;
  recentEpisodes: InnovationPulseEpisode[]; // Last 5 episodes
}

export default function HomeHeroClient({ latestEpisode, recentEpisodes }: HomeHeroClientProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);

  const currentEpisode = recentEpisodes[selectedIndex] || latestEpisode;
  const lensColors = LENS_COLORS[currentEpisode.editorialLens] || LENS_COLORS["The Hard Question"];

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

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentEpisode.audioUrl}
        preload="metadata"
      />

      {/* Premium Label with tagline */}
      <div className="mb-4">
        <h1 className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--cyan)] flex items-center gap-2 mb-1">
          <span className="w-[6px] h-[6px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" aria-hidden="true" />
          <span>THE INNOVATION PULSE</span>
        </h1>
        <p className="text-[0.85rem] text-[var(--text-muted)] pl-4">
          Your daily A.I. briefing for higher ed — curated, analyzed, delivered.
        </p>
      </div>

      {/* Date + Lens Badge */}
      <div className="font-mono text-[0.72rem] text-[var(--text-muted)] mb-3 flex items-center gap-3">
        <span>{formatPulseDate(currentEpisode.date)}</span>
        <span className={`inline-flex items-center gap-[0.35rem] px-[0.65rem] py-[0.2rem] rounded-full text-[0.68rem] font-semibold ${lensColors.bg} ${lensColors.text}`}>
          <span className={`w-[5px] h-[5px] rounded-full ${lensColors.dot}`} />
          {currentEpisode.editorialLens}
        </span>
      </div>

      {/* Lead Story Teaser - show headline if available */}
      {currentEpisode.deepDive?.title && (
        <div className="mb-6">
          <h2
            className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold text-[var(--magenta)] leading-[1.2] mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Lead Story
          </h2>
          <p className="text-[clamp(1rem,1.8vw,1.25rem)] leading-[1.4] text-[var(--text)] relative pl-5 before:content-[''] before:absolute before:left-0 before:top-[0.2rem] before:bottom-[0.2rem] before:w-[3px] before:rounded-[2px] before:bg-gradient-to-b before:from-[var(--cyan)] before:to-[var(--magenta)]">
            {currentEpisode.deepDive.title}
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
          {/* Live Badge */}
          <div className="flex items-center gap-[0.35rem] bg-[rgba(74,222,128,0.1)] text-[var(--green)] px-[0.6rem] py-[0.2rem] rounded-full text-[0.65rem] font-semibold font-mono tracking-[0.06em]">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" aria-hidden="true" />
            LISTEN NOW
          </div>
          {/* Duration */}
          <span className="font-mono text-[0.7rem] text-[var(--text-muted)]">
            {duration > 0 ? formatTime(duration) : currentEpisode.audioDuration}
          </span>
          {/* Date indicator when not on latest */}
          {selectedIndex > 0 && (
            <span className="font-mono text-[0.65rem] text-[var(--amber)] bg-[var(--amber-dim)] px-2 py-[0.15rem] rounded-full">
              {formatShortDate(currentEpisode.date)}
            </span>
          )}
          {/* Credit Line */}
          <span className="font-mono text-[0.68rem] text-[var(--text-muted)] ml-auto hidden sm:block">
            Innovating Higher Ed
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Play Button */}
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

          {/* Waveform Progress Bar */}
          <div
            className="flex-1 h-[44px] relative cursor-pointer group"
            onClick={handleProgressClick}
            role="slider"
            aria-label="Audio progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(audioProgress)}
            aria-valuetext={`${formatTime(currentTime)} of ${duration > 0 ? formatTime(duration) : currentEpisode.audioDuration}`}
            tabIndex={0}
            onKeyDown={(e) => {
              const audio = audioRef.current;
              if (!audio || !duration) return;
              if (e.key === 'ArrowRight') {
                audio.currentTime = Math.min(duration, audio.currentTime + 10);
              } else if (e.key === 'ArrowLeft') {
                audio.currentTime = Math.max(0, audio.currentTime - 10);
              }
            }}
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
          <span className="font-mono text-[0.7rem] text-[var(--text-muted)] shrink-0 min-w-[60px] text-right hidden sm:block">
            {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : currentEpisode.audioDuration}
          </span>
        </div>
      </div>

      {/* Last 5 Days Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-[0.6rem] text-[var(--text-muted)] tracking-[0.08em] uppercase mr-1">
          Recent:
        </span>
        {recentEpisodes.slice(0, 5).map((ep, index) => {
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
              <span className="font-mono text-[0.65rem] font-semibold">
                {dayName} {dayNum}
              </span>
              <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)]" />
              <span className="font-mono text-[0.6rem]">{ep.audioDuration}</span>
            </button>
          );
        })}
        <Link
          href="/innovation-pulse"
          className="font-mono text-[0.6rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors ml-2"
        >
          View full coverage →
        </Link>
      </div>
    </>
  );
}

'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';
import { formatPulseDate, formatShortDate } from '@/lib/data/innovation-pulse-types';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Parse duration string like "3:36" to minutes (rounded)
function durationToMinutes(duration: string): number {
  const parts = duration.split(':');
  if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10);
    const seconds = parseInt(parts[1], 10);
    return Math.round(minutes + seconds / 60);
  }
  return parseInt(duration, 10) || 5;
}

interface HeroNowPlayingProps {
  latestEpisode: InnovationPulseEpisode;
  recentEpisodes: InnovationPulseEpisode[];
}

export default function HeroNowPlaying({ latestEpisode, recentEpisodes }: HeroNowPlayingProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);

  const currentEpisode = recentEpisodes[selectedIndex] || latestEpisode;

  // Generate stable waveform bar heights
  const waveformHeights = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      // Create a wave pattern that looks natural
      const base = 8;
      const variance = Math.sin(i * 0.3) * 12 + Math.cos(i * 0.7) * 8;
      const noise = ((i * 17) % 13) - 6; // Pseudo-random noise
      return Math.max(4, Math.min(36, base + variance + noise));
    });
  }, []);

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

  const selectDay = (index: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
    setSelectedIndex(index);
  };

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

  // Calculate story count and duration
  const storyCount = 1 + (currentEpisode.quickHits?.length || 0);
  const minutes = durationToMinutes(currentEpisode.audioDuration || "5:00");

  return (
    <div className="hero-now-playing">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentEpisode.audioUrl}
        preload="metadata"
      />

      <div className="p-6 sm:p-8">
        {/* Header row: NOW PLAYING badge + date */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* NOW PLAYING badge with pulse */}
            <div className="flex items-center gap-2 bg-[var(--cyan-soft)] px-3 py-1.5 rounded-full">
              <span
                className="w-2 h-2 rounded-full bg-[var(--cyan)] animate-[pulseDot_2s_infinite]"
                aria-hidden="true"
              />
              <span className="font-mono text-[0.65rem] font-semibold tracking-[0.08em] uppercase text-[var(--cyan)]">
                Now Playing
              </span>
            </div>
            {/* Episode indicator when not on latest */}
            {selectedIndex > 0 && (
              <span className="font-mono text-[0.6rem] text-[var(--amber)] bg-[var(--amber-dim)] px-2 py-1 rounded-full">
                {formatShortDate(currentEpisode.date)}
              </span>
            )}
          </div>
          {/* Duration */}
          <span className="font-mono text-[0.7rem] text-[var(--text-muted)]">
            {duration > 0 ? formatTime(duration) : currentEpisode.audioDuration}
          </span>
        </div>

        {/* Main content area */}
        <div className="flex gap-6 items-start">
          {/* Play button - larger, centered */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause episode" : "Play episode"}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center shrink-0 shadow-[0_4px_24px_rgba(0,212,255,0.25)] transition-all hover:scale-105 hover:shadow-[0_6px_32px_rgba(0,212,255,0.35)]"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white ml-1" aria-hidden="true">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            )}
          </button>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            {/* Title - The Innovation Pulse */}
            <div className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-[var(--cyan)] mb-1">
              The Innovation Pulse
            </div>
            <h1
              className="text-[1.5rem] sm:text-[1.75rem] font-bold text-[var(--text)] leading-tight mb-2"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              The 5-Minute Edge
            </h1>
            <p className="text-[0.85rem] text-[var(--text-secondary)] leading-relaxed hidden sm:block">
              What every educator needs to know about AI today.
            </p>
          </div>
        </div>

        {/* Waveform progress bar */}
        <div
          className="mt-6 h-12 relative cursor-pointer group"
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
          <div className="absolute inset-0 flex items-end gap-[2px]" aria-hidden="true">
            {waveformHeights.map((h, i) => {
              const progressPercent = (i / waveformHeights.length) * 100;
              const isPlayed = progressPercent <= audioProgress;
              return (
                <div
                  key={i}
                  className={`hero-waveform-bar flex-1 ${isPlayed ? 'played' : ''}`}
                  style={{ height: `${h}px` }}
                />
              );
            })}
          </div>
        </div>

        {/* Time display */}
        <div className="flex justify-between items-center mt-2 font-mono text-[0.7rem] text-[var(--text-muted)]">
          <span>{formatTime(currentTime)}</span>
          <span>{duration > 0 ? formatTime(duration) : currentEpisode.audioDuration}</span>
        </div>

        {/* Stat line */}
        <p className="font-mono text-[0.75rem] text-[var(--text-muted)] tracking-[0.02em] mt-4">
          <span className="text-[var(--cyan)] font-semibold">{storyCount}</span>
          {' '}stories.{' '}
          <span className="text-[var(--cyan)] font-semibold">{minutes}</span>
          {' '}minutes.{' '}
          <span className="text-[var(--text)]">Go.</span>
        </p>

        {/* Lead story teaser */}
        {currentEpisode.deepDive?.title && (
          <Link
            href={`/innovation-pulse/${currentEpisode.date}`}
            className="block mt-4 p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)] hover:border-[var(--border-hover)] transition-all group"
          >
            <div className="flex items-start gap-3">
              <span className="font-mono text-[0.5rem] font-semibold px-2 py-1 rounded bg-[var(--magenta-dim)] text-[var(--magenta)] uppercase tracking-wider shrink-0">
                Lead
              </span>
              <p className="text-[0.9rem] text-[var(--text-secondary)] leading-snug group-hover:text-[var(--text)] transition-colors line-clamp-2">
                {currentEpisode.deepDive.title}
              </p>
            </div>
          </Link>
        )}

        {/* Recent episodes pills */}
        <div className="flex flex-wrap items-center gap-2 mt-5">
          <span className="font-mono text-[0.55rem] text-[var(--text-muted)] tracking-[0.06em] uppercase">
            Recent:
          </span>
          {recentEpisodes.slice(0, 5).map((ep, index) => {
            const isSelected = index === selectedIndex;
            const epDate = new Date(ep.date + 'T12:00:00');
            const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][epDate.getDay()];

            return (
              <button
                key={ep.date}
                onClick={() => selectDay(index)}
                className={`font-mono text-[0.6rem] px-2.5 py-1 rounded-full border transition-all ${
                  isSelected
                    ? "bg-[var(--cyan-dim)] border-[var(--cyan)] text-[var(--cyan)]"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {dayName}
              </button>
            );
          })}
          <Link
            href="/innovation-pulse"
            className="font-mono text-[0.55rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors ml-1"
          >
            All episodes →
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";

interface AudioPlayerProps {
  duration?: string;
  credit?: string;
  barCount?: number;
  compact?: boolean;
}

export default function AudioPlayer({
  duration = "4:12",
  barCount = 75,
  compact = false,
}: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");

  // Parse duration string to seconds
  const parseDuration = useCallback((dur: string) => {
    const parts = dur.split(":").map(Number);
    return parts[0] * 60 + parts[1];
  }, []);

  const totalSeconds = parseDuration(duration);

  // Format seconds to mm:ss
  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, []);

  // Simulate playback progress
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setPlaying(false);
          return 0;
        }
        const next = prev + 100 / totalSeconds;
        setCurrentTime(formatTime((next / 100) * totalSeconds));
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [playing, totalSeconds, formatTime]);

  // Generate static bar heights
  const bars = Array.from({ length: barCount }, (_, i) => {
    const base = 6 + Math.random() * 26 + Math.sin(i * 0.25) * 8;
    return Math.max(4, base);
  });

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = x / rect.width;
    const newProgress = ratio * 100;
    setProgress(newProgress);
    setCurrentTime(formatTime((newProgress / 100) * totalSeconds));
  };

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-4"
        role="region"
        aria-label="Audio player"
      >
        {/* Live Badge - JetBrains Mono */}
        <div
          className="flex items-center gap-[0.35rem] text-[0.65rem] font-semibold text-[var(--green)] tracking-[0.06em]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" aria-hidden="true" />
          LISTEN
        </div>
        <button
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? "Pause episode" : "Play episode"}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center shrink-0 transition-transform hover:scale-105"
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-white" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-white ml-[1px]" aria-hidden="true">
              <polygon points="6,3 20,12 6,21" />
            </svg>
          )}
        </button>
        <div
          className="flex-1 h-1 bg-[var(--surface-2)] rounded-[2px] relative cursor-pointer"
          role="slider"
          aria-label="Audio progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-valuetext={`${currentTime} of ${duration}`}
        >
          <div
            className="h-full bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] rounded-[2px]"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Time - JetBrains Mono */}
        <span
          className="text-[0.65rem] text-[var(--text-muted)] whitespace-nowrap"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {currentTime} / {duration}
        </span>
      </div>
    );
  }

  return (
    <div
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-[1.25rem]"
      role="region"
      aria-label="Audio player"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        {/* Live Badge - JetBrains Mono */}
        <div
          className="flex items-center gap-[0.35rem] bg-[rgba(74,222,128,0.1)] text-[var(--green)] px-[0.6rem] py-[0.2rem] rounded-full text-[0.65rem] font-semibold tracking-[0.06em]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" aria-hidden="true" />
          LISTEN NOW
        </div>
        {/* Duration - JetBrains Mono */}
        <span
          className="text-[0.7rem] text-[var(--text-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {duration}
        </span>
      </div>

      {/* Player Row */}
      <div className="flex items-center gap-[0.8rem]">
        {/* Play Button */}
        <button
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? "Pause episode" : "Play episode"}
          className="w-[48px] h-[48px] rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center shrink-0 shadow-[0_4px_20px_rgba(0,212,255,0.2)] transition-all hover:scale-[1.06] hover:shadow-[0_6px_28px_rgba(0,212,255,0.3)]"
        >
          {playing ? (
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

        {/* Waveform */}
        <div
          className="flex-1 flex items-center h-[44px] gap-[1.5px] cursor-pointer"
          onClick={handleBarClick}
          role="slider"
          aria-label="Audio progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-valuetext={`${currentTime} of ${duration}`}
          tabIndex={0}
        >
          {bars.map((height, i) => {
            const barProgress = (i / barCount) * 100;
            const isPlayed = barProgress <= progress;
            return (
              <div
                key={i}
                className="rounded-[2px] transition-colors duration-150"
                style={{
                  width: "3px",
                  height: `${height}px`,
                  backgroundColor: isPlayed ? "var(--cyan)" : "var(--surface-2)",
                }}
                aria-hidden="true"
              />
            );
          })}
        </div>

        {/* Time - JetBrains Mono */}
        <span
          className="text-[0.7rem] text-[var(--text-muted)] shrink-0 min-w-[72px] text-right"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {currentTime} / {duration}
        </span>
      </div>
    </div>
  );
}

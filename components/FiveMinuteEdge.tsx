'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FiveMinuteEdgeProps {
  storyCount: number;
  audioDuration: string; // e.g., "3:36"
  audioUrl?: string;
  onPlay?: () => void;
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

export default function FiveMinuteEdge({ storyCount, audioDuration, audioUrl, onPlay }: FiveMinuteEdgeProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const minutes = durationToMinutes(audioDuration);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handlePlay = () => {
    if (onPlay) {
      onPlay();
    } else {
      // Scroll to audio player at top of page and trigger play
      const heroSection = document.querySelector('[role="region"][aria-label="Audio player"]');
      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Find and click the play button
        setTimeout(() => {
          const playButton = heroSection.querySelector('button[aria-label*="Play"]') as HTMLButtonElement;
          if (playButton) {
            playButton.click();
          }
        }, 500);
      }
    }
  };

  return (
    <section className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 md:p-10 text-center relative overflow-hidden">
        {/* Subtle gradient accent at top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent opacity-60" />

        {/* Heading */}
        <h2
          className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-[var(--text)] leading-[1.2] mb-3"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          The 5-Minute Edge
        </h2>

        {/* Subtext */}
        <p className="text-[1rem] text-[var(--text-secondary)] mb-8 max-w-[500px] mx-auto">
          What every educator needs to know about AI today — in the time it takes to park.
        </p>

        {/* Play Button with Equalizer */}
        <div className="flex items-center justify-center gap-4 mb-6">
          {/* Equalizer Bars - Left Side */}
          <div
            className="flex items-end gap-[3px] h-[32px]"
            aria-hidden="true"
          >
            {[0.6, 0.9, 0.5, 0.8, 0.4].map((delay, i) => (
              <div
                key={`left-${i}`}
                className="w-[4px] rounded-[2px] bg-gradient-to-t from-[var(--cyan)] to-[var(--magenta)]"
                style={{
                  height: prefersReducedMotion ? '16px' : undefined,
                  animation: prefersReducedMotion
                    ? 'none'
                    : `waveform ${0.8 + delay * 0.4}s ease-in-out ${delay * 0.15}s infinite`,
                  transformOrigin: 'bottom',
                }}
              />
            ))}
          </div>

          {/* Play Button */}
          <button
            onClick={handlePlay}
            aria-label="Play today's briefing"
            className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center shadow-[0_4px_24px_rgba(0,212,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_6px_32px_rgba(0,212,255,0.4)] focus:outline-none focus:ring-2 focus:ring-[var(--cyan)] focus:ring-offset-2 focus:ring-offset-[var(--bg-card)]"
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white ml-1" aria-hidden="true">
              <polygon points="6,3 20,12 6,21" />
            </svg>
          </button>

          {/* Equalizer Bars - Right Side */}
          <div
            className="flex items-end gap-[3px] h-[32px]"
            aria-hidden="true"
          >
            {[0.4, 0.7, 1.0, 0.6, 0.5].map((delay, i) => (
              <div
                key={`right-${i}`}
                className="w-[4px] rounded-[2px] bg-gradient-to-t from-[var(--cyan)] to-[var(--magenta)]"
                style={{
                  height: prefersReducedMotion ? '16px' : undefined,
                  animation: prefersReducedMotion
                    ? 'none'
                    : `waveform ${0.8 + delay * 0.4}s ease-in-out ${delay * 0.15}s infinite`,
                  transformOrigin: 'bottom',
                }}
              />
            ))}
          </div>
        </div>

        {/* Stat Line */}
        <p className="font-mono text-[0.85rem] text-[var(--text-muted)] tracking-[0.02em]">
          <span className="text-[var(--cyan)] font-semibold">{storyCount}</span>
          {' '}stories.{' '}
          <span className="text-[var(--cyan)] font-semibold">{minutes}</span>
          {' '}minutes.{' '}
          <span className="text-[var(--text)]">Go.</span>
        </p>
      </div>
    </section>
  );
}

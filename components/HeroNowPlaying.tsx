'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

interface HeroNowPlayingProps {
  latestEpisode: InnovationPulseEpisode;
  recentEpisodes: InnovationPulseEpisode[];
}

export default function HeroNowPlaying({ latestEpisode, recentEpisodes }: HeroNowPlayingProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentEpisode = recentEpisodes[selectedIndex] || latestEpisode;
  const paused = !isPlaying;

  // Compute date parts for artwork
  const publishDate = new Date(currentEpisode.date + 'T12:00:00');
  const dayAbbr = publishDate.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase().slice(0, 3);
  const monthAbbr = publishDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const dayNum = String(publishDate.getDate()).padStart(2, "0");
  const year = publishDate.getFullYear();
  const isoDate = currentEpisode.date;

  // Headline from lead story
  const headline = currentEpisode.deepDive?.title || "Today's AI News for Higher Ed";

  // Story count and duration
  const storyCount = 1 + (currentEpisode.quickHits?.length || 0);
  const durationDisplay = duration > 0 ? formatTime(duration) : currentEpisode.audioDuration;

  // Episode number (count from oldest)
  const episodeNumber = recentEpisodes.length - selectedIndex;

  // Generate waveform bars
  const waveformBars = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const h1 = 0.2 + Math.random() * 0.3;
      const h2 = 0.5 + Math.random() * 0.5;
      const isAccent = i % 7 === 0;
      const animDuration = 0.8 + Math.random() * 0.6;
      const animDelay = Math.random() * 0.5;
      return { h1, h2, isAccent, animDuration, animDelay };
    });
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
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
      setDuration(0);
      setIsPlaying(false);
    }
  }, [currentEpisode?.audioUrl]);

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

  const handlePrev = () => {
    if (selectedIndex < recentEpisodes.length - 1) {
      const audio = audioRef.current;
      if (audio) audio.pause();
      setIsPlaying(false);
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex > 0) {
      const audio = audioRef.current;
      if (audio) audio.pause();
      setIsPlaying(false);
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <section className={`np-hero ${paused ? "np-paused" : ""}`}>
      {currentEpisode.audioUrl && (
        <audio ref={audioRef} src={currentEpisode.audioUrl} preload="metadata" />
      )}

      <div className="np-hero-header">
        <div className="np-brand">The Innovation Pulse</div>
        <div className="np-now">
          <span className="np-dot" />
          Now Playing · Today&apos;s Broadcast
        </div>
      </div>

      <div className="np-card">
        <div className="np-artwork">
          <div className="np-art-top">
            <div className="np-art-logo">The Innovation Pulse</div>
            <div className="np-art-chip">{isoDate}</div>
          </div>
          <div className="np-art-center">
            <div className="np-art-slash">//</div>
            <div className="np-art-day">{dayAbbr}</div>
            <div className="np-art-rule" />
            <div className="np-art-readout">
              {monthAbbr}<span className="np-dim">·</span>{dayNum}<span className="np-dim">·</span>{year}
            </div>
          </div>
          <div className="np-art-bottom">
            <div className="np-art-wave">
              <span style={{ animationDuration: "0.9s" }} />
              <span style={{ animationDuration: "1.2s", animationDelay: "0.2s" }} />
              <span style={{ animationDuration: "0.8s", animationDelay: "0.4s" }} />
              <span style={{ animationDuration: "1.1s", animationDelay: "0.1s" }} />
              <span style={{ animationDuration: "1.3s", animationDelay: "0.3s" }} />
              <span style={{ animationDuration: "0.95s", animationDelay: "0.5s" }} />
            </div>
          </div>
        </div>

        <div className="np-player">
          <div className="np-kicker">Today&apos;s AI News for Higher Ed</div>
          <h1 className="np-title">{headline}</h1>
          <div className="np-meta">
            <strong>Episode {episodeNumber}</strong>
            <span className="np-meta-dot">●</span>
            <span>{storyCount} Stories</span>
            <span className="np-meta-dot">●</span>
            <span>{durationDisplay}</span>
          </div>

          <div className="np-scrubber">
            <span className="np-time np-time-current">{formatTime(currentTime)}</span>
            <div className="np-waveform" ref={waveformRef}>
              {waveformBars.map((bar, i) => (
                <div
                  key={i}
                  className={`wf-bar ${bar.isAccent ? 'wf-accent' : ''}`}
                  style={{
                    '--h1': bar.h1,
                    '--h2': bar.h2,
                    animationDuration: `${bar.animDuration}s`,
                    animationDelay: `${bar.animDelay}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
            <span className="np-time np-time-total">{durationDisplay}</span>
          </div>

          <div className="np-transport">
            <button className="np-ctrl" aria-label="Previous" type="button" onClick={handlePrev}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6l-8.5 6z" />
              </svg>
            </button>
            <button className="np-play-main" aria-label={paused ? "Play" : "Pause"} type="button" onClick={togglePlay}>
              <span className="np-play-icon" />
            </button>
            <button className="np-ctrl" aria-label="Next" type="button" onClick={handleNext}>
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
            <div className="np-transport-meta">
              <span className="np-kbd">Space</span>
              <span>to play</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

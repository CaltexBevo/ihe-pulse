"use client";

import { useState, useRef, useEffect } from "react";

interface EpisodeData {
  date: string;
  dayOfWeek: string;
  audioUrl: string;
  audioDuration: string;
  deepDiveTitle: string;
  deepDiveSlug: string;
  storyCount: number;
}

interface AllEpisodesClientProps {
  episode: EpisodeData;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function AllEpisodesClient({ episode }: AllEpisodesClientProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Parse episode date
  const epDate = new Date(episode.date + "T12:00:00");
  const dayAbbrev = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][epDate.getDay()];
  const monthDay = epDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();

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
  }, []);

  const handlePlayClick = (e: React.MouseEvent) => {
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

  const handleRowClick = () => {
    // Same as play button — clicking row plays/pauses
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      onClick={handleRowClick}
      className="ae-row"
    >
      <audio ref={audioRef} src={episode.audioUrl} preload="metadata" />

      {/* Cover Box (left) — branded mini-cover with play button */}
      <div className="ae-cover">
        <div className="ae-cover-artwork">
          <div className="ae-cover-accent" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/ihe-logo.png" alt="" className="ae-cover-logo" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mic03.png" alt="" className="ae-cover-mic" aria-hidden="true" />
          <div className="ae-cover-title">The Innovation Pulse</div>
          <div className="ae-cover-date">{monthDay}</div>
        </div>

        {/* Play button overlay */}
        <button
          onClick={handlePlayClick}
          className="ae-play-btn"
          aria-label={isPlaying ? "Pause episode" : "Play episode"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className="ae-play-icon">
              <rect x="6" y="4" width="4" height="16" fill="white" />
              <rect x="14" y="4" width="4" height="16" fill="white" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ae-play-icon">
              <polygon points="8,5 19,12 8,19" fill="white" />
            </svg>
          )}
        </button>
      </div>

      {/* Info Container (right) */}
      <div className="ae-info">
        {/* Top line — kicker */}
        <div className="ae-kicker">Daily AI News for Higher Ed</div>

        {/* Headline */}
        <h3 className="ae-headline">{episode.deepDiveTitle}</h3>

        {/* Bottom meta line */}
        <div className="ae-meta">
          <span className="ae-meta-date">{dayAbbrev} · {monthDay}</span>
          <span className="ae-meta-dot">●</span>
          <span>{episode.storyCount} stories</span>
          <span className="ae-meta-dot">●</span>
          <span>{isPlaying ? formatTime(currentTime) : episode.audioDuration}</span>
        </div>
      </div>
    </div>
  );
}

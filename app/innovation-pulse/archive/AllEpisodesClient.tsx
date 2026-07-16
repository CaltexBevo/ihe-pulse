"use client";

import { useState, useRef, useEffect } from "react";

interface EpisodeData {
  date: string;
  dayOfWeek: string;
  audioUrl: string;
  audioDuration: string;
  deepDiveTitle: string;
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
  const [audioError, setAudioError] = useState(false);
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

    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err: DOMException) => {
          // AbortError = interrupted by a pause (fast double-click) — not a
          // real failure, so don't permanently brick the player.
          if (err?.name !== "AbortError") setAudioError(true);
          setIsPlaying(false);
        });
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    togglePlayback();
  };

  // Clicking the row plays/pauses, same as the button
  const handleRowClick = togglePlayback;

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
          <img src="/images/mic03.webp" alt="" className="ae-cover-mic" aria-hidden="true" />
          <div className="ae-cover-title">{"The"}<br />{"Innovation"}<br />{"Pulse"}</div>
          <div className="ae-cover-date">{monthDay}</div>
        </div>

        {/* Play button overlay */}
        <button
          onClick={handlePlayClick}
          className="ae-play-btn"
          aria-label={`${isPlaying ? "Pause" : "Play"} episode — ${episode.dayOfWeek}, ${monthDay}: ${episode.deepDiveTitle}`}
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
        <div className="ae-kicker">AI News for Higher Ed</div>

        {/* Headline */}
        <h3 className="ae-headline">{episode.deepDiveTitle}</h3>

        {/* Bottom meta line */}
        <div className="ae-meta">
          <span className="ae-meta-date">{dayAbbrev} · {monthDay}</span>
          <span className="ae-meta-dot">●</span>
          <span>{episode.storyCount} stories</span>
          <span className="ae-meta-dot">●</span>
          <span>
            {audioError
              ? "Audio unavailable"
              : isPlaying
              ? formatTime(currentTime)
              : episode.audioDuration}
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";

interface StoryPageClientProps {
  audioUrl: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function StoryPageClient({ audioUrl }: StoryPageClientProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);

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

  const togglePlay = () => {
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
          // AbortError = play interrupted by pause (fast double-click) —
          // not a real failure, don't permanently disable the player.
          if (err?.name !== "AbortError") setAudioError(true);
          setIsPlaying(false);
        });
    }
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
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-4 mb-8 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.65rem] font-semibold text-[var(--green)] flex items-center gap-1">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" />
            LISTEN
          </span>
        </div>
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause audio briefing" : "Play audio briefing"}
          className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center shrink-0 hover:scale-[1.08] transition-transform"
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
        <div
          className="flex-1 h-[4px] bg-[var(--surface-2)] rounded-[2px] cursor-pointer relative"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] rounded-[2px]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-mono text-[0.65rem] text-[var(--text-muted)] shrink-0">
          {audioError
            ? "Audio unavailable"
            : `${formatTime(currentTime)} / ${formatTime(duration)}`}
        </span>
      </div>
    </>
  );
}

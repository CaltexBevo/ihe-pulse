"use client";

import { useState, useRef, useEffect } from "react";

interface HomeAudioPlayerProps {
  audioUrl: string;
  audioDuration: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function HomeAudioPlayer({ audioUrl, audioDuration }: HomeAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

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
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <div
        className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-4 mb-6"
        role="region"
        aria-label="Audio player"
      >
        <div className="flex items-center gap-2 mb-3">
          {/* Live Badge */}
          <div className="flex items-center gap-[0.3rem] bg-[rgba(74,222,128,0.1)] text-[var(--green)] px-[0.5rem] py-[0.18rem] rounded-full text-[0.6rem] font-semibold font-mono tracking-[0.06em]">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" aria-hidden="true" />
            LISTEN NOW
          </div>
          {/* Duration */}
          <span className="font-mono text-[0.65rem] text-[var(--text-muted)]">
            {duration > 0 ? formatTime(duration) : audioDuration}
          </span>
          {/* Credit */}
          <span className="font-mono text-[0.65rem] text-[var(--text-muted)] ml-auto">
            The Innovation Pulse
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Play Button */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause episode" : "Play episode"}
            className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(0,212,255,0.2)] transition-transform hover:scale-[1.06]"
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white ml-[2px]" aria-hidden="true">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            )}
          </button>

          {/* Waveform / Progress Bar */}
          <div
            className="flex-1 h-[36px] relative cursor-pointer group"
            onClick={handleProgressClick}
            role="slider"
            aria-label="Audio progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
            aria-valuetext={`${formatTime(currentTime)} of ${duration > 0 ? formatTime(duration) : audioDuration}`}
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
              {Array.from({ length: 75 }, (_, i) => {
                const h = Math.max(4, 6 + Math.sin(i * 0.35) * 14 + Math.cos(i * 0.2) * 8);
                const progressPercent = (i / 75) * 100;
                const isPlayed = progressPercent <= progress;
                return (
                  <div
                    key={i}
                    className={`w-[3px] rounded-[2px] transition-colors ${
                      isPlayed
                        ? "bg-[var(--cyan)]"
                        : "bg-[var(--surface-2)] group-hover:bg-[var(--surface-3)]"
                    }`}
                    style={{ height: `${h}px` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Time */}
          <span className="font-mono text-[0.63rem] text-[var(--text-muted)] shrink-0 min-w-[68px] text-right">
            {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : audioDuration}
          </span>
        </div>
      </div>
    </>
  );
}

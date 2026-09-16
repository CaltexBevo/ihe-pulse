'use client';

import { useRef, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface EpisodeAudioPlayerProps {
  audioUrl: string;
  audioDuration: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function EpisodeAudioPlayer({ audioUrl, audioDuration }: EpisodeAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);

  // Handle autoplay query param
  useEffect(() => {
    const shouldAutoplay = searchParams.get('autoplay') === 'true';

    if (shouldAutoplay && audioRef.current && containerRef.current) {
      // Scroll to the audio player
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Small delay to ensure scroll completes, then play
      const playTimer = setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              // Autoplay may be blocked by browser policy
              if (err?.name === 'AbortError') return;
              if (err?.name === 'NotAllowedError') setAutoplayBlocked(true);
              else setAudioError(true);
            });
        }
      }, 500);

      return () => clearTimeout(playTimer);
    }
  }, [searchParams, audioUrl]);

  // Audio event handlers
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

    const handlePlay = () => {
      setIsPlaying(true);
      setAudioError(false);
      setAutoplayBlocked(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      if (audioError) audio.load();
      setAudioError(false);
      // AbortError = play interrupted by pause (fast double-click) — not a
      // real failure, don't permanently disable the player.
      audio.play().catch((err: DOMException) => {
        if (err?.name !== 'AbortError') setAudioError(true);
      });
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = Math.max(0, Math.min(1, percentage)) * duration;
  };

  return (
    <div
      ref={containerRef}
      id="audio-player"
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 sm:p-6 mb-8 scroll-mt-24"
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      <h2 className="text-lg sm:text-xl font-bold mb-4">Listen to the full episode</h2>
      <div className="flex items-center gap-4">

      <div className="sr-only" aria-live="polite">
        <span className={`w-[5px] h-[5px] rounded-full ${isPlaying ? 'bg-[var(--cyan)] animate-[pulseDot_2s_infinite]' : 'bg-[var(--text-muted)]'}`} />
        {audioError ? 'UNAVAILABLE' : isPlaying ? 'PLAYING' : 'LISTEN'}
      </div>

      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause episode' : 'Play episode'}
        className="w-14 h-14 rounded-full bg-[var(--cyan)] text-[var(--bg)] flex items-center justify-center shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cyan)]"
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current ml-[1px]" aria-hidden="true">
            <polygon points="6,3 20,12 6,21" />
          </svg>
        )}
      </button>

      <div
        className="flex-1 h-3 bg-[var(--surface-2)] rounded-md relative cursor-pointer group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cyan)]"
        onClick={handleProgressClick}
        onKeyDown={(event) => {
          const audio = audioRef.current;
          if (!audio || !duration) return;
          const targets: Record<string, number> = {
            ArrowRight: audio.currentTime + 5, ArrowUp: audio.currentTime + 5,
            ArrowLeft: audio.currentTime - 5, ArrowDown: audio.currentTime - 5,
            Home: 0, End: duration,
          };
          if (event.key in targets) {
            event.preventDefault();
            audio.currentTime = Math.max(0, Math.min(duration, targets[event.key]));
          }
        }}
        role="slider"
        aria-label="Audio progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        aria-valuetext={formatTime(currentTime) + ' of ' + (duration ? formatTime(duration) : audioDuration)}
        tabIndex={0}
      >
        <div
          className="h-full bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] rounded-[2px] transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="font-mono text-xs text-[var(--text-secondary)] whitespace-nowrap">
        {audioError
          ? 'Audio unavailable'
          : duration > 0
          ? `${formatTime(currentTime)} / ${formatTime(duration)}`
          : '0:00 / ' + audioDuration}
      </span>
      </div>
      <p className="text-sm text-[var(--text-secondary)] mt-3" role="status">
        {audioError ? 'Audio could not load. Press Play to retry.' : autoplayBlocked
          ? 'Your browser paused automatic playback. Press Play to listen.'
          : isPlaying ? 'Playing the full episode.' : 'Press Play if audio does not start automatically.'}
      </p>
    </div>
  );
}

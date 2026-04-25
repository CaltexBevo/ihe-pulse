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
              console.log('Autoplay blocked:', err);
            });
        }
      }, 500);

      return () => clearTimeout(playTimer);
    }
  }, [searchParams]);

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

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
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
    <div
      ref={containerRef}
      id="audio-player"
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-4 mb-10 flex items-center gap-3"
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className="flex items-center gap-[0.35rem] text-[0.65rem] font-semibold text-[var(--cyan)] font-mono tracking-[0.06em]">
        <span className={`w-[5px] h-[5px] rounded-full ${isPlaying ? 'bg-[var(--cyan)] animate-[pulseDot_2s_infinite]' : 'bg-[var(--text-muted)]'}`} />
        {isPlaying ? 'PLAYING' : 'LISTEN'}
      </div>

      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause episode' : 'Play episode'}
        className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center shrink-0 transition-transform hover:scale-105"
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-white">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-white ml-[1px]">
            <polygon points="6,3 20,12 6,21" />
          </svg>
        )}
      </button>

      <div
        className="flex-1 h-1 bg-[var(--surface-2)] rounded-[2px] relative cursor-pointer group"
        onClick={handleProgressClick}
        role="slider"
        aria-label="Audio progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        tabIndex={0}
      >
        <div
          className="h-full bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] rounded-[2px] transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="font-mono text-[0.65rem] text-[var(--text-muted)] whitespace-nowrap">
        {duration > 0 ? `${formatTime(currentTime)} / ${formatTime(duration)}` : audioDuration}
      </span>
    </div>
  );
}

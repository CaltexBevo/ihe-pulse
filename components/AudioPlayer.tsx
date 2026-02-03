'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  title?: string;
  duration?: string;
  barCount?: number;
}

export default function AudioPlayer({
  title,
  duration = '18:24',
  barCount = 50,
}: AudioPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');

  // Parse duration string to seconds
  const parseDuration = useCallback((dur: string) => {
    const parts = dur.split(':').map(Number);
    return parts[0] * 60 + parts[1];
  }, []);

  const totalSeconds = parseDuration(duration);

  // Format seconds to mm:ss
  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
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

  // Generate static bar heights (seeded by index for consistency)
  const bars = Array.from({ length: barCount }, (_, i) => {
    const base = 15 + Math.sin(i * 0.4) * 30 + Math.sin(i * 0.15) * 25;
    return Math.max(8, Math.min(95, base + ((i * 7 + 13) % 20)));
  });

  const handleBarClick = (index: number) => {
    const newProgress = (index / barCount) * 100;
    setProgress(newProgress);
    setCurrentTime(formatTime((newProgress / 100) * totalSeconds));
  };

  return (
    <div className="glass rounded-xl p-4 sm:p-5">
      {title && (
        <p className="text-sm font-medium text-white mb-3 truncate">{title}</p>
      )}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Play/Pause */}
        <button
          onClick={() => setPlaying(!playing)}
          className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-pulse to-synapse flex items-center justify-center hover:opacity-80 transition-opacity"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <Pause size={18} className="text-white" />
          ) : (
            <Play size={18} className="text-white ml-0.5" />
          )}
        </button>

        {/* Waveform */}
        <div
          className="flex-1 flex items-end gap-[2px] h-10 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const ratio = x / rect.width;
            const index = Math.round(ratio * barCount);
            handleBarClick(Math.max(0, Math.min(barCount - 1, index)));
          }}
        >
          {bars.map((height, i) => {
            const barProgress = (i / barCount) * 100;
            const isPlayed = barProgress <= progress;
            const isActive =
              playing && Math.abs(barProgress - progress) < 100 / barCount;
            return (
              <div
                key={i}
                className="flex-1 min-w-[2px] max-w-[4px] rounded-full transition-colors duration-150 pointer-events-none"
                style={{
                  height: `${height}%`,
                  background: isPlayed
                    ? isActive
                      ? '#00d4ff'
                      : 'linear-gradient(to top, #00d4ff, #c850c0)'
                    : 'rgba(255,255,255,0.1)',
                  transform: isActive ? 'scaleY(1.2)' : 'scaleY(1)',
                  transition: 'transform 0.15s ease, background 0.15s ease',
                }}
              />
            );
          })}
        </div>

        {/* Time */}
        <div className="shrink-0 text-right">
          <span className="text-xs text-gray-500 font-mono tabular-nums">
            {currentTime} / {duration}
          </span>
        </div>

        {/* Mute toggle */}
        <button
          onClick={() => setMuted(!muted)}
          className="shrink-0 text-gray-500 hover:text-pulse transition-colors hidden sm:block"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-0.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pulse to-synapse rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';
import { formatWeekCovered } from '@/lib/data/innovation-pulse-types';
import { getHomePulseArtwork } from '@/lib/home-pulse-artwork';
import styles from './HomePulseHero.module.css';

interface HomePulseHeroProps {
  episode: InnovationPulseEpisode;
  autoPlay?: boolean;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function durationFromLabel(label: string): number {
  const [minutes, seconds] = label.split(':').map(Number);
  if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return 0;
  return minutes * 60 + seconds;
}

function seededWaveform(seedText: string, count = 88): number[] {
  let seed = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    seed ^= seedText.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }

  const next = () => {
    seed += 0x6d2b79f5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };

  return Array.from({ length: count }, (_, index) => {
    const envelope = 0.64 + 0.36 * Math.sin((index / Math.max(count - 1, 1)) * Math.PI);
    return Math.round((24 + next() * 70 * envelope) * 10) / 10;
  });
}

export default function HomePulseHero({ episode, autoPlay = false }: HomePulseHeroProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [copied, setCopied] = useState(false);

  const headline = episode.deepDive?.title || 'The Innovation Pulse';
  const styledArtwork = getHomePulseArtwork(episode.date);
  const fallbackArtwork = episode.deepDive?.heroImage || episode.deepDive?.image || '';
  const waveform = useMemo(
    () => seededWaveform(`${episode.date}:${headline}`),
    [episode.date, headline]
  );
  const fallbackDuration = durationFromLabel(episode.audioDuration || '0:00');
  const totalDuration = duration || fallbackDuration;
  const progress = totalDuration > 0 ? Math.min(currentTime / totalDuration, 1) : 0;
  const hasAudio = Boolean(episode.audioUrl);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : fallbackDuration);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handlePlay = () => {
      setAudioError(false);
      setIsPlaying(true);
    };
    const handlePause = () => {
      setIsPlaying(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || totalDuration);
    };
    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [episode.date, fallbackDuration, totalDuration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();

    if (autoPlay) {
      audio.play().catch((error: DOMException) => {
        if (error?.name !== 'AbortError' && error?.name !== 'NotAllowedError') {
          setAudioError(true);
        }
      });
    }

    return () => audio.pause();
  }, [episode.audioUrl, autoPlay]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    setAudioError(false);
    audio.play().catch((error: DOMException) => {
      if (error?.name !== 'AbortError') setAudioError(true);
    });
  };

  const seekTo = (nextTime: number) => {
    const audio = audioRef.current;
    if (!audio || !totalDuration) return;
    const boundedTime = Math.min(Math.max(nextTime, 0), totalDuration);
    audio.currentTime = boundedTime;
    setCurrentTime(boundedTime);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/innovation-pulse/${episode.date}`;
    const shareData = {
      title: headline,
      text: `Listen to The Innovation Pulse: ${headline}`,
      url: shareUrl,
    };

    if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const statusText = audioError
    ? 'Audio unavailable'
    : !hasAudio
      ? 'Audio coming soon'
      : isPlaying
        ? `${formatTime(currentTime)} / ${formatTime(totalDuration)}`
        : currentTime > 0
          ? `Resume · ${formatTime(currentTime)} / ${formatTime(totalDuration)}`
          : `Listen · ${episode.audioDuration}`;

  return (
    <section className={styles.hero} aria-labelledby="home-pulse-title">
      <h1 id="home-pulse-title" className={styles.srOnly}>{headline}</h1>
      {/* The governed engagement layer observes native audio and share events. */}
      {hasAudio && <audio ref={audioRef} src={episode.audioUrl} preload="metadata" />}

      <div className={styles.artwork}>
        {styledArtwork ? (
          <Image
            src={styledArtwork}
            alt={`Episode artwork for ${headline}`}
            className={styles.artworkImage}
            width={1672}
            height={941}
            priority
          />
        ) : (
          <>
            {fallbackArtwork && (
              <Image src={fallbackArtwork} alt="" className={styles.artworkFallback} fill sizes="100vw" aria-hidden="true" />
            )}
            <div className={styles.artworkShade} />
            <div className={styles.fallbackTitle}>{headline}</div>
          </>
        )}
      </div>

      <div className={styles.footer}>
        <button
          type="button"
          className={styles.playButton}
          onClick={togglePlay}
          disabled={!hasAudio}
          aria-label={isPlaying ? 'Pause episode' : 'Play episode'}
        >
          {isPlaying ? (
            <svg className={styles.pauseIcon} viewBox="0 0 24 24" aria-hidden="true">
              <rect x="5" y="3" width="5" height="18" rx="1" fill="currentColor" />
              <rect x="14" y="3" width="5" height="18" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg className={styles.playIcon} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 3.5 20 12 6 20.5Z" fill="currentColor" />
            </svg>
          )}
        </button>

        <div className={styles.waveColumn}>
          <div className={styles.waveShell}>
            <div className={styles.waveform} aria-hidden="true">
              {waveform.map((height, index) => {
                const isPlayed = index / Math.max(waveform.length - 1, 1) <= progress;
                return (
                  <span
                    key={`${episode.date}-${index}`}
                    className={[
                      styles.bar,
                      index < waveform.length * 0.68 ? styles.barWarm : styles.barCool,
                      isPlayed ? styles.barPlayed : '',
                    ].filter(Boolean).join(' ')}
                    style={{ '--bar-height': `${height}%` } as CSSProperties}
                  />
                );
              })}
            </div>
            <input
              className={styles.seekRange}
              type="range"
              min="0"
              max={Math.max(totalDuration, 1)}
              step="1"
              value={Math.min(currentTime, Math.max(totalDuration, 1))}
              onChange={(event) => seekTo(Number(event.currentTarget.value))}
              disabled={!hasAudio || !totalDuration}
              aria-label="Seek through episode"
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(totalDuration)}`}
            />
            <span className={styles.timeHint}>{formatTime(currentTime)} / {formatTime(totalDuration)}</span>
          </div>
        </div>

        <div className={styles.info}>
          <div className={styles.showName}>Innovation Pulse</div>
          <div className={styles.listenStatus} aria-live="polite">
            {!isPlaying && !audioError && hasAudio && <span className={styles.statusGlyph} aria-hidden="true" />}
            <span>{statusText}</span>
          </div>
          <div className={styles.week}>{formatWeekCovered(episode)}</div>

          <button type="button" className={styles.shareButton} onClick={handleShare} aria-label="Share episode">
            <svg className={styles.shareIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="18" cy="5" r="2.5" />
              <circle cx="6" cy="12" r="2.5" />
              <circle cx="18" cy="19" r="2.5" />
              <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
            </svg>
            <span className={styles.shareLabel}>Share</span>
          </button>
          {copied && <span className={styles.shareNotice} role="status">Link copied</span>}
        </div>
      </div>
    </section>
  );
}

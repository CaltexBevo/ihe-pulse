'use client';

import Image from 'next/image';
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';
import { formatWeekCovered } from '@/lib/data/innovation-pulse-types';
import {
  getHomePulseArtwork,
  getHomePulseSupportCopy,
} from '@/lib/home-pulse-artwork';
import { getHomePulseWaveform } from '@/lib/home-pulse-waveforms';
import { getHomepageQuickHits } from '@/lib/homepagePulse';
import styles from './HomePulseHero.module.css';

export interface HomePulseHeroViewModel {
  date: string;
  audioUrl: string;
  audioDuration: string;
  headline: string;
  fallbackArtwork: string;
  storyCount: number;
  weekLabel: string;
}

export type HomePulseHeroEpisode =
  | HomePulseHeroViewModel
  | InnovationPulseEpisode;

interface HomePulseHeroProps {
  episode: HomePulseHeroEpisode;
  autoPlay?: boolean;
}

type PlatformName = 'apple' | 'spotify' | 'amazon' | 'youtube' | 'x';

const PLATFORM_LINKS: ReadonlyArray<{
  name: PlatformName;
  label: string;
  href: string;
}> = [
  {
    name: 'apple',
    label: 'Apple Podcasts',
    href: 'https://podcasts.apple.com/us/podcast/innovating-higher-ed/id1774879335',
  },
  {
    name: 'spotify',
    label: 'Spotify',
    href: 'https://open.spotify.com/show/4rMDJnlFbrLMr0hKAE3Oe6',
  },
  {
    name: 'amazon',
    label: 'Amazon Music',
    href: 'https://music.amazon.com/podcasts/3ab228ea-6a9d-4173-95e9-dcc03bc6ecc9/innovating-higher-ed',
  },
  {
    name: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@InnovatingHigherEd',
  },
  {
    name: 'x',
    label: 'X',
    href: 'https://x.com/InnovatingEd',
  },
];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return String(minutes) + ':' + String(remainder).padStart(2, '0');
}

function durationFromLabel(label: string): number {
  const parts = label.split(':').map(Number);
  if (parts.length === 0 || parts.some((part) => !Number.isFinite(part))) return 0;
  return parts.reduce((total, part) => total * 60 + part, 0);
}

function PlatformIcon({ name }: { name: PlatformName }) {
  if (name === 'apple') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="currentColor" opacity="0.18" />
        <circle cx="12" cy="10.5" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="10.5" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="10.5" r="0.95" fill="currentColor" />
        <path d="M10.4 13.1h3.2l1.15 6.2H9.25Z" fill="currentColor" />
      </svg>
    );
  }

  if (name === 'spotify') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 9.2c3.7-1 7.6-.55 10.6 1.1M7.8 12.2c3-.75 6.35-.38 8.9.9M8.6 15.05c2.4-.55 5-.25 7 .72" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.55" />
      </svg>
    );
  }

  if (name === 'amazon') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 6.5v9.1a2.4 2.4 0 1 1-1.5-2.2V8.1l10-2v7.4a2.4 2.4 0 1 1-1.5-2.2V4.2Z" fill="currentColor" />
        <path d="M6.5 20c3.2 1.55 7.6 1.45 11-.15" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.35" />
      </svg>
    );
  }

  if (name === 'youtube') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="currentColor" />
        <path d="m10 9 5 3-5 3Z" fill="var(--bg)" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 4.5 18.8 19.5M18.4 4.5 5.2 19.5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function HomePulseHero({
  episode,
  autoPlay = false,
}: HomePulseHeroProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const [copied, setCopied] = useState(false);

  const usesPreparedViewModel = 'weekLabel' in episode;
  const headline = usesPreparedViewModel
    ? episode.headline
    : episode.deepDive?.title || 'The Innovation Pulse';
  const styledArtwork = getHomePulseArtwork(episode.date);
  const fallbackArtwork = usesPreparedViewModel
    ? episode.fallbackArtwork
    : episode.deepDive?.heroImage || episode.deepDive?.image || '';
  const waveform = getHomePulseWaveform(episode.date);
  const fallbackDuration = durationFromLabel(episode.audioDuration || '0:00');
  const totalDuration = duration || fallbackDuration;
  const progress =
    totalDuration > 0 ? Math.min(currentTime / totalDuration, 1) : 0;
  const hasAudio = Boolean(episode.audioUrl);
  const storyCount = usesPreparedViewModel
    ? episode.storyCount
    : 1 + getHomepageQuickHits(episode).length;
  const weekLabel = usesPreparedViewModel
    ? episode.weekLabel
    : formatWeekCovered(episode);
  const roundedMinutes = Math.max(1, Math.round(fallbackDuration / 60));
  const supportCopy = getHomePulseSupportCopy(episode.date);
  const usesApprovedCollage = episode.date === '2026-08-28';

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(
        Number.isFinite(audio.duration) ? audio.duration : fallbackDuration,
      );
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handlePlay = () => {
      setAudioError(false);
      setIsPlaying(true);
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || fallbackDuration);
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
  }, [fallbackDuration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();

    if (autoPlay) {
      audio.play().catch((error: DOMException) => {
        if (
          error?.name !== 'AbortError' &&
          error?.name !== 'NotAllowedError'
        ) {
          setAudioError(true);
        }
      });
    }

    return () => audio.pause();
  }, [episode.audioUrl, autoPlay]);

  useEffect(() => {
    if (!isPlaying) return;
    let frame = 0;

    const updateProgress = () => {
      if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
      frame = window.requestAnimationFrame(updateProgress);
    };

    frame = window.requestAnimationFrame(updateProgress);
    return () => window.cancelAnimationFrame(frame);
  }, [isPlaying]);

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

  const handleSeekKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    let nextTime: number | null = null;

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      nextTime = currentTime + 5;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      nextTime = currentTime - 5;
    } else if (event.key === 'Home') {
      nextTime = 0;
    } else if (event.key === 'End') {
      nextTime = totalDuration;
    }

    if (nextTime !== null) {
      event.preventDefault();
      seekTo(nextTime);
    }
  };

  const handleShare = async () => {
    const shareUrl =
      window.location.origin + '/innovation-pulse/' + episode.date;
    const shareData = {
      title: headline,
      text: 'Listen to The Innovation Pulse: ' + headline,
      url: shareUrl,
    };

    if (
      navigator.share &&
      (!navigator.canShare || navigator.canShare(shareData))
    ) {
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

  return (
    <section className={styles.hero} aria-labelledby="home-pulse-title">
      {hasAudio && (
        <audio ref={audioRef} src={episode.audioUrl} preload="metadata" />
      )}

      <div className={styles.storyPanel}>
        <div className={styles.valueCopy}>
          <p className={styles.eyebrow}>This week’s Innovation Pulse</p>
          <h1 id="home-pulse-title" className={styles.valueHeadline}>
            <span className={styles.storyLine}>
              {storyCount} {storyCount === 1 ? 'story.' : 'stories.'}
            </span>
            <span className={styles.minuteLine}>
              {roundedMinutes} {roundedMinutes === 1 ? 'minute.' : 'minutes.'}
            </span>
            <span className={styles.valueLine}>Know what matters.</span>
          </h1>
          <p className={styles.supportCopy}>{supportCopy}</p>
        </div>

        <div className={styles.artwork}>
          {(styledArtwork || fallbackArtwork) && (
            <Image
              src={styledArtwork || fallbackArtwork}
              alt={
                usesApprovedCollage
                  ? 'Weekly Innovation Pulse collage connecting the MIT AI guidelines story with degree pathways, responsible AI, course tools, research, and teaching practice.'
                  : 'Episode artwork for ' + headline
              }
              fill
              priority
              sizes="(max-width: 680px) 100vw, 70vw"
              className={
                usesApprovedCollage
                  ? styles.approvedArtworkImage
                  : styles.fallbackArtworkImage
              }
            />
          )}
          <div className={styles.artworkBlend} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.playerPanel}>
        <div className={styles.playerSection}>
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

          <div className={styles.playerContent}>
            <p className={styles.playerLabel}>
              Play the {roundedMinutes}-minute briefing
            </p>
            <div
              className={styles.waveShell}
              data-waveform-status={waveform ? 'verified' : 'unavailable'}
              style={
                {
                  '--playhead': String(progress * 100) + '%',
                } as CSSProperties
              }
            >
              {waveform ? (
                <div className={styles.waveform} aria-hidden="true">
                  {waveform.map((height, index) => {
                    const isPlayed =
                      (index + 0.5) / waveform.length <= progress;
                    return (
                      <span
                        key={episode.date + '-' + String(index)}
                        className={
                          isPlayed
                            ? styles.waveBar + ' ' + styles.waveBarPlayed
                            : styles.waveBar
                        }
                        style={
                          {
                            '--bar-height': String(height) + '%',
                          } as CSSProperties
                        }
                      />
                    );
                  })}
                </div>
              ) : (
                <div className={styles.seekTrack} aria-hidden="true">
                  <span
                    className={styles.seekTrackPlayed}
                    style={{ width: String(progress * 100) + '%' }}
                  />
                </div>
              )}
              <span className={styles.playhead} aria-hidden="true" />
              <input
                className={styles.seekRange}
                type="range"
                min="0"
                max={Math.max(totalDuration, 1)}
                step="0.1"
                value={Math.min(currentTime, Math.max(totalDuration, 1))}
                onInput={(event) =>
                  seekTo(Number(event.currentTarget.value))
                }
                onKeyDown={handleSeekKeyDown}
                disabled={!hasAudio || !totalDuration}
                aria-label="Seek through episode"
                aria-valuetext={
                  formatTime(currentTime) + ' of ' + formatTime(totalDuration)
                }
              />
            </div>
            <p className={styles.timeReadout}>
              <span>{formatTime(currentTime)}</span>
              <span aria-hidden="true"> / </span>
              <span>{formatTime(totalDuration)}</span>
            </p>
            {audioError && (
              <p className={styles.audioMessage} role="status">
                Audio is temporarily unavailable.
              </p>
            )}
          </div>
        </div>

        <aside
          className={styles.actionPanel}
          aria-label="Innovation Pulse listening options"
        >
          <div className={styles.actionHeading}>
            <p className={styles.showName}>Innovation Pulse</p>
            <p className={styles.episodeMeta}>
              <span>{weekLabel}</span>
              <span className={styles.metaDivider} aria-hidden="true" />
              <span>{episode.audioDuration}</span>
            </p>
          </div>
          <p className={styles.listenFollow}>Listen &amp; follow</p>
          <div className={styles.platformGrid}>
            {PLATFORM_LINKS.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  styles.platformLink + ' ' + styles[platform.name]
                }
                aria-label={'Listen to Innovation Pulse on ' + platform.label}
              >
                <span className={styles.platformIcon}>
                  <PlatformIcon name={platform.name} />
                </span>
                <span>{platform.label}</span>
              </a>
            ))}
            <button
              type="button"
              className={styles.shareButton}
              onClick={handleShare}
              aria-label="Share episode from Innovation Pulse"
            >
              <span className={styles.platformIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="18" cy="5" r="2.5" />
                  <circle cx="6" cy="12" r="2.5" />
                  <circle cx="18" cy="19" r="2.5" />
                  <path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5" />
                </svg>
              </span>
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

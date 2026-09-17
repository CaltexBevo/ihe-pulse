'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import styles from './archive.module.css';
import { APPROVED_SEPTEMBER_11_HERO } from '@/components/ApprovedSeptember11HeroArtwork';
import approvedArtworkStyles from '@/components/ApprovedSeptember11HeroArtwork.module.css';
import september04Styles from '@/components/ApprovedSeptemberHeroArtwork.module.css';

export interface ArchiveEpisodeData {
  date: string;
  audioUrl: string;
  audioDuration: string;
  headline: string;
  summary: string;
  storyCount: number;
  weekLabel: string;
  thumbnailUrl: string | null;
  fallbackImage: string | null;
  relatedTitles: string[];
  searchText: string;
}

interface ArchiveListClientProps {
  episodes: ArchiveEpisodeData[];
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function Artwork({ episode, priority = false }: { episode: ArchiveEpisodeData; priority?: boolean }) {
  const imageUrl = episode.thumbnailUrl || episode.fallbackImage;
  if (imageUrl === APPROVED_SEPTEMBER_11_HERO) {
    return <div className={styles.weeklyMaster}><div className={approvedArtworkStyles.artwork}>
      <Image src={imageUrl} alt={`Edition artwork for ${episode.headline}`} width={1681} height={936} className={approvedArtworkStyles.image} />
    </div></div>;
  }
  if (episode.date === '2026-09-04' && imageUrl?.includes('approved-hero-v4-a-blue')) {
    return <div className={styles.weeklyMaster}><div className={september04Styles.artwork}>
      <Image src={imageUrl} alt={`Edition artwork for ${episode.headline}`} width={1671} height={941} className={september04Styles.image} />
    </div></div>;
  }
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt={`Edition artwork for ${episode.headline}`}
        fill
        sizes={priority ? "(max-width: 760px) 100vw, 50vw" : "(max-width: 540px) 100vw, 180px"}
        className={styles.artworkImage}
        priority={priority}
      />
    );
  }

  return (
    <div
      className={styles.fallbackArtwork}
      role="img"
      aria-label={`No artwork available for ${episode.headline}`}
    />
  );
}

export default function ArchiveListClient({ episodes }: ArchiveListClientProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeEpisodeRef = useRef<ArchiveEpisodeData | null>(null);
  const [query, setQuery] = useState('');
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioErrorDate, setAudioErrorDate] = useState<string | null>(null);

  const filteredEpisodes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return episodes;
    return episodes.filter((episode) => episode.searchText.includes(normalizedQuery));
  }, [episodes, query]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleLoadedMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const handlePlay = () => {
      setIsPlaying(true);
    };
    const handlePause = () => {
      setIsPlaying(false);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || 0);
    };
    const handleError = () => {
      setAudioErrorDate(audio.dataset.episodeDate || null);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  const stopActiveAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    activeEpisodeRef.current = null;
    setActiveDate(null);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleSearchChange = (nextQuery: string) => {
    const normalizedQuery = nextQuery.trim().toLowerCase();
    if (normalizedQuery && activeDate) {
      const activeEpisode = episodes.find((episode) => episode.date === activeDate);
      if (activeEpisode && !activeEpisode.searchText.includes(normalizedQuery)) {
        stopActiveAudio();
      }
    }
    setQuery(nextQuery);
  };

  const toggleEpisode = (episode: ArchiveEpisodeData) => {
    const audio = audioRef.current;
    if (!audio || !episode.audioUrl) return;

    if (activeDate === episode.date) {
      if (isPlaying) {
        audio.pause();
      } else {
        setAudioErrorDate(null);
        audio.play().catch((error: DOMException) => {
          if (error?.name !== 'AbortError' && error?.name !== 'NotAllowedError') {
            setAudioErrorDate(episode.date);
          }
        });
      }
      return;
    }

    audio.pause();
    activeEpisodeRef.current = episode;
    audio.dataset.episodeDate = episode.date;
    audio.src = episode.audioUrl;
    audio.load();
    setActiveDate(episode.date);
    setCurrentTime(0);
    setDuration(0);
    setAudioErrorDate(null);
    audio.play().catch((error: DOMException) => {
      if (error?.name !== 'AbortError' && error?.name !== 'NotAllowedError') {
        setAudioErrorDate(episode.date);
      }
    });
  };

  const seekActiveEpisode = (value: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = Math.min(Math.max(value, 0), duration);
    setCurrentTime(audio.currentTime);
  };

  const playLabel = (episode: ArchiveEpisodeData) => {
    if (audioErrorDate === episode.date) return 'Audio unavailable';
    if (activeDate === episode.date && isPlaying) return 'Pause';
    if (activeDate === episode.date && currentTime > 0) return 'Resume';
    return 'Listen';
  };

  const timeLabel = (episode: ArchiveEpisodeData) => (
    activeDate === episode.date && currentTime > 0 ? formatTime(currentTime) : episode.audioDuration
  );

  const matchCount = filteredEpisodes.length;

  return (
    <>
      {/* One audio element guarantees that only one archive episode plays at a time. */}
      <audio ref={audioRef} preload="metadata" />

      <section className={styles.library} aria-labelledby="episode-library-title">
        <div className={styles.libraryHeader}>
          <div>
            <h2 id="episode-library-title">Weekly Editions</h2>
          </div>

          <label className={styles.search}>
            <span className={styles.srOnly}>Search editions</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(event) => handleSearchChange(event.currentTarget.value)}
              placeholder="Search stories or topics"
            />
          </label>
        </div>

        {query.trim() && (
          <p className={styles.matchCount} aria-live="polite">
            {matchCount} {matchCount === 1 ? 'edition matches' : 'editions match'} “{query.trim()}”
          </p>
        )}

        <div className={styles.cardGrid}>
          {filteredEpisodes.map((episode) => (
            <article className={styles.card} key={episode.date}>
              <div className={styles.cardArtwork}>
                <Artwork episode={episode} />
              </div>

              <div className={styles.cardCopy}>
                <div className={styles.cardMeta}>
                  <span>{episode.weekLabel}</span>
                  <span>{episode.storyCount} stories</span>
                </div>
                <h3>{episode.headline}</h3>
              </div>

              <p className={styles.cardSummary}>{episode.summary}</p>

                <div className={styles.cardActions}>
                  <button
                    type="button"
                    className={styles.cardListen}
                    onClick={() => toggleEpisode(episode)}
                    disabled={!episode.audioUrl}
                    aria-label={`${playLabel(episode)} ${episode.headline}`}
                  >
                    <span className={activeDate === episode.date && isPlaying ? styles.pauseGlyph : styles.playGlyph} aria-hidden="true" />
                    {playLabel(episode)}
                    <span className={styles.listenRuntime}>{timeLabel(episode)}</span>
                  </button>
                  <Link href={`/innovation-pulse/${episode.date}`} className={styles.cardLink}>
                    Edition <span aria-hidden="true">→</span>
                  </Link>
                </div>

                {activeDate === episode.date && duration > 0 && (
                  <div className={styles.progressRow}>
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      step="1"
                      value={Math.min(currentTime, duration)}
                      onChange={(event) => seekActiveEpisode(Number(event.currentTarget.value))}
                      aria-label={`Seek through ${episode.headline}`}
                      aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                      style={{ '--progress': `${(currentTime / duration) * 100}%` } as CSSProperties}
                    />
                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>
                )}
            </article>
          ))}
        </div>

        {matchCount === 0 && (
          <div className={styles.emptyState}>No editions match “{query.trim()}”.</div>
        )}
      </section>
    </>
  );
}

'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import HomePulseHero from '@/components/HomePulseHero';
import NewsletterSignup from '@/components/NewsletterSignup';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';
import { formatWeekCovered, isWeeklyEpisode } from '@/lib/data/innovation-pulse-types';
import { getPulseEpisodeThumbnail } from '@/lib/home-pulse-artwork';
import styles from './HomeEpisodePlayer.module.css';

interface HomeEpisodePlayerProps {
  latestEpisode: InnovationPulseEpisode;
  recentEpisodes: InnovationPulseEpisode[];
}

export default function HomeEpisodePlayer({ latestEpisode, recentEpisodes }: HomeEpisodePlayerProps) {
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  // Current episode based on selection
  const currentEpisode = recentEpisodes[selectedEpisodeIndex] || latestEpisode;

  // Handle episode change from HeroNowPlaying or Recent Episodes grid
  const handleEpisodeChange = useCallback((index: number, ep: InnovationPulseEpisode) => {
    setSelectedEpisodeIndex(index);
    setShouldAutoPlay(true);
    // Update URL without navigation (optional for homepage)
    const newUrl = `/?episode=${ep.date}`;
    window.history.pushState({ episodeDate: ep.date }, '', newUrl);
  }, []);

  // Handle clicking a recent episode card
  const handleRecentEpisodeClick = useCallback((ep: InnovationPulseEpisode) => {
    const index = recentEpisodes.findIndex(e => e.date === ep.date);
    if (index !== -1) {
      handleEpisodeChange(index, ep);
    }
  }, [recentEpisodes, handleEpisodeChange]);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.episodeDate) {
        const index = recentEpisodes.findIndex(e => e.date === event.state.episodeDate);
        if (index !== -1) {
          setSelectedEpisodeIndex(index);
          setShouldAutoPlay(false);
        }
      } else {
        // Reset to latest episode when navigating back to clean URL
        setSelectedEpisodeIndex(0);
        setShouldAutoPlay(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [recentEpisodes]);

  return (
    <>
      {/* Homepage-only editorial hero with a standardized live player. */}
      <div className="animate-[fadeUp_0.7s_ease-out_both]">
        <HomePulseHero
          key={currentEpisode.date}
          episode={currentEpisode}
          autoPlay={shouldAutoPlay}
        />
      </div>

      <div className={`np-subscribe ${styles.newsletter}`}>
        <div className="np-sub-copy">
          <strong>Never miss an episode.</strong>{" "}
          <span className="np-sub-muted">
            {isWeeklyEpisode(currentEpisode)
              ? 'Delivered to your inbox every Friday — listen on the drive in, at lunch, or the drive home.'
              : 'Delivered to your inbox every weekday — listen on the drive in, at lunch, or the drive home.'}
          </span>
        </div>
        <NewsletterSignup variant="inline-strip" />
      </div>

      {/* Homepage-only landscape rail using the approved episode-artwork system. */}
      {recentEpisodes && recentEpisodes.length > 1 && (
        <section className={styles.recent} aria-labelledby="home-recent-episodes">
          <div className={styles.header}>
            <div className={styles.headingGroup}>
              <span className={styles.dot} aria-hidden="true" />
              <div>
                <h2 id="home-recent-episodes" className={styles.heading}>Recent Episodes</h2>
                <p className={styles.subheading}>More of the weekly A.I. news shaping higher education</p>
              </div>
            </div>
            <Link href="/innovation-pulse/archive" className={styles.allEpisodes}>
              All Episodes
            </Link>
          </div>

          <div className={styles.rail}>
            {recentEpisodes.slice(1, 9).map((ep, idx) => {
              const actualIndex = idx + 1;
              const isSelected = selectedEpisodeIndex === actualIndex;
              const artwork = getPulseEpisodeThumbnail(ep.date);
              const headline = ep.deepDive?.title || 'The Innovation Pulse';

              return (
                <button
                  key={ep.date}
                  type="button"
                  onClick={() => handleRecentEpisodeClick(ep)}
                  className={`${styles.card} ${isSelected ? styles.selected : ''}`}
                  aria-label={`${isSelected ? 'Currently selected' : 'Listen to'} ${headline}`}
                >
                  <div className={styles.artwork}>
                    {artwork ? (
                      <Image
                        src={artwork}
                        alt=""
                        fill
                        sizes="(max-width: 680px) 82vw, (max-width: 1000px) 31vw, 270px"
                        className={styles.artworkImage}
                        aria-hidden="true"
                      />
                    ) : (
                      <div className={styles.legacyArtwork}>
                        <span>Innovation Pulse</span>
                        <strong>{headline}</strong>
                      </div>
                    )}
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.week}>{formatWeekCovered(ep)}</div>
                    <h3 className={styles.cardTitle}>{headline}</h3>
                    <div className={styles.actionRow}>
                      <span className={styles.listenAction}>
                        <span className={styles.playGlyph} aria-hidden="true" />
                        {isSelected ? 'Selected above' : 'Listen'}
                      </span>
                      <span className={styles.duration}>{ep.audioDuration}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}

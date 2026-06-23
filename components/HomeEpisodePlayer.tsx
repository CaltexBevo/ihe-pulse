'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import HeroNowPlaying from '@/components/HeroNowPlaying';
import NewsletterSignup from '@/components/NewsletterSignup';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';
import { isWeeklyEpisode } from '@/lib/data/innovation-pulse-types';

interface HomeEpisodePlayerProps {
  latestEpisode: InnovationPulseEpisode;
  recentEpisodes: InnovationPulseEpisode[];
}

export default function HomeEpisodePlayer({ latestEpisode, recentEpisodes }: HomeEpisodePlayerProps) {
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  // Current episode based on selection
  const currentEpisode = recentEpisodes[selectedEpisodeIndex] || latestEpisode;

  // "Also in this episode" data — uses currentEpisode
  const heroOtherStories = useMemo(() => {
    return currentEpisode?.quickHits?.slice(0, 3).map(hit => ({
      source: hit.source,
      tease: hit.title,
      headline: hit.title,
    })) || [];
  }, [currentEpisode]);

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
      {/* Hero player with episode artwork and controls — matches Innovation Pulse page */}
      <div className="animate-[fadeUp_0.7s_ease-out_both]">
        <HeroNowPlaying
          latestEpisode={currentEpisode}
          recentEpisodes={recentEpisodes}
          otherStories={heroOtherStories}
          showExtras={false}
          showHeader={false}
          selectedEpisodeIndex={selectedEpisodeIndex}
          onEpisodeChange={handleEpisodeChange}
          autoPlay={shouldAutoPlay}
        />
      </div>

      <div className="np-subscribe" style={{ marginTop: '24px', marginBottom: '8px' }}>
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

      {/* Recent Episodes grid — matches Innovation Pulse page */}
      {recentEpisodes && recentEpisodes.length > 1 && (
        <div className="ip-recent-strip">
          <div className="ip-recent-header">
            <div className="ip-recent-header-title">
              <span className="np-dot" />
              <h3>Recent Episodes</h3>
            </div>
            <Link href="/innovation-pulse/archive" className="ip-recent-all-btn">
              All Episodes
            </Link>
          </div>

          <div className="ip-recent-thumbs">
            {recentEpisodes.slice(1, 16).map((ep, idx) => {
              const epDate = new Date(ep.date + 'T12:00:00');
              const monthDay = epDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const actualIndex = idx + 1;
              const isSelected = selectedEpisodeIndex === actualIndex;

              return (
                <button
                  key={ep.date}
                  type="button"
                  onClick={() => handleRecentEpisodeClick(ep)}
                  className={`ip-recent-thumb ${isSelected ? 'ip-recent-thumb-active' : ''}`}
                >
                  <div className="ip-recent-thumb-img">
                    <div className="ip-recent-thumb-artwork">
                      <div className="ip-recent-thumb-accent" />
                      <img src="/images/ihe-logo.png" alt="" className="ip-recent-thumb-logo" aria-hidden="true" />
                      <img src="/images/mic03.webp" alt="" className="ip-recent-thumb-micimg" aria-hidden="true" />
                      <div className="ip-recent-thumb-title">{"The"}<br />{"Innovation"}<br />{"Pulse"}</div>
                    </div>
                    <div className="ip-recent-thumb-date">{monthDay.toUpperCase()}</div>
                    {isSelected && (
                      <div className="ip-recent-thumb-now">
                        <span className="ip-recent-thumb-now-dot" />
                        NOW
                      </div>
                    )}
                    {!isSelected && (
                      <div className="ip-recent-thumb-play">
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <polygon points="6,3 20,12 6,21" fill="white" fillOpacity="0.7" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ip-recent-thumb-side">
                    <div className="ip-recent-thumb-side-title">{ep.deepDive?.title || ''}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

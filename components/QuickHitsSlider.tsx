'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { generateSlug, mapToV4Category } from '@/lib/data/innovation-pulse-types';
import { getStoryImage, type HomepageStory } from '@/lib/homepagePulse';
import { pillColorsFor } from '@/lib/categoryPalette';
import styles from './QuickHitsSlider.module.css';

interface QuickHitsSliderProps {
  stories: HomepageStory[];
}

export default function QuickHitsSlider({ stories }: QuickHitsSliderProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const updateControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    // Browsers may restore a fractional scroll position a few pixels from an
    // edge. Treat that small range as the boundary so disabled states remain
    // accurate for keyboard and touch navigation.
    const edgeTolerance = 8;
    setCanGoBack(track.scrollLeft > edgeTolerance);
    setCanGoForward(track.scrollLeft + track.clientWidth < track.scrollWidth - edgeTolerance);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateControls();
    track.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls);

    const observer = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updateControls);
    observer?.observe(track);

    return () => {
      track.removeEventListener('scroll', updateControls);
      window.removeEventListener('resize', updateControls);
      observer?.disconnect();
    };
  }, [stories.length, updateControls]);

  const moveTrack = useCallback((direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollBy({
      left: direction * Math.max(track.clientWidth * 0.92, 1),
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, []);

  const handleTrackKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === 'ArrowLeft' && canGoBack) {
      event.preventDefault();
      moveTrack(-1);
    }
    if (event.key === 'ArrowRight' && canGoForward) {
      event.preventDefault();
      moveTrack(1);
    }
  };

  if (stories.length === 0) return null;

  return (
    <div className={styles.slider} aria-label="Quick reads">
      <div className={styles.controls} aria-label="Quick reads navigation">
        <button
          type="button"
          className={styles.arrow}
          onClick={() => moveTrack(-1)}
          disabled={!canGoBack}
          aria-label="Show previous quick reads"
          aria-controls="quick-hits-track"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => moveTrack(1)}
          disabled={!canGoForward}
          aria-label="Show more quick reads"
          aria-controls="quick-hits-track"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <ul
        id="quick-hits-track"
        ref={trackRef}
        className={styles.track}
        tabIndex={0}
        onKeyDown={handleTrackKeyDown}
        aria-label="This week's quick reads"
      >
        {stories.map((story) => {
          const category = mapToV4Category(story.category);
          const pill = pillColorsFor(category);
          const image = getStoryImage(story);

          return (
            <li key={`${story.date}-${story.sourceUrl || story.title}`} className={styles.item}>
              <Link
                href={`/innovation-pulse/story/${generateSlug(story.title)}`}
                className={styles.card}
                aria-label={`Read quick hit: ${story.title}`}
              >
                <div className={styles.imageFrame}>
                  {image ? (
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.imageFallback} aria-hidden="true">
                      <span>Quick read</span>
                    </div>
                  )}
                </div>
                <div className={styles.body}>
                  <h3 className={styles.title}>{story.title}</h3>
                  <div className={styles.category} style={{ color: pill.text }}>
                    <span className={styles.categoryDot} style={{ backgroundColor: pill.text }} aria-hidden="true" />
                    {category}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

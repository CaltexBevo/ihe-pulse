'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from 'react';
import { mapToV4Category } from '@/lib/data/innovation-pulse-types';
import {
  getHomepageStoryHref,
  getHomepageStoryImage,
  type HomepageStory,
} from '@/lib/homepagePulse';
import { pillColorsFor } from '@/lib/categoryPalette';
import styles from './QuickHitsSlider.module.css';

interface QuickHitsSliderProps {
  stories: HomepageStory[];
}

const ROTATION_DELAY_MS = 5000;

function visibleCountForViewport(): number {
  if (typeof window === 'undefined') return 3;
  if (window.innerWidth <= 680) return 1;
  if (window.innerWidth <= 1024) return 2;
  return 3;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function QuickHitsSlider({ stories }: QuickHitsSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const currentIndexRef = useRef(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const maxIndex = Math.max(0, stories.length - visibleCount);
  const boundedCurrentIndex = clamp(currentIndex, 0, maxIndex);
  const canGoBack = boundedCurrentIndex > 0;
  const canGoForward = boundedCurrentIndex < maxIndex;
  const automaticPaused =
    manualPaused || pointerPaused || focusPaused || pageHidden || reducedMotion || !isInView;

  useEffect(() => {
    const updateViewport = () => setVisibleCount(visibleCountForViewport());
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    const updateVisibility = () => setPageHidden(document.visibilityState === 'hidden');

    updateMotionPreference();
    updateVisibility();
    mediaQuery.addEventListener?.('change', updateMotionPreference);
    document.addEventListener('visibilitychange', updateVisibility);

    return () => {
      mediaQuery.removeEventListener?.('change', updateMotionPreference);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    if (typeof IntersectionObserver === 'undefined') {
      const frame = window.requestAnimationFrame(() => setIsInView(true));
      return () => window.cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.15 },
    );
    observer.observe(slider);
    return () => observer.disconnect();
  }, []);

  const scrollToIndex = useCallback((nextIndex: number) => {
    const track = trackRef.current;
    const item = track?.children[nextIndex] as HTMLElement | undefined;
    if (!track || !item) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const left = item.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({
      left,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
    setCurrentIndex(nextIndex);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      scrollToIndex(clamp(currentIndexRef.current, 0, maxIndex));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [visibleCount, maxIndex, scrollToIndex]);

  const moveTrack = useCallback(
    (direction: -1 | 1) => {
      const nextIndex = clamp(boundedCurrentIndex + direction, 0, maxIndex);
      if (nextIndex === boundedCurrentIndex) return;
      scrollToIndex(nextIndex);
    },
    [boundedCurrentIndex, maxIndex, scrollToIndex],
  );

  useEffect(() => {
    if (automaticPaused || !canGoForward) return;

    const timeout = window.setTimeout(() => moveTrack(1), ROTATION_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [automaticPaused, canGoForward, moveTrack]);

  const updateIndexFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return;

    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;
    Array.from(track.children).forEach((child, index) => {
      const item = child as HTMLElement;
      const itemLeft = item.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
      const distance = Math.abs(itemLeft - track.scrollLeft);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    setCurrentIndex(clamp(nearestIndex, 0, maxIndex));
  }, [maxIndex]);

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

  const handleFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) setFocusPaused(true);
  };

  const handleBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setFocusPaused(false);
    }
  };

  if (stories.length === 0) return null;

  const rangeEnd = Math.min(boundedCurrentIndex + visibleCount, stories.length);

  return (
    <div
      ref={sliderRef}
      className={styles.slider}
      aria-label="Innovation Pulse stories"
      onMouseEnter={() => setPointerPaused(true)}
      onMouseLeave={() => setPointerPaused(false)}
      onFocusCapture={handleFocusCapture}
      onBlurCapture={handleBlurCapture}
      data-carousel-paused={automaticPaused ? 'true' : 'false'}
    >
      <div className={styles.controls} aria-label="Innovation Pulse story navigation">
        <button
          type="button"
          className={styles.arrow}
          onClick={() => moveTrack(-1)}
          disabled={!canGoBack}
          aria-label="Show previous stories"
          aria-controls="innovation-pulse-stories-track"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          className={styles.pauseButton}
          onClick={() => {
            setManualPaused((paused) => !paused);
          }}
          aria-pressed={manualPaused}
          aria-label={manualPaused ? 'Resume automatic story rotation' : 'Pause automatic story rotation'}
          aria-controls="innovation-pulse-stories-track"
        >
          <span aria-hidden="true">{manualPaused ? '▶' : 'Ⅱ'}</span>
          <span className={styles.controlText}>{manualPaused ? 'Resume' : 'Pause'}</span>
        </button>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => moveTrack(1)}
          disabled={!canGoForward}
          aria-label="Show next stories"
          aria-controls="innovation-pulse-stories-track"
        >
          <span aria-hidden="true">→</span>
        </button>
        <span className={styles.range} aria-live={automaticPaused ? 'polite' : 'off'}>
          {boundedCurrentIndex + 1}–{rangeEnd} of {stories.length}
        </span>
      </div>

      <ul
        id="innovation-pulse-stories-track"
        ref={trackRef}
        className={styles.track}
        tabIndex={0}
        onKeyDown={handleTrackKeyDown}
        onScroll={updateIndexFromScroll}
        aria-label="This week's Innovation Pulse stories"
        aria-roledescription="carousel"
      >
        {stories.map((story, index) => {
          const category = story.category === 'Tool Spotlight'
            ? story.category
            : mapToV4Category(story.category);
          const pill = story.feature ? { text: 'var(--amber)' } : pillColorsFor(category);
          const image = getHomepageStoryImage(story);
          const href = getHomepageStoryHref(story);

          return (
            <li
              key={`${story.date}-${story.sourceUrl || story.title}`}
              className={styles.item}
              aria-label={`${index + 1} of ${stories.length}`}
            >
              <Link
                href={href}
                className={styles.card}
                aria-label={`${story.feature ? 'Read original feature' : 'Read story'}: ${story.title}`}
                data-story-index={index}
                data-story-feature={story.feature ? 'true' : 'false'}
              >
                <div className={styles.imageFrame}>
                  {image ? (
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(max-width: 680px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.imageFallback} aria-hidden="true">
                      <span>Innovation Pulse story</span>
                    </div>
                  )}
                </div>
                <div className={styles.body}>
                  <h3 className={styles.title}>{story.title}</h3>
                  <div className={styles.category} style={{ color: pill.text }}>
                    <span className={styles.categoryDot} style={{ backgroundColor: pill.text }} aria-hidden="true" />
                    {story.feature ? 'Original Feature' : category}
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

'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { generateSlug, mapToV4Category, formatPulseDate } from '@/lib/data/innovation-pulse-types';
import { pillColorsFor } from '@/lib/categoryPalette';

interface Story {
  title: string;
  summary: string;
  category: string;
  source?: string;
  sourceUrl?: string;
  date?: string;
  image?: string;
  type?: 'deepDive' | 'quickHit';
  isLead?: boolean;
}

interface TopStoriesSliderProps {
  stories: Story[];
}

export default function TopStoriesSlider({ stories }: TopStoriesSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Navigation arrows - hidden on mobile */}
      <button
        onClick={scrollLeft}
        className="slider-arrow prev"
        aria-label="Scroll left"
      >
        <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={scrollRight}
        className="slider-arrow next"
        aria-label="Scroll right"
      >
        <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slider container */}
      <div
        ref={sliderRef}
        className="top-stories-slider"
        role="region"
        aria-label="Top stories carousel"
      >
        {stories.map((story, i) => {
          const v4Category = mapToV4Category(story.category);
          // Use palette-locked colors instead of data-driven V4_CATEGORY_COLORS
          const pill = pillColorsFor(v4Category);
          const isLead = story.type === 'deepDive' || story.isLead;
          const slug = generateSlug(story.title);

          return (
            <Link
              key={i}
              href={`/innovation-pulse/story/${slug}`}
              className={`slider-card ${isLead ? 'lead' : ''} block group`}
            >
              {/* Image */}
              {story.image && (
                <div className="relative h-[160px] overflow-hidden bg-[var(--surface)]">
                  <Image
                    src={story.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="360px"
                  />
                  {/* Badge overlay - Lead Story uses magenta, others use pill color */}
                  <span
                    className="absolute top-3 left-3 font-mono text-[0.5rem] font-semibold tracking-[0.06em] uppercase px-2 py-1 rounded"
                    style={{
                      background: isLead ? 'rgba(176,64,168,0.9)' : pill.bg,
                      color: isLead ? 'white' : pill.text
                    }}
                  >
                    {isLead ? 'Lead Story' : 'Story'}
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="p-4">
                {/* Category label */}
                <div
                  className="font-mono text-[0.55rem] font-semibold tracking-[0.1em] uppercase mb-2 flex items-center gap-1.5"
                  style={{ color: pill.text }}
                >
                  <span
                    className="w-[5px] h-[5px] rounded-full"
                    style={{ background: pill.text }}
                  />
                  {v4Category}
                </div>

                {/* Title */}
                <h3 className="font-sans text-[0.95rem] font-bold leading-[1.25] mb-2 line-clamp-2 group-hover:text-[var(--cyan)] transition-colors">
                  {story.title}
                </h3>

                {/* Summary */}
                <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.5] line-clamp-2 mb-3">
                  {story.summary}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between font-mono text-[0.55rem] text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                  <span>{story.source || 'Innovation Pulse'}</span>
                  {story.date && (
                    <span>{formatPulseDate(story.date)}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

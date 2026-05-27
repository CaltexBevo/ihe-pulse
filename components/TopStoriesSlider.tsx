'use client';

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
  if (!stories || stories.length === 0) {
    return null;
  }

  return (
    <div className="grid-3">
      {stories.slice(0, 3).map((story, i) => {
        const v4Category = mapToV4Category(story.category);
        // Use palette-locked colors instead of data-driven V4_CATEGORY_COLORS
        const pill = pillColorsFor(v4Category);
        const isLead = story.type === 'deepDive' || story.isLead;
        const slug = generateSlug(story.title);

        return (
          <Link
            key={i}
            href={`/innovation-pulse/story/${slug}`}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block group"
          >
            {/* Image - 3:2 aspect ratio to match 1536x1024 source images */}
            {story.image && (
              <div className="relative aspect-[3/2] overflow-hidden bg-[var(--surface)]">
                <Image
                  src={story.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
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
  );
}

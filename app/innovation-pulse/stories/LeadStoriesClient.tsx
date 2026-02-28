'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatShortDate } from '@/lib/data/innovation-pulse-types';

interface LeadStory {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: string;
  categoryColor: string;
  date: string;
  editorialLens: string;
  editorialCallout?: string;
  slug: string;
  imageUrl: string;
}

interface LeadStoriesClientProps {
  stories: LeadStory[];
}

export default function LeadStoriesClient({ stories }: LeadStoriesClientProps) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {stories.map((story) => {
        const isExpanded = expandedSlug === story.slug;

        return (
          <div
            key={story.slug}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] overflow-hidden hover:border-[var(--border-hover)] transition-colors"
          >
            <div className="grid md:grid-cols-[200px_1fr] gap-0">
              {/* Thumbnail */}
              <div className="relative aspect-[16/9] md:aspect-auto md:h-full overflow-hidden bg-[var(--surface-1)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={story.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                    {formatShortDate(story.date)}
                  </span>
                  <span
                    className="font-mono text-[0.55rem] font-semibold px-[0.5rem] py-[0.12rem] rounded-[4px] text-white uppercase"
                    style={{ backgroundColor: story.categoryColor }}
                  >
                    {story.category}
                  </span>
                  <span className="font-mono text-[0.55rem] px-[0.5rem] py-[0.12rem] rounded-[4px] bg-[var(--magenta-dim)] text-[var(--magenta)]">
                    {story.editorialLens}
                  </span>
                </div>

                <h3 className="text-[1rem] font-bold leading-[1.3] mb-2">{story.title}</h3>

                <p className={`text-[0.85rem] text-[var(--text-secondary)] leading-[1.6] ${isExpanded ? "" : "line-clamp-2"}`}>
                  {story.summary}
                </p>

                {/* Expanded Content */}
                {isExpanded && story.editorialCallout && (
                  <div className="mt-4 pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[0.62rem] tracking-[0.08em] uppercase font-semibold text-[var(--magenta)]">
                        Our Take
                      </span>
                    </div>
                    <p className="text-[0.9rem] text-[var(--text)] leading-[1.65] italic">
                      {story.editorialCallout}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <button
                    onClick={() => setExpandedSlug(isExpanded ? null : story.slug)}
                    className="font-mono text-[0.68rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors"
                  >
                    {isExpanded ? "Show less ↑" : "Expand ↓"}
                  </button>
                  <Link
                    href={`/innovation-pulse/story/${story.slug}`}
                    className="font-mono text-[0.68rem] text-[var(--text-secondary)] hover:text-[var(--cyan)] transition-colors"
                  >
                    Full story →
                  </Link>
                  <a
                    href={story.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.68rem] text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors ml-auto"
                  >
                    {story.source} ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
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
  const [query, setQuery] = useState('');

  const filteredStories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stories;
    return stories.filter((story) =>
      [story.title, story.summary, story.source, story.category, story.editorialLens]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [stories, query]);

  return (
    <div>
      {/* Search (UX audit, item c4) */}
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-[8px] px-3 py-2 focus-within:border-[var(--border-hover)] transition-colors">
          <svg
            className="w-[14px] h-[14px] stroke-[var(--text-muted)]"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lead stories..."
            aria-label="Search lead stories"
            className="bg-transparent border-none outline-none text-[0.8rem] text-[var(--text)] placeholder:text-[var(--text-muted)] w-[220px]"
          />
        </div>
        {query.trim() !== '' && (
          <span className="font-mono text-[0.68rem] text-[var(--text-muted)]" aria-live="polite">
            {filteredStories.length} {filteredStories.length === 1 ? 'story matches' : 'stories match'}
          </span>
        )}
      </div>

      {filteredStories.length === 0 && (
        <div className="text-center py-10">
          <p className="text-[var(--text-muted)]">No stories match &ldquo;{query.trim()}&rdquo;.</p>
        </div>
      )}

      <div className="space-y-4">
      {filteredStories.map((story) => {
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
    </div>
  );
}

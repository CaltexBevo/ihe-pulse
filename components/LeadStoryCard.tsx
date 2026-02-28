'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';

interface LeadStoryCardProps {
  episode: InnovationPulseEpisode;
  imageUrl: string;
  v4Category: string;
  categoryColor: string;
}

// Helper to render text with paragraph breaks
function renderParagraphs(text: string): React.ReactNode {
  if (!text) return null;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  if (paragraphs.length <= 1) {
    return <p>{text}</p>;
  }
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className={i > 0 ? "mt-4" : ""}>{para.trim()}</p>
      ))}
    </>
  );
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

export default function LeadStoryCard({ episode, imageUrl, v4Category, categoryColor }: LeadStoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const leadStory = episode.deepDive;

  // Split editorial take into preview and full
  const fullText = leadStory.summary || '';
  const sentences = fullText.split(/(?<=[.!?])\s+/);
  const previewText = sentences.slice(0, 3).join(' ');
  const hasMore = sentences.length > 3;

  return (
    <div className="mb-10">
      {/* Lead Story Card - Image Left, Content Right */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] overflow-hidden">
        <div className="grid lg:grid-cols-[40%_60%]">
          {/* Image Side - Portrait on Desktop */}
          <div className="relative aspect-[16/9] lg:aspect-[3/4] overflow-hidden bg-[var(--surface-1)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,15,0.4)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[rgba(10,10,15,0.3)]" />

            {/* Badges - Mobile Only */}
            <div className="lg:hidden absolute top-4 left-4 flex gap-2">
              <span className="font-mono text-[0.6rem] font-semibold tracking-[0.05em] px-[0.6rem] py-[0.25rem] rounded-[6px] bg-[var(--magenta)] text-white uppercase">
                Lead Story
              </span>
              <span
                className="font-mono text-[0.6rem] font-semibold tracking-[0.05em] px-[0.6rem] py-[0.25rem] rounded-[6px] text-white uppercase"
                style={{ backgroundColor: categoryColor }}
              >
                {v4Category}
              </span>
            </div>
          </div>

          {/* Content Side */}
          <div className="p-6 lg:p-8 flex flex-col">
            {/* Badges - Desktop */}
            <div className="hidden lg:flex gap-2 mb-4">
              <span className="font-mono text-[0.62rem] font-semibold tracking-[0.06em] px-[0.65rem] py-[0.25rem] rounded-[6px] bg-[var(--magenta)] text-white uppercase">
                Lead Story
              </span>
              <span
                className="font-mono text-[0.62rem] font-semibold tracking-[0.06em] px-[0.65rem] py-[0.25rem] rounded-[6px] text-white uppercase"
                style={{ backgroundColor: categoryColor }}
              >
                {v4Category}
              </span>
            </div>

            {/* Headline */}
            <h2
              className="text-[clamp(1.25rem,3vw,1.75rem)] font-bold leading-[1.2] mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {leadStory.title}
            </h2>

            {/* Editorial Take */}
            <div className="text-[0.9rem] text-[var(--text-secondary)] leading-[1.7] mb-4">
              {isExpanded ? renderParagraphs(fullText) : <p>{previewText}</p>}
            </div>

            {/* Read More Toggle */}
            {hasMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="font-mono text-[0.72rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors mb-4 self-start flex items-center gap-1"
              >
                {isExpanded ? 'Show less' : 'Read more'}
                <svg
                  viewBox="0 0 24 24"
                  className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            )}

            {/* Source Link */}
            <div className="flex flex-wrap items-center gap-3 mt-auto pt-4 border-t border-[var(--border)]">
              <Link
                href={`/innovation-pulse/story/${generateSlug(leadStory.title)}`}
                className="btn-primary text-[0.75rem]"
              >
                Full story →
              </Link>
              <a
                href={leadStory.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[0.75rem] text-[var(--cyan)] font-mono hover:text-[var(--text)] transition-colors"
              >
                {leadStory.source}
                <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* OUR TAKE Section - Always Visible Below Card */}
      {leadStory.editorialCallout && (
        <div className="mt-5 bg-[var(--surface-1)] border border-[var(--border)] rounded-[16px] p-6 relative overflow-hidden">
          {/* Accent border */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--magenta)] to-[var(--cyan)]" />

          <div className="pl-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase font-semibold text-[var(--magenta)]">
                Our Take
              </span>
              <span className="font-mono text-[0.6rem] tracking-[0.06em] px-[0.55rem] py-[0.18rem] rounded-[4px] bg-[var(--magenta-dim)] text-[var(--magenta)]">
                {episode.editorialLens}
              </span>
            </div>
            <div className="text-[1rem] text-[var(--text)] leading-[1.7] italic">
              {renderParagraphs(leadStory.editorialCallout)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

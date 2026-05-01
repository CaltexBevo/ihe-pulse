import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Card from "@/components/Card";
import EpisodeAudioPlayer from "@/components/EpisodeAudioPlayer";
import {
  getAllEpisodes,
  getEpisodeByDate,
  getEpisodeDates,
  formatPulseDate,
  formatShortDate,
  mapToV4Category,
  V4_CATEGORY_COLORS,
} from "@/lib/data/innovation-pulse";

// ISR: Revalidate every 60 seconds so new episodes appear quickly
export const revalidate = 60;

// Allow dynamic params for episodes added after build
export const dynamicParams = true;

// Static Params
export function generateStaticParams() {
  const dates = getEpisodeDates();
  return dates.map((date) => ({ date }));
}

// Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const episode = getEpisodeByDate(date);
  if (!episode) {
    return { title: "Briefing Not Found | Innovation Pulse" };
  }
  return {
    title: `${formatPulseDate(date)} | Innovation Pulse`,
    description: episode.editorialHook,
  };
}

// Default fallback images
const DEFAULT_LEAD_IMAGE = "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1400&h=600&fit=crop";
const DEFAULT_STORY_IMAGE = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&h=300&fit=crop";

// Related story placeholder images (for static placeholder content)
const relatedImages = [
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&h=280&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=280&fit=crop",
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=500&h=280&fit=crop",
];

// Page Component
export default async function InnovationPulseDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const episode = getEpisodeByDate(date);

  if (!episode) {
    notFound();
  }

  const allEpisodes = getAllEpisodes();
  const currentIndex = allEpisodes.findIndex((ep) => ep.date === date);
  const prevEpisode = allEpisodes[currentIndex + 1];
  const nextEpisode = allEpisodes[currentIndex - 1];

  return (
    <div className="min-h-screen">
      {/* ═══════════════════════════════════════════════════════
          BREADCRUMB BAR
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-[var(--px)] py-4 border-b border-[var(--border)] flex items-center justify-between">
        <Link
          href="/innovation-pulse"
          className="font-mono text-[0.72rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors flex items-center gap-2"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[14px] h-[14px]">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Innovation Pulse
        </Link>
        <span className="font-mono text-[0.68rem] text-[var(--text-muted)]">
          {formatPulseDate(date)}
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════
          FULL-WIDTH HERO IMAGE
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto relative overflow-hidden h-[420px]">
        <Image
          src={episode.deepDive.image || DEFAULT_LEAD_IMAGE}
          alt="Story hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[rgba(8,8,15,0.3)] to-[rgba(8,8,15,0.1)]" />
        {/* Badges */}
        <div className="absolute top-6 left-6 flex gap-2">
          <span className="font-mono text-[0.65rem] font-semibold tracking-[0.05em] px-3 py-[0.3rem] rounded-[6px] bg-[rgba(0,212,255,0.85)] text-[#08080f]">
            LEAD STORY
          </span>
          <span className="font-mono text-[0.65rem] font-semibold tracking-[0.05em] px-3 py-[0.3rem] rounded-[6px] bg-[rgba(255,255,255,0.12)] text-[var(--text)] backdrop-blur-[8px]">
            {episode.deepDive.category}
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          ARTICLE CONTENT
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[820px] mx-auto px-[var(--px)] -mt-12 relative z-10">
        {/* Meta Badges */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span
            className="font-mono text-[0.6rem] font-semibold tracking-[0.06em] uppercase px-[0.6rem] py-[0.2rem] rounded-[5px]"
            style={{
              backgroundColor: `${V4_CATEGORY_COLORS[mapToV4Category(episode.deepDive.category)]}20`,
              color: V4_CATEGORY_COLORS[mapToV4Category(episode.deepDive.category)],
            }}
          >
            {mapToV4Category(episode.deepDive.category)}
          </span>
          <span className="font-mono text-[0.7rem] text-[var(--text-muted)]">
            {formatShortDate(date)}
          </span>
          <span className="font-mono text-[0.68rem] text-[var(--text-muted)]">
            · 6 min read
          </span>
        </div>

        {/* Title - DM Sans Bold */}
        <h1 className="font-sans text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold leading-[1.15] mb-4 tracking-[-0.02em]">
          {episode.deepDive.title}
        </h1>

        {/* Subtitle */}
        <p className="text-[1.15rem] text-[var(--text-secondary)] leading-[1.55] mb-8 font-normal">
          {episode.deepDive.summary}
        </p>

        {/* Audio Player with autoplay support */}
        <Suspense fallback={
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-4 mb-10 flex items-center gap-3">
            <div className="flex items-center gap-[0.35rem] text-[0.65rem] font-semibold text-[var(--text-muted)] font-mono tracking-[0.06em]">
              <span className="w-[5px] h-[5px] rounded-full bg-[var(--text-muted)]" />
              LOADING
            </div>
            <div className="w-9 h-9 rounded-full bg-[var(--surface-2)]" />
            <div className="flex-1 h-1 bg-[var(--surface-2)] rounded-[2px]" />
          </div>
        }>
          <EpisodeAudioPlayer
            audioUrl={episode.audioUrl || ''}
            audioDuration={episode.audioDuration || '0:00'}
          />
        </Suspense>

        {/* Article Body */}
        <article className="mb-10 space-y-6">
          {/* Full editorial content - split into paragraphs */}
          {episode.deepDive.summary.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="text-[1.05rem] text-[var(--text-secondary)] leading-[1.8]">
              {paragraph}
            </p>
          ))}

          {/* Pull Quote - only show if we have one */}
          {episode.editorialHook && (
            <blockquote className="text-[1.2rem] font-semibold italic text-[var(--text)] leading-[1.5] py-6 pl-6 border-l-[3px] border-[var(--cyan)] my-8">
              &ldquo;{episode.editorialHook}&rdquo;
            </blockquote>
          )}
        </article>

        {/* Source Attribution */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 flex items-center justify-between mb-10">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[0.6rem] text-[var(--text-muted)] tracking-[0.08em] uppercase">Original reporting</span>
            <span className="text-[0.9rem] font-semibold">{episode.deepDive.source}</span>
          </div>
          <a
            href={episode.deepDive.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-[var(--cyan)] px-4 py-2 rounded-[8px] bg-[var(--cyan-dim)] hover:bg-[rgba(0,212,255,0.2)] transition-colors"
          >
            Read original article
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          EDITORIAL TAKE CARD (only renders if content exists)
          ═══════════════════════════════════════════════════════ */}
      {(episode.deepDive.editorialCallout || episode.closingThought) && (
        <div className="max-w-[820px] mx-auto px-[var(--px)] pb-10">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--magenta)] to-[var(--cyan)]" />
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-[0.62rem] font-semibold tracking-[0.06em] uppercase text-[var(--magenta)]">
                OUR TAKE
              </span>
            </div>
            <div className="space-y-4">
              {episode.deepDive.editorialCallout && (
                <p className="text-[1rem] text-[var(--text)] leading-[1.75] italic">
                  {episode.deepDive.editorialCallout}
                </p>
              )}
              {episode.closingThought && !episode.deepDive.editorialCallout && (
                <p className="text-[1rem] text-[var(--text)] leading-[1.75] italic">
                  {episode.closingThought}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 mt-6 pt-4 border-t border-[var(--border)] text-[0.82rem] text-[var(--text-secondary)]">
              <strong className="text-[var(--text)]">The Innovation Pulse</strong>
              <span>·</span>
              <span>Innovating Higher Ed</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SHARE BAR
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[820px] mx-auto px-[var(--px)] pb-10 flex items-center gap-3">
        <span className="font-mono text-[0.65rem] text-[var(--text-muted)] tracking-[0.08em] uppercase">Share</span>
        {["link", "x", "linkedin", "email"].map((type) => (
          <button
            key={type}
            className="w-[38px] h-[38px] rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-dim)] transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              {type === "link" && (
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
              )}
              {type === "x" && (
                <path d="M4 4l6.5 8L4 20h2l5.5-6.5L16 20h4l-6.8-8.5L19.5 4H18l-5 6L9 4H4z" />
              )}
              {type === "linkedin" && (
                <>
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </>
              )}
              {type === "email" && (
                <>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" strokeWidth="2" />
                </>
              )}
            </svg>
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          ALSO TODAY - QUICK HITS
          ═══════════════════════════════════════════════════════ */}
      {episode.quickHits.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-[var(--px)] py-10 border-t border-[var(--border)]">
          <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-6">
            Also Today
          </div>

          <div className="grid-3">
            {episode.quickHits.map((hit, i) => (
              <Card
                key={i}
                title={hit.title}
                teaser={hit.summary}
                fullContent={hit.summary}
                category={mapToV4Category(hit.category)}
                categoryColor={V4_CATEGORY_COLORS[mapToV4Category(hit.category)]}
                source={hit.source}
                date={formatShortDate(episode.date)}
                imageUrl={hit.image || DEFAULT_STORY_IMAGE}
                badgeText="Story"
                badgeColor="rgba(200,80,192,0.85)"
                expandable={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          RELATED STORIES
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[1200px] mx-auto px-[var(--px)] py-10 border-t border-[var(--border)]">
        <div className="flex items-center justify-between mb-6">
          <span className="font-sans text-[1.2rem] font-bold">Related Stories</span>
          <Link
            href="/innovation-pulse"
            className="font-mono text-[0.68rem] text-[var(--cyan)] tracking-[0.06em] hover:text-[var(--text)] transition-colors"
          >
            Back to all stories &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { title: "How Georgia State Used AI Chatbots to Cut Summer Melt by 22%", source: "EDUCAUSE Review", cat: "Case Studies", date: "Feb 17" },
            { title: "AI Tutors Most Effective for First-Gen Students", source: "Journal of Higher Ed", cat: "Research & Innovation", date: "Feb 15" },
            { title: "Community College Consortium Open-Sources AI Advising System", source: "CC Daily", cat: "Case Studies", date: "Feb 12" },
          ].map((story, i) => (
            <div
              key={i}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)]"
            >
              <div className="relative h-[140px] overflow-hidden">
                <Image
                  src={relatedImages[i]}
                  alt={story.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 pt-3">
                <div className="font-mono text-[0.55rem] font-semibold tracking-[0.08em] uppercase mb-2 flex items-center gap-[0.35rem]">
                  <span className="w-[4px] h-[4px] rounded-full bg-[var(--cyan)]" />
                  <span className="text-[var(--cyan)]">{story.cat}</span>
                </div>
                <h3 className="font-sans text-[0.92rem] font-bold leading-[1.25] mb-3">
                  {story.title}
                </h3>
                <div className="flex justify-between font-mono text-[0.58rem] text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
                  <span className="text-[var(--cyan)]">{story.source}</span>
                  <span>{story.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          EPISODE NAVIGATION
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[820px] mx-auto px-[var(--px)] py-10">
        <div className="grid grid-cols-2 gap-4">
          {prevEpisode ? (
            <Link
              href={`/innovation-pulse/${prevEpisode.date}`}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 hover:border-[var(--border-hover)] transition-all block"
            >
              <div className="font-mono text-[0.6rem] text-[var(--text-muted)] tracking-[0.08em] uppercase mb-2">
                &larr; Previous story
              </div>
              <div className="text-[0.9rem] font-semibold leading-[1.3]">
                {prevEpisode.deepDive.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextEpisode ? (
            <Link
              href={`/innovation-pulse/${nextEpisode.date}`}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 hover:border-[var(--border-hover)] transition-all block text-right"
            >
              <div className="font-mono text-[0.6rem] text-[var(--text-muted)] tracking-[0.08em] uppercase mb-2">
                Next story &rarr;
              </div>
              <div className="text-[0.9rem] font-semibold leading-[1.3]">
                {nextEpisode.deepDive.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* AI Voice Disclaimer */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12 text-center">
        <p className="text-[0.68rem] text-[var(--text-muted)] italic">
          The Innovation Pulse is produced using A.I. voice technology with
          editorial oversight by the Innovating Higher Ed team.
        </p>
      </div>
    </div>
  );
}

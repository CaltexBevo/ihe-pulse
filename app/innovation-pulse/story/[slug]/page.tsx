import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getStoryBySlug,
  getRelatedStories,
  getAllStorySlugs,
  formatPulseDate,
  formatShortDate,
  generateSlug,
} from "@/lib/data/innovation-pulse";
import StoryPageClient from "./StoryPageClient";

// V4 Category colors and slugs — palette-locked (no green, teal, coral, blue)
const V4_CATEGORY_CONFIG: Record<string, { color: string; slug: string }> = {
  "Insights & Trends": { color: "var(--cyan)", slug: "insights-and-trends" },
  "Case Study": { color: "var(--purple)", slug: "case-study" },
  "Practical Tips": { color: "var(--cyan)", slug: "practical-tips" },
  "Ethical AI": { color: "var(--amber)", slug: "ethical-ai" },
  "Latest AI Products": { color: "var(--purple)", slug: "latest-ai-products" },
  "Beyond Ed": { color: "var(--cyan)", slug: "beyond-ed" },
  "Week in Review": { color: "var(--magenta)", slug: "week-in-review" },
  // Old categories mapping
  "Research & Innovation": { color: "var(--cyan)", slug: "insights-and-trends" },
  "Infrastructure & Operations": { color: "var(--purple)", slug: "case-study" },
  "Teaching & Learning": { color: "var(--cyan)", slug: "practical-tips" },
  "Policy & Ethics": { color: "var(--amber)", slug: "ethical-ai" },
  "Tools & Products": { color: "var(--purple)", slug: "latest-ai-products" },
  "Student Experience": { color: "var(--cyan)", slug: "beyond-ed" },
  "Leadership & Strategy": { color: "var(--cyan)", slug: "insights-and-trends" },
};

// Map old categories to V4
const OLD_TO_V4: Record<string, string> = {
  "Research & Innovation": "Insights & Trends",
  "Infrastructure & Operations": "Case Study",
  "Teaching & Learning": "Practical Tips",
  "Policy & Ethics": "Ethical AI",
  "Tools & Products": "Latest AI Products",
  "Student Experience": "Beyond Ed",
  "Leadership & Strategy": "Insights & Trends",
};

function mapToV4Category(category: string): string {
  return OLD_TO_V4[category] || category;
}

// Default fallback image if story doesn't have one
const DEFAULT_STORY_IMAGE = "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1400&h=600&fit=crop";

export async function generateStaticParams() {
  const slugs = getAllStorySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);
  if (!story) {
    return { title: "Story Not Found | Innovation Pulse" };
  }
  return {
    title: `${story.title} | Innovation Pulse`,
    description: story.summary,
  };
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStoryBySlug(slug);

  if (!story) {
    notFound();
  }

  const relatedStories = getRelatedStories(slug, story.category, 3);
  const v4Category = mapToV4Category(story.category);
  const categoryConfig = V4_CATEGORY_CONFIG[story.category] || V4_CATEGORY_CONFIG["Insights & Trends"];
  // Use pre-assigned image from story data, or fall back to default
  const storyImage = story.image || DEFAULT_STORY_IMAGE;

  return (
    <div className="min-h-screen">
      {/* Back Bar */}
      <div className="max-w-[1200px] mx-auto px-[var(--px)] py-3 flex items-center gap-4 border-b border-[var(--border)]">
        <Link
          href="/innovation-pulse"
          className="font-mono text-[0.72rem] text-[var(--cyan)] flex items-center gap-2 hover:text-[var(--text)] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Innovation Pulse
        </Link>
        <span className="font-mono text-[0.68rem] text-[var(--text-muted)] ml-auto">
          {formatPulseDate(story.episodeDate)}
        </span>
      </div>

      {/* Hero Image */}
      <div className="max-w-[1200px] mx-auto relative h-[420px] overflow-hidden">
        <Image
          src={storyImage}
          alt={story.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[rgba(8,8,15,0.3)] to-[rgba(8,8,15,0.1)]" />
        {/* Badges */}
        <div className="absolute top-6 left-6 flex gap-2">
          {story.type === "deepDive" && (
            <span className="font-mono text-[0.65rem] font-semibold tracking-[0.05em] px-3 py-1 rounded-[6px] bg-[rgba(0,212,255,0.85)] text-[#08080f]">
              LEAD STORY
            </span>
          )}
          <span
            className="font-mono text-[0.65rem] font-semibold tracking-[0.05em] px-3 py-1 rounded-[6px] text-[#08080f]"
            style={{ backgroundColor: categoryConfig.color }}
          >
            {v4Category}
          </span>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-[820px] mx-auto px-[var(--px)] -mt-12 relative z-10">
        {/* Meta */}
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <Link
            href={`/innovation-pulse/category/${categoryConfig.slug}`}
            className="font-mono text-[0.6rem] font-semibold tracking-[0.06em] uppercase px-2 py-1 rounded-[5px]"
            style={{ backgroundColor: `${categoryConfig.color}20`, color: categoryConfig.color }}
          >
            {v4Category}
          </Link>
          <span className="font-mono text-[0.6rem] font-semibold tracking-[0.06em] uppercase px-2 py-1 rounded-[5px] bg-[var(--magenta-dim)] text-[var(--magenta)]">
            {story.editorialLens}
          </span>
          <span className="font-mono text-[0.7rem] text-[var(--text-muted)]">
            {formatShortDate(story.episodeDate)}
          </span>
          <span className="font-mono text-[0.68rem] text-[var(--text-muted)]">
            · {Math.ceil(story.summary.length / 200)} min read
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[clamp(1.8rem,4vw,2.6rem)] font-bold leading-[1.15] mb-4 tracking-[-0.02em]">
          {story.title}
        </h1>

        {/* Subtitle/Hook */}
        <p className="text-[1.15rem] text-[var(--text-secondary)] leading-[1.55] mb-8">
          {story.summary.split('.').slice(0, 2).join('.')}...
        </p>

        {/* Story Audio Clip (if lead story) */}
        {story.type === "deepDive" && story.audioUrl && (
          <StoryPageClient audioUrl={story.audioUrl} />
        )}

        {/* Article Body */}
        <div className="prose prose-invert max-w-none mb-8">
          <p className="text-[1.05rem] leading-[1.8] text-[var(--text-secondary)] mb-6">
            {story.summary}
          </p>

          {/* Pull quote for lead stories */}
          {story.type === "deepDive" && story.editorialCallout && (
            <blockquote className="text-[1.2rem] font-semibold italic text-[var(--text)] leading-[1.5] py-6 pl-6 border-l-[3px] border-[var(--magenta)] my-8">
              {story.editorialCallout.split('.').slice(0, 2).join('.')}...
            </blockquote>
          )}

          {/* Full content for lead stories */}
          {story.fullText && story.fullText !== story.summary && (
            <p className="text-[1.05rem] leading-[1.8] text-[var(--text-secondary)] mb-6">
              {story.fullText}
            </p>
          )}
        </div>

        {/* Source Block */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 flex items-center justify-between mb-8">
          <div>
            <span className="font-mono text-[0.6rem] text-[var(--text-muted)] tracking-[0.08em] uppercase block mb-1">
              Original reporting
            </span>
            <span className="text-[0.9rem] font-semibold">{story.source}</span>
          </div>
          <a
            href={story.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-[var(--cyan)] px-3 py-2 rounded-[8px] bg-[var(--cyan-dim)] hover:bg-[rgba(0,212,255,0.2)] transition-colors"
          >
            Read original article
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-none stroke-current" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        {/* Our Take Section (for lead stories) */}
        {story.type === "deepDive" && story.editorialTake && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 relative overflow-hidden mb-8">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--magenta)] to-[var(--cyan)]" />
            <div className="flex items-center gap-2 mb-4">
              <span className="font-mono text-[0.62rem] font-semibold tracking-[0.06em] uppercase text-[var(--magenta)]">
                OUR TAKE
              </span>
              <span className="font-mono text-[0.62rem] text-[var(--text-muted)] tracking-[0.04em]">
                — {story.editorialLens}
              </span>
            </div>
            <div className="text-[1rem] leading-[1.75] text-[var(--text)] italic space-y-4">
              <p>{story.editorialTake}</p>
            </div>
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-[var(--border)] text-[0.82rem] text-[var(--text-secondary)]">
              <strong className="text-[var(--text)]">The Innovation Pulse</strong>
              <span>·</span>
              <span>Innovating Higher Ed</span>
            </div>
          </div>
        )}

        {/* Share Bar */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-[0.65rem] text-[var(--text-muted)] tracking-[0.08em] uppercase">
            Share
          </span>
          <button className="w-[38px] h-[38px] rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-dim)] transition-all">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
          </button>
          <button className="w-[38px] h-[38px] rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-dim)] transition-all">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M4 4l6.5 8L4 20h2l5.5-6.5L16 20h4l-6.8-8.5L19.5 4H18l-5 6L9 4H4z" />
            </svg>
          </button>
          <button className="w-[38px] h-[38px] rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-dim)] transition-all">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </button>
          <button className="w-[38px] h-[38px] rounded-[10px] bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-dim)] transition-all">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Related Stories */}
      {relatedStories.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-[var(--px)] py-10 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[1.2rem] font-bold">Related Stories</h2>
            <Link
              href="/innovation-pulse"
              className="font-mono text-[0.68rem] text-[var(--cyan)] tracking-[0.06em]"
            >
              Back to all stories →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {relatedStories.map((related) => {
              const relatedV4 = mapToV4Category(related.category);
              const relatedConfig = V4_CATEGORY_CONFIG[related.category] || V4_CATEGORY_CONFIG["Insights & Trends"];
              // Use pre-assigned image from related story data
              const relatedImage = related.image || DEFAULT_STORY_IMAGE;

              return (
                <Link
                  key={related.slug}
                  href={`/innovation-pulse/story/${related.slug}`}
                  className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] transition-all"
                >
                  <div className="relative h-[140px] overflow-hidden">
                    <Image
                      src={relatedImage}
                      alt={related.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="p-4">
                    <div className="font-mono text-[0.55rem] font-semibold tracking-[0.08em] uppercase mb-2 flex items-center gap-2">
                      <span
                        className="w-[4px] h-[4px] rounded-full"
                        style={{ backgroundColor: relatedConfig.color }}
                      />
                      <span style={{ color: relatedConfig.color }}>{relatedV4}</span>
                    </div>
                    <h3 className="text-[0.92rem] font-bold leading-[1.25] mb-2 line-clamp-2 group-hover:text-[var(--cyan)] transition-colors">
                      {related.title}
                    </h3>
                    <div className="flex justify-between font-mono text-[0.58rem] text-[var(--text-muted)] pt-2 border-t border-[var(--border)]">
                      <span className="text-[var(--cyan)]">{related.source}</span>
                      <span>{formatShortDate(related.episodeDate)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Story Navigation */}
      <div className="max-w-[820px] mx-auto px-[var(--px)] pb-12">
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/innovation-pulse"
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 hover:border-[var(--border-hover)] transition-all"
          >
            <span className="font-mono text-[0.6rem] text-[var(--text-muted)] tracking-[0.08em] uppercase block mb-2">
              ← Back to
            </span>
            <span className="text-[0.9rem] font-semibold">Innovation Pulse</span>
          </Link>
          <Link
            href={`/innovation-pulse/${story.episodeDate}`}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 hover:border-[var(--border-hover)] transition-all text-right"
          >
            <span className="font-mono text-[0.6rem] text-[var(--text-muted)] tracking-[0.08em] uppercase block mb-2">
              Full episode →
            </span>
            <span className="text-[0.9rem] font-semibold">{formatShortDate(story.episodeDate)} Briefing</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

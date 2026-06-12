"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import Card from "@/components/Card";
import NewsletterSignup from "@/components/NewsletterSignup";
import HeroNowPlaying from "@/components/HeroNowPlaying";
import TopStoriesSlider from "@/components/TopStoriesSlider";
import SectionHeader from "@/components/SectionHeader";
import {
  formatPulseDate,
  formatShortDate,
  isWeeklyEpisode,
  type InnovationPulseEpisode,
} from "@/lib/data/innovation-pulse-types";

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

// Helper to render text with paragraph breaks
function renderParagraphs(text: string, className: string): React.ReactNode {
  if (!text) return null;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  if (paragraphs.length <= 1) {
    return <p className={className}>{text}</p>;
  }
  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => (
        <p key={i} className={className}>{para.trim()}</p>
      ))}
    </div>
  );
}

// V4 Category System
type V4Category =
  | "Insights & Trends"
  | "Case Study"
  | "Practical Tips"
  | "Ethical AI"
  | "Latest AI Products"
  | "Beyond Ed"
  | "Week in Review";

const V4_CATEGORIES: V4Category[] = [
  "Insights & Trends",
  "Case Study",
  "Practical Tips",
  "Ethical AI",
  "Latest AI Products",
  "Beyond Ed",
  "Week in Review",
];

// Palette-locked category colors — no green, teal, coral, orange, or blue
// Uses CSS variables from docs/DESIGN-TOKENS.md
const V4_CATEGORY_COLORS: Record<V4Category, { hex: string; bg: string; text: string }> = {
  "Insights & Trends": { hex: "var(--cyan)", bg: "var(--cyan-soft)", text: "text-[var(--cyan)]" },
  "Case Study": { hex: "var(--purple)", bg: "var(--purple-soft)", text: "text-[var(--purple)]" },
  "Practical Tips": { hex: "var(--cyan)", bg: "var(--cyan-soft)", text: "text-[var(--cyan)]" },
  "Ethical AI": { hex: "var(--amber)", bg: "var(--amber-soft)", text: "text-[var(--amber)]" },
  "Latest AI Products": { hex: "var(--purple)", bg: "var(--purple-soft)", text: "text-[var(--purple)]" },
  "Beyond Ed": { hex: "var(--cyan)", bg: "var(--cyan-soft)", text: "text-[var(--cyan)]" },
  "Week in Review": { hex: "var(--magenta)", bg: "var(--magenta-soft)", text: "text-[var(--magenta)]" },
};

const V4_BADGE_TEXT: Record<V4Category, string> = {
  "Insights & Trends": "INSIGHTS",
  "Case Study": "CASE STUDY",
  "Practical Tips": "TIPS",
  "Ethical AI": "ETHICS",
  "Latest AI Products": "PRODUCTS",
  "Beyond Ed": "BEYOND ED",
  "Week in Review": "WEEK REVIEW",
};

const V4_CATEGORY_SLUGS: Record<V4Category, string> = {
  "Insights & Trends": "insights-and-trends",
  "Case Study": "case-study",
  "Practical Tips": "practical-tips",
  "Ethical AI": "ethical-ai",
  "Latest AI Products": "latest-ai-products",
  "Beyond Ed": "beyond-ed",
  "Week in Review": "week-in-review",
};

const OLD_TO_V4_MAP: Record<string, V4Category> = {
  "Research & Innovation": "Insights & Trends",
  "Infrastructure & Operations": "Case Study",
  "Teaching & Learning": "Practical Tips",
  "Policy & Ethics": "Ethical AI",
  "Tools & Products": "Latest AI Products",
  "Student Experience": "Beyond Ed",
  "Leadership & Strategy": "Insights & Trends",
  "Insights & Trends": "Insights & Trends",
  "Case Study": "Case Study",
  "Practical Tips": "Practical Tips",
  "Ethical AI": "Ethical AI",
  "Latest AI Products": "Latest AI Products",
  "Beyond Ed": "Beyond Ed",
  "Week in Review": "Week in Review",
};

function mapToV4Category(oldCategory: string): V4Category {
  return OLD_TO_V4_MAP[oldCategory] || "Insights & Trends";
}

// Types
interface AggregatedStory {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: string;
  date: string;
  type: "deepDive" | "quickHit";
  isCallback?: boolean;
  callbackDate?: string;
  image?: string; // Pre-assigned at data load time
}

interface AggregatedStoryWithV4 extends AggregatedStory {
  v4Category: V4Category;
}

interface InnovationPulseClientProps {
  episode: InnovationPulseEpisode | null;
  allEpisodes: InnovationPulseEpisode[];
  storiesByCategory: Record<string, AggregatedStory[]>;
  showHero?: boolean;
}

// Editorial lens colors — palette-locked (no green)
const LENS_COLORS: Record<string, { bg: string; text: string }> = {
  "The Hard Question": { bg: "bg-[var(--amber-dim)]", text: "text-[var(--amber)]" },
  "The Student Experience": { bg: "bg-[var(--purple-dim)]", text: "text-[var(--purple)]" },
  "The Practitioner's Playbook": { bg: "bg-[var(--cyan-dim)]", text: "text-[var(--cyan)]" },
  "Connecting the Dots": { bg: "bg-[var(--magenta-dim)]", text: "text-[var(--magenta)]" },
  "The Innovator's Edge": { bg: "bg-gradient-to-r from-[var(--cyan-dim)] to-[var(--magenta-dim)]", text: "text-[var(--text)]" },
};

export default function InnovationPulseClient({
  episode,
  allEpisodes,
  storiesByCategory,
  showHero = true,
}: InnovationPulseClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<V4Category | "all">("all");
  const [expandedStory, setExpandedStory] = useState<string | null>(null);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  // Last 6 episodes (sliding window) - used by HeroNowPlaying and sidebar (5 shown after skipping today)
  const recentEpisodes = useMemo(() => {
    return allEpisodes.slice(0, 6);
  }, [allEpisodes]);

  // Current episode based on selection
  const currentEpisode = recentEpisodes[selectedEpisodeIndex] || episode;

  // Handle episode change from HeroNowPlaying or Recent Episodes grid
  const handleEpisodeChange = useCallback((index: number, ep: InnovationPulseEpisode) => {
    setSelectedEpisodeIndex(index);
    setShouldAutoPlay(true);
    // Update URL without navigation
    const newUrl = `/innovation-pulse?episode=${ep.date}`;
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
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [recentEpisodes]);

  // "Also in this episode" data — uses currentEpisode
  const heroOtherStories = useMemo(() => {
    return currentEpisode?.quickHits?.slice(0, 3).map(hit => ({
      source: hit.source,
      tease: hit.title,
      headline: hit.title,
      sourceUrl: hit.sourceUrl,
    })) || [];
  }, [currentEpisode]);

  // Top stories for slider (lead story first, then quick hits) — uses currentEpisode
  const topStories = useMemo(() => {
    const leadStoryAsCard = currentEpisode?.deepDive ? {
      title: currentEpisode.deepDive.title,
      summary: currentEpisode.deepDive.summary,
      category: currentEpisode.deepDive.category,
      source: currentEpisode.deepDive.source,
      sourceUrl: currentEpisode.deepDive.sourceUrl,
      date: currentEpisode.date,
      image: currentEpisode.deepDive.image,
      type: "deepDive" as const,
      isLead: true,
    } : null;

    const quickHitCards = currentEpisode?.quickHits?.slice(0, 5).map(hit => ({
      title: hit.title,
      summary: hit.summary,
      category: hit.category,
      source: hit.source,
      sourceUrl: hit.sourceUrl,
      date: currentEpisode.date,
      image: hit.image,
      type: "quickHit" as const,
    })) || [];

    return leadStoryAsCard ? [leadStoryAsCard, ...quickHitCards] : quickHitCards;
  }, [currentEpisode]);

  // Get ALL stories aggregated with V4 categories
  const allStoriesWithV4 = useMemo((): AggregatedStoryWithV4[] => {
    const stories: AggregatedStoryWithV4[] = [];
    for (const category of Object.keys(storiesByCategory)) {
      const categoryStories = storiesByCategory[category] || [];
      for (const story of categoryStories) {
        stories.push({
          ...story,
          v4Category: mapToV4Category(story.category),
        });
      }
    }
    return stories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [storiesByCategory]);

  // Group stories by V4 category
  const storiesByV4Category = useMemo(() => {
    const result: Record<V4Category, AggregatedStoryWithV4[]> = {} as Record<V4Category, AggregatedStoryWithV4[]>;
    for (const cat of V4_CATEGORIES) {
      result[cat] = [];
    }
    for (const story of allStoriesWithV4) {
      if (result[story.v4Category]) {
        result[story.v4Category].push(story);
      }
    }
    return result;
  }, [allStoriesWithV4]);

  // Get categorized stories for display
  const categorizedStories = useMemo(() => {
    const result: { category: V4Category; stories: AggregatedStoryWithV4[] }[] = [];
    for (const category of V4_CATEGORIES) {
      const stories = storiesByV4Category[category] || [];
      if (stories.length > 0) {
        result.push({ category, stories: stories.slice(0, 3) });
      }
    }
    return result;
  }, [storiesByV4Category]);

  // Archive episodes (after the first 5)
  const archiveEpisodes = useMemo(() => {
    return allEpisodes.slice(5);
  }, [allEpisodes]);

  // Previous lead stories (from days before today, for the PREVIOUS LEAD STORIES section)
  const previousLeadStories = useMemo(() => {
    // Skip the first episode (today) and get the next 3 lead stories
    return allEpisodes.slice(1, 4).map((ep) => ({
      title: ep.deepDive.title,
      summary: ep.deepDive.summary,
      source: ep.deepDive.source,
      sourceUrl: ep.deepDive.sourceUrl,
      category: ep.deepDive.category,
      editorialCallout: ep.deepDive.editorialCallout,
      date: ep.date,
      editorialLens: ep.editorialLens,
      image: ep.deepDive.image,
    }));
  }, [allEpisodes]);

  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!episode) {
    return (
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-12 text-center">
        <h1 className="text-[2rem] font-bold text-[var(--text)] mb-4">No Briefings Yet</h1>
        <p className="text-[var(--text-secondary)]">Check back soon for the latest news.</p>
      </div>
    );
  }

  return (
    <div className={showHero ? "min-h-screen" : ""}>
      {showHero && (
        <>
          {/* ═══════════════════════════════════════════════════════
              HERO SECTION — HeroNowPlaying + Recent Episodes Sidebar
              ═══════════════════════════════════════════════════════ */}
          <section className="relative">
            {/* Premium gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,212,255,0.04)] via-[rgba(200,80,192,0.02)] to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent opacity-40" />

            <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] relative">
              {/* EYEBROW — above the grid so card and sidebar start at same top */}
              <div className="flex items-center justify-between pt-10 pb-6 flex-wrap gap-4">
                <div className="np-brand">The Innovation Pulse</div>
                <div className="np-now">
                  <span className="np-dot" />
                  Now Playing · Today&apos;s Broadcast
                </div>
              </div>

              {/* Hero player — same component as homepage */}
              <div className="animate-[fadeUp_0.8s_ease-out_both]">
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

              {/* Recent Episodes grid — Part 10 redesign */}
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

                  <div className="ip-recent-grid">
                    {recentEpisodes.slice(1, 6).map((ep, idx) => {
                      const epDate = new Date(ep.date + 'T12:00:00');
                      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][epDate.getDay()];
                      const monthDay = epDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      const actualIndex = idx + 1; // Account for slice(1, 6)
                      const isSelected = selectedEpisodeIndex === actualIndex;

                      return (
                        <button
                          key={ep.date}
                          type="button"
                          onClick={() => handleRecentEpisodeClick(ep)}
                          className={`ip-recent-card ${isSelected ? 'ip-recent-card-active' : ''}`}
                        >
                          <div className="ip-recent-card-meta">
                            <span className="ip-recent-card-date">{dayName}, {monthDay}</span>
                            <span className="ip-recent-card-duration">{ep.audioDuration}</span>
                          </div>
                          <div className="ip-recent-card-title">{ep.deepDive?.title}</div>
                          {isSelected && (
                            <div className="ip-recent-card-playing">
                              <span className="ip-recent-card-playing-dot" />
                              Now Playing
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="np-subscribe" style={{ marginTop: '20px', marginBottom: '8px' }}>
                <div className="np-sub-copy">
                  <strong>Never miss an episode.</strong>{" "}
                  <span className="np-sub-muted">
                    {isWeeklyEpisode(currentEpisode)
                      ? 'Delivered to your inbox every Friday — listen on the drive in, at lunch, or the drive home.'
                      : 'Delivered to your inbox every weekday — listen on the drive in, at lunch, or the drive home.'}
                  </span>
                </div>
                <form className="np-sub-form" onSubmit={(e) => e.preventDefault()}>
                  <input type="email" placeholder="your@email.edu" aria-label="Email address" />
                  <button type="submit">Subscribe</button>
                </form>
              </div>
            </div>
          </section>

          {/* Section Divider */}
          <div className="section-divider" />
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          TOP STORIES — Horizontal Slider (matches homepage)
          ═══════════════════════════════════════════════════════ */}
      <section className="py-12">
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)]">
          <SectionHeader
            title="Top Stories"
            titleColor="var(--cyan)"
            tagline={`${formatPulseDate(currentEpisode.date)} — Top stories and coverage`}
            accentColor="var(--cyan)"
            viewAllHref="/innovation-pulse/stories"
            viewAllText="View all lead stories"
          />

          <TopStoriesSlider stories={topStories} />
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          NEWSLETTER SIGNUP — Hidden on homepage (showHero=false)
          ═══════════════════════════════════════════════════════ */}
      {showHero !== false && (
        <>
          <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-8">
            <NewsletterSignup variant="inline" />
          </div>

          {/* Section Divider */}
          <div className="section-divider" />
        </>
      )}

      {/* ═══════════════════════════════════════════════════════
          V4 CATEGORY FILTERS
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-8">
        <div className="mb-6">
          <h2
            className="text-[clamp(1.5rem,3vw,1.85rem)] font-bold text-[var(--cyan)] leading-[1.2]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Curated News
          </h2>
          <p className="text-[0.82rem] text-[var(--text-muted)] mt-1">
            AI in education and beyond — browse by category
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`filter-pill ${selectedCategory === "all" ? "active" : ""}`}
          >
            All Stories
          </button>
          {V4_CATEGORIES.map((cat) => {
            const count = storiesByV4Category[cat]?.length || 0;
            const hasStories = count > 0;
            const catId = cat.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
            const catColor = V4_CATEGORY_COLORS[cat];

            if (hasStories) {
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    scrollToCategory(catId);
                  }}
                  className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
                  style={{
                    borderColor: selectedCategory === cat ? catColor?.hex : undefined,
                    color: selectedCategory === cat ? catColor?.hex : undefined,
                    backgroundColor: selectedCategory === cat ? `${catColor?.hex}15` : undefined,
                  }}
                >
                  {cat}
                </button>
              );
            }
            return null;
          })}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          CATEGORY SECTIONS
          ═══════════════════════════════════════════════════════ */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        {/* PREVIOUS LEAD STORIES — First position */}
        {previousLeadStories.length > 0 && (
          <div id="previous-lead-stories" className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3
                  className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold text-[var(--magenta)] leading-[1.2]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Previous Lead Stories
                </h3>
                <p className="text-[0.78rem] text-[var(--text-muted)] mt-0.5">
                  Deep dives from recent episodes
                </p>
              </div>
              <Link href="/innovation-pulse/stories" className="font-mono text-[0.72rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors">
                View all →
              </Link>
            </div>

            <div className="grid-3">
              {previousLeadStories.map((story, i) => {
                const v4Cat = mapToV4Category(story.category);
                const storyLensColors = LENS_COLORS[story.editorialLens] || LENS_COLORS["The Hard Question"];
                const isExpanded = expandedStory === `prev-lead-${story.title}`;

                return (
                  <div
                    key={`prev-lead-${i}`}
                    onClick={() => setExpandedStory(isExpanded ? null : `prev-lead-${story.title}`)}
                    className={`bg-[var(--bg-card)] border rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 ${
                      isExpanded
                        ? "border-[rgba(0,212,255,0.2)]"
                        : "border-[var(--border)] hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)]"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-[var(--surface-1)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={story.image || ""}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover object-center"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className="font-mono text-[0.55rem] font-semibold px-[0.5rem] py-[0.18rem] rounded-[4px] bg-[var(--magenta)] text-white uppercase">
                          Lead
                        </span>
                        <span
                          className="font-mono text-[0.55rem] font-semibold px-[0.5rem] py-[0.18rem] rounded-[4px] text-white uppercase"
                          style={{ backgroundColor: V4_CATEGORY_COLORS[v4Cat]?.hex }}
                        >
                          {v4Cat}
                        </span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                          {formatShortDate(story.date)}
                        </span>
                      </div>
                      <h3 className="font-sans text-[0.92rem] font-bold leading-[1.35] mb-2 line-clamp-2">
                        {story.title}
                      </h3>
                      {/* Teaser when collapsed */}
                      {!isExpanded && (
                        <p className="text-[0.8rem] text-[var(--text-secondary)] leading-[1.55] mb-2 line-clamp-2">
                          {story.summary}
                        </p>
                      )}
                      {/* Expand indicator */}
                      <div className="text-[0.53rem] text-[var(--text-muted)] flex items-center gap-[0.25rem] mb-2 font-mono">
                        <span className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                          &#9662;
                        </span>
                        <span>{isExpanded ? "Collapse" : "Read more"}</span>
                      </div>
                      {/* Expanded content */}
                      <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
                        <p className="text-[0.8rem] text-[var(--text-secondary)] leading-[1.65] mb-3">
                          {story.summary}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                        <Link
                          href={`/innovation-pulse/story/${generateSlug(story.title)}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-[0.65rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors"
                        >
                          Full story →
                        </Link>
                        <a
                          href={story.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-[0.6rem] text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors"
                        >
                          {story.source} ↗
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Category Sections */}
        {categorizedStories.map(({ category, stories }) => {
          const catId = category.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "and");
          const catColor = V4_CATEGORY_COLORS[category]?.hex || "var(--cyan)";
          const catSlug = V4_CATEGORY_SLUGS[category];

          return (
            <div key={category} id={catId} className="mb-10 mt-10 first:mt-0">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3
                    className="text-[clamp(1.25rem,2.5vw,1.5rem)] font-bold leading-[1.2]"
                    style={{ fontFamily: "var(--font-heading)", color: catColor }}
                  >
                    {category}
                  </h3>
                  <p className="text-[0.78rem] text-[var(--text-muted)] mt-0.5">
                    {category === "Insights & Trends" && "Research, data, and emerging patterns"}
                    {category === "Case Study" && "Real-world implementations and outcomes"}
                    {category === "Practical Tips" && "Actionable strategies for educators"}
                    {category === "Ethical AI" && "Policy, ethics, and responsible AI use"}
                    {category === "Latest AI Products" && "New tools and platform updates"}
                    {category === "Beyond Ed" && "AI trends from outside higher education"}
                    {category === "Week in Review" && "Weekly roundup and analysis"}
                  </p>
                </div>
                <Link href={`/innovation-pulse/category/${catSlug}`} className="font-mono text-[0.72rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors">
                  View all {category === "Case Study" ? "Case Studies" : category} →
                </Link>
              </div>

              <div className="grid-3">
                {stories.map((story, i) => (
                  <Card
                    key={`${story.date}-${i}`}
                    title={story.title}
                    teaser={story.summary}
                    fullContent={story.summary}
                    category={story.v4Category}
                    categoryColor={V4_CATEGORY_COLORS[story.v4Category]?.hex}
                    source={story.source}
                    sourceUrl={story.sourceUrl}
                    date={formatShortDate(story.date)}
                    imageUrl={story.image || ""}
                    badgeText={story.isCallback ? "CALLBACK" : story.type === "deepDive" ? "LEAD" : V4_BADGE_TEXT[story.v4Category]}
                    badgeColor={story.isCallback ? "rgba(245,166,35,0.85)" : story.type === "deepDive" ? "rgba(0,212,255,0.85)" : V4_CATEGORY_COLORS[story.v4Category]?.hex}
                    expandable={true}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ═══════════════════════════════════════════════════════
          ARCHIVE SECTION + BOTTOM NEWSLETTER — Hidden on homepage (showHero=false)
          ═══════════════════════════════════════════════════════ */}
      {showHero !== false && (
        <>
          {archiveEpisodes.length > 0 && (
            <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
              <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
                Briefing Archive
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {archiveEpisodes.slice(0, 8).map((ep) => (
                  <Link
                    key={ep.date}
                    href={`/innovation-pulse/${ep.date}`}
                    className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 hover:border-[var(--border-hover)] hover:-translate-y-[2px] transition-all duration-300 block group"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">{formatShortDate(ep.date)}</span>
                      <span className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[var(--cyan-dim)] text-[var(--cyan)]">
                        {ep.editorialLens.split(" ").slice(0, 2).join(" ")}
                      </span>
                    </div>
                    <p className="text-[0.85rem] font-bold text-[var(--text)] leading-[1.4] line-clamp-2 group-hover:text-[var(--cyan)] transition-colors">
                      {ep.deepDive.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2 font-mono text-[0.55rem] text-[var(--text-muted)]">
                      <span>{ep.audioDuration}</span>
                      <span>{ep.quickHits.length + 1} stories</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Newsletter CTA */}
          <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
            <NewsletterSignup variant="card" />
          </div>
        </>
      )}

      {/* AI Voice Disclaimer */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12 text-center border-t border-[var(--border)] pt-4">
        <p className="text-[0.72rem] text-[var(--text-muted)]">
          The Innovation Pulse is produced using A.I. voice technology with editorial oversight by the Innovating Higher Ed team.
          <br />
          <Link href="/ai-disclosure" className="text-[var(--cyan)] hover:underline">
            Learn more about how we use A.I. responsibly.
          </Link>
        </p>
      </div>
    </div>
  );
}

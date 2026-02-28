import { Metadata } from "next";
import Link from "next/link";
import {
  getAllEpisodes,
  formatPulseDate,
  mapToV4Category,
  V4_CATEGORY_COLORS,
  generateSlug,
} from "@/lib/data/innovation-pulse";
import { formatShortDate } from "@/lib/data/innovation-pulse-types";
import { getStoryImage, StoryImageAssigner } from "@/lib/utils/story-images";
import LeadStoriesClient from "./LeadStoriesClient";

export const metadata: Metadata = {
  title: "Lead Stories — The Innovation Pulse | Innovating Higher Ed",
  description: "Archive of all lead stories from The Innovation Pulse daily AI briefing for higher education.",
};

export default function LeadStoriesPage() {
  const allEpisodes = getAllEpisodes();
  const imageAssigner = new StoryImageAssigner();

  // Get all lead stories with their episode context
  const leadStories = allEpisodes.map((episode) => {
    const v4Category = mapToV4Category(episode.deepDive.category);
    return {
      title: episode.deepDive.title,
      summary: episode.deepDive.summary,
      source: episode.deepDive.source,
      sourceUrl: episode.deepDive.sourceUrl,
      category: v4Category,
      categoryColor: V4_CATEGORY_COLORS[v4Category] || "#00d4ff",
      date: episode.date,
      editorialLens: episode.editorialLens,
      editorialCallout: episode.deepDive.editorialCallout,
      slug: generateSlug(episode.deepDive.title),
      imageUrl: imageAssigner.getImage(episode.deepDive.title, episode.deepDive.category),
    };
  });

  const todaysStory = leadStories[0];
  const previousStories = leadStories.slice(1);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-8">
        <div className="flex items-center gap-2 mb-4">
          <Link
            href="/innovation-pulse"
            className="font-mono text-[0.68rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors"
          >
            ← Back to Innovation Pulse
          </Link>
        </div>
        <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--magenta)] mb-2 flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--magenta)]" />
          Lead Stories Archive
        </div>
        <h1
          className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.15] mb-3"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Lead Stories
        </h1>
        <p className="text-[0.92rem] text-[var(--text-secondary)] max-w-[600px]">
          Our daily lead stories — the most significant AI in higher education news, analyzed with editorial context.
        </p>
      </div>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Today's Lead Story - Full Layout */}
      {todaysStory && (
        <section className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
          <div className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-6 flex items-center gap-2">
            <span className="text-[var(--green)]">TODAY</span>
            <span>—</span>
            <span>{formatPulseDate(todaysStory.date)}</span>
          </div>

          {/* Large Featured Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] overflow-hidden mb-6">
            <div className="grid lg:grid-cols-[45%_55%]">
              {/* Image */}
              <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[400px] overflow-hidden bg-[var(--surface-1)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={todaysStory.imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,10,15,0.5)] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[rgba(10,10,15,0.3)]" />
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8 flex flex-col">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="font-mono text-[0.62rem] font-semibold tracking-[0.06em] px-[0.65rem] py-[0.25rem] rounded-[6px] bg-[var(--magenta)] text-white uppercase">
                    Lead Story
                  </span>
                  <span
                    className="font-mono text-[0.62rem] font-semibold tracking-[0.06em] px-[0.65rem] py-[0.25rem] rounded-[6px] text-white uppercase"
                    style={{ backgroundColor: todaysStory.categoryColor }}
                  >
                    {todaysStory.category}
                  </span>
                  <span className="font-mono text-[0.62rem] px-[0.65rem] py-[0.25rem] rounded-[6px] border border-[var(--border)] text-[var(--text-muted)]">
                    {todaysStory.editorialLens}
                  </span>
                </div>

                <h2
                  className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold leading-[1.2] mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {todaysStory.title}
                </h2>

                <p className="text-[0.92rem] text-[var(--text-secondary)] leading-[1.7] mb-6 flex-1">
                  {todaysStory.summary}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[var(--border)]">
                  <Link
                    href={`/innovation-pulse/story/${todaysStory.slug}`}
                    className="btn-primary text-[0.75rem]"
                  >
                    Read full story →
                  </Link>
                  <a
                    href={todaysStory.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.75rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors"
                  >
                    {todaysStory.source} ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Our Take */}
          {todaysStory.editorialCallout && (
            <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-[16px] p-6 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--magenta)] to-[var(--cyan)]" />
              <div className="pl-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[0.68rem] tracking-[0.1em] uppercase font-semibold text-[var(--magenta)]">
                    Our Take
                  </span>
                  <span className="font-mono text-[0.6rem] px-[0.55rem] py-[0.18rem] rounded-[4px] bg-[var(--magenta-dim)] text-[var(--magenta)]">
                    {todaysStory.editorialLens}
                  </span>
                </div>
                <p className="text-[1.05rem] text-[var(--text)] leading-[1.7] italic max-w-[800px]">
                  {todaysStory.editorialCallout}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Section Divider */}
      <div className="section-divider" />

      {/* Previous Lead Stories */}
      {previousStories.length > 0 && (
        <section className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
          <div className="font-mono text-[0.68rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-6">
            Previous Lead Stories
          </div>

          <LeadStoriesClient stories={previousStories} />
        </section>
      )}
    </div>
  );
}

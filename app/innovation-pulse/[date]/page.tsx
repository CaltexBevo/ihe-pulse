import Link from "next/link";
import { notFound } from "next/navigation";
import AudioPlayer from "@/components/AudioPlayer";
import Card from "@/components/Card";
import {
  getAllEpisodes,
  getEpisodeByDate,
  getEpisodeDates,
  formatPulseDate,
  formatShortDate,
  categoryColors,
} from "@/lib/data/innovation-pulse";

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
      {/* Page Header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-6">
        <Link
          href="/innovation-pulse"
          className="font-mono text-[0.62rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors mb-4 inline-flex items-center gap-1"
        >
          &larr; Back to Innovation Pulse
        </Link>

        <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--cyan)] mb-2 flex items-center gap-2 mt-4">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)]" />
          THE INNOVATION PULSE
        </div>
        <h1 className="font-serif italic text-[clamp(1.6rem,4vw,2.2rem)] font-normal leading-[1.15] text-[var(--text)] mb-3">
          {formatPulseDate(date)}
        </h1>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.58rem] font-semibold px-2 py-[3px] rounded-[4px] bg-[var(--cyan-dim)] text-[var(--cyan)]">
            {episode.editorialLens}
          </span>
          <span className="font-mono text-[0.58rem] text-[var(--text-muted)]">
            {episode.audioDuration}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        {/* Editorial Hook & Player */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-6 lg:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

          <blockquote className="text-[1.1rem] leading-[1.65] text-[var(--text)] mb-6 max-w-[720px]">
            &ldquo;{episode.editorialHook}&rdquo;
          </blockquote>

          <AudioPlayer duration={episode.audioDuration} credit="Dr. Norma Jones" />
        </div>

        {/* Lead Story */}
        <section className="mb-10">
          <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--magenta)] mb-4">
            Lead Story
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-6 lg:p-8 relative overflow-hidden">
            <div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{
                background: `linear-gradient(90deg, ${categoryColors[episode.deepDive.category]?.hex}, var(--magenta))`,
              }}
            />

            <div className="flex items-center gap-2 mb-3">
              <span
                className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px]"
                style={{
                  backgroundColor: `${categoryColors[episode.deepDive.category]?.hex}20`,
                  color: categoryColors[episode.deepDive.category]?.hex,
                }}
              >
                {episode.deepDive.category}
              </span>
              {episode.deepDive.isCallback && (
                <span className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[var(--amber-dim)] text-[var(--amber)]">
                  Callback
                </span>
              )}
            </div>

            <h2 className="text-[1.4rem] font-bold leading-[1.25] mb-4">
              {episode.deepDive.title}
            </h2>

            <p className="text-[0.92rem] text-[var(--text-secondary)] leading-[1.7] mb-6">
              {episode.deepDive.summary}
            </p>

            <a
              href={episode.deepDive.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[0.72rem] text-[var(--cyan)] hover:underline inline-flex items-center gap-1"
            >
              Read full story at {episode.deepDive.source} &#8599;
            </a>
          </div>
        </section>

        {/* Quick Hits */}
        {episode.quickHits.length > 0 && (
          <section className="mb-10">
            <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
              Also Today
            </div>

            <div className="grid-3">
              {episode.quickHits.map((hit, i) => (
                <Card
                  key={i}
                  title={hit.title}
                  teaser={hit.summary}
                  fullContent={hit.summary}
                  category={hit.category}
                  categoryColor={categoryColors[hit.category]?.hex}
                  source={hit.source}
                  date={formatShortDate(episode.date)}
                  expandable={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Stories We're Watching (Friday only) */}
        {episode.storiesWatching.length > 0 && (
          <section className="mb-10">
            <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--amber)] mb-4">
              Stories We&apos;re Watching
            </div>

            <div className="space-y-4">
              {episode.storiesWatching.map((story) => (
                <div
                  key={story.threadId}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 border-l-[3px] border-l-[var(--amber)]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-[0.92rem] font-bold">{story.label}</h3>
                    <span className="font-mono text-[0.55rem] text-[var(--amber)]">
                      Day {story.daysSinceFirstCovered + 1}
                    </span>
                  </div>
                  <p className="text-[0.82rem] text-[var(--text-secondary)] leading-[1.55]">
                    {story.update}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Closing Thought */}
        {episode.closingThought && (
          <section className="mb-10">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-6 lg:p-8 relative overflow-hidden border-l-[4px] border-l-[var(--magenta)]">
              <div className="font-mono text-[0.55rem] tracking-[0.08em] uppercase text-[var(--magenta)] mb-3">
                Closing Thought
              </div>
              <p className="text-[1rem] text-[var(--text)] leading-[1.7] italic">
                &ldquo;{episode.closingThought}&rdquo;
              </p>
              <p className="text-[0.72rem] text-[var(--text-muted)] mt-3">
                — Dr. Norma Jones
              </p>
            </div>
          </section>
        )}

        {/* Episode Navigation */}
        <div className="flex justify-between items-center pt-8 border-t border-[var(--border)]">
          {prevEpisode ? (
            <Link
              href={`/innovation-pulse/${prevEpisode.date}`}
              className="font-mono text-[0.72rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors"
            >
              &larr; {formatShortDate(prevEpisode.date)}
            </Link>
          ) : (
            <span />
          )}
          {nextEpisode ? (
            <Link
              href={`/innovation-pulse/${nextEpisode.date}`}
              className="font-mono text-[0.72rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors"
            >
              {formatShortDate(nextEpisode.date)} &rarr;
            </Link>
          ) : (
            <span />
          )}
        </div>
      </div>

      {/* AI Voice Disclaimer */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12 text-center">
        <p className="text-[0.68rem] text-[var(--text-muted)] italic">
          The Innovation Pulse is produced using AI voice technology based on
          Dr. Norma Jones&apos; voice, with editorial oversight by Dr. Jones.
        </p>
      </div>
    </div>
  );
}

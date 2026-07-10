import Link from "next/link";
import {
  getAllEpisodes,
  formatPulseDate,
  formatShortDate,
  generateSlug,
  mapToV4Category,
  V4_CATEGORY_COLORS,
} from "@/lib/data/innovation-pulse";
import AllEpisodesClient from "./AllEpisodesClient";
import { pageMetadata } from "@/lib/og";

export const metadata = pageMetadata({
  title: "All Episodes | Innovating Higher Ed",
  description: "Every episode, every story. Browse the complete archive of The Innovation Pulse daily A.I. briefings for higher education.",
  path: "/innovation-pulse/archive",
});

// Group episodes by week
interface WeekGroup {
  weekStart: string;
  weekEnd: string;
  weekLabel: string;
  episodes: ReturnType<typeof getAllEpisodes>;
}

function groupEpisodesByWeek(episodes: ReturnType<typeof getAllEpisodes>): WeekGroup[] {
  const weeks: WeekGroup[] = [];
  const episodesByWeek: Record<string, ReturnType<typeof getAllEpisodes>> = {};

  for (const episode of episodes) {
    const date = new Date(episode.date + "T12:00:00");
    const dayOfWeek = date.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(date);
    monday.setDate(date.getDate() + mondayOffset);
    const weekKey = monday.toISOString().split("T")[0];

    if (!episodesByWeek[weekKey]) {
      episodesByWeek[weekKey] = [];
    }
    episodesByWeek[weekKey].push(episode);
  }

  // Sort weeks by date (newest first)
  const sortedWeekKeys = Object.keys(episodesByWeek).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  for (const weekKey of sortedWeekKeys) {
    const weekEpisodes = episodesByWeek[weekKey].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const monday = new Date(weekKey + "T12:00:00");
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    weeks.push({
      weekStart: weekKey,
      weekEnd: friday.toISOString().split("T")[0],
      weekLabel: `Week of ${monday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      episodes: weekEpisodes,
    });
  }

  return weeks;
}

export default function AllEpisodesPage() {
  const allEpisodes = getAllEpisodes();
  const weekGroups = groupEpisodesByWeek(allEpisodes);
  const totalEpisodes = allEpisodes.length;
  const totalStories = allEpisodes.reduce((sum, ep) => sum + 1 + ep.quickHits.length, 0);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-8">
        {/* Back Link */}
        <Link
          href="/"
          className="font-mono text-[0.72rem] text-[var(--cyan)] flex items-center gap-2 hover:text-[var(--text)] transition-colors mb-6"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Title — gradient text, no accent bar */}
        <h1
          className="text-[clamp(1.8rem,4vw,2.4rem)] font-bold mb-4"
          style={{
            background: "linear-gradient(90deg, var(--cyan), var(--purple))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          All Episodes
        </h1>

        <p className="text-[1rem] text-[var(--text-secondary)] leading-[1.6] max-w-[640px] mb-6">
          Every episode, every story — the daily A.I. briefing for higher education.
        </p>

        {/* Stats — mono style, cyan numbers */}
        <div className="flex items-center gap-4 font-mono text-[0.72rem]">
          <span>
            <span className="text-[var(--cyan)]">{totalEpisodes}</span>
            <span className="text-[var(--text-muted)]"> episodes</span>
          </span>
          <span className="text-[var(--text-muted)]">·</span>
          <span>
            <span className="text-[var(--cyan)]">{totalStories}</span>
            <span className="text-[var(--text-muted)]"> stories</span>
          </span>
          <span className="text-[var(--text-muted)]">·</span>
          <span>
            <span className="text-[var(--cyan)]">{weekGroups.length}</span>
            <span className="text-[var(--text-muted)]"> weeks</span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="section-divider" />

      {/* Episodes by Week */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
        {weekGroups.map((week) => (
          <div key={week.weekStart} className="mb-10">
            {/* Week Header */}
            <div className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-4">
              {week.weekLabel}
            </div>

            {/* Episodes */}
            <div className="space-y-3">
              {week.episodes.map((episode) => {
                const storyCount = 1 + episode.quickHits.length;
                const leadSlug = generateSlug(episode.deepDive.title);

                return (
                  <AllEpisodesClient
                    key={episode.date}
                    episode={{
                      date: episode.date,
                      dayOfWeek: episode.dayOfWeek,
                      audioUrl: episode.audioUrl,
                      audioDuration: episode.audioDuration,
                      deepDiveTitle: episode.deepDive.title,
                      deepDiveSlug: leadSlug,
                      storyCount,
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {weekGroups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">No episodes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

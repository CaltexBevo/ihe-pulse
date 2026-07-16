import Link from "next/link";
import {
  getAllEpisodes,
  mapToV4Category,
} from "@/lib/data/innovation-pulse";
import ArchiveListClient from "./ArchiveListClient";
import { pageMetadata } from "@/lib/og";

export const metadata = pageMetadata({
  title: "All Episodes | Innovating Higher Ed",
  description: "Every episode, every story. Browse the complete archive of The Innovation Pulse A.I. briefings for higher education.",
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
          Every episode, every story — the A.I. briefing for higher education.
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

      {/* Episodes by Week — searchable (client) */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
        <ArchiveListClient
          weeks={weekGroups.map((week) => ({
            weekStart: week.weekStart,
            weekLabel: week.weekLabel,
            episodes: week.episodes.map((episode) => ({
              date: episode.date,
              dayOfWeek: episode.dayOfWeek,
              audioUrl: episode.audioUrl,
              audioDuration: episode.audioDuration,
              deepDiveTitle: episode.deepDive.title,
              storyCount: 1 + episode.quickHits.length,
              // Search haystack: lead + quick-hit titles, summary, source, categories, date
              searchText: [
                episode.deepDive.title,
                episode.deepDive.summary,
                episode.deepDive.source,
                ...episode.quickHits.map((hit) => hit.title),
                mapToV4Category(episode.deepDive.category),
                ...episode.quickHits.map((hit) => mapToV4Category(hit.category)),
                episode.date,
                episode.dayOfWeek,
              ]
                .join(" ")
                .toLowerCase(),
            })),
          }))}
        />
      </div>
    </div>
  );
}

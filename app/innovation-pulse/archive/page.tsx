import Link from "next/link";
import {
  getAllEpisodes,
  formatPulseDate,
  formatShortDate,
  generateSlug,
  mapToV4Category,
  V4_CATEGORY_COLORS,
} from "@/lib/data/innovation-pulse";
import ArchiveClient from "./ArchiveClient";

export const metadata = {
  title: "The Innovation Pulse Archive | Innovating Higher Ed",
  description: "Every episode, every story. Browse the complete archive of The Innovation Pulse daily A.I. briefings for higher education.",
};

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

// Editorial lens colors
const LENS_COLORS: Record<string, string> = {
  "The Hard Question": "#f59e0b",
  "The Student Experience": "#22c55e",
  "The Practitioner's Playbook": "#00d4ff",
  "Connecting the Dots": "#c850c0",
  "The Innovator's Edge": "#a855f7",
};

export default function ArchivePage() {
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
          href="/innovation-pulse"
          className="font-mono text-[0.72rem] text-[var(--cyan)] flex items-center gap-2 hover:text-[var(--text)] transition-colors mb-6"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Innovation Pulse
        </Link>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-[10px] h-[10px] rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)]" />
          <h1 className="text-[clamp(1.8rem,4vw,2.4rem)] font-bold">
            The Innovation Pulse Archive
          </h1>
        </div>

        <p className="text-[1rem] text-[var(--text-secondary)] leading-[1.6] max-w-[640px] mb-6">
          Every episode, every story. Browse the complete archive of daily A.I. briefings for higher education.
        </p>

        {/* Stats */}
        <div className="flex items-center gap-6 font-mono text-[0.7rem]">
          <div className="flex items-center gap-2">
            <span className="text-[var(--cyan)]">{totalEpisodes}</span>
            <span className="text-[var(--text-muted)]">episodes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--magenta)]">{totalStories}</span>
            <span className="text-[var(--text-muted)]">stories</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--green)]">{weekGroups.length}</span>
            <span className="text-[var(--text-muted)]">weeks</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="section-divider" />

      {/* Archive by Week */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
        {weekGroups.map((week, weekIdx) => (
          <div key={week.weekStart} className="mb-10">
            {/* Week Header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-[var(--cyan)]">
                {week.weekLabel}
              </span>
              <span className="font-mono text-[0.6rem] text-[var(--text-muted)]">
                {week.episodes.length} episodes
              </span>
            </div>

            {/* Episodes */}
            <div className="space-y-3">
              {week.episodes.map((episode) => {
                const storyCount = 1 + episode.quickHits.length;
                const lensColor = LENS_COLORS[episode.editorialLens] || "#00d4ff";
                const leadSlug = generateSlug(episode.deepDive.title);

                return (
                  <ArchiveClient
                    key={episode.date}
                    episode={{
                      date: episode.date,
                      dayOfWeek: episode.dayOfWeek,
                      editorialLens: episode.editorialLens,
                      editorialHook: episode.editorialHook,
                      audioUrl: episode.audioUrl,
                      audioDuration: episode.audioDuration,
                      deepDiveTitle: episode.deepDive.title,
                      deepDiveSlug: leadSlug,
                      deepDiveCategory: mapToV4Category(episode.deepDive.category),
                      storyCount,
                      quickHits: episode.quickHits.map(h => ({
                        title: h.title,
                        category: mapToV4Category(h.category),
                        source: h.source,
                      })),
                    }}
                    lensColor={lensColor}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {weekGroups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">No episodes in the archive yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

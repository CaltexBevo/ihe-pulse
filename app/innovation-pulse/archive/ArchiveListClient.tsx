"use client";

// Episode search + filtered week list for the archive page (UX audit, item c4).
// Owns the search state; rows render via the existing AllEpisodesClient player.

import { useMemo, useState } from "react";
import AllEpisodesClient from "./AllEpisodesClient";

interface EpisodeData {
  date: string;
  dayOfWeek: string;
  audioUrl: string;
  audioDuration: string;
  deepDiveTitle: string;
  storyCount: number;
  searchText: string; // lowercased haystack built server-side
}

interface WeekGroupData {
  weekStart: string;
  weekLabel: string;
  episodes: EpisodeData[];
}

interface ArchiveListClientProps {
  weeks: WeekGroupData[];
}

export default function ArchiveListClient({ weeks }: ArchiveListClientProps) {
  const [query, setQuery] = useState("");

  const filteredWeeks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return weeks;
    return weeks
      .map((week) => ({
        ...week,
        episodes: week.episodes.filter((ep) => ep.searchText.includes(q)),
      }))
      .filter((week) => week.episodes.length > 0);
  }, [weeks, query]);

  const matchCount = filteredWeeks.reduce((sum, w) => sum + w.episodes.length, 0);

  return (
    <div>
      {/* Search */}
      <div className="flex items-center gap-3 flex-wrap mb-8">
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
            placeholder="Search episodes..."
            aria-label="Search episodes"
            className="bg-transparent border-none outline-none text-[0.8rem] text-[var(--text)] placeholder:text-[var(--text-muted)] w-[220px]"
          />
        </div>
        {query.trim() && (
          <span className="font-mono text-[0.68rem] text-[var(--text-muted)]" aria-live="polite">
            {matchCount} {matchCount === 1 ? "episode matches" : "episodes match"}
          </span>
        )}
      </div>

      {/* Episodes by Week */}
      {filteredWeeks.map((week) => (
        <div key={week.weekStart} className="mb-10">
          <div className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-4">
            {week.weekLabel}
          </div>
          <div className="space-y-3">
            {week.episodes.map((episode) => (
              <AllEpisodesClient key={episode.date} episode={episode} />
            ))}
          </div>
        </div>
      ))}

      {filteredWeeks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--text-muted)]">
            {query.trim()
              ? `No episodes match “${query.trim()}”.`
              : "No episodes yet."}
          </p>
        </div>
      )}
    </div>
  );
}

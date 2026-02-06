// ── Innovation Pulse Server-Side Data Loading ────────────────────────────────
// This file uses Node.js fs/path and should only be imported in Server Components

import fs from 'fs';
import path from 'path';

// Re-export all types and client-safe utilities
export * from './innovation-pulse-types';

import type { InnovationPulseEpisode } from './innovation-pulse-types';

// ── Data Loading Utilities ───────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), 'lib/data/innovation-pulse');

export function getAllEpisodes(): InnovationPulseEpisode[] {
  try {
    const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith('.json'));
    const episodes: InnovationPulseEpisode[] = files
      .map((file) => {
        const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
        return JSON.parse(content) as InnovationPulseEpisode;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return episodes;
  } catch {
    return [];
  }
}

export function getEpisodeByDate(date: string): InnovationPulseEpisode | null {
  try {
    const filePath = path.join(DATA_DIR, `${date}.json`);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as InnovationPulseEpisode;
  } catch {
    return null;
  }
}

export function getLatestEpisode(): InnovationPulseEpisode | null {
  const episodes = getAllEpisodes();
  return episodes.length > 0 ? episodes[0] : null;
}

export function getEpisodeDates(): string[] {
  const episodes = getAllEpisodes();
  return episodes.map((e) => e.date);
}

// ── Story Aggregation Types ─────────────────────────────────────────────────

export interface AggregatedStory {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: import('./innovation-pulse-types').StoryCategory;
  date: string;
  type: 'deepDive' | 'quickHit';
  isCallback?: boolean;
}

// ── Story Aggregation Utilities ─────────────────────────────────────────────

export function getAllStoriesAggregated(): AggregatedStory[] {
  const episodes = getAllEpisodes();
  const stories: AggregatedStory[] = [];

  for (const episode of episodes) {
    // Add deep dive
    stories.push({
      title: episode.deepDive.title,
      summary: episode.deepDive.summary,
      source: episode.deepDive.source,
      sourceUrl: episode.deepDive.sourceUrl,
      category: episode.deepDive.category,
      date: episode.date,
      type: 'deepDive',
      isCallback: episode.deepDive.isCallback,
    });

    // Add quick hits
    for (const hit of episode.quickHits) {
      stories.push({
        title: hit.title,
        summary: hit.summary,
        source: hit.source,
        sourceUrl: hit.sourceUrl,
        category: hit.category,
        date: episode.date,
        type: 'quickHit',
      });
    }
  }

  // Sort by date (newest first)
  return stories.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getStoriesByCategory(): Record<
  import('./innovation-pulse-types').StoryCategory,
  AggregatedStory[]
> {
  const allStories = getAllStoriesAggregated();
  const categories: import('./innovation-pulse-types').StoryCategory[] = [
    'Teaching & Learning',
    'Policy & Ethics',
    'Infrastructure & Operations',
    'Tools & Products',
    'Research & Innovation',
    'Student Experience',
    'Leadership & Strategy',
  ];

  const grouped = {} as Record<
    import('./innovation-pulse-types').StoryCategory,
    AggregatedStory[]
  >;

  for (const category of categories) {
    grouped[category] = allStories.filter((s) => s.category === category);
  }

  return grouped;
}

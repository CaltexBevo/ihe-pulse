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

// ── Slug Utilities ─────────────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

// Extended story type with episode context
export interface StoryWithContext extends AggregatedStory {
  slug: string;
  episodeDate: string;
  editorialLens: string;
  editorialCallout?: string;
  audioUrl?: string;
  fullText?: string;
  editorialTake?: string;
}

export function getStoryBySlug(slug: string): StoryWithContext | null {
  const episodes = getAllEpisodes();

  for (const episode of episodes) {
    // Check deep dive
    const deepDiveSlug = generateSlug(episode.deepDive.title);
    if (deepDiveSlug === slug) {
      return {
        title: episode.deepDive.title,
        summary: episode.deepDive.summary,
        source: episode.deepDive.source,
        sourceUrl: episode.deepDive.sourceUrl,
        category: episode.deepDive.category,
        date: episode.date,
        type: 'deepDive',
        isCallback: episode.deepDive.isCallback,
        slug: deepDiveSlug,
        episodeDate: episode.date,
        editorialLens: episode.editorialLens,
        editorialCallout: episode.deepDive.editorialCallout,
        audioUrl: episode.audioUrl,
        fullText: episode.deepDive.summary,
        editorialTake: episode.deepDive.editorialCallout,
      };
    }

    // Check quick hits
    for (const hit of episode.quickHits) {
      const hitSlug = generateSlug(hit.title);
      if (hitSlug === slug) {
        return {
          title: hit.title,
          summary: hit.summary,
          source: hit.source,
          sourceUrl: hit.sourceUrl,
          category: hit.category,
          date: episode.date,
          type: 'quickHit',
          isCallback: hit.isCallback,
          slug: hitSlug,
          episodeDate: episode.date,
          editorialLens: episode.editorialLens,
          audioUrl: episode.audioUrl,
        };
      }
    }
  }

  return null;
}

export function getAllStorySlugs(): string[] {
  const episodes = getAllEpisodes();
  const slugs: string[] = [];

  for (const episode of episodes) {
    slugs.push(generateSlug(episode.deepDive.title));
    for (const hit of episode.quickHits) {
      slugs.push(generateSlug(hit.title));
    }
  }

  return slugs;
}

// ── V4 Category Utilities ─────────────────────────────────────────────────

export type V4Category =
  | "Insights & Trends"
  | "Case Study"
  | "Practical Tips"
  | "Ethical AI"
  | "Latest AI Products"
  | "Beyond Ed"
  | "Week in Review";

export const V4_CATEGORIES: V4Category[] = [
  "Insights & Trends",
  "Case Study",
  "Practical Tips",
  "Ethical AI",
  "Latest AI Products",
  "Beyond Ed",
  "Week in Review",
];

export const V4_CATEGORY_SLUGS: Record<V4Category, string> = {
  "Insights & Trends": "insights-and-trends",
  "Case Study": "case-study",
  "Practical Tips": "practical-tips",
  "Ethical AI": "ethical-ai",
  "Latest AI Products": "latest-ai-products",
  "Beyond Ed": "beyond-ed",
  "Week in Review": "week-in-review",
};

export const V4_CATEGORY_COLORS: Record<V4Category, string> = {
  "Insights & Trends": "#00d4ff",
  "Case Study": "#10b981",
  "Practical Tips": "#f59e0b",
  "Ethical AI": "#f43f5e",
  "Latest AI Products": "#8b5cf6",
  "Beyond Ed": "#3b82f6",
  "Week in Review": "#c850c0",
};

export const V4_CATEGORY_DESCRIPTIONS: Record<V4Category, string> = {
  "Insights & Trends": "Research findings, emerging patterns, and thought leadership in A.I. for higher education.",
  "Case Study": "Real implementations and lessons learned from institutions using A.I. in practice.",
  "Practical Tips": "Actionable strategies and techniques educators can use in their classrooms today.",
  "Ethical AI": "Policy debates, ethical considerations, and responsible A.I. use in education.",
  "Latest AI Products": "New tools, platforms, and technologies relevant to higher education.",
  "Beyond Ed": "A.I. developments outside education that still matter for the sector.",
  "Week in Review": "Friday synthesis connecting the week's themes and looking ahead.",
};

const OLD_TO_V4_MAP: Record<string, V4Category> = {
  "Research & Innovation": "Insights & Trends",
  "Infrastructure & Operations": "Case Study",
  "Teaching & Learning": "Practical Tips",
  "Policy & Ethics": "Ethical AI",
  "Tools & Products": "Latest AI Products",
  "Student Experience": "Beyond Ed",
  "Leadership & Strategy": "Insights & Trends",
};

export function mapToV4Category(oldCategory: string): V4Category {
  return OLD_TO_V4_MAP[oldCategory] || (oldCategory as V4Category) || "Insights & Trends";
}

export function getCategoryFromSlug(slug: string): V4Category | null {
  for (const [category, categorySlug] of Object.entries(V4_CATEGORY_SLUGS)) {
    if (categorySlug === slug) return category as V4Category;
  }
  return null;
}

export function getStoriesByV4Category(v4Category: V4Category): StoryWithContext[] {
  const allStories = getAllStoriesAggregated();
  const episodes = getAllEpisodes();
  const stories: StoryWithContext[] = [];

  for (const story of allStories) {
    const mappedCategory = mapToV4Category(story.category);
    if (mappedCategory !== v4Category) continue;

    const episode = episodes.find(ep => ep.date === story.date);
    if (!episode) continue;

    const editorialCallout = story.type === 'deepDive' ? episode.deepDive.editorialCallout : undefined;

    stories.push({
      ...story,
      slug: generateSlug(story.title),
      episodeDate: story.date,
      editorialLens: episode.editorialLens,
      audioUrl: episode.audioUrl,
      editorialCallout,
    });
  }

  return stories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getRelatedStories(currentSlug: string, category: string, limit: number = 3): StoryWithContext[] {
  const allStories = getAllStoriesAggregated();
  const episodes = getAllEpisodes();

  // Find stories in the same category, excluding current story
  const related: StoryWithContext[] = [];

  for (const story of allStories) {
    const slug = generateSlug(story.title);
    if (slug === currentSlug) continue;
    if (story.category !== category && related.length >= limit) continue;

    // Get episode context
    const episode = episodes.find(ep => ep.date === story.date);
    if (!episode) continue;

    related.push({
      ...story,
      slug,
      episodeDate: story.date,
      editorialLens: episode.editorialLens,
      audioUrl: episode.audioUrl,
    });

    if (related.length >= limit) break;
  }

  return related;
}

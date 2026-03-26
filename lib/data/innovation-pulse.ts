// ── Innovation Pulse Server-Side Data Loading ────────────────────────────────
// This file uses Node.js fs/path and should only be imported in Server Components

import fs from 'fs';
import path from 'path';

// Re-export all types and client-safe utilities
export * from './innovation-pulse-types';

import type { InnovationPulseEpisode } from './innovation-pulse-types';
import { StoryImageAssigner } from '@/lib/utils/story-images';

// ── Data Loading Utilities ───────────────────────────────────────────────────

// Primary data source: data/daily-pulse (where pipeline publishes new episodes)
// Fallback: lib/data/innovation-pulse (legacy static data)
const PRIMARY_DATA_DIR = path.join(process.cwd(), 'data/daily-pulse');
const LEGACY_DATA_DIR = path.join(process.cwd(), 'lib/data/innovation-pulse');

// ── Schema Normalization Helpers ─────────────────────────────────────────────
// These handle differences between old format and new pipeline format

// V4 Category type for direct mapping
type V4CategoryName =
  | "Insights & Trends"
  | "Case Study"
  | "Practical Tips"
  | "Ethical AI"
  | "Latest AI Products"
  | "Beyond Ed"
  | "Week in Review";

// Valid V4 category names for validation
const VALID_V4_CATEGORIES: V4CategoryName[] = [
  "Insights & Trends",
  "Case Study",
  "Practical Tips",
  "Ethical AI",
  "Latest AI Products",
  "Beyond Ed",
  "Week in Review",
];

// UNIFIED category mapping: all input formats → V4 category names
// This eliminates the double mapping (pipeline→old→V4) that was breaking categories
const UNIFIED_TO_V4_MAP: Record<string, V4CategoryName> = {
  // Pipeline uppercase format → V4
  "CASE STUDIES": "Case Study",
  "LATEST AI PRODUCT RELEASES": "Latest AI Products",
  "INSIGHTS & TRENDS": "Insights & Trends",
  "PRACTICAL TIPS": "Practical Tips",
  "ETHICAL AI": "Ethical AI",
  "BEYOND ED": "Beyond Ed",
  "WEEK IN REVIEW": "Week in Review",
  // Legacy format → V4
  "Teaching & Learning": "Practical Tips",
  "Research & Innovation": "Insights & Trends",
  "Policy & Ethics": "Ethical AI",
  "Tools & Products": "Latest AI Products",
  "Infrastructure & Operations": "Case Study",
  "Student Experience": "Beyond Ed",
  "Leadership & Strategy": "Insights & Trends",
  // V4 names pass through
  "Insights & Trends": "Insights & Trends",
  "Case Study": "Case Study",
  "Practical Tips": "Practical Tips",
  "Ethical AI": "Ethical AI",
  "Latest AI Products": "Latest AI Products",
  "Beyond Ed": "Beyond Ed",
  "Week in Review": "Week in Review",
};

// Map ANY category format directly to V4 category name
function mapCategoryToV4(cat: string): V4CategoryName {
  // Check if it's already a valid V4 category
  if (VALID_V4_CATEGORIES.includes(cat as V4CategoryName)) {
    return cat as V4CategoryName;
  }
  // Otherwise map through unified mapping
  return UNIFIED_TO_V4_MAP[cat] || "Insights & Trends";
}

// Map category for the internal StoryCategory type (for backward compat with types)
// This now returns V4 names cast as StoryCategory since the UI handles both
function mapCategory(cat: string): import('./innovation-pulse-types').StoryCategory {
  const v4Category = mapCategoryToV4(cat);
  // Return as StoryCategory - the UI's mapToV4Category will handle display
  // Map V4 back to closest StoryCategory for type compatibility
  const v4ToLegacyMap: Record<V4CategoryName, import('./innovation-pulse-types').StoryCategory> = {
    "Insights & Trends": "Research & Innovation",
    "Case Study": "Infrastructure & Operations",
    "Practical Tips": "Teaching & Learning",
    "Ethical AI": "Policy & Ethics",
    "Latest AI Products": "Tools & Products",
    "Beyond Ed": "Student Experience",
    "Week in Review": "Leadership & Strategy",
  };
  return v4ToLegacyMap[v4Category];
}

// Helper to normalize episode data (handles both old and new V3 formats)
function normalizeEpisode(raw: Record<string, unknown>): InnovationPulseEpisode | null {
  // V3 format has: episode.*, leadStory.*, quickHits[] at top level
  // Old format has: segments.deepDive, segments.quickHits, or top-level deepDive/quickHits

  const episode = raw.episode as Record<string, unknown> | undefined;
  const leadStory = raw.leadStory as Record<string, unknown> | undefined;
  const segments = raw.segments as Record<string, unknown> | undefined;

  // Determine deep dive source (V3: leadStory, old: segments.deepDive or raw.deepDive)
  const rawDeepDive = leadStory || segments?.deepDive as Record<string, unknown> | undefined || raw.deepDive as Record<string, unknown> | undefined;

  // Determine quick hits source (V3: top-level quickHits, old: segments.quickHits or raw.quickHits)
  const rawQuickHits = (raw.quickHits || segments?.quickHits || []) as Record<string, unknown>[];

  if (!rawDeepDive) {
    return null;
  }

  // Extract text fields - handle both formats
  const broadcastScript = (episode?.broadcastScript || raw.broadcastScript) as string || '';

  // V3 format: leadStory.hook, old format: top-level hook
  const hook = (leadStory?.hook || raw.hook || raw.editorialHook) as string || '';

  // V3 format has pullQuote in leadStory
  const pullQuote = (leadStory?.pullQuote) as string || '';

  // Normalize deep dive - handle V3 leadStory fields
  const deepDive: InnovationPulseEpisode['deepDive'] = {
    title: (leadStory?.headline || rawDeepDive.title) as string || '',
    summary: (leadStory?.editorialTake || rawDeepDive.summary || hook || broadcastScript.slice(0, 500)) as string || 'Read the full story for details.',
    source: (rawDeepDive.source) as string || '',
    sourceUrl: (rawDeepDive.sourceUrl) as string || '',
    isCallback: (rawDeepDive.isCallback as boolean) ?? false,
    category: mapCategory((rawDeepDive.category) as string || ''),
    editorialCallout: (rawDeepDive.editorialCallout) as string | undefined,
  };

  // Normalize quick hits - provide defaults for missing fields
  const quickHits: InnovationPulseEpisode['quickHits'] = rawQuickHits.map((hit) => ({
    title: (hit.headline || hit.title) as string || '',
    summary: (hit.summary) as string || 'Read the full story for details.',
    source: (hit.source) as string || '',
    sourceUrl: (hit.sourceUrl) as string || '',
    category: mapCategory((hit.category) as string || ''),
    isCallback: hit.isCallback as boolean | undefined,
  }));

  // Handle editorialLens - V3 has episode.editorialLens (string) or raw.editorialLens (object or string)
  let editorialLens: InnovationPulseEpisode['editorialLens'];
  const rawLens = (episode?.editorialLens || raw.editorialLens) as unknown;
  if (typeof rawLens === 'object' && rawLens !== null && 'name' in rawLens) {
    // Object format with name property
    editorialLens = (rawLens as { name: string }).name as InnovationPulseEpisode['editorialLens'];
  } else if (typeof rawLens === 'string') {
    editorialLens = rawLens as InnovationPulseEpisode['editorialLens'];
  } else {
    // Default fallback
    editorialLens = "The Practitioner's Playbook";
  }

  // Get date/dayOfWeek - V3 has these in episode.*, old format at top level
  const date = (episode?.date || raw.date) as string;
  const dayOfWeek = (episode?.dayOfWeek || raw.dayOfWeek) as string;
  const audioUrl = (episode?.audioUrl || raw.audioUrl) as string || '';
  const audioDuration = (episode?.audioDuration || raw.audioDuration) as string || '';

  // Build the normalized episode with all required fields
  // Use pullQuote for editorialHook if available (V3), otherwise fall back to hook
  const normalizedEpisode: InnovationPulseEpisode = {
    date,
    dayOfWeek,
    editorialLens,
    editorialHook: pullQuote || hook || '',
    audioUrl,
    audioDuration,
    deepDive,
    quickHits,
    storiesWatching: (raw.storiesWatching as InnovationPulseEpisode['storiesWatching']) || [],
    closingThought: (raw.closingThought as string) || '',
    categories: (raw.categories as InnovationPulseEpisode['categories']) ||
      [deepDive.category, ...quickHits.map(q => q.category)].filter((v, i, a) => a.indexOf(v) === i) as InnovationPulseEpisode['categories'],
    themes: ((raw.meta as Record<string, unknown>)?.themes || raw.themes) as string[] || [],
  };

  return normalizedEpisode;
}

// ── Image Assignment ─────────────────────────────────────────────────────────
// Assigns images to all stories in an episode using a SINGLE StoryImageAssigner instance.
// This ensures no duplicate images within the same episode and deterministic assignment.

function assignImagesToEpisode(episode: InnovationPulseEpisode): InnovationPulseEpisode {
  const imageAssigner = new StoryImageAssigner();

  // Assign image to lead story (deepDive) first
  const deepDiveWithImage = {
    ...episode.deepDive,
    image: imageAssigner.getImage(episode.deepDive.title, episode.deepDive.category, episode.date),
  };

  // Assign images to all quickHits
  const quickHitsWithImages = episode.quickHits.map((hit) => ({
    ...hit,
    image: imageAssigner.getImage(hit.title, hit.category, episode.date),
  }));

  return {
    ...episode,
    deepDive: deepDiveWithImage,
    quickHits: quickHitsWithImages,
  };
}

// ── Episode Loading Functions ────────────────────────────────────────────────

export function getAllEpisodes(): InnovationPulseEpisode[] {
  const episodes: InnovationPulseEpisode[] = [];
  const seenDates = new Set<string>();

  // Helper to load episodes from a directory
  const loadFromDir = (dir: string) => {
    try {
      if (!fs.existsSync(dir)) return;
      const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && !f.startsWith('.'));
      for (const file of files) {
        try {
          const content = fs.readFileSync(path.join(dir, file), 'utf-8');
          const raw = JSON.parse(content) as Record<string, unknown>;
          const episode = normalizeEpisode(raw);
          // Skip episodes that couldn't be normalized
          if (!episode) {
            continue;
          }
          // Avoid duplicates - prefer primary source
          if (!seenDates.has(episode.date)) {
            seenDates.add(episode.date);
            // Assign images to all stories in the episode
            episodes.push(assignImagesToEpisode(episode));
          }
        } catch {
          // Skip invalid JSON files
        }
      }
    } catch {
      // Directory doesn't exist or isn't readable
    }
  };

  // Load from primary source first (pipeline-published episodes)
  loadFromDir(PRIMARY_DATA_DIR);
  // Then load legacy data (avoids duplicates via seenDates)
  loadFromDir(LEGACY_DATA_DIR);

  // Sort by date, newest first
  return episodes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getEpisodeByDate(date: string): InnovationPulseEpisode | null {
  // Try primary source first
  try {
    const primaryPath = path.join(PRIMARY_DATA_DIR, `${date}.json`);
    if (fs.existsSync(primaryPath)) {
      const content = fs.readFileSync(primaryPath, 'utf-8');
      const raw = JSON.parse(content) as Record<string, unknown>;
      const episode = normalizeEpisode(raw);
      if (episode) return assignImagesToEpisode(episode);
    }
  } catch { /* continue to fallback */ }

  // Try legacy source
  try {
    const legacyPath = path.join(LEGACY_DATA_DIR, `${date}.json`);
    if (fs.existsSync(legacyPath)) {
      const content = fs.readFileSync(legacyPath, 'utf-8');
      const raw = JSON.parse(content) as Record<string, unknown>;
      const episode = normalizeEpisode(raw);
      if (episode) return assignImagesToEpisode(episode);
    }
  } catch { /* not found */ }

  return null;
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
  image?: string; // Pre-assigned at data load time
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
      image: episode.deepDive.image,
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
        image: hit.image,
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
  image?: string; // Pre-assigned at data load time
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
        image: episode.deepDive.image,
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
          image: hit.image,
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
      image: story.image,
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
      image: story.image,
    });

    if (related.length >= limit) break;
  }

  return related;
}

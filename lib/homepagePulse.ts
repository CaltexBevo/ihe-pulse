import type {
  DeepDive,
  InnovationPulseEpisode,
  QuickHit,
} from './data/innovation-pulse-types';

export type HomepageStory = QuickHit & {
  date: string;
};

type StoryIdentityInput = Pick<DeepDive | QuickHit, 'title' | 'sourceUrl'>;

export function normalizeStoryTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Source URLs are the durable identity. Date plus normalized title is the fallback. */
export function storyIdentity(story: StoryIdentityInput, date: string): string {
  const sourceUrl = story.sourceUrl?.trim().toLowerCase();
  if (sourceUrl) return `source:${sourceUrl}`;
  return `story:${date.trim()}:${normalizeStoryTitle(story.title)}`;
}

export function dedupeStories<T extends StoryIdentityInput & { date: string }>(stories: T[]): T[] {
  const seen = new Set<string>();
  return stories.filter((story) => {
    const identity = storyIdentity(story, story.date);
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

/** Return every current quick hit once, excluding the lead by stable identity. */
export function getHomepageQuickHits(episode: InnovationPulseEpisode): HomepageStory[] {
  const leadIdentity = storyIdentity(episode.deepDive, episode.date);
  const quickHits = episode.quickHits.map((story) => ({ ...story, date: episode.date }));

  return dedupeStories(quickHits).filter(
    (story) => storyIdentity(story, story.date) !== leadIdentity,
  );
}

export function selectPriorEpisodes(
  allEpisodes: InnovationPulseEpisode[],
  count = 3,
): InnovationPulseEpisode[] {
  // The approved August 22–28 homepage lookback begins at August 8–14,
  // leaving the immediately preceding release out of this compact rail.
  const startIndex = 2;
  return allEpisodes.slice(startIndex, startIndex + Math.max(0, count));
}

export function formatEpisodeDateRange(episode: InnovationPulseEpisode): string {
  if (!episode.weekCovered || episode.cadence !== 'weekly') {
    const date = new Date(`${episode.date}T12:00:00`);
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    return `${month} ${date.getDate()}`;
  }

  const [startDate, endDate] = episode.weekCovered.split('/');
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  const startMonth = start.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();

  return startMonth === endMonth
    ? `${startMonth} ${start.getDate()}–${end.getDate()}`
    : `${startMonth} ${start.getDate()} – ${endMonth} ${end.getDate()}`;
}

export function getStoryImage(
  story: { image?: string | null },
  fallback: string | null = null,
): string | null {
  const image = story.image?.trim();
  return image || fallback;
}

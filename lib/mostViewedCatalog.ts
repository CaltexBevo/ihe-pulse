import 'server-only';
import { generateSlug, getAllEpisodes } from './data/innovation-pulse';
import { FEATURED_COVERAGE } from './data/featured-coverage';
import type { RankedArticle } from './mostViewedRanking';

export function getRankingArticleCatalog(): RankedArticle[] {
  // Match route generation and getStoryBySlug's first match without reloading
  // the entire edition archive separately for every individual story.
  const stories = new Map<string, RankedArticle>();
  for (const episode of getAllEpisodes()) {
    for (const story of [episode.deepDive, ...episode.quickHits]) {
      const href = `/innovation-pulse/story/${generateSlug(story.title)}`;
      if (!stories.has(href)) stories.set(href, { href, title: story.title });
    }
  }
  return [...stories.values(), ...FEATURED_COVERAGE.map(feature => ({ href: `/feature-coverage/${feature.slug}`, title: feature.title }))];
}

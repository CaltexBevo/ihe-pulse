import fs from 'node:fs';
import path from 'node:path';

import { FEATURED_COVERAGE } from './data/featured-coverage';
import {
  getAllStorySlugs,
  getEpisodeDates,
  V4_CATEGORIES,
  V4_CATEGORY_SLUGS,
} from './data/innovation-pulse';
import { episodes } from './data/episodes';
import { posts } from './data/posts';
import { PUBLIC_ANALYTICS_STATIC_PATHS } from './engagementTracking';

type AiAppsData = {
  tools?: Array<{ slug?: unknown }>;
};

function addSlugPaths(paths: Set<string>, prefix: string, slugs: readonly unknown[]) {
  for (const slug of slugs) {
    if (typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) continue;
    paths.add(`${prefix}/${slug}`);
  }
}

/**
 * Build the automatic-pageview allowlist from the same finite data that creates
 * public routes. Unknown dynamic identifiers therefore fail closed until they
 * are part of a real published route in this checkout.
 */
export function getPublicAnalyticsPagePaths(): string[] {
  const paths = new Set<string>(PUBLIC_ANALYTICS_STATIC_PATHS);

  addSlugPaths(paths, '/innovation-pulse', getEpisodeDates());
  addSlugPaths(paths, '/innovation-pulse/story', getAllStorySlugs());
  addSlugPaths(
    paths,
    '/innovation-pulse/category',
    V4_CATEGORIES.map((category) => V4_CATEGORY_SLUGS[category]),
  );
  addSlugPaths(paths, '/feature-coverage', FEATURED_COVERAGE.map((feature) => feature.slug));
  addSlugPaths(paths, '/podcast', episodes.map((episode) => episode.slug));
  addSlugPaths(paths, '/tinker-lab', posts.map((post) => post.slug));

  const aiAppsPath = path.join(process.cwd(), 'public', 'data', 'ai-apps.json');
  const aiApps = JSON.parse(fs.readFileSync(aiAppsPath, 'utf8')) as AiAppsData;
  addSlugPaths(paths, '/ai-directory', aiApps.tools?.map((tool) => tool.slug) ?? []);

  return [...paths].sort();
}

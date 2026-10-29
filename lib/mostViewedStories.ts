import 'server-only';
import { unstable_cache } from 'next/cache';
import { collectMostViewed, isCurrentRanking, rankingWindow, type RankedArticle, type VerifiedRanking } from './mostViewedRanking';
import { getRankingArticleCatalog } from './mostViewedCatalog';
import { createRankingMemo, rankingCacheIdentity } from './mostViewedMemo';

// Hour and catalog are cache arguments. Credentials are never arguments/keys.
// Null results are cached too, so missing configuration or provider failures
// cannot cause a query storm. A new hour never serves the prior hour's ranking.
const cachedRanking = unstable_cache(async (since: string, until: string, articles: RankedArticle[], identity: ReturnType<typeof rankingCacheIdentity>) => collectMostViewed({
  articles, window: { since, until }, token: process.env.VERCEL_ANALYTICS_TOKEN,
  project: identity.project, team: identity.team,
  onDiagnostic: diagnostic => console.info('[homepage-ranking]', JSON.stringify(diagnostic)),
}), ['homepage-most-viewed-v1'], { revalidate: 3600 });
const memo = createRankingMemo<VerifiedRanking>();

export async function getMostViewedStories() {
  try {
    const window = rankingWindow();
    const catalog = getRankingArticleCatalog();
    const identity = rankingCacheIdentity({ deploymentId: process.env.VERCEL_DEPLOYMENT_ID, deploymentUrl: process.env.VERCEL_URL,
      project: process.env.VERCEL_ANALYTICS_PROJECT, team: process.env.VERCEL_ANALYTICS_TEAM });
    const result = await memo(JSON.stringify([window, catalog, identity]), Date.parse(window.until) + 1 + 3_600_000,
      () => cachedRanking(window.since, window.until, catalog, identity));
    return isCurrentRanking(result) ? result : null;
  } catch {
    return null;
  }
}

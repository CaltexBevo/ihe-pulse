import 'server-only';

export type RankedArticle = { href: string; title: string };
export type RankingWindow = { since: string; until: string };
export type VerifiedRanking = RankingWindow & { articles: RankedArticle[] };
const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const BATCH_SIZE = 40;
const MAX_BATCHES = 20;
const MAX_BYTES = 65_536;
const ARTICLE_PATH = /^\/(?:innovation-pulse\/story|feature-coverage)\/[a-z0-9-]+$/;

/** Inclusive API endpoints: exactly 30 days ending at the last completed UTC hour. */
export function rankingWindow(now = Date.now()): RankingWindow {
  const end = Math.floor(now / HOUR) * HOUR;
  return { since: new Date(end - 30 * DAY).toISOString(), until: new Date(end - 1).toISOString() };
}

export function isCurrentRanking(result: VerifiedRanking | null, now = Date.now()): result is VerifiedRanking {
  const expected = rankingWindow(now);
  return Boolean(result && result.since === expected.since && result.until === expected.until && result.articles.length === 4);
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function canonicalCatalog(articles: readonly RankedArticle[]): RankedArticle[] {
  const seen = new Set<string>();
  for (const article of articles) {
    if (!ARTICLE_PATH.test(article.href) || !article.title.trim() || seen.has(article.href)) throw new Error('Invalid catalog');
    seen.add(article.href);
  }
  if (articles.length < 4 || articles.length > BATCH_SIZE * MAX_BATCHES) throw new Error('Catalog bounds');
  return [...articles].sort((a, b) => a.href < b.href ? -1 : a.href > b.href ? 1 : 0);
}

function queryUrl(paths: string[], window: RankingWindow, project: string, team: string) {
  const filter = `environment eq 'production' and requestPath in (${paths.map(path => `'${path}'`).join(',')})`;
  const params = new URLSearchParams({ projectId: project, slug: team, by: 'requestPath', ...window, limit: String(BATCH_SIZE), filter });
  return new URL(`https://api.vercel.com/v1/query/web-analytics/visits/aggregate?${params}`);
}

async function boundedJson(response: Response): Promise<unknown> {
  if (!response.ok || !response.body) throw new Error('Unavailable aggregate');
  const length = response.headers.get('content-length');
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_BYTES)) throw new Error('Aggregate bounds');
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) throw new Error('Aggregate bounds');
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
}

function parseBatch(payload: unknown, paths: string[], url: URL): Map<string, number> {
  if (!record(payload) || !Array.isArray(payload.data) || payload.data.length > paths.length) throw new Error('Invalid aggregate');
  // Accept only the documented complete aggregate shape. Unknown completion,
  // error or pagination fields cannot silently turn partial data into a rank.
  if (Object.keys(payload).some(key => !['data', 'query', 'version'].includes(key)) || !record(payload.query)
    || !Number.isSafeInteger(payload.version) || (payload.version as number) < 0) throw new Error('Incomplete aggregate');
  {
    if (!record(payload.query)) throw new Error('Invalid query echo');
    const query = payload.query;
    if (Object.keys(query).some(key => !['since', 'until', 'filter', 'limit', 'groupBy'].includes(key))) throw new Error('Unknown query shape');
    for (const key of ['since', 'until'] as const) {
      if ((typeof query[key] !== 'string' && typeof query[key] !== 'number') || new Date(query[key]).getTime() !== new Date(url.searchParams.get(key)!).getTime()) throw new Error('Window mismatch');
    }
    if (query.filter !== url.searchParams.get('filter')) throw new Error('Filter mismatch');
    if ((typeof query.limit !== 'number' && typeof query.limit !== 'string') || Number(query.limit) !== BATCH_SIZE) throw new Error('Limit mismatch');
    if (!Array.isArray(query.groupBy) || query.groupBy.length !== 1 || query.groupBy[0] !== 'requestPath') throw new Error('Dimension mismatch');
  }
  const allowed = new Set(paths);
  const result = new Map<string, number>();
  for (const row of payload.data) {
    if (!record(row) || typeof row.requestPath !== 'string' || !allowed.has(row.requestPath) || result.has(row.requestPath)
      || !Number.isSafeInteger(row.pageviews) || (row.pageviews as number) < 0
      || (row.environment !== undefined && row.environment !== 'production')) throw new Error('Invalid aggregate row');
    result.set(row.requestPath, row.pageviews as number);
  }
  return result;
}

/** No provider payload, credentials, counts or error details leave this boundary. */
export async function collectMostViewed(input: {
  articles: readonly RankedArticle[];
  window: RankingWindow;
  token?: string;
  project?: string;
  team?: string;
  fetcher?: typeof fetch;
  now?: () => number;
  timeoutMs?: number;
}): Promise<VerifiedRanking | null> {
  if (!input.token?.trim()) return null;
  const now = input.now ?? Date.now;
  const expected = rankingWindow(now());
  if (input.window.since !== expected.since || input.window.until !== expected.until) return null;
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const articles = canonicalCatalog(input.articles);
    const batches: RankedArticle[][] = [];
    for (let start = 0; start < articles.length; start += BATCH_SIZE) batches.push(articles.slice(start, start + BATCH_SIZE));
    const counts = new Map<string, number>();
    let next = 0;
    const work = async () => {
      while (next < batches.length && !controller.signal.aborted) {
        const batch = batches[next++];
        const paths = batch.map(article => article.href);
        const url = queryUrl(paths, input.window, input.project || 'ihe-pulse', input.team || 'brents-projects-eaca52c7');
        const response = await (input.fetcher ?? fetch)(url, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${input.token}` },
          cache: 'no-store', signal: controller.signal, redirect: 'error',
        });
        const rows = parseBatch(await boundedJson(response), paths, url);
        for (const [path, views] of rows) counts.set(path, views);
      }
    };
    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(() => { controller.abort(); reject(new Error('Aggregate timeout')); }, Math.min(input.timeoutMs ?? 12_000, 12_000));
    });
    await Promise.race([Promise.all(Array.from({ length: Math.min(3, batches.length) }, work)), deadline]);
    const positive = articles.filter(article => (counts.get(article.href) ?? 0) > 0);
    positive.sort((a, b) => counts.get(b.href)! - counts.get(a.href)! || (a.href < b.href ? -1 : a.href > b.href ? 1 : 0));
    const result = { ...input.window, articles: positive.slice(0, 4) };
    return isCurrentRanking(result, now()) ? result : null;
  } catch {
    return null;
  } finally {
    if (timer) clearTimeout(timer);
    controller.abort();
  }
}

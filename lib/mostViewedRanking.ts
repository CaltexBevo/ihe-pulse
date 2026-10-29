import 'server-only';

export type RankedArticle = { href: string; title: string };
export type RankingWindow = { since: string; until: string };
export type VerifiedRanking = RankingWindow & { articles: RankedArticle[] };
type DiagnosticCode = 'success' | 'missing_config' | 'stale_window' | 'catalog' | 'http_status' | 'body' | 'body_bounds' | 'json' | 'shape' | 'version' | 'query_shape' | 'query_window' | 'query_filter' | 'query_limit' | 'query_dimension' | 'rows' | 'timeout' | 'network' | 'insufficient_positive';
type SafeType = 'missing' | 'null' | 'array' | 'object' | 'string' | 'number' | 'boolean' | 'other';
type ProviderCode = 'invalid_query' | 'bad_request' | 'not_found' | 'forbidden' | 'unauthorized' | 'unknown';
type ProviderParameter = 'since' | 'until' | 'by' | 'limit' | 'filter' | 'projectId' | 'unknown';
const ERROR_TERMS = ['invalid', 'filter', 'expression', 'syntax', 'parse', 'unexpected', 'unsupported', 'operator', 'function', 'property', 'dimension', 'type', 'string', 'object', 'array', 'json', 'length', 'maximum', 'limit', 'character', 'too', 'many', 'complex', 'query', 'must', 'production', 'environment', 'requestPath', 'by', 'eq', 'or', 'and', 'in', 'not', 'allowed', 'format'] as const;
type DiagnosticDetails = {
  httpStatus?: number; dataType?: SafeType; queryType?: SafeType; versionType?: SafeType; extraFields?: boolean;
  providerCode?: ProviderCode; providerParameter?: ProviderParameter;
  mentionsBy?: boolean; mentionsFilter?: boolean; mentionsWindow?: boolean; mentionsProject?: boolean;
  terms?: Array<typeof ERROR_TERMS[number]>;
  sinceType?: SafeType; untilType?: SafeType; actualSince?: string; actualUntil?: string;
};
export type RankingDiagnostic = DiagnosticDetails & RankingWindow & {
  code: DiagnosticCode; batches: number; completedBatches: number; rows: number;
  top?: Array<{ href: string; pageViews: number }>;
};
class RankingFailure extends Error {
  readonly code: DiagnosticCode;
  readonly details: DiagnosticDetails;
  constructor(code: DiagnosticCode, details: DiagnosticDetails = {}) { super(code); this.code = code; this.details = details; }
}
function safeType(value: unknown): SafeType {
  if (value === undefined) return 'missing';
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  const type = typeof value;
  return type === 'object' || type === 'string' || type === 'number' || type === 'boolean' ? type : 'other';
}
const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const REPORT_LIMIT = 100;
const MAX_ARTICLES = 800;
const MAX_BYTES = 65_536;
const ARTICLE_PATH = /^\/(?:innovation-pulse\/story|feature-coverage)\/[a-z0-9-]+$/;

/** Inclusive 30-day request ending before the current UTC hour. Vercel
 * converts that requested hour into an exclusive next-hour query echo. */
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

/** Only exact date/ISO representations or Unix milliseconds, never seconds,
 * locale prose, coercible objects or arbitrary provider strings. */
export function normalizeProviderDate(value: unknown): string | null {
  let timestamp: number;
  if (typeof value === 'number' && Number.isSafeInteger(value)) timestamp = value;
  else if (typeof value === 'string' && /^\d{13}$/.test(value)) timestamp = Number(value);
  else if (typeof value === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(?:Z|[+-](\d{2}):(\d{2})))?$/.exec(value);
    if (!match) return null;
    const [, year, month, day, hour, minute, second, offsetHour, offsetMinute] = match;
    const daysInMonth = new Date(Date.UTC(Number(year), Number(month), 0)).getUTCDate();
    if (Number(month) < 1 || Number(month) > 12 || Number(day) < 1 || Number(day) > daysInMonth
      || Number(hour ?? 0) > 23 || Number(minute ?? 0) > 59 || Number(second ?? 0) > 59
      || Number(offsetHour ?? 0) > 23 || Number(offsetMinute ?? 0) > 59) return null;
    timestamp = Date.parse(value);
  } else return null;
  if (!Number.isFinite(timestamp) || timestamp < Date.UTC(2000, 0, 1) || timestamp >= Date.UTC(2101, 0, 1)) return null;
  return new Date(timestamp).toISOString();
}

function canonicalCatalog(articles: readonly RankedArticle[]): RankedArticle[] {
  const seen = new Set<string>();
  for (const article of articles) {
    if (!ARTICLE_PATH.test(article.href) || !article.title.trim() || seen.has(article.href)) throw new RankingFailure('catalog');
    seen.add(article.href);
  }
  if (articles.length < 4 || articles.length > MAX_ARTICLES) throw new RankingFailure('catalog');
  return [...articles].sort((a, b) => a.href < b.href ? -1 : a.href > b.href ? 1 : 0);
}

function articlePartitions(articles: readonly RankedArticle[]): string[] {
  const prefixes = new Set<string>();
  for (const article of articles) {
    if (article.href.startsWith('/feature-coverage/')) prefixes.add('/feature-coverage/');
    else {
      const first = article.href.slice('/innovation-pulse/story/'.length, '/innovation-pulse/story/'.length + 1);
      if (!/^[a-z0-9]$/.test(first)) throw new RankingFailure('catalog');
      prefixes.add(`/innovation-pulse/story/${first}`);
    }
  }
  if (prefixes.size > 37) throw new RankingFailure('catalog');
  const partitions = [...prefixes].sort();
  if (articles.some(article => partitions.filter(prefix => article.href.startsWith(prefix)).length !== 1)) throw new RankingFailure('catalog');
  return partitions;
}

function queryUrl(window: RankingWindow, project: string, team: string, prefix: string) {
  const filter = `environment eq 'production' and startswith(requestPath,'${prefix}')`;
  const params = new URLSearchParams({ projectId: project, slug: team, by: 'requestPath', ...window, limit: String(REPORT_LIMIT), filter });
  return new URL(`https://api.vercel.com/v1/query/web-analytics/visits/aggregate?${params}`);
}

function providerFailureDetails(payload: unknown): DiagnosticDetails {
  // Only the documented-style error object is inspected. Unknown schemas and
  // values stay unknown; neither messages nor arbitrary object keys are logged.
  const error = record(payload) && record(payload.error) ? payload.error : null;
  if (!error) return { providerCode: 'unknown', providerParameter: 'unknown' };
  const codes: readonly string[] = ['invalid_query', 'bad_request', 'not_found', 'forbidden', 'unauthorized'];
  const parameters: readonly string[] = ['since', 'until', 'by', 'limit', 'filter', 'projectId'];
  const providerCode: ProviderCode = typeof error.code === 'string' && codes.includes(error.code) ? error.code as ProviderCode : 'unknown';
  const parameter = error.parameter ?? error.param;
  const providerParameter: ProviderParameter = typeof parameter === 'string' && parameters.includes(parameter) ? parameter as ProviderParameter : 'unknown';
  const message = typeof error.message === 'string' && error.message.length <= 2048 ? error.message : '';
  const terms = (message.match(/[A-Za-z][A-Za-z0-9_]*/g) ?? []).flatMap(word => {
    const term = ERROR_TERMS.find(candidate => candidate.toLowerCase() === word.toLowerCase());
    return term ? [term] : [];
  }).slice(0, 40);
  return {
    providerCode, providerParameter, terms,
    mentionsBy: /\bby\b/i.test(message),
    mentionsFilter: /\bfilter\b/i.test(message),
    mentionsWindow: /\b(?:since|until|window|date range)\b/i.test(message),
    mentionsProject: /\b(?:projectId|project)\b/i.test(message),
  };
}

async function boundedJson(response: Response): Promise<unknown> {
  if (!response.ok) {
    let details: DiagnosticDetails = { providerCode: 'unknown', providerParameter: 'unknown' };
    try { details = providerFailureDetails(await readBoundedJson(response)); } catch { /* Status survives invalid or oversized error bodies. */ }
    throw new RankingFailure('http_status', { httpStatus: response.status, ...details });
  }
  return readBoundedJson(response);
}

async function readBoundedJson(response: Response): Promise<unknown> {
  if (!response.body) throw new RankingFailure('body');
  const length = response.headers.get('content-length');
  if (length !== null && (!/^\d+$/.test(length) || Number(length) > MAX_BYTES)) throw new RankingFailure('body_bounds');
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) throw new RankingFailure('body_bounds');
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes)); }
  catch { throw new RankingFailure('json'); }
}

function parseReport(payload: unknown, url: URL, prefix: string): Map<string, number> {
  if (!record(payload)) throw new RankingFailure('shape');
  const details = { dataType: safeType(payload.data), queryType: safeType(payload.query), versionType: safeType(payload.version) };
  if (!Array.isArray(payload.data) || payload.data.length > REPORT_LIMIT) throw new RankingFailure('shape', details);
  // Accept only the documented complete aggregate shape. Unknown completion,
  // error or pagination fields cannot silently turn partial data into a rank.
  const extraFields = Object.keys(payload).some(key => !['data', 'query', 'version'].includes(key));
  if (extraFields || !record(payload.query)) throw new RankingFailure('shape', { ...details, extraFields });
  if (!Number.isSafeInteger(payload.version) || (payload.version as number) < 0) throw new RankingFailure('version', details);
  {
    if (!record(payload.query)) throw new RankingFailure('query_shape', details);
    const query = payload.query;
    if (Object.keys(query).some(key => !['since', 'until', 'filter', 'limit', 'groupBy'].includes(key))) throw new RankingFailure('query_shape', { extraFields: true });
    const actualSince = normalizeProviderDate(query.since);
    const actualUntil = normalizeProviderDate(query.until);
    // Observed provider contract: the requested until hour is inclusive and
    // echoed as its exact exclusive next-hour boundary. No tolerance is used.
    const requestedUntil = Date.parse(url.searchParams.get('until')!);
    const expectedExclusiveUntil = new Date(Math.floor(requestedUntil / HOUR) * HOUR + HOUR).toISOString();
    if (actualSince !== url.searchParams.get('since') || actualUntil !== expectedExclusiveUntil) {
      throw new RankingFailure('query_window', { sinceType: safeType(query.since), untilType: safeType(query.until),
        ...(actualSince ? { actualSince } : {}), ...(actualUntil ? { actualUntil } : {}) });
    }
    if (query.filter !== url.searchParams.get('filter')) throw new RankingFailure('query_filter');
    if ((typeof query.limit !== 'number' && typeof query.limit !== 'string') || Number(query.limit) !== REPORT_LIMIT) throw new RankingFailure('query_limit');
    if (!Array.isArray(query.groupBy) || query.groupBy.length !== 1 || query.groupBy[0] !== 'requestPath') throw new RankingFailure('query_dimension');
  }
  const result = new Map<string, number>();
  for (const row of payload.data) {
    if (!record(row) || typeof row.requestPath !== 'string' || row.requestPath.length > 2048
      || !/^\/[^\s?#\u0000-\u001f\u007f]*$/.test(row.requestPath) || !row.requestPath.startsWith(prefix) || result.has(row.requestPath)
      || !Number.isSafeInteger(row.pageviews) || (row.pageviews as number) < 0
      || (row.environment !== undefined && row.environment !== 'production')) throw new RankingFailure('rows');
    result.set(row.requestPath, row.pageviews as number);
  }
  return result;
}

/** Public return contains no provider data. Optional server diagnostics emit
 * only fixed codes/types and validated aggregate success evidence. */
export async function collectMostViewed(input: {
  articles: readonly RankedArticle[];
  window: RankingWindow;
  token?: string;
  project?: string;
  team?: string;
  fetcher?: typeof fetch;
  now?: () => number;
  timeoutMs?: number;
  onDiagnostic?: (diagnostic: RankingDiagnostic) => void;
}): Promise<VerifiedRanking | null> {
  const now = input.now ?? Date.now;
  const expected = rankingWindow(now());
  let batchesCount = 0; let completedBatches = 0; let rowCount = 0;
  const report = (code: DiagnosticCode, details: DiagnosticDetails = {}, top?: RankingDiagnostic['top']) => {
    try { input.onDiagnostic?.({ code, ...expected, batches: batchesCount, completedBatches, rows: rowCount, ...details, ...(top ? { top } : {}) }); } catch { /* Diagnostics never alter collection. */ }
  };
  if (!input.token?.trim()) { report('missing_config'); return null; }
  if (input.window.since !== expected.since || input.window.until !== expected.until) { report('stale_window'); return null; }
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const articles = canonicalCatalog(input.articles);
    const partitions = articlePartitions(articles);
    batchesCount = partitions.length;
    const counts = new Map<string, number>();
    const canonical = new Set(articles.map(article => article.href));
    const seen = new Set<string>();
    let next = 0;
    const work = async () => {
      while (next < partitions.length && !controller.signal.aborted) {
        const prefix = partitions[next++];
        const url = queryUrl(input.window, input.project || 'ihe-pulse', input.team || 'brents-projects-eaca52c7', prefix);
        const response = await (input.fetcher ?? fetch)(url, {
          headers: { Accept: 'application/json', Authorization: `Bearer ${input.token}` },
          cache: 'no-store', signal: controller.signal, redirect: 'error',
        });
        const rows = parseReport(await boundedJson(response), url, prefix);
        completedBatches++; rowCount += rows.size;
        for (const [path, views] of rows) {
          if (seen.has(path)) throw new RankingFailure('rows');
          seen.add(path);
          if (canonical.has(path)) counts.set(path, views);
        }
      }
    };
    const deadline = new Promise<never>((_, reject) => {
      timer = setTimeout(() => { controller.abort(); reject(new RankingFailure('timeout')); }, Math.min(input.timeoutMs ?? 12_000, 12_000));
    });
    await Promise.race([Promise.all(Array.from({ length: Math.min(3, partitions.length) }, work)), deadline]);
    const positive = articles.filter(article => (counts.get(article.href) ?? 0) > 0);
    positive.sort((a, b) => counts.get(b.href)! - counts.get(a.href)! || (a.href < b.href ? -1 : a.href > b.href ? 1 : 0));
    const result = { ...input.window, articles: positive.slice(0, 4) };
    if (positive.length < 4) { report('insufficient_positive'); return null; }
    if (!isCurrentRanking(result, now())) { report('stale_window'); return null; }
    const top = result.articles.every(article => article.href.length <= 240)
      ? result.articles.map(article => ({ href: article.href, pageViews: counts.get(article.href)! })) : undefined;
    report('success', {}, top);
    return result;
  } catch (error) {
    if (error instanceof RankingFailure) report(error.code, error.details);
    else report(controller.signal.aborted ? 'timeout' : 'network');
    return null;
  } finally {
    if (timer) clearTimeout(timer);
    controller.abort();
  }
}

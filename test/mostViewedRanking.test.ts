import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { collectMostViewed, rankingWindow, isCurrentRanking, type RankedArticle, type RankingDiagnostic } from '../lib/mostViewedRanking.ts';
import { getRankingArticleCatalog } from '../lib/mostViewedCatalog.ts';
import { getAllStorySlugs } from '../lib/data/innovation-pulse.ts';
import { FEATURED_COVERAGE } from '../lib/data/featured-coverage.ts';
import { createRankingMemo, rankingCacheIdentity } from '../lib/mostViewedMemo.ts';

const instant = Date.parse('2026-10-29T17:34:00Z');
const window = rankingWindow(instant);
const articles: RankedArticle[] = Array.from({ length: 85 }, (_, i) => ({
  href: `${i % 2 ? '/feature-coverage' : '/innovation-pulse/story'}/article-${String(i).padStart(3, '0')}`, title: `Canonical title ${i}`,
}));
type Row = { requestPath: string; pageviews: unknown; visitors?: number; title?: string; environment?: string };
function fixture(rows: (paths: string[]) => Row[] = paths => paths.map(path => ({ requestPath: path, pageviews: 1 }))) {
  const urls: URL[] = [];
  const fetcher: typeof fetch = async (input, init) => {
    const url = new URL(String(input)); urls.push(url);
    assert.equal(url.origin, 'https://api.vercel.com');
    assert.equal(url.searchParams.get('by'), 'requestPath');
    assert.equal(url.searchParams.get('limit'), '40');
    assert.equal(init?.redirect, 'error');
    assert.equal(init?.cache, 'no-store');
    const filter = url.searchParams.get('filter')!;
    const paths = [...filter.matchAll(/requestPath eq '(\/(?:innovation-pulse\/story|feature-coverage)\/[^']+)'/g)].map(match => match[1]);
    assert.doesNotMatch(filter, /requestPath\s+in\s*\(/);
    assert.equal(filter, `environment eq 'production' and (${paths.map(path => `requestPath eq '${path}'`).join(' or ')})`);
    assert.ok(paths.length > 0);
    assert.ok(paths.length <= 40);
    return Response.json({ version: 1, data: rows(paths), query: { since: window.since, until: window.until, groupBy: ['requestPath'], limit: 40, filter: url.searchParams.get('filter') } });
  };
  return { urls, fetcher };
}
function collect(fetcher: typeof fetch, overrides: Partial<Parameters<typeof collectMostViewed>[0]> = {}) {
  return collectMostViewed({ articles, window, token: 'test-token-not-a-credential', now: () => instant, fetcher, ...overrides });
}

test('uses an exact inclusive 30-day completed-hour UTC window', () => {
  assert.deepEqual(window, { since: '2026-09-29T17:00:00.000Z', until: '2026-10-29T16:59:59.999Z' });
  assert.equal(Date.parse(window.until) - Date.parse(window.since) + 1, 30 * 24 * 3600000);
});

test('queries every article across bounded batches and globally ranks views, not visitors', async () => {
  const source = fixture(paths => paths.map(path => ({ requestPath: path, pageviews: Number(path.slice(-3)) + 1, visitors: 1000 - Number(path.slice(-3)), title: 'Untrusted provider title' })));
  const result = await collect(source.fetcher);
  assert.equal(source.urls.length, 3);
  const queried = source.urls.flatMap(url => [...url.searchParams.get('filter')!.matchAll(/requestPath eq '(\/[^']+)'/g)].map(match => match[1]));
  assert.equal(new Set(queried).size, 85);
  assert.deepEqual(result?.articles, [84, 83, 82, 81].map(index => articles[index]));
  assert.deepEqual(Object.keys(result!).sort(), ['articles', 'since', 'until']);
  assert.ok(!JSON.stringify(result).includes('pageviews'));
  assert.ok(!JSON.stringify(result).includes('visitors'));
});

test('ties use canonical path and provider ordering cannot change them', async () => {
  const result = await collect(fixture(paths => paths.reverse().map(path => ({ requestPath: path, pageviews: 10 }))).fetcher);
  assert.deepEqual(result?.articles, [...articles].sort((a, b) => a.href < b.href ? -1 : 1).slice(0, 4));
});

test('missing and zero rows do not become ranked articles; fewer than four positives fails closed', async () => {
  const selected = articles.slice(0, 3).map(article => article.href);
  assert.equal(await collect(fixture(paths => paths.filter(path => selected.includes(path)).map(path => ({ requestPath: path, pageviews: 10 }))).fetcher), null);
  assert.equal(await collect(fixture(paths => paths.map(path => ({ requestPath: path, pageviews: 0 }))).fetcher), null);
});

for (const [name, transform] of [
  ['unknown path', () => [{ requestPath: '/innovation-pulse/story/unknown', pageviews: 10 }]],
  ['Other bucket', () => [{ requestPath: 'Others', pageviews: 10 }]],
  ['duplicate path', (paths: string[]) => [{ requestPath: paths[0], pageviews: 10 }, { requestPath: paths[0], pageviews: 20 }]],
  ['negative views', (paths: string[]) => [{ requestPath: paths[0], pageviews: -1 }]],
  ['fractional views', (paths: string[]) => [{ requestPath: paths[0], pageviews: 0.5 }]],
  ['string views', (paths: string[]) => [{ requestPath: paths[0], pageviews: '10' }]],
  ['missing views', (paths: string[]) => [{ requestPath: paths[0], pageviews: undefined }]],
  ['unsafe views', (paths: string[]) => [{ requestPath: paths[0], pageviews: Number.MAX_SAFE_INTEGER + 1 }]],
  ['wrong environment', (paths: string[]) => [{ requestPath: paths[0], pageviews: 10, environment: 'preview' }]],
] as const) {
  test(`rejects ${name} instead of publishing a partial ranking`, async () => {
    assert.equal(await collect(fixture(transform).fetcher), null);
  });
}

test('one unsuccessful batch invalidates all successful batches', async () => {
  const source = fixture(); let calls = 0;
  assert.equal(await collect(async (url, init) => ++calls === 2 ? new Response('', { status: 401 }) : source.fetcher(url, init)), null);
});

test('every actual published Pulse and Feature route is queried, including generated trailing hyphens', async () => {
  const catalog = getRankingArticleCatalog();
  assert.equal(catalog.length, new Set(getAllStorySlugs()).size + FEATURED_COVERAGE.length);
  assert.ok(catalog.some(article => article.href.endsWith('-')));
  const source = fixture();
  const result = await collect(source.fetcher, { articles: catalog });
  assert.equal(result?.articles.length, 4);
  const queried = source.urls.flatMap(url => [...url.searchParams.get('filter')!.matchAll(/requestPath eq '(\/[^']+)'/g)].map(match => match[1]));
  assert.deepEqual(new Set(queried), new Set(catalog.map(article => article.href)));
});

test('explicit truncation, pagination, errors and absent query evidence reject otherwise valid positive rows', async () => {
  for (const extra of [{ truncated: true }, { hasMore: true }, { nextCursor: 'next' }, { error: 'partial' }, { complete: false }, { pagination: { next: 'next' } }]) {
    const source = fixture();
    assert.equal(await collect(async (url, init) => {
      const payload = await (await source.fetcher(url, init)).json();
      return Response.json({ ...payload, ...extra });
    }), null);
  }
  assert.equal(await collect(async () => Response.json({ data: articles.slice(0, 4).map(article => ({ requestPath: article.href, pageviews: 10 })) })), null);
});

test('rejects malformed JSON, oversized response and mismatched query echoes', async () => {
  const invalid: typeof fetch[] = [
    async () => new Response('{'),
    async () => new Response('x'.repeat(65537)),
    async () => Response.json({ data: [], query: { until: '2020-01-01' } }),
    async () => Response.json({ data: [], query: { groupBy: ['route'] } }),
    async () => Response.json({ data: [], query: { filter: "environment eq 'preview'" } }),
    async () => Response.json({ data: [], query: { limit: 10 } }),
    async () => Response.json({ data: null }),
  ];
  for (const fetcher of invalid) assert.equal(await collect(fetcher), null);
});

test('no token and stale window never issue a query; stale cached result is unusable', async () => {
  let calls = 0; const fetcher: typeof fetch = async () => { calls++; return Response.json({ data: [] }); };
  assert.equal(await collect(fetcher, { token: undefined }), null);
  assert.equal(await collect(fetcher, { window: rankingWindow(instant - 3600000) }), null);
  assert.equal(calls, 0);
  assert.equal(isCurrentRanking({ ...window, articles: articles.slice(0, 4) }, instant + 3600000), false);
});

test('timeout bounds even an unresponsive provider and aborts outstanding requests', async () => {
  let signal: AbortSignal | null | undefined;
  const fetcher: typeof fetch = async (_, init) => { signal = init?.signal; return new Promise(() => {}); };
  assert.equal(await collect(fetcher, { timeoutMs: 15 }), null);
  assert.equal(signal?.aborted, true);
});

test('hour rollover during collection fails closed', async () => {
  let tick = 0;
  assert.equal(await collect(fixture().fetcher, { now: () => instant + (tick++ ? 3600000 : 0) }), null);
});

test('catalog excludes nonarticle routes and duplicates; excessive catalog cannot exceed query budget', async () => {
  for (const invalid of [
    [...articles, articles[0]],
    [...articles, { href: '/innovation-pulse/2026-10-16', title: 'Edition' }],
    [...articles, { href: '/api/private', title: 'Not public' }],
    Array.from({ length: 801 }, (_, i) => ({ href: `/feature-coverage/story-${i}`, title: 'Story' })),
  ]) {
    const source = fixture(); assert.equal(await collect(source.fetcher, { articles: invalid }), null); assert.equal(source.urls.length, 0);
  }
});

test('server integration caches unavailable results without credential keys and retains truthful fallback', () => {
  const server = readFileSync(new URL('../lib/mostViewedStories.ts', import.meta.url), 'utf8');
  const component = readFileSync(new URL('../app/homepage/MoreStoriesToExplore.tsx', import.meta.url), 'utf8');
  assert.match(server, /^import 'server-only'/);
  assert.match(server, /revalidate: 3600/);
  assert.match(server, /cachedRanking\(window.since, window.until, catalog, identity\)/);
  assert.doesNotMatch(server, /NEXT_PUBLIC/);
  assert.match(server, /onDiagnostic: diagnostic => console.info\('\[homepage-ranking\]', JSON.stringify\(diagnostic\)\)/);
  assert.match(component, /if \(ranking\) return/);
  assert.match(component, /More Stories to Explore/);
  assert.match(component, /From the story archive/);
  const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
  assert.match(page, /Suspense fallback=\{<ArchiveStoriesSidebar \/>\}/);
});

test('diagnostics emit one bounded success summary with only canonical top-four paths and views', async () => {
  const diagnostics: RankingDiagnostic[] = [];
  const result = await collect(fixture().fetcher, { onDiagnostic: item => diagnostics.push(item) });
  assert.equal(diagnostics.length, 1);
  assert.equal(diagnostics[0].code, 'success');
  assert.equal(diagnostics[0].batches, 3);
  assert.equal(diagnostics[0].completedBatches, 3);
  assert.equal(diagnostics[0].rows, 85);
  assert.deepEqual(diagnostics[0].top, result!.articles.map(article => ({ href: article.href, pageViews: 1 })));
  assert.deepEqual(Object.keys(diagnostics[0]).sort(), ['batches', 'code', 'completedBatches', 'rows', 'since', 'top', 'until']);
  assert.ok(JSON.stringify(diagnostics).length < 1500);
});

test('failure diagnostics never disclose token, provider content, unknown keys or thrown error text', async () => {
  const sensitive = 'SECRET_OR_PRIVATE_CONTENT_SENTINEL';
  const base = fixture();
  const cases: Array<[typeof fetch, RankingDiagnostic['code']]> = [
    [async () => new Response(sensitive, { status: 401, statusText: sensitive }), 'http_status'],
    [async () => { throw new Error(sensitive); }, 'network'],
    [async () => new Response(sensitive), 'json'],
    [async (url, init) => { const payload = await (await base.fetcher(url, init)).json(); return Response.json({ ...payload, [sensitive]: sensitive }); }, 'shape'],
    [async (url, init) => { const payload = await (await base.fetcher(url, init)).json(); return Response.json({ ...payload, version: sensitive }); }, 'version'],
    [async (url, init) => { const payload = await (await base.fetcher(url, init)).json(); payload.query.filter = sensitive; return Response.json(payload); }, 'query_filter'],
    [async (url, init) => { const payload = await (await base.fetcher(url, init)).json(); payload.data[0].requestPath = sensitive; return Response.json(payload); }, 'rows'],
  ];
  for (const [fetcher, code] of cases) {
    const diagnostics: RankingDiagnostic[] = [];
    assert.equal(await collect(fetcher, { token: sensitive, onDiagnostic: item => diagnostics.push(item) }), null);
    assert.equal(diagnostics.length, 1);
    assert.equal(diagnostics[0].code, code);
    assert.equal(diagnostics[0].top, undefined);
    assert.ok(!JSON.stringify(diagnostics).includes(sensitive));
    assert.ok(JSON.stringify(diagnostics).length < 500);
    if (code === 'http_status') assert.equal(diagnostics[0].httpStatus, 401);
    if (code === 'version') assert.equal(diagnostics[0].versionType, 'string');
  }
});

test('missing configuration, stale windows and timeout produce one honest unavailable summary', async () => {
  for (const [overrides, code] of [
    [{ token: undefined }, 'missing_config'],
    [{ window: rankingWindow(instant - 3600000) }, 'stale_window'],
    [{ timeoutMs: 10, fetcher: async () => new Promise<Response>(() => {}) }, 'timeout'],
  ] as const) {
    const diagnostics: RankingDiagnostic[] = [];
    assert.equal(await collect(fixture().fetcher, { ...overrides, onDiagnostic: item => diagnostics.push(item) }), null);
    assert.equal(diagnostics.length, 1); assert.equal(diagnostics[0].code, code);
  }
  assert.ok(await collect(fixture().fetcher, { onDiagnostic: () => { throw new Error('logger failed'); } }));
});

test('HTTP error bodies expose only allowlisted provider classifications and fixed mention flags', async () => {
  const sensitive = 'SECRET_OR_PRIVATE_CONTENT_SENTINEL';
  const cases = [
    { error: { code: 'invalid_query', parameter: 'by', message: `Invalid by and filter for since until projectId ${sensitive}` } },
    { error: { code: sensitive, param: sensitive, message: sensitive, [sensitive]: sensitive } },
    { unexpected: { code: sensitive, message: sensitive } },
  ];
  for (let i = 0; i < cases.length; i++) {
    const diagnostics: RankingDiagnostic[] = [];
    assert.equal(await collect(async () => Response.json(cases[i], { status: 400 }), { onDiagnostic: item => diagnostics.push(item) }), null);
    assert.equal(diagnostics.length, 1);
    const diagnostic = diagnostics[0];
    assert.equal(diagnostic.code, 'http_status'); assert.equal(diagnostic.httpStatus, 400);
    assert.equal(diagnostic.providerCode, i === 0 ? 'invalid_query' : 'unknown');
    assert.equal(diagnostic.providerParameter, i === 0 ? 'by' : 'unknown');
    if (i === 0) {
      assert.equal(diagnostic.mentionsBy, true); assert.equal(diagnostic.mentionsFilter, true);
      assert.equal(diagnostic.mentionsWindow, true); assert.equal(diagnostic.mentionsProject, true);
    }
    assert.ok(!JSON.stringify(diagnostic).includes(sensitive));
    assert.ok(JSON.stringify(diagnostic).length < 600);
  }
});

test('oversized and non-JSON HTTP error bodies retain status without exposing body content', async () => {
  for (const body of ['private non-JSON provider failure', 'x'.repeat(65537)]) {
    const diagnostics: RankingDiagnostic[] = [];
    assert.equal(await collect(async () => new Response(body, { status: 400 }), { onDiagnostic: item => diagnostics.push(item) }), null);
    assert.equal(diagnostics.length, 1); assert.equal(diagnostics[0].httpStatus, 400);
    assert.equal(diagnostics[0].providerCode, 'unknown');
    assert.ok(!JSON.stringify(diagnostics).includes(body));
  }
});

test('same-hour deployment or project changes cannot reuse a previous unavailable cache entry', async () => {
  const memo = createRankingMemo(() => 0); let calls = 0;
  const load = async () => { calls++; return null; };
  const first = rankingCacheIdentity({ deploymentId: 'deployment-one' });
  assert.deepEqual(first, { deployment: 'deployment-one', project: 'ihe-pulse', team: 'brents-projects-eaca52c7' });
  await memo(JSON.stringify(first), 100, load);
  await memo(JSON.stringify(first), 100, load);
  await memo(JSON.stringify(rankingCacheIdentity({ deploymentId: 'deployment-two' })), 100, load);
  await memo(JSON.stringify(rankingCacheIdentity({ deploymentId: 'deployment-two', project: 'other-project' })), 100, load);
  assert.equal(calls, 3);
  assert.equal(rankingCacheIdentity({ deploymentUrl: 'deployment.example' }).deployment, 'deployment.example');
  assert.equal(rankingCacheIdentity({}).deployment, 'local');
});

test('concurrent cold misses share one load, null is cached, next hour can refresh', async () => {
  let clock = 10; let calls = 0;
  const memo = createRankingMemo(() => clock);
  const load = async () => { calls++; return null; };
  const requests = Array.from({ length: 20 }, () => memo('hour-one', 20, load));
  assert.ok(requests.every(request => request === requests[0]));
  assert.deepEqual(await Promise.all(requests), Array(20).fill(null));
  assert.equal(await memo('hour-one', 20, load), null);
  assert.equal(calls, 1);
  clock = 20;
  assert.equal(await memo('hour-two', 30, load), null);
  assert.equal(calls, 2);
});

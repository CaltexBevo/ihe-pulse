import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import test from 'node:test';
const require = createRequire(import.meta.url);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ts = require('typescript');
const root = resolve(import.meta.dirname, '..');
const cache = new Map();
function load(filename) {
 if (cache.has(filename)) return cache.get(filename);
 const output = ts.transpileModule(readFileSync(filename, 'utf8'), { fileName: filename, compilerOptions: { esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
 const mod = { exports: {} };
 const localRequire = specifier => {
  if (specifier.endsWith('.module.css')) return new Proxy({}, { get: (_, key) => key === '__esModule' ? false : key });
  if (specifier.startsWith('.') || specifier.startsWith('@/')) {
   const base = specifier.startsWith('@/') ? resolve(root, specifier.slice(2)) : resolve(filename, '..', specifier);
   if (base.endsWith('.json')) return JSON.parse(readFileSync(base, 'utf8'));
   const path = [`${base}.ts`, `${base}.tsx`, base].find(existsSync);
   if (path) return load(path);
  }
  return createRequire(filename)(specifier);
 };
 new Function('require', 'module', 'exports', output)(localRequire, mod, mod.exports);
 cache.set(filename, mod.exports);
 return mod.exports;
}

const { ImageConfigContext } = require('next/dist/shared/lib/image-config-context.shared-runtime');
const { imageConfigDefault } = require('next/dist/shared/lib/image-config');
const imageConfig = { ...imageConfigDefault, ...load(resolve(root, 'next.config.ts')).default.images };
const render = tree => renderToStaticMarkup(React.createElement(ImageConfigContext.Provider, { value: imageConfig }, tree));
const attr = (html, name) => html.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1].replaceAll('&amp;', '&');
const images = html => [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
const viewports = [320, 390, 639, 640, 767, 768, 799, 800, 1023, 1024, 1099, 1100, 1199, 1200, 1399, 1400, 1440, 1920];
const gutter = width => Math.min(32, Math.max(16, width * .04));
// Evaluate the supported sizes grammar, preserving commas inside CSS functions.
function selectedWidth(sizes, viewport) {
 const clauses = [];
 let depth = 0, start = 0;
 for (let i = 0; i < sizes.length; i++) {
  if (sizes[i] === '(') depth++;
  if (sizes[i] === ')') depth--;
  if (sizes[i] === ',' && depth === 0) { clauses.push(sizes.slice(start, i).trim()); start = i + 1; }
 }
 clauses.push(sizes.slice(start).trim());
 for (let clause of clauses) {
  const media = clause.match(/^\((min|max)-width: (\d+)px\) /);
  if (media) {
   if (media[1] === 'min' ? viewport < Number(media[2]) : viewport > Number(media[2])) continue;
   clause = clause.slice(media[0].length);
  }
  const expression = clause.replace(/calc/g, '').replace(/([\d.]+)vw/g, (_, n) => String(Number(n) * viewport / 100)).replace(/([\d.]+)rem/g, (_, n) => String(Number(n) * 16)).replace(/px/g, '');
  return new Function('min', 'max', 'clamp', `return ${expression}`)(Math.min, Math.max, (low, value, high) => Math.min(high, Math.max(low, value)));
 }
 throw new Error('No matching size');
}
function assertWidths(image, expected) {
 for (const width of viewports) assert.ok(Math.abs(selectedWidth(attr(image, 'sizes'), width) - expected(width)) < .01, `${width}px: ${attr(image, 'sizes')}`);
}
function sharedFeatureWidth(feature, compact, width) {
 const content = Math.min(width, 1200) - gutter(width) * 2 - (compact ? 30 : 0);
 const padding = compact ? width < 640 ? 12 : 16 : width < 640 ? 16 : 24;
 const inner = content - 2 - padding * 2;
 const columns = width >= (compact ? 768 : 1024);
 const card = columns ? (inner - (compact ? 16 : 28)) * 1.05 / 2 : inner;
 const image = card - (feature.intactHomepageImage ? 0 : 2);
 return image * (!feature.intactHomepageImage && compact && feature.homepageImagePath ? 1.65 : 1);
}
function assertOptimized(image, source) {
 assert.ok(image, source);
 const url = new URL(attr(image, 'src'), 'https://www.innovatinghighered.com');
 assert.equal(url.pathname, '/_next/image');
 assert.equal(url.searchParams.get('url'), source);
 assert.ok(attr(image, 'srcSet').split(', ').length > 3);
 assert.ok(attr(image, 'sizes'));
}

test('five special weekly hero branches retain their artwork and eager delivery through the optimizer', () => {
 const Hero = load(resolve(root, 'components/HomePulseHero.tsx')).default;
 const { getEpisodeByDate } = load(resolve(root, 'lib/data/innovation-pulse.ts'));
 const sources = {
  '2026-09-04': '/images/innovation-pulse/homepage/2026-09-04-approved-hero-v4-a-blue.png',
  '2026-09-11': '/images/innovation-pulse/homepage/2026-09-11-approved-bold-diagonal.png',
 };
 for (const date of ['2026-09-04', '2026-09-11', '2026-09-25', '2026-10-02', '2026-10-09']) {
  const episode = getEpisodeByDate(date);
  assert.ok(episode);
  for (const editionLayout of [false, true]) {
   const html = render(React.createElement(Hero, { episode, editionLayout }));
   const artwork = images(html)[0];
   assertOptimized(artwork, sources[date] || episode.weeklyHeroImageUrl);
   assertWidths(artwork, width => (Math.min(width, editionLayout ? 1440 : 1200) - 2 * gutter(width) - 2) * (date === '2026-09-11' ? 1681 / 1641 : 1));
   assert.notEqual(attr(artwork, 'loading'), 'lazy');
   assert.equal((html.match(/<h1\b/g) || []).length, 1);
   assert.ok(html.includes(episode.audioUrl));
  }
 }
});

test('Teaching Superpower shared Feature artwork and article hero keep their source, alt and layout', async () => {
 const { getFeaturedCoverageBySlug } = load(resolve(root, 'lib/data/featured-coverage.ts'));
 const feature = getFeaturedCoverageBySlug('could-ai-become-our-teaching-superpower');
 const { FeatureArtwork } = load(resolve(root, 'components/FeaturedCoverage.tsx'));
 for (const compact of [false, true]) {
  const artwork = images(render(React.createElement(FeatureArtwork, { feature, compact })))[0];
  assertOptimized(artwork, compact && feature.homepageImagePath || feature.imagePath);
  assert.equal(attr(artwork, 'alt'), compact && feature.homepageImageAlt || feature.imageAlt || feature.title);
  assertWidths(artwork, width => sharedFeatureWidth(feature, compact, width));
 }
 const Page = load(resolve(root, 'app/feature-coverage/[slug]/page.tsx')).default;
 const html = render(await Page({ params: Promise.resolve({ slug: feature.slug }) }));
 const hero = images(html).find(image => attr(image, 'class') === 'officialFeatureImage');
 assertOptimized(hero, feature.imagePath);
 assert.equal(Number(attr(hero, 'width')), feature.imageWidth);
 assert.equal(Number(attr(hero, 'height')), feature.imageHeight);
 assert.notEqual(attr(hero, 'loading'), 'lazy');
 assertWidths(hero, width => {
  const content = Math.min(width, 1400) - 2 * gutter(width);
  const column = width <= 767 ? content : (content - Math.min(72, Math.max(32, width * .05))) * 1.12 / 2;
  return column - (feature.intactHomepageImage ? 0 : 2);
 });
 assert.ok(html.includes(feature.audioUrl));
});

test('shared Feature size hints cover all existing natural, bordered and cropped artwork variants', () => {
 const { FEATURED_COVERAGE } = load(resolve(root, 'lib/data/featured-coverage.ts'));
 const { FeatureArtwork } = load(resolve(root, 'components/FeaturedCoverage.tsx'));
 for (const feature of FEATURED_COVERAGE.filter(feature => feature.imagePath)) {
  for (const compact of [false, true]) {
   const image = images(render(React.createElement(FeatureArtwork, { feature, compact })))[0];
   assertOptimized(image, compact && feature.homepageImagePath || feature.imagePath);
   assertWidths(image, width => sharedFeatureWidth(feature, compact, width));
  }
 }
});

test('all inline Feature illustrations optimize displayed images and preserve full-size original links and dimensions', async () => {
 const { FEATURED_COVERAGE } = load(resolve(root, 'lib/data/featured-coverage.ts'));
 const Page = load(resolve(root, 'app/feature-coverage/[slug]/page.tsx')).default;
 let count = 0;
 for (const feature of FEATURED_COVERAGE) {
  const figures = feature.sections.flatMap(section => section.illustrations || []);
  if (!figures.length) continue;
  const html = render(await Page({ params: Promise.resolve({ slug: feature.slug }) }));
  for (const figure of figures) {
   const image = images(html).find(image => new URL(attr(image, 'src'), 'https://example.com').searchParams.get('url') === figure.path);
   assertOptimized(image, figure.path);
   assert.equal(Number(attr(image, 'width')), figure.width);
   assert.equal(Number(attr(image, 'height')), figure.height);
   assert.equal(attr(image, 'alt'), figure.alt);
   assert.equal(attr(image, 'loading'), 'lazy');
   assertWidths(image, width => Math.min(width, 800) - 2 * gutter(width) + (figure.wide && width >= 1100 ? 220 : 0));
   assert.ok(html.includes(`href="${figure.path}" target="_blank" rel="noopener noreferrer"`));
   count++;
  }
 }
 assert.ok(count >= 10, 'exercise the published full illustration set');
});

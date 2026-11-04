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
const Grid = load(resolve(root, 'app/innovation-pulse/stories/AllStoriesClient.tsx')).default;
const page = load(resolve(root, 'app/innovation-pulse/stories/page.tsx')).default;
const inventory = (await page({ searchParams: Promise.resolve({}) })).props.stories;
const { getCardArtwork, CARD_ARTWORK, CARD_COVER_SOURCES } = load(resolve(root, 'lib/cardArtwork.ts'));
const { ImageConfigContext } = require('next/dist/shared/lib/image-config-context.shared-runtime');
const { imageConfigDefault } = require('next/dist/shared/lib/image-config');
const imageConfig = { ...imageConfigDefault, ...load(resolve(root, 'next.config.ts')).default.images };
const renderGrid = props => renderToStaticMarkup(React.createElement(ImageConfigContext.Provider, { value: imageConfig }, React.createElement(Grid, props)));
const attr = (html, name) => html.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1].replaceAll('&amp;', '&');

test('every library story and Feature renders responsive optimized artwork with its original source and destination', () => {
 assert.ok(inventory.length > 200);
 assert.ok(inventory.some(s => s.href.startsWith('/feature-coverage/')));
 const kinds = new Set();
 for (const story of inventory.filter(s => s.image)) {
  kinds.add(story.image.startsWith('/') ? 'local' : new URL(story.image).hostname);
  const html = renderGrid({ stories: [story], embedded: true });
  const image = html.match(/<img\b[^>]*>/)?.[0];
  assert.ok(image, story.id);
  assert.equal(attr(image, 'alt'), '');
  assert.equal(attr(image, 'loading'), 'lazy');
  assert.ok(html.includes(`href="${story.href}"`));
  const src = new URL(attr(image, 'src'), 'https://www.innovatinghighered.com');
  assert.equal(src.pathname, '/_next/image', story.image);
  assert.equal(src.searchParams.get('url'), getCardArtwork(story.image).src);
  const candidates = attr(image, 'srcSet').split(', ');
  assert.ok(candidates.length > 3);
  assert.ok(candidates.some(candidate => / 640w$/.test(candidate)));
  assert.ok(candidates.some(candidate => / 1080w$/.test(candidate)));
 }
 assert.ok(kinds.has('local'));
 assert.ok(kinds.has('images.unsplash.com'));
 assert.ok(kinds.has('storage.googleapis.com'));
});

test('card derivatives and individually reviewed crops do not change unmatched source paths', () => {
 assert.equal(Object.keys(CARD_ARTWORK).length,19);
 assert.equal(CARD_COVER_SOURCES.size,10);
 const unknown='/images/new-unreviewed-wide-cover.png';
 assert.deepEqual(getCardArtwork(unknown), {src:unknown,fit:'contain'});
 for(const [source,derivative] of Object.entries(CARD_ARTWORK)) {
  const bytes=readFileSync(resolve(root,'public'+derivative));
  assert.equal(bytes.readUInt32BE(16),1536);
  assert.equal(bytes.readUInt32BE(20),1024);
  assert.ok(derivative.startsWith('/images/card-artwork/2026-11-03/'));
  assert.equal(getCardArtwork(source).src,derivative);
  const html=renderGrid({stories:[{id:source,href:'/example',title:'Example',summary:'Example',category:'Case Study',image:source,date:'2026-10-23',dateLabel:'October 23'}],embedded:true});
  const image=html.match(/<img\b[^>]*>/)[0];
  assert.equal(new URL(attr(image,'src'),'https://example.com').searchParams.get('url'),derivative);
 }
 for(const source of CARD_COVER_SOURCES) assert.deepEqual(getCardArtwork(source),{src:source,fit:'cover'});
});

test('archive custom artwork resolves card derivatives before historical hero crops', () => {
 const Archive=load(resolve(root,'app/innovation-pulse/archive/ArchiveListClient.tsx')).default;
 for(const [source,derivative] of Object.entries(CARD_ARTWORK)) {
  const html=renderToStaticMarkup(React.createElement(ImageConfigContext.Provider,{value:imageConfig},React.createElement(Archive,{episodes:[{date:'2026-09-11',thumbnailUrl:source,headline:'Example',summary:'Example',storyCount:7,weekLabel:'Example',audioUrl:'/example.mp3',audioDuration:'8:21',relatedTitles:[],searchText:'example'}]})));
  const image=html.match(/<img\b[^>]*>/)[0];
  assert.equal(new URL(attr(image,'src'),'https://example.com').searchParams.get('url'),derivative);
  assert.equal(attr(image,'data-nimg'),'fill');
 }
});

test('responsive hints match grid geometry and artwork stays contained in its 3:2 frame', () => {
 const html = renderGrid({ stories: inventory.slice(0, 1) });
 const sizes = attr(html.match(/<img\b[^>]*>/)[0], 'sizes');
 const expressions = sizes.split(/, (?=\(|calc)/).map(s => s.replace(/^\(max-width: \d+px\) /, ''));
 assert.equal(expressions.length, 4);
 for (const viewport of [320, 390, 767, 768, 800, 1023, 1024, 1200, 1280, 1920]) {
  const columns = viewport <= 767 ? 1 : viewport <= 1023 ? 2 : 3;
  const gutter = Math.min(32, Math.max(16, viewport * .04));
  const expected = (Math.min(viewport, 1200) - gutter * 2 - 24 * (columns - 1)) / columns - 2;
  const expression = expressions[viewport <= 767 ? 0 : viewport <= 1023 ? 1 : viewport <= 1200 ? 2 : 3]
   .replace(/calc/g, '').replace(/clamp\(([^,]+), ([^,]+), ([^)]+)\)/g, 'Math.min($3, Math.max($1, $2))')
   .replace(/([\d.]+)vw/g, (_, n) => String(Number(n) * viewport / 100)).replace(/([\d.]+)rem/g, (_, n) => String(Number(n) * 16)).replace(/px/g, '');
  assert.ok(Math.abs(new Function(`return ${expression}`)() - expected) < .01, `${viewport}px`);
 }
 const css = readFileSync(resolve(root, "components/StoryPreviewCard.module.css"), "utf8");
 assert.match(css, /\.frame \{[^}]*aspect-ratio:3 \/ 2/);
 assert.match(css, /\.frame>img \{[^}]*object-fit:contain/);
 const pageCSS = readFileSync(resolve(root, "app/innovation-pulse/stories/AllStories.module.css"), "utf8");
 assert.doesNotMatch(pageCSS, /\.currentStories\s+h[1-6]\s*\{/);
 assert.match(css, /\.card \.title \{[^}]*font-size:16px/);
});

test('Picard reading and original-source links remain separate from the author credit', () => {
 const story=inventory.find(item=>item.href==='/feature-coverage/the-measure-of-a-man');
 assert.ok(story);
 const html=renderGrid({stories:[story],embedded:true});
 assert.ok(html.includes(story.title) && html.includes(story.summary));
 assert.match(html, /Dr\. Norma Jones/);
 const anchors=Array.from(html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g));
 assert.ok(anchors.some(([,attrs,label])=>attr(attrs,'href')===story.href && label===story.title));
 const source=anchors.find(([,attrs])=>attr(attrs,'href')===story.sourceUrl);
 assert.ok(source && source[2].includes('Royal Shakespeare Company'));
 assert.doesNotMatch(source[2], /Dr\. Norma Jones/);
 assert.ok(anchors.every(([, ,body])=>!/<a\b/.test(body)), 'card links must be siblings');
});

test('a Feature with separate quotation citations keeps its declared original source', () => {
 const story=inventory.find(item=>item.href==='/feature-coverage/my-voice-at-scale');
 assert.ok(story);
 assert.equal(story.source, 'Original teaching video');
 assert.match(story.sourceUrl, /8OLae04GiNM/);
 const html=renderGrid({stories:[story],embedded:true});
 assert.ok(html.includes('href="'+story.sourceUrl+'"') && html.includes(story.source));
});

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
  assert.equal(src.searchParams.get('url'), story.image);
  const candidates = attr(image, 'srcSet').split(', ');
  assert.ok(candidates.length > 3);
  assert.ok(candidates.some(candidate => / 640w$/.test(candidate)));
  assert.ok(candidates.some(candidate => / 1080w$/.test(candidate)));
 }
 assert.ok(kinds.has('local'));
 assert.ok(kinds.has('images.unsplash.com'));
 assert.ok(kinds.has('storage.googleapis.com'));
});

test('responsive hints match grid geometry and artwork stays contained in its 3:2 frame', () => {
 const html = renderGrid({ stories: inventory.slice(0, 1) });
 const sizes = attr(html.match(/<img\b[^>]*>/)[0], 'sizes');
 const expressions = sizes.split(/, (?=\(|calc)/).map(s => s.replace(/^\(max-width: \d+px\) /, ''));
 assert.equal(expressions.length, 4);
 for (const viewport of [320, 390, 600, 601, 768, 800, 900, 901, 1280, 1440, 1920]) {
  const columns = viewport <= 600 ? 1 : viewport <= 900 ? 2 : 3;
  const gutter = Math.min(32, Math.max(16, viewport * .04));
  const expected = (Math.min(viewport, 1440) - gutter * 2 - 18 * (columns - 1)) / columns - 20;
  const expression = expressions[viewport <= 600 ? 0 : viewport <= 900 ? 1 : viewport <= 1440 ? 2 : 3]
   .replace(/calc/g, '').replace(/clamp\(([^,]+), ([^,]+), ([^)]+)\)/g, 'Math.min($3, Math.max($1, $2))')
   .replace(/([\d.]+)vw/g, (_, n) => String(Number(n) * viewport / 100)).replace(/([\d.]+)rem/g, (_, n) => String(Number(n) * 16)).replace(/px/g, '');
  assert.ok(Math.abs(new Function(`return ${expression}`)() - expected) < .01, `${viewport}px`);
 }
 const css = readFileSync(resolve(root, 'app/innovation-pulse/stories/AllStories.module.css'), 'utf8');
 assert.match(css, /\.image \{[^}]*aspect-ratio: 3 \/ 2/);
 assert.match(css, /\.image img \{[^}]*object-fit: contain/);
});

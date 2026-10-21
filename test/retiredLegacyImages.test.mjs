import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const ts = require("typescript");
const root = resolve(import.meta.dirname, "..");

// Render the real route and load its real normalized story inventory. Only
// framework/client boundaries are replaced, as in featureCoveragePage.test.mjs.
function loadModule(filename, overrides = {}) {
  const source = readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    fileName: filename,
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (specifier) => {
    if (specifier.endsWith(".module.css")) return new Proxy({}, { get: (_, key) => key === "__esModule" ? false : key });
    if (specifier in overrides) return overrides[specifier];
    if (specifier.startsWith(".") || specifier.startsWith("@/")) {
      const base = specifier.startsWith("@/")
        ? resolve(root, specifier.slice(2))
        : resolve(filename, "..", specifier);
      if (base.endsWith(".json")) return JSON.parse(readFileSync(base, "utf8"));
      const target = [`${base}.ts`, `${base}.tsx`, base].find(existsSync);
      if (target) return loadModule(target, overrides);
    }
    return createRequire(filename)(specifier);
  };
  new Function("require", "module", "exports", output)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}


const data = loadModule(resolve(root, "lib/data/innovation-pulse.ts"));
const stories = data.getAllStoriesAggregated().filter(story => story.omitImage);
const expectedTitles = [
  "A Grades Jump 30 Percent in AI-Exposed Courses, UC Berkeley Study Finds",
  "A.T. and T. Recruits Electricians While College Graduate Hiring Slows",
];
const boundaries = {
  "@/components/ShareBar": { __esModule: true, default: () => null },
  "./StoryPageClient": { __esModule: true, default: () => null },
  "next/navigation": { notFound: () => { throw new Error("not found"); } },
};
const render = tree => renderToStaticMarkup(tree);
const noArtwork = html => {
  assert.doesNotMatch(html, /<img\b|<link[^>]+as="image"|aspect-\[|h-\[180px\]/);
  assert.doesNotMatch(html, /2026-05-18-story[23]\.png/);
};

test("only the two requested May stories are text-only through normalization and aggregation", () => {
  assert.deepEqual(stories.map(s => s.title).sort(), expectedTitles.toSorted());
  for (const story of stories) {
    assert.equal(story.date, "2026-05-22");
    assert.equal(story.image, undefined);
    assert.equal(story.heroImage, undefined);
    const detail = data.getStoryBySlug(data.generateSlug(story.title));
    assert.equal(detail.omitImage, true);
    assert.equal(detail.summary, story.summary);
    assert.equal(detail.sourceUrl, story.sourceUrl);
    assert.ok(data.getAllStorySlugs().includes(detail.slug));
    assert.ok(data.getStoriesByV4Category(data.mapToV4Category(story.category)).some(s => s.slug === detail.slug && s.omitImage));
  }
  assert.ok(data.getAllStoriesAggregated().filter(s => !s.omitImage).every(s => s.image), "unrelated fallback artwork remains");
});

test("real story and related cards omit image frames and social metadata while preserving the complete articles", async () => {
  for (const raw of stories) {
    const story = data.getStoryBySlug(data.generateSlug(raw.title));
    const page = loadModule(resolve(root, "app/innovation-pulse/story/[slug]/page.tsx"), {
      ...boundaries,
      "@/lib/data/innovation-pulse": { ...data, getRelatedStories: () => stories.map(s => ({ ...s, slug: data.generateSlug(s.title) })) },
    });
    const args = { params: Promise.resolve({ slug: story.slug }) };
    const html = render(await page.default(args));
    noArtwork(html);
    for (const paragraph of story.summary.split(/\n\n+/).filter(s => s.trim())) {
      assert.ok(html.includes(render(React.createElement("p", null, paragraph)).slice(3, -4)));
    }
    assert.ok(html.includes(story.sourceUrl.replaceAll("&", "&amp;")));
    const metadata = await page.generateMetadata(args);
    assert.deepEqual(metadata.openGraph.images, []);
    assert.deepEqual(metadata.twitter.images, []);
    assert.equal(metadata.twitter.card, "summary");
  }
});

test("real category, library and edition cards stay text-only without placeholders", async () => {
  const CategoryGrid = loadModule(resolve(root, "app/innovation-pulse/category/[category]/CategoryStoriesGrid.tsx")).default;
  const LibraryGrid = loadModule(resolve(root, "app/innovation-pulse/stories/AllStoriesClient.tsx")).default;
  const libraryPage = loadModule(resolve(root, "app/innovation-pulse/stories/page.tsx")).default;
  const inventory = (await libraryPage({ searchParams: Promise.resolve({}) })).props.stories;
  const Slider = loadModule(resolve(root, "components/QuickHitsSlider.tsx")).default;
  const sliderHtml = render(React.createElement(Slider, { stories }));
  noArtwork(sliderHtml);
  assert.doesNotMatch(sliderHtml, /imageFrame|imageFallback|Innovation Pulse story<\/div>/);
  const weekly = loadModule(resolve(root, "lib/weeklyEdition.ts"));
  const episode = data.getAllEpisodes().find(e => e.date === "2026-05-22");
  const edition = weekly.getWeeklyEditionContent(episode);
  for (const story of stories) {
    const category = data.mapToV4Category(story.category);
    noArtwork(render(React.createElement(CategoryGrid, {
      stories: [{ ...story, category, image: story.image || "", slug: data.generateSlug(story.title), categoryColor: "var(--cyan)" }],
      category, categoryColor: "var(--cyan)",
    })));
    for (const cards of [inventory, edition.stories]) {
      const card = cards.find(s => s.title === story.title);
      assert.ok(card);
      assert.equal(card.image, "");
      const html = render(React.createElement(LibraryGrid, { stories: [card], embedded: true }));
      noArtwork(html);
      assert.ok(html.includes(card.href));
    }
  }
});

test("retired Tinker Lab routes 404, stay out of inventory, and retain the index and newer Wonka Feature", async () => {
  const index = loadModule(resolve(root, "app/tinker-lab/page.tsx")).default;
  const html = render(React.createElement(index));
  assert.match(html, /Experiments, Walkthroughs/);
  assert.match(html, /Suggest an Experiment/);
  assert.doesNotMatch(html, /tinker-lab\/(?:wonka-lantern|chatgpt-pro)|<img\b/);
  const page = loadModule(resolve(root, "app/tinker-lab/[slug]/page.tsx"), boundaries);
  assert.deepEqual(await page.generateStaticParams(), []);
  for (const slug of ["wonka-lantern", "chatgpt-pro"]) {
    await assert.rejects(() => page.default({ params: Promise.resolve({ slug }) }), /not found/);
  }
  const config = loadModule(resolve(root, "next.config.ts")).default;
  const { pathToRegexp } = require("next/dist/compiled/path-to-regexp");
  const redirects = await config.redirects();
  const matches = path => redirects.some(rule => pathToRegexp(rule.source).test(path));
  for (const slug of ["wonka-lantern", "chatgpt-pro"]) {
    assert.equal(matches("/tinker-lab/" + slug), false);
    assert.equal(matches("/tinker-lab/" + slug + "/"), false);
  }
  assert.equal(matches("/tinker-lab/other-historical-post"), true);
  assert.equal(matches("/tinker-lab/wonka-lantern/other-historical-path"), true);
  const { FEATURED_COVERAGE } = loadModule(resolve(root, "lib/data/featured-coverage.ts"));
  assert.ok(FEATURED_COVERAGE.some(f => f.slug === "the-wonka-lantern-framework" && f.imagePath));
});

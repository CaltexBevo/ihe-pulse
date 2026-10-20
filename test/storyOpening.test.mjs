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
    if (specifier in overrides) return overrides[specifier];
    if (specifier.startsWith(".") || specifier.startsWith("@/")) {
      const base = specifier.startsWith("@/")
        ? resolve(root, specifier.slice(2))
        : resolve(filename, "..", specifier);
      if (base.endsWith(".json")) return JSON.parse(readFileSync(base, "utf8"));
      const target = [base, `${base}.ts`, `${base}.tsx`].find(existsSync);
      if (target) return loadModule(target, overrides);
    }
    return createRequire(filename)(specifier);
  };
  new Function("require", "module", "exports", output)(localRequire, loadedModule, loadedModule.exports);
  return loadedModule.exports;
}

const data = loadModule(resolve(root, "lib/data/innovation-pulse.ts"));
const pagePath = resolve(root, "app/innovation-pulse/story/[slug]/page.tsx");
async function renderStory(story) {
  const page = loadModule(pagePath, {
    "@/lib/data/innovation-pulse": { ...data, getStoryBySlug: () => story, getRelatedStories: () => [] },
    "@/lib/og": { pageMetadata: (metadata) => metadata },
    "@/lib/story-social-images": { STORY_SOCIAL_IMAGES: {} },
    "@/components/ShareBar": { __esModule: true, default: () => null },
    "./StoryPageClient": { __esModule: true, default: () => null },
    "next/image": { __esModule: true, default: ({ src, alt }) => React.createElement("img", { src, alt }) },
    "next/link": { __esModule: true, default: ({ children, ...props }) => React.createElement("a", props, children) },
    "next/navigation": { notFound: () => { throw new Error("not found"); } },
  });
  const tree = await page.default({ params: Promise.resolve({ slug: story.slug }) });
  const html = renderToStaticMarkup(tree);
  const paragraphs = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((match) => match[1]);
  return { html, paragraphs };
}

test("every published story starts with its complete article, without a preview", async () => {
  const slugs = [...new Set(data.getAllStorySlugs())];
  assert.ok(slugs.length > 200, "exercise the full published inventory");
  for (const slug of slugs) {
    const story = data.getStoryBySlug(slug);
    const { paragraphs } = await renderStory(story);
    const body = story.summary.split(/\n\n+/).filter((paragraph) => paragraph.trim());
    const expected = body.map((text) => renderToStaticMarkup(React.createElement("p", null, text)).slice(3, -4));
    assert.deepEqual(paragraphs.slice(0, expected.length), expected, slug);
    // A manufactured excerpt before the body fails even for one-paragraph stories.
    const expectedExtraParagraphs = story.type === "deepDive" && story.editorialTake ? 1 : 0;
    assert.equal(paragraphs.length, expected.length + expectedExtraParagraphs, slug);
  }
});

test("an authored preview stays in metadata and never appears above the article", async () => {
  const slug = "make-vendor-proposals-easier-to-compare";
  const story = data.getStoryBySlug(slug);
  assert.ok(story.preview);
  const { html, paragraphs } = await renderStory(story);
  assert.ok(!html.includes(story.preview));
  assert.equal(paragraphs[0], renderToStaticMarkup(React.createElement("p", null, story.summary.split("\n\n")[0])).slice(3, -4));
  const page = loadModule(pagePath, {
    "@/lib/data/innovation-pulse": data,
    "@/lib/og": { pageMetadata: (metadata) => metadata },
    "@/lib/story-social-images": { STORY_SOCIAL_IMAGES: {} },
    "@/components/ShareBar": { __esModule: true, default: () => null },
    "./StoryPageClient": { __esModule: true, default: () => null },
  });
  const metadata = await page.generateMetadata({ params: Promise.resolve({ slug }) });
  assert.equal(metadata.description, story.preview);
});

test("missing and blank previews never manufacture a truncated opening", async () => {
  const anchor = data.getStoryBySlug("usc-and-ucla-build-different-paths-into-ai-era-work");
  for (const preview of [undefined, "", "  \n "]) {
    const { paragraphs } = await renderStory({ ...anchor, preview });
    assert.equal(paragraphs[0], renderToStaticMarkup(React.createElement("p", null, anchor.summary.split("\n\n")[0])).slice(3, -4));
    assert.equal(paragraphs.length, anchor.summary.split(/\n\n+/).filter((p) => p.trim()).length);
  }
});

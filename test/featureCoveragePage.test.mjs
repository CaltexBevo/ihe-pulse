import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";

const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const ts = require("typescript");

const root = resolve(import.meta.dirname, "..");
const pageSource = readFileSync(resolve(root, "app/feature-coverage/[slug]/page.tsx"), "utf8");
const cssSource = readFileSync(resolve(root, "app/feature-coverage/[slug]/page.module.css"), "utf8");
const dataSource = readFileSync(resolve(root, "lib/data/featured-coverage.ts"), "utf8");
const imagePath = resolve(root, "public/images/feature-coverage/mit-ai-education-purpose-lens-approved.png");

function loadCommonJs(source, filename, requireOverrides = {}) {
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  }).outputText;
  const loadedModule = { exports: {} };
  const localRequire = (specifier) => {
    if (specifier in requireOverrides) return requireOverrides[specifier];
    if (specifier.endsWith(".module.css")) {
      return { __esModule: true, default: new Proxy({}, { get: (_target, property) => String(property) }) };
    }
    if (specifier.startsWith(".") || specifier.startsWith("@/")) {
      const base = specifier.startsWith("@/")
        ? resolve(root, specifier.slice(2))
        : resolve(filename, "..", specifier);
      const target = [base, `${base}.ts`, `${base}.tsx`].find((path) => existsSync(path));
      if (target) return loadCommonJs(readFileSync(target, "utf8"), target, requireOverrides);
    }
    return createRequire(filename)(specifier);
  };
  const evaluate = new Function("require", "module", "exports", "__filename", "__dirname", output);

  evaluate(localRequire, loadedModule, loadedModule.exports, filename, resolve(filename, ".."));
  return loadedModule.exports;
}

function renderFeaturePage(slug = "mit-ai-education-purpose") {
  const dataModule = loadCommonJs(dataSource, resolve(root, "lib/data/featured-coverage.ts"));
  const cssClasses = new Proxy({}, { get: (_target, property) => String(property) });
  const pageModule = loadCommonJs(pageSource, resolve(root, "app/feature-coverage/[slug]/page.tsx"), {
    "./page.module.css": { __esModule: true, default: cssClasses },
    "@/lib/data/featured-coverage": dataModule,
    "@/lib/og": { pageMetadata: (metadata) => metadata },
    "next/image": {
      __esModule: true,
      default: ({ alt, className, src }) => React.createElement("img", { alt, className, src }),
    },
    "next/link": {
      __esModule: true,
      default: ({ children, href, ...props }) => React.createElement("a", { ...props, href }, children),
    },
    "next/navigation": { notFound: () => { throw new Error("not found"); } },
  });

  return pageModule.default({
    params: Promise.resolve({ slug }),
  }).then((page) => renderToStaticMarkup(page));
}

test("MIT Feature Coverage binds the approved analytical-lens asset", () => {
  const hash = createHash("sha256").update(readFileSync(imagePath)).digest("hex");

  assert.equal(hash, "5f96877d29816ee6a14f3d74a22f8abc4ce97be5f64c67dee6c38217b61c3f4d");
  assert.match(dataSource, /imagePath: "\/images\/feature-coverage\/mit-ai-education-purpose-lens-approved\.png"/);
  assert.match(dataSource, /imageAlt:[\s\S]*magnifying lens/);
});

test("the page exposes the approved sequence and accessible question anchors", () => {
  assert.match(pageSource, /The Sequence/);
  assert.match(pageSource, /Start with what education is meant to achieve\./);
  assert.match(pageSource, /Design learning experiences that build knowledge, skills, and judgment\./);
  assert.match(pageSource, /Set AI guidelines that protect what matters and enable what’s possible\./);
  assert.doesNotMatch(pageSource, /The Argument/);
  assert.match(pageSource, /href=\{`#question-\$\{index \+ 1\}`\}/);
  assert.match(pageSource, /href="#questions"/);
  assert.match(pageSource, /id=\{`question-\$\{itemIndex \+ 1\}`\}/);
  assert.match(pageSource, /target="_blank"[\s\S]*rel="noopener noreferrer"/);
});

test("the route keeps the semantic single-title structure and responsive side rails", () => {
  assert.equal((pageSource.match(/<h1\b/g) ?? []).length, 1);
  assert.match(pageSource, /id="feature-title"/);
  assert.match(cssSource, /position: sticky/);
  assert.match(cssSource, /@media \(max-width: 1279px\)/);
  assert.match(cssSource, /@media \(max-width: 767px\)/);
  assert.match(cssSource, /\.sideRail[\s\S]*position: static/);
  assert.match(cssSource, /\.heroImage \{[\s\S]*object-position: 100% center;[\s\S]*transform: scale\(1\.5\)/);
  assert.match(cssSource, /@media \(max-width: 767px\)[\s\S]*object-position: 100% top;[\s\S]*transform: scale\(1\.34\)/);
});

test("rendered article IDs are unique and question targets receive keyboard focus", async () => {
  const markup = await renderFeaturePage();
  const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);

  assert.equal(ids.length, new Set(ids).size);
  assert.equal(ids.filter((id) => id === "feature-introduction").length, 1);
  assert.match(markup, /href="#question-1"/);
  assert.match(markup, /id="question-1" tabindex="-1"/);
  assert.match(cssSource, /\.questionItem:focus[\s\S]*outline: 2px solid var\(--cyan\)/);
});

test("the launch renders the refreshed portal story while existing feature routes keep their content", async () => {
  const launch = await renderFeaturePage("grant-portal-launch");
  const episode = JSON.parse(readFileSync(resolve(root, "data/daily-pulse/2026-09-04.json"), "utf8"));
  const grant = episode.quickHits.find((story) => story.canonicalStoryId === "IHE-STORY-2026-09-04-157");
  assert.ok(grant);
  assert.match(launch, /Need Funding\? Indeed, There’s a Portal for That\./);
  assert.match(launch, /Step through to unlock your innovation\. Explore higher education grants for teaching innovation, student success and research in the Innovating Higher Ed Grant Portal\./);
  assert.match(launch, /Dr\. Norma Jones, Innovating Higher Ed’s Co-Founder and Editor-in-Chief, championed the new Grant Portal/);
  assert.match(launch, /Your innovation\. Our grant portal\. Start exploring at InnovatingHigherEd\.com\/innovation-grants\./);
  assert.match(launch, /src="\/images\/feature-coverage\/grant-portal-no-url\.png"/);
  assert.match(launch, /href="https:\/\/www\.innovatinghighered\.com\/innovation-grants">Grant Portal/);
  assert.match(grant.summary, /Innovating Higher Ed’s new Grant Portal is live/);
  assert.doesNotMatch(launch, /Innovating Higher Ed’s new Grant Portal is live, giving educators/);
  assert.equal((launch.match(/<h1\b/g) ?? []).length, 1);
  assert.match(launch, /href="\/innovation-grants"[^>]*>Explore the Grant Portal/);
  assert.doesNotMatch(launch, /Original Analysis|In this analysis|The Sequence|question-1/);
  const models = await renderFeaturePage("four-new-ai-models-next-project");
  assert.match(models, /Four New AI Models Could Get Your Next Project Moving/);
  assert.match(models, /A reason to revisit the project you put aside/);
  assert.doesNotMatch(models, /FEATURE LAUNCH|Explore the Grant Portal/);
});

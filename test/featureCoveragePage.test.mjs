import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
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
  const localRequire = (specifier) => requireOverrides[specifier] ?? require(specifier);
  const evaluate = new Function("require", "module", "exports", "__filename", "__dirname", output);

  evaluate(localRequire, loadedModule, loadedModule.exports, filename, resolve(filename, ".."));
  return loadedModule.exports;
}

function renderFeaturePage() {
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
    params: Promise.resolve({ slug: dataModule.MIT_FEATURED_COVERAGE.slug }),
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

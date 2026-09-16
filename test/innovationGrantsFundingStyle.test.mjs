import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../app/innovation-grants/portal.module.css", import.meta.url), "utf8");

test("funding total reuses the exact approved headline gradient", () => {
  const headlineGradient = css.match(/\.home :global\(\.statement h1 \.grad\)\{background:([^;]+);/)[1];
  const fundingGradient = css.match(/\.portal :global\(\.statement \.metrics \.funding b\)\{background:([^;]+);/)[1];
  assert.equal(fundingGradient, headlineGradient);
});

test("funding emphasis is responsive while other metric numbers retain their size", () => {
  assert.match(css, /\.portal :global\(\.statement \.metrics \.funding\)\{grid-column:1\/-1\}/);
  assert.match(css, /font-size:clamp\(32px,3\.4vw,44px\)/);
  assert.match(css, /\.funding b\)\{display:block;width:fit-content;/);
  assert.match(css, /\.portal :global\(\.statement \.metrics b\)\{font-size:21px;/);
  assert.doesNotMatch(css, /\.portal :global\(\.statement \.metrics \.funding b\)\{font-size:21px\}/);
});

test("funding text has readable unsupported-gradient and forced-colors fallbacks", () => {
  assert.match(css, /white-space:nowrap;color:var\(--ink\)/);
  assert.match(css, /@supports \(\(background-clip:text\) or \(-webkit-background-clip:text\)\)/);
  assert.match(css, /@media\(forced-colors:active\)\{\s*\.portal :global\(\.statement \.metrics \.funding b\)\{background:none;color:CanvasText\}/);
});

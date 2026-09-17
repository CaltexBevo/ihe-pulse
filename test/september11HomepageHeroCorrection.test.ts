import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = process.cwd();
const assetPath =
  'public/images/innovation-pulse/homepage/2026-09-11-approved-bold-diagonal.png';

test('September 11 homepage uses the exact founder-approved episode artwork', () => {
  const bytes = fs.readFileSync(path.join(projectRoot, assetPath));
  assert.equal(
    createHash('sha256').update(bytes).digest('hex'),
    '76823d3941b1298ecb676bd4a005196ebfb342ec39a7df4aca818b52e026777a',
  );
  assert.equal(bytes.subarray(1, 4).toString('ascii'), 'PNG');
  assert.equal(bytes.readUInt32BE(16), 1681);
  assert.equal(bytes.readUInt32BE(20), 936);

  const component = fs.readFileSync(
    path.join(projectRoot, 'components/ApprovedSeptember11HeroArtwork.tsx'),
    'utf8',
  );
  const componentCss = fs.readFileSync(
    path.join(projectRoot, 'components/ApprovedSeptember11HeroArtwork.module.css'),
    'utf8',
  );
  const hero = fs.readFileSync(
    path.join(projectRoot, 'components/HomePulseHero.tsx'),
    'utf8',
  );

  assert.match(
    component,
    /\/images\/innovation-pulse\/homepage\/2026-09-11-approved-bold-diagonal\.png/,
  );
  assert.match(component, /data-approved-master="2026-09-11-bold-diagonal"/);
  assert.match(component, /<h1 id="home-pulse-title">Bans or better assignments\?<\/h1>/);
  assert.match(component, /7 stories\. One quick listen\. Know what matters\./);
  assert.match(componentCss, /aspect-ratio:\s*1641\s*\/\s*622/);
  assert.match(componentCss, /overflow:\s*hidden/);
  assert.match(hero, /usesSeptember11Hero\s*=\s*episode\.date\s*===\s*'2026-09-11'/);
  assert.match(hero, /usesSeptember11Hero\s*\?\s*\(\s*<ApprovedSeptember11HeroArtwork\s*\/>/);
  assert.match(hero, /usesApprovedFullHero/);
});

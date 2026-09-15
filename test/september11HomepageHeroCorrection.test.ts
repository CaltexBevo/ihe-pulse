import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const projectRoot = process.cwd();
const assetPath =
  'public/images/innovation-pulse/homepage/2026-09-11-approved-bans-or-better-assignments-orange.png';

test('September 11 homepage uses the exact founder-approved episode artwork', () => {
  const bytes = fs.readFileSync(path.join(projectRoot, assetPath));
  assert.equal(
    createHash('sha256').update(bytes).digest('hex'),
    '9a02bcb08e00dc1317aea51fa2a3f4dc728854778d4d71e7da0cb020cf653dee',
  );
  assert.equal(bytes.subarray(1, 4).toString('ascii'), 'PNG');
  assert.equal(bytes.readUInt32BE(16), 1672);
  assert.equal(bytes.readUInt32BE(20), 941);

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
    /\/images\/innovation-pulse\/homepage\/2026-09-11-approved-bans-or-better-assignments-orange\.png/,
  );
  assert.match(component, /data-approved-master="2026-09-11-bans-or-better-assignments-orange"/);
  assert.match(component, /<h1 id="home-pulse-title">Bans or better assignments\?<\/h1>/);
  assert.match(component, /7 stories\. One quick listen\. Know what matters\./);
  assert.match(componentCss, /aspect-ratio:\s*1672\s*\/\s*731/);
  assert.match(componentCss, /overflow:\s*hidden/);
  assert.match(hero, /usesSeptember11Hero\s*=\s*episode\.date\s*===\s*'2026-09-11'/);
  assert.match(hero, /usesSeptember11Hero\s*\?\s*\(\s*<ApprovedSeptember11HeroArtwork\s*\/>/);
  assert.match(hero, /usesApprovedFullHero/);
});

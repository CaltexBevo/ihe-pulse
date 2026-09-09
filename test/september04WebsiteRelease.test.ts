import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { MODELS_FEATURED_COVERAGE } from '../lib/data/featured-coverage-models.ts';
import {
  getHomePulseArtwork,
  getHomePulseSupportCopy,
} from '../lib/home-pulse-artwork.ts';
import { getHomePulseWaveform } from '../lib/home-pulse-waveforms.ts';
import { selectPriorEpisodes } from '../lib/homepagePulse.ts';
import type { InnovationPulseEpisode } from '../lib/data/innovation-pulse-types.ts';

const projectRoot = process.cwd();

function sha256(relativePath: string): string {
  return createHash('sha256')
    .update(fs.readFileSync(path.join(projectRoot, relativePath)))
    .digest('hex');
}

function pngDimensions(relativePath: string): { width: number; height: number } {
  const bytes = fs.readFileSync(path.join(projectRoot, relativePath));
  assert.equal(bytes.subarray(1, 4).toString('ascii'), 'PNG');
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

test('September 4 founder-selected artwork bytes and dimensions are exact', () => {
  const assets = [
    ['public/images/innovation-pulse/homepage/2026-09-04-approved-hero-v4-a-blue.png', '9b82089a6728c91da4958cf5bfc6536c0442f65c108611590e6a149d87faa499', 1671, 941],
    ['public/images/feature-coverage/four-new-ai-models-next-project.png', '11562a788bfba50edd5c77790062db55a75ef74aaae2214700a3043621d27b8c', 1672, 941],
    ['public/images/innovation-pulse/2026-09-04/grant-portal.png', '5aff9bd212bf4c55bebfeb9999bc00977cbf567f46b0122f62371f2437e67cce', 1672, 941],
    ['public/images/innovation-pulse/2026-09-04/writing-conference.png', '0a8d870267697d190c180c693e9fdeb1fcd362c1ff938536f5d1bd8a08532388', 1672, 941],
    ['public/images/innovation-pulse/2026-09-04/student-written-exams.png', '0a9f924bbfb9f640cd9dbba2296d31480fa6f7daf0781e63de2081a59cc82e7f', 1672, 941],
    ['public/images/innovation-pulse/2026-09-04/ai-judgment.png', '66dfb524362474e81ecfd35823f535559fdaeabdd4c0d79b8506094bc1742c33', 1672, 941],
  ] as const;

  for (const [assetPath, expectedHash, width, height] of assets) {
    assert.equal(sha256(assetPath), expectedHash, assetPath);
    assert.deepEqual(pngDimensions(assetPath), { width, height }, assetPath);
  }
});

test('September 4 Feature v18 content and source graph stay byte-locked', () => {
  const featurePayload = {
    title: MODELS_FEATURED_COVERAGE.title,
    dek: MODELS_FEATURED_COVERAGE.teaser,
    byline: MODELS_FEATURED_COVERAGE.byline,
    sections: MODELS_FEATURED_COVERAGE.sections.map((section) => ({
      heading: section.heading ?? '',
      paragraphs: section.paragraphs,
      sourceIds: section.sourceIds ?? [],
    })),
    sources: MODELS_FEATURED_COVERAGE.sources,
  };
  const digest = createHash('sha256')
    .update(JSON.stringify(featurePayload))
    .digest('hex');

  assert.equal(digest, 'dac7f326e04279b71843907614dfcfea2defd83bee512f68e68ab6223e2d4c37');
  assert.equal(MODELS_FEATURED_COVERAGE.authorName, 'Brent Jones');
  assert.equal(MODELS_FEATURED_COVERAGE.imageWidth, 1672);
  assert.equal(MODELS_FEATURED_COVERAGE.imageHeight, 941);
});

test('September 4 binds the reviewed audio identity, measured runtime, and derived waveform', () => {
  const episode = JSON.parse(
    fs.readFileSync(path.join(projectRoot, 'data/daily-pulse/2026-09-04.json'), 'utf8'),
  );
  const waveform = getHomePulseWaveform('2026-09-04');

  assert.equal(
    episode.episode.audioUrl,
    'https://storage.googleapis.com/ihe-daily-news-audio/broadcasts/ihe-daily-news-2026-09-04.mp3',
  );
  assert.equal(episode.episode.audioDuration, '6:07');
  assert.equal(episode.meta.publicationAuthorized, true);
  assert.equal(episode.meta.releaseStatus, 'APPROVED_FOR_PUBLICATION');
  assert.equal(waveform?.length, 104);
  assert.equal(Math.min(...(waveform ?? [])), 14);
  assert.equal(Math.max(...(waveform ?? [])), 100);
  assert.equal(
    createHash('sha256').update(JSON.stringify(waveform)).digest('hex'),
    'ee1a7b2e5caed62a65aa878f09993ccd9ded3a85992d549d604ccab6ace4828f',
  );
});

test('September 4 hero binds the approved master and semantic copy without changing older artwork', () => {
  assert.equal(
    getHomePulseSupportCopy('2026-09-04'),
    'Build useful projects. Rethink assignments. Find support.',
  );
  assert.equal(
    getHomePulseArtwork('2026-08-28'),
    '/images/innovation-pulse/homepage/2026-08-28-option-a-master.png',
  );

  const component = fs.readFileSync(
    path.join(projectRoot, 'components/ApprovedSeptemberHeroArtwork.tsx'),
    'utf8',
  );
  const hero = fs.readFileSync(
    path.join(projectRoot, 'components/HomePulseHero.tsx'),
    'utf8',
  );
  const artworkCss = fs.readFileSync(
    path.join(projectRoot, 'components/ApprovedSeptemberHeroArtwork.module.css'),
    'utf8',
  );

  assert.match(
    component,
    /APPROVED_SEPTEMBER_HERO\s*=\s*['"]\/images\/innovation-pulse\/homepage\/2026-09-04-approved-hero-v4-a-blue\.png['"]|src=\{APPROVED_SEPTEMBER_HERO\}/,
  );
  assert.match(component, /data-approved-master="2026-09-04-v4-a-blue"/);
  assert.match(component, /<h1 id="home-pulse-title">/);
  assert.match(component, /<p>Build useful projects\. Rethink assignments\. Find support\.<\/p>/);
  assert.match(artworkCss, /aspect-ratio:\s*1671\s*\/\s*766/);
  assert.match(artworkCss, /overflow:\s*hidden/);
  assert.match(hero, /import ApprovedSeptemberHeroArtwork from ['"]\.\/ApprovedSeptemberHeroArtwork['"]/);
  assert.match(hero, /usesSeptember04Hero\s*\?\s*<ApprovedSeptemberHeroArtwork\s*\/>/);
  assert.match(hero, /getHomePulseWaveform\(episode\.date\)/);
  assert.match(hero, /audio\.currentTime = boundedTime/);

  for (const text of [
    'One quick',
    'listen.',
    'Play this week’s episode',
    '4 new AI models',
    'What could you build?',
    'Writing conferences',
    'Student-written exams',
    'AI + your judgment',
    'Grant Portal launch update',
  ]) {
    assert.match(
      component + '\\n' + hero,
      new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }
});

test('September 4 retains its immediate weekly predecessor in the homepage rail', () => {
  const episodes = ['2026-09-04', '2026-08-28', '2026-08-21', '2026-08-14']
    .map((date) => ({ date }) as InnovationPulseEpisode);

  assert.deepEqual(
    selectPriorEpisodes(episodes).map((episode) => episode.date),
    ['2026-08-28', '2026-08-21', '2026-08-14'],
  );

  const priorHomeState = episodes.slice(1);
  assert.deepEqual(
    selectPriorEpisodes(priorHomeState).map((episode) => episode.date),
    ['2026-08-14'],
  );
});

test('September 4 story pages preserve full card art and paragraph boundaries', () => {
  const storyPage = fs.readFileSync(
    path.join(projectRoot, 'app/innovation-pulse/story/[slug]/page.tsx'),
    'utf8',
  );
  assert.match(storyPage, /story\.episodeDate === "2026-09-04"/);
  assert.match(storyPage, /usesSeptember04Card \? "object-contain" : "object-cover"/);
  assert.match(storyPage, /story\.summary\.split\(\/\\n\\n\+\//);
  assert.match(storyPage, /"Tool Spotlight"/);
});

test('September 4 episode page preserves the founder-selected Grant category and source link', () => {
  const episodePage = fs.readFileSync(
    path.join(projectRoot, 'app/innovation-pulse/[date]/page.tsx'),
    'utf8',
  );
  assert.match(
    episodePage,
    /date === "2026-09-04" && category === "Tool Spotlight"/,
  );
  assert.match(
    episodePage,
    /category=\{displayCategoryForEpisode\(hit\.category, episode\.date\)\}/,
  );
  assert.match(episodePage, /\? "var\(--magenta-text\)"/);
  assert.match(episodePage, /sourceUrl=\{hit\.sourceUrl\}/);
  assert.match(
    episodePage,
    /preserveParagraphs=\{episode\.date === "2026-09-04"\}/,
  );

  const card = fs.readFileSync(path.join(projectRoot, 'components/Card.tsx'), 'utf8');
  assert.match(card, /fullContent\.split\(\/\\n\\n\+\//);
});

test('September 4 source links survive the episode-to-story transform', () => {
  const episode = JSON.parse(
    fs.readFileSync(path.join(projectRoot, 'data/daily-pulse/2026-09-04.json'), 'utf8'),
  );
  assert.equal(episode.leadStory.sourceLinks.length, 7);
  assert.equal(
    episode.quickHits.find((story: { candidateIndex: number }) => story.candidateIndex === 4).sourceLinks.length,
    3,
  );
  assert.equal(
    episode.quickHits.find((story: { candidateIndex: number }) => story.candidateIndex === 158).sourceLinks.length,
    2,
  );

  const loader = fs.readFileSync(path.join(projectRoot, 'lib/data/innovation-pulse.ts'), 'utf8');
  const storyPage = fs.readFileSync(
    path.join(projectRoot, 'app/innovation-pulse/story/[slug]/page.tsx'),
    'utf8',
  );
  assert.match(loader, /sourceLinks: \(rawDeepDive\.sourceLinks\)/);
  assert.match(loader, /sourceLinks: \(hit\.sourceLinks\)/);
  assert.match(storyPage, /story\.sourceLinks \?\? \[\]/);
  assert.match(storyPage, /sources\.findIndex\(\(candidate\) => candidate\.url === source\.url\)/);
});

test('non-MIT Feature sources render once and move after the article on mobile', () => {
  const page = fs.readFileSync(
    path.join(projectRoot, 'app/feature-coverage/[slug]/page.tsx'),
    'utf8',
  );
  const css = fs.readFileSync(
    path.join(projectRoot, 'app/feature-coverage/[slug]/page.module.css'),
    'utf8',
  );
  assert.match(page, /usesMitLayout && sectionIndex === 0/);
  assert.match(page, /styles\.sourcesRail/);
  assert.match(css, /\.sourcesRail[\s\S]*order: 4/);
});

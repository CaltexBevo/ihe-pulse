import assert from 'node:assert/strict';
import test from 'node:test';

import {
  dedupeStories,
  formatEpisodeDateRange,
  getHomepageQuickHits,
  getStoryImage,
  selectPriorEpisodes,
  storyIdentity,
} from '../lib/homepagePulse.ts';
import {
  getHomePulseArtwork,
  getHomePulseSupportCopy,
} from '../lib/home-pulse-artwork.ts';
import { getHomePulseWaveform } from '../lib/home-pulse-waveforms.ts';
import type { InnovationPulseEpisode } from '../lib/data/innovation-pulse-types.ts';

function episode(overrides: Partial<InnovationPulseEpisode> = {}): InnovationPulseEpisode {
  return {
    date: '2026-08-28',
    dayOfWeek: 'Friday',
    editorialLens: "The Innovator's Edge",
    editorialHook: '',
    audioUrl: '',
    audioDuration: '9:14',
    deepDive: {
      title: 'Lead story',
      summary: '',
      source: 'Source',
      sourceUrl: 'https://example.com/lead',
      isCallback: false,
      category: 'Research & Innovation',
    },
    quickHits: [],
    storiesWatching: [],
    closingThought: '',
    categories: ['Research & Innovation'],
    themes: [],
    ...overrides,
  };
}

function quickHit(title: string, sourceUrl = '') {
  return {
    title,
    summary: `${title} summary`,
    source: 'Source',
    sourceUrl,
    category: 'Teaching & Learning' as const,
  };
}

test('uses source URL first and date plus normalized title as the fallback identity', () => {
  assert.equal(
    storyIdentity({ title: 'A Story', sourceUrl: ' HTTPS://EXAMPLE.COM/STORY ' }, '2026-08-28'),
    'source:https://example.com/story',
  );
  assert.equal(
    storyIdentity({ title: 'A Story: With AI!', sourceUrl: '' }, ' 2026-08-28 '),
    'story:2026-08-28:a-story-with-ai',
  );
});

test('deduplicates repeated source URLs while preserving first-seen order', () => {
  const stories = [
    { ...quickHit('First', 'https://example.com/story'), date: '2026-08-28' },
    { ...quickHit('Same story, different title', 'https://example.com/story'), date: '2026-08-28' },
    { ...quickHit('Second'), date: '2026-08-28' },
  ];

  assert.deepEqual(dedupeStories(stories).map((story) => story.title), ['First', 'Second']);
});

test('retains every dynamic quick hit count and excludes a repeated lead', () => {
  const makeHits = (count: number) => Array.from({ length: count }, (_, index) => quickHit(`Quick hit ${index + 1}`, `https://example.com/${index + 1}`));
  const five = episode({ quickHits: [quickHit('Lead story', 'https://example.com/lead'), ...makeHits(5)] });
  const seven = episode({ quickHits: [quickHit('Lead story', 'https://example.com/lead'), ...makeHits(7)] });

  assert.equal(getHomepageQuickHits(five).length, 5);
  assert.equal(getHomepageQuickHits(seven).length, 7);
  assert.equal(getHomepageQuickHits(seven).some((story) => story.title === 'Lead story'), false);
});

test('selects the approved three-week homepage lookback after the current lead and prior release', () => {
  const episodes = [
    episode({ date: '2026-08-28' }),
    episode({ date: '2026-08-21' }),
    episode({ date: '2026-08-14' }),
    episode({ date: '2026-08-07' }),
    episode({ date: '2026-07-31' }),
  ];
  assert.deepEqual(selectPriorEpisodes(episodes).map((item) => item.date), [
    '2026-08-14',
    '2026-08-07',
    '2026-07-31',
  ]);
});

test('formats weekly episode dates as a compact archive label', () => {
  assert.equal(
    formatEpisodeDateRange(episode({ cadence: 'weekly', weekCovered: '2026-08-08/2026-08-14' })),
    'AUG 8–14',
  );
  assert.equal(
    formatEpisodeDateRange(episode({ cadence: 'weekly', weekCovered: '2026-08-29/2026-09-04' })),
    'AUG 29 – SEP 4',
  );
});

test('uses a provided image and only falls back when the image is missing', () => {
  assert.equal(getStoryImage({ image: ' /images/story.webp ' }, '/images/fallback.webp'), '/images/story.webp');
  assert.equal(getStoryImage({ image: '' }, '/images/fallback.webp'), '/images/fallback.webp');
  assert.equal(getStoryImage({}, null), null);
});

test('binds the approved Option A master and current-edition value copy', () => {
  assert.equal(
    getHomePulseArtwork('2026-08-28'),
    '/images/innovation-pulse/homepage/2026-08-28-option-a-master.png',
  );
  assert.equal(
    getHomePulseSupportCopy('2026-08-28'),
    'AI policy, new programs, classroom tools, and research, distilled for higher ed leaders.',
  );
});

test('uses the real approved audio envelope for the current weekly player', () => {
  const waveform = getHomePulseWaveform('2026-08-28');
  assert.ok(waveform);
  assert.equal(waveform.length, 104);
  assert.ok(Math.min(...waveform) >= 14);
  assert.ok(Math.max(...waveform) <= 100);
  assert.equal(getHomePulseWaveform('2099-01-01'), null);
});

test('uses verified audio envelopes for every homepage past episode', () => {
  for (const date of ['2026-08-14', '2026-08-07', '2026-07-31']) {
    const waveform = getHomePulseWaveform(date);
    assert.ok(waveform);
    assert.equal(waveform.length, 44);
    assert.ok(Math.min(...waveform) >= 14);
    assert.ok(Math.max(...waveform) <= 100);
  }
});

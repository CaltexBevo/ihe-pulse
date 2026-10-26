import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const read = path => readFileSync(new URL('../' + path, import.meta.url));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const release = JSON.parse(read('data/daily-pulse/2026-10-16.json'));

test('Edition 21 preserves the approved ten-story payload and placement', () => {
  const stories = [release.leadStory, ...release.quickHits];
  assert.deepEqual(stories.map(s => s.selectionId), ['72','1','2','27','29','C','53','69','A','52']);
  // Frozen after source parity against the founder-selected ARTICLES.json.
  assert.equal(sha(JSON.stringify(stories)), 'dc98d3a13c9cb69e1e117abc62c4c097e3e264dd8fabd579241b440e8b4f1361');
  assert.equal(release.episode.date, '2026-10-16');
  assert.equal(release.episode.publishedAt, '2026-10-26');
  assert.equal(release.episode.weekCovered, '2026-10-10/2026-10-16');
});

test('Edition 21 artwork and player bind the selected masters', () => {
  assert.equal(sha(read('public' + release.episode.weeklyHeroImageUrl)), '98596572f340bce810baceb73fd8246378ae2451f2d20e5e758cb48dce2bc74e');
  const audioHash = sha(read('public' + release.episode.audioUrl));
  assert.equal(audioHash, '4a0de558470b59903e8ce9b9b09974b6c8b893aa771ebb2ee7c681bbf8c8d133');
  assert.equal(release.episode.audioDuration, '7:03');
  const waveform = read('lib/home-pulse-waveforms.ts').toString();
  assert.ok(waveform.includes(audioHash));
  const values = JSON.parse(waveform.match(/"2026-10-16": (\[[^\]]+\])/)[1]);
  assert.equal(values.length, 104);
  assert.equal(Math.min(...values), 14);
  assert.equal(Math.max(...values), 100);
});

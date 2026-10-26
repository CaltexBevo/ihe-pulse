import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { getAllEpisodes, getEpisodeByDate } from '../lib/data/innovation-pulse.ts';
import { getWeeklyEditionContent, getEditionFeature } from '../lib/weeklyEdition.ts';
import { getHomepageEpisodeStories } from '../lib/homepagePulse.ts';
import { TEACHING_SUPERPOWER_FEATURED_COVERAGE } from '../lib/data/featured-coverage-teaching-superpower.ts';

function requiredEpisode(date: string) {
  const episode = getEpisodeByDate(date);
  assert.ok(episode, 'Expected edition ' + date);
  return episode;
}

test('Edition 20 leads with its full original Feature and keeps all eight illustrated news stories', () => {
  const episode = requiredEpisode('2026-10-09');
  const before = JSON.stringify(episode);
  const content = getWeeklyEditionContent(episode);
  assert.equal(content.feature?.slug, 'my-voice-at-scale');
  assert.equal(content.feature.sections.flatMap(section => section.paragraphs).length, 31);
  assert.equal(content.storyCount, 9);
  assert.equal(content.stories.length, 8);
  assert.equal(content.stories[0].title, 'AI Turned His Brain Signals Into His Familiar Voice');
  assert.equal(content.stories[0].image, '/images/innovation-pulse/2026-10-09/story-WOW-01.png');
  assert.ok(content.stories.every(story => story.image && !story.href.includes('my-voice-at-scale')));
  assert.deepEqual(content.stories.map(story => story.title), getHomepageEpisodeStories(episode).filter(story => story.sourceUrl !== content.lead.sourceUrl).map(story => story.title));
  assert.equal(JSON.stringify(episode), before, 'website ordering must not mutate broadcast or source data');
});

test('September 25 uses the canonical first-person Feature, not its episode abstract', () => {
  const episode = requiredEpisode('2026-09-25');
  const content = getWeeklyEditionContent(episode);
  assert.equal(content.feature, TEACHING_SUPERPOWER_FEATURED_COVERAGE);
  assert.match(content.feature.sections[0].paragraphs[0], /What could we help our students discover/);
  assert.notEqual(content.feature.sections[0].paragraphs[0], episode.deepDive.summary.split('\n\n')[0]);
  assert.equal(content.stories.length + 1, getHomepageEpisodeStories(episode).length);
  assert.ok(content.stories.every(story => !story.href.includes(content.feature!.slug)));
});

test('September 4 preserves its own Feature and Brent Jones byline', () => {
  const content = getWeeklyEditionContent(requiredEpisode('2026-09-04'));
  assert.equal(content.feature!.slug, 'four-new-ai-models-next-project');
  assert.match(content.feature!.byline, /^Brent Jones/);
  assert.equal(content.storyCount, 5);
  assert.ok(content.stories.every(story => story.date === '2026-09-04'));
});

test('historical editions stay independent and every edition story is represented once', () => {
  for (const episode of getAllEpisodes()) {
    const content = getWeeklyEditionContent(episode);
    assert.equal(content.storyCount, getHomepageEpisodeStories(episode).length);
    assert.equal(content.stories.length + 1, content.storyCount);
    assert.ok(content.stories.every(story => story.date === (episode.publishedAt || episode.date)));
    if (content.feature) assert.equal(content.feature.editionDate ?? content.feature.publishedAt, episode.date);
  }
  for (const date of ['2026-09-11', '2026-09-18']) {
    const episode = requiredEpisode(date);
    const content = getWeeklyEditionContent(episode);
    assert.equal(content.feature, undefined);
    assert.equal(content.lead.summary, episode.deepDive.summary);
  }
  assert.equal(getEditionFeature({ ...requiredEpisode('2026-09-25').deepDive, date: '2026-09-04' }, '2026-09-04'), undefined);
});

test('Edition 21 keeps its covered-week route key while cards show actual publication date', () => {
  const episode = requiredEpisode('2026-10-16');
  const content = getWeeklyEditionContent(episode);
  assert.equal(episode.date, '2026-10-16');
  assert.equal(episode.weekCovered, '2026-10-10/2026-10-16');
  assert.equal(episode.publishedAt, '2026-10-26');
  assert.ok(content.stories.every(story => story.date === '2026-10-26'));
  assert.ok(content.stories.every(story => story.dateLabel === 'Oct 26, 2026'));
  assert.equal(getEpisodeByDate('2026-10-26'), null, 'publication date must not create a different edition route');
});

test('archive CTA remains a date-specific route and expandable Feature skips only the visible introduction', () => {
  const link = readFileSync(new URL('../components/EditionLink.tsx', import.meta.url), 'utf8');
  assert.ok(link.includes('/innovation-pulse/${date}'));
  assert.ok(link.includes('Read Full Edition'));
  const view = readFileSync(new URL('../components/WeeklyEditionView.tsx', import.meta.url), 'utf8');
  assert.ok(view.includes('section.paragraphs.slice(1) : section.paragraphs'));
  assert.ok(view.includes('Read Full Feature'));
  assert.ok(view.includes('cleanBroadcastScript(episode.broadcastScript)'));
});

test('Edition 19 retains Dartmouth as its news lead and its eleven selected website stories', () => {
  const episode = requiredEpisode('2026-10-02');
  const content = getWeeklyEditionContent(episode);
  assert.equal(episode.editionNumber, 19);
  assert.equal(content.lead.title, 'A Clearer Path From an AI Flag to a Grading Decision');
  assert.equal(content.feature, undefined, 'the separate Wonka Feature must not replace the news lead');
  assert.equal(content.storyCount, 11);
  assert.equal(content.stories.length, 10);
  assert.ok(content.stories.some(story => story.title === 'More Control Over What AI Feedback Reveals'));
  assert.ok(content.stories.every(story => !story.href.includes('wonka')));
});

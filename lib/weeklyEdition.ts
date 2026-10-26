import type { InnovationPulseEpisode } from './data/innovation-pulse-types';
import { generateSlug, mapToV4Category } from './data/innovation-pulse';
import { FEATURED_COVERAGE } from './data/featured-coverage';
import { getHomepageEpisodeStories, type HomepageStory } from './homepagePulse';

/** Bind original coverage to its own edition and exact story identity, never the latest Feature. */
export function getEditionFeature(story: HomepageStory, date: string) {
  return FEATURED_COVERAGE.find(feature =>
    (feature.editionDate ?? feature.publishedAt) === date && (
      story.sourceUrl === 'https://www.innovatinghighered.com/feature-coverage/' + feature.slug ||
      story.sourceUrl === '/feature-coverage/' + feature.slug ||
      story.title === feature.title
    )
  );
}

export function getWeeklyEditionContent(episode: InnovationPulseEpisode) {
  const stories = getHomepageEpisodeStories(episode);
  // Edition 20's website lead is its original Feature; the broadcast's first
  // story remains unchanged in the episode data and transcript.
  const lead = (episode.date === '2026-10-09'
    ? stories.find(story => getEditionFeature(story, episode.date)?.slug === 'my-voice-at-scale')
    : undefined) ?? stories[0];
  const feature = getEditionFeature(lead, episode.date);
  const publishedAt = episode.publishedAt || episode.date;
  const dateLabel = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(publishedAt + 'T12:00:00Z'));
  return {
    lead, feature, storyCount: stories.length,
    stories: stories.filter(story => story !== lead).map(story => {
      const original = getEditionFeature(story, episode.date);
      const href = original ? '/feature-coverage/' + original.slug : '/innovation-pulse/story/' + generateSlug(story.title);
      return { id: href, href, title: original?.title || story.title, summary: story.summary, source: story.source, category: mapToV4Category(story.category), date: publishedAt, dateLabel, image: original?.imagePath || story.heroImage || story.image || '' };
    }),
  };
}

import { getAllEpisodes, mapToV4Category } from '@/lib/data/innovation-pulse';
import { formatWeekCovered } from '@/lib/data/innovation-pulse-types';
import { getPulseEpisodeThumbnail, getEpisodeHeroArtwork } from '@/lib/home-pulse-artwork';
import type { ArchiveEpisodeData } from '@/app/innovation-pulse/archive/ArchiveListClient';

function excerpt(summary: string): string {
  const firstParagraph = summary.split(/\n\s*\n/)[0]?.trim() || '';
  if (firstParagraph.length <= 300) return firstParagraph;
  return `${firstParagraph.slice(0, 297).replace(/\s+\S*$/, '')}…`;
}


export function getLibraryEditions(): ArchiveEpisodeData[] {
  const allEpisodes = getAllEpisodes();
  return allEpisodes.map((episode) => ({
    date: episode.date,
    audioUrl: episode.audioUrl,
    audioDuration: episode.audioDuration,
    headline: episode.deepDive.title,
    summary: excerpt(episode.deepDive.summary),
    storyCount: 1 + episode.quickHits.length,
    weekLabel: formatWeekCovered(episode),
    thumbnailUrl: episode.date === '2026-09-11' ? '/images/innovation-pulse/homepage/2026-09-11-approved-bold-diagonal.png' : getPulseEpisodeThumbnail(episode.date) || getEpisodeHeroArtwork(episode.date),
    fallbackImage: episode.deepDive.heroImage || episode.deepDive.image || null,
    relatedTitles: episode.quickHits.slice(0, 3).map((story) => story.title),
    searchText: [
      episode.deepDive.title,
      episode.deepDive.summary,
      episode.deepDive.source,
      ...episode.quickHits.flatMap((story) => [story.title, story.summary]),
      mapToV4Category(episode.deepDive.category),
      ...episode.quickHits.map((story) => mapToV4Category(story.category)),
      episode.date,
      episode.weekCovered,
    ].filter(Boolean).join(' ').toLowerCase(),
  }));
}

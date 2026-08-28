import Link from 'next/link';
import { getAllEpisodes, mapToV4Category } from '@/lib/data/innovation-pulse';
import { formatWeekCovered } from '@/lib/data/innovation-pulse-types';
import { getPulseEpisodeThumbnail } from '@/lib/home-pulse-artwork';
import { pageMetadata } from '@/lib/og';
import ArchiveListClient, { type ArchiveEpisodeData } from './ArchiveListClient';
import styles from './archive.module.css';

export const metadata = pageMetadata({
  title: 'Innovation Pulse Episodes | Innovating Higher Ed',
  description: 'Listen to every Innovation Pulse episode and explore the weekly A.I. stories shaping higher education.',
  path: '/innovation-pulse/archive',
});

function excerpt(summary: string): string {
  const firstParagraph = summary.split(/\n\s*\n/)[0]?.trim() || '';
  if (firstParagraph.length <= 300) return firstParagraph;
  return `${firstParagraph.slice(0, 297).replace(/\s+\S*$/, '')}…`;
}

export default function AllEpisodesPage() {
  const allEpisodes = getAllEpisodes();
  const totalStories = allEpisodes.reduce((sum, episode) => sum + 1 + episode.quickHits.length, 0);
  const weekCount = new Set(allEpisodes.map((episode) => episode.weekCovered || episode.date)).size;
  const episodeData: ArchiveEpisodeData[] = allEpisodes.map((episode) => ({
    date: episode.date,
    audioUrl: episode.audioUrl,
    audioDuration: episode.audioDuration,
    headline: episode.deepDive.title,
    summary: excerpt(episode.deepDive.summary),
    storyCount: 1 + episode.quickHits.length,
    weekLabel: formatWeekCovered(episode),
    thumbnailUrl: getPulseEpisodeThumbnail(episode.date),
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

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <Link href="/" className={styles.backLink}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <div className={styles.introGrid}>
          <div>
            <div className={styles.eyebrow}>Innovation Pulse</div>
            <h1>Every episode. The stories behind the week.</h1>
            <p>
              Listen to the weekly A.I. news shaping higher education, then open any episode to explore every story and source.
            </p>
          </div>

          <dl className={styles.stats} aria-label="Archive totals">
            <div><dt>Episodes</dt><dd>{allEpisodes.length}</dd></div>
            <div><dt>Stories</dt><dd>{totalStories}</dd></div>
            <div><dt>Weeks</dt><dd>{weekCount}</dd></div>
          </dl>
        </div>
      </header>

      {episodeData.length > 0 && (
        <ArchiveListClient featuredEpisode={episodeData[0]} episodes={episodeData.slice(1)} />
      )}
    </div>
  );
}

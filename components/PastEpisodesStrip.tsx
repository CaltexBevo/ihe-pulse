import Link from 'next/link';
import { formatEpisodeDateRange, selectPriorEpisodes } from '@/lib/homepagePulse';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';
import styles from './PastEpisodesStrip.module.css';

export default function PastEpisodesStrip({ allEpisodes }: { allEpisodes: InnovationPulseEpisode[] }) {
  const priorEpisodes = selectPriorEpisodes(allEpisodes);
  if (priorEpisodes.length === 0) return null;
  return (
    <section className={styles.section} aria-labelledby="past-episodes-heading">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--px)]">
        <div className={styles.module}>
          <div className={styles.heading}>
            <h2 id="past-episodes-heading">Past Innovation Pulse Editions</h2>
            <Link href="/innovation-pulse/archive" className={styles.archiveLink}>All editions <span aria-hidden="true">→</span></Link>
          </div>
          <div className={styles.episodeGrid}>
            {priorEpisodes.map((episode) => (
              <Link key={episode.date} href={'/innovation-pulse/' + episode.date} className={styles.episodeCard}
                aria-label={'Listen to the ' + formatEpisodeDateRange(episode) + ' Innovation Pulse edition: ' + episode.deepDive.title}>
                <span className={styles.metadata}>
                  <time dateTime={episode.date}>{formatEpisodeDateRange(episode)}</time>
                  {episode.audioDuration && <span> · {episode.audioDuration}</span>}
                </span>
                <h3 className={styles.title}>{episode.deepDive.title}</h3>
                <span className={styles.listen}>Listen <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

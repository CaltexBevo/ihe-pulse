import Link from 'next/link';
import type { CSSProperties } from 'react';
import { formatEpisodeDateRange, selectPriorEpisodes } from '@/lib/homepagePulse';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';
import { getHomePulseWaveform } from '@/lib/home-pulse-waveforms';
import styles from './PastEpisodesStrip.module.css';

interface PastEpisodesStripProps {
  allEpisodes: InnovationPulseEpisode[];
}

function Waveform({ episode }: { episode: InnovationPulseEpisode }) {
  const waveform = getHomePulseWaveform(episode.date);

  if (!waveform) {
    return <div className={styles.waveformUnavailable} aria-hidden="true" />;
  }

  return (
    <div className={styles.waveform} aria-hidden="true">
      {waveform.map((height, index) => (
        <span
          key={episode.date + '-' + String(index)}
          className={
            index % 5 === 1 || index % 7 === 3
              ? styles.waveBarMuted
              : styles.waveBar
          }
          style={
            {
              '--wave-height': String(height) + '%',
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

export default function PastEpisodesStrip({
  allEpisodes,
}: PastEpisodesStripProps) {
  const priorEpisodes = selectPriorEpisodes(allEpisodes);
  if (priorEpisodes.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="past-episodes-heading">
      <div className="mx-auto max-w-[var(--max-w)] px-[var(--px)]">
        <div className={styles.module}>
          <div className={styles.heading}>
            <h2 id="past-episodes-heading">Past Innovation Pulse Episodes</h2>
            <p>Listen back to earlier weekly briefings.</p>
          </div>

          <div className={styles.episodeGrid}>
            {priorEpisodes.map((episode) => {
              const dateLabel = formatEpisodeDateRange(episode);

              return (
                <Link
                  key={episode.date}
                  href={'/innovation-pulse/' + episode.date}
                  className={styles.episodeCard}
                  aria-label={
                    'Listen to the ' +
                    dateLabel +
                    ' Innovation Pulse episode: ' +
                    episode.deepDive.title
                  }
                >
                  <span className={styles.playAffordance} aria-hidden="true">
                    <span className={styles.playGlyph} />
                  </span>
                  <time dateTime={episode.date} className={styles.episodeDate}>
                    <span className={styles.episodePrefix}>Episode</span>
                    <span>{dateLabel}</span>
                  </time>
                  <Waveform episode={episode} />
                  <span className={styles.runtime}>{episode.audioDuration}</span>
                </Link>
              );
            })}
          </div>

          <Link href="/innovation-pulse/archive" className={styles.archiveLink}>
            View the episode archive <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

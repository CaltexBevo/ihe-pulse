'use client';

import HomePulseHero, {
  type HomePulseHeroEpisode,
} from '@/components/HomePulseHero';
import type { InnovationPulseEpisode } from '@/lib/data/innovation-pulse-types';

interface HomeEpisodePlayerProps {
  latestEpisode: HomePulseHeroEpisode;
  /** Type compatibility for preserved source-archive callers; the live homepage does not pass this payload. */
  recentEpisodes?: InnovationPulseEpisode[];
}

/** Homepage audio owner. Episode navigation belongs to the archive, not this player. */
export default function HomeEpisodePlayer({ latestEpisode }: HomeEpisodePlayerProps) {
  return (
    <div className="animate-[fadeUp_0.7s_ease-out_both] motion-reduce:animate-none">
      <HomePulseHero episode={latestEpisode} />
    </div>
  );
}

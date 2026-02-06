import {
  getAllEpisodes,
  getLatestEpisode,
  getStoriesByCategory,
} from '@/lib/data/innovation-pulse';
import InnovationPulseClient from './InnovationPulseClient';

export default function InnovationPulsePage() {
  const episode = getLatestEpisode();
  const allEpisodes = getAllEpisodes();
  const storiesByCategory = getStoriesByCategory();

  return (
    <InnovationPulseClient
      episode={episode}
      allEpisodes={allEpisodes}
      storiesByCategory={storiesByCategory}
    />
  );
}

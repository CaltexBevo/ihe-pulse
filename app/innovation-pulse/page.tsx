import {
  getAllEpisodes,
  getLatestEpisode,
  getStoriesByCategory,
} from '@/lib/data/innovation-pulse';
import InnovationPulseClient from './InnovationPulseClient';

export const metadata = {
  title: "Innovation Pulse | Innovating Higher Ed",
  description:
    "Daily AI intelligence for higher education. Stay informed on the latest developments in AI, policy, and innovation affecting colleges and universities.",
};

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

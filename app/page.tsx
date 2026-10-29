import styles from './homepage/HomepageShell.module.css';
import HomepageWelcome from "./homepage/HomepageWelcome";
import MoreStoriesToExplore from "./homepage/MoreStoriesToExplore";
import HomeEpisodePlayer from "@/components/HomeEpisodePlayer";
import HomeGrantSpotlight from "@/components/HomeGrantSpotlight";
import HomepagePulse from "@/app/homepage/HomepagePulse";
import { getLatestEpisode } from "@/lib/data/innovation-pulse";
import { formatWeekCovered } from "@/lib/data/innovation-pulse-types";
import { getHomepageQuickHits } from "@/lib/homepagePulse";

// Keep Pacific lifecycle labels fresh, matching the grant portal route.
export const dynamic = "force-dynamic";

export default function Home() {
  const pulseEpisode = getLatestEpisode();
  const heroEpisode = pulseEpisode
    ? {
        date: pulseEpisode.date,
        weeklyHeroImageUrl: pulseEpisode.weeklyHeroImageUrl,
        audioUrl: pulseEpisode.audioUrl,
        audioDuration: pulseEpisode.audioDuration,
        headline: pulseEpisode.deepDive?.title || 'The Innovation Pulse',
        fallbackArtwork:
          pulseEpisode.deepDive?.heroImage || pulseEpisode.deepDive?.image || '',
        storyCount: 1 + getHomepageQuickHits(pulseEpisode).length,
        weekLabel: formatWeekCovered(pulseEpisode),
      }
    : null;

  return (
    <div className={styles.homepage} data-homepage>
      <HomepageWelcome />
      <div className={styles.leadRow}>
        {heroEpisode && <HomeEpisodePlayer latestEpisode={heroEpisode} compact />}
        <MoreStoriesToExplore />
      </div>
      <HomeGrantSpotlight compact />

      <HomepagePulse episode={pulseEpisode} />
    </div>
  );
}

import HomeEpisodePlayer from "@/components/HomeEpisodePlayer";
import PastEpisodesStrip from "@/components/PastEpisodesStrip";
import HomepagePulse from "@/app/homepage/HomepagePulse";
import { getLatestEpisode, getAllEpisodes } from "@/lib/data/innovation-pulse";
import { formatWeekCovered } from "@/lib/data/innovation-pulse-types";
import { getHomepageQuickHits } from "@/lib/homepagePulse";

export default function Home() {
  const pulseEpisode = getLatestEpisode();
  const allEpisodes = getAllEpisodes();
  const heroEpisode = pulseEpisode
    ? {
        date: pulseEpisode.date,
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
    <div className="flex flex-col">
      <section className="relative" aria-label="Latest Innovation Pulse">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,212,255,0.04)] via-[rgba(200,80,192,0.02)] to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent opacity-40" />

        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] relative">
          {heroEpisode && (
            <HomeEpisodePlayer latestEpisode={heroEpisode} />
          )}
        </div>
      </section>

      {pulseEpisode && <PastEpisodesStrip allEpisodes={allEpisodes} />}
      <HomepagePulse episode={pulseEpisode} />
    </div>
  );
}

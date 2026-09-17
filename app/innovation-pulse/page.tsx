import Link from "next/link";
import HomeEpisodePlayer from "@/components/HomeEpisodePlayer";
import AllStoriesClient, { type LibraryStory } from "./stories/AllStoriesClient";
import { getLatestEpisode, generateSlug, mapToV4Category } from "@/lib/data/innovation-pulse";
import { getHomepageEpisodeStories } from "@/lib/homepagePulse";
import { FEATURED_COVERAGE } from "@/lib/data/featured-coverage";
import { pageMetadata } from "@/lib/og";
import styles from "./stories/AllStories.module.css";

export const revalidate = 60;
export const metadata = pageMetadata({
  title: "Innovation Pulse | Innovating Higher Ed",
  description: "Listen to this week’s Innovation Pulse and explore every story in the edition.",
  path: "/innovation-pulse",
});

export default function InnovationPulsePage() {
  const episode = getLatestEpisode();
  if (!episode) return <div className={styles.page}><h1>Innovation Pulse</h1><p>No editions are available yet.</p></div>;
  const dateLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(episode.date + "T12:00:00Z"));
  const stories: LibraryStory[] = getHomepageEpisodeStories(episode).map(story => {
    const feature = FEATURED_COVERAGE.find(item => item.title === story.title || (story.sourceUrl && item.sourceUrl === story.sourceUrl));
    const href = feature ? "/feature-coverage/" + feature.slug : "/innovation-pulse/story/" + generateSlug(story.title);
    return { id: href, href, title: feature?.title || story.title, summary: story.summary, source: story.source, category: mapToV4Category(story.category), date: episode.date, dateLabel, image: feature?.imagePath || story.heroImage || story.image || "" };
  });
  return <div className={styles.page}>
    <HomeEpisodePlayer latestEpisode={episode} />
    <section className={styles.currentStories} aria-labelledby="current-stories-title">
      <h2 id="current-stories-title">This week’s stories</h2>
      <div className={styles.currentLinks}>
        <Link href={`/innovation-pulse/${episode.date}`}>View the complete edition <span aria-hidden="true">→</span></Link>
        <Link href="/innovation-pulse/stories">Explore the Library <span aria-hidden="true">→</span></Link>
        <Link href="/innovation-pulse/stories?tab=editions">Weekly Editions <span aria-hidden="true">→</span></Link>
      </div>
      <AllStoriesClient stories={stories} embedded />
    </section>
  </div>;
}

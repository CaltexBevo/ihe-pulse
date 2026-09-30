import WeeklyEditionView from "@/components/WeeklyEditionView";
import { getLatestEpisode, getEpisodeByDate } from "@/lib/data/innovation-pulse";
import { pageMetadata } from "@/lib/og";
import styles from "./stories/AllStories.module.css";

export const revalidate = 60;
export const metadata = pageMetadata({
  title: "Innovation Pulse | Innovating Higher Ed",
  description: "Listen to this week’s Innovation Pulse and explore every story in the edition.",
  path: "/innovation-pulse",
});

export default function InnovationPulsePage() {
  const latest = getLatestEpisode();
  if (!latest) return <div className={styles.page}><h1>Innovation Pulse</h1><p>No editions are available yet.</p></div>;
  const episode = getEpisodeByDate(latest.date) || latest;
  return <WeeklyEditionView episode={episode} current />;
}

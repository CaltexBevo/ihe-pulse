import { notFound } from "next/navigation";
import WeeklyEditionView from "@/components/WeeklyEditionView";
import { getAllEpisodes, getEpisodeByDate, getEpisodeDates, formatPulseDate } from "@/lib/data/innovation-pulse";
import { pageMetadata } from "@/lib/og";

// ISR: Revalidate every 60 seconds so new episodes appear quickly
export const revalidate = 60;

// Allow dynamic params for episodes added after build
export const dynamicParams = true;

// Static Params
export function generateStaticParams() {
  const dates = getEpisodeDates();
  return dates.map((date) => ({ date }));
}

// Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const episode = getEpisodeByDate(date);
  if (!episode) {
    return { title: "Edition Not Found | Innovation Pulse" };
  }
  return pageMetadata({
    title: `${episode.editionNumber ? `Weekly Edition ${episode.editionNumber}` : formatPulseDate(date)} | Innovation Pulse`,
    description: episode.editorialHook,
    path: `/innovation-pulse/${date}`,
    type: "article",
  });
}


export default async function InnovationPulseDatePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const episode = getEpisodeByDate(date);
  if (!episode) notFound();
  const episodes = getAllEpisodes();
  const index = episodes.findIndex(item => item.date === date);
  return <WeeklyEditionView episode={episode} previousDate={episodes[index + 1]?.date} nextDate={episodes[index - 1]?.date} />;
}

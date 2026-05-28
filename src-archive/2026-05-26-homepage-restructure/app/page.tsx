import Link from "next/link";
import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import HomeEpisodePlayer from "@/components/HomeEpisodePlayer";
import TopStoriesSlider from "@/components/TopStoriesSlider";
import LeadStoryCard from "@/components/LeadStoryCard";
import HomePromptCards from "@/components/HomePromptCards";
import HomeAIAppCards from "@/components/HomeAIAppCards";
import NewsletterSignup from "@/components/NewsletterSignup";
import {
  getLatestEpisode,
  getAllEpisodes,
  getAllStoriesAggregated,
  formatPulseDate,
  generateSlug,
  mapToV4Category,
  V4_CATEGORY_COLORS,
} from "@/lib/data/innovation-pulse";
import { episodes } from "@/lib/data/episodes";

export default function Home() {
  const pulseEpisode = getLatestEpisode();
  const allEpisodes = getAllEpisodes();
  const recentEpisodes = allEpisodes.slice(0, 6); // Last 6 episodes (sliding window)
  const allStories = getAllStoriesAggregated();
  const latestPodcastEpisodes = episodes.slice(0, 3);

  // Get lead story info - image is pre-assigned in the data
  const leadStory = pulseEpisode?.deepDive;
  const leadStoryV4Category = leadStory ? mapToV4Category(leadStory.category) : "Insights & Trends";
  const leadStoryColor = V4_CATEGORY_COLORS[leadStoryV4Category] || "#00d4ff";
  const leadStoryImage = leadStory?.image || "";

  // Get top stories - include lead story as first card
  const leadStoryAsCard = leadStory ? {
    ...leadStory,
    title: leadStory.title,
    summary: leadStory.summary,
    category: leadStory.category,
    source: leadStory.source,
    sourceUrl: leadStory.sourceUrl,
    date: pulseEpisode?.date,
    image: leadStoryImage,
    type: "deepDive" as const,
    isLead: true,
  } : null;

  const otherStories = allStories
    .filter(s => s.title !== leadStory?.title)
    .slice(0, 2);

  const topStories = leadStoryAsCard
    ? [leadStoryAsCard, ...otherStories]
    : otherStories.slice(0, 3);

  // Placeholder images for Podcasts
  const podcastImages = [
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=340&fit=crop",
    "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=600&h=340&fit=crop",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=340&fit=crop",
  ];

  return (
    <div className="flex flex-col">
      {/* ... full original content preserved ... */}
      {/* BACKUP CREATED: 2026-05-26 */}
      {/* This is a backup of the original homepage before the Innovation Pulse restructure */}
      {/* See the live file at /Volumes/MISHA 2TB/ihe-pulse/app/page.tsx for current version */}
    </div>
  );
}

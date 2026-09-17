import { Metadata } from "next";
import { getAllStoriesAggregated, generateSlug, mapToV4Category } from "@/lib/data/innovation-pulse";
import { FEATURED_COVERAGE } from "@/lib/data/featured-coverage";
import { pageMetadata } from "@/lib/og";
import LibraryView from "./LibraryView";
import { getLibraryEditions } from "@/lib/pulse-library";
import { type LibraryStory } from "./AllStoriesClient";
export const metadata: Metadata = pageMetadata({ title: "Explore the Library | Innovating Higher Ed", description: "Explore ideas, research, and practical examples for higher education.", path: "/innovation-pulse/stories" });
export const revalidate = 3600;
export default async function AllStoriesPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
 const { tab } = await searchParams;
 const seen = new Set<string>();
 const stories: LibraryStory[] = [];
 const label = (date: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(date + "T12:00:00Z"));
 // Original features own their canonical title, date, artwork, and destination.
 for (const feature of FEATURED_COVERAGE) {
  const href = "/feature-coverage/" + feature.slug;
  seen.add(href);
  stories.push({ id: href, href, title: feature.title, summary: feature.teaser, source: feature.sourceLabel, category: mapToV4Category(feature.category), date: feature.publishedAt, dateLabel: label(feature.publishedAt), image: feature.imagePath || "" });
 }
 // The aggregate is newest first, so repeated story routes retain the newest item.
 for (const story of getAllStoriesAggregated()) {
  const feature = FEATURED_COVERAGE.find(item => item.title === story.title || (story.sourceUrl && item.sourceUrl === story.sourceUrl));
  const href = feature ? "/feature-coverage/" + feature.slug : "/innovation-pulse/story/" + generateSlug(story.title);
  if (seen.has(href)) continue;
  seen.add(href);
  stories.push({ id: href, href, title: story.title, summary: story.summary, source: story.source, category: mapToV4Category(story.category), date: story.date, dateLabel: label(story.date), image: story.image || story.heroImage || "" });
 }
 stories.sort((a,b) => b.date.localeCompare(a.date));
 return <LibraryView stories={stories} editions={getLibraryEditions()} tab={tab} />;
}

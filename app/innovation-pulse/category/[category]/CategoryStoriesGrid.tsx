"use client";

import StoryPreviewCard from "@/components/StoryPreviewCard";
import type { V4Category } from "@/lib/data/innovation-pulse";

// Badge text mapping
const V4_BADGE_TEXT: Record<V4Category, string> = {
  "Insights & Trends": "INSIGHTS",
  "Case Study": "CASE STUDY",
  "Practical Tips": "TIPS",
  "Ethical AI": "ETHICS",
  "Latest AI Products": "PRODUCTS",
  "Beyond Ed": "BEYOND ED",
  "Week in Review": "WEEK REVIEW",
  "Research": "RESEARCH",
  "AI Workforce & Careers": "CAREERS",
  "Investing in Innovation": "INVESTING",
};

interface CategoryStory {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: V4Category;
  categoryColor: string;
  date: string;
  image: string;
  omitImage?: boolean;
  type: "deepDive" | "quickHit";
  editorialLens: string;
  slug: string;
}

interface CategoryStoriesGridProps {
  stories: CategoryStory[];
  category: V4Category;
  categoryColor: string;
}

export default function CategoryStoriesGrid({ stories }: CategoryStoriesGridProps) {
  return <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
    {stories.map((story,i) => <StoryPreviewCard headingLevel={2} key={story.slug+'-'+i}
      href={'/innovation-pulse/story/'+story.slug} title={story.title} intro={story.summary}
      image={story.omitImage ? undefined : story.image} category={story.category}
      source={story.source} sourceUrl={story.sourceUrl} dateLabel={story.date}
      badge={story.type === 'deepDive' ? 'Lead' : V4_BADGE_TEXT[story.category]} expandedText={story.summary} />)}
  </div>;
}

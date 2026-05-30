"use client";

import Card from "@/components/Card";
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
  type: "deepDive" | "quickHit";
  editorialLens: string;
  slug: string;
}

interface CategoryStoriesGridProps {
  stories: CategoryStory[];
  category: V4Category;
  categoryColor: string;
}

export default function CategoryStoriesGrid({ stories, category, categoryColor }: CategoryStoriesGridProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stories.map((story, i) => (
        <Card
          key={`${story.slug}-${i}`}
          title={story.title}
          teaser={story.summary}
          fullContent={story.summary}
          category={story.category}
          categoryColor={story.categoryColor}
          source={story.source}
          sourceUrl={story.sourceUrl}
          date={story.date}
          imageUrl={story.image}
          badgeText={story.type === "deepDive" ? "LEAD" : V4_BADGE_TEXT[category]}
          badgeColor={story.type === "deepDive" ? "rgba(0,212,255,0.85)" : categoryColor}
          expandable={true}
        />
      ))}
    </div>
  );
}

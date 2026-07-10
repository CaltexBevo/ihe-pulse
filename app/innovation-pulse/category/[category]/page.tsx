import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getCategoryFromSlug,
  getStoriesByV4Category,
  V4_CATEGORIES,
  V4_CATEGORY_SLUGS,
  V4_CATEGORY_COLORS,
  V4_CATEGORY_DESCRIPTIONS,
  formatShortDate,
  type V4Category,
} from "@/lib/data/innovation-pulse";
import CategoryStoriesGrid from "./CategoryStoriesGrid";
import { pageMetadata } from "@/lib/og";

export async function generateStaticParams() {
  return V4_CATEGORIES.map((cat) => ({
    category: V4_CATEGORY_SLUGS[cat],
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategoryFromSlug(slug);

  if (!category) {
    return { title: "Category Not Found | Innovation Pulse" };
  }

  return pageMetadata({
    title: `${category} | Innovation Pulse`,
    description: V4_CATEGORY_DESCRIPTIONS[category],
    path: `/innovation-pulse/category/${slug}`,
  });
}

export default async function CategoryArchivePage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = getCategoryFromSlug(slug);

  if (!category) {
    notFound();
  }

  const stories = getStoriesByV4Category(category);
  const categoryColor = V4_CATEGORY_COLORS[category];
  const categoryDescription = V4_CATEGORY_DESCRIPTIONS[category];

  // Transform stories for the Card component
  const cardStories = stories.map((story) => ({
    title: story.title,
    summary: story.summary,
    source: story.source,
    sourceUrl: story.sourceUrl,
    category: category,
    categoryColor: categoryColor,
    date: formatShortDate(story.episodeDate),
    image: story.image || "",
    type: story.type,
    editorialLens: story.editorialLens,
    slug: story.slug,
  }));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-8">
        {/* Back Link */}
        <Link
          href="/"
          className="font-mono text-[0.72rem] text-[var(--cyan)] flex items-center gap-2 hover:text-[var(--text)] transition-colors mb-6"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Category Header — gradient text */}
        <h1
          className="text-[clamp(1.8rem,4vw,2.4rem)] font-bold mb-4"
          style={{
            background: "linear-gradient(90deg, var(--cyan), var(--purple))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {category === "Case Study" ? "Case Studies" : category}
        </h1>

        <p className="text-[1rem] text-[var(--text-secondary)] leading-[1.6] max-w-[640px] mb-6">
          {categoryDescription}
        </p>

        {/* Story Count */}
        <div className="font-mono text-[0.72rem]">
          <span className="text-[var(--cyan)]">{stories.length}</span>
          <span className="text-[var(--text-muted)]"> {stories.length === 1 ? "story" : "stories"} in this category</span>
        </div>
      </div>

      {/* Divider */}
      <div className="section-divider" />

      {/* Stories Grid — client component for expandable cards */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
        {stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">No stories in this category yet.</p>
          </div>
        ) : (
          <CategoryStoriesGrid stories={cardStories} category={category} categoryColor={categoryColor} />
        )}
      </div>

      {/* Other Categories */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10 border-t border-[var(--border)]">
        <h2 className="font-mono text-[0.68rem] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-4">
          Browse Other Categories
        </h2>
        <div className="flex flex-wrap gap-2">
          {V4_CATEGORIES.filter(cat => cat !== category).map((cat) => (
            <Link
              key={cat}
              href={`/innovation-pulse/category/${V4_CATEGORY_SLUGS[cat]}`}
              className="px-3 py-[0.4rem] rounded-full border border-[var(--border)] text-[var(--text-secondary)] font-mono text-[0.7rem] hover:border-[var(--border-hover)] transition-colors flex items-center gap-2"
            >
              <span
                className="w-[5px] h-[5px] rounded-full"
                style={{ backgroundColor: V4_CATEGORY_COLORS[cat] }}
              />
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

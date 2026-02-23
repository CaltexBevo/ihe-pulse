import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getCategoryFromSlug,
  getStoriesByV4Category,
  V4_CATEGORIES,
  V4_CATEGORY_SLUGS,
  V4_CATEGORY_COLORS,
  V4_CATEGORY_DESCRIPTIONS,
  formatShortDate,
  generateSlug,
  type V4Category,
} from "@/lib/data/innovation-pulse";

// Placeholder images
const storyImages = [
  "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=340&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=340&fit=crop",
];

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

  return {
    title: `${category} | Innovation Pulse`,
    description: V4_CATEGORY_DESCRIPTIONS[category],
  };
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-8">
        {/* Back Link */}
        <Link
          href="/innovation-pulse"
          className="font-mono text-[0.72rem] text-[var(--cyan)] flex items-center gap-2 hover:text-[var(--text)] transition-colors mb-6"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back to Innovation Pulse
        </Link>

        {/* Category Header */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="w-[10px] h-[10px] rounded-full"
            style={{ backgroundColor: categoryColor }}
          />
          <h1
            className="text-[clamp(1.8rem,4vw,2.4rem)] font-bold"
            style={{ color: categoryColor }}
          >
            {category}
          </h1>
        </div>

        <p className="text-[1rem] text-[var(--text-secondary)] leading-[1.6] max-w-[640px] mb-6">
          {categoryDescription}
        </p>

        {/* Story Count */}
        <div className="font-mono text-[0.7rem] text-[var(--text-muted)]">
          {stories.length} {stories.length === 1 ? "story" : "stories"} in this category
        </div>
      </div>

      {/* Divider */}
      <div className="section-divider" />

      {/* Stories Grid */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-10">
        {stories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[var(--text-muted)]">No stories in this category yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story, i) => {
              const imageIndex = Math.abs(story.slug.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % storyImages.length;

              return (
                <Link
                  key={story.slug}
                  href={story.type === "deepDive" ? `/innovation-pulse/story/${story.slug}` : "#"}
                  className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] transition-all"
                >
                  {/* Image */}
                  <div className="relative h-[160px] overflow-hidden">
                    <Image
                      src={storyImages[imageIndex]}
                      alt={story.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,15,0.4)] via-transparent to-transparent" />
                    {/* Badge */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {story.type === "deepDive" && (
                        <span className="font-mono text-[0.53rem] font-semibold tracking-[0.06em] px-2 py-[3px] rounded-[5px] bg-[rgba(0,212,255,0.85)] text-[#08080f]">
                          LEAD STORY
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Category + Lens */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="font-mono text-[0.55rem] font-semibold tracking-[0.08em] uppercase flex items-center gap-[0.3rem]"
                        style={{ color: categoryColor }}
                      >
                        <span
                          className="w-[5px] h-[5px] rounded-full"
                          style={{ backgroundColor: categoryColor }}
                        />
                        {category}
                      </span>
                      <span className="font-mono text-[0.5rem] text-[var(--text-muted)]">
                        · {story.editorialLens}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[0.95rem] font-bold leading-[1.25] mb-2 line-clamp-2 group-hover:text-[var(--cyan)] transition-colors">
                      {story.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.5] line-clamp-2 mb-3">
                      {story.summary}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-3 border-t border-[var(--border)] font-mono text-[0.58rem]">
                      <span className="text-[var(--cyan)]">{story.source}</span>
                      <span className="text-[var(--text-muted)]">{formatShortDate(story.episodeDate)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
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

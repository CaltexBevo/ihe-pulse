import Link from "next/link";
import { posts, postTags } from "@/lib/data/posts";

export const metadata = {
  title: "Tinker Lab | Innovating Higher Ed",
  description:
    "Where Dr. Norma Jones tests, breaks, and explores AI tools and pedagogy. Raw insights from the frontier of AI in education.",
};

function getDifficultyColor(tag: string) {
  switch (tag) {
    case "Walkthrough":
      return { bg: "var(--green-dim)", color: "var(--green)" };
    case "Experiment":
      return { bg: "var(--cyan-dim)", color: "var(--cyan)" };
    case "Comparison":
      return { bg: "var(--amber-dim)", color: "var(--amber)" };
    case "Opinion":
      return { bg: "var(--magenta-dim)", color: "var(--magenta)" };
    default:
      return { bg: "var(--surface)", color: "var(--text-muted)" };
  }
}

export default function TinkerLabPage() {
  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const otherPosts = posts.filter((p) => p !== featuredPost);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-6 animate-[fadeUp_0.7s_ease-out_both]">
        <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--cyan)] mb-2 flex items-center gap-2">
          <span className="text-[1rem]">🧪</span>
          TINKER LAB
        </div>
        <h1 className="font-sans text-[clamp(2rem,5vw,2.4rem)] font-bold leading-[1.1] text-[var(--text)] mb-3">
          Experiments & Ideas
        </h1>
        <p className="text-[0.92rem] text-[var(--text-secondary)] max-w-[620px] leading-[1.6]">
          Where Dr. Norma Jones tests, breaks, and explores AI tools and pedagogy.
          Raw insights from the frontier of AI in education.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[0.58rem] text-[var(--text-muted)] tracking-[0.08em] uppercase min-w-[60px]">
            Type
          </span>
          <button className="filter-pill active">All</button>
          {postTags.filter((t) => t !== "All").map((tag) => (
            <button
              key={tag}
              className="filter-pill"
              style={{
                borderColor: `${getDifficultyColor(tag).color}30`,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-10">
          <Link
            href={`/tinker-lab/${featuredPost.slug}`}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-6 lg:p-8 relative overflow-hidden flex flex-col lg:flex-row gap-6 hover:border-[var(--border-hover)] hover:-translate-y-[2px] transition-all duration-300 group block"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

            {/* Thumbnail */}
            {featuredPost.thumbnail && (
              <div className="shrink-0 w-full lg:w-[280px] h-[180px] lg:h-[200px] rounded-[14px] overflow-hidden relative bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] opacity-50">
                <span className="absolute top-3 left-3 font-mono text-[0.55rem] font-semibold px-2 py-[3px] rounded-[5px] bg-[var(--cyan)] text-white">
                  Featured
                </span>
              </div>
            )}

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="font-mono text-[0.55rem] font-semibold px-2 py-[3px] rounded-[4px]"
                  style={getDifficultyColor(featuredPost.tag)}
                >
                  {featuredPost.tag}
                </span>
                <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                  {featuredPost.readTime}
                </span>
              </div>
              <h2 className="text-[1.4rem] font-bold leading-[1.22] mb-3 group-hover:text-[var(--cyan)] transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.6] mb-4">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <span className="font-mono text-[0.58rem] text-[var(--text-muted)]">
                  {featuredPost.date}
                </span>
                <span className="font-mono text-[0.68rem] text-[var(--cyan)]">
                  Read more &rarr;
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Posts Grid */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="grid-3">
          {otherPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/tinker-lab/${post.slug}`}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block group"
            >
              {/* Thumbnail placeholder */}
              <div className="relative h-[150px] overflow-hidden bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] opacity-30">
                <span
                  className="absolute top-[10px] left-[10px] font-mono text-[0.53rem] font-semibold tracking-[0.05em] uppercase px-2 py-[3px] rounded-[5px] text-white"
                  style={{ backgroundColor: getDifficultyColor(post.tag).color }}
                >
                  {post.tag}
                </span>
                <span className="absolute bottom-[10px] right-[10px] font-mono text-[0.58rem] text-white bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px] px-2 py-[2px] rounded-[4px]">
                  {post.readTime}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 pt-3">
                <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-2 group-hover:text-[var(--cyan)] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] line-clamp-3 mb-3">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
                  <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                    {post.date}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Submit CTA */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

          <h2 className="font-sans text-[1.5rem] font-bold mb-2">
            Got an Experiment Idea?
          </h2>
          <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[480px] mx-auto mb-6">
            Is there an AI tool, technique, or question you want Dr. Jones to
            explore? Send your suggestions.
          </p>
          <button className="btn-primary">Suggest an Experiment</button>
        </div>
      </div>
    </div>
  );
}

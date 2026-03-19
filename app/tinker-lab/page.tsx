import Link from "next/link";
import Image from "next/image";
import { posts, postTags } from "@/lib/data/posts";

export const metadata = {
  title: "Tinker Lab | Innovating Higher Ed",
  description:
    "We test the tools so you don't have to. Every experiment shows real results — what worked, what didn't, and whether it's worth your time.",
};

function getTypeColor(tag: string) {
  switch (tag) {
    case "Walkthrough":
      return { bg: "rgba(74,222,128,0.85)", text: "#fff" };
    case "Experiment":
      return { bg: "rgba(0,212,255,0.85)", text: "#08080f" };
    case "Comparison":
      return { bg: "rgba(200,80,192,0.85)", text: "#fff" };
    case "Challenge":
      return { bg: "rgba(251,146,60,0.85)", text: "#fff" };
    case "Opinion":
      return { bg: "rgba(167,139,250,0.85)", text: "#fff" };
    default:
      return { bg: "rgba(255,255,255,0.12)", text: "var(--text)" };
  }
}

function getDifficultyStyle(level: string) {
  switch (level) {
    case "Beginner":
      return { bg: "var(--green-dim)", color: "var(--green)" };
    case "Intermediate":
      return { bg: "var(--amber-dim)", color: "var(--amber)" };
    case "Advanced":
      return { bg: "var(--red-dim)", color: "var(--red)" };
    default:
      return { bg: "var(--surface)", color: "var(--text-muted)" };
  }
}

const filters = ["All", "Experiments", "Walkthroughs", "Comparisons", "Challenges"];

export default function TinkerLabPage() {
  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const otherPosts = posts.filter((p) => p !== featuredPost);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-6 animate-[fadeUp_0.7s_ease-out_both]">
        <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--cyan)] mb-2 flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--cyan)]" />
          TINKER LAB
        </div>
        <h1 className="page-title mb-3">
          Experiments, Walkthroughs & AI Explorations
        </h1>
        <p className="text-[0.92rem] text-[var(--text-secondary)] max-w-[620px] leading-[1.6]">
          We test the tools so you don&apos;t have to. Every experiment shows real results — what worked, what didn&apos;t, and whether it&apos;s worth your time.
        </p>
      </div>

      {/* Featured Experiment - Split Card with Play Overlay */}
      {featuredPost && (
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-10">
          <Link
            href={`/tinker-lab/${featuredPost.slug}`}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] overflow-hidden grid md:grid-cols-2 transition-all duration-300 hover:border-[var(--border-hover)] group block"
          >
            {/* Left - Image with Play Overlay */}
            <div className="relative min-h-[380px] overflow-hidden">
              {featuredPost.thumbnail ? (
                <Image
                  src={featuredPost.thumbnail}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,8,15,0.4)] to-[rgba(8,8,15,0.1)]" />

              {/* Badges */}
              <div className="absolute top-5 left-5 flex gap-2">
                <span className="font-mono text-[0.6rem] font-semibold tracking-[0.05em] px-3 py-1 rounded-[6px] bg-[rgba(0,212,255,0.85)] text-[#08080f]">
                  Latest Experiment
                </span>
                <span className="font-mono text-[0.6rem] font-semibold tracking-[0.05em] px-3 py-1 rounded-[6px] bg-[rgba(255,255,255,0.12)] text-[var(--text)] backdrop-blur-[8px]">
                  Beginner Friendly
                </span>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center cursor-pointer shadow-[0_4px_20px_rgba(0,212,255,0.3)] group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-white ml-[2px]">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
              </div>
            </div>

            {/* Right - Content with What You'll Learn */}
            <div className="p-8 flex flex-col justify-center">
              <div className="font-mono text-[0.62rem] text-[var(--cyan)] tracking-[0.08em] uppercase mb-2">
                {featuredPost.tag} · {featuredPost.date}
              </div>
              <h2 className="font-sans text-[1.4rem] font-bold leading-[1.22] mb-3 group-hover:text-[var(--cyan)] transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.65] mb-4">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-3 font-mono text-[0.65rem] text-[var(--text-muted)] mb-5 flex-wrap">
                <span className="text-[var(--cyan)]">{featuredPost.readTime}</span>
                <span>·</span>
                <span>Beginner</span>
                <span>·</span>
                <span>AI Ethics & Creativity</span>
              </div>

              {/* Topics */}
              <div className="flex gap-2 flex-wrap mb-5">
                {featuredPost.topics?.slice(0, 4).map((topic) => (
                  <span key={topic} className="font-mono text-[0.52rem] font-semibold px-2 py-[3px] rounded-[4px] bg-[var(--surface)] text-[var(--text-secondary)]">
                    {topic}
                  </span>
                ))}
              </div>

              {/* Key Takeaways */}
              <div className="mt-auto">
                <h4 className="font-mono text-[0.6rem] tracking-[0.08em] uppercase text-[var(--text-muted)] mb-3">
                  Key takeaways
                </h4>
                <ul className="space-y-2">
                  {featuredPost.takeaways?.slice(0, 4).map((item, i) => (
                    <li key={i} className="text-[0.8rem] text-[var(--text-secondary)] flex items-center gap-2">
                      <span className="font-mono text-[0.7rem] text-[var(--cyan)]">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Type Filter Pills */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-8 flex items-center gap-2 flex-wrap">
        {filters.map((filter, i) => (
          <button
            key={filter}
            className={`font-mono text-[0.65rem] font-medium px-3 py-1.5 rounded-full border transition-all duration-200 ${
              i === 0
                ? "bg-[rgba(255,255,255,0.08)] text-[var(--text)] border-[rgba(255,255,255,0.15)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text)]"
            }`}
          >
            {filter}
          </button>
        ))}

        {/* Difficulty pills */}
        <span className="mx-2 text-[var(--border)]">|</span>
        {["Beginner", "Intermediate", "Advanced"].map((level) => (
          <button
            key={level}
            className="font-mono text-[0.65rem] font-medium px-3 py-1.5 rounded-full border transition-all duration-200 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text)]"
          >
            {level}
          </button>
        ))}
      </div>

      {/* Experiment Grid - 3 Columns with Type Badges */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherPosts.map((post) => {
            const typeColors = getTypeColor(post.tag);
            return (
              <Link
                key={post.slug}
                href={`/tinker-lab/${post.slug}`}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] group block"
              >
                {/* Image with overlays - full artwork visible */}
                <div className="relative h-[180px] overflow-hidden bg-[var(--surface-1)] flex items-center justify-center">
                  {post.thumbnail ? (
                    <Image
                      src={post.thumbnail}
                      alt={post.title}
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,15,0.5)] via-transparent to-transparent" />

                  {/* Type Badge */}
                  <span
                    className="absolute top-[10px] left-[10px] font-mono text-[0.53rem] font-semibold tracking-[0.05em] uppercase px-2 py-[3px] rounded-[5px]"
                    style={{ backgroundColor: typeColors.bg, color: typeColors.text }}
                  >
                    {post.tag}
                  </span>

                  {/* Duration Overlay */}
                  <span className="absolute bottom-[10px] right-[10px] font-mono text-[0.58rem] text-white bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px] px-2 py-[2px] rounded-[4px]">
                    {post.readTime}
                  </span>
                </div>

                {/* Body */}
                <div className="p-4">
                  {/* Difficulty + Category tags */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <span
                      className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px]"
                      style={getDifficultyStyle("Beginner")}
                    >
                      Beginner
                    </span>
                    <span className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[rgba(14,165,160,0.12)] text-[var(--teal)]">
                      Course Design
                    </span>
                  </div>

                  {/* Title - DM Sans Bold */}
                  <h3 className="font-sans text-[1.02rem] font-bold leading-[1.22] mb-2 group-hover:text-[var(--cyan)] transition-colors">
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)] font-mono text-[0.58rem] text-[var(--text-muted)]">
                    <span className="text-[var(--cyan)]">Audio</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button
            aria-label="Load more experiments"
            className="font-mono text-[0.72rem] text-[var(--cyan)] px-6 py-2.5 rounded-[8px] border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.06)] hover:bg-[rgba(0,212,255,0.12)] hover:border-[rgba(0,212,255,0.3)] transition-all tracking-[0.04em]"
          >
            Load more experiments
          </button>
        </div>
      </div>

      {/* Suggest Experiment CTA */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

          <h2 className="font-sans text-[1.5rem] font-bold mb-2">
            Got an Experiment Idea?
          </h2>
          <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[500px] mx-auto mb-6">
            Want us to test a specific AI tool, compare platforms, or try something wild? Tell us what you want to see in the lab.
          </p>
          <button className="btn-primary">Suggest an Experiment</button>
        </div>
      </div>
    </div>
  );
}

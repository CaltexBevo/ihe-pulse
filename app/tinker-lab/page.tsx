import Link from "next/link";
import Image from "next/image";
import { posts } from "@/lib/data/posts";
import { pageMetadata } from "@/lib/og";

export const metadata = pageMetadata({
  title: "Tinker Lab | Innovating Higher Ed",
  description:
    "We test the tools so you don't have to. Every experiment shows real results — what worked, what didn't, and whether it's worth your time.",
  path: "/tinker-lab",
});

// Palette-locked type colors (Rule 17.3): solid badges over imagery use
// cyan / purple / magenta only. Amber is reserved for taxonomy.
function getTypeColor(tag: string) {
  switch (tag) {
    case "Walkthrough":
      return { bg: "var(--purple)", text: "var(--bg)" };
    case "Experiment":
      return { bg: "var(--cyan)", text: "var(--bg)" };
    case "Comparison":
      return { bg: "var(--magenta)", text: "white" };
    case "Challenge":
      return { bg: "var(--cyan)", text: "var(--bg)" };
    case "Opinion":
      return { bg: "var(--purple)", text: "var(--bg)" };
    default:
      return { bg: "var(--surface)", text: "var(--text)" };
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
                <span className="font-mono text-[0.6rem] font-semibold tracking-[0.05em] px-3 py-1 rounded-[6px] bg-[var(--cyan)] text-[var(--bg)]">
                  Latest Experiment
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
                  {/* Topic tags (from real post data) */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {post.topics?.slice(0, 2).map((topic) => (
                      <span
                        key={topic}
                        className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[var(--cyan-dim)] text-[var(--cyan)]"
                      >
                        {topic}
                      </span>
                    ))}
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
          <a
            href="mailto:hello@innovatinghighered.com?subject=Experiment%20idea%20for%20the%20Tinker%20Lab"
            className="btn-primary inline-block"
          >
            Suggest an Experiment
          </a>
        </div>
      </div>
    </div>
  );
}

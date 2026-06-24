import Image from "next/image";
import Link from "next/link";
import { episodes } from "@/lib/data/episodes";

export const metadata = {
  title: "Podcast | Innovating Higher Ed",
  description:
    "Real talk with educators, administrators, and builders who are figuring out how AI actually works in higher education.",
};

const platforms = [
  { name: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/innovating-higher-ed/id1774879335", icon: "🎧" },
  { name: "Spotify", href: "https://open.spotify.com/show/4rMDJnlFbrLMr0hKAE3Oe6" },
  { name: "YouTube", href: "https://www.youtube.com/@InnovatingHigherEd" },
  { name: "Amazon Music", href: "https://music.amazon.com/podcasts/3ab228ea-6a9d-4173-95e9-dcc03bc6ecc9/innovating-higher-ed" },
  { name: "Podbean", href: "https://innovatinghighered.podbean.com/" },
];

const filters = [
  "All Episodes",
  "Interviews",
  "Panels",
  "Teaching & Pedagogy",
  "Leadership",
  "AI Tools",
  "Student Voices",
];

export default function PodcastPage() {
  const featuredEpisode = episodes[0];
  const recentEpisodes = episodes.slice(1);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-6 animate-[fadeUp_0.7s_ease-out_both]">
        <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--orange)] mb-2 flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--orange)]" />
          PODCAST
        </div>
        <h1 className="page-title mb-3">
          Conversations with Higher Ed Innovators
        </h1>
        <p className="text-[0.92rem] text-[var(--text-secondary)] max-w-[620px] leading-[1.6]">
          Real talk with the educators, administrators, and builders who are figuring out how AI
          actually works in higher education — not how it&apos;s supposed to.
        </p>
      </div>

      {/* Featured Episode - Split Card Layout */}
      {featuredEpisode && (
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-10">
          <Link
            href={`/podcast/${featuredEpisode.slug}`}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] overflow-hidden grid md:grid-cols-2 transition-all duration-300 hover:border-[var(--border-hover)] group block"
          >
            {/* Left - Image */}
            <div className="relative min-h-[340px] overflow-hidden">
              {featuredEpisode.thumbnail ? (
                <Image
                  src={featuredEpisode.thumbnail}
                  alt={featuredEpisode.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[var(--orange)] to-[var(--magenta)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,8,15,0.4)] to-[rgba(8,8,15,0.1)]" />
              <div className="absolute top-5 left-5 flex gap-2">
                <span className="font-mono text-[0.6rem] font-semibold tracking-[0.05em] px-3 py-1 rounded-[6px] bg-[rgba(251,146,60,0.85)] text-white">
                  Latest Episode
                </span>
                <span className="font-mono text-[0.6rem] font-semibold tracking-[0.05em] px-3 py-1 rounded-[6px] bg-[rgba(255,255,255,0.12)] text-[var(--text)] backdrop-blur-[8px]">
                  Leadership & Strategy
                </span>
              </div>
            </div>

            {/* Right - Content */}
            <div className="p-8 flex flex-col justify-center">
              <div className="font-mono text-[0.62rem] text-[var(--orange)] tracking-[0.08em] uppercase mb-2">
                {featuredEpisode.date}
              </div>
              <h2 className="font-sans text-[1.45rem] font-bold leading-[1.22] mb-3 group-hover:text-[var(--cyan)] transition-colors">
                {featuredEpisode.title}
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.65] mb-4">
                {featuredEpisode.description}
              </p>
              <div className="flex items-center gap-3 font-mono text-[0.65rem] text-[var(--text-muted)] mb-5">
                <span>{featuredEpisode.duration}</span>
                <span>·</span>
                <span>Guest: {featuredEpisode.guest}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-[10px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] text-white font-semibold text-[0.85rem] w-fit shadow-[0_4px_16px_rgba(0,212,255,0.2)]">
                <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-white">
                  <polygon points="6,3 20,12 6,21" />
                </svg>
                Listen Now
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Filters */}
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
        <div className="ml-auto flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-[8px] px-3 py-1.5">
          <svg className="w-[14px] h-[14px] stroke-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search episodes..."
            aria-label="Search episodes"
            className="bg-transparent border-none outline-none text-[0.78rem] text-[var(--text)] placeholder:text-[var(--text-muted)] w-[160px]"
          />
        </div>
      </div>

      {/* Episode Grid - 3 Columns */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentEpisodes.map((ep) => (
            <Link
              key={ep.slug}
              href={`/podcast/${ep.slug}`}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] group block"
            >
              {/* Thumbnail - 170px height with full artwork visible */}
              <div className="relative h-[170px] overflow-hidden bg-[var(--surface-1)] flex items-center justify-center">
                {ep.thumbnail ? (
                  <Image
                    src={ep.thumbnail}
                    alt={ep.title}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--orange)] to-[var(--magenta)]" />
                )}
              </div>

              {/* Body */}
              <div className="p-4">
                {/* Category dot + label */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--cyan)]" />
                  <span className="font-mono text-[0.53rem] tracking-[0.06em] uppercase text-[var(--cyan)]">
                    Interview
                  </span>
                </div>

                {/* Title - DM Sans Bold */}
                <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-2 group-hover:text-[var(--cyan)] transition-colors">
                  {ep.title}
                </h3>

                {/* Teaser - DM Sans Regular */}
                <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] line-clamp-2 mb-3">
                  {ep.description}
                </p>

                {/* Footer */}
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)] font-mono text-[0.58rem] text-[var(--text-muted)]">
                  <span>{ep.date}</span>
                  <span>{ep.duration}</span>
                  <button
                    className="ml-auto w-[26px] h-[26px] rounded-full bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label={`Play episode: ${ep.title}`}
                  >
                    <svg viewBox="0 0 24 24" className="w-[10px] h-[10px] fill-white ml-[1px]" aria-hidden="true">
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button
            aria-label="Load more episodes"
            className="font-mono text-[0.72rem] text-[var(--cyan)] px-6 py-2.5 rounded-[8px] border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.06)] hover:bg-[rgba(0,212,255,0.12)] hover:border-[rgba(0,212,255,0.3)] transition-all tracking-[0.04em]"
          >
            Load more episodes
          </button>
        </div>
      </div>

      {/* Subscribe CTA */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-10 grid md:grid-cols-2 gap-8 items-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--orange)] to-[var(--magenta)]" />

          <div>
            <h2 className="font-sans text-[1.5rem] font-bold mb-2">
              Subscribe to the Podcast
            </h2>
            <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.6]">
              New episodes every Monday. Available wherever you listen to podcasts, or right here on the site.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                className={`font-mono text-[0.7rem] font-medium px-4 py-2 rounded-[8px] border transition-all duration-200 flex items-center gap-2 ${
                  p.icon
                    ? "bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] text-white border-transparent"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                {p.icon && <span>{p.icon}</span>}
                {p.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Be Our Guest CTA */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--orange)] to-[var(--magenta)]" />

          <h2 className="font-sans text-[1.4rem] font-bold mb-2">
            Be Our Guest
          </h2>
          <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[480px] mx-auto mb-6">
            Have a story to share about AI in higher education? We&apos;d love to
            hear from you.
          </p>

          <Link href="/be-our-guest" className="btn-primary">
            Apply to Be a Guest
          </Link>
        </div>
      </div>
    </div>
  );
}

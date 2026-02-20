import Image from "next/image";
import Link from "next/link";
import { episodes } from "@/lib/data/episodes";

export const metadata = {
  title: "Podcast | Innovating Higher Ed",
  description:
    "Weekly conversations on AI in higher education with Dr. Norma Jones. Practical insights for faculty, administrators, and innovators.",
};

const platforms = [
  { name: "Spotify", href: "#", color: "var(--green)" },
  { name: "Apple Podcasts", href: "#", color: "var(--purple)" },
  { name: "YouTube", href: "#", color: "var(--red)" },
  { name: "RSS Feed", href: "#", color: "var(--orange)" },
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
        <h1 className="font-serif italic text-[clamp(2rem,5vw,2.8rem)] font-normal leading-[1.1] text-[var(--text)] mb-3">
          Innovating Higher Ed Podcast
        </h1>
        <p className="text-[0.92rem] text-[var(--text-secondary)] max-w-[620px] leading-[1.6]">
          Weekly conversations on AI in higher education with Dr. Norma Jones.
          Practical insights for faculty, administrators, and innovators.
        </p>
      </div>

      {/* Featured Episode */}
      {featuredEpisode && (
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-10">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--orange)] to-[var(--magenta)]" />

            <div className="grid md:grid-cols-[300px_1fr] gap-0">
              {/* Thumbnail */}
              <div className="relative h-[240px] md:h-full overflow-hidden">
                {featuredEpisode.thumbnail ? (
                  <Image
                    src={featuredEpisode.thumbnail}
                    alt={featuredEpisode.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--orange)] to-[var(--magenta)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--bg-card)]/80 hidden md:block" />
                <span className="absolute top-4 left-4 font-mono text-[0.58rem] font-semibold px-2 py-[3px] rounded-[5px] bg-[var(--orange)] text-white">
                  Latest Episode
                </span>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[0.55rem] text-[var(--orange)]">
                    EP. {featuredEpisode.number}
                  </span>
                  <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                    {featuredEpisode.duration}
                  </span>
                  <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                    {featuredEpisode.date}
                  </span>
                </div>

                <h2 className="text-[1.4rem] font-bold leading-[1.25] mb-2">
                  {featuredEpisode.title}
                </h2>
                <p className="text-[0.85rem] text-[var(--cyan)] mb-3">
                  with {featuredEpisode.guest}
                </p>
                <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.6] mb-6">
                  {featuredEpisode.description}
                </p>

                <Link
                  href={`/podcast/${featuredEpisode.slug}`}
                  className="btn-primary"
                >
                  Listen Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscribe Section */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-10">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-sans text-[1rem] font-bold mb-1">
              Subscribe & Never Miss an Episode
            </h3>
            <p className="text-[0.78rem] text-[var(--text-secondary)]">
              New episodes every Wednesday. Available on all major platforms.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <a
                key={p.name}
                href={p.href}
                className="font-mono text-[0.68rem] font-semibold px-3 py-2 rounded-[8px] transition-colors"
                style={{
                  backgroundColor: `${p.color}15`,
                  color: p.color,
                }}
              >
                {p.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* All Episodes */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
          All Episodes
        </div>

        <div className="space-y-4">
          {recentEpisodes.map((ep) => (
            <Link
              key={ep.slug}
              href={`/podcast/${ep.slug}`}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 flex flex-col md:flex-row items-start gap-4 hover:border-[var(--border-hover)] hover:-translate-y-[1px] transition-all duration-300 block group"
            >
              {/* Thumbnail */}
              {ep.thumbnail && (
                <div className="shrink-0 w-full md:w-[140px] h-[100px] rounded-[10px] overflow-hidden relative">
                  <Image
                    src={ep.thumbnail}
                    alt={ep.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white ml-[2px]">
                        <polygon points="6,3 20,12 6,21" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-[0.55rem] text-[var(--orange)]">
                    EP. {ep.number}
                  </span>
                  <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                    {ep.duration}
                  </span>
                </div>
                <h3 className="text-[1rem] font-bold leading-[1.25] mb-1 group-hover:text-[var(--cyan)] transition-colors">
                  {ep.title}
                </h3>
                <p className="text-[0.78rem] text-[var(--cyan)] mb-2">
                  with {ep.guest}
                </p>
                <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] line-clamp-2">
                  {ep.description}
                </p>
              </div>

              {/* Date */}
              <div className="shrink-0 font-mono text-[0.58rem] text-[var(--text-muted)]">
                {ep.date}
              </div>
            </Link>
          ))}
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

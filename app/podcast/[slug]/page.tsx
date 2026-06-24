import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { episodes } from '@/lib/data/episodes';

function getPodbeanUrl(podbeanId: string) {
  return `https://www.podbean.com/player-v2/?i=${podbeanId}&from=pb6admin&share=1&download=1&rtl=0&fonts=Arial&skin=60a0c8&font-color=auto&logo_link=episode_page&btn-skin=1b1b1b`;
}

export function generateStaticParams() {
  return episodes.map((ep) => ({ slug: ep.slug }));
}

const platforms = [
  { name: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/innovating-higher-ed/id1768896865" },
  { name: "Spotify", href: "https://open.spotify.com/show/1PaBkIvJQaN9FPqoflbJxI" },
  { name: "YouTube", href: "https://www.youtube.com/@InnovatingHigherEd" },
  { name: "Amazon Music", href: "https://music.amazon.com/podcasts/4c006f36-a401-4a1a-b498-c7010e48b50e/innovating-higher-ed" },
  { name: "Podbean", href: "https://innovatinghighered.podbean.com/" },
];

export default async function EpisodeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = episodes.find((ep) => ep.slug === slug);

  if (!episode) {
    notFound();
  }

  // Get related episodes (same topics or recent)
  const relatedEpisodes = episodes
    .filter((ep) => ep.slug !== slug)
    .slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Back Link */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-8">
        <Link
          href="/podcast"
          className="inline-flex items-center gap-2 font-mono text-[0.72rem] text-[var(--text-muted)] hover:text-[var(--cyan)] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 stroke-current" fill="none" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to all episodes
        </Link>
      </div>

      {/* Episode Header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-6 pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-[6px] h-[6px] rounded-full bg-[var(--orange)]" />
          <span className="font-mono text-[0.62rem] tracking-[0.08em] uppercase text-[var(--orange)]">
            Podcast
          </span>
        </div>

        <h1 className="font-sans text-[clamp(1.8rem,4vw,2.4rem)] font-bold leading-[1.15] text-[var(--text)] mb-4">
          {episode.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 font-mono text-[0.68rem] text-[var(--text-muted)] mb-6">
          {episode.guest && (
            <span className="text-[var(--cyan)]">with {episode.guest}</span>
          )}
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] stroke-current" fill="none" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {episode.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] stroke-current" fill="none" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            {episode.date}
          </span>
        </div>

        {/* Hero Image - Container matches image size, centered */}
        {episode.thumbnail && (
          <div className="flex justify-start mb-8">
            <div className="rounded-[14px] overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] max-w-[500px]">
              <Image
                src={episode.thumbnail}
                alt={episode.guest || episode.title}
                width={500}
                height={500}
                className="w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        )}

        {/* Audio Player */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-6 mb-8 max-w-[800px]">
          <h2 className="font-sans text-[1rem] font-bold mb-4">Listen Now</h2>
          <iframe
            title={episode.title}
            src={getPodbeanUrl(episode.podbeanId)}
            width="100%"
            height="150"
            style={{ border: 'none' }}
            scrolling="no"
            allow="autoplay"
          />
        </div>

        {/* Platform Links */}
        <div className="flex gap-3 flex-wrap mb-8">
          {platforms.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className="font-mono text-[0.68rem] font-medium px-4 py-2 rounded-[8px] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text)] hover:bg-[rgba(255,255,255,0.03)] transition-all"
            >
              {p.name}
            </a>
          ))}
        </div>

        {/* Show Notes */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-6 mb-6 max-w-[800px]">
          <h2 className="font-sans text-[1rem] font-bold mb-3">About This Episode</h2>
          <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
            {episode.fullDescription}
          </p>
        </div>

        {/* Key Takeaways */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-6 mb-6 max-w-[800px]">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--cyan)]" />
            <h2 className="font-sans text-[1rem] font-bold">Key Takeaways</h2>
          </div>
          <ul className="space-y-3">
            {episode.takeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 mt-2 w-[6px] h-[6px] rounded-full bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />
                <span className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.6]">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Guest Info */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-6 mb-6 max-w-[800px]">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--magenta)]" />
            <h2 className="font-sans text-[1rem] font-bold">About Our Guest</h2>
          </div>
          <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
            {episode.guestBio}
          </p>
        </div>

        {/* Host Info */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-6 mb-6 max-w-[800px]">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--orange)]" />
            <h2 className="font-sans text-[1rem] font-bold">About Our Host</h2>
          </div>
          <p className="font-sans text-[0.92rem] font-bold text-[var(--text)] mb-1">Innovating Higher Ed</p>
          <p className="font-mono text-[0.68rem] text-[var(--text-muted)] mb-3">Podcast Team</p>
          <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
            The Innovating Higher Ed podcast explores how AI and emerging technologies transform teaching and learning in higher education through conversations with educators, researchers, and innovators.
          </p>
        </div>

        {/* Topics */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-6 mb-8 max-w-[800px]">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--purple)]" />
            <h2 className="font-sans text-[1rem] font-bold">Topics Covered</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {episode.topics.map((topic) => (
              <span
                key={topic}
                className="font-mono text-[0.68rem] px-3 py-1.5 rounded-[8px] bg-[var(--surface)] text-[var(--text-secondary)] border border-[var(--border)]"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Related Episodes */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-6">
          Related Episodes
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {relatedEpisodes.map((ep) => (
            <Link
              key={ep.slug}
              href={`/podcast/${ep.slug}`}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] group block"
            >
              {/* Thumbnail - 170px height */}
              <div className="relative h-[170px] overflow-hidden">
                {ep.thumbnail ? (
                  <Image
                    src={ep.thumbnail}
                    alt={ep.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--orange)] to-[var(--magenta)]" />
                )}
                <span className="absolute top-[10px] left-[10px] font-mono text-[0.53rem] font-semibold tracking-[0.06em] uppercase px-2 py-[3px] rounded-[4px] bg-[var(--orange-dim)] text-[var(--orange)]">
                  EP. {ep.number}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--cyan)]" />
                  <span className="font-mono text-[0.53rem] tracking-[0.06em] uppercase text-[var(--cyan)]">
                    Interview
                  </span>
                </div>
                <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-2 group-hover:text-[var(--cyan)] transition-colors">
                  {ep.title}
                </h3>
                <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] line-clamp-2 mb-3">
                  {ep.description}
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)] font-mono text-[0.58rem] text-[var(--text-muted)]">
                  <span className="text-[var(--cyan)]">{ep.date}</span>
                  <span>{ep.duration}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

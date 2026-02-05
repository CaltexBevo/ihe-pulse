import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Mic, Lightbulb, User, Tag } from 'lucide-react';
import { episodes } from '@/lib/data/episodes';

function getPodbeanUrl(podbeanId: string) {
  return `https://www.podbean.com/player-v2/?i=${podbeanId}&from=pb6admin&share=1&download=1&rtl=0&fonts=Arial&skin=60a0c8&font-color=auto&logo_link=episode_page&btn-skin=1b1b1b`;
}

export function generateStaticParams() {
  return episodes.map((ep) => ({ slug: ep.slug }));
}

export default async function EpisodeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const episode = episodes.find((ep) => ep.slug === slug);

  if (!episode) {
    notFound();
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/podcast"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-pulse transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to all episodes
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <Mic size={18} className="text-pulse" />
          <span className="text-sm font-mono text-pulse uppercase tracking-widest">
            Podcast
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {episode.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-8">
          {episode.guest && (
            <span>with {episode.guest}</span>
          )}
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {episode.duration}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={14} />
            {episode.date}
          </span>
        </div>

        {episode.thumbnail && (
          <div className="w-full rounded-2xl overflow-hidden relative mb-8 aspect-[3/2] bg-white/5">
            <Image
              src={episode.thumbnail}
              alt={episode.guest || episode.title}
              fill
              className="object-contain"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        )}

        <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Listen Now</h2>
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

        <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">About This Episode</h2>
          <p className="text-gray-400 leading-relaxed">
            {episode.fullDescription}
          </p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={18} className="text-pulse" />
            <h2 className="text-lg font-semibold text-white">Key Takeaways</h2>
          </div>
          <ul className="space-y-3">
            {episode.takeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pulse to-synapse" />
                <span className="text-gray-400 leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-synapse" />
            <h2 className="text-lg font-semibold text-white">About Our Guest</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            {episode.guestBio}
          </p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Mic size={18} className="text-pulse" />
            <h2 className="text-lg font-semibold text-white">About Our Host</h2>
          </div>
          <p className="text-white font-medium mb-1">Dr. Norma Jones</p>
          <p className="text-sm text-gray-500 mb-3">Host, Innovating Higher Ed</p>
          <p className="text-gray-400 leading-relaxed">
            Dr. Norma Jones is the host and creator of Innovating Higher Ed, exploring how AI and emerging technologies transform teaching and learning in higher education.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={18} className="text-pulse" />
            <h2 className="text-lg font-semibold text-white">Topics Covered</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {episode.topics.map((topic) => (
              <span
                key={topic}
                className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-gray-300 border border-white/10"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

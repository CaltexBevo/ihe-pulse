import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, FlaskConical, Lightbulb, User, Tag } from 'lucide-react';
import { posts } from '@/lib/data/posts';

function getPodbeanUrl(podbeanId: string) {
  return `https://www.podbean.com/player-v2/?i=${podbeanId}&from=pb6admin&share=1&download=1&rtl=0&fonts=Arial&skin=60a0c8&font-color=auto&logo_link=episode_page&btn-skin=1b1b1b`;
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/tinker-lab"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-pulse transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to Tinker Lab
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <FlaskConical size={18} className="text-pulse" />
          <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-white/5 text-gray-400">
            {post.tag}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
          <span>{post.date}</span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {post.readTime}
          </span>
        </div>

        {post.thumbnail && (
          <div className="w-full rounded-2xl overflow-hidden relative mb-8 aspect-[3/2] bg-white/5">
            <Image
              src={post.thumbnail}
              alt={post.title}
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
            title={post.title}
            src={getPodbeanUrl(post.podbeanId)}
            width="100%"
            height="150"
            style={{ border: 'none' }}
            scrolling="no"
            allow="autoplay"
          />
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">About This Post</h2>
          <p className="text-gray-400 leading-relaxed">
            {post.fullDescription}
          </p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={18} className="text-pulse" />
            <h2 className="text-lg font-semibold text-white">Key Takeaways</h2>
          </div>
          <ul className="space-y-3">
            {post.takeaways.map((takeaway, i) => (
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
            <h2 className="text-lg font-semibold text-white">About Our Host</h2>
          </div>
          <p className="text-gray-400 leading-relaxed">
            {post.authorBio}
          </p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Tag size={18} className="text-pulse" />
            <h2 className="text-lg font-semibold text-white">Topics Covered</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.topics.map((topic) => (
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

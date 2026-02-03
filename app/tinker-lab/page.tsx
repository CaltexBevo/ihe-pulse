'use client';

import { useState } from 'react';
import { FlaskConical, Clock, ArrowRight, Tag } from 'lucide-react';
import FilterTabs from '@/components/FilterTabs';
import PageTransition from '@/components/PageTransition';
import { posts, postTags } from '@/lib/data/posts';

export default function TinkerLabPage() {
  const [activeTag, setActiveTag] = useState('All');

  const filtered =
    activeTag === 'All' ? posts : posts.filter((p) => p.tag === activeTag);
  const featuredPost = filtered.find((p) => p.featured) || filtered[0];
  const otherPosts = filtered.filter((p) => p !== featuredPost);

  return (
    <PageTransition>
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical size={18} className="text-pulse" />
            <p className="text-sm font-mono text-pulse uppercase tracking-widest">
              Tinker Lab
            </p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Experiments & <span className="gradient-text">Ideas</span>
          </h1>
          <p className="mt-3 text-gray-400 max-w-2xl">
            Where Dr. Norma Jones tests, breaks, and explores AI tools and
            pedagogy. Raw insights from the frontier of AI in education.
          </p>
        </div>

        <div className="mb-10">
          <FilterTabs
            tabs={[...postTags].map((t) => ({ label: t, icon: Tag }))}
            activeTab={activeTag}
            onChange={setActiveTag}
          />
        </div>

        {featuredPost && (
          <div className="glass rounded-2xl p-6 sm:p-8 mb-10 group hover:border-pulse/20 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-pulse/10 text-pulse uppercase">
                Featured
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-white/5 text-gray-400">
                {featuredPost.tag}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-pulse transition-colors">
              {featuredPost.title}
            </h2>
            <p className="text-gray-400 mb-5 leading-relaxed max-w-3xl">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{featuredPost.date}</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {featuredPost.readTime}
                </span>
              </div>
              <button className="flex items-center gap-1.5 text-sm text-pulse hover:text-white transition-colors px-3 py-2">
                Read More
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherPosts.map((post, i) => (
            <article
              key={i}
              className="glass rounded-xl p-5 flex flex-col group hover:border-pulse/20 transition-colors"
            >
              <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-white/5 text-gray-400 mb-3 self-start">
                {post.tag}
              </span>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pulse transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readTime}
                </span>
                <span>{post.date}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

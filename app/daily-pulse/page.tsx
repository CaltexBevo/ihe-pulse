'use client';

import { useState } from 'react';
import { Clock, TrendingUp, Zap } from 'lucide-react';
import FilterTabs from '@/components/FilterTabs';
import PageTransition from '@/components/PageTransition';
import { stories, featuredStory, storyCategories, trendingItems } from '@/lib/data/stories';

export default function DailyPulsePage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? stories
      : stories.filter((s) => s.category === activeCategory);

  return (
    <PageTransition>
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={18} className="text-pulse" />
            <p className="text-sm font-mono text-pulse uppercase tracking-widest">
              Daily Pulse
            </p>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Today&apos;s Top <span className="gradient-text">Stories</span>
          </h1>
          <p className="mt-3 text-gray-400 max-w-2xl">
            AI news and analysis curated for higher education leaders, faculty, and innovators.
          </p>
        </div>

        <div className="mb-10">
          <FilterTabs
            tabs={[...storyCategories]}
            activeTab={activeCategory}
            onChange={setActiveCategory}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl p-6 sm:p-8 group hover:border-pulse/20 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-500/20 text-red-400 uppercase">
                  {featuredStory.tag}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-pulse/10 text-pulse">
                  {featuredStory.category}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-pulse transition-colors">
                {featuredStory.title}
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                {featuredStory.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{featuredStory.author}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {featuredStory.readTime}
                  </span>
                </div>
                <span className="text-xs text-gray-600">{featuredStory.date}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-synapse" />
              <h3 className="text-lg font-bold text-white">Trending</h3>
            </div>
            <div className="space-y-3">
              {trendingItems.map((item, i) => (
                <div
                  key={i}
                  className="glass rounded-xl px-4 py-3 flex items-start gap-3 hover:border-pulse/20 transition-colors"
                >
                  <span className="text-2xl font-bold gradient-text leading-none mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((story, i) => (
            <article
              key={i}
              className="glass rounded-xl p-5 group hover:border-pulse/20 transition-colors"
            >
              <span className="inline-block px-2.5 py-0.5 rounded text-xs font-medium bg-white/5 text-gray-400 mb-3">
                {story.category}
              </span>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pulse transition-colors line-clamp-2">
                {story.title}
              </h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {story.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {story.readTime}
                </span>
                <span>{story.date}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

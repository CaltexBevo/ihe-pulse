'use client';

import { useState } from 'react';
import { Search, Sparkles, BookOpen, GraduationCap, BarChart3, Users, FileText, FlaskConical } from 'lucide-react';
import FilterTabs from '@/components/FilterTabs';
import CopyButton from '@/components/CopyButton';
import PageTransition from '@/components/PageTransition';
import { prompts } from '@/lib/data/prompts';

const categories = [
  { label: 'All', icon: Sparkles },
  { label: 'Curriculum Design', icon: BookOpen },
  { label: 'Assessment', icon: GraduationCap },
  { label: 'Research', icon: FlaskConical },
  { label: 'Student Engagement', icon: Users },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Writing', icon: FileText },
];

export default function PromptsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = prompts.filter((p) => {
    const matchesCategory =
      activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.prompt.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-pulse" />
              <p className="text-sm font-mono text-pulse uppercase tracking-widest">
                Prompt Navigator
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Curated <span className="gradient-text">Prompts</span>
            </h1>
            <p className="mt-3 text-gray-400 max-w-2xl">
              Expert-crafted prompts for teaching, research, and administration.
              Copy, customize, and deploy in your favorite AI tool.
            </p>
          </div>

          <div className="relative mb-8 max-w-xl">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search prompts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pulse/50 focus:ring-1 focus:ring-pulse/30 transition-colors"
            />
          </div>

          <div className="mb-10">
            <FilterTabs
              tabs={categories}
              activeTab={activeCategory}
              onChange={setActiveCategory}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <div
                key={i}
                className="glass rounded-xl p-5 flex flex-col hover:border-pulse/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-white/5 text-gray-400">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-600">
                    {item.uses.toLocaleString()} uses
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 mb-4 flex-1 line-clamp-4 font-mono leading-relaxed">
                  {item.prompt}
                </p>
                <CopyButton text={item.prompt} />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500">
                No prompts found. Try a different search or category.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

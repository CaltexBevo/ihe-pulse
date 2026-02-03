'use client';

import { useState } from 'react';
import { Brain, ExternalLink, Star } from 'lucide-react';
import FilterTabs from '@/components/FilterTabs';
import PageTransition from '@/components/PageTransition';
import { tools, toolCategories } from '@/lib/data/tools';

export default function AIDirectoryPage() {
  const [activeTab, setActiveTab] = useState('All');

  const filtered =
    activeTab === 'All' ? tools : tools.filter((t) => t.category === activeTab);

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={18} className="text-pulse" />
              <p className="text-sm font-mono text-pulse uppercase tracking-widest">
                AI Directory
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Curated AI <span className="gradient-text">Tools</span>
            </h1>
            <p className="mt-3 text-gray-400 max-w-2xl">
              Vetted and reviewed AI tools for higher education. Filtered by use
              case so you find exactly what you need.
            </p>
          </div>

          <div className="mb-10">
            <FilterTabs
              tabs={[...toolCategories]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tool, i) => (
              <div
                key={i}
                className="glass rounded-xl p-5 flex flex-col hover:border-pulse/20 transition-colors group"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} border border-white/10 flex items-center justify-center`}
                  >
                    <span className="text-lg font-bold text-white/80">
                      {tool.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-pulse transition-colors">
                        {tool.name}
                      </h3>
                      {tool.badge && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pulse/10 text-pulse uppercase">
                          {tool.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{tool.category}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-4 flex-1 line-clamp-3">
                  {tool.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    <span className="text-sm font-medium">{tool.rating}</span>
                  </div>
                  <button className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-pulse transition-colors px-3 py-2">
                    Learn More
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

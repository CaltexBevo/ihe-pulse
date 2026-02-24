'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Brain,
  Search,
  ClipboardCheck,
  BookOpen,
  PenLine,
  Presentation,
  Wand2,
  Users,
  Bot,
  Video,
  Settings,
  StickyNote,
  Target,
  BadgeCheck,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import {
  aiApps,
  allRoles,
  allCategories,
  getStaffPicks,
  filterApps,
  getCategoryColors,
  type Role,
  type TaskTag,
} from '@/lib/data/ai-apps';

// ── Task icon map ───────────────────────────────────────────

const taskIcons: Record<string, LucideIcon> = {
  Grading: ClipboardCheck,
  'Lesson Planning': BookOpen,
  Research: Search,
  'Writing Feedback': PenLine,
  Presentations: Presentation,
  'Content Creation': Wand2,
  'Student Engagement': Users,
  'General LLM': Bot,
  'Video & Media': Video,
  Administration: Settings,
  'Note-Taking': StickyNote,
  Assessment: Target,
};

const taskLabels: Record<string, string> = {
  Grading: 'Grading',
  'Lesson Planning': 'Lesson Planning',
  Research: 'Research',
  'Writing Feedback': 'Writing',
  Presentations: 'Presentations',
  'Content Creation': 'Content',
  'Student Engagement': 'Engagement',
  'General LLM': 'General AI',
  'Video & Media': 'Video',
  Administration: 'Admin',
  'Note-Taking': 'Notes',
  Assessment: 'Assessment',
};

const taskKeys: TaskTag[] = [
  'General LLM',
  'Lesson Planning',
  'Grading',
  'Research',
  'Writing Feedback',
  'Presentations',
  'Content Creation',
  'Student Engagement',
  'Video & Media',
  'Administration',
];

// ── Pricing badge ───────────────────────────────────────────

function PricingBadge({ model }: { model: string }) {
  const styles: Record<string, string> = {
    free: 'bg-green-500/10 text-green-400 border-green-500/20',
    freemium: 'bg-pulse/10 text-pulse border-pulse/20',
    paid: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  const labels: Record<string, string> = {
    free: 'Free',
    freemium: 'Freemium',
    paid: 'Paid',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[model] ?? styles.paid}`}
    >
      {labels[model] ?? model}
    </span>
  );
}

// ── Main Page ───────────────────────────────────────────────

export default function AIDirectoryPage() {
  const [search, setSearch] = useState('');
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [activeTask, setActiveTask] = useState<TaskTag | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const staffPicks = getStaffPicks();

  const filtered = useMemo(
    () =>
      filterApps({
        role: activeRole ?? undefined,
        task: activeTask ?? undefined,
        category: activeCategory !== 'All' ? activeCategory : undefined,
        search: search || undefined,
      }),
    [activeRole, activeTask, activeCategory, search],
  );

  const clearFilters = () => {
    setSearch('');
    setActiveRole(null);
    setActiveTask(null);
    setActiveCategory('All');
  };

  const hasFilters =
    search || activeRole || activeTask || activeCategory !== 'All';

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          {/* ── Hero ─────────────────────────────────────── */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={18} className="text-pulse" />
              <p className="text-sm font-mono text-pulse uppercase tracking-widest">
                AI Directory
              </p>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-4">
              Find the Right{' '}
              <span className="gradient-text">AI Tool</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mb-8">
              {aiApps.length} vetted AI tools for higher education &mdash;
              filtered by role, task, and category so you find exactly what you
              need.
            </p>

            {/* Search bar */}
            <div className="relative max-w-xl mb-8">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search tools by name or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pulse/50 focus:ring-1 focus:ring-pulse/30 transition-colors text-sm"
              />
            </div>

            {/* Role filters */}
            <div className="flex flex-wrap gap-3">
              {allRoles.map((r) => {
                const isActive = activeRole === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() =>
                      setActiveRole(isActive ? null : r.value)
                    }
                    className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-pulse to-synapse text-white shadow-lg shadow-pulse/20'
                        : 'glass card-glow-cyan text-gray-300 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Staff Picks ──────────────────────────────── */}
          {!hasFilters && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-6">
                <BadgeCheck size={22} className="text-pulse" />
                <h2 className="text-2xl sm:text-3xl font-bold gradient-text-cyan">
                  Staff Picks
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {staffPicks.map((app) => {
                  const colors = getCategoryColors(app.category);
                  return (
                    <Link
                      key={app.slug}
                      href={`/ai-directory/${app.slug}`}
                      className="glass rounded-xl p-5 card-glow-cyan group flex flex-col"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`shrink-0 w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center shadow-lg overflow-hidden`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={app.logoUrl}
                            alt={`${app.name} logo`}
                            className="w-7 h-7 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-white group-hover:text-pulse transition-colors truncate">
                            {app.name}
                          </h3>
                          <PricingBadge model={app.pricing.model} />
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3 flex-1">
                        {app.tagline}
                      </p>
                      <div className="flex items-center gap-1.5 text-pulse text-xs font-medium">
                        <BadgeCheck size={13} />
                        Verified
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Task-based filtering ─────────────────────── */}
          <section className="mb-10">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Filter by Task
            </h3>
            <div className="flex flex-wrap gap-2">
              {taskKeys.map((task) => {
                const Icon = taskIcons[task] ?? Bot;
                const isActive = activeTask === task;
                return (
                  <button
                    key={task}
                    onClick={() =>
                      setActiveTask(isActive ? null : task)
                    }
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-pulse to-synapse text-white shadow-lg shadow-pulse/20'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <Icon size={14} />
                    {taskLabels[task]}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Category tabs ────────────────────────────── */}
          <section className="mb-8">
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-pulse to-synapse text-white'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── Active filters summary ───────────────────── */}
          {hasFilters && (
            <div className="flex items-center gap-3 mb-6 text-sm">
              <span className="text-gray-500">
                {filtered.length} tool{filtered.length !== 1 ? 's' : ''} found
              </span>
              <button
                onClick={clearFilters}
                className="text-pulse hover:text-pulse/80 font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* ── App Grid ─────────────────────────────────── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((app) => {
              const colors = getCategoryColors(app.category);
              return (
                <Link
                  key={app.slug}
                  href={`/ai-directory/${app.slug}`}
                  className="glass rounded-xl p-5 flex flex-col card-glow-fuchsia group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`shrink-0 w-11 h-11 rounded-xl ${colors.bg} flex items-center justify-center shadow-lg overflow-hidden`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={app.logoUrl}
                        alt={`${app.name} logo`}
                        className="w-7 h-7 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-white group-hover:text-pulse transition-colors truncate">
                          {app.name}
                        </h3>
                      </div>
                      <p className={`text-xs truncate ${colors.text}`}>
                        {app.category}
                      </p>
                    </div>
                  </div>

                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                  {app.tagline}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PricingBadge model={app.pricing.model} />
                    {app.verified && (
                      <span className="flex items-center gap-1 text-pulse text-[10px] font-medium">
                        <BadgeCheck size={12} />
                        Verified
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600">
                    Updated{' '}
                    {new Date(app.lastUpdated).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                </Link>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 mb-3">
                No tools match your current filters.
              </p>
              <button
                onClick={clearFilters}
                className="text-pulse hover:text-pulse/80 font-medium text-sm transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

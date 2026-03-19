'use client';

import { useState, useMemo, useEffect } from 'react';
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

// ── Types ───────────────────────────────────────────────────

interface AiTool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  accent: string;
  badge: string | null;
  values: string[];
  tasks: string[];
  roles: string[];
  pricing: {
    model: string;
    startingPrice?: string;
    details: string;
  };
  domain: string;
  platformUrl: string;
  lastUpdated: string;
  verified: boolean;
  staffPick: boolean;
}

interface AiAppsData {
  tools: AiTool[];
  categories: string[];
  lastUpdated: string;
}

type Role = 'faculty' | 'administrator' | 'student';
type TaskTag = string;
type SortOption = 'all' | 'recent' | 'trending' | 'updated';

// ── Constants ───────────────────────────────────────────────

const allRoles: { value: Role; label: string }[] = [
  { value: 'faculty', label: "I'm a Faculty Member" },
  { value: 'administrator', label: "I'm an Administrator" },
  { value: 'student', label: "I'm a Student" },
];

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
    freemium: 'bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/20',
    paid: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };
  const labels: Record<string, string> = {
    free: 'Free',
    freemium: 'Freemium',
    paid: 'Paid',
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-md text-[0.7rem] font-semibold uppercase tracking-wide border font-mono ${styles[model] ?? styles.paid}`}
    >
      {labels[model] ?? model}
    </span>
  );
}

// ── Role tag ────────────────────────────────────────────────

function RoleTag({ role }: { role: string }) {
  const label = role === 'administrator' ? 'Admin' : role.charAt(0).toUpperCase() + role.slice(1);
  return (
    <span className="px-2 py-0.5 rounded text-[0.68rem] text-[var(--text-muted)] bg-white/[0.03] border border-white/[0.05]">
      {label}
    </span>
  );
}

// ── Badge component ─────────────────────────────────────────

function ToolBadge({ badge }: { badge: string }) {
  const styles: Record<string, string> = {
    new: 'bg-green-500/10 text-green-400 border-green-500/20',
    trending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    updated: 'bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[0.65rem] font-semibold uppercase tracking-wider border font-mono ${styles[badge] ?? styles.new}`}>
      {badge}
    </span>
  );
}

// ── Tool Card (new design) ──────────────────────────────────

function ToolCard({ tool }: { tool: AiTool }) {
  const logoUrl = `https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`;

  return (
    <Link
      href={`/ai-directory/${tool.slug}`}
      className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] flex flex-col"
      style={{ '--tool-accent': tool.accent } as React.CSSProperties}
    >
      {/* Accent strip at top */}
      <div
        className="h-[3px] transition-[height] duration-300 group-hover:h-[4px]"
        style={{ background: tool.accent }}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Top row: logo + name + badges */}
        <div className="flex items-center gap-3.5 mb-3.5">
          <div className="w-[46px] h-[46px] rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-elevated)] flex items-center justify-center border border-[var(--border)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoUrl}
              alt={tool.name}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<span class="text-[1.1rem] font-bold" style="color: ${tool.accent}">${tool.name[0]}</span>`;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[1.1rem] font-bold tracking-tight text-[var(--text)]">{tool.name}</div>
            <div className="text-[0.76rem] text-[var(--text-muted)] font-medium mt-0.5">{tool.category}</div>
          </div>
          {tool.badge && (
            <div className="flex-shrink-0">
              <ToolBadge badge={tool.badge} />
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-[0.88rem] text-[var(--text-muted)] leading-[1.55] mb-3.5 line-clamp-2">
          {tool.tagline}
        </p>

        {/* 3 Value Points */}
        <ul className="mb-4 flex flex-col gap-[7px] flex-1">
          {tool.values.slice(0, 3).map((value, i) => (
            <li
              key={i}
              className="text-[0.82rem] text-[var(--text)] leading-[1.45] pl-5 relative"
            >
              <span
                className="absolute left-0 top-[7px] w-2 h-2 rounded-sm opacity-70"
                style={{ background: tool.accent }}
              />
              {value}
            </li>
          ))}
        </ul>

        {/* Footer: pricing + roles + learn more */}
        <div className="flex items-center gap-2.5 pt-3.5 border-t border-[var(--border)] flex-wrap">
          <PricingBadge model={tool.pricing.model} />
          <div className="flex gap-1.5 flex-1">
            {tool.roles.slice(0, 3).map((role) => (
              <RoleTag key={role} role={role} />
            ))}
          </div>
          <span
            className="ml-auto text-[0.82rem] font-semibold flex items-center gap-1 transition-[gap] duration-200 group-hover:gap-2"
            style={{ color: tool.accent }}
          >
            Learn More
            <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Main Page ───────────────────────────────────────────────

export default function AIDirectoryPage() {
  const [tools, setTools] = useState<AiTool[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [activeTask, setActiveTask] = useState<TaskTag | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('all');

  // Load data from JSON
  useEffect(() => {
    fetch('/data/ai-apps.json')
      .then((res) => res.json())
      .then((data: AiAppsData) => {
        setTools(data.tools);
        setCategories(data.categories);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load AI apps data:', err);
        setLoading(false);
      });
  }, []);

  const staffPicks = useMemo(() => tools.filter((t) => t.staffPick), [tools]);

  const filtered = useMemo(() => {
    let result = tools.filter((app) => {
      if (activeRole && !app.roles.includes(activeRole)) return false;
      if (activeTask && !app.tasks.includes(activeTask)) return false;
      if (activeCategory !== 'All' && app.category !== activeCategory) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          app.name.toLowerCase().includes(q) ||
          app.tagline.toLowerCase().includes(q) ||
          app.description.toLowerCase().includes(q) ||
          app.values.some((v) => v.toLowerCase().includes(q))
        );
      }
      return true;
    });

    // Apply sorting
    if (sortBy === 'recent') {
      // Sort by lastUpdated descending (most recent first)
      result = [...result].sort((a, b) =>
        new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      );
    } else if (sortBy === 'trending') {
      // Show trending items first
      result = [...result].sort((a, b) => {
        if (a.badge === 'trending' && b.badge !== 'trending') return -1;
        if (b.badge === 'trending' && a.badge !== 'trending') return 1;
        return 0;
      });
    } else if (sortBy === 'updated') {
      // Show updated items first, then by date
      result = [...result].sort((a, b) => {
        if (a.badge === 'updated' && b.badge !== 'updated') return -1;
        if (b.badge === 'updated' && a.badge !== 'updated') return 1;
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      });
    }

    return result;
  }, [tools, activeRole, activeTask, activeCategory, search, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setActiveRole(null);
    setActiveTask(null);
    setActiveCategory('All');
    setSortBy('all');
  };

  const hasFilters = search || activeRole || activeTask || activeCategory !== 'All' || sortBy !== 'all';

  if (loading) {
    return (
      <PageTransition>
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[var(--cyan)] border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          {/* ── Hero ─────────────────────────────────────── */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--cyan)]/20 bg-[var(--cyan)]/[0.04] mb-5">
              <Brain size={14} className="text-[var(--cyan)]" />
              <span className="text-[0.78rem] font-semibold text-[var(--cyan)] uppercase tracking-[1.8px]">
                AI App Directory
              </span>
            </div>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] mb-4 tracking-tight">
              Find the Right{' '}
              <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
                AI Tool
              </span>{' '}
              for Higher Ed
            </h1>
            <p className="text-[1.08rem] text-[var(--text-muted)] max-w-[580px] mx-auto mb-7">
              AI tools vetted by educators, for educators. Honest reviews, not marketing fluff.
            </p>

            {/* Search bar */}
            <div className="relative max-w-[600px] mx-auto mb-5">
              <Search
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder="Search by name, category, or what you need to do..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search AI tools"
                className="w-full pl-[50px] pr-5 py-3.5 rounded-[14px] bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--cyan)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] transition-all text-[0.95rem]"
              />
            </div>

            {/* Role filters */}
            <div className="flex flex-wrap justify-center gap-2 mb-2">
              {allRoles.map((r) => {
                const isActive = activeRole === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => setActiveRole(isActive ? null : r.value)}
                    className={`px-4 py-[7px] rounded-full text-[0.82rem] font-medium transition-all border ${
                      isActive
                        ? 'bg-[var(--cyan)]/10 border-[var(--cyan)]/40 text-[var(--cyan)]'
                        : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--cyan)]/35'
                    }`}
                  >
                    {r.label.replace("I'm ", '').replace('a ', '').replace('an ', '')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Category tabs ────────────────────────────── */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const count = cat === 'All' ? tools.length : tools.filter((t) => t.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-[7px] rounded-full text-[0.82rem] font-medium transition-all border whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--cyan)]/10 border-[var(--cyan)]/40 text-[var(--cyan)]'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--cyan)]/35'
                  }`}
                >
                  {cat}
                  <span className="ml-1.5 font-mono text-[0.72rem] opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          {/* ── Task-based filtering ─────────────────────── */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-6">
            {taskKeys.map((task) => {
              const Icon = taskIcons[task] ?? Bot;
              const isActive = activeTask === task;
              return (
                <button
                  key={task}
                  onClick={() => setActiveTask(isActive ? null : task)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all border ${
                    isActive
                      ? 'bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text)]'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  <Icon size={14} />
                  {taskLabels[task]}
                </button>
              );
            })}
          </div>

          {/* ── Sort buttons ─────────────────────────────── */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {([
              { value: 'all', label: 'All' },
              { value: 'recent', label: 'Recently Added' },
              { value: 'trending', label: 'Trending' },
              { value: 'updated', label: 'Updated' },
            ] as { value: SortOption; label: string }[]).map((opt) => {
              const isActive = sortBy === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`px-4 py-[7px] rounded-full text-[0.82rem] font-medium transition-all border ${
                    isActive
                      ? 'bg-[var(--magenta)]/10 border-[var(--magenta)]/40 text-[var(--magenta)]'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--magenta)]/35'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* ── Results count + clear ────────────────────── */}
          <div className="flex items-center justify-between max-w-[1200px] mx-auto mb-6 px-1">
            <div className="text-[0.84rem] text-[var(--text-muted)] font-mono">
              {filtered.length} tool{filtered.length !== 1 ? 's' : ''}
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-[var(--cyan)] hover:text-[var(--cyan)]/80 font-medium text-sm transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* ── Staff Picks ──────────────────────────────── */}
          {!hasFilters && staffPicks.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <BadgeCheck size={20} className="text-[var(--cyan)]" />
                <h2 className="text-xl font-bold text-[var(--text)]">Staff Picks</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                {staffPicks.slice(0, 3).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          )}

          {/* ── App Grid (3-column) ──────────────────────── */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[var(--text-muted)] mb-3">
                No tools match your current filters.
              </p>
              <button
                onClick={clearFilters}
                className="text-[var(--cyan)] hover:text-[var(--cyan)]/80 font-medium text-sm transition-colors"
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

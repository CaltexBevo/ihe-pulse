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
  AlertCircle,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { paletteFor } from '@/lib/palette';
import {
  AI_DIRECTORY_TASKS,
  assertValidAiDirectoryData,
  compareAiDirectoryContentDates,
  compareAiDirectoryReviewDates,
  formatAiDirectoryDate,
  getAiDirectoryReviewLabel,
  type AiDirectoryData,
  type AiDirectoryBadge,
  type AiDirectoryReview,
  type AiDirectoryTool,
  type AiDirectoryTask,
  type AiDirectoryRole,
} from '@/lib/data/ai-directory-schema';

type Role = AiDirectoryRole;
type TaskTag = AiDirectoryTask;
type SortOption = 'all' | 'reviewed' | 'updated';
type AiTool = AiDirectoryTool;
type AiAppsData = AiDirectoryData;

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

const taskKeys: TaskTag[] = [...AI_DIRECTORY_TASKS];

// ── Pricing badge ───────────────────────────────────────────

function PricingBadge({ model }: { model: string }) {
  const styles: Record<string, string> = {
    free: 'bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/20',
    freemium: 'bg-[var(--purple)]/10 text-[var(--purple)] border-[var(--purple)]/20',
    paid: 'bg-[var(--amber)]/10 text-[var(--amber)] border-[var(--amber)]/20',
    'institutional-quote': 'bg-[var(--magenta)]/10 text-[var(--magenta-text)] border-[var(--magenta)]/20',
    unknown: 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]',
  };
  const labels: Record<string, string> = {
    free: 'Free',
    freemium: 'Freemium',
    paid: 'Paid',
    'institutional-quote': 'Institutional quote',
    unknown: 'Pricing unknown',
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

function ToolBadge({ badge }: { badge: AiDirectoryBadge }) {
  const styles: Record<string, string> = {
    new: 'bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/20',
    updated: 'bg-[var(--purple)]/10 text-[var(--purple)] border-[var(--purple)]/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[0.65rem] font-semibold uppercase tracking-wider border font-mono ${styles[badge] ?? styles.new}`}>
      {badge}
    </span>
  );
}

function ReviewStatusBadge({ review }: { review: AiDirectoryReview }) {
  const isCurrent = review.status === 'current' && Boolean(review.reviewedAt);
  const className = isCurrent
    ? 'bg-[var(--cyan)]/10 text-[var(--cyan)] border-[var(--cyan)]/20'
    : review.status === 'limited'
      ? 'bg-[var(--purple)]/10 text-[var(--purple)] border-[var(--purple)]/20'
      : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)]';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.65rem] font-semibold tracking-wide border ${className}`}
      title={review.status === 'blocked' ? review.unresolvedClaims.join(' ') : undefined}
    >
      {isCurrent && <BadgeCheck size={12} aria-hidden="true" />}
      {getAiDirectoryReviewLabel(review)}
    </span>
  );
}

function ToolLogo({ tool, size = 'card' }: { tool: AiTool; size?: 'card' | 'detail' }) {
  const dimensions = size === 'detail' ? 'w-11 h-11' : 'w-8 h-8';
  const initial = tool.name.trim().charAt(0).toUpperCase() || '?';
  const accentColor = paletteFor(tool.slug);

  return (
    <div
      role="img"
      aria-label={`${tool.name} logo`}
      className={`${dimensions} flex items-center justify-center rounded-lg overflow-hidden font-bold text-[1.1rem]`}
      style={{ color: accentColor }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${tool.domain}&sz=64`}
        alt=""
        className={`${dimensions} object-contain`}
        onError={(event) => {
          event.currentTarget.hidden = true;
          event.currentTarget.nextElementSibling?.removeAttribute('hidden');
        }}
      />
      <span hidden aria-hidden="true">{initial}</span>
    </div>
  );
}

// ── Tool Card (new design) ──────────────────────────────────

function ToolCard({ tool }: { tool: AiTool }) {
  const accentColor = paletteFor(tool.slug);

  return (
    <Link
      href={`/ai-directory/${tool.slug}`}
      className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[3px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] flex flex-col"
      style={{ '--tool-accent': accentColor } as React.CSSProperties}
    >
      {/* Accent strip at top */}
      <div
        className="h-[3px] transition-[height] duration-300 group-hover:h-[4px]"
        style={{ background: accentColor }}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Top row: logo + name + badges */}
        <div className="flex items-center gap-3.5 mb-3.5">
          <div className="w-[46px] h-[46px] rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-elevated)] flex items-center justify-center border border-[var(--border)]">
            <ToolLogo tool={tool} />
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

        {tool.staffPick && (
          <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-[var(--cyan)]/30 bg-[var(--cyan)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--cyan)] mb-3">
            <BadgeCheck size={14} aria-hidden="true" />
            Staff Pick
          </span>
        )}

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
                style={{ background: accentColor }}
              />
              {value}
            </li>
          ))}
        </ul>

        {/* Footer: pricing + roles + learn more */}
        <div className="flex items-center gap-2.5 pt-3.5 border-t border-[var(--border)] flex-wrap">
          <PricingBadge model={tool.pricing.model} />
          <ReviewStatusBadge review={tool.review} />
          <div className="flex gap-1.5 flex-1">
            {tool.roles.slice(0, 3).map((role) => (
              <RoleTag key={role} role={role} />
            ))}
          </div>
          <span
            className="ml-auto text-[0.82rem] font-semibold flex items-center gap-1 transition-[gap] duration-200 group-hover:gap-2"
            style={{ color: accentColor }}
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
  const [directoryReview, setDirectoryReview] = useState<AiAppsData['directoryReview'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [activeTask, setActiveTask] = useState<TaskTag | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('all');
  const [staffPicksOnly, setStaffPicksOnly] = useState(false);

  // Load data from JSON
  useEffect(() => {
    fetch('/data/ai-apps.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Directory data request failed (${res.status})`);
        return res.json() as Promise<unknown>;
      })
      .then((data) => {
        assertValidAiDirectoryData(data);
        const typedData = data as AiAppsData;
        setTools(typedData.tools);
        setCategories(typedData.categories);
        setDirectoryReview(typedData.directoryReview);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Failed to load AI apps data:', err);
        setError(err instanceof Error ? err.message : 'The directory data could not be loaded.');
        setLoading(false);
      });
  }, []);

  const staffPicks = useMemo(() => tools.filter((t) => t.staffPick), [tools]);

  const filtered = useMemo(() => {
    let result = tools.filter((app) => {
      if (staffPicksOnly && !app.staffPick) return false;
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
    if (sortBy === 'reviewed') {
      result = [...result].sort(compareAiDirectoryReviewDates);
    } else if (sortBy === 'updated') {
      result = [...result].sort(compareAiDirectoryContentDates);
    }

    return result;
  }, [tools, activeRole, activeTask, activeCategory, search, sortBy, staffPicksOnly]);

  const clearFilters = () => {
    setSearch('');
    setActiveRole(null);
    setActiveTask(null);
    setActiveCategory('All');
    setSortBy('all');
    setStaffPicksOnly(false);
  };

  const hasFilters = search || activeRole || activeTask || activeCategory !== 'All' || sortBy !== 'all' || staffPicksOnly;
  const directoryDate = directoryReview ? formatAiDirectoryDate(directoryReview.contentUpdatedAt) : null;
  const directoryStatusCopy = directoryReview?.status === 'current'
    ? `All ${directoryReview.visibleToolCount} records completed an official-source review${directoryReview.fullReviewCompletedAt ? ` on ${formatAiDirectoryDate(directoryReview.fullReviewCompletedAt)}` : ''}.`
    : directoryReview?.status === 'partial'
      ? `This directory has a partial official-source review. Confirm details with the vendor before relying on them.`
      : `This directory is a legacy snapshot${directoryDate ? ` last updated ${directoryDate}` : ''} and is awaiting a current official-source review. Confirm details with the vendor.`;

  if (loading) {
    return (
      <PageTransition>
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="mx-auto max-w-7xl">
            <h1 className="sr-only">AI App Directory</h1>
            <div className="flex items-center justify-center gap-3 py-20 text-[var(--text-muted)]" role="status" aria-live="polite">
              <div className="w-8 h-8 border-2 border-[var(--cyan)] border-t-transparent rounded-full animate-spin" />
              <span>Loading the AI directory…</span>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="mx-auto max-w-3xl text-center py-16" role="alert">
            <AlertCircle size={28} className="mx-auto mb-4 text-[var(--cyan)]" aria-hidden="true" />
            <h1 className="text-2xl font-bold text-[var(--text)] mb-3">AI App Directory</h1>
            <p className="text-[var(--text-muted)]">The directory is temporarily unavailable. Please try again later.</p>
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
              AI tools for higher education, with transparent review status and practical use cases.
            </p>

            <div
              className="max-w-[760px] mx-auto mb-7 rounded-xl border border-[var(--cyan)]/25 bg-[var(--cyan)]/[0.05] px-4 py-3 text-left text-sm text-[var(--text-muted)]"
              role="status"
              aria-live="polite"
            >
              <span className="font-semibold text-[var(--text)]">
                {directoryReview?.status === 'current' ? 'Current review' : directoryReview?.status === 'partial' ? 'Partial review' : 'Review pending'}
              </span>{' '}
              {directoryStatusCopy}
            </div>

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
                    aria-pressed={isActive}
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
                  aria-pressed={isActive}
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
                  aria-pressed={isActive}
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
              { value: 'reviewed', label: 'Recently Reviewed' },
              { value: 'updated', label: 'Recently Updated' },
            ] as { value: SortOption; label: string }[]).map((opt) => {
              const isActive = sortBy === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  aria-pressed={isActive}
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
          <div className="flex flex-col items-center gap-2 mb-6">
            <button
              onClick={() => setStaffPicksOnly(!staffPicksOnly)}
              aria-pressed={staffPicksOnly}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors ${staffPicksOnly ? 'border-[var(--cyan)] bg-[var(--cyan)]/10 text-[var(--cyan)]' : 'border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'}`}
            >
              <BadgeCheck size={16} aria-hidden="true" />
              Staff Picks ({staffPicks.length})
            </button>
            <p className="text-xs text-[var(--text-muted)] text-center">
              Only cards marked Staff Pick are editorial selections. This label is not a product-testing or verification badge.
            </p>
          </div>
          <div className="flex items-center justify-between max-w-[1200px] mx-auto mb-6 px-1">
            <div aria-live="polite" className="text-[0.84rem] text-[var(--text-muted)] font-mono">
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

          {/* ── App Grid (3-column) ──────────────────────── */}
          <h2 className="text-xl font-bold text-[var(--cyan)] mb-5">
            {staffPicksOnly ? 'Staff Picks' : hasFilters ? 'Matching tools' : 'All tools'}
          </h2>
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

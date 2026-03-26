// ── Innovation Pulse Types ──────────────────────────────────────────────────
// This file contains ONLY types and client-safe constants (no fs/path imports)

// ── Editorial Lens Types ─────────────────────────────────────────────────────

export type EditorialLens =
  | "The Practitioner's Playbook"
  | 'The Hard Question'
  | 'The Student Experience'
  | 'Connecting the Dots'
  | "The Innovator's Edge";

export const editorialLensColors: Record<
  EditorialLens,
  { bg: string; text: string; border: string; gradient?: string }
> = {
  "The Practitioner's Playbook": {
    bg: 'bg-pulse/20',
    text: 'text-pulse',
    border: 'border-pulse/30',
  },
  'The Hard Question': {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  'The Student Experience': {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    border: 'border-green-500/30',
  },
  'Connecting the Dots': {
    bg: 'bg-synapse/20',
    text: 'text-synapse',
    border: 'border-synapse/30',
  },
  "The Innovator's Edge": {
    bg: 'bg-gradient-to-r from-pulse/20 to-synapse/20',
    text: 'text-white',
    border: 'border-pulse/30',
    gradient: 'bg-gradient-to-r from-pulse to-synapse',
  },
};

export const dayToLens: Record<string, EditorialLens> = {
  Monday: 'The Hard Question',
  Tuesday: 'The Student Experience',
  Wednesday: "The Practitioner's Playbook",
  Thursday: 'Connecting the Dots',
  Friday: "The Innovator's Edge",
};

// ── Story Category Types ─────────────────────────────────────────────────────

export type StoryCategory =
  | 'Infrastructure & Operations'
  | 'Teaching & Learning'
  | 'Policy & Ethics'
  | 'Tools & Products'
  | 'Research & Innovation'
  | 'Student Experience'
  | 'Leadership & Strategy';

export const categoryColors: Record<
  StoryCategory,
  { bg: string; text: string; border: string; hex: string }
> = {
  'Infrastructure & Operations': {
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    hex: '#3b82f6',
  },
  'Teaching & Learning': {
    bg: 'bg-green-500/15',
    text: 'text-green-400',
    border: 'border-green-500/30',
    hex: '#22c55e',
  },
  'Policy & Ethics': {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    hex: '#f59e0b',
  },
  'Tools & Products': {
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    hex: '#a855f7',
  },
  'Research & Innovation': {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-400',
    border: 'border-cyan-500/30',
    hex: '#06b6d4',
  },
  'Student Experience': {
    bg: 'bg-pink-500/15',
    text: 'text-pink-400',
    border: 'border-pink-500/30',
    hex: '#ec4899',
  },
  'Leadership & Strategy': {
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
    hex: '#6366f1',
  },
};

// ── Data Interfaces ──────────────────────────────────────────────────────────

export interface DeepDive {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  isCallback: boolean;
  callbackThreadId?: string;
  callbackFirstCovered?: string;
  category: StoryCategory;
  editorialCallout?: string;
  image?: string; // Assigned at data load time for consistency
}

export interface QuickHit {
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  category: StoryCategory;
  isCallback?: boolean;
  callbackDate?: string;
  image?: string; // Assigned at data load time for consistency
}

export interface StoryWatching {
  threadId: string;
  label: string;
  update: string;
  daysSinceFirstCovered: number;
}

export interface InnovationPulseEpisode {
  date: string;
  dayOfWeek: string;
  editorialLens: EditorialLens;
  editorialHook: string;
  audioUrl: string;
  audioDuration: string;
  deepDive: DeepDive;
  quickHits: QuickHit[];
  storiesWatching: StoryWatching[];
  closingThought: string;
  categories: StoryCategory[];
  themes: string[];
}

// ── Date Formatting Utilities ────────────────────────────────────────────────

export function formatPulseDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export function getDayOfWeek(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

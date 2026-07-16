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
    // Palette-locked (Rule 17.3): green retired → purple
    bg: 'bg-[var(--purple-dim)]',
    text: 'text-[var(--purple)]',
    border: 'border-[rgba(167,139,250,0.3)]',
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
  | 'Leadership & Strategy'
  // V5 categories (pass-through from JSON)
  | 'Research'
  | 'AI Workforce & Careers'
  | 'Investing in Innovation'
  | 'Tool Spotlight';

// (categoryColors map removed 2026-07-15 — it was unused; V4_CATEGORY_COLORS
// below is the live category → color source.)

// ── DataViz Types ────────────────────────────────────────────────────────────

export interface DataVizPoint {
  label: string;
  value: number;
  unit?: string;
}

export interface DataVizConfig {
  type: 'bar' | 'donut' | 'comparison';
  title?: string;
  data: DataVizPoint[];
  source?: string;
}

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
  dataViz?: DataVizConfig; // Optional chart data
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
  dataViz?: DataVizConfig; // Optional chart data
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
  // Full broadcast script (raw, may contain SSML <break> tags and HTML
  // comments) — render via cleanBroadcastScript() below.
  broadcastScript?: string;
  // Cadence fields (weekly episodes have these; daily/legacy episodes don't)
  cadence?: 'daily' | 'weekly';
  weekCovered?: string; // Format: "2026-05-23/2026-05-29"
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

// ── Cadence-Aware Formatting Utilities ───────────────────────────────────────

/**
 * Check if an episode is weekly cadence
 */
export function isWeeklyEpisode(episode: InnovationPulseEpisode): boolean {
  return episode.cadence === 'weekly';
}

/**
 * Format weekCovered string "2026-05-23/2026-05-29" to "WEEK OF MAY 23–29"
 * Falls back to single-date format for daily/missing weekCovered
 */
export function formatWeekCovered(episode: InnovationPulseEpisode): string {
  if (!episode.weekCovered || episode.cadence !== 'weekly') {
    // Daily or legacy episode: return day-based format
    const d = new Date(episode.date + 'T12:00:00');
    const dayAbbr = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 3);
    const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    const day = d.getDate();
    return `${dayAbbr} · ${month} ${day}`;
  }

  // Weekly episode: parse weekCovered and format as "WEEK OF MAY 23–29"
  const [startDate, endDate] = episode.weekCovered.split('/');
  const start = new Date(startDate + 'T12:00:00');
  const end = new Date(endDate + 'T12:00:00');

  const startMonth = start.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const endMonth = end.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const startDay = start.getDate();
  const endDay = end.getDate();

  // Same month: "WEEK OF MAY 23–29"
  // Different months: "WEEK OF MAY 30 – JUN 5"
  if (startMonth === endMonth) {
    return `WEEK OF ${startMonth} ${startDay}–${endDay}`;
  } else {
    return `WEEK OF ${startMonth} ${startDay} – ${endMonth} ${endDay}`;
  }
}

/**
 * Format weekCovered for episode page display: "Covering May 23–29, 2026"
 */
export function formatWeekCoveredLong(episode: InnovationPulseEpisode): string | null {
  if (!episode.weekCovered || episode.cadence !== 'weekly') {
    return null;
  }

  const [startDate, endDate] = episode.weekCovered.split('/');
  const start = new Date(startDate + 'T12:00:00');
  const end = new Date(endDate + 'T12:00:00');

  const startMonth = start.toLocaleDateString('en-US', { month: 'long' });
  const endMonth = end.toLocaleDateString('en-US', { month: 'long' });
  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  // Same month: "Covering May 23–29, 2026"
  // Different months: "Covering May 30 – June 5, 2026"
  if (startMonth === endMonth) {
    return `Covering ${startMonth} ${startDay}–${endDay}, ${year}`;
  } else {
    return `Covering ${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
  }
}

// ── Transcript Utilities (Client-Safe) ───────────────────────────────────────

/**
 * Clean a raw broadcast script for on-page transcript display.
 * Strips SSML <break> tags and HTML comments (pipeline signatures),
 * then splits into trimmed paragraphs.
 */
export function cleanBroadcastScript(script: string): string[] {
  return script
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<break\b[^>]*\/?>/gi, '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// ── Slug Utilities (Client-Safe) ──────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

// ── V4 Category Types & Utilities (Client-Safe) ───────────────────────────────

export type V4Category =
  | "Insights & Trends"
  | "Case Study"
  | "Practical Tips"
  | "Ethical AI"
  | "Latest AI Products"
  | "Beyond Ed"
  | "Week in Review"
  | "Research"
  | "AI Workforce & Careers"
  | "Investing in Innovation";

export const V4_CATEGORIES: V4Category[] = [
  "Insights & Trends",
  "Case Study",
  "Practical Tips",
  "Ethical AI",
  "Latest AI Products",
  "Beyond Ed",
  "Week in Review",
  "Research",
  "AI Workforce & Careers",
  "Investing in Innovation",
];

export const V4_CATEGORY_COLORS: Record<V4Category, string> = {
  "Insights & Trends": "#00d4ff",
  "Case Study": "#a78bfa",
  "Practical Tips": "#00d4ff",
  "Ethical AI": "#f59e0b",
  "Latest AI Products": "#a78bfa",
  "Beyond Ed": "#00d4ff",
  "Week in Review": "#b040a8",
  "Research": "#a78bfa",
  "AI Workforce & Careers": "#f59e0b",
  "Investing in Innovation": "#b040a8",
};

const OLD_TO_V4_MAP: Record<string, V4Category> = {
  "Research & Innovation": "Insights & Trends",
  "Infrastructure & Operations": "Case Study",
  "Teaching & Learning": "Practical Tips",
  "Policy & Ethics": "Ethical AI",
  "Tools & Products": "Latest AI Products",
  "Student Experience": "Beyond Ed",
  "Leadership & Strategy": "Insights & Trends",
  // V5 categories pass through (Tool Spotlight merged into Practical Tips 2026-06-23)
  "Research": "Research",
  "AI Workforce & Careers": "AI Workforce & Careers",
  "Investing in Innovation": "Investing in Innovation",
  "Tool Spotlight": "Practical Tips",
};

export function mapToV4Category(oldCategory: string): V4Category {
  return OLD_TO_V4_MAP[oldCategory] || (oldCategory as V4Category) || "Insights & Trends";
}

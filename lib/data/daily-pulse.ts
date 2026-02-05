// ── Daily Pulse Data ────────────────────────────────────────

export type PulseCategory =
  | 'Insights & Trends'
  | 'Product Releases'
  | 'Tool Spotlight'
  | 'Case Studies';

export const pulseCategories: PulseCategory[] = [
  'Insights & Trends',
  'Product Releases',
  'Tool Spotlight',
  'Case Studies',
];

export const categoryColors: Record<PulseCategory, { bg: string; text: string; border: string; hex: string }> = {
  'Insights & Trends': {
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    hex: '#3b82f6',
  },
  'Product Releases': {
    bg: 'bg-green-500/15',
    text: 'text-green-400',
    border: 'border-green-500/30',
    hex: '#22c55e',
  },
  'Tool Spotlight': {
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    hex: '#f59e0b',
  },
  'Case Studies': {
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    hex: '#a855f7',
  },
};

export interface PulseStory {
  id: string;
  title: string;
  summary: string;
  ihePerspective: string;
  category: PulseCategory;
  source: string;
  sourceUrl: string;
  date: string; // YYYY-MM-DD
}

export interface DailyBriefing {
  date: string; // YYYY-MM-DD
  greeting: string;
  audioSrc: string; // placeholder for now
  audioDuration: string;
  stories: PulseStory[];
}

// ── Sample Data ─────────────────────────────────────────────

const todayStr = new Date().toISOString().split('T')[0];

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export const sampleStories: PulseStory[] = [
  {
    id: 'story-1',
    title: 'OpenAI Launches GPT-5 With Enhanced Reasoning for Education',
    summary:
      'OpenAI\'s latest model introduces "Teaching Mode" with step-by-step reasoning scaffolds, citation verification, and the ability to adapt explanations to student skill levels. Early pilots at three R1 universities show a 28% improvement in student comprehension of complex topics.',
    ihePerspective:
      'This is a meaningful step forward for AI tutoring. The citation verification alone addresses one of our biggest concerns about hallucinated references. Faculty should pilot this in low-stakes settings first — think office-hour supplement, not exam prep.',
    category: 'Product Releases',
    source: 'OpenAI Blog',
    sourceUrl: 'https://openai.com/blog',
    date: todayStr,
  },
  {
    id: 'story-2',
    title: 'Survey: 67% of Faculty Now Use AI Weekly in Course Prep',
    summary:
      'A new Educause survey of 4,200 faculty across 120 institutions reveals that two-thirds now use generative AI at least weekly for lesson planning, content creation, or grading assistance. However, only 23% report receiving formal training from their institution.',
    ihePerspective:
      'The training gap is the real story here. Faculty are adopting AI faster than institutions can support them. If your campus doesn\'t have an AI literacy program yet, you\'re already behind. Start with a 2-hour workshop — something is better than nothing.',
    category: 'Insights & Trends',
    source: 'Educause Review',
    sourceUrl: 'https://er.educause.edu',
    date: todayStr,
  },
  {
    id: 'story-3',
    title: 'How Georgia State Used AI Chatbots to Cut Summer Melt by 22%',
    summary:
      'Georgia State University expanded its Pounce chatbot to handle financial aid questions, registration nudges, and orientation reminders. The AI-driven outreach reduced summer melt — students who commit but never enroll — by 22% compared to the control group.',
    ihePerspective:
      'This is exactly the kind of AI use case that should excite administrators: high impact, measurable ROI, and it directly serves students who need it most. The key was pairing AI outreach with human follow-up for complex cases.',
    category: 'Case Studies',
    source: 'Inside Higher Ed',
    sourceUrl: 'https://insidehighered.com',
    date: todayStr,
  },
  {
    id: 'story-4',
    title: 'Grammarly Adds AI-Powered Peer Review for Student Writing',
    summary:
      'Grammarly for Education now includes a structured peer review workflow where AI guides students through giving feedback using rubric-aligned criteria. Instructors can customize the review prompts and track participation.',
    ihePerspective:
      'Peer review has always been valuable but hard to implement well. AI scaffolding the process — not replacing it — is smart design. I\'d recommend pairing this with a class discussion about what makes feedback useful.',
    category: 'Tool Spotlight',
    source: 'Grammarly Blog',
    sourceUrl: 'https://grammarly.com/blog',
    date: todayStr,
  },
  {
    id: 'story-5',
    title: 'MIT Report: AI Literacy Should Be a General Education Requirement',
    summary:
      'A new MIT working paper argues that understanding AI systems — their capabilities, limitations, and societal impacts — should be as fundamental as writing or quantitative reasoning in higher education curricula.',
    ihePerspective:
      'I\'ve been saying this for two years. Every graduate needs to understand how AI works, not just how to use it. The good news: you don\'t need a computer science department to teach AI literacy. Start with critical thinking about AI outputs.',
    category: 'Insights & Trends',
    source: 'MIT Technology Review',
    sourceUrl: 'https://technologyreview.com',
    date: todayStr,
  },
  {
    id: 'story-6',
    title: 'Anthropic Releases Claude for Education with Campus-Wide Licensing',
    summary:
      'Anthropic announced an education-specific tier of Claude that includes FERPA-compliant data handling, custom system prompts for institutional policies, usage dashboards for administrators, and discounted per-seat pricing for universities.',
    ihePerspective:
      'The FERPA compliance and institutional dashboards are what we\'ve been waiting for. This makes Claude a legitimate option for campus-wide deployment. Ask your CIO to request a pilot — Anthropic is offering 90-day trials.',
    category: 'Product Releases',
    source: 'Anthropic News',
    sourceUrl: 'https://anthropic.com',
    date: todayStr,
  },
  {
    id: 'story-7',
    title: 'Canvas LMS Integrates AI Assignment Designer',
    summary:
      'Instructure has embedded an AI-powered assignment designer directly into Canvas that suggests learning objectives, generates rubrics, and recommends assessment types based on Bloom\'s Taxonomy alignment.',
    ihePerspective:
      'This is the kind of integration that will actually change behavior — meeting faculty where they already work. The Bloom\'s alignment feature alone saves 30 minutes per assignment. Watch for this in your next Canvas update.',
    category: 'Tool Spotlight',
    source: 'Instructure Blog',
    sourceUrl: 'https://instructure.com/blog',
    date: daysAgo(1),
  },
  {
    id: 'story-8',
    title: 'Community College Consortium Shares AI Policy Templates',
    summary:
      'A consortium of 35 community colleges has open-sourced a set of AI policy templates covering academic integrity, faculty use guidelines, student disclosure requirements, and institutional governance frameworks.',
    ihePerspective:
      'Don\'t reinvent the wheel. These templates are CC-licensed and battle-tested across diverse institutions. Download them, adapt them to your context, and have them ready before fall semester.',
    category: 'Case Studies',
    source: 'Community College Daily',
    sourceUrl: 'https://ccdaily.com',
    date: daysAgo(1),
  },
];

export const briefings: DailyBriefing[] = [
  {
    date: todayStr,
    greeting: 'Good morning, educators.',
    audioSrc: '/audio/daily-pulse-placeholder.mp3',
    audioDuration: '6:45',
    stories: sampleStories.filter((s) => s.date === todayStr),
  },
  {
    date: daysAgo(1),
    greeting: 'Good morning, educators.',
    audioSrc: '/audio/daily-pulse-placeholder.mp3',
    audioDuration: '5:30',
    stories: sampleStories.filter((s) => s.date === daysAgo(1)),
  },
];

// ── Helpers ─────────────────────────────────────────────────

export function getTodayBriefing(): DailyBriefing {
  return briefings[0];
}

export function getBriefingByDate(date: string): DailyBriefing | undefined {
  return briefings.find((b) => b.date === date);
}

export function getRecentDates(): string[] {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(daysAgo(i));
  }
  return dates;
}

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

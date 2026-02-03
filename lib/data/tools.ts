export interface Tool {
  name: string;
  category: string;
  description: string;
  rating: number;
  badge: string;
  color: string;
  url?: string;
}

export const toolCategories = [
  'All',
  'Teaching',
  'Research',
  'Admin',
  'Student Support',
  'Content Creation',
] as const;

export type ToolCategory = (typeof toolCategories)[number];

export const tools: Tool[] = [
  {
    name: 'ChatGPT Edu',
    category: 'Teaching',
    description:
      'Enterprise AI assistant with university-grade security, custom GPTs, and data analytics for institutions.',
    rating: 4.8,
    badge: 'Popular',
    color: 'from-green-400/20 to-green-600/20',
  },
  {
    name: 'Claude',
    category: 'Research',
    description:
      'Advanced AI assistant with 200K context window, ideal for analyzing lengthy research papers and writing.',
    rating: 4.9,
    badge: 'Top Rated',
    color: 'from-orange-400/20 to-orange-600/20',
  },
  {
    name: 'Grammarly EDU',
    category: 'Student Support',
    description:
      'AI writing assistant with plagiarism detection, citation support, and institution-wide analytics.',
    rating: 4.6,
    badge: '',
    color: 'from-emerald-400/20 to-emerald-600/20',
  },
  {
    name: 'Consensus',
    category: 'Research',
    description:
      'AI-powered academic search engine that finds and synthesizes insights from peer-reviewed papers.',
    rating: 4.7,
    badge: 'Rising',
    color: 'from-blue-400/20 to-blue-600/20',
  },
  {
    name: 'Gradescope',
    category: 'Teaching',
    description:
      'AI-assisted grading platform that saves time on assessments with rubric-based evaluation and analytics.',
    rating: 4.5,
    badge: '',
    color: 'from-purple-400/20 to-purple-600/20',
  },
  {
    name: 'Otter.ai',
    category: 'Admin',
    description:
      'Real-time meeting transcription and notes with AI summaries, perfect for lectures and committee meetings.',
    rating: 4.4,
    badge: '',
    color: 'from-cyan-400/20 to-cyan-600/20',
  },
  {
    name: 'Canva AI',
    category: 'Content Creation',
    description:
      'AI-enhanced design platform for creating presentations, infographics, and course materials quickly.',
    rating: 4.7,
    badge: 'Popular',
    color: 'from-violet-400/20 to-violet-600/20',
  },
  {
    name: 'Turnitin AI',
    category: 'Teaching',
    description:
      'Academic integrity platform with AI writing detection, feedback studio, and similarity checking.',
    rating: 4.3,
    badge: '',
    color: 'from-red-400/20 to-red-600/20',
  },
  {
    name: 'Elicit',
    category: 'Research',
    description:
      'AI research assistant that automates literature review, data extraction, and research synthesis.',
    rating: 4.6,
    badge: 'Rising',
    color: 'from-amber-400/20 to-amber-600/20',
  },
  {
    name: 'Notion AI',
    category: 'Admin',
    description:
      'AI-integrated workspace for notes, docs, wikis, and project management across departments.',
    rating: 4.5,
    badge: '',
    color: 'from-stone-400/20 to-stone-600/20',
  },
  {
    name: 'Synthesia',
    category: 'Content Creation',
    description:
      'AI video generation platform for creating training videos, lectures, and multilingual content.',
    rating: 4.4,
    badge: '',
    color: 'from-pink-400/20 to-pink-600/20',
  },
  {
    name: 'Quizlet AI',
    category: 'Student Support',
    description:
      'AI-powered study platform with adaptive flashcards, practice tests, and personalized learning paths.',
    rating: 4.5,
    badge: 'Popular',
    color: 'from-indigo-400/20 to-indigo-600/20',
  },
  {
    name: 'Perplexity',
    category: 'Research',
    description:
      'AI-powered search engine with citations, perfect for fact-checking and quick academic research queries.',
    rating: 4.6,
    badge: 'Rising',
    color: 'from-teal-400/20 to-teal-600/20',
  },
  {
    name: 'Descript',
    category: 'Content Creation',
    description:
      'AI-powered video and podcast editor with transcription, screen recording, and text-based editing.',
    rating: 4.5,
    badge: '',
    color: 'from-lime-400/20 to-lime-600/20',
  },
  {
    name: 'Copilot for M365',
    category: 'Admin',
    description:
      'Microsoft AI assistant integrated into Word, Excel, PowerPoint, and Teams for campus productivity.',
    rating: 4.4,
    badge: 'Popular',
    color: 'from-sky-400/20 to-sky-600/20',
  },
];

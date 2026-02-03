export interface Post {
  title: string;
  excerpt: string;
  tag: string;
  date: string;
  readTime: string;
  featured: boolean;
  slug?: string;
}

export const postTags = [
  'All',
  'AI Tools',
  'Pedagogy',
  'Experiments',
  'Tutorials',
  'Opinion',
] as const;

export type PostTag = (typeof postTags)[number];

export const posts: Post[] = [
  {
    title: "I Gave GPT-4o My Entire Course — Here's What Happened",
    excerpt:
      'An experiment in feeding a full semester\'s course materials to GPT-4o and asking it to redesign the curriculum. The results were surprisingly nuanced.',
    tag: 'Experiments',
    date: 'Feb 1, 2026',
    readTime: '12 min read',
    featured: true,
  },
  {
    title: "Building a RAG Pipeline for Your Department's Knowledge Base",
    excerpt:
      'A step-by-step guide to creating a retrieval-augmented generation system that actually works with institutional data.',
    tag: 'Tutorials',
    date: 'Jan 28, 2026',
    readTime: '15 min read',
    featured: false,
  },
  {
    title: 'Why AI Detection Is a Losing Battle',
    excerpt:
      "The arms race between AI writing and AI detection is fundamentally flawed. Here's what we should be doing instead.",
    tag: 'Opinion',
    date: 'Jan 25, 2026',
    readTime: '8 min read',
    featured: false,
  },
  {
    title: 'Comparing 5 AI Rubric Generators: A Real-World Test',
    excerpt:
      'I tested ChatGPT, Claude, Gemini, Copilot, and a dedicated rubric tool with the same assignment. Side-by-side results inside.',
    tag: 'AI Tools',
    date: 'Jan 22, 2026',
    readTime: '10 min read',
    featured: false,
  },
  {
    title: 'The Socratic Method Meets Socratic AI',
    excerpt:
      'Can AI effectively use the Socratic method? I built a custom GPT to find out, and tested it with 30 students.',
    tag: 'Experiments',
    date: 'Jan 18, 2026',
    readTime: '9 min read',
    featured: false,
  },
  {
    title: 'Designing AI-Proof Assessments That Students Actually Enjoy',
    excerpt:
      "Forget trying to detect AI use — design assignments where AI is either irrelevant or transparently part of the process.",
    tag: 'Pedagogy',
    date: 'Jan 15, 2026',
    readTime: '7 min read',
    featured: false,
  },
  {
    title: 'My Favorite 10 Claude Prompts for Course Design',
    excerpt:
      'The prompts I use every week for learning outcomes, rubrics, discussion questions, and more. Tested across 3 semesters.',
    tag: 'AI Tools',
    date: 'Jan 11, 2026',
    readTime: '6 min read',
    featured: false,
  },
  {
    title: 'What Students Really Think About AI in the Classroom',
    excerpt:
      'I surveyed my classes anonymously about their AI use, fears, and hopes. Their honesty was refreshing.',
    tag: 'Pedagogy',
    date: 'Jan 8, 2026',
    readTime: '8 min read',
    featured: false,
  },
  {
    title: 'Building an AI-Powered Study Group Matcher',
    excerpt:
      'I used the OpenAI API to build a simple tool that matches students into study groups based on learning style and schedule. Full code included.',
    tag: 'Tutorials',
    date: 'Jan 4, 2026',
    readTime: '14 min read',
    featured: false,
  },
  {
    title: 'The Case for Teaching Students to Prompt Engineer',
    excerpt:
      'Prompt engineering isn\'t just a tech skill — it\'s critical thinking in action. Here\'s how I integrated it into my writing course.',
    tag: 'Opinion',
    date: 'Jan 1, 2026',
    readTime: '6 min read',
    featured: false,
  },
];

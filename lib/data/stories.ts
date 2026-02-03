export interface Story {
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  author?: string;
  tag?: string;
}

export const storyCategories = [
  'All',
  'Policy',
  'Tools',
  'Research',
  'Teaching',
  'Industry',
] as const;

export type StoryCategory = (typeof storyCategories)[number];

export const featuredStory: Story = {
  category: 'Policy',
  title: 'White House Releases Comprehensive AI Framework for Higher Education',
  excerpt:
    'The new executive guidance outlines how universities should integrate AI across curriculum, research, and administration while maintaining academic integrity and equity.',
  author: 'Dr. Norma Jones',
  date: 'Feb 2, 2026',
  readTime: '8 min read',
  tag: 'Breaking',
};

export const stories: Story[] = [
  {
    category: 'Tools',
    title: 'Claude 4.5 Introduces Education-Specific Features for Faculty',
    excerpt:
      'New capabilities include assignment feedback, rubric generation, and student-safe modes.',
    date: 'Feb 2, 2026',
    readTime: '5 min',
  },
  {
    category: 'Research',
    title: 'Stanford Study: AI Tutoring Closes Achievement Gap by 32%',
    excerpt:
      'First-generation college students showed the most significant improvement with AI-assisted learning.',
    date: 'Feb 1, 2026',
    readTime: '6 min',
  },
  {
    category: 'Teaching',
    title: 'How 5 Professors Are Using AI to Transform Office Hours',
    excerpt:
      'From chatbot assistants to automated scheduling, faculty share what actually works.',
    date: 'Feb 1, 2026',
    readTime: '7 min',
  },
  {
    category: 'Industry',
    title: 'Google Announces $500M AI Education Initiative',
    excerpt:
      'Partnership with 50 universities to build AI literacy programs and research centers.',
    date: 'Jan 31, 2026',
    readTime: '4 min',
  },
  {
    category: 'Policy',
    title: 'EU AI Act: What It Means for University Research Labs',
    excerpt:
      'New compliance requirements and how institutions are preparing for enforcement.',
    date: 'Jan 31, 2026',
    readTime: '6 min',
  },
  {
    category: 'Tools',
    title: 'Top 10 AI Grading Assistants Compared: 2026 Edition',
    excerpt:
      'We tested the latest grading tools across rubric accuracy, speed, and bias detection.',
    date: 'Jan 30, 2026',
    readTime: '10 min',
  },
  {
    category: 'Research',
    title: 'New Meta-Analysis: AI Impact on Student Learning Outcomes',
    excerpt:
      'A comprehensive review of 150 studies reveals consistent positive effects when AI is used as a complement to instruction.',
    date: 'Jan 29, 2026',
    readTime: '7 min',
  },
  {
    category: 'Teaching',
    title: 'Flipped Classroom 2.0: Using AI to Personalize Pre-Class Work',
    excerpt:
      'How three professors are using AI to generate customized pre-class materials based on student performance data.',
    date: 'Jan 28, 2026',
    readTime: '8 min',
  },
];

export const trendingItems = [
  'AI literacy now required at 40% of R1 universities',
  'OpenAI launches free tier for .edu domains',
  'Faculty senate debates AI co-authorship policy',
];

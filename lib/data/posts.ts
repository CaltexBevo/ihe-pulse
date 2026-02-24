export interface Post {
  title: string;
  excerpt: string;
  fullDescription: string;
  takeaways: string[];
  authorBio: string;
  topics: string[];
  tag: string;
  date: string;
  readTime: string;
  featured: boolean;
  slug: string;
  podbeanId: string;
  thumbnail?: string;
}

export const postTags = [
  'All',
  'Experiment',
  'Walkthrough',
  'Comparison',
  'Challenge',
  'Opinion',
] as const;

export type PostTag = (typeof postTags)[number];

export const posts: Post[] = [
  {
    title: 'The Wonka-Lantern Framework: Creative & Ethical AI in Higher Education',
    excerpt:
      'A framework for AI in higher education that channels Willy Wonka (imagination) and the Green Lantern (ethical responsibility).',
    fullDescription:
      'This framework for AI in higher education channels Willy Wonka (imagination) and the Green Lantern (ethical responsibility). The Wonka mindset encourages educators to dream big with AI, while the Green Lantern lens reminds us that AI amplifies our values and biases. Together they form a practical framework for building innovation sprints and AI sandboxes that keep ethics front and center.',
    takeaways: [
      'Wonka mindset: Dream big with AI in education',
      'Green Lantern responsibility: AI amplifies our values and biases',
      'Teaching students to think critically about technology',
      'Building innovation sprints and AI sandboxes',
    ],
    authorBio:
      'The Innovating Higher Ed team explores emerging technologies in education.',
    topics: ['AI Ethics', 'Creativity', 'Innovation Framework', 'Critical Thinking'],
    tag: 'Experiment',
    date: 'June 17, 2025',
    readTime: '12 min read',
    featured: true,
    slug: 'wonka-lantern',
    podbeanId: '5u76p-18dbb0a-pb',
    thumbnail:
      'https://innovatinghighered.com/wp-content/uploads/2025/06/Tinker-Lab-WIlly-Wonka.02-585x390.jpg',
  },
  {
    title: 'ChatGPT Pro Deep Research: Worth It?',
    excerpt:
      'We test OpenAI\'s ChatGPT Pro and its premium Deep Research feature for creating an OER textbook on Public Speaking.',
    fullDescription:
      'We test OpenAI\'s ChatGPT Pro and its premium Deep Research feature for creating an OER textbook on Public Speaking. This walkthrough breaks down when Deep Research shines—cross-disciplinary scans in minutes—and where it stumbles, including phantom URLs that require Google Scholar back-checks. The bottom line: lower-cost plans cover most course prep, but Deep Research has niche superpowers.',
    takeaways: [
      'When Deep Research shines: cross-disciplinary scans in minutes',
      'Hidden gems: accessibility standards and medical-presentation insights',
      'Red flags: phantom URLs and Google Scholar back-checks',
      'Budget math: why lower-cost plans cover most course prep',
    ],
    authorBio:
      'The Innovating Higher Ed team explores emerging technologies in education.',
    topics: ['ChatGPT Pro', 'Deep Research', 'OER', 'Tool Review'],
    tag: 'Walkthrough',
    date: 'February 28, 2025',
    readTime: '15 min read',
    featured: false,
    slug: 'chatgpt-pro',
    podbeanId: '2va8v-1821075-pb',
    thumbnail:
      'https://innovatinghighered.com/wp-content/uploads/2025/05/Tinker-Lab-Chat-Pro.-01-585x390.jpg',
  },
];

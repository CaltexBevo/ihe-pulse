export interface Episode {
  number: number;
  title: string;
  description: string;
  duration: string;
  date: string;
  featured: boolean;
}

export const episodes: Episode[] = [
  {
    number: 47,
    title: 'The Rise of AI Teaching Assistants: What Faculty Need to Know',
    description:
      'We explore how AI teaching assistants are transforming office hours, grading, and student support across campuses nationwide.',
    duration: '18:24',
    date: 'Feb 2, 2026',
    featured: true,
  },
  {
    number: 46,
    title: 'Building AI Literacy Into Your Syllabus',
    description:
      'Practical strategies for embedding AI competencies into any course without overhauling your entire curriculum.',
    duration: '22:10',
    date: 'Jan 29, 2026',
    featured: false,
  },
  {
    number: 45,
    title: 'The Ethics of AI Detection Tools',
    description:
      'A frank conversation about AI detection accuracy, false positives, and the impact on student-faculty trust.',
    duration: '25:33',
    date: 'Jan 26, 2026',
    featured: false,
  },
  {
    number: 44,
    title: "From Skeptic to Champion: One Dean's AI Journey",
    description:
      "Dean Maria Lopez shares how she went from banning ChatGPT to leading her college's AI integration strategy.",
    duration: '19:45',
    date: 'Jan 22, 2026',
    featured: false,
  },
  {
    number: 43,
    title: 'Prompt Engineering for Educators: Beyond the Basics',
    description:
      'Advanced prompting techniques that produce better outputs for course design, assessment, and student feedback.',
    duration: '20:18',
    date: 'Jan 19, 2026',
    featured: false,
  },
  {
    number: 42,
    title: 'AI and Accessibility: Closing Gaps in Higher Ed',
    description:
      'How AI tools are making education more accessible for students with disabilities and diverse learning needs.',
    duration: '23:55',
    date: 'Jan 15, 2026',
    featured: false,
  },
  {
    number: 41,
    title: 'The Community College AI Advantage',
    description:
      'Why community colleges are uniquely positioned to lead AI education and workforce development.',
    duration: '17:30',
    date: 'Jan 12, 2026',
    featured: false,
  },
  {
    number: 40,
    title: 'Student Voices: How Learners Are Actually Using AI',
    description:
      'We surveyed 500 college students about their AI habits — the results may surprise you.',
    duration: '21:12',
    date: 'Jan 8, 2026',
    featured: false,
  },
  {
    number: 39,
    title: 'AI in the Writing Center: Friend or Foe?',
    description:
      'Writing center directors discuss how they are adapting their practices for the age of AI-assisted writing.',
    duration: '24:08',
    date: 'Jan 5, 2026',
    featured: false,
  },
  {
    number: 38,
    title: 'The 2026 AI in Higher Ed Predictions Episode',
    description:
      'Our annual predictions episode — what to expect from AI in higher education this year, and what surprised us from 2025.',
    duration: '28:42',
    date: 'Jan 1, 2026',
    featured: false,
  },
];

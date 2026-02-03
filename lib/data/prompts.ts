export interface Prompt {
  category: string;
  title: string;
  prompt: string;
  uses: number;
}

export const promptCategories = [
  'All',
  'Curriculum Design',
  'Assessment',
  'Research',
  'Student Engagement',
  'Analytics',
  'Writing',
] as const;

export type PromptCategory = (typeof promptCategories)[number];

export const prompts: Prompt[] = [
  {
    category: 'Curriculum Design',
    title: 'Course Learning Outcomes Generator',
    prompt:
      "Generate 5 measurable learning outcomes for a [LEVEL] course on [TOPIC] using Bloom's Taxonomy. Each outcome should start with an action verb and be assessable. Format as a numbered list with the Bloom's level noted in parentheses.",
    uses: 1247,
  },
  {
    category: 'Assessment',
    title: 'Rubric Builder',
    prompt:
      'Create a detailed analytical rubric for [ASSIGNMENT TYPE] with 4 criteria and 4 performance levels (Exemplary, Proficient, Developing, Beginning). Include specific descriptors for each cell. The assignment focuses on [TOPIC/SKILL].',
    uses: 982,
  },
  {
    category: 'Research',
    title: 'Literature Review Synthesizer',
    prompt:
      'Help me synthesize the following research findings into a cohesive literature review paragraph. Identify common themes, contradictions, and gaps. Sources: [PASTE SUMMARIES]. Write in academic tone suitable for a peer-reviewed journal.',
    uses: 856,
  },
  {
    category: 'Student Engagement',
    title: 'Discussion Question Designer',
    prompt:
      'Design 5 thought-provoking discussion questions for [TOPIC] that promote critical thinking and peer-to-peer learning. Include a mix of analysis, evaluation, and synthesis questions. Each should be open-ended with no single correct answer.',
    uses: 743,
  },
  {
    category: 'Writing',
    title: 'Assignment Description Writer',
    prompt:
      'Write a clear, detailed assignment description for [ASSIGNMENT TYPE] in a [COURSE NAME] course. Include: purpose, requirements, formatting guidelines, evaluation criteria, due date placeholder, and academic integrity note. Tone should be encouraging but professional.',
    uses: 694,
  },
  {
    category: 'Analytics',
    title: 'Student Performance Analyzer',
    prompt:
      'Analyze this grade distribution data and identify: 1) overall trends, 2) potential equity gaps, 3) assignments that may need redesign, 4) recommendations for intervention. Data: [PASTE DATA]. Present findings with actionable next steps.',
    uses: 521,
  },
  {
    category: 'Curriculum Design',
    title: 'AI Policy Statement Drafter',
    prompt:
      'Draft a course-level AI use policy for [COURSE NAME] that addresses: permitted uses of AI tools, citation requirements, academic integrity boundaries, and learning rationale. Tone should be supportive of responsible AI use, not punitive.',
    uses: 1102,
  },
  {
    category: 'Assessment',
    title: 'Feedback Comment Generator',
    prompt:
      "Generate constructive, specific feedback comments for a student's [ASSIGNMENT TYPE] on [TOPIC]. The work demonstrates [STRENGTHS] but needs improvement in [AREAS]. Provide 3 praise comments, 3 constructive suggestions, and 1 forward-looking goal.",
    uses: 889,
  },
  {
    category: 'Research',
    title: 'Research Question Refiner',
    prompt:
      'Help me refine this broad research idea into a focused, researchable question: [IDEA]. Provide 3 versions: one narrow/quantitative, one broad/qualitative, and one mixed-methods. For each, suggest a potential methodology.',
    uses: 634,
  },
  {
    category: 'Student Engagement',
    title: 'Icebreaker Activity Generator',
    prompt:
      'Create 3 icebreaker activities for the first day of a [COURSE TYPE] course with [CLASS SIZE] students. Each should take 5-10 minutes, relate to the course topic, and help students learn each other\'s names. Include one digital option for hybrid classes.',
    uses: 578,
  },
  {
    category: 'Writing',
    title: 'Email Template for Students',
    prompt:
      'Draft a professional email template I can send to students about [SITUATION]. Tone should be warm but clear, include specific action items, and a deadline. Provide both a "first notice" and "follow-up reminder" version.',
    uses: 445,
  },
  {
    category: 'Analytics',
    title: 'Course Evaluation Summarizer',
    prompt:
      'Summarize these student course evaluation comments into themes. For each theme, provide: the sentiment (positive/negative/mixed), frequency, representative quotes, and one actionable improvement. Comments: [PASTE COMMENTS].',
    uses: 389,
  },
];

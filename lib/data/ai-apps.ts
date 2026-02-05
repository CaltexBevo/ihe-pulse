// ── Interfaces ──────────────────────────────────────────────

export type PricingModel = 'free' | 'freemium' | 'paid';
export type Role = 'faculty' | 'administrator' | 'student';
export type TaskTag =
  | 'Grading'
  | 'Lesson Planning'
  | 'Research'
  | 'Writing Feedback'
  | 'Presentations'
  | 'Content Creation'
  | 'Student Engagement'
  | 'General LLM'
  | 'Video & Media'
  | 'Administration'
  | 'Note-Taking'
  | 'Assessment';

export interface AiApp {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  tasks: TaskTag[];
  roles: Role[];
  pricing: {
    model: PricingModel;
    startingPrice?: string;
    details: string;
  };
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  bestFor: string[];
  integrations: string[];
  platformUrl: string;
  lastUpdated: string;
  verified: boolean;
  staffPick: boolean;
  logoGradient: string;
  logoUrl: string;
}

// ── Filter Constants ────────────────────────────────────────

export const allRoles: { value: Role; label: string }[] = [
  { value: 'faculty', label: "I'm a Faculty Member" },
  { value: 'administrator', label: "I'm an Administrator" },
  { value: 'student', label: "I'm a Student" },
];

export const allTasks: { value: TaskTag; label: string; icon: string }[] = [
  { value: 'Grading', label: 'Grading', icon: 'ClipboardCheck' },
  { value: 'Lesson Planning', label: 'Lesson Planning', icon: 'BookOpen' },
  { value: 'Research', label: 'Research', icon: 'Search' },
  { value: 'Writing Feedback', label: 'Writing Feedback', icon: 'PenLine' },
  { value: 'Presentations', label: 'Presentations', icon: 'Presentation' },
  { value: 'Content Creation', label: 'Content Creation', icon: 'Wand2' },
  { value: 'Student Engagement', label: 'Engagement', icon: 'Users' },
  { value: 'General LLM', label: 'General AI', icon: 'Bot' },
  { value: 'Video & Media', label: 'Video & Media', icon: 'Video' },
  { value: 'Administration', label: 'Admin', icon: 'Settings' },
  { value: 'Note-Taking', label: 'Notes', icon: 'StickyNote' },
  { value: 'Assessment', label: 'Assessment', icon: 'Target' },
];

export const allCategories = [
  'All',
  'General LLMs',
  'Lesson Planning',
  'Grading & Assessment',
  'Research',
  'Writing & Feedback',
  'Presentations',
  'Image & Video',
  'Productivity',
  'Student Tools',
] as const;

// ── App Data ────────────────────────────────────────────────

export const aiApps: AiApp[] = [
  // ── General LLMs ──────────────────────────────────────────
  {
    slug: 'chatgpt',
    name: 'ChatGPT',
    tagline: 'The versatile AI assistant for dialogue and content creation',
    description:
      'ChatGPT by OpenAI is the most widely used large language model, capable of generating text, answering questions, writing code, and assisting with a huge range of educational tasks. The Edu tier adds enterprise-grade security, custom GPTs for departments, and data analytics dashboards designed for institutions.',
    category: 'General LLMs',
    tasks: ['General LLM', 'Lesson Planning', 'Writing Feedback', 'Research', 'Content Creation'],
    roles: ['faculty', 'administrator', 'student'],
    pricing: {
      model: 'freemium',
      startingPrice: '$20/mo',
      details: 'Free tier available. Plus $20/mo. Team $25/user/mo. ChatGPT Edu available for institutions with volume pricing.',
    },
    keyFeatures: [
      'GPT-4o multimodal model (text, image, voice)',
      'Custom GPTs for specific department needs',
      'Code Interpreter for data analysis',
      'DALL-E image generation built in',
      'Web browsing for current information',
      'Canvas for collaborative writing and code',
    ],
    pros: [
      'Largest ecosystem of plugins and GPTs',
      'Strong at creative writing and brainstorming',
      'Edu tier has FERPA compliance options',
      'Most students already familiar with it',
    ],
    cons: [
      'Can hallucinate facts and citations',
      'Free tier has usage limits during peak times',
      'Privacy concerns with training data for free tier',
    ],
    bestFor: [
      'Quick drafts and brainstorming sessions',
      'Creating course materials and lesson plans',
      'Student writing assistance (with guardrails)',
      'Administrative document drafting',
    ],
    integrations: ['Google Workspace', 'Microsoft 365', 'Zapier', 'API access'],
    platformUrl: 'https://chat.openai.com',
    lastUpdated: '2025-12-15',
    verified: true,
    staffPick: true,
    logoGradient: 'from-emerald-400 to-teal-500',
    logoUrl: '/logos/chatgpt.png',
  },
  {
    slug: 'claude',
    name: 'Claude',
    tagline: 'A next-generation AI assistant built for thoughtful analysis',
    description:
      'Claude by Anthropic excels at nuanced, long-form tasks thanks to its industry-leading 200K token context window. It can analyze entire textbooks, research papers, or policy documents in a single conversation. Known for being more cautious and less likely to hallucinate than competitors, it is especially well-suited for academic environments where accuracy matters.',
    category: 'General LLMs',
    tasks: ['General LLM', 'Research', 'Writing Feedback', 'Lesson Planning', 'Content Creation'],
    roles: ['faculty', 'administrator', 'student'],
    pricing: {
      model: 'freemium',
      startingPrice: '$20/mo',
      details: 'Free tier with daily limits. Pro $20/mo with higher limits. Team $25/user/mo. Enterprise with SSO and admin controls.',
    },
    keyFeatures: [
      '200K token context window for long documents',
      'Artifacts for code, documents, and visualizations',
      'Projects for organized research workflows',
      'Strong reasoning and analysis capabilities',
      'Less prone to hallucination than competitors',
      'Computer use and tool integration',
    ],
    pros: [
      'Best-in-class for document analysis and research',
      'More honest about uncertainty',
      'Excellent at following complex instructions',
      'Strong coding and technical writing',
    ],
    cons: [
      'Smaller plugin ecosystem than ChatGPT',
      'No native image generation',
      'Free tier has stricter daily limits',
    ],
    bestFor: [
      'Research paper analysis and literature reviews',
      'Policy document drafting and review',
      'Detailed feedback on student writing',
      'Complex reasoning and problem-solving tasks',
    ],
    integrations: ['API access', 'Google Workspace (via integrations)', 'Zapier'],
    platformUrl: 'https://claude.ai',
    lastUpdated: '2025-12-20',
    verified: true,
    staffPick: true,
    logoGradient: 'from-amber-400 to-orange-500',
    logoUrl: '/logos/claude.png',
  },
  {
    slug: 'gemini',
    name: 'Gemini',
    tagline: "Google's most capable AI model, built to be multimodal",
    description:
      'Google Gemini is deeply integrated into the Google ecosystem, making it a natural fit for institutions already using Google Workspace. It can analyze images, generate text, search the web in real-time, and work directly inside Docs, Sheets, Slides, and Gmail. The Advanced plan includes Gemini in Google Workspace apps for seamless productivity.',
    category: 'General LLMs',
    tasks: ['General LLM', 'Content Creation', 'Research', 'Presentations', 'Administration'],
    roles: ['faculty', 'administrator', 'student'],
    pricing: {
      model: 'freemium',
      startingPrice: '$19.99/mo',
      details: 'Free tier available. Advanced through Google One at $19.99/mo. Education pricing available for institutions.',
    },
    keyFeatures: [
      'Deep Google Workspace integration',
      'Multimodal input (text, images, audio, video)',
      'Real-time web search built in',
      'Works in Docs, Sheets, Slides, Gmail',
      'NotebookLM for research synthesis',
      'Long context window (up to 1M tokens)',
    ],
    pros: [
      'Seamless if your institution uses Google Workspace',
      'Strong multimodal capabilities',
      'NotebookLM is excellent for research',
      'Competitive pricing for education',
    ],
    cons: [
      'Ecosystem lock-in with Google',
      'Advanced features require paid plan',
      'Less consistent than ChatGPT for creative tasks',
    ],
    bestFor: [
      'Institutions already on Google Workspace',
      'Multimodal content analysis',
      'Research synthesis with NotebookLM',
      'Creating presentations and documents',
    ],
    integrations: ['Google Workspace', 'Google Drive', 'YouTube', 'Google Search'],
    platformUrl: 'https://gemini.google.com',
    lastUpdated: '2025-11-30',
    verified: true,
    staffPick: false,
    logoGradient: 'from-blue-400 to-indigo-500',
    logoUrl: '/logos/gemini.png',
  },
  {
    slug: 'perplexity',
    name: 'Perplexity AI',
    tagline: 'The conversational answer engine with cited sources',
    description:
      'Perplexity AI combines the conversational interface of a chatbot with the citation rigor of academic search. Every answer includes inline citations linked to source material, making it ideal for research, fact-checking, and teaching students how to verify AI outputs. The Pro plan adds access to multiple models and file upload for document analysis.',
    category: 'General LLMs',
    tasks: ['Research', 'General LLM', 'Writing Feedback'],
    roles: ['faculty', 'student'],
    pricing: {
      model: 'freemium',
      startingPrice: '$20/mo',
      details: 'Free tier with limited Pro searches. Pro $20/mo with unlimited searches and access to multiple models.',
    },
    keyFeatures: [
      'Inline citations on every answer',
      'Real-time web search with source verification',
      'Multiple model access (GPT-4, Claude, etc.)',
      'Collections for organized research',
      'File upload for document analysis',
      'Focus modes (Academic, Writing, Math, etc.)',
    ],
    pros: [
      'Best citation practices of any AI tool',
      'Great for teaching research verification skills',
      'Academic focus mode filters for scholarly sources',
      'Clean, distraction-free interface',
    ],
    cons: [
      'Less creative than ChatGPT or Claude',
      'Free tier limits Pro searches significantly',
      'Not great for long-form content generation',
    ],
    bestFor: [
      'Quick academic research with citations',
      'Fact-checking and source verification',
      'Teaching students about AI-assisted research',
      'Literature discovery and review',
    ],
    integrations: ['Chrome extension', 'API access', 'iOS/Android apps'],
    platformUrl: 'https://perplexity.ai',
    lastUpdated: '2025-11-15',
    verified: true,
    staffPick: false,
    logoGradient: 'from-sky-400 to-cyan-500',
    logoUrl: '/logos/perplexity.png',
  },
  {
    slug: 'grok',
    name: 'Grok',
    tagline: 'Real-time AI with access to live data from X',
    description:
      'Grok by xAI is integrated into the X (formerly Twitter) platform, giving it access to real-time conversations and trending topics. It takes a more irreverent, conversational tone and is particularly useful for monitoring current events and public discourse around higher education topics.',
    category: 'General LLMs',
    tasks: ['General LLM', 'Research', 'Content Creation'],
    roles: ['faculty', 'administrator'],
    pricing: {
      model: 'paid',
      startingPrice: '$16/mo',
      details: 'Available through X Premium+ subscription at $16/mo. No free tier.',
    },
    keyFeatures: [
      'Real-time access to X/Twitter data',
      'Image generation with Aurora',
      'Conversational and witty tone',
      'Current events analysis',
      'DeepSearch for research queries',
    ],
    pros: [
      'Excellent for current events and trending topics',
      'Real-time data access unique among LLMs',
      'Good image generation built in',
    ],
    cons: [
      'Requires X Premium+ subscription',
      'Less polished than ChatGPT or Claude',
      'Limited academic-specific features',
      'No free tier to evaluate',
    ],
    bestFor: [
      'Monitoring higher ed discourse on social media',
      'Current events analysis for classes',
      'Quick fact-checks against live data',
    ],
    integrations: ['X (Twitter)', 'iOS app'],
    platformUrl: 'https://grok.x.ai',
    lastUpdated: '2025-10-20',
    verified: true,
    staffPick: false,
    logoGradient: 'from-gray-400 to-slate-500',
    logoUrl: '/logos/grok.png',
  },

  // ── Lesson Planning ───────────────────────────────────────
  {
    slug: 'eduaide',
    name: 'Eduaide.Ai',
    tagline: 'An AI-powered workspace to maximize teacher impact',
    description:
      'Eduaide.Ai provides over 100 generative AI tools specifically designed for educators. It can create lesson plans, assessments, rubrics, feedback comments, and differentiated materials in seconds. The platform is built by educators for educators and understands pedagogical frameworks like UDL, Bloom\'s Taxonomy, and Webb\'s Depth of Knowledge.',
    category: 'Lesson Planning',
    tasks: ['Lesson Planning', 'Assessment', 'Writing Feedback', 'Content Creation'],
    roles: ['faculty'],
    pricing: {
      model: 'freemium',
      startingPrice: '$5.99/mo',
      details: 'Free plan with limited generations per day. Pro plan at $5.99/mo with unlimited access. School/district pricing available.',
    },
    keyFeatures: [
      '100+ education-specific AI generators',
      'Lesson plan creator with standards alignment',
      'Assessment and rubric builder',
      'Feedback Bot for student work',
      'Differentiation tools for diverse learners',
      'Content aligned to Bloom\'s Taxonomy and UDL',
    ],
    pros: [
      'Purpose-built for educators, not a generic LLM',
      'Very affordable Pro plan',
      'Understands pedagogical frameworks',
      'Fast, template-driven workflow',
    ],
    cons: [
      'Less flexible than a general-purpose LLM',
      'Limited customization of output format',
      'Smaller user community than major LLMs',
    ],
    bestFor: [
      'Rapid lesson plan generation',
      'Creating standards-aligned assessments',
      'Generating differentiated materials',
      'Quick feedback drafts on student work',
    ],
    integrations: ['Google Docs export', 'PDF export'],
    platformUrl: 'https://eduaide.ai',
    lastUpdated: '2025-08-10',
    verified: true,
    staffPick: true,
    logoGradient: 'from-violet-400 to-purple-500',
    logoUrl: '/logos/eduaide.png',
  },
  {
    slug: 'brisk-teaching',
    name: 'Brisk Teaching',
    tagline: 'Teach smarter, not harder — AI right in your browser',
    description:
      'Brisk Teaching is a Chrome extension that brings AI-powered tools directly into Google Docs, Slides, YouTube, and other web apps teachers already use. With one click, teachers can create curriculum materials, level text for different reading abilities, generate quizzes from content, and provide writing feedback — all without leaving their workflow.',
    category: 'Lesson Planning',
    tasks: ['Lesson Planning', 'Writing Feedback', 'Content Creation', 'Grading'],
    roles: ['faculty'],
    pricing: {
      model: 'freemium',
      details: 'Free for individual teachers with core features. Premium plans for schools and districts with advanced features and admin controls.',
    },
    keyFeatures: [
      'Chrome extension works inside existing tools',
      'One-click curriculum creation from any content',
      'Text leveling for different reading abilities',
      'AI writing feedback for student work',
      'Quiz and assessment generation',
      'Works in Google Docs, Slides, YouTube',
    ],
    pros: [
      'Zero learning curve — works in tools you already use',
      'Free for individual teachers',
      'Fast, contextual AI assistance',
      'Privacy-focused design',
    ],
    cons: [
      'Chrome-only (no Firefox/Safari support)',
      'Requires Google Workspace',
      'Advanced features require school license',
    ],
    bestFor: [
      'Teachers who live in Google Workspace',
      'Quick text leveling and differentiation',
      'Generating quizzes from existing content',
      'In-context writing feedback',
    ],
    integrations: ['Google Workspace', 'YouTube', 'Chrome browser'],
    platformUrl: 'https://briskteaching.com',
    lastUpdated: '2025-08-15',
    verified: true,
    staffPick: false,
    logoGradient: 'from-cyan-400 to-blue-500',
    logoUrl: '/logos/brisk-teaching.png',
  },
  {
    slug: 'curipod',
    name: 'Curipod',
    tagline: 'Spark curiosity in your classroom with AI-powered lessons',
    description:
      'Curipod generates complete, standards-aligned interactive slide decks with embedded student activities like polls, word clouds, open-ended questions, and drawing prompts. Teachers enter a topic and grade level, and Curipod produces a ready-to-teach lesson in minutes. It also provides AI feedback on student responses.',
    category: 'Lesson Planning',
    tasks: ['Lesson Planning', 'Student Engagement', 'Assessment'],
    roles: ['faculty'],
    pricing: {
      model: 'freemium',
      startingPrice: '$90/yr',
      details: 'Free plan with limited slide generation. Premium at ~$90/year with unlimited lessons and features.',
    },
    keyFeatures: [
      'AI-generated interactive slide decks',
      'Standards-aligned lesson creation',
      'Embedded polls, word clouds, and activities',
      'AI feedback on student responses',
      'Drawing and open-ended prompts',
      'Real-time student participation tracking',
    ],
    pros: [
      'Produces complete, ready-to-teach lessons',
      'Interactive elements boost engagement',
      'Standards alignment built in',
      'Very fast — topic to lesson in minutes',
    ],
    cons: [
      'Slide-based format may not suit all teaching styles',
      'Free tier is quite limited',
      'Less customizable than building from scratch',
    ],
    bestFor: [
      'Quick interactive lesson creation',
      'Formative assessment during class',
      'Substitute teacher lesson plans',
      'Student engagement activities',
    ],
    integrations: ['Google Classroom', 'Microsoft Teams', 'Canvas LMS'],
    platformUrl: 'https://curipod.com',
    lastUpdated: '2025-07-20',
    verified: true,
    staffPick: false,
    logoGradient: 'from-pink-400 to-rose-500',
    logoUrl: '/logos/curipod.png',
  },

  // ── Grading & Assessment ──────────────────────────────────
  {
    slug: 'gradescope',
    name: 'Gradescope',
    tagline: 'AI-assisted grading that saves hours every week',
    description:
      'Gradescope uses AI to streamline grading of exams, homework, and projects. Instructors create rubrics, and the AI groups similar answers together so you can grade by question across the entire class. It supports handwritten work via OCR, code autograding, and detailed analytics on student performance patterns.',
    category: 'Grading & Assessment',
    tasks: ['Grading', 'Assessment', 'Administration'],
    roles: ['faculty', 'administrator'],
    pricing: {
      model: 'freemium',
      details: 'Free basic tier for individual instructors. Institutional licensing through Turnitin (parent company) for full features including LMS integration.',
    },
    keyFeatures: [
      'AI-assisted answer grouping for batch grading',
      'Handwritten work recognition (OCR)',
      'Code autograding for CS courses',
      'Rubric-based evaluation system',
      'Detailed analytics on student performance',
      'Regrade request management',
    ],
    pros: [
      'Dramatically reduces grading time',
      'Works with handwritten and typed submissions',
      'Strong analytics for identifying struggling students',
      'Rubric consistency across large sections',
    ],
    cons: [
      'Learning curve for initial setup',
      'Full features require institutional license',
      'OCR can struggle with messy handwriting',
    ],
    bestFor: [
      'Large-section courses with many submissions',
      'STEM courses with problem-based assessments',
      'Maintaining grading consistency across TAs',
      'Identifying patterns in student performance',
    ],
    integrations: ['Canvas', 'Blackboard', 'Sakai', 'Brightspace', 'Moodle'],
    platformUrl: 'https://gradescope.com',
    lastUpdated: '2025-09-10',
    verified: true,
    staffPick: false,
    logoGradient: 'from-purple-400 to-indigo-500',
    logoUrl: '/logos/gradescope.png',
  },
  {
    slug: 'turnitin',
    name: 'Turnitin',
    tagline: 'Academic integrity and AI writing detection platform',
    description:
      'Turnitin is the industry-standard platform for plagiarism detection, now with AI writing detection capabilities. It identifies text likely generated by AI tools and provides similarity reports against a massive database of academic papers, websites, and student submissions. The Feedback Studio includes inline commenting and QuickMark rubrics.',
    category: 'Grading & Assessment',
    tasks: ['Grading', 'Writing Feedback', 'Assessment'],
    roles: ['faculty', 'administrator'],
    pricing: {
      model: 'paid',
      details: 'Institutional licensing only. Contact for pricing. Typically bundled with Gradescope and iThenticate.',
    },
    keyFeatures: [
      'AI writing detection indicator',
      'Similarity checking against 100B+ sources',
      'Feedback Studio with inline comments',
      'QuickMark rubrics for consistent evaluation',
      'Draft Coach for student self-checking',
      'Originality reports with source matching',
    ],
    pros: [
      'Industry standard — widely trusted by institutions',
      'AI detection improving with each update',
      'Comprehensive similarity database',
      'Integrates with all major LMS platforms',
    ],
    cons: [
      'AI detection has false positive concerns',
      'Expensive for smaller institutions',
      'Students find it punitive rather than educational',
      'No free tier for evaluation',
    ],
    bestFor: [
      'Institutional academic integrity programs',
      'Writing-heavy courses',
      'Detecting AI-generated submissions',
      'Providing structured writing feedback',
    ],
    integrations: ['Canvas', 'Blackboard', 'Moodle', 'Brightspace', 'Google Classroom'],
    platformUrl: 'https://turnitin.com',
    lastUpdated: '2025-10-01',
    verified: true,
    staffPick: false,
    logoGradient: 'from-red-400 to-rose-500',
    logoUrl: '/logos/turnitin.png',
  },

  // ── Research ──────────────────────────────────────────────
  {
    slug: 'consensus',
    name: 'Consensus',
    tagline: 'AI-powered search engine for peer-reviewed research',
    description:
      'Consensus searches through over 200 million peer-reviewed papers to find and synthesize answers to research questions. It uses AI to extract key findings and present them with links to the original papers. The Consensus Meter shows the balance of evidence for or against a claim, making it a powerful tool for evidence-based decision-making.',
    category: 'Research',
    tasks: ['Research'],
    roles: ['faculty', 'student'],
    pricing: {
      model: 'freemium',
      startingPrice: '$6.99/mo',
      details: 'Free tier with limited searches. Premium $6.99/mo with unlimited searches, GPT-4 summaries, and bookmarks.',
    },
    keyFeatures: [
      'Search 200M+ peer-reviewed papers',
      'AI-synthesized answers from research',
      'Consensus Meter shows evidence balance',
      'Paper summaries and key findings extraction',
      'Bookmark and organize research',
      'Citation export in multiple formats',
    ],
    pros: [
      'Only searches peer-reviewed sources',
      'Consensus Meter unique and useful',
      'Faster than manual literature searches',
      'Good for evidence-based practice',
    ],
    cons: [
      'Limited to indexed papers (not all journals)',
      'Summaries can oversimplify nuanced findings',
      'No full-text access (links to sources)',
    ],
    bestFor: [
      'Quick evidence checks for lectures',
      'Literature review starting points',
      'Teaching evidence-based reasoning',
      'Faculty research support',
    ],
    integrations: ['Chrome extension', 'API access'],
    platformUrl: 'https://consensus.app',
    lastUpdated: '2025-09-20',
    verified: true,
    staffPick: false,
    logoGradient: 'from-blue-400 to-cyan-500',
    logoUrl: '/logos/consensus.png',
  },
  {
    slug: 'elicit',
    name: 'Elicit',
    tagline: 'Automate your literature review with AI research assistance',
    description:
      'Elicit helps researchers find relevant papers, extract key data points, and synthesize findings across multiple studies. It goes beyond simple search by letting you define columns of information to extract from each paper (methods, sample size, findings, etc.) and building structured comparison tables automatically.',
    category: 'Research',
    tasks: ['Research'],
    roles: ['faculty', 'student'],
    pricing: {
      model: 'freemium',
      startingPrice: '$10/mo',
      details: 'Free tier with limited paper analysis. Plus $10/mo. Enterprise pricing for institutions.',
    },
    keyFeatures: [
      'Automated literature review workflows',
      'Custom data extraction from papers',
      'Structured comparison tables',
      'Semantic search across papers',
      'Study quality assessment',
      'Citation management and export',
    ],
    pros: [
      'Structured data extraction is a game-changer',
      'Builds comparison tables automatically',
      'Great for systematic reviews',
      'Saves significant research time',
    ],
    cons: [
      'Learning curve to set up extraction columns',
      'Free tier quite limited',
      'Better for quantitative than qualitative research',
    ],
    bestFor: [
      'Systematic literature reviews',
      'Graduate student research projects',
      'Faculty tenure and promotion evidence gathering',
      'Cross-study comparison and synthesis',
    ],
    integrations: ['Zotero', 'Citation export'],
    platformUrl: 'https://elicit.com',
    lastUpdated: '2025-08-25',
    verified: true,
    staffPick: false,
    logoGradient: 'from-amber-400 to-yellow-500',
    logoUrl: '/logos/elicit.png',
  },

  // ── Writing & Feedback ────────────────────────────────────
  {
    slug: 'grammarly',
    name: 'Grammarly',
    tagline: 'AI writing assistant with institution-wide analytics',
    description:
      'Grammarly goes beyond spell-check to provide AI-powered writing suggestions for clarity, tone, engagement, and delivery. The EDU plan adds plagiarism detection, citation support, organization-wide analytics, and FERPA-compliant data handling. It works across all browsers, email clients, and writing apps.',
    category: 'Writing & Feedback',
    tasks: ['Writing Feedback', 'Student Engagement'],
    roles: ['faculty', 'administrator', 'student'],
    pricing: {
      model: 'freemium',
      startingPrice: '$12/mo',
      details: 'Free basic plan. Premium $12/mo individual. Grammarly for Education with institutional pricing and admin controls.',
    },
    keyFeatures: [
      'Real-time writing suggestions across apps',
      'Tone detection and adjustment',
      'Plagiarism detection',
      'Citation style formatting',
      'Organization-wide analytics dashboard',
      'Custom style guides for your institution',
    ],
    pros: [
      'Works everywhere students write',
      'Helps non-native English speakers significantly',
      'Institution-wide deployment options',
      'FERPA compliance for EDU plan',
    ],
    cons: [
      'Can over-correct creative writing',
      'Premium features needed for full value',
      'May create dependency rather than learning',
    ],
    bestFor: [
      'Writing-across-the-curriculum programs',
      'ESL/ELL student support',
      'Institution-wide writing quality improvement',
      'Faculty and staff communication quality',
    ],
    integrations: ['Google Workspace', 'Microsoft 365', 'Canvas', 'All browsers'],
    platformUrl: 'https://grammarly.com/edu',
    lastUpdated: '2025-11-01',
    verified: true,
    staffPick: false,
    logoGradient: 'from-emerald-400 to-green-500',
    logoUrl: '/logos/grammarly.png',
  },

  // ── Presentations ─────────────────────────────────────────
  {
    slug: 'gamma',
    name: 'Gamma',
    tagline: 'A new medium for presenting ideas, powered by AI',
    description:
      'Gamma generates polished presentations, documents, and web pages from simple text prompts or existing content. Unlike traditional slide tools, Gamma creates interactive card-based layouts that work beautifully on any device. It supports embedding videos, charts, and interactive elements directly into the presentation.',
    category: 'Presentations',
    tasks: ['Presentations', 'Content Creation'],
    roles: ['faculty', 'student'],
    pricing: {
      model: 'freemium',
      startingPrice: '$10/mo',
      details: 'Free tier with Gamma branding. Plus $10/mo. Pro $20/mo with unlimited AI and custom branding.',
    },
    keyFeatures: [
      'AI-generated presentations from text prompts',
      'Interactive card-based layout',
      'Responsive design for any device',
      'Embed videos, charts, and web content',
      'Import and enhance existing presentations',
      'Real-time collaboration',
    ],
    pros: [
      'Much faster than building in PowerPoint',
      'Card-based design looks modern and professional',
      'Interactive elements boost engagement',
      'Great on mobile devices',
    ],
    cons: [
      'Less design control than traditional tools',
      'Free tier includes Gamma branding',
      'Export to PowerPoint can lose formatting',
    ],
    bestFor: [
      'Quick lecture slide creation',
      'Student presentation projects',
      'Conference talk preparation',
      'Interactive course materials',
    ],
    integrations: ['Google Drive', 'PowerPoint export', 'PDF export', 'Web embedding'],
    platformUrl: 'https://gamma.app',
    lastUpdated: '2025-09-15',
    verified: true,
    staffPick: false,
    logoGradient: 'from-fuchsia-400 to-pink-500',
    logoUrl: '/logos/gamma.png',
  },
  {
    slug: 'mentimeter',
    name: 'Mentimeter',
    tagline: 'Make your audience feel heard with interactive presentations',
    description:
      'Mentimeter turns passive lectures into interactive experiences with live polls, quizzes, Q&A sessions, and word clouds that students participate in from their phones. The AI Menti Builder can generate entire interactive presentations from a topic description, including engagement activities and assessment questions.',
    category: 'Presentations',
    tasks: ['Presentations', 'Student Engagement', 'Assessment'],
    roles: ['faculty'],
    pricing: {
      model: 'freemium',
      startingPrice: '$12/mo',
      details: 'Free tier with limited questions per presentation. Pro $12/mo. Enterprise/Education pricing available.',
    },
    keyFeatures: [
      'Live polls, quizzes, and word clouds',
      'AI Menti Builder for presentation generation',
      'Real-time audience participation',
      'Anonymous Q&A mode',
      'Engagement analytics and reports',
      'Integration with existing slide decks',
    ],
    pros: [
      'Instantly boosts classroom engagement',
      'Anonymous mode encourages shy students',
      'Works on any device — no app install needed',
      'AI builder saves significant prep time',
    ],
    cons: [
      'Free tier very limited (2 question slides)',
      'Requires reliable internet for all students',
      'Can feel gimmicky if overused',
    ],
    bestFor: [
      'Large lecture engagement',
      'Formative assessment during class',
      'Conference presentations',
      'Gathering student feedback anonymously',
    ],
    integrations: ['PowerPoint', 'Google Slides', 'Microsoft Teams', 'Zoom', 'LTI (Canvas, Blackboard)'],
    platformUrl: 'https://mentimeter.com',
    lastUpdated: '2025-08-30',
    verified: true,
    staffPick: false,
    logoGradient: 'from-sky-400 to-blue-500',
    logoUrl: '/logos/mentimeter.png',
  },
  {
    slug: 'slidesgo',
    name: 'Slidesgo',
    tagline: 'Stunning presentation templates with AI generation',
    description:
      'Slidesgo offers thousands of professionally designed presentation templates for Google Slides and PowerPoint, plus an AI presentation maker that generates complete slide decks from a text prompt. Templates span education themes, infographics, thesis presentations, and more. Part of the Freepik ecosystem.',
    category: 'Presentations',
    tasks: ['Presentations', 'Content Creation'],
    roles: ['faculty', 'student'],
    pricing: {
      model: 'freemium',
      startingPrice: '$4/mo',
      details: 'Free templates with attribution. Premium $4-6/mo for all templates without attribution.',
    },
    keyFeatures: [
      'Thousands of free presentation templates',
      'AI presentation maker from prompts',
      'Google Slides and PowerPoint compatible',
      'Education-specific template categories',
      'Infographic and data visualization templates',
      'Customizable themes and color schemes',
    ],
    pros: [
      'Huge free template library',
      'Very affordable premium tier',
      'Education-specific designs',
      'Works with tools students already know',
    ],
    cons: [
      'Free templates require attribution',
      'AI generator less sophisticated than Gamma',
      'Can lead to "template fatigue" if overused',
    ],
    bestFor: [
      'Quick professional-looking course slides',
      'Student presentation projects',
      'Conference posters and infographics',
      'Thesis defense presentations',
    ],
    integrations: ['Google Slides', 'PowerPoint', 'Canva'],
    platformUrl: 'https://slidesgo.com',
    lastUpdated: '2025-07-15',
    verified: true,
    staffPick: false,
    logoGradient: 'from-yellow-400 to-orange-500',
    logoUrl: '/logos/slidesgo.png',
  },

  // ── Image & Video ─────────────────────────────────────────
  {
    slug: 'midjourney',
    name: 'Midjourney',
    tagline: 'Advancing creativity with high-quality AI image generation',
    description:
      'Midjourney produces the highest-quality AI-generated images available, with a distinctive aesthetic that leans photorealistic or painterly depending on prompts. Accessed through Discord or a new web editor, it excels at creating visual aids, conceptual illustrations, and educational graphics that would otherwise require a professional designer.',
    category: 'Image & Video',
    tasks: ['Content Creation', 'Video & Media'],
    roles: ['faculty', 'administrator'],
    pricing: {
      model: 'paid',
      startingPrice: '$10/mo',
      details: 'Basic $10/mo. Standard $30/mo. Pro $60/mo. No free tier.',
    },
    keyFeatures: [
      'Industry-leading image quality',
      'Web editor and Discord interface',
      'Style reference and consistency features',
      'Upscaling and variation tools',
      'Pan, zoom, and extend capabilities',
      'Describe mode for reverse-engineering prompts',
    ],
    pros: [
      'Highest quality AI images available',
      'Great for educational illustrations',
      'Active community sharing techniques',
      'Improving rapidly with each version',
    ],
    cons: [
      'No free tier to evaluate',
      'Discord interface has learning curve',
      'Copyright and usage concerns in academia',
      'Limited text rendering in images',
    ],
    bestFor: [
      'Creating visual aids for lectures',
      'Marketing materials for programs',
      'Conceptual illustrations for complex topics',
      'Course thumbnail and banner graphics',
    ],
    integrations: ['Discord', 'Web editor', 'API access'],
    platformUrl: 'https://midjourney.com',
    lastUpdated: '2025-10-10',
    verified: true,
    staffPick: false,
    logoGradient: 'from-indigo-400 to-violet-500',
    logoUrl: '/logos/midjourney.png',
  },
  {
    slug: 'synthesia',
    name: 'Synthesia',
    tagline: 'Create professional AI avatar videos in minutes',
    description:
      'Synthesia creates professional videos featuring AI avatars that speak any script in over 140 languages. No camera, studio, or actors needed. Ideal for creating training videos, lecture supplements, course introductions, and multilingual content. The platform offers 230+ diverse avatars or custom avatar creation.',
    category: 'Image & Video',
    tasks: ['Video & Media', 'Content Creation'],
    roles: ['faculty', 'administrator'],
    pricing: {
      model: 'paid',
      startingPrice: '$30/mo',
      details: 'Personal $30/mo (5 videos). Enterprise with custom pricing for institutions.',
    },
    keyFeatures: [
      '230+ diverse AI avatars',
      '140+ language support',
      'Custom avatar creation from video upload',
      'Screen recording integration',
      'Template library for education',
      'Brand kit customization',
    ],
    pros: [
      'No filming or editing skills needed',
      'Multilingual content without translators',
      'Consistent, professional quality',
      'Great for asynchronous course content',
    ],
    cons: [
      'Avatars can feel uncanny to some viewers',
      'Expensive for individual instructors',
      'Limited free tier for evaluation',
      'Lip sync not perfect in all languages',
    ],
    bestFor: [
      'Multilingual training materials',
      'Asynchronous lecture supplements',
      'Faculty development modules',
      'Course introduction videos',
    ],
    integrations: ['LMS embed', 'YouTube', 'Vimeo', 'PowerPoint embed'],
    platformUrl: 'https://synthesia.io',
    lastUpdated: '2025-09-05',
    verified: true,
    staffPick: false,
    logoGradient: 'from-pink-400 to-purple-500',
    logoUrl: '/logos/synthesia.png',
  },
  {
    slug: 'canva',
    name: 'Canva',
    tagline: 'AI-enhanced design platform for everyone',
    description:
      'Canva democratizes design with drag-and-drop tools now supercharged with AI features including Magic Write for text generation, Magic Design for instant layouts, Background Remover, and text-to-image generation. Canva for Education is completely free for K-12 and higher ed institutions, making it the most accessible design tool available.',
    category: 'Image & Video',
    tasks: ['Content Creation', 'Presentations', 'Video & Media'],
    roles: ['faculty', 'administrator', 'student'],
    pricing: {
      model: 'freemium',
      details: 'Canva for Education is FREE for verified educational institutions. Pro $13/mo for individuals. Teams $10/user/mo.',
    },
    keyFeatures: [
      'Magic Write AI text generation',
      'Magic Design instant layouts',
      'Text-to-image AI generation',
      'Background Remover tool',
      'Video editor with AI features',
      'Brand Kit for institutional consistency',
    ],
    pros: [
      'FREE for Education — best value in the market',
      'Extremely intuitive for non-designers',
      'Massive template library',
      'Real-time collaboration',
    ],
    cons: [
      'Design quality ceiling lower than Adobe',
      'Can lead to generic-looking materials',
      'Advanced features occasionally laggy',
    ],
    bestFor: [
      'Course material design (all levels)',
      'Social media graphics for departments',
      'Student projects and portfolios',
      'Infographics and visual summaries',
    ],
    integrations: ['Google Drive', 'Google Classroom', 'Microsoft Teams', 'LMS embedding'],
    platformUrl: 'https://canva.com/education',
    lastUpdated: '2025-11-20',
    verified: true,
    staffPick: true,
    logoGradient: 'from-teal-400 to-cyan-500',
    logoUrl: '/logos/canva.png',
  },
  {
    slug: 'descript',
    name: 'Descript',
    tagline: 'Edit video and podcasts as easily as editing a document',
    description:
      'Descript transforms video and audio editing by letting you edit media by editing text. Record or upload content, and Descript transcribes it — then you edit the transcript to edit the video. AI features include filler word removal, eye contact correction, studio sound enhancement, and AI voiceover cloning.',
    category: 'Image & Video',
    tasks: ['Video & Media', 'Content Creation'],
    roles: ['faculty', 'administrator'],
    pricing: {
      model: 'freemium',
      startingPrice: '$24/mo',
      details: 'Free tier with limited exports. Hobbyist $24/mo. Pro $33/mo. Enterprise pricing available.',
    },
    keyFeatures: [
      'Text-based video and audio editing',
      'AI transcription with speaker detection',
      'Filler word removal (um, uh, like)',
      'Eye contact correction',
      'AI voiceover and voice cloning',
      'Screen recording with webcam overlay',
    ],
    pros: [
      'Revolutionary text-based editing paradigm',
      'Filler word removal is a game-changer',
      'Great for lecture recording post-production',
      'Handles both audio and video',
    ],
    cons: [
      'Free tier very limited',
      'Processing can be slow for long recordings',
      'Voice cloning raises ethical questions',
    ],
    bestFor: [
      'Lecture recording cleanup and editing',
      'Podcast production for academic content',
      'Creating polished instructional videos',
      'Transcription and captioning',
    ],
    integrations: ['YouTube', 'Vimeo', 'Google Drive', 'Dropbox'],
    platformUrl: 'https://descript.com',
    lastUpdated: '2025-10-15',
    verified: true,
    staffPick: false,
    logoGradient: 'from-lime-400 to-emerald-500',
    logoUrl: '/logos/descript.png',
  },

  // ── Productivity ──────────────────────────────────────────
  {
    slug: 'notion-ai',
    name: 'Notion AI',
    tagline: 'AI-integrated workspace for notes, docs, and knowledge management',
    description:
      'Notion AI enhances the already-powerful Notion workspace with AI writing, summarization, and analysis capabilities. It can draft meeting notes, summarize long documents, generate action items, translate content, and answer questions about your workspace. Popular with academic departments for knowledge management, meeting documentation, and project coordination.',
    category: 'Productivity',
    tasks: ['Administration', 'Note-Taking', 'Content Creation'],
    roles: ['faculty', 'administrator'],
    pricing: {
      model: 'freemium',
      startingPrice: '$10/mo',
      details: 'Free plan for individuals. Plus $10/mo. Business $18/mo. AI add-on $10/member/mo. Education discounts available.',
    },
    keyFeatures: [
      'AI writing and editing within docs',
      'Document summarization',
      'Meeting notes with action items',
      'Database and knowledge management',
      'Project and task tracking',
      'Wiki-style team documentation',
    ],
    pros: [
      'All-in-one workspace — notes, projects, wiki',
      'AI feels natural in existing workflow',
      'Great for department knowledge management',
      'Flexible enough for any use case',
    ],
    cons: [
      'AI is an additional cost on top of plan',
      'Can be overwhelming for simple needs',
      'Learning curve for database features',
    ],
    bestFor: [
      'Department documentation and knowledge bases',
      'Committee meeting management',
      'Research project coordination',
      'Personal productivity for academics',
    ],
    integrations: ['Google Drive', 'Slack', 'GitHub', 'Zapier', 'Calendar apps'],
    platformUrl: 'https://notion.so',
    lastUpdated: '2025-11-10',
    verified: true,
    staffPick: false,
    logoGradient: 'from-stone-400 to-gray-500',
    logoUrl: '/logos/notion-ai.png',
  },
  {
    slug: 'otter',
    name: 'Otter.ai',
    tagline: 'Real-time meeting transcription and AI notes',
    description:
      'Otter.ai provides real-time transcription for meetings, lectures, and interviews with AI-generated summaries and action items. It can join Zoom, Teams, and Google Meet calls automatically, transcribe in real-time, and produce searchable, shareable notes. OtterPilot can even auto-generate follow-up emails from meeting content.',
    category: 'Productivity',
    tasks: ['Note-Taking', 'Administration'],
    roles: ['faculty', 'administrator'],
    pricing: {
      model: 'freemium',
      startingPrice: '$10/mo',
      details: 'Free tier with 300 minutes/month. Pro $10/mo. Business $20/user/mo. Enterprise pricing available.',
    },
    keyFeatures: [
      'Real-time meeting transcription',
      'AI-generated summaries and action items',
      'Auto-joins Zoom, Teams, Google Meet',
      'Speaker identification',
      'Searchable transcript archive',
      'OtterPilot automated follow-ups',
    ],
    pros: [
      'Excellent transcription accuracy',
      'Auto-join saves setup hassle',
      'Searchable archive invaluable for reference',
      'Free tier is genuinely useful',
    ],
    cons: [
      'Accuracy drops with heavy accents',
      'Privacy concerns with recording meetings',
      'Free tier minutes limit reached quickly',
    ],
    bestFor: [
      'Faculty committee meeting documentation',
      'Lecture transcription for accessibility',
      'Interview transcription for research',
      'Administrative meeting records',
    ],
    integrations: ['Zoom', 'Microsoft Teams', 'Google Meet', 'Salesforce', 'HubSpot'],
    platformUrl: 'https://otter.ai',
    lastUpdated: '2025-10-25',
    verified: true,
    staffPick: false,
    logoGradient: 'from-blue-400 to-indigo-500',
    logoUrl: '/logos/otter.png',
  },
  {
    slug: 'copilot',
    name: 'Copilot for Microsoft 365',
    tagline: 'AI assistant across Word, Excel, PowerPoint, and Teams',
    description:
      'Microsoft Copilot integrates AI directly into the Microsoft 365 apps that many institutions already use. It can draft documents in Word, analyze data and create charts in Excel, generate presentations in PowerPoint, summarize Teams meetings, and manage email in Outlook. For institutions on Microsoft 365, it is the lowest-friction AI deployment option.',
    category: 'Productivity',
    tasks: ['Administration', 'Presentations', 'Content Creation', 'Note-Taking'],
    roles: ['faculty', 'administrator'],
    pricing: {
      model: 'paid',
      startingPrice: '$30/user/mo',
      details: 'Copilot for Microsoft 365 at $30/user/mo. Requires Microsoft 365 E3/E5 or Business Standard/Premium license. Education pricing may vary.',
    },
    keyFeatures: [
      'AI in Word, Excel, PowerPoint, Outlook, Teams',
      'Draft documents from prompts in Word',
      'Data analysis and chart creation in Excel',
      'Presentation generation in PowerPoint',
      'Meeting summaries in Teams',
      'Email drafting and management in Outlook',
    ],
    pros: [
      'Works in tools your institution already pays for',
      'No new app to learn — same Microsoft interface',
      'Enterprise-grade security and compliance',
      'Strong for administrative productivity',
    ],
    cons: [
      'Expensive per-user cost',
      'Requires M365 enterprise license as prerequisite',
      'AI quality inconsistent across apps',
      'PowerPoint generation still behind Gamma/Canva',
    ],
    bestFor: [
      'Institutions fully invested in Microsoft ecosystem',
      'Administrative productivity improvement',
      'Meeting management and follow-up',
      'Report and document generation',
    ],
    integrations: ['Microsoft 365 suite', 'SharePoint', 'OneDrive', 'Microsoft Teams'],
    platformUrl: 'https://microsoft.com/microsoft-365/copilot',
    lastUpdated: '2025-12-01',
    verified: true,
    staffPick: false,
    logoGradient: 'from-sky-400 to-blue-500',
    logoUrl: '/logos/copilot.png',
  },

  // ── Student Tools ─────────────────────────────────────────
  {
    slug: 'quizlet',
    name: 'Quizlet',
    tagline: 'AI-powered study platform with adaptive learning',
    description:
      'Quizlet has evolved from a simple flashcard app into an AI-powered study platform. Q-Chat acts as a personal tutor, adapting to each student\'s knowledge gaps. Magic Notes creates study materials from uploaded class notes or textbook photos. The platform supports 500+ million user-created study sets across every academic discipline.',
    category: 'Student Tools',
    tasks: ['Student Engagement', 'Assessment'],
    roles: ['student', 'faculty'],
    pricing: {
      model: 'freemium',
      startingPrice: '$8/mo',
      details: 'Free tier with basic flashcards. Quizlet Plus $8/mo with AI features. Teacher plans available.',
    },
    keyFeatures: [
      'Q-Chat AI personal tutor',
      'Magic Notes from uploaded content',
      'Adaptive study paths',
      '500M+ existing study sets',
      'Learn, Test, and Match study modes',
      'Classroom activity modes (Quizlet Live)',
    ],
    pros: [
      'Students already know and use it',
      'Massive existing content library',
      'AI tutor adapts to knowledge gaps',
      'Quizlet Live great for class engagement',
    ],
    cons: [
      'AI features require paid plan',
      'User-generated content can have errors',
      'Over-reliance on flashcards may not suit all subjects',
    ],
    bestFor: [
      'Vocabulary and terminology-heavy courses',
      'Student self-study and review',
      'In-class review games',
      'Quick formative assessment',
    ],
    integrations: ['Google Classroom', 'Canvas', 'iOS/Android apps'],
    platformUrl: 'https://quizlet.com',
    lastUpdated: '2025-09-25',
    verified: true,
    staffPick: false,
    logoGradient: 'from-indigo-400 to-blue-500',
    logoUrl: '/logos/quizlet.png',
  },

  // ── Additional tools from WordPress ───────────────────────
  {
    slug: 'disco',
    name: 'Disco AI',
    tagline: 'The AI-first platform for learning communities',
    description:
      'Disco AI is a modern learning platform that combines community building with AI-powered curriculum generation. It can automatically create course content from existing materials (documents, videos, URLs), generate discussion prompts, and adapt learning paths. Popular with professional development programs and corporate training at universities.',
    category: 'Lesson Planning',
    tasks: ['Lesson Planning', 'Student Engagement', 'Content Creation'],
    roles: ['faculty', 'administrator'],
    pricing: {
      model: 'paid',
      details: 'Custom enterprise pricing. Contact for education institution rates. Free trial available.',
    },
    keyFeatures: [
      'AI curriculum generation from existing content',
      'Community-based learning environment',
      'Automated discussion and engagement prompts',
      'Progress tracking and analytics',
      'White-label branding options',
      'Integration with Zoom for live sessions',
    ],
    pros: [
      'Excellent for cohort-based programs',
      'AI content generation from uploads',
      'Modern, attractive interface',
      'Strong community features',
    ],
    cons: [
      'No transparent pricing (sales-driven)',
      'Overkill for simple course delivery',
      'Less established than traditional LMS',
    ],
    bestFor: [
      'Executive education programs',
      'Faculty development cohorts',
      'Professional certificate programs',
      'Community-driven learning initiatives',
    ],
    integrations: ['Zoom', 'Slack', 'Zapier', 'Stripe'],
    platformUrl: 'https://disco.co',
    lastUpdated: '2025-08-01',
    verified: true,
    staffPick: false,
    logoGradient: 'from-violet-400 to-fuchsia-500',
    logoUrl: '/logos/disco.png',
  },
  {
    slug: 'runwayml',
    name: 'RunwayML',
    tagline: 'The next frontier of AI-powered video creation',
    description:
      'RunwayML offers a comprehensive suite of AI video tools including Gen-3 Alpha for text-to-video, image-to-video transformation, motion brush for animating still images, and advanced video editing features. It is at the forefront of generative AI video and is used by filmmakers, marketers, and increasingly by educators creating visual content.',
    category: 'Image & Video',
    tasks: ['Video & Media', 'Content Creation'],
    roles: ['faculty', 'administrator'],
    pricing: {
      model: 'freemium',
      startingPrice: '$15/mo',
      details: 'Free tier with limited credits. Standard $15/mo. Pro $35/mo. Enterprise pricing available.',
    },
    keyFeatures: [
      'Gen-3 Alpha text-to-video generation',
      'Image-to-video animation',
      'Motion Brush for selective animation',
      'Background removal and replacement',
      'Video upscaling and enhancement',
      'Green screen without a green screen',
    ],
    pros: [
      'Most advanced AI video generation available',
      'Creative flexibility with multiple tools',
      'Free tier allows experimentation',
      'Rapid improvement with each model version',
    ],
    cons: [
      'Generated video still has artifacts',
      'Credits consumed quickly on free tier',
      'Steep learning curve for advanced features',
    ],
    bestFor: [
      'Creating visual explanations for complex topics',
      'Animating diagrams and concepts',
      'Marketing and recruitment videos',
      'Experimental digital media courses',
    ],
    integrations: ['API access', 'Web-based editor'],
    platformUrl: 'https://runwayml.com',
    lastUpdated: '2025-10-05',
    verified: true,
    staffPick: false,
    logoGradient: 'from-cyan-400 to-purple-500',
    logoUrl: '/logos/runwayml.png',
  },
  {
    slug: 'pika',
    name: 'Pika Labs',
    tagline: 'Put your imagination in motion with AI video',
    description:
      'Pika Labs makes AI video generation accessible with a simple interface for creating short videos from text prompts or images. While less feature-rich than RunwayML, it is more approachable for educators who just want to quickly generate a visual clip to illustrate a concept without learning complex tools.',
    category: 'Image & Video',
    tasks: ['Video & Media', 'Content Creation'],
    roles: ['faculty', 'student'],
    pricing: {
      model: 'freemium',
      startingPrice: '$8/mo',
      details: 'Free tier with limited generations. Standard $8/mo. Pro $28/mo.',
    },
    keyFeatures: [
      'Text-to-video generation',
      'Image-to-video animation',
      'Lip sync and character animation',
      'Simple, approachable interface',
      'Modify specific regions of video',
      'Sound effects generation',
    ],
    pros: [
      'Very easy to get started',
      'Affordable pricing',
      'Quick generation times',
      'Fun for student projects',
    ],
    cons: [
      'Lower quality than Midjourney/RunwayML',
      'Short clip duration limits',
      'Less control over output',
    ],
    bestFor: [
      'Quick concept visualization',
      'Student creative projects',
      'Social media content for departments',
      'Animating educational diagrams',
    ],
    integrations: ['Web-based', 'Discord'],
    platformUrl: 'https://pika.art',
    lastUpdated: '2025-08-20',
    verified: true,
    staffPick: false,
    logoGradient: 'from-orange-400 to-red-500',
    logoUrl: '/logos/pika.png',
  },
  {
    slug: 'teachfloor',
    name: 'Teachfloor',
    tagline: 'The all-in-one platform for collaborative learning',
    description:
      'Teachfloor combines an LMS with collaborative learning features including peer review, group projects, live Zoom sessions, and AI-assisted content creation. It is designed for cohort-based learning programs where interaction between participants is as important as the content itself.',
    category: 'Lesson Planning',
    tasks: ['Lesson Planning', 'Student Engagement', 'Administration'],
    roles: ['faculty', 'administrator'],
    pricing: {
      model: 'paid',
      startingPrice: '$99/mo',
      details: 'Pro plan starts at $99/mo. Business and Enterprise plans available with additional features.',
    },
    keyFeatures: [
      'Cohort-based course delivery',
      'Built-in peer review system',
      'Live Zoom session integration',
      'AI-assisted content creation',
      'Group project management',
      'Progress analytics and reporting',
    ],
    pros: [
      'Purpose-built for collaborative learning',
      'Peer review features are well-designed',
      'Zoom integration is seamless',
      'Good analytics dashboard',
    ],
    cons: [
      'Expensive for individual instructors',
      'Overkill for simple self-paced courses',
      'Smaller user community than major LMS',
    ],
    bestFor: [
      'Cohort-based certificate programs',
      'Professional development courses',
      'Programs emphasizing peer learning',
      'Executive education and workshops',
    ],
    integrations: ['Zoom', 'Stripe', 'Zapier', 'Slack'],
    platformUrl: 'https://teachfloor.com',
    lastUpdated: '2025-07-10',
    verified: true,
    staffPick: false,
    logoGradient: 'from-green-400 to-teal-500',
    logoUrl: '/logos/teachfloor.png',
  },
];

// ── Helpers ─────────────────────────────────────────────────

export function getAppBySlug(slug: string): AiApp | undefined {
  return aiApps.find((app) => app.slug === slug);
}

export function getStaffPicks(): AiApp[] {
  return aiApps.filter((app) => app.staffPick);
}

export function filterApps({
  role,
  task,
  category,
  search,
}: {
  role?: Role;
  task?: TaskTag;
  category?: string;
  search?: string;
}): AiApp[] {
  return aiApps.filter((app) => {
    if (role && !app.roles.includes(role)) return false;
    if (task && !app.tasks.includes(task)) return false;
    if (category && category !== 'All' && app.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        app.name.toLowerCase().includes(q) ||
        app.tagline.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q)
      );
    }
    return true;
  });
}

// ── Category Color Mapping ──────────────────────────────────

export interface CategoryColors {
  bg: string;       // Background class for icon container
  text: string;     // Text color class for category labels
  gradient: string; // Gradient for icon backgrounds
}

const categoryColorMap: Record<string, CategoryColors> = {
  'General LLMs': {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-400',
    gradient: 'from-cyan-500/30 to-teal-500/30',
  },
  'Lesson Planning': {
    bg: 'bg-orange-500/20',
    text: 'text-orange-400',
    gradient: 'from-orange-500/30 to-amber-500/30',
  },
  'Grading & Assessment': {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    gradient: 'from-amber-500/30 to-yellow-500/30',
  },
  Research: {
    bg: 'bg-violet-500/20',
    text: 'text-violet-400',
    gradient: 'from-violet-500/30 to-purple-500/30',
  },
  'Writing & Feedback': {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-400',
    gradient: 'from-emerald-500/30 to-green-500/30',
  },
  Presentations: {
    bg: 'bg-fuchsia-500/20',
    text: 'text-fuchsia-400',
    gradient: 'from-fuchsia-500/30 to-pink-500/30',
  },
  'Image & Video': {
    bg: 'bg-rose-500/20',
    text: 'text-rose-400',
    gradient: 'from-rose-500/30 to-red-500/30',
  },
  Productivity: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    gradient: 'from-blue-500/30 to-indigo-500/30',
  },
  'Student Tools': {
    bg: 'bg-sky-500/20',
    text: 'text-sky-400',
    gradient: 'from-sky-500/30 to-cyan-500/30',
  },
  'Community & LMS': {
    bg: 'bg-indigo-500/20',
    text: 'text-indigo-400',
    gradient: 'from-indigo-500/30 to-violet-500/30',
  },
};

const defaultColors: CategoryColors = {
  bg: 'bg-gray-500/20',
  text: 'text-gray-400',
  gradient: 'from-gray-500/30 to-slate-500/30',
};

export function getCategoryColors(category: string): CategoryColors {
  return categoryColorMap[category] ?? defaultColors;
}

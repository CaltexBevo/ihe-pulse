export interface Episode {
  number: number;
  title: string;
  guest: string;
  description: string;
  fullDescription: string;
  takeaways: string[];
  guestBio: string;
  topics: string[];
  duration: string;
  date: string;
  featured: boolean;
  slug: string;
  podbeanId: string;
  thumbnail?: string;
  episodeLinks?: {
    apple?: string;
    spotify?: string;
    amazon?: string;
    youtube?: string;
    podbean?: string;
  };
}

export const episodes: Episode[] = [
  {
    number: 47,
    title: 'Human-Centered AI Strategy: Empathy, Trust, Access',
    guest: 'Chesa Caparas',
    description:
      'Fifty percent of faculty feel overwhelmed by new tech, yet student AI use is soaring. This episode explores a people-first path to AI adoption in higher education with Professor Chesa Caparas.',
    fullDescription:
      'Fifty percent of faculty feel overwhelmed by new tech, yet student AI use is soaring. This episode explores a people-first path to AI adoption in higher education with Professor Chesa Caparas. They explore how empathy-driven strategies can bridge the gap between institutional mandates and real classroom needs, while keeping equity and access at the center of every decision.',
    takeaways: [
      'Ready-to-use survey that maps student comfort with AI',
      'Tactics that keep feedback human while trimming workload',
      'Red-flag signs your AI detector policy harms equity',
      'First steps to close global and local connectivity gaps',
    ],
    guestBio:
      'Chesa Caparas (she/they) is professor of English and Ethnic Studies at De Anza College in Cupertino, CA, where she teaches in the IMPACT AAPI Learning Community and leads professional development workshops on AI in education. She is also a member of CA Learning Lab\'s AI Faculty Innovator in Residence Strategy Team and serves as a Fulbright Scholar Alumni Ambassador promoting international research and teaching opportunities to educators across the country. She has a BA and MA in Modern Literature from UC-Santa Cruz and is currently pursuing an MS in Information and Knowledge Strategy at Columbia University. Her writing has been published in The Journal of Information Ethics, The Journal of California English, ASCCC\'s Rostrum, and the arts and literature journal ANMLY.',
    topics: ['Equity', 'Faculty Development', 'AI Policy', 'Student Access'],
    duration: '18:24',
    date: 'June 22, 2025',
    featured: true,
    slug: 'chesa-caparas',
    podbeanId: 'yn932-18e5c5a-pb',
    thumbnail:
      '/images/podcast/Chesa-Caparas-thumb-1200x.jpg',
    episodeLinks: {
      apple: 'https://podcasts.apple.com/us/podcast/human-centered-ai-strategy-empathy-trust-access-professor/id1774879335?i=1000714248484',
      spotify: 'https://open.spotify.com/episode/7srqvHE95Wiy2pAjPTjKoU',
      podbean: 'https://innovatinghighered.podbean.com/e/human-centered-ai-strategy-empathy-trust-access-professor-chesa-caparas/',
    },
  },
  {
    number: 46,
    title: 'Assistive AI Tools: Transform Course Design & Assessment',
    guest: 'Scott James',
    description:
      'Can a chatbot rewrite your toughest assignments in under five minutes? Scott James explains how his PlayLab custom-bot lets instructors quarantine course materials and surface crystal-clear rubrics.',
    fullDescription:
      'Can a chatbot rewrite your toughest assignments in under five minutes? Scott James explains how his PlayLab custom-bot lets instructors quarantine course materials and surface crystal-clear rubrics. From sandboxing sensitive sources to injecting personality into assessments, this episode is packed with actionable strategies for any instructor ready to rethink course design with AI.',
    takeaways: [
      'Step-by-step prompt flow to generate AI-resilient assignments',
      'Tactics to sandbox sources and avoid copyright headaches',
      'Tips for injecting personality without extra grading time',
      'Change-management moves that win over hesitant colleagues',
    ],
    guestBio:
      'Professor Scott James is an instructional-design veteran who began in disability services and now builds AI copilots for faculty using PlayLab.',
    topics: ['Course Design', 'Assessment', 'PlayLab', 'Instructional Design'],
    duration: '22:10',
    date: 'May 17, 2025',
    featured: false,
    slug: 'scott-james',
    podbeanId: 'fxjxj-1891ea5-pb',
    thumbnail:
      '/images/podcast/Prof-Scott-James-_thumb.02-585x390.jpg',
    episodeLinks: {
      apple: 'https://podcasts.apple.com/us/podcast/assistive-ai-tools-transform-course-design-assessment/id1774879335?i=1000705176100',
      spotify: 'https://open.spotify.com/episode/216Ztjo77avDac6G1eNE6n',
      podbean: 'https://innovatinghighered.podbean.com/e/assistive-ai-tools-transform-course-design-assessment-professor-scott-james-2/',
    },
  },
  {
    number: 45,
    title: 'OER, ZTC & Lightning-Fast AI Translation',
    guest: 'Sarah Harmon',
    description:
      'Textbooks can cost more than tuition—AI-powered OER wipes that cost out entirely. Dr. Sarah Harmon lays out the five-spoke ZTC Wheel that drives course material costs to $0.',
    fullDescription:
      'Textbooks can cost more than tuition—AI-powered OER wipes that cost out entirely. Dr. Sarah Harmon lays out the five-spoke ZTC Wheel that drives course material costs to $0. She walks through how LibreTexts machine translation is opening doors for multilingual learners and how Creative Commons licensing makes global remix possible.',
    takeaways: [
      'Five-spoke ZTC Wheel for zero-cost course materials',
      'LibreTexts machine translation delivers 90%-accurate editions',
      'Creative Commons tips for global remix',
      'Open-pedagogy ideas that turn students into co-authors',
    ],
    guestBio:
      'Dr. Sarah Harmon has been teaching Spanish and Linguistics for over 25 years. She specializes in OER and Zero-Textbook-Cost initiatives.',
    topics: ['OER', 'Zero Textbook Cost', 'AI Translation', 'Open Pedagogy'],
    duration: '25:33',
    date: 'May 11, 2025',
    featured: false,
    slug: 'sarah-harmon',
    podbeanId: 'brbx3-18a6904-pb',
    thumbnail:
      '/images/podcast/DR.-SARAH-HARMON-_Thumb.02.-3.2-585x390.jpg',
    episodeLinks: {
      apple: 'https://podcasts.apple.com/us/podcast/oer-ztc-lightning-fast-ai-translation-dr-sarah-harmon/id1774879335?i=1000708011628',
      spotify: 'https://open.spotify.com/episode/5kprFgfkg7tA7Hn36Lg7DI',
      podbean: 'https://innovatinghighered.podbean.com/e/oer-ztc-lightning-fast-ai-translation-dr-sarah-harmon/',
    },
  },
  {
    number: 44,
    title: 'Equity-First AI Curriculum for Every Discipline',
    guest: 'Suha Al Juboori',
    description:
      'Dr. Suha Aljuboori shares her journey from Iraq to establishing one of the first AI departments in the California community college system.',
    fullDescription:
      'Dr. Suha Aljuboori shares her journey from Iraq to establishing one of the first AI departments in the California community college system. She details her playbook for launching programs that serve both tech and non-tech tracks, and how multi-level certificates are opening AI education to everyone from refugees to CS majors.',
    takeaways: [
      'Playbook for launching an AI department serving tech and non-tech tracks',
      'Workshop formats that help skeptical faculty try AI',
      'Multi-level certificates for everyone from refugees to CS majors',
      'Outreach models that drive equity and enrollment',
    ],
    guestBio:
      'Dr. Suha Aljuboori is a distinguished professor with over 18 years of experience. She serves as Chair of the Artificial Intelligence Department.',
    topics: ['AI Curriculum', 'Equity', 'Community College', 'Certificates'],
    duration: '19:45',
    date: 'February 21, 2025',
    featured: false,
    slug: 'suha-al-juboori',
    podbeanId: 'h6ytf-1810356-pb',
    thumbnail:
      '/images/podcast/Dr.-Suha-Al-Juboori-Thumb.02-585x390.jpg',
    episodeLinks: {
      apple: 'https://podcasts.apple.com/us/podcast/equity-first-ai-curriculum-for-every-discipline-dr/id1774879335?i=1000694807020',
      spotify: 'https://open.spotify.com/episode/7JSKe12WulpOuVmpcOkI3r',
      podbean: 'https://innovatinghighered.podbean.com/e/equity-first-ai-curriculum-for-every-discipline-dr-suha-al-juboori-2/',
    },
  },
  {
    number: 43,
    title: 'VR Rehearsals: Building Confident Nurses Faster',
    guest: 'Jenna Zeller',
    description:
      'What if nursing students could practice high-stakes scenarios in VR before touching a real patient? Dr. Jenna Zeller reveals her layered VR workflow.',
    fullDescription:
      'What if nursing students could practice high-stakes scenarios in VR before touching a real patient? Dr. Jenna Zeller reveals her layered VR workflow that moves students from skill demos through VR scenarios to mannequin practice and debrief. She also shares AI prompts that turn rough feedback into polished emails in seconds.',
    takeaways: [
      'Repeatable stack: skill demo → VR scenario → mannequin → debrief',
      'Switch cue that turns passive onlookers into problem-solvers',
      'VR role-plays that build courage to page doctors early',
      'AI prompts for polished feedback emails in seconds',
    ],
    guestBio:
      'Dr. Jenna Zeller has worked as an RN for 16 years and in nursing education for 10 years. She focuses on integrating VR simulation into nursing education.',
    topics: ['VR Simulation', 'Nursing Education', 'AI Feedback', 'Clinical Training'],
    duration: '20:18',
    date: 'February 21, 2025',
    featured: false,
    slug: 'jenna-zeller',
    podbeanId: 'gxm6e-180f026-pb',
    thumbnail:
      '/images/podcast/Dr-Zeller-Thumb.02-585x390.jpg',
    episodeLinks: {
      apple: 'https://podcasts.apple.com/us/podcast/vr-rehearsals-building-confident-nurses-faster-dr-jenna/id1774879335?i=1000694562435',
      spotify: 'https://open.spotify.com/episode/6O6B5ozzYdq7h5kyd8P78M',
      podbean: 'https://innovatinghighered.podbean.com/e/vr-rehearsals-building-confident-nurses-faster-dr-jenna-zeller/',
    },
  },
  {
    number: 42,
    title: 'XR Learning & AI Engagement Hacks',
    guest: 'Garrick Grace',
    description:
      'Dr. Garrick Grace reveals how extended-reality simulations and adaptive AI tools are reshaping classrooms across California community colleges.',
    fullDescription:
      'Dr. Garrick Grace reveals how extended-reality simulations and adaptive AI tools are reshaping classrooms across California community colleges. From immersive ladders that guide reflection to belonging boosters for multilingual cohorts, this episode is a masterclass in scaling innovation without draining budgets.',
    takeaways: [
      'Immersive ladder: live demo → XR scenario → guided reflection',
      'Belonging boosters: AI-leveled content for multilingual cohorts',
      'Mind-shift PD that ripples to 60,000 colleagues',
      'Budget guardrails: merge AI with XR without draining dollars',
    ],
    guestBio:
      'Dr. Garrick Grace has been in education for sixteen years. He currently serves as Director of Professional Development for the California Virtual Campus.',
    topics: ['XR/VR', 'Professional Development', 'Multilingual Learners', 'EdTech Budgets'],
    duration: '23:55',
    date: 'February 21, 2025',
    featured: false,
    slug: 'garrick-grace',
    podbeanId: '342ra-180ef9c-pb',
    thumbnail:
      '/images/podcast/Dr-Grace-Thumb-.02-585x390.jpg',
    episodeLinks: {
      apple: 'https://podcasts.apple.com/us/podcast/xr-learning-ai-engagement-hacks-dr-garrick-grace/id1774879335?i=1000694561008',
      spotify: 'https://open.spotify.com/episode/6yglIuMEtkWkrfDN0lOUGB',
      podbean: 'https://innovatinghighered.podbean.com/e/xr-learning-ai-engagement-hacks-dr-garrick-grace/',
    },
  },
  {
    number: 41,
    title: 'ChatGPT Teaching Assistant: Lesson Plans in Minutes',
    guest: 'Lynn Dickinson',
    description:
      'Author Lynn Dickinson shares the prompt pattern she uses to build full slide decks in about ten minutes and how ChatGPT helped write her faculty guide.',
    fullDescription:
      'Author Lynn Dickinson shares the prompt pattern she uses to build full slide decks in about ten minutes and how ChatGPT helped write her faculty guide. She covers discussion prompts students cannot copy-paste, the why/what/how prompt flow, and how to reframe AI as a creativity booster rather than a cheating threat.',
    takeaways: [
      'Discussion prompts students cannot copy-paste',
      'Why/what/how prompt flow for slides and activities',
      'Reframe AI as creativity booster, not cheating threat',
      'Build cross-campus resource banks across disciplines',
    ],
    guestBio:
      'Lynn Dickinson is author of the Amazon bestseller "How to Use ChatGPT as a Teaching Assistant" and faculty at Santa Monica College.',
    topics: ['ChatGPT', 'Lesson Planning', 'Faculty Resources', 'AI Writing'],
    duration: '17:30',
    date: 'October 19, 2024',
    featured: false,
    slug: 'lynn-dickinson',
    podbeanId: 'jv858-1710904-pb',
    thumbnail:
      '/images/podcast/Lynn-Dickinson-thumb-.02-585x390.jpg',
    episodeLinks: {
      apple: 'https://podcasts.apple.com/us/podcast/chatgpt-teaching-assistant-lesson-plans-in-minutes/id1774879335?i=1000673650456',
      spotify: 'https://open.spotify.com/episode/6uR3D5rZwOE8UXvTWiGLD3',
      podbean: 'https://innovatinghighered.podbean.com/e/chatgpt-teaching-assistant-lesson-plans-in-minutes-lynn-dickinson-2/',
    },
  },
];

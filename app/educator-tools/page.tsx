'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import {
  FileText,
  ClipboardCheck,
  Layout,
  Shield,
  Presentation,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Download,
  BookOpen,
  Rocket,
  Target,
  GraduationCap,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

/* ============================================
   Quick Start Guides data
   ============================================ */
const quickStartGuides = [
  {
    icon: Rocket,
    title: 'Getting Started with AI in Your Classroom',
    description:
      'A step-by-step guide for faculty who want to begin integrating AI tools into their teaching practice.',
    color: 'from-[#00d4ff] to-[#c850c0]',
  },
  {
    icon: Shield,
    title: 'AI Policy Template for Academic Integrity',
    description:
      'Customizable policy language you can add to your syllabus covering AI use, disclosure requirements, and consequences.',
    color: 'from-[#c850c0] to-[#00d4ff]',
  },
  {
    icon: Target,
    title: 'Designing AI-Resistant Assignments',
    description:
      'Strategies for creating assessments that leverage AI as a learning tool rather than a shortcut.',
    color: 'from-[#00d4ff] to-[#67e8f9]',
  },
  {
    icon: GraduationCap,
    title: 'AI Literacy Across the Curriculum',
    description:
      'Framework for embedding AI competencies into any discipline, not just computer science.',
    color: 'from-[#e879f9] to-[#c850c0]',
  },
];

/* ============================================
   Template categories data (existing)
   ============================================ */
const toolCategories = [
  {
    icon: FileText,
    title: 'Syllabus Templates',
    count: 12,
    description:
      'Ready-to-customize syllabus templates with AI policy sections, learning outcomes, and accessibility statements.',
    color: 'from-blue-400 to-blue-600',
    items: [
      'Standard Course Syllabus',
      'Online/Hybrid Syllabus',
      'Lab Course Syllabus',
      'Graduate Seminar Syllabus',
      'AI-Enhanced Course Syllabus',
      'First-Year Experience Syllabus',
    ],
  },
  {
    icon: ClipboardCheck,
    title: 'Assessment Rubrics',
    count: 24,
    description:
      'Analytical and holistic rubrics for essays, presentations, projects, participation, and AI-assisted assignments.',
    color: 'from-emerald-400 to-emerald-600',
    items: [
      'Analytical Essay Rubric',
      'Research Paper Rubric',
      'Group Project Rubric',
      'Oral Presentation Rubric',
      'AI-Assisted Assignment Rubric',
      'Discussion Participation Rubric',
    ],
  },
  {
    icon: Layout,
    title: 'Lesson Plan Builders',
    count: 8,
    description:
      'Structured lesson plan frameworks incorporating active learning, universal design, and AI integration points.',
    color: 'from-violet-400 to-violet-600',
    items: [
      'Active Learning Lesson Plan',
      'Flipped Classroom Template',
      'Problem-Based Learning Plan',
      'AI-Integrated Lesson Plan',
    ],
  },
  {
    icon: Shield,
    title: 'AI Policy Guides',
    count: 6,
    description:
      'Customizable AI use policies for courses, departments, and institutions with clear guidelines and rationale.',
    color: 'from-amber-400 to-amber-600',
    items: [
      'Course-Level AI Policy',
      'Department AI Guidelines',
      'Institution-Wide AI Framework',
      'Student AI Use Agreement',
    ],
  },
  {
    icon: Presentation,
    title: 'Workshop Materials',
    count: 15,
    description:
      'Complete workshop kits for faculty development sessions on AI literacy, prompt engineering, and ethical AI use.',
    color: 'from-rose-400 to-rose-600',
    items: [
      'Intro to AI for Faculty (2hr)',
      'Prompt Engineering Workshop',
      'AI Ethics in the Classroom',
      'Building AI Assignments',
      'AI Detection & Integrity',
    ],
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboards',
    count: 4,
    description:
      'Templates for tracking student performance, course effectiveness, and AI tool adoption across programs.',
    color: 'from-cyan-400 to-cyan-600',
    items: [
      'Student Performance Tracker',
      'Course Analytics Template',
      'AI Adoption Dashboard',
      'Learning Outcomes Assessment',
    ],
  },
];

/* ============================================
   Recommended Reading data
   ============================================ */
const recommendedReading = [
  {
    title: 'Teaching with AI',
    author: 'Stanford HAI',
    description:
      'A comprehensive guide from the Stanford Institute for Human-Centered AI on practical approaches to integrating AI tools into university teaching.',
    url: 'https://hai.stanford.edu/',
  },
  {
    title: 'AI in Higher Education: A Framework',
    author: 'EDUCAUSE',
    description:
      'EDUCAUSE\'s strategic framework for institutional AI adoption, covering governance, infrastructure, pedagogy, and ethical considerations.',
    url: 'https://www.educause.edu/',
  },
  {
    title: 'Bloom\'s Taxonomy in the Age of AI',
    author: 'Derek Bruff',
    description:
      'An insightful exploration of how AI tools map to different levels of cognitive complexity and what that means for assignment design.',
    url: 'https://derekbruff.org/',
  },
  {
    title: 'The Alignment Problem',
    author: 'Brian Christian',
    description:
      'Essential reading on the challenges of building AI systems that reflect human values -- and why educators need to understand these issues.',
    url: 'https://brianchristian.org/',
  },
  {
    title: 'How to Use ChatGPT as a Teaching Assistant',
    author: 'Lynn Dickinson',
    description:
      'A practical conversation with Lynn Dickinson on leveraging ChatGPT for grading support, office hours prep, and student feedback.',
    url: '/podcast',
  },
];

/* ============================================
   CategoryCard component (existing)
   ============================================ */
function CategoryCard({
  category,
}: {
  category: (typeof toolCategories)[0];
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass rounded-xl overflow-hidden hover:border-pulse/20 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 flex items-start gap-5 text-left"
      >
        <div
          className={`shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}
        >
          <category.icon size={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-semibold text-white">
              {category.title}
            </h3>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-white/10 text-gray-400">
              {category.count}
            </span>
          </div>
          <p className="text-sm text-gray-400 line-clamp-2">
            {category.description}
          </p>
        </div>
        <div className="shrink-0 text-gray-500 mt-1">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-6 pt-0">
          <div className="border-t border-white/5 pt-4 space-y-2">
            {category.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-colors group"
              >
                <span className="text-sm text-gray-300">{item}</span>
                <button className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex items-center gap-1.5 text-xs text-pulse transition-opacity">
                  <Download size={12} />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================
   Page component
   ============================================ */
export default function EducatorToolsPage() {
  return (
    <PageTransition>
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">

          {/* ==========================================
              Header
              ========================================== */}
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={18} className="text-pulse" />
              <p className="text-sm font-mono text-pulse uppercase tracking-widest">
                Educator Tools
              </p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">
              Templates & <span className="gradient-text">Resources</span>
            </h1>
            <p className="mt-3 text-gray-400 max-w-2xl">
              Ready-to-use templates, rubrics, and guides to bring AI into your
              teaching practice. Download, customize, and deploy.
            </p>
          </div>

          {/* ==========================================
              Quick Start Guides (NEW)
              ========================================== */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <Sparkles size={22} className="text-synapse" />
              <h2 className="text-2xl sm:text-3xl font-bold">
                <span className="gradient-text">Quick Start</span>{' '}
                <span className="text-white">Guides</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {quickStartGuides.map((guide, i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-6 flex flex-col items-start hover:border-synapse/20 transition-all duration-300 group relative"
                >
                  {/* Coming Soon badge */}
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-synapse/15 text-synapse border border-synapse/20">
                    Coming Soon
                  </span>

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${guide.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <guide.icon size={20} className="text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-semibold text-white mb-2 leading-snug pr-6">
                    {guide.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {guide.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ==========================================
              Template Categories (existing)
              ========================================== */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <FileText size={22} className="text-pulse" />
              <h2 className="text-2xl sm:text-3xl font-bold">
                <span className="text-white">Template</span>{' '}
                <span className="gradient-text">Categories</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {toolCategories.map((category, i) => (
                <CategoryCard key={i} category={category} />
              ))}
            </div>
          </section>

          {/* ==========================================
              Recommended Reading (NEW)
              ========================================== */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen size={22} className="text-pulse" />
              <h2 className="text-2xl sm:text-3xl font-bold">
                <span className="gradient-text">Recommended</span>{' '}
                <span className="text-white">Reading</span>
              </h2>
            </div>

            <div className="space-y-4">
              {recommendedReading.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target={resource.url.startsWith('/') ? undefined : '_blank'}
                  rel={resource.url.startsWith('/') ? undefined : 'noopener noreferrer'}
                  className="glass rounded-xl p-5 sm:p-6 flex items-start gap-5 hover:border-pulse/30 transition-all duration-300 group block"
                >
                  {/* Number indicator */}
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-[#00d4ff]/20 to-[#c850c0]/20 border border-white/5 flex items-center justify-center">
                    <span className="text-sm font-bold gradient-text">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-white group-hover:text-pulse transition-colors">
                        {resource.title}
                      </h3>
                    </div>
                    <p className="text-xs font-medium text-synapse mb-1.5">
                      {resource.author}
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {resource.description}
                    </p>
                  </div>

                  {/* Link icon */}
                  <div className="shrink-0 mt-1 text-gray-600 group-hover:text-pulse transition-colors">
                    <ExternalLink size={18} />
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* ==========================================
              CTA Section (NEW)
              ========================================== */}
          <section className="mb-4">
            <div className="glass rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/5 via-transparent to-[#c850c0]/5 pointer-events-none" />

              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#c850c0] mb-5">
                  <Sparkles size={24} className="text-white" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Have a resource to <span className="gradient-text">share?</span>
                </h2>

                <p className="text-gray-400 max-w-xl mx-auto mb-6 leading-relaxed">
                  IHE Pulse is built by and for the higher education community. If you
                  have a template, guide, reading recommendation, or tool that has
                  helped you integrate AI into your teaching, we would love to feature it.
                </p>

                <Link
                  href="/be-our-guest"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#c850c0] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Share Your Resource
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>
    </PageTransition>
  );
}

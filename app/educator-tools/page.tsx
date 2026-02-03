'use client';

import { useState } from 'react';
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
} from 'lucide-react';

const toolCategories = [
  {
    icon: FileText,
    title: 'Syllabus Templates',
    count: 12,
    description: 'Ready-to-customize syllabus templates with AI policy sections, learning outcomes, and accessibility statements.',
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
    description: 'Analytical and holistic rubrics for essays, presentations, projects, participation, and AI-assisted assignments.',
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
    description: 'Structured lesson plan frameworks incorporating active learning, universal design, and AI integration points.',
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
    description: 'Customizable AI use policies for courses, departments, and institutions with clear guidelines and rationale.',
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
    description: 'Complete workshop kits for faculty development sessions on AI literacy, prompt engineering, and ethical AI use.',
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
    description: 'Templates for tracking student performance, course effectiveness, and AI tool adoption across programs.',
    color: 'from-cyan-400 to-cyan-600',
    items: [
      'Student Performance Tracker',
      'Course Analytics Template',
      'AI Adoption Dashboard',
      'Learning Outcomes Assessment',
    ],
  },
];

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

export default function EducatorToolsPage() {
  return (
    <PageTransition>
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
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

        {/* Category grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {toolCategories.map((category, i) => (
            <CategoryCard key={i} category={category} />
          ))}
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

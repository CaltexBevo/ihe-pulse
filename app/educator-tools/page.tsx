'use client';

import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import { paletteFor } from '@/lib/palette';
import {
  BookOpen,
  ExternalLink,
  ArrowRight,
  Sparkles,
  FileText,
  CheckCircle,
  GraduationCap,
  ClipboardCheck,
  Shield,
  Scale,
  ListChecks,
} from 'lucide-react';

/* ============================================
   Educator Tools - Peer-built tools for faculty
   ============================================ */

interface EducatorTool {
  title: string;
  description: string;
  features: string[];
  platform?: string;
  platformUrl: string;
  cta: string;
  icon: typeof FileText;
  attribution?: string;
}

const educatorTools: EducatorTool[] = [
  // Innovating Higher Ed / Cyber Doctor tools first
  {
    title: 'Canvas Quiz Builder (QTI Export)',
    description:
      'Build quiz question packages that import directly into Canvas New Quizzes. Paste your questions, choose from five question types — Multiple Choice, True/False, Multiple Answer, Fill in the Blank, and Essay — then export a single QTI 2.1 ZIP file ready for Canvas import. No software to install, no account needed. Everything runs in your browser.',
    features: [
      '5 question types supported',
      'QTI 2.1 Canvas-compatible export',
      'Inline editing and review before export',
      'Set custom point values per question type',
      'No login or install required',
    ],
    platformUrl: 'https://innovatinghighered.com/QTI-quiz-builder.html',
    cta: 'Launch Quiz Builder',
    icon: ListChecks,
    attribution: 'A Cyber Doctor · Norma Jones Build',
  },
  {
    title: 'COR Checker',
    description:
      'Analyze your Course Outline of Record against California Title 5 §55001.5(b) IDEAA compliance requirements. Upload your COR as a PDF and get an instant analysis of 8 sections with keyword detection and discipline-specific suggestions.',
    features: [
      'Checks 8 COR sections',
      'IDEAA keyword detection',
      'Discipline-specific suggestions',
      'No data uploaded (processed locally)',
    ],
    platformUrl: 'https://innovatinghighered.com/cor-checker.html',
    cta: 'Launch COR Checker',
    icon: FileText,
    attribution: 'A Cyber Doctor · Norma Jones Build',
  },
  // PlayLab tools
  {
    title: 'Syllabot',
    description:
      'Writing a clear and fair AI policy for your syllabus can be stressful. Syllabot is a guided tool that helps you generate course-ready language in minutes. By answering a short set of questions, you can create a practical, student-friendly policy tailored to your specific course and teaching style.',
    features: [
      'Fast & Easy (5-10 minutes)',
      'Customizable to your subject area',
      'Evidence-Informed',
      'No Login Required',
    ],
    platform: 'PlayLab',
    platformUrl: 'https://www.playlab.ai/project/cmcxiu07005zbm20uf1mawflg',
    cta: 'Launch Syllabot',
    icon: Shield,
  },
  {
    title: 'AI Redesign',
    description:
      'Struggling to create meaningful, AI-resistant assignments? Assessment Design Assistant is a guided tool that helps transform your existing assessments into authentic learning experiences. The tool guides you through a collaborative redesign process, offering research-backed suggestions tailored to your course and learning objectives.',
    features: [
      'Research-Backed',
      'Collaborative',
      'Comprehensive redesign with rationale',
      'No login required',
    ],
    platform: 'PlayLab',
    platformUrl: 'https://www.playlab.ai/project/cma2sos8l1wkbrgigtms5xuxh',
    cta: 'Launch AI Redesign',
    icon: ClipboardCheck,
  },
  {
    title: 'EquiGrade Mentor',
    description:
      'Grading first-generation students fairly can feel overwhelming. EquiGrade Mentor is your personalized guide to equitable grading. It helps you transform grading practices to empower diverse learners.',
    features: [
      'Start Small (pilot with one assignment)',
      'Clear guides/templates/rubrics',
      'Research-backed strategies',
      'Free and accessible',
    ],
    platform: 'PlayLab',
    platformUrl: 'https://www.playlab.ai/project/cmb1835ju01w3opiglm8j6par',
    cta: 'Launch EquiGrade',
    icon: Scale,
  },
];

/* ============================================
   Tool Card component
   ============================================ */
function ToolCard({ tool, accent }: { tool: EducatorTool; accent: string }) {
  const Icon = tool.icon;

  return (
    <div
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] flex flex-col"
      style={{ '--tool-accent': accent } as React.CSSProperties}
    >
      {/* Accent strip at top */}
      <div className="h-[3px]" style={{ background: accent }} />

      <div className="p-6 flex flex-col flex-1">
        {/* Header: icon + title + platform */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)` }}
          >
            <Icon size={24} style={{ color: accent }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[1.2rem] font-bold text-[var(--text)] mb-1">
              {tool.title}
            </h3>
            {tool.platform && (
              <span className="text-[0.72rem] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                Built on {tool.platform}
              </span>
            )}
            {tool.attribution && (
              <span className="text-[0.72rem] font-mono text-[var(--text-muted)]">
                {tool.attribution}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.65] mb-5">
          {tool.description}
        </p>

        {/* Features */}
        <div className="mb-5 flex-1">
          <div className="text-[0.68rem] font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2">
            Features
          </div>
          <ul className="space-y-2">
            {tool.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-[0.84rem] text-[var(--text)]">
                <CheckCircle
                  size={16}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: accent }}
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <a
          href={tool.platformUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-[10px] font-semibold text-[0.88rem] text-white transition-all duration-200 hover:opacity-90 bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]"
        >
          {tool.cta}
          <ExternalLink size={16} />
        </a>
      </div>
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
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--cyan)]/20 bg-[var(--cyan)]/[0.04] mb-5">
              <GraduationCap size={14} className="text-[var(--cyan)]" />
              <span className="text-[0.78rem] font-semibold text-[var(--cyan)] uppercase tracking-[1.8px]">
                Educator Tools
              </span>
            </div>
            <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.1] mb-4 tracking-tight">
              Practical Tools Built by{' '}
              <span className="bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] bg-clip-text text-transparent">
                Educators
              </span>
              , for Educators
            </h1>
            <p className="text-[1.08rem] text-[var(--text-muted)] max-w-[620px] mx-auto">
              These are not just AI tools — they are classroom-tested solutions from your peers. Free, accessible, and built to solve real problems.
            </p>
          </div>

          {/* ==========================================
              Tool Cards Grid (2x2)
              ========================================== */}
          <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-6">
              {educatorTools.map((tool, i) => (
                <ToolCard key={i} tool={tool} accent={paletteFor(i)} />
              ))}
            </div>
          </section>

          {/* ==========================================
              CTA Section
              ========================================== */}
          <section className="mb-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 sm:p-10 text-center relative overflow-hidden">
              {/* Gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

              <div className="relative">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] mb-5">
                  <Sparkles size={24} className="text-white" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text)] mb-3">
                  Built a tool your peers should know about?
                </h2>

                <p className="text-[var(--text-muted)] max-w-xl mx-auto mb-6 leading-relaxed">
                  Innovating Higher Ed features tools created by the higher education community. If you have built something that helps faculty or students navigate AI, we want to hear from you.
                </p>

                <Link
                  href="/be-our-guest"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Share Your Tool
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

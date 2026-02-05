'use client';

import {
  Sparkles,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Lightbulb,
  Zap,
  Layers,
  UserCog,
  FileInput,
  Footprints,
  Link2,
  ShieldCheck,
  GitBranch,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import SectionNav from '@/components/SectionNav';
import Accordion from '@/components/Accordion';
import type { AccordionItem } from '@/components/Accordion';
import WorkflowStepper from '@/components/WorkflowStepper';
import CopyButton from '@/components/CopyButton';
import {
  sectionIds,
  sectionLabels,
  coreTechniques,
  promptTemplates,
  commonProblems,
  workflowSteps,
  tuningChecklist,
  references,
} from '@/lib/data/prompts';

const navSections = sectionIds.map((id) => ({
  id,
  label: sectionLabels[id],
}));

// ── Icon map for each technique ─────────────────────────

const techniqueIcons: Record<string, LucideIcon> = {
  'zero-shot': Zap,
  'few-shot': Layers,
  'system-role': UserCog,
  'context-injection': FileInput,
  'step-back': Footprints,
  'chain-of-thought': Link2,
  'self-consistency': ShieldCheck,
  'tree-of-thought': GitBranch,
  'react': RefreshCw,
};

export default function PromptsPage() {
  // Build accordion items from core techniques
  const accordionItems: AccordionItem[] = coreTechniques.map((t) => {
    const Icon = techniqueIcons[t.id] ?? Zap;
    return {
      id: t.id,
      trigger: (
        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-8 h-8 rounded-lg bg-gradient-to-br from-pulse/20 to-synapse/20 flex items-center justify-center shrink-0 border border-pulse/20">
            <Icon size={16} className="text-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold gradient-text-cyan">{t.name}</h3>
            <p className="text-sm text-gray-400 mt-0.5">
              <span className="text-pulse font-medium">Use when:</span>{' '}
              {t.useWhen}
            </p>
          </div>
        </div>
      ),
      content: (
        <div className="space-y-5">
          <div>
            <h4 className="text-xs font-semibold text-pulse/70 uppercase tracking-wider mb-1.5">
              Definition
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">
              {t.definition}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-pulse/70 uppercase tracking-wider mb-1.5">
              Use Case (Higher Ed)
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">{t.useCase}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-pulse/70 uppercase tracking-wider mb-1.5">
              When &amp; Why
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed">{t.whenWhy}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-pulse/70 uppercase tracking-wider">
              Example Prompt{t.examplePrompts.length > 1 ? 's' : ''}
            </h4>
            {t.examplePrompts.map((ep, idx) => (
              <div key={idx} className="prompt-block rounded-lg p-4">
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed mb-3">
                  {ep}
                </pre>
                <CopyButton text={ep} label="Copy Prompt" />
              </div>
            ))}
          </div>
        </div>
      ),
    };
  });

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          {/* ── Page Header ─────────────────────────────── */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={18} className="text-pulse" />
              <p className="text-sm font-mono text-pulse uppercase tracking-widest">
                Prompt Navigator
              </p>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
              Master{' '}
              <span className="gradient-text">Prompt Engineering</span>
            </h1>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl">
              Nine core techniques, ready-to-use templates, common pitfalls, and
              a refinement workflow &mdash; everything you need to get better
              results from AI in higher education.
            </p>
          </div>
        </div>
      </div>

      {/* ── Sticky Section Nav ──────────────────────── */}
      <SectionNav sections={navSections} />

      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl space-y-24">
          {/* ━━ Section 1: Core Techniques ━━━━━━━━━━━━ */}
          <section id="techniques">
            <SectionHeading
              icon={<BookOpen size={22} className="text-pulse" />}
              title="Core Techniques"
              subtitle="Nine proven prompting strategies, each with definitions, use cases, and copyable example prompts."
              gradientClass="gradient-text-cyan"
            />
            <Accordion items={accordionItems} glowClass="card-glow-cyan" />
          </section>

          {/* ━━ Section 2: Prompt Templates ━━━━━━━━━━━ */}
          <section id="templates">
            <SectionHeading
              icon={<Sparkles size={22} className="text-synapse" />}
              title="Prompt Templates"
              subtitle="Ready-to-use prompts for teaching, advising, assessment, and AI policy. Copy, customize, deploy."
              gradientClass="gradient-text-fuchsia"
            />
            <div className="grid md:grid-cols-2 gap-6">
              {promptTemplates.map((t) => (
                <div
                  key={t.id}
                  className="glass rounded-xl p-5 flex flex-col card-glow-fuchsia"
                >
                  <h3 className="text-lg font-semibold text-white mb-3">
                    {t.title}
                  </h3>
                  <div className="prompt-block rounded-lg p-4 mb-3 flex-1">
                    <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
                      {t.prompt}
                    </pre>
                  </div>
                  <div className="mb-3">
                    <CopyButton text={t.prompt} label="Copy Prompt" />
                  </div>
                  <details className="group">
                    <summary className="text-xs font-medium text-synapse/60 cursor-pointer hover:text-synapse transition-colors select-none">
                      Usage Notes
                    </summary>
                    <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                      {t.usageNotes}
                    </p>
                  </details>
                </div>
              ))}
            </div>
          </section>

          {/* ━━ Section 3: Common Problems ━━━━━━━━━━━━ */}
          <section id="problems">
            <SectionHeading
              icon={<AlertTriangle size={22} className="text-amber-400" />}
              title="Common Problems & Fixes"
              subtitle="Six pitfalls that produce weak AI outputs &mdash; and how to fix each one."
              gradientClass="gradient-text-amber"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {commonProblems.map((cp, i) => (
                <div
                  key={i}
                  className="glass rounded-xl p-5 card-glow-amber"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="mt-0.5 w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
                      <AlertTriangle size={14} className="text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        {cp.problem}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {cp.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-3 border-t border-amber-500/10">
                    <div className="mt-0.5 w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/20">
                      <CheckCircle size={14} className="text-green-400" />
                    </div>
                    <p className="text-sm text-gray-300 pt-1">{cp.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ━━ Section 4: Refinement Workflow ━━━━━━━━ */}
          <section id="workflow">
            <SectionHeading
              icon={<Lightbulb size={22} className="text-pulse" />}
              title="Prompt Refinement Workflow"
              subtitle="An 8-step process to go from rough idea to polished, reusable prompt."
              gradientClass="gradient-text"
            />

            <div className="glass rounded-xl p-6 sm:p-8 mb-8 card-glow-cyan">
              <WorkflowStepper steps={workflowSteps} />
            </div>

            {/* Tuning Checklist */}
            <div className="glass rounded-xl p-6 sm:p-8 card-glow-fuchsia">
              <h3 className="text-lg font-semibold text-white mb-1">
                Tuning Checklist
              </h3>
              <p className="text-sm text-gray-400 mb-5">
                Before sending your final prompt, confirm it has:
              </p>
              <ul className="space-y-3">
                {tuningChecklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-pulse to-synapse shrink-0" />
                    <span className="text-sm text-gray-300">
                      <span className="font-semibold text-white">
                        {item.label}
                      </span>{' '}
                      &mdash; {item.description}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-xs text-gray-500 italic">
                Pro Tip: Even good prompts can improve. Test, refine, and save
                the best versions &mdash; they become powerful templates for
                future use.
              </p>
            </div>
          </section>

          {/* ━━ Section 5: References ━━━━━━━━━━━━━━━━ */}
          <section id="references">
            <SectionHeading
              icon={<BookOpen size={22} className="text-pulse" />}
              title="References & Further Reading"
              subtitle="Key research and resources on prompt engineering and AI in education."
              gradientClass="gradient-text"
            />
            <div className="glass rounded-xl p-6 sm:p-8 card-glow-cyan">
              <ol className="space-y-2.5 list-none">
                {references.map((ref, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-pulse font-mono shrink-0 mt-px font-bold">
                      {i + 1}.
                    </span>
                    <span className="text-gray-300">{ref.text}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-6 text-xs text-gray-500 italic">
                We encourage you to explore these works to broaden your
                perspective. Prompt engineering is a fast-evolving field &mdash;
                staying informed through such readings will help you refine your
                skills and adapt to new AI developments.
              </p>
            </div>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}

// ── Section heading helper ───────────────────────────────

function SectionHeading({
  icon,
  title,
  subtitle,
  gradientClass = 'gradient-text',
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradientClass?: string;
}) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h2 className={`text-3xl sm:text-4xl font-bold ${gradientClass}`}>
          {title}
        </h2>
      </div>
      <p className="text-gray-400 text-lg max-w-2xl">{subtitle}</p>
    </div>
  );
}

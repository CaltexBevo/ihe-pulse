'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, ExternalLink } from 'lucide-react';
import { paletteFor } from '@/lib/palette';

// ═══════════════════════════════════════════════════════════════════════════
// CORE TECHNIQUES DATA (ALL 9)
// ═══════════════════════════════════════════════════════════════════════════

const coreTechniques = [
  {
    name: "Zero-Shot Prompting",
    difficulty: "Beginner",
    startHere: true,
    useWhen: "you want a quick baseline answer without providing examples",
    definition: "Asks the AI to perform a task without any examples in the prompt. Direct instruction, model responds from general training. Fastest way to get an initial draft.",
    useCase: "Fast definitions, quick contrasts, rapid lists. Use for class prep first passes.",
    whenWhy: "Best for straightforward tasks. If outputs are too generic, move to few-shot or add context.",
    prompts: [
      "Explain the concept of social stratification in simple terms for an intro sociology class (~120 words) and include one concrete, everyday example.",
      "List the three most important differences between photosynthesis and cellular respiration in a single paragraph for first-year students."
    ]
  },
  {
    name: "Few-Shot Prompting",
    difficulty: "Beginner",
    startHere: true,
    useWhen: "the output must match a specific format, tone, or rubric",
    definition: "Includes one or more examples of the task and desired output inside the prompt. The model uses these demonstrations to infer structure, tone, and level.",
    useCase: "Provide example student answer with model feedback, then ask for feedback on new answer. Show quiz item examples and request matching items.",
    whenWhy: "Reach for few-shot when zero-shot was generic, when format is critical, or when you need stable voice. 1-3 concise demos usually enough.",
    prompts: [
      `You are grading short answers.\n\nExample student answer: "[paste]"\n\nExample instructor feedback (tone, length, structure to imitate): "[paste]"\n\nNow provide feedback on the next student answer in the same style: "[paste new answer]"`
    ]
  },
  {
    name: "System & Role Prompts",
    difficulty: "Beginner",
    startHere: true,
    useWhen: "you need consistent behavior, constraints, or a specific persona",
    definition: "System instructions set global ground rules (tone, limits, policies, audience). Role prompts ask the AI to adopt a persona. Together they shape how the model responds across turns.",
    useCase: "Set system message for course TA, add role for writing tutor. Use librarian persona for research support.",
    whenWhy: "Use whenever manner of response matters as much as content — feedback tone, accessibility, policy alignment, simulations.",
    prompts: [
      `System (session-wide): You are a supportive teaching assistant for first-year courses. Use clear, neutral language, avoid full solutions, and flag uncertainty.\n\nRole (this task): Act as an encouraging writing tutor. Give concise feedback on the draft below tied to our rubric.\n\nRubric: "[paste]"\nDraft: "[paste]"`
    ]
  },
  {
    name: "Context Injection",
    difficulty: "Intermediate",
    useWhen: "outputs must follow your local readings, rubrics, or constraints",
    definition: "Supplies the model with background it needs: course level, source material, explicit constraints. Reduces ambiguity, increases alignment to your course.",
    useCase: "Generate study guides from readings, create quiz items from passages, evaluate against your rubric, adapt lessons for online format.",
    whenWhy: "Use whenever 'according to our materials' matters. Pair with few-shot for tone/format.",
    prompts: [
      `Using the rubric below, score the student paragraph and give two specific suggestions tied to criteria.\n\nCourse/Level: Intro Psych (non-majors)\nRubric: "[paste rubric]"\nStudent paragraph: "[paste]"`
    ]
  },
  {
    name: "Step-Back Prompting",
    difficulty: "Intermediate",
    useWhen: "you want the model to identify the problem type and plan before solving",
    definition: "Asks the model to describe the kind of problem it's facing and outline a brief plan before attempting the solution. Promotes meta-cognition.",
    useCase: "Before solving a stats problem, model identifies it as sampling vs inference, lists steps. In philosophy, names whether it's conceptual analysis or argument reconstruction.",
    whenWhy: "Helpful for multi-step or unfamiliar tasks. Surfaces a plan you can critique.",
    prompts: [
      `Identify the type of problem, outline a 3-step plan to solve it, then provide the solution.\n\nProblem: "[paste]"`
    ]
  },
  {
    name: "Chain-of-Thought Prompting",
    difficulty: "Intermediate",
    useWhen: "the reasoning steps themselves are instructional or must be checked",
    definition: "Asks the model to show intermediate reasoning steps rather than only a final answer. You can cap the number of steps.",
    useCase: "In math/logic, explain each step then state result. In history/policy, short evidence chain linking claims to sources.",
    whenWhy: "Use when transparency and pedagogy matter — teaching problem-solving, grading reasoning, verifying claims.",
    prompts: [
      `Solve the problem and explain in numbered steps (max 6). Then give the final answer on a separate line labeled "Answer:".\n\nProblem: "[paste]"`
    ]
  },
  {
    name: "Self-Consistency",
    difficulty: "Advanced",
    useWhen: "single-run outputs vary and you need a more reliable result",
    definition: "Generates multiple independent solutions to the same prompt, then compares and selects the best/most consistent answer.",
    useCase: "For complex calculations, conceptual proofs, or grading rubrics — ask for 3 variants and synthesis.",
    whenWhy: "Useful when correctness is critical or earlier runs felt unstable. Reduces hallucinations.",
    prompts: [
      `Produce three independent answers to the question below. Then summarize points of agreement, note any conflicts, and choose the best answer with a one-sentence justification.\n\nQuestion: "[paste]"`
    ]
  },
  {
    name: "Tree-of-Thought Prompting",
    difficulty: "Advanced",
    useWhen: "there are multiple viable approaches and you want options before deciding",
    definition: "Explores several branches of reasoning or strategy rather than a single linear path. Proposes options, evaluates against criteria, converges on recommendation.",
    useCase: "Lesson design: request 3 approaches to teach a topic with objectives, keystone activity, pros/cons.",
    whenWhy: "Ideal when many paths could work and you want structured exploration. Makes trade-offs explicit.",
    prompts: [
      `Propose 3 distinct approaches to teach [topic] to non-majors. For each: objectives, one keystone activity, pros/cons. Then recommend one approach and explain why given a 50-minute class and 25 students.`
    ]
  },
  {
    name: "ReAct (Reason & Act)",
    difficulty: "Advanced",
    useWhen: "the task benefits from alternating reasoning with actions or questions",
    definition: "Interleaves reasoning with 'actions' (asking questions, requesting info) and continues based on observations. Think-step, act-step, observe-step loop.",
    useCase: "For scoping literature review or project: model restates goal, identifies gaps, asks clarifying questions, proposes action, iterates.",
    whenWhy: "Use for open-ended tasks requiring inquiry and iteration — research planning, stakeholder analysis, design projects.",
    prompts: [
      `Follow a Reason → Action → Observation loop to build a research plan.\nReason: Restate my topic and identify what information is missing.\nAction: Ask me up to 3 clarifying questions.\nObservation: Wait for answers.\nRepeat the loop once. Then output a step-by-step plan with milestones and risks.`
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// COMMON PROBLEMS DATA (ALL 6)
// ═══════════════════════════════════════════════════════════════════════════

const commonProblems = [
  {
    problem: "Too Vague",
    fix: "Include course level, focus, and objectives.",
    example: "Instead of 'Write a quiz', try 'Write 5 multiple-choice questions for Intro Biology covering Chapter 3 (cell structure), aligned to these learning objectives: [paste].'"
  },
  {
    problem: "No Audience Level",
    fix: "Specify the intended audience (e.g., 'first-year non-majors').",
    example: "Add: 'The students are first-year non-majors with no prior statistics background.'"
  },
  {
    problem: "Missing Format or Length",
    fix: "State the format (bullets, table, paragraph) and desired length.",
    example: "Add: 'Respond in bullet points, maximum 150 words.'"
  },
  {
    problem: "Overloaded Prompts",
    fix: "Break requests into smaller, sequential prompts.",
    example: "Instead of one giant prompt, use: Prompt 1 (generate outline) → Prompt 2 (expand section 1) → Prompt 3 (expand section 2)."
  },
  {
    problem: "No Role or Tone",
    fix: "Assign a role (e.g., 'You are a supportive writing tutor…') to anchor the voice.",
    example: "Start with: 'You are a patient, encouraging writing tutor for first-generation college students.'"
  },
  {
    problem: "No Iteration or Verification",
    fix: "Review, refine, and verify before use.",
    example: "After getting output, ask: 'Review your answer for accuracy. Flag any claims you're uncertain about.'"
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// REFINEMENT WORKFLOW (8 STEPS)
// ═══════════════════════════════════════════════════════════════════════════

const refinementSteps = [
  { step: 1, title: "Define Your Goal", desc: "What specific outcome do you need? Be concrete." },
  { step: 2, title: "Add Context", desc: "Course level, audience, constraints, source materials." },
  { step: 3, title: "Draft Clearly", desc: "Write the prompt with explicit instructions and format." },
  { step: 4, title: "Test", desc: "Run the prompt and examine the output critically." },
  { step: 5, title: "Spot Gaps", desc: "Where did it miss? What was vague or wrong?" },
  { step: 6, title: "Refine", desc: "Adjust wording, add examples, clarify constraints." },
  { step: 7, title: "Iterate", desc: "Repeat until output consistently meets your needs." },
  { step: 8, title: "Document", desc: "Save successful prompts for reuse and sharing." }
];

// ═══════════════════════════════════════════════════════════════════════════
// TUNING CHECKLIST (7 ITEMS)
// ═══════════════════════════════════════════════════════════════════════════

const tuningChecklist = [
  { item: "Clarity", question: "Is the task unambiguous? Would another instructor interpret it the same way?" },
  { item: "Context", question: "Have I included course level, audience, and any necessary background?" },
  { item: "Format", question: "Did I specify the output structure (bullets, table, paragraph, length)?" },
  { item: "Tone & Style", question: "Is the expected voice clear (formal, conversational, encouraging)?" },
  { item: "Cognitive Level", question: "Does my prompt target the right Bloom's level (recall vs. analysis vs. synthesis)?" },
  { item: "Academic Fit", question: "Will the output align with my discipline's conventions and expectations?" },
  { item: "Inclusivity", question: "Is the prompt free of assumptions that could exclude or disadvantage some students?" }
];

// ═══════════════════════════════════════════════════════════════════════════
// REFERENCES (19 SOURCES)
// ═══════════════════════════════════════════════════════════════════════════

const references = [
  { category: "Foundational Research", items: [
    { author: "Brown et al.", title: "Language Models are Few-Shot Learners", year: "2020", note: "GPT-3 paper introducing few-shot prompting" },
    { author: "Wei et al.", title: "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models", year: "2022", note: "Foundational CoT paper" },
    { author: "Kojima et al.", title: "Large Language Models are Zero-Shot Reasoners", year: "2022", note: "'Let's think step by step' discovery" },
    { author: "Yao et al.", title: "Tree of Thoughts: Deliberate Problem Solving with Large Language Models", year: "2023", note: "ToT framework" },
    { author: "Yao et al.", title: "ReAct: Synergizing Reasoning and Acting in Language Models", year: "2022", note: "ReAct framework" },
  ]},
  { category: "Prompt Engineering Guides", items: [
    { author: "OpenAI", title: "Best Practices for Prompt Engineering", year: "2023", note: "Official OpenAI guide" },
    { author: "Anthropic", title: "Prompt Engineering Guide", year: "2024", note: "Claude-specific techniques" },
    { author: "Google", title: "Introduction to Prompt Design", year: "2023", note: "Gemini/PaLM guidance" },
    { author: "Giray, L.", title: "Prompt Engineering with ChatGPT: A Guide for Academic Writers", year: "2023", note: "Academic focus" },
  ]},
  { category: "Higher Education Applications", items: [
    { author: "Mollick, E. & Mollick, L.", title: "Assigning AI: Seven Approaches for Students, with Prompts", year: "2023", note: "Wharton faculty guide" },
    { author: "Bowen, J. & Watson, C.E.", title: "Teaching with AI: A Practical Guide", year: "2024", note: "Comprehensive teaching guide" },
    { author: "Stanford HAI", title: "AI in Education: Promises and Implications", year: "2023", note: "Policy perspective" },
    { author: "EDUCAUSE", title: "2024 Horizon Report: Teaching and Learning Edition", year: "2024", note: "Trends in ed-tech" },
  ]},
  { category: "Ethics & Policy", items: [
    { author: "UNESCO", title: "Guidance for Generative AI in Education and Research", year: "2023", note: "International framework" },
    { author: "Eaton, S.E.", title: "Academic Integrity and Artificial Intelligence", year: "2023", note: "Integrity considerations" },
    { author: "MLA-CCCC", title: "Working Paper on AI Writing Tools", year: "2023", note: "Disciplinary guidance" },
  ]},
  { category: "Practical Technique Guides", items: [
    { author: "Saravia, E.", title: "Prompt Engineering Guide", year: "2024", note: "Comprehensive open-source resource" },
    { author: "Shieh, J.", title: "Best Practices for Prompt Engineering", year: "2023", note: "Microsoft patterns" },
    { author: "White et al.", title: "A Prompt Pattern Catalog", year: "2023", note: "Systematic pattern language" },
  ]}
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Beginner": return { bg: "var(--cyan-dim)", color: "var(--cyan)" };
    case "Intermediate": return { bg: "var(--amber-dim)", color: "var(--amber)" };
    case "Advanced": return { bg: "var(--magenta-dim)", color: "var(--magenta)" };
    default: return { bg: "var(--surface)", color: "var(--text-muted)" };
  }
}

function TechniqueCard({ technique, index, isExpanded, onToggle }: {
  technique: typeof coreTechniques[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const diffColors = getDifficultyColor(technique.difficulty);
  const accentColor = paletteFor(index);

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)]">
      {/* Accent bar */}
      <div className="h-[3px]" style={{ background: accentColor }} />

      {/* Header - always visible */}
      <div
        className="p-5 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {/* Badges */}
            <div className="flex gap-2 mb-2 flex-wrap">
              <span
                className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px]"
                style={{ background: diffColors.bg, color: diffColors.color }}
              >
                {technique.difficulty}
              </span>
              {technique.startHere && (
                <span className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[var(--cyan-dim)] text-[var(--cyan)]">
                  Start Here
                </span>
              )}
            </div>

            {/* Name */}
            <h3 className="font-sans text-[1.1rem] font-bold leading-tight mb-2" style={{ color: accentColor }}>
              {technique.name}
            </h3>

            {/* Use when */}
            <p className="text-[0.78rem] text-[var(--text-muted)] leading-relaxed">
              <span className="text-[var(--text-secondary)] font-medium">Use when:</span> {technique.useWhen}
            </p>
          </div>

          {/* Expand icon */}
          <div className="text-[var(--text-muted)] mt-1">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-[var(--border)] pt-4 space-y-4 animate-[fadeIn_0.2s_ease-out]">
          {/* Definition */}
          <div>
            <h4 className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-1">Definition</h4>
            <p className="text-[0.82rem] text-[var(--text-secondary)] leading-relaxed">{technique.definition}</p>
          </div>

          {/* Use Case */}
          <div>
            <h4 className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-1">Use Case (Higher Ed)</h4>
            <p className="text-[0.82rem] text-[var(--text-secondary)] leading-relaxed">{technique.useCase}</p>
          </div>

          {/* When/Why */}
          <div>
            <h4 className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-1">When & Why</h4>
            <p className="text-[0.82rem] text-[var(--text-secondary)] leading-relaxed">{technique.whenWhy}</p>
          </div>

          {/* Example Prompts */}
          <div>
            <h4 className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-2">Example Prompts</h4>
            <div className="space-y-3">
              {technique.prompts.map((prompt, i) => (
                <div key={i} className="relative">
                  <div className="font-mono text-[0.72rem] text-[var(--cyan)] bg-[var(--bg)] border border-[rgba(0,212,255,0.15)] rounded-[8px] p-3 leading-[1.6] pr-16 whitespace-pre-wrap">
                    {prompt.split(/(\[[^\]]+\])/).map((part, j) => {
                      if (part.startsWith('[') && part.endsWith(']')) {
                        return <span key={j} className="text-[var(--amber)] font-semibold">{part}</span>;
                      }
                      return part;
                    })}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopy(prompt, i); }}
                    className="absolute top-2 right-2 font-mono text-[0.55rem] text-[var(--cyan)] px-2 py-1 rounded-[4px] border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.06)] hover:bg-[rgba(0,212,255,0.15)] transition-colors flex items-center gap-1"
                  >
                    {copiedIndex === i ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PromptNavigatorSections() {
  const [expandedTechnique, setExpandedTechnique] = useState<number | null>(null);
  const [showReferences, setShowReferences] = useState(false);

  return (
    <div className="space-y-16">
      {/* ═══════════════════════════════════════════════════════════════════
          SECTION NAV CARDS
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="max-w-[var(--max-w)] mx-auto px-[var(--px)]">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Core Techniques", count: "9 techniques", href: "#techniques", color: "var(--cyan)" },
            { title: "Common Problems", count: "6 fixes", href: "#problems", color: "var(--amber)" },
            { title: "Refinement Workflow", count: "8 steps", href: "#workflow", color: "var(--magenta)" },
            { title: "References", count: "19 sources", href: "#references", color: "var(--purple)" },
          ].map((nav) => (
            <a
              key={nav.title}
              href={nav.href}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[12px] p-4 hover:border-[var(--border-hover)] transition-all group"
            >
              <div className="font-sans text-[0.95rem] font-bold mb-1 group-hover:text-[var(--cyan)] transition-colors">
                {nav.title}
              </div>
              <div className="font-mono text-[0.65rem] text-[var(--text-muted)]">{nav.count}</div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CORE TECHNIQUES (9)
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="techniques" className="max-w-[var(--max-w)] mx-auto px-[var(--px)]">
        <div className="mb-6">
          <h2 className="font-sans text-[1.5rem] font-bold mb-2">
            Core Prompting Techniques
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-[var(--cyan)] to-transparent rounded-full mb-3" />
          <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[600px]">
            Master these 9 techniques to unlock the full potential of AI in your teaching.
            Start with the basics, then progress to advanced strategies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {coreTechniques.map((technique, i) => (
            <TechniqueCard
              key={technique.name}
              technique={technique}
              index={i}
              isExpanded={expandedTechnique === i}
              onToggle={() => setExpandedTechnique(expandedTechnique === i ? null : i)}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          COMMON PROBLEMS (6)
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="problems" className="max-w-[var(--max-w)] mx-auto px-[var(--px)]">
        <div className="mb-6">
          <h2 className="font-sans text-[1.5rem] font-bold mb-2">
            Common Prompt Problems (And How to Fix Them)
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-[var(--amber)] to-transparent rounded-full mb-3" />
          <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[600px]">
            Most prompt failures come from these 6 common mistakes. Learn to recognize and fix them.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {commonProblems.map((item) => (
            <div
              key={item.problem}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 hover:border-[var(--border-hover)] transition-all"
            >
              {/* Problem */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-mono text-[0.55rem] font-semibold px-2 py-[3px] rounded-[4px] bg-[var(--magenta-dim)] text-[var(--magenta)]">
                  PROBLEM
                </span>
                <span className="font-bold text-[0.95rem]">{item.problem}</span>
              </div>

              {/* Fix */}
              <div className="mb-3">
                <span className="font-mono text-[0.55rem] font-semibold text-[var(--cyan)] block mb-1">FIX:</span>
                <p className="text-[0.82rem] text-[var(--text-secondary)] leading-relaxed">{item.fix}</p>
              </div>

              {/* Example */}
              <div className="text-[0.75rem] text-[var(--text-muted)] leading-relaxed p-2 bg-[var(--surface-1)] rounded-[6px] border-l-2 border-[var(--cyan)]">
                {item.example}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          REFINEMENT WORKFLOW & CHECKLIST
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="workflow" className="max-w-[var(--max-w)] mx-auto px-[var(--px)]">
        <div className="mb-6">
          <h2 className="font-sans text-[1.5rem] font-bold mb-2">
            Refinement Workflow & Tuning Checklist
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-[var(--magenta)] to-transparent rounded-full mb-3" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Workflow Steps */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6">
            <h3 className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-[var(--magenta)] mb-4">
              8-Step Refinement Workflow
            </h3>
            <div className="space-y-3">
              {refinementSteps.map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center font-mono text-[0.65rem] font-bold text-white shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <span className="font-semibold text-[0.88rem]">{s.title}</span>
                    <p className="text-[0.78rem] text-[var(--text-muted)]">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tuning Checklist */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6">
            <h3 className="font-mono text-[0.7rem] tracking-[0.1em] uppercase text-[var(--cyan)] mb-4">
              7-Point Tuning Checklist
            </h3>
            <div className="space-y-3">
              {tuningChecklist.map((c) => (
                <div key={c.item} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded border-2 border-[var(--cyan)] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[0.88rem] text-[var(--cyan)]">{c.item}</span>
                    <p className="text-[0.78rem] text-[var(--text-muted)]">{c.question}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          REFERENCES (19)
          ═══════════════════════════════════════════════════════════════════ */}
      <section id="references" className="max-w-[var(--max-w)] mx-auto px-[var(--px)]">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden">
          {/* Header - clickable to expand */}
          <div
            className="p-5 cursor-pointer flex items-center justify-between"
            onClick={() => setShowReferences(!showReferences)}
          >
            <div>
              <h2 className="font-sans text-[1.25rem] font-bold mb-1">
                References & Further Reading
              </h2>
              <p className="text-[0.82rem] text-[var(--text-muted)]">
                19 sources across foundational research, guides, and higher ed applications
              </p>
            </div>
            <div className="text-[var(--text-muted)]">
              {showReferences ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
          </div>

          {/* Expanded references */}
          {showReferences && (
            <div className="px-5 pb-5 border-t border-[var(--border)] pt-4 space-y-6 animate-[fadeIn_0.2s_ease-out]">
              {references.map((group) => (
                <div key={group.category}>
                  <h3 className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--purple)] mb-3">
                    {group.category}
                  </h3>
                  <ul className="space-y-2">
                    {group.items.map((ref, i) => (
                      <li key={i} className="text-[0.82rem] text-[var(--text-secondary)] leading-relaxed">
                        <span className="text-[var(--text)]">{ref.author}</span>
                        {" — "}
                        <em>{ref.title}</em>
                        {" "}({ref.year})
                        {ref.note && <span className="text-[var(--text-muted)]"> — {ref.note}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Spacer before prompt templates */}
      <div className="h-4" />
    </div>
  );
}

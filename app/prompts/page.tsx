import PromptNavigatorSections from "@/components/PromptNavigatorSections";
import PromptTemplatesClient, { CopyPromptButton } from "./PromptTemplatesClient";
import { pageMetadata } from "@/lib/og";

export const metadata = pageMetadata({
  title: "Prompt Navigator | Innovating Higher Ed",
  description:
    "AI prompts built for higher education. Every prompt is designed for a specific teaching or administrative task — not generic templates.",
  path: "/prompts",
});

// Sample prompt data
const featuredPrompt = {
  title: "Generate Discussion Questions That Actually Spark Debate",
  description:
    "Creates tension-based discussion questions from any reading that students actually want to argue about — not just answer.",
  difficulty: "Beginner",
  category: "Discussion Design",
  prompt: `Read this [text/chapter/article]. Identify the central tension or most debatable claim the author makes. Then generate 5 discussion questions that force students to take a side on that tension. Each question should: (1) be arguable from at least two perspectives, (2) connect to students' lived experience, and (3) resist a simple "right answer." Format as numbered questions with a one-line note explaining what makes each one productive.`,
  tip: `Replace "lived experience" with a specific context for your discipline. For a nursing class: "connect to clinical scenarios." For business: "connect to workplace decisions they've faced."`,
};

const prompts = [
  {
    title: "AI-Resistant Assignment Redesigner",
    description:
      "Analyzes your existing assignment and suggests modifications that maintain learning outcomes while reducing AI shortcutting.",
    difficulty: "Intermediate",
    category: "Assessment",
    preview: `"Here is my assignment: [paste]. Analyze which parts a student could complete using AI without learning. Suggest 3 specific modifications that preserve the learning outcome but require original thinking..."`,
  },
  {
    title: "Rubric-Based Feedback Draft Generator",
    description:
      "Generates detailed, constructive student feedback aligned to your specific rubric. You review and personalize before sending.",
    difficulty: "Beginner",
    category: "Feedback",
    preview: `"Using this rubric [paste], generate detailed feedback for this student submission [paste]. Score each criterion and provide specific, constructive comments that explain what was done well and how to improve..."`,
  },
  {
    title: "Syllabus FAQ Bot Builder",
    description:
      'Turns your syllabus into a Q&A knowledge base students can query. Cuts down on repetitive "Is this on the exam?" emails.',
    difficulty: "Beginner",
    category: "Course Design",
    isNew: true,
    preview: `"Here is my course syllabus [paste]. Extract every fact, deadline, policy, and expectation. Create a comprehensive Q&A format with 30+ questions a student might ask, and answers drawn only from the syllabus..."`,
  },
  {
    title: "Literature Review Gap Finder",
    description:
      "Analyzes a set of papers and identifies where the literature has gaps, contradictions, or underexplored angles for your research.",
    difficulty: "Advanced",
    category: "Research",
    preview: `"Here are summaries of [N] papers in my research area [paste]. Identify: (1) the 3 most significant gaps in the current literature, (2) contradictions between findings, (3) methodological weaknesses that appear across multiple studies..."`,
  },
  {
    title: "Student Peer Review Guide Generator",
    description:
      "Creates structured peer review worksheets tailored to your specific assignment type and learning goals.",
    difficulty: "Beginner",
    category: "Writing",
    preview: `"For this assignment [paste description], create a peer review guide with 8-10 specific questions students should answer about their partner's work. Questions should focus on [argument quality / evidence / structure]..."`,
  },
  {
    title: "Meeting Minutes to Action Items Converter",
    description:
      "Turns messy meeting notes into clean action items with owners, deadlines, and dependencies. Built for department and committee meetings.",
    difficulty: "Intermediate",
    category: "Admin",
    preview: `"Here are notes from our [department/committee] meeting [paste]. Extract every action item, decision, and open question. Format as: Action Item | Owner | Deadline | Dependencies. Flag items that need follow-up..."`,
  },
  {
    title: "Backward Design Course Builder",
    description:
      "Takes your learning outcomes and generates a complete course arc: weekly topics, assessment sequence, and alignment matrix.",
    difficulty: "Advanced",
    category: "Course Design",
    preview: `"My course has these learning outcomes: [paste]. Design a 15-week course arc where each week builds toward one or more outcomes. Include: weekly topic, key readings/activities, formative assessment, and which outcomes are addressed..."`,
  },
  {
    title: "Encouraging Feedback Rewriter",
    description:
      "Takes your honest but blunt feedback and rewrites it to be constructive, specific, and growth-oriented while preserving the substance.",
    difficulty: "Beginner",
    category: "Feedback",
    isNew: true,
    preview: `"Here is my feedback for a student [paste]. Rewrite it to: (1) lead with something specific the student did well, (2) frame critiques as opportunities for growth, (3) end with one concrete next step. Keep the substance identical..."`,
  },
  {
    title: "Case Study Scenario Generator",
    description:
      "Creates realistic, discipline-specific case studies with built-in ethical dilemmas and decision points for classroom discussion.",
    difficulty: "Intermediate",
    category: "Discussion",
    preview: `"Create a realistic case study for a [discipline] course on [topic]. Include: a named protagonist with a specific role, a realistic organizational context, a decision point with at least 3 viable options, and consequences..."`,
  },
];

const categories = [
  "All",
  "Discussion",
  "Assessment",
  "Feedback",
  "Course Design",
  "Research",
  "Writing",
  "Admin",
];

const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function PromptsPage() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-6 animate-[fadeUp_0.7s_ease-out_both]">
        <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--purple)] mb-2 flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--purple)]" />
          PROMPT NAVIGATOR
        </div>
        <h1 className="page-title mb-3">
          AI Prompts Built for Higher Education
        </h1>
        <p className="text-[0.92rem] text-[var(--text-secondary)] max-w-[620px] leading-[1.6]">
          Every prompt is designed for a specific teaching or administrative
          task — not generic templates.
        </p>
      </div>

      {/* Featured Prompt - Split Card with Actual Prompt */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-10">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--purple)] via-[var(--cyan)] to-[var(--magenta)]" />

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Info */}
            <div>
              <div className="flex gap-2 mb-3 flex-wrap">
                <span className="font-mono text-[0.55rem] font-semibold px-2 py-[3px] rounded-[4px] bg-[var(--cyan-dim)] text-[var(--cyan)]">
                  {featuredPrompt.difficulty}
                </span>
                <span className="font-mono text-[0.55rem] font-semibold px-2 py-[3px] rounded-[4px] bg-[var(--purple-dim)] text-[var(--purple)]">
                  {featuredPrompt.category}
                </span>
                <span className="font-mono text-[0.55rem] font-semibold px-2 py-[3px] rounded-[4px] bg-[var(--amber-dim)] text-[var(--amber)]">
                  Featured
                </span>
              </div>
              <h2 className="font-sans text-[1.4rem] font-bold leading-[1.22] mb-3">
                {featuredPrompt.title}
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.65] mb-4">
                {featuredPrompt.description}
              </p>
            </div>

            {/* Right - Prompt Text in Cyan Code Box */}
            <div>
              <div className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-2">
                The Prompt
              </div>
              <div className="font-mono text-[0.75rem] text-[var(--cyan)] bg-[rgba(0,212,255,0.04)] border border-[rgba(0,212,255,0.1)] rounded-[10px] p-4 leading-[1.6] mb-4">
                {featuredPrompt.prompt.split('[').map((part, i) => {
                  if (i === 0) return part;
                  const [variable, rest] = part.split(']');
                  return (
                    <span key={i}>
                      <span className="text-[var(--amber)] font-semibold">[{variable}]</span>
                      {rest}
                    </span>
                  );
                })}
              </div>
              <CopyPromptButton
                text={featuredPrompt.prompt}
                label="Copy prompt"
                ariaLabel="Copy prompt to clipboard"
                className="inline-flex items-center gap-2 font-mono text-[0.68rem] text-[var(--cyan)] px-4 py-2 rounded-[8px] bg-[var(--cyan-dim)] border border-[rgba(0,212,255,0.2)] hover:bg-[rgba(0,212,255,0.2)] transition-colors font-medium"
              />
              <div className="mt-4 text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] p-3 bg-[rgba(200,80,192,0.04)] border-l-2 border-[var(--magenta)] rounded-r-[6px]">
                <strong className="text-[var(--magenta)] font-semibold text-[0.6rem] font-mono tracking-[0.06em] uppercase block mb-1">
                  Pro tip
                </strong>
                {featuredPrompt.tip}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Techniques, Common Problems, Workflow, References */}
      <PromptNavigatorSections />

      {/* Section divider before templates */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-8">
        <div className="border-t border-[var(--border)]" />
      </div>

      {/* PROMPT TEMPLATES section header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-6">
        <h2 className="font-sans text-[1.5rem] font-bold mb-2">
          Prompt Templates
        </h2>
        <div className="h-[2px] w-24 bg-gradient-to-r from-[var(--purple)] to-transparent rounded-full mb-3" />
        <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[600px]">
          Ready-to-use prompts for common teaching tasks. Copy, customize, and deploy.
        </p>
      </div>

      {/* Filters + Search + Grid (interactive) */}
      <PromptTemplatesClient
        prompts={prompts}
        categories={categories}
        difficulties={difficulties}
      />

      {/* Submit a Prompt CTA */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--purple)] to-[var(--cyan)]" />

          <h2 className="font-sans text-[1.5rem] font-bold mb-2">
            Share Your Best Prompts
          </h2>
          <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[480px] mx-auto mb-6">
            Built a prompt that works great in your classroom? Submit it to the
            Navigator and help other educators skip the trial and error.
          </p>
          <a
            href="mailto:hello@innovatinghighered.com?subject=Prompt%20submission%20for%20the%20Prompt%20Navigator"
            className="btn-primary inline-block"
          >
            Submit a Prompt
          </a>
        </div>
      </div>
    </div>
  );
}

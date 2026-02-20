import Link from "next/link";

export const metadata = {
  title: "Prompt Navigator | Innovating Higher Ed",
  description:
    "AI prompts built for higher education. Tested, refined, and rated by real faculty. Every prompt is designed for a specific teaching or administrative task.",
};

// Sample prompt data
const featuredPrompt = {
  title: "Generate Discussion Questions That Actually Spark Debate",
  description:
    "Creates tension-based discussion questions from any reading that students actually want to argue about — not just answer. Tested across 30 courses with consistently higher engagement than generic questions.",
  difficulty: "Beginner",
  category: "Discussion Design",
  uses: "3.1k",
  rating: "4.9",
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
    uses: "1.8k",
    rating: "4.7",
    preview: `"Here is my assignment: [paste]. Analyze which parts a student could complete using AI without learning. Suggest 3 specific modifications that preserve the learning outcome but require original thinking..."`,
  },
  {
    title: "Rubric-Based Feedback Draft Generator",
    description:
      "Generates detailed, constructive student feedback aligned to your specific rubric. You review and personalize before sending.",
    difficulty: "Beginner",
    category: "Feedback",
    uses: "3.1k",
    rating: "4.9",
    trending: true,
    preview: `"Using this rubric [paste], generate detailed feedback for this student submission [paste]. Score each criterion and provide specific, constructive comments that explain what was done well and how to improve..."`,
  },
  {
    title: "Syllabus FAQ Bot Builder",
    description:
      'Turns your syllabus into a Q&A knowledge base students can query. Reduces repetitive "Is this on the exam?" emails by 80%.',
    difficulty: "Beginner",
    category: "Course Design",
    uses: "940",
    rating: "4.6",
    isNew: true,
    preview: `"Here is my course syllabus [paste]. Extract every fact, deadline, policy, and expectation. Create a comprehensive Q&A format with 30+ questions a student might ask, and answers drawn only from the syllabus..."`,
  },
  {
    title: "Literature Review Gap Finder",
    description:
      "Analyzes a set of papers and identifies where the literature has gaps, contradictions, or underexplored angles for your research.",
    difficulty: "Advanced",
    category: "Research",
    uses: "720",
    rating: "4.8",
    preview: `"Here are summaries of [N] papers in my research area [paste]. Identify: (1) the 3 most significant gaps in the current literature, (2) contradictions between findings, (3) methodological weaknesses that appear across multiple studies..."`,
  },
  {
    title: "Student Peer Review Guide Generator",
    description:
      "Creates structured peer review worksheets tailored to your specific assignment type and learning goals.",
    difficulty: "Beginner",
    category: "Writing",
    uses: "1.2k",
    rating: "4.5",
    trending: true,
    preview: `"For this assignment [paste description], create a peer review guide with 8-10 specific questions students should answer about their partner's work. Questions should focus on [argument quality / evidence / structure]..."`,
  },
  {
    title: "Meeting Minutes to Action Items Converter",
    description:
      "Turns messy meeting notes into clean action items with owners, deadlines, and dependencies. Built for department and committee meetings.",
    difficulty: "Intermediate",
    category: "Admin",
    uses: "2.1k",
    rating: "4.8",
    preview: `"Here are notes from our [department/committee] meeting [paste]. Extract every action item, decision, and open question. Format as: Action Item | Owner | Deadline | Dependencies. Flag items that need follow-up..."`,
  },
  {
    title: "Backward Design Course Builder",
    description:
      "Takes your learning outcomes and generates a complete course arc: weekly topics, assessment sequence, and alignment matrix.",
    difficulty: "Advanced",
    category: "Course Design",
    uses: "560",
    rating: "4.7",
    preview: `"My course has these learning outcomes: [paste]. Design a 15-week course arc where each week builds toward one or more outcomes. Include: weekly topic, key readings/activities, formative assessment, and which outcomes are addressed..."`,
  },
  {
    title: "Encouraging Feedback Rewriter",
    description:
      "Takes your honest but blunt feedback and rewrites it to be constructive, specific, and growth-oriented while preserving the substance.",
    difficulty: "Beginner",
    category: "Feedback",
    uses: "1.4k",
    rating: "4.9",
    isNew: true,
    preview: `"Here is my feedback for a student [paste]. Rewrite it to: (1) lead with something specific the student did well, (2) frame critiques as opportunities for growth, (3) end with one concrete next step. Keep the substance identical..."`,
  },
  {
    title: "Case Study Scenario Generator",
    description:
      "Creates realistic, discipline-specific case studies with built-in ethical dilemmas and decision points for classroom discussion.",
    difficulty: "Intermediate",
    category: "Discussion",
    uses: "890",
    rating: "4.6",
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

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Beginner":
      return { bg: "var(--green-dim)", color: "var(--green)" };
    case "Intermediate":
      return { bg: "var(--amber-dim)", color: "var(--amber)" };
    case "Advanced":
      return { bg: "var(--red-dim)", color: "var(--red)" };
    default:
      return { bg: "var(--surface)", color: "var(--text-muted)" };
  }
}

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
          Tested, refined, and rated by real faculty. Every prompt is designed
          for a specific teaching or administrative task — not generic templates.
        </p>
        <div className="flex gap-6 mt-4 font-mono text-[0.68rem] text-[var(--text-muted)]">
          <span>
            <strong className="text-[var(--cyan)]">2,400+</strong> prompts curated
          </span>
          <span>
            <strong className="text-[var(--cyan)]">48k</strong> total uses
          </span>
          <span>
            <strong className="text-[var(--cyan)]">340</strong> contributors
          </span>
        </div>
      </div>

      {/* Featured Prompt - Split Card with Actual Prompt */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-10">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-6 lg:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--purple)] via-[var(--cyan)] to-[var(--magenta)]" />

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left - Info */}
            <div>
              <div className="flex gap-2 mb-3 flex-wrap">
                <span
                  className="font-mono text-[0.55rem] font-semibold px-2 py-[3px] rounded-[4px]"
                  style={getDifficultyColor(featuredPrompt.difficulty)}
                >
                  {featuredPrompt.difficulty}
                </span>
                <span className="font-mono text-[0.55rem] font-semibold px-2 py-[3px] rounded-[4px] bg-[var(--purple-dim)] text-[var(--purple)]">
                  {featuredPrompt.category}
                </span>
                <span className="font-mono text-[0.55rem] font-semibold px-2 py-[3px] rounded-[4px] bg-[var(--amber-dim)] text-[var(--amber)]">
                  Most Used This Week
                </span>
              </div>
              <h2 className="font-sans text-[1.4rem] font-bold leading-[1.22] mb-3">
                {featuredPrompt.title}
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.65] mb-4">
                {featuredPrompt.description}
              </p>
              <div className="font-mono text-[0.62rem] text-[var(--text-muted)] flex gap-4">
                <span className="text-[var(--green)]">{featuredPrompt.uses} uses</span>
                <span>Updated Feb 14</span>
                <span>&#9733; {featuredPrompt.rating} avg rating</span>
              </div>
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
              <button className="inline-flex items-center gap-2 font-mono text-[0.68rem] text-[var(--cyan)] px-4 py-2 rounded-[8px] bg-[var(--cyan-dim)] border border-[rgba(0,212,255,0.2)] hover:bg-[rgba(0,212,255,0.2)] transition-colors font-medium">
                <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] stroke-current" fill="none" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy prompt
              </button>
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

      {/* Filters - Two Rows: Difficulty + Category */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-6">
        {/* Difficulty Row with colored pills */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-mono text-[0.58rem] text-[var(--text-muted)] tracking-[0.08em] uppercase min-w-[60px]">
            Difficulty
          </span>
          {difficulties.map((d, i) => {
            const colors = getDifficultyColor(d);
            const isActive = i === 0;
            return (
              <button
                key={d}
                className={`font-mono text-[0.62rem] font-medium px-3 py-1 rounded-full border transition-all duration-200 ${
                  isActive
                    ? "bg-[rgba(255,255,255,0.08)] text-[var(--text)] border-[rgba(255,255,255,0.15)]"
                    : "border-[var(--border)] hover:border-[var(--border-hover)]"
                }`}
                style={
                  !isActive && d !== "All Levels"
                    ? {
                        color: colors.color,
                        borderColor: `${colors.color}30`,
                      }
                    : undefined
                }
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Category Row */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[0.58rem] text-[var(--text-muted)] tracking-[0.08em] uppercase min-w-[60px]">
            Category
          </span>
          {categories.map((c, i) => (
            <button
              key={c}
              className={`font-mono text-[0.62rem] font-medium px-3 py-1 rounded-full border transition-all duration-200 ${
                i === 0
                  ? "bg-[rgba(255,255,255,0.08)] text-[var(--text)] border-[rgba(255,255,255,0.15)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-8">
        <div className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] px-4 py-3 max-w-[400px]">
          <svg className="w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search prompts by keyword or task..."
            className="bg-transparent border-none outline-none text-[0.82rem] text-[var(--text)] placeholder:text-[var(--text-muted)] flex-1"
          />
        </div>
      </div>

      {/* Prompt Grid */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {prompts.map((prompt, i) => (
            <div
              key={i}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--purple)] to-[var(--cyan)]" />

              {/* Tags */}
              <div className="flex gap-2 mb-3 flex-wrap">
                <span
                  className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px]"
                  style={getDifficultyColor(prompt.difficulty)}
                >
                  {prompt.difficulty}
                </span>
                <span className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[var(--purple-dim)] text-[var(--purple)]">
                  {prompt.category}
                </span>
                {prompt.trending && (
                  <span className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[var(--amber-dim)] text-[var(--amber)]">
                    Trending
                  </span>
                )}
                {prompt.isNew && (
                  <span className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[var(--cyan-dim)] text-[var(--cyan)]">
                    New
                  </span>
                )}
              </div>

              {/* Title - DM Sans Bold */}
              <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-2">
                {prompt.title}
              </h3>

              {/* Description */}
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-3">
                {prompt.description}
              </p>

              {/* Preview in cyan box */}
              <div className="font-mono text-[0.68rem] text-[var(--cyan)] bg-[rgba(0,212,255,0.04)] border border-[rgba(0,212,255,0.08)] rounded-[7px] px-3 py-2 leading-[1.5] mb-3 line-clamp-3">
                {prompt.preview}
              </div>

              {/* Footer with copy button */}
              <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)] font-mono text-[0.55rem] text-[var(--text-muted)]">
                <span className="text-[var(--green)]">{prompt.uses} uses</span>
                <span>&#9733; {prompt.rating}</span>
                <button className="ml-auto text-[var(--cyan)] px-2 py-[3px] rounded-[4px] border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.06)] hover:bg-[rgba(0,212,255,0.12)] transition-colors">
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="font-mono text-[0.72rem] text-[var(--cyan)] px-6 py-2.5 rounded-[8px] border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.06)] hover:bg-[rgba(0,212,255,0.12)] hover:border-[rgba(0,212,255,0.3)] transition-all tracking-[0.04em]">
            Load more prompts
          </button>
        </div>
      </div>

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
          <button className="btn-primary">Submit a Prompt</button>
        </div>
      </div>
    </div>
  );
}

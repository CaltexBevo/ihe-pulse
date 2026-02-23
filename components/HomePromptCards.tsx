'use client';

import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface Prompt {
  title: string;
  desc: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  uses: string;
  trending: boolean;
  preview: string;
  fullPrompt: string;
  tip?: string;
}

const prompts: Prompt[] = [
  {
    title: "Generate Discussion Questions That Actually Spark Debate",
    desc: "Creates tension-based discussion questions from any reading that students actually want to argue about — not just answer.",
    difficulty: "Beginner",
    category: "Discussion",
    uses: "2.4k",
    trending: true,
    preview: '"Read this [text]. Identify the central tension or most debatable claim. Generate 5 discussion questions that force students to take a side..."',
    fullPrompt: `Read this [text/chapter/article]. Identify the central tension or most debatable claim the author makes. Then generate 5 discussion questions that force students to take a side on that tension. Each question should: (1) be arguable from at least two perspectives, (2) connect to students' lived experience, and (3) resist a simple "right answer." Format as numbered questions with a one-line note explaining what makes each one productive.`,
    tip: `Replace "lived experience" with a specific context for your discipline. For a nursing class: "connect to clinical scenarios." For business: "connect to workplace decisions they've faced."`,
  },
  {
    title: "AI-Resistant Assignment Redesigner",
    desc: "Analyzes your existing assignment and suggests modifications that maintain learning outcomes while reducing AI shortcutting.",
    difficulty: "Intermediate",
    category: "Assessment",
    uses: "1.8k",
    trending: false,
    preview: '"Here is my assignment: [paste]. Analyze which parts a student could complete using AI without learning. Suggest modifications..."',
    fullPrompt: `Here is my assignment: [paste full assignment instructions]. Analyze this assignment in detail. First, identify which parts a student could complete using AI without actually learning the material. Then, suggest 3 specific modifications that: (1) preserve the original learning outcomes, (2) require original thinking or personal experience that AI cannot fabricate, and (3) make AI assistance useful rather than a shortcut. For each modification, explain why it works.`,
    tip: `After getting suggestions, ask the AI to "now generate a student-facing version of this modified assignment with clear instructions."`,
  },
  {
    title: "Rubric-Based Feedback Draft Generator",
    desc: "Generates detailed, constructive student feedback aligned to your specific rubric criteria. You review and personalize before sending.",
    difficulty: "Beginner",
    category: "Feedback",
    uses: "3.1k",
    trending: true,
    preview: '"Using this rubric [paste rubric], generate detailed feedback for this student submission [paste]. Score each criterion..."',
    fullPrompt: `Using this rubric [paste your rubric here], generate detailed feedback for this student submission [paste student work here]. For each criterion in the rubric: (1) assign a score, (2) explain specifically what the student did well, (3) identify one specific area for improvement with a concrete example of how to improve it. End with an encouraging summary that acknowledges growth and sets a clear next step. Tone should be warm but honest.`,
    tip: `Always review and personalize the feedback before sending. Add specific references to things you noticed in class or previous assignments to make it feel less generic.`,
  },
];

export default function HomePromptCards() {
  const [expandedPrompt, setExpandedPrompt] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const closeModal = () => {
    setExpandedPrompt(null);
    setCopied(false);
  };

  return (
    <>
      <div className="grid-3">
        {prompts.map((prompt, i) => (
          <div
            key={i}
            onClick={() => setExpandedPrompt(i)}
            className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] cursor-pointer relative overflow-hidden"
          >
            {/* Gradient Top Border */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--purple)] to-[var(--cyan)]" />

            {/* Badges */}
            <div className="flex gap-2 mb-3 flex-wrap">
              <span
                className={`font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] ${
                  prompt.difficulty === "Beginner"
                    ? "bg-[var(--green-dim)] text-[var(--green)]"
                    : prompt.difficulty === "Intermediate"
                      ? "bg-[var(--amber-dim)] text-[var(--amber)]"
                      : "bg-[var(--red-dim)] text-[var(--red)]"
                }`}
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
            </div>

            {/* Title */}
            <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-2">
              {prompt.title}
            </h3>

            {/* Description */}
            <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-3">
              {prompt.desc}
            </p>

            {/* Prompt Preview Box */}
            <div className="font-mono text-[0.7rem] text-[var(--cyan)] bg-[rgba(0,212,255,0.04)] border border-[rgba(0,212,255,0.1)] rounded-[7px] p-3 leading-[1.5] mb-3 line-clamp-2">
              {prompt.preview}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-[0.5rem] font-mono text-[0.56rem] text-[var(--text-muted)]">
              <span className="text-[var(--green)]">{prompt.uses} uses</span>
              <span>{prompt.category}</span>
              <span className="ml-auto text-[var(--cyan)] group-hover:text-white transition-colors">
                Click to expand →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {expandedPrompt !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
          onClick={closeModal}
        >
          <div
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto relative animate-[fadeUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Top Border */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--purple)] via-[var(--cyan)] to-[var(--magenta)] rounded-t-[20px]" />

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Badges */}
            <div className="flex gap-2 mb-4 flex-wrap">
              <span
                className={`font-mono text-[0.55rem] font-semibold px-2 py-[3px] rounded-[4px] ${
                  prompts[expandedPrompt].difficulty === "Beginner"
                    ? "bg-[var(--green-dim)] text-[var(--green)]"
                    : prompts[expandedPrompt].difficulty === "Intermediate"
                      ? "bg-[var(--amber-dim)] text-[var(--amber)]"
                      : "bg-[var(--red-dim)] text-[var(--red)]"
                }`}
              >
                {prompts[expandedPrompt].difficulty}
              </span>
              <span className="font-mono text-[0.55rem] font-semibold px-2 py-[3px] rounded-[4px] bg-[var(--purple-dim)] text-[var(--purple)]">
                {prompts[expandedPrompt].category}
              </span>
              {prompts[expandedPrompt].trending && (
                <span className="font-mono text-[0.55rem] font-semibold px-2 py-[3px] rounded-[4px] bg-[var(--amber-dim)] text-[var(--amber)]">
                  Trending
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="font-sans text-[1.4rem] font-bold leading-[1.22] mb-3">
              {prompts[expandedPrompt].title}
            </h2>

            {/* Description */}
            <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.65] mb-5">
              {prompts[expandedPrompt].desc}
            </p>

            {/* Meta */}
            <div className="font-mono text-[0.62rem] text-[var(--text-muted)] flex gap-4 mb-5">
              <span className="text-[var(--green)]">{prompts[expandedPrompt].uses} uses</span>
              <span>★ 4.8 avg rating</span>
            </div>

            {/* Full Prompt */}
            <div className="mb-4">
              <div className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-2">
                The Prompt
              </div>
              <div className="font-mono text-[0.75rem] text-[var(--cyan)] bg-[rgba(0,212,255,0.04)] border border-[rgba(0,212,255,0.1)] rounded-[10px] p-4 leading-[1.6]">
                {prompts[expandedPrompt].fullPrompt.split(/(\[[^\]]+\])/).map((part, i) => {
                  if (part.startsWith('[') && part.endsWith(']')) {
                    return (
                      <span key={i} className="text-[var(--amber)] font-semibold">
                        {part}
                      </span>
                    );
                  }
                  return part;
                })}
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={() => handleCopy(prompts[expandedPrompt].fullPrompt)}
              className="inline-flex items-center gap-2 font-mono text-[0.68rem] text-[var(--cyan)] px-4 py-2 rounded-[8px] bg-[var(--cyan-dim)] border border-[rgba(0,212,255,0.2)] hover:bg-[rgba(0,212,255,0.2)] transition-colors font-medium"
            >
              {copied ? (
                <>
                  <Check size={14} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy prompt
                </>
              )}
            </button>

            {/* Pro Tip */}
            {prompts[expandedPrompt].tip && (
              <div className="mt-5 text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] p-3 bg-[rgba(200,80,192,0.04)] border-l-2 border-[var(--magenta)] rounded-r-[6px]">
                <strong className="text-[var(--magenta)] font-semibold text-[0.6rem] font-mono tracking-[0.06em] uppercase block mb-1">
                  Pro tip
                </strong>
                {prompts[expandedPrompt].tip}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

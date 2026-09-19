import promptTemplates from "@/lib/data/prompt-navigator.json";
import PromptNavigatorSections from "@/components/PromptNavigatorSections";
import PromptTemplatesClient, { CopyPromptButton, PromptGuidance, PromptExamples } from "./PromptTemplatesClient";
import { pageMetadata } from "@/lib/og";

export const metadata = pageMetadata({
  title: "Prompt Navigator | Innovating Higher Ed",
  description:
    "AI prompts built for higher education. Every prompt is designed for a specific teaching or administrative task. Supply your context and check the result.",
  path: "/prompts",
});

const featuredPrompt = promptTemplates[0];
const prompts = promptTemplates.slice(1);

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
          task. Supply your context and check the result.
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
              <PromptGuidance prompt={featuredPrompt} />
              <PromptExamples examples={featuredPrompt.examples} />
            </div>

            {/* Right - Prompt Text in Cyan Code Box */}
            <div>
              <div className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-2">
                The Prompt
              </div>
              <div className="font-mono text-[0.75rem] text-[var(--cyan)] bg-[rgba(0,212,255,0.04)] border border-[rgba(0,212,255,0.1)] rounded-[10px] p-4 leading-[1.6] mb-4 whitespace-pre-wrap break-words">
                {featuredPrompt.prompt}
              </div>
              <CopyPromptButton
                text={featuredPrompt.prompt}
                label="Copy prompt"
                ariaLabel="Copy prompt to clipboard"
                className="inline-flex items-center gap-2 font-mono text-[0.68rem] text-[var(--cyan)] px-4 py-2 rounded-[8px] bg-[var(--cyan-dim)] border border-[rgba(0,212,255,0.2)] hover:bg-[rgba(0,212,255,0.2)] transition-colors font-medium"
              />

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
          Complete prompts for teaching, research and campus work. Copy, customize, and review the result.
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
            Navigator with an example and the limitations you found.
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

import { Metadata } from "next";
import { pageMetadata } from "@/lib/og";

export const metadata: Metadata = pageMetadata({
  title: "AI Disclosure | Innovating Higher Ed",
  description: "How human writing, editorial judgment, and AI tools work together at Innovating Higher Ed, including The Innovation Pulse and Grant Portal.",
  path: "/ai-disclosure",
});

export default function AIDisclosurePage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-12">
        {/* Header */}
        <div className="mb-10 animate-[fadeUp_0.7s_ease-out_both]">
          <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--magenta)] mb-2 flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--magenta)]" />
            Transparency
          </div>
          <h1 className="font-sans text-[clamp(2rem,5vw,2.4rem)] font-bold leading-[1.1] text-[var(--text)] mb-3">
            AI Disclosure
          </h1>
          <p className="text-[0.85rem] text-[var(--text-muted)]">
            Human writing and editorial judgment, supported by AI
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-[800px]">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 md:p-10 space-y-8">
            {/* Mission Statement */}
            <section className="bg-gradient-to-r from-[var(--cyan-dim)] to-[var(--magenta-dim)] rounded-[14px] p-6 border border-[var(--border)]">
              <h2 className="text-[1.1rem] font-bold mb-3 text-[var(--text)]">
                Our Philosophy
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                Innovating Higher Ed brings human expertise, original writing, and editorial judgment to the ideas and resources we share. Dr. Norma Jones, Brent Jones, and our team shape our direction and contribute writing and analysis. Dr. Jones and Brent oversee the work and make the final decisions about what we publish. We also use AI for research, drafting, revision, illustrations, audio production, and development. Our team guides that work and takes responsibility for the finished publication, so you can understand both the human contribution and the technology behind it.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                How People and AI Work Together
              </h2>

              <div className="space-y-4">
                <div className="bg-[var(--surface-1)] rounded-[12px] p-5 border border-[var(--border)]">
                  <h3 className="text-[0.95rem] font-bold mb-2 text-[var(--cyan)]">
                    The Innovation Pulse and Original Features
                  </h3>
                  <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.6]">
                    Our editorial team selects the stories, develops their meaning for higher education, writes and revises coverage, and shapes each weekly edition. Original Features include Dr. Norma Jones&apos;s writing, ideas, and analysis. AI assists with finding sources, organizing research, drafting, and refining language within that editorial process. People determine the final argument, emphasis, and wording before publication. We also use AI to help create illustrations and produce audio, including authorized voice technology based on Dr. Jones&apos;s voice.
                  </p>
                </div>

                <div className="bg-[var(--surface-1)] rounded-[12px] p-5 border border-[var(--border)]">
                  <h3 className="text-[0.95rem] font-bold mb-2 text-[var(--green)]">
                    Prompt Navigator
                  </h3>
                  <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.6]">
                    Educators contribute the teaching goals, subject knowledge, and practical situations behind our prompts. Human writing and editorial work shape their instructions and intended use; AI helps refine wording and explore variations. Our editorial assessment focuses on clear instructions and relevance to educators&apos; work, giving you a practical starting point to adapt to your own context.
                  </p>
                </div>

                <div className="bg-[var(--surface-1)] rounded-[12px] p-5 border border-[var(--border)]">
                  <h3 className="text-[0.95rem] font-bold mb-2 text-[var(--orange)]">
                    AI Directory
                  </h3>
                  <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.6]">
                    Our team guides the research, writes and edits descriptions, and organizes the directory around the questions educators bring to choosing a tool. AI assists with gathering information and drafting within that process. Human editorial decisions shape what we include and how we explain it, with descriptions focused on documented capabilities and potential uses to help you make a more informed choice.
                  </p>
                </div>

                <div className="bg-[var(--surface-1)] rounded-[12px] p-5 border border-[var(--border)]">
                  <h3 className="text-[0.95rem] font-bold mb-2 text-[var(--cyan)]">
                    Grant Portal
                  </h3>
                  <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.6]">
                    Our team sets the Grant Portal&apos;s scope and inclusion standards and shapes the summaries and guidance to help you find opportunities relevant to your work. AI supports grant discovery, source research, drafting, and recurring checks. Published details are checked against official funder sources under our editorial standards. Source links, verification dates, and clearly identified unresolved details help you assess an opportunity&apos;s fit. Human direction and accountability guide both the portal&apos;s design and the standards behind its listings.
                  </p>
                </div>

                <div className="bg-[var(--surface-1)] rounded-[12px] p-5 border border-[var(--border)]">
                  <h3 className="text-[0.95rem] font-bold mb-2 text-[var(--amber)]">
                    Website Development
                  </h3>
                  <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.6]">
                    Brent Jones directs the website&apos;s design, functionality, and development. AI coding assistants help write code, investigate problems, and run checks. Human decisions guide the experience and release of changes, supported by code review, automated tests, and inspection of the actual website.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                What We Don&apos;t Do
              </h2>
              <ul className="space-y-2 text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                <li className="flex items-start gap-3">
                  <span className="text-[var(--red)] mt-[2px]">✕</span>
                  <span>Publish stories or Original Features without human review and editing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--red)] mt-[2px]">✕</span>
                  <span>Present AI opinions as human editorial judgment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--red)] mt-[2px]">✕</span>
                  <span>Use AI to create misleading or deceptive content</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                AI Tools We Use
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7] mb-4">
                Our workflow includes these AI tools and supporting services:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[var(--surface-1)] rounded-[10px] px-4 py-3 border border-[var(--border)]">
                  <span className="text-[0.82rem] text-[var(--text)]">ChatGPT (OpenAI)</span>
                </div>
                <div className="bg-[var(--surface-1)] rounded-[10px] px-4 py-3 border border-[var(--border)]">
                  <span className="text-[0.82rem] text-[var(--text)]">Grok (xAI)</span>
                </div>
                <div className="bg-[var(--surface-1)] rounded-[10px] px-4 py-3 border border-[var(--border)]">
                  <span className="text-[0.82rem] text-[var(--text)]">Claude (Anthropic)</span>
                </div>
                <div className="bg-[var(--surface-1)] rounded-[10px] px-4 py-3 border border-[var(--border)]">
                  <span className="text-[0.82rem] text-[var(--text)]">Claude Code</span>
                </div>
                <div className="bg-[var(--surface-1)] rounded-[10px] px-4 py-3 border border-[var(--border)]">
                  <span className="text-[0.82rem] text-[var(--text)]">ElevenLabs TTS</span>
                </div>
                <div className="bg-[var(--surface-1)] rounded-[10px] px-4 py-3 border border-[var(--border)]">
                  <span className="text-[0.82rem] text-[var(--text)]">Serper API</span>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Questions?
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                We welcome questions about our AI practices. Contact us at{" "}
                <a href="mailto:info@innovatinghighered.com" className="text-[var(--cyan)] hover:underline">
                  info@innovatinghighered.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

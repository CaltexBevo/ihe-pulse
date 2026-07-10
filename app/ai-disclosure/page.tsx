import { Metadata } from "next";
import { pageMetadata } from "@/lib/og";

export const metadata: Metadata = pageMetadata({
  title: "AI Disclosure | Innovating Higher Ed",
  description: "How Innovating Higher Ed uses artificial intelligence in content creation and curation.",
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
            Our commitment to transparency about AI in our workflow
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
                At Innovating Higher Ed, we believe in practicing what we preach. As a publication focused on AI in higher education, we use AI tools in our own workflow — and we&apos;re transparent about how and why.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                How We Use AI
              </h2>

              <div className="space-y-4">
                <div className="bg-[var(--surface-1)] rounded-[12px] p-5 border border-[var(--border)]">
                  <h3 className="text-[0.95rem] font-bold mb-2 text-[var(--cyan)]">
                    The Innovation Pulse
                  </h3>
                  <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.6]">
                    Our daily AI briefing uses AI to help curate, summarize, and analyze news from multiple sources. A human editor reviews and refines all content before publication. The editorial perspective and analysis represent human judgment.
                  </p>
                </div>

                <div className="bg-[var(--surface-1)] rounded-[12px] p-5 border border-[var(--border)]">
                  <h3 className="text-[0.95rem] font-bold mb-2 text-[var(--green)]">
                    Prompt Navigator
                  </h3>
                  <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.6]">
                    Prompts are created and tested by human educators. AI may be used to help refine wording or generate variations, but all prompts are human-validated for educational effectiveness.
                  </p>
                </div>

                <div className="bg-[var(--surface-1)] rounded-[12px] p-5 border border-[var(--border)]">
                  <h3 className="text-[0.95rem] font-bold mb-2 text-[var(--orange)]">
                    AI Directory
                  </h3>
                  <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.6]">
                    Tool descriptions and categorizations are researched and written by humans. We do not use AI-generated reviews or ratings. All tool evaluations reflect genuine human assessment.
                  </p>
                </div>

                <div className="bg-[var(--surface-1)] rounded-[12px] p-5 border border-[var(--border)]">
                  <h3 className="text-[0.95rem] font-bold mb-2 text-[var(--amber)]">
                    Website Development
                  </h3>
                  <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.6]">
                    AI coding assistants (such as Claude Code) are used in the development of this website. All code is reviewed and tested by human developers. We credit AI contributions in our commit history.
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
                  <span>Publish AI-generated content without human review and editing</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[var(--red)] mt-[2px]">✕</span>
                  <span>Use AI to generate fake testimonials or reviews</span>
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
                In the spirit of full transparency, here are the AI tools in our workflow:
              </p>
              <div className="grid grid-cols-2 gap-3">
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
                <a href="mailto:hello@innovatinghighered.com" className="text-[var(--cyan)] hover:underline">
                  hello@innovatinghighered.com
                </a>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

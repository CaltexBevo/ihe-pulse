import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer | Innovating Higher Ed",
  description: "Disclaimer for Innovating Higher Ed website and services.",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-12">
        {/* Header */}
        <div className="mb-10 animate-[fadeUp_0.7s_ease-out_both]">
          <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--cyan)] mb-2 flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--cyan)]" />
            Legal
          </div>
          <h1 className="font-sans text-[clamp(2rem,5vw,2.4rem)] font-bold leading-[1.1] text-[var(--text)] mb-3">
            Disclaimer
          </h1>
          <p className="text-[0.85rem] text-[var(--text-muted)]">
            Last updated: March 16, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-[800px]">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 md:p-10 space-y-8">
            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                General Disclaimer
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                The content provided on Innovating Higher Ed, including The Innovation Pulse, Prompt Navigator, AI Directory, Tinker Lab, Educator Tools, and all associated materials, is for educational and informational purposes only. Nothing on this site constitutes professional consulting, legal advice, employment advice, or institutional policy guidance.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                AI-Generated Content
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                Portions of this site use artificial intelligence in the content creation process. The Innovation Pulse daily briefing is produced using AI-assisted curation, writing, and audio generation with human editorial oversight. AI-generated content may contain errors, omissions, or inaccuracies. All content should be independently verified before being used for institutional decision-making.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Third-Party Tools and Links
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                The AI Directory and Educator Tools sections feature third-party products and services. Innovating Higher Ed does not endorse, guarantee, or assume responsibility for any third-party tools, platforms, or services linked from this site. Listings are provided for informational purposes only. Users should conduct their own evaluation before adopting any tool.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                No Professional Relationship
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                Use of this website does not create a consulting, advisory, or professional relationship between you and Innovating Higher Ed or its founders. Workshops, presentations, and podcast content reflect the views and experience of the participants and do not constitute institutional recommendations.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Accuracy and Currency
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                While we strive to keep information current and accurate, the rapidly evolving nature of AI in higher education means that tools, policies, and best practices may change. We make no guarantees that all information on this site reflects the most current developments.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Contact
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                Questions about this disclaimer? Contact us at{" "}
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

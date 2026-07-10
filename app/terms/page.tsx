import { Metadata } from "next";
import { pageMetadata } from "@/lib/og";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use | Innovating Higher Ed",
  description: "Terms of use for Innovating Higher Ed website and services.",
  path: "/terms",
});

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-12">
        {/* Header */}
        <div className="mb-10 animate-[fadeUp_0.7s_ease-out_both]">
          <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--orange)] mb-2 flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--orange)]" />
            Legal
          </div>
          <h1 className="font-sans text-[clamp(2rem,5vw,2.4rem)] font-bold leading-[1.1] text-[var(--text)] mb-3">
            Terms of Use
          </h1>
          <p className="text-[0.85rem] text-[var(--text-muted)]">
            Last updated: February 27, 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-[800px]">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 md:p-10 space-y-8">
            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Acceptance of Terms
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                By accessing and using Innovating Higher Ed (&quot;the Website&quot;), you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our website.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Use of Content
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7] mb-4">
                All content on this website, including but not limited to articles, podcast episodes, AI prompts, and tools directory information, is provided for educational and informational purposes only.
              </p>
              <ul className="space-y-2 text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                <li className="flex items-start gap-3">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--cyan)] mt-2 shrink-0" />
                  <span>You may share links to our content with proper attribution</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--cyan)] mt-2 shrink-0" />
                  <span>AI prompts may be used and adapted for educational purposes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--cyan)] mt-2 shrink-0" />
                  <span>Commercial redistribution of content requires written permission</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                AI Tools & Recommendations
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                Our AI Directory features third-party tools and services. We provide this information for educational purposes and do not endorse, guarantee, or assume responsibility for any third-party products or services. Users should conduct their own due diligence before adopting any tools mentioned on our site.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                User Submissions
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                By submitting content to us (such as guest applications or feedback), you grant Innovating Higher Ed a non-exclusive, royalty-free license to use, reproduce, and publish such content in connection with our services.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Intellectual Property
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                All original content, branding, and design elements on this website are the intellectual property of Innovating Higher Ed. The Innovation Pulse, Prompt Navigator, Tinker Lab, and associated branding are trademarks of Innovating Higher Ed.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Disclaimer of Warranties
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                The Website is provided &quot;as is&quot; without warranties of any kind. We do not guarantee the accuracy, completeness, or usefulness of any information on the Website. Educational advice and tool recommendations should not be considered professional consulting.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Limitation of Liability
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                Innovating Higher Ed shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Website or reliance on any information provided.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Changes to Terms
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                We reserve the right to modify these terms at any time. Continued use of the Website after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Contact
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                Questions about these Terms of Use? Contact us at{" "}
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

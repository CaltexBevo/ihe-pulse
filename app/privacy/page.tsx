import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Innovating Higher Ed",
  description: "Privacy policy for Innovating Higher Ed website and services.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
                Information We Collect
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7] mb-4">
                Innovating Higher Ed collects information to provide and improve our services to educators and higher education professionals:
              </p>
              <ul className="space-y-2 text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                <li className="flex items-start gap-3">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--cyan)] mt-2 shrink-0" />
                  <span><strong className="text-[var(--text)]">Email addresses</strong> when you subscribe to our newsletter</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--cyan)] mt-2 shrink-0" />
                  <span><strong className="text-[var(--text)]">Contact information</strong> when you submit guest applications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--cyan)] mt-2 shrink-0" />
                  <span><strong className="text-[var(--text)]">Usage data</strong> including pages visited and time spent (via analytics)</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                How We Use Your Information
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7] mb-4">
                We use collected information to:
              </p>
              <ul className="space-y-2 text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                <li className="flex items-start gap-3">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--green)] mt-2 shrink-0" />
                  <span>Send you our Innovation Pulse newsletter and updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--green)] mt-2 shrink-0" />
                  <span>Respond to podcast guest applications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--green)] mt-2 shrink-0" />
                  <span>Improve our website and content based on usage patterns</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--green)] mt-2 shrink-0" />
                  <span>Communicate about new features or content relevant to higher education</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Third-Party Services
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7] mb-4">
                We use the following third-party services that may collect information:
              </p>
              <ul className="space-y-2 text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                <li className="flex items-start gap-3">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--amber)] mt-2 shrink-0" />
                  <span><strong className="text-[var(--text)]">Mailchimp</strong> for email newsletter delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--amber)] mt-2 shrink-0" />
                  <span><strong className="text-[var(--text)]">Vercel Analytics</strong> for website performance and usage data</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-[6px] h-[6px] rounded-full bg-[var(--amber)] mt-2 shrink-0" />
                  <span><strong className="text-[var(--text)]">Unsplash</strong> for imagery (no personal data shared)</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Your Rights
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                You have the right to access, correct, or delete your personal information at any time. To unsubscribe from our newsletter, use the unsubscribe link in any email. For other requests, contact us at{" "}
                <a href="mailto:privacy@innovatinghighered.com" className="text-[var(--cyan)] hover:underline">
                  privacy@innovatinghighered.com
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Data Security
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                We implement appropriate security measures to protect your personal information. Our website uses HTTPS encryption, and we limit access to personal data to authorized personnel only.
              </p>
            </section>

            <section>
              <h2 className="text-[1.25rem] font-bold mb-4 text-[var(--text)]">
                Contact Us
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                If you have questions about this Privacy Policy, please contact us at{" "}
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

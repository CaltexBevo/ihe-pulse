import Link from "next/link";

export const metadata = {
  title: "About | Innovating Higher Ed",
  description:
    "Meet the team behind Innovating Higher Ed — empowering educators with AI knowledge, tools, and community.",
};

const offerings = [
  {
    icon: "📰",
    title: "Innovation Pulse",
    href: "/innovation-pulse",
    description:
      "Daily briefings on the latest AI news for higher ed, with editorial perspective and analysis.",
  },
  {
    icon: "🎙️",
    title: "Podcast",
    href: "/podcast",
    description:
      "Expert conversations with educators, researchers, and innovators shaping the future of AI in higher education.",
  },
  {
    icon: "⚡",
    title: "Prompt Navigator",
    href: "/prompts",
    description:
      "Evidence-based prompt engineering techniques, templates, and workflows designed for academic contexts.",
  },
  {
    icon: "🛠️",
    title: "AI Directory",
    href: "/ai-directory",
    description:
      "39+ vetted AI tools reviewed for faculty, administrators, and students with detailed pros, cons, and use cases.",
  },
  {
    icon: "🧪",
    title: "Tinker Lab",
    href: "/tinker-lab",
    description:
      "Hands-on experiments and explorations into AI tools, with honest reviews from an educator's perspective.",
  },
];

const values = [
  {
    title: "Innovation With Purpose",
    description:
      "Technology should serve teaching and learning, not replace the human connections that make education transformative.",
  },
  {
    title: "Practical Over Theoretical",
    description:
      "Every resource on this platform is designed to be used Monday morning. We bridge the gap between AI possibility and classroom reality.",
  },
  {
    title: "Community-Driven",
    description:
      "The best ideas come from educators sharing what works. Innovating Higher Ed is built by and for the higher ed community.",
  },
  {
    title: "Equity at the Center",
    description:
      "AI has the potential to widen or narrow gaps in education. We are committed to ensuring it serves all students.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-10 animate-[fadeUp_0.7s_ease-out_both]">
        <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--cyan)] mb-2 flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--cyan)]" />
          ABOUT
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Bio Text - TEXT ONLY, NO PHOTOS */}
          <div>
            <h1 className="page-title mb-6">
              Meet the Team
            </h1>

            <div className="space-y-6">
              {/* Norma Jones, PhD - TEXT ONLY */}
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5">
                <h2 className="font-sans text-[1.2rem] font-bold mb-1">Norma Jones, PhD</h2>
                <p className="font-mono text-[0.68rem] text-[var(--cyan)] mb-3">Founder & Host</p>
                <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                  PhD, recognized leader in AI integration for higher education, with
                  experience spanning academia and industry. Dr. Jones is a podcast
                  host and producer who has spent over 15 years at the intersection
                  of technology and teaching, helping institutions navigate digital
                  transformation — and now, the AI revolution.
                </p>
              </div>

              {/* Brent Jones - TEXT ONLY */}
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5">
                <h2 className="font-sans text-[1.2rem] font-bold mb-1">Brent Jones</h2>
                <p className="font-mono text-[0.68rem] text-[var(--magenta)] mb-3">Co-Producer & Technology Lead</p>
                <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7]">
                  Technology strategist and podcast co-producer with deep expertise in
                  educational technology, web development, and AI applications. Brent
                  builds the technical infrastructure that powers Innovating Higher Ed
                  and ensures every tool and resource we recommend has been thoroughly tested.
                </p>
              </div>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

            <div className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-[var(--cyan)] mb-6">
              Our Mission
            </div>
            <p className="text-[1.2rem] font-bold leading-[1.5] text-[var(--text)] mb-4">
              &ldquo;To empower every educator with the AI knowledge, tools, and
              community they need to transform teaching and learning — with equity,
              integrity, and humanity at the center.&rdquo;
            </p>
            <p className="font-mono text-[0.78rem] text-[var(--text-muted)]">
              — The Innovating Higher Ed Team
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 lg:p-12 relative overflow-hidden max-w-[800px] mx-auto">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

          <div className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-[var(--magenta)] mb-4">
            Our Story
          </div>
          <h2 className="font-sans text-[1.4rem] font-bold leading-[1.25] mb-4">
            From Podcast to Platform
          </h2>
          <p className="text-[0.92rem] text-[var(--text-secondary)] leading-[1.7] mb-4">
            Innovating Higher Ed started as a podcast in 2024 — a space for
            candid conversations about how artificial intelligence is reshaping
            colleges and universities. What began as weekly interviews with
            educators, researchers, and technologists quickly grew into something
            larger: a community of higher ed professionals hungry for
            trustworthy, practical guidance on AI.
          </p>
          <p className="text-[0.92rem] text-[var(--text-secondary)] leading-[1.7]">
            Today, Innovating Higher Ed is a one-stop resource for higher
            education professionals navigating the AI landscape. Our mission is
            to democratize AI knowledge in higher education — ensuring that every
            educator, regardless of their technical background, has access to the
            tools, strategies, and community they need to harness AI responsibly
            and effectively.
          </p>
        </div>
      </div>

      {/* What We Offer */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-6 text-center">
          What We Offer
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {offerings.map((offering) => (
            <Link
              key={offering.title}
              href={offering.href}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 hover:border-[var(--border-hover)] hover:-translate-y-[1px] transition-all duration-300 group block"
            >
              <span className="text-[1.2rem] mb-3 block">{offering.icon}</span>
              <h3 className="font-sans text-[1rem] font-bold mb-2 group-hover:text-[var(--cyan)] transition-colors">
                {offering.title}
              </h3>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55]">
                {offering.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-6 text-center">
          What We Stand For
        </div>
        <div className="grid md:grid-cols-2 gap-4 max-w-[800px] mx-auto">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5"
            >
              <h3 className="font-sans text-[1rem] font-bold mb-2">
                {value.title}
              </h3>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Disclosure */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--bg-elevated)] border border-[var(--border)] rounded-[20px] p-8 max-w-[800px] mx-auto">
          <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--amber)] mb-4 flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--amber)]" />
            AI Disclosure
          </div>
          <h3 className="font-sans text-[1.1rem] font-bold mb-3">
            How We Use AI on This Platform
          </h3>
          <p className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.65] mb-4">
            At Innovating Higher Ed, we practice what we preach. We use AI tools
            responsibly to enhance our work, with human oversight at every step:
          </p>
          <ul className="space-y-2 text-[0.85rem] text-[var(--text-secondary)] leading-[1.6]">
            <li className="flex items-start gap-3">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--cyan)] mt-2 shrink-0" />
              <span>
                <strong className="text-[var(--text)]">Innovation Pulse audio</strong> is produced using AI
                voice technology, with full editorial oversight by our team.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--cyan)] mt-2 shrink-0" />
              <span>
                <strong className="text-[var(--text)]">Content curation</strong> is AI-assisted but
                human-reviewed. Every story and tool recommendation is verified by
                our editorial team.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--cyan)] mt-2 shrink-0" />
              <span>
                <strong className="text-[var(--text)]">All prompts</strong> in the Prompt Navigator are
                human-written and tested by real educators before publication.
              </span>
            </li>
          </ul>
          <p className="text-[0.78rem] text-[var(--text-muted)] mt-4">
            We believe in transparent AI use. If you have questions about how we
            use AI, please reach out.
          </p>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

          <h2 className="font-sans text-[1.4rem] font-bold mb-2">
            Get in Touch
          </h2>
          <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[480px] mx-auto mb-6">
            Have questions, feedback, or partnership inquiries? We&apos;d love to
            hear from you.
          </p>
          <a
            href="mailto:hello@innovatinghighered.com"
            className="btn-primary"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

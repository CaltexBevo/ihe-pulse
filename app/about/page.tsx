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
              {/* Dr. Norma Jones, Ph.D. - TEXT ONLY */}
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6">
                <h2 className="font-sans text-[1.2rem] font-bold mb-1">Dr. Norma Jones, Ph.D.</h2>
                <p className="font-mono text-[0.68rem] text-[var(--cyan)] mb-4">Co-Founder & Editor-in-Chief</p>
                <div className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7] space-y-4">
                  <p>
                    Dr. Norma Jones is one of higher education&apos;s most active voices on AI integration in the classroom. A tenured faculty member in Communication Studies at Antelope Valley College, she founded and leads the college&apos;s AI Workgroup, co-leads its AI + OER/ZTC initiative, and has delivered more than 120 presentations on AI, education, communication, and media — including keynote addresses, conference panels, and faculty development sessions across California and nationwide.
                  </p>
                  <p>
                    Her podcast, <Link href="/podcast" className="text-[var(--cyan)] hover:underline">Innovating Higher Ed</Link>, is the only podcast featured on the California Community Colleges Chancellor&apos;s Office &ldquo;GenAI and the Future of Learning&rdquo; resource page. She was selected as a CCCCO AI ChangeMaker, providing expert guidance on the Chancellor&apos;s Office Vision 2030 generative AI strategy, and serves on multiple statewide AI faculty development and policy workgroups shaping how California&apos;s 116 community colleges approach artificial intelligence.
                  </p>
                  <p>
                    Dr. Jones is a published author and editor with Rowman & Littlefield, having co-edited and contributed to multiple volumes on popular culture and media. She created Fearless Public Speaking, an AI-enhanced multimedia OER textbook featuring integrated video, chatbot tutors, and follow-along practice sessions — a model for what next-generation open educational resources can look like.
                  </p>
                  <p>
                    Before entering academia, Dr. Jones spent over a decade as a corporate executive in marketing, sales, and business development across telecommunications, international e-commerce, and multimedia industries — experience that gives her a practical, real-world lens on how technology transforms organizations. She holds a Ph.D. in Communication and Information from Kent State University, an M.S. from the University of North Texas, and a B.A. from UC Santa Barbara.
                  </p>
                </div>
              </div>

              {/* Brent Jones - TEXT ONLY */}
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6">
                <h2 className="font-sans text-[1.2rem] font-bold mb-1">Brent Jones</h2>
                <p className="font-mono text-[0.68rem] text-[var(--magenta)] mb-4">Co-Founder & Chief Technology Officer</p>
                <div className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7] space-y-4">
                  <p>
                    Brent Jones is a producer, editor, and AI product builder with over two decades of experience across Hollywood and the technology startup space. He began his career at Warner Bros. Television and went on to serve as Post Production Supervisor on ABC&apos;s Growing Pains and Just the Ten of Us, then produce and edit more than 100 episodes of television for Disney, Discovery Channel, History Channel, HGTV, and CBS. As Director of Operations at Matchframe Film and Video, he managed end-to-end post-production workflows — editing, audio mixing, color correction, and large-scale media archiving — delivering broadcast-quality content under relentless deadlines.
                  </p>
                  <p>
                    Now he builds AI products. Brent is the founder of <a href="https://smarteryoo.com" target="_blank" rel="noopener noreferrer" className="text-[var(--cyan)] hover:underline">SmarterYoo</a> (smarteryoo.com), an AI-powered mental performance platform that creates personalized audio training sessions using the same visualization and mental rehearsal techniques practiced by Navy SEALs, Olympic athletes, and surgeons — customized to each user&apos;s specific high-stakes moments and delivered as guided audio.
                  </p>
                  <p>
                    He is also the technical architect behind Innovating Higher Ed, where he designed and built the entire platform from the ground up. Beyond these two ventures, Brent has additional AI products in active development — including an AI-powered OER platform for open educational resources and AI College Rankings, a data-driven approach to evaluating higher education institutions. Each one applies the same philosophy: use AI to solve real problems for real people, not to chase trends.
                  </p>
                  <p>
                    Brent holds a Bachelor of Science in Radio-Television-Film from The University of Texas at Austin.
                  </p>
                </div>
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

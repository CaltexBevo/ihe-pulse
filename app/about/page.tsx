"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const values = [
  {
    title: "Innovation With Purpose",
    description:
      "Technology should serve teaching and learning, not replace the human connections that make education transformative.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    title: "Practical Over Theoretical",
    description:
      "Every resource on this platform is designed to be used Monday morning. We bridge the gap between AI possibility and classroom reality.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: "Community-Driven",
    description:
      "The best ideas come from educators sharing what works. Innovating Higher Ed is built by and for the higher ed community.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Equity at the Center",
    description:
      "AI has the potential to widen or narrow gaps in education. We are committed to ensuring it serves all students.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
      </svg>
    ),
  },
];

const stats = [
  { number: "120+", label: "Presentations Delivered" },
  { number: "100+", label: "TV Episodes Produced" },
  { number: "44", label: "AI Tools Reviewed" },
  { number: "7", label: "Step Automated Pipeline" },
];

const timeline = [
  { year: "2024", label: "Podcast Launch", description: "Candid AI conversations for higher ed" },
  { year: "2025", label: "Platform Built", description: "One-stop resource for AI in education" },
  { year: "2026", label: "Daily Briefing", description: "AI-powered news for 116 colleges" },
];

export default function AboutPage() {
  const revealRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--cyan-glow)] via-transparent to-[var(--magenta-dim)] opacity-50" />

        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-16 pb-12 relative">
          <div ref={addToRefs} className="reveal text-center max-w-3xl mx-auto">
            {/* Accent line */}
            <div className="w-16 h-1 bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] mx-auto mb-8 rounded-full" />

            <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.1] mb-6">
              <span className="gradient-text">Built by Educators.</span>
              <br />
              <span className="text-[var(--text)]">Powered by AI. Made for You.</span>
            </h1>

            <p className="text-[1.1rem] text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto">
              Two people. One mission. A daily briefing trusted by higher ed professionals across the country.
            </p>
          </div>
        </div>
      </div>

      {/* Founder Bios */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-16">
        <div ref={addToRefs} className="reveal">
          <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-8 text-center">
            Meet the Founders
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Dr. Norma Jones Card */}
          <div
            ref={addToRefs}
            className="reveal bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 relative overflow-hidden group hover:border-[var(--border-hover)] transition-all duration-300"
          >
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--cyan)] to-[var(--cyan)] opacity-60" />

            {/* Monogram */}
            <div className="flex items-start gap-5 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--cyan)] to-[var(--cyan-dim)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[var(--cyan-glow)]">
                <span className="text-2xl font-bold text-white tracking-tight">NJ</span>
              </div>
              <div>
                <h2 className="text-[1.4rem] font-bold text-[var(--text)] mb-1">Dr. Norma Jones, Ph.D.</h2>
                <p className="font-mono text-[0.72rem] text-[var(--cyan)] tracking-wide">Co-Founder & Editor-in-Chief</p>
              </div>
            </div>

            {/* Punchy tagline */}
            <p className="text-[0.95rem] font-semibold text-[var(--text)] mb-5 leading-snug">
              120+ presentations. CCCCO AI ChangeMaker. Published author. The voice of AI in higher ed.
            </p>

            {/* Bio text */}
            <div className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.75] space-y-4 mb-6">
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

            {/* Credential badges */}
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-[0.6rem] px-3 py-1.5 rounded-full bg-[var(--cyan-dim)] text-[var(--cyan)] tracking-wide">Ph.D. Kent State</span>
              <span className="font-mono text-[0.6rem] px-3 py-1.5 rounded-full bg-[var(--cyan-dim)] text-[var(--cyan)] tracking-wide">CCCCO ChangeMaker</span>
              <span className="font-mono text-[0.6rem] px-3 py-1.5 rounded-full bg-[var(--cyan-dim)] text-[var(--cyan)] tracking-wide">Rowman & Littlefield Author</span>
            </div>
          </div>

          {/* Brent Jones Card */}
          <div
            ref={addToRefs}
            className="reveal reveal-delay-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 relative overflow-hidden group hover:border-[var(--border-hover)] transition-all duration-300"
          >
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--magenta)] to-[var(--magenta)] opacity-60" />

            {/* Monogram */}
            <div className="flex items-start gap-5 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--magenta)] to-[var(--magenta-dim)] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[var(--magenta-dim)]">
                <span className="text-2xl font-bold text-white tracking-tight">BJ</span>
              </div>
              <div>
                <h2 className="text-[1.4rem] font-bold text-[var(--text)] mb-1">Brent Jones</h2>
                <p className="font-mono text-[0.72rem] text-[var(--magenta)] tracking-wide">Co-Founder & Chief Technology Officer</p>
              </div>
            </div>

            {/* Punchy tagline */}
            <p className="text-[0.95rem] font-semibold text-[var(--text)] mb-5 leading-snug">
              100+ hours of TV. Warner Bros. to AI startups. Built this platform from scratch.
            </p>

            {/* Bio text */}
            <div className="text-[0.85rem] text-[var(--text-secondary)] leading-[1.75] space-y-4 mb-6">
              <p>
                Brent Jones is a producer, editor, and AI product builder with over two decades of experience across Hollywood and the technology startup space. He began his career at Warner Bros. Television and went on to serve as Post Production Supervisor on ABC&apos;s Growing Pains and Just the Ten of Us, then produce and edit more than 100 episodes of television for Disney, Discovery Channel, History Channel, HGTV, and CBS. As Director of Operations at Matchframe Film and Video, he managed end-to-end post-production workflows — editing, audio mixing, color correction, and large-scale media archiving — delivering broadcast-quality content under relentless deadlines.
              </p>
              <p>
                Now he builds AI products. Brent is the founder of <a href="https://smarteryoo.com" target="_blank" rel="noopener noreferrer" className="text-[var(--magenta)] hover:underline">SmarterYoo</a> (smarteryoo.com), an AI-powered mental performance platform that creates personalized audio training sessions using the same visualization and mental rehearsal techniques practiced by Navy SEALs, Olympic athletes, and surgeons — customized to each user&apos;s specific high-stakes moments and delivered as guided audio.
              </p>
              <p>
                He is also the technical architect behind Innovating Higher Ed, where he designed and built the entire platform from the ground up. Beyond these two ventures, Brent has additional AI products in active development — including an AI-powered OER platform for open educational resources and AI College Rankings, a data-driven approach to evaluating higher education institutions. Each one applies the same philosophy: use AI to solve real problems for real people, not to chase trends.
              </p>
              <p>
                Brent holds a Bachelor of Science in Radio-Television-Film from The University of Texas at Austin.
              </p>
            </div>

            {/* Credential badges */}
            <div className="flex flex-wrap gap-2">
              <span className="font-mono text-[0.6rem] px-3 py-1.5 rounded-full bg-[var(--magenta-dim)] text-[var(--magenta)] tracking-wide">Warner Bros.</span>
              <span className="font-mono text-[0.6rem] px-3 py-1.5 rounded-full bg-[var(--magenta-dim)] text-[var(--magenta)] tracking-wide">Disney/Discovery/CBS</span>
              <span className="font-mono text-[0.6rem] px-3 py-1.5 rounded-full bg-[var(--magenta-dim)] text-[var(--magenta)] tracking-wide">SmarterYoo Founder</span>
            </div>
          </div>
        </div>
      </div>

      {/* By the Numbers Strip */}
      <div ref={addToRefs} className="reveal bg-[var(--bg-elevated)] border-y border-[var(--border)] py-10">
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)]">
          <div className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-6 text-center">
            By the Numbers
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]"
              >
                <div className={`text-[2rem] font-bold mb-1 ${i % 2 === 0 ? 'text-[var(--cyan)]' : 'text-[var(--magenta)]'}`}>
                  {stat.number}
                </div>
                <div className="font-mono text-[0.65rem] text-[var(--text-muted)] tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Quote */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] py-16">
        <div ref={addToRefs} className="reveal max-w-3xl mx-auto">
          <div className="relative pl-8 md:pl-12">
            {/* Decorative quote marks */}
            <div className="absolute left-0 top-0 text-[4rem] leading-none font-serif text-[var(--cyan)] opacity-30 select-none">
              &ldquo;
            </div>
            {/* Left border accent */}
            <div className="absolute left-0 top-4 bottom-4 w-1 bg-gradient-to-b from-[var(--cyan)] to-[var(--magenta)] rounded-full" />

            <blockquote className="text-[clamp(1.1rem,2.5vw,1.5rem)] font-medium italic leading-[1.6] text-[var(--text)] mb-6">
              To empower every educator with the AI knowledge, tools, and community they need to transform teaching and learning — with equity, integrity, and humanity at the center.
            </blockquote>
            <cite className="font-mono text-[0.78rem] text-[var(--text-muted)] not-italic">
              — The Innovating Higher Ed Team
            </cite>
          </div>
        </div>
      </div>

      {/* Our Story - Timeline */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-16">
        <div ref={addToRefs} className="reveal bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 lg:p-12 relative overflow-hidden max-w-4xl mx-auto">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

          <div className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-[var(--magenta)] mb-3">
            Our Story
          </div>
          <h2 className="text-[1.6rem] font-bold leading-[1.25] mb-8">
            From Podcast to Platform
          </h2>

          {/* Timeline visual */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {timeline.map((item, i) => (
              <div key={item.year} className="relative">
                {/* Connector line (hidden on mobile, visible on desktop) */}
                {i < timeline.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+2rem)] right-0 h-[2px] bg-gradient-to-r from-[var(--border-hover)] to-transparent" />
                )}
                <div className="flex md:flex-col md:items-center gap-4 md:text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-mono text-[0.7rem] font-bold ${
                    i === 0 ? 'bg-[var(--cyan-dim)] text-[var(--cyan)]' :
                    i === 1 ? 'bg-[var(--magenta-dim)] text-[var(--magenta)]' :
                    'bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] text-white'
                  }`}>
                    {item.year}
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text)] mb-1">{item.label}</div>
                    <div className="text-[0.82rem] text-[var(--text-secondary)]">{item.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Story paragraphs */}
          <div className="text-[0.92rem] text-[var(--text-secondary)] leading-[1.75] space-y-4">
            <p>
              Innovating Higher Ed started as a podcast in 2024 — a space for candid conversations about how artificial intelligence is reshaping colleges and universities. What began as weekly interviews with educators, researchers, and technologists quickly grew into something larger: a community of higher ed professionals hungry for trustworthy, practical guidance on AI.
            </p>
            <p>
              Today, Innovating Higher Ed is a one-stop resource for higher education professionals navigating the AI landscape. Our mission is to democratize AI knowledge in higher education — ensuring that every educator, regardless of their technical background, has access to the tools, strategies, and community they need to harness AI responsibly and effectively.
            </p>
          </div>
        </div>
      </div>

      {/* What We Stand For - Values Grid */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-16">
        <div ref={addToRefs} className="reveal">
          <div className="font-mono text-[0.65rem] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-8 text-center">
            What We Stand For
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {values.map((value, i) => (
            <div
              key={value.title}
              ref={addToRefs}
              className={`reveal ${i % 2 === 1 ? 'reveal-delay-1' : ''} bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-6 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] transition-all duration-300 group`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                i === 0 ? 'bg-[var(--cyan-dim)] text-[var(--cyan)]' :
                i === 1 ? 'bg-[var(--magenta-dim)] text-[var(--magenta)]' :
                i === 2 ? 'bg-[var(--green-dim)] text-[var(--green)]' :
                'bg-[var(--amber-dim)] text-[var(--amber)]'
              } group-hover:scale-110 transition-transform duration-300`}>
                {value.icon}
              </div>
              <h3 className="text-[1.05rem] font-bold mb-2 text-[var(--text)]">
                {value.title}
              </h3>
              <p className="text-[0.82rem] text-[var(--text-secondary)] leading-[1.6]">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-16">
        <div
          ref={addToRefs}
          className="reveal bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-elevated)] border border-[var(--border)] rounded-[24px] p-10 lg:p-14 text-center relative overflow-hidden"
        >
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

          {/* Decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--cyan-glow)] via-transparent to-[var(--magenta-dim)] opacity-30" />

          <div className="relative">
            <h2 className="text-[1.6rem] font-bold mb-3 text-[var(--text)]">
              Let&apos;s Connect
            </h2>
            <p className="text-[0.95rem] text-[var(--text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
              Have questions, feedback, or partnership inquiries? We&apos;d love to hear from you.
              Or pitch yourself as a guest on the podcast — we&apos;re always looking for fresh perspectives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:hello@innovatinghighered.com"
                className="btn-primary"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Contact Us
              </a>
              <Link
                href="/be-our-guest"
                className="btn-secondary"
              >
                Be Our Guest
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

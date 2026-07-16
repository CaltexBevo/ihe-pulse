"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

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
              Two people. One mission. An A.I. briefing trusted by higher ed professionals across the country.
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

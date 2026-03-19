"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

const lookingFor = [
  {
    title: "Faculty Innovators",
    description:
      "Instructors experimenting with AI in their courses — what's working, what's not, and what you've learned.",
  },
  {
    title: "Administrators & Leaders",
    description:
      "Deans, provosts, and department heads navigating AI policy, ethics, and institutional strategy.",
  },
  {
    title: "Instructional Designers",
    description:
      "Ed tech specialists building AI-enhanced learning experiences and supporting faculty adoption.",
  },
  {
    title: "Researchers",
    description:
      "Scholars studying AI's impact on teaching, learning, equity, and student outcomes.",
  },
  {
    title: "EdTech Founders",
    description:
      "Builders creating tools for higher education — share your product story and vision.",
  },
  {
    title: "Students",
    description:
      "Learners with unique perspectives on how AI is changing their educational experience.",
  },
];

const processSteps = [
  {
    step: "1",
    title: "Submit Your Story",
    description:
      "Fill out the application form with your background, expertise, and the topic you'd like to discuss.",
  },
  {
    step: "2",
    title: "Initial Conversation",
    description:
      "If there's a fit, we'll schedule a 15-minute call to discuss your story and episode format.",
  },
  {
    step: "3",
    title: "Pre-Interview Prep",
    description:
      "You'll receive talking points and a brief outline before recording. No scripts required.",
  },
  {
    step: "4",
    title: "Record & Publish",
    description:
      "We record remotely (about 30-45 minutes). Episodes are edited and published within 2-4 weeks.",
  },
];

export default function BeOurGuestPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-8 animate-[fadeUp_0.7s_ease-out_both]">
        <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--orange)] mb-2 flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--orange)]" />
          BE OUR GUEST
        </div>
        <h1 className="font-sans text-[clamp(2rem,5vw,2.4rem)] font-bold leading-[1.1] text-[var(--text)] mb-3">
          Share Your Story
        </h1>
        <p className="text-[0.92rem] text-[var(--text-secondary)] max-w-[620px] leading-[1.6]">
          The Innovating Higher Ed podcast features real educators, researchers,
          and innovators sharing practical insights on AI in higher education.
          We&apos;re always looking for new voices.
        </p>
      </div>

      {/* Who We're Looking For */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <h2 className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-6">
          Who We&apos;re Looking For
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lookingFor.map((item) => (
            <div
              key={item.title}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5"
            >
              <h3 className="font-sans text-[1rem] font-bold mb-2 text-[var(--cyan)]">
                {item.title}
              </h3>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* The Process */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <h2 className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-6">
          The Process
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {processSteps.map((item) => (
            <div
              key={item.step}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 relative"
            >
              <div className="absolute top-4 right-4 font-mono text-[2rem] font-bold text-[var(--cyan)] opacity-20" aria-hidden="true">
                {item.step}
              </div>
              <h3 className="font-sans text-[0.92rem] font-bold mb-2">
                {item.title}
              </h3>
              <p className="text-[0.75rem] text-[var(--text-secondary)] leading-[1.55]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* What to Expect */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 max-w-[800px] mx-auto">
          <h2 className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--amber)] mb-4 flex items-center gap-2">
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--amber)]" aria-hidden="true" />
            What to Expect
          </h2>
          <h3 className="font-sans text-[1.2rem] font-bold mb-4">
            A Conversation, Not an Interview
          </h3>
          <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7] mb-4">
            Our podcast episodes are conversations between colleagues. The host
            guides the discussion, but the goal is to surface your
            authentic experience and insights — not to put you on the spot.
          </p>
          <ul className="space-y-3 text-[0.85rem] text-[var(--text-secondary)] leading-[1.6]">
            <li className="flex items-start gap-3">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--green)] mt-2 shrink-0" />
              <span>
                <strong className="text-[var(--text)]">Format:</strong> 30-45 minute remote recording (Zoom or
                Riverside)
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--green)] mt-2 shrink-0" />
              <span>
                <strong className="text-[var(--text)]">Prep:</strong> You&apos;ll receive talking points in advance,
                but no memorization required
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--green)] mt-2 shrink-0" />
              <span>
                <strong className="text-[var(--text)]">Editing:</strong> We edit for clarity and flow — no
                &quot;gotcha&quot; moments
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--green)] mt-2 shrink-0" />
              <span>
                <strong className="text-[var(--text)]">Promotion:</strong> We&apos;ll promote your episode across our
                channels
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Application Form */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--orange)] to-[var(--magenta)]" />

          {!submitted ? (
            <>
              <h2 className="font-sans text-[1.5rem] font-bold mb-2 text-center">
                Ready to Share Your Story?
              </h2>
              <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[480px] mx-auto mb-8 text-center">
                Fill out the application form below. We review all submissions and
                respond within 2 weeks.
              </p>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="max-w-[500px] mx-auto space-y-5"
              >
                <div>
                  <label className="block font-mono text-[0.62rem] tracking-[0.08em] uppercase text-[var(--text-muted)] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[0.88rem] outline-none transition-all focus:border-[var(--cyan)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] placeholder:text-[var(--text-muted)]"
                    placeholder="Dr. Jane Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[0.62rem] tracking-[0.08em] uppercase text-[var(--text-muted)] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[0.88rem] outline-none transition-all focus:border-[var(--cyan)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] placeholder:text-[var(--text-muted)]"
                    placeholder="jane.smith@university.edu"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[0.62rem] tracking-[0.08em] uppercase text-[var(--text-muted)] mb-2">
                    Role & Institution
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[0.88rem] outline-none transition-all focus:border-[var(--cyan)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] placeholder:text-[var(--text-muted)]"
                    placeholder="Associate Professor of Biology, State University"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[0.62rem] tracking-[0.08em] uppercase text-[var(--text-muted)] mb-2">
                    What would you like to discuss?
                  </label>
                  <textarea
                    className="w-full px-4 py-3 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] text-[0.88rem] outline-none transition-all focus:border-[var(--cyan)] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)] placeholder:text-[var(--text-muted)] min-h-[140px] resize-y"
                    placeholder="Tell us about your experience with AI in higher education and what story you'd like to share..."
                    required
                  />
                </div>
                <div className="text-center pt-2">
                  <button type="submit" className="btn-primary">
                    Submit Application
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-[var(--green-dim)] flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-[var(--green)]" fill="none" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="font-sans text-[1.5rem] font-bold mb-2">
                Application Submitted!
              </h2>
              <p className="text-[0.92rem] text-[var(--text-secondary)] max-w-[400px] mx-auto">
                Thank you for your interest in being a guest on the Innovating
                Higher Ed podcast. We&apos;ll review your submission and get back to
                you within 2 weeks.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Section */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-[20px] p-8 flex flex-col md:flex-row items-center gap-8 max-w-[800px] mx-auto">
          <div className="shrink-0">
            {/* QR Code - links to this page for mobile access */}
            <div className="w-[140px] h-[140px] bg-white rounded-[12px] p-3 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Simplified QR pattern - replace with actual QR code image */}
                <rect x="0" y="0" width="100" height="100" fill="white"/>
                <rect x="5" y="5" width="25" height="25" fill="#0a0a0f"/>
                <rect x="10" y="10" width="15" height="15" fill="white"/>
                <rect x="13" y="13" width="9" height="9" fill="#0a0a0f"/>
                <rect x="70" y="5" width="25" height="25" fill="#0a0a0f"/>
                <rect x="75" y="10" width="15" height="15" fill="white"/>
                <rect x="78" y="13" width="9" height="9" fill="#0a0a0f"/>
                <rect x="5" y="70" width="25" height="25" fill="#0a0a0f"/>
                <rect x="10" y="75" width="15" height="15" fill="white"/>
                <rect x="13" y="78" width="9" height="9" fill="#0a0a0f"/>
                {/* Data pattern */}
                <rect x="35" y="5" width="5" height="5" fill="#0a0a0f"/>
                <rect x="45" y="5" width="5" height="5" fill="#0a0a0f"/>
                <rect x="55" y="5" width="5" height="5" fill="#0a0a0f"/>
                <rect x="35" y="15" width="5" height="5" fill="#0a0a0f"/>
                <rect x="50" y="15" width="5" height="5" fill="#0a0a0f"/>
                <rect x="5" y="35" width="5" height="5" fill="#0a0a0f"/>
                <rect x="15" y="40" width="5" height="5" fill="#0a0a0f"/>
                <rect x="25" y="35" width="5" height="5" fill="#0a0a0f"/>
                <rect x="35" y="35" width="5" height="5" fill="#0a0a0f"/>
                <rect x="45" y="40" width="5" height="5" fill="#0a0a0f"/>
                <rect x="55" y="35" width="5" height="5" fill="#0a0a0f"/>
                <rect x="65" y="40" width="5" height="5" fill="#0a0a0f"/>
                <rect x="75" y="35" width="5" height="5" fill="#0a0a0f"/>
                <rect x="85" y="40" width="5" height="5" fill="#0a0a0f"/>
                <rect x="35" y="50" width="5" height="5" fill="#0a0a0f"/>
                <rect x="50" y="55" width="5" height="5" fill="#0a0a0f"/>
                <rect x="65" y="50" width="5" height="5" fill="#0a0a0f"/>
                <rect x="80" y="55" width="5" height="5" fill="#0a0a0f"/>
                <rect x="35" y="65" width="5" height="5" fill="#0a0a0f"/>
                <rect x="45" y="70" width="5" height="5" fill="#0a0a0f"/>
                <rect x="55" y="65" width="5" height="5" fill="#0a0a0f"/>
                <rect x="70" y="70" width="5" height="5" fill="#0a0a0f"/>
                <rect x="80" y="75" width="5" height="5" fill="#0a0a0f"/>
                <rect x="90" y="70" width="5" height="5" fill="#0a0a0f"/>
                <rect x="35" y="80" width="5" height="5" fill="#0a0a0f"/>
                <rect x="50" y="85" width="5" height="5" fill="#0a0a0f"/>
                <rect x="65" y="80" width="5" height="5" fill="#0a0a0f"/>
                <rect x="75" y="90" width="5" height="5" fill="#0a0a0f"/>
                <rect x="85" y="85" width="5" height="5" fill="#0a0a0f"/>
              </svg>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-[var(--magenta)] mb-2">
              Mobile Access
            </h2>
            <h3 className="font-sans text-[1.1rem] font-bold mb-2">
              Scan to Apply from Your Phone
            </h3>
            <p className="text-[0.82rem] text-[var(--text-secondary)] leading-[1.6]">
              Scan this QR code to open this page on your mobile device and submit your guest application on the go.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Episodes Teaser */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)]">
            Recent Episodes
          </h2>
          <Link
            href="/podcast"
            className="font-mono text-[0.62rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors"
          >
            View all &rarr;
          </Link>
        </div>
        <p className="text-[0.88rem] text-[var(--text-secondary)]">
          Listen to past episodes to get a feel for the show&apos;s style and format.
        </p>
      </div>
    </div>
  );
}

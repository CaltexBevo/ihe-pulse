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

const process = [
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
          <span className="text-[1rem]">🎙️</span>
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
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-6">
          Who We&apos;re Looking For
        </div>
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
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-6">
          The Process
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {process.map((item) => (
            <div
              key={item.step}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 relative"
            >
              <div className="absolute top-4 right-4 font-mono text-[2rem] font-bold text-[var(--cyan)] opacity-20">
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
          <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--amber)] mb-4">
            What to Expect
          </div>
          <h3 className="font-sans text-[1.2rem] font-bold mb-4">
            A Conversation, Not an Interview
          </h3>
          <p className="text-[0.88rem] text-[var(--text-secondary)] leading-[1.7] mb-4">
            Our podcast episodes are conversations between colleagues. Dr. Norma
            Jones guides the discussion, but the goal is to surface your
            authentic experience and insights — not to put you on the spot.
          </p>
          <ul className="space-y-2 text-[0.85rem] text-[var(--text-secondary)] leading-[1.6]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--green)] mt-1">&#10003;</span>
              <span>
                <strong>Format:</strong> 30-45 minute remote recording (Zoom or
                Riverside)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--green)] mt-1">&#10003;</span>
              <span>
                <strong>Prep:</strong> You&apos;ll receive talking points in advance,
                but no memorization required
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--green)] mt-1">&#10003;</span>
              <span>
                <strong>Editing:</strong> We edit for clarity and flow — no
                &quot;gotcha&quot; moments
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--green)] mt-1">&#10003;</span>
              <span>
                <strong>Promotion:</strong> We&apos;ll promote your episode across our
                channels
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Application CTA */}
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

              {/* Application Form */}
              <form
                onSubmit={handleSubmit}
                className="max-w-[500px] mx-auto space-y-4"
              >
                <div>
                  <label className="block font-mono text-[0.62rem] tracking-[0.08em] uppercase text-[var(--text-muted)] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Dr. Jane Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[0.62rem] tracking-[0.08em] uppercase text-[var(--text-muted)] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input"
                    placeholder="jane.smith@university.edu"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[0.62rem] tracking-[0.08em] uppercase text-[var(--text-muted)] mb-1">
                    Role & Institution
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="Associate Professor of Biology, State University"
                    required
                  />
                </div>
                <div>
                  <label className="block font-mono text-[0.62rem] tracking-[0.08em] uppercase text-[var(--text-muted)] mb-1">
                    What would you like to discuss?
                  </label>
                  <textarea
                    className="input min-h-[120px] resize-y"
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
                <span className="text-[var(--green)] text-3xl">&#10003;</span>
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

      {/* Recent Episodes */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)]">
            Recent Episodes
          </div>
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

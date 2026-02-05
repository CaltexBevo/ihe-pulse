import type { Metadata } from 'next';
import Link from 'next/link';
import PageTransition from '@/components/PageTransition';
import {
  GraduationCap,
  Award,
  BookOpen,
  Mic,
  Users,
  Heart,
  Lightbulb,
  Target,
  Sparkles,
  Zap,
  Brain,
  ArrowRight,
  Rocket,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Dr. Norma Jones | IHE PULSE',
  description:
    'Meet Dr. Norma Jones, educator and researcher driving AI innovation in higher education. Learn about the mission and values behind IHE PULSE.',
};

const credentials = [
  { icon: GraduationCap, text: 'PhD in Educational Technology' },
  { icon: Award, text: '15+ years in higher education leadership' },
  { icon: Mic, text: 'Podcast host and producer (50+ episodes)' },
  { icon: Target, text: 'Keynote speaker at national conferences' },
  { icon: BookOpen, text: 'Published researcher in AI pedagogy' },
  { icon: Heart, text: 'Advocate for equitable AI adoption' },
];

const offerings = [
  {
    icon: Mic,
    title: 'Podcast',
    href: '/podcast',
    description:
      'Expert conversations with educators, researchers, and innovators shaping the future of AI in higher education.',
  },
  {
    icon: Sparkles,
    title: 'Tinker Lab',
    href: '/tinker-lab',
    description:
      'Hands-on experiments and deep dives into AI tools, with honest reviews from an educator\'s perspective.',
  },
  {
    icon: Zap,
    title: 'Daily Pulse',
    href: '/daily-pulse',
    description:
      'Morning briefings on the latest AI news for higher ed, with Dr. Jones\'s editorial perspective.',
  },
  {
    icon: Brain,
    title: 'AI App Directory',
    href: '/ai-directory',
    description:
      '28+ vetted AI tools reviewed for faculty, administrators, and students with detailed pros, cons, and use cases.',
  },
  {
    icon: BookOpen,
    title: 'Prompt Navigator',
    href: '/prompts',
    description:
      'Evidence-based prompt engineering techniques, templates, and workflows designed for academic contexts.',
  },
];

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation With Purpose',
    description:
      'Technology should serve teaching and learning, not replace the human connections that make education transformative.',
  },
  {
    icon: Target,
    title: 'Practical Over Theoretical',
    description:
      'Every resource on this platform is designed to be used Monday morning. We bridge the gap between AI possibility and classroom reality.',
  },
  {
    icon: Users,
    title: 'Community-Driven',
    description:
      'The best ideas come from educators sharing what works. IHE Pulse is built by and for the higher ed community.',
  },
  {
    icon: Heart,
    title: 'Equity at the Center',
    description:
      'AI has the potential to widen or narrow gaps in education. We are committed to ensuring it serves all students.',
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="mx-auto max-w-7xl">
        {/* ════════════════════════════════════════════
            HERO — Dr. Norma Jones Bio
            ════════════════════════════════════════════ */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <p className="text-sm font-mono text-pulse uppercase tracking-widest mb-4">
              About
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Meet{' '}
              <span className="gradient-text">Dr. Norma Jones</span>
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed mb-6">
              PhD, recognized leader in AI integration for higher education,
              with experience spanning academia and industry. Dr. Jones is a
              podcast host and producer who has spent over 15 years at the
              intersection of technology and teaching, helping institutions
              navigate digital transformation — and now, the AI revolution.
            </p>
            <p className="text-gray-400 leading-relaxed">
              She founded Innovating Higher Ed to bridge the gap between AI
              innovation and classroom practice — giving faculty,
              administrators, and instructional designers the curated tools,
              evidence-based prompts, and practical insights they need to
              integrate AI with confidence, equity, and purpose.
            </p>
          </div>

          {/* Photo placeholder */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-2xl bg-gradient-to-br from-pulse/20 to-synapse/20 border border-white/10 flex flex-col items-center justify-center">
                <GraduationCap size={64} className="text-pulse/40 mb-4" />
                <span className="text-sm text-gray-500 font-mono">
                  Dr. Norma Jones
                </span>
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-pulse/5 to-synapse/5 blur-2xl -z-10" />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            THE PLATFORM VISION — From Podcast to Platform
            ════════════════════════════════════════════ */}
        <div className="mb-20 max-w-4xl mx-auto">
          <div className="glass rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            {/* Accent gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pulse to-synapse" />

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pulse/10 to-synapse/10 flex items-center justify-center">
                <Rocket size={20} className="text-pulse" />
              </div>
              <p className="text-xs font-mono text-synapse uppercase tracking-widest">
                Our Story
              </p>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              From Podcast to{' '}
              <span className="gradient-text">Platform</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Innovating Higher Ed started as a podcast in 2024 — a space for
              candid conversations about how artificial intelligence is
              reshaping colleges and universities. What began as weekly
              interviews with educators, researchers, and technologists quickly
              grew into something larger: a community of higher ed
              professionals hungry for trustworthy, practical guidance on AI.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Today, IHE Pulse is a one-stop resource for higher education
              professionals navigating the AI landscape. Our mission is to
              democratize AI knowledge in higher education — ensuring that
              every educator, regardless of their technical background, has
              access to the tools, strategies, and community they need to
              harness AI responsibly and effectively. From daily news briefings
              to vetted tool reviews, from prompt libraries to hands-on
              experiments, everything on this platform is built to help you
              move from curiosity to confident practice.
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            WHAT WE OFFER — 5 Pillars
            ════════════════════════════════════════════ */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <p className="text-xs font-mono text-synapse/80 uppercase tracking-widest mb-2">
              The Platform
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              What We <span className="gradient-text">Offer</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {offerings.map((offering, i) => (
              <Link
                key={i}
                href={offering.href}
                className="glass rounded-xl p-6 hover:border-pulse/20 transition-colors group block"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pulse/10 to-synapse/10 flex items-center justify-center mb-4 group-hover:from-pulse/20 group-hover:to-synapse/20 transition-colors">
                  <offering.icon size={20} className="text-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-pulse transition-colors">
                  {offering.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-4">
                  {offering.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm text-pulse group-hover:gap-2.5 transition-all">
                  Explore
                  <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════
            CREDENTIALS — Background & Expertise
            ════════════════════════════════════════════ */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Background & <span className="gradient-text">Expertise</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {credentials.map((cred, i) => (
              <div
                key={i}
                className="glass rounded-xl px-5 py-4 flex items-center gap-3"
              >
                <cred.icon size={20} className="text-pulse shrink-0" />
                <span className="text-sm text-gray-300">{cred.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ════════════════════════════════════════════
            MISSION QUOTE
            ════════════════════════════════════════════ */}
        <div className="mb-20">
          <div className="glass rounded-2xl p-8 sm:p-12 text-center max-w-4xl mx-auto">
            <p className="text-xs font-mono text-synapse uppercase tracking-widest mb-4">
              Our Mission
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 leading-snug">
              &ldquo;To empower every educator with the AI knowledge, tools, and
              community they need to transform teaching and learning — with
              equity, integrity, and humanity at the center.&rdquo;
            </h2>
            <p className="text-gray-500">— Dr. Norma Jones, Founder</p>
          </div>
        </div>

        {/* ════════════════════════════════════════════
            VALUES — What We Stand For
            ════════════════════════════════════════════ */}
        <div>
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            What We <span className="gradient-text">Stand For</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((value, i) => (
              <div key={i} className="glass rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pulse/10 to-synapse/10 flex items-center justify-center mb-4">
                  <value.icon size={20} className="text-pulse" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </PageTransition>
  );
}

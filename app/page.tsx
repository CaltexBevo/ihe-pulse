import type { Metadata } from 'next';
import BrainVisualization from '@/components/BrainVisualization';
import DiscoveryTicker from '@/components/DiscoveryTicker';
import AudioPlayer from '@/components/AudioPlayer';
import {
  Clock,
  Mic,
  BookOpen,
  Sparkles,
  Users,
  ArrowRight,
  Zap,
  Brain,
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'IHE PULSE | Innovating Higher Ed — AI Intelligence for Education',
  description:
    'AI-powered intelligence platform for higher education. Daily briefings, curated prompts, tools, and resources helping educators navigate the AI revolution.',
};

/* ─── Activity feed items ─── */
const activityItems = [
  {
    icon: Sparkles,
    text: 'New prompt added to Curriculum Design',
    time: '2m ago',
    color: 'text-pulse',
  },
  {
    icon: BookOpen,
    text: 'AI Directory updated: 3 new tools indexed',
    time: '5m ago',
    color: 'text-synapse',
  },
  {
    icon: Users,
    text: 'Dr. Sarah Chen joined the community',
    time: '12m ago',
    color: 'text-green-400',
  },
  {
    icon: Mic,
    text: 'New podcast episode: "AI Grading at Scale"',
    time: '1h ago',
    color: 'text-pulse',
  },
  {
    icon: Zap,
    text: 'Educator Tools: Assessment Rubric pack updated',
    time: '2h ago',
    color: 'text-yellow-400',
  },
  {
    icon: Brain,
    text: 'Tinker Lab: New experiment on RAG pipelines',
    time: '3h ago',
    color: 'text-synapse',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* ════════════════════════════════════════════
          SECTION 1: HERO + BRAIN VISUALIZATION
          ════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero text */}
            <div className="text-center lg:text-left">
              <p className="text-sm font-mono text-pulse/80 uppercase tracking-widest mb-4">
                Intelligence Network Active
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                <span className="text-white">THE PLATFORM</span>
                <br />
                <span className="text-white">IS </span>
                <span
                  className="gradient-text"
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradient-shift 4s ease infinite',
                  }}
                >
                  LEARNING
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-400 max-w-xl mx-auto lg:mx-0">
                AI-powered intelligence for higher education. Curated tools,
                expert prompts, and daily insights helping educators navigate
                the future of teaching and learning.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/daily-pulse"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-pulse to-synapse text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  <Zap size={18} />
                  Today&apos;s Briefing
                </Link>
                <Link
                  href="/prompts"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-white/10 text-gray-300 font-medium hover:bg-white/5 transition-colors"
                >
                  Explore Prompts
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Brain visualization */}
            <div className="flex justify-center">
              <BrainVisualization />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 2: DISCOVERY TICKER
          ════════════════════════════════════════════ */}
      <DiscoveryTicker />

      {/* ════════════════════════════════════════════
          SECTION 3: DAILY BRIEFING
          ════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p className="text-xs font-mono text-synapse/80 uppercase tracking-widest mb-2">
              Updated Daily
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              TODAY&apos;S INTELLIGENCE{' '}
              <span className="gradient-text">BRIEFING</span>
            </h2>
          </div>

          <div className="glass rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Episode info */}
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-pulse/20 to-synapse/20 border border-white/10 flex items-center justify-center">
                  <Mic size={32} className="text-pulse" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-pulse bg-pulse/10 px-2 py-0.5 rounded">
                    EP. 47
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    18 min
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  The Rise of AI Teaching Assistants: What Faculty Need to Know
                </h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  Today we explore how AI teaching assistants are transforming
                  office hours, grading, and student support — and what it means
                  for your classroom this semester.
                </p>

                {/* Interactive audio player */}
                <AudioPlayer duration="18:24" barCount={45} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 4: LIVE INTELLIGENCE FEED
          ════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Activity feed */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pulse opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pulse" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Live Intelligence Feed
                </h2>
              </div>

              <div className="space-y-3">
                {activityItems.map((item, i) => (
                  <div
                    key={i}
                    className="glass rounded-xl px-5 py-4 flex items-center gap-4 hover:border-pulse/20 transition-colors"
                  >
                    <div
                      className={`shrink-0 w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center ${item.color}`}
                    >
                      <item.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 truncate">
                        {item.text}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-gray-600 font-mono">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links sidebar */}
            <div>
              <h2 className="text-xl font-bold text-white mb-6">
                Quick Access
              </h2>
              <div className="space-y-3">
                {[
                  {
                    href: '/prompts',
                    icon: Sparkles,
                    title: 'Prompt Navigator',
                    desc: '2,400+ curated prompts',
                  },
                  {
                    href: '/ai-directory',
                    icon: Brain,
                    title: 'AI Directory',
                    desc: '847 tools indexed',
                  },
                  {
                    href: '/educator-tools',
                    icon: BookOpen,
                    title: 'Educator Tools',
                    desc: 'Templates & rubrics',
                  },
                  {
                    href: '/podcast',
                    icon: Mic,
                    title: 'Latest Episode',
                    desc: 'AI Teaching Assistants',
                  },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="glass rounded-xl px-5 py-4 flex items-center gap-4 hover:border-pulse/20 transition-colors group block"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-pulse/10 to-synapse/10 flex items-center justify-center text-pulse group-hover:from-pulse/20 group-hover:to-synapse/20 transition-colors">
                      <link.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-pulse transition-colors">
                        {link.title}
                      </p>
                      <p className="text-xs text-gray-500">{link.desc}</p>
                    </div>
                    <ArrowRight
                      size={14}
                      className="ml-auto text-gray-600 group-hover:text-pulse transition-colors"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

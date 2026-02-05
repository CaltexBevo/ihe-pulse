import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import BrainVisualization from '@/components/BrainVisualization';
import DiscoveryTicker from '@/components/DiscoveryTicker';
import AudioPlayer from '@/components/AudioPlayer';
import { episodes } from '@/lib/data/episodes';
import {
  categoryColors,
  formatPulseDate,
  getTodayBriefing,
} from '@/lib/data/daily-pulse';
import { getStaffPicks } from '@/lib/data/ai-apps';
import { posts } from '@/lib/data/posts';
import {
  Zap,
  Mic,
  ArrowRight,
  Calendar,
  Sparkles,
  Brain,
  BookOpen,
  Clock,
  Mail,
  GraduationCap,
  BadgeCheck,
  Play,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'IHE PULSE | Innovating Higher Ed — AI Intelligence for Education',
  description:
    'AI-powered intelligence platform for higher education. Daily briefings, curated prompts, tools, and resources helping educators navigate the AI revolution.',
};

export default function Home() {
  const briefing = getTodayBriefing();
  const todayStories = briefing.stories.slice(0, 4);
  const latestEpisode = episodes[0];
  const latestPost = posts[0];
  const staffPicks = getStaffPicks().slice(0, 3);

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
          SECTION 3: TODAY'S DAILY PULSE
          ════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="text-center mb-12">
            <p className="text-xs font-mono text-synapse/80 uppercase tracking-widest mb-2">
              Updated Daily
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              TODAY&apos;S INTELLIGENCE{' '}
              <span className="gradient-text">BRIEFING</span>
            </h2>
            <p className="mt-3 text-sm text-gray-500 font-mono flex items-center justify-center gap-2">
              <Calendar size={14} />
              {formatPulseDate(briefing.date)}
            </p>
          </div>

          {/* Audio player card */}
          <div className="glass rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto bg-gradient-to-br from-pulse/5 to-synapse/5">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-pulse/20 to-synapse/20 border border-white/10 flex items-center justify-center">
                  <Mic size={32} className="text-pulse" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-mono text-pulse bg-pulse/10 px-2 py-0.5 rounded">
                    DAILY PULSE
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {briefing.audioDuration}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  Dr. Norma&apos;s Morning Briefing
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  {briefing.greeting} Here&apos;s what&apos;s moving in AI and
                  higher education today.
                </p>

                <AudioPlayer duration={briefing.audioDuration} barCount={45} />
              </div>
            </div>
          </div>

          {/* Today's top stories */}
          <div className="grid sm:grid-cols-2 gap-4 mt-8 max-w-4xl mx-auto">
            {todayStories.map((story) => (
              <div
                key={story.id}
                className="glass rounded-xl overflow-hidden hover:border-pulse/20 transition-colors"
              >
                {/* Category color band */}
                <div
                  className="h-1"
                  style={{
                    backgroundColor:
                      categoryColors[story.category]?.hex ?? '#6b7280',
                  }}
                />
                <div className="p-5">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider ${
                      categoryColors[story.category]?.text ?? 'text-gray-400'
                    }`}
                  >
                    {story.category}
                  </span>
                  <h4 className="text-sm font-semibold text-white mt-1 leading-snug">
                    {story.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
                    {story.summary}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-2 font-mono">
                    Source: {story.source}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Link to full Daily Pulse */}
          <div className="text-center mt-8">
            <Link
              href="/daily-pulse"
              className="inline-flex items-center gap-2 text-sm font-medium text-pulse hover:text-white transition-colors group"
            >
              See All Stories
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 4: LATEST PODCAST EPISODE
          ════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <p className="text-xs font-mono text-pulse/80 uppercase tracking-widest mb-2">
              Latest Episode
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              FROM THE{' '}
              <span className="gradient-text">PODCAST</span>
            </h2>
          </div>

          <div className="glass rounded-2xl overflow-hidden hover:border-pulse/20 transition-colors">
            <div className="flex flex-col md:flex-row">
              {/* Thumbnail */}
              <div className="md:w-64 shrink-0">
                {latestEpisode.thumbnail ? (
                  <div className="relative w-full h-48 md:h-full">
                    <Image
                      src={latestEpisode.thumbnail}
                      alt={latestEpisode.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0f]/80 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/80 to-transparent md:hidden" />
                  </div>
                ) : (
                  <div className="w-full h-48 md:h-full bg-gradient-to-br from-pulse/10 to-synapse/10 flex items-center justify-center">
                    <Mic size={48} className="text-pulse/40" />
                  </div>
                )}
              </div>

              {/* Episode info */}
              <div className="flex-1 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-mono text-pulse bg-pulse/10 px-2 py-0.5 rounded">
                    EP. {latestEpisode.number}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    {latestEpisode.duration}
                  </span>
                  <span className="text-xs text-gray-600 font-mono">
                    {latestEpisode.date}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  {latestEpisode.title}
                </h3>
                <p className="text-sm text-synapse/80 mb-3">
                  with {latestEpisode.guest}
                </p>
                <p className="text-sm text-gray-400 line-clamp-2 mb-6">
                  {latestEpisode.description}
                </p>

                <div className="flex items-center gap-4">
                  <Link
                    href={`/podcast/${latestEpisode.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-pulse to-synapse text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Play size={14} fill="white" />
                    Listen Now
                  </Link>
                  <Link
                    href={`/podcast/${latestEpisode.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-pulse transition-colors group"
                  >
                    View Episode
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 5: FROM THE TINKER LAB
          ════════════════════════════════════════════ */}
      {latestPost && (
        <section className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-8">
              <p className="text-xs font-mono text-synapse/80 uppercase tracking-widest mb-2">
                Experiments & Ideas
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">
                FROM THE{' '}
                <span className="gradient-text">TINKER LAB</span>
              </h2>
            </div>

            <Link
              href={`/tinker-lab/${latestPost.slug}`}
              className="glass rounded-2xl p-6 sm:p-8 block hover:border-pulse/20 transition-colors group"
            >
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Thumbnail or icon */}
                <div className="shrink-0">
                  {latestPost.thumbnail ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                      <Image
                        src={latestPost.thumbnail}
                        alt={latestPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-synapse/20 to-pulse/20 border border-white/10 flex items-center justify-center">
                      <Sparkles size={32} className="text-synapse" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-synapse bg-synapse/10 px-2 py-0.5 rounded">
                      {latestPost.tag}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {latestPost.readTime}
                    </span>
                    <span className="text-xs text-gray-600 font-mono">
                      {latestPost.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-pulse transition-colors">
                    {latestPost.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {latestPost.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm text-pulse mt-4 group-hover:gap-2.5 transition-all">
                    Read More
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          SECTION 6: FEATURED AI TOOLS (STAFF PICKS)
          ════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-3">
              <BadgeCheck size={16} className="text-pulse" />
              <p className="text-xs font-mono text-pulse/80 uppercase tracking-widest">
                Staff Picks
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              FEATURED{' '}
              <span className="gradient-text">AI TOOLS</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {staffPicks.map((app) => (
              <Link
                key={app.slug}
                href={`/ai-directory/${app.slug}`}
                className="glass rounded-xl p-6 hover:border-pulse/20 transition-colors group block"
              >
                {/* App logo */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${app.logoGradient} flex items-center justify-center overflow-hidden`}
                  >
                    {app.logoUrl ? (
                      <Image
                        src={app.logoUrl}
                        alt={app.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Brain size={24} className="text-white/80" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-white group-hover:text-pulse transition-colors">
                      {app.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {app.tagline}
                    </p>
                  </div>
                </div>

                {/* Pricing badge + category */}
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded ${
                      app.pricing.model === 'free'
                        ? 'bg-green-500/15 text-green-400'
                        : app.pricing.model === 'freemium'
                          ? 'bg-blue-500/15 text-blue-400'
                          : 'bg-amber-500/15 text-amber-400'
                    }`}
                  >
                    {app.pricing.model}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono">
                    {app.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/ai-directory"
              className="inline-flex items-center gap-2 text-sm font-medium text-pulse hover:text-white transition-colors group"
            >
              Browse All Tools
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 7: QUICK ACCESS (HORIZONTAL ROW)
          ════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            Quick Access
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                desc: latestEpisode.title,
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="glass rounded-xl px-5 py-4 flex items-center gap-4 hover:border-pulse/20 transition-colors group"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-pulse/10 to-synapse/10 flex items-center justify-center text-pulse group-hover:from-pulse/20 group-hover:to-synapse/20 transition-colors">
                  <link.icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-pulse transition-colors">
                    {link.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{link.desc}</p>
                </div>
                <ArrowRight
                  size={14}
                  className="shrink-0 text-gray-600 group-hover:text-pulse transition-colors"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 8: JOIN THE CONVERSATION / NEWSLETTER
          ════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="glass rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Accent gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pulse to-synapse" />

            <Mail size={36} className="text-pulse mx-auto mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              <span className="gradient-text">Stay in the Loop</span>
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Get the Daily Pulse briefing delivered to your inbox every morning.
              Curated AI news, tool reviews, and actionable strategies for higher
              education — in under 5 minutes.
            </p>

            <form
              action="#"
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                name="email"
                placeholder="your@email.edu"
                className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-pulse/50 focus:ring-1 focus:ring-pulse/30 text-sm"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-pulse to-synapse text-white font-semibold text-sm hover:opacity-90 transition-opacity shrink-0"
              >
                Subscribe
              </button>
            </form>

            <p className="text-xs text-gray-600 mt-4">
              No spam. Unsubscribe anytime. We respect your inbox.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          SECTION 9: ABOUT DR. NORMA JONES
          ════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="glass rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              {/* Photo placeholder */}
              <div className="shrink-0 w-24 h-24 rounded-2xl bg-gradient-to-br from-pulse to-synapse flex items-center justify-center">
                <GraduationCap size={40} className="text-white" />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">
                  Dr. Norma Jones
                </h3>
                <p className="text-sm text-pulse font-mono mb-3">
                  Host &amp; Creator, Innovating Higher Ed
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Dr. Norma Jones is an educator, speaker, and advocate for
                  human-centered AI adoption in higher education. Through IHE
                  Pulse, she curates the most important AI developments for
                  faculty, administrators, and instructional designers — helping
                  them teach smarter, not harder.
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-sm text-pulse hover:text-white transition-colors mt-4 group"
                >
                  Learn More About Dr. Jones
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

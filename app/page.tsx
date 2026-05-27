import Link from "next/link";
import HomeEpisodePlayer from "@/components/HomeEpisodePlayer";
import InnovationPulseClient from "@/app/innovation-pulse/InnovationPulseClient";
import {
  getLatestEpisode,
  getAllEpisodes,
  getStoriesByCategory,
} from "@/lib/data/innovation-pulse";

export default function Home() {
  const pulseEpisode = getLatestEpisode();
  const allEpisodes = getAllEpisodes();
  const recentEpisodes = allEpisodes.slice(0, 6); // Last 6 episodes (sliding window)
  const storiesByCategory = getStoriesByCategory();

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════════════
          INNOVATION PULSE HERO - Episode Player with Recent Episodes
          ═══════════════════════════════════════════════════════ */}
      <section className="relative">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,212,255,0.04)] via-[rgba(200,80,192,0.02)] to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent opacity-40" />

        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] relative">
          {pulseEpisode && (
            <HomeEpisodePlayer
              latestEpisode={pulseEpisode}
              recentEpisodes={recentEpisodes}
            />
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          INNOVATION PULSE CONTENT — Top Stories, Categories, Archive
          ═══════════════════════════════════════════════════════ */}
      <InnovationPulseClient
        episode={pulseEpisode}
        allEpisodes={allEpisodes}
        storiesByCategory={storiesByCategory}
        showHero={false}
      />

      {/* Section Divider */}
      <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)]">
        <div className="h-px bg-[var(--border)]" />
      </div>

      {/* ═══════════════════════════════════════════════════════
          EXPLORE MORE FROM INNOVATING HIGHER ED
          ═══════════════════════════════════════════════════════ */}
      <section className="py-12">
        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)]">
          <h2
            className="text-[clamp(1.5rem,3vw,1.85rem)] font-bold leading-[1.2] mb-2"
            style={{
              fontFamily: "var(--font-heading)",
              background: "linear-gradient(90deg, var(--cyan), var(--purple))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Explore more from Innovating Higher Ed
          </h2>
          <p className="text-[0.82rem] text-[var(--text-muted)] mb-8">
            Resources, tools, and conversations for educators
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Podcast — cyan → purple */}
            <Link
              href="/podcast"
              className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 text-center transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block overflow-hidden"
            >
              {/* Gradient accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--purple)] opacity-60 group-hover:opacity-100 transition-opacity" />

              {/* Icon with glow background */}
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[rgba(0,212,255,0.1)] to-[rgba(167,139,250,0.1)] flex items-center justify-center group-hover:from-[rgba(0,212,255,0.2)] group-hover:to-[rgba(167,139,250,0.2)] transition-all">
                <svg className="w-6 h-6 text-[var(--cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>

              <h3 className="font-sans text-[1rem] font-bold mb-1 group-hover:text-[var(--cyan)] transition-colors">Podcast</h3>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.5] mb-3">
                Conversations with educators navigating A.I.
              </p>
              <span className="font-mono text-[0.65rem] text-[var(--cyan)] group-hover:text-[var(--text)] transition-colors">
                Browse episodes →
              </span>
            </Link>

            {/* AI Directory — purple → magenta */}
            <Link
              href="/ai-directory"
              className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 text-center transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block overflow-hidden"
            >
              {/* Gradient accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--purple)] to-[var(--magenta)] opacity-60 group-hover:opacity-100 transition-opacity" />

              {/* Icon with glow background */}
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[rgba(167,139,250,0.1)] to-[rgba(176,64,168,0.1)] flex items-center justify-center group-hover:from-[rgba(167,139,250,0.2)] group-hover:to-[rgba(176,64,168,0.2)] transition-all">
                <svg className="w-6 h-6 text-[var(--purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>

              <h3 className="font-sans text-[1rem] font-bold mb-1 group-hover:text-[var(--purple)] transition-colors">AI Directory</h3>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.5] mb-3">
                Curated tools reviewed for higher ed use
              </p>
              <span className="font-mono text-[0.65rem] text-[var(--cyan)] group-hover:text-[var(--text)] transition-colors">
                Browse tools →
              </span>
            </Link>

            {/* Top Prompts — cyan → magenta */}
            <Link
              href="/prompts"
              className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 text-center transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block overflow-hidden"
            >
              {/* Gradient accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)] opacity-60 group-hover:opacity-100 transition-opacity" />

              {/* Icon with glow background */}
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[rgba(0,212,255,0.1)] to-[rgba(176,64,168,0.1)] flex items-center justify-center group-hover:from-[rgba(0,212,255,0.2)] group-hover:to-[rgba(176,64,168,0.2)] transition-all">
                <svg className="w-6 h-6 text-[var(--cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <h3 className="font-sans text-[1rem] font-bold mb-1 group-hover:text-[var(--cyan)] transition-colors">Top Prompts</h3>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.5] mb-3">
                Ready-to-use prompts for teaching and admin
              </p>
              <span className="font-mono text-[0.65rem] text-[var(--cyan)] group-hover:text-[var(--text)] transition-colors">
                Browse prompts →
              </span>
            </Link>

            {/* Educator Tools — magenta → purple */}
            <Link
              href="/educator-tools"
              className="group relative bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 text-center transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block overflow-hidden"
            >
              {/* Gradient accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--magenta)] to-[var(--purple)] opacity-60 group-hover:opacity-100 transition-opacity" />

              {/* Icon with glow background */}
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[rgba(176,64,168,0.1)] to-[rgba(167,139,250,0.1)] flex items-center justify-center group-hover:from-[rgba(176,64,168,0.2)] group-hover:to-[rgba(167,139,250,0.2)] transition-all">
                <svg className="w-6 h-6 text-[var(--magenta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              <h3 className="font-sans text-[1rem] font-bold mb-1 group-hover:text-[var(--magenta)] transition-colors">Educator Tools</h3>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.5] mb-3">
                Practical resources for your classroom
              </p>
              <span className="font-mono text-[0.65rem] text-[var(--cyan)] group-hover:text-[var(--text)] transition-colors">
                Browse tools →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

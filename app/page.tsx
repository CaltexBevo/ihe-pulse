import Link from "next/link";
import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import HeroNowPlaying from "@/components/HeroNowPlaying";
import TopStoriesSlider from "@/components/TopStoriesSlider";
import LeadStoryCard from "@/components/LeadStoryCard";
import HomePromptCards from "@/components/HomePromptCards";
import HomeAIAppCards from "@/components/HomeAIAppCards";
import NewsletterSignup from "@/components/NewsletterSignup";
import {
  getLatestEpisode,
  getAllEpisodes,
  getAllStoriesAggregated,
  formatPulseDate,
  generateSlug,
  mapToV4Category,
  V4_CATEGORY_COLORS,
} from "@/lib/data/innovation-pulse";
import { episodes } from "@/lib/data/episodes";

export default function Home() {
  const pulseEpisode = getLatestEpisode();
  const allEpisodes = getAllEpisodes();
  const recentEpisodes = allEpisodes.slice(0, 5); // Last 5 episodes (sliding window)
  const allStories = getAllStoriesAggregated();
  const latestPodcastEpisodes = episodes.slice(0, 3);

  // Get lead story info - image is pre-assigned in the data
  const leadStory = pulseEpisode?.deepDive;
  const leadStoryV4Category = leadStory ? mapToV4Category(leadStory.category) : "Insights & Trends";
  const leadStoryColor = V4_CATEGORY_COLORS[leadStoryV4Category] || "#00d4ff";
  const leadStoryImage = leadStory?.image || "";

  // Get top stories - include lead story as first card
  const leadStoryAsCard = leadStory ? {
    ...leadStory,
    title: leadStory.title,
    summary: leadStory.summary,
    category: leadStory.category,
    source: leadStory.source,
    sourceUrl: leadStory.sourceUrl,
    date: pulseEpisode?.date,
    image: leadStoryImage,
    type: "deepDive" as const,
    isLead: true,
  } : null;

  const otherStories = allStories
    .filter(s => s.title !== leadStory?.title)
    .slice(0, 2);

  const topStories = leadStoryAsCard
    ? [leadStoryAsCard, ...otherStories]
    : otherStories.slice(0, 3);

  // "Also in this episode" strip data for HeroNowPlaying
  const heroOtherStories = pulseEpisode?.quickHits?.slice(0, 3).map(hit => ({
    source: hit.source,
    tease: hit.title,
  })) || [];

  // Placeholder images for Podcasts
  const podcastImages = [
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=340&fit=crop",
    "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=600&h=340&fit=crop",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=340&fit=crop",
  ];

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════════════
          INNOVATION PULSE HERO - V9 "NOW PLAYING" DESIGN
          ═══════════════════════════════════════════════════════ */}
      <section className="relative">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,212,255,0.04)] via-[rgba(200,80,192,0.02)] to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent opacity-40" />

        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] relative">
          <div className="animate-[fadeUp_0.7s_ease-out_both]">
            {pulseEpisode && (
              <HeroNowPlaying
                latestEpisode={pulseEpisode}
                recentEpisodes={recentEpisodes}
                otherStories={heroOtherStories}
              />
            )}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          TOP STORIES - Horizontal Slider (Lead Story as Card 1)
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <SectionHeader
          title="Top Stories"
          titleColor="var(--cyan)"
          tagline="The latest from the Innovation Pulse — curated daily."
          accentColor="var(--cyan)"
          viewAllHref="/innovation-pulse"
          viewAllText="View all stories"
        />

        <TopStoriesSlider stories={topStories} />
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          NEWSLETTER SIGNUP
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <NewsletterSignup variant="inline" />
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          PODCAST + TINKER LAB (2 podcast + 1 experiment)
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <SectionHeader
          title="Podcast"
          titleColor="var(--cyan)"
          tagline="Conversations with the people shaping higher ed's future."
          accentColor="var(--cyan)"
          viewAllHref="/podcast"
          viewAllText="All episodes"
        />

        <div className="grid-3">
          {/* First 2 podcast episodes */}
          {latestPodcastEpisodes.slice(0, 2).map((ep, idx) => (
            <Link
              key={ep.slug}
              href={`/podcast/${ep.slug}`}
              className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block"
            >
              {/* Image */}
              <div className="relative h-[170px] overflow-hidden bg-[var(--surface-1)] flex items-center justify-center">
                <Image
                  src={ep.thumbnail || podcastImages[idx]}
                  alt={ep.title}
                  fill
                  className="object-contain p-2"
                />
                <span className="absolute top-[10px] left-[10px] font-mono text-[0.53rem] font-semibold tracking-[0.06em] uppercase px-2 py-[3px] rounded-[5px] text-[#08080f] bg-[var(--cyan)] backdrop-blur-[8px]">
                  Interview
                </span>
              </div>

              {/* Body */}
              <div className="p-4 pt-3">
                <div className="font-mono text-[0.56rem] font-semibold tracking-[0.1em] uppercase mb-[0.35rem] flex items-center gap-[0.35rem]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--cyan)]" />
                  <span className="text-[var(--cyan)]">Podcast</span>
                </div>
                <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-[0.35rem]">
                  {ep.title}
                </h3>
                <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-[0.5rem] line-clamp-2">
                  {ep.description}
                </p>
                <div className="flex items-center gap-[0.6rem] font-mono text-[0.58rem] text-[var(--text-muted)] pt-[0.5rem] border-t border-[var(--border)]">
                  <span>{ep.date || "Feb 17"}</span>
                  <span>{ep.duration}</span>
                  <button className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center ml-auto">
                    <svg viewBox="0 0 24 24" className="w-[10px] h-[10px] fill-white ml-[1px]">
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                  </button>
                </div>
              </div>
            </Link>
          ))}

          {/* Tinker Lab Experiment - Card 3 */}
          <Link
            href="/tinker-lab/wonka-lantern"
            className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block"
          >
            <div className="relative h-[170px] overflow-hidden bg-[var(--surface-1)] flex items-center justify-center">
              <Image
                src="https://innovatinghighered.com/wp-content/uploads/2025/06/Tinker-Lab-WIlly-Wonka.02-585x390.jpg"
                alt="The Wonka-Lantern Framework"
                fill
                className="object-cover"
              />
              <span className="absolute top-[10px] left-[10px] font-mono text-[0.53rem] font-semibold tracking-[0.06em] uppercase px-2 py-[3px] rounded-[5px] text-[#08080f] bg-[var(--purple)] backdrop-blur-[8px]">
                Experiment
              </span>
            </div>
            <div className="p-4 pt-3">
              <div className="font-mono text-[0.56rem] font-semibold tracking-[0.1em] uppercase mb-[0.35rem] flex items-center gap-[0.35rem]">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--purple)]" />
                <span className="text-[var(--purple)]">Tinker Lab</span>
              </div>
              <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-[0.35rem]">
                The Wonka-Lantern Framework
              </h3>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-[0.5rem] line-clamp-2">
                Creative & Ethical AI in Higher Education — balancing imagination with responsibility.
              </p>
              <div className="flex items-center gap-[0.6rem] font-mono text-[0.58rem] text-[var(--text-muted)] pt-[0.5rem] border-t border-[var(--border)]">
                <span className="text-[var(--purple)]">12 min</span>
                <span>June 17, 2025</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          AI APP DIRECTORY
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <SectionHeader
          title="AI App Directory"
          titleColor="var(--cyan)"
          tagline="Every A.I. tool worth knowing about, reviewed for higher education."
          accentColor="var(--cyan)"
          viewAllHref="/ai-directory"
          viewAllText="Browse all tools"
        />

        {/* Recently Added Label */}
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--cyan)] mb-4 flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--cyan)]" />
          Recently Added
        </div>

        <HomeAIAppCards />
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          EDUCATOR TOOLS (NEW SECTION)
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <SectionHeader
          title="Educator Tools"
          titleColor="var(--cyan)"
          tagline="Practical tools built by educators, for educators."
          accentColor="var(--cyan)"
          viewAllHref="/educator-tools"
          viewAllText="View all tools"
        />

        <div className="grid-3">
          {/* Syllabot */}
          <a
            href="https://www.playlab.ai/project/cmcxiu07005zbm20uf1mawflg"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block"
          >
            <div className="h-[3px] bg-[var(--cyan)]" />
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-[48px] h-[48px] rounded-[12px] bg-[var(--cyan-dim)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[var(--cyan)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-sans text-[1rem] font-bold leading-[1.22]">Syllabot</h3>
                  <div className="font-mono text-[0.56rem] text-[var(--text-muted)] tracking-[0.06em] uppercase">
                    Built on PlayLab
                  </div>
                </div>
                <span className="ml-auto font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] uppercase bg-[var(--cyan-dim)] text-[var(--cyan)]">
                  Faculty Pick
                </span>
              </div>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-3 line-clamp-2">
                Generate course-ready AI policies for your syllabus in minutes with this guided tool.
              </p>
              <div className="flex items-center justify-between font-mono text-[0.56rem] text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                <span>Free</span>
                <span className="text-[var(--cyan)] group-hover:text-[var(--text)] transition-colors">
                  Launch tool →
                </span>
              </div>
            </div>
          </a>

          {/* AI Redesign */}
          <a
            href="https://www.playlab.ai/project/cma2sos8l1wkbrgigtms5xuxh"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block"
          >
            <div className="h-[3px] bg-[var(--magenta)]" />
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-[48px] h-[48px] rounded-[12px] bg-[var(--magenta-dim)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[var(--magenta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-sans text-[1rem] font-bold leading-[1.22]">AI Redesign</h3>
                  <div className="font-mono text-[0.56rem] text-[var(--text-muted)] tracking-[0.06em] uppercase">
                    Built on PlayLab
                  </div>
                </div>
                <span className="ml-auto font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] uppercase bg-[var(--magenta-dim)] text-[var(--magenta)]">
                  Faculty Pick
                </span>
              </div>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-3 line-clamp-2">
                Transform existing assessments into authentic, AI-resistant learning experiences.
              </p>
              <div className="flex items-center justify-between font-mono text-[0.56rem] text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                <span>Free</span>
                <span className="text-[var(--cyan)] group-hover:text-[var(--text)] transition-colors">
                  Launch tool →
                </span>
              </div>
            </div>
          </a>

          {/* Canvas Quiz Builder */}
          <a
            href="https://innovatinghighered.com/QTI-quiz-builder.html"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block"
          >
            <div className="h-[3px] bg-[var(--purple)]" />
            <div className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-[48px] h-[48px] rounded-[12px] bg-[var(--purple-dim)] border border-[var(--border)] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-[var(--purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-sans text-[1rem] font-bold leading-[1.22]">Canvas Quiz Builder</h3>
                  <div className="font-mono text-[0.56rem] text-[var(--text-muted)] tracking-[0.06em] uppercase">
                    A Cyber Doctor Build
                  </div>
                </div>
                <span className="ml-auto font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] uppercase bg-[var(--purple-dim)] text-[var(--purple)]">
                  Faculty Pick
                </span>
              </div>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-3 line-clamp-2">
                Build quiz packages that import directly into Canvas New Quizzes with QTI 2.1 export.
              </p>
              <div className="flex items-center justify-between font-mono text-[0.56rem] text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                <span>Free</span>
                <span className="text-[var(--cyan)] group-hover:text-[var(--text)] transition-colors">
                  Launch tool →
                </span>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          TOP PROMPTS
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <SectionHeader
          title="Top Prompts"
          titleColor="var(--cyan)"
          tagline="Ready-to-use prompts built for educators and administrators."
          accentColor="var(--cyan)"
          viewAllHref="/prompts"
          viewAllText="Browse all prompts"
        />

        <HomePromptCards />
      </section>

      {/* ═══════════════════════════════════════════════════════
          NEWSLETTER SIGNUP - Card Version
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <NewsletterSignup variant="card" />
      </section>
    </div>
  );
}

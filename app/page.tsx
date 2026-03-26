import Link from "next/link";
import Image from "next/image";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import HomeHeroClient from "@/components/HomeHeroClient";
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

  // Get top stories (excluding lead story)
  const topStories = allStories
    .filter(s => s.title !== leadStory?.title)
    .slice(0, 3);

  // Placeholder images for Podcasts
  const podcastImages = [
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=340&fit=crop",
    "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=600&h=340&fit=crop",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=340&fit=crop",
  ];

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════════════
          INNOVATION PULSE HERO - FLAGSHIP SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className="relative">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,212,255,0.04)] via-[rgba(200,80,192,0.02)] to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--cyan)] to-transparent opacity-40" />

        <div className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-8 relative">
          <div className="grid lg:grid-cols-[1fr_320px] gap-10">
            {/* Main Content - Client component for interactivity */}
            <div className="animate-[fadeUp_0.7s_ease-out_both]">
              {pulseEpisode && (
                <HomeHeroClient
                  latestEpisode={pulseEpisode}
                  recentEpisodes={recentEpisodes}
                />
              )}
            </div>

            {/* TOC Sidebar - IN THIS ISSUE */}
            {pulseEpisode && (
              <aside className="hidden lg:block animate-[fadeUp_0.7s_0.15s_ease-out_both]">
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[16px] p-5 sticky top-20">
                  <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
                    In This Issue
                  </div>

                  <ul className="space-y-0">
                    {/* Lead Story */}
                    <Link
                      href={`/innovation-pulse/story/${generateSlug(pulseEpisode.deepDive.title)}`}
                      className="flex items-start gap-2 py-2.5 border-b border-[var(--border)] cursor-pointer group"
                    >
                      <span className="font-mono text-[0.5rem] tracking-[0.05em] font-semibold px-[0.4rem] py-[0.12rem] rounded-[3px] whitespace-nowrap mt-[0.1rem] bg-[var(--magenta-dim)] text-[var(--magenta)]">
                        LEAD
                      </span>
                      <div>
                        <p className="text-[0.75rem] text-[var(--text-secondary)] leading-[1.35] group-hover:text-[var(--cyan)] transition-colors">
                          {pulseEpisode.deepDive.title}
                        </p>
                        <span className="text-[0.58rem] text-[var(--text-muted)] font-mono">
                          {mapToV4Category(pulseEpisode.deepDive.category)}
                        </span>
                      </div>
                    </Link>

                    {/* Quick Hits */}
                    {pulseEpisode.quickHits.slice(0, 4).map((hit, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 py-2.5 border-b border-[var(--border)] last:border-b-0 cursor-pointer group"
                      >
                        <span className="font-mono text-[0.5rem] tracking-[0.05em] font-semibold px-[0.4rem] py-[0.12rem] rounded-[3px] whitespace-nowrap mt-[0.1rem] bg-[var(--cyan-dim)] text-[var(--cyan)]">
                          STORY
                        </span>
                        <div>
                          <p className="text-[0.75rem] text-[var(--text-secondary)] leading-[1.35] group-hover:text-[var(--cyan)] transition-colors">
                            {hit.title}
                          </p>
                          <span className="text-[0.58rem] text-[var(--text-muted)] font-mono">
                            {mapToV4Category(hit.category)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          LEAD STORY - Premium Editorial Layout
          ═══════════════════════════════════════════════════════ */}
      {pulseEpisode && (
        <section className="section">
          <SectionHeader
            title="Lead Story"
            titleColor="var(--magenta)"
            tagline="Today's top story."
            accentColor="var(--magenta)"
          />

          <LeadStoryCard
            episode={pulseEpisode}
            imageUrl={leadStoryImage}
            v4Category={leadStoryV4Category}
            categoryColor={leadStoryColor}
          />
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════
          TOP STORIES - 3 Card Layout
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

        <div className="grid-3">
          {topStories.map((story, i) => {
            const v4Category = mapToV4Category(story.category);
            const v4Color = V4_CATEGORY_COLORS[v4Category] || "#00d4ff";

            return (
              <Card
                key={i}
                title={story.title}
                teaser={story.summary}
                fullContent={story.summary}
                category={v4Category}
                categoryColor={v4Color}
                source={story.source}
                sourceUrl={story.sourceUrl}
                date={formatPulseDate(story.date)}
                imageUrl={story.image || ""}
                badgeText={story.type === "deepDive" ? "Lead" : "Story"}
                badgeColor={story.type === "deepDive" ? "rgba(200,80,192,0.85)" : v4Color}
                expandable={true}
              />
            );
          })}
        </div>
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
          RECENT PODCASTS
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <SectionHeader
          title="Podcast"
          titleColor="var(--orange)"
          tagline="Conversations with the people shaping higher ed's future."
          accentColor="var(--orange)"
          viewAllHref="/podcast"
          viewAllText="All episodes"
        />

        <div className="grid-3">
          {latestPodcastEpisodes.map((ep, idx) => (
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
                <span className="absolute top-[10px] left-[10px] font-mono text-[0.53rem] font-semibold tracking-[0.06em] uppercase px-2 py-[3px] rounded-[5px] text-white bg-[var(--orange)] backdrop-blur-[8px]">
                  Interview
                </span>
              </div>

              {/* Body */}
              <div className="p-4 pt-3">
                <div className="font-mono text-[0.56rem] font-semibold tracking-[0.1em] uppercase mb-[0.35rem] flex items-center gap-[0.35rem]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--orange)]" />
                  <span className="text-[var(--orange)]">Podcast</span>
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
          titleColor="var(--teal)"
          tagline="Every A.I. tool worth knowing about, reviewed for higher education."
          accentColor="var(--teal)"
          viewAllHref="/ai-directory"
          viewAllText="Browse all tools"
        />

        {/* Recently Added Label */}
        <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--green)] mb-4 flex items-center gap-2">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)]" />
          Recently Added
        </div>

        <HomeAIAppCards />
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          TOP PROMPTS
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <SectionHeader
          title="Top Prompts"
          titleColor="var(--purple)"
          tagline="Ready-to-use prompts built for educators and administrators."
          accentColor="var(--purple)"
          viewAllHref="/prompts"
          viewAllText="Browse all prompts"
        />

        <HomePromptCards />
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          TINKER LAB
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <SectionHeader
          title="Tinker Lab"
          titleColor="var(--cyan)"
          tagline="Experiments, prototypes, and ideas in progress."
          accentColor="var(--cyan)"
          viewAllHref="/tinker-lab"
          viewAllText="View experiments"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Wonka-Lantern Framework */}
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
              <span className="absolute top-[10px] left-[10px] font-mono text-[0.53rem] font-semibold tracking-[0.06em] uppercase px-2 py-[3px] rounded-[5px] text-white bg-[rgba(0,212,255,0.85)]">
                Experiment
              </span>
            </div>
            <div className="p-4 pt-3">
              <div className="font-mono text-[0.56rem] font-semibold tracking-[0.1em] uppercase mb-[0.35rem] flex items-center gap-[0.35rem]">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--cyan)]" />
                <span className="text-[var(--cyan)]">Tinker Lab</span>
              </div>
              <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-[0.35rem]">
                The Wonka-Lantern Framework
              </h3>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-[0.5rem] line-clamp-2">
                Creative & Ethical AI in Higher Education — balancing imagination with responsibility.
              </p>
              <div className="flex items-center gap-[0.6rem] font-mono text-[0.58rem] text-[var(--text-muted)] pt-[0.5rem] border-t border-[var(--border)]">
                <span className="text-[var(--cyan)]">12 min</span>
                <span>June 17, 2025</span>
              </div>
            </div>
          </Link>

          {/* ChatGPT Pro */}
          <Link
            href="/tinker-lab/chatgpt-pro"
            className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block"
          >
            <div className="relative h-[170px] overflow-hidden bg-[var(--surface-1)] flex items-center justify-center">
              <Image
                src="https://innovatinghighered.com/wp-content/uploads/2025/05/Tinker-Lab-Chat-Pro.-01-585x390.jpg"
                alt="ChatGPT Pro Deep Research"
                fill
                className="object-cover"
              />
              <span className="absolute top-[10px] left-[10px] font-mono text-[0.53rem] font-semibold tracking-[0.06em] uppercase px-2 py-[3px] rounded-[5px] text-white bg-[rgba(74,222,128,0.85)]">
                Walkthrough
              </span>
            </div>
            <div className="p-4 pt-3">
              <div className="font-mono text-[0.56rem] font-semibold tracking-[0.1em] uppercase mb-[0.35rem] flex items-center gap-[0.35rem]">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--cyan)]" />
                <span className="text-[var(--cyan)]">Tinker Lab</span>
              </div>
              <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-[0.35rem]">
                ChatGPT Pro Deep Research: Worth It?
              </h3>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-[0.5rem] line-clamp-2">
                Testing OpenAI&apos;s premium Deep Research feature for creating an OER textbook.
              </p>
              <div className="flex items-center gap-[0.6rem] font-mono text-[0.58rem] text-[var(--text-muted)] pt-[0.5rem] border-t border-[var(--border)]">
                <span className="text-[var(--cyan)]">15 min</span>
                <span>Feb 28, 2025</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          NEWSLETTER SIGNUP - Card Version
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <NewsletterSignup variant="card" />
      </section>
    </div>
  );
}

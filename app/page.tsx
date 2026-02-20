import Link from "next/link";
import Image from "next/image";
import AudioPlayer from "@/components/AudioPlayer";
import SectionHeader from "@/components/SectionHeader";
import Card from "@/components/Card";
import { getLatestEpisode, getAllStoriesAggregated, formatPulseDate, categoryColors } from "@/lib/data/innovation-pulse";
import { episodes } from "@/lib/data/episodes";

export default function Home() {
  const pulseEpisode = getLatestEpisode();
  const allStories = getAllStoriesAggregated();
  const topStories = allStories.slice(0, 3);
  const latestPodcastEpisodes = episodes.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════════════
          INNOVATION PULSE HERO
          ═══════════════════════════════════════════════════════ */}
      <section className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-8">
        {/* Hero Grid */}
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Content */}
          <div>
            {/* Masthead */}
            <div className="mb-6">
              <div className="font-mono text-[0.62rem] tracking-[0.1em] uppercase text-[var(--cyan)] mb-2 flex items-center gap-2">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" />
                THE INNOVATION PULSE
                {pulseEpisode && (
                  <span className="text-[var(--text-muted)] ml-2">
                    {formatPulseDate(pulseEpisode.date)}
                  </span>
                )}
              </div>
              <h1 className="font-serif italic text-[clamp(1.8rem,5vw,2.8rem)] font-normal leading-[1.1] text-[var(--text)]">
                AI Innovation for Higher Ed
              </h1>
            </div>

            {/* Editorial Hook */}
            {pulseEpisode && (
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-6 mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

                {/* Quote */}
                <blockquote className="text-[1.1rem] leading-[1.65] text-[var(--text)] mb-5">
                  &ldquo;{pulseEpisode.editorialHook}&rdquo;
                </blockquote>

                {/* Audio Player */}
                <AudioPlayer
                  duration={pulseEpisode.audioDuration}
                  credit="Dr. Norma Jones"
                />

                {/* Editorial Lens Tag */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--border)]">
                  <span className="font-mono text-[0.55rem] tracking-[0.08em] uppercase text-[var(--text-muted)]">
                    Editorial Lens
                  </span>
                  <span className="font-mono text-[0.58rem] font-semibold px-2 py-[3px] rounded-[4px] bg-[var(--cyan-dim)] text-[var(--cyan)]">
                    {pulseEpisode.editorialLens}
                  </span>
                </div>
              </div>
            )}

            {/* CTA Row */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/innovation-pulse"
                className="btn-primary"
              >
                Read Today&apos;s Briefing
              </Link>
              <Link
                href="/innovation-pulse"
                className="font-mono text-[0.72rem] text-[var(--cyan)] hover:text-[var(--text)] transition-colors"
              >
                Browse Archive &rarr;
              </Link>
            </div>
          </div>

          {/* TOC Sidebar */}
          {pulseEpisode && (
            <aside className="hidden lg:block">
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 sticky top-20">
                <div className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
                  In This Issue
                </div>

                {/* Lead Story */}
                <div className="mb-4">
                  <div className="font-mono text-[0.5rem] tracking-[0.06em] uppercase text-[var(--magenta)] mb-1">
                    Lead Story
                  </div>
                  <p className="text-[0.8rem] text-[var(--text)] leading-[1.4] line-clamp-2">
                    {pulseEpisode.deepDive.title}
                  </p>
                </div>

                {/* Quick Hits */}
                <div>
                  <div className="font-mono text-[0.5rem] tracking-[0.06em] uppercase text-[var(--text-muted)] mb-2">
                    Also Today
                  </div>
                  <ul className="space-y-2">
                    {pulseEpisode.quickHits.slice(0, 4).map((hit, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[0.72rem] text-[var(--text-secondary)] leading-[1.4]"
                      >
                        <span
                          className="w-[4px] h-[4px] rounded-full mt-[6px] shrink-0"
                          style={{ backgroundColor: categoryColors[hit.category]?.hex || "var(--cyan)" }}
                        />
                        <span className="line-clamp-2">{hit.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          TOP STORIES
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <SectionHeader
          icon="📰"
          title="Top Stories"
          titleColor="var(--cyan)"
          description="Latest from the Innovation Pulse"
          viewAllHref="/innovation-pulse"
          viewAllText="View all stories"
        />

        <div className="grid-3">
          {topStories.map((story, i) => (
            <Card
              key={i}
              title={story.title}
              teaser={story.summary}
              fullContent={story.summary}
              editorialCallout={
                story.type === "deepDive"
                  ? "This story represents a significant shift in how institutions are approaching AI integration."
                  : undefined
              }
              category={story.category}
              categoryColor={categoryColors[story.category]?.hex || "var(--cyan)"}
              source={story.source}
              date={formatPulseDate(story.date)}
              badgeText={story.type === "deepDive" ? "Lead Story" : undefined}
              badgeColor="var(--magenta)"
              expandable={true}
            />
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          RECENT PODCASTS
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <SectionHeader
          icon="🎙️"
          title="Podcast"
          titleColor="var(--orange)"
          description="Conversations with leaders in higher ed"
          viewAllHref="/podcast"
          viewAllText="All episodes"
        />

        <div className="grid-3">
          {latestPodcastEpisodes.map((ep) => (
            <Link
              key={ep.slug}
              href={`/podcast/${ep.slug}`}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block"
            >
              {/* Image */}
              <div className="relative h-[170px] overflow-hidden">
                {ep.thumbnail ? (
                  <Image
                    src={ep.thumbnail}
                    alt={ep.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[var(--orange)] to-[var(--magenta)]" />
                )}
                <span className="absolute top-[10px] left-[10px] font-mono text-[0.53rem] font-semibold tracking-[0.06em] uppercase px-2 py-[3px] rounded-[5px] text-white bg-[var(--orange)] backdrop-blur-[8px]">
                  EP. {ep.number}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 pt-3">
                <div className="font-mono text-[0.56rem] font-semibold tracking-[0.1em] uppercase mb-[0.35rem] flex items-center gap-[0.35rem]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--orange)]" />
                  <span className="text-[var(--orange)]">Podcast</span>
                </div>
                <h3 className="font-sans text-[1.02rem] font-bold leading-[1.22] mb-[0.35rem]">
                  {ep.title}
                </h3>
                <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-[0.4rem] line-clamp-2">
                  {ep.description}
                </p>
                <div className="flex justify-between items-center pt-[0.45rem] border-t border-[var(--border)]">
                  <span className="font-mono text-[0.58rem] text-[var(--cyan)] font-medium">
                    {ep.guest}
                  </span>
                  <span className="font-mono text-[0.55rem] text-[var(--text-muted)]">
                    {ep.duration}
                  </span>
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
          icon="🛠️"
          title="AI App Directory"
          titleColor="var(--teal)"
          description="Tools vetted for higher education"
          viewAllHref="/ai-app-directory"
          viewAllText="Browse all tools"
        />

        <div className="grid-3">
          {[
            {
              name: "ChatGPT",
              desc: "OpenAI's flagship conversational AI. Handles everything from essay feedback to coding help.",
              category: "General LLMs",
              pricing: "Freemium",
              accent: "#10a37f",
            },
            {
              name: "Claude",
              desc: "Anthropic's AI assistant built for nuanced, thoughtful analysis and long-form writing.",
              category: "General LLMs",
              pricing: "Freemium",
              accent: "#d97706",
            },
            {
              name: "Gradescope",
              desc: "AI-assisted grading platform. Upload assignments, create rubrics, and grade consistently.",
              category: "Assessment",
              pricing: "Institutional",
              accent: "#059669",
            },
          ].map((tool, i) => (
            <Link
              key={i}
              href="/ai-app-directory"
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ backgroundColor: tool.accent }}
              />
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white font-bold text-[0.9rem]"
                  style={{ backgroundColor: tool.accent }}
                >
                  {tool.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="font-sans text-[1rem] font-bold leading-[1.22]">
                    {tool.name}
                  </h3>
                  <p className="text-[0.68rem] text-[var(--text-muted)]">
                    {tool.category}
                  </p>
                </div>
              </div>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-3 line-clamp-2">
                {tool.desc}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[0.55rem] font-semibold px-2 py-[2px] rounded-[4px] bg-[var(--teal-dim)] text-[var(--teal)]">
                  {tool.pricing}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          TOP PROMPTS
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <SectionHeader
          icon="⚡"
          title="Prompt Navigator"
          titleColor="var(--purple)"
          description="AI prompts built for higher education"
          viewAllHref="/prompts"
          viewAllText="Browse all prompts"
        />

        <div className="grid-3">
          {[
            {
              title: "AI-Resistant Assignment Redesigner",
              desc: "Analyzes your existing assignment and suggests modifications that maintain learning outcomes while reducing AI shortcutting.",
              difficulty: "Intermediate",
              category: "Assessment",
              uses: "1.8k",
            },
            {
              title: "Rubric-Based Feedback Draft Generator",
              desc: "Generates detailed, constructive student feedback aligned to your specific rubric.",
              difficulty: "Beginner",
              category: "Feedback",
              uses: "3.1k",
            },
            {
              title: "Literature Review Gap Finder",
              desc: "Analyzes a set of papers and identifies where the literature has gaps or contradictions.",
              difficulty: "Advanced",
              category: "Research",
              uses: "720",
            },
          ].map((prompt, i) => (
            <Link
              key={i}
              href="/prompts"
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--purple)] to-[var(--cyan)]" />
              <div className="flex gap-2 mb-3">
                <span
                  className={`font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] ${
                    prompt.difficulty === "Beginner"
                      ? "bg-[var(--green-dim)] text-[var(--green)]"
                      : prompt.difficulty === "Intermediate"
                        ? "bg-[var(--amber-dim)] text-[var(--amber)]"
                        : "bg-[var(--red-dim)] text-[var(--red)]"
                  }`}
                >
                  {prompt.difficulty}
                </span>
                <span className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[var(--purple-dim)] text-[var(--purple)]">
                  {prompt.category}
                </span>
              </div>
              <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-2">
                {prompt.title}
              </h3>
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-3 line-clamp-2">
                {prompt.desc}
              </p>
              <div className="flex items-center gap-3 font-mono text-[0.55rem] text-[var(--text-muted)]">
                <span className="text-[var(--green)]">{prompt.uses} uses</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          TINKER LAB
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <SectionHeader
          icon="🧪"
          title="Tinker Lab"
          titleColor="var(--cyan)"
          description="Experiments, walkthroughs, and AI explorations"
          viewAllHref="/tinker-lab"
          viewAllText="All experiments"
        />

        <div className="grid-3">
          {[
            {
              title: "I Graded 100 Papers with 5 Different AI Tools",
              desc: "Dr. Norma ran the same set of 100 student essays through five popular AI grading platforms. The results were surprising.",
              type: "Experiment",
              duration: "8 min",
              difficulty: "Beginner",
            },
            {
              title: "Building a Custom AI Tutor for Intro Biology",
              desc: "A step-by-step walkthrough of creating a subject-specific AI tutor using free tools. No coding required.",
              type: "Walkthrough",
              duration: "12 min",
              difficulty: "Beginner",
            },
            {
              title: "GPT-4 vs Claude vs Gemini: Writing Student Feedback",
              desc: "We gave all three the same rubric and paper. The quality gap is real and it's not who you'd expect.",
              type: "Comparison",
              duration: "14 min",
              difficulty: "Advanced",
            },
          ].map((exp, i) => (
            <Link
              key={i}
              href="/tinker-lab"
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block"
            >
              {/* Image */}
              <div className="relative h-[150px] overflow-hidden bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] opacity-40">
                <span className="absolute top-[10px] left-[10px] font-mono text-[0.53rem] font-semibold tracking-[0.05em] uppercase px-2 py-[3px] rounded-[5px] text-white bg-[rgba(0,212,255,0.85)]">
                  {exp.type}
                </span>
                <span className="absolute bottom-[10px] right-[10px] font-mono text-[0.58rem] text-white bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px] px-2 py-[2px] rounded-[4px]">
                  {exp.duration}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 pt-3">
                <div className="flex gap-2 mb-2">
                  <span
                    className={`font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] ${
                      exp.difficulty === "Beginner"
                        ? "bg-[var(--green-dim)] text-[var(--green)]"
                        : exp.difficulty === "Intermediate"
                          ? "bg-[var(--amber-dim)] text-[var(--amber)]"
                          : "bg-[var(--red-dim)] text-[var(--red)]"
                    }`}
                  >
                    {exp.difficulty}
                  </span>
                </div>
                <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-2">
                  {exp.title}
                </h3>
                <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] line-clamp-2">
                  {exp.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <div className="section-divider" />

      {/* ═══════════════════════════════════════════════════════
          NEWSLETTER SIGNUP
          ═══════════════════════════════════════════════════════ */}
      <section className="section">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--cyan)] to-[var(--magenta)]" />

          <h2 className="font-sans text-[1.5rem] md:text-[1.85rem] font-bold mb-3">
            Stay in the Loop
          </h2>
          <p className="text-[0.88rem] text-[var(--text-secondary)] max-w-[500px] mx-auto mb-6">
            Get the Innovation Pulse delivered to your inbox every morning.
            Curated AI news and actionable strategies for higher education.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-[400px] mx-auto">
            <input
              type="email"
              placeholder="your@email.edu"
              className="input flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>

          <p className="text-[0.68rem] text-[var(--text-muted)] mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}

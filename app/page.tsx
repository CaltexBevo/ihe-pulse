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

  // Placeholder images for Top Stories
  const storyImages = [
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=340&fit=crop",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=340&fit=crop",
  ];

  // Placeholder images for AI Tools
  const toolImages = [
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=320&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=320&fit=crop",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=320&fit=crop",
  ];

  // Placeholder images for Tinker Lab
  const tinkerImages = [
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=340&fit=crop",
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&h=340&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=340&fit=crop",
  ];

  // Placeholder images for Podcasts
  const podcastImages = [
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&h=340&fit=crop",
    "https://images.unsplash.com/photo-1559523161-0fc0d8b38a7a?w=600&h=340&fit=crop",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=340&fit=crop",
  ];

  return (
    <div className="flex flex-col">
      {/* ═══════════════════════════════════════════════════════
          INNOVATION PULSE HERO
          ═══════════════════════════════════════════════════════ */}
      <section className="max-w-[var(--max-w)] mx-auto px-[var(--px)] pt-10 pb-8">
        {/* Hero Grid */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-10">
          {/* Main Content */}
          <div className="animate-[fadeUp_0.7s_ease-out_both]">
            {/* Label */}
            <div className="font-mono text-[0.7rem] tracking-[0.12em] uppercase text-[var(--cyan)] mb-4 flex items-center gap-2">
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" />
              THE INNOVATION PULSE
            </div>

            {/* Date + Lens Badge */}
            {pulseEpisode && (
              <div className="font-mono text-[0.72rem] text-[var(--text-muted)] mb-3 flex items-center gap-3">
                <span>{formatPulseDate(pulseEpisode.date)}</span>
                <span className="inline-flex items-center gap-[0.35rem] px-[0.65rem] py-[0.2rem] rounded-full text-[0.68rem] font-semibold bg-[var(--amber-dim)] text-[var(--amber)]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--amber)]" />
                  {pulseEpisode.editorialLens}
                </span>
              </div>
            )}

            {/* Hook Quote with Gradient Border */}
            {pulseEpisode && (
              <blockquote className="relative pl-6 mb-6">
                <div className="absolute left-0 top-[0.3rem] bottom-[0.3rem] w-[3px] rounded-[2px] bg-gradient-to-b from-[var(--cyan)] to-[var(--magenta)]" />
                <p className="font-sans italic text-[clamp(1.4rem,2.8vw,1.85rem)] leading-[1.3] font-bold text-[var(--text)]">
                  &ldquo;{pulseEpisode.editorialHook}&rdquo;
                </p>
              </blockquote>
            )}

            {/* Audio Player */}
            {pulseEpisode && (
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {/* Live Badge */}
                  <div className="flex items-center gap-[0.3rem] bg-[rgba(74,222,128,0.1)] text-[var(--green)] px-[0.5rem] py-[0.18rem] rounded-full text-[0.6rem] font-semibold font-mono tracking-[0.06em]">
                    <span className="w-[5px] h-[5px] rounded-full bg-[var(--green)] animate-[pulseDot_2s_infinite]" />
                    LISTEN NOW
                  </div>
                  {/* Duration */}
                  <span className="font-mono text-[0.65rem] text-[var(--text-muted)]">
                    {pulseEpisode.audioDuration}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Play Button */}
                  <button className="w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[var(--cyan)] to-[var(--magenta)] flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(0,212,255,0.2)] transition-transform hover:scale-[1.06]">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white ml-[2px]">
                      <polygon points="6,3 20,12 6,21" />
                    </svg>
                  </button>
                  {/* Waveform Visualization */}
                  <div className="flex-1 flex items-center h-[36px] gap-[1.5px]">
                    {Array.from({ length: 75 }, (_, i) => {
                      const h = Math.max(4, 6 + Math.random() * 26 + Math.sin(i * 0.25) * 8);
                      return (
                        <div
                          key={i}
                          className="w-[3px] rounded-[2px] bg-[var(--surface-2)]"
                          style={{ height: `${h}px` }}
                        />
                      );
                    })}
                  </div>
                  {/* Time */}
                  <span className="font-mono text-[0.63rem] text-[var(--text-muted)] shrink-0">
                    0:00 / {pulseEpisode.audioDuration}
                  </span>
                </div>
              </div>
            )}

            {/* CTA */}
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

          {/* TOC Sidebar - IN THIS ISSUE */}
          {pulseEpisode && (
            <aside className="hidden lg:block animate-[fadeUp_0.7s_0.15s_ease-out_both]">
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 sticky top-20">
                <div className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
                  In This Issue
                </div>

                <ul className="space-y-0">
                  {/* Lead Story */}
                  <li className="flex items-start gap-2 py-2 border-b border-[var(--border)] cursor-pointer group">
                    <span className="font-mono text-[0.48rem] tracking-[0.05em] font-semibold px-[0.35rem] py-[0.1rem] rounded-[3px] whitespace-nowrap mt-[0.1rem] bg-[var(--cyan-dim)] text-[var(--cyan)]">
                      LEAD STORY
                    </span>
                    <div>
                      <p className="text-[0.73rem] text-[var(--text-secondary)] leading-[1.3] group-hover:text-[var(--cyan)] transition-colors">
                        {pulseEpisode.deepDive.title}
                      </p>
                      <span className="text-[0.55rem] text-[var(--text-muted)] font-mono">
                        {pulseEpisode.deepDive.category}
                      </span>
                    </div>
                  </li>

                  {/* Quick Hits */}
                  {pulseEpisode.quickHits.slice(0, 4).map((hit, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 py-2 border-b border-[var(--border)] last:border-b-0 cursor-pointer group"
                    >
                      <span className="font-mono text-[0.48rem] tracking-[0.05em] font-semibold px-[0.35rem] py-[0.1rem] rounded-[3px] whitespace-nowrap mt-[0.1rem] bg-[var(--magenta-dim)] text-[var(--magenta)]">
                        ALSO TODAY
                      </span>
                      <div>
                        <p className="text-[0.73rem] text-[var(--text-secondary)] leading-[1.3] group-hover:text-[var(--cyan)] transition-colors">
                          {hit.title}
                        </p>
                        <span className="text-[0.55rem] text-[var(--text-muted)] font-mono">
                          {hit.category}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
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
              imageUrl={storyImages[i]}
              badgeText={story.type === "deepDive" ? "Lead Story" : "Top Story"}
              badgeColor={story.type === "deepDive" ? "rgba(200,80,192,0.85)" : "rgba(0,180,220,0.85)"}
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
          {latestPodcastEpisodes.map((ep, idx) => (
            <Link
              key={ep.slug}
              href={`/podcast/${ep.slug}`}
              className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden cursor-pointer transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block"
            >
              {/* Image - 170px height */}
              <div className="relative h-[170px] overflow-hidden">
                <Image
                  src={ep.thumbnail || podcastImages[idx]}
                  alt={ep.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                {/* Episode Badge */}
                <span className="absolute top-[10px] left-[10px] font-mono text-[0.53rem] font-semibold tracking-[0.06em] uppercase px-2 py-[3px] rounded-[5px] text-white bg-[var(--orange)] backdrop-blur-[8px]">
                  Episode {ep.number}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 pt-3">
                {/* Category - JetBrains Mono */}
                <div className="font-mono text-[0.56rem] font-semibold tracking-[0.1em] uppercase mb-[0.35rem] flex items-center gap-[0.35rem]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--orange)]" />
                  <span className="text-[var(--orange)]">Podcast</span>
                </div>
                {/* Title - DM Sans Bold */}
                <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-[0.35rem]">
                  {ep.title}
                </h3>
                {/* Description - DM Sans Regular */}
                <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-[0.5rem] line-clamp-2">
                  {ep.description}
                </p>
                {/* Footer - JetBrains Mono */}
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
              name: "GradeAssist AI",
              desc: "AI-powered rubric-based grading with detailed feedback generation. Integrates with Canvas, Blackboard, and Moodle.",
              category: "Grading",
              pricing: "Free tier available",
              rating: "4.7",
              badges: ["NEW"],
            },
            {
              name: "ResearchBuddy",
              desc: "Literature review assistant that finds, summarizes, and maps connections between academic papers using AI.",
              category: "Research",
              pricing: "Free for .edu",
              rating: "4.8",
              badges: ["TRENDING"],
            },
            {
              name: "SyllabusAI",
              desc: "Generate complete course structures from learning objectives. Creates modules, assignments, rubrics, and discussion prompts.",
              category: "Course Design",
              pricing: "$9/mo educator",
              rating: "4.5",
              badges: ["NEW", "TRENDING"],
            },
          ].map((tool, i) => (
            <Link
              key={i}
              href="/ai-app-directory"
              className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block"
            >
              {/* Image - 170px height */}
              <div className="relative h-[170px] overflow-hidden">
                <Image
                  src={toolImages[i]}
                  alt={tool.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                {/* Badges */}
                <div className="absolute top-[10px] left-[10px] flex gap-2">
                  {tool.badges.map((badge, bi) => (
                    <span
                      key={bi}
                      className={`font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] ${
                        badge === "NEW"
                          ? "bg-[var(--green-dim)] text-[var(--green)]"
                          : "bg-[var(--amber-dim)] text-[var(--amber)]"
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 pt-3">
                {/* Category - JetBrains Mono */}
                <div className="font-mono text-[0.56rem] font-semibold tracking-[0.1em] uppercase mb-[0.35rem] flex items-center gap-[0.35rem]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--teal)]" />
                  <span className="text-[var(--teal)]">{tool.category}</span>
                </div>
                {/* Title - DM Sans Bold */}
                <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-[0.35rem]">
                  {tool.name}
                </h3>
                {/* Description - DM Sans Regular */}
                <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-[0.5rem] line-clamp-2">
                  {tool.desc}
                </p>
                {/* Footer - JetBrains Mono */}
                <div className="flex items-center gap-[0.5rem] font-mono text-[0.56rem] text-[var(--text-muted)] pt-[0.5rem] border-t border-[var(--border)]">
                  <span className="text-[var(--amber)]">★ {tool.rating}</span>
                  <span>{tool.pricing}</span>
                </div>
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
          title="Top Prompts"
          titleColor="var(--purple)"
          description="Trending in the Prompt Navigator"
          viewAllHref="/prompts"
          viewAllText="Browse all prompts"
        />

        <div className="grid-3">
          {[
            {
              title: "Generate Discussion Questions That Actually Spark Debate",
              desc: "Creates tension-based discussion questions from any reading that students actually want to argue about — not just answer.",
              difficulty: "Beginner",
              category: "Discussion",
              uses: "2.4k",
              trending: true,
              preview: '"Read this [text]. Identify the central tension or most debatable claim. Generate 5 discussion questions that force students to take a side..."',
            },
            {
              title: "AI-Resistant Assignment Redesigner",
              desc: "Analyzes your existing assignment and suggests modifications that maintain learning outcomes while reducing AI shortcutting.",
              difficulty: "Intermediate",
              category: "Assessment",
              uses: "1.8k",
              trending: false,
              preview: '"Here is my assignment: [paste]. Analyze which parts a student could complete using AI without learning. Suggest modifications..."',
            },
            {
              title: "Rubric-Based Feedback Draft Generator",
              desc: "Generates detailed, constructive student feedback aligned to your specific rubric criteria. You review and personalize before sending.",
              difficulty: "Beginner",
              category: "Feedback",
              uses: "3.1k",
              trending: true,
              preview: '"Using this rubric [paste rubric], generate detailed feedback for this student submission [paste]. Score each criterion..."',
            },
          ].map((prompt, i) => (
            <Link
              key={i}
              href="/prompts"
              className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block relative overflow-hidden"
            >
              {/* Gradient Top Border */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--purple)] to-[var(--cyan)]" />

              {/* Badges - JetBrains Mono */}
              <div className="flex gap-2 mb-3 flex-wrap">
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
                {prompt.trending && (
                  <span className="font-mono text-[0.5rem] font-semibold px-[6px] py-[2px] rounded-[3px] bg-[var(--amber-dim)] text-[var(--amber)]">
                    🔥 Trending
                  </span>
                )}
              </div>

              {/* Title - DM Sans Bold */}
              <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-2">
                {prompt.title}
              </h3>

              {/* Description - DM Sans Regular */}
              <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-3">
                {prompt.desc}
              </p>

              {/* Prompt Preview Box - JetBrains Mono on dark background */}
              <div className="font-mono text-[0.7rem] text-[var(--cyan)] bg-[rgba(0,212,255,0.04)] border border-[rgba(0,212,255,0.1)] rounded-[7px] p-3 leading-[1.5] mb-3 line-clamp-2">
                {prompt.preview}
              </div>

              {/* Footer - JetBrains Mono */}
              <div className="flex items-center gap-[0.5rem] font-mono text-[0.56rem] text-[var(--text-muted)]">
                <span className="text-[var(--green)]">{prompt.uses} uses</span>
                <span>{prompt.category}</span>
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
          description="Quick experiments and AI explorations"
          viewAllHref="/tinker-lab"
          viewAllText="View experiments"
        />

        <div className="grid-3">
          {[
            {
              title: "I Graded 100 Papers with 5 Different AI Tools — Here's What Happened",
              desc: "Running the same set of student essays through five AI grading platforms and comparing the results to human graders.",
              type: "Experiment",
              duration: "8 min",
              date: "Feb 14",
            },
            {
              title: "Building a Custom AI Tutor for Intro Biology — From Scratch",
              desc: "A walkthrough of creating a subject-specific AI tutor using free tools. No coding required. Total setup time: 2 hours.",
              type: "Experiment",
              duration: "12 min",
              date: "Feb 7",
            },
            {
              title: "Can AI Write a Syllabus? We Put It to the Test",
              desc: "Three faculty members review an AI-generated syllabus for their own courses — blind. Their reactions are telling.",
              type: "Experiment",
              duration: "10 min",
              date: "Jan 31",
            },
          ].map((exp, i) => (
            <Link
              key={i}
              href="/tinker-lab"
              className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] overflow-hidden transition-all duration-300 hover:border-[var(--border-hover)] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(0,0,0,0.3)] block"
            >
              {/* Image - 170px height */}
              <div className="relative h-[170px] overflow-hidden">
                <Image
                  src={tinkerImages[i]}
                  alt={exp.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                />
                {/* Type Badge */}
                <span className="absolute top-[10px] left-[10px] font-mono text-[0.53rem] font-semibold tracking-[0.06em] uppercase px-2 py-[3px] rounded-[5px] text-white bg-[rgba(0,212,255,0.85)]">
                  {exp.type}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 pt-3">
                {/* Category - JetBrains Mono */}
                <div className="font-mono text-[0.56rem] font-semibold tracking-[0.1em] uppercase mb-[0.35rem] flex items-center gap-[0.35rem]">
                  <span className="w-[5px] h-[5px] rounded-full bg-[var(--cyan)]" />
                  <span className="text-[var(--cyan)]">Tinker Lab</span>
                </div>
                {/* Title - DM Sans Bold */}
                <h3 className="font-sans text-[1rem] font-bold leading-[1.22] mb-[0.35rem]">
                  {exp.title}
                </h3>
                {/* Description - DM Sans Regular */}
                <p className="text-[0.78rem] text-[var(--text-secondary)] leading-[1.55] mb-[0.5rem] line-clamp-2">
                  {exp.desc}
                </p>
                {/* Footer - JetBrains Mono */}
                <div className="flex items-center gap-[0.6rem] font-mono text-[0.58rem] text-[var(--text-muted)] pt-[0.5rem] border-t border-[var(--border)]">
                  <span className="text-[var(--cyan)]">{exp.duration} listen</span>
                  <span>{exp.date}</span>
                </div>
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

          <h2 className="font-sans text-[1.6rem] font-bold mb-2">
            Never Miss a Pulse
          </h2>
          <p className="text-[0.85rem] text-[var(--text-secondary)] max-w-[500px] mx-auto mb-6">
            Get the Innovation Pulse delivered to your inbox. Curated AI news for higher education — no fluff, no hype.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-[400px] mx-auto mb-2">
            <input
              type="email"
              placeholder="your@university.edu"
              className="input flex-1"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe Free
            </button>
          </form>

          <p className="text-[0.68rem] text-[var(--text-muted)]">
            Join 1,200+ educators. No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}

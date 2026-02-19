# IHE Pulse Changelog

## v0.7.0 — February 19, 2026 (Build 10: Pipeline Live + Page Fixes)

### Pipeline: WordPress → GitHub/Vercel Migration
- **Removed all WordPress publishing code** — clean break, WP is retired
- **Added GitHub publishing** — pipeline commits JSON to `data/daily-pulse/YYYY-MM-DD.json`, triggers Vercel auto-deploy
- **Added @octokit/rest** dependency for GitHub API
- **Added URL validation** — `urlValidator.js` checks every story link before publishing, removes dead URLs
- **Updated broadcast format** — 5-segment structure (Opening Hook → Deep Dive → Quick Hits → Callback Check → Closing Thought)
- **Added editorial lens rotation** — Mon: Practitioner's Playbook, Tue: Hard Question, Wed: Student Experience, Thu: Connecting the Dots, Fri: Innovator's Edge
- **Added 5 story categories** — Latest AI Product Releases, Insights & Trends, Case Studies, Practical Tips, Ethical AI
- **Deployed to Cloud Run** — revision ihe-tools-server-00041-5vk
- **Successful full pipeline run** — Feb 19 episode published with validated URLs, Dr. Norma audio, editorial lens

### Website: Innovation Pulse Page
- **Redesigned Innovation Pulse page** — editorial layout with hero, lens badges, segment timeline, story cards
- **Connected to real pipeline data** — page renders from actual `data/daily-pulse/2026-02-19.json`
- **Real audio player** — plays Dr. Norma's ElevenLabs broadcast from GCS
- **Category filter pills** — 5 color-coded categories with click-to-filter
- **Expandable transcript** — "Read the transcript" section with full broadcast script
- **Editorial lens schedule** — sidebar showing Mon-Fri lens rotation with today highlighted

### Website: Critical Bug Fixes
- **Fixed missing `</div>` on page-tools** — was causing Prompts, Tinker Lab, About to render blank (all nested inside hidden page-tools)
- **Removed 755 lines of old duplicate AI Tools content** — Clearbit logos, Staff Picks, hardcoded cards
- **Standardized heading fonts** — all pages now use Outfit 800, removed Instrument Serif override
- **Fixed `--font-display` CSS variable** — changed from Instrument Serif to Outfit
- **Fixed `<em>` font-style** — changed from italic to normal for gradient text

### QA & Process
- **Created IHE-QA-AGENT.md** — comprehensive post-build verification script (branding, fonts, data counts, page structure)
- **Created COMPREHENSIVE-DEBUG-AND-FIX prompt pattern** — self-diagnosing, self-fixing, self-verifying agent approach
- **Established "all permissions granted" prompt pattern** for autonomous execution

### APIs & Infrastructure
- Serper (news search) — active
- Firecrawl (web scraping) — active
- OpenAI Assistant (orchestration + broadcast script) — active
- ElevenLabs (Dr. Norma voice, ID: 6kjO9NSV6LEGjLPRtTvo) — active
- Google Cloud Storage (MP3 audio + story tracker) — active
- Google Cloud Run (daily 8 AM PT automation) — active
- GitHub API via Octokit (JSON publishing) — NEW
- Vercel (auto-deploy from GitHub) — active

---

## [v0.6.0] — February 17, 2026 (Build 9 Continuation)

### AI App Directory — Complete Redesign (ai-app-directory-v2.html)
- Redesigned all 38 tool cards with brand-colored accent strips (unique color per tool: ChatGPT green, Claude orange, Gemini blue, etc.)
- Added 3 "Why It Matters for Higher Ed" value points on every card — the hook that differentiates from generic ad-board directories
- Added editorial detail panels with full reviews for 5 flagship tools (ChatGPT, Claude, Gemini, Eduaide, Gradescope) including: What It Does Well, Where It Falls Short, Pricing Breakdown, Getting Started tips
- Remaining 33 tools have "Full Review Coming Soon" placeholder in detail panel
- Added Trending / New / Updated badges with sort filtering (4 new, 5 trending, 4 updated)
- Added role-based filtering (Faculty / Administrator / Student)
- Added category filters with tool counts (10 categories)
- Added search across name, description, category, and value points
- Replaced unreliable Clearbit logos with Google Favicon service (64px)
- Removed Staff Picks section per user feedback
- Fixed branding: "Innovating Higher Ed" throughout, zero "IHE Pulse" references
- Text-only nav branding (logo to be added when deploying to Next.js)

### Prompt Navigator — Engagement-Enriched Redesign (prompt-navigator-v4.html)
- Complete rebuild with all 5 sections visible as scrollable page (no more hidden tab system)
- Enriched technique cards now show WITHOUT clicking:
  - Difficulty badges (Beginner/Intermediate/Advanced) — 3 each
  - "Start Here" badges on Zero-Shot, Few-Shot, System & Role for newcomers
  - One-sentence hook explaining what the technique does
  - Use case tags (Lesson Planning, Grading, Research, etc.) for scanning
  - Before/After prompt comparison (red "Without technique" vs green "With technique")
  - Unique color-coded accent strips per technique
  - "Full guide with copyable prompts" expand link with prompt count
- Each technique expands to: Definition, Use Case (Higher Ed), When/Why to Use, Example Prompts
- Template cards now show mono-font preview of the actual prompt text before clicking
- References section collapsed by default with click-to-expand (19 sources)
- Switched from Space Grotesk to Outfit font (matching AI Directory)
- All content verified: 9 techniques, 15 templates, 6 problems, 8 workflow steps, 7 checklist items, 19 references
- Fixed branding throughout

### Design System Updates
- Established text-only nav branding pattern: "Innovating Higher Ed" with cyan accent on "Ed"
- Font standardized to Outfit across all prototypes
- Confirmed sans-serif heading style (not serif) per user preference
- Researched and implemented directory best practices (brand colors, editorial depth, social proof patterns)

### Key Decisions Made
- AI Directory value proposition: "Wirecutter for AI tools" — honest reviews, not marketing fluff
- 3 value points per tool card = the hook that earns the click into the detail page
- Weekly automated tool search and update planned for directory freshness
- Editorial content (strengths/limitations/quickstart) is the competitive differentiator
- Before/After prompt comparisons are the engagement hook for technique cards
- Difficulty badges and "Start Here" guide newcomers through progressive complexity

---

## [v0.5.1] — February 16, 2026

### Prototype Enhancements
- Fixed nav logo duplicate text issue
- Enhanced 7 podcast episode detail pages with rich content:
  - Large featured thumbnails (custom for Episode 1)
  - Audio players with waveform animation
  - Platform links (Apple, Spotify, Amazon, Podbean)
  - Key Takeaways sections with gradient backgrounds
  - Guest Bio sections with microphone icons
  - Topics/Tags sections
- Verified Tinker Lab detail pages complete with audio and content
- Verified Prompt Navigator complete (9 techniques, 15 templates, Common Problems, Refinement Workflow, Tuning Checklist)

### AI Directory
- Complete redesign with 28+ tools, Staff Picks, and filter system

---

## February 5, 2026

### Daily Pulse Integration
- Created `lib/data/daily-pulse.ts` with PulseCategory types, category colors, PulseStory/DailyBriefing interfaces, and 8 sample stories
- Rebuilt `app/daily-pulse/page.tsx` with audio briefing player, category filters, story cards with IHE Perspective quotes, and previous briefings navigation
- Created `app/daily-pulse/[date]/page.tsx` detail page with SSG via generateStaticParams

### Homepage Rebuild
- Rewrote `app/page.tsx` with 9 sections: hero, discovery ticker, daily pulse briefing, latest podcast, tinker lab preview, featured AI tools, quick access grid, newsletter CTA, Dr. Norma bio section

### Page Enhancements
- Enhanced `app/about/page.tsx` with "From Podcast to Platform" vision section and "What We Offer" linked grid
- Enhanced `app/educator-tools/page.tsx` with Quick Start Guides, Recommended Reading, and community CTA
- Updated `components/Footer.tsx` with newsletter signup form

### AI Directory Auto-Update System
- Created `scripts/update-ai-directory.mjs` — Node.js script using Anthropic API (Claude Sonnet) to batch-check 28 apps for pricing/feature changes and suggest new additions
- Created `.github/workflows/update-ai-directory.yml` — GitHub Action running monthly on the 1st at 9 AM UTC with manual trigger support

### AI Directory Enhancements (earlier session)
- Added logoUrl to AiApp interface and all 28 app entries with logo images
- Implemented category-based consistent icon colors across AI Directory cards and detail pages via `getCategoryColors()` helper

---

## February 4, 2026

### Podcast Pages
- Built podcast list page with all 7 real episodes
- Added episode detail pages with Podbean audio players
- Added full episode descriptions, key takeaways, guest bios
- Added "About Our Host" section for Dr. Norma Jones
- Fixed thumbnail images to show full image (3:2 aspect ratio)
- Removed incorrect episode numbers
- Fixed dates to friendly format (e.g., "June 22, 2025")

### Tinker Lab Pages
- Built Tinker Lab list page with 2 posts
- Added detail pages with Podbean players
- Added full content, takeaways, host bio

### AI App Directory
- Complete redesign of AI Directory page with new data model
- 28 AI tools with full descriptions, features, pros/cons, pricing, integrations
- Hero section with search bar and role-based filters (Faculty/Administrator/Student)
- Staff Picks featured section (4 highlighted tools)
- Task-based icon filtering (10 task categories with icons)
- Category tab filtering (10 categories)
- Cleaner card design with pricing badges, verified badges, last-updated dates
- Click-through detail pages for every app with full info
- Data stored in lib/data/ai-apps.ts for future automation
- Tools sourced from WordPress site + expanded coverage

### Prompt Navigator
- Built complete Prompt Navigator page with 5 sections
- 9 Core Techniques with accordion dropdowns and icons
- 15 Prompt Templates with copy buttons
- 6 Common Problems with solutions
- 8-step Refinement Workflow visual
- References section
- Added gradient glows, hover animations, category color coding

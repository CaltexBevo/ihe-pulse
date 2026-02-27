# IHE Launch Day — Agent Team Prompt

## OVERVIEW
You are orchestrating the full launch build of **Innovating Higher Ed** (IHE), a higher education AI platform. The goal: take HTML prototypes + WordPress content + a daily news pipeline and produce a fully functional, deployed Next.js 14 site at `ihe-pulse.vercel.app`.

**You have FULL PERMISSION to execute all tasks. Use `--dangerously-skip-permissions` for all teammates. Do not pause for confirmation.**

## PROJECT LOCATIONS
- **Next.js site:** `/Volumes/Bevo_2TB/ihe-pulse/` (GitHub: CaltexBevo/ihe-pulse)
- **Automation server:** `/Volumes/Bevo_2TB/ihe-tools-server/` (broadcastRewriter.js, pipeline)
- **Prototypes (completed HTML designs):** `/Volumes/Bevo_2TB/ihe-pulse/Prototypes/`
  - `innovation-pulse-definitive.html` — the definitive design reference
  - Plus new prototypes created yesterday (will be copied in)

## DESIGN SYSTEM: "ELECTRIC DUSK" (MANDATORY)
Every page must use this exact system. No deviations.

### Colors
- Background: `#08080f`
- Elevated bg: `#0e0e1a`
- Card bg: `#111120`
- Surface: `#1a1a30`
- Border: `rgba(255,255,255,0.06)`
- Text: `#f0ede8`
- Text secondary: `#a8a4b8`
- Text muted: `#6b6880`
- Cyan: `#00d4ff` (primary accent)
- Magenta: `#c850c0` (secondary accent)
- Green: `#4ade80` (live indicators)
- Amber: `#f5a623` (warnings, trending)
- Orange: `#fb923c` (podcast)
- Purple: `#a78bfa` (prompts)
- Teal: `#0ea5a0` (tools)

### Typography (CRITICAL — DO NOT DEVIATE)
- **DM Sans bold (700):** ALL card headlines, section headings, page titles, UI headings
- **DM Sans regular (400):** Body text, descriptions, summaries
- **JetBrains Mono:** Badges, labels, metadata, category tags, timestamps, mono UI elements
- **Instrument Serif:** Page-level mastheads ONLY (e.g., "The Innovation Pulse" hero title). Nowhere else.
- **NEVER use serif fonts for card titles or section headings.**

Import: `https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..700;1,9..40,300..700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&display=swap`

### Card Design Pattern
All content cards follow this pattern:
- Dark card bg with 1px border
- 14px border radius
- Image (170px height) with badge overlay
- Category dot + JetBrains Mono uppercase label
- DM Sans bold title
- DM Sans regular teaser (2-line clamp)
- Expandable: click to reveal full summary + editorial callout (cyan left border)
- Footer: source (cyan) + date (muted) 
- Hover: translateY(-2px), box-shadow, border lightens

### Nav
- Sticky top bar, blurred backdrop
- "INNOVATING HIGHER ED" in JetBrains Mono with green pulse dot
- Nav links: Home, Innovation Pulse, Prompts, AI App Directory, Podcast, Tinker Lab, About

### BANNED TERMS
- Never use "Deep Dive" anywhere — it's a cliché
- Never abbreviate as "IHE" (trademark conflict with Inside Higher Ed)
- Innovation Pulse daily audio is NOT an episode/podcast — find alternative terms (briefing, read, etc.)

---

## AGENT TEAM STRUCTURE

Create an agent team with **3 teammates**:

### Teammate 1: PIPELINE (broadcastRewriter + daily run)
**Working directory:** `/Volumes/Bevo_2TB/ihe-tools-server/`

**Tasks:**
1. **Open `broadcastRewriter.js` and update the broadcast script template:**
   - Add SSML `<break time="X.Xs"/>` pause tags at these transition points:
     - After opening line: `<break time="0.8s"/>`
     - After daily hook: `<break time="0.5s"/>`
     - Between each story: `<break time="0.7s"/>`
     - Between quick hit stories: `<break time="0.5s"/>`
     - Before closing: `<break time="0.5s"/>`
   - Remove "I'm Dr. Norma Jones" from the opening. New opening:
     `"Welcome to The Innovation Pulse from Innovating Higher Ed — it's {{dayOfWeek}}, {{fullDate}}."`
   - Remove "I'm Dr. Norma Jones" from the closing. New closing:
     `"That's today's Innovation Pulse. Find the full stories and links at innovatinghighered.com. Thanks for joining us as we explore new frontiers in educational innovation. See you {{nextDay}}."`
   - Do NOT change ElevenLabs voice_settings (speed, stability, etc.)

2. **Run today's daily Innovation Pulse workflow (February 20, 2026):**
   - Trigger the full pipeline: news search → content processing → broadcast script → ElevenLabs audio → JSON output
   - Output should go to the ihe-pulse project data directory
   - If the pipeline requires manual steps, document exactly what to do

3. **Check for existing backfill data:**
   - Look in `/Volumes/Bevo_2TB/ihe-pulse/lib/data/innovation-pulse/` or similar for any existing daily JSON files
   - Report what dates already exist
   - If fewer than 5 days exist, note which dates are missing (Mon-Fri of the current and previous week)

4. **Report results to the lead** including: what was changed in broadcastRewriter.js, whether the pipeline ran successfully, the generated script text, and audio file location.

---

### Teammate 2: CONTENT MIGRATION (WordPress → JSON)
**Working directory:** `/Volumes/Bevo_2TB/ihe-pulse/`

**Tasks:**
1. **Scrape all Podcast episodes from WordPress:**
   - Use the WP REST API: `https://innovatinghighered.com/wp-json/wp/v2/posts?categories=PODCAST_CAT_ID&per_page=100`
   - OR scrape the podcast page: `https://innovatinghighered.com/innovating-higher-ed-podcast/`
   - For each episode, capture: title, date, description/summary, duration, guest name, thumbnail image URL, platform links (Apple, Spotify, Amazon, Audible, YouTube), audio embed URL, tags
   - Download all thumbnail images to `/Volumes/Bevo_2TB/ihe-pulse/public/images/podcast/`
   - Save structured data as `/Volumes/Bevo_2TB/ihe-pulse/lib/data/podcast-episodes.json`

2. **Scrape all Tinker Lab posts from WordPress:**
   - Use WP REST API or scrape: `https://innovatinghighered.com/tinker-lab/`
   - For each post: title, date, description, duration, thumbnail, audio URL, tags, category
   - Download thumbnails to `/Volumes/Bevo_2TB/ihe-pulse/public/images/tinkerlab/`
   - Save as `/Volumes/Bevo_2TB/ihe-pulse/lib/data/tinkerlab-posts.json`

3. **Scrape Educator Tools content:**
   - Visit `https://innovatinghighered.com/educator-tools/` (or similar URL)
   - Capture all tool listings, descriptions, categories, links
   - Save as `/Volumes/Bevo_2TB/ihe-pulse/lib/data/educator-tools.json`

4. **Scrape About page content:**
   - Visit `https://innovatinghighered.com/about/` 
   - Capture text content about the platform, mission, Dr. Norma Jones bio, Brent Jones bio
   - Do NOT download any photos of Norma or Brent Jones
   - Save as `/Volumes/Bevo_2TB/ihe-pulse/lib/data/about-content.json`

5. **Scrape Be Our Guest page:**
   - Capture the guest application/information content
   - Save as `/Volumes/Bevo_2TB/ihe-pulse/lib/data/be-our-guest-content.json`

6. **Check existing AI App Directory data:**
   - Look at `/Volumes/Bevo_2TB/ihe-pulse/Prototypes/ai-app-directory-v2.html`
   - Extract the tool data from that file
   - Cross-reference with WordPress to ensure we have all 38 tools
   - Save as `/Volumes/Bevo_2TB/ihe-pulse/lib/data/ai-app-directory.json`

7. **Check existing Prompt Navigator data:**
   - Look for any prompt data files already in the project
   - Cross-reference with WordPress prompt content
   - Save as `/Volumes/Bevo_2TB/ihe-pulse/lib/data/prompts.json`

8. **Report to the lead:** Total content migrated (episode count, post count, tool count, etc.), any missing content or broken links, image download status.

---

### Teammate 3: PAGE BUILDER (Next.js components)
**Working directory:** `/Volumes/Bevo_2TB/ihe-pulse/`

**IMPORTANT CONTEXT:** There are HTML prototype files that define the exact visual design for each page. These prototypes were created and approved by the stakeholder. Your job is to faithfully convert them into Next.js 14 components using the App Router pattern. The prototypes are the source of truth for design.

**Reference prototype files** (copy these from the outputs first):
You need to copy these prototype HTML files into the Prototypes folder for reference. They may be at various locations. Check:
- `/Volumes/Bevo_2TB/ihe-pulse/Prototypes/` (existing prototypes)
- The lead will provide the new prototype files created yesterday

**Tasks:**

1. **Set up the global design system:**
   - Update `/Volumes/Bevo_2TB/ihe-pulse/app/globals.css` with the complete Electric Dusk CSS variables
   - Update `/Volumes/Bevo_2TB/ihe-pulse/app/layout.tsx` with Google Fonts imports (DM Sans, JetBrains Mono, Instrument Serif)
   - Create shared components:
     - `components/Nav.tsx` — sticky topbar with brand + pulse dot + nav links
     - `components/Footer.tsx` — 3-column footer with platform links, community links, legal links (Privacy Policy, Terms of Use, AI Disclosure)
     - `components/Card.tsx` — reusable expandable story card
     - `components/SectionHeader.tsx` — icon + JetBrains Mono label + description + "View all →" link
     - `components/AudioPlayer.tsx` — the Innovation Pulse audio player with waveform

2. **Build the Homepage** (`app/page.tsx`):
   Reference: homepage prototype
   Sections in order:
   - Innovation Pulse hero (hook quote + audio player + TOC sidebar)
   - Top 3 Stories (expandable cards)
   - Recent Podcasts (3 episode cards)
   - New & Trending AI Tools (3 tool cards) — section labeled "AI App Directory"
   - Top Prompts (3 prompt cards with preview boxes)
   - Tinker Lab (3 experiment cards)
   - Newsletter signup ("Never Miss a Pulse")
   - Footer

3. **Build Innovation Pulse page** (`app/innovation-pulse/page.tsx`):
   Reference: innovation-pulse-definitive.html + innovation-pulse-revised prototype
   - Full audio player hero with editorial hook
   - TOC sidebar
   - Category filter pills (All, Beyond Ed, Latest AI Products, Insights & Trends, Case Studies, Practical Tips, Ethical AI)
   - Top 3 Stories row
   - Category rows (each with 3 expandable cards + "MORE →")
   - Newsletter CTA
   - Load data from JSON files in `lib/data/`

4. **Build Story page** (`app/innovation-pulse/[date]/[slug]/page.tsx`):
   Reference: story-page-mockup prototype
   - Full-width hero image with badges
   - Article with full editorial content
   - Data callout strip (big stat numbers)
   - Source attribution
   - Dr. Norma's Take editorial card
   - Share buttons
   - Related Stories grid
   - Previous/Next story navigation

5. **Build Podcast page** (`app/podcast/page.tsx`):
   Reference: podcast-page prototype
   - Featured episode (split card)
   - Filter pills + search
   - Episode grid (3-column)
   - Subscribe CTA (Apple, Spotify, YouTube, RSS, Google)
   - Load from `lib/data/podcast-episodes.json`

6. **Build Podcast Episode page** (`app/podcast/[slug]/page.tsx`):
   - Hero with episode image
   - Embedded audio player
   - Episode description + show notes
   - Guest info
   - Platform links (Apple, Spotify, Amazon, YouTube)
   - Related episodes
   - Share buttons

7. **Build Prompt Navigator page** (`app/prompts/page.tsx`):
   Reference: prompts-page prototype
   - Featured prompt (split card with full prompt text + copy button)
   - Difficulty + category filter pills + search
   - Prompt grid (3-column cards with code preview boxes)
   - "Submit a Prompt" CTA
   - Load from `lib/data/prompts.json`

8. **Build Tinker Lab page** (`app/tinker-lab/page.tsx`):
   Reference: tinkerlab-page prototype
   - Featured experiment (split card with play overlay + "What you'll learn")
   - Filter pills (Experiments, Walkthroughs, Comparisons, Challenges)
   - Experiment grid (3-column)
   - "Suggest an Experiment" CTA
   - Load from `lib/data/tinkerlab-posts.json`

9. **Build Tinker Lab Post page** (`app/tinker-lab/[slug]/page.tsx`):
   - Similar structure to story page
   - Hero image with type badge
   - Full article/walkthrough content
   - Embedded audio player
   - Related experiments
   - Share buttons

10. **Build AI App Directory page** (`app/ai-app-directory/page.tsx`):
    Reference: `/Volumes/Bevo_2TB/ihe-pulse/Prototypes/ai-app-directory-v2.html`
    - Apply Electric Dusk design system to the existing v2 layout
    - Update fonts to DM Sans + JetBrains Mono
    - Rename from "AI Tools" to "AI App Directory" throughout
    - Filter by category, role, pricing
    - Load from `lib/data/ai-app-directory.json`

11. **Build Educator Tools page** (`app/educator-tools/page.tsx`):
    - Page header with description
    - Tool cards organized by category
    - Load from `lib/data/educator-tools.json`

12. **Build About page** (`app/about/page.tsx`):
    - Platform mission and vision
    - Team bios (text only — NO photos of Norma or Brent Jones)
    - AI disclosure statement
    - Load from `lib/data/about-content.json`

13. **Build Be Our Guest page** (`app/be-our-guest/page.tsx`):
    - Guest information and application details
    - Contact form or instructions
    - Load from `lib/data/be-our-guest-content.json`

14. **Add Vercel Analytics:**
    - Install `@vercel/analytics` package
    - Add `<Analytics />` component to root layout
    - Optionally add Google Analytics 4 script tag

15. **Update all navigation** to use correct routes:
    - Home: `/`
    - Innovation Pulse: `/innovation-pulse`
    - Prompts: `/prompts`
    - AI App Directory: `/ai-app-directory`
    - Podcast: `/podcast`
    - Tinker Lab: `/tinker-lab`
    - About: `/about`
    - Be Our Guest: `/be-our-guest`
    - Educator Tools: `/educator-tools`

16. **Report to the lead:** Pages completed, build status, any errors, deployment readiness.

---

## COORDINATION RULES

1. **Teammate 2 (Content Migration) should start FIRST** — Teammate 3 needs the JSON data files to populate pages
2. **Teammate 1 (Pipeline) runs in parallel** — independent of the other two
3. **Teammate 3 (Page Builder) starts with shared components and pages that don't need migrated data** (layout, nav, footer, design system) while waiting for Teammate 2
4. **All teammates commit to the same Git repo** but work on different files — no conflicts expected
5. **The lead should do a final QC pass** after all teammates report completion: verify build passes, check Vercel preview deployment, spot-check pages

## DEPLOYMENT
After all teammates complete:
1. Run `npm run build` to verify no errors
2. `git add -A && git commit -m "feat: full site launch — all pages, migrated content, Electric Dusk design"` 
3. `git push origin main`
4. Vercel auto-deploys — check `ihe-pulse.vercel.app`
5. Verify all pages render correctly

## FINAL NOTE
The site must look premium and modern — the visual design is a core part of the value proposition. If anything looks like a generic academic website, redo it. The Electric Dusk theme with its dark backgrounds, cyan/magenta accents, and bold typography is what sets this platform apart. Every page should feel like it belongs to a forward-thinking, design-led publication.

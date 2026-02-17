# IHE Pulse Changelog

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

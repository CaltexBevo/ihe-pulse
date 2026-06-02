# ROADMAP — Innovating Higher Ed (ihe-pulse)

## Phase 0: DNS Cutover (OPEN)

**Status:** The new Next.js site is live at `ihe-pulse.vercel.app`. The production domain `innovatinghighered.com` is still served by Apache/WordPress.

- [ ] Configure DNS to point `innovatinghighered.com` to Vercel
- [ ] Verify SSL certificate auto-provisioning on Vercel
- [ ] Set up 301 redirects for legacy WordPress URLs
- [ ] Decommission WordPress hosting after cutover verification

---

## Completed: Homepage Restructure (May 26–29, 2026)

### Innovation Pulse as Homepage
- [x] Homepage (`/`) now renders Innovation Pulse content
- [x] `/innovation-pulse` redirects to `/`
- [x] Removed vertical accent bars from section headings
- [x] Top Stories: converted slider → 3-column grid
- [x] Removed duplicate CTAs (gated via showHero/showNewsletterCTA props)
- [x] Added "Explore more from Innovating Higher Ed" section at bottom

### Audio Player
- [x] Fixed play/pause icon toggle (was stuck on play)
- [x] Added mobile play-button overlay on hero artwork
- [x] Hidden transport controls and waveform on mobile (<768px)

### Recent Episodes
- [x] Redesigned as horizontal thumbnail strip with branded covers
- [x] Further redesigned as wide horizontal cards (cover left, title right)
- [x] Raised display cap from 6 to ~16 episodes

### All Episodes Page
- [x] Renamed "Archive" → "All Episodes" (gradient header)
- [x] Playlist-style rows with branded cover boxes + play button overlay
- [x] Info container: kicker / headline / meta line
- [x] Removed episode numbers, kept week groupings

### Navigation
- [x] Removed "Innovation Pulse" nav item
- [x] Added "All Episodes" nav item

### Categories
- [x] "View All" links now specify category name
- [x] Category pages use expandable Card component

---

## Completed This Sprint (Feb 23, 2026)

### Build 13.2: Interactive Components (Feb 23)
- [x] Homepage prompts expand in place (modal overlay with full prompt, copy button, pro tips)
- [x] Clearbit logo fallbacks (shows colored circle with first letter on error)
- [x] Created `HomePromptCards.tsx` and `HomeAIAppCards.tsx` client components
- [x] AI App Directory cards link to individual app pages

### Build 13.1: Site-Wide Fixes (Feb 23)
- [x] Logo image in navigation bar (replaces "IHE PULSE" text)
- [x] Image fixes: podcast and tinker lab cards use `object-contain` (full artwork visible)
- [x] Removed "Earlier This Week" section (redundant with day pills)
- [x] Day pill selection now updates ALL page content (date, lens, quote, stories sidebar, lead story)
- [x] Homepage AI App Directory shows real tools (ChatGPT, Claude, Eduaide.Ai) with Clearbit logos
- [x] Fixed all "IHE" abbreviations in metadata → "Innovating Higher Ed" (7 layout files)
- [x] Podcast detail page image container matches image size

### Build 13: Innovation Pulse Page Architecture (Feb 22-23)
- [x] Audio day pills below main player for quick access to this week's episodes
- [x] Story detail pages at `/innovation-pulse/story/[slug]` with full article, Our Take section
- [x] Category archive pages at `/innovation-pulse/category/[category-slug]` with all stories
- [x] Homepage audio player now actually plays mp3 files
- [x] Lead story links work throughout the site
- [x] Audio archive page at `/innovation-pulse/archive` with all episodes by week
- [x] Removed all "Dr. Norma" references per branding rules
- [x] V4 category system applied site-wide
- [x] Audio player properly reloads when switching between days (Feb 23 fix)
- [x] Updated voice disclosure to remove personal name attribution

### Innovation Pulse Week Feb 16-20
- [x] 20 stories created (5 big + 15 short)
- [x] 5 audio files generated via ElevenLabs (~24MB total)
- [x] Full week deployed to production
- [x] Real audio player with play/pause, progress, seeking
- [x] V4 category system implemented (Insights & Trends, Case Study, Practical Tips, Ethical AI, Latest AI Products, Beyond Ed)
- [x] Editorial lens rotation working (Mon-Fri)
- [x] Earlier This Week section (expandable previous days)

---

## Completed This Sprint (Feb 26, 2026)

### Build 12: Data Recovery + Category Fix + UI Restoration (Feb 26)
- [x] Fix category mapping (unified V4 mapping) — Feb 26
- [x] Merge legacy + pipeline data sources — Feb 26
- [x] 5 weekday pills below audio player — Feb 26
- [x] Lead story full editorial treatment — Feb 26
- [x] Story cards with real summaries — Feb 26
- [x] All 7 V4 category sections — Feb 26
- [x] Restored Feb 19 & Feb 23 data with summaries extracted from broadcast scripts
- [x] Local-first verification workflow (localhost review before push)

---

## Current Sprint

### IN PROGRESS
- [ ] Pipeline: populate story summaries automatically (not empty strings)
- [ ] Pipeline: date-collision protection (don't overwrite existing data without flag)
- [ ] Pipeline: proper V4 category assignment in broadcastRewriter.js
- [ ] Generate full week of pipeline data (Mon-Fri) to populate weekday pills
- [ ] Local verification workflow enforcement (never push without localhost review)

### READY TO BUILD
- [ ] Week in Review category for Friday synthesis
- [ ] Visual QA pass on new pages (story pages, category pages, archive)

### BLOCKED / WAITING
- [ ] None currently

---

## Next Sprint

### Email System
- [ ] Daily email: link to that day's audio + story cards
- [ ] Weekly digest email: Friday recap for weekly-only subscribers
- [ ] "Never Miss a Pulse" signup form wired to actual email service
- [ ] Email subject lines function as teases

### Friday Recap (Deferred)
- [ ] Separate Friday recap audio file (3-4 min, week through-line only)
- [ ] Recap as preview card in archive week view
- [ ] Recap-only option for weekly digest subscribers

### Automation Pipeline
- [ ] Daily 8 AM PT automated pipeline (Google Cloud Run)
- [ ] OpenAI Assistant orchestration for news gathering
- [ ] Serper search + Firecrawl scraping
- [ ] Story callback system for tracking developing stories
- [ ] ElevenLabs voice synthesis integration
- [ ] Auto-publish to Innovation Pulse page

---

## Backlog

### Content
- [ ] Story callback system across weeks (permanent memory)
- [ ] Source diversity dashboard/tracker
- [ ] Category-specific RSS feeds
- [ ] Searchable story archive with keyword search

### Design
- [ ] Mobile-optimized audio player
- [ ] Story card image generation system
- [ ] Category color system refinement
- [ ] Dark mode audio player waveform visualization

### Infrastructure
- [ ] Story data format standardized (JSON schema)
- [ ] Automated story deduplication
- [ ] Audio file CDN/hosting solution
- [ ] Analytics: which stories get clicked, which audio gets played

### Other Pages
- [ ] A.I. App Directory updates
- [ ] Prompt Navigator / Educator Tools
- [ ] Tinker Lab content
- [ ] Getting Started guide
- [ ] Case Studies page
- [ ] Community features

# ROADMAP — Innovating Higher Ed (ihe-pulse)

## Completed This Sprint (Feb 22, 2026)

### Build 13: Innovation Pulse Page Architecture (Feb 22)
- [x] Audio day pills below main player for quick access to this week's episodes
- [x] Story detail pages at `/innovation-pulse/story/[slug]` with full article, Our Take section
- [x] Category archive pages at `/innovation-pulse/category/[category-slug]` with all stories
- [x] Homepage audio player now actually plays mp3 files
- [x] Lead story links work throughout the site
- [x] Audio archive page at `/innovation-pulse/archive` with all episodes by week
- [x] Removed all "Dr. Norma" references per branding rules
- [x] V4 category system applied site-wide

### Innovation Pulse Week Feb 16-20
- [x] 20 stories created (5 big + 15 short)
- [x] 5 audio files generated via ElevenLabs (~24MB total)
- [x] Full week deployed to production
- [x] Real audio player with play/pause, progress, seeking
- [x] V4 category system implemented (Insights & Trends, Case Study, Practical Tips, Ethical AI, Latest AI Products, Beyond Ed)
- [x] Editorial lens rotation working (Mon-Fri)
- [x] Earlier This Week section (expandable previous days)

---

## Current Sprint

### IN PROGRESS
- [ ] Visual QA pass on new pages (story pages, category pages, archive)
- [ ] Verify Vercel deployment and test all new routes

### READY TO BUILD
- [ ] Week in Review category for Friday synthesis

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

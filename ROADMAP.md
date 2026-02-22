# ROADMAP — Innovating Higher Ed (ihe-pulse)

## Current Sprint

### IN PROGRESS
- [ ] Generate Monday-Friday audio via ElevenLabs (test run)
- [ ] Deploy Feb 16-20 stories to live Innovation Pulse page
- [ ] Update front page with current week's content

### READY TO BUILD
- [ ] "Earlier This Week" section on Innovation Pulse page
- [ ] Archive page at /innovation-pulse/archive (week view + category view)
- [ ] Archive link on main Innovation Pulse page

### BLOCKED / WAITING
- [ ] Audio generation requires ElevenLabs (Studio or ihe-tools-server API)

---

## Next Sprint

### Email System
- [ ] Daily email: link to that day's audio + story cards
- [ ] Weekly digest email: Friday recap for people who want weekly only
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
- [ ] Editorial lens rotation (Mon-Fri)
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

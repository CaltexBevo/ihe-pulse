# IHE Pulse — Project Roadmap
*Updated: February 19, 2026*

## ✅ Completed

### Website Design (Builds 1-10)
- [x] Portal Homepage with 9 destination cards
- [x] Electric Dusk theme (cyan/magenta on dark)
- [x] AI App Directory — 38 tools with brand-colored cards, 3 value points, editorial reviews, search/filters
- [x] Prompt Navigator — 9 techniques with difficulty badges, before/after previews, 15 templates, 19 references
- [x] Innovation Pulse page — editorial layout with real data, audio player, category filters, lens schedule
- [x] Podcast page with 7 episode detail pages
- [x] Tinker Lab with 2 post detail pages
- [x] Getting Started, Case Studies, Community, About pages
- [x] Font standardization (Outfit + DM Mono)
- [x] Text-only nav branding ("Innovating Higher Ed")
- [x] QA agent for post-build verification

### Pipeline (Build 10)
- [x] WordPress publishing removed — clean break
- [x] GitHub publishing via Octokit — JSON to data/daily-pulse/
- [x] URL validation before publishing
- [x] 5-segment broadcast format (Opening → Deep Dive → Quick Hits → Callback → Closing)
- [x] Editorial lens rotation (Mon-Fri)
- [x] 5 story categories (Product Releases, Insights, Case Studies, Tips, Ethical AI)
- [x] Dr. Norma Jones ElevenLabs audio generation
- [x] Cloud Run deployment (daily 8 AM PT)
- [x] Full end-to-end pipeline test successful

## 🔄 In Progress

### Innovation Pulse Page Refinement
- [ ] Review and improve page layout/design (user feedback pending)
- [ ] Serve prototype via localhost for Chrome extension review
- [ ] Wire archive section to show multiple days of episodes
- [ ] Improve audio player UX (progress bar, time scrubbing)

### Pre-Migration QA
- [ ] Click through ALL pages — verify content renders on each
- [ ] Test all nav links
- [ ] Test all story URLs from pipeline
- [ ] Verify audio playback
- [ ] Mobile responsive check

## 📋 Next Up — Migration to Live

### Convert HTML Prototype to Next.js
- [ ] Break ihe-complete-prototype.html into Next.js components
- [ ] Move data arrays (DIR_TOOLS, PN_TECHS, etc.) to TypeScript data files
- [ ] Set up Tailwind CSS with Electric Dusk theme tokens
- [ ] Implement proper image optimization with next/image
- [ ] Dynamic data loading for Innovation Pulse (fetch daily JSON at build time)
- [ ] Set up incremental static regeneration for daily content updates

### Content
- [ ] Write full editorial reviews for remaining 33 AI directory tools
- [ ] Podcast page — connect to actual episode data
- [ ] Dr. Norma Jones real photo (replace Unsplash placeholder)
- [ ] Real IHE logo integration (local asset, not hotlinked)

### Automation Enhancements
- [ ] Story callback system — track developing stories across days with references
- [ ] Theme deduplication — prevent repetitive content across episodes
- [ ] Weekly AI directory auto-update (GitHub Action + Claude API)
- [ ] Newsletter automation (ConvertKit/Beehiiv integration)

### Features Backlog
- [ ] AI chatbot navigator on homepage
- [ ] Template category filtering in Prompt Navigator
- [ ] "Dr. Jones Recommends" editorial badges
- [ ] Tool comparison feature in AI Directory
- [ ] Prompt Navigator search functionality
- [ ] Interactive prompt builder wizard
- [ ] Hybrid mindmap interface

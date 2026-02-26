# CHANGELOG — Innovating Higher Ed (ihe-pulse)

## v1.1.0 — February 26, 2026 (Build 12: Data Recovery + Category Fix + UI Restoration)

### Critical Fix: Data Recovery
- Pipeline re-run (commit ffccb89) had overwritten Feb 23 data with empty story summaries
- Extracted real summaries from broadcast scripts for all Feb 23 stories
- Restored Feb 19 data with proper summaries and editorial callouts
- All story files now verified: zero empty summary fields

### Category Mapping Overhaul
- Eliminated broken double-mapping (pipeline → old format → V4) that mangled category names
- Created unified UNIFIED_TO_V4_MAP handling all formats in one pass:
  - V4 names pass through directly (no mapping needed)
  - Pipeline uppercase names (e.g., "CASE STUDIES" → "Case Study")
  - Legacy names (e.g., "Teaching & Learning" → "Practical Tips")
- Fixed incorrect category assignments on Feb 23 stories (Dartmouth → Insights & Trends, AAC&U → Practical Tips, etc.)

### Data Routing Fix
- Page now merges BOTH data sources: `data/daily-pulse/` (pipeline) + `lib/data/innovation-pulse/` (legacy)
- Primary source preferred for duplicate dates, legacy fills gaps
- Stories aggregate across ALL episodes for category sections

### UI Restoration
- 5 weekday pills (Mon-Fri) always shown below audio player
  - Active day: green dot + duration
  - Future/missing days: dimmed with "--:--"
- Lead story section now shows full editorial treatment with complete summary + "Our Take" editorial callout
- All 7 V4 category filter pills visible (Insights & Trends, Case Study, Practical Tips, Ethical AI, Latest AI Products, Beyond Ed, Week in Review)
- Category sections populated from all available episodes (legacy + pipeline combined)
- Story cards show real summaries with "+ Read more" expand toggle

### Process Improvement
- Adopted local-first verification: `npm run dev` → review at localhost → approve → then push
- No more pushing broken code directly to Vercel production
- Added revision tracking with semantic versioning in CHANGELOG

### Lessons Learned
- Pipeline can overwrite good data if it re-runs for the same date — need date-collision protection
- Data routing changes must be tested against BOTH data sources before deploying
- Empty summary fields break the entire user experience — pipeline must enforce non-empty summaries
- Double category mapping creates silent bugs — use single unified mapping

### Files Modified
- `data/daily-pulse/2026-02-23.json` — Populated summaries, fixed categories
- `data/daily-pulse/2026-02-19.json` — Populated summaries, fixed categories
- `lib/data/innovation-pulse.ts` — Unified category mapping to V4
- `app/innovation-pulse/InnovationPulseClient.tsx` — 5 weekday pills, all-episode aggregation

---

## [2026-02-25] Data Source Fix: Pipeline Integration

### Data Loading Fix (lib/data/innovation-pulse.ts)
- **Fixed data directory mismatch**: App now reads from `data/daily-pulse/` where the pipeline publishes new episodes
- **Dual source support**: Reads from primary (`data/daily-pulse/`) then fallback (`lib/data/innovation-pulse/`) for legacy data
- **Automatic deduplication**: Episodes from primary source take precedence
- **Feb 23 episode now visible**: Monday's Practitioner's Playbook episode appears on homepage and Innovation Pulse page

### Pipeline Integration
- Episodes published by ihe-tools-server pipeline now automatically appear on the site
- No manual copying required — Vercel auto-deploys when GitHub receives new episode JSON

### Files Modified
- `lib/data/innovation-pulse.ts` — Updated `getAllEpisodes()` and `getEpisodeByDate()` to read from dual sources

---

## [2026-02-24] Build 13.4.1: Route Fix & URL Standardization

### Route Fixes
- **Standardized AI Directory URL**: All links now point to `/ai-directory` (was inconsistent between `/ai-directory` and `/ai-app-directory`)
- **Redirect from old URL**: `/ai-app-directory` now redirects to `/ai-directory`
- **Fixed Footer and About page**: Updated links to use correct URL
- **Detail pages working**: `/ai-directory/[slug]` routes properly generated for all 39 tools

### Files Modified
- `app/ai-app-directory/page.tsx` — Replaced with redirect to `/ai-directory`
- `components/Footer.tsx` — Fixed link to `/ai-directory`
- `app/about/page.tsx` — Fixed link to `/ai-directory`

---

## [2026-02-24] Build 13.4: AI Directory & Final Branding

### AI App Directory
- **39 tools with comprehensive detail pages**: Each tool page includes overview, key features, pros/cons, best for, pricing details, and integrations
- **Detail pages at `/ai-directory/[slug]`**: Full tool information with category-colored icons and badges
- **Fixed "Verified by IHE" badge**: Changed to simply "Verified" (no IHE abbreviation)

### Branding Cleanup (Complete)
- **Removed all "Dr. Norma Jones" content attribution**: Episode descriptions, story authors, post excerpts now use team-based language
- **Podcast host section**: Changed to "Innovating Higher Ed Podcast Team"
- **Tinker Lab posts**: Excerpts rewritten to remove personal attribution
- **About page**: Norma Jones, PhD retained as team member bio (not content author)

### Files Modified
- `app/ai-directory/page.tsx` — Fixed "Verified by IHE" badge
- `app/ai-directory/[slug]/page.tsx` — Fixed "Verified by IHE" badge
- `app/podcast/[slug]/page.tsx` — Replaced host bio with team description
- `lib/data/episodes.ts` — Removed personal attribution from descriptions
- `lib/data/stories.ts` — Changed featured story author
- `lib/data/posts.ts` — Rewrote excerpts and author bios

---

## [2026-02-24] Build 13.3: Branding Cleanup & Verification

### Branding Fixes
- **Removed "Dr." prefix**: Changed "Dr. Norma Jones" to "Norma Jones, PhD" format across all pages (about, podcast, be-our-guest)
- **Fixed IHE abbreviation**: Changed "IHE Pulse" to "Innovating Higher Ed" in educator-tools page
- **Cleaned up comments**: Removed obsolete comments referencing old branding

### Files Modified
- `app/be-our-guest/page.tsx` — host reference updated
- `app/about/page.tsx` — team bios and mission attribution updated
- `app/podcast/[slug]/page.tsx` — host info updated
- `app/educator-tools/page.tsx` — fixed "IHE" to full name
- `components/AudioPlayer.tsx` — removed obsolete comment

### Verification Completed
- Logo file confirmed at `public/images/ihe-logo.png` (permissions fixed to 644)
- PromptNavigatorSections.tsx contains all 9 techniques, 6 problems, 8 workflow steps, 7 checklist items, 19 references
- AI App Directory contains 39 tools with all requested categories (Gamification, Avatars, Music, Text to Speech)
- Podcast images use `object-contain` with dark background

---

## [2026-02-23] Build 13.2: Interactive Components

### Homepage Interactive Features
- **Prompts expand in place**: Clicking a prompt card now opens a modal overlay with the full prompt text, copy button, and pro tips — no navigation away from homepage
- **AI App Directory with logo fallbacks**: Clearbit logos now have proper fallback handling; if logo fails to load, shows a colored circle with the app's first letter
- **Client components**: Created `HomePromptCards.tsx` and `HomeAIAppCards.tsx` for interactive homepage sections

### New Components
- `components/HomePromptCards.tsx` — Client component with 3 prompts, modal expansion, copy-to-clipboard
- `components/HomeAIAppCards.tsx` — Client component with logo fallback using `onError` handler

### Improvements
- AI App Directory cards now link to individual app pages (`/ai-directory/[slug]`)
- Added "STAFF PICK" badge variant for Claude
- Modal animations with fadeIn/fadeUp effects
- Prompt variables highlighted in amber color in modal view

---

## [2026-02-23] Build 13.1: Site-Wide Fixes

### Navigation & Branding
- **Logo in nav**: Replaced "IHE PULSE" text with actual logo image (`/images/ihe-logo.png`)
- **"IHE" abbreviation fix**: Changed all metadata titles from "IHE PULSE" to "Innovating Higher Ed" (conflicts with Inside Higher Ed)
- **Files updated**: 7 layout files across be-our-guest, prompts, ai-directory, educator-tools, podcast, tinker-lab, innovation-pulse

### Image Fixes
- **Podcast cards**: Changed from `object-cover` to `object-contain` so cover art shows in full
- **Tinker Lab cards**: Same fix — full artwork visible with dark background
- **Podcast detail page**: Image container now matches natural image size (not forced 16:9)
- **Homepage podcast/tinker lab sections**: Same `object-contain` fix applied

### Innovation Pulse Page
- **Removed "Earlier This Week" section**: Day pills at top now handle day selection (removed ~150 lines of redundant UI)
- **Day pill updates all content**: Clicking a day now updates date, editorial lens, quote, stories sidebar, and lead story section
- **`displayedEpisode` pattern**: Created centralized state for which day's content to show

### Homepage
- **AI App Directory cards**: Replaced fake tools with real data (ChatGPT, Claude, Eduaide.Ai)
- **Clearbit logos**: Using `logo.clearbit.com/{domain}` for actual app logos instead of stock photos
- **Tool card redesign**: Accent color bars, proper category styling, "Learn more" links

### Files Modified
- `components/Navigation.tsx` — logo image instead of text
- `app/page.tsx` — image fixes, AI app directory cards
- `app/innovation-pulse/InnovationPulseClient.tsx` — removed Earlier This Week, day-switch updates all content
- `app/podcast/page.tsx` — image contain fix
- `app/podcast/[slug]/page.tsx` — image container sizing
- `app/tinker-lab/page.tsx` — image contain fix
- 7 layout files — IHE → Innovating Higher Ed

---

## [2026-02-23] Build 13 Fixes: Audio Reload + Branding

### Bug Fixes
- **Audio player reload**: Fixed issue where switching between day pills didn't reload the audio source. Added `useEffect` to call `audio.load()` when source changes.
- **Earlier This Week play buttons**: Made play buttons actually work — clicking now selects that day's audio and scrolls to the main player.
- **Branding cleanup**: Removed remaining "Dr. Norma Jones" references from homepage Tinker Lab descriptions.
- **Voice disclosure**: Updated Innovation Pulse voice disclaimer to remove personal name attribution.

### Files Modified
- `app/innovation-pulse/InnovationPulseClient.tsx` — audio reload effect, working play buttons in Earlier section
- `app/innovation-pulse/layout.tsx` — metadata description branding
- `app/innovation-pulse/[date]/page.tsx` — OUR TAKE label, signature, voice disclaimer
- `app/page.tsx` — Tinker Lab descriptions

### Documentation
- Updated ROADMAP.md with Feb 23 fixes
- Created `tasks/lessons.md` with development lessons learned

---

## [2026-02-22] Build 13: Innovation Pulse Page Architecture

### New Features

#### Audio Day Pills
- Added clickable date pills directly under main audio player (Mon-Thu previous days + today)
- Each pill shows: abbreviated day, date, green dot, and duration
- Clicking a pill loads that day's audio into the main player
- Currently playing day shows highlighted state (cyan border/bg)
- "Full archive →" link added to pills row

#### Story Detail Pages (`/innovation-pulse/story/[slug]`)
- Full story page with hero image, article body, pull quotes
- "OUR TAKE" editorial section (replaced "Dr. Norma's Take" per branding rules)
- Share bar with copy link, X, LinkedIn, email buttons
- Related stories section showing 3 stories from same category
- Navigation between Innovation Pulse and full episode pages
- Audio clip player for lead stories

#### Category Archive Pages (`/innovation-pulse/category/[category-slug]`)
- Archive page for each V4 category showing all stories
- Category descriptions and story counts
- Grid layout with story cards linking to detail pages
- Cross-links to other categories at bottom
- 7 category slugs: insights-and-trends, case-study, practical-tips, ethical-ai, latest-ai-products, beyond-ed, week-in-review

#### Audio Archive Page (`/innovation-pulse/archive`)
- Complete episode archive grouped by week
- Each episode shows date, editorial lens, lead story title, story count, duration
- Expand/collapse for full episode content
- Working play buttons with progress bar
- Links to lead story pages and full briefing pages

#### Homepage Improvements
- Real working audio player connected to actual mp3 files
- Lead story in sidebar now links to story detail page
- "Browse Archive" link now goes to archive page
- Top Stories cards link to story pages for lead stories
- Updated categories to V4 system throughout

### Branding Fixes
- Replaced all "Dr. Norma Jones" references with "The Innovation Pulse" or "Innovating Higher Ed"
- Changed "Dr. Norma's Take" to "OUR TAKE" everywhere
- Editorial signature: "The Innovation Pulse · Innovating Higher Ed"
- A.I. voice disclaimer updated to remove personal name attribution
- Sidebar "Dr. Norma Author Card" → "The Innovation Pulse About Card"

### Technical Changes
- Added `generateSlug()`, `getStoryBySlug()`, `getRelatedStories()`, `getStoriesByV4Category()` to data layer
- Added V4 category slugs, colors, and descriptions to `innovation-pulse.ts`
- Created `HomeAudioPlayer.tsx` component for homepage
- Created `StoryPageClient.tsx` for story page audio
- Created `ArchiveClient.tsx` for archive page audio with expand/collapse
- Added "View all →" links to each category section on Innovation Pulse page

### Files Created
- `app/innovation-pulse/story/[slug]/page.tsx`
- `app/innovation-pulse/story/[slug]/StoryPageClient.tsx`
- `app/innovation-pulse/category/[category]/page.tsx`
- `app/innovation-pulse/archive/page.tsx`
- `app/innovation-pulse/archive/ArchiveClient.tsx`
- `components/HomeAudioPlayer.tsx`

---

## [2026-02-22] Session: Production Deployment + Critical Bug Fixes

### Deployed
- Innovation Pulse week Feb 16-20 with all 20 stories live on ihe-pulse.vercel.app
- Earlier This Week section added (Mon-Thu expandable, Fri as today)
- Story data: 5 big stories + 15 short stories across 5 days
- Correct editorial lens assignments: Mon=Hard Question, Tue=Student Experience, Wed=Practitioner's Playbook, Thu=Connecting the Dots, Fri=Innovator's Edge
- Vermont AI Guidance story added to Monday (was missing from V3)
- Audio files generated: 5 MP3s (~24MB total) via ElevenLabs

### Critical Bugs Fixed
- **Audio player now functional**: Added real `<audio>` element with React refs, event handlers for play/pause, time updates, progress tracking, and seeking. Previously was cosmetic-only with no actual audio playback.
- **V4 categories implemented**: Replaced old taxonomy (Teaching & Learning, Policy & Ethics, etc.) with correct V4 categories: Insights & Trends, Case Study, Practical Tips, Ethical AI, Latest AI Products, Beyond Ed. Created automatic mapping from old → new categories.
- **Dead links removed**: Removed non-functional "MORE →" links from story cards.
- **Day-to-lens mapping fixed**: Corrected `dayToLens` mapping in `innovation-pulse-types.ts` (Monday=Hard Question, not Practitioner's Playbook).

### Technical Changes
- `InnovationPulseClient.tsx`: Major rewrite (~800 lines) with real audio player, V4 category system, TypeScript improvements
- `innovation-pulse-types.ts`: Fixed `dayToLens` record
- `2026-02-16.json`: Added missing Vermont story to quickHits

### Audio Files Verified
- innovation-pulse-2026-02-16.mp3 (5.4MB)
- innovation-pulse-2026-02-17.mp3 (4.0MB)
- innovation-pulse-2026-02-18.mp3 (4.7MB)
- innovation-pulse-2026-02-19.mp3 (4.4MB)
- innovation-pulse-2026-02-20.mp3 (4.6MB)
- All verified: MPEG Layer III, 128 kbps, 44.1 kHz

---

## [2026-02-22] — Innovation Pulse V4: Audio Production, Teases, Archive Design

### Content
- Expanded big story audio timing to 2-3+ minutes (total 5-7+ min per day)
- Built complete 5-day week (Mon-Fri, Feb 16-20) with expanded big stories
- Rebalanced structure: short stories stay punchy, big story gets room to deliver value
- Created 20 finalized stories with full written cards + audio scripts

### Audio Production Rules (NEW)
- Always write "A.I." with periods in audio scripts (prevents ElevenLabs dropping the "I")
- Max pause/silence: 1 second between segments
- ElevenLabs Studio: use "Insert break" button (do NOT type tags into text)
- ElevenLabs API (non-V3): use `<break time="1.0s" />` SSML self-closing tags
- ElevenLabs API (V3): use `[pause]`, `[short pause]`, `[long pause]` text tags
- ElevenLabs TTS Web UI: use dashes `-` (short) or `-- --` (longer) on own lines

### Tease Craft (NEW)
- Researched radio/TV/podcast tease best practices (Andy Meadows, TV news writing, curiosity gap theory)
- Rules: tease to the HOOK, never the answer; be specific enough to start wheels turning, vague enough to keep guessing
- Never start with "Later" or "Coming up" — dead words
- Never use "circle back" more than once per week
- Vary tease structure across days (surprising number, contradiction, question, unexpected quote, situation that doesn't add up)
- Two sentences: Context + Promise. Write the promise first.
- Don't say "we'll tell you" or "you'll be shocked" — state the intriguing fact directly

### Transitions (NEW)
- Added clean tease-to-first-story transitions, varied daily:
  - Monday: "But first, here's what else is moving today."
  - Tuesday: "First though, a few things worth knowing."
  - Wednesday: "Before we get there, a few stories that set the stage."
  - Thursday: "Some context first."
  - Friday: "A few final stories before we pull the week together."

### Category Announcements (NEW)
- Never say "Short Story 1, 2, 3" — listeners hear natural category transitions only
- Examples: "An Insights and Trends piece worth knowing...", "Over in Beyond Ed...", "And a Latest A.I. Products note..."
- Vary phrasing across days — no formulaic pattern

### Archive Design (PLANNED)
- Main Innovation Pulse page: Today's stories + "Earlier This Week" collapsed section
- Each day rolls: Monday prominent → Tuesday moves Monday to "Earlier This Week" → etc.
- Following Monday: entire week moves to Archive page
- Archive page (/innovation-pulse/archive): browse by week or by category
- Category filter becomes powerful resource over time

### Friday Structure (DECIDED)
- Friday is a regular news day (3 short stories + big story) like Mon-Thu
- Friday recap is deferred — can add later as separate audio file if needed
- Email subscription: deferred for now

### Files Created
- stories-week-2026-02-16.json (20 stories, complete data)
- audio-scripts-week-2026-02-16.txt (5 days, clean scripts)
- monday-PRODUCTION-READY.txt (Studio + API + V3 versions)
- monday-TTS-PASTE-READY.txt (web UI paste version with A.I. fix)
- CLAUDE-CODE-PROMPT.md (comprehensive deployment instructions)

---

## [2026-02-22] — Innovation Pulse V3: Tone, Structure, Diversity Corrections

### Content
- V1→V2→V3 iterations on week Feb 16-20 editorial content
- Corrected tone: conversational colleague, never dramatic or breathless
- Varied category announcements throughout the week
- Expanded written story cards to have standalone value with "read more" dropdowns
- Fixed duplicate stories (some appeared in multiple days)
- Locked 20 stories, no changes to story selection from V2

### Source Diversity
- Enforced mandatory source diversity: community colleges, HBCUs, regional universities must significantly outnumber R1 research institutions
- Week total: 4 CCs, 2 HBCUs, 3 regional/teaching, 1 land-grant, plus policy/intl/industry sources
- Only 1 R1 institution (Columbia) — and only because the story warranted it

### Audio Script Rules (Refined)
- No em dashes ever in audio scripts
- URL always phonetic: "innovating higher ed dot com"
- No host name until locked down
- Category announced by name in audio (not numbered)
- Big story teased at opening, delivered after short stories
- Varied category phrasing across days

---

## [2026-02-22] — Innovation Pulse Editorial Framework Finalization

### Category System
- Locked 7 editorial categories for Innovation Pulse:
  - Insights & Trends, Case Study, Practical Tips, Ethical A.I., Latest A.I. Products, Beyond Ed, Week in Review (Friday only)
- Each category has defined search criteria and editorial purpose
- Categories are editorial (voice-driven), not academic (taxonomy-driven)

### Editorial Lenses (Daily)
- Monday: The Hard Question (challenges assumptions)
- Tuesday: The Student Experience (student-centered stories)
- Wednesday: Practitioner's Playbook (practical/tactical)
- Thursday: Connecting the Dots (patterns across the week)
- Friday: Innovator's Edge (forward-looking + week synthesis)

### Lead Story Selection
- Murray Davis "That's Interesting" framework applied
- Lead = story that most challenges audience's assumptions
- Must pass: "Would a faculty member mention this to a colleague?"
- Never lead with a product announcement — lead with implications

### Story Memory (PERMANENT RULE)
- Never retell a story — only callback when it advances
- Track all covered stories permanently
- Callbacks create insider knowledge for regular listeners
- Two-pass QC: first pass for accuracy/grammar, second for voice/humanization

---

## [2026-02-21] — Build 12: Site-Wide Fixes + Innovation Pulse Redesign

### CSS Fix
- Fixed critical Tailwind utility override causing padding issues across entire site
- Root cause: custom CSS overriding Tailwind utility classes

### Innovation Pulse Page
- Redesigned to match HTML prototype with 35-point comparison
- Implemented 10 missing features:
  - Featured/lead story section with hero layout
  - Category grouping with colored headers
  - Story cards with images, badges, expandable content
  - Interactive audio player
  - Briefing archive section
  - "Never Miss a Pulse" email signup
  - A.I. voice disclosure footer
  - Category filter pills
  - Source links with external icon
  - "LEAD", "CALLBACK", "POLICY", "PRODUCT", "STUDENT", "LEADERSHIP" badges

### Other Pages
- Fixed typography inconsistencies across all pages
- Removed fake/placeholder content
- Enforced design system: Instrument Serif + DM Sans + JetBrains Mono
- Electric Dusk theme consistency (cyan/magenta on dark)

---

## [2026-02-21] — Podcast Page Debugging

### Fixes
- Resolved podcast page layout issues
- Fixed thumbnail display
- Navigation corrections

---

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

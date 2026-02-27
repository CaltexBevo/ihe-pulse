# BUILD 13: Innovation Pulse Page Architecture

**Don't stop. You have all permissions granted. Complete all 5 tasks without pausing for confirmation.**

## CRITICAL RULES
- Read CLAUDE.md, ROADMAP.md, and tasks/lessons.md FIRST before doing anything
- NEVER use "Dr. Norma Jones" or "Dr. Norma's Take" — use "Our Take", "Innovating Higher Ed's Perspective", "Innovating Higher Ed's Take", or "we/our" language instead
- NEVER use "Deep Dive" anywhere — use "Lead Story" or "Featured Story"
- All categories are V4: Insights & Trends, Case Study, Practical Tips, Ethical AI, Latest AI Products, Beyond Ed, Week in Review (Fri only)
- Electric Dusk theme: dark bg, cyan (#00d4ff), magenta (#c850c0)
- Fonts: Instrument Serif + DM Sans + JetBrains Mono
- Verify every change in browser before marking done

## PROJECT PATH
`/Volumes/Bevo_2TB/ihe-pulse/`

## WHAT TO BUILD

There are 5 tasks. Do them in order. Build, verify each one works, commit after each.

---

### TASK 1: Fix Audio Day Pills on Innovation Pulse Page

**Current problem:** Only Friday Feb 20 audio plays. Mon-Thu audio files EXIST on the server but the "Earlier This Week" section is buried at the bottom of the page and play buttons don't connect to the right mp3 files.

**What to build:** Directly below today's main audio player (the waveform player at top), add a row of clickable date pills for the previous 4 days. Like this:

```
[Today's full audio player with waveform — Friday Feb 20]

  Mon 2/16    Tue 2/17    Wed 2/18    Thu 2/19
  ● 5:24      ● 4:08      ● 4:42      ● 4:22
```

Each pill shows: abbreviated day name, date, a green dot, and the duration. Clicking a pill loads that day's audio into a compact player (doesn't need the full waveform — just play/pause, progress bar, time). The pill for the currently playing day gets a highlighted state (cyan border/bg).

**Audio file pattern:** `/audio/innovation-pulse/innovation-pulse-YYYY-MM-DD.mp3`

**All 5 files that exist:**
- innovation-pulse-2026-02-16.mp3 (5.4MB)
- innovation-pulse-2026-02-17.mp3 (4.1MB)
- innovation-pulse-2026-02-18.mp3 (4.7MB)
- innovation-pulse-2026-02-19.mp3 (4.4MB)
- innovation-pulse-2026-02-20.mp3 (4.6MB)

**Rules:**
- Pills sit ABOVE the story content, directly under today's player
- Previous days should NOT also appear at the bottom of the page (remove the "Earlier This Week" duplicate or keep it only as expandable story content without redundant audio players)
- When a day falls off the 5-day window, it should be accessible from the Audio Archive page (Task 5)
- Style the pills to match the Electric Dusk design system — dark glass cards, JetBrains Mono for dates, cyan accents

**Done when:**
- [ ] All 5 day pills visible under today's player
- [ ] Clicking each pill plays the correct audio file
- [ ] Currently playing day has highlighted pill state
- [ ] No duplicate audio players at bottom of page
- [ ] `npm run build` passes with zero errors

---

### TASK 2: Lead Story Links to Dedicated Story Page

**Current problem:** The lead story card on the Innovation Pulse page has a link that goes back to the same page (self-referencing). It should link to a full story page.

**What to build:** A story detail page at `/innovation-pulse/story/[slug]`

**Use this HTML mockup as the design reference:** The file `story-page-mockup.html` is in the project (or you can find the design spec below). The mockup was built in Build 11 and shows the full layout.

**Story page layout:**
1. **Back bar** — "← Back to Innovation Pulse" link + date
2. **Hero image** — full-width, with gradient overlay, LEAD STORY + category badges
3. **Article meta** — category badge, editorial lens badge, date, read time
4. **Article title** — large Instrument Serif
5. **Article subtitle** — the hook/summary
6. **Story audio clip** — mini player if this story was featured in the audio
7. **Article body** — full editorial text with:
   - Pull quotes (styled blockquotes)
   - Data callout boxes (stat numbers in a 3-column grid)
   - Bold key sentences
8. **Source block** — "Original reporting" attribution + "Read original article" external link
9. **Our Take section** (NOT "Dr. Norma's Take") — editorial card with:
   - Label: "OUR TAKE" (in magenta)
   - Sub-label: "— [Today's Editorial Lens]"
   - 2-3 paragraphs of editorial perspective
   - Signature: "The Innovation Pulse · Innovating Higher Ed"
10. **Share bar** — copy link, X, LinkedIn, email buttons
11. **Related stories** — 3 cards from same category or same date
12. **Previous/Next story navigation** — links to adjacent stories

**CRITICAL BRANDING:**
- Where the mockup says "Dr. Norma's Take" → change to "OUR TAKE"
- Where the mockup says "Dr. Norma Jones · Host & Editorial Director" → change to "The Innovation Pulse · Innovating Higher Ed"
- NEVER use "IHE" as an abbreviation anywhere — it conflicts with Inside Higher Ed. Always write out "Innovating Higher Ed" in full.
- Everywhere else use "we" and "our" language, never attribute to a specific person

**Data source:** Each day's JSON file should have a `stories` array. The lead story is the one with `storyType: "lead"` or the first story in the array. The lead story's JSON should include:
- `slug` — URL-friendly title
- `title` — headline
- `subtitle` — hook/summary  
- `fullText` — the complete editorial article (multiple paragraphs)
- `editorialTake` — the "Our Take" perspective (2-3 paragraphs)
- `category` — V4 category
- `source` — original source name
- `sourceUrl` — link to original article
- `imageUrl` — hero image
- `stats` — optional array of {number, label} for data callout boxes

If the current JSON structure doesn't have `fullText` or `editorialTake`, add those fields. For the existing Feb 16-20 stories, use the existing `summary` as the article body and the existing editorial quote content as the "Our Take." We can enrich the content later — the page structure and routing need to work now.

**Done when:**
- [ ] `/innovation-pulse/story/[slug]` route exists and renders
- [ ] Lead story card on Innovation Pulse page links to the story page
- [ ] Story page shows hero image, full article, "Our Take" section
- [ ] Back link returns to Innovation Pulse page
- [ ] Related stories section shows 3 related cards
- [ ] No mention of "Dr. Norma" anywhere on the page
- [ ] `npm run build` passes with zero errors

---

### TASK 3: Category Archive Pages

**Current problem:** Category sections on the Innovation Pulse page (Insights & Trends, Case Study, etc.) have no "View All" links. Someone can't browse all Case Studies from across multiple weeks.

**What to build:** Category archive pages at `/innovation-pulse/category/[category-slug]`

**Layout:**
1. **Header** — Category name as title, category color accent, description of what this category covers
2. **Filter/sort** — Sort by date (newest first default), optional date range
3. **Story grid** — All stories ever published in this category, displayed as cards with:
   - Image
   - Title
   - Summary (truncated)
   - Source
   - Date
   - "Read more" link → story page if lead story, or expand inline for regular stories
4. **Pagination** — if more than 12 stories, paginate

**Category slugs and colors:**
- `insights-and-trends` — cyan (#00d4ff)
- `case-study` — emerald (#10b981)
- `practical-tips` — amber (#f59e0b)
- `ethical-ai` — rose (#f43f5e)
- `latest-ai-products` — purple (#a855f7)
- `beyond-ed` — blue (#3b82f6)
- `week-in-review` — gradient (cyan→magenta)

**Wire it up:**
- Add "View all [Category] →" links at the bottom of each category section on the Innovation Pulse page
- Each story card's category badge should also link to the category page

**Done when:**
- [ ] `/innovation-pulse/category/insights-and-trends` (and all 7 categories) renders
- [ ] Shows all stories from that category across all available dates
- [ ] "View all" links added to each category section on Innovation Pulse page
- [ ] Cards link to story pages for lead stories
- [ ] Category badge colors match the defined color scheme
- [ ] `npm run build` passes with zero errors

---

### TASK 4: Fix Homepage — Lead Story + Working Audio

**Current problem:** The homepage has an Innovation Pulse section but the audio doesn't play and the lead story link goes nowhere useful.

**What to build:**
1. **Today's audio player on homepage MUST WORK** — connect it to the actual mp3 file for today's date. Use the same audio element pattern from the Innovation Pulse page. Test that pressing play produces sound.
2. **Lead story card on homepage** — should show today's lead story with:
   - Lead Story badge
   - Category badge  
   - Title
   - First 2 sentences of summary
   - "Read full story →" link that goes to `/innovation-pulse/story/[slug]`
3. **"Listen to Today's Pulse" and "Browse All Episodes →"** links should work

**CRITICAL:** Replace any reference to "Dr. Norma Jones" on the homepage with "The Innovation Pulse" or "Innovating Higher Ed" — no personal name attribution. NEVER abbreviate to "IHE" — write "Innovating Higher Ed" in full.

**Done when:**
- [ ] Homepage audio player plays actual audio (test with your ears or confirm `<audio>` element has valid src and canplay event fires)
- [ ] Lead story card links to `/innovation-pulse/story/[slug]`
- [ ] No mention of "Dr. Norma" in any text on the homepage
- [ ] "Browse All Episodes" links to /innovation-pulse
- [ ] `npm run build` passes with zero errors

---

### TASK 5: Audio Archive Page

**Current problem:** When audio episodes fall off the 5-day window on the Innovation Pulse page, there's nowhere to find them.

**What to build:** A clean archive page at `/innovation-pulse/archive`

**Layout:**
1. **Header** — "The Innovation Pulse Archive" + subtitle "Every episode, every story."
2. **Episode list** — Reverse chronological, each entry shows:
   - Date (formatted nicely: "Friday, February 20, 2026")
   - Editorial lens badge for that day
   - Lead story headline as the episode title
   - Story count ("5 stories")
   - Duration  
   - Play button → plays that day's audio
   - Expand/collapse → shows all story titles for that day
3. **Week grouping** — Group episodes by week with a subtle divider

**Wire it up:**
- Add "Browse full archive →" link below the day pills on Innovation Pulse page
- The Briefing Archive section at bottom of Innovation Pulse page should link here

**Done when:**
- [ ] `/innovation-pulse/archive` renders with all available episodes
- [ ] Each episode has a working play button
- [ ] Episodes grouped by week
- [ ] Link from Innovation Pulse page works
- [ ] `npm run build` passes with zero errors

---

## AFTER ALL 5 TASKS

1. Run `npm run build` — zero errors
2. Update ROADMAP.md marking all tasks complete with today's date
3. Update CHANGELOG.md with summary of Build 13
4. Append any lessons to tasks/lessons.md
5. `git add -A && git commit -m "feat: Build 13 — story pages, category archives, audio pills, homepage fix, audio archive" && git push origin main`
6. Wait for Vercel deploy
7. Open https://ihe-pulse.vercel.app in browser and verify:
   - Innovation Pulse page: 5 day pills with working audio
   - Click lead story → goes to story page with "Our Take" (no Dr. Norma)
   - Click category "View All" → goes to category archive
   - Homepage audio plays
   - Archive page shows all episodes
   - ZERO broken links

## DESIGN REFERENCE

The story page should match the style from `story-page-mockup.html` which was designed in Build 11. Key CSS patterns:

- Background: #08080f (--bg)
- Cards: #111120 (--bg-card) with border rgba(255,255,255,0.06)
- Text: #f0ede8 primary, #a8a4b8 secondary, #6b6880 muted
- Cyan: #00d4ff, Magenta: #c850c0
- Article max-width: 820px, wide content: 1200px
- Typography: DM Sans for body, JetBrains Mono for labels/meta, Instrument Serif for titles/quotes
- Border radius: 14px for cards, 8px for smaller elements
- Animations: fadeUp on scroll reveal, pulseDot for live indicators
- Editorial card: gradient top border (magenta→cyan), 20px border-radius
- Pull quotes: left border 3px magenta, padding-left 1.5rem, italic
- Data callouts: 3-column grid in surface-2 background with stat numbers in cyan

## IMPORTANT REMINDERS
- "Our Take" NOT "Dr. Norma's Take" — everywhere
- "The Innovation Pulse · Innovating Higher Ed" NOT "Dr. Norma Jones · Host"  
- V4 categories only — never old taxonomy
- Category badge COLORS should be distinct per category (not all cyan)
- Lead story = Murray Davis "That's Interesting" framework (challenges assumptions, reveals patterns)
- Audio format: 5-7 min total. Tease big story → short stories by category → big story payoff
- Write "A.I." with periods in any audio-related text
- No "Deep Dive" anywhere — use "Lead Story" or "Featured Story"

# IHE Visual QA Fix — Agent Team Prompt

## CONTEXT
The site at ihe-pulse.vercel.app has been deployed but does NOT match the approved prototypes. This prompt fixes every page to exactly match the Electric Dusk design system prototypes.

**You have FULL PERMISSION. Use --dangerously-skip-permissions. Do not pause for confirmation.**

**Project:** `/Volumes/Bevo_2TB/ihe-pulse/`

## CRITICAL DESIGN RULES (NON-NEGOTIABLE)

### Typography
- **DM Sans bold (700):** ALL card headlines, ALL section headings, ALL UI headings. No exceptions.
- **DM Sans regular (400):** Body text, descriptions, summaries
- **JetBrains Mono:** Badges, labels, metadata, category tags, timestamps, dates, source attributions
- **Instrument Serif:** ONLY for the "The Innovation Pulse" masthead on the Innovation Pulse hero. NOWHERE ELSE.
- If you see Instrument Serif on any card title, section heading, or page title — it's WRONG. Fix it to DM Sans bold.

### Card Design (EVERY content card must follow this)
```css
.card {
  background: #111120;
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}
.card:hover {
  border-color: rgba(255,255,255,0.12);
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.3);
}
```
Every card has:
- Image at top (170px height, object-fit:cover) — NEVER text-only cards
- Badge overlay on image (category, type, etc.) in JetBrains Mono
- Card body padding: 0.9rem 1rem
- Category dot (colored circle 6px) + JetBrains Mono uppercase category label
- DM Sans bold title (1rem, weight 700, line-height 1.22)
- DM Sans regular teaser (0.78rem, color #a8a4b8, 2-line clamp)
- Footer with border-top separator: source (cyan colored) + date (muted) in JetBrains Mono 0.58rem

### Colors
```css
:root {
  --bg: #08080f;
  --bg-elevated: #0e0e1a;
  --bg-card: #111120;
  --border: rgba(255,255,255,0.06);
  --border-hover: rgba(255,255,255,0.12);
  --text: #f0ede8;
  --text-secondary: #a8a4b8;
  --text-muted: #6b6880;
  --cyan: #00d4ff;
  --magenta: #c850c0;
  --green: #4ade80;
  --amber: #f5a623;
  --orange: #fb923c;
  --purple: #a78bfa;
  --teal: #0ea5a0;
}
```

### Section Headers Pattern
Every section on homepage uses this pattern:
```
[emoji icon] SECTION NAME (JetBrains Mono, uppercase, colored)  description text  "View all →" link
```
Example: `📰 TOP STORIES  Latest from the Innovation Pulse  View all stories →`

---

## REFERENCE PROTOTYPES
The approved prototype HTML files are in `/Volumes/Bevo_2TB/ihe-pulse/Prototypes/`. Read these files FIRST before making any changes:

- `innovation-pulse-definitive.html` — THE definitive reference for Innovation Pulse page
- `homepage-redesign.html` — Homepage design (if present, may need to check recent outputs)
- `podcast-page.html` — Podcast page
- `prompts-page.html` — Prompt Navigator page  
- `tinkerlab-page.html` — Tinker Lab page
- `story-page-mockup.html` — Individual story page template
- `ai-app-directory-v2.html` — AI App Directory

**IMPORTANT:** Read each prototype file carefully. Extract the exact CSS styles, HTML structure, and component patterns. The Next.js components must visually match these prototypes pixel-for-pixel.

---

## CREATE AN AGENT TEAM WITH 3 TEAMMATES

### Teammate 1: GLOBAL STYLES + SHARED COMPONENTS
**Focus:** Fix the foundation that affects all pages

**Tasks:**

1. **Read the prototype files** to understand the exact design system
2. **Fix `app/globals.css`:**
   - Ensure ALL CSS variables match the Electric Dusk palette above
   - Import correct Google Fonts: DM Sans (300-700), JetBrains Mono (400-600), Instrument Serif
   - Add global card styles matching the prototype
   - Add section header styles
   - Add badge/pill styles (JetBrains Mono, various color backgrounds)
   - Add the hover/transition patterns
   - Ensure `body { background: #08080f; color: #f0ede8; font-family: 'DM Sans', sans-serif; }`

3. **Fix `components/Nav.tsx` (or equivalent):**
   - Sticky top, background rgba(8,8,15,0.85) with backdrop-filter blur(24px)
   - "INNOVATING HIGHER ED" in JetBrains Mono with green pulse dot animation
   - Nav links: Home, Innovation Pulse, Prompts, AI App Directory, Podcast, Tinker Lab, About
   - Active link gets cyan background with cyan text
   - Height: 56px

4. **Fix `components/Footer.tsx`:**
   - Background: #0e0e1a
   - 3-column grid: Brand + description | Platform links | Community links
   - Bottom row: © 2026 | Privacy Policy, Terms of Use, AI Disclosure
   - All in JetBrains Mono small text

5. **Create/Fix shared card component** that ALL pages use:
   - Must include image slot (170px), badge overlay, category label, title, teaser, footer
   - Expandable variant: click to show full summary + editorial callout box (cyan left border)
   - Must use correct fonts: DM Sans bold for title, DM Sans regular for teaser, JetBrains Mono for metadata

6. **Verify fonts are loading correctly** — check the `<head>` or layout.tsx for the Google Fonts link

---

### Teammate 2: HOMEPAGE + INNOVATION PULSE + STORY PAGE
**Focus:** The three most important pages

**Tasks:**

1. **Read `homepage-redesign.html` prototype** (in Prototypes folder or recent outputs)

2. **Fix Homepage (`app/page.tsx`):**
   
   **Innovation Pulse Hero Section:**
   - Small label: "THE INNOVATION PULSE" in JetBrains Mono cyan + green pulse dot
   - Date + Editorial lens badge (e.g., "The Innovator's Edge" in amber badge)
   - Hook quote in DM Sans italic, with gradient left border (cyan-to-magenta), NOT a full-width bar
   - Audio player: "LISTEN NOW" badge (green), play button (gradient circle), waveform visualization, duration
   - Remove "Dr. Norma Jones" text from the player display
   - Right sidebar: "IN THIS ISSUE" table of contents with LEAD STORY / ALSO TODAY badges
   
   **Top Stories Section:**
   - Section header: 📰 TOP STORIES (cyan) + "Latest from the Innovation Pulse" + "View all stories →"
   - 3 cards in a row, each with: IMAGE (170px), category badge overlay, DM Sans bold title, 2-line teaser, "▾ Read more", source + date footer
   - Cards need actual images! Use placeholder images from unsplash if originals aren't available:
     - `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=340&fit=crop`
     - `https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=340&fit=crop`
     - `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=340&fit=crop`
   
   **Podcast Section:**
   - Section header: 🎙️ PODCAST (orange) + "Conversations with leaders in higher ed" + "All episodes →"
   - 3 episode cards with: IMAGE (170px, contained — not giant), "Episode XX" orange badge overlay, DM Sans bold title, 2-line description, duration + date + mini play button in footer
   - Images should be 170px height max, not full-bleed tall images
   
   **AI App Directory Section (renamed from AI Tools):**
   - Section header: 🛠️ AI APP DIRECTORY (teal) + description + "Browse all tools →"
   - 3 tool cards with images, NEW/TRENDING badges, star ratings, pricing in footer
   
   **Prompts Section:**
   - Section header: ⚡ TOP PROMPTS (purple) + description + "Browse all prompts →"
   - 3 prompt cards with gradient top border (purple-to-cyan), difficulty badge, category badge
   - Prompt preview box: JetBrains Mono text in cyan on dark blue background
   
   **Tinker Lab Section:**
   - Section header: 🧪 TINKER LAB (cyan) + description + "View experiments →"
   - 3 experiment cards with images, type badges (Experiment/Walkthrough/Comparison)
   
   **Newsletter CTA:**
   - "Never Miss a Pulse" heading
   - Email input + gradient Subscribe button
   - "Join 1,200+ educators" social proof text

3. **Fix Innovation Pulse page (`app/innovation-pulse/page.tsx`):**
   - Read `innovation-pulse-definitive.html` prototype
   - Same hero structure as homepage but full-width
   - Category filter pills below hero
   - Story cards organized by category with "MORE →" links
   - Every story card MUST have an image

4. **Fix Story page template:**
   - Read `story-page-mockup.html` prototype
   - Full-width hero image, breadcrumb, article body, Dr. Norma's Take card, share buttons, related stories

---

### Teammate 3: ALL OTHER PAGES
**Focus:** Podcast, Prompts, Tinker Lab, AI App Directory, About, Be Our Guest

**Tasks:**

1. **Fix Podcast page (`app/podcast/page.tsx`):**
   - Read `podcast-page.html` prototype
   - Featured episode: split card (image left, content right) — NOT a giant image
   - Filter pills + search box
   - Episode grid: 3 columns, cards with 170px images, episode badges, mini play buttons
   - Subscribe CTA with platform buttons
   
2. **Fix Podcast Episode page (`app/podcast/[slug]/page.tsx`):**
   - Hero with episode thumbnail (contained, not stretched)
   - Audio player
   - Show notes + guest info
   - Platform links
   - Related episodes

3. **Fix Prompt Navigator page (`app/prompts/page.tsx`):**
   - Read `prompts-page.html` prototype
   - Featured prompt split card with actual prompt text in cyan code box
   - Two filter rows: Difficulty (green/amber/red pills) + Category
   - Prompt grid with copy buttons and usage counts
   - "Submit a Prompt" CTA

4. **Fix Tinker Lab page (`app/tinker-lab/page.tsx`):**
   - Read `tinkerlab-page.html` prototype
   - Featured experiment split card with play overlay and "What you'll learn" list
   - Type filter pills (Experiments, Walkthroughs, Comparisons, Challenges)
   - Experiment cards with type badges and duration overlays

5. **Fix AI App Directory page (`app/ai-app-directory/page.tsx`):**
   - Read `ai-app-directory-v2.html` prototype
   - Apply Electric Dusk colors and fonts
   - Rename all references from "AI Tools" to "AI App Directory"
   - Tool cards with images, ratings, pricing, category badges

6. **Fix About page (`app/about/page.tsx`):**
   - Electric Dusk styling
   - Mission/vision content
   - Team bios as TEXT ONLY — NO photos of Norma or Brent Jones
   - AI disclosure statement

7. **Fix Be Our Guest page (`app/be-our-guest/page.tsx`):**
   - Electric Dusk styling
   - Guest information and application details

---

## ADDITIONAL TASKS FOR THE LEAD

After all teammates report completion:

1. **Innovation Pulse Backfill Script:**
   Create a batch script at `/Volumes/Bevo_2TB/ihe-tools-server/backfill-week.sh` that:
   - Runs the daily pipeline for each missing weekday (Feb 10-21)
   - Uses the existing API keys in the .env file
   - Processes one day at a time with a 30-second delay between runs
   - Outputs JSON files to the ihe-pulse data directory
   
   The ihe-tools-server is at `/Volumes/Bevo_2TB/ihe-tools-server/`
   Check the existing .env file for API keys (Serper, OpenAI, ElevenLabs)
   Check the existing pipeline entry point (server.js, run-daily.js, or similar)

2. **Run `npm run build`** to verify no errors
3. **Git commit and push** to trigger Vercel deploy
4. **Report final status** with screenshots of each page

## COORDINATION
- Teammate 1 (Global Styles) starts FIRST — the other two need correct base styles
- Teammates 2 and 3 start on their pages once Teammate 1 reports base styles are committed
- All teammates read prototype files BEFORE writing any code
- NO teammate should skip reading the prototypes — they are the source of truth

## BANNED
- No Instrument Serif on card titles or section headings — EVER
- No text-only cards — every card needs an image
- No "Deep Dive" text anywhere
- No abbreviation "IHE" 
- No photos of Norma or Brent Jones
- No giant/stretched images — all contained at 170px height in cards

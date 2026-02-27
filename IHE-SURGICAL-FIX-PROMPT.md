# IHE SURGICAL FIX — Self-Checking Agent Team

## CRITICAL CONTEXT
The site at ihe-pulse.vercel.app is live but has serious visual problems. This prompt fixes them ALL. You must verify your own work after each fix by running `npm run build` and visually inspecting the output.

**Project:** `/Volumes/Bevo_2TB/ihe-pulse/`
**Full permissions granted. Use --dangerously-skip-permissions. Do not pause.**

## THE PROBLEMS (from screenshots — these are REAL, not hypothetical)

### PROBLEM 1: NO PAGE MARGINS OR PADDING
Every page has content flush against the browser edges. There is ZERO horizontal padding on the main content area.

**FIX:** Add a global content container. Every page must wrap content in a container with:
```css
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}
```
Apply this to EVERY page's main content wrapper. The nav and footer can be full-width, but their inner content also needs the same max-width constraint.

### PROBLEM 2: HERO QUOTE IS ABSURDLY LARGE
The Innovation Pulse hook quote takes up the ENTIRE viewport. It's rendering at what looks like 3-4rem font size with no containment. On mobile (see the phone screenshot) it's even worse — just giant text filling the screen.

**FIX:** The hero section should be a contained card/box, NOT raw giant text. Structure:
```
┌─────────────────────────────────────────────────────────────┐
│ ● THE INNOVATION PULSE  Friday, February 6, 2026           │
│                                         ● The Innovator's Edge │
│ ┌──────────────────────────────────────┐  ┌─IN THIS ISSUE──┐│
│ │ [gradient left border]               │  │ LEAD STORY     ││
│ │ "A massive new OECD report just     │  │ The OECD's AI  ││
│ │ dropped a bombshell..." (max 1.3rem)│  │ Education...   ││
│ │                                      │  │                ││
│ └──────────────────────────────────────┘  │ ALSO TODAY     ││
│                                           │ Arkansas...    ││
│ ● LISTEN NOW  4:35                        │ EDUCAUSE...    ││
│ [▶] |||||||||||||||||||||| 0:00 / 4:35   │ Survey...      ││
│                                           └────────────────┘│
│ [Read Today's Briefing]  Browse Archive →                   │
└─────────────────────────────────────────────────────────────┘
```

The hook quote should be:
- Font: DM Sans italic (NOT Instrument Serif)
- Size: max 1.3rem on desktop, 1.1rem on mobile
- Color: var(--text) with slight opacity (0.9)
- Left border: 3px solid with gradient (cyan to magenta)
- Padding-left: 1.25rem
- Background: var(--bg-card) with padding all around
- The whole hero is a card with background, border-radius 16px, border, padding 2rem

The "IN THIS ISSUE" sidebar should be:
- Width: ~320px, positioned to the right
- Background: var(--bg-card), border, border-radius 12px, padding 1.25rem
- Sticky position so it stays visible while scrolling

### PROBLEM 3: NAV BAR IS RAW TEXT
The navigation has no visual container — just text floating on the dark background with no padding, no backdrop blur, no height.

**FIX:**
```css
nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(8, 8, 15, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  height: 56px;
  display: flex;
  align-items: center;
}
nav .inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```
Nav links should have hover states (color transition to cyan) and the active page should have a subtle cyan background pill.

### PROBLEM 4: STORY CARD IMAGES ON HOMEPAGE
The story card images are now showing (good!) but on the homepage they appear quite dark. The Innovation Pulse page cards look better with real Unsplash photos. Make sure:
- All story cards have `object-fit: cover` on images
- Image container height: 180px
- Images should have a subtle dark gradient overlay at the bottom (for badge readability), NOT overall darkness
- If an image URL is missing or broken, show a gradient placeholder (cyan-to-magenta at low opacity)

### PROBLEM 5: AI APP DIRECTORY LAYOUT IS WRONG
Currently it's a 2-column flat list with letter circles (C for ChatGPT, G for Gemini, etc.). This does NOT match our prototype which uses IMAGE CARDS in a grid.

**FIX:** Each tool should be a proper card:
```
┌──────────────────────┐
│ [Tool Logo/Image]    │  ← 120px height, centered logo on gradient bg
│ 170px                │
├──────────────────────┤
│ ● CATEGORY (mono)    │
│ Tool Name (bold)     │
│ Short description... │
│ ──────────────────── │
│ ★ 4.7  Free tier     │
│ Faculty · Student    │
└──────────────────────┘
```
- 3-column grid (not 2-column list)
- Each card: var(--bg-card), 1px border, 14px border-radius
- Tool logo: if no image available, create a gradient background with the tool's first letter (like they have now BUT inside a proper card with image area)
- Title: DM Sans bold
- Category/pricing: JetBrains Mono
- The title should say "AI App Directory" not "AI Tool"
- Change "Find the Right AI Tool" to "Find the Right AI App"

### PROBLEM 6: ABOUT PAGE LAYOUT IS BROKEN
The mission quote card overlaps the team bios. The layout has no structure.

**FIX:** Structure should be:
1. Page header: "About" label + "Innovating Higher Ed" title
2. Mission card: full-width card with the mission quote, centered, with gradient left border. Background: var(--bg-card)
3. "Our Story" section: the "From Podcast to Platform" narrative in a card
4. "Meet the Team" section: 2-column grid of team bio cards (text only, NO photos)
5. "What We Offer" section: 3-column feature cards (Innovation Pulse, Podcast, Prompt Navigator, etc.)

Each section should have proper spacing (margin-bottom: 3rem between sections).

### PROBLEM 7: PAGE TITLES ARE TOO LARGE
Every page (Podcast, Prompts, Tinker Lab, About) has its main title in what looks like 3rem+ bold text that dominates the viewport.

**FIX:** Page titles should be:
- Font: DM Sans bold (NOT Instrument Serif)
- Size: 2rem max on desktop, 1.5rem on mobile
- Color: var(--text)
- With the section label above it in JetBrains Mono (e.g., "● PODCAST" in orange)

### PROBLEM 8: MISSING CARD BORDERS AND BACKGROUNDS
Some cards (especially on the homepage) appear to be missing their dark card background and border, making them blend into the page background.

**FIX:** Ensure EVERY card has:
```css
background: #111120;
border: 1px solid rgba(255,255,255,0.06);
border-radius: 14px;
overflow: hidden;
```

### PROBLEM 9: MOBILE RESPONSIVENESS
The phone screenshot shows the hook quote is completely unreadable — giant text with no padding. 

**FIX:** Add responsive breakpoints:
```css
@media (max-width: 768px) {
  .page-container { padding: 0 1rem; }
  .hero-quote { font-size: 1rem !important; }
  .page-title { font-size: 1.5rem !important; }
  .card-grid { grid-template-columns: 1fr !important; }
  .hero-layout { flex-direction: column !important; }
  .toc-sidebar { display: none; } /* Hide TOC on mobile */
  nav .nav-links { display: none; } /* Hamburger on mobile */
}
```

---

## AGENT TEAM STRUCTURE — 2 TEAMMATES + SELF-CHECK LOOP

### Teammate 1: GLOBAL FIXES (Problems 1, 2, 3, 7, 8, 9)
**These affect every page — fix them first.**

1. Add the `.page-container` max-width wrapper to globals.css
2. Fix the Nav component (backdrop blur, height, inner container, active states)
3. Fix the hero quote section (contained card, smaller font, gradient left border, proper layout with TOC sidebar)
4. Fix all page title sizes (2rem max, DM Sans bold)
5. Ensure all cards have proper background/border
6. Add mobile responsive breakpoints
7. Apply page-container to EVERY page component (page.tsx files)

After completing all fixes, run:
```bash
npm run build
```
If build succeeds, report to lead. If errors, fix them.

### Teammate 2: PAGE-SPECIFIC FIXES (Problems 4, 5, 6)
**Wait for Teammate 1 to commit global fixes first, then start.**

1. Fix homepage story card images (proper height, gradient overlay, placeholder for missing images)
2. Completely rebuild AI App Directory from 2-column list to 3-column image card grid
3. Fix About page layout (mission card → our story → team bios → what we offer, all properly spaced)
4. Fix any remaining page-specific issues

After completing all fixes, run:
```bash
npm run build
```
If build succeeds, report to lead.

---

## SELF-CHECK LOOP (CRITICAL — THE LEAD MUST DO THIS)

After both teammates report completion:

### Round 1: Build Check
```bash
cd /Volumes/Bevo_2TB/ihe-pulse
npm run build
```
If build fails, fix ALL errors before proceeding.

### Round 2: Visual Inspection
Start the dev server:
```bash
npm run dev
```
Then use curl or a browser tool to check each page. For each page, verify:

**Checklist for EVERY page:**
- [ ] Content has horizontal padding (not flush to edges)
- [ ] Nav has backdrop blur and proper height
- [ ] Page title is reasonable size (not viewport-dominating)
- [ ] Cards have dark background (#111120) and borders
- [ ] Fonts are correct (DM Sans for headings, JetBrains Mono for labels)
- [ ] No content overlapping other content

**Homepage specific:**
- [ ] Hero quote is in a contained card, not giant raw text
- [ ] Hero quote font is ~1.3rem, not 3rem+
- [ ] IN THIS ISSUE sidebar is properly positioned
- [ ] Story cards have visible images with badges
- [ ] All 6 sections present (Stories, Podcast, AI App Directory, Prompts, Tinker Lab, Newsletter)

**Innovation Pulse specific:**
- [ ] Hero quote is contained (same fix as homepage)
- [ ] Category filter pills are present
- [ ] Story cards have images

**AI App Directory specific:**
- [ ] 3-column card grid (NOT 2-column flat list)
- [ ] Says "AI App" not "AI Tool" in title
- [ ] Each tool is in a proper card with border

**About specific:**
- [ ] Mission quote is in its own card, not overlapping
- [ ] Team bios are clean and separated
- [ ] NO photos of Norma or Brent Jones
- [ ] Sections have proper spacing

### Round 3: Fix Loop
If ANY checklist item fails:
1. Identify the specific file and CSS/JSX that needs changing
2. Make the fix
3. Run `npm run build` again
4. Re-check the specific item
5. Repeat until ALL items pass

### Round 4: Deploy
Once all checks pass:
```bash
git add -A
git commit -m "fix: comprehensive visual QA — padding, hero sizing, card styles, responsive, AI App Directory rebuild, About layout"
git push origin main
```

Report final status to the user including:
- Build status (pass/fail)
- Number of files modified
- Which checklist items were fixed
- The Vercel deploy URL

---

## ABSOLUTE RULES
- max-width: 1200px on all content — NO edge-to-edge text
- Hero quote: 1.3rem MAX — not 3rem
- Every card: #111120 background + border + 14px radius
- DM Sans for ALL headings — Instrument Serif ONLY on "The Innovation Pulse" label
- JetBrains Mono for ALL metadata, badges, labels, dates
- Mobile must work — test at 375px width mentally
- Run `npm run build` after EVERY round of changes — don't accumulate errors
- The self-check loop is NOT optional — the lead MUST run through the checklist

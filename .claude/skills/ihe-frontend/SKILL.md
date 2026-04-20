---
name: ihe-frontend
description: "Enforces all design, content, structural, and ADA compliance rules for the Innovating Higher Ed website (ihe-pulse). MUST be consulted before modifying ANY page, component, layout, theme, nav, footer, or content file. Also consult when adding new pages, changing the design system, or modifying accessibility features. This is the constitutional document for the IHE frontend — no sprint can override these rules without explicit founder approval."
---

# IHE Frontend Guardian — Design, Content & Structural Rules
## This skill is the single source of truth for ALL frontend rules.
## NO CMA sprint may override these rules without explicit founder approval.

---

## 1. BRAND RULES

- Site name: "Innovating Higher Ed" — NEVER abbreviate to "IHE" in any user-facing text (nav, headings, meta tags, footer, about page). Internal code references (variable names, file names, repo name) are fine.
- Product name: "The Innovation Pulse" — the daily AI briefing
- Brand positioning: "The daily AI briefing built by educators, for educators"
- Do NOT use taglines that claim subscriber counts or metrics unless they are real, verified numbers

---

## 2. THEME RULES

- **Dark mode is the unconditional default** for all first-time visitors
- Do NOT read prefers-color-scheme for the initial default
- Logic: if localStorage has stored theme → use it. Otherwise → dark. Always.
- Theme toggle exists in the header nav (sun/moon icon)
- User's choice persists in localStorage under key `ihe-theme`
- Both light and dark mode must meet WCAG AA contrast requirements
- ThemeProvider.tsx and layout.tsx flash-prevention script must both enforce this logic

### Color System (Dark Mode — Default)
- Background: `#08080f` (--bg)
- Elevated: `#0e0e1a` (--bg-elevated)
- Card: `#111120` (--bg-card)
- Surface: `#1a1a30` (--surface)
- Text: `#f0ede8` (--text)
- Text Secondary: `#a8a4b8` (--text-secondary)
- Text Muted: `#6b6880` (--text-muted)

### Accent Colors
- Cyan (primary): `#00d4ff`
- Magenta (secondary): `#c850c0`
- Green (success): `#4ade80`
- Amber (warning): `#f5a623`
- Red (error): `#ef4444`

### Priority Colors (for content tagging)
- P0: `#ef4444` (red)
- P1: `#f59e0b` (amber)
- P2: `#3b82f6` (blue)
- P3: `#6b7280` (gray)

All colors must work in both themes with WCAG AA compliance.

---

## 3. NAVIGATION — EXACT ORDER

The nav must contain these items in this exact order. Do NOT add, remove, or reorder without founder approval:

1. Home (`/`)
2. Innovation Pulse (`/innovation-pulse`)
3. Prompts (`/prompts`)
4. AI Directory (`/ai-directory`)
5. Educator Tools (`/educator-tools`)
6. Podcast (`/podcast`)
7. Tinker Lab (`/tinker-lab`)
8. About (`/about`)
9. Be Our Guest (`/be-our-guest`)
10. [Theme Toggle Icon]

**Implementation reference:** `components/Nav.tsx` — navLinks array

---

## 4. FOOTER — EXACT STRUCTURE

### Content sections (4-column grid):
1. **Brand Column**: Logo text, tagline, social links (X, LinkedIn, YouTube)
2. **Platform Column**: Innovation Pulse, Prompt Navigator, AI Directory
3. **Community Column**: Podcast, Tinker Lab, Be Our Guest, About
4. **Newsletter Column**: "Never Miss a Pulse" with email input

### Legal links (bottom row, this exact order):
1. About → /about
2. Terms of Use → /terms
3. Privacy Policy → /privacy
4. Disclaimer → /disclaimer
5. AI Disclosure → /ai-disclosure

### Footer text:
- "delivered daily" (NOT "delivered weekly")
- Copyright: © 2026 Innovating Higher Ed. All rights reserved.

**Implementation reference:** `components/Footer.tsx`

---

## 5. EDUCATOR TOOLS PAGE — TOOL ORDER

Tools appear in this exact order (5 tools total):

1. **Canvas Quiz Builder (QTI Export)**
   - URL: https://innovatinghighered.com/QTI-quiz-builder.html
   - Attribution: "A Cyber Doctor · Norma Jones Build"

2. **COR Checker**
   - URL: https://innovatinghighered.com/cor-checker.html
   - Attribution: "A Cyber Doctor · Norma Jones Build"

3. **Syllabot**
   - URL: https://www.playlab.ai/project/cmcxiu07005zbm20uf1mawflg
   - Platform: PlayLab

4. **AI Redesign**
   - URL: https://www.playlab.ai/project/cma2sos8l1wkbrgigtms5xuxh
   - Platform: PlayLab

5. **EquiGrade Mentor**
   - URL: https://www.playlab.ai/project/cmb1835ju01w3opiglm8j6par
   - Platform: PlayLab

Do NOT reorder, remove, or add tools without founder approval.

**Implementation reference:** `app/educator-tools/page.tsx` — educatorTools array

---

## 6. ABOUT PAGE — REQUIRED SECTIONS

Sections that MUST exist (in order):

1. **Hero**: "Built by Educators. Powered by AI. Made for You."
2. **Founder Bios** (Dr. Jones first, Brent second) — with monogram badges, taglines, credential badges
3. **Let's Connect CTA** — Contact Us + Be Our Guest buttons

### Sections that were REMOVED and must NOT be re-added:
- "What We Offer" cards (redundant with nav)
- Inline AI Disclosure section (has its own page at /ai-disclosure)
- "By the Numbers" stat strip (fabricated/unverifiable metrics — removed 2026-04-20)
- "Mission Quote" block (self-aggrandizing puffery — removed 2026-04-20)
- "Our Story Timeline" (fabricated narrative — removed 2026-04-20)
- "What We Stand For" value cards (generic marketing copy — removed 2026-04-20)

**Implementation reference:** `app/about/page.tsx`

---

## 7. FOUNDER BIOS — DO NOT MODIFY WITHOUT APPROVAL

### Dr. Norma Jones — Co-Founder & Editor-in-Chief
Key facts that must remain:
- 120+ presentations delivered
- CCCCO AI ChangeMaker award
- Rowman & Littlefield author
- Ph.D. from Kent State

### Brent Jones — Co-Founder & Chief Technology Officer
Key facts that must remain:
- Warner Bros. producer
- ABC's "Growing Pains" and "Just the Ten of Us" credits
- 100+ episodes produced
- SmarterYoo founder
- B.S. from UT Austin

### Bio Rules:
- Do NOT add headshots
- Do NOT change titles
- Do NOT fabricate additional credentials

---

## 8. CONTENT INTEGRITY RULES

### No fabricated metrics — EVER
- No fake subscriber counts (the "1,200+ educators" was removed — never re-add)
- No fake prompt usage counts (the "2,400+ prompts / 48k uses / 340 contributors" were removed)
- No fake star ratings on prompts
- If a metric appears on the site, it must be real and verifiable

### Newsletter language
- "delivered daily" — NEVER "delivered weekly"
- Do NOT add subscriber count claims unless verified

### Verified metrics (safe to use):
- 120+ presentations (Dr. Jones)
- 100+ TV episodes (Brent)
- 44 AI tools reviewed
- 7-step automated pipeline

---

## 9. ADA / WCAG 2.1 AA COMPLIANCE

These accessibility features MUST be maintained:

### Skip Navigation
- First focusable element: `<a href="#main-content" className="skip-nav">`
- Implementation: `app/layout.tsx`

### Semantic Landmarks
- `<header>` wrapping `<Nav />`
- `<main id="main-content">` for page content
- `<footer role="contentinfo">` for footer

### Heading Hierarchy
- ONE h1 per page (no exceptions)
- No level skips (h1 → h2 → h3, never h1 → h3)

### Interactive Elements
- All buttons have aria-labels
- All icon-only links have aria-labels
- All form inputs have labels or aria-labels
- Theme toggle: `aria-label="Switch to {light|dark} mode"`

### Focus Indicators
- Visible focus indicators in both themes
- `.skip-nav` styles in globals.css
- Button focus states defined

### Color Contrast
- Meets AA minimums: 4.5:1 for normal text, 3:1 for large text
- Both light and dark mode must pass

### Audio Accessibility
- Audio player controls have aria-labels
- Play/pause: `aria-label="Play audio"` / `aria-label="Pause audio"`
- Volume controls labeled

**DO NOT remove ANY accessibility feature during a sprint.**

---

## 10. PAGES THAT EXIST — DO NOT DELETE

### Main Pages
- `/` (homepage)
- `/innovation-pulse` (daily briefing hub)
- `/prompts` (Prompt Navigator)
- `/ai-directory` (AI tool directory)
- `/educator-tools` (5 peer-built tools)
- `/podcast` (podcast hub)
- `/tinker-lab` (experiments)
- `/about` (founder bios + mission)
- `/be-our-guest` (podcast guest application)

### Dynamic Routes
- `/innovation-pulse/[date]` (individual episodes)
- `/innovation-pulse/stories` (lead story archive)
- `/innovation-pulse/story/[slug]` (individual stories)
- `/innovation-pulse/category/[category]` (category pages)
- `/innovation-pulse/archive` (full archive)
- `/ai-directory/[slug]` (individual tool pages)
- `/podcast/[slug]` (individual episodes)
- `/tinker-lab/[slug]` (individual experiments)

### Legal Pages
- `/privacy` (Privacy Policy)
- `/terms` (Terms of Use)
- `/disclaimer` (Disclaimer)
- `/ai-disclosure` (AI Disclosure)

---

## 11. PERMANENT RULES — DO NOT MODIFY

These rules CANNOT be changed by any CMA sprint. Only the founder can modify them:

1. **Dark mode is the unconditional default**
2. **No fabricated metrics or social proof anywhere on the site**
3. **No "IHE" abbreviation in user-facing text**
4. **"delivered daily" — never "delivered weekly"**
5. **Nav order is locked** (see Section 3)
6. **Footer legal links are locked** (see Section 4)
7. **Educator Tools order is locked** (see Section 5)
8. **Founder bios are locked** (see Section 7)
9. **ADA accessibility features cannot be removed**
10. **All legal pages must remain accessible**

---

## 12. STORY IMAGE ARCHITECTURE

### Image Assignment (Centralized)
Story images are assigned ONCE at data load time in `lib/data/innovation-pulse.ts` via `assignImagesToEpisode()`. Every component reads `story.image` from the pre-assigned data.

**DO NOT** instantiate `StoryImageAssigner` in individual page components. This was the old pattern that caused the same story to show different images on different pages.

### How It Works
1. When episodes are loaded via `getAllEpisodes()` or `getEpisodeByDate()`, each episode passes through `assignImagesToEpisode()`
2. A single `StoryImageAssigner` instance assigns images to the lead story and all quick hits within that episode
3. The assigner ensures no duplicate images within the same episode
4. Images are deterministic: headline + date hash produces the same image every time

### Key Files
| Purpose | File |
|---------|------|
| Image assignment logic | `lib/utils/story-images.ts` |
| Image pool data | `data/story-images.json` |
| Centralized assignment | `lib/data/innovation-pulse.ts` → `assignImagesToEpisode()` |

### Image Pool
- **7 themed categories**: technology, campus, classroom, collaboration, research, digital, library
- **44 total images** in flat pool (no duplicates)
- Source: Unsplash (scene-based, no portraits)

### Rules
- NEVER use headshot or portrait photos — scenes, concepts, and objects ONLY
- All pages must read `story.image` or `episode.deepDive.image` — never call `imageAssigner.getImage()` directly
- Fallback images should be used only when data is missing (edge case)

---

## 13. KEY FILE LOCATIONS

| Purpose | File |
|---------|------|
| Theme logic | `components/ThemeProvider.tsx` |
| Theme toggle | `components/ThemeToggle.tsx` |
| Navigation | `components/Nav.tsx` |
| Footer | `components/Footer.tsx` |
| Newsletter signup | `components/NewsletterSignup.tsx` |
| Root layout | `app/layout.tsx` |
| Global CSS | `app/globals.css` |
| Homepage | `app/page.tsx` |
| About page | `app/about/page.tsx` |
| Educator Tools | `app/educator-tools/page.tsx` |

---

## 14. PRE-FLIGHT CHECKLIST

Before ANY CMA sprint modifies frontend files:

- [ ] Read this skill in full
- [ ] Identify which rules could be affected by the planned changes
- [ ] After making changes, verify no rules were violated:
  - [ ] Nav order hasn't changed
  - [ ] Footer links haven't changed
  - [ ] Theme default hasn't changed
  - [ ] No fabricated metrics were introduced
  - [ ] "delivered daily" appears (not "weekly")
  - [ ] All h1 headings are present (one per page)
  - [ ] No accessibility features removed
- [ ] Verify build passes: `npm run build`
- [ ] Git commit and push

---

## 15. POST-DEPLOY CHECKLIST

After pushing changes to Vercel:

- [ ] Homepage loads in dark mode for new visitors
- [ ] Theme toggle works (dark → light → dark)
- [ ] All nav links work
- [ ] All footer legal links work
- [ ] About page has all required sections
- [ ] Educator Tools shows 5 tools in correct order
- [ ] No fabricated metrics visible anywhere
- [ ] "delivered daily" appears (not "weekly")
- [ ] Skip navigation link works (Tab from fresh page load)
- [ ] All interactive elements are keyboard accessible

---

## 16. AMENDMENT LOG

| Date | Change | Approved By |
|------|--------|-------------|
| 2026-03-18 | Initial skill creation | Founder |
| 2026-03-26 | Added Section 12: Story Image Architecture | System |
| 2026-04-20 | Section 6: Removed fabricated credibility blocks from About page | Founder |

---

*This document was created to preserve design decisions, prevent regression, and ensure all future work maintains the integrity of the Innovating Higher Ed platform.*

---

## 17. PALETTE LOCK (April 17, 2026)

The site uses a locked 5-accent palette documented in `docs/DESIGN-TOKENS.md`. Any CMA session that modifies CSS or component styles MUST:

1. Read `docs/DESIGN-TOKENS.md` before changing visual code
2. Never introduce green (#4ade80), teal (#2dd4bf), coral (#fb7185), orange (#fb923c), or blue (#3b82f6)
3. Use only cyan/magenta/purple/amber as accent colors, plus the brand gradient
4. Use cyan for all section labels — no exceptions
5. Use gradient for all primary buttons — no solid-colored launch buttons
6. Verify contrast passes WCAG AA (4.5:1 body, 3:1 large) on both dark and light themes

If a palette change is needed, queue a decision in the Decision Queue before implementing. Never expand the palette silently.

### Card Accent Color Rule (added 2026-04-17 Part 6)

Card components MUST derive accent colors from the palette, NOT from data. Any per-item `color`, `brandColor`, `categoryColor` field in data payloads is to be IGNORED by the frontend.

Use:
- `paletteFor(key)` from `lib/palette.ts` for decorative rotation on tool cards (AI Directory, Educator Tools)
- `pillColorsFor(categoryName)` from `lib/categoryPalette.ts` for story category pills

Amber is reserved for taxonomy (Advanced difficulty, Ethical AI). Not for decorative rotation.

If a new category appears that isn't in CATEGORY_PALETTE, add it with cyan as default and queue a decision via Decision Queue if it needs a different color.

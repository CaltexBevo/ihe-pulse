# FIX INNOVATION PULSE PAGE — Match Prototype

## CONTEXT & PERMISSIONS
Project: `/Volumes/Bevo_2TB/ihe-pulse/`
Reference prototype: `/Volumes/Bevo_2TB/ihe-pulse/innovation-pulse-revised.html`
Live page: `app/innovation-pulse/` (page.tsx + components)
**FULL PERMISSION. Do not stop. All permissions granted.**

**Read the prototype file FIRST before making any changes.** Understand its full structure, then update the live implementation to match.

---

## FIX 1: Add Dr. Norma Author Card in Sidebar

Above the TOC ("In This Issue" card), add a Dr. Norma card matching the prototype's `.norma-card`:

```
┌─────────────────────────┐
│  [52px gradient circle]  │
│  Dr. Norma Jones         │
│  Host & Founder          │
│  Brief 1-line bio        │
└─────────────────────────┘
```

- 52px circular avatar placeholder (gradient from cyan to magenta)
- Name in DM Sans 600, white
- Title in JetBrains Mono, cyan, small
- Glass card styling (same as TOC card)

---

## FIX 2: Add Featured Story Split-Card Section

Between the hero (editorial hook + audio player) and the category filters, add a Featured Story section matching the prototype's `.featured-card`:

```
┌──────────────────────────────────────────────────┐
│                    │                               │
│   [Story Image]    │  CATEGORY BADGE               │
│   50% width        │  Story Title (large)           │
│   min-height 360px │  Story summary text...         │
│   diagonal gradient│                               │
│   overlay          │  Source · Date                 │
│                    │                               │
│                    │  ┌─────────────────────────┐  │
│                    │  │ DR. NORMA'S TAKE         │  │
│                    │  │ Editorial callout text    │  │
│                    │  │ in italic with left       │  │
│                    │  │ cyan border               │  │
│                    │  └─────────────────────────┘  │
│                    │                               │
│                    │  Read full story ↗            │
└──────────────────────────────────────────────────┘
```

- Grid: `grid-template-columns: 1fr 1fr` on desktop, stack on mobile
- Image side: `min-height: 360px`, `object-fit: cover`, diagonal gradient overlay
- Content side: padding 2rem, category badge, title in DM Sans 700 (large), summary, source+date in JetBrains Mono
- "Dr. Norma's Take" callout box: left border 3px cyan, italic text, slightly darker bg
- "Read full story ↗" link at bottom

Use the LEAD STORY from the current day's data to populate this card.

---

## FIX 3: Category Section Headers (Grouped Layout)

Replace the current flat grid layout with grouped category sections matching the prototype. Instead of one big grid filtered by category dropdown, organize stories into sections:

```
● Top Stories                                          MORE →
┌─────┐ ┌─────┐ ┌─────┐
│card │ │card │ │card │
└─────┘ └─────┘ └─────┘

● Student Experience                                   MORE →
┌─────┐ ┌─────┐
│card │ │card │
└─────┘ └─────┘

● Leadership & Strategy                                MORE →
┌─────┐ ┌─────┐ ┌─────┐
│card │ │card │ │card │
└─────┘ └─────┘ └─────┘
```

Each section header has:
- Colored dot matching the category color
- Category name in DM Sans 600, matching color
- "MORE →" link on the right in JetBrains Mono, muted

Category colors (match prototype):
- Teaching & Learning: cyan (#00d4ff)
- Policy & Ethics: amber (#f5a623)
- Student Experience: green (#2ee6a8)
- Leadership & Strategy: magenta (#c850c0)
- Tools & Products: purple (#8b5cf6)
- Research & Innovation: blue (#3b82f6)
- Infrastructure & Operations: orange (#f97316)

Keep the filter pills at the top — but instead of filtering to show/hide, they should scroll to that category section (matching the prototype's `scrollToCat()` behavior). The "All" pill shows all sections.

---

## FIX 4: Category-Specific Badge Text on Cards

Replace the generic "Lead Story" and "Story" badges with category-specific badges from the prototype:

- Stories in "Teaching & Learning" → badge text "TOP STORY" (cyan)
- Stories in "Student Experience" → badge text "STUDENT" (green)  
- Stories in "Leadership & Strategy" → badge text "LEADERSHIP" (magenta)
- Stories in "Tools & Products" → badge text "PRODUCT" (purple)
- Stories in "Research & Innovation" → badge text "RESEARCH" (blue)
- Stories in "Policy & Ethics" → badge text "POLICY" (amber)
- Stories in "Infrastructure & Operations" → badge text "INFRA" (orange)

The LEAD story of the day should ALSO have a "LEAD" badge in addition to its category badge.

If a story has `isCallback: true`, show a "CALLBACK" badge in amber.

---

## FIX 5: Increase Hero Hook Font Size

The editorial hook quote is too small. Update the hero quote styling:

FROM: `clamp(1rem, 1.8vw, 1.3rem)`
TO: `clamp(1.5rem, 3vw, 2.1rem)`

This matches the prototype and gives the hook the visual prominence it deserves as the page's main editorial statement.

---

## FIX 6: Audio Player — Add Volume Control & Credit Line

Add to the audio player section:

**Credit line** above or near the player:
```
Dr. Norma Jones · The Innovation Pulse
```
In JetBrains Mono, small, muted color.

**Volume icon** — Add a speaker/volume SVG icon to the right side of the audio player bar. Doesn't need to be functional yet, just present visually.

---

## FIX 7: Newsletter — Add Daily/Weekly Toggle

In the newsletter signup section at the bottom of the page, add frequency toggle buttons above the email input:

```
┌──────────┐  ┌────────────────┐
│  Daily   │  │  Weekly Digest  │
└──────────┘  └────────────────┘
```

- "Daily" selected by default (solid fill, cyan border)
- "Weekly Digest" as outline button
- Toggle is visual only for now (no backend)

---

## FIX 8: TOC Title — Change to "Today's Stories"

Change the sidebar TOC card title from "In This Issue" to "Today's Stories" to match the prototype.

---

## FIX 9: Add CALLBACK Badge Support

In the story card component, check for `isCallback` in the story data. If true:
- Show a "↩ CALLBACK" badge in amber/yellow
- Below the badge, show "Previously covered: [original date]" in small JetBrains Mono text

This is critical for the story tracking system — callbacks are follow-ups to stories we've covered before.

---

## FIX 10: Audio Player — Interactive Play State

Add JavaScript for the play button:
- Click toggles between play ▶ and pause ⏸ icons
- When "playing", animate the waveform bars with a subtle pulse/movement animation
- CSS animation on bars: random height oscillation to simulate audio visualization
- When paused, bars return to static

---

## BUILD & DEPLOY

```bash
cd /Volumes/Bevo_2TB/ihe-pulse
npm run build
# Fix any errors

# Verify key changes
grep -n "Today's Stories\|norma-card\|featured-card\|Dr. Norma's Take\|CALLBACK\|scrollToCat\|Weekly Digest\|volume" app/innovation-pulse/ -r --include="*.tsx" | head -20

git add -A
git commit -m "feat: Innovation Pulse — match prototype with featured story, category sections, Dr. Norma card, audio polish"
git push origin main
```

**GO. Read the prototype first, then implement all 10 fixes. Don't stop.**

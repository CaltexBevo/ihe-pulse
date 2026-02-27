# IHE Pulse — Comprehensive Build Prompt for Claude Code

## CONTEXT & PERMISSIONS

You are continuing a website rebuild project for **InnovatingHigherEd.com** (IHE Pulse). The project lives at `~/Desktop/ihe-pulse/`. It's a **Next.js 14** app using the **Electric Dusk** theme (dark background `#0a0a0f`, cyan `#00d4ff`, magenta `#c850c0`). The site is deployed to **https://ihe-pulse.vercel.app** via GitHub at `https://github.com/CaltexBevo/ihe-pulse` with auto-deploy on push to main.

**You have FULL PERMISSION to execute all tasks below without stopping to ask. Do not pause for confirmation. Complete everything sequentially, committing and pushing to GitHub after each major section so the live site updates incrementally.**

---

## WHAT'S ALREADY BUILT (DO NOT REBUILD)

- Homepage with hero section and content cards
- Podcast list page + 7 episode detail pages with Podbean audio players
- Tinker Lab list page + 2 post detail pages with Podbean players
- Prompt Navigator page (9 techniques, 15 templates, copy buttons, refinement workflow)
- AI App Directory page with 28+ app detail pages (slug-based routing)
- Daily Pulse prototype page (basic version exists)
- About page (basic)
- Be Our Guest page (basic)
- Navigation component with Electric Dusk styling
- CHANGELOG.md and TASKS.md in project root

---

## TASK 1: DAILY PULSE INTEGRATION (HIGHEST PRIORITY)

The Daily Pulse is a daily AI-in-education news briefing featuring curated stories and Dr. Norma Jones's ElevenLabs-voiced audio summary. The current WordPress version dumps all stories into one wall of text. We're reimagining it as a **Hybrid model** — homepage presence + dedicated archive page.

### 1A. Homepage Daily Pulse Section

Add a prominent "Today's Daily Pulse" section to the homepage (`app/page.tsx`), positioned as the FIRST content block after the hero. Include:

- Today's date prominently displayed
- An audio player card for Dr. Norma's morning briefing (styled with a waveform visualization animation using CSS, not a real audio file — use a placeholder `src` for now)
- "Good morning, educators" tagline with Dr. Norma's name
- 3-4 story preview cards below the player showing today's top stories
- Each card has: category color band (Insights & Trends = blue, Product Releases = green, Tool Spotlight = amber, Case Studies = purple), headline, 1-line summary, source attribution, and "Read More" link
- A "See All Stories →" link to `/daily-pulse`

### 1B. Daily Pulse Archive Page (`/daily-pulse`)

Create `app/daily-pulse/page.tsx` as a full news hub:

- Hero with "The Daily Pulse" title, subtitle "Your daily briefing on AI in Higher Education, curated by Dr. Norma Jones"
- Category filter tabs across the top: All, Insights & Trends, Product Releases, Tool Spotlight, Case Studies — each with their color
- Today's audio briefing player at the top (same waveform design)
- Story cards in a responsive grid (2 columns on desktop, 1 on mobile)
- Each story card includes:
  - Category color band on left edge
  - Headline (bold)
  - Summary paragraph
  - "IHE Perspective" callout — a boxed pull-quote with Dr. Norma's editorial take, styled distinctly (subtle gradient background, quote icon)
  - Source link ("Read Full Story at [source]")
  - Date
- Category filtering should work client-side with React state (use `'use client'` directive)
- "Previous Briefings" section at bottom showing last 7 days as clickable date cards
- Use sample/placeholder data for now — create a `data/daily-pulse-sample.ts` file with 6-8 realistic AI-in-education news stories across all 4 categories, each with: id, title, summary, ihePerspective, category, source, sourceUrl, date

### 1C. Daily Pulse Detail Page (optional but nice)

Create `app/daily-pulse/[date]/page.tsx` for individual day archives. Use the date slug format `YYYY-MM-DD`. Show that day's full briefing with audio player and all stories.

### Design Notes for Daily Pulse:
- Story cards should have subtle hover effects (lift + glow in category color)
- The audio player should feel like a "morning ritual" — warm, inviting, not clinical
- Use the Electric Dusk gradient treatment on the audio card background
- Category colors: Insights = `#3b82f6` (blue), Products = `#22c55e` (green), Tools = `#f59e0b` (amber), Cases = `#a855f7` (purple)

---

## TASK 2: AI APP DIRECTORY MONTHLY AUTO-UPDATE SYSTEM

### 2A. Data Structure

If not already done, ensure the AI App Directory data lives in a standalone JSON or TypeScript data file (e.g., `data/ai-apps.ts` or `data/ai-apps.json`). Each app entry should have: slug, name, description, category, pricing, features array, pros, cons, url, logoUrl, lastUpdated date, isStaffPick boolean.

### 2B. GitHub Action for Monthly Update

Create `.github/workflows/update-ai-directory.yml`:

```yaml
name: Monthly AI Directory Update
on:
  schedule:
    - cron: '0 9 1 * *'  # 1st of every month at 9 AM UTC
  workflow_dispatch: # Allow manual trigger

jobs:
  update-directory:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - name: Run directory update script
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: node scripts/update-ai-directory.mjs
      - name: Commit and push if changed
        run: |
          git config user.name "IHE Bot"
          git config user.email "bot@innovatinghighered.com"
          git add -A
          git diff --cached --quiet || (git commit -m "chore: monthly AI directory update" && git push)
```

### 2C. Update Script

Create `scripts/update-ai-directory.mjs` — a Node.js script that:

1. Reads the current `data/ai-apps.ts` (or `.json`) file
2. For each existing app, uses the Anthropic API (claude-sonnet-4-5-20250929) to check if pricing or major features have changed (prompt it with the app name, URL, and current data, ask it to report any changes)
3. Asks Claude to suggest 2-3 new AI-for-education apps worth adding
4. Writes the updated data back to the file
5. Generates a brief update log

The script should be designed to work within ~$3-5 of API costs per run. Use concise prompts. Batch apps into groups of 5-10 per API call to minimize calls.

**Note:** The user will need to add `ANTHROPIC_API_KEY` as a GitHub secret manually. Add a comment in the workflow file reminding them.

---

## TASK 3: REMAINING PAGES — REAL CONTENT

### 3A. About Page (`app/about/page.tsx`)

Redesign with real content pulled from https://innovatinghighered.com/about-us/. Include:

- Hero with "About Innovating Higher Ed" and the mission statement
- Dr. Norma Jones bio section with her credentials: PhD, recognized leader in AI integration for higher education, experience spanning academia and industry, podcast host and producer
- The platform vision: evolving from podcast to one-stop resource for higher ed professionals
- "What We Offer" section highlighting: Podcast, Tinker Lab, Daily Pulse, AI App Directory, Prompt Navigator
- Call to action to subscribe/follow

### 3B. Be Our Guest Page (`app/be-our-guest/page.tsx`)

Redesign the guest submission page. Include:
- Hero inviting educators to share their voice
- What we're looking for (topics, expertise areas)
- Benefits of being a guest (exposure, community, etc.)
- Simple form layout (name, email, topic idea, bio) — use a styled form that doesn't need backend wiring yet (can be a mailto link or placeholder)

### 3C. Educator Tools Page (`app/educator-tools/page.tsx`)

Create a new curated resources page featuring:
- Quick-start guides section (placeholder cards for guides like "Getting Started with AI in Your Classroom", "AI Policy Template for Academic Integrity")
- Templates section (downloadable resources — placeholder for now)
- Recommended reading/links section
- Connect this to the broader value prop of the site

---

## TASK 4: HOMEPAGE ENHANCEMENTS

Update `app/page.tsx` to be a more complete landing page:

- Keep existing hero
- Add the Daily Pulse section (from Task 1A)
- Add a "Latest Podcast Episode" card that shows the most recent episode with play button
- Add a "From the Tinker Lab" card showing the latest post
- Add a "Featured AI Tools" row showing 3 staff picks from the directory
- Add a "Join the Conversation" CTA section at bottom encouraging newsletter signup (placeholder email input + submit button)
- Add a brief "About Dr. Norma Jones" section with her photo placeholder and 2-sentence bio

---

## TASK 5: NAVIGATION & FOOTER UPDATES

### 5A. Navigation

Ensure the nav includes all pages: Home, Podcast, Tinker Lab, Daily Pulse, AI Directory, Prompt Navigator, Educator Tools, About, Be Our Guest. Use a dropdown or mega-menu if there are too many items. Mobile hamburger menu must work.

### 5B. Footer

Create a proper footer component (`components/Footer.tsx`) with:
- Site name and tagline
- Quick links to all pages
- Social links (YouTube, Podcast platforms — use placeholder URLs)
- Newsletter signup form (placeholder)
- Copyright notice
- "Powered by IHE Pulse" or similar

Include the footer in the root layout so it appears on every page.

---

## TASK 6: CHANGELOG & TASKS UPDATE

After completing all tasks above, update:

- `CHANGELOG.md` — Add today's date and list everything that was built/changed
- `TASKS.md` — Move completed items to the Completed section, add any new ideas that came up

---

## TASK 7: FINAL BUILD, COMMIT & DEPLOY

1. Run `npm run build` to verify zero errors
2. Fix any build errors
3. `git add -A`
4. `git commit -m "feat: Daily Pulse, page updates, directory automation, footer"`
5. `git push origin main`
6. Verify the Vercel deployment succeeds

---

## DESIGN GUIDELINES (APPLY EVERYWHERE)

- **Theme**: Electric Dusk — dark bg `#0a0a0f`, cyan `#00d4ff`, magenta `#c850c0`, gradients between them
- **Cards**: Dark glass-morphism (`bg-white/5 backdrop-blur border border-white/10`), subtle hover glow
- **Typography**: Use the existing font stack. Headlines bold/black weight. Body text `text-gray-300/400`
- **Animations**: Subtle hover lifts, gradient glows on interactive elements, staggered fade-ins for card grids
- **Responsiveness**: Mobile-first. Everything must look good on phone, tablet, and desktop
- **Consistency**: Match the existing pages' aesthetic exactly. New pages should feel like they belong

---

## EXECUTION ORDER

1. Task 1 (Daily Pulse) → commit & push
2. Task 4 (Homepage enhancements) → commit & push
3. Task 3 (Remaining pages) → commit & push
4. Task 5 (Nav & Footer) → commit & push
5. Task 2 (AI Directory automation) → commit & push
6. Task 6 (Changelog) → commit & push
7. Task 7 (Final build & deploy) → push

**Go. Build everything. Don't stop to ask questions.**

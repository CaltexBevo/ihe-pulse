# BUILD 13.1: Site-Wide Fixes — Feb 23, 2026

**Don't stop. You have all permissions granted. Complete all tasks without pausing for confirmation. Use team agents if needed.**

## CRITICAL RULES
- Read CLAUDE.md, ROADMAP.md, and tasks/lessons.md FIRST
- NEVER use "IHE" as abbreviation — conflicts with Inside Higher Ed. Always write "Innovating Higher Ed" in full.
- NEVER use "Dr. Norma Jones" attribution — use "Our Take", "Innovating Higher Ed's Take", "we/our"
- Electric Dusk theme: dark bg (#0a0a0f), cyan (#00d4ff), magenta (#c850c0)
- Fonts: Instrument Serif (headlines) + DM Sans (body) + JetBrains Mono (labels/mono)
- V4 categories: Insights & Trends, Case Study, Practical Tips, Ethical AI, Latest AI Products, Beyond Ed, Week in Review
- Verify builds pass after each task. `npm run build` must have zero errors.

## PROJECT PATH
`/Volumes/MISHA 2TB/ihe-pulse/`

## REFERENCE FILES
- AI App Directory original content: https://innovatinghighered.com/ai-app-directory/
- Prompt Navigator original content: https://innovatinghighered.com/prompt-navigator/
- Prototype files are in the `Prototypes/` folder within the project: `ai-app-directory-v2.html` and `prompt-navigator-v4.html`
- Logo file: Copy from `/Volumes/MISHA 2TB/ihe-pulse/public/images/IHE_Logo_June_25_03_Logo_ALPHA.png` (if not there, check `Prototypes/` or project root — it's an alpha PNG with the full "Innovating Higher Ed" wordmark with blue orbit icon and orange "Ed" badge)

**FIRST:** Copy the logo PNG into `public/images/` if it's not already there. Name it `ihe-logo.png`.

---

## TASK 1: LOGO ON ALL PAGES

**Problem:** Nav bar shows "INNOVATING HIGHER ED" as text. Should show the actual logo image.

**Fix:** Replace the text-based brand in the nav/header component with an `<img>` tag pointing to `/images/ihe-logo.png`. Size it appropriately for the nav bar — approximately 180-200px wide, auto height. Keep it as a link to home (`/`). The logo has a transparent/black background with white text, blue orbit icon, and orange "Ed" — it will look great on our dark nav.

**Apply to:** The shared nav/header component so it appears on ALL pages automatically.

**Done when:**
- [ ] Logo image visible in nav bar on every page
- [ ] Logo links to homepage
- [ ] Properly sized (not too big, not too small — fits the 56px nav height)
- [ ] Looks crisp on retina displays

---

## TASK 2: HOME PAGE FIXES

### 2a: Podcast images cut off
**Problem:** Podcast cover art images are cropped, cutting off text and imagery at edges.
**Fix:** Use `object-fit: contain` (not `cover`) for podcast card images, OR ensure the image container has proper aspect ratio that doesn't crop the artwork. The podcast cover images are designed as complete compositions — they should be shown in full.

### 2b: AI App Directory section — show real app cards, not stock photos
**Problem:** Homepage AI App Directory section shows generic stock photography (code screenshots, laptops) instead of actual app information.
**Fix:** Replace with real app card data matching the style from the AI App Directory page. Each card should show:
- App name (e.g., "Eduaide.Ai", "Brisk Teaching", "ChatGPT")
- Category badge (e.g., "Lesson Planning", "General LLMs")
- Short description
- Rating stars if available
- Pricing info
- "Learn More" link to the full AI App Directory page
- NO stock photos — use the app's favicon/logo via Clearbit (https://logo.clearbit.com/[domain]) or a colored icon with the app's first letter

Show 3 cards: pick the newest or most trending tools. "Browse all tools →" links to /ai-app-directory.

### 2c: Top Prompts — don't navigate away, expand in place
**Problem:** Clicking a prompt card on the homepage navigates to the Prompts page. Should expand in place with the full prompt text and a copy button.
**Fix:** Make prompt cards on the homepage self-contained:
- Click/tap a card → it expands to show the full prompt text in a monospace code block
- Show a "Copy" button that copies the prompt text to clipboard
- Click again or click an "×" to collapse
- Do NOT navigate to /prompts page on click
- Keep "Browse all prompts →" link for people who want the full page

### 2d: Tinker Lab images cut off
**Problem:** Same image cropping issue as podcasts — Tinker Lab card images are getting clipped.
**Fix:** Same approach as 2a — use `object-fit: contain` or proper aspect ratio containers so the full image is visible.

**Done when:**
- [ ] Podcast images show completely, not cropped
- [ ] AI App Directory shows real app cards with names, categories, descriptions (no stock photos)
- [ ] Clicking a prompt expands it in place with copy button, doesn't navigate away
- [ ] Tinker Lab images show completely, not cropped
- [ ] All links still work

---

## TASK 3: INNOVATION PULSE PAGE FIXES

### 3a: Remove "Earlier This Week" audio section at bottom
**Problem:** The "EARLIER THIS WEEK — CATCH UP" section near the bottom (showing Thu 19, Wed 18, Tue 17, Mon 16 rows with play buttons) is now redundant because we have day pills at the top.
**Fix:** Remove the entire "Earlier This Week" section. The day pills at the top handle this now. Keep the "Briefing Archive" section below it — that's different (it shows older weeks).

### 3b: Day pill click should update the headline
**Problem:** When you click Thu 19's pill, the audio changes but the editorial quote and date at the top still say "Friday, February 20, 2026" and show Friday's editorial quote.
**Fix:** When a day pill is clicked:
- Update the date display to match the selected day
- Update the editorial lens badge (e.g., Thursday = "Connecting the Dots", Wednesday = "The Practitioner's Playbook", etc.)
- Update the editorial quote to match that day's quote from the JSON data
- Update the "TODAY'S STORIES" sidebar to show that day's stories
- Update the lead story section below to show that day's lead story
- Basically, the entire page should reflect the selected day's content, not just the audio

### 3c: Lead story page content too short
**Problem:** The story detail page at `/innovation-pulse/story/[slug]` shows only the card summary text — not a deeper, longer editorial version.
**Fix:** For the existing Feb 16-20 stories, the JSON `summary` field is all we have right now. For the story page, display:
1. The full summary text (don't truncate it)
2. The "Our Take" editorial perspective (from the JSON `editorialQuote` or equivalent field) as a prominent editorial section
3. Add a "Previous Lead Stories" section below showing the lead stories from other days as cards (linking to their story pages)
4. If the summary is short, that's OK for now — the page structure and layout should be complete so when we add longer content later, it just flows in

**Done when:**
- [ ] "Earlier This Week" section removed from bottom
- [ ] Clicking a day pill updates date, lens badge, quote, stories sidebar, and lead story
- [ ] Story page shows full content + "Our Take" section + previous lead stories
- [ ] No broken links

---

## TASK 4: AI APP DIRECTORY PAGE — RESTORE FULL CONTENT

**Problem:** The AI App Directory page lost the extended information about each app. The WordPress version at https://innovatinghighered.com/ai-app-directory/ has the full content. The prototype `ai-app-directory-v2.html` in the Prototypes folder also has the complete data.

**Fix:** The page must have ALL of this content, restyled to Electric Dusk:

**Page structure:**
1. Hero: "AI App Directory" title + subtitle "Empowering innovators in teaching and administration. Find the right AI tools for your needs."
2. Role toggle: "For Teachers" / "For Administrators"
3. Search bar: "Search tools..."
4. Category filter pills: All, Assessment, Avatars, Gamification, General LLMs, Image & Video Generation, Lesson Planning, Music, Slideshows, Text to Speech
5. Tool cards in a 4-column grid (responsive to 2-col on tablet, 1-col on mobile)

**Each tool card must have:**
- Category badge (colored)
- App name (large, bold)
- Short description
- "Learn More" button/link
- App logo via Clearbit (https://logo.clearbit.com/[domain]) — NOT colored letter boxes

**Complete tool list from the WP site (ALL of these must be included):**

**Lesson Planning:** Eduaide.Ai, Brisk Teaching, Disco AI, Teachfloor, Curipod
**General LLMs:** ChatGPT, Claude, Grok, Perplexity AI, Gemini (Google)
**Slideshows:** Slidesgo, Mentimeter
**Assessment:** Gradescope, Formative AI, Turnitin
**Gamification:** Kahoot!, Gimkit
**Image & Video Generation:** DALL-E, Runway, Synthesia
**Avatars:** D-ID, HeyGen
**Music:** Suno, AIVA
**Text to Speech:** ElevenLabs, Murf AI, NaturalReader

When you click "Learn More" on a tool, it should either expand the card to show more details (pros, cons, use cases, pricing) OR link to a detail section. Check what `ai-app-directory-v2.html` in Prototypes does and match that behavior.

**Read the prototype file first:** `cat Prototypes/ai-app-directory-v2.html` — use its data structure and tool information. If the file doesn't exist at that path, try `find /Volumes/MISHA\ 2TB/ihe-pulse -name "ai-app-directory*" -type f` to locate it.

**Done when:**
- [ ] All tools listed above appear on the page
- [ ] Category filter works (clicking "Assessment" shows only assessment tools)
- [ ] Search works
- [ ] Role toggle works
- [ ] Each card has real app logo, not colored letter boxes
- [ ] "Learn More" shows extended info
- [ ] Styled in Electric Dusk theme

---

## TASK 5: PROMPT NAVIGATOR PAGE — RESTORE FULL CONTENT

**Problem:** The Prompt Navigator page lost most of its content during the migration. The WordPress version at https://innovatinghighered.com/prompt-navigator/ has the complete content. The prototype `prompt-navigator-v4.html` in the Prototypes folder also has everything.

**Fix:** The page must have ALL of this content, restyled to Electric Dusk:

**Page structure:**
1. Hero: "Prompt Navigator" + "A Human-Centered AI Prompt Engineering Guide for College Faculty"
2. Section nav cards: Core Techniques, Prompt Templates, Common Problems, Refinement Workflow, References
3. **Core Techniques** — 9 collapsible technique cards (2-column grid on desktop, 1-col on mobile):
   - Zero-Shot Prompting
   - Few-Shot Prompting
   - System & Role Prompts
   - Context Injection
   - Step-Back Prompting
   - Chain-of-Thought Prompting
   - Self-Consistency
   - Tree-of-Thought Prompting
   - ReAct (Reason & Act)

   Each technique card has:
   - Title (colored, cyan/accent)
   - "Use when:" tagline
   - Expandable sections: Definition, Use Case (Higher Ed), When/Why to Use
   - 1-2 copyable prompt examples in monospace code blocks with "COPY" buttons

4. **Prompt Templates** — 15 template cards:
   - Lesson Plan Generator
   - Syllabus Outline Draft
   - Lesson Plan Adaptation (Inclusive Design)
   - Constructive Feedback Generator
   - Rubric Draft
   - Summative Feedback Letter
   - Differentiated Instruction Strategies
   - Adaptation for Diverse Learners
   - Inclusive Discussion Prompt
   - Advising Email Draft
   - Degree Planning Guide
   - Role-Play Script (Advisor-Student)
   - Syllabus AI Policy Draft
   - Academic Integrity Case Discussion
   - Student Handout on AI Use

   Each template has: title, copyable prompt text with COPY button, usage instructions

5. **Common Problems** — 6 problem/fix pairs:
   - Too Vague
   - No Audience Level
   - Missing Format or Length
   - Overloaded Prompts
   - No Role or Tone
   - No Iteration or Verification

6. **Refinement Workflow** — 8-step workflow:
   1. Define Your Goal
   2. Add Context
   3. Draft Clearly
   4. Test
   5. Spot Gaps
   6. Refine
   7. Iterate
   8. Document

7. **Tuning Checklist** — 7 items: Clarity, Context, Format, Tone & Style, Cognitive Level, Academic Fit, Inclusivity

8. **References & Further Reading** — 19 references organized by: Core Research Papers, Practical Guides, Academic Papers, University Guides, Tools & Resources

**Read the prototype file first:** `cat Prototypes/prompt-navigator-v4.html` — use its data and structure. If not found, use `find /Volumes/MISHA\ 2TB/ihe-pulse -name "prompt-navigator*" -type f`.

**The WP page content is the source of truth.** Every technique, every template, every prompt example, every reference must be present. Do NOT leave any content out.

**Styling rules:**
- No ugly emoji icons — use professional SVG icons or simple geometric shapes
- Copyable prompts in dark monospace code blocks with cyan "COPY" buttons
- Expandable/collapsible sections with smooth animation
- Section headers with gradient underlines (cyan→transparent)
- Cards with dark glass-morphism styling matching rest of site

**Done when:**
- [ ] All 9 Core Techniques present with full content (definitions, use cases, copyable prompts)
- [ ] All 15 Prompt Templates present with copyable prompts and usage instructions
- [ ] All 6 Common Problems with fixes
- [ ] 8-step Refinement Workflow
- [ ] 7-item Tuning Checklist
- [ ] References section with all 19 sources
- [ ] Copy buttons work
- [ ] Expand/collapse works
- [ ] Styled in Electric Dusk, no emoji icons
- [ ] Content matches WordPress page at https://innovatinghighered.com/prompt-navigator/

---

## TASK 6: PODCAST PAGE — IMAGE FIXES

**Problem:** Podcast episode images are cut off / not properly framed. When clicking into an episode, the image container is wider than the image.

**Fix:**
- Episode card images: Use `object-fit: contain` with a dark background behind the image so the full cover art is visible
- Episode detail view: Constrain the image container to match the image's natural aspect ratio. Don't let the container be wider than the image. Use `max-width: 100%` on the image and `width: fit-content` on the container, centered.
- Apply consistent border-radius (14px) to all image containers

**Done when:**
- [ ] Podcast list page images show full artwork, not cropped
- [ ] Podcast detail page image container matches image size
- [ ] Images have consistent border-radius
- [ ] No layout shifts or overflow

---

## TASK 7: TINKER LAB PAGE — IMAGE FIXES

**Problem:** Same image cropping issue as podcasts.

**Fix:** Same approach — `object-fit: contain` with proper aspect ratio containers. Tinker Lab posts have designed cover images that should be shown in full.

**Done when:**
- [ ] All Tinker Lab images show completely without cropping
- [ ] Consistent styling with other image containers on the site

---

## AFTER ALL TASKS

1. Run `npm run build` — ZERO errors
2. Check for any remaining references to "Dr. Norma Jones" — grep the entire src/ directory: `grep -r "Dr. Norma\|Dr\.Norma\|Norma Jones" src/` — remove any found
3. Check for any "IHE" abbreviations used as display text: `grep -r '"IHE"\|>IHE<\|IHE ' src/` — fix any found (the abbreviation conflicts with Inside Higher Ed)
4. Update ROADMAP.md marking all tasks complete
5. Update CHANGELOG.md with Build 13.1 summary
6. Append any lessons learned to tasks/lessons.md
7. `git add -A && git commit -m "fix: Build 13.1 — logo, image fixes, prompt navigator restore, AI directory restore, Innovation Pulse day-switch, remove Earlier This Week" && git push origin main`
8. Wait for Vercel deploy, verify at https://ihe-pulse.vercel.app

## TEAM AGENT STRUCTURE (if using agents)

**Agent 1 — Global + Homepage:** Tasks 1, 2 (logo, homepage fixes)
**Agent 2 — Innovation Pulse:** Task 3 (remove Earlier This Week, day-switch updates, story page)
**Agent 3 — Content Pages:** Tasks 4, 5 (AI App Directory restore, Prompt Navigator restore)
**Agent 4 — Media Fixes:** Tasks 6, 7 (Podcast images, Tinker Lab images)

Agents can run in parallel. Each must run `npm run build` after their changes. Final agent does the git commit/push.

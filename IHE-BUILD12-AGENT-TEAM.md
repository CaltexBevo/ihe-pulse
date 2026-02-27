# IHE BUILD 12 — COMPREHENSIVE FIX ALL PAGES

## CONTEXT & PERMISSIONS

Project: `/Volumes/Bevo_2TB/ihe-pulse/` (Next.js 14 app)
GitHub: `CaltexBevo/ihe-pulse` with auto-deploy to `https://ihe-pulse.vercel.app`
Prototypes folder: `/Volumes/Bevo_2TB/ihe-pulse/Prototypes/`

**You have FULL PERMISSION to execute ALL tasks without stopping. Do not pause for confirmation. All permissions granted. --dangerously-skip-permissions is active.**

---

## DESIGN SYSTEM — THE LAW (DO NOT DEVIATE)

### Colors (Electric Dusk)
- Background: `#0a0a0f` (void)
- Surface/cards: `rgba(255,255,255,0.03)` with `backdrop-blur` and `border: 1px solid rgba(255,255,255,0.06)`
- Cyan primary: `#00d4ff`
- Magenta secondary: `#c850c0`
- Gradient: `linear-gradient(135deg, #00d4ff, #c850c0)`
- Text bright: `#f0f0f5`
- Text secondary: `rgba(255,255,255,0.6)`
- Text muted: `rgba(255,255,255,0.4)`

### Typography — STRICT RULES
- **Page hero headings (h1)**: `font-family: 'DM Sans', sans-serif; font-weight: 800; font-size: clamp(2rem, 4vw, 3rem);` — NEVER serif, NEVER Instrument Serif for headings
- **Card titles**: `font-family: 'DM Sans', sans-serif; font-weight: 700;` — BOLD, not serif
- **Body text**: `font-family: 'DM Sans', sans-serif; font-weight: 400;`
- **Labels, metadata, badges, dates**: `font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;`
- **Mastheads ONLY (section titles like "THE INNOVATION PULSE", "PODCAST", "TINKER LAB")**: `font-family: 'Instrument Serif', serif;` — This is the ONLY place serif is allowed
- **Gradient emphasis**: Key words in headings get `background: linear-gradient(135deg, #00d4ff, #c850c0); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`

### Card Pattern
Every content card across the ENTIRE site must follow this pattern:
```css
background: rgba(255,255,255,0.03);
backdrop-filter: blur(10px);
border: 1px solid rgba(255,255,255,0.06);
border-radius: 16px;
overflow: hidden;
transition: all 0.3s ease;
```
On hover:
```css
border-color: rgba(0, 212, 255, 0.2);
transform: translateY(-2px);
box-shadow: 0 8px 32px rgba(0, 212, 255, 0.08);
```

### Navigation
- Logo: IHE logo image only (no separate text), height 32px
- Nav items in JetBrains Mono uppercase: Home, Innovation Pulse, Prompts, AI App Directory, Podcast, Tinker Lab, About
- Active page gets cyan underline
- Mobile: hamburger menu

---

## AGENT TEAM TASK 1: GLOBAL STYLES & SHARED COMPONENTS

### 1A. Global CSS Reset
Open `app/globals.css` and ensure:
- Google Fonts import: `DM Sans:wght@300;400;500;600;700;800`, `Instrument Serif:ital@0;1`, `JetBrains Mono:wght@400;500;600`
- CSS variables match the Design System above exactly
- Base h1-h6 styles use DM Sans, weight 700-800, NO serif
- All `font-family: serif` or `font-family: 'Instrument Serif'` on headings MUST be removed (only allowed on masthead eyebrow labels)
- Card base class `.glass-card` with the card pattern above

### 1B. Navigation Component
Open `components/Navigation.tsx` (or equivalent):
- Remove any text that says "INNOVATING HIGHER ED" as separate text — the logo image IS the brand
- Ensure nav items are: Home, Innovation Pulse, Prompts, AI App Directory, Podcast, Tinker Lab, About
- Active state: cyan bottom border
- Mobile hamburger working

### 1C. Footer Component
Ensure footer exists with:
- Site name, tagline
- Quick links to all pages
- Platform links (Apple Podcasts, Spotify, YouTube)
- Newsletter signup placeholder
- Copyright 2025

---

## AGENT TEAM TASK 2: FIX EVERY PAGE

### 2A. Homepage (`app/page.tsx`)
Current issues:
- Tinker Lab section shows 3 FAKE posts ("I Graded 100 Papers", "Building a Custom AI Tutor", "Can AI Write a Syllabus") — these DO NOT EXIST. Only 2 real Tinker Lab posts exist:
  1. "The Wonka-Lantern Framework: Creative & Ethical AI in Higher Education" (June 17, 2025)
  2. "ChatGPT Pro Deep Research: Worth It?" (February 28, 2025)
- Remove ALL fabricated/dummy content
- Podcast section shows "EPISODE 47" badges — REMOVE all episode numbers
- Ensure all card titles use DM Sans bold, NOT serif

Fix:
- Innovation Pulse hero section: Keep as-is (looks good)
- Top Stories section: Keep as-is (looks good)
- Podcast section: Remove episode number badges. Show only 3 most recent REAL episodes. Card titles in DM Sans 700.
- AI App Directory section: Keep but use actual app favicon/logos where possible, not colored letter boxes
- Top Prompts section: Keep as-is (looks decent)
- Tinker Lab section: Show ONLY the 2 real posts. Use real thumbnails:
  - Wonka-Lantern: `/images/tinker-lab/wonka-lantern.jpg` or fallback to `https://innovatinghighered.com/wp-content/uploads/2025/06/Tinker-Lab-WIlly-Wonka.02.jpg`
  - ChatGPT Pro: `/images/tinker-lab/chatgpt-pro.jpg` or fallback to `https://innovatinghighered.com/wp-content/uploads/2025/05/Tinker-Lab-Chat-Pro.-01.jpg`
- Newsletter section: Keep

### 2B. Podcast Page (`app/podcast/page.tsx`)
Current issues:
- "EPISODE 47" showing in hero and cards — REMOVE ALL episode numbers
- Heading might be using serif font — must be DM Sans 800
- Cards are OK but need polish

Fix:
- Hero: Section eyebrow "PODCAST" in JetBrains Mono cyan. Heading "Conversations with Higher Ed Innovators" in DM Sans 800 (NO serif). Subtext in DM Sans 400.
- Featured episode: Keep the latest episode featured with large thumbnail, title, description, guest name, play button
- Episode grid: 3-column grid of glass cards. Each card:
  - Thumbnail image at top (aspect-ratio 16/9, object-fit cover)
  - Category badge (JetBrains Mono)
  - Title in DM Sans 700
  - Description snippet in DM Sans 400
  - Date + duration in JetBrains Mono
  - Play button icon (gradient circle)
- NO episode numbers anywhere
- Category filter pills: All Episodes, Interviews, Panels, Teaching & Pedagogy, Leadership, AI Tools, Student Voices
- Search bar

Real episodes (7 total):
1. Human-Centered AI Strategy: Empathy, Trust, Access | Professor Chesa Caparas | June 22, 2025
2. Assistive AI Tools: Transform Course Design & Assessment | Professor Scott James | May 17, 2025
3. OER, ZTC & Lightning-Fast AI Translation | Dr. Sarah Harmon | May 11, 2025
4. Equity-First AI Curriculum for Every Discipline | Dr. Suha Al Juboori | February 21, 2025
5. VR Rehearsals: Building Confident Nurses Faster | Dr. Jenna Zeller | February 21, 2025
6. XR Learning & AI Engagement Hacks | Dr. Garrick Grace | February 21, 2025
7. ChatGPT Teaching Assistant: Lesson Plans in Minutes | Lynn Dickinson | October 19, 2024

Real platform links:
- Apple: https://podcasts.apple.com/us/podcast/innovating-higher-ed/id1768896865
- Spotify: https://open.spotify.com/show/1PaBkIvJQaN9FPqoflbJxI
- Amazon: https://music.amazon.com/podcasts/4c006f36-a401-4a1a-b498-c7010e48b50e/innovating-higher-ed
- Podbean: https://innovatinghighered.podbean.com/
- YouTube: https://www.youtube.com/@InnovatingHigherEd

### 2C. AI App Directory Page (`app/ai-app-directory/page.tsx`)
Current issues:
- Tool icons are colored boxes with letters (C, G, P) — these look cheap and unprofessional
- Need actual app logos/favicons

Fix:
- Hero: Eyebrow "AI APP DIRECTORY" in JetBrains Mono cyan. Heading "Find the Right AI App for Higher Ed" in DM Sans 800 with "AI App" in gradient. Keep search bar and role filters.
- Category filter: All Categories, General LLMs, Lesson Planning, Assessment, Research, Writing & Feedback, Presentations, Image & Video, Productivity, Student Tools
- Tool cards: Glass card pattern. Each must show:
  - App logo/icon (use favicon from the app's website URL: `https://www.google.com/s2/favicons?domain=DOMAIN&sz=64` for each tool). Examples:
    - ChatGPT: domain=chat.openai.com
    - Claude: domain=claude.ai
    - Gemini: domain=gemini.google.com
    - Perplexity: domain=perplexity.ai
    - Eduaide.AI: domain=eduaide.ai
    - Brisk Teaching: domain=briskteaching.com
    - Gamma: domain=gamma.app
    - Grammarly: domain=grammarly.com
    - etc.
  - Category badge (JetBrains Mono)
  - App name in DM Sans 700
  - Description in DM Sans 400
  - Rating stars + pricing tier + target role in JetBrains Mono
  - Trending/New/Updated badge if applicable
- Remove "Staff Picks" section for now
- When filtering by category, show filtered tools directly — no other sections between category selector and results

### 2D. Prompts Page (`app/prompts/page.tsx`)
Current issues:
- Has content but styling doesn't match refined prototype
- Card styling needs glass-card treatment

Fix:
- Hero: Eyebrow "PROMPT NAVIGATOR" in JetBrains Mono cyan. Heading "AI Prompts Built for Higher Education" in DM Sans 800 with "Higher Education" in gradient.
- Stats bar: "2,400+ prompts curated · 48k total uses · 340 contributors" in JetBrains Mono
- Featured prompt section with large preview
- Difficulty filter pills: All Levels, Beginner (green), Intermediate (yellow), Advanced (red)
- Category filter: All, Discussion, Assessment, Feedback, Course Design, Research, Writing, Admin
- Prompt cards: Glass card pattern. Each shows:
  - Difficulty + category badges (JetBrains Mono)
  - Title in DM Sans 700
  - Description in DM Sans 400
  - Prompt preview in JetBrains Mono (dark code-block style background)
  - Usage count + rating in JetBrains Mono
  - Copy button
- Keep existing 15 real prompts, don't add fakes

### 2E. Tinker Lab Page (`app/tinker-lab/page.tsx`)
Current issues:
- Shows 3+ FAKE posts with stock photos that don't exist
- Only 2 real Tinker Lab posts exist

Fix:
- Hero: Eyebrow "TINKER LAB" in JetBrains Mono cyan. Heading "Experiments, Walkthroughs & AI Explorations" in DM Sans 800.
- Featured post: The Wonka-Lantern Framework (most recent) with large thumbnail, title, description, tags, play button
- Post grid: Show ONLY the 2 real posts:
  1. "The Wonka-Lantern Framework: Creative & Ethical AI in Higher Education" — June 17, 2025 — Thumbnail from WordPress
  2. "ChatGPT Pro Deep Research: Worth It?" — February 28, 2025 — Thumbnail from WordPress
- REMOVE all fabricated posts ("I Graded 100 Papers", "Building a Custom AI Tutor", "Can AI Write a Syllabus", or anything else that's not real)
- Category filters: All, Experiments, Walkthroughs, Comparisons, Challenges
- Difficulty filters: Beginner, Intermediate, Advanced
- Glass card pattern on all cards

### 2F. About Page (`app/about/page.tsx`)
Current issues:
- Bare text blocks, no visual design

Fix:
- Hero section with mission quote: "To empower every educator with the AI knowledge, tools, and community they need to transform teaching and learning — with equity, integrity, and humanity at the center." — styled as a large pull quote with gradient border
- Team section:
  - Dr. Norma Jones card: Photo placeholder (gradient circle), title "Founder & Host", full bio, social links
  - Brent Jones card: Photo placeholder, title "Co-Producer & Technology Lead", full bio
- "Our Story" section: "From Podcast to Platform" narrative
- "What We Offer" section: 6 glass cards for Innovation Pulse, Podcast, AI App Directory, Prompt Navigator, Tinker Lab, Educator Tools
- CTA: "Be Our Guest" invitation

### 2G. Innovation Pulse Page (`app/innovation-pulse/page.tsx`)
This page is the best-looking already. Minor fixes:
- Ensure heading typography matches DM Sans 800 system
- Verify all cards use glass-card pattern
- Keep the editorial lens badges, category filters, story cards

---

## AGENT TEAM TASK 3: QA VERIFICATION

After ALL page fixes are complete, run this verification:

```bash
cd /Volumes/Bevo_2TB/ihe-pulse

echo "=== BUILD CHECK ==="
npm run build 2>&1 | tail -20

echo ""
echo "=== TYPOGRAPHY CHECK ==="
# Check for any serif fonts being used on headings (should only be on eyebrow labels)
grep -rn "Instrument Serif" app/ components/ --include="*.tsx" --include="*.css" | grep -iv "eyebrow\|masthead\|label\|section-label" | head -20

echo ""
echo "=== FAKE CONTENT CHECK ==="
# These should return ZERO results
grep -rn "I Graded 100 Papers" app/ lib/ --include="*.tsx" --include="*.ts" | head -5
grep -rn "Building a Custom AI Tutor" app/ lib/ --include="*.tsx" --include="*.ts" | head -5
grep -rn "Can AI Write a Syllabus" app/ lib/ --include="*.tsx" --include="*.ts" | head -5
grep -rn "EPISODE 47\|EPISODE 46\|EPISODE 45\|EPISODE 44\|EPISODE 43" app/ lib/ --include="*.tsx" --include="*.ts" | head -5

echo ""
echo "=== REAL CONTENT CHECK ==="
# These should return results
grep -rn "Wonka-Lantern" app/ lib/ --include="*.tsx" --include="*.ts" | head -3
grep -rn "ChatGPT Pro Deep Research" app/ lib/ --include="*.tsx" --include="*.ts" | head -3
grep -rn "Chesa Caparas" app/ lib/ --include="*.tsx" --include="*.ts" | head -3
grep -rn "Scott James" app/ lib/ --include="*.tsx" --include="*.ts" | head -3

echo ""
echo "=== EPISODE NUMBER CHECK ==="
# Should return ZERO for episode number displays
grep -rn "Episode [0-9]\|EPISODE [0-9]\|Ep\. [0-9]\|ep [0-9]" app/ --include="*.tsx" | grep -iv "comment\|//" | head -10

echo ""
echo "=== COLORED LETTER BOX CHECK ==="
# Check if AI directory still uses letter-initial icons instead of real logos
grep -rn "charAt(0)\|\.slice(0,1)\|firstLetter\|initial.*icon" app/ai-app-directory/ --include="*.tsx" | head -5
```

If ANY of these checks fail, FIX THEM before committing.

---

## TASK 4: COMMIT & DEPLOY

```bash
cd /Volumes/Bevo_2TB/ihe-pulse
npm run build
# If build fails, fix errors and rebuild
git add -A
git commit -m "feat: Build 12 — Fix all pages to match definitive design system, remove fake content, typography consistency"
git push origin main
```

Wait 60 seconds for Vercel deploy, then verify at https://ihe-pulse.vercel.app

---

## TASK 5: POST-DEPLOY VISUAL QA

After deployment, open these URLs in a browser and verify visually:
1. https://ihe-pulse.vercel.app/ — Homepage
2. https://ihe-pulse.vercel.app/podcast — Podcast
3. https://ihe-pulse.vercel.app/ai-app-directory — AI App Directory
4. https://ihe-pulse.vercel.app/prompts — Prompts
5. https://ihe-pulse.vercel.app/tinker-lab — Tinker Lab
6. https://ihe-pulse.vercel.app/about — About
7. https://ihe-pulse.vercel.app/innovation-pulse — Innovation Pulse

For each page verify:
- [ ] Page heading uses DM Sans bold (NOT serif)
- [ ] Cards use glass-card pattern (dark glass, subtle border, hover glow)
- [ ] No episode numbers visible
- [ ] No fake/fabricated content
- [ ] Images loading correctly
- [ ] JetBrains Mono on metadata/labels
- [ ] Gradient on emphasis words in headings
- [ ] Mobile responsive (test at 375px width)

If ANY visual issue is found, fix it immediately and redeploy.

---

## EXECUTION ORDER

1. Global styles & components (Task 1)
2. Fix all pages (Task 2A through 2G)
3. Build & QA (Task 3)
4. Commit & Deploy (Task 4)
5. Visual QA (Task 5)

**GO. Fix everything. Don't stop until every page matches the design system. No stopping, no asking.**

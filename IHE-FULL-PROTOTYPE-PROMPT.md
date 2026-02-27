# IHE Complete Platform Prototype — Claude Code Build Prompt

## CONTEXT & PERMISSIONS

You are building a **comprehensive single-file HTML prototype** for InnovatingHigherEd.com (IHE). This is a partner presentation prototype that must be self-contained, portable, and work offline. **Output a single file** at `~/Desktop/ihe-pulse/ihe-complete-prototype.html`.

**You have FULL PERMISSION to execute everything without stopping. Do not pause for confirmation. Build the entire file, test it in the browser, and confirm it works.**

The existing file `~/Desktop/ihe-pulse/ihe-hybrid-enhanced.html` has ONLY the homepage. You are building a NEW file from scratch that includes the portal homepage PLUS all 9 destination pages as a single-page application.

---

## DESIGN SYSTEM: "ELECTRIC DUSK"

This is the established visual identity. Do NOT deviate from it.

### Colors
```css
--void: #05050a;        /* deepest background */
--deep: #0a0a12;        /* section bands */
--surface: #0f0f1a;     /* elevated areas */
--elevated: #151522;    /* cards, inputs */
--card: #1a1a2e;        /* card backgrounds */
--border: rgba(255,255,255,0.06);
--border-active: rgba(0,212,255,0.25);

--cyan: #00d4ff;        /* PRIMARY accent */
--magenta: #c850c0;     /* SECONDARY accent */
--gold: #ffd700;
--green: #00e88a;
--rose: #f43f5e;
--violet: #a855f7;
--orange: #f97316;
--sky: #38bdf8;
```

### Typography
```css
--font-display: 'Instrument Serif', Georgia, serif;   /* Headlines */
--font-body: 'Space Grotesk', system-ui, sans-serif;  /* Body text */
--font-mono: 'IBM Plex Mono', monospace;               /* Code, eyebrows */
```

Load from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
```

### Design Principles
- Dark theme throughout, atmospheric radial gradients for depth
- Headlines use Instrument Serif with `<em>` tags getting the cyan→magenta gradient text effect
- Eyebrow text uses IBM Plex Mono, uppercase, letter-spacing: 3px, cyan color
- Cards have subtle border, hover lifts with border-active color and box-shadow
- Buttons use cyan→magenta gradient backgrounds
- Filter pills are rounded (border-radius: 50px), ghost style, active state = cyan tint
- Audio players have animated waveform bars (CSS keyframe animation)
- Generous spacing, clean hierarchy, editorial quality
- Unsplash images via URL API for realistic content (e.g. `https://images.unsplash.com/photo-ID?w=400&h=200&fit=crop`)
- NO generic AI aesthetics. This should feel like a premium editorial platform.

---

## ARCHITECTURE: SINGLE-PAGE APPLICATION

The file uses a simple page-switching system:

```javascript
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  // highlight matching nav link
  window.scrollTo(0, 0);
}
```

Pages are `<div class="page" id="page-{id}">` — only `.page.active` is displayed. Navigation links call `showPage('id')`.

---

## 10 PAGES TO BUILD

### Page 0: PORTAL HOMEPAGE (`page-portal`)

The **hub** of the platform. This is the landing page.

**Structure:**
1. **Hero section** with atmospheric radial gradient background
   - Mono eyebrow: "THE INNOVATION HUB"
   - Serif headline: "Discover the Future of *Higher Education*" (em = gradient text)
   - Subtitle: "Ask anything, explore everywhere. Your AI-powered guide to innovation in academia."
   
2. **ChatNav Hub** — centered chat bar with:
   - Rounded input bar (pill shape) with gradient send button
   - Quick-action chips below: "📡 Today's Pulse", "🔧 Find AI Tools", "🚀 I'm New to AI", "🎙️ Latest Episode", "💡 Browse Prompts"
   - Response area that appears when user types or clicks a chip (slides down with fade)
   
3. **Destination Cards Grid** — 9 cards in a responsive grid (3 columns on desktop)
   Each card has:
   - A small canvas visualization at top (100px tall) with animated viz unique to each page
   - Icon, title, colored tag badge, description, live status indicator
   - Click navigates to that page via `showPage()`
   
   The 9 destinations with their colors and viz types:
   | ID | Label | Color | Icon | Viz Type | Tag |
   |---|---|---|---|---|---|
   | pulse | Innovation Pulse | cyan | 📡 | Waveform oscillation | DAILY |
   | podcast | Podcast | magenta | 🎙️ | Sound ring circles | EPISODES |
   | tools | AI Tools | green | 🔧 | Pulsing dot grid | 200+ TOOLS |
   | prompts | Prompt Library | gold | 💡 | Flowing text lines | TEMPLATES |
   | tinkerlab | Tinker Lab | orange | 🧪 | Floating particles | DR. NORMA |
   | started | Getting Started | sky | 🚀 | Stepping stones path | GUIDE |
   | cases | Case Studies | violet | 📊 | Bar chart animation | RESULTS |
   | community | Community | rose | 🤝 | Network graph nodes | 200+ MEMBERS |
   | about | About Dr. Jones | magenta | 👩‍🏫 | Concentric rings | FOUNDER |

4. **Canvas Visualizations** — Each card gets a tiny `<canvas>` with a unique animated visualization drawn via requestAnimationFrame. These should be subtle, atmospheric, and use the card's accent color at low opacity. Examples:
   - Waveform: sine wave oscillating
   - Sound rings: expanding concentric circles
   - Dot grid: grid of dots that pulse randomly  
   - Text lines: horizontal lines that flow right to left
   - Particles: small dots drifting upward
   - Stepping stones: circles appearing left to right
   - Bar chart: bars growing up and down
   - Network: dots connected by faint lines, slowly moving
   - Rings: concentric circles pulsing outward

5. **ChatNav JavaScript** — When user types or clicks a chip, match keywords to a destination page and:
   - Highlight that card (add `.active` class)
   - Show a contextual response in the response area with action buttons
   - Action buttons can navigate to the page

6. **Footer** — 4-column footer (Brand + desc, Explore links, Learn links, Connect links), bottom bar with copyright

---

### Page 1: INNOVATION PULSE (`page-pulse`)

Daily AI-in-education news briefing.

**Structure:**
- Page header with eyebrow "DAILY BRIEFING", title "The Innovation *Pulse*"
- Back button: "← Back to Hub"
- **Audio player card** — Dr. Norma's morning briefing with play button, title "Good Morning, Educators — Feb 10, 2026", animated waveform bars
- **Stats row** — 4 stat boxes (847 Stories, 52 Tools Reviewed, 6 Today, 12K Weekly)
- **Filter bar** — All Stories, Insights & Trends, Product Releases, Tool Spotlight, Case Studies, Policy & Ethics
- **Featured story** — Large card with image left, content right (headline about OpenAI Campus program or similar)
- **Story grid** — 6 story cards (3-column grid) with images from Unsplash, each with colored category badge, headline, excerpt, source, time ago
- Categories to use: Product Release (green), Policy & Ethics (violet), Tool Spotlight (orange), Insights & Trends (sky), Case Study (magenta)

---

### Page 2: PODCAST (`page-podcast`)

**Structure:**
- Header: "LISTEN & LEARN" / "Innovating Higher Ed *Podcast*"
- Featured episode with large card (emoji art left, content right), embedded audio player
- Platform badges: Apple Podcasts, Spotify, YouTube, Podbean
- Episode list — 7 episodes with number, title, guest, date, duration, play button
- Episodes should reference real IHE topics: AI equity, OER translation, curriculum design, VR rehearsals, XR learning, assistive tools, STEM transformation

---

### Page 3: AI TOOLS DIRECTORY (`page-tools`)

**Structure:**
- Header: "CURATED COLLECTION" / "AI Tools *Directory*"
- Search bar (pill shape) + category dropdown
- Filter bar: All, Teaching, Research, Assessment, Student Support, Admin, Content
- **Staff Picks** section — 3 large tool cards: ChatGPT, Gradescope, NotebookLM
  Each with: icon, name, category, description, tags (Free/Paid, role)
- **Recently Added** section — 8 smaller tool cards in 4-column grid: Canva Magic Write, Elicit, Synthesia, Brisk Teaching, Khanmigo, Element451, Magic School AI, Otter.ai

---

### Page 4: PROMPT LIBRARY (`page-prompts`)

**Structure:**
- Header: "PROMPT NAVIGATOR" / "AI Prompt *Library*"
- Filter bar: All Prompts, Lesson Planning, Assessment, Research, Student Support, Administration, Creative
- **Prompt Techniques** — 3 cards explaining Role Prompting, Chain of Thought, Few-Shot Examples
- **Ready-to-Use Prompts** — 6 prompt cards in 2-column grid
  Each has: category badge, monospace prompt text in a code-like box, difficulty label, copy button
  Categories: Lesson Planning (cyan), Assessment (green), Research (violet), Student Support (orange), Creative (magenta), Policy (rose)
- Copy button should actually copy the prompt text to clipboard via `navigator.clipboard.writeText()`

---

### Page 5: TINKER LAB (`page-tinkerlab`)

Dr. Norma's experimentation blog.

**Structure:**
- Header: "DR. NORMA'S LAB" / "The Tinker *Lab*"
- 4 blog post cards in 2-column grid, each with:
  - Unsplash image
  - Category badge (Experiment/Quick Take/Reflection/Tool Test)
  - Title, excerpt
  - Some with mini audio player (for audio blog posts)
  - Date
- Posts: "The Wonka Lantern" (AI syllabus experiment), NotebookLM review, "When My Students Taught ME About AI", Brisk vs Magic School head-to-head

---

### Page 6: GETTING STARTED (`page-started`)

**Structure:**
- Header: "YOUR AI JOURNEY" / "Getting Started with *AI*"
- **10-Step Path** — Numbered step cards, each with circle number, title, description
  Steps: 1) Understand AI, 2) First conversation, 3) Prompt engineering, 4) Quick win, 5) Tools directory, 6) AI policy, 7) AI assignment, 8) Listen to podcast, 9) Join community, 10) Share/teach
- **CTA Banner** — Dr. Norma's upcoming book "Getting Started with AI in Higher Education"

---

### Page 7: CASE STUDIES (`page-cases`)

**Structure:**
- Header: "PROOF IT WORKS" / "AI Case *Studies*"
- Filter bar: All, Teaching, Student Support, Operations, Research
- 4 case study cards in 2-column grid
  Each with: institution name (cyan, uppercase), title, excerpt, 3 metric boxes (value + label)
  Cases: Loyola (LUie chatbot, 91% accuracy), Bolton College (80% video time reduction), Arizona State (15% retention boost), EUDE/IBM (3x faster response)
- CTA: "Have a Case Study to Share?" with submit button

---

### Page 8: COMMUNITY (`page-community`)

**Structure:**
- Header: "JOIN THE MOVEMENT" / "The IHE *Community*"
- Stats row: 200+ Members, 47 Institutions, 12 Countries, Weekly Events
- 6 community feature cards in 3-column grid: Discussion Forum, Innovation Roundtables, Innovator Spotlight, Resource Sharing, Office Hours, Be Our Guest
- Join CTA with email input and button
- Recent Discussions — 4 discussion thread items with reply count and time
- **Be Our Guest** application form: Name, Email, Institution, Role dropdown, Topic textarea, Submit button

---

### Page 9: ABOUT DR. JONES (`page-about`)

**Structure:**
- Header: "MEET THE FOUNDER" / "About *Dr. Norma Jones*"
- **Profile section** — circular photo frame (gradient border, emoji placeholder inside) + name, title "AI Integration Leader & Educator", bio text (2-3 paragraphs about her background spanning academia and industry, AI training expertise, faculty development work)
- **Mission section** — "Our Mission" with the IHE mission statement about empowering higher ed professionals
- **By the Numbers** — stat boxes: 47 Episodes, 200+ Tools Reviewed, 12 Countries, 500+ Educators Trained
- **Connect** — social links, contact form (Name, Email, Subject, Message, Send button)
- **The Book** — CTA for upcoming book

---

## JAVASCRIPT REQUIREMENTS

### Page Navigation
```javascript
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.remove('active');
    if (l.dataset.page === id) l.classList.add('active');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```

### ChatNav Intelligence
Map keywords to destinations. When user types or clicks a chip:
1. Match keywords (e.g., "news" → pulse, "tool" → tools, "prompt" → prompts, "podcast"/"listen" → podcast, "new"/"start"/"beginner" → started, etc.)
2. Highlight the matching destination card
3. Show contextual response with action buttons that navigate to the page

### Canvas Visualizations
Initialize after DOM load. Each destination card's canvas gets a unique animation:
- Use requestAnimationFrame loop
- Draw with the card's accent color at low opacity (0.1-0.3)
- Keep it subtle and atmospheric — these are decorative, not interactive

### Copy Prompt
```javascript
function copyPrompt(btn) {
  const text = btn.closest('.prompt-card').querySelector('.prompt-text').textContent;
  navigator.clipboard.writeText(text);
  btn.textContent = '✓ Copied!';
  setTimeout(() => btn.textContent = '📋 Copy', 2000);
}
```

### Filter Buttons (UI only)
Click toggles `.active` class on filter buttons. No actual filtering needed for the prototype — just the visual state change.

### Mobile Nav Toggle
Toggle `.open` class on nav-links container.

---

## TECHNICAL REQUIREMENTS

1. **Single file** — ALL CSS, HTML, and JS in one .html file
2. **Self-contained** — Only external dependency is Google Fonts CDN and Unsplash image URLs
3. **Responsive** — Works on desktop (1200px+), tablet (768px), and mobile (375px)
4. **Smooth** — Use CSS transitions, scroll-behavior: smooth, will-change where needed
5. **No frameworks** — Vanilla HTML/CSS/JS only
6. **File size target** — Aim for 2000-3000 lines. Don't be terse. Make it comprehensive and polished.
7. **Every page must have a footer** — Reuse the same footer structure on each page

---

## BUILD STRATEGY

Because this file is large, build it in sections:

1. First create the file with the `<head>`, all CSS (the full design system), and open the `<body>` tag
2. Add the global nav
3. Add each page one at a time (portal, pulse, podcast, tools, prompts, tinkerlab, started, cases, community, about)
4. Close with the `<script>` tag containing all JavaScript
5. Close `</body></html>`

Use `cat >> file.html` or heredoc appending to build incrementally. DO NOT try to write the entire file in one command — break it into logical chunks.

After building, open it in a browser and verify all 10 pages work and navigation functions correctly.

---

## OUTPUT

Save to: `~/Desktop/ihe-pulse/ihe-complete-prototype.html`

**GO. Build the entire thing. Do not stop for questions.**

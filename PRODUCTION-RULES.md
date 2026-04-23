# PRODUCTION RULES — Innovation Pulse

## This document is the single source of truth for all Innovation Pulse content production.

---

## 1. Voice & Tone

- **Persona:** Conversational colleague, not lecturer or news anchor
- **Invitational, not prescriptive:** Never "you should" or "you must"
- **No dramatic language:** No "seismic shift", "groundbreaking", "game-changing", "explosive"
- **No host name** in audio until locked down
- **Warm, direct, curious:** Like a well-informed peer sharing what they found over coffee
- **Confidence without arrogance:** State findings clearly, acknowledge uncertainty honestly

---

## 2. Audio Script Formatting

### Pronunciation
- **A.I.** — Always write with periods (prevents ElevenLabs dropping the "I")
- **URL** — Always phonetic: "innovating higher ed dot com"
- **HBCU** — Spell out as letters: H.B.C.U.
- **OECD** — Spell out as letters: O.E.C.D.
- **Numbers** — Write out: "96 percent" not "96%"

### Forbidden in Audio Scripts
- Em dashes (—) — NEVER use, causes unnatural pauses
- "Deep Dive" — NEVER use anywhere on the platform
- "Short Story 1/2/3" — listeners never hear numbering
- "Circle back" — max once per week
- Starting with "Later" or "Coming up" — dead words
- "We'll tell you" or "You'll be shocked" — empty promises
- "AI Tools" for the page name — use "A.I. App Directory" to avoid confusion with Educator Tools

### Pauses (max 1 second)
- **ElevenLabs Studio:** Use "Insert break" button (0.1s-3.0s). Do NOT type tags into text.
- **ElevenLabs API (non-V3):** `<break time="0.5s" />` or `<break time="1.0s" />` (self-closing SSML)
- **ElevenLabs API (V3):** `[short pause]`, `[pause]`, `[long pause]`
- **ElevenLabs TTS Web UI:** Dashes on own lines: `-` (short) or `-- --` (longer)
- **Never use:** `[0.5s]`, `[1s]`, `...` (adds hesitation), SSML tags in web UI (gets spoken aloud)

---

## 3. Daily Structure

### Episode Flow (5-7+ minutes total)
1. **Opening** (5s): "Welcome to The Innovation Pulse from innovating higher ed dot com. It's [day], [date]."
2. **Tease** (10-15s): Hook the big story — specific, curiosity-provoking, never give away the answer
3. **Transition** (3-5s): Natural pivot to short stories (varied daily)
4. **Short Stories** (60-90s total): 3 stories, announced by category name naturally
5. **Big Story** (2-3+ minutes): Full context, analysis, practical implications — this is the value
6. **Closing** (10-15s): Theme summary + URL + sign-off

### Broadcast Closing Line (PERMANENT — April 2026)
Every broadcast MUST end with this exact phrase:
> "That's today's Innovation Pulse. Thank you for joining us. Full coverage and source links at innovating higher ed dot com."

The "Thank you for joining us." line is mandatory and must not be removed.

### Tease Rules
- Tease to the HOOK, never the answer
- Specific enough to get wheels turning, vague enough to keep guessing
- Two sentences: Context + Promise (write promise first)
- Vary structure across days: surprising number, contradiction, question, unexpected quote
- Never start with "Later" or "Coming up"
- Never use "circle back" more than once per week

### Transition Phrases (vary daily, never formulaic)
- "But first, here's what else is moving today."
- "First though, a few things worth knowing."
- "Before we get there, a few stories that set the stage."
- "Some context first."
- "A few final stories before we pull the week together."

### Category Announcements (vary phrasing)
- "An Insights and Trends piece worth knowing..."
- "Over in Beyond Ed..."
- "A Case Study from [state/institution]..."
- "In Practical Tips today..."
- "Filing this under Ethical A.I...."
- "And a Latest A.I. Products note..."

---

## 4. Editorial Lenses (Daily Rotation)

| Day | Lens | Focus |
|-----|------|-------|
| Monday | The Hard Question | Challenges assumptions |
| Tuesday | The Student Experience | Student-centered stories |
| Wednesday | Practitioner's Playbook | Practical, tactical |
| Thursday | Connecting the Dots | Patterns across the week |
| Friday | Innovator's Edge | Forward-looking + week synthesis |

---

## 5. Categories

| Category | Purpose | Example |
|----------|---------|---------|
| Insights & Trends | Data, research, surveys, emerging patterns | OECD report, SREB survey |
| Case Study | Institution doing something specific and replicable | Forsyth Tech BlazeBot |
| Practical Tips | Immediately actionable for a faculty member | Murray State AI homework |
| Ethical A.I. | Policy, governance, rights, responsible use | Seattle U ethics initiative |
| Latest A.I. Products | Tools, launches, updates relevant to educators | OpenAI ads in ChatGPT |
| Beyond Ed | Industry/research news with clear ed implications | HBR workload creep study |
| Week in Review | Friday only — week's through-line narrative | Pattern synthesis |

---

## 6. Source Diversity (MANDATORY)

Every week must include sources from:
- **Community Colleges:** At least 3-4 stories from CC institutions
- **HBCUs:** At least 2 stories featuring or sourcing HBCUs
- **Regional/Teaching Universities:** At least 2-3
- **R1 Research Universities:** Maximum 1-2 (only when the story warrants it)
- **International/Policy:** At least 1
- **Industry (Beyond Ed):** At least 1-2

### Principle
Community colleges, HBCUs, and regional universities must SIGNIFICANTLY outnumber R1 institutions. These are the institutions closest to the students who most need A.I. fluency. They are where innovation is actually happening.

---

## 7. Story Memory (PERMANENT)

- **Never retell a story.** Only callback when new information advances it.
- **Track all covered stories** in a permanent log.
- **Callbacks create insider knowledge** for regular listeners.
- **Two-pass quality control:**
  - Pass 1: Accuracy, grammar, factual correctness
  - Pass 2: Voice, humanization, tone, conversational quality

---

## 8. Lead Story Selection

### Murray Davis "That's Interesting" Framework
The lead story should challenge what the audience assumes to be true.

### Selection Criteria
1. Would a faculty member mention this to a colleague?
2. Does it challenge a common assumption in higher ed?
3. Does it have implications beyond the immediate news?
4. Can it sustain 2-3 minutes of analysis without feeling padded?

### Never Lead With
- Product announcements (lead with implications instead)
- Internal institutional news without broader relevance
- Stories that only matter to one institution type

---

## 9. Written Story Cards (Website)

- **Image required** on every story card
- **Category badge** (colored, mono font)
- **Institution badge** (amber, if applicable)
- **Title** (Instrument Serif)
- **Summary** (DM Sans) — must deliver standalone value even without expanding
- **"Read more" dropdown** — deeper context, implications, practical takeaways
- **Source link** with external icon
- **Date**

---

## 10. Page Lifecycle

1. **Monday morning:** Monday's stories go live. Audio player prominent.
2. **Tuesday morning:** Tuesday goes up. Monday moves to "Earlier This Week."
3. **Wednesday-Thursday:** Same pattern. Earlier days collapsed below.
4. **Friday:** Friday's stories + audio. Mon-Thu in "Earlier This Week."
5. **Following Monday:** Entire previous week moves to Archive. New Monday goes fresh.

### Archive Page (/innovation-pulse/archive)
- Browse by week (week cards with big story as preview)
- Browse by category (filter across all weeks)
- Toggle between views
- Audio persists in archive
- Becomes searchable library over time

---

## 11. Design System

- **Fonts:** Instrument Serif (headings) + DM Sans (body) + JetBrains Mono (code/badges)
- **Colors:** Electric Dusk — cyan (#00d4ff), magenta (#c850c0) on dark backgrounds
- **Story cards must include images** — never text-only
- **Academic websites look 15-20 years old** — we lead by example with cutting-edge design

---

## 12. Technical

- **Stack:** Next.js 14, Vercel deployment
- **Repo:** github.com/CaltexBevo/ihe-pulse
- **Local dev:** /Volumes/Bevo 2TB/ihe-pulse/
- **Tools server:** /Volumes/Bevo 2TB/ihe-tools-server/
- **Audio pipeline:** Google Cloud Run → OpenAI Assistant → Serper → Firecrawl → ElevenLabs
- **Audio files:** /public/audio/innovation-pulse/innovation-pulse-YYYY-MM-DD.mp3
- **Story data:** /lib/data/innovation-pulse/YYYY-MM-DD.json
- **Types:** /lib/data/innovation-pulse-types.ts
- **Update CHANGELOG.md, ROADMAP.md, and PRODUCTION-RULES.md** at end of each session when requested

---

## 13. V4 Category Implementation (Feb 22, 2026)

The V4 category system is now live in `InnovationPulseClient.tsx`:

```typescript
type V4Category =
  | "Insights & Trends"
  | "Case Study"
  | "Practical Tips"
  | "Ethical AI"
  | "Latest AI Products"
  | "Beyond Ed"
  | "Week in Review";
```

Automatic mapping from old taxonomy categories to V4:
- Infrastructure & Operations → Insights & Trends
- Teaching & Learning → Practical Tips
- Policy & Ethics → Ethical AI
- Tools & Products → Latest AI Products
- Research & Innovation → Insights & Trends
- Student Experience → Case Study
- Leadership & Strategy → Beyond Ed

Story JSON files can use either old or new category names; the client maps them automatically.

---

## 14. Branding Rules (Build 13, Feb 22, 2026)

### NEVER use:
- "Dr. Norma Jones" — use "The Innovation Pulse" or "Innovating Higher Ed"
- "Dr. Norma's Take" — use "OUR TAKE"
- "IHE" as abbreviation — conflicts with Inside Higher Ed; always write "Innovating Higher Ed" in full
- "Deep Dive" — use "Lead Story" or "Featured Story"
- "AI" without periods in audio scripts — always write "A.I."

### Editorial signatures:
- Article/story byline: "The Innovation Pulse · Innovating Higher Ed"
- Audio credit: "The Innovation Pulse · Innovating Higher Ed"
- Voice disclosure: "A.I. voice technology with editorial oversight by the Innovating Higher Ed team"

### URL Structure (Build 13):
- Story pages: `/innovation-pulse/story/[slug]`
- Category archives: `/innovation-pulse/category/[category-slug]`
- Audio archive: `/innovation-pulse/archive`
- Category slugs: insights-and-trends, case-study, practical-tips, ethical-ai, latest-ai-products, beyond-ed, week-in-review

---

## 15. Deployment Rules (Added Feb 26, 2026)

### Local-First Verification
- NEVER push to origin/main without reviewing at localhost:3000 first
- Workflow: make changes → npm run dev → verify visually → stakeholder approves → git push
- Vercel deploys automatically on push to main — treat every push as a production deploy

### Data Integrity Rules
- Every story MUST have a non-empty `summary` field (minimum: "Read the full story for details.")
- Pipeline must not overwrite existing date files without explicit --force flag
- After any data routing change, verify that ALL data sources are still loading (legacy + pipeline)
- Run `grep -r '"summary": ""' data/` after any pipeline run to catch empty summaries

### Category Rules (V4 Categories)
- 7 categories: Insights & Trends, Case Study, Practical Tips, Ethical AI, Latest AI Products, Beyond Ed, Week in Review
- Use V4 names directly in pipeline output — no uppercase, no old format names
- Single mapping layer only — UNIFIED_TO_V4_MAP in innovation-pulse.ts is the source of truth
- Every story must have a category from the V4 list

### Version Tracking
- Semantic versioning in CHANGELOG.md (MAJOR.MINOR.PATCH)
- Every push to main gets a changelog entry with date and description
- Breaking changes increment MAJOR, new features MINOR, fixes PATCH

---

## 16. Pipeline Data Quality Expectations (Added Feb 26, 2026)

If incoming pipeline data fails these checks, the normalizeEpisode() function should repair or flag:

### Hook Validation
- hook < 20 chars → use episodeTitle as fallback
- hook ends with single letter + period (truncated at "A.I.") → extend from broadcastScript

### Category Validation
- All stories same category → log warning (display issue, not blocking)
- Category not in V4 list → map using UNIFIED_TO_V4_MAP or default to "Insights & Trends"

### Summary Validation
- Empty summaries → use "Read the full story for details."
- Summary truncated at "A." → flag for review

### Title Validation
- Empty titles → skip story in display OR extract from URL slug
- Whitespace in titles (newlines, multiple spaces) → sanitize on load
- Truncated titles (< 20 chars) → log warning

### Segment Sync
- segments.deepDive and segments.quickHits[] must have summaries/categories matching stories[]
- If mismatched, pull from stories[] by sourceUrl

### A.I. Handling
- "A.I." abbreviation must NOT be truncated in any text field
- Check for fields ending in "A." or "A.I" (missing final period)

---

## 17. FRONTEND PALETTE RULE (April 17, 2026)

No CMA session may commit CSS or component code that introduces:
- Green (#4ade80 or similar)
- Teal (#2dd4bf or similar)
- Coral/pink (#fb7185 or similar)
- Orange (#fb923c or similar)
- Blue (#3b82f6 or similar)

The only accent colors allowed are: cyan (#00d4ff dark / #0e7490 light), magenta (#b040a8 dark / #a21caf light), purple (#a78bfa dark / #6d28d9 light), amber (#f59e0b dark / #b45309 light), and the brand gradient.

Any violation caught in `/gstack review` blocks the commit.

See `docs/DESIGN-TOKENS.md` for the full palette specification and WCAG contrast ratios.

### Rule 17.3 — No Inline Data-Driven Colors in Card Components

No component may render `style={{ background: someData.color }}` where `someData.color` comes from a fetched data payload. All accent colors must resolve through `paletteFor()` or `pillColorsFor()` helpers, which return palette-locked tokens only.

GStack review should block commits that introduce `style.*background.*\.color` patterns in component files.

---

## 18. Story Picking Rules (PERMANENT — April 2026)

Apply BEFORE selecting stories for any episode:

### The 9 Rules

1. **Story value filter** — reject personnel moves, event announcements, press releases, traffic drivers
2. **"Would a CC faculty member share this?"** — if no, reject
3. **"That's Interesting" framework** — look for TENSION, REVERSAL, SCALE, CHANGE
4. **Categories earned, not assigned** — if it doesn't deliver on the category promise, it's Insights & Trends
5. **Lead = broad appeal** — every faculty member sees themselves. Something HAPPENED, not proposed
6. **Never two stories from the same underlying data source** in one episode
7. **Beyond Ed = major AI industry stories everyone is discussing** (e.g., Mythos/Glasswing)
8. **Single-institution grants are NOT broadly interesting** unless the grant creates something open/shared
9. **"Considering" or "reviewing proposals" stories are NOT news** — nothing has happened yet

### Automatic Rejection

These story types are NEVER included:

- **Personnel moves:** Hiring announcements, promotions, retirements (unless systemic pattern)
- **Event announcements:** Conference dates, webinar promos, call for papers
- **Press releases without news:** Product launches without implications for educators
- **Self-promotional content:** Vendor marketing disguised as news
- **Repetitive coverage:** Story we've already told (callback only with new information)
- **Single-institution internal news:** Unless it has clear broader relevance
- **Unverified claims:** No sources, no data, no attribution

### Story Value Filter

For each candidate story, ask:
> "If a busy faculty member only has 5 minutes today, would they want to spend 60 seconds on this?"

If the answer is "maybe" or "probably not" — cut it.

### Anti-Fabrication Verification

Before any story is included, verify:
- All statistics have a named source
- All quotes are attributed
- Institution names are spelled correctly
- Claims can be traced back to the original source
- No "studies show" without naming the study

If a story cannot be verified, it does not run.

---

## 19. Pipeline Workflow (Added April 22, 2026)

### Streamlined 5-Step Production Process

1. **Source** — Gather candidate stories from RSS feeds, newsletters, alerts
2. **Filter** — Apply Section 18 story picking rules (9 criteria + rejection list)
3. **Draft** — Generate broadcast script following Section 3 daily structure
4. **Review** — Two-pass quality control (Section 7: accuracy, then voice)
5. **Publish** — Export audio + JSON, verify data integrity (Section 16)

### Approval Document Rule

Every episode requires a versioned approval document before publish:
- Filename: `approval-YYYY-MM-DD-vN.md` where N is version number
- Must contain: story list, lead story justification, source diversity check
- Version increments on any content change after initial review
- Final approved version noted in episode JSON as `approvalDoc` field

### Category Integrity Check

Before publishing, verify:
- Every story has exactly one category from the V4 list (Section 13)
- No duplicate categories across all stories (aim for variety)
- Lead story category matches the story's actual content
- Category names match V4 exactly (case-sensitive)

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
- **Local dev:** /Volumes/Bevo_2TB/ihe-pulse/
- **Tools server:** /Volumes/Bevo_2TB/ihe-tools-server/
- **Audio pipeline:** Google Cloud Run → OpenAI Assistant → Serper → Firecrawl → ElevenLabs
- **Update CHANGELOG.md, ROADMAP.md, and PRODUCTION-RULES.md** at end of each session when requested

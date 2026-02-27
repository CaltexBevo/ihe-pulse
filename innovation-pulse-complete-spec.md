# The Innovation Pulse — Complete System Specification

**Tagline:** *Daily AI & Innovation in Higher Education*  
**Parent Brand:** Innovating Higher Ed (innovatinghighered.com)  
**Host Voice:** Dr. Norma Jones (ElevenLabs voice clone, Voice ID: `6kjO9NSV6LEGjLPRtTvo`)  
**Target Runtime:** 3–5 minutes per episode  
**Schedule:** Daily, 8:00 AM PT (via Google Cloud Scheduler)

---

## 1. BRANDING & NAMING

### Name
**The Innovation Pulse**

### Tagline
**Daily AI & Innovation in Higher Education**

### Usage Across Touchpoints

| Context | How It Appears |
|---------|---------------|
| Website nav | **Innovation Pulse** |
| Website page header | **The Innovation Pulse** — Daily AI & Innovation in Higher Education |
| Audio open | "Welcome to The Innovation Pulse from Innovating Higher Ed..." |
| Audio close | "That's today's Innovation Pulse..." |
| Casual reference | "the Pulse" (e.g., "Did you catch today's Pulse?") |
| Callback reference | "Something we picked up on the Pulse last Tuesday..." |
| Newsletter subject | "The Innovation Pulse — [date]" |
| Social media | "#InnovationPulse" |

### Voice Disclosure
- In audio: Use "I'm Dr. Norma Jones" naturally — she approves the editorial direction and stands behind the content.
- On website (show notes / about section): Include standing disclaimer: *"The Innovation Pulse is produced using AI voice technology based on Dr. Norma Jones' voice, with editorial oversight by Dr. Jones. Learn more about how we use AI responsibly at Innovating Higher Ed."*
- This disclosure appears once on the Innovation Pulse landing page, not repeated per episode.

---

## 2. STANDARD OPEN & CLOSE

### Opening (Consistent Structure, Rotating Hook)

The opening has two parts: the **standard intro** (always the same) and the **daily hook** (always different).

**Standard Intro:**
> "Welcome to The Innovation Pulse from Innovating Higher Ed — it's [day of week], [full date]. I'm Dr. Norma Jones."

**Daily Hook** (follows immediately — one sentence that teases the most interesting story or theme):
> "[Hook sentence that creates curiosity about today's content]"

**Hook Examples:**
- "Today, one university just cut their AI costs by 80% — and the model they used is something any campus could replicate."
- "There's a growing gap between what faculty want from AI training and what institutions are actually providing. Let's talk about why."
- "A tool launched this week that I think changes the game for how we give student feedback. I'll tell you which one and why."
- "Remember that Boise State story from Tuesday? It just got a sequel."

**Rules for hooks:**
- Never generic ("Today we have some interesting stories")
- Always specific — name a number, a school, a tension, or a question
- If there's a callback story, lead with that — it rewards returning listeners
- Never sounds like an advertisement for any product or institution

### Closing (Consistent Every Day)

> "That's today's Innovation Pulse. I'm Dr. Norma Jones — find the full stories and links at innovatinghighered.com. Thanks for joining us as we explore new frontiers in educational innovation. See you [tomorrow / Monday]."

**Friday variation:**
> "That's today's Innovation Pulse, and that wraps our week. I'm Dr. Norma Jones — find every story from this week and more at innovatinghighered.com. Thanks for joining us — enjoy your weekend, and I'll see you Monday."

---

## 3. EPISODE STRUCTURE

Each episode follows this structure (targeting 3–5 minutes total):

### A. Opening (15–20 seconds)
- Standard intro + daily hook

### B. Deep Dive (60–90 seconds)
- ONE story that gets genuine analysis
- Not a summary — an exploration of *what's actually interesting* about it
- Ask questions the original article didn't ask
- Connect it to the listener's reality ("If you're teaching a 200-person lecture, here's why this matters to you specifically")
- If a callback story exists, this is where it goes (with reference to when we first covered it)

### C. Quick Hits (60–90 seconds, 2–3 stories)
- Each gets 20–30 seconds
- Format: What happened → Why it's interesting → One sentence on what to watch for
- These are fast, punchy, and move quickly
- NO advertorial language — never restate a product's marketing claims

### D. The Callback Check / Stories We're Watching (20–30 seconds, optional)
- Brief update on 1–2 developing threads from previous episodes
- Only appears when there's genuinely new information or a meaningful connection
- On Fridays, this becomes "Stories We're Watching Into Next Week" (slightly expanded)

### E. Closing Thought (15–20 seconds)
- One sentence that ties the day's stories together thematically
- NOT a generic "AI is transforming education" statement
- Should feel like Dr. Norma's genuine editorial perspective
- End with standard close

---

## 4. DAILY EDITORIAL LENS ROTATION

Each day of the week applies a different editorial perspective to the same news. This prevents the "broken record" problem where every story gets the same "balance innovation with ethics" treatment.

| Day | Lens | Description | How It Sounds |
|-----|------|-------------|---------------|
| **Monday** | **The Practitioner's Playbook** | What can you DO with this? Practical, tactical, classroom-ready. | "Here's what I'd try if I were teaching this semester..." |
| **Tuesday** | **The Hard Question** | Skeptical, probing, challenges assumptions and hype. | "The press release says X, but here's what they're not telling you..." |
| **Wednesday** | **The Student Experience** | Everything filtered through how it affects actual students. | "Put yourself in your students' shoes for a minute..." |
| **Thursday** | **Connecting the Dots** | Pattern recognition across stories and across the week. | "Three different stories this week point to the same shift..." |
| **Friday** | **The Innovator's Edge** | What's genuinely new, experimental, and worth watching. Week recap. | "This is the one thing from this week I'd put on your radar..." |

**Implementation:** The day of the week determines which lens the broadcast rewriter applies. The OpenAI prompt includes all five lenses and selects the appropriate one based on the current day.

**Critical rule:** The lens shapes the *analysis*, not the story selection. All five lenses can cover the same story differently. A Monday Practitioner's Playbook episode about an AI grading tool focuses on "here's how to set it up." A Tuesday Hard Question episode about the same tool asks "but what are students actually learning when we automate feedback?"

---

## 5. STORY CALLBACK SYSTEM

### 5a. Story Tracker Schema

The story tracker is a JSON file that persists across days. It tracks **story threads** (not individual articles).

**File location:** `story-tracker.json` (stored in GCS bucket alongside audio files, or committed to the ihe-pulse repo)

```json
{
  "threads": [
    {
      "threadId": "boise-state-ai-platform",
      "label": "Boise State's Campus-Wide AI Platform",
      "firstCovered": "2026-02-03",
      "lastCovered": "2026-02-03",
      "coverageCount": 1,
      "status": "watching",
      "keyPoints": [
        "Built on AWS",
        "Claims 80% per-user cost reduction",
        "Campus-wide access model"
      ],
      "editorialAngles": [
        "Cost reduction potential for other institutions"
      ],
      "relatedInstitutions": ["Boise State University"],
      "articles": [
        {
          "url": "https://aws.amazon.com/...",
          "date": "2026-02-03",
          "source": "AWS Blog"
        }
      ]
    }
  ],
  "themeLog": [
    {
      "date": "2026-02-03",
      "themes": ["cost reduction", "cloud infrastructure", "campus-wide AI access"],
      "lens": "Practitioner's Playbook"
    }
  ],
  "archivedThreads": []
}
```

### 5b. Thread Status Values

| Status | Meaning | Behavior |
|--------|---------|----------|
| `watching` | Active thread, looking for developments | Check incoming articles against this thread |
| `developing` | New information found, callback triggered | Feature in today's episode |
| `dormant` | No new info for 14+ days | Move to archive after 30 days |
| `resolved` | Story reached a conclusion | Archive with summary |

### 5c. Callback Detection Logic

When the Assistant processes incoming articles each morning:

1. **Load story tracker** — read all active threads (status: `watching` or `developing`)
2. **For each incoming article**, check against active threads:
   - Does it mention the same institution?
   - Does it cover the same topic/theme?
   - Does it contain NEW information not in `keyPoints`?
3. **If match + new info found** → Flag as callback opportunity, set thread status to `developing`
4. **If match but NO new info** → Skip the article (already covered, nothing new)
5. **If no match** → Treat as new story, potentially create new thread
6. **Callback stories get priority** for the Deep Dive segment

### 5d. Callback Language Patterns

The broadcast rewriter selects from a rotation bank. No phrase is used more than once per week.

**Callback intros (when referencing a previous story):**
- "Remember [thread label] from [day]? Here's what just happened..."
- "Quick update on something we've been tracking — [thread label]..."
- "We first picked this up on [day]'s Pulse — [thread label] just got more interesting."
- "A story we flagged [last week / on day] is developing — [thread label]..."
- "Back to [institution/topic] — and this time, there's a twist."
- "If you caught [day]'s Pulse, you'll want to hear this follow-up."
- "New chapter in a story we've been watching..."

**Friday "Stories We're Watching" intros:**
- "Before we wrap the week, here are a couple of threads we're keeping an eye on..."
- "A few stories from this week that aren't done yet..."
- "Heading into next week, here's what's still developing..."

### 5e. Thread Lifecycle

```
New article detected
  → No matching thread → Create new thread (status: watching)
  → Matches thread + has new info → Callback (status: developing → back to watching after episode)
  → Matches thread + no new info → Skip article
  
After 14 days with no new coverage → status: dormant
After 30 days dormant → Move to archivedThreads array
If dormant thread gets a new article → Revive to watching (great callback moment!)
```

---

## 6. THEME DEDUPLICATION

### Problem
The same *editorial angle* gets repeated across days even when stories are different. ("Faculty are anxious about AI" appears as the takeaway 4 out of 5 days.)

### Solution
The `themeLog` array in the story tracker records the themes and angles used each day. Before writing, the Assistant checks:

1. Load last 7 days of `themeLog`
2. Count frequency of each theme
3. If a theme has appeared 3+ times in the last 7 days, the Assistant MUST find a different angle
4. If no different angle exists for that story, deprioritize it (use as a Quick Hit, not Deep Dive)

### Theme Categories to Track
- Faculty resistance/anxiety about AI
- Ethical AI / bias / privacy concerns
- Student dependency on AI
- Institutional AI policy development
- AI cost savings / efficiency
- Personalized learning through AI
- Workforce readiness / career preparation
- AI tool launches / product news
- International AI education initiatives
- Community college / accessibility focus

**Rule:** No theme category appears as the Deep Dive topic more than twice in any 7-day window.

---

## 7. ANTI-ADVERTORIAL RULES

These rules are embedded directly in the broadcast rewriter prompt:

1. **Never restate a product's marketing language.** If the press release says "revolutionary AI-powered platform that transforms learning," the broadcast says "a new tool that claims to help with [specific thing]."

2. **Never list features as benefits.** "It offers 24/7 accessibility, tailored responses, and enhanced engagement" is marketing copy. Instead: "The interesting question isn't what it does — it's whether students actually use it at 2 AM, and what that tells us about how they study."

3. **Always add editorial distance.** Use phrases like "they claim," "the pitch is," "according to [source]," "whether that holds up remains to be seen."

4. **Never end a story segment on a positive product claim.** End on a question, a tension, or an implication for the listener.

5. **Source attribution: pick ONE.** Don't say "Gonzaga University, as shared on gonzaga.edu." Say either "Gonzaga University announced..." or "According to Gonzaga's website..." Never both.

6. **The "So What?" test:** Every story must answer "why should a busy educator care about this specifically?" If the answer is just "AI is improving education," the story isn't ready for the Pulse.

---

## 8. TRANSITION PHRASE ROTATION

The broadcast rewriter selects from this bank. **No phrase appears more than once per episode. No phrase appears more than twice per week.**

### Topic Transitions (moving to a new story)
- "Now — [story]"
- "Shifting to [topic] —"
- "Here's something worth knowing about."
- "Next up —"
- "Meanwhile —"
- "In other news —"
- "Let's talk about [topic]."
- "Something else caught my eye this morning."
- "Over at [institution] —"
- "This next one is interesting."
- "Turning to [topic] —"
- "Alright, different story —"

### Connection Transitions (related to previous story)
- "And this connects to something bigger."
- "That same theme shows up here —"
- "On a similar note —"
- "This pairs with that nicely —"
- "Which brings us to —"
- "Building on that —"
- "Related —"
- "There's a throughline here."

### Deep Dive Transitions
- "Let's slow down on this one."
- "This is the one I want to dig into today."
- "Here's where it gets interesting."
- "Okay, this deserves a closer look."
- "This is today's main story, and here's why."
- "I want to spend some time on this one."

### Closing Thought Transitions
- "Stepping back from all of this —"
- "What ties these stories together?"
- "Here's what I'm taking away from today."
- "The thread running through today's Pulse —"
- "If there's one thing to carry with you today —"
- "Big picture —"

---

## 9. UPDATED BROADCAST REWRITER PROMPT

This replaces the current prompt in `broadcastRewriter.js`. The OpenAI call uses this as the system message.

```
You are the broadcast script writer for "The Innovation Pulse," a daily audio briefing on AI and innovation in higher education. The host is Dr. Norma Jones — an experienced educator, warm but direct, intellectually curious, and genuinely invested in helping fellow educators navigate change.

TODAY'S DATE: {{date}}
TODAY'S DAY: {{dayOfWeek}}
TODAY'S EDITORIAL LENS: {{lens}}
LENS DESCRIPTION: {{lensDescription}}

STORY TRACKER (last 14 days): {{storyTrackerJSON}}
THEME LOG (last 7 days): {{themeLogJSON}}

---

EPISODE FORMAT (target: 3–5 minutes spoken):

1. OPENING (15–20 seconds)
   Standard intro: "Welcome to The Innovation Pulse from Innovating Higher Ed — it's {{dayOfWeek}}, {{fullDate}}. I'm Dr. Norma Jones."
   Then a HOOK — one specific, curiosity-creating sentence about today's most interesting story. Never generic. Always names a number, institution, tension, or question.

2. DEEP DIVE (60–90 seconds)
   One story explored in depth. Apply today's editorial lens.
   - If a callback story exists (thread status: developing), USE IT as the deep dive. Reference when we first covered it.
   - Ask questions the original article didn't.
   - Connect to the listener's actual work.
   - Never restate marketing language. Add editorial distance.
   - End with a question, tension, or actionable thought — never a product endorsement.

3. QUICK HITS (60–90 seconds, 2–3 stories)
   Each story: 20–30 seconds.
   Format: What happened → What's actually interesting about it → One line on what to watch.
   Be punchy. Move fast. Cut anything that sounds like a press release.

4. CALLBACK CHECK (20–30 seconds, ONLY if applicable)
   Update on 1–2 active story threads with new developments.
   On Fridays, expand this to "Stories We're Watching" (2–3 threads heading into next week).
   Skip entirely if no threads have meaningful updates.

5. CLOSING THOUGHT (15–20 seconds)
   One genuine editorial observation connecting the day's stories.
   NEVER use: "AI is transforming education" / "balance innovation with ethics" / "embrace technology responsibly" — these are banned phrases.
   Instead: Be specific. Name a tension. Pose a question. Offer a genuine insight.
   End with: "That's today's Innovation Pulse. I'm Dr. Norma Jones — find the full stories and links at innovatinghighered.com. Thanks for joining us as we explore new frontiers in educational innovation. See you [tomorrow/Monday]."

---

EDITORIAL LENS INSTRUCTIONS:

MONDAY — THE PRACTITIONER'S PLAYBOOK
Focus: What can listeners DO with this information? Practical, tactical, classroom-ready.
Tone: Helpful, direct, like a colleague sharing a tip over coffee.
Deep dive angle: "Here's how you could use this" or "Here's what I'd try."
Avoid: Abstract policy discussion. Keep it concrete.

TUESDAY — THE HARD QUESTION
Focus: Challenge assumptions. Question hype. Push back on easy narratives.
Tone: Respectful skepticism. Intellectually honest. Not cynical, but rigorous.
Deep dive angle: "Here's what they're not saying" or "The real question is..."
Avoid: Accepting press releases at face value. Always add critical distance.

WEDNESDAY — THE STUDENT EXPERIENCE
Focus: Everything through the student lens. How does this affect learners?
Tone: Empathetic, grounded in classroom reality.
Deep dive angle: "What does this actually look like for a student in a 200-person lecture?"
Avoid: Admin-speak. Always center the student.

THURSDAY — CONNECTING THE DOTS
Focus: Pattern recognition. Link stories across the week and to broader trends.
Tone: Analytical, insightful, "zoom out" perspective.
Deep dive angle: "Three stories this week point to the same shift" or "Here's the pattern I'm seeing."
Avoid: Treating each story in isolation. Find the connections.

FRIDAY — THE INNOVATOR'S EDGE
Focus: What's genuinely new and experimental. Week recap. What to watch.
Tone: Forward-looking, energetic, slightly aspirational.
Deep dive angle: "This is the one thing from this week worth putting on your radar."
Include: "Stories We're Watching" segment before closing.
Avoid: Rehashing the week — synthesize it.

---

ANTI-ADVERTORIAL RULES (MANDATORY):
- Never restate a product's marketing claims as fact
- Never list features as benefits
- Always add editorial distance ("they claim," "the pitch is," "according to")
- Never end a segment on a positive product claim
- Source attribution: pick ONE method per story, never double-attribute
- Every story must pass the "So What?" test — why should a busy educator care?

THEME DEDUPLICATION RULES (MANDATORY):
- Check the theme log. If a theme appeared 3+ times in the last 7 days, find a DIFFERENT angle or deprioritize the story.
- No theme category appears as the Deep Dive more than twice in any 7-day window.
- Common overused themes to watch for: faculty anxiety, ethical AI concerns, student AI dependency, institutional policy struggles, AI efficiency gains, personalized learning benefits.

TRANSITION RULES (MANDATORY):
- Never use the same transition phrase twice in one episode.
- Never use "Now, shifting gears" / "On a related note" / "Here's another development worth watching" / "And this one's for the skeptics" — these are BANNED.
- Select from the provided transition bank. Vary selections across the week.

CALLBACK RULES (MANDATORY):
- If a story thread in the tracker has status "developing" (new info found), feature it.
- Reference when we first covered it and what's new.
- If a dormant thread (14+ days) suddenly gets new info, that's a strong callback — lead with it.
- Never re-cover a story without new information. If the article matches a thread but adds nothing new, SKIP IT.

TONE RULES:
- Dr. Norma Jones is warm, direct, intellectually curious, and experienced.
- She sounds like a respected colleague, not a news anchor or a professor lecturing.
- She has opinions but holds them lightly — she's thinking out loud with the listener.
- She occasionally shows personality: dry humor, genuine surprise, real concern.
- She never sounds breathless or hyperbolic. Measured energy, not manufactured excitement.
- She speaks TO educators, not AT them or ABOUT them.
```

---

## 10. UPDATED ASSISTANT TOOLS

The OpenAI Assistant needs these tool modifications:

### Modified Tools

**`search_news`** — No changes needed.

**`scrape_url`** — No changes needed.

**`read_dedup_log`** — EXPAND to also load `story-tracker.json`. Returns both the URL dedup log AND the story tracker with active threads and theme log.

**`write_dedup_log`** — EXPAND to also update `story-tracker.json`. After each episode:
  - Add any new threads created
  - Update existing threads with new articles and key points
  - Update coverage dates and counts
  - Append today's themes to the theme log
  - Check for threads that should move to dormant (14+ days, no new coverage)
  - Archive threads dormant for 30+ days

### Replaced Tools

**`create_wp_draft`** → **`publish_to_github`**
  - Commits a JSON file to the ihe-pulse GitHub repo at `src/data/innovation-pulse/YYYY-MM-DD.json`
  - Uses GitHub API (personal access token) to create/update file
  - Triggers automatic Vercel rebuild on push to main

**`generate_audio`** — Keep as-is (ElevenLabs + GCS upload). Just ensure the audio URL is included in the JSON payload.

**WordPress audio embed tool** — REMOVE. No longer needed. The Next.js site handles audio player rendering.

### New Tool

**`read_story_tracker`** — Dedicated tool to load just the story tracker for the callback detection step. (Could be combined with `read_dedup_log` but separating keeps it cleaner.)

**`update_story_tracker`** — Dedicated tool to write updates to the story tracker after episode generation.

---

## 11. JSON OUTPUT FORMAT

Each daily episode produces a JSON file committed to the ihe-pulse repo.

**File path:** `src/data/innovation-pulse/YYYY-MM-DD.json`

```json
{
  "date": "2026-02-06",
  "dayOfWeek": "Friday",
  "editorialLens": "The Innovator's Edge",
  "editorialHook": "One university just proved that campus-wide AI doesn't have to cost a fortune — and three others are already copying the playbook.",
  "audioUrl": "https://storage.googleapis.com/ihe-daily-news-audio/daily-news/ihe-daily-news-2026-02-06.mp3",
  "audioDuration": "4:12",
  "deepDive": {
    "title": "Boise State's AI Platform Gets Its First Copycats",
    "summary": "When we first covered Boise State's AWS-based AI platform on Monday, the 80% cost reduction number stood out. Now the University of Oregon and Colorado State have both announced similar initiatives — and the model is spreading faster than anyone expected.",
    "source": "EdTech Magazine",
    "sourceUrl": "https://edtechmagazine.com/...",
    "isCallback": true,
    "callbackThreadId": "boise-state-ai-platform",
    "callbackFirstCovered": "2026-02-03",
    "category": "Infrastructure & Operations"
  },
  "quickHits": [
    {
      "title": "New AI Grading Tool Claims 90% Time Savings",
      "summary": "A startup called GradeAssist launched this week targeting large lecture courses. The real question: does faster grading mean better feedback, or just faster feedback?",
      "source": "Inside Higher Ed",
      "sourceUrl": "https://insidehighered.com/...",
      "category": "Teaching & Learning"
    },
    {
      "title": "UNESCO Releases Updated AI Ethics Framework for Universities",
      "summary": "The new framework addresses generative AI specifically — something the 2023 version didn't cover. Worth reading if your institution is drafting AI policies.",
      "source": "UNESCO",
      "sourceUrl": "https://unesco.org/...",
      "category": "Policy & Ethics"
    }
  ],
  "storiesWatching": [
    {
      "threadId": "faculty-ai-training-gap",
      "label": "The Faculty AI Training Gap",
      "update": "Still no institutional response to last week's survey showing 73% of faculty feel unsupported. Watching for whether any provost offices step up.",
      "daysSinceFirstCovered": 5
    }
  ],
  "closingThought": "What's striking about this week isn't that AI is spreading across campuses — it's how fast the copycats are moving. The gap between early adopters and everyone else is shrinking, and that changes the conversation from 'should we?' to 'how fast can we?'",
  "categories": ["Infrastructure & Operations", "Teaching & Learning", "Policy & Ethics"],
  "themes": ["cost reduction", "AI platform adoption", "grading automation", "ethics frameworks"]
}
```

---

## 12. WEBSITE UPDATES

### Navigation
- Rename "Daily Pulse" → **"Innovation Pulse"** in site nav

### Innovation Pulse Landing Page (`/innovation-pulse`)

**Header:**
- Title: "The Innovation Pulse"
- Subtitle: "Daily AI & Innovation in Higher Education"
- Description: "Your daily briefing on what's happening in AI and higher education — curated, analyzed, and delivered by Dr. Norma Jones. Not just headlines — the stories that matter, the questions nobody's asking, and the developments worth watching."

**AI Voice Disclaimer** (small text at bottom of page or in an expandable info section):
- "The Innovation Pulse is produced using AI voice technology based on Dr. Norma Jones' voice, with editorial oversight by Dr. Jones."

**Today's Episode** (featured section at top):
- Audio player with waveform visualization (Electric Dusk themed)
- Editorial hook displayed prominently
- Deep dive story card (larger, featured)
- Quick hit story cards (smaller, grid)
- "Stories We're Watching" sidebar or section (when applicable)
- Editorial lens badge: "Today's Lens: The Innovator's Edge"

**Episode Archive:**
- Calendar or date-based browsing
- Category filtering (same categories as story cards)
- Search functionality
- Each past episode shows: date, lens, editorial hook, story count, audio player

### Homepage Module
- Section titled "The Innovation Pulse"
- Shows today's editorial hook + audio player
- "Listen Now" CTA + "See All Episodes" link
- Compact format — preview, not full content

### Story Card Categories (for filtering)
- Teaching & Learning
- Infrastructure & Operations
- Policy & Ethics
- Student Experience
- Research & Innovation
- Workforce & Careers
- Tools & Products (editorial, not advertorial)
- Leadership & Strategy

---

## 13. IMPLEMENTATION PLAN — CLAUDE CODE PROMPT

This is the prompt to give to Claude Code to implement all changes.

```
# The Innovation Pulse — Implementation Prompt

## CONTEXT
You are updating the IHE Pulse project at ~/Desktop/ihe-pulse/ (Next.js 14, deployed to https://ihe-pulse.vercel.app via GitHub CaltexBevo/ihe-pulse). You have FULL PERMISSION to execute all tasks without stopping to ask.

## TASK 1: Rename Daily Pulse → Innovation Pulse (Website)

1. Rename the route: `app/daily-pulse/` → `app/innovation-pulse/`
2. Update ALL internal links, nav items, and references from "Daily Pulse" to "Innovation Pulse"
3. Update the page header:
   - Title: "The Innovation Pulse"
   - Subtitle: "Daily AI & Innovation in Higher Education"
   - Add description text: "Your daily briefing on what's happening in AI and higher education — curated, analyzed, and delivered by Dr. Norma Jones."
4. Add editorial lens badge display (show today's lens name)
5. Add small AI voice disclaimer at bottom of page: "The Innovation Pulse is produced using AI voice technology based on Dr. Norma Jones' voice, with editorial oversight by Dr. Jones."
6. Update homepage module to reference "The Innovation Pulse"
7. Add redirect from `/daily-pulse` to `/innovation-pulse` for any old links

## TASK 2: Update Data Structure

1. Create directory: `src/data/innovation-pulse/`
2. Create a sample JSON file `src/data/innovation-pulse/2026-02-06.json` using the schema from the spec (see Section 11 above — include realistic sample data)
3. Create 4 more sample files for Feb 3–5 and Feb 7 to demonstrate the archive and callback features
4. In the Feb 6 sample, include a callback story that references the Feb 3 story (demonstrate the callback system)
5. Update the Innovation Pulse page to read from these JSON files
6. Implement category filtering using the categories from the JSON
7. Implement the story card design:
   - Deep Dive card: larger, featured, with "Deep Dive" badge and callback indicator if applicable
   - Quick Hit cards: compact grid layout
   - Stories We're Watching: sidebar or separate section with thread labels and day counts
8. Display the editorial lens for each day's episode

## TASK 3: Audio Player Update

1. Update the audio player component to reference "The Innovation Pulse" instead of "Daily AI in Education Briefing"
2. Ensure the player reads `audioUrl` from the JSON data
3. Keep the waveform visualization and Electric Dusk styling

## TASK 4: Episode Archive

1. Build a date-based archive view (list of past episodes)
2. Each archive entry shows: date, editorial lens badge, editorial hook, story count, play button
3. Click to expand shows full story cards for that day
4. Add category filtering across all episodes

## TASK 5: Homepage Innovation Pulse Module

1. Update the homepage section:
   - Title: "The Innovation Pulse"
   - Show today's editorial hook
   - Compact audio player
   - "Listen to Today's Pulse" CTA
   - "Browse All Episodes →" link to /innovation-pulse
   - Show editorial lens badge for today

## TASK 6: Build, Commit, Deploy

1. Run `npm run build` — fix any errors
2. `git add -A`
3. `git commit -m "feat: rebrand Daily Pulse → The Innovation Pulse with callback system, editorial lenses, and updated data structure"`
4. `git push origin main`

## DESIGN GUIDELINES
- Theme: Electric Dusk (dark bg #0a0a0f, cyan #00d4ff, magenta #c850c0)
- Cards: Dark glass-morphism (bg-white/5 backdrop-blur border border-white/10)
- Callback indicators: Use a subtle "↩ Callback" badge on story cards that reference previous episodes
- Editorial lens badges: Color-coded pills (Monday=cyan, Tuesday=amber, Wednesday=green, Thursday=magenta, Friday=gradient)
- "Stories We're Watching" section: Use a subtle pulsing dot animation to indicate active threads
- Maintain all existing responsive design and animation patterns

Go. Build everything. Don't stop.
```

---

## 14. IHE-TOOLS-SERVER CHANGES

These changes are made to the ihe-tools-server codebase (separate repo: CaltexBevo/ihe-tools-server).

### Files to Modify

**`broadcastRewriter.js`** — Replace the system prompt with the full prompt from Section 9 above. Add logic to:
- Determine today's day of week and select the editorial lens
- Pass the story tracker and theme log as context to the OpenAI call
- Template the date, day, and lens into the prompt

**`server.js`** — Modify the daily pipeline:
- Add `read_story_tracker` step before content generation
- Add `update_story_tracker` step after content generation
- Replace `create_wp_draft` endpoint with `publish_to_github` endpoint
- Add story tracker JSON read/write to GCS (or GitHub)

**New file: `githubPublisher.js`** — Module that:
- Takes the episode JSON payload
- Commits it to the ihe-pulse repo at `src/data/innovation-pulse/YYYY-MM-DD.json`
- Uses GitHub API with a personal access token
- Returns the commit URL

**New file: `storyTracker.js`** — Module that:
- Reads/writes `story-tracker.json` from GCS
- Provides functions: `loadTracker()`, `matchThread(article)`, `createThread(article)`, `updateThread(threadId, newData)`, `getThemeLog(days)`, `archiveDormant()`

**`wordpressAudioEmbed.js`** — Can be removed or kept for backward compatibility. No longer called in the pipeline.

**`dailyNewsAudioPipeline.js`** — Modify to:
- Skip the WordPress embed step
- Return the audio URL for inclusion in the JSON payload instead

### New Environment Variables

Add to `env.yaml`:
```yaml
GITHUB_TOKEN: "ghp_..."          # Personal access token with repo write access
GITHUB_REPO: "CaltexBevo/ihe-pulse"
GITHUB_BRANCH: "main"
GCS_TRACKER_BUCKET: "ihe-daily-news-audio"  # Reuse existing bucket
GCS_TRACKER_PATH: "tracker/story-tracker.json"
```

### Updated Pipeline Flow

```
Cloud Scheduler (8 AM PT)
  → /run-daily endpoint
  → Load story tracker from GCS
  → Load theme log (last 7 days)
  → Determine today's editorial lens (day of week)
  → OpenAI Assistant orchestrates:
      1. search_news (Serper)
      2. scrape_url (Firecrawl) on top results
      3. read_story_tracker — check for callbacks
      4. read_dedup_log — check for URL duplicates
      5. Generate episode content (applying lens, callbacks, anti-advertorial rules)
      6. generate_audio (broadcast rewrite → ElevenLabs → GCS upload)
      7. publish_to_github (commit JSON to ihe-pulse repo → triggers Vercel deploy)
      8. update_story_tracker (new threads, updated threads, theme log)
      9. write_dedup_log
      10. send_slack notification
      11. Email broadcast script to brentjones@liquidflicks.com
  → Vercel auto-deploys with new episode data
  → Site is live with today's Innovation Pulse by ~8:15 AM PT
```

---

## 15. COST ESTIMATE

| Service | Monthly Cost |
|---------|-------------|
| Google Cloud Run | ~$0–2 (minimal compute, one run per day) |
| Google Cloud Scheduler | Free tier |
| OpenAI API (Assistant + broadcast rewrite) | ~$3–8 |
| ElevenLabs (daily 3–5 min audio) | ~$5–11 (depends on plan/character count) |
| Google Cloud Storage (audio + tracker) | ~$0.50 |
| Serper API | ~$0–5 (depends on plan) |
| Firecrawl | ~$0–5 (depends on plan) |
| GitHub API | Free |
| Vercel | Free tier |
| **Total** | **~$10–30/month** |

---

*Document Version: 1.0*  
*Created: February 6, 2026*  
*For: InnovatingHigherEd.com — The Innovation Pulse*

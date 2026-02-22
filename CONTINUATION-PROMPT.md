# CONTINUATION PROMPT — Innovation Pulse

Use this to continue a Claude Code session on the IHE Pulse project.

---

## Project Overview

**Repository:** /Volumes/Bevo 2TB/ihe-pulse/
**Stack:** Next.js 14, Tailwind CSS, TypeScript, Vercel
**Theme:** Electric Dusk (cyan #00d4ff + magenta #c850c0)

---

## Current State (Feb 22, 2026)

### What's Working
- Innovation Pulse page live at /innovation-pulse
- Week Feb 16-20 deployed with 20 stories (5 big + 15 short)
- Real audio player with HTML5 `<audio>` element
- V4 category system (Insights & Trends, Case Study, Practical Tips, Ethical AI, Latest AI Products, Beyond Ed)
- Editorial lens rotation (Mon=Hard Question, Tue=Student Experience, etc.)
- Earlier This Week expandable section

### Key Files
- `app/innovation-pulse/InnovationPulseClient.tsx` — Main client component (~800 lines)
- `lib/data/innovation-pulse-types.ts` — Types, colors, date utilities
- `lib/data/innovation-pulse/YYYY-MM-DD.json` — Daily story data
- `public/audio/innovation-pulse/` — MP3 files (ElevenLabs generated)

### Audio Files (Verified)
- innovation-pulse-2026-02-16.mp3 (5.4MB)
- innovation-pulse-2026-02-17.mp3 (4.0MB)
- innovation-pulse-2026-02-18.mp3 (4.7MB)
- innovation-pulse-2026-02-19.mp3 (4.4MB)
- innovation-pulse-2026-02-20.mp3 (4.6MB)

---

## What's Next

### Immediate Tasks
1. Test audio playback in browser (verify MP3s load and play)
2. Visual QA pass on Innovation Pulse page
3. Verify all external story links work

### Upcoming Features
- Archive page at /innovation-pulse/archive
- Week in Review category for Friday
- Email subscription system
- Automated daily pipeline

---

## Critical Production Rules

1. **A.I.** — Always write with periods in audio scripts
2. **No em dashes** in audio scripts
3. **V4 categories only** — Never use old taxonomy
4. **Source diversity** — CCs, HBCUs, regionals > R1s
5. **Never retell a story** — Callbacks only when new info

---

## Commands

```bash
# Development
npm run dev

# Build
npm run build

# Audio generation (requires ElevenLabs API key)
node scripts/generate-audio.mjs

# Test audio files
file public/audio/innovation-pulse/*.mp3
afplay public/audio/innovation-pulse/innovation-pulse-2026-02-16.mp3
```

---

## Documentation

- CHANGELOG.md — Session history and changes
- ROADMAP.md — Current sprint and backlog
- PRODUCTION-RULES.md — Editorial and technical rules
- CLAUDE.md — Project overview for Claude Code

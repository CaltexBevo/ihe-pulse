# Homepage Restructure Backup — May 26, 2026

## What this backup covers
Before making The Innovation Pulse the homepage, key files were backed up.

## Full file backups (exact copies)
- `components/SectionHeader.tsx` — ✅ Full backup
- `components/TopStoriesSlider.tsx` — ✅ Full backup

## Files recoverable from git (too large for filesystem copy)
- `app/page.tsx` — Recover with: `git show HEAD:app/page.tsx`
- `app/innovation-pulse/InnovationPulseClient.tsx` — Recover with: `git show HEAD:app/innovation-pulse/InnovationPulseClient.tsx`

## Files NOT modified (no backup needed)
- `app/innovation-pulse/page.tsx` — Server component, minimal logic
- `app/innovation-pulse/layout.tsx` — Just metadata
- `components/HomeEpisodePlayer.tsx` — Hero episode player (NOT CHANGING)
- `components/HeroNowPlaying.tsx` — Hero artwork/audio (NOT CHANGING)
- `components/HomeAIAppCards.tsx` — Moving to Explore More section, not redesigning
- `components/HomePromptCards.tsx` — Moving to Explore More section, not redesigning
- `components/NewsletterSignup.tsx` — CTA (NOT CHANGING)

## What changed
1. `app/page.tsx` — Innovation Pulse content becomes homepage. Static sections
   (Prompts, Directory, Tools, Podcast) moved to "Explore more" at bottom.
2. Vertical accent bars before category section headings in InnovationPulseClient.tsx — removed
3. `TopStoriesSlider.tsx` — Cards resized to match other story cards, 3-column grid, no slider peek
4. New "Explore more from Innovating Higher Ed" section added at bottom

## To restore from git
```bash
cd /Volumes/MISHA\ 2TB/ihe-pulse
git show HEAD~1:app/page.tsx > app/page.tsx
git show HEAD~1:app/innovation-pulse/InnovationPulseClient.tsx > app/innovation-pulse/InnovationPulseClient.tsx
```

## To restore from this backup
```bash
cp src-archive/2026-05-26-homepage-restructure/components/SectionHeader.tsx components/SectionHeader.tsx
cp src-archive/2026-05-26-homepage-restructure/components/TopStoriesSlider.tsx components/TopStoriesSlider.tsx
```

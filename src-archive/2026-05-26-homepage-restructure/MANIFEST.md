# Homepage Restructure Backup — May 26, 2026

## What this backup covers
Before making The Innovation Pulse the homepage, key files were backed up.
This archive contains the ORIGINAL homepage with static sections (Prompts, AI Directory,
Educator Tools, Podcast rows) before the Innovation Pulse restructure.

## Full file backups (exact copies)
- `app/page.tsx` — ✅ Full standalone backup (401 lines) — the original static-section homepage
- `app/innovation-pulse/InnovationPulseClient.tsx` — ✅ Full standalone backup (729 lines) — original with hero, archive, and CTAs
- `components/SectionHeader.tsx` — ✅ Full backup
- `components/TopStoriesSlider.tsx` — ✅ Full backup

## Files NOT modified (no backup needed)
- `app/innovation-pulse/page.tsx` — Server component, minimal logic
- `app/innovation-pulse/layout.tsx` — Just metadata
- `components/HomeEpisodePlayer.tsx` — Hero episode player (NOT CHANGING)
- `components/HeroNowPlaying.tsx` — Hero artwork/audio (NOT CHANGING)
- `components/HomeAIAppCards.tsx` — Moving to Explore More section, not redesigning
- `components/HomePromptCards.tsx` — Moving to Explore More section, not redesigning
- `components/NewsletterSignup.tsx` — CTA (NOT CHANGING)

## What changed in the restructure
1. `app/page.tsx` — Innovation Pulse content became the homepage. Static sections
   (Prompts, Directory, Tools, Podcast) moved to "Explore more" at bottom.
2. Vertical accent bars before category section headings in InnovationPulseClient.tsx — removed
3. `TopStoriesSlider.tsx` — Cards resized to match other story cards, 3-column grid, no slider peek
4. New "Explore more from Innovating Higher Ed" section added at bottom
5. `app/innovation-pulse/page.tsx` now redirects to `/` (homepage)

---

## TO RESTORE THE ORIGINAL HOMEPAGE

If you want to restore the original static-section homepage (with Prompts, AI Directory,
Educator Tools, Podcast rows as separate sections), follow these steps:

### Step 1: Restore the homepage file
```bash
cp src-archive/2026-05-26-homepage-restructure/app/page.tsx app/page.tsx
```

### Step 2: Restore the Innovation Pulse client component
```bash
cp src-archive/2026-05-26-homepage-restructure/app/innovation-pulse/InnovationPulseClient.tsx app/innovation-pulse/InnovationPulseClient.tsx
```

### Step 3: Remove the /innovation-pulse redirect
The current `app/innovation-pulse/page.tsx` redirects to `/`. You need to restore it
to render actual content. Either:

**Option A:** Restore from git (find a commit before the redirect was added):
```bash
git show ba3f6de~1:app/innovation-pulse/page.tsx > app/innovation-pulse/page.tsx
```

**Option B:** Create a simple server component that renders InnovationPulseClient:
```tsx
// app/innovation-pulse/page.tsx
import InnovationPulseClient from "./InnovationPulseClient";
import { getLatestEpisode, getAllEpisodes, getStoriesByCategory } from "@/lib/data/innovation-pulse";

export default function InnovationPulsePage() {
  const episode = getLatestEpisode();
  const allEpisodes = getAllEpisodes();
  const storiesByCategory = getStoriesByCategory();

  return (
    <InnovationPulseClient
      episode={episode}
      allEpisodes={allEpisodes}
      storiesByCategory={storiesByCategory}
    />
  );
}
```

### Step 4: Rebuild and verify
```bash
npm run build
npm run dev
# Visit http://localhost:3000 to verify the original homepage is restored
```

---

## Git references
The original files came from commit `ba3f6de~1` (one commit before "feat: Make Innovation Pulse the homepage").

To see the original files directly from git:
```bash
git show ba3f6de~1:app/page.tsx
git show ba3f6de~1:app/innovation-pulse/InnovationPulseClient.tsx
```

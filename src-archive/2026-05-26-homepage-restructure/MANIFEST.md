# Homepage Restructure Backup — May 26–29, 2026

## What this backup covers
Before making The Innovation Pulse the homepage, key files were backed up.
This archive contains the ORIGINAL homepage with static sections (Prompts, AI Directory,
Educator Tools, Podcast rows) before the Innovation Pulse restructure.

## Full file backups (exact copies)
- `app/page.tsx` — ✅ Full standalone backup (401 lines) — the original static-section homepage
- `app/innovation-pulse/InnovationPulseClient.tsx` — ✅ Full standalone backup (729 lines) — original with hero, archive, and CTAs
- `components/SectionHeader.tsx` — ✅ Full backup
- `components/TopStoriesSlider.tsx` — ✅ Full backup
- `archive-page.tsx` — ✅ Original archive page.tsx (pre-All Episodes redesign)
- `ArchiveClient.tsx` — ✅ Original archive client component (pre-All Episodes redesign)

## Files NOT modified (no backup needed initially, but changed in May 27–29 sprint)
- `app/innovation-pulse/page.tsx` — Now redirects to `/`
- `components/HomeEpisodePlayer.tsx` — ⚠️ MODIFIED: redesigned as wide horizontal cards
- `components/HeroNowPlaying.tsx` — ⚠️ MODIFIED: play/pause fix + mobile overlay
- `components/Nav.tsx` — ⚠️ MODIFIED: "Innovation Pulse" removed, "All Episodes" added

## What changed in the restructure (May 26–29 complete list)

### May 26 (initial restructure)
1. `app/page.tsx` — Innovation Pulse content became the homepage. Static sections
   (Prompts, Directory, Tools, Podcast) moved to "Explore more" at bottom.
2. Vertical accent bars before category section headings in InnovationPulseClient.tsx — removed
3. `TopStoriesSlider.tsx` — Cards resized to match other story cards, 3-column grid, no slider peek
4. New "Explore more from Innovating Higher Ed" section added at bottom
5. `app/innovation-pulse/page.tsx` now redirects to `/` (homepage)

### May 27 (audio + mobile fixes)
6. `HeroNowPlaying.tsx` — Fixed play/pause icon toggle (was stuck on play)
7. `HeroNowPlaying.tsx` — Added play-button overlay on hero artwork for mobile
8. `HeroNowPlaying.tsx` — Hid transport controls and waveform on mobile (<768px)

### May 28 (recent episodes redesign)
9. `HomeEpisodePlayer.tsx` — Initial redesign as horizontal thumbnail strip with branded covers
10. `HomeEpisodePlayer.tsx` — Further redesign as wide horizontal cards (cover left, title right)
11. `HomeEpisodePlayer.tsx` — Raised episode display cap from 6 to ~16
12. `InnovationPulseClient.tsx` — Category "View All" links now specify category name

### May 29 (archive + nav cleanup)
13. Archive rebuilt as "All Episodes" playlist page with branded cover boxes + play button overlay
14. `components/Nav.tsx` — Removed "Innovation Pulse", added "All Episodes"
15. Category pages now use expandable Card component (via `CategoryStoriesGrid.tsx`)

---

## TO RESTORE THE ORIGINAL HOMEPAGE

**WARNING:** Many files have been modified since the initial May 26 backup. A full restore
requires reverting multiple components. Consider using git revert instead.

### Option A: Git Revert (Recommended)
Revert to commit `ba3f6de~1` (before "feat: Make Innovation Pulse the homepage"):
```bash
git revert --no-commit ba3f6de..HEAD
git commit -m "Revert homepage restructure"
```

### Option B: Manual File Restore
If you only want the original homepage structure but keep other changes:

#### Step 1: Restore the homepage file
```bash
cp src-archive/2026-05-26-homepage-restructure/app/page.tsx app/page.tsx
```

#### Step 2: Restore the Innovation Pulse client component
```bash
cp src-archive/2026-05-26-homepage-restructure/app/innovation-pulse/InnovationPulseClient.tsx app/innovation-pulse/InnovationPulseClient.tsx
```

#### Step 3: Restore the archive page (optional)
```bash
cp src-archive/2026-05-26-homepage-restructure/archive-page.tsx app/innovation-pulse/archive/page.tsx
cp src-archive/2026-05-26-homepage-restructure/ArchiveClient.tsx app/innovation-pulse/archive/ArchiveClient.tsx
rm app/innovation-pulse/archive/AllEpisodesClient.tsx
```

#### Step 4: Restore nav (required)
Edit `components/Nav.tsx` and change "All Episodes" back to "Innovation Pulse" in the navLinks array.

#### Step 5: Remove the /innovation-pulse redirect
Create a simple server component that renders InnovationPulseClient:
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

#### Step 6: Rebuild and verify
```bash
npm run build
npm run dev
# Visit http://localhost:3000 to verify the original homepage is restored
```

---

## Git references
The original files came from commit `ba3f6de~1` (one commit before "feat: Make Innovation Pulse the homepage").

Key commits in the restructure:
- `ba3f6de~1` — Last commit before homepage restructure
- `eeda1bf` — Initial restructure
- `d0eba00` — Final restructure commit (All Episodes page + nav cleanup)

To see the original files directly from git:
```bash
git show ba3f6de~1:app/page.tsx
git show ba3f6de~1:app/innovation-pulse/InnovationPulseClient.tsx
git show ba3f6de~1:components/Nav.tsx
```

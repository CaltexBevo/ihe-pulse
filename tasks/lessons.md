# Lessons Learned — IHE Pulse Development

## Session: Feb 23, 2026 — Build 13 Fixes

### Audio Player Reload Issue
**Problem**: When switching between day pills on the Innovation Pulse page, the audio element's `src` attribute changed but the browser didn't automatically reload the new audio file.

**Solution**: Added a `useEffect` hook that calls `audio.load()` whenever `selectedAudioEpisode?.audioUrl` changes:
```tsx
useEffect(() => {
  const audio = audioRef.current;
  if (audio && selectedAudioEpisode?.audioUrl) {
    audio.load();
  }
}, [selectedAudioEpisode?.audioUrl]);
```

**Lesson**: React updates DOM attributes but doesn't automatically trigger browser-specific behaviors like audio reloading. Always call `.load()` when programmatically changing audio sources.

### Click Propagation in Nested Buttons
**Problem**: The "Earlier This Week" section had a play button icon inside an expand/collapse button. Clicking anywhere on the card header triggered expand/collapse, even when intending to play audio.

**Solution**: Made the play button a separate clickable `<div>` with `onClick` that:
1. Calls `e.stopPropagation()` to prevent triggering the parent button
2. Calls `selectAudioDay(ep.date)` to switch audio
3. Calls `window.scrollTo({ top: 0, behavior: 'smooth' })` so users see the main player

**Lesson**: When nesting interactive elements, use `stopPropagation()` and consider UX implications of where users end up after clicking.

### Branding Consistency
**Problem**: "Dr. Norma Jones" references scattered throughout the codebase created inconsistent voice attribution.

**Solution**:
- Use "Innovating Higher Ed" for site/brand attribution
- Use "The Innovation Pulse" for the daily briefing product
- Use "Our Take" instead of "Dr. Norma's Take" for editorial sections
- Use "we/our" language in descriptions
- Keep personal attribution only on About page and podcast host credits

**Lesson**: Document branding rules clearly (done in PRODUCTION-RULES.md) and search for violations before deploying.

### "IHE" Abbreviation Conflict
**Problem**: "IHE" is commonly associated with "Inside Higher Ed", a major industry publication. Using it for "Innovating Higher Ed" creates confusion.

**Solution**: Always write "Innovating Higher Ed" in full. Never abbreviate to "IHE".

**Lesson**: Research common abbreviations in your industry before adopting them.

---

## General Development Lessons

### Audio File Paths in Next.js
Files in `/public/audio/` are served at `/audio/`. The JSON data should reference `/audio/innovation-pulse/filename.mp3`, not the full filesystem path.

### V4 Category Migration
When changing category taxonomies, create a mapping function rather than editing all historical data:
```ts
const OLD_TO_V4_MAP: Record<string, V4Category> = {
  "Research & Innovation": "Insights & Trends",
  // ...
};
```
This preserves historical accuracy while displaying consistent modern categories.

### Static Generation with Dynamic Data
Use `generateStaticParams()` for pages like `/innovation-pulse/[date]` and `/innovation-pulse/story/[slug]` to pre-render all known routes at build time. This improves performance and SEO.

---

## Session: Feb 24, 2026 — Build 13.3 Verification

### Verification Before Claiming Completion
**Problem**: In Build 13.1 and 13.2, features were claimed as "added" but visual verification showed they weren't working as expected (logo not displaying, content sections missing).

**Solution**: Always run explicit verification checks:
1. `ls -la` to confirm files exist with proper permissions
2. `grep -c "pattern"` to count expected content
3. `npm run build` to verify no compilation errors
4. Visual checks in browser after deployment

**Lesson**: Never assume code changes are working. Run grep/count checks to PROVE content exists before claiming it does. Verify, don't trust.

### File Permissions for Assets
**Problem**: Logo file existed but had restrictive permissions (`-rw-------`) that could cause issues.

**Solution**: Run `chmod 644` on public assets to ensure they're readable by the web server.

**Lesson**: Check file permissions when assets don't display despite correct code references.

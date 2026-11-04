// Card presentation only. Hero, article and player sources keep their masters.
export const CARD_ARTWORK: Readonly<Record<string, string>> = {
  "/images/innovation-pulse/2026-10-16/weekly-edition-21.png": "/images/card-artwork/2026-11-03/2026-10-16-card-3x2-v1.png",
  "/images/innovation-pulse/2026-10-02/weekly-D-logo-integrated-v1.png": "/images/card-artwork/2026-11-03/2026-10-02-card-3x2-v2.png",
  "/images/innovation-pulse/2026-09-25/teaching-superpower-feature-lab.png": "/images/card-artwork/2026-11-03/2026-09-25-card-3x2-v1.png",
  "/images/innovation-pulse/homepage/2026-09-11-approved-bold-diagonal.png": "/images/card-artwork/2026-11-03/2026-09-11-card-3x2-v1.png",
  "/images/innovation-pulse/homepage/2026-09-04-approved-hero-v4-a-blue.png": "/images/card-artwork/2026-11-03/2026-09-04-card-3x2-v1.png",
  "/images/innovation-pulse/homepage/2026-08-28-option-a-master.png": "/images/card-artwork/2026-11-03/2026-08-28-card-3x2-v1.png",
  "/images/innovation-pulse/thumbnails/2026-08-21-style-2-waveform.png": "/images/card-artwork/2026-11-03/2026-08-21-card-3x2-v1.png",
  "/images/innovation-pulse/thumbnails/2026-08-14-style-2-waveform.png": "/images/card-artwork/2026-11-03/2026-08-14-card-3x2-v1.png",
  "/images/innovation-pulse/thumbnails/2026-08-07-style-2-waveform.png": "/images/card-artwork/2026-11-03/2026-08-07-card-3x2-v1.png",
  "/images/innovation-pulse/thumbnails/2026-07-31-style-2-waveform.png": "/images/card-artwork/2026-11-03/2026-07-31-card-3x2-v1.png",
  "/images/innovation-pulse/thumbnails/2026-07-24-style-2-waveform.png": "/images/card-artwork/2026-11-03/2026-07-24-card-3x2-v1.png",
  "/images/innovation-pulse/thumbnails/2026-07-17-style-2-waveform.png": "/images/card-artwork/2026-11-03/2026-07-17-card-3x2-v1.png",
  "/images/innovation-pulse/thumbnails/2026-07-10-style-2-waveform.png": "/images/card-artwork/2026-11-03/2026-07-10-card-3x2-v1.png",
  "/images/innovation-pulse/thumbnails/2026-07-03-style-2-waveform.png": "/images/card-artwork/2026-11-03/2026-07-03-card-3x2-v1.png",
  "/images/innovation-pulse/2026-10-02/feature-logo-integrated-v1.png": "/images/card-artwork/2026-11-03/card-wonka-v1.png",
  "/images/feature-coverage/grant-portal-no-url.png": "/images/card-artwork/2026-11-03/card-grant-portal-v1.png",
  "/images/feature-coverage/four-new-ai-models-next-project.png": "/images/card-artwork/2026-11-03/card-four-models-v1.png",
  "/images/feature-coverage/mit-ai-education-purpose-lens-approved.png": "/images/card-artwork/2026-11-03/card-mit-purpose-v1.png",
  "/images/innovation-pulse/2026-10-23/weekly-edition-22-feature-preview-a.png": "/images/card-artwork/2026-11-03/edition22-card-3x2-v2.png"
};

// Individually reviewed central artwork. Unknown sources remain contained.
export const CARD_COVER_SOURCES: ReadonlySet<string> = new Set([
  "/images/stories/seventy-percent-of-college-students-see-a-i-as-career-threat.webp",
  "/images/stories/laccd-chatbots-give-wrong-answers.webp",
  "/images/stories/42-of-bachelors-students-have-reconsidered-their-major-due-t.webp",
  "/images/stories/purdue-becomes-first-us-university-to-require-ai-graduation.webp",
  "/images/stories/gallup-data-shows-gen-z-excitement-about-ai-dropped-14-points.webp",
  "https://storage.googleapis.com/ihe-daily-news-audio/images/2026-05-12/LEAD-B.png",
  "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80",
  "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
  "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=1200&q=80",
  "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200&q=80"
]);

export function getCardArtwork(source: string) {
  return { src: CARD_ARTWORK[source] ?? source, fit: CARD_COVER_SOURCES.has(source) ? "cover" as const : "contain" as const };
}

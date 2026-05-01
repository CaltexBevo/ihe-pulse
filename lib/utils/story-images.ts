// ══════════════════════════════════════════════════════════════════════════════
// STORY IMAGE UTILITY
// ══════════════════════════════════════════════════════════════════════════════
//
// ARCHITECTURE NOTE (2026-03-26):
// This utility is called by assignImagesToEpisode() in lib/data/innovation-pulse.ts.
// Images are assigned ONCE at data load time, then stored on each story object.
//
// DO NOT instantiate StoryImageAssigner in individual page components.
// All components should read story.image from the pre-assigned data instead.
//
// This ensures the SAME story shows the SAME image across:
// - Homepage
// - Innovation Pulse page
// - Story detail pages
// - Date pages
// - Stories archive
//
// ══════════════════════════════════════════════════════════════════════════════
//
// RULE: NEVER use headshot or portrait photos. Scenes, concepts, and objects ONLY. No individual faces.
// All story images must be: campus buildings, classrooms, technology, libraries, abstract patterns,
// aerial views, conference rooms, lab equipment, data visualizations, empty lecture halls.

import storyImagesData from '@/data/story-images.json';

// Type for the categorized image data
interface StoryImagesData {
  themes: Record<string, string[]>;
  flatPool: string[];
}

const imageData = storyImagesData as StoryImagesData;

// Category to theme mapping
const CATEGORY_TO_THEME: Record<string, string> = {
  // V4 Categories
  "Insights & Trends": "research",
  "Case Study": "campus",
  "Practical Tips": "classroom",
  "Ethical AI": "digital",
  "Latest AI Products": "technology",
  "Beyond Ed": "collaboration",
  "Week in Review": "library",
  // Legacy categories
  "Teaching & Learning": "classroom",
  "Research & Innovation": "research",
  "Policy & Ethics": "digital",
  "Tools & Products": "technology",
  "Infrastructure & Operations": "collaboration",
  "Student Experience": "campus",
  "Leadership & Strategy": "library",
};

/**
 * Simple hash function for strings - deterministic
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get a consistent image URL for a story based on its headline, date, and category.
 * Uses headline + date as hash input so same headline on different days gets different images.
 */
export function getStoryImage(headline: string, category?: string, date?: string): string {
  // Hash uses headline + date for better distribution
  const hashInput = date ? `${headline}::${date}` : headline;

  // Try to get themed image first
  if (category) {
    const theme = CATEGORY_TO_THEME[category];
    const themedImages = theme ? imageData.themes[theme] : null;

    if (themedImages && themedImages.length > 0) {
      const hash = hashString(hashInput);
      const index = hash % themedImages.length;
      return themedImages[index];
    }
  }

  // Fallback to flat pool
  const hash = hashString(hashInput);
  const index = hash % imageData.flatPool.length;
  return imageData.flatPool[index];
}

/**
 * Image assigner class for page-level deduplication.
 * Create ONE instance per page render to track ALL used images across all sections.
 * This prevents ANY duplicate images on the same page.
 *
 * RULE: NEVER use headshot or portrait photos. Scenes, concepts, and objects ONLY.
 */
export class StoryImageAssigner {
  private usedImages = new Set<string>();
  private assignmentCount = 0;

  /**
   * Get a unique image for a story, avoiding duplicates on the same page.
   * Uses headline + date as hash input so same story on different days gets different images.
   */
  getImage(headline: string, category?: string, date?: string): string {
    // Hash uses headline + date for better distribution across days
    const hashInput = date ? `${headline}::${date}` : headline;

    // Try themed images first
    if (category) {
      const theme = CATEGORY_TO_THEME[category];
      const themedImages = theme ? imageData.themes[theme] : null;

      if (themedImages && themedImages.length > 0) {
        const hash = hashString(hashInput);
        let index = hash % themedImages.length;
        let attempts = 0;

        // Find an unused image in this theme
        while (this.usedImages.has(themedImages[index]) && attempts < themedImages.length) {
          index = (index + 1) % themedImages.length;
          attempts++;
        }

        // If found unused themed image, use it
        if (!this.usedImages.has(themedImages[index])) {
          this.usedImages.add(themedImages[index]);
          this.assignmentCount++;
          return themedImages[index];
        }
        // If all themed images used, fall through to flat pool
      }
    }

    // Flat pool with deduplication and category offset cycling
    const poolSize = imageData.flatPool.length;
    const hash = hashString(hashInput);

    // Use category as offset to spread images when pool cycles
    const categoryOffset = category ? hashString(category) % 17 : 0; // Prime number for distribution
    const cycleOffset = Math.floor(this.assignmentCount / poolSize) * 11; // Another prime

    let index = (hash + categoryOffset + cycleOffset) % poolSize;
    let attempts = 0;

    // Try to find an unused image
    while (this.usedImages.has(imageData.flatPool[index]) && attempts < poolSize) {
      index = (index + 1) % poolSize;
      attempts++;
    }

    // If all images exhausted (very rare), cycle with different offset
    if (this.usedImages.has(imageData.flatPool[index])) {
      index = (hash + this.assignmentCount * 7) % poolSize;
    }

    this.usedImages.add(imageData.flatPool[index]);
    this.assignmentCount++;
    return imageData.flatPool[index];
  }

  /**
   * Reset the assigner (call when switching episodes or for new page renders)
   */
  reset(): void {
    this.usedImages.clear();
    this.assignmentCount = 0;
  }

  /**
   * Get the number of unique images assigned so far
   */
  getAssignmentCount(): number {
    return this.assignmentCount;
  }

  /**
   * Check if an image has already been used on this page
   */
  isUsed(imageUrl: string): boolean {
    return this.usedImages.has(imageUrl);
  }
}

/**
 * Get unique images for a list of stories, avoiding duplicates.
 */
export function getUniqueStoryImages(
  headlines: string[],
  categories?: string[],
  dates?: string[]
): Map<string, string> {
  const assigner = new StoryImageAssigner();
  const result = new Map<string, string>();

  headlines.forEach((headline, i) => {
    const category = categories?.[i];
    const date = dates?.[i];
    result.set(headline, assigner.getImage(headline, category, date));
  });

  return result;
}

// Export flat pool for backward compatibility
export const allStoryImages = imageData.flatPool;
export const themedImages = imageData.themes;

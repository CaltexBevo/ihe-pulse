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
  "Ethical AI": "ai-concept",
  "Latest AI Products": "technology",
  "Beyond Ed": "workspace",
  "Week in Review": "data",
  // Legacy categories
  "Teaching & Learning": "classroom",
  "Research & Innovation": "research",
  "Policy & Ethics": "ai-concept",
  "Tools & Products": "technology",
  "Infrastructure & Operations": "workspace",
  "Student Experience": "library",
  "Leadership & Strategy": "data",
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
 * Same headline + date always returns the same image.
 */
export function getStoryImage(headline: string, category?: string, date?: string): string {
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
 * Create one instance per page render to track used images across all sections.
 * Uses headline + date for hashing to allow same headlines on different days to get different images.
 */
export class StoryImageAssigner {
  private usedImages = new Set<string>();
  private assignmentCount = 0;

  /**
   * Get a unique image for a story, avoiding duplicates on the same page.
   * Uses headline + date as hash input for better distribution.
   */
  getImage(headline: string, category?: string, date?: string): string {
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

        // If all themed images used, fall through to flat pool
        if (!this.usedImages.has(themedImages[index])) {
          this.usedImages.add(themedImages[index]);
          this.assignmentCount++;
          return themedImages[index];
        }
      }
    }

    // Flat pool with deduplication and cycling
    const poolSize = imageData.flatPool.length;
    const hash = hashString(hashInput);

    // Add assignment count as offset to cycle through images when pool runs low
    const cycleOffset = Math.floor(this.assignmentCount / poolSize) * 7; // Prime-ish offset for distribution
    let index = (hash + cycleOffset) % poolSize;
    let attempts = 0;

    // Try to find an unused image
    while (this.usedImages.has(imageData.flatPool[index]) && attempts < poolSize) {
      index = (index + 1) % poolSize;
      attempts++;
    }

    // If all images exhausted, cycle with a different offset pattern
    if (this.usedImages.has(imageData.flatPool[index])) {
      // Reset tracking for this cycle and use a category-based offset
      const categoryOffset = category ? hashString(category) % poolSize : 0;
      index = (hash + categoryOffset + this.assignmentCount) % poolSize;
    }

    this.usedImages.add(imageData.flatPool[index]);
    this.assignmentCount++;
    return imageData.flatPool[index];
  }

  /**
   * Reset the assigner (for new page renders or when switching episodes)
   */
  reset(): void {
    this.usedImages.clear();
    this.assignmentCount = 0;
  }

  /**
   * Get the number of images assigned so far
   */
  getAssignmentCount(): number {
    return this.assignmentCount;
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

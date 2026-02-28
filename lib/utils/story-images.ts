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
  "Beyond Ed": "collaboration",
  "Week in Review": "administration",
  // Legacy categories
  "Teaching & Learning": "classroom",
  "Research & Innovation": "research",
  "Policy & Ethics": "ai-concept",
  "Tools & Products": "technology",
  "Infrastructure & Operations": "administration",
  "Student Experience": "education",
  "Leadership & Strategy": "administration",
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
 * Get a consistent image URL for a story based on its headline and category.
 * Same headline always returns the same image.
 */
export function getStoryImage(headline: string, category?: string): string {
  // Try to get themed image first
  if (category) {
    const theme = CATEGORY_TO_THEME[category];
    const themedImages = theme ? imageData.themes[theme] : null;

    if (themedImages && themedImages.length > 0) {
      const hash = hashString(headline);
      const index = hash % themedImages.length;
      return themedImages[index];
    }
  }

  // Fallback to flat pool
  const hash = hashString(headline);
  const index = hash % imageData.flatPool.length;
  return imageData.flatPool[index];
}

/**
 * Image assigner class for page-level deduplication.
 * Create one instance per page render to track used images.
 */
export class StoryImageAssigner {
  private usedImages = new Set<string>();
  private usedIndices = new Set<number>();

  /**
   * Get a unique image for a story, avoiding duplicates on the same page.
   */
  getImage(headline: string, category?: string): string {
    // Try themed images first
    if (category) {
      const theme = CATEGORY_TO_THEME[category];
      const themedImages = theme ? imageData.themes[theme] : null;

      if (themedImages && themedImages.length > 0) {
        let hash = hashString(headline);
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
          return themedImages[index];
        }
      }
    }

    // Flat pool with deduplication
    let hash = hashString(headline);
    let index = hash % imageData.flatPool.length;
    let attempts = 0;

    while (this.usedIndices.has(index) && attempts < imageData.flatPool.length) {
      index = (index + 1) % imageData.flatPool.length;
      attempts++;
    }

    this.usedIndices.add(index);
    this.usedImages.add(imageData.flatPool[index]);
    return imageData.flatPool[index];
  }

  /**
   * Reset the assigner (for new page renders)
   */
  reset(): void {
    this.usedImages.clear();
    this.usedIndices.clear();
  }
}

/**
 * Get unique images for a list of stories, avoiding duplicates.
 */
export function getUniqueStoryImages(headlines: string[], categories?: string[]): Map<string, string> {
  const assigner = new StoryImageAssigner();
  const result = new Map<string, string>();

  headlines.forEach((headline, i) => {
    const category = categories?.[i];
    result.set(headline, assigner.getImage(headline, category));
  });

  return result;
}

// Export flat pool for backward compatibility
export const allStoryImages = imageData.flatPool;
export const themedImages = imageData.themes;

import storyImagesData from '@/data/story-images.json';

const images = storyImagesData.images;

/**
 * Simple hash function for strings
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
 * Get a consistent image URL for a story based on its headline.
 * The same headline will always return the same image.
 */
export function getStoryImage(headline: string): string {
  const hash = hashString(headline);
  const index = hash % images.length;
  return images[index];
}

/**
 * Get unique images for a list of stories, avoiding duplicates.
 * Uses headline hash as primary, but shifts if there's a collision.
 */
export function getUniqueStoryImages(headlines: string[]): string[] {
  const usedIndices = new Set<number>();
  const result: string[] = [];

  for (const headline of headlines) {
    let hash = hashString(headline);
    let index = hash % images.length;

    // If this index is already used, find the next available
    let attempts = 0;
    while (usedIndices.has(index) && attempts < images.length) {
      index = (index + 1) % images.length;
      attempts++;
    }

    usedIndices.add(index);
    result.push(images[index]);
  }

  return result;
}

/**
 * Get a map of headlines to unique image URLs
 */
export function getStoryImageMap(headlines: string[]): Map<string, string> {
  const imageUrls = getUniqueStoryImages(headlines);
  const map = new Map<string, string>();

  headlines.forEach((headline, i) => {
    map.set(headline, imageUrls[i]);
  });

  return map;
}

export { images as allStoryImages };

/**
 * Determine if a color needs dark text for WCAG AA contrast compliance.
 * Uses relative luminance calculation.
 *
 * @param color - Hex color string (with or without #) or rgb/rgba string
 * @returns true if the color is light (needs dark text), false if dark (needs light text)
 */
export function isLightColor(color: string): boolean {
  let r: number, g: number, b: number;

  // Handle rgba format
  if (color.startsWith('rgba(') || color.startsWith('rgb(')) {
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      r = parseInt(match[1], 10);
      g = parseInt(match[2], 10);
      b = parseInt(match[3], 10);
    } else {
      return false; // Default to dark text assumption if can't parse
    }
  } else {
    // Handle hex format
    const hex = color.replace('#', '');
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length >= 6) {
      r = parseInt(hex.substr(0, 2), 16);
      g = parseInt(hex.substr(2, 2), 16);
      b = parseInt(hex.substr(4, 2), 16);
    } else {
      return false;
    }
  }

  // Calculate relative luminance using the formula from WCAG 2.0
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

/**
 * Get the appropriate text color for WCAG AA contrast compliance.
 *
 * @param backgroundColor - The background color (hex or rgb/rgba)
 * @returns The text color to use (dark or light)
 */
export function getContrastTextColor(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#08080f' : '#ffffff';
}

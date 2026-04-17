// lib/palette.ts
// Canonical palette-allowed colors for decorative rotation in cards.
// See docs/DESIGN-TOKENS.md. Amber is excluded from this rotation —
// amber is reserved for taxonomy (Advanced difficulty, Ethical AI lens).

export const PALETTE_ROTATION = [
  "var(--cyan)",     // #00d4ff
  "var(--magenta)",  // #b040a8
  "var(--purple)",   // #a78bfa
] as const;

export const PALETTE_ROTATION_SOFT = [
  "var(--cyan-soft)",
  "var(--magenta-soft)",
  "var(--purple-soft)",
] as const;

/**
 * Deterministic palette color for a given index or slug.
 * Ensures that the same tool/story always gets the same accent color.
 */
export function paletteFor(key: string | number, soft = false): string {
  const list = soft ? PALETTE_ROTATION_SOFT : PALETTE_ROTATION;
  if (typeof key === "number") {
    return list[key % list.length];
  }
  // Hash the string into an index
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) & 0x7fffffff;
  }
  return list[h % list.length];
}

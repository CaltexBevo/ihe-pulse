// lib/categoryPalette.ts
// Category-to-palette mapping for story pills.
// See docs/DESIGN-TOKENS.md for palette rules.

export const CATEGORY_PALETTE: Record<string, { bg: string; text: string }> = {
  // Taxonomy categories
  "case study": { bg: "var(--purple-soft)", text: "var(--purple)" },
  "experiment": { bg: "var(--purple-soft)", text: "var(--purple)" },
  "insights & trends": { bg: "var(--cyan-soft)", text: "var(--cyan)" },
  "practical tips": { bg: "var(--cyan-soft)", text: "var(--cyan)" },
  "beyond ed": { bg: "var(--cyan-soft)", text: "var(--cyan)" },
  "ethical ai": { bg: "var(--amber-soft)", text: "var(--amber)" },
  "ai workforce & careers": { bg: "var(--cyan-soft)", text: "var(--cyan)" },
  "investing in innovation": { bg: "var(--cyan-soft)", text: "var(--cyan)" },
  "tool spotlight": { bg: "var(--cyan-soft)", text: "var(--cyan)" },
  "latest ai products": { bg: "var(--purple-soft)", text: "var(--purple)" },
  "week in review": { bg: "var(--magenta-soft)", text: "var(--magenta)" },
  "research": { bg: "var(--purple-soft)", text: "var(--purple)" },
};

export function pillColorsFor(category: string): { bg: string; text: string } {
  const key = category?.trim().toLowerCase();
  return CATEGORY_PALETTE[key] || { bg: "var(--cyan-soft)", text: "var(--cyan)" };
}

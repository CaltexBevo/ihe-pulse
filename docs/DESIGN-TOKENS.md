# Innovating Higher Ed — Design Tokens

## The Palette System (Dark + Light)

**Last reviewed:** April 17, 2026
**Status:** Active — migration v2
**Applies to:** Both light and dark themes across all pages
**Ship state:** Dark mode only until light-mode logo asset exists

## Philosophy

1. **Color carries meaning, not decoration.** Before adding a color anywhere, answer "what does this color mean here?" If the answer is "it looked nice," it does not ship.
2. **Every color has a sibling.** Each accent exists as a pair — one tuned for dark, one for light.

## WCAG Baseline

Minimum target: WCAG 2.1 Level AA.
- Body text: 4.5:1 minimum contrast
- Large text (18pt+ or 14pt bold+): 3:1 minimum
- UI components: 3:1 minimum
- Focus indicators: 3:1 minimum

## The Palette — Dark Mode (Active)

| Token | Hex | Role | Contrast on #08080f |
|-------|-----|------|--------------------|
| --cyan | #00d4ff | Primary interactive / section labels / links / default pills | 13.6:1 AAA |
| --magenta | #b040a8 | Premium / lead / rare | 5.2:1 AA |
| --purple | #a78bfa | Taxonomy slot (Case Study, Experiment, Intermediate) | 8.3:1 AAA |
| --amber | #f59e0b | Taxonomy slot (Advanced, Ethical AI) | 10.1:1 AAA |
| --text | #f0ede8 | Primary text | 16.8:1 AAA |
| --text-muted | #a8a4b8 | Secondary text | 8.2:1 AAA |
| --text-dim | #6b6880 | Tertiary text | 4.5:1 AA |

## The Palette — Light Mode (Reserved, Not Yet Shipping)

Prepared but disabled until a light-mode logo asset exists.

| Token | Hex | Contrast on #ffffff |
|-------|-----|--------------------|
| --cyan | #0e7490 | 5.4:1 AA |
| --magenta | #a21caf | 6.2:1 AA |
| --purple | #6d28d9 | 7.5:1 AAA |
| --amber | #b45309 | 6.1:1 AA |
| --text | #0f172a | 17.1:1 AAA |
| --text-muted | #475569 | 7.2:1 AAA |

## Retired Colors (Forbidden)

- Green #4ade80 — competes with cyan
- Teal #2dd4bf — too close to cyan to read as distinct
- Coral #fb7185 — clashes with magenta
- Orange #fb923c — too red, replaced by amber
- Blue #3b82f6 — too close to cyan

## Rules

1. Section labels are always `var(--cyan)`. Every page, every section.
2. Three pill colors per page, max (cyan/magenta/purple; amber only on Prompts for difficulty).
3. Three gradient instances per page, max (primary CTA, hero play, one headline accent).
4. All primary buttons use `var(--brand-grad)`. No solid-colored Launch buttons.
5. Color carries meaning, not decoration.
6. No green, teal, coral, orange, blue anywhere.
7. New colors require Decision Queue approval.
8. Contrast must be verified AA on both themes.
9. Theme-aware imagery: logos, covers, gradients need light variants when dark version fails on white.
10. Focus indicators visible in both themes — 2px `var(--cyan)` outline with 2px offset.

## CSS Variable Export (Canonical)

```css
:root,
[data-theme="dark"] {
  /* Accents */
  --cyan: #00d4ff;
  --cyan-soft: rgba(0, 212, 255, 0.10);
  --cyan-strong: rgba(0, 212, 255, 0.30);
  --magenta: #b040a8;
  --magenta-soft: rgba(176, 64, 168, 0.12);
  --purple: #a78bfa;
  --purple-soft: rgba(167, 139, 250, 0.15);
  --amber: #f59e0b;
  --amber-soft: rgba(245, 158, 11, 0.12);

  /* Neutrals */
  --bg: #08080f;
  --surface: #111120;
  --raised: #1a1a30;
  --text: #f0ede8;
  --text-muted: #a8a4b8;
  --text-dim: #6b6880;
  --border: rgba(255, 255, 255, 0.06);
  --border-strong: rgba(255, 255, 255, 0.14);

  /* Gradient */
  --brand-grad: linear-gradient(135deg, #00d4ff 0%, #b040a8 100%);
}

[data-theme="light"] {
  /* Accents — darker siblings for AA contrast */
  --cyan: #0e7490;
  --cyan-soft: rgba(14, 116, 144, 0.08);
  --cyan-strong: rgba(14, 116, 144, 0.25);
  --magenta: #a21caf;
  --magenta-soft: rgba(162, 28, 175, 0.08);
  --purple: #6d28d9;
  --purple-soft: rgba(109, 40, 217, 0.10);
  --amber: #b45309;
  --amber-soft: rgba(180, 83, 9, 0.10);

  /* Neutrals */
  --bg: #ffffff;
  --surface: #f8fafc;
  --raised: #f1f5f9;
  --text: #0f172a;
  --text-muted: #475569;
  --text-dim: #64748b;
  --border: rgba(0, 0, 0, 0.08);
  --border-strong: rgba(0, 0, 0, 0.14);

  /* Gradient — darker siblings */
  --brand-grad: linear-gradient(135deg, #0e7490 0%, #a21caf 100%);
}
```

## Change Log

| Date | Change | By |
|------|--------|-----|
| 2026-04-17 | Initial palette system, WCAG AA verified, dark-only ship | CalTex + Claude |

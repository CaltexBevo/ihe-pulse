# Fix: Update remaining pages, nav text, and font consistency

## CONTEXT
The merged prototype at `~/Desktop/ihe-pulse/ihe-complete-prototype.html` has these issues:
1. **Nav text:** Change "AI App Directory" to "AI Tools" in the navigation menu
2. **Prompts page (page-prompts):** Showing OLD version — needs the engagement-enriched v4 with difficulty badges, before/after previews, use case tags, collapsible references
3. **Podcast page (page-podcast):** Showing old version — needs updated font (Outfit) and heading style
4. **Tinker Lab page (page-tinkerlab):** Same — old fonts/heading style
5. **About page (page-about):** Same — old fonts/heading style
6. **ALL page headings** must use the same font/style: Outfit, font-weight 800, clean sans-serif with the cyan-to-magenta gradient for emphasis words. NO serif fonts, NO Space Grotesk, NO different heading styles between pages.

The source for the correct Prompt Navigator is: `~/Desktop/ihe-pulse/Prototypes/prompt-navigator-v4.html`

**Do NOT stop for confirmation. Execute everything in one pass.**

## STEP 1: Fix the nav
In the global navigation, change any reference to "AI App Directory" or "AI Directory" in the nav LINK TEXT to "AI Tools". The page hero title can remain "AI App Directory" — only the NAV link changes.

## STEP 2: Replace the Prompts page content
Read `~/Desktop/ihe-pulse/Prototypes/prompt-navigator-v4.html` and extract ALL content and functionality. Replace the `page-prompts` section in the prototype with the v4 version.

The v4 Prompt Navigator MUST include:
- 9 technique cards with: difficulty badges (Beginner/Intermediate/Advanced), "Start Here" badges on first 3, one-sentence hook, use case tags, before/after prompt comparison (red vs green boxes), color-coded accent strips, expand to show Definition/Use Case/When/Why/Example Prompts
- 15 template cards with mono-font prompt preview visible before clicking
- 6 common problems with fixes
- 8-step refinement workflow + 7-item tuning checklist
- 19 references collapsed by default with click-to-expand
- Copy-to-clipboard on all prompts

Adapt it to work within the SPA structure (use the existing page wrapper, don't add a duplicate nav).

## STEP 3: Update ALL page heading styles
Every page hero heading in the prototype must follow this exact pattern:

```css
/* This is the ONLY heading style allowed */
font-family: 'Outfit', system-ui, sans-serif;
font-weight: 800;
font-size: clamp(2rem, 4vw, 2.8rem);
line-height: 1.1;
letter-spacing: -0.02em;
```

Gradient emphasis words use:
```css
background: linear-gradient(135deg, #00d4ff, #c850c0);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

Check EVERY page heading (page-pulse, page-podcast, page-tools, page-prompts, page-tinkerlab, page-started, page-cases, page-community, page-about) and ensure they ALL use Outfit 800 weight. Remove any page-specific heading font overrides.

## STEP 4: Font cleanup
- Ensure the Google Fonts import includes: `Outfit:wght@300;400;500;600;700;800` and `DM+Mono:wght@400;500`
- Remove any imports of Space Grotesk, JetBrains Mono, Playfair Display, or other old fonts
- The body font-family should be: `'Outfit', system-ui, sans-serif`

## STEP 5: Run QA
Run the QA agent to verify everything:
```bash
bash ~/Desktop/ihe-pulse/IHE-QA-AGENT.sh
```
Or if the QA file is markdown, follow the checks in `~/Desktop/ihe-pulse/IHE-QA-AGENT.md`

If QA agent isn't available, manually verify:
- 38 tools in directory
- 19 references in prompts
- 9 techniques with difficulty badges and before/after previews
- 15 templates with prompt previews
- All page headings use Outfit 800
- Nav says "AI Tools" not "AI App Directory"
- Zero "IHE Pulse" branding

## STEP 6: Commit
```bash
cd ~/Desktop/ihe-pulse
git add -A
git commit -m "Fix: Updated nav text, replaced Prompts with v4, standardized heading fonts across all pages"
git push
```

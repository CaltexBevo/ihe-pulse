# CRITICAL FIX: Global Padding Reset Killing All Tailwind Utilities

## THE PROBLEM

In `app/globals.css`, there is a CSS rule like this sitting OUTSIDE of any `@layer`:

```css
*, ::before, ::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

Because this rule is **unlayered** (top-level), it has HIGHER CSS specificity than all Tailwind utility classes which live inside `@layer utilities`. This means EVERY Tailwind padding class (`p-4`, `px-6`, `px-8`, `py-4`, etc.) across the ENTIRE site is being silently overridden to `0px`.

This is why all text is jammed against container edges on every single page.

## THE FIX

Open `app/globals.css` and find the `*` reset rule. It will look something like:

```css
*, ::before, ::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

**Option A (Recommended): Move it inside @layer base**

Wrap it in `@layer base` so Tailwind utilities can override it:

```css
@layer base {
  *, ::before, ::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
}
```

**Option B: Remove the padding: 0 line**

If moving to @layer base causes issues, simply remove the `padding: 0` line:

```css
*, ::before, ::after {
  box-sizing: border-box;
  margin: 0;
  /* padding: 0 removed — Tailwind handles its own resets */
}
```

## ALSO CHECK

There may be OTHER unlayered rules in globals.css that override Tailwind. After fixing the `*` reset, search for any other unlayered rules that set `margin: 0` or `padding: 0` on broad selectors:

```bash
cd /Volumes/Bevo_2TB/ihe-pulse
grep -n "padding.*0\|margin.*0" app/globals.css | head -20
```

Make sure ALL reset-style rules are inside `@layer base`, not floating at the top level.

## ALSO CHECK: TAILWIND CONFIG

Check if the project is using Tailwind v4 (which uses `@import "tailwindcss"` instead of `@tailwind base/components/utilities`). If it's Tailwind v4, the layer ordering may need adjustment.

Look at the top of `app/globals.css` for:
```css
@import "tailwindcss";
```
vs the older:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

If it's Tailwind v4 with `@import "tailwindcss"`, ensure that ALL custom CSS comes AFTER the import, and all resets are inside `@layer base`.

## VERIFY THE FIX

After making the change:

```bash
cd /Volumes/Bevo_2TB/ihe-pulse
npm run build
```

Then check in the browser: open https://ihe-pulse.vercel.app/ and verify that:
1. Story cards have visible padding inside them (text not touching edges)
2. Section containers have left/right padding (content not edge-to-edge)
3. The Innovation Pulse hero quote has proper inner padding
4. Navigation has proper spacing

Quick JS check in browser console:
```javascript
// This should NOT return "0px"
const test = document.createElement('div');
test.className = 'p-4';
document.body.appendChild(test);
console.log('p-4 padding:', getComputedStyle(test).padding);
document.body.removeChild(test);
// Expected: "16px" — if it says "0px", the fix didn't work
```

## COMMIT & DEPLOY

```bash
cd /Volumes/Bevo_2TB/ihe-pulse
git add -A
git commit -m "fix: Critical — move CSS reset inside @layer base so Tailwind padding utilities work"
git push origin main
```

**This single fix will resolve the padding issue on EVERY page simultaneously.**

GO. Fix it now. Don't stop.

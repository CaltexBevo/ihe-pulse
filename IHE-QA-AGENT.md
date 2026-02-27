# IHE Quality Assurance Agent — Run After Every Build

## PURPOSE
This QA agent verifies that ALL established design decisions and content requirements are preserved after any build, merge, or update. Run this check after EVERY change to ihe-complete-prototype.html.

**Execute all checks silently. Only report FAILURES. If everything passes, say "QA PASSED — all checks green."**

## FILE TO CHECK
`~/Desktop/ihe-pulse/ihe-complete-prototype.html`

## BRANDING CHECKS
```bash
echo "=== BRANDING ==="
# FAIL if "IHE Pulse" or "IHE PULSE" or "ihe-pulse" appears in visible text (not file paths)
PULSE_COUNT=$(grep -i "ihe.pulse\|IHE PULSE" ~/Desktop/ihe-pulse/ihe-complete-prototype.html | grep -v "ihe-pulse.vercel\|ihe-pulse/" | wc -l)
[ "$PULSE_COUNT" -gt 0 ] && echo "FAIL: Found $PULSE_COUNT 'IHE Pulse' branding references" || echo "PASS: No IHE Pulse branding"

# PASS if "Innovating Higher Ed" appears
IHE_COUNT=$(grep -c "Innovating Higher" ~/Desktop/ihe-pulse/ihe-complete-prototype.html)
[ "$IHE_COUNT" -gt 0 ] && echo "PASS: Found $IHE_COUNT 'Innovating Higher Ed' references" || echo "FAIL: Missing 'Innovating Higher Ed' branding"

# Nav should say "AI Tools" not "AI App Directory"
NAV_TOOLS=$(grep -c "AI Tools" ~/Desktop/ihe-pulse/ihe-complete-prototype.html)
echo "Nav 'AI Tools' refs: $NAV_TOOLS"
```

## FONT CHECKS
```bash
echo "=== FONTS ==="
# MUST use Outfit font
grep -q "Outfit" ~/Desktop/ihe-pulse/ihe-complete-prototype.html && echo "PASS: Outfit font present" || echo "FAIL: Outfit font missing"

# MUST use DM Mono for code/mono
grep -q "DM Mono" ~/Desktop/ihe-pulse/ihe-complete-prototype.html && echo "PASS: DM Mono font present" || echo "FAIL: DM Mono font missing"

# FAIL if Space Grotesk or JetBrains Mono used (old fonts)
grep -qi "Space Grotesk\|JetBrains" ~/Desktop/ihe-pulse/ihe-complete-prototype.html && echo "FAIL: Old fonts (Space Grotesk/JetBrains) still present" || echo "PASS: No old fonts"

# FAIL if serif fonts used for headings (Playfair, Georgia, Times)  
grep -qi "Playfair\|serif" ~/Desktop/ihe-pulse/ihe-complete-prototype.html && echo "WARNING: Serif font reference found — verify not used for headings" || echo "PASS: No serif fonts"
```

## AI DIRECTORY CHECKS
```bash
echo "=== AI DIRECTORY ==="
# Must have exactly 38 tools
TOOL_COUNT=$(python3 -c "
import re
with open('$HOME/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    c = f.read()
# Count tool entries in the DIR_TOOLS or TOOLS array
tools = re.findall(r'id:\"[^\"]+\",\s*name:\"([^\"]+)\"', c) or re.findall(r'\"id\":\s*\"[^\"]+\",\s*\"name\":\s*\"([^\"]+)\"', c)
print(len(tools))
")
[ "$TOOL_COUNT" -eq 38 ] && echo "PASS: $TOOL_COUNT tools (expected 38)" || echo "FAIL: $TOOL_COUNT tools (expected 38)"

# Must have 5 tools with full editorial content
EDITORIAL=$(python3 -c "
import re
with open('$HOME/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    c = f.read()
full = len(re.findall(r'bestFor:\"[^\"]+\"', c)) or len(re.findall(r'\"bestFor\":\s*\"[^\"]+\"', c))
print(full)
")
[ "$EDITORIAL" -ge 5 ] && echo "PASS: $EDITORIAL tools with full editorial (expected 5+)" || echo "FAIL: $EDITORIAL tools with editorial (expected 5+)"

# Must have brand-colored accents (unique hex colors)
ACCENTS=$(python3 -c "
import re
with open('$HOME/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    c = f.read()
accents = set(re.findall(r'accent:\"(#[0-9a-fA-F]{6})\"', c) or re.findall(r'\"accent\":\s*\"(#[0-9a-fA-F]{6})\"', c))
print(len(accents))
")
[ "$ACCENTS" -ge 20 ] && echo "PASS: $ACCENTS unique accent colors" || echo "FAIL: Only $ACCENTS accent colors (expected 20+)"

# Must have 3 value points per tool
echo "Checking value points..."
python3 -c "
import re
with open('$HOME/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    c = f.read()
values = re.findall(r'values:\[([^\]]+)\]', c)
bad = 0
for v in values:
    items = re.findall(r'\"[^\"]+\"', v)
    if len(items) < 3:
        bad += 1
if bad == 0:
    print(f'PASS: All {len(values)} tools have 3+ value points')
else:
    print(f'FAIL: {bad} tools have fewer than 3 value points')
"

# Must have badges (new, trending, updated)
echo "Checking badges..."
python3 -c "
import re
with open('$HOME/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    c = f.read()
new = len(re.findall(r'badge:\"new\"', c))
trending = len(re.findall(r'badge:\"trending\"', c))
updated = len(re.findall(r'badge:\"updated\"', c))
print(f'Badges — New:{new} Trending:{trending} Updated:{updated}')
if new + trending + updated >= 10:
    print('PASS: Badges present')
else:
    print(f'FAIL: Only {new+trending+updated} badges (expected 10+)')
"
```

## PROMPT NAVIGATOR CHECKS
```bash
echo "=== PROMPT NAVIGATOR ==="
# Must have 9 techniques
python3 -c "
import re
with open('$HOME/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    c = f.read()
techs = ['Zero-Shot', 'Few-Shot', 'System & Role', 'Context Injection', 'Step-Back', 'Chain-of-Thought', 'Self-Consistency', 'Tree-of-Thought', 'ReAct']
missing = [t for t in techs if t not in c]
if not missing:
    print('PASS: All 9 techniques present')
else:
    print(f'FAIL: Missing techniques: {missing}')
"

# Must have difficulty badges
python3 -c "
import re
with open('$HOME/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    c = f.read()
beg = c.count('beginner')
inter = c.count('intermediate')
adv = c.count('advanced')
start = c.count('Start Here') or c.count('start:true')
print(f'Difficulty badges — Beginner:{beg} Intermediate:{inter} Advanced:{adv} StartHere:{start}')
if beg >= 3 and inter >= 3 and adv >= 3:
    print('PASS: Difficulty badges present')
else:
    print('FAIL: Missing difficulty badges')
"

# Must have before/after previews
python3 -c "
with open('$HOME/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    c = f.read()
bad = c.count('Without technique') or c.count('ba-bad') or c.count('ba_bad')
good = c.count('With technique') or c.count('ba-good') or c.count('ba_good')
if bad >= 9 and good >= 9:
    print(f'PASS: Before/after previews present ({bad}/{good})')
else:
    print(f'FAIL: Before/after previews incomplete ({bad}/{good}, expected 9/9)')
"

# Must have 15 templates
python3 -c "
import re
with open('$HOME/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    c = f.read()
tmpls = re.findall(r't:\"([^\"]+)\",d:\"[^\"]+\",cat:', c) or re.findall(r'\"t\":\s*\"([^\"]+)\"', c)
print(f'Templates: {len(tmpls)}')
if len(tmpls) >= 15:
    print('PASS: 15+ templates')
else:
    print(f'FAIL: Only {len(tmpls)} templates (expected 15)')
"

# Must have 6 problems, 8 workflow steps, 7 checklist items
python3 -c "
import re
with open('$HOME/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    c = f.read()
# Problems
probs = len(re.findall(r't:\"[^\"]+\",d:\"[^\"]+\",f:\"', c)) or c.count('problem-card') or c.count('pn-problem')
# References
refs = len(re.findall(r'type:\"[^\"]+\",title:\"', c)) or len(re.findall(r'\"type\":\s*\"[^\"]+\",\s*\"title\"', c))
print(f'Problems: {probs} (expected 6)')
print(f'References: {refs} (expected 19)')
if probs >= 6: print('PASS: Problems')
else: print('FAIL: Problems')
if refs >= 19: print('PASS: References')
else: print(f'FAIL: Only {refs} references (expected 19)')
"

# References must be collapsed by default
python3 -c "
with open('$HOME/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    c = f.read()
if 'max-height:0' in c or 'ref-open' in c or 'collapsed' in c.lower():
    print('PASS: References appear collapsible')
else:
    print('WARNING: References may not be collapsed by default — verify manually')
"
```

## PAGE COMPLETENESS CHECKS
```bash
echo "=== PAGES ==="
python3 -c "
with open('$HOME/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    c = f.read()

pages = {
    'Portal Homepage': 'page-portal',
    'Innovation Pulse': 'page-pulse',
    'Podcast': 'page-podcast',
    'AI Tools': 'page-tools',
    'Prompts': 'page-prompts',
    'Tinker Lab': 'page-tinkerlab',
    'Getting Started': 'page-started',
    'Case Studies': 'page-cases',
    'Community': 'page-community',
    'About': 'page-about',
}

for name, pid in pages.items():
    if pid in c:
        print(f'PASS: {name} ({pid})')
    else:
        print(f'FAIL: {name} ({pid}) MISSING')

# Check for episode detail pages
for i in range(1, 8):
    pid = f'page-ep-{i}'
    if pid in c:
        print(f'PASS: Episode {i} detail page')
    else:
        print(f'FAIL: Episode {i} detail page MISSING')

# Check for tinker lab detail pages
for i in range(1, 3):
    pid = f'page-tinker-{i}'
    if pid in c:
        print(f'PASS: Tinker Lab post {i} detail page')
    else:
        print(f'FAIL: Tinker Lab post {i} detail page MISSING')
"
```

## HEADING FONT CONSISTENCY
```bash
echo "=== HEADING STYLE ==="
# All page hero headings should use the same pattern
python3 -c "
with open('$HOME/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    c = f.read()
# Check that headings use Outfit (inherited from body) not any other font
import re
# Look for any h1/h2 with explicit font-family override
overrides = re.findall(r'h[12][^{]*\{[^}]*font-family[^}]*\}', c)
if not overrides:
    print('PASS: No heading font overrides (using global Outfit)')
else:
    for o in overrides:
        if 'Outfit' in o:
            print('PASS: Heading uses Outfit')
        else:
            print(f'WARNING: Heading font override found: {o[:80]}')
"
```

## SUMMARY
```bash
echo ""
echo "========================================="
echo "  QA CHECK COMPLETE"
echo "========================================="
echo "Review any FAIL or WARNING items above."
echo "If all PASS, the build is verified."
```

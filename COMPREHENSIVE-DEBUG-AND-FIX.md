# COMPREHENSIVE FIX: Debug and repair all page rendering issues

## CONTEXT
The file `~/Desktop/ihe-pulse/ihe-complete-prototype.html` is a single-page application with 10 pages. Currently, clicking "Prompts", "Tinker Lab", and "About" in the nav shows blank pages. The content HTML exists in the file but is not rendering visually. The AI Tools page was recently fixed (old duplicate content removed) and works. Other pages may have similar issues.

**You have FULL PERMISSION to execute everything without stopping. Do not pause for confirmation. Debug, fix, and verify in one continuous pass.**

## PHASE 1: DIAGNOSIS

Run ALL of these diagnostics and report findings before making any changes:

### 1A: Check for duplicate IDs (causes getElementById to fail)
```bash
python3 << 'PYEOF'
import re
from collections import Counter

with open('/Users/$USER/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    content = f.read()

ids = re.findall(r'id="([^"]+)"', content)
dupes = {k: v for k, v in Counter(ids).items() if v > 1}
if dupes:
    print("DUPLICATE IDs FOUND (this breaks getElementById):")
    for id_name, count in dupes.items():
        print(f"  {id_name}: {count} occurrences")
        # Show line numbers
        for i, line in enumerate(content.split('\n'), 1):
            if f'id="{id_name}"' in line:
                print(f"    Line {i}: {line.strip()[:100]}")
else:
    print("No duplicate IDs found")
PYEOF
```

### 1B: Check HTML nesting integrity for each page div
```bash
python3 << 'PYEOF'
import re

with open('/Users/$USER/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    lines = f.readlines()
    content = ''.join(lines)

pages = ['page-portal','page-pulse','page-podcast','page-tools','page-prompts','page-tinkerlab','page-started','page-cases','page-community','page-about']

for page_id in pages:
    # Find start line
    start_line = None
    for i, line in enumerate(lines):
        if f'id="{page_id}"' in line:
            start_line = i
            break
    
    if start_line is None:
        print(f"MISSING: {page_id}")
        continue
    
    # Count div opens/closes from start to find where this page div actually closes
    depth = 0
    end_line = None
    for i in range(start_line, len(lines)):
        depth += lines[i].count('<div')
        depth -= lines[i].count('</div')
        if depth <= 0 and i > start_line:
            end_line = i
            break
    
    if end_line:
        line_count = end_line - start_line
        print(f"OK: {page_id} — lines {start_line+1} to {end_line+1} ({line_count} lines)")
    else:
        print(f"BROKEN: {page_id} — starts at line {start_line+1} but never closes (unclosed div!)")
PYEOF
```

### 1C: Check if JS rendering functions exist and are called
```bash
python3 << 'PYEOF'
with open('/Users/$USER/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    content = f.read()

# Check function definitions
functions = ['renderPnTechs', 'renderPnTemplates', 'renderPnProblems', 'renderPnWorkflow', 'renderPnChecklist', 'renderPnRefs', 'initPn', 'renderDir', 'buildDirCatFilters', 'initDirEvents', 'showPage']
for fn in functions:
    defined = f'function {fn}' in content
    called = content.count(f'{fn}(') - (1 if defined else 0)  # subtract the definition
    print(f"{'OK' if defined else 'MISSING'}: {fn}() — defined: {defined}, called: {called} times")

# Check the showPage override
if 'originalShowPage' in content:
    print("\nshowPage override exists (wraps original)")
    # Check if it properly calls the original
    if 'originalShowPage(pageId)' in content or 'originalShowPage(id)' in content:
        print("  OK: Calls original showPage")
    else:
        print("  WARNING: May not call original showPage correctly")

# Check DOMContentLoaded
dom_ready = content.count('DOMContentLoaded')
print(f"\nDOMContentLoaded listeners: {dom_ready}")

# Check if initPn is called in DOMContentLoaded
dom_block_start = content.rfind('DOMContentLoaded')
dom_area = content[dom_block_start:dom_block_start+500]
if 'initPn' in dom_area:
    print("OK: initPn called in DOMContentLoaded")
else:
    print("WARNING: initPn NOT called in DOMContentLoaded")
PYEOF
```

### 1D: Check for CSS issues that could hide content
```bash
python3 << 'PYEOF'
with open('/Users/$USER/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    content = f.read()

# Extract the style block
style_start = content.find('<style>') + 7
style_end = content.find('</style>')
css = content[style_start:style_end]

# Check page visibility rules
if '.page {' in css:
    # Find the rule
    idx = css.find('.page {')
    rule = css[idx:css.find('}', idx)+1]
    print(f"Page base rule: {rule.strip()}")

if '.page.active' in css:
    idx = css.find('.page.active')
    rule = css[idx:css.find('}', idx)+1]
    print(f"Active rule: {rule.strip()}")

# Check for any pn- class overrides that might hide content
pn_display_none = [line.strip() for line in css.split('\n') if 'pn-' in line and 'display' in line and 'none' in line]
if pn_display_none:
    print(f"\nPN classes with display:none: {pn_display_none}")

# Check for max-height:0 that might collapse content
pn_max_height = [line.strip() for line in css.split('\n') if 'pn-' in line and 'max-height' in line and '0' in line]
if pn_max_height:
    print(f"PN classes with max-height:0: {pn_max_height}")

# Check if pn-ref-open class exists (needed to expand refs)
if 'pn-ref-open' in css:
    print("OK: pn-ref-open class exists")
else:
    print("WARNING: pn-ref-open class may be missing")
PYEOF
```

### 1E: Test page rendering in a headless check
```bash
python3 << 'PYEOF'
with open('/Users/$USER/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    content = f.read()

# Check if key data arrays have content
import re

# PN_TECHS
techs = re.findall(r'n:"([^"]+)"', content[content.find('PN_TECHS'):content.find('PN_TEMPLATES')] if 'PN_TECHS' in content else '')
print(f"PN_TECHS entries: {len(techs)}")
for t in techs[:3]:
    print(f"  {t}")

# PN_TEMPLATES
tmpls = re.findall(r't:"([^"]+)",d:', content[content.find('PN_TEMPLATES'):content.find('PN_PROBLEMS')] if 'PN_TEMPLATES' in content else '')
print(f"\nPN_TEMPLATES entries: {len(tmpls)}")

# PN_PROBLEMS
probs = re.findall(r't:"([^"]+)",d:', content[content.find('PN_PROBLEMS'):content.find('PN_PROBLEMS')+3000] if 'PN_PROBLEMS' in content else '')
print(f"PN_PROBLEMS entries: {len(probs)}")

# DIR_TOOLS
tools = re.findall(r'id:"([^"]+)",\s*name:"([^"]+)"', content[content.find('DIR_TOOLS'):] if 'DIR_TOOLS' in content else '')
print(f"\nDIR_TOOLS entries: {len(tools)}")

# Check PN_REFS
refs = re.findall(r'type:"([^"]+)",title:', content[content.find('PN_REFS'):] if 'PN_REFS' in content else '')
print(f"PN_REFS entries: {len(refs)}")
PYEOF
```

## PHASE 2: FIX

Based on the diagnosis above, apply ALL necessary fixes. Common issues to check for and fix:

### Fix A: If duplicate IDs exist
Remove the duplicate elements, keeping only the ones inside the correct page divs.

### Fix B: If HTML nesting is broken (unclosed divs)
The removal of old content may have broken the div nesting structure. Count opening and closing div tags to find mismatches and fix them. The page div structure MUST be:
```html
<div class="page" id="page-tools">
  ...content...
</div>

<div class="page" id="page-prompts">
  ...content...
</div>
```
Each page div must properly open and close before the next one starts.

### Fix C: If JS functions aren't being called
The `showPage` override and `DOMContentLoaded` listener at the end of the file must call `initPn()` and `renderDir()`. Make sure:
1. `initPn()` is called both in `DOMContentLoaded` AND when navigating to the prompts page
2. `renderDir()`, `buildDirCatFilters()`, `initDirEvents()` are called both in `DOMContentLoaded` AND when navigating to tools page
3. The `showPage` override properly calls the original `showPage` function for page visibility toggling

### Fix D: Ensure the showPage override works correctly
The override pattern should be:
```javascript
// Save original
const _origShowPage = showPage;

// Override
function showPage(id) {
    // Call original for page toggling
    _origShowPage(id);
    
    // Initialize content when pages become visible
    if (id === 'tools') {
        setTimeout(() => { buildDirCatFilters(); renderDir(); initDirEvents(); }, 50);
    } else if (id === 'prompts') {
        setTimeout(initPn, 50);
    }
}
```

NOTE: If the original `showPage` is being captured as `undefined` because of hoisting issues, just inline the page-switching logic directly instead of trying to wrap it.

### Fix E: Make sure all pages render on first load too
Add to DOMContentLoaded:
```javascript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all JS-rendered content
    buildDirCatFilters();
    renderDir();
    initDirEvents();
    initPn();
});
```

## PHASE 3: VERIFY

After applying fixes, run this comprehensive verification:

```bash
python3 << 'PYEOF'
import re
from collections import Counter

with open('/Users/$USER/Desktop/ihe-pulse/ihe-complete-prototype.html') as f:
    content = f.read()

print("=" * 50)
print("COMPREHENSIVE QA VERIFICATION")
print("=" * 50)

errors = 0

# 1. No duplicate IDs
ids = re.findall(r'id="([^"]+)"', content)
dupes = {k: v for k, v in Counter(ids).items() if v > 1}
if dupes:
    print(f"FAIL: Duplicate IDs: {dupes}")
    errors += 1
else:
    print("PASS: No duplicate IDs")

# 2. All 10 pages exist
pages = ['page-portal','page-pulse','page-podcast','page-tools','page-prompts','page-tinkerlab','page-started','page-cases','page-community','page-about']
for p in pages:
    if f'id="{p}"' in content:
        print(f"PASS: {p}")
    else:
        print(f"FAIL: {p} MISSING")
        errors += 1

# 3. Content counts
tools = re.findall(r'id:"[^"]+",\s*name:"', content)
print(f"\n{'PASS' if len(tools) >= 38 else 'FAIL'}: DIR_TOOLS = {len(tools)} (need 38)")

techs_section = content[content.find('PN_TECHS'):content.find('PN_TEMPLATES')] if 'PN_TECHS' in content else ''
techs = re.findall(r'n:"[^"]+"', techs_section)
print(f"{'PASS' if len(techs) >= 9 else 'FAIL'}: PN_TECHS = {len(techs)} (need 9)")

tmpls = re.findall(r't:"[^"]+",d:"[^"]+",cat:', content)
print(f"{'PASS' if len(tmpls) >= 15 else 'FAIL'}: PN_TEMPLATES = {len(tmpls)} (need 15)")

refs = re.findall(r'type:"[^"]+",title:"[^"]+"', content)
print(f"{'PASS' if len(refs) >= 19 else 'FAIL'}: PN_REFS = {len(refs)} (need 19)")

# 4. Branding
pulse_refs = content.lower().count('ihe pulse') + content.lower().count('ihe-pulse')
# Exclude file paths
pulse_refs_real = len([l for l in content.split('\n') if ('ihe pulse' in l.lower() or 'ihe-pulse' in l.lower()) and 'file' not in l.lower() and 'src' not in l.lower() and '//' not in l])
print(f"\n{'PASS' if pulse_refs_real == 0 else 'FAIL'}: IHE Pulse branding refs = {pulse_refs_real}")

clearbit = content.count('clearbit')
print(f"{'PASS' if clearbit == 0 else 'FAIL'}: Clearbit refs = {clearbit}")

staff_pick = content.count('STAFF PICK')
print(f"{'PASS' if staff_pick == 0 else 'FAIL'}: Staff Pick refs = {staff_pick}")

# 5. JS functions
for fn in ['initPn', 'renderDir', 'showPage', 'buildDirCatFilters']:
    if f'function {fn}' in content or f'{fn} = function' in content:
        print(f"PASS: {fn}() defined")
    else:
        print(f"FAIL: {fn}() NOT defined")
        errors += 1

# 6. Key render targets exist (should have exactly 1 each)
targets = ['pnTechGrid', 'pnTmplList', 'pnProblemList', 'pnWfList', 'pnChecklist', 'pnRefList', 'dirToolGrid']
for t in targets:
    count = content.count(f'id="{t}"')
    if count == 1:
        print(f"PASS: #{t} exists (1 instance)")
    elif count == 0:
        print(f"FAIL: #{t} MISSING")
        errors += 1
    else:
        print(f"FAIL: #{t} has {count} instances (DUPLICATE)")
        errors += 1

# 7. Fonts
print(f"\n{'PASS' if 'Outfit' in content else 'FAIL'}: Outfit font")
print(f"{'PASS' if 'DM Mono' in content else 'FAIL'}: DM Mono font")

# 8. HTML structure — check that page divs don't overlap
lines = content.split('\n')
page_starts = {}
for i, line in enumerate(lines):
    for p in pages:
        if f'id="{p}"' in line:
            page_starts[p] = i

sorted_pages = sorted(page_starts.items(), key=lambda x: x[1])
print(f"\nPage order:")
for p, line in sorted_pages:
    print(f"  {p}: line {line+1}")

print(f"\n{'='*50}")
print(f"TOTAL ERRORS: {errors}")
if errors == 0:
    print("ALL CHECKS PASSED")
else:
    print(f"{errors} ISSUES NEED ATTENTION")
print(f"{'='*50}")
PYEOF
```

## PHASE 4: BROWSER TEST

After fixing, open the file in the default browser and manually verify:
```bash
open ~/Desktop/ihe-pulse/ihe-complete-prototype.html
```

Check:
1. Click every nav link — does each page show unique content?
2. AI Tools — do cards appear with brand colors?
3. Prompts — do technique cards appear with before/after previews?
4. Tinker Lab — does content appear?
5. About — does Dr. Jones bio appear?

## PHASE 5: COMMIT
```bash
cd ~/Desktop/ihe-pulse
git add ihe-complete-prototype.html
git commit -m "Fix: Debug and repair all page rendering issues — duplicate content, JS initialization, HTML nesting"
git push
```

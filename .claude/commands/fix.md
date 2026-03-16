---
description: Fix a specific bug or issue. Describe the problem as the argument.
allowed-tools: Bash(git:*), Read, Write, Edit, Glob
---

# Fix — Targeted Bug Fix

Don't stop. You have all permissions granted.

## Problem
$ARGUMENTS

## Workflow

1. **Understand**: Read PRODUCTION-RULES.md to check if there are relevant rules
2. **Find**: Locate the relevant files for this issue
3. **Fix**: Make the minimal change needed to fix the problem
4. **Verify**: Run `npm run build` to confirm no breakage
5. **Test**: If the dev server is running, check the affected page(s)
6. **Commit**:
```bash
git add -A
git commit -m "fix: $ARGUMENTS"
```

Do NOT push automatically — report what you fixed and let me decide whether to deploy.

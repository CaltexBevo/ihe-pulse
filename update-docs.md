---
description: Update CHANGELOG.md, ROADMAP.md, PRODUCTION-RULES.md with session work. Commit and push.
allowed-tools: Bash(git:*), Read, Write, Edit
---

# Update Docs — End of Session

Don't stop. You have all permissions granted. Execute everything autonomously.

## Instructions

You are updating the three source-of-truth documents for this project. Read each file first, then update with everything accomplished this session.

### 1. CHANGELOG.md
- Read the current file
- **PREPEND** a new entry at the TOP (never delete existing entries)
- Format: `## vX.X.X — [Today's Date] (Session: [Brief Description])`
- Include: what was built, fixed, deployed, or changed
- Include any bugs discovered but not yet fixed
- Include any lessons learned or production rules added

### 2. ROADMAP.md
- Read the current file
- Move completed items to the ✅ Completed section with today's date
- Update 🔥 Current with what's actively in progress
- Add any new items discovered this session to appropriate sections

### 3. PRODUCTION-RULES.md
- Read the current file
- Add any new rules, patterns, or standards established this session
- Update existing rules if they changed
- This is the single source of truth for all editorial and technical standards

### 4. Version Bump
- If significant features were added, bump the minor version in package.json
- If only fixes, bump the patch version
- If just docs/cleanup, skip the bump

### 5. Commit & Push
```bash
git add CHANGELOG.md ROADMAP.md PRODUCTION-RULES.md package.json
git commit -m "docs: update changelog, roadmap, production rules — [today's date]"
git push origin main
```

### 6. Confirm
Report what was updated and the commit hash.

$ARGUMENTS

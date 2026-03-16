---
description: Build, commit all changes, push to GitHub, and verify Vercel deployment
allowed-tools: Bash(git:*), Read, Write
---

# Quick Deploy — Build, Push, Verify

Don't stop. You have all permissions granted.

## 1. Build Check
```bash
npm run build 2>&1 | tail -20
```
If the build fails, STOP and report the errors. Do NOT push broken code.

## 2. Stage & Commit
```bash
git add -A
git status --short
```

If there are changes to commit:
```bash
git commit -m "$ARGUMENTS"
```
If no $ARGUMENTS provided, write a descriptive commit message based on the changed files.

## 3. Push
```bash
git push origin main
```

## 4. Wait & Verify
Wait 30 seconds for Vercel to deploy, then check:
```bash
sleep 30
curl -s -o /dev/null -w "HTTP Status: %{http_code} | Time: %{time_total}s\n" https://ihe-pulse.vercel.app
```

## 5. Report
- Commit hash
- Files changed
- Live site status
- Link: https://ihe-pulse.vercel.app

---
description: Read key project docs, check git branch, report current state of the IHE Pulse website
allowed-tools: Bash(git:*), Read, Glob
---

# Startup — IHE Pulse Website

Read the following files and internalize the current project state. Do NOT summarize them back to me unless I ask — just confirm you've read them and give a SHORT status report.

## 1. Read Key Docs
Read these files (skip any that don't exist):
- `CLAUDE.md`
- `CHANGELOG.md`
- `ROADMAP.md`
- `PRODUCTION-RULES.md`
- `package.json` (just name, version, scripts)

## 2. Check Git State
Run:
```bash
git branch --show-current
git status --short
git log --oneline -5
```

## 3. Check Vercel Deployment
Run:
```bash
curl -s -o /dev/null -w "%{http_code}" https://ihe-pulse.vercel.app
```

## 4. Report
Give me a SHORT status report (5-8 lines max):
- Current branch
- Any uncommitted changes
- Last 3 commits (one-liner each)
- Whether the live site is responding
- Any blockers or warnings from the docs

Then say: **"Ready. What are we building?"**

---
description: Verify Vercel deployment status, check live site, compare with local git state
allowed-tools: Bash(git:*), Read
---

# Deploy Check — IHE Pulse Website

Check the deployment status of the IHE Pulse website on Vercel.

## 1. Local Git State
```bash
echo "=== Local Branch ==="
git branch --show-current
echo ""
echo "=== Last Local Commit ==="
git log --oneline -1
echo ""
echo "=== Uncommitted Changes ==="
git status --short
echo ""
echo "=== Unpushed Commits ==="
git log origin/main..HEAD --oneline 2>/dev/null || echo "Could not compare with origin"
```

## 2. Live Site Check
```bash
echo "=== Live Site Status ==="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" https://ihe-pulse.vercel.app

echo ""
echo "=== Innovation Pulse Page ==="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://ihe-pulse.vercel.app/innovation-pulse

echo ""
echo "=== AI App Directory ==="
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" https://ihe-pulse.vercel.app/ai-directory
```

## 3. Report
Give a clear status:
- ✅ or ❌ for each check
- Whether local and deployed are in sync (same commit pushed)
- Any pages returning errors
- If there are unpushed commits, remind me to push

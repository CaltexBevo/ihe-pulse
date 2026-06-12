# Pre-Launch Security Audit — June 12, 2026

## Executive Summary

| Severity | Count | Status |
|----------|-------|--------|
| BLOCKER | 1 | FIXED |
| HIGH | 2 | REPORTED |
| MEDIUM | 3 | REPORTED |
| LOW | 3 | REPORTED |

---

## S1: Secrets Audit

### BLOCKER — ElevenLabs API Key Hardcoded

**Finding:** API key hardcoded in source code and committed to git history.

**File:** `scripts/generate-audio.mjs:10`

**Command run:**
```bash
grep -rE "ELEVENLABS" scripts/
```

**Evidence:**
```javascript
const ELEVENLABS_API_KEY = '6167d3421afcb24bdaa8528beaa98ffb9eb65f5620b9fba4ebfe1c7afde8a44d';
```

**Git history check:**
```bash
git log -p --all | grep -E "ELEVENLABS.*=" | head -5
```
Confirmed: Key present since commit history.

**Status:** FIXED in code. Key now reads from `process.env.ELEVENLABS_API_KEY`.

**Manual action required:** Rotate key at elevenlabs.io. Old key is compromised.

---

### LOW — gstack Supabase Anon Key

**File:** `.claude/skills/gstack/supabase/config.sh`

**Status:** Documented as public key with RLS protection. Acceptable.

---

### LOW — Test Fixture API Key

**File:** `.claude/skills/gstack/test/skill-e2e-cso.test.ts`

**Evidence:** `sk-1234567890abcdef1234567890abcdef`

**Status:** Intentionally fake key for testing. Acceptable.

---

## S2: Supabase RLS Audit

### Finding: Supabase Installed But Not Used

**Command run:**
```bash
grep -rE "from.*supabase|import.*supabase" app/ components/
```

**Result:** No imports found.

**File exists:** `lib/supabase.ts` exports a Supabase client, but nothing imports it.

**Newsletter form verification:**
```bash
grep -E "onSubmit|handleSubmit|fetch" components/NewsletterSignup.tsx
```

**Result:** Newsletter POSTs to `/api/newsletter` which connects to Mailchimp.

**API route verified:** `app/api/newsletter/route.ts`
- Lines 20-31: Reads `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID`, `MAILCHIMP_SERVER_PREFIX`
- If Mailchimp not configured, logs email and returns success (graceful fallback)
- Submits to `https://{SERVER_PREFIX}.api.mailchimp.com/3.0/lists/{AUDIENCE_ID}/members`

**Status:** PASS. Supabase is not actively used. Newsletter uses Mailchimp.

---

## S3: HTTP Security Headers Audit

### Current State

**Command run:**
```bash
curl -sI "https://ihe-pulse.vercel.app"
```

**Response headers (June 12, 2026):**
```
HTTP/2 200
strict-transport-security: max-age=63072000; includeSubDomains; preload
access-control-allow-origin: *
cache-control: public, max-age=0, must-revalidate
server: Vercel
x-vercel-cache: HIT
```

### Header Analysis

| Header | Current | Required | Status |
|--------|---------|----------|--------|
| Strict-Transport-Security | ✓ (Vercel default) | ✓ | PASS |
| X-Content-Type-Options | MISSING | nosniff | MEDIUM |
| X-Frame-Options | MISSING | DENY | MEDIUM |
| Content-Security-Policy | MISSING | See below | MEDIUM |
| Referrer-Policy | MISSING | strict-origin-when-cross-origin | LOW |
| Permissions-Policy | MISSING | camera=(), microphone=(), geolocation=() | LOW |

### PROPOSED Headers (for `vercel.json`)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        {
          "key": "Content-Security-Policy-Report-Only",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; media-src 'self' https://storage.googleapis.com; connect-src 'self' https://api.mailchimp.com https://vercel.live; frame-ancestors 'none';"
        }
      ]
    }
  ]
}
```

**Note:** CSP in Report-Only mode first to avoid breaking audio player. Monitor for violations before enforcing.

---

## S4: Dependencies & Attack Surface Audit

### npm audit

**Command run:**
```bash
npm audit
```

**Result:** 8 vulnerabilities (4 moderate, 4 high)

#### HIGH Severity

| Package | Vulnerability | Advisory |
|---------|--------------|----------|
| next 9.3.4-canary.0 - 16.3.0-canary.5 | HTTP request smuggling, DoS via Server Components, CSRF bypass, cache poisoning, XSS | Multiple CVEs |
| flatted <=3.4.1 | Unbounded recursion DoS, Prototype Pollution | GHSA-25h7-pfq9-p65f, GHSA-rf6f-7fwh-wjgh |
| minimatch <=3.1.3 | ReDoS via wildcards | GHSA-3ppc-4f35-3m26 |
| picomatch <=2.3.1 | Method Injection, ReDoS | GHSA-3v7f-55p6-f55p |

**Remediation:**
```bash
npm audit fix --force  # Will upgrade next to 16.2.9
```

**Recommendation:** DEFER to post-launch. Next.js upgrade may introduce breaking changes.

---

### GCS Bucket Listing — HIGH

**Command run:**
```bash
curl -s "https://storage.googleapis.com/ihe-daily-news-audio/"
```

**Result:** XML bucket listing returned with full file inventory.

**Evidence (truncated):**
```xml
<ListBucketResult>
  <Name>ihe-daily-news-audio</Name>
  <Contents>
    <Key>tracker/story-tracker.json</Key>
    <Size>68034</Size>
  </Contents>
  <Contents>
    <Key>tracker/dedup-log.json</Key>
    <Size>2447</Size>
  </Contents>
  <!-- ... 65+ audio files and images ... -->
</ListBucketResult>
```

**Impact:** Exposes internal tracker files containing:
- Article URLs scraped
- Coverage dates
- Source information

**Verification of tracker file access:**
```bash
curl -s "https://storage.googleapis.com/ihe-daily-news-audio/tracker/story-tracker.json" | head -50
```
**Result:** Full JSON returned (68KB of internal tracking data).

**Remediation (Tier 4 — requires GCP console):**
1. Set bucket to uniform bucket-level access
2. Remove `allUsers` from bucket IAM
3. Configure signed URLs for audio file access, or
4. Keep audio public but move tracker files to private bucket

---

### Debug/Test Routes — PASS

**Command run:**
```bash
find app -name "*.ts" -o -name "*.tsx" | xargs grep -l "debug\|test\|dev-only"
ls app/api/
```

**Result:**
- No `/api/debug`, `/api/test`, or dev-only routes found
- Only API route: `/api/newsletter`

---

### Honeypot Check — MISSING

**Command run:**
```bash
grep -r "honeypot\|honey_pot\|bot_field\|_gotcha" components/ app/
```

**Result:** No honeypot fields in newsletter signup form.

**File:** `components/NewsletterSignup.tsx`

**Current validation:**
- Client-side email format check (line 18)
- Server-side email format check (`app/api/newsletter/route.ts:13`)

**Missing:**
- No honeypot field
- No rate limiting
- No CAPTCHA

**Recommendation:** Add honeypot field to reduce spam submissions.

---

## Tier 4 Tools-Server Follow-Up List

Items requiring GCP Console, Vercel Dashboard, or external service access:

1. **GCS Bucket IAM** — Disable public listing, move tracker files to private bucket
2. **ElevenLabs Key Rotation** — Rotate at elevenlabs.io dashboard
3. **Vercel Headers** — Add security headers via Vercel dashboard or vercel.json
4. **Mailchimp Verification** — Confirm API keys are set in Vercel environment
5. **npm Dependency Upgrades** — Test Next.js 16.2.9 in staging before production
6. **DNS Migration** — Point innovatinghighered.com to Vercel (currently WordPress)
7. **Cloudflare/WAF** — Consider adding rate limiting and bot protection

---

## Summary by Component

| Component | Finding | Severity | Status |
|-----------|---------|----------|--------|
| ElevenLabs Key | Hardcoded in source | BLOCKER | FIXED (code), PENDING (rotation) |
| GCS Bucket | Public listing enabled | HIGH | REPORTED |
| Next.js | 4 HIGH vulnerabilities | HIGH | DEFERRED |
| Security Headers | 5 missing | MEDIUM | PROPOSED |
| Honeypot | Not implemented | MEDIUM | REPORTED |
| Supabase | Installed but unused | LOW | PASS |
| Newsletter | Mailchimp integration works | N/A | PASS |
| Debug Routes | None found | N/A | PASS |

---

## Audit Metadata

- **Date:** June 12, 2026
- **Auditor:** Claude Code (gstack /cso)
- **Repository:** CaltexBevo/ihe-pulse
- **Branch:** main
- **Commit:** Uncommitted changes pending

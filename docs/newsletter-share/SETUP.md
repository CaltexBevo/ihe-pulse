# Full-newsletter sharing: staged, not connected

This candidate is local preparation. No provider account, Redis database, production settings or email sending has been activated. The hosted environment currently has Marketing Mailchimp and Turnstile configuration only. Marketing campaigns, campaign tests, member writes and subscriber lookups are never used by this feature.

## Routes and source

- Visible newsletter button: `https://www.innovatinghighered.com/innovation-pulse/share/edition-21`
- Form POST: `/api/newsletter/share`
- Recipient stop link: `/innovation-pulse/share/stop#token=…`; explicit confirmation POSTs to `/api/newsletter/share/stop`. GET never mutates suppression.
- Immutable server-side snapshot: `data/newsletter-share/edition-21.html` and `.json`. Its approved SHA-256 is also pinned in `adapters.ts`. All ten stories, 55 approved story paragraphs, images and five listening destinations are retained. A one-time sharing introduction and independent recipient stop-sharing footer replace campaign-only controls.
- Next tracing explicitly packages these files for the share API. The client never supplies the HTML, sender, subject or edition URL.

## Required connection decision and configuration

Choose exactly one supported provider. No fallback on failures, no account provisioning, credential acquisition, DNS changes or spending is included in this implementation.

| Variable | Requirement |
| --- | --- |
| `NEWSLETTER_SHARE_ENABLED` | Exact `true` enables sending. Unset/false is the outbound kill switch. Keep false until authorized integration acceptance. |
| `NEWSLETTER_SHARE_PROVIDER` | Exactly `resend` or `mandrill`. |
| `RESEND_API_KEY` | Only for Resend; a sending-only API key restricted to the verified sending domain where supported. |
| `MANDRILL_API_KEY` | Only for Mailchimp Transactional; distinct from the Marketing key. Do not reuse the Marketing credential. |
| `NEWSLETTER_SHARE_REDIS_URL` | Dedicated HTTPS Upstash REST origin ending `.upstash.io`, with no path/query/credentials. |
| `NEWSLETTER_SHARE_REDIS_TOKEN` | Server-only token capable of EVAL/GET/SET/EXISTS/INCR/EXPIRE on the dedicated database. Never expose it to clients. |
| `NEWSLETTER_SHARE_HMAC_KEY` | Stable cryptographically random secret of at least 32 characters; server-only. Generated/provisioned only in the separately authorized setup. |
| `TURNSTILE_SECRET_KEY` | Existing server secret, same canonical-host site. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Existing public site key. New widget action `newsletter_share`; signup retains `newsletter_signup`. |
| `VERCEL` | Deployment-system value must be `1`; never fake it to enable public local hosting. |

Fixed sender: `Innovating Higher Ed <info@innovatinghighered.com>`. Fixed subject: `The Innovation Pulse: Edition 21`. Verify provider domain ownership/authentication and this sender before any allowed send. Resend open/click tracking must remain off in the sending-domain configuration; the endpoint does not request tracking. Mandrill explicitly disables both. Sender identity cannot be overridden by the form. The optional name is attributed as user-supplied sharing text, not an authenticated identity.

Do not assert account eligibility, quotas, cost, deliverability or successful delivery from configured variables. Provider account availability/domain verification and dedicated Redis availability are separate activation dependencies. Root's provider comparison determines which connection, if any, Brent authorizes.

## Abuse, privacy and duplicate controls

Same-origin JSON only, 4 KiB streamed request cap and three-second body deadline. Canonical origin/Turnstile hostname are exactly `www.innovatinghighered.com`; no wildcard, preview or localhost bypass. Turnstile must validate `newsletter_share`. Production uses Vercel's platform-controlled `x-vercel-forwarded-for`, not a user-selected identity. Missing/malformed IP fails closed.

Redis EVAL atomically checks suppression, attempt fingerprint, recipient-edition lock and quotas before recording a pending attempt. Limits: three per IP/hour, one per recipient/day, fifty globally/day, at most one attempt per recipient/edition. Limits count reserved attempts including rejected/unknown sends. They are conservative launch defaults, not measured demand. Multiple serverless instances share the same durable checks. No process-memory limiter is used in production.

All Redis keys contain keyed HMACs, fixed edition IDs or global labels. Stored values are payload fingerprints, state and provider receipt ID, never raw email addresses, names, notes or IPs. Rate counters expire after one hour/day; recipient-edition locks, attempts and suppression records intentionally remain durable so old links/retries cannot defeat the protections. This small pseudonymous record set is not anonymous. The provider necessarily receives the recipient and full email; review its retention as part of connection acceptance. No application body/recipient logging, recipient analytics, tracking pixels, subscriber enrollment or audience lookup is added. Sharing routes opt out of site analytics. Stop tokens use a fragment, contain only a signed recipient HMAC and are removed from browser history after capture.

**Keep the HMAC key stable across deployments. Never rotate it by simply replacing its value:** that would orphan suppression records and duplicate locks. Before any authorized rotation, design and test versioned-key compatibility or migration preserving every suppression and pending/accepted recipient lock; keep old stop links functional. Credential rotation is outside this candidate.

A durable pending record precedes the one provider attempt. Timeout, unrecognized response, storage receipt failure or queued delivery never triggers an automatic resend. A fresh request ID cannot bypass the recipient-edition lock. Mandrill `sent` with a matching recipient/provider ID or Resend's successful ID response counts as accepted for delivery, not proof of inbox arrival. Mandrill `queued` is displayed as queued/unconfirmed and recorded for reconciliation. Invalid/rejected results do not count as success. Accepted replay can return its existing acceptance only for the same request fingerprint. Resend also receives the opaque attempt HMAC as `Idempotency-Key`.

Unknown or queued records require an authorized operator to inspect the provider receipt/status before any decision; there is deliberately no public reset/retry endpoint. Suppression stays usable with outbound sending disabled. Restoring an old database backup or deleting keys can resurrect sending and is not a routine cleanup. Preserve the store and HMAC key together. Redis loss blocks new sends; do not initialize an empty replacement and resume without reconciliation.

## Verification and release gate

Local verification commands (no external sends):

```sh
node --loader ./test/innovationGrantsTestLoader.mjs --test test/newsletterShare.test.ts test/newsletterSecurity.test.ts
./node_modules/.bin/tsc --noEmit
./node_modules/.bin/eslint lib/server/newsletterShare app/api/newsletter/share app/innovation-pulse/share components/TurnstileChallenge.tsx components/EngagementAnalytics.tsx test/newsletterShare.test.ts
npm run build
npm run start -- --hostname 127.0.0.1 --port 3093
```

Security tests inject simulated store, CAPTCHA and provider implementations; they do not prove live Redis Lua, production credentials, domain authentication or inbox delivery. Real connection acceptance must verify Redis EVAL atomic concurrent reservations, actual trusted IP header, canonical Turnstile action, suppression and failure/timeout handling, then a separately authorized founder test received as complete HTML (all ten stories, images and listening links) and button-click flow. Inspect actual receipt and subscription non-enrollment. All email holds still apply until explicitly released for the precise test/send. Independent security review, deployment authorization and actual destination verification remain separate.

## Technical references

- [Vercel request headers](https://vercel.com/docs/headers/request-headers)
- [Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Mailchimp Transactional send](https://mailchimp.com/developer/transactional/api/messages/send/)
- [Resend send email](https://resend.com/docs/api-reference/emails/send-email)
- [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Upstash Redis REST](https://upstash.com/docs/redis/features/restapi)

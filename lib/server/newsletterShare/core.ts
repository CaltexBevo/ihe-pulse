import { EDITIONS, isEdition, type Edition } from './editions.ts';
// Server implementation only: route handlers import this module; never client components.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';

export const ORIGIN = 'https://www.innovatinghighered.com';
export const EDITION = 'edition-21';
export const SUBJECT = 'The Innovation Pulse: Edition 21';
export const FROM_EMAIL = 'info@innovatinghighered.com';
export type Env = Record<string, string | undefined>;
export type Submission = { edition: Edition; email: string; name: string; note: string; requestId: string; turnstileToken: string };
export type Snapshot = { html: string; sha256: string; edition: string; subject: string; storyCount: number; paragraphCount: number; imageUrls: string[]; listeningUrls: string[] };
export type Reservation = { attempt: string; recipient: string; ip: string; fingerprint: string; edition: string };
export type ReserveResult = 'reserved' | 'accepted' | 'pending' | 'conflict' | 'limited' | 'suppressed';
export interface ShareStore {
  reserve(value: Reservation): Promise<ReserveResult>;
  finish(attempt: string, status: 'accepted' | 'unknown' | 'rejected', providerId?: string): Promise<void>;
  suppress(recipient: string): Promise<void>;
}
export type Message = { to: string; html: string; text: string; subject: string; from: string; idempotencyKey: string };
export type SendResult = { status: 'accepted'; id: string } | { status: 'queued'; id: string } | { status: 'rejected' };
export type Dependencies = {
  env: Env; store: ShareStore; snapshot: (edition?: Edition) => Promise<Snapshot>;
  verify: (token: string) => Promise<boolean>; send: (message: Message) => Promise<SendResult>;
};
const unavailable = 'Full-newsletter sharing is temporarily unavailable. Please try again later.';
export function response(body: object, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store', 'Referrer-Policy': 'no-referrer', 'X-Content-Type-Options': 'nosniff' } });
}
export function configured(env: Env) {
  return env.NEWSLETTER_SHARE_ENABLED === 'true' && Boolean(
    ((env.NEWSLETTER_SHARE_PROVIDER === 'mandrill' && env.MANDRILL_API_KEY?.trim()) ||
      (env.NEWSLETTER_SHARE_PROVIDER === 'resend' && env.RESEND_API_KEY?.trim())) && env.TURNSTILE_SECRET_KEY?.trim() &&
    env.NEWSLETTER_SHARE_HMAC_KEY && env.NEWSLETTER_SHARE_HMAC_KEY.length >= 32 &&
    env.NEWSLETTER_SHARE_REDIS_TOKEN?.trim() && validRedisUrl(env.NEWSLETTER_SHARE_REDIS_URL) &&
    env.VERCEL === '1'
  );
}
export function validRedisUrl(value: string | undefined) {
  try { const u = new URL(value || ''); return u.protocol === 'https:' && !u.username && !u.password && u.pathname === '/' && !u.search && !u.hash && u.hostname.endsWith('.upstash.io'); } catch { return false; }
}
export function digest(key: string, purpose: string, value: string) {
  return createHmac('sha256', key).update(`${purpose}\0${value}`).digest('hex');
}
export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || email.length < 6 || /[^\x21-\x7e]/.test(email)) return null;
  const parts = email.split('@');
  if (parts.length !== 2) return null;
  const [local, domain] = parts;
  if (!local || local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..') || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)) return null;
  const labels = domain.split('.');
  if (labels.length < 2 || labels.some(s => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(s))) return null;
  return email;
}
function plain(value: unknown, limit: number): string | null {
  if (value === undefined) return '';
  if (typeof value !== 'string' || value.length > limit || /[\u0000-\u0008\u000b-\u001f\u007f]/.test(value)) return null;
  return value.trim();
}
export function parseSubmission(raw: unknown): Submission | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const r = raw as Record<string, unknown>;
  const allowed = ['email', 'name', 'note', 'requestId', 'turnstileToken', '_gotcha', 'edition'];
  if (Object.keys(r).some(k => !allowed.includes(k)) || !isEdition(r.edition) || (r._gotcha !== undefined && r._gotcha !== '')) return null;
  const email = normalizeEmail(r.email), name = plain(r.name, 80), note = plain(r.note, 500);
  if (!email || name === null || note === null || typeof r.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(r.requestId) || typeof r.turnstileToken !== 'string' || r.turnstileToken.length < 10 || r.turnstileToken.length > 2048) return null;
  return { edition: r.edition, email, name, note, requestId: r.requestId.toLowerCase(), turnstileToken: r.turnstileToken };
}
export async function readBody(request: Request): Promise<unknown> {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') throw new Error('body');
  const declared = request.headers.get('content-length');
  if (declared && (!/^\d+$/.test(declared) || Number(declared) > 4096)) throw new Error('body');
  if (!request.body) throw new Error('body');
  const reader = request.body.getReader(); let bytes = 0, text = ''; const decoder = new TextDecoder('utf-8', { fatal: true });
  const timeout = setTimeout(() => { void reader.cancel().catch(() => {}); }, 3000);
  try {
    while (true) { const next = await reader.read(); if (next.done) break; bytes += next.value.byteLength; if (bytes > 4096) throw new Error('body'); text += decoder.decode(next.value, { stream: true }); }
    return JSON.parse(text + decoder.decode());
  } finally { clearTimeout(timeout); await reader.cancel().catch(() => {}); reader.releaseLock(); }
}
export function checkOrigin(request: Request) {
  return request.headers.get('origin') === ORIGIN && !['cross-site', 'same-site'].includes(request.headers.get('sec-fetch-site') || '');
}
export function clientIp(request: Request) {
  // Vercel overwrites this header. Never trust generic X-Forwarded-For from a public client.
  const value = request.headers.get('x-vercel-forwarded-for')?.trim() || '';
  return isIP(value) ? value : null;
}
export function escapeHtml(value: string) { return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!); }
export function suppressionToken(key: string, recipient: string) { return `${recipient}.${digest(key, 'stop', recipient)}`; }
export function readSuppressionToken(key: string, token: unknown) {
  if (typeof token !== 'string' || !/^[0-9a-f]{64}\.[0-9a-f]{64}$/.test(token)) return null;
  const [recipient, signature] = token.split('.');
  return timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(digest(key, 'stop', recipient), 'hex')) ? recipient : null;
}
export function validateSnapshot(snapshot: Snapshot) {
  if (!isEdition(snapshot.edition)) throw new Error('snapshot');
  const binding = EDITIONS[snapshot.edition];
  if (snapshot.sha256 !== binding.sha256 || snapshot.subject !== binding.subject || snapshot.storyCount !== binding.storyCount || snapshot.paragraphCount !== binding.paragraphCount ||
    createHash('sha256').update(snapshot.html).digest('hex') !== snapshot.sha256 ||
    /\*\|[^]*?\|\*|<(?:script|form|iframe)\b|\son\w+\s*=|javascript:/i.test(snapshot.html) ||
    !snapshot.html.includes('</body>') || (snapshot.html.match(/\{\{SHARE_OPTOUT_URL\}\}/g) || []).length !== 1 ||
    snapshot.imageUrls.length < 11 || snapshot.listeningUrls.length < 1 ||
    [...snapshot.imageUrls, ...snapshot.listeningUrls].some(url => !url.startsWith('https://') || !snapshot.html.includes(url.replace(/&/g, '&amp;')) && !snapshot.html.includes(url))) throw new Error('snapshot');
}
export function compose(snapshot: Snapshot, submission: Submission, key: string, recipient: string): Message {
  validateSnapshot(snapshot);
  if (snapshot.edition !== submission.edition) throw new Error('Edition mismatch');
  const stop = `${ORIGIN}/innovation-pulse/share/stop#token=${suppressionToken(key, recipient)}`;
  const intro = `<div style="max-width:640px;margin:20px auto;padding:20px;font-family:Arial,sans-serif;background:#ffffff;color:#111111"><p>${submission.name ? `${escapeHtml(submission.name)} shared` : 'Someone shared'} this edition of The Innovation Pulse with you.</p>${submission.note ? `<p style="white-space:pre-wrap">${escapeHtml(submission.note)}</p>` : ''}<p>This is a one-time shared email. You have not been subscribed.</p></div>`;
  let html = snapshot.html.replace('{{SHARE_OPTOUT_URL}}', escapeHtml(stop));
  html = html.includes('{{SHARE_NOTE_HTML}}') ? html.replace('{{SHARE_NOTE_HTML}}', () => intro) : html.replace(/(<body\b[^>]*>)/i, match => match + intro);
  // HTML body remains the complete source. Plain text is an accessibility alternative.
  const text = html.replace(/<a\b[^>]*href="([^"]+)"[^>]*>([^]*?)<\/a>/gi, (_match, href: string, label: string) => `${label} (${href})`).replace(/<style\b[^>]*>[^]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim() + `\nStop shared emails: ${stop}`;
  return { to: submission.email, html, text, subject: snapshot.subject, from: FROM_EMAIL, idempotencyKey: digest(key, 'attempt', submission.requestId) };
}
export async function handleShare(request: Request, deps: Dependencies) {
  if (!checkOrigin(request)) return response({ error: 'Request origin is not allowed.' }, 403);
  if (!configured(deps.env)) return response({ error: unavailable }, 503);
  const ip = clientIp(request); if (!ip) return response({ error: unavailable }, 503);
  let submission: Submission | null;
  try { submission = parseSubmission(await readBody(request)); } catch { submission = null; }
  if (!submission) return response({ error: 'Please check the email address, optional message and security check.' }, 400);
  try {
    if (!await deps.verify(submission.turnstileToken)) return response({ error: 'Security verification failed. Please retry the security check.' }, 400);
    const key = deps.env.NEWSLETTER_SHARE_HMAC_KEY!;
    const recipient = digest(key, 'recipient', submission.email);
    const attempt = digest(key, 'attempt', submission.requestId);
    const snapshot = await deps.snapshot(submission.edition);
    const message = compose(snapshot, submission, key, recipient);
    const reservation = await deps.store.reserve({ attempt, recipient, ip: digest(key, 'ip', ip), edition: submission.edition, fingerprint: digest(key, 'payload', JSON.stringify([recipient, snapshot.sha256, submission.name, submission.note])) });
    if (reservation === 'accepted') return response({ success: true, message: 'The full newsletter was accepted for delivery. Your friend has not been subscribed.' });
    if (reservation === 'suppressed') return response({ error: 'This request cannot be delivered.' }, 409);
    if (reservation === 'limited') return response({ error: 'Sharing limit reached. Please try another day.' }, 429);
    if (reservation !== 'reserved') return response({ error: 'This request is already recorded. Please do not submit it again.' }, 409);
    let result: SendResult;
    try { result = await deps.send(message); }
    catch { await deps.store.finish(attempt, 'unknown').catch(() => {}); return response({ error: 'Delivery could not be confirmed. Please do not resend this request.' }, 503); }
    if (result.status === 'queued') {
      await deps.store.finish(attempt, 'unknown', result.id);
      return response({ success: false, error: 'The email provider has queued this request. Delivery is not confirmed. Please do not resend it.' }, 202);
    }
    await deps.store.finish(attempt, result.status, result.status === 'accepted' ? result.id : undefined);
    if (result.status !== 'accepted') return response({ error: 'The email provider did not accept this request.' }, 502);
    return response({ success: true, message: 'The full newsletter was accepted for delivery. Your friend has not been subscribed.' });
  } catch { return response({ error: unavailable }, 503); }
}
export async function handleStop(request: Request, deps: Pick<Dependencies, 'env' | 'store'>) {
  if (!checkOrigin(request)) return response({ error: 'Request origin is not allowed.' }, 403);
  // Stopping remains available when outbound sending is disabled.
  const key = deps.env.NEWSLETTER_SHARE_HMAC_KEY;
  if (!key || key.length < 32) return response({ error: unavailable }, 503);
  try {
    const raw = await readBody(request) as Record<string, unknown>;
    const recipient = readSuppressionToken(key, raw?.token);
    if (!recipient || raw.confirm !== true) return response({ error: 'A valid shared-email link and confirmation are required.' }, 400);
    await deps.store.suppress(recipient);
    return response({ success: true, message: 'Shared newsletters to this address are now blocked. Newsletter subscription preferences have not changed.' });
  } catch { return response({ error: unavailable }, 503); }
}

import { EDITIONS, isEdition, type Edition } from './editions.ts';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { type Dependencies, type Env, type Message, type Reservation, type ReserveResult, type ShareStore, type Snapshot, type SendResult, validRedisUrl } from './core.ts';

// Atomic durable reservation across all Vercel instances. Shared hash-tag allows Redis cluster execution.
export const RESERVE_LUA = `
if redis.call('EXISTS', KEYS[1]) == 1 then return 'suppressed' end
local old = redis.call('GET', KEYS[2])
if old then
 local row = cjson.decode(old)
 if row.fingerprint ~= ARGV[1] then return 'conflict' end
 if row.status == 'accepted' then return 'accepted' end
 return 'pending'
end
if redis.call('EXISTS', KEYS[3]) == 1 then return 'pending' end
local limits = {3, 1, 40, 25, 1000}
for i=4,8 do
 if tonumber(redis.call('GET', KEYS[i]) or '0') >= limits[i-3] then return 'limited' end
end
redis.call('SET', KEYS[2], cjson.encode({fingerprint=ARGV[1],status='pending'}))
redis.call('SET', KEYS[3], 'reserved')
for i=4,8 do
 local n = redis.call('INCR', KEYS[i])
 if n == 1 then redis.call('EXPIRE', KEYS[i], i == 4 and 3600 or (i == 8 and 2678400 or 86400)) end
end
return 'reserved'
`;
export const FINISH_LUA = `
local old = redis.call('GET', KEYS[1])
if not old then return 0 end
local row = cjson.decode(old)
if row.status ~= 'pending' and row.status ~= 'unknown' then return 0 end
row.status=ARGV[1]
if ARGV[2] ~= '' then row.providerId=ARGV[2] end
redis.call('SET', KEYS[1], cjson.encode(row))
return 1
`;
const prefix = 'ihe:{newsletter-share}:v1:';
export class RedisShareStore implements ShareStore {
  private env: Env;
  private transport: typeof fetch;
  constructor(env: Env, transport: typeof fetch = fetch) { this.env = env; this.transport = transport; }
  private async command(command: (string | number)[]): Promise<unknown> {
    if (!validRedisUrl(this.env.NEWSLETTER_SHARE_REDIS_URL) || !this.env.NEWSLETTER_SHARE_REDIS_TOKEN?.trim()) throw new Error('Storage unavailable');
    const res = await this.transport(this.env.NEWSLETTER_SHARE_REDIS_URL!, {
      method: 'POST', headers: { Authorization: `Bearer ${this.env.NEWSLETTER_SHARE_REDIS_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(command), cache: 'no-store', signal: AbortSignal.timeout(4000), redirect: 'error',
    });
    if (!res.ok) throw new Error('Storage unavailable');
    const body = await res.json();
    if (body.error || !Object.prototype.hasOwnProperty.call(body, 'result')) throw new Error('Storage unavailable');
    return body.result;
  }
  async reserve(v: Reservation): Promise<ReserveResult> {
    const result = await this.command(['EVAL', RESERVE_LUA, 8,
      `${prefix}stop:${v.recipient}`, `${prefix}attempt:${v.attempt}`, `${prefix}edition:${v.edition}:${v.recipient}`,
      `${prefix}ip:${v.ip}`, `${prefix}recipient:${v.recipient}`, `${prefix}global`, `${prefix}edition-day:${v.edition}`, `${prefix}global-month`, v.fingerprint]);
    if (!['reserved', 'accepted', 'pending', 'conflict', 'limited', 'suppressed'].includes(result as string)) throw new Error('Storage unavailable');
    return result as ReserveResult;
  }
  async finish(attempt: string, status: 'accepted' | 'unknown' | 'rejected', providerId?: string) {
    const result = await this.command(['EVAL', FINISH_LUA, 1, `${prefix}attempt:${attempt}`, status, providerId || '']);
    if (result !== 1) throw new Error('Receipt unavailable');
  }
  async suppress(recipient: string) {
    if (await this.command(['SET', `${prefix}stop:${recipient}`, 'blocked']) !== 'OK') throw new Error('Storage unavailable');
  }
}
export async function readSnapshot(edition: Edition = 'edition-21'): Promise<Snapshot> {
  if (!isEdition(edition)) throw new Error('Unapproved edition');
  const base = path.join(process.cwd(), 'data/newsletter-share');
  const [html, json] = await Promise.all([readFile(path.join(base, `${edition}.html`), 'utf8'), readFile(path.join(base, `${edition}.json`), 'utf8')]);
  const metadata = JSON.parse(json);
  if (metadata.sha256 !== EDITIONS[edition].sha256 || metadata.edition !== edition) throw new Error('Unapproved snapshot');
  return { ...metadata, html };
}
export async function verifyChallenge(token: string, env: Env, transport: typeof fetch = fetch) {
  const result = await transport('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY || '', response: token }),
    cache: 'no-store', signal: AbortSignal.timeout(4000), redirect: 'error',
  });
  if (!result.ok) throw new Error('Security check unavailable');
  const value = await result.json();
  return value.success === true && value.action === 'newsletter_share' && value.hostname === 'www.innovatinghighered.com';
}
export async function sendTransactional(message: Message, env: Env, transport: typeof fetch = fetch): Promise<SendResult> {
  const result = await transport('https://mandrillapp.com/api/1.0/messages/send.json', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(8000),
    body: JSON.stringify({ key: env.MANDRILL_API_KEY, async: false, message: {
      html: message.html, text: message.text, subject: message.subject, from_email: message.from, from_name: 'Innovating Higher Ed',
      to: [{ email: message.to, type: 'to' }], track_opens: false, track_clicks: false, auto_text: false,
      preserve_recipients: false, merge: false, inline_css: false, url_strip_qs: false,
    } }),
  });
  if (!result.ok) throw new Error('Unknown delivery outcome');
  const rows = await result.json();
  if (!Array.isArray(rows) || rows.length !== 1 || rows[0]?.email?.toLowerCase() !== message.to.toLowerCase()) throw new Error('Unknown delivery outcome');
  const row = rows[0];
  if (row.status === 'sent' && typeof row._id === 'string' && /^[\w-]{1,128}$/.test(row._id)) return { status: 'accepted', id: row._id };
  if (row.status === 'queued' && typeof row._id === 'string' && /^[\w-]{1,128}$/.test(row._id)) return { status: 'queued', id: row._id };
  if (row.status === 'rejected' || row.status === 'invalid') return { status: 'rejected' };
  // Scheduled/malformed are not a successful delivery acknowledgment. Never auto retry.
  throw new Error('Unknown delivery outcome');
}
export async function sendResend(message: Message, env: Env, transport: typeof fetch = fetch): Promise<SendResult> {
  const result = await transport('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': message.idempotencyKey },
    cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(8000),
    body: JSON.stringify({ from: `Innovating Higher Ed <${message.from}>`, to: [message.to], subject: message.subject, html: message.html, text: message.text }),
  });
  if (!result.ok) throw new Error('Unknown delivery outcome');
  const row = await result.json();
  if (typeof row.id !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(row.id)) throw new Error('Unknown delivery outcome');
  return { status: 'accepted', id: row.id };
}
export function dependencies(env: Env = process.env): Dependencies {
  return { env, store: new RedisShareStore(env), snapshot: readSnapshot,
    verify: token => verifyChallenge(token, env), send: message => env.NEWSLETTER_SHARE_PROVIDER === 'resend' ? sendResend(message, env) : sendTransactional(message, env) };
}

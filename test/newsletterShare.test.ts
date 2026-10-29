import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { ORIGIN, configured, normalizeEmail, parseSubmission, handleShare, handleStop, compose, digest, suppressionToken, readSuppressionToken, readBody, type Dependencies, type Reservation, type ReserveResult, type ShareStore, type Message } from '../lib/server/newsletterShare/core.ts';
import { readSnapshot, RedisShareStore, RESERVE_LUA, FINISH_LUA, sendTransactional, sendResend, verifyChallenge } from '../lib/server/newsletterShare/adapters.ts';

// These are fixtures, not deployment credentials. All external effects are injected simulations.
const env = { NEWSLETTER_SHARE_PROVIDER: 'mandrill', NEWSLETTER_SHARE_ENABLED: 'true', VERCEL: '1', MANDRILL_API_KEY: 'mock', TURNSTILE_SECRET_KEY: 'mock', NEWSLETTER_SHARE_HMAC_KEY: 'mock-key-for-testing-only-32-characters', NEWSLETTER_SHARE_REDIS_TOKEN: 'mock', NEWSLETTER_SHARE_REDIS_URL: 'https://mock.upstash.io' };
const body = () => ({ edition: 'edition-21', email: 'friend@example.edu', name: 'Sender', note: 'Worth a look.', requestId: randomUUID(), turnstileToken: 'mock-challenge-token', _gotcha: '' });
function request(raw: unknown, headers: Record<string,string> = {}) { return new Request(`${ORIGIN}/api/newsletter/share`, { method: 'POST', headers: { origin: ORIGIN, 'content-type': 'application/json', 'x-vercel-forwarded-for': '192.0.2.1', ...headers }, body: JSON.stringify(raw) }); }
class MockStore implements ShareStore {
  rows = new Map<string, { status: string; fingerprint: string }>();
  recipients = new Set<string>(); stops = new Set<string>(); ips = new Map<string,number>(); total = 0; fail = false;
  async reserve(v: Reservation): Promise<ReserveResult> {
    if (this.fail) throw new Error('storage');
    if (this.stops.has(v.recipient)) return 'suppressed';
    const row = this.rows.get(v.attempt);
    if (row) return row.fingerprint !== v.fingerprint ? 'conflict' : row.status === 'accepted' ? 'accepted' : 'pending';
    if (this.recipients.has(v.recipient)) return 'pending';
    if ((this.ips.get(v.ip) || 0) >= 3 || this.total >= 50) return 'limited';
    this.rows.set(v.attempt, { status: 'pending', fingerprint: v.fingerprint }); this.recipients.add(v.recipient); this.total++;
    this.ips.set(v.ip, (this.ips.get(v.ip) || 0) + 1); return 'reserved';
  }
  async finish(attempt: string, status: string) { if (this.fail) throw new Error('storage'); this.rows.get(attempt)!.status = status; }
  async suppress(recipient: string) { this.stops.add(recipient); }
}
function fixture() {
  const store = new MockStore(), sent: Message[] = [];
  const deps: Dependencies = { env, store, snapshot: readSnapshot, verify: async () => true, send: async message => { sent.push(message); return { status: 'accepted', id: 'mock-provider-id' }; } };
  return { store, sent, deps };
}
test('configuration is explicitly disabled without each critical dependency and deployment provenance', () => {
  assert.equal(configured(env), true);
  for (const key of Object.keys(env)) assert.equal(configured({ ...env, [key]: undefined }), false, key);
  assert.equal(configured({ ...env, NEWSLETTER_SHARE_REDIS_URL: 'http://mock.upstash.io' }), false);
  assert.equal(configured({ ...env, NEWSLETTER_SHARE_REDIS_URL: 'https://evil.test' }), false);
});
test('recipient syntax rejects header injections, multiple recipients, unicode confusion and invalid domains', () => {
  for (const value of ['a@b.edu\r\nBcc:other@x.edu', 'a@b.edu,b@c.edu', 'a@b.edu;b@c.edu', 'a..b@c.edu', '.a@b.edu', 'a@-x.edu', 'a@x..edu', 'a@localhost', 'a＠b.edu', { email: 'a@b.edu' }]) assert.equal(normalizeEmail(value), null);
  assert.equal(normalizeEmail(' Friend+tag@Example.EDU '), 'friend+tag@example.edu');
});
test('only exact input fields and fixed edition; bounded optional strings', () => {
  const b = body(); assert.ok(parseSubmission(b));
  for (const extra of [{ html: '<h1>x</h1>' }, { from: 'x@example.edu' }, { subject: 'spam' }, { edition: 'edition-22' }, { name: 'x'.repeat(81) }, { note: 'x'.repeat(501) }, { _gotcha: 'bot' }, { requestId: 'x' }]) assert.equal(parseSubmission({ ...b, ...extra }), null);
});
test('snapshot full HTML keeps all approved content, images and listening links and escapes personal note', async () => {
  const snapshot = await readSnapshot(); const manifest = JSON.parse(await readFile('data/newsletter-share/edition-21.json','utf8'));
  const submission = parseSubmission({ ...body(), name: '<img src=x onerror=alert(1)>', note: '</div><script>alert(1)</script> & "hello"' })!;
  const result = compose(snapshot, submission, env.NEWSLETTER_SHARE_HMAC_KEY, digest(env.NEWSLETTER_SHARE_HMAC_KEY, 'recipient', submission.email));
  assert.ok(result.html.includes('&lt;script&gt;')); assert.ok(!result.html.includes('<script>'));
  assert.equal(result.subject, 'The Innovation Pulse: Edition 21'); assert.equal(result.from, 'info@innovatinghighered.com');
  assert.equal(snapshot.paragraphCount, 55); assert.equal(snapshot.storyCount, 10);
  for (const headline of manifest.storyHeadlines) assert.ok(result.html.includes(headline));
  for (const image of snapshot.imageUrls) assert.ok(result.html.includes(image));
  for (const link of snapshot.listeningUrls) { assert.ok(result.html.includes(link) || result.html.includes(link.replace(/&/g,'&amp;'))); assert.ok(result.text.includes(link)); }
  const withoutPersonalization = result.html.replace(/<div style="max-width:640px;[^]*?<\/div>/, '').replace(/https:\/\/www\.innovatinghighered\.com\/innovation-pulse\/share\/stop#token=[a-f0-9.]+/, '{{SHARE_OPTOUT_URL}}');
  assert.equal(withoutPersonalization, snapshot.html);
  assert.throws(() => compose({ ...snapshot, html: snapshot.html + 'changed' }, submission, env.NEWSLETTER_SHARE_HMAC_KEY, 'x'));
});
test('body streaming cap rejects payload even without Content-Length and wrong content type', async () => {
  await assert.rejects(() => readBody(request({ note: 'x'.repeat(5000) })));
  await assert.rejects(() => readBody(request(body(), { 'content-type': 'text/plain' })));
});
test('unavailable, cross-origin, untrusted IP and failed CAPTCHA make no attempt', async () => {
  const { deps, sent, store } = fixture();
  assert.equal((await handleShare(request(body()), { ...deps, env: {} })).status, 503);
  assert.equal((await handleShare(request(body(), { origin: 'https://evil.test' }), deps)).status, 403);
  assert.equal((await handleShare(request(body(), { 'x-vercel-forwarded-for': '' }), deps)).status, 503);
  assert.equal((await handleShare(request(body()), { ...deps, verify: async () => false })).status, 400);
  assert.equal(sent.length, 0); assert.equal(store.rows.size, 0);
});
test('concurrent replay reserves only one send; fresh IDs cannot bypass recipient edition lock', async () => {
  const { deps, sent } = fixture(); const b = body();
  const results = await Promise.all(Array.from({length:10}, () => handleShare(request(b),deps)));
  assert.equal(sent.length,1); assert.ok(results.some(r => r.status === 200));
  assert.equal((await handleShare(request(b),deps)).status,200); assert.equal(sent.length,1);
  assert.equal((await handleShare(request(body()),deps)).status,409); assert.equal(sent.length,1);
  assert.equal((await handleShare(request({...b,note:'different'}),deps)).status,409);
});
test('quota and storage outage fail closed', async () => {
  const { deps, sent, store } = fixture();
  for (let i=0;i<3;i++) assert.equal((await handleShare(request({...body(), email:`friend${i}@example.edu`}),deps)).status,200);
  assert.equal((await handleShare(request({...body(), email:'friend4@example.edu'}),deps)).status,429);
  store.fail=true; assert.equal((await handleShare(request({...body(), email:'friend5@example.edu'}),deps)).status,503);
  assert.equal(sent.length,3);
});
test('unknown provider outcome cannot be retried and has no false-success response', async () => {
  const { deps, store } = fixture(); let calls=0;
  deps.send=async()=>{calls++;throw new Error('timeout');}; const b=body();
  assert.equal((await handleShare(request(b),deps)).status,503);
  assert.equal((await handleShare(request(b),deps)).status,409);
  assert.equal((await handleShare(request(body()),deps)).status,409); assert.equal(calls,1);
  assert.ok([...store.rows.values()].every(row=>row.status==='unknown'));
});
test('queued provider outcome is disclosed and held without success or retry', async () => {
  const { deps }=fixture(); deps.send=async()=>({status:'queued',id:'queue-id'}); const b=body();
  const result=await handleShare(request(b),deps); assert.equal(result.status,202); assert.equal((await result.json()).success,false);
  assert.equal((await handleShare(request(b),deps)).status,409);
});
test('suppression requires signed token and explicit confirmation, survives outbound kill switch', async () => {
  const { deps, store, sent }=fixture(); const recipient=digest(env.NEWSLETTER_SHARE_HMAC_KEY,'recipient','friend@example.edu');
  const token=suppressionToken(env.NEWSLETTER_SHARE_HMAC_KEY,recipient); assert.equal(readSuppressionToken(env.NEWSLETTER_SHARE_HMAC_KEY,token),recipient);
  assert.equal(readSuppressionToken(env.NEWSLETTER_SHARE_HMAC_KEY,token.slice(0,-1)+'z'),null);
  assert.equal((await handleStop(request({token}),deps)).status,400);
  assert.equal((await handleStop(request({token,confirm:true}),{...deps,env:{...env,NEWSLETTER_SHARE_ENABLED:'false'}})).status,200);
  assert.ok(store.stops.has(recipient)); assert.equal((await handleShare(request(body()),deps)).status,409); assert.equal(sent.length,0);
});
test('Redis adapter uses atomic EVAL and only opaque keys/fingerprints; transport failures reject', async () => {
  const commands: unknown[][]=[];
  const transport: typeof fetch=async(_url,init)=>{commands.push(JSON.parse(init!.body as string));return Response.json({result:commands.length===1?'reserved':1});};
  const store=new RedisShareStore(env,transport); const v={attempt:'a'.repeat(64),recipient:'b'.repeat(64),ip:'c'.repeat(64),fingerprint:'d'.repeat(64),edition:'edition-21'};
  assert.equal(await store.reserve(v),'reserved'); await store.finish(v.attempt,'accepted','mock-id');
  assert.equal(commands[0][0],'EVAL'); assert.equal(commands[0][1],RESERVE_LUA); assert.equal(commands[0][2],8); assert.equal(commands[1][1],FINISH_LUA);
  assert.ok(!JSON.stringify(commands).includes('friend@example.edu'));
  assert.equal(commands[0][9], 'ihe:{newsletter-share}:v1:edition-day:edition-21');
  assert.equal(commands[0][10], 'ihe:{newsletter-share}:v1:global-month');
  await assert.rejects(()=>new RedisShareStore(env,async()=>Response.json({error:'failure'})).reserve(v));
});
test('provider receives exactly one HTML recipient, no tracking, fixed payload, and validates outcomes', async () => {
  const snapshot=await readSnapshot(); const submission=parseSubmission(body())!; const message=compose(snapshot,submission,env.NEWSLETTER_SHARE_HMAC_KEY,'a'.repeat(64));
  let captured: { message?: { to: unknown[]; html: string; track_opens: boolean; track_clicks: boolean; merge: boolean } }={};
  const mock=(status:string):typeof fetch=>async(url,init)=>{ assert.equal(String(url),'https://mandrillapp.com/api/1.0/messages/send.json'); captured=JSON.parse(init!.body as string);return Response.json([{email:message.to,status,_id:'test-id'}]);};
  assert.equal((await sendTransactional(message,env,mock('sent'))).status,'accepted');
  assert.equal(captured.message!.to.length,1); assert.equal(captured.message!.html,message.html); assert.equal(captured.message!.track_opens,false); assert.equal(captured.message!.track_clicks,false); assert.equal(captured.message!.merge,false);
  assert.equal((await sendTransactional(message,env,mock('queued'))).status,'queued');
  assert.equal((await sendTransactional(message,env,mock('rejected'))).status,'rejected');
  await assert.rejects(()=>sendTransactional(message,env,mock('scheduled')));
  await assert.rejects(()=>sendTransactional(message,env,async()=>Response.json({error:'bad'})));
});
test('dedicated Turnstile action and exact canonical hostname are required', async () => {
  for (const [action,hostname,expected] of [['newsletter_share','www.innovatinghighered.com',true],['newsletter_signup','www.innovatinghighered.com',false],['newsletter_share','evil.test',false]] as const) {
    assert.equal(await verifyChallenge('token',env,async()=>Response.json({success:true,action,hostname})),expected);
  }
});

test('optional Resend adapter uses fixed payload, recipient and provider idempotency; never fallback', async () => {
  const s=await readSnapshot(), b=parseSubmission(body())!;
  const message=compose(s,b,env.NEWSLETTER_SHARE_HMAC_KEY,'a'.repeat(64));
  const resendEnv={...env,NEWSLETTER_SHARE_PROVIDER:'resend',RESEND_API_KEY:'mock-resend',MANDRILL_API_KEY:undefined};
  assert.equal(configured(resendEnv),true);
  const result=await sendResend(message,resendEnv,async(url,init)=>{
    assert.equal(String(url),'https://api.resend.com/emails');
    assert.equal((init!.headers as Record<string,string>)['Idempotency-Key'],message.idempotencyKey);
    const payload=JSON.parse(init!.body as string);
    assert.deepEqual(payload.to,[b.email]); assert.equal(payload.html,message.html);
    return Response.json({id:'mock-provider-id'});
  });
  assert.equal(result.status,'accepted');
  await assert.rejects(()=>sendResend(message,resendEnv,async()=>Response.json({error:'bad'},{status:429})));
});

test('dollar replacement sequences in personal text remain literal and cannot duplicate the snapshot', async () => {
  const snapshot=await readSnapshot();
  const note="$& $` $' $1 $<name>";
  const submission=parseSubmission({...body(),name:note,note})!;
  const result=compose(snapshot,submission,env.NEWSLETTER_SHARE_HMAC_KEY,'a'.repeat(64));
  assert.equal((result.html.match(/<!doctype html>/gi)||[]).length,(snapshot.html.match(/<!doctype html>/gi)||[]).length);
  assert.equal((result.html.match(/<body/gi)||[]).length,1);
  assert.ok(result.html.includes('$&amp; $` $&#39; $1 $&lt;name&gt;'));
  for (const image of snapshot.imageUrls) assert.equal(result.html.split(image).length,snapshot.html.split(image).length);
});
test('both bound editions preserve their content and subject; mismatched and unlisted editions cannot send', async () => {
  for (const edition of ['edition-20', 'edition-21'] as const) {
    const { deps, sent } = fixture();
    const snapshot = await readSnapshot(edition);
    assert.equal((await handleShare(request({ ...body(), edition }), deps)).status, 200);
    assert.equal(sent[0].subject, `The Innovation Pulse: Edition ${edition.slice(-2)}`);
    for (const image of snapshot.imageUrls) assert.ok(sent[0].html.includes(image) || sent[0].html.includes(image.replace(/&/g, '&amp;')));
    const mismatch = fixture();
    mismatch.deps.snapshot = () => readSnapshot(edition === 'edition-20' ? 'edition-21' : 'edition-20');
    assert.equal((await handleShare(request({ ...body(), edition }), mismatch.deps)).status, 503);
    assert.equal(mismatch.sent.length, 0);
  }
  await assert.rejects(() => readSnapshot('../edition-20' as 'edition-20'));
});

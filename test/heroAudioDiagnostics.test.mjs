import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
const ts = createRequire(import.meta.url)('typescript');
const output = ts.transpileModule(readFileSync(new URL('../lib/heroAudioDiagnostics.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const loaded = { exports: {} };
new Function('module', 'exports', output)(loaded, loaded.exports);
const { installHeroAudioDiagnostics: install, playbackCheckEnabled } = loaded.exports;
const key = 'ihe-playback-check:2026-10-16';
class Target extends EventTarget {
  listeners = 0;
  addEventListener(...args) { this.listeners++; super.addEventListener(...args); }
  removeEventListener(...args) { this.listeners--; super.removeEventListener(...args); }
  emit(name, fields = {}) { this.dispatchEvent(Object.assign(new Event(name), fields)); }
}
function setup({ data = new Map(), storage, audioProperties = {}, sessionProperties = {} } = {}) {
  const ranges = { length: 1, start: () => 0, end: () => 100 };
  const audio = Object.assign(new Target(), { currentTime: 0, duration: 423.16, paused: true, ended: false, readyState: 4, networkState: 1, error: null, buffered: ranges, seekable: ranges,
    play: () => assert.fail('diagnostics must not play'), pause: () => assert.fail('diagnostics must not pause'), load: () => assert.fail('diagnostics must not load'), ...audioProperties });
  const windowTarget = new Target(), documentTarget = Object.assign(new Target(), { visibilityState: 'visible' });
  const session = Object.assign(new Target(), { state: 'active', type: 'auto', ...sessionProperties });
  let now = 0, writes = 0;
  const controller = install(audio, '2026-10-16', {
    enabled: true, windowTarget, documentTarget, audioSession: () => session, navigationType: () => 'reload', now: () => now,
    storage: storage ?? (() => ({ getItem: k => data.get(k), setItem: (k,v) => { writes++; data.set(k,v); }, removeItem: k => data.delete(k) })),
  });
  return { audio, windowTarget, documentTarget, session, controller, data, writes: () => writes, tick: n => { now += n; } };
}
test('opt-out touches no browser objects, storage or audio', () => {
  const bomb = new Proxy({}, { get: () => assert.fail('unexpected opt-out access') });
  assert.equal(install(bomb, '2026-10-16', { enabled: false, storage: () => assert.fail('storage') }), null);
  assert.equal(install(bomb, 'https://private.example/id', { enabled: true }), null);
  assert.equal(playbackCheckEnabled('?audio-check=1'), true);
  for (const query of ['', '?audio-check=0', '?audio-check=10', '?other=1']) assert.equal(playbackCheckEnabled(query), false);
});
test('53-second pause and waiting have distinct states without controlling playback', () => {
  const s = setup(); s.tick(53000); s.audio.currentTime = 53; s.audio.paused = false; s.audio.emit('waiting');
  s.audio.paused = true; s.audio.emit('pause');
  const [waiting, pause] = s.controller.report().events.slice(-2);
  assert.equal(waiting.event, 'waiting'); assert.equal(waiting.paused, false);
  assert.equal(pause.event, 'pause'); assert.equal(pause.paused, true); assert.equal(pause.position, 53); assert.equal(pause.elapsedMs, 53000);
});
test('bounded ring carries across reload with separate mount elapsed time', () => {
  const s = setup(); for (let i = 0; i < 240; i++) { s.audio.currentTime = i; s.audio.emit('pause'); }
  assert.equal(s.controller.report().events.length, 200); s.controller.dispose();
  const reload = setup({ data: s.data }); const report = reload.controller.report();
  assert.equal(report.events.length, 200); assert.equal(report.mount, 2);
  assert.equal(report.events.at(-2).event, 'unmount'); assert.equal(report.events.at(-1).event, 'mount'); assert.equal(report.events.at(-1).elapsedMs, 0);
});
test('timeupdate sampling is at most once each five seconds', () => {
  const s = setup(); s.audio.emit('timeupdate'); for (let i = 0; i < 49; i++) { s.tick(100); s.audio.emit('timeupdate'); }
  assert.equal(s.controller.report().events.filter(e => e.event === 'timeupdate').length, 1);
  s.tick(100); s.audio.emit('timeupdate'); assert.equal(s.controller.report().events.filter(e => e.event === 'timeupdate').length, 2);
});
test('malformed, oversized, blocked and full storage leave an in-memory report', () => {
  for (const value of ['{', 'null', 'x'.repeat(500001)]) {
    const s = setup({ data: new Map([[key, value]]) }); assert.equal(s.controller.report().events.length, 1);
  }
  for (const storage of [() => { throw Error('secret'); }, () => ({ getItem: () => null, setItem: () => { throw Error('quota'); } })]) {
    const s = setup({ storage }); s.audio.emit('pause'); assert.equal(s.controller.report().events.length, 2); assert.equal(s.controller.report().storageAvailable, false);
    s.controller.clear(); assert.equal(s.controller.report().events.length, 0);
  }
});
test('only sanitized enums and numbers survive stored records and native getters', () => {
  const secret = 'https://private.example/?account=secret RAW USER AGENT';
  const dirty = { event: 'pause', position: 53, duration: Infinity, elapsedMs: -1, navigation: secret, visibility: secret, audioSessionType: secret, errorCode: 99, rawUA: secret, url: secret, buffered: [[0, 100], [secret, 2]] };
  const data = new Map([[key, JSON.stringify({ version: 1, edition: '2026-10-16', mount: 1, events: [dirty, { event: secret }] })]]);
  const s = setup({ data, audioProperties: { duration: NaN, networkState: 100, error: { code: secret, message: secret } }, sessionProperties: { type: secret, state: secret } });
  const report = s.controller.report(); assert.equal(report.events.length, 2); assert.doesNotMatch(JSON.stringify(report), /private|secret|USER AGENT|rawUA/);
  assert.equal(report.events[0].duration, null); assert.deepEqual(report.events[0].buffered, [[0,100]]); assert.equal(report.events.at(-1).networkState, null);
});
test('lifecycle, recovery and actions include explicit markers and page cache state', () => {
  const s = setup(); s.controller.mark('action-play'); s.controller.mark('action-seek', 53); s.controller.mark('recovery-restored', 53); s.controller.mark('recovery-installed');
  s.windowTarget.emit('pagehide', { persisted: true }); s.windowTarget.emit('pageshow', { persisted: true }); s.windowTarget.emit('blur'); s.windowTarget.emit('focus');
  s.documentTarget.visibilityState = 'hidden'; s.documentTarget.emit('visibilitychange'); s.session.state = 'interrupted'; s.session.emit('statechange');
  const report = s.controller.report(); assert.equal(report.events.find(e => e.event === 'action-seek').target, 53);
  assert.equal(report.events.find(e => e.event === 'pagehide').persisted, true);
  assert.equal(report.events.at(-1).audioSessionState, 'interrupted'); assert.equal(report.events.at(-1).visibility, 'hidden');
});
test('cleanup removes media, window, document and audio session listeners', () => {
  const s = setup(); s.controller.dispose(); const writes = s.writes();
  for (const target of [s.audio, s.windowTarget, s.documentTarget, s.session]) assert.equal(target.listeners, 0);
  s.audio.emit('pause'); s.windowTarget.emit('pagehide'); s.session.emit('statechange'); s.controller.mark('action-play'); s.controller.dispose();
  assert.equal(s.writes(), writes); assert.equal(s.controller.report().events.at(-1).event, 'unmount');
});
test('throwing native getters and ranges fail open', () => {
  const s = setup();
  for (const property of ['currentTime', 'duration', 'error', 'buffered', 'seekable']) Object.defineProperty(s.audio, property, { get: () => { throw Error('private details'); } });
  Object.defineProperty(s.session, 'state', { get: () => { throw Error('private details'); } });
  assert.doesNotThrow(() => s.audio.emit('error')); assert.doesNotMatch(JSON.stringify(s.controller.report()), /private details/);
  assert.equal(s.controller.report().events.at(-1).position, null);
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
const ts = createRequire(import.meta.url)('typescript');
function load(name) {
  const output = ts.transpileModule(readFileSync(new URL(`../lib/${name}.ts`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiledModule = { exports: {} }; new Function('module', 'exports', output)(compiledModule, compiledModule.exports); return compiledModule.exports;
}
const { installHeroAudioPlayback: install } = load('heroAudioPlayback');
const { installHeroAudioRecovery } = load('heroAudioRecovery');
const flush = () => new Promise(resolve => setImmediate(resolve));
function setup({ session = { type: 'auto' }, audioSession = () => session, others = () => false, position = 0 } = {}) {
  const calls = [], failures = [], storage = new Map();
  let playResult = () => Promise.resolve();
  const audio = Object.assign(new EventTarget(), {
    currentTime: position, duration: 423.16, readyState: 1, paused: true, ended: false, error: null,
    getAttribute: () => 'episode.mp3',
    load() { calls.push('load'); this.currentTime = 0; this.duration = NaN; this.readyState = 0; this.error = null; this.dispatchEvent(new Event('seeking')); },
    play() { calls.push('play'); return playResult(); },
    pause() { calls.push('pause'); this.paused = true; this.dispatchEvent(new Event('pause')); },
  });
  const recovery = installHeroAudioRecovery(audio, 'episode.mp3', {
    storage: () => ({ getItem: k => storage.get(k), setItem: (k,v) => storage.set(k,v), removeItem: k => storage.delete(k) }),
    windowTarget: new EventTarget(), documentTarget: Object.assign(new EventTarget(), { visibilityState: 'visible' }),
  });
  const controller = install(audio, {
    recovery: { preparePlayback: () => { calls.push('prepare'); recovery.preparePlayback(); }, explicitSeek: position => { calls.push(`restore:${position}`); recovery.explicitSeek(position); } },
    audioSession, otherMediaPlaying: others, onError: failure => failures.push(failure),
  });
  return { audio, controller, recovery, session, calls, failures, storage, result: fn => { playResult = fn; }, emit: name => audio.dispatchEvent(new Event(name)), metadata: () => { audio.duration = 423.16; audio.readyState = 1; audio.dispatchEvent(new Event('loadedmetadata')); } };
}
test('category is requested only on deliberate play; transient pause does not reset it', async () => {
  const s = setup(); assert.equal(s.session.type, 'auto'); assert.deepEqual(s.calls, []);
  s.controller.play(false); await flush(); assert.equal(s.session.type, 'auto');
  s.controller.toggle(); await flush(); assert.equal(s.session.type, 'playback');
  s.audio.paused = false; s.controller.toggle(); assert.equal(s.session.type, 'playback');
  s.controller.dispose(); assert.equal(s.session.type, 'auto');
});
test('unsupported, throwing and explicitly owned audio categories allow native play', async () => {
  for (const audioSession of [() => undefined, () => { throw Error('unsupported'); }, () => Object.defineProperty({}, 'type', { get: () => 'auto', set: () => { throw Error('blocked'); } })]) {
    const s = setup({ audioSession }); s.controller.toggle(); await flush(); assert.ok(s.calls.includes('play')); assert.deepEqual(s.failures, [false]);
  }
  const s = setup({ session: { type: 'play-and-record' } }); s.controller.toggle(); assert.equal(s.session.type, 'play-and-record');
});
test('cleanup does not reclassify another playing player or override a subsequent category', () => {
  const s = setup({ others: () => true }); s.controller.toggle(); s.controller.dispose(); assert.equal(s.session.type, 'playback');
  const changed = setup(); changed.controller.toggle(); changed.session.type = 'ambient'; changed.controller.dispose(); assert.equal(changed.session.type, 'ambient');
});
test('network failure reloads only on explicit retry, restores 53 seconds after load clears storage', async () => {
  const s = setup({ position: 53 }); s.emit('timeupdate');
  s.audio.error = { code: 2 }; s.emit('error'); assert.deepEqual(s.calls, []);
  s.controller.toggle(); assert.deepEqual(s.calls, ['load', 'prepare', 'play']); assert.equal(s.storage.size, 0);
  s.metadata(); assert.equal(s.audio.currentTime, 53); assert.equal(s.calls.at(-1), 'restore:53');
  await flush();
});
test('immediately ready metadata restores before play and maintains load/prepare order', () => {
  const s = setup({ position: 53 }); s.audio.error = { code: 2 };
  s.audio.load = () => { s.calls.push('load'); s.audio.currentTime = 0; s.audio.readyState = 1; s.audio.error = null; };
  s.controller.toggle(); assert.equal(s.audio.currentTime, 53); assert.deepEqual(s.calls, ['load', 'prepare', 'restore:53', 'play']);
});
test('non-Abort rejection retries after reload repeatedly; AbortError never triggers a reload', async () => {
  const s = setup({ position: 53 }); s.result(() => Promise.reject(new DOMException('network', 'NotSupportedError')));
  s.controller.toggle(); await flush(); assert.equal(s.failures.at(-1), true);
  s.controller.toggle(); s.metadata(); await flush(); s.controller.toggle(); s.metadata(); await flush();
  assert.equal(s.calls.filter(c => c === 'load').length, 2); assert.equal(s.audio.currentTime, 53);
  const abort = setup(); abort.result(() => Promise.reject(new DOMException('cancelled', 'AbortError')));
  abort.controller.toggle(); await flush(); abort.controller.toggle(); await flush();
  assert.equal(abort.calls.includes('load'), false); assert.equal(abort.failures.includes(true), false);
});
test('toggle uses native paused state, and a deliberate seek cancels pending retry restoration', () => {
  const s = setup({ position: 53 }); s.audio.paused = false; s.controller.toggle(); assert.deepEqual(s.calls, ['pause']);
  s.audio.error = { code: 2 }; s.controller.toggle(); s.controller.explicitSeek(0); s.metadata(); assert.equal(s.audio.currentTime, 0);
});
test('old promises cannot latch error after a newer play, user pause, or unmount', async () => {
  const s = setup(); let reject; s.result(() => new Promise((_, r) => { reject = r; }));
  s.controller.toggle(); const rejectOld = reject; s.result(() => Promise.resolve()); s.controller.toggle(); await flush();
  rejectOld(new DOMException('old', 'NotSupportedError')); await flush(); assert.equal(s.failures.includes(true), false);
  s.result(() => new Promise((_, r) => { reject = r; })); s.controller.toggle(); s.audio.paused = false; s.controller.toggle(); reject(new Error('cancelled')); await flush(); assert.equal(s.failures.includes(true), false);
  s.controller.toggle(); s.controller.dispose(); reject(new Error('unmounted')); await flush(); assert.equal(s.failures.includes(true), false);
});
test('dispose removes metadata restoration and future playback; natural end clears old position', () => {
  const s = setup({ position: 53 }); s.audio.error = { code: 2 }; s.controller.toggle(); s.controller.dispose(); const count = s.calls.length; s.metadata(); s.controller.toggle(); assert.equal(s.calls.length, count);
  const ended = setup({ position: 53 }); ended.audio.currentTime = 423.16; ended.audio.ended = true; ended.emit('ended'); ended.audio.ended = false; ended.audio.error = { code: 2 }; ended.controller.toggle(); ended.metadata(); assert.equal(ended.audio.currentTime, 0);
});

test('an actual failure retries on the first click even if native paused remains false', async () => {
  const s = setup({ position: 53 }); s.audio.paused = false; s.audio.error = { code: 2 }; s.emit('error');
  s.controller.toggle(); assert.deepEqual(s.calls, ['load', 'prepare', 'play']); s.metadata(); assert.equal(s.audio.currentTime, 53);
  const rejected = setup(); rejected.result(() => Promise.reject(new DOMException('failed', 'NotSupportedError')));
  rejected.controller.toggle(); await flush(); rejected.audio.paused = false; rejected.controller.toggle();
  assert.equal(rejected.calls.includes('load'), true); assert.equal(rejected.calls.includes('pause'), false); await flush();
});

test('a user can pause an in-flight retry without triggering a second reload', async () => {
  const s = setup({ position: 53 }); s.audio.error = { code: 2 }; let reject;
  s.result(() => new Promise((_, r) => { reject = r; }));
  s.controller.toggle(); s.audio.paused = false; s.controller.toggle();
  assert.equal(s.calls.filter(call => call === 'load').length, 1); assert.equal(s.calls.at(-1), 'pause');
  reject(new DOMException('paused', 'AbortError')); await flush(); assert.equal(s.failures.includes(true), false);
});

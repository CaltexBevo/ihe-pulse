import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
const ts = createRequire(import.meta.url)('typescript');
const output = ts.transpileModule(readFileSync(new URL('../lib/heroAudioRecovery.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const loaded = { exports: {} };
new Function('module', 'exports', output)(loaded, loaded.exports);
const { installHeroAudioRecovery } = loaded.exports;
const key = 'ihe-hero-position:episode.mp3';
function setup({ data = new Map(), duration = 423.16, position = 0, source = 'episode.mp3', storage } = {}) {
  const audio = Object.assign(new EventTarget(), { duration, currentTime: position, ended: false, getAttribute: () => source });
  const windowTarget = new EventTarget();
  const documentTarget = Object.assign(new EventTarget(), { visibilityState: 'visible' });
  let clock = 0, writes = 0;
  const controller = installHeroAudioRecovery(audio, source, {
    storage: storage ?? (() => ({ getItem: k => data.get(k), removeItem: k => data.delete(k), setItem: (k,v) => { writes++; data.set(k,v); } })),
    windowTarget, documentTarget, now: () => clock,
  });
  return { audio, data, controller, windowTarget, documentTarget, writes: () => writes, tick: n => { clock += n; }, emit: name => audio.dispatchEvent(new Event(name)) };
}
function bookmarked() { return new Map([[key, JSON.stringify({ source: 'episode.mp3', position: 95.959, duration: 423.16 })]]); }
test('95-second position survives disposal and reinstantiation without playing', () => {
  const first = setup(); first.audio.currentTime = 95.959; first.controller.dispose();
  const second = setup({ data: first.data }); assert.equal(second.audio.currentTime, 95.959);
});
test('explicit zero and natural end both permit a fresh replay', () => {
  const s = setup({ data: bookmarked() }); s.controller.explicitSeek(0); s.controller.preparePlayback();
  assert.equal(s.audio.currentTime, 0); assert.equal(s.data.has(key), false);
  s.audio.currentTime = 423.16; s.audio.ended = true; s.emit('ended'); s.controller.dispose();
  assert.equal(setup({ data: s.data }).audio.currentTime, 0);
});
test('late metadata restores but never overrides an explicit or native seek', () => {
  const s = setup({ data: bookmarked(), duration: NaN }); s.emit('pause'); assert.ok(s.data.has(key));
  s.audio.duration = 423.16; s.emit('loadedmetadata'); assert.equal(s.audio.currentTime, 95.959);
  const user = setup({ data: bookmarked(), duration: NaN }); user.controller.explicitSeek(12);
  user.audio.duration = 423.16; user.emit('loadedmetadata'); assert.equal(user.audio.currentTime, 12);
  assert.equal(setup({ data: bookmarked(), position: 33 }).audio.currentTime, 33);
});
test('source and duration identity reject wrong recordings', () => {
  assert.equal(setup({ data: bookmarked(), source: 'other.mp3' }).audio.currentTime, 0);
  const changed = setup({ data: bookmarked(), duration: 400 }); assert.equal(changed.audio.currentTime, 0); assert.equal(changed.data.has(key), false);
  const wrong = bookmarked(); wrong.set(key, JSON.stringify({ source: 'other.mp3', position: 95, duration: 423.16 }));
  assert.equal(setup({ data: wrong }).audio.currentTime, 0);
});
test('corrupt records and unavailable storage do not interrupt native playback', () => {
  for (const value of ['{', 'null', '{"source":"episode.mp3","position":-1,"duration":423.16}', '{"source":"episode.mp3","position":999,"duration":423.16}']) {
    assert.equal(setup({ data: new Map([[key, value]]) }).audio.currentTime, 0);
  }
  const s = setup({ storage: () => { throw new Error('blocked'); } });
  assert.doesNotThrow(() => { s.controller.explicitSeek(50); s.emit('pause'); s.controller.dispose(); });
  assert.equal(s.audio.currentTime, 50);
});
test('timeupdate is throttled while pause, hidden, pagehide and cleanup save immediately', () => {
  const s = setup(); s.audio.currentTime = 10; s.emit('timeupdate'); s.audio.currentTime = 11; s.emit('timeupdate'); assert.equal(s.writes(), 1);
  s.tick(1000); s.emit('timeupdate'); assert.equal(s.writes(), 2);
  s.emit('pause'); s.documentTarget.visibilityState = 'hidden'; s.documentTarget.dispatchEvent(new Event('visibilitychange'));
  s.windowTarget.dispatchEvent(new Event('pagehide')); s.controller.dispose(); assert.equal(s.writes(), 6);
  s.emit('pause'); s.emit('timeupdate'); s.windowTarget.dispatchEvent(new Event('pagehide')); assert.equal(s.writes(), 6);
});
test('an unexpected zero reset preserves a bookmark for the next user play', () => {
  const s = setup({ data: bookmarked() }); s.audio.currentTime = 0; s.emit('pause'); s.controller.preparePlayback(); assert.equal(s.audio.currentTime, 95.959);
});
test('cleanup does not write a replacement source position under the former source', () => {
  const s = setup({ data: bookmarked() }); s.audio.getAttribute = () => 'other.mp3'; s.audio.currentTime = 50; s.controller.dispose();
  assert.equal(JSON.parse(s.data.get(key)).position, 95.959);
});

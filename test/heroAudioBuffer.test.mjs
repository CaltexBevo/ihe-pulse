import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
const ts = createRequire(import.meta.url)('typescript');
function load(name) {
  const output = ts.transpileModule(readFileSync(new URL(`../lib/${name}.ts`, import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiled = { exports: {} };
  new Function('module', 'exports', 'require', output)(compiled, compiled.exports, path => load(path.replace('./', '')));
  return compiled.exports;
}
const { getHeroAudioBufferDescriptor: descriptorFor, installHeroAudioBuffer: install } = load('heroAudioBuffer');
const { installHeroAudioRecovery } = load('heroAudioRecovery');
const descriptor = descriptorFor('2026-10-16', '/audio/innovation-pulse-weekly-edition-21.mp3');
const completeData = new ArrayBuffer(10157705);
const flush = () => new Promise(resolve => setImmediate(resolve));
function deferred() { let resolve, reject; const promise = new Promise((a,b) => { resolve=a; reject=b; }); return { promise, resolve, reject }; }
class Target extends EventTarget {
  listeners = 0;
  addEventListener(...args) { this.listeners++; super.addEventListener(...args); }
  removeEventListener(...args) { this.listeners--; super.removeEventListener(...args); }
  emit(name) { this.dispatchEvent(new Event(name)); }
}
function setup({ fetchAudio, digest, bookmark, createURL, play, blockedStorage = false } = {}) {
  const calls = [], errors = [], preparing = [], revoked = [], storage = new Map();
  const key = 'ihe-hero-position:' + descriptor.source;
  if (bookmark !== undefined) storage.set(key, JSON.stringify({ source: descriptor.source, position: bookmark, duration: 423.16 }));
  const documentTarget = Object.assign(new Target(), { visibilityState: 'visible' }), windowTarget = new Target();
  let controller, resource = null, counter = 0, signal;
  const audio = Object.assign(new Target(), {
    tagName: 'AUDIO', currentTime: 0, duration: NaN, readyState: 0, paused: true, ended: false, error: null,
    getAttribute: () => resource,
    load() { calls.push('load'); this.currentTime=0; this.duration=NaN; this.readyState=0; this.emit('seeking'); this.emit('seeked'); },
    pause() { calls.push('pause'); this.paused=true; this.emit('pause'); },
    play() { calls.push('play'); if(play)return play(audio); this.duration=423.16; this.readyState=1; this.emit('loadedmetadata'); this.paused=false; this.emit('playing'); return Promise.resolve(); },
  });
  Object.defineProperty(audio, 'src', { get: () => resource, set: value => { resource=value; calls.push('source:'+value); } });
  const recovery = installHeroAudioRecovery(audio, descriptor.source, {
    ownsSource: src => controller?.ownsSource(src) ?? false,
    storage: () => { if(blockedStorage)throw Error('storage unavailable');return { getItem:k=>storage.get(k), setItem:(k,v)=>storage.set(k,v), removeItem:k=>storage.delete(k) }; }, windowTarget, documentTarget,
  });
  controller = install(audio, descriptor, {
    recovery, documentTarget, windowTarget,
    onPreparing:value=>preparing.push(value), onError:value=>errors.push(value),
    fetchAudio:(source, init)=> { calls.push('fetch:'+source); signal=init.signal; return fetchAudio ? fetchAudio(source, init) : Promise.resolve({ status:200, arrayBuffer:async()=>completeData }); },
    digest: async data=> { calls.push('digest'); return digest ? digest(data) : descriptor.sha256; },
    urls:{ createObjectURL: blob=> { assert.equal(blob.type,'audio/mpeg'); calls.push('blob'); return createURL ? createURL(controller) : 'blob:test-'+(++counter); }, revokeObjectURL: url=>revoked.push(url) },
    category:{ request:()=>calls.push('category'), dispose:()=>calls.push('category-dispose') },
  });
  return { audio, controller, recovery, calls, errors, preparing, revoked, storage, key, documentTarget, windowTarget, signal:()=>signal };
}
test('only exact edition and canonical source opt in, with no mount/autoplay fetch or HTTP source', () => {
  assert.ok(descriptor); assert.equal(descriptorFor('2026-10-09',descriptor.source),null);
  for(const source of [descriptor.source+'?x=1','https://www.innovatinghighered.com'+descriptor.source,'/audio/other.mp3'])assert.equal(descriptorFor('2026-10-16',source),null);
  const s=setup(); s.controller.play(false); assert.deepEqual(s.calls,[]); assert.equal(s.audio.src,null);
});
test('load is synchronous in the gesture; delayed full verification precedes Blob and play', async () => {
  const response=deferred(); const s=setup({ fetchAudio:()=>response.promise }); s.controller.toggle();
  assert.deepEqual(s.calls,['category','load','fetch:'+descriptor.source]); assert.equal(s.audio.src,null);
  // Resolution is explicitly deferred beyond the click call stack, like a long download.
  await flush(); assert.equal(s.calls.includes('play'),false);
  response.resolve({status:200,arrayBuffer:async()=>completeData}); await flush();
  assert.deepEqual(s.calls.slice(-3),['blob','source:blob:test-1','play']); assert.equal(s.preparing.at(-1),false);
});
test('HTTP 206/503, truncated bodies, hash mismatch and blocked fetch never assign a source or play', async () => {
  const cases=[{fetchAudio:async()=>({status:206,arrayBuffer:async()=>completeData})},{fetchAudio:async()=>({status:503,arrayBuffer:async()=>completeData})},{fetchAudio:async()=>({status:200,arrayBuffer:async()=>new ArrayBuffer(5)})},{digest:async()=>'bad'},{fetchAudio:async()=>{throw Error('blocked');}}];
  for(const config of cases){const s=setup(config);s.controller.toggle();await flush();assert.equal(s.audio.src,null);assert.equal(s.calls.includes('play'),false);assert.equal(s.errors.at(-1),true);}
});
test('explicit cancellation aborts pending preparation and stale response/body/hash cannot start', async () => {
  for(const stage of ['response','body','hash']){
    const wait=deferred(); const s=setup({fetchAudio:async()=>stage==='response'?wait.promise:{status:200,arrayBuffer:()=>stage==='body'?wait.promise:Promise.resolve(completeData)},digest:()=>stage==='hash'?wait.promise:Promise.resolve(descriptor.sha256)});
    s.controller.toggle();await flush();s.controller.toggle();assert.equal(s.signal().aborted,true);
    wait.resolve(stage==='response'?{status:200,arrayBuffer:async()=>completeData}:stage==='body'?completeData:descriptor.sha256);await flush();
    assert.equal(s.audio.src,null);assert.equal(s.calls.includes('play'),false);assert.equal(s.preparing.at(-1),false);
  }
});
test('hidden, pagehide, competing media and disposal cancel pending work', async () => {
  for(const action of ['hidden','pagehide','competing','dispose']){
    const wait=deferred();const s=setup({fetchAudio:()=>wait.promise});s.controller.toggle();
    if(action==='hidden'){s.documentTarget.visibilityState='hidden';s.documentTarget.emit('visibilitychange');}
    if(action==='pagehide')s.windowTarget.emit('pagehide');
    if(action==='competing'){const event=new Event('play');Object.defineProperty(event,'target',{value:{tagName:'VIDEO'}});s.documentTarget.dispatchEvent(event);}
    if(action==='dispose')s.controller.dispose();
    wait.resolve({status:200,arrayBuffer:async()=>completeData});await flush();assert.equal(s.calls.includes('play'),false);assert.equal(s.signal().aborted,true);
  }
});
test('stale object URLs are revoked; valid owned URL survives pause, background, seek, end and replay offline', async () => {
  const stale=setup({createURL:controller=>{controller.toggle();return 'blob:stale';}});stale.controller.toggle();await flush();assert.deepEqual(stale.revoked,['blob:stale']);assert.equal(stale.audio.src,null);
  const s=setup();s.controller.toggle();await flush();s.documentTarget.visibilityState='hidden';s.documentTarget.emit('visibilitychange');s.windowTarget.emit('pagehide');
  assert.equal(s.audio.paused,false);assert.deepEqual(s.revoked,[]);
  s.documentTarget.visibilityState='visible';s.controller.toggle();s.controller.explicitSeek(200);s.controller.toggle();await flush();
  s.audio.ended=true;s.audio.currentTime=423.16;s.audio.emit('ended');s.audio.paused=true;s.audio.ended=false;s.controller.toggle();await flush();
  assert.equal(s.calls.filter(c=>c.startsWith('fetch:')).length,1);assert.deepEqual(s.revoked,[]);s.controller.dispose();assert.deepEqual(s.revoked,['blob:test-1']);
});
test('internal load zero events preserve canonical bookmark and restore at the same point', async () => {
  const s=setup({bookmark:53});s.controller.toggle();assert.equal(JSON.parse(s.storage.get(s.key)).position,53);await flush();
  assert.equal(s.audio.currentTime,53);s.audio.currentTime=95;s.audio.emit('pause');assert.equal(JSON.parse(s.storage.get(s.key)).position,95);
});
test('explicit zero during preparation overrides bookmark; ending does not restore an old point', async () => {
  const response=deferred();const s=setup({bookmark:53,fetchAudio:()=>response.promise});s.controller.toggle();s.controller.explicitSeek(0);response.resolve({status:200,arrayBuffer:async()=>completeData});await flush();assert.equal(s.audio.currentTime,0);assert.equal(s.storage.has(s.key),false);
  s.audio.currentTime=423.16;s.audio.ended=true;s.audio.emit('ended');s.audio.currentTime=0;s.audio.ended=false;s.audio.paused=true;s.controller.toggle();await flush();assert.equal(s.audio.currentTime,0);
});
test('permission rejection retains ready Blob for fresh deliberate Play without fetching again', async () => {
  let attempts=0;const s=setup({play:audio=>{if(++attempts===1)return Promise.reject(new DOMException('gesture','NotAllowedError'));audio.paused=false;audio.emit('playing');return Promise.resolve();}});
  s.controller.toggle();await flush();assert.equal(s.errors.at(-1),true);assert.equal(s.preparing.at(-1),false);assert.equal(s.audio.src,'blob:test-1');s.controller.toggle();await flush();assert.equal(attempts,2);assert.equal(s.calls.filter(c=>c.startsWith('fetch:')).length,1);
});
test('cancel after play request aborts queued playback and stale rejection cannot change a newer intent', async () => {
  const wait=deferred();const s=setup({play:()=>wait.promise});s.controller.toggle();await flush();s.documentTarget.visibilityState='hidden';s.documentTarget.emit('visibilitychange');assert.ok(s.calls.includes('pause'));wait.reject(new DOMException('interrupted','AbortError'));await flush();assert.equal(s.errors.includes(true),false);
});
test('failed preparation can retry explicitly and cleanup removes every buffer listener', async () => {
  let attempts=0;const s=setup({fetchAudio:async()=>{if(++attempts===1)throw Error('offline');return{status:200,arrayBuffer:async()=>completeData};}});s.controller.toggle();await flush();s.controller.toggle();await flush();assert.equal(attempts,2);assert.equal(s.calls.filter(c=>c==='play').length,1);
  s.recovery.dispose();s.controller.dispose();assert.equal(s.audio.listeners,0);assert.equal(s.documentTarget.listeners,0);assert.equal(s.windowTarget.listeners,0);
});

test('a seek before the first preparation survives the empty element load', async () => {
  const s=setup({bookmark:53});s.controller.explicitSeek(120);s.controller.toggle();await flush();assert.equal(s.audio.currentTime,120);
  const zero=setup({bookmark:53});zero.controller.explicitSeek(0);zero.controller.toggle();await flush();assert.equal(zero.audio.currentTime,0);
});
test('an older canceled request cannot replace a newer verified Blob', async () => {
  const old=deferred();let request=0;const s=setup({fetchAudio:()=>++request===1?old.promise:Promise.resolve({status:200,arrayBuffer:async()=>completeData})});
  s.controller.toggle();s.controller.toggle();s.controller.toggle();await flush();assert.equal(s.audio.src,'blob:test-1');
  old.resolve({status:200,arrayBuffer:async()=>completeData});await flush();assert.equal(s.audio.src,'blob:test-1');assert.equal(s.calls.filter(c=>c==='blob').length,1);assert.equal(s.calls.filter(c=>c==='play').length,1);
});

test('canceling a pending native play pauses even when paused became false before playing', async () => {
  for (const action of ['explicit','hidden','competing']) {
    const wait=deferred();
    const s=setup({play:audio=>{audio.paused=false;return wait.promise.then(()=>{if(!audio.paused)audio.emit('playing');});}});
    s.controller.toggle();await flush();assert.equal(s.audio.paused,false);assert.equal(s.preparing.at(-1),true);
    if(action==='explicit')s.controller.toggle();
    if(action==='hidden'){s.documentTarget.visibilityState='hidden';s.documentTarget.emit('visibilitychange');}
    if(action==='competing'){const event=new Event('play');Object.defineProperty(event,'target',{value:{tagName:'AUDIO'}});s.documentTarget.dispatchEvent(event);}
    assert.equal(s.audio.paused,true);assert.ok(s.calls.includes('pause'));
    wait.resolve();await flush();assert.equal(s.audio.paused,true);assert.equal(s.preparing.at(-1),false);
  }
});

test('same-controller Blob reload keeps position in memory when storage is blocked, and zero cancels it', async () => {
  const s=setup({blockedStorage:true});s.controller.toggle();await flush();s.audio.currentTime=95;s.audio.error={code:2};s.controller.toggle();await flush();assert.equal(s.audio.currentTime,95);
  s.audio.currentTime=95;s.audio.error={code:2};s.audio.play=()=>Promise.resolve();s.controller.toggle();s.controller.explicitSeek(0);
  s.audio.duration=423.16;s.audio.readyState=1;s.audio.emit('loadedmetadata');await flush();assert.equal(s.audio.currentTime,0);
});

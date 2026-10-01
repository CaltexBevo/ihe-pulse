import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import test from "node:test";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = resolve(import.meta.dirname, "..");
const helperPath = resolve(root, "lib/featureAudioPlayback.ts");
const teachingDataPath = resolve(root, "lib/data/featured-coverage-teaching-superpower.ts");

function loadHelper() {
  const source = readFileSync(helperPath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: helperPath,
  }).outputText;
  const loaded = { exports: {} };
  new Function("module", "exports", output)(loaded, loaded.exports);
  return loaded.exports;
}

const { attemptFeaturePlayback, formatFeatureAudioTime, installExclusiveAudioPlayback } = loadHelper();

test("normal play interruptions stay recoverable and actual media failures can retry", async () => {
  const calls = [];
  const abortingAudio = {
    load: () => calls.push("load"),
    play: () => Promise.reject(new DOMException("Interrupted", "AbortError")),
  };

  assert.equal(await attemptFeaturePlayback(abortingAudio), "interrupted");
  assert.deepEqual(calls, []);

  let fail = true;
  const retryableAudio = {
    load: () => calls.push("retry-load"),
    play: () => {
      calls.push("play");
      return fail
        ? Promise.reject(new DOMException("Missing audio", "NotSupportedError"))
        : Promise.resolve();
    },
  };

  assert.equal(await attemptFeaturePlayback(retryableAudio), "unavailable");
  fail = false;
  assert.equal(await attemptFeaturePlayback(retryableAudio, true), "playing");
  assert.deepEqual(calls, ["play", "retry-load", "play"]);
});

test("a newly played audio element pauses every competing page player", () => {
  let playHandler;
  let removed = false;
  let weeklyPaused = false;
  let otherFeaturePaused = false;
  const activeAudio = { tagName: "AUDIO", pause: () => assert.fail("active player must keep playing") };
  const weeklyAudio = { tagName: "AUDIO", pause: () => { weeklyPaused = true; } };
  const otherAudio = { tagName: "AUDIO", pause: () => { otherFeaturePaused = true; } };
  const documentRef = {
    addEventListener: (name, listener, capture) => {
      assert.equal(name, "play");
      assert.equal(capture, true);
      playHandler = listener;
    },
    removeEventListener: (name, listener, capture) => {
      assert.equal(name, "play");
      assert.equal(listener, playHandler);
      assert.equal(capture, true);
      removed = true;
    },
    querySelectorAll: (selector) => {
      assert.equal(selector, "audio");
      return [activeAudio, weeklyAudio, otherAudio];
    },
  };

  const dispose = installExclusiveAudioPlayback(documentRef);
  playHandler({ target: activeAudio });
  assert.equal(weeklyPaused, true);
  assert.equal(otherFeaturePaused, true);
  dispose();
  assert.equal(removed, true);
});

test("runtime formatting uses finite measured media time only", () => {
  assert.equal(formatFeatureAudioTime(3661.9), "61:01");
  assert.equal(formatFeatureAudioTime(402.68, true), "6:43");
  assert.equal(formatFeatureAudioTime(Number.NaN), "0:00");
  const playerSource = readFileSync(resolve(root, "components/FeatureAudioPlayer.tsx"), "utf8");
  assert.match(playerSource, /if \(audio && Number\.isFinite\(audio\.duration\) && audio\.duration > 0\)/);
  assert.match(playerSource, /onLoadedMetadata=\{syncDuration\}/);
  assert.doesNotMatch(playerSource, /audioDuration\s*\|\|\s*\d/);
  assert.match(readFileSync(teachingDataPath, "utf8"), /audioDuration": "6:43"/);
});

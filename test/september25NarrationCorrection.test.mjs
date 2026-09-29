import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const digest = (value) => createHash("sha256").update(value).digest("hex");

test("September 25 episode points to the exact corrected narration", async () => {
  const episode = JSON.parse(
    await readFile(new URL("../data/daily-pulse/2026-09-25.json", import.meta.url), "utf8"),
  ).episode;
  const waveformSource = await readFile(
    new URL("../lib/home-pulse-waveforms.ts", import.meta.url),
    "utf8",
  );
  const waveformBlock = waveformSource.match(/"2026-09-25": \[([\s\S]*?)\],/);

  assert.equal(episode.audioUrl, "/audio/2026-09-25-v2.mp3");
  assert.equal(episode.audioDuration, "7:04");
  assert.equal(
    digest(episode.broadcastScript.trim()),
    "831c419cfdbeb023b70c3ac5906e4b11d9b78fb0ab044ce739be3cb339326bf7",
  );
  assert.match(episode.broadcastScript, /^I'm Dr\. Norma Jones\./);
  assert.doesNotMatch(episode.broadcastScript, /Dr\. Norma Jones proposes/);
  assert.ok(waveformBlock);

  const bins = waveformBlock[1].match(/\d+/g).map(Number);
  assert.equal(bins.length, 104);
  assert.equal(Math.min(...bins), 14);
  assert.equal(Math.max(...bins), 100);
});

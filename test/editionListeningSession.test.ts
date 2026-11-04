import assert from 'node:assert/strict';
import test from 'node:test';
import { createListeningSession } from '../lib/editionListeningSession.ts';

test('switching tracks cancels an outstanding play result and pauses the old element', async () => {
  let rejectPlay!: (error: Error) => void;
  let pauses = 0;
  const old = { paused: true, load() {}, pause() { pauses++; }, play: () => new Promise<void>((_, reject) => { rejectPlay=reject; }) };
  const session = createListeningSession();
  const pending = session.toggle(old);
  session.stop(old);
  rejectPlay(new Error('late media failure'));
  assert.equal(await pending, 'interrupted');
  assert.equal(pauses, 1);
});

test('a second click while play is pending cancels without starting another play', async () => {
  let resolvePlay!: () => void;
  let plays = 0;
  let pauses = 0;
  const audio = { paused: true, load() {}, pause() { pauses++; }, play: () => {
    plays++;
    return new Promise<void>(resolve => { resolvePlay=resolve; });
  }};
  const session = createListeningSession();
  const pending = session.toggle(audio);
  assert.equal(await session.toggle(audio), 'interrupted');
  resolvePlay();
  assert.equal(await pending, 'interrupted');
  assert.equal(plays, 1);
  assert.equal(pauses, 1);
});

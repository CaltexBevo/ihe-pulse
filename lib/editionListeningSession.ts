import { attemptFeaturePlayback } from './featureAudioPlayback';

/** Scope asynchronous playback results to the media element that requested them. */
export function createListeningSession() {
  let generation = 0;
  let pending = false;
  return {
    stop(audio: Pick<HTMLAudioElement, 'pause'>) {
      generation++;
      pending = false;
      audio.pause();
    },
    async toggle(audio: Pick<HTMLAudioElement, 'paused' | 'play' | 'load' | 'pause'>, retry = false) {
      const request = ++generation;
      if (pending || !audio.paused) {
        pending = false;
        audio.pause();
        return 'interrupted';
      }
      pending = true;
      const result = await attemptFeaturePlayback(audio, retry);
      if (request !== generation) return 'interrupted';
      pending = false;
      return result;
    },
  };
}

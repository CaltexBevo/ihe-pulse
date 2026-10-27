type AudioSession = { type: string };
export function createHeroPlaybackCategory(audio: HTMLAudioElement, options: {
  audioSession?: () => AudioSession | undefined;
  otherMediaPlaying?: () => boolean;
} = {}) {
  let owned: { session: AudioSession; previous: string } | null = null;
  return {
    request() {
      try {
        const session = (options.audioSession ?? (() => (navigator as Navigator & { audioSession?: AudioSession }).audioSession))();
        if (!session || session.type !== 'auto') return;
        session.type = 'playback';
        owned = { session, previous: 'auto' };
      } catch { /* Optional API; native playback remains available. */ }
    },
    dispose() {
      try {
        const otherPlaying = options.otherMediaPlaying ?? (() => Array.from(document.querySelectorAll('audio, video')).some(media => media !== audio && !(media as HTMLMediaElement).paused));
        if (owned && audio.paused && !otherPlaying() && owned.session.type === 'playback') owned.session.type = owned.previous;
      } catch { /* Do not change page-wide behavior when safety cannot be checked. */ }
      owned = null;
    },
  };
}

type Position = { time: number; duration: number };

/** Explicit play/retry only. Background events never start or reload media. */
export function installHeroAudioPlayback(audio: HTMLAudioElement, options: {
  recovery: { preparePlayback: () => void; explicitSeek: (position: number) => void };
  audioSession?: () => AudioSession | undefined;
  otherMediaPlaying?: () => boolean;
  onError: (failed: boolean) => void;
  onRestore?: (position: number) => void;
}) {
  let disposed = false, attempt = 0, needsReload = false;
  let lastPosition: Position | null = null;
  let retryPosition: Position | null = null;
  const category = createHeroPlaybackCategory(audio, options);
  let restoring = false;
  const remember = () => {
    const time = audio.currentTime, duration = audio.duration;
    if (Number.isFinite(time) && Number.isFinite(duration) && time > 0 && time < duration) {
      lastPosition = { time, duration };
    }
  };
  const restoreRetry = () => {
    if (!retryPosition || disposed || audio.readyState < 1 || !Number.isFinite(audio.duration)) return;
    const saved = retryPosition;
    retryPosition = null;
    if (audio.currentTime !== 0 || Math.abs(saved.duration - audio.duration) > 0.25) return;
    try {
      restoring = true;
      options.recovery.explicitSeek(saved.time);
      options.onRestore?.(saved.time);
    } catch { /* A failed native seek must not prevent the explicit play attempt. */ }
    finally { restoring = false; }
  };
  const error = () => { remember(); needsReload = true; };
  const ended = () => { lastPosition = null; retryPosition = null; };
  const seeking = () => {
    // load() can emit a zero seek with no metadata; retain the retry checkpoint.
    if (restoring || audio.readyState < 1) return;
    retryPosition = null;
    if (audio.currentTime === 0) lastPosition = null;
    else remember();
  };
  audio.addEventListener('timeupdate', remember);
  audio.addEventListener('pause', remember);
  audio.addEventListener('error', error);
  audio.addEventListener('ended', ended);
  audio.addEventListener('seeking', seeking);
  audio.addEventListener('loadedmetadata', restoreRetry);
  remember();

  const play = (deliberate = true) => {
    if (disposed) return;
    const currentAttempt = ++attempt;
    options.onError(false);
    try {
      if (needsReload || audio.error) {
        remember();
        retryPosition = lastPosition;
        needsReload = false;
        // Keep an in-memory checkpoint even if load's reset clears tab storage.
        audio.load();
      }
      options.recovery.preparePlayback();
      restoreRetry();
      if (deliberate) category.request();
      const result = audio.play();
      Promise.resolve(result).then(() => {
        if (!disposed && currentAttempt === attempt) needsReload = false;
      }).catch((failure: unknown) => {
        if (disposed || currentAttempt !== attempt) return;
        if ((failure as { name?: string } | null)?.name === 'AbortError') return;
        needsReload = true;
        if (deliberate || (failure as { name?: string } | null)?.name !== 'NotAllowedError') options.onError(true);
      });
    } catch (failure) {
      if ((failure as { name?: string } | null)?.name !== 'AbortError') {
        needsReload = true;
        options.onError(true);
      }
    }
  };
  const shouldPlay = () => audio.paused || needsReload || Boolean(audio.error);
  return {
    play,
    shouldPlay,
    toggle() {
      if (disposed) return;
      if (shouldPlay()) play();
      else { ++attempt; audio.pause(); }
    },
    explicitSeek(position: number) {
      retryPosition = null;
      lastPosition = null;
      options.recovery.explicitSeek(position);
      remember();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      ++attempt;
      audio.removeEventListener('timeupdate', remember);
      audio.removeEventListener('pause', remember);
      audio.removeEventListener('error', error);
      audio.removeEventListener('ended', ended);
      audio.removeEventListener('seeking', seeking);
      audio.removeEventListener('loadedmetadata', restoreRetry);
      category.dispose();
    },
  };
}

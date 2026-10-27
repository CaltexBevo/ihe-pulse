/** Same-tab position recovery only: never starts playback or reloads media. */
export function installHeroAudioRecovery(
  audio: HTMLAudioElement,
  source: string,
  options: {
    storage?: () => Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
    windowTarget?: EventTarget;
    documentTarget?: EventTarget & { visibilityState: string };
    now?: () => number;
    onRestore?: (position: number) => void;
    ownsSource?: (source: string | null) => boolean;
  } = {},
) {
  const key = 'ihe-hero-position:' + source;
  const storage = options.storage ?? (() => window.sessionStorage);
  const windowTarget = options.windowTarget ?? window;
  const documentTarget = options.documentTarget ?? document;
  const now = options.now ?? Date.now;
  let lastSave = -Infinity;
  let pending = true;
  let disposed = false;
  let resetting = false;
  let deferredSeek: number | null = null;
  let resetCheckpoint: { source: string; position: number; duration: number } | null = null;
  const ownsSource = () => options.ownsSource ? options.ownsSource(audio.getAttribute('src')) : audio.getAttribute('src') === source;

  const clear = () => {
    try { storage().removeItem(key); } catch { /* Storage is optional. */ }
  };
  const restore = () => {
    if (disposed || resetting || !ownsSource() || !pending || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    pending = false;
    if (deferredSeek !== null) {
      resetCheckpoint = null;
      const position = Math.min(deferredSeek, audio.duration);
      deferredSeek = null;
      try { audio.currentTime = position; options.onRestore?.(position); } catch { /* Native seek can be unavailable. */ }
      return;
    }
    // Native restoration and the listener's own seek always take precedence.
    if (audio.currentTime !== 0 || audio.ended) { resetCheckpoint = null; return; }
    try {
      let saved = resetCheckpoint;
      if (!saved) {
        const raw = storage().getItem(key);
        if (!raw) return;
        saved = JSON.parse(raw);
      }
      if (saved?.source !== source || !Number.isFinite(saved.position) ||
          !Number.isFinite(saved.duration) || saved.duration <= 0 ||
          saved.position <= 0 || saved.position >= saved.duration ||
          Math.abs(saved.duration - audio.duration) > 0.25) {
        resetCheckpoint = null;
        clear();
        return;
      }
      audio.currentTime = saved.position;
      resetCheckpoint = null;
      options.onRestore?.(saved.position);
    } catch { /* Invalid storage or an unavailable native seek must not break play. */ }
  };
  const save = () => {
    if (disposed || pending || resetting || !ownsSource()) return;
    if (audio.ended) { clear(); return; }
    const position = audio.currentTime;
    const duration = audio.duration;
    // A browser reset to zero must not erase the last useful recovery point.
    if (!Number.isFinite(position) || !Number.isFinite(duration) ||
        duration <= 0 || position <= 0 || position >= duration) return;
    try {
      storage().setItem(key, JSON.stringify({ source, position, duration }));
      lastSave = now();
    } catch { /* Private browsing and full storage still allow native playback. */ }
  };
  const timeupdate = () => { if (now() - lastSave >= 1000) save(); };
  const ended = () => { if (!resetting) { pending = false; resetCheckpoint = null; clear(); } };
  const nativeSeek = () => {
    if (disposed || resetting || !ownsSource()) return;
    pending = false;
    resetCheckpoint = null;
    // Native controls (including lock-screen controls) can restart without our UI.
    if (audio.currentTime === 0) clear();
    else save();
  };
  const hidden = () => { if (documentTarget.visibilityState === 'hidden') save(); };
  const metadata = () => {
    if (!ownsSource()) return;
    resetting = false;
    restore();
  };
  audio.addEventListener('loadedmetadata', metadata);
  audio.addEventListener('timeupdate', timeupdate);
  audio.addEventListener('pause', save);
  audio.addEventListener('ended', ended);
  audio.addEventListener('seeking', nativeSeek);
  audio.addEventListener('seeked', nativeSeek);
  windowTarget.addEventListener('pagehide', save);
  documentTarget.addEventListener('visibilitychange', hidden);
  restore();

  return {
    beginSourceReset() {
      save();
      if (ownsSource() && Number.isFinite(audio.currentTime) && Number.isFinite(audio.duration) && audio.currentTime > 0 && audio.currentTime < audio.duration) {
        resetCheckpoint = { source, position: audio.currentTime, duration: audio.duration };
      }
      resetting = true;
      pending = true;
    },
    preparePlayback() { pending = true; restore(); },
    explicitSeek(position: number) {
      resetCheckpoint = null;
      if (resetting || (options.ownsSource && !ownsSource())) {
        pending = true;
        deferredSeek = position;
        if (position === 0) clear();
        return;
      }
      pending = false;
      // Clear before the native assignment, including a seek before metadata.
      if (position === 0) clear();
      audio.currentTime = position;
      save();
    },
    dispose() {
      save();
      disposed = true;
      audio.removeEventListener('loadedmetadata', metadata);
      audio.removeEventListener('timeupdate', timeupdate);
      audio.removeEventListener('pause', save);
      audio.removeEventListener('ended', ended);
      audio.removeEventListener('seeking', nativeSeek);
      audio.removeEventListener('seeked', nativeSeek);
      windowTarget.removeEventListener('pagehide', save);
      documentTarget.removeEventListener('visibilitychange', hidden);
    },
  };
}

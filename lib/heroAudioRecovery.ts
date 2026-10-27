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

  const clear = () => {
    try { storage().removeItem(key); } catch { /* Storage is optional. */ }
  };
  const restore = () => {
    if (disposed || !pending || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    pending = false;
    // Native restoration and the listener's own seek always take precedence.
    if (audio.currentTime !== 0 || audio.ended) return;
    try {
      const raw = storage().getItem(key);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved?.source !== source || !Number.isFinite(saved.position) ||
          !Number.isFinite(saved.duration) || saved.duration <= 0 ||
          saved.position <= 0 || saved.position >= saved.duration ||
          Math.abs(saved.duration - audio.duration) > 0.25) {
        clear();
        return;
      }
      audio.currentTime = saved.position;
      options.onRestore?.(saved.position);
    } catch { /* Invalid storage or an unavailable native seek must not break play. */ }
  };
  const save = () => {
    if (disposed || pending || audio.getAttribute('src') !== source) return;
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
  const ended = () => { pending = false; clear(); };
  const nativeSeek = () => {
    if (disposed || audio.getAttribute('src') !== source) return;
    pending = false;
    // Native controls (including lock-screen controls) can restart without our UI.
    if (audio.currentTime === 0) clear();
    else save();
  };
  const hidden = () => { if (documentTarget.visibilityState === 'hidden') save(); };
  audio.addEventListener('loadedmetadata', restore);
  audio.addEventListener('timeupdate', timeupdate);
  audio.addEventListener('pause', save);
  audio.addEventListener('ended', ended);
  audio.addEventListener('seeking', nativeSeek);
  audio.addEventListener('seeked', nativeSeek);
  windowTarget.addEventListener('pagehide', save);
  documentTarget.addEventListener('visibilitychange', hidden);
  restore();

  return {
    preparePlayback() { pending = true; restore(); },
    explicitSeek(position: number) {
      pending = false;
      // Clear before the native assignment, including a seek before metadata.
      if (position === 0) clear();
      audio.currentTime = position;
      save();
    },
    dispose() {
      save();
      disposed = true;
      audio.removeEventListener('loadedmetadata', restore);
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

import { createHeroPlaybackCategory } from './heroAudioPlayback';

const edition21 = Object.freeze({
  edition: '2026-10-16',
  source: '/audio/innovation-pulse-weekly-edition-21.mp3',
  bytes: 10157705,
  sha256: '4a0de558470b59903e8ce9b9b09974b6c8b893aa771ebb2ee7c681bbf8c8d133',
});
export function getHeroAudioBufferDescriptor(edition: string, source: string) {
  return edition === edition21.edition && source === edition21.source ? edition21 : null;
}
type Recovery = {
  beginSourceReset: () => void;
  preparePlayback: () => void;
  explicitSeek: (position: number) => void;
};

/** Only a complete, verified encoded episode becomes a native audio source. */
export function installHeroAudioBuffer(audio: HTMLAudioElement, descriptor: NonNullable<ReturnType<typeof getHeroAudioBufferDescriptor>>, options: {
  recovery: Recovery;
  onPreparing: (preparing: boolean) => void;
  onError: (failed: boolean) => void;
  fetchAudio?: (source: string, options: RequestInit) => Promise<Pick<Response, 'status' | 'arrayBuffer'>>;
  digest?: (data: ArrayBuffer) => Promise<string>;
  urls?: Pick<typeof URL, 'createObjectURL' | 'revokeObjectURL'>;
  category?: { request: () => void; dispose: () => void };
  windowTarget?: EventTarget;
  documentTarget?: EventTarget & { visibilityState: string };
}) {
  const windowTarget = options.windowTarget ?? window;
  const documentTarget = options.documentTarget ?? document;
  const urls = options.urls ?? URL;
  const category = options.category ?? createHeroPlaybackCategory(audio);
  const fetchAudio = options.fetchAudio ?? fetch;
  const digest = options.digest ?? (async (data: ArrayBuffer) => {
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
  });
  let ownedBlob: string | null = null;
  let generation = 0, disposed = false, preparing = false, awaitingPlay = false;
  let abort: AbortController | null = null;
  const current = (intent: number) => !disposed && generation === intent;
  const setPreparing = (value: boolean) => { preparing = value; options.onPreparing(value); };
  const cancel = () => {
    if (!preparing) return;
    ++generation;
    abort?.abort();
    abort = null;
    // Cancel a queued play promise, never an already playing prepared episode.
    const cancelQueuedPlay = awaitingPlay;
    awaitingPlay = false;
    if (cancelQueuedPlay) audio.pause();
    setPreparing(false);
  };
  const playPrepared = async (intent: number) => {
    if (!current(intent)) return;
    if (documentTarget.visibilityState === 'hidden') { cancel(); return; }
    options.recovery.preparePlayback();
    awaitingPlay = true;
    try {
      await audio.play();
      if (!current(intent)) return;
      awaitingPlay = false;
      setPreparing(false);
    } catch (error) {
      if (!current(intent)) return;
      awaitingPlay = false;
      setPreparing(false);
      if ((error as { name?: string } | null)?.name !== 'AbortError') options.onError(true);
      // Permission failures retain the verified Blob for the next deliberate Play.
    }
  };
  const prepare = async (intent: number, signal: AbortSignal) => {
    try {
      const response = await fetchAudio(descriptor.source, { signal, cache: 'no-store' });
      if (!current(intent)) return;
      if (response.status !== 200) throw new Error('Incomplete response');
      const data = await response.arrayBuffer();
      if (!current(intent)) return;
      if (data.byteLength !== descriptor.bytes) throw new Error('Incomplete episode');
      const hash = await digest(data);
      if (!current(intent)) return;
      if (hash !== descriptor.sha256) throw new Error('Episode verification failed');
      const url = urls.createObjectURL(new Blob([data], { type: 'audio/mpeg' }));
      if (!current(intent)) { urls.revokeObjectURL(url); return; }
      ownedBlob = url;
      audio.src = url;
      abort = null;
      if (!current(intent)) return;
      await playPrepared(intent);
      if (!current(intent)) return;
    } catch {
      if (!current(intent)) return;
      abort = null;
      awaitingPlay = false;
      setPreparing(false);
      options.onError(true);
    }
  };
  const play = (deliberate = true) => {
    if (!deliberate || disposed || preparing) return;
    const intent = ++generation;
    options.onError(false);
    setPreparing(true);
    category.request();
    try {
      if (ownedBlob) {
        if (audio.error) { options.recovery.beginSourceReset(); audio.load(); }
        void playPrepared(intent);
      } else {
        // Synchronous native load during the click retains Safari's media gesture.
        // Recovery saves the canonical checkpoint before this internal zero reset.
        options.recovery.beginSourceReset();
        audio.load();
        abort = new AbortController();
        void prepare(intent, abort.signal);
      }
    } catch {
      if (!current(intent)) return;
      setPreparing(false);
      options.onError(true);
    }
  };
  const playing = () => {
    if (awaitingPlay && preparing) { awaitingPlay = false; setPreparing(false); }
  };
  const paused = () => { if (awaitingPlay) cancel(); };
  const hidden = () => { if (documentTarget.visibilityState === 'hidden') cancel(); };
  const competingPlay = (event: Event) => {
    const target = event.target as { tagName?: string } | null;
    if (event.target !== audio && (target?.tagName === 'AUDIO' || target?.tagName === 'VIDEO')) cancel();
  };
  audio.addEventListener('playing', playing);
  audio.addEventListener('pause', paused);
  windowTarget.addEventListener('pagehide', cancel);
  documentTarget.addEventListener('visibilitychange', hidden);
  documentTarget.addEventListener('play', competingPlay, true);
  return {
    play,
    shouldPlay: () => !preparing && (audio.paused || Boolean(audio.error)),
    ownsSource: (source: string | null) => ownedBlob !== null && source === ownedBlob,
    toggle() {
      if (disposed) return;
      if (preparing) { cancel(); return; }
      if (audio.paused || audio.error) play();
      else { ++generation; audio.pause(); }
    },
    explicitSeek(position: number) { options.recovery.explicitSeek(position); },
    dispose() {
      if (disposed) return;
      cancel();
      disposed = true;
      ++generation;
      audio.removeEventListener('playing', playing);
      audio.removeEventListener('pause', paused);
      windowTarget.removeEventListener('pagehide', cancel);
      documentTarget.removeEventListener('visibilitychange', hidden);
      documentTarget.removeEventListener('play', competingPlay, true);
      if (ownedBlob) { urls.revokeObjectURL(ownedBlob); ownedBlob = null; }
      category.dispose();
    },
  };
}

/** Opt-in, local-only observation. This module never controls media playback. */
const mediaEvents = ['play', 'playing', 'pause', 'waiting', 'stalled', 'suspend', 'error', 'ended', 'emptied', 'abort', 'loadstart', 'loadedmetadata', 'seeking', 'seeked'] as const;
const eventNames = [...mediaEvents, 'timeupdate', 'report-request', 'mount', 'unmount', 'pagehide', 'pageshow', 'focus', 'blur', 'visibilitychange', 'audio-session-change', 'action-play', 'action-pause', 'action-seek', 'recovery-installed', 'recovery-restored'] as const;
type EventName = typeof eventNames[number];
export type PlaybackMarker = 'action-play' | 'action-pause' | 'action-seek' | 'recovery-installed' | 'recovery-restored';
type AudioSession = EventTarget & { state?: string; type?: string };
type Entry = Record<string, string | number | boolean | null | number[][]>;
export interface PlaybackReport {
  version: 1;
  edition: string;
  mount: number;
  storageAvailable: boolean;
  events: Entry[];
}
function safely<T>(read: () => T, fallback: T): T {
  try { return read(); } catch { return fallback; }
}
function number(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value < 1e12
    ? Math.round(value * 1000) / 1000 : null;
}
function choice(value: unknown, choices: readonly string[]): string | null {
  return typeof value === 'string' && choices.includes(value) ? value : null;
}
function ranges(value: TimeRanges | undefined): number[][] {
  return safely(() => {
    const result: number[][] = [];
    for (let i = 0; value && i < Math.min(value.length, 4); i++) {
      const start = number(value.start(i)), end = number(value.end(i));
      if (start !== null && end !== null && end >= start) result.push([start, end]);
    }
    return result;
  }, []);
}
// Rebuild stored records from allowlisted primitives; never echo arbitrary stored text.
function cleanEntry(value: unknown): Entry | null {
  if (!value || typeof value !== 'object') return null;
  const source = value as Record<string, unknown>;
  const event = choice(source.event, eventNames);
  if (!event) return null;
  const entry: Entry = { event };
  for (const key of ['mount', 'elapsedMs', 'position', 'duration', 'target']) entry[key] = number(source[key]);
  for (const key of ['paused', 'ended', 'persisted']) entry[key] = typeof source[key] === 'boolean' ? source[key] : null;
  for (const [key, max] of [['readyState', 4], ['networkState', 3], ['errorCode', 4]] as const) {
    const n = number(source[key]); entry[key] = n !== null && Number.isInteger(n) && n <= max ? n : null;
  }
  entry.visibility = choice(source.visibility, ['visible', 'hidden', 'prerender']);
  entry.navigation = choice(source.navigation, ['navigate', 'reload', 'back_forward', 'prerender']);
  entry.audioSessionState = choice(source.audioSessionState, ['inactive', 'active', 'interrupted']);
  entry.audioSessionType = choice(source.audioSessionType, ['auto', 'playback', 'transient', 'transient-solo', 'ambient', 'play-and-record']);
  for (const key of ['buffered', 'seekable']) {
    entry[key] = Array.isArray(source[key]) ? source[key].slice(0, 4).flatMap((pair: unknown) => {
      if (!Array.isArray(pair)) return [];
      const a = number(pair[0]), b = number(pair[1]);
      return a !== null && b !== null && b >= a ? [[a, b]] : [];
    }) : [];
  }
  return entry;
}
export function playbackCheckEnabled(search: string): boolean {
  return safely(() => new URLSearchParams(search).get('audio-check') === '1', false);
}
export function installHeroAudioDiagnostics(audio: HTMLAudioElement, edition: string, options: {
  enabled: boolean;
  storage?: () => Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
  windowTarget?: EventTarget;
  documentTarget?: EventTarget & { visibilityState: string };
  audioSession?: () => AudioSession | undefined;
  navigationType?: () => unknown;
  now?: () => number;
  onChange?: (report: PlaybackReport) => void;
}) {
  // No browser globals, storage, getters or listeners are touched when disabled.
  if (!options.enabled || !/^\d{4}-\d{2}-\d{2}$/.test(edition)) return null;
  const storage = options.storage ?? (() => window.sessionStorage);
  const windowTarget = options.windowTarget ?? window;
  const documentTarget = options.documentTarget ?? document;
  const now = options.now ?? (() => performance.now());
  const started = safely(now, 0);
  const navigation = safely(options.navigationType ?? (() => (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type), null);
  const session = safely(options.audioSession ?? (() => (navigator as Navigator & { audioSession?: AudioSession }).audioSession), undefined);
  const key = 'ihe-playback-check:' + edition;
  let storageAvailable = true, disposed = false, lastSample = -Infinity;
  let events: Entry[] = [], mount = 1;
  try {
    const raw = storage().getItem(key);
    if (raw && raw.length < 500000) {
      const saved = JSON.parse(raw);
      if (saved?.version === 1 && saved.edition === edition && Array.isArray(saved.events)) {
        events = saved.events.slice(-200).map(cleanEntry).filter((entry: Entry | null): entry is Entry => entry !== null);
        const previous = number(saved.mount);
        if (previous !== null && Number.isInteger(previous)) mount = previous + 1;
      }
    }
  } catch { storageAvailable = false; }
  const report = (): PlaybackReport => ({ version: 1, edition, mount, storageAvailable, events: events.map(entry => ({ ...entry })) });
  const publish = () => {
    try { storage().setItem(key, JSON.stringify(report())); storageAvailable = true; }
    catch { storageAvailable = false; }
    safely(() => options.onChange?.(report()), undefined);
  };
  const record = (event: EventName, target?: number, persisted?: boolean) => {
    if (disposed) return;
    const read = (key: keyof HTMLAudioElement) => safely(() => audio[key], undefined);
    const entry = cleanEntry({
      event, mount, elapsedMs: safely(() => now() - started, null),
      position: read('currentTime'), duration: read('duration'), paused: read('paused'), ended: read('ended'),
      readyState: read('readyState'), networkState: read('networkState'),
      errorCode: safely(() => audio.error?.code, undefined),
      buffered: ranges(read('buffered') as TimeRanges | undefined), seekable: ranges(read('seekable') as TimeRanges | undefined),
      visibility: safely(() => documentTarget.visibilityState, null), navigation,
      audioSessionState: safely(() => session?.state, undefined), audioSessionType: safely(() => session?.type, undefined),
      target, persisted,
    });
    if (entry) events = [...events.slice(-199), entry];
    publish();
  };
  const removers: (() => void)[] = [];
  const listen = (target: EventTarget | undefined, event: string, listener: EventListener) => {
    if (!target) return;
    safely(() => { target.addEventListener(event, listener); removers.push(() => target.removeEventListener(event, listener)); }, undefined);
  };
  for (const event of mediaEvents) listen(audio, event, () => record(event));
  listen(audio, 'timeupdate', () => {
    const time = safely(now, 0);
    if (time - lastSample >= 5000) { lastSample = time; record('timeupdate'); }
  });
  for (const event of ['pagehide', 'pageshow'] as const) listen(windowTarget, event, e => record(event, undefined, safely(() => (e as PageTransitionEvent).persisted, false)));
  for (const event of ['focus', 'blur'] as const) listen(windowTarget, event, () => record(event));
  listen(documentTarget, 'visibilitychange', () => record('visibilitychange'));
  listen(session, 'statechange', () => record('audio-session-change'));
  record('mount');
  return {
    report,
    captureReport() { record('report-request'); return report(); },
    mark(event: PlaybackMarker, target?: number) {
      if (['action-play', 'action-pause', 'action-seek', 'recovery-installed', 'recovery-restored'].includes(event)) record(event, target);
    },
    clear() { if (!disposed) { events = []; publish(); } },
    dispose() { if (!disposed) { record('unmount'); disposed = true; removers.forEach(remove => safely(remove, undefined)); } },
  };
}
export type HeroAudioDiagnosticsController = NonNullable<ReturnType<typeof installHeroAudioDiagnostics>>;

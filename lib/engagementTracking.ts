export type AnalyticsValue = string | number | boolean;

export type EngagementEventName =
  | 'campaign_landing'
  | 'page_visible_time'
  | 'page_scroll'
  | 'audio_play'
  | 'audio_progress'
  | 'audio_complete'
  | 'share_click'
  | 'internal_link_click'
  | 'outbound_click'
  | 'button_click'
  | 'newsletter_signup_attempt'
  | 'newsletter_signup_success'
  | 'newsletter_signup_error';

export const PAGE_VISIBLE_TIME_THRESHOLDS = [10, 30, 60, 180] as const;
export const PAGE_SCROLL_THRESHOLDS = [50, 90] as const;
export const AUDIO_PROGRESS_THRESHOLDS = [25, 50, 75] as const;
export const MAX_CUSTOM_EVENTS_PER_PAGE = 32;
export const INTERNAL_ANALYTICS_OPT_OUT_STORAGE_KEY = 'ihe-internal-analytics-opt-out';
export const INTERNAL_ANALYTICS_OPT_OUT_HASH = '#ihe-analytics-opt-out';
export const INTERNAL_ANALYTICS_OPT_IN_HASH = '#ihe-analytics-opt-in';
export const ANALYTICS_BUTTON_ACTIONS = [
  'newsletter_open',
  'menu_toggle',
  'theme_toggle',
  'directory_filter',
  'directory_review',
  'directory_grid',
  'directory_list',
  'copy_search_link',
] as const;
export type AnalyticsButtonAction = typeof ANALYTICS_BUTTON_ACTIONS[number];

const ANALYTICS_ORIGIN = 'https://www.innovatinghighered.com';

// Governed public release registry. Add a date only when a release is live or
// explicitly approved for tracked distribution. This keeps campaign and audio
// identities finite without loading article, subscriber, or visitor data.
const TRACKED_RELEASE_DATES = new Set([
  '2026-04-14',
  '2026-04-15',
  '2026-04-16',
  '2026-04-17',
  '2026-04-20',
  '2026-04-21',
  '2026-04-22',
  '2026-05-04',
  '2026-05-05',
  '2026-05-06',
  '2026-05-07',
  '2026-05-08',
  '2026-05-11',
  '2026-05-12',
  '2026-05-22',
  '2026-05-29',
  '2026-06-12',
  '2026-06-20',
  '2026-06-26',
  '2026-07-03',
  '2026-07-10',
  '2026-07-17',
  '2026-07-24',
  '2026-07-31',
  '2026-08-07',
  '2026-08-14',
  '2026-08-21',
  '2026-08-28',
  '2026-09-04',
  '2026-09-11',
  '2026-09-18',
  '2026-09-25',
  '2026-10-02',
  // These dates and filenames are established by data/daily-pulse/2026-10-09.json
  // and data/daily-pulse/2026-10-16.json in the released frontend data.
  '2026-10-09',
  '2026-10-16',
]);

const TRACKED_AUDIO_PATHS = new Map([
  ['/audio/innovation-pulse-weekly-edition-19.mp3', '2026-10-02'],
  ['/audio/innovation-pulse-weekly-edition-20.mp3', '2026-10-09'],
  ['/audio/innovation-pulse-weekly-edition-21.mp3', '2026-10-16'],
]);

const MAILCHIMP_CONTENT = new Set([
  'listen',
  'hero_logo',
  'hero_title',
  'read_full_coverage',
  'footer_logo',
  'footer_home',
  'footer_archive',
  'footer_prompts',
  'footer_ai_directory',
  'footer_educator_tools',
  'footer_podcast',
  'footer_about',
]);

const SOCIAL_CONTENT = new Map([
  ['x', new Set(['episode_post', 'story_post'])],
  ['instagram', new Set(['instagram', 'story_link', 'bio_link'])],
  ['youtube', new Set(['video_description'])],
  ['linkedin', new Set(['episode_post'])],
]);

export const PUBLIC_ANALYTICS_STATIC_PATHS = [
  '/',
  '/about',
  '/ai-directory',
  '/ai-disclosure',
  '/be-our-guest',
  '/disclaimer',
  '/educator-tools',
  '/innovation-pulse',
  '/innovation-pulse/archive',
  '/innovation-pulse/stories',
  '/podcast',
  '/privacy',
  '/prompts',
  '/terms',
  '/tinker-lab',
] as const;

const STATIC_PAGE_PATHS = new Set<string>(PUBLIC_ANALYTICS_STATIC_PATHS);

const ANALYTICS_PAGE_PATHS = new Set([
  ...STATIC_PAGE_PATHS,
  '/ai-directory/[slug]',
  '/innovation-pulse/[date]',
  '/innovation-pulse/category/[category]',
  '/innovation-pulse/story/[slug]',
  '/feature-coverage/[slug]',
  '/innovation-grants',
  '/innovation-grants/directory',
  '/podcast/[slug]',
  '/tinker-lab/[slug]',
  '/other',
]);

const SHARE_CHANNELS = new Set(['copy', 'email', 'instagram', 'linkedin', 'native', 'x']);
const NEWSLETTER_PLACEMENTS = new Set(['card', 'inline', 'inline-strip', 'footer']);
const NEWSLETTER_ERROR_REASONS = new Set(['network', 'service']);
const BUTTON_ACTIONS = new Set<string>(ANALYTICS_BUTTON_ACTIONS);
const OUTBOUND_DESTINATIONS = new Set([
  'amazon',
  'apple',
  'external',
  'instagram',
  'linkedin',
  'mailchimp',
  'podbean',
  'spotify',
  'x',
  'youtube',
]);

export function isTrackedReleaseDate(value: string) {
  return TRACKED_RELEASE_DATES.has(value);
}

function isCampaign(value: string) {
  if (value === 'innovation-pulse-archive') return true;
  const date = value.match(/^innovation-pulse-(\d{4}-\d{2}-\d{2})$/)?.[1] || '';
  return isTrackedReleaseDate(date);
}

/**
 * Custom events are active in the released implementation when no override is
 * configured. The explicit disabled value is the rollback switch. Unknown
 * values fail closed. Browser-local opt-out suppresses both analytics paths.
 */
export function isEngagementTrackingEnabled(value: string | undefined) {
  return value === undefined || value === 'enabled';
}

export interface AnalyticsOptOutStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

/**
 * Browser-local opt-out for Brent and QA browsers. The reserved fragment is
 * never sent in an HTTP request. Visiting it persists suppression for that
 * browser; the opt-in fragment reverses the setting. Storage failures do not
 * weaken an opt-out request made in the current URL.
 */
export function isInternalAnalyticsOptOut(
  hash: string,
  storage?: AnalyticsOptOutStorage,
) {
  if (hash === INTERNAL_ANALYTICS_OPT_OUT_HASH) {
    try {
      storage?.setItem(INTERNAL_ANALYTICS_OPT_OUT_STORAGE_KEY, '1');
    } catch {
      // The current page remains opted out even when storage is unavailable.
    }
    return true;
  }

  if (hash === INTERNAL_ANALYTICS_OPT_IN_HASH) {
    try {
      storage?.removeItem(INTERNAL_ANALYTICS_OPT_OUT_STORAGE_KEY);
    } catch {
      // The explicit opt-in applies to this page even if persistence fails.
    }
    return false;
  }

  try {
    return storage?.getItem(INTERNAL_ANALYTICS_OPT_OUT_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function analyticsDeliveryState(customEventFlag: string | undefined, internalOptOut = false) {
  return {
    customEvents: !internalOptOut && isEngagementTrackingEnabled(customEventFlag),
    automaticPageviews: !internalOptOut,
  } as const;
}

export function campaignEventProperties(search: string) {
  const params = new URLSearchParams(search);
  // Reject ambiguous tags rather than choosing one of multiple values.
  if (['utm_campaign', 'utm_source', 'utm_medium', 'utm_content'].some((key) => params.getAll(key).length !== 1)) return null;
  const campaign = params.get('utm_campaign') || '';
  const source = params.get('utm_source') || '';
  const medium = params.get('utm_medium') || '';
  const content = params.get('utm_content') || '';

  if (!isCampaign(campaign)) return null;

  if (source === 'mailchimp') {
    if (medium !== 'email' || !MAILCHIMP_CONTENT.has(content)) return null;
  } else if (source === 'email') {
    if (medium !== 'email' || content !== 'subscriberEmail') return null;
  } else if (source === 'forwarded_email') {
    if (medium !== 'email' || content !== 'forward') return null;
  } else if (source === 'podcast_feed' || source === 'podbean') {
    // Syndicated show notes identify their shared feed, not a listening app.
    if (medium !== 'podcast' || content !== 'show_notes') return null;
  } else {
    const allowedContent = SOCIAL_CONTENT.get(source);
    if (medium !== 'social' || !allowedContent?.has(content)) return null;
  }

  return {
    campaign,
    channel: `${source}:${medium}:${content}`,
  };
}

export function analyticsPagePath(pathname: string) {
  const path = pathname.split(/[?#]/, 1)[0].replace(/\/+$/, '') || '/';
  if (STATIC_PAGE_PATHS.has(path)) return path;
  if (/^\/innovation-pulse\/\d{4}-\d{2}-\d{2}$/.test(path)) return '/innovation-pulse/[date]';
  if (/^\/innovation-pulse\/story\/[^/]+$/.test(path)) return '/innovation-pulse/story/[slug]';
  if (/^\/innovation-pulse\/category\/[^/]+$/.test(path)) return '/innovation-pulse/category/[category]';
  if (/^\/ai-directory\/[^/]+$/.test(path)) return '/ai-directory/[slug]';
  if (/^\/feature-coverage\/[^/]+$/.test(path)) return '/feature-coverage/[slug]';
  if (path === '/innovation-grants' || path === '/innovation-grants/directory') return path;
  if (/^\/podcast\/[^/]+$/.test(path)) return '/podcast/[slug]';
  if (/^\/tinker-lab\/[^/]+$/.test(path)) return '/tinker-lab/[slug]';
  return '/other';
}

export function analyticsNavigationKey(pathname: string, search: string) {
  return `${pathname}?${search.replace(/^\?/, '')}`;
}

export interface AnalyticsUrlEvent {
  type: 'pageview' | 'event';
  url: string;
}

export function redactAnalyticsEventUrl<T extends AnalyticsUrlEvent>(
  event: T,
  publicPagePaths: ReadonlySet<string>,
): T | null {
  try {
    const parsed = new URL(event.url, ANALYTICS_ORIGIN);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    if (parsed.hostname !== 'www.innovatinghighered.com' && parsed.hostname !== 'innovatinghighered.com') {
      return null;
    }

    const path = parsed.pathname.replace(/\/+$/, '') || '/';
    const redactedPath = event.type === 'event'
      ? analyticsPagePath(path)
      : publicPagePaths.has(path) ? path : null;

    if (!redactedPath) return null;
    // Rebuild only the finite, governed attribution tags. All other query
    // fields and fragments stay excluded; custom-event URLs remain grouped.
    const campaign = event.type === 'pageview' ? campaignEventProperties(parsed.search) : null;
    const attribution = new URLSearchParams();
    if (campaign) {
      const [source, medium, content] = campaign.channel.split(':');
      attribution.set('utm_source', source);
      attribution.set('utm_medium', medium);
      attribution.set('utm_campaign', campaign.campaign);
      attribution.set('utm_content', content);
    }
    return {
      ...event,
      url: `${ANALYTICS_ORIGIN}${redactedPath}${campaign ? `?${attribution}` : ''}`,
    };
  } catch {
    return null;
  }
}

export function episodeFromAudioSource(source: string) {
  // These exact public filenames are mapped only where the released data files
  // establish the edition/date identity.
  let pathname = '';
  try {
    pathname = new URL(source, ANALYTICS_ORIGIN).pathname;
  } catch {
    return null;
  }
  const mappedEpisode = TRACKED_AUDIO_PATHS.get(pathname);
  if (mappedEpisode) return isTrackedReleaseDate(mappedEpisode) ? mappedEpisode : null;

  const candidate = pathname.match(/(?:^|[^\d])(\d{4}-\d{2}-\d{2})(?:[^\d]|$)/)?.[1] || '';
  return isTrackedReleaseDate(candidate) ? candidate : null;
}

export function newlyReachedMilestones(
  value: number,
  thresholds: readonly number[],
  seen: Set<number>,
) {
  if (!Number.isFinite(value)) return [];
  const reached: number[] = [];
  for (const threshold of thresholds) {
    if (value >= threshold && !seen.has(threshold)) {
      seen.add(threshold);
      reached.push(threshold);
    }
  }
  return reached;
}

export function firstObservation(key: string, seen: Set<string>) {
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
}

export function outboundDestination(href: string, currentHostname: string) {
  try {
    const parsed = new URL(href);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const localHostname = currentHostname.toLowerCase().replace(/^www\./, '');
    if (!hostname || hostname === localHostname) return null;
    if (hostname === 'apple.com' || hostname.endsWith('.apple.com')) return 'apple';
    if (hostname === 'spotify.com' || hostname.endsWith('.spotify.com')) return 'spotify';
    if (
      hostname === 'amazon.com' ||
      hostname.endsWith('.amazon.com') ||
      hostname === 'amazonmusic.com' ||
      hostname.endsWith('.amazonmusic.com') ||
      hostname === 'audible.com' ||
      hostname.endsWith('.audible.com')
    ) return 'amazon';
    if (hostname === 'instagram.com' || hostname.endsWith('.instagram.com')) return 'instagram';
    if (hostname === 'x.com' || hostname.endsWith('.x.com') || hostname === 'twitter.com') return 'x';
    if (hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com')) return 'linkedin';
    if (hostname === 'youtube.com' || hostname.endsWith('.youtube.com') || hostname === 'youtu.be') return 'youtube';
    if (hostname === 'podbean.com' || hostname.endsWith('.podbean.com')) return 'podbean';
    if (hostname === 'mailchimp.com' || hostname.endsWith('.mailchimp.com')) return 'mailchimp';
    return 'external';
  } catch {
    return null;
  }
}

/**
 * Return a same-site path only when it is present in the server-built public
 * route allowlist. Queries, fragments, private identifiers, and unknown paths
 * therefore never become event properties.
 */
export function internalLinkTarget(
  href: string,
  currentHostname: string,
  publicPagePaths: ReadonlySet<string>,
) {
  if (!href.trim() || href.trim().startsWith('#')) return null;
  try {
    const parsed = new URL(href, `https://${currentHostname}`);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    const hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const localHostname = currentHostname.toLowerCase().replace(/^www\./, '').split(':', 1)[0];
    if (!hostname || hostname !== localHostname) return null;
    const path = parsed.pathname.replace(/\/+$/, '') || '/';
    return publicPagePaths.has(path) ? path : null;
  } catch {
    return null;
  }
}

function hasOnlyProperties(properties: Record<string, AnalyticsValue>, expected: string[]) {
  const keys = Object.keys(properties);
  return keys.length === expected.length && expected.every((key) => keys.includes(key));
}

function isAllowedNumber(value: AnalyticsValue | undefined, allowed: readonly number[]) {
  return typeof value === 'number' && allowed.includes(value);
}

function channelToSearch(channel: string) {
  const [source = '', medium = '', content = '', ...extra] = channel.split(':');
  if (extra.length > 0) return 'invalid=1';
  return `utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_content=${encodeURIComponent(content)}`;
}

export function sanitizeEngagementEvent(
  name: EngagementEventName,
  properties: Record<string, AnalyticsValue>,
  publicPagePaths?: ReadonlySet<string>,
): Record<string, AnalyticsValue> | null {
  if (Object.keys(properties).length > 2) return null;

  const page = typeof properties.page === 'string' ? properties.page : '';
  const episode = typeof properties.episode === 'string' ? properties.episode : '';
  const target = typeof properties.target === 'string' ? properties.target : '';
  const action = typeof properties.action === 'string' ? properties.action : '';

  switch (name) {
    case 'campaign_landing':
      if (!hasOnlyProperties(properties, ['campaign', 'channel'])) return null;
      if (typeof properties.campaign !== 'string' || !isCampaign(properties.campaign)) return null;
      if (typeof properties.channel !== 'string') return null;
      return campaignEventProperties(
        `?utm_campaign=${encodeURIComponent(properties.campaign)}&${channelToSearch(properties.channel)}`,
      );
    case 'page_visible_time':
      if (!hasOnlyProperties(properties, ['page', 'seconds'])) return null;
      if (!ANALYTICS_PAGE_PATHS.has(page) || !isAllowedNumber(properties.seconds, PAGE_VISIBLE_TIME_THRESHOLDS)) return null;
      return { page, seconds: properties.seconds };
    case 'page_scroll':
      if (!hasOnlyProperties(properties, ['page', 'percent'])) return null;
      if (!ANALYTICS_PAGE_PATHS.has(page) || !isAllowedNumber(properties.percent, PAGE_SCROLL_THRESHOLDS)) return null;
      return { page, percent: properties.percent };
    case 'audio_play':
    case 'audio_complete':
      if (!hasOnlyProperties(properties, ['page', 'episode'])) return null;
      if (!ANALYTICS_PAGE_PATHS.has(page) || !isTrackedReleaseDate(episode)) return null;
      return { page, episode };
    case 'audio_progress':
      if (!hasOnlyProperties(properties, ['episode', 'percent'])) return null;
      if (!isTrackedReleaseDate(episode) || !isAllowedNumber(properties.percent, AUDIO_PROGRESS_THRESHOLDS)) return null;
      return { episode, percent: properties.percent };
    case 'share_click':
      if (!hasOnlyProperties(properties, ['page', 'channel'])) return null;
      if (!ANALYTICS_PAGE_PATHS.has(page) || typeof properties.channel !== 'string' || !SHARE_CHANNELS.has(properties.channel)) return null;
      return { page, channel: properties.channel };
    case 'internal_link_click':
      if (!hasOnlyProperties(properties, ['page', 'target'])) return null;
      if (!ANALYTICS_PAGE_PATHS.has(page) || !publicPagePaths?.has(target)) return null;
      return { page, target };
    case 'outbound_click':
      if (!hasOnlyProperties(properties, ['page', 'destination'])) return null;
      if (!ANALYTICS_PAGE_PATHS.has(page) || typeof properties.destination !== 'string' || !OUTBOUND_DESTINATIONS.has(properties.destination)) return null;
      return { page, destination: properties.destination };
    case 'button_click':
      if (!hasOnlyProperties(properties, ['page', 'action'])) return null;
      if (!ANALYTICS_PAGE_PATHS.has(page) || !BUTTON_ACTIONS.has(action)) return null;
      return { page, action };
    case 'newsletter_signup_attempt':
    case 'newsletter_signup_success':
      if (!hasOnlyProperties(properties, ['placement'])) return null;
      if (typeof properties.placement !== 'string' || !NEWSLETTER_PLACEMENTS.has(properties.placement)) return null;
      return { placement: properties.placement };
    case 'newsletter_signup_error':
      if (!hasOnlyProperties(properties, ['placement', 'reason'])) return null;
      if (
        typeof properties.placement !== 'string' ||
        !NEWSLETTER_PLACEMENTS.has(properties.placement) ||
        typeof properties.reason !== 'string' ||
        !NEWSLETTER_ERROR_REASONS.has(properties.reason)
      ) return null;
      return { placement: properties.placement, reason: properties.reason };
    default:
      return null;
  }
}

export type EngagementEventSender = (
  name: EngagementEventName,
  properties: Record<string, AnalyticsValue>,
) => void;

export function createEngagementDispatcher(
  send: EngagementEventSender,
  maxEventsPerPage = MAX_CUSTOM_EVENTS_PER_PAGE,
) {
  let pageBudgetKey = '';
  let sentForPage = 0;

  return (
    enabled: boolean,
    budgetKey: string,
    name: EngagementEventName,
    properties: Record<string, AnalyticsValue> = {},
    publicPagePaths?: ReadonlySet<string>,
  ) => {
    if (!enabled) return false;
    const safeProperties = sanitizeEngagementEvent(name, properties, publicPagePaths);
    if (!safeProperties) return false;
    if (budgetKey !== pageBudgetKey) {
      pageBudgetKey = budgetKey;
      sentForPage = 0;
    }
    if (sentForPage >= maxEventsPerPage) return false;
    try {
      send(name, safeProperties);
      sentForPage += 1;
      return true;
    } catch {
      return false;
    }
  };
}

interface EngagementHandlerOptions {
  page: string;
  hostname: string;
  dispatch: EngagementEventSender;
  publicPagePaths?: ReadonlySet<string>;
  getVisibility: () => string;
  getScrollMetrics: () => { scrollHeight: number; innerHeight: number; scrollY: number };
}

interface InteractiveElementLike {
  href?: string;
  tagName?: string;
  getAttribute: (name: string) => string | null;
}

function interactiveElement(event: Event) {
  const target = event.target as { closest?: (selector: string) => InteractiveElementLike | null } | null;
  return target?.closest?.('a,button') || null;
}

function mediaTarget(event: Event) {
  const target = event.target as {
    tagName?: string;
    currentSrc?: string;
    duration?: number;
    currentTime?: number;
    paused?: boolean;
    seeking?: boolean;
    getAttribute?: (name: string) => string | null;
  } | null;
  if (!target || target.tagName?.toUpperCase() !== 'AUDIO') return null;
  return target;
}

function buttonAnalyticsAction(element: InteractiveElementLike): AnalyticsButtonAction | null {
  if (element.tagName?.toUpperCase() !== 'BUTTON') return null;

  const explicit = element.getAttribute('data-analytics-action');
  if (explicit !== null) return BUTTON_ACTIONS.has(explicit) ? explicit as AnalyticsButtonAction : null;

  const label = element.getAttribute('aria-label') || '';
  if (/^Toggle menu$/i.test(label)) return 'menu_toggle';
  if (/^Switch to (?:light|dark) mode$/i.test(label)) return 'theme_toggle';
  if (/^Filter tools$/i.test(label)) return 'directory_filter';
  if (/^How we review$/i.test(label)) return 'directory_review';
  if (/^Grid view$/i.test(label)) return 'directory_grid';
  if (/^List view$/i.test(label)) return 'directory_list';
  if (/^Copy search link$/i.test(label)) return 'copy_search_link';
  return null;
}

interface AudioObservationState {
  observedIntervals: Array<[number, number]>;
  lastTime: number | null;
  isPlaying: boolean;
  startedSinceSeek: boolean;
  startSent: boolean;
  completeSent: boolean;
  progressMilestones: Set<number>;
}

// Progress is the union of observed playback-position intervals, not the sum
// of repeated passes over the same position or the furthest reached position.
// Only small forward deltas while the element is playing count; seeking
// contributes nothing, and completion still requires an ended event after at
// least 90% of the valid duration was observed.
const MAX_OBSERVED_TIME_DELTA_SECONDS = 5;
const COMPLETION_OBSERVED_FRACTION = 0.9;

function mediaNumber(value: number | undefined) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function positiveDuration(value: number | undefined) {
  const duration = mediaNumber(value);
  return duration !== null && duration > 0 ? duration : null;
}

function clampedPlaybackTime(value: number | undefined, duration: number) {
  const currentTime = mediaNumber(value);
  return currentTime === null ? null : Math.min(duration, Math.max(0, currentTime));
}

function observedPlaybackSeconds(state: AudioObservationState) {
  return state.observedIntervals.reduce((total, [start, end]) => total + end - start, 0);
}

function addObservedInterval(
  state: AudioObservationState,
  start: number,
  end: number,
  duration: number,
) {
  const boundedStart = Math.min(duration, Math.max(0, start));
  const boundedEnd = Math.min(duration, Math.max(0, end));
  if (boundedEnd <= boundedStart) return;

  const merged: Array<[number, number]> = [];
  let nextStart = boundedStart;
  let nextEnd = boundedEnd;
  let inserted = false;

  for (const [intervalStart, intervalEnd] of state.observedIntervals) {
    if (intervalEnd < nextStart) {
      merged.push([intervalStart, intervalEnd]);
      continue;
    }
    if (intervalStart > nextEnd) {
      if (!inserted) {
        merged.push([nextStart, nextEnd]);
        inserted = true;
      }
      merged.push([intervalStart, intervalEnd]);
      continue;
    }
    nextStart = Math.min(nextStart, intervalStart);
    nextEnd = Math.max(nextEnd, intervalEnd);
  }

  if (!inserted) merged.push([nextStart, nextEnd]);
  state.observedIntervals = merged;
}

function getAudioState(
  states: WeakMap<object, Map<string, AudioObservationState>>,
  audio: object,
  episode: string,
) {
  const byEpisode = states.get(audio) || new Map<string, AudioObservationState>();
  const current = byEpisode.get(episode);
  if (current) return current;
  const created: AudioObservationState = {
    observedIntervals: [],
    lastTime: null,
    isPlaying: false,
    startedSinceSeek: false,
    startSent: false,
    completeSent: false,
    progressMilestones: new Set<number>(),
  };
  byEpisode.set(episode, created);
  states.set(audio, byEpisode);
  return created;
}

function observePlayback(audio: ReturnType<typeof mediaTarget>, state: AudioObservationState) {
  if (!audio || !state.isPlaying || audio.seeking === true) return;
  const duration = positiveDuration(audio.duration);
  if (duration === null) {
    state.lastTime = null;
    return;
  }
  const currentTime = clampedPlaybackTime(audio.currentTime, duration);
  if (currentTime === null) {
    state.lastTime = null;
    return;
  }
  if (state.lastTime === null) {
    state.lastTime = currentTime;
    return;
  }
  const previousTime = state.lastTime;
  const delta = currentTime - previousTime;
  state.lastTime = currentTime;
  if (delta <= 0 || delta > MAX_OBSERVED_TIME_DELTA_SECONDS) return;
  addObservedInterval(state, previousTime, currentTime, duration);
}

export function createPageEngagementHandlers(options: EngagementHandlerOptions) {
  const visibleTimeMilestones = new Set<number>();
  const scrollMilestones = new Set<number>();
  const audioStates = new WeakMap<object, Map<string, AudioObservationState>>();
  const handledClicks = new WeakSet<object>();
  let visibleSeconds = 0;
  const publicPagePaths = options.publicPagePaths || new Set(PUBLIC_ANALYTICS_STATIC_PATHS);

  const onVisibleTimeTick = () => {
    if (options.getVisibility() !== 'visible') return;
    visibleSeconds += 1;
    for (const seconds of newlyReachedMilestones(
      visibleSeconds,
      PAGE_VISIBLE_TIME_THRESHOLDS,
      visibleTimeMilestones,
    )) {
      options.dispatch('page_visible_time', { page: options.page, seconds });
    }
  };

  const onScroll = () => {
    const { scrollHeight, innerHeight, scrollY } = options.getScrollMetrics();
    const available = scrollHeight - innerHeight;
    if (available <= 0) return;
    const percent = Math.round((scrollY / available) * 100);
    for (const milestone of newlyReachedMilestones(percent, PAGE_SCROLL_THRESHOLDS, scrollMilestones)) {
      options.dispatch('page_scroll', { page: options.page, percent: milestone });
    }
  };

  const onMediaEvent = (event: Event) => {
    const audio = mediaTarget(event);
    if (!audio) return;
    const episode = episodeFromAudioSource(audio.currentSrc || audio.getAttribute?.('src') || '');
    if (!episode) {
      if (event.type === 'error' || event.type === 'abort' || event.type === 'emptied') {
        const statesByEpisode = audioStates.get(audio);
        statesByEpisode?.forEach((state) => {
          state.isPlaying = false;
          state.lastTime = null;
          state.startedSinceSeek = false;
        });
      }
      return;
    }

    const state = getAudioState(audioStates, audio, episode);

    if (event.type === 'playing') {
      state.isPlaying = true;
      state.startedSinceSeek = true;
      const duration = positiveDuration(audio.duration);
      state.lastTime = duration === null ? null : clampedPlaybackTime(audio.currentTime, duration);
      if (!state.startSent) {
        state.startSent = true;
        options.dispatch('audio_play', { page: options.page, episode });
      }
      return;
    }

    if (event.type === 'pause' || event.type === 'error' || event.type === 'abort' || event.type === 'emptied') {
      observePlayback(audio, state);
      state.isPlaying = false;
      state.lastTime = null;
      if (event.type !== 'pause') state.startedSinceSeek = false;
      return;
    }

    if (event.type === 'seeking') {
      state.isPlaying = false;
      state.lastTime = null;
      state.startedSinceSeek = false;
      return;
    }

    if (event.type === 'seeked') {
      // A seeked event does not prove playback resumed. Wait for `playing` so
      // a seek-to-end cannot create progress or completion by itself.
      state.isPlaying = false;
      state.lastTime = null;
      return;
    }

    if (event.type === 'ended') {
      observePlayback(audio, state);
      state.isPlaying = false;
      state.lastTime = null;
      const duration = positiveDuration(audio.duration);
      if (
        state.startedSinceSeek &&
        duration !== null &&
        !state.completeSent &&
        observedPlaybackSeconds(state) >= duration * COMPLETION_OBSERVED_FRACTION
      ) {
        state.completeSent = true;
        options.dispatch('audio_complete', { page: options.page, episode });
      }
      return;
    }

    if (event.type !== 'timeupdate') return;
    if (!state.isPlaying) return;
    observePlayback(audio, state);
    const duration = positiveDuration(audio.duration);
    if (duration === null) return;
    const observedPercent = Math.floor(Math.min(100, (observedPlaybackSeconds(state) / duration) * 100));
    for (const milestone of newlyReachedMilestones(observedPercent, AUDIO_PROGRESS_THRESHOLDS, state.progressMilestones)) {
      options.dispatch('audio_progress', { episode, percent: milestone });
    }
  };

  const onClick = (event: Event) => {
    if (handledClicks.has(event)) return;
    handledClicks.add(event);
    const element = interactiveElement(event);
    if (!element) return;
    const label = element.getAttribute('aria-label') || '';
    const href = typeof element.href === 'string' ? element.href : '';
    let channel = '';
    if (/Share on X/i.test(label) || /x\.com\/intent/i.test(href)) channel = 'x';
    else if (/Share on LinkedIn/i.test(label) || /linkedin\.com\/sharing/i.test(href)) channel = 'linkedin';
    else if (/Share via email/i.test(label)) channel = 'email';
    else if (/Share on Instagram/i.test(label)) channel = 'instagram';
    else if (/Copy link|Link copied/i.test(label)) channel = 'copy';
    else if (/Share (?:episode|edition)|Share this page|Page link copied/i.test(label)) channel = 'native';
    if (channel) {
      options.dispatch('share_click', { page: options.page, channel });
      return;
    }

    const action = buttonAnalyticsAction(element);
    if (action) {
      options.dispatch('button_click', { page: options.page, action });
      return;
    }

    const target = internalLinkTarget(href, options.hostname, publicPagePaths);
    if (target) {
      options.dispatch('internal_link_click', { page: options.page, target });
      return;
    }

    const destination = outboundDestination(href, options.hostname);
    if (destination) options.dispatch('outbound_click', { page: options.page, destination });
  };

  return { onVisibleTimeTick, onScroll, onMediaEvent, onClick };
}

export interface ListenerTargetLike {
  addEventListener: (type: string, listener: EventListener, options?: boolean | AddEventListenerOptions) => void;
  removeEventListener: (type: string, listener: EventListener, options?: boolean | EventListenerOptions) => void;
}

interface ListenerInstallOptions {
  windowTarget: ListenerTargetLike;
  documentTarget: ListenerTargetLike;
  handlers: ReturnType<typeof createPageEngagementHandlers>;
  setInterval: (callback: () => void, milliseconds: number) => unknown;
  clearInterval: (token: unknown) => void;
}

export function installEngagementListeners(options: ListenerInstallOptions) {
  const scrollListener: EventListener = () => options.handlers.onScroll();
  const mediaListener: EventListener = (event) => options.handlers.onMediaEvent(event);
  const clickListener: EventListener = (event) => options.handlers.onClick(event);
  const timer = options.setInterval(options.handlers.onVisibleTimeTick, 1000);
  const mediaEvents = ['playing', 'pause', 'seeking', 'seeked', 'timeupdate', 'ended', 'error', 'abort', 'emptied'];

  options.windowTarget.addEventListener('scroll', scrollListener, { passive: true });
  for (const mediaEvent of mediaEvents) options.documentTarget.addEventListener(mediaEvent, mediaListener, true);
  options.documentTarget.addEventListener('click', clickListener, true);

  let cleaned = false;
  return () => {
    if (cleaned) return;
    cleaned = true;
    options.clearInterval(timer);
    options.windowTarget.removeEventListener('scroll', scrollListener);
    for (const mediaEvent of mediaEvents) options.documentTarget.removeEventListener(mediaEvent, mediaListener, true);
    options.documentTarget.removeEventListener('click', clickListener, true);
  };
}

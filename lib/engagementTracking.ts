export type AnalyticsValue = string | number | boolean;

export type EngagementEventName =
  | 'campaign_landing'
  | 'page_visible_time'
  | 'page_scroll'
  | 'audio_play'
  | 'audio_progress'
  | 'audio_complete'
  | 'share_click'
  | 'outbound_click'
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
  ['x', new Set(['episode_post'])],
  ['youtube', new Set(['video_description'])],
  ['linkedin', new Set(['episode_post'])],
]);

const STATIC_PAGE_PATHS = new Set([
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
]);

const ANALYTICS_PAGE_PATHS = new Set([
  ...STATIC_PAGE_PATHS,
  '/ai-directory/[slug]',
  '/innovation-pulse/[date]',
  '/innovation-pulse/category/[category]',
  '/innovation-pulse/story/[slug]',
  '/podcast/[slug]',
  '/tinker-lab/[slug]',
  '/other',
]);

const SHARE_CHANNELS = new Set(['copy', 'email', 'linkedin', 'native', 'x']);
const NEWSLETTER_PLACEMENTS = new Set(['card', 'inline', 'inline-strip', 'footer']);
const NEWSLETTER_ERROR_REASONS = new Set(['network', 'service']);
const OUTBOUND_DESTINATIONS = new Set(['external', 'linkedin', 'mailchimp', 'podbean', 'x', 'youtube']);

export function isTrackedReleaseDate(value: string) {
  return TRACKED_RELEASE_DATES.has(value);
}

function isCampaign(value: string) {
  if (value === 'innovation-pulse-archive') return true;
  const date = value.match(/^innovation-pulse-(\d{4}-\d{2}-\d{2})$/)?.[1] || '';
  return isTrackedReleaseDate(date);
}

/**
 * Build-time switch for custom engagement events only. A changed value takes
 * effect after a separately approved environment update and deployment.
 * Automatic pageviews are controlled separately in Vercel.
 */
export function isEngagementTrackingEnabled(value: string | undefined) {
  return value === 'enabled';
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
  const campaign = params.get('utm_campaign') || '';
  const source = params.get('utm_source') || '';
  const medium = params.get('utm_medium') || '';
  const content = params.get('utm_content') || '';

  if (!isCampaign(campaign)) return null;

  if (source === 'mailchimp') {
    if (medium !== 'email' || !MAILCHIMP_CONTENT.has(content)) return null;
  } else if (source === 'forwarded_email') {
    if (medium !== 'email' || content !== 'forward') return null;
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

export function redactAnalyticsEventUrl<T extends AnalyticsUrlEvent>(event: T): T | null {
  try {
    const parsed = new URL(event.url, ANALYTICS_ORIGIN);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return {
      ...event,
      url: `${ANALYTICS_ORIGIN}${analyticsPagePath(parsed.pathname)}`,
    };
  } catch {
    return null;
  }
}

export function episodeFromAudioSource(source: string) {
  const candidate = source.match(/(?:^|[^\d])(\d{4}-\d{2}-\d{2})(?:[^\d]|$)/)?.[1] || '';
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
): Record<string, AnalyticsValue> | null {
  if (Object.keys(properties).length > 2) return null;

  const page = typeof properties.page === 'string' ? properties.page : '';
  const episode = typeof properties.episode === 'string' ? properties.episode : '';

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
    case 'outbound_click':
      if (!hasOnlyProperties(properties, ['page', 'destination'])) return null;
      if (!ANALYTICS_PAGE_PATHS.has(page) || typeof properties.destination !== 'string' || !OUTBOUND_DESTINATIONS.has(properties.destination)) return null;
      return { page, destination: properties.destination };
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
  ) => {
    if (!enabled) return false;
    const safeProperties = sanitizeEngagementEvent(name, properties);
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
  getVisibility: () => string;
  getScrollMetrics: () => { scrollHeight: number; innerHeight: number; scrollY: number };
}

interface InteractiveElementLike {
  href?: string;
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
    getAttribute?: (name: string) => string | null;
  } | null;
  if (!target || target.tagName !== 'AUDIO') return null;
  return target;
}

export function createPageEngagementHandlers(options: EngagementHandlerOptions) {
  const visibleTimeMilestones = new Set<number>();
  const scrollMilestones = new Set<number>();
  const audioMilestones = new WeakMap<object, Map<string, Set<number>>>();
  const audioStarts = new WeakMap<object, Set<string>>();
  const audioCompletions = new WeakMap<object, Set<string>>();
  const handledClicks = new WeakSet<object>();
  let visibleSeconds = 0;

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
    if (!episode) return;

    if (event.type === 'play') {
      const started = audioStarts.get(audio) || new Set<string>();
      if (firstObservation(episode, started)) {
        audioStarts.set(audio, started);
        options.dispatch('audio_play', { page: options.page, episode });
      }
      return;
    }

    if (event.type === 'ended') {
      const completed = audioCompletions.get(audio) || new Set<string>();
      if (firstObservation(episode, completed)) {
        audioCompletions.set(audio, completed);
        options.dispatch('audio_complete', { page: options.page, episode });
      }
      return;
    }

    const duration = Number(audio.duration);
    const currentTime = Number(audio.currentTime);
    if (!Number.isFinite(duration) || duration <= 0 || !Number.isFinite(currentTime)) return;
    const milestonesByEpisode = audioMilestones.get(audio) || new Map<string, Set<number>>();
    const seen = milestonesByEpisode.get(episode) || new Set<number>();
    const percent = Math.floor((currentTime / duration) * 100);
    for (const milestone of newlyReachedMilestones(percent, AUDIO_PROGRESS_THRESHOLDS, seen)) {
      options.dispatch('audio_progress', { episode, percent: milestone });
    }
    milestonesByEpisode.set(episode, seen);
    audioMilestones.set(audio, milestonesByEpisode);
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
    else if (/Copy link/i.test(label)) channel = 'copy';
    else if (/Share episode/i.test(label)) channel = 'native';
    if (channel) {
      options.dispatch('share_click', { page: options.page, channel });
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

  options.windowTarget.addEventListener('scroll', scrollListener, { passive: true });
  options.documentTarget.addEventListener('play', mediaListener, true);
  options.documentTarget.addEventListener('timeupdate', mediaListener, true);
  options.documentTarget.addEventListener('ended', mediaListener, true);
  options.documentTarget.addEventListener('click', clickListener, true);

  let cleaned = false;
  return () => {
    if (cleaned) return;
    cleaned = true;
    options.clearInterval(timer);
    options.windowTarget.removeEventListener('scroll', scrollListener);
    options.documentTarget.removeEventListener('play', mediaListener, true);
    options.documentTarget.removeEventListener('timeupdate', mediaListener, true);
    options.documentTarget.removeEventListener('ended', mediaListener, true);
    options.documentTarget.removeEventListener('click', clickListener, true);
  };
}

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  analyticsDeliveryState,
  analyticsNavigationKey,
  analyticsPagePath,
  campaignEventProperties,
  createEngagementDispatcher,
  createPageEngagementHandlers,
  episodeFromAudioSource,
  firstObservation,
  installEngagementListeners,
  isEngagementTrackingEnabled,
  isInternalAnalyticsOptOut,
  newlyReachedMilestones,
  outboundDestination,
  redactAnalyticsEventUrl,
  sanitizeEngagementEvent,
  type EngagementEventName,
  type ListenerTargetLike,
} from '../lib/engagementTracking.ts';

test('custom-event kill switch is exact and does not claim to disable automatic pageviews', () => {
  assert.equal(isEngagementTrackingEnabled('enabled'), true);
  assert.equal(isEngagementTrackingEnabled('true'), false);
  assert.equal(isEngagementTrackingEnabled('ENABLED'), false);
  assert.equal(isEngagementTrackingEnabled(undefined), false);
  assert.deepEqual(analyticsDeliveryState('disabled'), {
    customEvents: false,
    automaticPageviews: true,
  });
  assert.deepEqual(analyticsDeliveryState('enabled', true), {
    customEvents: false,
    automaticPageviews: false,
  });
});

test('browser-local internal opt-out persists and suppresses both analytics paths', () => {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) || null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };

  assert.equal(isInternalAnalyticsOptOut('#ihe-analytics-opt-out', storage), true);
  assert.equal(isInternalAnalyticsOptOut('', storage), true);
  assert.equal(isInternalAnalyticsOptOut('#ihe-analytics-opt-in', storage), false);
  assert.equal(isInternalAnalyticsOptOut('', storage), false);
});

test('current-page opt-out survives unavailable browser storage', () => {
  const unavailableStorage = {
    getItem: () => { throw new Error('unavailable'); },
    setItem: () => { throw new Error('unavailable'); },
    removeItem: () => { throw new Error('unavailable'); },
  };

  assert.equal(isInternalAnalyticsOptOut('#ihe-analytics-opt-out', unavailableStorage), true);
  assert.equal(isInternalAnalyticsOptOut('', unavailableStorage), false);
});

test('central beforeSend redacts queries, fragments, dynamic paths, and unexpected hosts', () => {
  assert.deepEqual(
    redactAnalyticsEventUrl({
      type: 'pageview',
      url: 'https://www.innovatinghighered.com/innovation-pulse/story/private-id?email=person@example.com#private',
    }),
    {
      type: 'pageview',
      url: 'https://www.innovatinghighered.com/innovation-pulse/story/[slug]',
    },
  );
  assert.deepEqual(
    redactAnalyticsEventUrl({
      type: 'event',
      url: 'https://attacker.example/private-user-id?token=secret',
    }),
    {
      type: 'event',
      url: 'https://www.innovatinghighered.com/other',
    },
  );
  assert.equal(redactAnalyticsEventUrl({ type: 'pageview', url: 'javascript:private-id' }), null);
});

test('accepts only governed campaign combinations and registered release dates', () => {
  assert.deepEqual(
    campaignEventProperties('?utm_source=mailchimp&utm_medium=email&utm_campaign=innovation-pulse-2026-08-21&utm_content=listen'),
    {
      campaign: 'innovation-pulse-2026-08-21',
      channel: 'mailchimp:email:listen',
    },
  );
  assert.deepEqual(
    campaignEventProperties('?utm_source=x&utm_medium=social&utm_campaign=innovation-pulse-2026-08-14&utm_content=episode_post'),
    {
      campaign: 'innovation-pulse-2026-08-14',
      channel: 'x:social:episode_post',
    },
  );
  assert.deepEqual(
    campaignEventProperties('?utm_source=mailchimp&utm_medium=email&utm_campaign=innovation-pulse-2026-08-28&utm_content=listen'),
    {
      campaign: 'innovation-pulse-2026-08-28',
      channel: 'mailchimp:email:listen',
    },
  );

  const rejected = [
    '?utm_source=person%40example.com&utm_medium=email&utm_campaign=innovation-pulse-2026-08-14&utm_content=listen',
    '?utm_source=mailchimp&utm_medium=email&utm_campaign=customer-123456789&utm_content=listen',
    '?utm_source=mailchimp&utm_medium=email&utm_campaign=innovation-pulse-2026-08-14&utm_content=free-form-user-id',
    '?utm_source=x&utm_medium=email&utm_campaign=innovation-pulse-2026-08-14&utm_content=episode_post',
    '?utm_source=youtube&utm_medium=social&utm_campaign=innovation-pulse-2026-08-14&utm_content=episode_post',
    '?utm_source=facebook&utm_medium=social&utm_campaign=innovation-pulse-2026-08-14&utm_content=episode_post',
  ];
  for (const search of rejected) assert.equal(campaignEventProperties(search), null);
});

test('normalizes routes, bounds audio identities, and detects query-only SPA changes', () => {
  assert.equal(analyticsPagePath('/innovation-pulse/2026-08-14?contact=person@example.com'), '/innovation-pulse/[date]');
  assert.equal(analyticsPagePath('/innovation-pulse/story/private-user-id'), '/innovation-pulse/story/[slug]');
  assert.equal(analyticsPagePath('/unrecognized/private-user-id'), '/other');
  assert.equal(
    episodeFromAudioSource('https://storage.example/broadcast-2026-08-14.mp3?subscriber=person@example.com'),
    '2026-08-14',
  );
  assert.equal(
    episodeFromAudioSource('https://storage.example/broadcast-2026-08-28.mp3'),
    '2026-08-28',
  );
  assert.notEqual(
    analyticsNavigationKey('/innovation-pulse/2026-08-21', 'utm_source=x'),
    analyticsNavigationKey('/innovation-pulse/2026-08-21', 'utm_source=youtube'),
  );
});

test('emits each crossed threshold once, including skipped thresholds', () => {
  const seen = new Set<number>();
  assert.deepEqual(newlyReachedMilestones(61, [10, 30, 60, 180], seen), [10, 30, 60]);
  assert.deepEqual(newlyReachedMilestones(75, [10, 30, 60, 180], seen), []);
  assert.deepEqual(newlyReachedMilestones(180, [10, 30, 60, 180], seen), [180]);
  assert.deepEqual(newlyReachedMilestones(Number.NaN, [10, 30, 60, 180], seen), []);
});

test('actual dispatch boundary blocks off/invalid events and caps enabled event volume', () => {
  const sent: Array<[EngagementEventName, Record<string, string | number | boolean>]> = [];
  const dispatch = createEngagementDispatcher((name, properties) => sent.push([name, properties]), 2);

  assert.equal(dispatch(false, '/', 'share_click', { page: '/', channel: 'x' }), false);
  assert.equal(dispatch(true, '/', 'share_click', { page: '/', channel: 'private-user-id' }), false);
  assert.equal(dispatch(true, '/', 'share_click', { page: '/', channel: 'x' }), true);
  assert.equal(dispatch(true, '/', 'page_scroll', { page: '/', percent: 50 }), true);
  assert.equal(dispatch(true, '/', 'page_scroll', { page: '/', percent: 90 }), false);
  assert.equal(sent.length, 2);

  assert.equal(dispatch(true, '/about', 'page_scroll', { page: '/about', percent: 90 }), true);
  assert.equal(sent.length, 3, 'a new page receives a fresh bounded budget');
});

test('page handlers report visible-tab time and deduplicate scroll, audio, and repeated click events', () => {
  const sent: Array<[EngagementEventName, Record<string, string | number | boolean>]> = [];
  let visibility = 'visible';
  let scrollY = 0;
  const handlers = createPageEngagementHandlers({
    page: '/innovation-pulse/[date]',
    hostname: 'www.innovatinghighered.com',
    dispatch: (name, properties) => sent.push([name, properties]),
    getVisibility: () => visibility,
    getScrollMetrics: () => ({ scrollHeight: 2000, innerHeight: 1000, scrollY }),
  });

  for (let index = 0; index < 10; index += 1) handlers.onVisibleTimeTick();
  visibility = 'hidden';
  for (let index = 0; index < 10; index += 1) handlers.onVisibleTimeTick();
  assert.equal(sent.filter(([name]) => name === 'page_visible_time').length, 1);

  scrollY = 600;
  handlers.onScroll();
  handlers.onScroll();
  assert.equal(sent.filter(([name]) => name === 'page_scroll').length, 1);

  const audio = {
    tagName: 'AUDIO',
    currentSrc: 'https://storage.example/broadcast-2026-08-21.mp3',
    duration: 100,
    currentTime: 60,
    getAttribute: () => null,
  };
  const playEvent = { type: 'play', target: audio } as unknown as Event;
  handlers.onMediaEvent(playEvent);
  handlers.onMediaEvent(playEvent);
  const progressEvent = { type: 'timeupdate', target: audio } as unknown as Event;
  handlers.onMediaEvent(progressEvent);
  handlers.onMediaEvent(progressEvent);
  const endedEvent = { type: 'ended', target: audio } as unknown as Event;
  handlers.onMediaEvent(endedEvent);
  handlers.onMediaEvent(endedEvent);
  assert.equal(sent.filter(([name]) => name === 'audio_play').length, 1);
  assert.equal(sent.filter(([name]) => name === 'audio_progress').length, 2);
  assert.equal(sent.filter(([name]) => name === 'audio_complete').length, 1);

  const shareElement = {
    href: 'https://x.com/intent/post',
    getAttribute: (name: string) => name === 'aria-label' ? 'Share on X' : null,
  };
  const clickEvent = {
    type: 'click',
    target: { closest: () => shareElement },
  } as unknown as Event;
  handlers.onClick(clickEvent);
  handlers.onClick(clickEvent);
  assert.equal(sent.filter(([name]) => name === 'share_click').length, 1);

  const nativeShareElement = {
    href: '',
    getAttribute: (name: string) =>
      name === 'aria-label' ? 'Share episode from Innovation Pulse' : null,
  };
  const nativeShareEvent = {
    type: 'click',
    target: { closest: () => nativeShareElement },
  } as unknown as Event;
  handlers.onClick(nativeShareEvent);
  assert.deepEqual(sent.at(-1), [
    'share_click',
    { page: '/innovation-pulse/[date]', channel: 'native' },
  ]);
});

class FakeListenerTarget implements ListenerTargetLike {
  readonly listeners = new Map<string, Set<EventListener>>();

  addEventListener(type: string, listener: EventListener) {
    const listeners = this.listeners.get(type) || new Set<EventListener>();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type: string, listener: EventListener) {
    this.listeners.get(type)?.delete(listener);
  }
}

test('listener installation has idempotent cleanup for SPA effect replacement', () => {
  const windowTarget = new FakeListenerTarget();
  const documentTarget = new FakeListenerTarget();
  let cleared = 0;
  const handlers = createPageEngagementHandlers({
    page: '/',
    hostname: 'www.innovatinghighered.com',
    dispatch: () => undefined,
    getVisibility: () => 'visible',
    getScrollMetrics: () => ({ scrollHeight: 0, innerHeight: 0, scrollY: 0 }),
  });
  const cleanup = installEngagementListeners({
    windowTarget,
    documentTarget,
    handlers,
    setInterval: () => 42,
    clearInterval: (token) => {
      assert.equal(token, 42);
      cleared += 1;
    },
  });

  assert.equal(windowTarget.listeners.get('scroll')?.size, 1);
  assert.equal(documentTarget.listeners.get('click')?.size, 1);
  assert.equal(documentTarget.listeners.get('play')?.size, 1);
  cleanup();
  cleanup();
  assert.equal(cleared, 1);
  assert.equal(windowTarget.listeners.get('scroll')?.size, 0);
  assert.equal(documentTarget.listeners.get('click')?.size, 0);
  assert.equal(documentTarget.listeners.get('play')?.size, 0);
});

test('closed schemas enforce two properties and exclude raw PII-like fields', () => {
  const validEvents: Array<[EngagementEventName, Record<string, string | number | boolean>]> = [
    ['campaign_landing', { campaign: 'innovation-pulse-2026-08-21', channel: 'mailchimp:email:listen' }],
    ['page_visible_time', { page: '/innovation-pulse/[date]', seconds: 30 }],
    ['page_scroll', { page: '/innovation-pulse/[date]', percent: 90 }],
    ['audio_play', { page: '/', episode: '2026-08-14' }],
    ['audio_progress', { episode: '2026-08-14', percent: 50 }],
    ['audio_complete', { page: '/', episode: '2026-08-14' }],
    ['share_click', { page: '/', channel: 'native' }],
    ['outbound_click', { page: '/innovation-pulse/[date]', destination: 'external' }],
    ['newsletter_signup_attempt', { placement: 'footer' }],
    ['newsletter_signup_success', { placement: 'footer' }],
    ['newsletter_signup_error', { placement: 'footer', reason: 'network' }],
  ];

  for (const [name, properties] of validEvents) {
    const sanitized = sanitizeEngagementEvent(name, properties);
    assert.ok(sanitized, `${name} should be accepted`);
    assert.ok(Object.keys(sanitized).length <= 2, `${name} exceeds the property limit`);
  }
  assert.equal(
    sanitizeEngagementEvent('newsletter_signup_attempt', { placement: 'footer', email: 'person@example.com' }),
    null,
  );
  assert.deepEqual(
    sanitizeEngagementEvent('audio_progress', { episode: '2026-08-28', percent: 50 }),
    { episode: '2026-08-28', percent: 50 },
  );
});

test('finite outbound classification and first-observation helper remain fail closed', () => {
  assert.equal(outboundDestination('https://www.innovatinghighered.com/about', 'www.innovatinghighered.com'), null);
  assert.equal(outboundDestination('https://youtu.be/example', 'www.innovatinghighered.com'), 'youtube');
  assert.equal(outboundDestination('https://news.example.edu/story/person-id', 'www.innovatinghighered.com'), 'external');
  assert.equal(outboundDestination('mailto:person@example.com', 'www.innovatinghighered.com'), null);
  const seen = new Set<string>();
  assert.equal(firstObservation('campaign:route', seen), true);
  assert.equal(firstObservation('campaign:route', seen), false);
});

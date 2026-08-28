'use client';

import { Analytics, track } from '@vercel/analytics/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import {
  analyticsNavigationKey,
  analyticsPagePath,
  campaignEventProperties,
  createEngagementDispatcher,
  createPageEngagementHandlers,
  firstObservation,
  installEngagementListeners,
  isEngagementTrackingEnabled,
  isInternalAnalyticsOptOut,
  redactAnalyticsEventUrl,
  type AnalyticsUrlEvent,
  type AnalyticsValue,
  type EngagementEventName,
  type ListenerTargetLike,
} from '@/lib/engagementTracking';

const campaignLandings = new Set<string>();
const dispatchCustomEvent = createEngagementDispatcher((name, properties) => {
  track(name, properties);
});

function isCurrentBrowserOptedOut() {
  if (typeof window === 'undefined') return false;
  try {
    return isInternalAnalyticsOptOut(window.location.hash, window.localStorage);
  } catch {
    return isInternalAnalyticsOptOut(window.location.hash);
  }
}

function beforeSend(event: AnalyticsUrlEvent) {
  if (isCurrentBrowserOptedOut()) return null;
  return redactAnalyticsEventUrl(event);
}

function trackEvent(name: EngagementEventName, properties: Record<string, AnalyticsValue> = {}) {
  const budgetKey = typeof window === 'undefined' ? 'server' : window.location.pathname;
  return dispatchCustomEvent(
    isEngagementTrackingEnabled(process.env.NEXT_PUBLIC_ENGAGEMENT_EVENTS) &&
      !isCurrentBrowserOptedOut(),
    budgetKey,
    name,
    properties,
  );
}

function CustomEngagementEvents() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const navigationKey = analyticsNavigationKey(pathname || '/', search);

  useEffect(() => {
    if (
      !isEngagementTrackingEnabled(process.env.NEXT_PUBLIC_ENGAGEMENT_EVENTS) ||
      isCurrentBrowserOptedOut()
    ) return;

    const page = analyticsPagePath(pathname || window.location.pathname);
    const campaignProperties = campaignEventProperties(search);
    if (campaignProperties) {
      const campaignKey = `${page}:${campaignProperties.campaign}:${campaignProperties.channel}`;
      if (firstObservation(campaignKey, campaignLandings)) {
        trackEvent('campaign_landing', campaignProperties);
      }
    }

    const handlers = createPageEngagementHandlers({
      page,
      hostname: window.location.hostname,
      dispatch: trackEvent,
      getVisibility: () => document.visibilityState,
      getScrollMetrics: () => ({
        scrollHeight: document.documentElement.scrollHeight,
        innerHeight: window.innerHeight,
        scrollY: window.scrollY,
      }),
    });

    return installEngagementListeners({
      windowTarget: window as unknown as ListenerTargetLike,
      documentTarget: document as unknown as ListenerTargetLike,
      handlers,
      setInterval: (callback, milliseconds) => window.setInterval(callback, milliseconds),
      clearInterval: (token) => window.clearInterval(token as number),
    });
  }, [navigationKey, pathname, search]);

  return null;
}

export default function EngagementAnalytics() {
  return (
    <>
      {/*
        NEXT_PUBLIC_ENGAGEMENT_EVENTS controls custom events only. The
        browser-local internal opt-out is checked at both delivery boundaries,
        suppressing automatic pageviews and custom events for Brent and QA.
      */}
      <Analytics beforeSend={beforeSend} />
      <Suspense fallback={null}>
        <CustomEngagementEvents />
      </Suspense>
    </>
  );
}

export { trackEvent };

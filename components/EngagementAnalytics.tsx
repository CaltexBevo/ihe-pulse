'use client';

import { Analytics, track } from '@vercel/analytics/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
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
let networkCollectionAllowed = false;
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

function trackEvent(
  name: EngagementEventName,
  properties: Record<string, AnalyticsValue> = {},
  publicPagePaths?: ReadonlySet<string>,
) {
  const budgetKey = typeof window === 'undefined' ? 'server' : window.location.pathname;
  return dispatchCustomEvent(
    isEngagementTrackingEnabled(process.env.NEXT_PUBLIC_ENGAGEMENT_EVENTS) &&
      networkCollectionAllowed &&
      !isCurrentBrowserOptedOut(),
    budgetKey,
    name,
    properties,
    publicPagePaths,
  );
}

function CustomEngagementEvents({ publicPagePaths }: { publicPagePaths: ReadonlySet<string> }) {
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
        trackEvent('campaign_landing', campaignProperties, publicPagePaths);
      }
    }

    const handlers = createPageEngagementHandlers({
      page,
      hostname: window.location.hostname,
      publicPagePaths,
      dispatch: (name, properties) => trackEvent(name, properties, publicPagePaths),
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
  }, [navigationKey, pathname, search, publicPagePaths]);

  return null;
}

export default function EngagementAnalytics({ publicPagePaths }: { publicPagePaths: string[] }) {
  const [collectionAllowed, setCollectionAllowed] = useState(false);
  const publicPagePathSet = useMemo(() => new Set(publicPagePaths), [publicPagePaths]);
  useEffect(() => {
    networkCollectionAllowed = false;
    if (isCurrentBrowserOptedOut()) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 5000);
    let mounted = true;
    fetch('/api/analytics-context', { cache: 'no-store', credentials: 'same-origin', signal: controller.signal })
      .then(async response => {
        if (!response.ok) return;
        const context: unknown = await response.json();
        if (!mounted || !context || typeof context !== 'object' || !('excluded' in context) || context.excluded !== false) return;
        networkCollectionAllowed = true;
        setCollectionAllowed(true);
      })
      .catch(() => { /* Unknown network context suppresses collection for this page. */ })
      .finally(() => window.clearTimeout(timeout));
    return () => {
      mounted = false;
      networkCollectionAllowed = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);
  const beforeSend = useCallback((event: AnalyticsUrlEvent) => {
    if (!networkCollectionAllowed || isCurrentBrowserOptedOut()) return null;
    return redactAnalyticsEventUrl(event, publicPagePathSet);
  }, [publicPagePathSet]);

  if (!collectionAllowed) return null;

  return (
    <>
      {/*
        NEXT_PUBLIC_ENGAGEMENT_EVENTS controls custom events only. The
        network check completes before the analytics script or listeners mount.
        Browser opt-out is also checked at both delivery boundaries.
      */}
      <Analytics beforeSend={beforeSend} />
      <Suspense fallback={null}>
        <CustomEngagementEvents publicPagePaths={publicPagePathSet} />
      </Suspense>
    </>
  );
}

export { trackEvent };

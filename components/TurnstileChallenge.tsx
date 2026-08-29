'use client';

import { useEffect, useRef, useState } from 'react';

const TURNSTILE_SCRIPT_ID = 'ihe-turnstile-api';
const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const TURNSTILE_ACTION = 'newsletter_signup';
const TURNSTILE_SCRIPT_TIMEOUT_MS = 5_000;
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

type TurnstileOptions = {
  sitekey: string;
  action: string;
  appearance: 'interaction-only';
  'response-field': false;
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
  'timeout-callback': () => void;
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileOptions) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let turnstileLoader: Promise<TurnstileApi> | null = null;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstileLoader) return turnstileLoader;

  turnstileLoader = new Promise<TurnstileApi>((resolve, reject) => {
    const controller = new AbortController();
    const existingScript = document.getElementById(TURNSTILE_SCRIPT_ID) as HTMLScriptElement | null;
    const script = existingScript || document.createElement('script');
    const timeout = setTimeout(() => controller.abort(), TURNSTILE_SCRIPT_TIMEOUT_MS);

    const cleanup = () => {
      clearTimeout(timeout);
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
      controller.signal.removeEventListener('abort', handleAbort);
    };
    const fail = (error: Error) => {
      cleanup();
      script.remove();
      reject(error);
    };
    const handleLoad = () => {
      cleanup();
      if (window.turnstile) resolve(window.turnstile);
      else fail(new Error('Turnstile API unavailable after script load.'));
    };
    const handleError = () => fail(new Error('Turnstile script failed to load.'));
    const handleAbort = () => fail(new Error('Turnstile script load timed out.'));

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', handleError, { once: true });
    controller.signal.addEventListener('abort', handleAbort, { once: true });

    if (!existingScript) {
      script.id = TURNSTILE_SCRIPT_ID;
      script.src = TURNSTILE_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }).catch((error) => {
    turnstileLoader = null;
    throw error;
  });

  return turnstileLoader;
}

interface TurnstileChallengeProps {
  active: boolean;
  onTokenChange: (token: string) => void;
  resetSignal: number;
  statusId: string;
}

export default function TurnstileChallenge({
  active,
  onTokenChange,
  resetSignal,
  statusId,
}: TurnstileChallengeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<TurnstileApi | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [retrySignal, setRetrySignal] = useState(0);
  const [message, setMessage] = useState(
    SITE_KEY
      ? 'Security check starts when you begin filling out the form.'
      : 'Security check is unavailable. Please try again later.',
  );
  const [hasProblem, setHasProblem] = useState(!SITE_KEY);

  useEffect(() => {
    if (!active || !SITE_KEY) return;
    let cancelled = false;

    onTokenChange('');
    loadTurnstile()
      .then((api) => {
        if (cancelled || !containerRef.current) return;
        apiRef.current = api;
        setHasProblem(false);
        setMessage('Security check in progress.');

        const retryWidget = (retryMessage: string) => {
          if (cancelled) return;
          onTokenChange('');
          setHasProblem(true);
          setMessage(retryMessage);
          const widgetId = widgetIdRef.current;
          if (widgetId) {
            queueMicrotask(() => {
              if (!cancelled) api.reset(widgetId);
            });
          }
        };

        widgetIdRef.current = api.render(containerRef.current, {
          sitekey: SITE_KEY,
          action: TURNSTILE_ACTION,
          appearance: 'interaction-only',
          'response-field': false,
          callback: (token) => {
            if (cancelled) return;
            onTokenChange(token);
            setHasProblem(false);
            setMessage('Security check complete.');
          },
          'expired-callback': () => retryWidget('Security check expired. Retrying now.'),
          'error-callback': () => retryWidget('Security check failed. Retrying now.'),
          'timeout-callback': () => retryWidget('Security check timed out. Retrying now.'),
        });
      })
      .catch(() => {
        if (cancelled) return;
        onTokenChange('');
        setHasProblem(true);
        setMessage('Security check is unavailable. Retry the security check.');
      });

    return () => {
      cancelled = true;
      if (apiRef.current && widgetIdRef.current) apiRef.current.remove(widgetIdRef.current);
      widgetIdRef.current = null;
      apiRef.current = null;
    };
  }, [active, onTokenChange, retrySignal]);

  useEffect(() => {
    if (resetSignal < 1 || !apiRef.current || !widgetIdRef.current) return;
    const api = apiRef.current;
    const widgetId = widgetIdRef.current;
    queueMicrotask(() => {
      onTokenChange('');
      setHasProblem(false);
      setMessage('Refreshing security check.');
      api.reset(widgetId);
    });
  }, [onTokenChange, resetSignal]);

  const retry = () => {
    setHasProblem(false);
    setMessage('Retrying security check.');
    setRetrySignal((value) => value + 1);
  };

  return (
    <div className="np-sub-security-row min-w-0 w-full text-left" data-newsletter-security>
      <div ref={containerRef} className="np-sub-security-widget" />
      <p
        id={statusId}
        className={`mt-1 text-[0.68rem] ${hasProblem ? 'text-[var(--cyan)]' : 'sr-only'}`}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
      {active && SITE_KEY && hasProblem && (
        <button
          type="button"
          onClick={retry}
          aria-describedby={statusId}
          className="np-sub-security-retry mt-1 text-[0.68rem] text-[var(--cyan)] underline underline-offset-2"
        >
          Retry security check
        </button>
      )}
    </div>
  );
}

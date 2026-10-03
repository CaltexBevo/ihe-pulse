export const NEWSLETTER_BROWSER_TIMEOUT_MS = 10_000;

export class FetchTimeoutError extends Error {
  constructor() {
    super('The request timed out.');
    this.name = 'FetchTimeoutError';
  }
}

type NewsletterClientBody = {
  email: string;
  firstName: string;
  lastName: string;
  _gotcha: string;
  turnstileToken: string;
  /** New preference fields are optional so legacy newsletter placements remain Pulse-only. */
  preferences?: { pulse: boolean; grants: boolean };
  grantCriteria?: {
    audiences: string[];
    locations: string[];
    areas: string[];
    minimumAwardUsd: number | null;
  };
};

type NewsletterClientResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  preferencesUrl?: string;
};

export function consumeChallengeToken(token: string) {
  return {
    submissionToken: token,
    remainingToken: '',
  };
}

export function nextChallengeReset(current: number) {
  return Number.isSafeInteger(current) && current >= 0 ? current + 1 : 1;
}

export async function postNewsletter(
  body: NewsletterClientBody,
  fetchImplementation: typeof fetch = fetch,
  timeoutMs = NEWSLETTER_BROWSER_TIMEOUT_MS,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImplementation('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json() as NewsletterClientResponse;
    return { response, data };
  } catch (error) {
    if (controller.signal.aborted) throw new FetchTimeoutError();
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/** Fail closed on missing flags, malformed responses, network errors, or timeouts. */
export async function readNewsletterReadiness(fetchImplementation: typeof fetch = fetch, timeoutMs = NEWSLETTER_BROWSER_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImplementation("/api/newsletter", {
      method: "GET", cache: "no-store", credentials: "same-origin", signal: controller.signal,
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data !== null && typeof data === "object" && data.ready === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

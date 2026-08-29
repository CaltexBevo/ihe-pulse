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
    const data = await response.json() as { message?: string; error?: string };
    return { response, data };
  } catch (error) {
    if (controller.signal.aborted) throw new FetchTimeoutError();
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

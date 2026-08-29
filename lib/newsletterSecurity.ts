const MAX_REQUEST_BODY_BYTES = 4_096;
const TURNSTILE_ACTION = 'newsletter_signup';
const TURNSTILE_SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
// One deadline covers both upstream fetches and both response body reads. The browser waits
// 10 seconds, leaving a deterministic 3-second margin for route and response overhead.
export const NEWSLETTER_SERVER_DEADLINE_MS = 7_000;
const PRODUCTION_ORIGIN = 'https://www.innovatinghighered.com';
const PRODUCTION_HOSTNAME = 'www.innovatinghighered.com';
const LOCAL_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://[::1]:3000'];
const LOCAL_HOSTNAMES = ['localhost', '127.0.0.1', '[::1]'];
const PENDING_SUCCESS = {
  success: true,
  message: 'Check your inbox to confirm your subscription!',
};

export type NewsletterEnvironment = {
  NODE_ENV?: string;
  NEWSLETTER_ALLOWED_ORIGINS?: string;
  TURNSTILE_ALLOWED_HOSTNAMES?: string;
  TURNSTILE_SECRET_KEY?: string;
  MAILCHIMP_API_KEY?: string;
  MAILCHIMP_AUDIENCE_ID?: string;
  MAILCHIMP_SERVER_PREFIX?: string;
};

type NewsletterSubmission = {
  email: string;
  firstName: string;
  lastName: string;
  honeypot: string;
  turnstileToken: string;
};

type TurnstileResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
};

type HandlerDependencies = {
  env?: NewsletterEnvironment;
  fetch?: typeof fetch;
  serverDeadlineMs?: number;
};

class RequestError extends Error {
  readonly status: number;
  readonly publicMessage: string;

  constructor(status: number, publicMessage: string) {
    super(publicMessage);
    this.status = status;
    this.publicMessage = publicMessage;
  }
}

async function fetchJson(
  fetchImplementation: typeof fetch,
  input: string | URL | Request,
  init: RequestInit,
  signal: AbortSignal,
) {
  const response = await fetchImplementation(input, { ...init, signal });
  const body = await response.json() as unknown;
  return { response, body };
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function configuredValues(value: string | undefined) {
  if (value === undefined) return [];
  if (!value.trim()) return null;
  const values = value.split(',').map((item) => item.trim());
  if (values.some((item) => !item || item.includes('*'))) return null;
  return values;
}

function exactOrigin(value: string, allowLocalHttp: boolean) {
  try {
    const parsed = new URL(value);
    const local = LOCAL_HOSTNAMES.includes(parsed.hostname);
    if (
      parsed.origin !== value ||
      parsed.username ||
      parsed.password ||
      parsed.pathname !== '/' ||
      parsed.search ||
      parsed.hash ||
      (parsed.protocol !== 'https:' && !(allowLocalHttp && local && parsed.protocol === 'http:'))
    ) return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

function exactHostname(value: string) {
  const normalized = value.toLowerCase();
  if (normalized.includes('*') || /[\s/@?#]/.test(normalized)) return null;
  if (LOCAL_HOSTNAMES.includes(normalized)) return normalized;
  if (normalized.length > 253 || normalized.includes(':')) return null;
  const labels = normalized.split('.');
  if (labels.length < 2 || labels.some((label) => (
    !label ||
    label.length > 63 ||
    label.startsWith('-') ||
    label.endsWith('-') ||
    !/^[a-z0-9-]+$/.test(label)
  ))) return null;
  return normalized;
}

export function newsletterAllowedOrigins(environment: NewsletterEnvironment) {
  const configured = configuredValues(environment.NEWSLETTER_ALLOWED_ORIGINS);
  if (configured === null) return null;

  const origins = new Set([PRODUCTION_ORIGIN]);
  if (environment.NODE_ENV !== 'production') {
    for (const origin of LOCAL_ORIGINS) origins.add(origin);
  }
  for (const value of configured) {
    const origin = exactOrigin(value, environment.NODE_ENV !== 'production');
    if (!origin) return null;
    origins.add(origin);
  }
  return origins;
}

export function turnstileAllowedHostnames(environment: NewsletterEnvironment) {
  const configured = configuredValues(environment.TURNSTILE_ALLOWED_HOSTNAMES);
  if (configured === null) return null;

  const hostnames = new Set([PRODUCTION_HOSTNAME]);
  if (environment.NODE_ENV !== 'production') {
    for (const hostname of LOCAL_HOSTNAMES) hostnames.add(hostname);
  }
  for (const value of configured) {
    const hostname = exactHostname(value);
    if (!hostname) return null;
    hostnames.add(hostname);
  }
  return hostnames;
}

export function isSameOriginRequest(request: Request, allowedOrigins: ReadonlySet<string>) {
  const origin = request.headers.get('origin');
  return Boolean(origin && origin !== 'null' && allowedOrigins.has(origin));
}

function isJsonContentType(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  return contentType.split(';', 1)[0].trim().toLowerCase() === 'application/json';
}

async function readLimitedBody(request: Request) {
  const contentLength = request.headers.get('content-length');
  if (contentLength && (!/^\d+$/.test(contentLength) || Number(contentLength) > MAX_REQUEST_BODY_BYTES)) {
    throw new RequestError(413, 'Request body is too large.');
  }
  if (!request.body) throw new RequestError(400, 'Request body is required.');

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let byteLength = 0;
  let text = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteLength += value.byteLength;
      if (byteLength > MAX_REQUEST_BODY_BYTES) {
        await reader.cancel();
        throw new RequestError(413, 'Request body is too large.');
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    reader.releaseLock();
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new RequestError(400, 'Request body must contain valid JSON.');
  }
}

function normalizeEmail(value: unknown) {
  if (typeof value !== 'string') return null;
  const email = value.normalize('NFKC').trim().toLowerCase();
  if (email.length < 6 || email.length > 254 || /[\u0000-\u001f\u007f\s]/.test(email)) return null;

  const at = email.indexOf('@');
  if (at <= 0 || at !== email.lastIndexOf('@')) return null;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  if (
    local.length > 64 ||
    local.startsWith('.') ||
    local.endsWith('.') ||
    local.includes('..') ||
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)
  ) return null;

  const labels = domain.split('.');
  if (labels.length < 2 || labels.some((label) => (
    !label ||
    label.length > 63 ||
    label.startsWith('-') ||
    label.endsWith('-') ||
    !/^[a-z0-9-]+$/i.test(label)
  ))) return null;
  return email;
}

function normalizeName(value: unknown) {
  if (typeof value !== 'string') return null;
  const name = value.normalize('NFKC').trim().replace(/\s+/gu, ' ');
  if (name.length < 1 || name.length > 80) return null;
  if (!/^[\p{L}\p{M}][\p{L}\p{M}'’.-]*(?: [\p{L}\p{M}][\p{L}\p{M}'’.-]*)*$/u.test(name)) return null;
  return name;
}

export function parseNewsletterSubmission(value: unknown): NewsletterSubmission | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const honeypot = typeof record._gotcha === 'string' ? record._gotcha : '';
  if (honeypot.length > 0) {
    return { email: '', firstName: '', lastName: '', honeypot, turnstileToken: '' };
  }

  const email = normalizeEmail(record.email);
  const firstName = normalizeName(record.firstName);
  const lastName = normalizeName(record.lastName);
  const turnstileToken = typeof record.turnstileToken === 'string' ? record.turnstileToken.trim() : '';
  if (!email || !firstName || !lastName || turnstileToken.length < 10 || turnstileToken.length > 2_048) {
    return null;
  }
  return { email, firstName, lastName, honeypot, turnstileToken };
}

function validServiceConfiguration(environment: NewsletterEnvironment) {
  return Boolean(
    environment.TURNSTILE_SECRET_KEY?.trim() &&
    environment.MAILCHIMP_API_KEY?.trim() &&
    environment.MAILCHIMP_AUDIENCE_ID?.match(/^[a-z0-9]+$/i) &&
    environment.MAILCHIMP_SERVER_PREFIX?.match(/^us\d+$/),
  );
}

async function verifyTurnstile(
  token: string,
  environment: NewsletterEnvironment,
  allowedHostnames: ReadonlySet<string>,
  fetchImplementation: typeof fetch,
  signal: AbortSignal,
) {
  try {
    const body = new URLSearchParams({
      secret: environment.TURNSTILE_SECRET_KEY!.trim(),
      response: token,
    });
    const { response, body: rawResult } = await fetchJson(fetchImplementation, TURNSTILE_SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      cache: 'no-store',
    }, signal);
    if (!response.ok) return 'unavailable' as const;
    const result = rawResult as TurnstileResponse;
    if (
      result.success !== true ||
      result.action !== TURNSTILE_ACTION ||
      typeof result.hostname !== 'string' ||
      !allowedHostnames.has(result.hostname.toLowerCase())
    ) return 'invalid' as const;
    return 'valid' as const;
  } catch {
    return 'unavailable' as const;
  }
}

export async function handleNewsletterPost(request: Request, dependencies: HandlerDependencies = {}) {
  const environment = dependencies.env || process.env;
  const fetchImplementation = dependencies.fetch || fetch;
  const allowedOrigins = newsletterAllowedOrigins(environment);
  const allowedHostnames = turnstileAllowedHostnames(environment);

  if (!allowedOrigins || !allowedHostnames) {
    console.error('Newsletter signup unavailable: allowlist configuration is invalid.');
    return jsonResponse({ error: 'Newsletter service is temporarily unavailable. Please try again later.' }, 503);
  }
  if (!isSameOriginRequest(request, allowedOrigins)) {
    return jsonResponse({ error: 'Request origin is not allowed.' }, 403);
  }
  if (!isJsonContentType(request)) {
    return jsonResponse({ error: 'Content-Type must be application/json.' }, 415);
  }

  try {
    const rawBody = await readLimitedBody(request);
    const submission = parseNewsletterSubmission(rawBody);
    if (!submission) {
      return jsonResponse({ error: 'Please provide a valid name, email address, and security check.' }, 400);
    }
    if (submission.honeypot) {
      return jsonResponse({ success: true, message: 'Thank you for subscribing!' });
    }
    if (!validServiceConfiguration(environment)) {
      console.error('Newsletter signup unavailable: server configuration is incomplete.');
      return jsonResponse({ error: 'Newsletter service is temporarily unavailable. Please try again later.' }, 503);
    }

    const serverController = new AbortController();
    const serverDeadline = setTimeout(
      () => serverController.abort(),
      dependencies.serverDeadlineMs ?? NEWSLETTER_SERVER_DEADLINE_MS,
    );
    try {
      const turnstileResult = await verifyTurnstile(
        submission.turnstileToken,
        environment,
        allowedHostnames,
        fetchImplementation,
        serverController.signal,
      );
      if (turnstileResult === 'unavailable') {
        console.error('Newsletter signup unavailable: security verification could not be completed.');
        return jsonResponse({ error: 'Security verification is temporarily unavailable. Please try again.' }, 503);
      }
      if (turnstileResult !== 'valid') {
        return jsonResponse({ error: 'Security verification failed. Please try again.' }, 400);
      }

      const mailchimpUrl = `https://${environment.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${environment.MAILCHIMP_AUDIENCE_ID}/members`;
      let mailchimpResponse: Response;
      let mailchimpBody: { title?: string };
      try {
        const result = await fetchJson(fetchImplementation, mailchimpUrl, {
          method: 'POST',
          headers: {
            Authorization: `apikey ${environment.MAILCHIMP_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email_address: submission.email,
            status: 'pending',
            tags: ['Innovation Pulse', 'Website Signup'],
            merge_fields: {
              FNAME: submission.firstName,
              LNAME: submission.lastName,
            },
          }),
          cache: 'no-store',
        }, serverController.signal);
        mailchimpResponse = result.response;
        mailchimpBody = result.body as { title?: string };
      } catch {
        console.error('Newsletter signup unavailable: Mailchimp request could not be completed.');
        return jsonResponse({ error: 'Newsletter service is temporarily unavailable. Please try again.' }, 503);
      }
      if (mailchimpResponse.ok || mailchimpBody.title === 'Member Exists') {
        return jsonResponse(PENDING_SUCCESS);
      }
      if (mailchimpBody.title === 'Invalid Resource') {
        return jsonResponse({ error: 'Please enter a valid email address.' }, 400);
      }

      console.error(`Newsletter Mailchimp request failed with status ${mailchimpResponse.status}.`);
      return jsonResponse({ error: 'Unable to subscribe. Please try again later.' }, 502);
    } finally {
      clearTimeout(serverDeadline);
    }
  } catch (error) {
    if (error instanceof RequestError) {
      return jsonResponse({ error: error.publicMessage }, error.status);
    }
    console.error('Newsletter signup failed with an unexpected server error.');
    return jsonResponse({ error: 'Something went wrong. Please try again.' }, 500);
  }
}

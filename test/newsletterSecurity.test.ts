import assert from 'node:assert/strict';
import test from 'node:test';

import {
  handleNewsletterPost,
  isSameOriginRequest,
  newsletterAllowedOrigins,
  parseNewsletterSubmission,
  turnstileAllowedHostnames,
} from '../lib/newsletterSecurity.ts';

const VALID_ENVIRONMENT = {
  NODE_ENV: 'test',
  TURNSTILE_SECRET_KEY: 'test-turnstile-secret',
  MAILCHIMP_API_KEY: 'test-mailchimp-key',
  MAILCHIMP_AUDIENCE_ID: 'abc123',
  MAILCHIMP_SERVER_PREFIX: 'us16',
};

const VALID_BODY = {
  email: ' Faculty.Member@Example.EDU ',
  firstName: '  José  Luis ',
  lastName: ' O’Neil ',
  _gotcha: '',
  turnstileToken: 'valid-test-token',
};

function newsletterRequest(
  body: unknown = VALID_BODY,
  headers: Record<string, string> = {},
  url = 'http://localhost:3000/api/newsletter',
) {
  return new Request(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Origin: new URL(url).origin,
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

async function responseBody(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

function stalledFetch(onAbort?: () => void) {
  return (async (_input: string | URL | Request, init?: RequestInit) => (
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => {
        onAbort?.();
        reject(new Error('aborted'));
      }, { once: true });
    })
  )) as typeof fetch;
}

test('normalizes strict input while permitting legitimate one-character names', () => {
  assert.deepEqual(parseNewsletterSubmission(VALID_BODY), {
    email: 'faculty.member@example.edu',
    firstName: 'José Luis',
    lastName: 'O’Neil',
    honeypot: '',
    turnstileToken: 'valid-test-token',
  });
  assert.deepEqual(parseNewsletterSubmission({
    ...VALID_BODY,
    firstName: 'Q',
    lastName: '李',
  })?.firstName, 'Q');

  const invalidBodies = [
    { ...VALID_BODY, email: 'person@example' },
    { ...VALID_BODY, email: '.person@example.edu' },
    { ...VALID_BODY, firstName: '<script>' },
    { ...VALID_BODY, lastName: '1' },
    { ...VALID_BODY, firstName: 'x'.repeat(81) },
    { ...VALID_BODY, turnstileToken: 'short' },
    { ...VALID_BODY, turnstileToken: 'x'.repeat(2_049) },
  ];
  for (const body of invalidBodies) assert.equal(parseNewsletterSubmission(body), null);
});

test('uses exact server-owned origin defaults and ignores forged or chained forwarding headers', () => {
  const productionOrigins = newsletterAllowedOrigins({ NODE_ENV: 'production' });
  assert.deepEqual([...productionOrigins!], ['https://www.innovatinghighered.com']);

  const forged = newsletterRequest(VALID_BODY, {
    Origin: 'https://attacker.example',
    Host: 'www.innovatinghighered.com',
    'X-Forwarded-Host': 'www.innovatinghighered.com, attacker.example',
    'X-Forwarded-Proto': 'https, http',
  }, 'https://internal.invalid/api/newsletter');
  assert.equal(isSameOriginRequest(forged, productionOrigins!), false);

  const validDespiteForgedForwarding = newsletterRequest(VALID_BODY, {
    Origin: 'https://www.innovatinghighered.com',
    Host: 'attacker.example',
    'X-Forwarded-Host': 'attacker.example, www.innovatinghighered.com',
    'X-Forwarded-Proto': 'http, https',
  }, 'https://internal.invalid/api/newsletter');
  assert.equal(isSameOriginRequest(validDespiteForgedForwarding, productionOrigins!), true);
});

test('allows fixed localhost only outside production and exact configured previews without wildcards', () => {
  const developmentOrigins = newsletterAllowedOrigins({ NODE_ENV: 'development' });
  assert.equal(developmentOrigins?.has('http://localhost:3000'), true);
  assert.equal(developmentOrigins?.has('http://localhost:3001'), false);

  const previewEnvironment = {
    NODE_ENV: 'production',
    NEWSLETTER_ALLOWED_ORIGINS: 'https://ihe-pulse-turnstile-review.vercel.app',
    TURNSTILE_ALLOWED_HOSTNAMES: 'ihe-pulse-turnstile-review.vercel.app',
  };
  assert.equal(
    newsletterAllowedOrigins(previewEnvironment)?.has('https://ihe-pulse-turnstile-review.vercel.app'),
    true,
  );
  assert.equal(
    turnstileAllowedHostnames(previewEnvironment)?.has('ihe-pulse-turnstile-review.vercel.app'),
    true,
  );
  assert.equal(newsletterAllowedOrigins({
    NODE_ENV: 'production',
    NEWSLETTER_ALLOWED_ORIGINS: 'https://*.vercel.app',
  }), null);
  assert.equal(turnstileAllowedHostnames({
    NODE_ENV: 'production',
    TURNSTILE_ALLOWED_HOSTNAMES: '*.vercel.app',
  }), null);
  assert.equal(newsletterAllowedOrigins({
    NODE_ENV: 'production',
    NEWSLETTER_ALLOWED_ORIGINS: 'https://preview.vercel.app/path',
  }), null);
});

test('enforces origin, application/json, and body size before external calls', async () => {
  let fetchCalls = 0;
  const noFetch = (async () => {
    fetchCalls += 1;
    throw new Error('unexpected fetch');
  }) as typeof fetch;

  const crossOrigin = await handleNewsletterPost(
    newsletterRequest(VALID_BODY, { Origin: 'https://attacker.example' }),
    { env: VALID_ENVIRONMENT, fetch: noFetch },
  );
  assert.equal(crossOrigin.status, 403);

  const wrongType = await handleNewsletterPost(
    newsletterRequest(JSON.stringify(VALID_BODY), { 'Content-Type': 'text/plain' }),
    { env: VALID_ENVIRONMENT, fetch: noFetch },
  );
  assert.equal(wrongType.status, 415);

  const oversized = await handleNewsletterPost(
    newsletterRequest({ ...VALID_BODY, padding: 'x'.repeat(5_000) }),
    { env: VALID_ENVIRONMENT, fetch: noFetch },
  );
  assert.equal(oversized.status, 413);
  assert.equal(fetchCalls, 0);
});

test('fails closed on malformed allowlists or missing service configuration', async () => {
  const configurations = [
    { ...VALID_ENVIRONMENT, NEWSLETTER_ALLOWED_ORIGINS: 'https://*.vercel.app' },
    { ...VALID_ENVIRONMENT, TURNSTILE_ALLOWED_HOSTNAMES: '*.vercel.app' },
    { ...VALID_ENVIRONMENT, TURNSTILE_SECRET_KEY: undefined },
    { ...VALID_ENVIRONMENT, MAILCHIMP_API_KEY: undefined },
    { ...VALID_ENVIRONMENT, MAILCHIMP_AUDIENCE_ID: '../other-list' },
    { ...VALID_ENVIRONMENT, MAILCHIMP_SERVER_PREFIX: 'attacker.example' },
  ];

  const originalError = console.error;
  console.error = () => {};
  try {
    for (const env of configurations) {
      let fetchCalls = 0;
      const response = await handleNewsletterPost(newsletterRequest(), {
        env,
        fetch: (async () => {
          fetchCalls += 1;
          throw new Error('unexpected fetch');
        }) as typeof fetch,
      });
      assert.equal(response.status, 503);
      assert.equal(fetchCalls, 0);
    }
  } finally {
    console.error = originalError;
  }
});

test('honeypot submissions silently succeed without Turnstile or Mailchimp calls', async () => {
  let fetchCalls = 0;
  const response = await handleNewsletterPost(newsletterRequest({ _gotcha: 'filled-by-bot' }), {
    env: {},
    fetch: (async () => {
      fetchCalls += 1;
      throw new Error('unexpected fetch');
    }) as typeof fetch,
  });
  assert.equal(response.status, 200);
  assert.equal((await responseBody(response)).success, true);
  assert.equal(fetchCalls, 0);
});

test('rejects invalid Turnstile success, action, and exact hostname before Mailchimp', async (context) => {
  const cases = [
    { name: 'invalid token', verification: { success: false, action: 'newsletter_signup', hostname: 'localhost' } },
    { name: 'wrong action', verification: { success: true, action: 'other_action', hostname: 'localhost' } },
    { name: 'wrong hostname', verification: { success: true, action: 'newsletter_signup', hostname: 'attacker.example' } },
  ];

  for (const item of cases) {
    await context.test(item.name, async () => {
      let fetchCalls = 0;
      const response = await handleNewsletterPost(newsletterRequest(), {
        env: VALID_ENVIRONMENT,
        fetch: (async () => {
          fetchCalls += 1;
          return Response.json(item.verification);
        }) as typeof fetch,
      });
      assert.equal(response.status, 400);
      assert.equal(fetchCalls, 1, 'Mailchimp must not be called');
    });
  }
});

test('accepts an explicitly configured exact production preview origin and Turnstile hostname', async () => {
  const preview = 'ihe-pulse-turnstile-review.vercel.app';
  const environment = {
    ...VALID_ENVIRONMENT,
    NODE_ENV: 'production',
    NEWSLETTER_ALLOWED_ORIGINS: `https://${preview}`,
    TURNSTILE_ALLOWED_HOSTNAMES: preview,
  };
  let call = 0;
  const response = await handleNewsletterPost(
    newsletterRequest(VALID_BODY, {}, `https://${preview}/api/newsletter`),
    {
      env: environment,
      fetch: (async () => {
        call += 1;
        if (call === 1) return Response.json({ success: true, action: 'newsletter_signup', hostname: preview });
        return Response.json({ id: 'member-id' });
      }) as typeof fetch,
    },
  );
  assert.equal(response.status, 200);

  const unknownPreview = await handleNewsletterPost(
    newsletterRequest(VALID_BODY, {}, 'https://other-preview.vercel.app/api/newsletter'),
    { env: environment, fetch: stalledFetch() },
  );
  assert.equal(unknownPreview.status, 403);
});

test('aborts stalled Siteverify and fails closed before Mailchimp', async () => {
  let aborted = false;
  const originalError = console.error;
  console.error = () => {};
  try {
    const response = await handleNewsletterPost(newsletterRequest(), {
      env: VALID_ENVIRONMENT,
      fetch: stalledFetch(() => { aborted = true; }),
      serverDeadlineMs: 5,
    });
    assert.equal(response.status, 503);
    assert.equal(aborted, true);
  } finally {
    console.error = originalError;
  }
});

test('Siteverify timeout remains active while its response body stalls', async () => {
  let aborted = false;
  const originalError = console.error;
  console.error = () => {};
  try {
    const response = await handleNewsletterPost(newsletterRequest(), {
      env: VALID_ENVIRONMENT,
      fetch: (async (_input, init) => ({
        ok: true,
        json: () => new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            aborted = true;
            reject(new Error('aborted'));
          }, { once: true });
        }),
      } as Response)) as typeof fetch,
      serverDeadlineMs: 5,
    });
    assert.equal(response.status, 503);
    assert.equal(aborted, true);
  } finally {
    console.error = originalError;
  }
});

test('aborts stalled Mailchimp after valid Turnstile verification', async () => {
  let call = 0;
  let aborted = false;
  const originalError = console.error;
  console.error = () => {};
  try {
    const response = await handleNewsletterPost(newsletterRequest(), {
      env: VALID_ENVIRONMENT,
      fetch: (async (_input, init) => {
        call += 1;
        if (call === 1) {
          return Response.json({ success: true, action: 'newsletter_signup', hostname: 'localhost' });
        }
        return new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            aborted = true;
            reject(new Error('aborted'));
          }, { once: true });
        });
      }) as typeof fetch,
      serverDeadlineMs: 5,
    });
    assert.equal(response.status, 503);
    assert.equal(call, 2);
    assert.equal(aborted, true);
  } finally {
    console.error = originalError;
  }
});

test('Mailchimp timeout remains active while its response body stalls', async () => {
  let call = 0;
  let aborted = false;
  const originalError = console.error;
  console.error = () => {};
  try {
    const response = await handleNewsletterPost(newsletterRequest(), {
      env: VALID_ENVIRONMENT,
      fetch: (async (_input, init) => {
        call += 1;
        if (call === 1) {
          return Response.json({ success: true, action: 'newsletter_signup', hostname: 'localhost' });
        }
        return {
          ok: true,
          status: 200,
          json: () => new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => {
              aborted = true;
              reject(new Error('aborted'));
            }, { once: true });
          }),
        } as Response;
      }) as typeof fetch,
      serverDeadlineMs: 5,
    });
    assert.equal(response.status, 503);
    assert.equal(aborted, true);
  } finally {
    console.error = originalError;
  }
});

test('one total deadline signal covers Siteverify and Mailchimp', async () => {
  const signals: Array<AbortSignal | null | undefined> = [];
  let call = 0;
  const response = await handleNewsletterPost(newsletterRequest(), {
    env: VALID_ENVIRONMENT,
    fetch: (async (_input, init) => {
      call += 1;
      signals.push(init?.signal);
      if (call === 1) {
        return Response.json({ success: true, action: 'newsletter_signup', hostname: 'localhost' });
      }
      return Response.json({ id: 'member-id' });
    }) as typeof fetch,
  });

  assert.equal(response.status, 200);
  assert.equal(signals.length, 2);
  assert.ok(signals[0] instanceof AbortSignal);
  assert.equal(signals[1], signals[0]);
});

test('omits visitor IP and sends normalized pending Mailchimp payload only after Turnstile', async () => {
  const calls: Array<{ url: string; init?: RequestInit }> = [];
  const response = await handleNewsletterPost(newsletterRequest(), {
    env: VALID_ENVIRONMENT,
    fetch: (async (input, init) => {
      const url = input.toString();
      calls.push({ url, init });
      if (url.includes('/siteverify')) {
        return Response.json({ success: true, action: 'newsletter_signup', hostname: 'localhost' });
      }
      return Response.json({ id: 'member-id' });
    }) as typeof fetch,
  });

  assert.equal(response.status, 200);
  assert.equal(calls.length, 2);
  const verificationBody = calls[0].init?.body as URLSearchParams;
  assert.equal(verificationBody.get('response'), 'valid-test-token');
  assert.equal(verificationBody.has('remoteip'), false);
  assert.deepEqual(JSON.parse(calls[1].init?.body as string), {
    email_address: 'faculty.member@example.edu',
    status: 'pending',
    tags: ['Innovation Pulse', 'Website Signup'],
    merge_fields: { FNAME: 'José Luis', LNAME: 'O’Neil' },
  });
});

test('Member Exists is indistinguishable from a new pending signup and never updates a contact', async () => {
  async function resultFor(mailchimpResponse: Response) {
    const methods: string[] = [];
    let call = 0;
    const response = await handleNewsletterPost(newsletterRequest(), {
      env: VALID_ENVIRONMENT,
      fetch: (async (_input, init) => {
        call += 1;
        methods.push(init?.method || 'GET');
        if (call === 1) {
          return Response.json({ success: true, action: 'newsletter_signup', hostname: 'localhost' });
        }
        return mailchimpResponse;
      }) as typeof fetch,
    });
    return { status: response.status, body: await responseBody(response), methods };
  }

  const pending = await resultFor(Response.json({ id: 'new-member' }));
  const existing = await resultFor(Response.json({ title: 'Member Exists' }, { status: 400 }));
  assert.deepEqual(existing, pending);
  assert.deepEqual(existing.methods, ['POST', 'POST']);
});

test('operational errors do not log submitted PII or expose Mailchimp details', async () => {
  const logs: string[] = [];
  const originalError = console.error;
  console.error = (...values: unknown[]) => logs.push(values.map(String).join(' '));

  try {
    let call = 0;
    const response = await handleNewsletterPost(newsletterRequest(), {
      env: VALID_ENVIRONMENT,
      fetch: (async () => {
        call += 1;
        if (call === 1) {
          return Response.json({ success: true, action: 'newsletter_signup', hostname: 'localhost' });
        }
        return Response.json(
          { title: 'Other Error', detail: 'Failure for faculty.member@example.edu' },
          { status: 500 },
        );
      }) as typeof fetch,
    });
    assert.equal(response.status, 502);
    assert.equal(JSON.stringify(await responseBody(response)).includes('faculty.member@example.edu'), false);
    assert.equal(logs.join('\n').includes('faculty.member@example.edu'), false);
  } finally {
    console.error = originalError;
  }
});

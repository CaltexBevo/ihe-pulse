import 'server-only';
// Node/server entry points only. CLI uses the repository's server-only-aware loader.
export type MailchimpEnvironment = { [key: string]: string | undefined; MAILCHIMP_API_KEY?: string; MAILCHIMP_SERVER_PREFIX?: string; MAILCHIMP_AUDIENCE_ID?: string };
export class MailchimpMarketing {
  readonly listId: string;
  private readonly base: string;
  private readonly key: string;
  private readonly transport: typeof fetch;
  constructor(env: MailchimpEnvironment, transport: typeof fetch = fetch) {
    if (!env.MAILCHIMP_API_KEY?.trim() || !/^us\d+$/.test(env.MAILCHIMP_SERVER_PREFIX || '') || !/^[a-z0-9]+$/i.test(env.MAILCHIMP_AUDIENCE_ID || '')) throw new Error('Mailchimp configuration unavailable.');
    this.base = `https://${env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`;
    this.listId = env.MAILCHIMP_AUDIENCE_ID!;
    this.key = env.MAILCHIMP_API_KEY;
    this.transport = transport;
  }
  async request(path: string, method = 'GET', body?: unknown): Promise<Record<string, unknown>> {
    if (!path.startsWith('/') || path.includes('://') || path.includes('..')) throw new Error('Invalid API path.');
    const response = await this.transport(`${this.base}${path}`, {
      method, headers: { Authorization: `apikey ${this.key}`, 'Content-Type': 'application/json' },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }), cache: 'no-store', signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`Mailchimp operation failed (${response.status}).`);
    if (response.status === 204) return {};
    const value = await response.json();
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid Mailchimp response.');
    return value;
  }
  async all(path: string, key: string): Promise<Record<string, unknown>[]> {
    const result: Record<string, unknown>[] = [];
    for (let offset = 0; offset < 100_000; offset += 1000) {
      const page = await this.request(`${path}${path.includes('?') ? '&' : '?'}count=1000&offset=${offset}`);
      const items = page[key];
      if (!Array.isArray(items) || !Number.isSafeInteger(page.total_items) || (page.total_items as number) < 0) throw new Error('Incomplete Mailchimp pagination.');
      result.push(...items);
      if (result.length >= (page.total_items as number)) return result;
      if (items.length < 1000) throw new Error('Incomplete Mailchimp pagination.');
    }
    throw new Error('Mailchimp pagination limit exceeded.');
  }
}

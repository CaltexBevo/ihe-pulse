import { createHash } from 'node:crypto';
import { isIP } from 'node:net';

// Server-only comparison. Addresses never enter analytics, responses or logs.
export function normalizeAnalyticsIp(input: string): string | null {
  const value = input.trim().replace(/^\[([^\]]+)\]$/, '$1');
  const family = isIP(value);
  if (family === 4) return value;
  if (family !== 6) return null;
  let canonical: string;
  try {
    canonical = new URL(`http://[${value}]/`).hostname.slice(1, -1).toLowerCase();
  } catch {
    return null;
  }
  const mapped = canonical.match(/^::ffff:([a-f0-9]+):([a-f0-9]+)$/);
  if (mapped) {
    const high = parseInt(mapped[1], 16);
    const low = parseInt(mapped[2], 16);
    return [high >> 8, high & 255, low >> 8, low & 255].join('.');
  }
  return canonical;
}

export function analyticsIpHash(input: string): string | null {
  const ip = normalizeAnalyticsIp(input);
  return ip ? createHash('sha256').update(`ihe-internal-analytics:v1:${ip}`).digest('hex') : null;
}

export function isInternalAnalyticsRequest(headers: Headers, configuredHashes: string | undefined): boolean {
  const hashes = new Set((configuredHashes ?? '').split(/[\s,]+/).filter(value => /^[a-f0-9]{64}$/.test(value)));
  if (!hashes.size) return false;
  // Vercel supplies this header itself, before any application proxy rewrite.
  // Do not accept a query parameter, cookie or client-supplied address override.
  const value = headers.get('x-vercel-forwarded-for');
  if (!value) return true;
  const hash = analyticsIpHash(value);
  return hash === null || hashes.has(hash);
}

export function internalAnalyticsContextResponse(headers: Headers, configuredHashes: string | undefined): Response {
  return Response.json(
    { excluded: isInternalAnalyticsRequest(headers, configuredHashes) },
    { headers: {
      'Cache-Control': 'private, no-store, max-age=0',
      'CDN-Cache-Control': 'no-store',
      'Vercel-CDN-Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    } },
  );
}

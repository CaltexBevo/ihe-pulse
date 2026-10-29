import assert from 'node:assert/strict';
import test from 'node:test';
import { analyticsIpHash, internalAnalyticsContextResponse, isInternalAnalyticsRequest, normalizeAnalyticsIp } from '../lib/internalAnalytics.ts';

test('matches exact internal IPv4 and equivalent IPv6 forms without storing addresses', () => {
  const v4 = analyticsIpHash('192.0.2.12')!;
  const v6 = analyticsIpHash('2001:db8::12')!;
  const configured = `${v4},${v6}`;
  assert.equal(isInternalAnalyticsRequest(new Headers({'x-vercel-forwarded-for':'192.0.2.12'}), configured), true);
  assert.equal(isInternalAnalyticsRequest(new Headers({'x-vercel-forwarded-for':'::ffff:192.0.2.12'}), configured), true);
  assert.equal(isInternalAnalyticsRequest(new Headers({'x-vercel-forwarded-for':'2001:0DB8:0:0:0:0:0:0012'}), configured), true);
  assert.equal(isInternalAnalyticsRequest(new Headers({'x-vercel-forwarded-for':'192.0.2.13'}), configured), false);
  assert.equal(isInternalAnalyticsRequest(new Headers({'x-vercel-forwarded-for':'2001:db8::13'}), configured), false);
  assert.equal(v4.length, 64);
  assert.equal(normalizeAnalyticsIp('not an address'), null);
});

test('uses only the hosting-supplied address and suppresses unknown context when configured', () => {
  const configured = analyticsIpHash('192.0.2.12')!;
  assert.equal(isInternalAnalyticsRequest(new Headers({'x-vercel-forwarded-for':'192.0.2.13','x-forwarded-for':'192.0.2.12','x-real-ip':'192.0.2.12'}), configured), false);
  assert.equal(isInternalAnalyticsRequest(new Headers({'x-forwarded-for':'192.0.2.13'}), configured), true);
  assert.equal(isInternalAnalyticsRequest(new Headers({'x-vercel-forwarded-for':'192.0.2.12, 192.0.2.13'}), configured), true);
  assert.equal(isInternalAnalyticsRequest(new Headers(), undefined), false);
});

test('returns only a boolean context and forbids shared/browser caching', async () => {
  const ip = '192.0.2.12';
  const configured = analyticsIpHash(ip)!;
  const response = internalAnalyticsContextResponse(new Headers({'x-vercel-forwarded-for':ip}), configured);
  const body = await response.text();
  assert.deepEqual(JSON.parse(body), {excluded:true});
  assert.equal(body.includes(ip), false);
  assert.equal(body.includes(configured), false);
  assert.match(response.headers.get('cache-control')!, /private, no-store/);
  assert.equal(response.headers.get('vercel-cdn-cache-control'), 'no-store');
  assert.deepEqual(await internalAnalyticsContextResponse(new Headers({'x-vercel-forwarded-for':'192.0.2.13'}), configured).json(), {excluded:false});
});

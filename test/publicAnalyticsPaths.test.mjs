import assert from 'node:assert/strict';
import test from 'node:test';
import { register } from 'node:module';

register('./innovationGrantsTestLoader.mjs', import.meta.url);

const { redactAnalyticsEventUrl } = await import('../lib/engagementTracking.ts');
const { getPublicAnalyticsPagePaths } = await import('../lib/publicAnalyticsPaths.ts');

const ANALYTICS_ORIGIN = 'https://www.innovatinghighered.com';

test('automatic pageviews include exactly the two public Grant Portal routes', () => {
  const paths = new Set(getPublicAnalyticsPagePaths());

  assert.equal(paths.has('/innovation-grants'), true);
  assert.equal(paths.has('/innovation-grants/directory'), true);
  assert.equal(paths.has('/innovation-grants/private'), false);
});

test('Grant Portal pageviews strip queries and fragments without admitting unknown paths', () => {
  const paths = new Set(getPublicAnalyticsPagePaths());

  for (const path of ['/innovation-grants', '/innovation-grants/directory']) {
    assert.deepEqual(
      redactAnalyticsEventUrl(
        {
          type: 'pageview',
          url: `${ANALYTICS_ORIGIN}${path}?query=private-value#private-fragment`,
        },
        paths,
      ),
      {
        type: 'pageview',
        url: `${ANALYTICS_ORIGIN}${path}`,
      },
    );
  }

  for (const url of [
    `${ANALYTICS_ORIGIN}/innovation-grants/private?query=private-value`,
    `${ANALYTICS_ORIGIN}/innovation-grants/directory/private-id`,
    'https://attacker.example/innovation-grants',
  ]) {
    assert.equal(redactAnalyticsEventUrl({ type: 'pageview', url }, paths), null);
  }
});

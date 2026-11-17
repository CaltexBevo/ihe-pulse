import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import nextConfig from '../next.config.ts';

const require = createRequire(import.meta.url);
const { unstable_getResponseFromNextConfig } = require('next/experimental/testing/server');

async function headersFor(path) {
  const response = await unstable_getResponseFromNextConfig({ url: 'https://example.test' + path, nextConfig });
  return response.headers;
}

test('production app and tool URLs receive their own enforced policy', async () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  try {
    for (const path of ['/', '/innovation-grants', '/innovation-grants/directory', '/cor-checker']) {
      const policy = (await headersFor(path)).get('Content-Security-Policy');
      assert.match(policy, /script-src-attr 'none'/);
      assert.match(policy, /frame-src .*https:\/\/www.podbean.com/);
      assert.doesNotMatch(policy, /unsafe-eval|cdnjs.cloudflare.com/);
    }
    for (const path of ['/Does-It-Fit', '/Does-It-Fit.html', '/AVCFT-Redesign', '/Normas-AVC-Document-Navigator-4000', '/QTI-quiz-builder.html', '/cor-checker.html']) {
      const headers = await headersFor(path);
      const policy = headers.get('Content-Security-Policy');
      assert.match(policy, /script-src 'self' 'sha256-/);
      assert.doesNotMatch(policy, /unsafe-eval|challenges.cloudflare.com/);
      if (!path.endsWith('.html') || path === '/Does-It-Fit.html') assert.equal(headers.get('X-Robots-Tag'), 'noindex, nofollow');
    }
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});

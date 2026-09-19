import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import {
  AI_DIRECTORY_SCHEMA_VERSION,
  AI_DIRECTORY_TASKS,
  compareAiDirectoryReviewDates,
  formatAiDirectoryDate,
  getAiDirectoryReviewLabel,
  validateAiDirectoryData,
} from '../../lib/data/ai-directory-schema.ts';
import {
  canonicalDirectoryFixture,
  currentReviewFixture,
  negativeFixtureNames,
  pricingSourceFixture,
  sourceFixture,
} from './fixtures.ts';

function invalid(data: unknown, expected: string, asOfDate = '2026-09-05') {
  const result = validateAiDirectoryData(data, { asOfDate });
  assert.equal(result.valid, false);
  assert.ok(
    result.issues.some((issue) => `${issue.path} ${issue.message}`.includes(expected)),
    `Expected an issue containing ${expected}, got ${JSON.stringify(result.issues)}`,
  );
}

test('malformed pricing returns issues instead of throwing', () => {
  const data = canonicalDirectoryFixture();
  Object.assign(data.tools[0], { pricing: null });
  invalid(data, 'pricing');
});

test('all rendered review and pricing prose rejects prohibited assurances', () => {
  for (const field of ['pricing', 'unresolvedClaims', 'editorialRationale']) {
    const data = canonicalDirectoryFixture();
    const assurance = 'Guaranteed secure and FERPA compliant.';
    if (field === 'pricing') data.tools[0].pricing.details = assurance;
    else if (field === 'unresolvedClaims') data.tools[0].review.unresolvedClaims = [assurance];
    else data.tools[0].review.editorialRationale = assurance;
    invalid(data, 'prohibited unqualified assurance');
  }
});

test('canonical migration is schema v2, preserves all 44 slugs, and is explicitly stale', () => {
  const data = canonicalDirectoryFixture();
  const result = validateAiDirectoryData(data, { asOfDate: '2026-09-05' });

  assert.equal(result.valid, true, JSON.stringify(result.issues));
  assert.equal(data.schemaVersion, AI_DIRECTORY_SCHEMA_VERSION);
  assert.equal(data.directoryReview.status, 'stale');
  assert.equal(data.directoryReview.fullReviewCompletedAt, null);
  assert.equal(data.directoryReview.visibleToolCount, 44);
  assert.equal(data.tools.length, 44);
  assert.equal(new Set(data.tools.map((tool) => tool.slug)).size, 44);
  assert.equal(data.sources.length, 0);
  assert.ok(data.tools.every((tool) => tool.review.status === 'blocked'));
  assert.ok(data.tools.every((tool) => tool.review.reviewedAt === null));
  assert.ok(data.tools.every((tool) => tool.badge === null));
  assert.ok(data.tools.every((tool) => !('accent' in tool) && !('verified' in tool) && !('lastUpdated' in tool)));
  assert.deepEqual([...new Set(data.tools.flatMap((tool) => tool.tasks))].sort(), [...AI_DIRECTORY_TASKS].sort());
});

test('review labels never call stale or blocked records verified', () => {
  assert.equal(getAiDirectoryReviewLabel({ status: 'blocked', reviewedAt: null }), 'Review pending');
  assert.equal(getAiDirectoryReviewLabel({ status: 'limited', reviewedAt: null }), 'Limited review');
  assert.equal(getAiDirectoryReviewLabel({ status: 'retire-candidate', reviewedAt: null }), 'Retire candidate');
  assert.equal(getAiDirectoryReviewLabel({ status: 'current', reviewedAt: '2026-09-05' }), 'Reviewed Sep 5, 2026');
  assert.equal(formatAiDirectoryDate('2026-02-24'), 'Feb 24, 2026');
});

test('recently reviewed sorting puts dated reviews first and pending records last', () => {
  const data = canonicalDirectoryFixture();
  const [pending, reviewed] = [data.tools[0], data.tools[1]];
  pending.review.reviewedAt = null;
  reviewed.review.reviewedAt = '2026-09-05';
  assert.equal(compareAiDirectoryReviewDates(pending, reviewed) > 0, true);
  assert.equal(compareAiDirectoryReviewDates(reviewed, pending) < 0, true);
});

test('a current record is accepted only when its official pricing evidence is bound', () => {
  const data = canonicalDirectoryFixture();
  data.sources = [
    sourceFixture(),
    pricingSourceFixture(),
    sourceFixture({
      id: 'chatgpt-policy-2026-09-05',
      title: 'ChatGPT privacy and security policy',
      url: 'https://openai.com/policies/privacy-policy/',
      sourceType: 'official-policy',
      claimTypes: ['privacy', 'security'],
    }),
  ];
  data.tools[0].review = currentReviewFixture({
    evidenceIds: data.sources.map((source) => source.id),
    claimCoverage: ['availability', 'features', 'pricing', 'privacy', 'security'],
  });
  data.tools[0].pricing.checkedAt = '2026-09-05';
  const result = validateAiDirectoryData(data, { asOfDate: '2026-09-05' });
  assert.equal(result.valid, true, JSON.stringify(result.issues));
});

test('runtime validation matches maintenance semantics for current review evidence and chronology', () => {
  const currentData = () => {
    const data = canonicalDirectoryFixture();
    data.sources = [
      sourceFixture(),
      pricingSourceFixture(),
      sourceFixture({
        id: 'chatgpt-policy-2026-09-05',
        title: 'ChatGPT privacy and security policy',
        url: 'https://openai.com/policies/privacy-policy/',
        sourceType: 'official-policy',
        claimTypes: ['privacy', 'security'],
      }),
    ];
    data.tools[0].review = currentReviewFixture({
      evidenceIds: data.sources.map((source) => source.id),
      claimCoverage: ['availability', 'features', 'pricing', 'privacy', 'security'],
    });
    data.tools[0].pricing.checkedAt = '2026-09-05';
    return data;
  };

  {
    const data = currentData();
    data.tools[0].review.claimCoverage = ['pricing', 'privacy', 'security'];
    invalid(data, 'current reviews require availability and features coverage');
  }
  {
    const data = currentData();
    data.sources[0].accessStatus = 'blocked';
    invalid(data, 'current reviews require only successful official-source evidence');
  }
  {
    const data = currentData();
    data.sources[0].checkedAt = '2026-09-04';
    invalid(data, 'must match every source check supporting a current review');
  }
  {
    const data = currentData();
    data.tools[0].review.reviewedAt = '2026-02-23';
    data.sources.forEach((source) => { source.checkedAt = '2026-02-23'; });
    invalid(data, 'must be on or after contentUpdatedAt for a current review');
  }
  {
    const data = currentData();
    data.sources[1].sourceType = 'official-product';
    invalid(data, 'require confirmed official pricing evidence');
  }
  {
    const data = currentData();
    data.tools[0].review.claimCoverage = data.tools[0].review.claimCoverage.filter((claim) => claim !== 'privacy');
    invalid(data, 'privacy prose requires matching claim coverage');
  }
  {
    const data = currentData();
    data.tools[0].description += ' Fully HIPAA compliant.';
    invalid(data, 'prohibited unqualified assurance or compliance claim');
  }
  {
    const data = currentData();
    data.directoryReview.status = 'current';
    data.directoryReview.fullReviewCompletedAt = '2026-01-01';
    invalid(data, 'must be on or after directory contentUpdatedAt');
    invalid(data, 'must match the directory fullReviewCompletedAt date');
  }
});

test('negative fixtures fail closed for every required blocker', () => {
  assert.deepEqual(negativeFixtureNames.length, 11);

  {
    const data = canonicalDirectoryFixture();
    data.tools[1].slug = data.tools[0].slug;
    invalid(data, 'must be unique');
  }
  {
    const data = canonicalDirectoryFixture();
    data.tools[0].review = currentReviewFixture();
    invalid(data, 'must reference a source in sources');
  }
  {
    const data = canonicalDirectoryFixture();
    data.tools[0].review.contentUpdatedAt = '2099-01-01';
    invalid(data, 'must not be later than validation date');
  }
  {
    const data = canonicalDirectoryFixture();
    data.tools[0].review.contentUpdatedAt = '2026-09-05';
    invalid(data, 'cannot advance beyond directory contentUpdatedAt');
  }
  {
    const data = canonicalDirectoryFixture();
    data.tools[0].category = 'Unsupported category' as never;
    invalid(data, 'must match one non-All directory category');
  }
  {
    const data = canonicalDirectoryFixture();
    data.tools[0].platformUrl = 'http://example.com';
    invalid(data, 'must be an HTTPS URL');
  }
  {
    const data = canonicalDirectoryFixture();
    data.sources = [sourceFixture({ toolSlug: 'claude' })];
    data.tools[0].review = { ...currentReviewFixture(), evidenceIds: [data.sources[0].id] };
    invalid(data, 'source must belong to the same tool slug');
  }
  {
    const data = canonicalDirectoryFixture();
    data.tools[0].strengths = null as never;
    invalid(data, 'must be an array');
  }
  {
    const data = canonicalDirectoryFixture();
    data.sources = [sourceFixture()];
    data.tools[0].review = { ...currentReviewFixture(), claimCoverage: ['availability', 'features'] };
    invalid(data, 'current priced tools require pricing coverage');
  }
  {
    const data = canonicalDirectoryFixture();
    data.tools.pop();
    invalid(data, 'must equal tools.length');
  }
  {
    const data = canonicalDirectoryFixture();
    (data.tools[0] as unknown as Record<string, unknown>).verified = true;
    invalid(data, 'unknown field is not allowed');
  }
});

test('directory pages use canonical JSON, expose all task filters, and remove misleading labels', () => {
  const listing = fs.readFileSync(path.join(process.cwd(), 'app/ai-directory/page.tsx'), 'utf8');
  const detail = fs.readFileSync(path.join(process.cwd(), 'app/ai-directory/[slug]/page.tsx'), 'utf8');
  assert.match(listing, /fetch\('\/data\/ai-apps\.json'\)/);
  assert.match(listing, /Assessment/);
  assert.match(listing, /Note-Taking/);
  assert.match(listing, /Recently Reviewed/);
  assert.doesNotMatch(listing, /Recently Added/);
  assert.doesNotMatch(listing, /trending/);
  assert.doesNotMatch(listing, /\bVerified\b/);
  assert.doesNotMatch(detail, /\bVerified\b/);
  assert.doesNotMatch(detail, /lastUpdated/);
});

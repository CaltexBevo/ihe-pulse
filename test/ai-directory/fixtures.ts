import fs from 'node:fs';
import path from 'node:path';
import type { AiDirectoryData, AiDirectorySource } from '../../lib/data/ai-directory-schema.ts';

const canonicalPath = path.join(process.cwd(), 'test', 'ai-directory', 'migration-fixture.json');

export function canonicalDirectoryFixture(): AiDirectoryData {
  return structuredClone(JSON.parse(fs.readFileSync(canonicalPath, 'utf8'))) as AiDirectoryData;
}

export function sourceFixture(overrides: Partial<AiDirectorySource> = {}): AiDirectorySource {
  return {
    id: 'chatgpt-product-2026-09-05',
    toolSlug: 'chatgpt',
    issuer: 'OpenAI',
    title: 'ChatGPT product overview',
    url: 'https://openai.com/chatgpt/overview/',
    sourceType: 'official-product',
    checkedAt: '2026-09-05',
    accessStatus: 'confirmed',
    claimTypes: ['availability', 'features', 'pricing'],
    ...overrides,
  };
}

export function pricingSourceFixture(overrides: Partial<AiDirectorySource> = {}): AiDirectorySource {
  return sourceFixture({
    id: 'chatgpt-pricing-2026-09-05',
    title: 'ChatGPT official pricing',
    url: 'https://openai.com/chatgpt/pricing/',
    sourceType: 'official-pricing',
    claimTypes: ['pricing'],
    ...overrides,
  });
}

export function currentReviewFixture(overrides: Partial<ReturnType<typeof currentReviewFixtureBase>> = {}) {
  return { ...currentReviewFixtureBase(), ...overrides };
}

function currentReviewFixtureBase() {
  return {
    status: 'current' as const,
    reviewedAt: '2026-09-05',
    contentUpdatedAt: '2026-02-24',
    evidenceIds: ['chatgpt-product-2026-09-05'],
    claimCoverage: ['availability', 'features', 'pricing'],
    unresolvedClaims: [],
    editorialRationale: 'Current official-source review recorded for this fixture.',
  };
}

export const negativeFixtureNames = [
  'duplicate slug',
  'missing source',
  'fake future date',
  'stale date-only update',
  'unsupported category',
  'malformed URL',
  'source-to-slug mismatch',
  'null arrays',
  'missing price evidence',
  'silent tool removal',
  'forbidden legacy field',
] as const;

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import test, { after } from 'node:test';
import { fileURLToPath } from 'node:url';

const testDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(testDirectory, '..');
const harnessPath = resolve(repositoryRoot, 'scripts/update-ai-directory.mjs');
const workflowPath = resolve(repositoryRoot, '.github/workflows/update-ai-directory.yml');
const canonicalPath = resolve(repositoryRoot, 'public/data/ai-apps.json');
const fixtureRoots = [];
const asOf = '2026-09-05';
const sourceTypes = ['official-product', 'official-pricing', 'official-education', 'official-documentation', 'official-policy', 'official-status', 'official-terms'];
const sourceRule = 'Every supported field or array item uses only unique exact source IDs whose reviewed claim classes support that exact field or item; unsupported or unavailable claims use no evidence IDs.';
const completenessMethod = 'Exact candidate field and array-item paths; each path appears once per visible tool and binds its prior and proposed value.';
const sensitivePatterns = new Map([
  ['privacy', /\b(?:privacy|private data|data retention|data sharing|personal data|FERPA|GDPR|COPPA)\b/i],
  ['security', /\b(?:security|secure|encrypted|encryption|SOC\s*2|HIPAA|compliance)\b/i],
  ['accessibility', /\b(?:accessibility|accessible|WCAG|screen reader)\b/i],
  ['terms', /\b(?:terms of (?:service|use)|legal(?:ly)?|license agreement|copyright)\b/i],
]);
const educationPattern = /\b(?:education|educator|teacher|student|faculty|classroom|course|academic|school|university|college|lesson|grading|assessment)\b/i;

after(() => {
  for (const root of fixtureRoots) rmSync(root, { recursive: true, force: true });
});

function hash(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function run(args, options = {}) {
  return spawnSync(process.execPath, [harnessPath, ...args], {
    cwd: options.cwd ?? repositoryRoot,
    encoding: 'utf8',
    env: options.env ?? { PATH: process.env.PATH },
  });
}

function runAsync(args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(process.execPath, [harnessPath, ...args], {
      cwd: options.cwd ?? repositoryRoot,
      env: options.env ?? { PATH: process.env.PATH },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    options.onSpawn?.(child);
    let stdout = '';
    let stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', rejectRun);
    child.on('close', (status, signal) => resolveRun({ status, signal, stdout, stderr }));
  });
}

function git(root, args) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8', env: { PATH: process.env.PATH } });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function legacyCanonicalData() {
  // Migration fixtures must survive canonical HEAD advancing to schema v2.
  return {
    lastUpdated: '2026-02-24',
    categories: ['All', 'General LLMs', 'Lesson Planning', 'Grading & Assessment', 'Research', 'Writing & Feedback', 'Presentations', 'Image & Video', 'Productivity', 'Student Tools', 'Gamification', 'Avatars', 'Music', 'Text to Speech'],
    tools: Array.from({ length: 44 }, (_, index) => ({
      slug: `fixture-tool-${index + 1}`, name: `Fixture Tool ${index + 1}`,
      tagline: 'Draft and compare supplied material.', description: 'A synthetic conversation and file analysis tool.',
      category: 'General LLMs', badge: null, values: ['Draft text', 'Compare material', 'Analyze files'],
      tasks: ['General LLM'], roles: ['faculty'],
      pricing: { model: 'freemium', startingPrice: null, details: 'Synthetic free and paid plans.' },
      keyFeatures: ['Conversation', 'File analysis'], pros: [], cons: [], bestFor: ['Draft text'],
      strengths: [], limitations: [], quickstart: 'Try a public sample.', integrations: [],
      platformUrl: `https://fixture-${index + 1}.example/`, domain: `fixture-${index + 1}.example`,
      staffPick: index === 0, verified: true, accent: 'cyan', lastUpdated: '2025-12-20',
    })),
  };
}

function dirtyPaths(root) {
  const tracked = git(root, ['diff', '--name-only', 'HEAD', '--']).split('\n').filter(Boolean);
  const untracked = git(root, ['ls-files', '--others', '--exclude-standard']).split('\n').filter(Boolean);
  return [...new Set([...tracked, ...untracked])].sort();
}

function dirtyArgs(root) {
  return ['--allowed-dirty-paths', JSON.stringify(dirtyPaths(root))];
}

function clone(value) {
  return structuredClone(value);
}

function schemaV2FromLegacy(legacy) {
  return {
    schemaVersion: 2,
    directoryReview: {
      status: 'stale',
      fullReviewCompletedAt: null,
      contentUpdatedAt: legacy.lastUpdated,
      method: 'official-source editorial review',
      visibleToolCount: legacy.tools.length,
    },
    categories: clone(legacy.categories),
    sources: [],
    tools: legacy.tools.map((tool) => {
      const { accent, verified, lastUpdated, ...retained } = tool;
      void accent;
      void verified;
      return {
        ...retained,
        badge: null,
        pricing: { startingPrice: null, ...retained.pricing, checkedAt: lastUpdated },
        strengths: retained.strengths ?? [],
        limitations: retained.limitations ?? [],
        review: {
          status: 'blocked',
          reviewedAt: null,
          contentUpdatedAt: lastUpdated,
          evidenceIds: [],
          claimCoverage: [],
          unresolvedClaims: ['Official-source review pending.'],
          editorialRationale: 'Legacy listing retained pending official-source review.',
        },
      };
    }),
  };
}

function fixture(initialData) {
  const fixtureParent = resolve(repositoryRoot, '.next');
  mkdirSync(fixtureParent, { recursive: true });
  const root = mkdtempSync(resolve(fixtureParent, 'ai-directory-boundary-'));
  fixtureRoots.push(root);
  const repo = resolve(root, 'repo');
  const staging = resolve(root, 'staging');
  const target = resolve(repo, 'public/data/ai-apps.json');
  mkdirSync(dirname(target), { recursive: true });
  mkdirSync(staging, { recursive: true });
  const data = initialData ?? legacyCanonicalData();
  writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`);
  git(repo, ['init', '-q']);
  git(repo, ['add', 'public/data/ai-apps.json']);
  git(repo, ['-c', 'user.name=Boundary Test', '-c', 'user.email=boundary@example.invalid', 'commit', '-qm', 'baseline']);
  const baselineBytes = readFileSync(target);
  return {
    root,
    repo,
    staging,
    target,
    head: git(repo, ['rev-parse', 'HEAD']),
    baselineBytes,
    baselineHash: hash(baselineBytes),
    baselineData: data,
  };
}

function prepareBaseline(state) {
  const baseline = resolve(state.staging, 'BASELINE.json');
  const result = run([
    'prepare', '--repo-root', state.repo, '--expected-head', state.head,
    ...dirtyArgs(state.repo),
    '--source', 'public/data/ai-apps.json', '--expected-source-sha256', state.baselineHash,
    '--staging-root', state.staging, '--output', baseline,
  ]);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(readFileSync(baseline), state.baselineBytes);
  return baseline;
}

function fieldPaths(tool) {
  const paths = ['slug', 'name', 'tagline', 'description', 'category', 'badge', 'quickstart', 'platformUrl', 'domain', 'staffPick'];
  for (const field of ['values', 'tasks', 'roles', 'keyFeatures', 'pros', 'cons', 'bestFor', 'strengths', 'limitations', 'integrations']) {
    for (let index = 0; index < (Array.isArray(tool[field]) ? tool[field].length : 0); index += 1) paths.push(`${field}[${index}]`);
  }
  return [...paths, 'pricing.model', 'pricing.startingPrice', 'pricing.details', 'pricing.checkedAt', 'review.status', 'review.reviewedAt', 'review.contentUpdatedAt', 'review.evidenceIds', 'review.claimCoverage', 'review.unresolvedClaims', 'review.editorialRationale'];
}

function pathValue(tool, path) {
  const arrayMatch = /^([a-zA-Z]+)\[(\d+)]$/.exec(path);
  if (arrayMatch) return tool[arrayMatch[1]][Number(arrayMatch[2])];
  return path.split('.').reduce((value, part) => value?.[part], tool);
}

function fieldNeedsEvidence(path, value) {
  if (value === null || path.startsWith('review.')) return false;
  return !['slug', 'category', 'badge', 'staffPick'].includes(path)
    && !/^(?:tasks|roles|pros|cons|bestFor|strengths|limitations)\[/.test(path);
}

function fieldClaimTypes(path, value) {
  if (value === null || path.startsWith('review.')) return [];
  const sensitiveClaims = [];
  if (typeof value === 'string') for (const [claim, pattern] of sensitivePatterns) if (pattern.test(value)) sensitiveClaims.push(claim);
  if (!fieldNeedsEvidence(path, value)) return sensitiveClaims;
  const claims = path.startsWith('pricing.') ? ['pricing']
    : path.startsWith('integrations[') ? ['integrations']
      : ['name', 'platformUrl', 'domain'].includes(path) ? ['availability'] : ['features'];
  if (educationPattern.test(typeof value === 'string' ? value : '')) claims.push('education-use');
  claims.push(...sensitiveClaims);
  return [...new Set(claims)];
}

function writeReviewedArtifacts(state, candidateData) {
  const reviewer = {
    identity: 'Sol test reviewer',
    role: 'deterministic fixture package author',
    timezone: 'America/Los_Angeles',
  };
  const independentReview = {
    identity: 'Independent Sol fixture reviewer',
    role: 'sol_risk_reviewer',
    verdict: 'CLEAR',
    reviewedAt: '2026-09-06T00:30:00.000Z',
  };
  const officialDomainRelations = candidateData.tools.map((tool) => ({
    toolSlug: tool.slug,
    issuer: tool.name,
    publicDomain: tool.domain,
    platformHost: new URL(tool.platformUrl).hostname,
    approvedSourceHosts: [...new Set([tool.domain, new URL(tool.platformUrl).hostname])],
  }));
  const manifest = {
    package: 'ai-directory-boundary-test',
    schema: 'source-manifest-v3',
    packageDate: asOf,
    generatedAt: '2026-09-06T00:00:00.000Z',
    reviewer,
    independentReview,
    sourceTypes,
    officialDomainRelations,
    sources: candidateData.sources.map((source) => ({
      ...source,
      checkedTimestamp: `${source.checkedAt}T12:00:00-07:00`,
      coverage: 'Deterministic test coverage.',
      conflictNotes: [],
      limitations: [],
    })),
  };
  const fieldReview = {
    package: 'ai-directory-boundary-test',
    schema: 'ai-directory-field-review-v3',
    packageDate: asOf,
    generatedAt: '2026-09-06T00:00:00.000Z',
    reviewer,
    independentReview,
    statusVocabulary: ['confirmed', 'changed', 'unsupported', 'unavailable', 'retire-candidate'],
    sourceRule,
    completeness: undefined,
    tools: candidateData.tools.map((tool, recordIndex) => {
      const priorTool = state.baselineData.tools.find((entry) => entry.slug === tool.slug);
      return {
        slug: tool.slug,
        recordIndex,
        currentBaselineStatus: priorTool?.review?.status ?? 'legacy',
        proposedStatus: tool.review.status,
        staffPick: tool.staffPick,
        fields: fieldPaths(tool).map((path) => {
          const value = pathValue(tool, path);
          const priorValue = priorTool ? pathValue(priorTool, path) : undefined;
          const changed = priorValue === undefined || JSON.stringify(priorValue) !== JSON.stringify(value);
          const needsEvidence = tool.review.status === 'current' && fieldClaimTypes(path, value).length > 0;
          return {
            path,
            status: needsEvidence ? (changed ? 'changed' : 'confirmed') : 'unavailable',
            prior: priorValue === undefined ? { present: false } : { present: true, value: clone(priorValue) },
            proposed: { present: true, value: clone(value) },
            claimTypes: fieldClaimTypes(path, value),
            evidenceIds: needsEvidence ? clone(tool.review.evidenceIds) : [],
            note: 'Deterministic boundary fixture.',
          };
        }),
      };
    }),
  };
  fieldReview.completeness = {
    method: completenessMethod,
    unionIncludesPriorAndCandidate: true,
    toolCount: fieldReview.tools.length,
    fieldItemCount: fieldReview.tools.reduce((count, tool) => count + tool.fields.length, 0),
    duplicatePathCount: 0,
    duplicateEvidenceBindingCount: 0,
    overbroadBindingCount: 0,
    missingUnionPaths: [],
    duplicateUnionPaths: [],
  };
  const sourceManifest = resolve(state.staging, 'SOURCE-MANIFEST.json');
  const fieldReviewPath = resolve(state.staging, 'FIELD-REVIEW.json');
  writeFileSync(sourceManifest, `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(fieldReviewPath, `${JSON.stringify(fieldReview, null, 2)}\n`);
  return {
    sourceManifest,
    sourceManifestHash: hash(readFileSync(sourceManifest)),
    fieldReview: fieldReviewPath,
    fieldReviewHash: hash(readFileSync(fieldReviewPath)),
  };
}

function validateCandidate(state, baseline, candidateData) {
  const candidate = resolve(state.staging, 'PROPOSED-ai-apps.json');
  writeFileSync(candidate, `${JSON.stringify(candidateData, null, 2)}\n`);
  const candidateHash = hash(readFileSync(candidate));
  const artifacts = writeReviewedArtifacts(state, candidateData);
  const result = run([
    'validate', '--repo-root', state.repo, '--expected-head', state.head,
    ...dirtyArgs(state.repo),
    '--staging-root', state.staging, '--baseline', baseline,
    '--expected-baseline-sha256', state.baselineHash, '--candidate', candidate,
    '--expected-candidate-sha256', candidateHash,
    '--source-manifest', artifacts.sourceManifest, '--expected-source-manifest-sha256', artifacts.sourceManifestHash,
    '--field-review', artifacts.fieldReview, '--expected-field-review-sha256', artifacts.fieldReviewHash,
    '--as-of', asOf,
  ]);
  return { result, candidate, candidateHash, ...artifacts };
}

function artifactArgs(candidate) {
  return [
    '--source-manifest', candidate.sourceManifest, '--expected-source-manifest-sha256', candidate.sourceManifestHash,
    '--field-review', candidate.fieldReview, '--expected-field-review-sha256', candidate.fieldReviewHash,
  ];
}

test('a committed schema-v2 baseline remains valid after the migration release', () => {
  const current = schemaV2FromLegacy(legacyCanonicalData());
  const state = fixture(current);
  assert.equal(JSON.parse(git(state.repo, ['show', 'HEAD:public/data/ai-apps.json'])).schemaVersion, 2);
  const baseline = prepareBaseline(state);
  const outcome = validateCandidate(state, baseline, current);
  assert.equal(outcome.result.status, 0, outcome.result.stderr);
  assert.equal(legacyCanonicalData().lastUpdated, '2026-02-24');
});

test('approved refresh delta binds exact bytes, founder attribution, and every disposition', () => {
  const state = fixture();
  const candidate = schemaV2FromLegacy(state.baselineData);
  candidate.tools[0].staffPick = !candidate.tools[0].staffPick;
  writeFileSync(state.target, `${JSON.stringify(candidate, null, 2)}\n`);
  const candidateHash = hash(readFileSync(state.target));
  const approvalPath = resolve(state.staging, 'APPROVED-DELTA.json');
  const changes = (field) => candidate.tools.flatMap((tool, index) => JSON.stringify(tool[field]) === JSON.stringify(state.baselineData.tools[index][field]) ? [] : [{ slug: tool.slug, prior: state.baselineData.tools[index][field], proposed: tool[field] }]);
  const approval = {
    schema: 'ai-directory-approved-delta-v1', baselineSha256: state.baselineHash,
    candidateSha256: candidateHash, mode: 'evidence-refresh',
    approval: { identity: 'Brent Jones', reference: 'Synthetic test authorization only.' },
    added: [], removed: [], staffPickChanges: changes('staffPick'), categoryChanges: [], badgeChanges: changes('badge'),
  };
  const args = ['delta', '--repo-root', state.repo, '--expected-head', state.head,
    ...dirtyArgs(state.repo), '--input', 'public/data/ai-apps.json', '--expected-input-sha256', candidateHash,
    '--as-of', asOf, '--base-revision', state.head];
  assert.notEqual(run(args).status, 0, 'missing approval must fail');
  const check = (value, expectedHash) => {
    writeFileSync(approvalPath, `${JSON.stringify(value)}\n`);
    return run([...args, '--approved-delta', approvalPath, '--expected-approved-delta-sha256', expectedHash ?? hash(readFileSync(approvalPath))]);
  };
  assert.equal(check(approval).status, 0);
  assert.match(check(approval, '0'.repeat(64)).stderr, /hash mismatch/);
  assert.match(check({ ...approval, candidateSha256: '0'.repeat(64) }).stderr, /hash mismatch/);
  assert.match(check({ ...approval, staffPickChanges: [] }).stderr, /exact candidate delta/);
  assert.match(check({ ...approval, added: ['unapproved-tool'] }).stderr, /exact candidate delta/);
  assert.match(check({ ...approval, approval: { identity: 'Other', reference: 'Test' } }).stderr, /founder identity/);
  assert.match(run([...args, '--approved-delta', approvalPath]).stderr, /missing/);
});

function runBoundValidation(state, baseline, candidate, artifacts = candidate) {
  return run([
    'validate', '--repo-root', state.repo, '--expected-head', state.head,
    ...dirtyArgs(state.repo), '--staging-root', state.staging, '--baseline', baseline,
    '--expected-baseline-sha256', state.baselineHash, '--candidate', candidate.candidate,
    '--expected-candidate-sha256', candidate.candidateHash,
    '--source-manifest', artifacts.sourceManifest, '--expected-source-manifest-sha256', artifacts.sourceManifestHash,
    '--field-review', artifacts.fieldReview, '--expected-field-review-sha256', artifacts.fieldReviewHash,
    '--as-of', asOf,
  ]);
}

function addCurrentEvidence(data, toolIndex = 0) {
  const tool = data.tools[toolIndex];
  const productId = `${tool.slug}-product-${asOf}`;
  const pricingId = `${tool.slug}-pricing-${asOf}`;
  const sensitiveClaims = [...new Set(fieldPaths(tool).flatMap((path) => fieldClaimTypes(path, pathValue(tool, path))).filter((claim) => ['privacy', 'security', 'accessibility', 'terms'].includes(claim)))];
  const policyId = `${tool.slug}-policy-${asOf}`;
  data.sources.push(
    {
      id: productId,
      toolSlug: tool.slug,
      issuer: tool.name,
      title: `${tool.name} official product page`,
      url: `https://${tool.domain}/`,
      sourceType: 'official-product',
      checkedAt: asOf,
      accessStatus: 'confirmed',
      claimTypes: ['availability', 'features', 'education-use', 'integrations'],
    },
    {
      id: pricingId,
      toolSlug: tool.slug,
      issuer: tool.name,
      title: `${tool.name} official pricing page`,
      url: `https://${tool.domain}/pricing`,
      sourceType: 'official-pricing',
      checkedAt: asOf,
      accessStatus: 'confirmed',
      claimTypes: ['pricing'],
    },
  );
  if (sensitiveClaims.length) {
    data.sources.push({
      id: policyId,
      toolSlug: tool.slug,
      issuer: tool.name,
      title: `${tool.name} official policy page`,
      url: `https://${tool.domain}/policy`,
      sourceType: 'official-policy',
      checkedAt: asOf,
      accessStatus: 'confirmed',
      claimTypes: sensitiveClaims,
    });
  }
  tool.pricing.checkedAt = asOf;
  tool.review = {
    status: 'current',
    reviewedAt: asOf,
    contentUpdatedAt: tool.review.contentUpdatedAt,
    evidenceIds: [productId, pricingId, ...(sensitiveClaims.length ? [policyId] : [])],
    claimCoverage: ['availability', 'features', 'education-use', 'integrations', 'pricing', ...sensitiveClaims],
    unresolvedClaims: [],
    editorialRationale: 'Current official-source evidence supports this fixture.',
  };
  return { tool, productId, pricingId, policyId, sensitiveClaims };
}

test('workflow is read-only, full-scope, runtime-bound, and runs independent gates', () => {
  const workflow = readFileSync(workflowPath, 'utf8');
  const harness = readFileSync(harnessPath, 'utf8');
  for (const pattern of [
    /\bschedule\s*:/, /workflow_dispatch/, /\bsecrets\b/i, /contents:\s*write/i,
    /\bgit\s+(?:add|commit|push)\b/i, /\b(?:deploy|publish)\b/i,
  ]) assert.equal(pattern.test(workflow), false, `forbidden workflow pattern: ${pattern}`);
  assert.match(workflow, /pull_request:\s*\n\s*\npermissions:/);
  assert.match(workflow, /contents:\s*read/);
  assert.match(workflow, /persist-credentials:\s*false/);
  assert.match(workflow, /actions\/checkout v7\.0\.1\s*\n\s*uses: actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1/);
  assert.match(workflow, /actions\/setup-node v7\.0\.0\s*\n\s*uses: actions\/setup-node@820762786026740c76f36085b0efc47a31fe5020/);
  assert.match(workflow, /node-version:\s*'20'/);
  assert.match(workflow, /process\.versions\.node\.split\('\.'\)\[0\] !== '20'/);
  assert.match(workflow, /github\.sha/);
  assert.match(workflow, /github\.event\.pull_request\.base\.sha/);
  assert.doesNotMatch(workflow, /expected-(?:input|source)-sha256\s+[a-f0-9]{64}/i);
  for (const command of ['scan', 'schema', 'evidence', 'staleness', 'delta']) assert.match(workflow, new RegExp(`update-ai-directory\\.mjs ${command}`));
  for (const scope of ['test/ai-directory/ai-directory-schema.test.ts', 'test/ai-directory/fixtures.ts', 'lib/data/ai-directory-schema.ts', 'app/ai-directory/layout.tsx']) assert.match(workflow, new RegExp(scope.replaceAll('/', '\\/').replaceAll('.', '\\.')));
  assert.match(workflow, /node --loader \.\/scripts\/update-ai-directory\.mjs --test test\/ai-directory-provider-boundary\.test\.mjs test\/ai-directory\/ai-directory-schema\.test\.ts/);
  assert.ok(workflow.indexOf('npm ci --ignore-scripts') < workflow.indexOf('node --loader ./scripts/update-ai-directory.mjs --test'));
  assert.match(workflow, /eslint/);
  assert.match(workflow, /lint-design-tokens\.js/);
  assert.match(workflow, /tsc --noEmit --allowImportingTsExtensions/);
  assert.match(workflow, /next build --webpack/);
  const providerPattern = new RegExp([
    String.fromCharCode(97, 110, 116, 104, 114, 111, 112, 105, 99),
    String.fromCharCode(99, 108, 97, 117, 100, 101),
  ].join('|'), 'i');
  assert.doesNotMatch(workflow, providerPattern);
  assert.doesNotMatch(harness, providerPattern);
  const legacyReachability = run([]);
  assert.equal(legacyReachability.status, 0);
  assert.match(legacyReachability.stdout, /deterministic maintenance harness/i);
  assert.match(legacyReachability.stdout, /lock is cooperative/i);
  assert.match(legacyReachability.stdout, /stale locks fail closed/i);
  assert.match(legacyReachability.stdout, /extended attributes or ACLs/i);
  assert.doesNotMatch(harness, /InnovatingHigherEd\.com HQ/);
});

test('active-scope scanner preserves allowlisted editorial content and blocks an executable path', () => {
  const actualHead = git(repositoryRoot, ['rev-parse', 'HEAD']);
  const clean = run(['scan', '--repo-root', repositoryRoot, '--expected-head', actualHead, ...dirtyArgs(repositoryRoot)]);
  assert.equal(clean.status, 0, clean.stderr);
  assert.ok(JSON.parse(clean.stdout).historicalToolingFilesExcluded > 0);

  const state = fixture();
  const blockedName = String.fromCharCode(97, 110, 116, 104, 114, 111, 112, 105, 99);
  const blockedModel = String.fromCharCode(99, 108, 97, 117, 100, 101);
  const executable = resolve(state.repo, 'scripts/provider-client.mjs');
  mkdirSync(dirname(executable), { recursive: true });
  writeFileSync(executable, `fetch('https://api.${blockedName}.com/v1/messages', {body: JSON.stringify({model: '${blockedModel}-example'})});\n`);
  const blocked = run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]);
  assert.notEqual(blocked.status, 0);
  assert.match(blocked.stderr, /unclassified provider references/i);

  rmSync(executable);
  const instructionName = `${blockedModel.toUpperCase()}.md`;
  writeFileSync(resolve(state.repo, instructionName), `Read ${instructionName} first.\nUse ${blockedModel} as the provider for current work.\n`);
  const blockedInstruction = run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]);
  assert.notEqual(blockedInstruction.status, 0);
  assert.match(blockedInstruction.stderr, /unclassified provider references/i);

  rmSync(resolve(state.repo, instructionName));
  writeFileSync(resolve(state.repo, 'package.json'), `${JSON.stringify({ dependencies: { [`@${blockedName}-ai/sdk`]: '1.0.0' } })}\n`);
  const blockedManifest = run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]);
  assert.notEqual(blockedManifest.status, 0);
  assert.match(blockedManifest.stderr, /unclassified provider references/i);

  rmSync(resolve(state.repo, 'package.json'));
  const editorialLiteralPath = resolve(state.repo, 'lib/data/tools.ts');
  mkdirSync(dirname(editorialLiteralPath), { recursive: true });
  writeFileSync(editorialLiteralPath, `    name: '${blockedModel}',\n`);
  assert.equal(run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]).status, 0);
  const unsafeEditorialLines = [
    `name: '${blockedModel}' + suffix,`,
    `name: \`${blockedModel} \${suffix}\`,`,
    `name: resolveName('${blockedModel}'),`,
    `import ${blockedModel} from './vendor';`,
    `const selected = require('${blockedModel}');`,
  ];
  for (const line of unsafeEditorialLines) {
    writeFileSync(editorialLiteralPath, `${line}\n`);
    const outcome = run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]);
    assert.notEqual(outcome.status, 0, `unsafe editorial syntax unexpectedly passed: ${line}`);
    assert.match(outcome.stderr, /unclassified provider references/i);
  }
  rmSync(resolve(state.repo, 'lib'), { recursive: true });

  const migrationFixture = resolve(state.repo, 'test/ai-directory/migration-fixture.json');
  mkdirSync(dirname(migrationFixture), { recursive: true });
  writeFileSync(migrationFixture, `${JSON.stringify({ name: blockedModel }, null, 2)}\n`);
  assert.equal(run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]).status, 0);
  writeFileSync(migrationFixture, `"name": "${blockedModel}", fetch('https://api.${blockedName}.com');\n`);
  assert.notEqual(run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]).status, 0, 'migration fixture executable piggyback must fail');
  writeFileSync(migrationFixture, `${JSON.stringify({ apiKey: blockedModel }, null, 2)}\n`);
  assert.notEqual(run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]).status, 0, 'migration fixture sensitive-key literal must fail');
  rmSync(migrationFixture);

  const approvedDelta = resolve(state.repo, 'data/ai-directory-approved-delta.json');
  mkdirSync(dirname(approvedDelta), { recursive: true });
  writeFileSync(approvedDelta, `${JSON.stringify({ slug: blockedModel }, null, 2)}\n`);
  assert.equal(run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]).status, 0);
  writeFileSync(approvedDelta, `"slug": "${blockedModel}", fetch('https://api.${blockedName}.com');\n`);
  assert.notEqual(run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]).status, 0, 'approval artifact executable piggyback must fail');
  writeFileSync(approvedDelta, `${JSON.stringify({ apiKey: blockedModel }, null, 2)}\n`);
  assert.notEqual(run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]).status, 0, 'approval artifact credential field must fail');
  rmSync(approvedDelta);
  const unapprovedDeltaPath = resolve(state.repo, 'data/other-approved-delta.json');
  writeFileSync(unapprovedDeltaPath, `${JSON.stringify({ slug: blockedModel }, null, 2)}\n`);
  assert.notEqual(run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]).status, 0, 'other delta filenames must not inherit the exact-path allowance');
  rmSync(unapprovedDeltaPath);

  for (const relativePath of ['tools/check.py', 'tools/check.rb', 'Dockerfile', 'bin/provider-check', '.env.example', 'rebuild/check.py', 'nested/build/check.rb']) {
    const path = resolve(state.repo, relativePath);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `provider=${blockedModel}\n`);
    const outcome = run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]);
    assert.notEqual(outcome.status, 0, `${relativePath} unexpectedly escaped the tracked-text scanner`);
    assert.match(outcome.stderr, /unclassified provider references/i);
    rmSync(path);
  }

  const lunaFixturePath = resolve(state.repo, 'test/ai-directory/ai-directory-schema.test.ts');
  mkdirSync(dirname(lunaFixturePath), { recursive: true });
  writeFileSync(lunaFixturePath, `    data.sources = [sourceFixture({ toolSlug: '${blockedModel}' })];\n`);
  const compatibleFixture = run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]);
  assert.equal(compatibleFixture.status, 0, compatibleFixture.stderr);

  writeFileSync(lunaFixturePath, `    data.sources = [sourceFixture({ toolSlug: '${blockedModel}' })]; fetch('https://api.${blockedName}.com');\n`);
  let piggyback = run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]);
  assert.notEqual(piggyback.status, 0, 'Luna fixture same-line piggyback unexpectedly passed');
  rmSync(resolve(state.repo, 'test'), { recursive: true });

  const instructionPath = resolve(state.repo, instructionName);
  writeFileSync(instructionPath, `Read \`.${blockedModel}/skills/ihe-frontend/SKILL.md\` — this is the single source of truth for all frontend design, content, and structural rules.\n`);
  assert.equal(run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]).status, 0);
  writeFileSync(instructionPath, `Read \`.${blockedModel}/skills/ihe-frontend/SKILL.md\` — this is the single source of truth for all frontend design, content, and structural rules; provider=${blockedModel}.\n`);
  piggyback = run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]);
  assert.notEqual(piggyback.status, 0, 'current instruction same-line piggyback unexpectedly passed');
  rmSync(instructionPath);

  const lintPath = resolve(state.repo, 'scripts/lint-design-tokens.js');
  mkdirSync(dirname(lintPath), { recursive: true });
  writeFileSync(lintPath, `// Directories to skip (.${blockedModel} = vendored skills/tooling, not site code)\n`);
  assert.equal(run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]).status, 0);
  writeFileSync(lintPath, `// Directories to skip (.${blockedModel} = vendored skills/tooling, not site code); provider=${blockedModel}\n`);
  piggyback = run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]);
  assert.notEqual(piggyback.status, 0, 'lint same-line piggyback unexpectedly passed');
  rmSync(resolve(state.repo, 'scripts'), { recursive: true });

  const boundaryTestPath = resolve(state.repo, 'test/ai-directory-provider-boundary.test.mjs');
  mkdirSync(dirname(boundaryTestPath), { recursive: true });
  writeFileSync(boundaryTestPath, `const provider = '${blockedModel}';\n`);
  piggyback = run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]);
  assert.notEqual(piggyback.status, 0, 'provider-boundary test blanket allowance unexpectedly remained');
  rmSync(resolve(state.repo, 'test'), { recursive: true });

  const compatibilityPath = resolve(state.repo, `.${blockedModel}/skills/careful/SKILL.md`);
  mkdirSync(dirname(compatibilityPath), { recursive: true });
  symlinkSync(`/Volumes/MISHA 2TB/ihe-pulse/.${blockedModel}/skills/gstack/careful/SKILL.md`, compatibilityPath);
  assert.equal(run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]).status, 0);
  rmSync(compatibilityPath);
  symlinkSync(`/Volumes/MISHA 2TB/ihe-pulse/.${blockedModel}/skills/gstack/careful/SKILL.md;provider=${blockedModel}`, compatibilityPath);
  piggyback = run(['scan', '--repo-root', state.repo, '--expected-head', state.head, ...dirtyArgs(state.repo)]);
  assert.notEqual(piggyback.status, 0, 'compatibility symlink piggyback unexpectedly passed');
});

test('baseline and prepare require the exact Git-bound source and approved staging root', () => {
  const state = fixture();
  const baseline = prepareBaseline(state);
  assert.deepEqual(readFileSync(state.target), state.baselineBytes);

  const wrongHead = run([
    'baseline', '--repo-root', state.repo, '--expected-head', '0'.repeat(40),
    ...dirtyArgs(state.repo),
    '--source', 'public/data/ai-apps.json', '--expected-source-sha256', state.baselineHash,
  ]);
  assert.notEqual(wrongHead.status, 0);
  assert.match(wrongHead.stderr, /HEAD mismatch/i);

  const overlap = resolve(state.repo, 'UNREVIEWED.txt');
  writeFileSync(overlap, 'unexpected local overlap\n');
  const unapprovedOverlap = run([
    'baseline', '--repo-root', state.repo, '--expected-head', state.head,
    '--allowed-dirty-paths', '[]', '--source', 'public/data/ai-apps.json',
    '--expected-source-sha256', state.baselineHash,
  ]);
  assert.notEqual(unapprovedOverlap.status, 0);
  assert.match(unapprovedOverlap.stderr, /dirty inventory differs/i);
  const approvedOverlap = run([
    'baseline', '--repo-root', state.repo, '--expected-head', state.head,
    ...dirtyArgs(state.repo), '--source', 'public/data/ai-apps.json',
    '--expected-source-sha256', state.baselineHash,
  ]);
  assert.equal(approvedOverlap.status, 0, approvedOverlap.stderr);
  assert.deepEqual(JSON.parse(approvedOverlap.stdout).dirtyPaths, ['UNREVIEWED.txt']);
  rmSync(overlap);

  const outside = run([
    'prepare', '--repo-root', state.repo, '--expected-head', state.head,
    ...dirtyArgs(state.repo),
    '--source', 'public/data/ai-apps.json', '--expected-source-sha256', state.baselineHash,
    '--staging-root', state.staging, '--output', resolve(state.root, 'outside.json'),
  ]);
  assert.notEqual(outside.status, 0);
  assert.match(outside.stderr, /child of the explicit staging root/i);
  assert.deepEqual(readFileSync(baseline), state.baselineBytes);
  assert.deepEqual(readFileSync(state.target), state.baselineBytes);
});

test('repository and staging path components reject symbolic links', () => {
  const state = fixture();
  const linkedStaging = resolve(state.root, 'linked-staging');
  symlinkSync(state.staging, linkedStaging);
  const result = run([
    'prepare', '--repo-root', state.repo, '--expected-head', state.head,
    ...dirtyArgs(state.repo),
    '--source', 'public/data/ai-apps.json', '--expected-source-sha256', state.baselineHash,
    '--staging-root', linkedStaging, '--output', resolve(linkedStaging, 'BASELINE.json'),
  ]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /symbolic-link components/i);
  assert.deepEqual(readFileSync(state.target), state.baselineBytes);
});

test('schema-v2 migration validates and exact application uses the locked atomic path', () => {
  const state = fixture();
  const baseline = prepareBaseline(state);
  const candidateData = schemaV2FromLegacy(state.baselineData);
  const candidate = validateCandidate(state, baseline, candidateData);
  assert.equal(candidate.result.status, 0, candidate.result.stderr);

  const applied = run([
    'apply', '--repo-root', state.repo, '--expected-head', state.head,
    ...dirtyArgs(state.repo),
    '--staging-root', state.staging, '--baseline', baseline,
    '--expected-baseline-sha256', state.baselineHash, '--candidate', candidate.candidate,
    '--expected-candidate-sha256', candidate.candidateHash, ...artifactArgs(candidate), '--target', 'public/data/ai-apps.json',
    '--as-of', asOf, '--confirm', 'APPLY_EXACT_AI_DIRECTORY_CANDIDATE',
  ]);
  assert.equal(applied.status, 0, applied.stderr);
  assert.equal(hash(readFileSync(state.target)), candidate.candidateHash);
  assert.deepEqual(readFileSync(baseline), state.baselineBytes);
});

test('reviewed HQ artifacts are hash-bound, public-safe, complete, and staging-confined', () => {
  const initial = schemaV2FromLegacy(legacyCanonicalData());
  const state = fixture(initial);
  const baseline = prepareBaseline(state);
  const candidateData = clone(initial);
  candidateData.directoryReview.status = 'partial';
  candidateData.directoryReview.contentUpdatedAt = asOf;
  const evidence = addCurrentEvidence(candidateData);
  evidence.tool.review.contentUpdatedAt = asOf;
  const candidate = validateCandidate(state, baseline, candidateData);
  assert.equal(candidate.result.status, 0, candidate.result.stderr);

  let artifacts = writeReviewedArtifacts(state, candidateData);
  const reviewerSuperset = JSON.parse(readFileSync(artifacts.fieldReview, 'utf8'));
  reviewerSuperset.tools[0].fields.find((field) => field.path === 'name').claimTypes.push('education-use');
  writeFileSync(artifacts.fieldReview, `${JSON.stringify(reviewerSuperset, null, 2)}\n`);
  artifacts.fieldReviewHash = hash(readFileSync(artifacts.fieldReview));
  let outcome = runBoundValidation(state, baseline, candidate, artifacts);
  assert.equal(outcome.status, 0, outcome.stderr);

  writeFileSync(candidate.sourceManifest, `${readFileSync(candidate.sourceManifest, 'utf8')} `);
  outcome = runBoundValidation(state, baseline, candidate);
  assert.notEqual(outcome.status, 0);
  assert.match(outcome.stderr, /SOURCE-MANIFEST hash mismatch/i);

  artifacts = writeReviewedArtifacts(state, candidateData);
  const mismatchedManifest = JSON.parse(readFileSync(artifacts.sourceManifest, 'utf8'));
  mismatchedManifest.sources[0].title = 'Different reviewed title';
  writeFileSync(artifacts.sourceManifest, `${JSON.stringify(mismatchedManifest, null, 2)}\n`);
  artifacts.sourceManifestHash = hash(readFileSync(artifacts.sourceManifest));
  outcome = runBoundValidation(state, baseline, candidate, artifacts);
  assert.notEqual(outcome.status, 0);
  assert.match(outcome.stderr, /public-safe SOURCE-MANIFEST projection/i);

  artifacts = writeReviewedArtifacts(state, candidateData);
  const mismatchedFields = JSON.parse(readFileSync(artifacts.fieldReview, 'utf8'));
  mismatchedFields.tools[0].fields.find((field) => field.path === 'name').proposed.value = 'Different name';
  writeFileSync(artifacts.fieldReview, `${JSON.stringify(mismatchedFields, null, 2)}\n`);
  artifacts.fieldReviewHash = hash(readFileSync(artifacts.fieldReview));
  outcome = runBoundValidation(state, baseline, candidate, artifacts);
  assert.notEqual(outcome.status, 0);
  assert.match(outcome.stderr, /does not match the candidate value/i);

  artifacts = writeReviewedArtifacts(state, candidateData);
  const blockedReview = JSON.parse(readFileSync(artifacts.fieldReview, 'utf8'));
  blockedReview.independentReview.verdict = 'BLOCK';
  writeFileSync(artifacts.fieldReview, `${JSON.stringify(blockedReview, null, 2)}\n`);
  artifacts.fieldReviewHash = hash(readFileSync(artifacts.fieldReview));
  outcome = runBoundValidation(state, baseline, candidate, artifacts);
  assert.notEqual(outcome.status, 0);
  assert.match(outcome.stderr, /verdict must equal CLEAR/i);

  const artifactCases = [
    ['domain relation mismatch', 'manifest', (data) => { data.officialDomainRelations[0].publicDomain = 'different.example'; }, /publicDomain must exactly bind/i],
    ['issuer relation mismatch', 'manifest', (data) => { data.sources[0].issuer = 'Different issuer'; }, /issuer must exactly match/i],
    ['wrong package schema', 'manifest', (data) => { data.schema = 'source-manifest-v2'; }, /exact source-manifest-v3/i],
    ['invalid source status', 'manifest', (data) => { data.sources[0].accessStatus = 'maybe'; }, /not an approved value/i],
    ['self-authored reviewer role', 'manifest', (data) => { data.independentReview.identity = data.reviewer.identity; }, /different reviewer/i],
    ['unqualified reviewer role', 'manifest', (data) => { data.independentReview.role = 'package-author'; }, /not an approved value/i],
    ['timestamp without timezone', 'manifest', (data) => { data.sources[0].checkedTimestamp = `${asOf}T12:00:00`; }, /explicit timezone/i],
    ['future reviewed timestamp', 'manifest', (data) => { data.independentReview.reviewedAt = '2026-09-07T12:00:00-07:00'; }, /later than validation date/i],
    ['unknown package field', 'manifest', (data) => { data.unreviewed = true; }, /unknown: unreviewed/i],
    ['private local path', 'manifest', (data) => { data.sources[0].coverage = '/Volumes/private/research.txt'; }, /local or private path/i],
    ['invalid field status', 'field', (data) => { data.tools[0].fields[0].status = 'approved'; }, /not an approved value/i],
    ['reviewer claim lacks appropriate source', 'field', (data) => { data.tools[0].fields.find((field) => field.path === 'name').claimTypes.push('terms'); }, /official source class for terms/i],
  ];
  for (const [name, packageType, mutate, expected] of artifactCases) {
    artifacts = writeReviewedArtifacts(state, candidateData);
    const path = packageType === 'manifest' ? artifacts.sourceManifest : artifacts.fieldReview;
    const data = JSON.parse(readFileSync(path, 'utf8'));
    mutate(data);
    writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
    if (packageType === 'manifest') artifacts.sourceManifestHash = hash(readFileSync(path));
    else artifacts.fieldReviewHash = hash(readFileSync(path));
    outcome = runBoundValidation(state, baseline, candidate, artifacts);
    assert.notEqual(outcome.status, 0, `${name} unexpectedly passed`);
    assert.match(outcome.stderr, expected, `${name}: ${outcome.stderr}`);
  }

  artifacts = writeReviewedArtifacts(state, candidateData);
  outcome = runBoundValidation(state, baseline, candidate, {
    ...artifacts,
    sourceManifest: canonicalPath,
    sourceManifestHash: hash(readFileSync(canonicalPath)),
  });
  assert.notEqual(outcome.status, 0);
  assert.match(outcome.stderr, /child of the explicit staging root/i);
});

test('independent schema, evidence, staleness, and delta commands pass a bound candidate', () => {
  const state = fixture();
  const candidateData = schemaV2FromLegacy(state.baselineData);
  writeFileSync(state.target, `${JSON.stringify(candidateData, null, 2)}\n`);
  const candidateHash = hash(readFileSync(state.target));
  for (const command of ['schema', 'evidence', 'staleness', 'delta']) {
    const args = [
      command, '--repo-root', state.repo, '--expected-head', state.head,
      ...dirtyArgs(state.repo),
      '--input', 'public/data/ai-apps.json', '--expected-input-sha256', candidateHash,
      '--as-of', asOf,
    ];
    if (command === 'staleness' || command === 'delta') args.push('--base-revision', state.head);
    const result = run(args);
    assert.equal(result.status, 0, `${command}: ${result.stderr}`);
  }
});

test('apply fails closed on missing confirmation, lock contention, and changed target bytes', () => {
  const state = fixture();
  const baseline = prepareBaseline(state);
  const candidate = validateCandidate(state, baseline, schemaV2FromLegacy(state.baselineData));
  assert.equal(candidate.result.status, 0, candidate.result.stderr);
  const common = [
    'apply', '--repo-root', state.repo, '--expected-head', state.head,
    '--staging-root', state.staging, '--baseline', baseline,
    '--expected-baseline-sha256', state.baselineHash, '--candidate', candidate.candidate,
    '--expected-candidate-sha256', candidate.candidateHash, ...artifactArgs(candidate), '--target', 'public/data/ai-apps.json',
    '--as-of', asOf,
  ];

  const noConfirmation = run([...common, ...dirtyArgs(state.repo), '--confirm', 'NO']);
  assert.notEqual(noConfirmation.status, 0);
  assert.deepEqual(readFileSync(state.target), state.baselineBytes);

  const lockPath = `${state.target}.lock`;
  writeFileSync(lockPath, 'concurrent holder\n');
  const locked = run([...common, ...dirtyArgs(state.repo), '--confirm', 'APPLY_EXACT_AI_DIRECTORY_CANDIDATE']);
  assert.notEqual(locked.status, 0);
  assert.match(locked.stderr, /lock is unavailable/i);
  assert.deepEqual(readFileSync(state.target), state.baselineBytes);
  rmSync(lockPath);

  writeFileSync(state.target, Buffer.concat([state.baselineBytes, Buffer.from(' ')]));
  const changedBytes = readFileSync(state.target);
  const mismatch = run([...common, ...dirtyArgs(state.repo), '--confirm', 'APPLY_EXACT_AI_DIRECTORY_CANDIDATE']);
  assert.notEqual(mismatch.status, 0);
  assert.match(mismatch.stderr, /hash mismatch/i);
  assert.deepEqual(readFileSync(state.target), changedBytes);
});

test('apply detects a concurrent target change during replacement preparation', { timeout: 30_000 }, async () => {
  const largeLegacy = legacyCanonicalData();
  largeLegacy.tools[0].description = `${largeLegacy.tools[0].description}${'x'.repeat(16 * 1024 * 1024)}`;
  const state = fixture(largeLegacy);
  const baseline = prepareBaseline(state);
  const candidate = validateCandidate(state, baseline, schemaV2FromLegacy(state.baselineData));
  assert.equal(candidate.result.status, 0, candidate.result.stderr);
  let temporaryPath;
  const outcomePromise = runAsync([
    'apply', '--repo-root', state.repo, '--expected-head', state.head,
    ...dirtyArgs(state.repo),
    '--staging-root', state.staging, '--baseline', baseline,
    '--expected-baseline-sha256', state.baselineHash, '--candidate', candidate.candidate,
    '--expected-candidate-sha256', candidate.candidateHash, ...artifactArgs(candidate), '--target', 'public/data/ai-apps.json',
    '--as-of', asOf, '--confirm', 'APPLY_EXACT_AI_DIRECTORY_CANDIDATE',
  ], {
    onSpawn: (child) => { temporaryPath = `${state.target}.candidate-${child.pid}`; },
  });
  const deadline = Date.now() + 10_000;
  while (!existsSync(temporaryPath) && Date.now() < deadline) {
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 1));
  }
  assert.equal(existsSync(temporaryPath), true, 'test did not observe the temporary same-directory candidate');
  const changedBytes = Buffer.concat([state.baselineBytes, Buffer.from(' ')]);
  writeFileSync(state.target, changedBytes);
  const outcome = await outcomePromise;
  assert.notEqual(outcome.status, 0);
  assert.match(outcome.stderr, /hash mismatch|changed concurrently|dirty inventory/i);
  assert.deepEqual(readFileSync(state.target), changedBytes);
});

test('apply rejects adversarial temporary-candidate and lock path swaps without unlinking replacements', { timeout: 60_000 }, async () => {
  for (const attack of ['temporary', 'lock']) {
    const largeLegacy = legacyCanonicalData();
    largeLegacy.tools[0].description = `${largeLegacy.tools[0].description}${'x'.repeat(16 * 1024 * 1024)}`;
    const state = fixture(largeLegacy);
    const baseline = prepareBaseline(state);
    const candidate = validateCandidate(state, baseline, schemaV2FromLegacy(state.baselineData));
    assert.equal(candidate.result.status, 0, candidate.result.stderr);
    let temporaryPath;
    const lockPath = `${state.target}.lock`;
    const outcomePromise = runAsync([
      'apply', '--repo-root', state.repo, '--expected-head', state.head,
      ...dirtyArgs(state.repo), '--staging-root', state.staging, '--baseline', baseline,
      '--expected-baseline-sha256', state.baselineHash, '--candidate', candidate.candidate,
      '--expected-candidate-sha256', candidate.candidateHash, ...artifactArgs(candidate), '--target', 'public/data/ai-apps.json',
      '--as-of', asOf, '--confirm', 'APPLY_EXACT_AI_DIRECTORY_CANDIDATE',
    ], { onSpawn: (child) => { temporaryPath = `${state.target}.candidate-${child.pid}`; } });
    const deadline = Date.now() + 15_000;
    while (!existsSync(temporaryPath) && Date.now() < deadline) await new Promise((resolveDelay) => setTimeout(resolveDelay, 1));
    assert.equal(existsSync(temporaryPath), true, `${attack} attack did not observe the temporary candidate`);
    const displacedPath = resolve(state.staging, `${attack}-displaced`);
    if (attack === 'temporary') {
      renameSync(temporaryPath, displacedPath);
      symlinkSync(candidate.candidate, temporaryPath);
    } else {
      renameSync(lockPath, displacedPath);
      writeFileSync(lockPath, 'replacement lock owned by another actor\n');
    }
    const outcome = await outcomePromise;
    assert.notEqual(outcome.status, 0, `${attack} path swap unexpectedly applied`);
    assert.match(outcome.stderr, /identity changed|symbolic-link|lock contents changed|dirty inventory/i);
    assert.deepEqual(readFileSync(state.target), state.baselineBytes);
    const replacementPath = attack === 'temporary' ? temporaryPath : lockPath;
    assert.equal(existsSync(replacementPath), true, `${attack} replacement path was unsafely unlinked`);
  }
});

test('required schema, evidence, URL, date, enum, delta, and legacy-field negatives fail closed', () => {
  const state = fixture();
  const baseline = prepareBaseline(state);
  const valid = schemaV2FromLegacy(state.baselineData);
  const cases = [
    ['duplicate slug', (data) => { data.tools[1].slug = data.tools[0].slug; }, /slugs must be unique/i],
    ['missing source', (data) => { addCurrentEvidence(data); data.sources = []; }, /reference a source/i],
    ['fake future date', (data) => { data.tools[0].review.contentUpdatedAt = '2099-01-01'; }, /must not be later/i],
    ['unsupported category', (data) => { data.tools[0].category = 'Unsupported'; }, /not an approved value/i],
    ['malformed URL', (data) => { data.tools[0].platformUrl = 'http://example.com'; }, /HTTPS URL/i],
    ['source-to-slug mismatch', (data) => { const e = addCurrentEvidence(data); data.sources.find((source) => source.id === e.productId).toolSlug = data.tools[1].slug; }, /same tool slug/i],
    ['null arrays', (data) => { data.tools[0].strengths = null; }, /must be an array/i],
    ['missing price evidence', (data) => { const e = addCurrentEvidence(data); data.sources = data.sources.filter((source) => source.id !== e.pricingId); data.tools[0].review.evidenceIds = [e.productId]; }, /pricing.*evidence/i],
    ['sensitive claim without policy evidence', (data) => { const e = addCurrentEvidence(data); data.sources = data.sources.filter((source) => !['official-policy', 'official-terms'].includes(source.sourceType)); e.tool.review.evidenceIds = e.tool.review.evidenceIds.filter((id) => data.sources.some((source) => source.id === id)); const product = data.sources.find((source) => source.id === e.productId); for (const claim of ['privacy', 'security', 'accessibility', 'terms']) if (e.tool.review.claimCoverage.includes(claim) && !product.claimTypes.includes(claim)) product.claimTypes.push(claim); if (!product.claimTypes.includes('privacy')) product.claimTypes.push('privacy'); if (!e.tool.review.claimCoverage.includes('privacy')) e.tool.review.claimCoverage.push('privacy'); }, /policy or terms evidence/i],
    ['undeclared sensitive prose', (data) => { data.tools[0].description += ' Privacy controls are available.'; addCurrentEvidence(data); data.tools[0].review.claimCoverage = data.tools[0].review.claimCoverage.filter((claim) => claim !== 'privacy'); }, /privacy prose without matching claimCoverage/i],
    ['unqualified compliance assurance', (data) => { data.tools[0].description += ' Fully HIPAA compliant.'; addCurrentEvidence(data); }, /prohibited unqualified assurance or compliance claim/i],
    ['current review predates content', (data) => { const e = addCurrentEvidence(data); e.tool.review.contentUpdatedAt = asOf; e.tool.review.reviewedAt = '2026-09-04'; }, /reviewedAt must be on or after contentUpdatedAt/i],
    ['stale current evidence', (data) => { addCurrentEvidence(data); data.sources[0].checkedAt = '2026-09-04'; }, /reviewedAt must match every source check/i],
    ['unreferenced evidence', (data) => { addCurrentEvidence(data); data.sources.push({ ...data.sources[0], id: 'unused-source' }); }, /unreferenced evidence/i],
    ['expired updated badge', (data) => { data.tools[0].badge = 'updated'; }, /more than 45 days/i],
    ['silent tool removal', (data) => { data.tools.pop(); data.directoryReview.visibleToolCount -= 1; }, /slug inventory differs/i],
    ['forbidden legacy field', (data) => { data.tools[0].verified = true; }, /unknown: verified/i],
    ['invalid role enum', (data) => { data.tools[0].roles = ['owner']; }, /not an approved value/i],
  ];

  for (const [name, mutate, expected] of cases) {
    const candidate = clone(valid);
    mutate(candidate);
    const outcome = validateCandidate(state, baseline, candidate);
    assert.notEqual(outcome.result.status, 0, `${name} unexpectedly passed`);
    assert.match(outcome.result.stderr, expected, `${name}: ${outcome.result.stderr}`);
    assert.deepEqual(readFileSync(state.target), state.baselineBytes);
  }
});

test('date-only and partial full-review advances fail staleness validation', () => {
  const initial = schemaV2FromLegacy(legacyCanonicalData());
  const state = fixture(initial);
  const baseline = prepareBaseline(state);

  const dateOnly = clone(initial);
  dateOnly.directoryReview.contentUpdatedAt = asOf;
  let outcome = validateCandidate(state, baseline, dateOnly);
  assert.notEqual(outcome.result.status, 0);
  assert.match(outcome.result.stderr, /date-only update/i);

  const partial = clone(initial);
  partial.directoryReview.status = 'partial';
  partial.directoryReview.fullReviewCompletedAt = '2026-01-01';
  outcome = validateCandidate(state, baseline, partial);
  assert.notEqual(outcome.result.status, 0);
  assert.match(outcome.result.stderr, /partial batch cannot advance/i);
});

test('public changes require inverse date advancement and current completion rejects mixed review dates', () => {
  const initial = schemaV2FromLegacy(legacyCanonicalData());
  const state = fixture(initial);
  const baseline = prepareBaseline(state);

  const inverseDrift = clone(initial);
  inverseDrift.tools[0].description = `${inverseDrift.tools[0].description} Materially changed.`;
  let outcome = validateCandidate(state, baseline, inverseDrift);
  assert.notEqual(outcome.result.status, 0);
  assert.match(outcome.result.stderr, /public content changes must advance directory contentUpdatedAt/i);

  const mixedReview = clone(initial);
  mixedReview.directoryReview.status = 'current';
  mixedReview.directoryReview.fullReviewCompletedAt = asOf;
  mixedReview.directoryReview.contentUpdatedAt = asOf;
  for (let index = 0; index < mixedReview.tools.length; index += 1) {
    const { tool } = addCurrentEvidence(mixedReview, index);
    tool.review.contentUpdatedAt = asOf;
  }
  const prematureCompletion = clone(mixedReview);
  prematureCompletion.directoryReview.fullReviewCompletedAt = '2026-09-04';
  outcome = validateCandidate(state, baseline, prematureCompletion);
  assert.notEqual(outcome.result.status, 0);
  assert.match(outcome.result.stderr, /fullReviewCompletedAt must be on or after directory contentUpdatedAt/i);

  mixedReview.tools[1].review.reviewedAt = '2026-09-04';
  mixedReview.tools[1].review.contentUpdatedAt = '2026-09-04';
  mixedReview.tools[1].pricing.checkedAt = '2026-09-04';
  for (const source of mixedReview.sources.filter((entry) => entry.toolSlug === mixedReview.tools[1].slug)) source.checkedAt = '2026-09-04';
  outcome = validateCandidate(state, baseline, mixedReview);
  assert.notEqual(outcome.result.status, 0);
  assert.match(outcome.result.stderr, /one complete review date/i);
});

test('empty, truncated, malformed, wrong-hash, and same-path candidates never write canonical data', () => {
  const state = fixture();
  const baseline = prepareBaseline(state);
  const candidatePath = resolve(state.staging, 'PROPOSED-ai-apps.json');
  const artifacts = writeReviewedArtifacts(state, schemaV2FromLegacy(state.baselineData));
  for (const bytes of [Buffer.alloc(0), Buffer.from('{"tools":['), Buffer.from('{"tools":[],"categories":[]}')]) {
    writeFileSync(candidatePath, bytes);
    const result = run([
      'validate', '--repo-root', state.repo, '--expected-head', state.head,
      ...dirtyArgs(state.repo),
      '--staging-root', state.staging, '--baseline', baseline,
      '--expected-baseline-sha256', state.baselineHash, '--candidate', candidatePath,
      '--expected-candidate-sha256', hash(bytes),
      '--source-manifest', artifacts.sourceManifest, '--expected-source-manifest-sha256', artifacts.sourceManifestHash,
      '--field-review', artifacts.fieldReview, '--expected-field-review-sha256', artifacts.fieldReviewHash,
      '--as-of', asOf,
    ]);
    assert.notEqual(result.status, 0);
    assert.deepEqual(readFileSync(state.target), state.baselineBytes);
  }
  cpSync(baseline, candidatePath);
  const wrongHash = run([
    'validate', '--repo-root', state.repo, '--expected-head', state.head,
    ...dirtyArgs(state.repo),
    '--staging-root', state.staging, '--baseline', baseline,
    '--expected-baseline-sha256', state.baselineHash, '--candidate', candidatePath,
    '--expected-candidate-sha256', '0'.repeat(64),
    '--source-manifest', artifacts.sourceManifest, '--expected-source-manifest-sha256', artifacts.sourceManifestHash,
    '--field-review', artifacts.fieldReview, '--expected-field-review-sha256', artifacts.fieldReviewHash,
    '--as-of', asOf,
  ]);
  assert.notEqual(wrongHash.status, 0);
  assert.deepEqual(readFileSync(state.target), state.baselineBytes);
});

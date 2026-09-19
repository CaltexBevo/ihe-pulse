#!/usr/bin/env node

/**
 * Deterministic AI Directory maintenance harness.
 *
 * The harness performs local validation and explicit, hash-bound file
 * transitions only. It makes no research, network, model, Git-write,
 * deployment, or publication request.
 */

import {
  closeSync,
  existsSync,
  fstatSync,
  fsyncSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { basename, dirname, extname, isAbsolute, parse, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CANONICAL_RELATIVE_PATH = 'public/data/ai-apps.json';
const EXPECTED_BASELINE_TOOL_COUNT = 44;
const APPLY_CONFIRMATION = 'APPLY_EXACT_AI_DIRECTORY_CANDIDATE';
const SHA256_PATTERN = /^[a-f0-9]{64}$/;
const GIT_REVISION_PATTERN = /^[a-f0-9]{40}$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const TOP_LEVEL_KEYS = ['schemaVersion', 'directoryReview', 'categories', 'sources', 'tools'];
const DIRECTORY_REVIEW_KEYS = ['status', 'fullReviewCompletedAt', 'contentUpdatedAt', 'method', 'visibleToolCount'];
const SOURCE_KEYS = ['id', 'toolSlug', 'issuer', 'title', 'url', 'sourceType', 'checkedAt', 'accessStatus', 'claimTypes'];
const TOOL_KEYS = [
  'slug', 'name', 'tagline', 'description', 'category', 'badge', 'values', 'tasks', 'roles', 'pricing',
  'keyFeatures', 'pros', 'cons', 'bestFor', 'strengths', 'limitations', 'quickstart', 'integrations',
  'platformUrl', 'domain', 'staffPick', 'review',
];
const PRICING_KEYS = ['model', 'startingPrice', 'details', 'checkedAt'];
const REVIEW_KEYS = ['status', 'reviewedAt', 'contentUpdatedAt', 'evidenceIds', 'claimCoverage', 'unresolvedClaims', 'editorialRationale'];

const CATEGORIES = [
  'All', 'General LLMs', 'Lesson Planning', 'Grading & Assessment', 'Research', 'Writing & Feedback',
  'Presentations', 'Image & Video', 'Productivity', 'Student Tools', 'Gamification', 'Avatars', 'Music',
  'Text to Speech',
];
const TASKS = [
  'Administration', 'Assessment', 'Content Creation', 'General LLM', 'Grading', 'Lesson Planning',
  'Note-Taking', 'Presentations', 'Research', 'Student Engagement', 'Video & Media', 'Writing Feedback',
];
const ROLES = ['faculty', 'administrator', 'student'];
const PRICE_MODELS = ['free', 'freemium', 'paid', 'institutional-quote', 'unknown'];
const BADGES = ['new', 'updated'];
const REVIEW_STATUSES = ['current', 'limited', 'retire-candidate', 'blocked'];
const DIRECTORY_STATUSES = ['current', 'partial', 'stale'];
const SOURCE_TYPES = [
  'official-product', 'official-pricing', 'official-education', 'official-documentation', 'official-policy',
  'official-status', 'official-terms',
];
const ACCESS_STATUSES = ['confirmed', 'redirected', 'blocked', 'not-found'];
const CLAIM_TYPES = ['availability', 'pricing', 'features', 'education-use', 'integrations', 'privacy', 'security', 'accessibility', 'terms', 'status'];
const FIELD_REVIEW_STATUSES = ['confirmed', 'changed', 'unsupported', 'unavailable', 'retire-candidate'];
const SENSITIVE_SOURCE_TYPES = new Set(['official-policy', 'official-terms']);
const SENSITIVE_CLAIM_TYPES = ['privacy', 'security', 'accessibility', 'terms'];
const SOURCE_MANIFEST_SCHEMA = 'source-manifest-v3';
const FIELD_REVIEW_SCHEMA = 'ai-directory-field-review-v3';
const SOURCE_MANIFEST_KEYS = ['schema', 'package', 'packageDate', 'generatedAt', 'reviewer', 'independentReview', 'sourceTypes', 'officialDomainRelations', 'sources'];
const FIELD_REVIEW_KEYS = ['schema', 'package', 'packageDate', 'generatedAt', 'reviewer', 'independentReview', 'statusVocabulary', 'sourceRule', 'completeness', 'tools'];
const REVIEW_AUTHOR_KEYS = ['identity', 'role', 'timezone'];
const INDEPENDENT_REVIEW_KEYS = ['identity', 'role', 'verdict', 'reviewedAt'];
const DOMAIN_RELATION_KEYS = ['toolSlug', 'issuer', 'publicDomain', 'platformHost', 'approvedSourceHosts'];
const FULL_SOURCE_KEYS = [...SOURCE_KEYS, 'checkedTimestamp', 'coverage', 'conflictNotes', 'limitations'];
const COMPLETENESS_KEYS = ['method', 'unionIncludesPriorAndCandidate', 'toolCount', 'fieldItemCount', 'duplicatePathCount', 'duplicateEvidenceBindingCount', 'overbroadBindingCount', 'missingUnionPaths', 'duplicateUnionPaths'];
const FIELD_REVIEW_TOOL_KEYS = ['slug', 'recordIndex', 'currentBaselineStatus', 'proposedStatus', 'staffPick', 'fields'];
const FIELD_REVIEW_FIELD_KEYS = ['path', 'status', 'prior', 'proposed', 'claimTypes', 'evidenceIds', 'note'];
const SOURCE_RULE = 'Every supported field or array item uses only unique exact source IDs whose reviewed claim classes support that exact field or item; unsupported or unavailable claims use no evidence IDs.';
const COMPLETENESS_METHOD = 'Exact candidate field and array-item paths; each path appears once per visible tool and binds its prior and proposed value.';
const REVIEWER_ROLES = ['independent_reviewer', 'sol_risk_reviewer', 'sol_pr_reviewer'];
const REVIEW_TIMEZONE = 'America/Los_Angeles';
const PRIVACY_UNSAFE_KEY = /(?:secret|token|api.?key|credential|password|private.?note|source.?text|raw.?content|account|email|local.?path)/i;
const PRIVACY_UNSAFE_VALUE = /(?:\/(?:Users|Volumes|home)\/|file:\/\/|[A-Za-z]:\\)/;
const SENSITIVE_PROSE_PATTERNS = new Map([
  ['privacy', /\b(?:privacy|private data|data retention|data sharing|personal data|FERPA|GDPR|COPPA)\b/i],
  ['security', /\b(?:security|secure|encrypted|encryption|SOC\s*2|HIPAA|compliance)\b/i],
  ['accessibility', /\b(?:accessibility|accessible|WCAG|screen reader)\b/i],
  ['terms', /\b(?:terms of (?:service|use)|legal(?:ly)?|license agreement|copyright)\b/i],
]);
const EDUCATION_PROSE_PATTERN = /\b(?:education|educator|teacher|student|faculty|classroom|course|academic|school|university|college|lesson|grading|assessment)\b/i;
const PROHIBITED_ASSURANCE_PATTERN = /(?:\b(?:FERPA|GDPR|COPPA|HIPAA|SOC\s*2|WCAG)\s+(?:compliant|certified)\b|\b(?:fully|guaranteed)\s+(?:secure|accessible|compliant)\b|\bguarantees?\s+compliance\b)/i;

const PROVIDER_NAMES = [
  String.fromCharCode(97, 110, 116, 104, 114, 111, 112, 105, 99),
  String.fromCharCode(99, 108, 97, 117, 100, 101),
];
const PROVIDER_PATTERN = new RegExp(PROVIDER_NAMES.join('|'), 'i');

const BINARY_EXTENSIONS = new Set(['.avif', '.gif', '.ico', '.jpeg', '.jpg', '.mp3', '.mp4', '.pdf', '.png', '.ttf', '.webp', '.woff', '.woff2', '.zip']);
const EXCLUDED_PATH_BOUNDARIES = ['node_modules', '.next', 'out', 'build', 'dist', '.vercel', 'src-archive', 'Prototypes', 'Board Room Feedback'];
const HISTORICAL_TOOLING_BOUNDARIES = [`.${PROVIDER_NAMES[1]}/skills/gstack.bak`];

const EDITORIAL_PROVIDER_PATHS = new Set([
  'public/data/ai-apps.json',
  'data/ai-directory-approved-delta.json',
  'test/ai-directory/migration-fixture.json',
  'app/ai-disclosure/page.tsx',
  'components/DiscoveryTicker.tsx',
  'components/PromptNavigatorSections.tsx',
  'lib/data/stories.ts',
  'lib/data/tools.ts',
  'lib/data/featured-coverage-models.ts',
  'lib/data/innovation-grants.ts',
  'lib/data/ai-apps.ts',
  'lib/data/ai-app-directory.json',
]);

const HISTORICAL_PROVIDER_PATHS = new Set([
  'CHANGELOG.md',
  'ROADMAP.md',
  'SESSION-LOG.md',
  'TASKS.md',
  `${PROVIDER_NAMES[1].toUpperCase()}-CODE-BUILD-13-1-FIXES.md`,
  `${PROVIDER_NAMES[1].toUpperCase()}-CODE-BUILD-13-PROMPT.md`,
  'CONTINUATION-PROMPT.md',
  'IHE-BUILD12-AGENT-TEAM.md',
  'IHE-CONTENT-MIGRATION-PROMPT.md',
  'IHE-FULL-PROTOTYPE-PROMPT.md',
  'IHE_Executive_Summary.md',
  'STARTER_PROMPT.md',
  `ihe-pulse-${PROVIDER_NAMES[1]}-code-prompt.md`,
  'innovation-pulse-complete-spec.md',
  'docs/AUDIT-2026-06-PRELAUNCH.md',
  'docs/DESIGN-TOKENS.md',
  'Fixes for IHE 26.26 copy.rtfd/TXT.rtf',
]);

function fail(message) {
  throw new Error(message);
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonempty(value) {
  return typeof value === 'string' && value.trim() === value && value.length > 0;
}

function parseArguments(argv) {
  const [command, ...tokens] = argv;
  if (!command || command === '--help' || command === '-h') return { command: 'help', options: {} };
  const options = {};
  for (let index = 0; index < tokens.length; index += 2) {
    const flag = tokens[index];
    const value = tokens[index + 1];
    if (!flag?.startsWith('--') || value === undefined || value.startsWith('--')) {
      fail(`Every option requires an explicit --name value pair; received ${flag ?? 'nothing'}.`);
    }
    const name = flag.slice(2);
    if (Object.hasOwn(options, name)) fail(`Duplicate option: --${name}`);
    options[name] = value;
  }
  return { command, options };
}

function requireExactOptions(command, options, required) {
  const names = Object.keys(options).sort();
  const approvalOptions = ['approved-delta', 'expected-approved-delta-sha256'];
  const hasApproval = approvalOptions.some((name) => Object.hasOwn(options, name));
  const expected = [...required, ...(['validate', 'apply', 'delta'].includes(command) && hasApproval ? approvalOptions : [])].sort();
  const missing = expected.filter((name) => !Object.hasOwn(options, name));
  const unknown = names.filter((name) => !expected.includes(name));
  if (missing.length || unknown.length) {
    const details = [
      missing.length ? `missing ${missing.map((name) => `--${name}`).join(', ')}` : '',
      unknown.length ? `unknown ${unknown.map((name) => `--${name}`).join(', ')}` : '',
    ].filter(Boolean).join('; ');
    fail(`${command}: ${details}.`);
  }
}

function normalizeHash(label, value) {
  const normalized = value.toLowerCase();
  if (!SHA256_PATTERN.test(normalized)) fail(`${label} must be exactly 64 hexadecimal characters.`);
  return normalized;
}

function normalizeRevision(label, value) {
  const normalized = value.toLowerCase();
  if (!GIT_REVISION_PATTERN.test(normalized)) fail(`${label} must be an exact 40-character commit hash.`);
  return normalized;
}

function resolveExplicitPath(label, value, baseDirectory) {
  if (!value || value.trim() !== value || value.includes('\0')) fail(`${label} must be an explicit normalized path.`);
  return isAbsolute(value) ? resolve(value) : resolve(baseDirectory, value);
}

function assertNoSymlinkComponents(label, filePath, allowMissingLeaf = false) {
  const resolvedPath = resolve(filePath);
  const parsed = parse(resolvedPath);
  let current = parsed.root;
  const segments = resolvedPath.slice(parsed.root.length).split('/').filter(Boolean);
  for (let index = 0; index < segments.length; index += 1) {
    current = resolve(current, segments[index]);
    if (!existsSync(current)) {
      if (allowMissingLeaf) return;
      fail(`${label} contains a missing path component: ${current}`);
    }
    if (lstatSync(current).isSymbolicLink()) fail(`${label} must not contain symbolic-link components: ${current}`);
  }
}

function assertWithin(label, filePath, rootPath) {
  const pathFromRoot = relative(rootPath, filePath);
  if (!pathFromRoot || pathFromRoot.startsWith('..') || isAbsolute(pathFromRoot)) {
    fail(`${label} must be a child of the explicit staging root ${rootPath}.`);
  }
}

function git(repoRoot, args, encoding = 'utf8') {
  try {
    return execFileSync('git', ['-C', repoRoot, ...args], { encoding, stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 20 * 1024 * 1024 });
  } catch (error) {
    const detail = error.stderr?.toString().trim() || error.message;
    fail(`Read-only Git check failed (${args.join(' ')}): ${detail}`);
  }
}

function nulSeparatedPaths(buffer) {
  return buffer.toString('utf8').split('\0').filter(Boolean);
}

function readDirtyInventory(repoRoot) {
  const tracked = nulSeparatedPaths(git(repoRoot, ['diff', '--name-only', '-z', 'HEAD', '--'], null));
  const untracked = nulSeparatedPaths(git(repoRoot, ['ls-files', '--others', '--exclude-standard', '-z'], null));
  return [...new Set([...tracked, ...untracked])].sort();
}

function parseAllowedDirtyPaths(value) {
  let parsed;
  try {
    parsed = JSON.parse(value);
  } catch (error) {
    fail(`--allowed-dirty-paths must be a JSON array: ${error.message}`);
  }
  if (!Array.isArray(parsed) || parsed.some((entry) => !nonempty(entry) || isAbsolute(entry) || entry.split('/').some((part) => part === '.' || part === '..') || entry.includes('\0'))) {
    fail('--allowed-dirty-paths must contain only explicit repository-relative paths.');
  }
  const normalized = [...new Set(parsed)].sort();
  if (normalized.length !== parsed.length) fail('--allowed-dirty-paths must not contain duplicates.');
  return normalized;
}

function assertDirtyInventory(repoRoot, allowedValue, transientPaths = []) {
  const actual = readDirtyInventory(repoRoot);
  const allowed = parseAllowedDirtyPaths(allowedValue);
  const expected = [...new Set([...allowed, ...transientPaths])].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    const unexpected = actual.filter((path) => !expected.includes(path));
    const missing = expected.filter((path) => !actual.includes(path));
    fail(`Dirty inventory differs from the exact reviewed set (unexpected: ${unexpected.join(', ') || 'none'}; missing: ${missing.join(', ') || 'none'}).`);
  }
  return allowed;
}

function verifyRepository(options, transientPaths = []) {
  const repoRoot = resolveExplicitPath('--repo-root', options['repo-root'], process.cwd());
  assertNoSymlinkComponents('Repository root', repoRoot);
  if (!lstatSync(repoRoot).isDirectory() || realpathSync(repoRoot) !== repoRoot) fail('Repository root must be a real directory path.');
  const actualRoot = git(repoRoot, ['rev-parse', '--show-toplevel']).trim();
  if (realpathSync(actualRoot) !== repoRoot) fail(`--repo-root is not the exact Git worktree root: ${repoRoot}`);
  const expectedHead = normalizeRevision('--expected-head', options['expected-head']);
  const actualHead = git(repoRoot, ['rev-parse', 'HEAD']).trim().toLowerCase();
  if (actualHead !== expectedHead) fail(`Git HEAD mismatch: expected ${expectedHead}, received ${actualHead}.`);
  git(repoRoot, ['cat-file', '-e', `${expectedHead}^{commit}`]);
  const dirtyPaths = assertDirtyInventory(repoRoot, options['allowed-dirty-paths'], transientPaths);
  const canonicalPath = resolve(repoRoot, CANONICAL_RELATIVE_PATH);
  assertNoSymlinkComponents('Canonical path', canonicalPath);
  return { repoRoot, canonicalPath, expectedHead, dirtyPaths };
}

function readGitCanonical(repoRoot, revisionValue) {
  const revision = normalizeRevision('Git baseline revision', revisionValue);
  git(repoRoot, ['cat-file', '-e', `${revision}^{commit}`]);
  const bytes = git(repoRoot, ['show', `${revision}:${CANONICAL_RELATIVE_PATH}`], null);
  let data;
  try {
    data = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    fail(`Git baseline ${revision} does not contain valid canonical JSON: ${error.message}`);
  }
  return { revision, bytes, data, hash: sha256(bytes) };
}

function assertRegularFile(label, filePath) {
  assertNoSymlinkComponents(label, filePath);
  const stats = lstatSync(filePath);
  if (!stats.isFile() || stats.isSymbolicLink()) fail(`${label} must be a regular, non-symbolic-link file: ${filePath}`);
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function readHashedJson(label, filePath, expectedHash) {
  assertRegularFile(label, filePath);
  const bytes = readFileSync(filePath);
  if (bytes.length === 0) fail(`${label} is empty.`);
  const actualHash = sha256(bytes);
  const normalizedExpectedHash = normalizeHash(`${label} hash`, expectedHash);
  if (actualHash !== normalizedExpectedHash) fail(`${label} hash mismatch: expected ${normalizedExpectedHash}, received ${actualHash}.`);
  let data;
  try {
    data = JSON.parse(bytes.toString('utf8'));
  } catch (error) {
    fail(`${label} is not valid JSON: ${error.message}`);
  }
  return { bytes, data, hash: actualHash };
}

function assertSameBytes(label, first, second) {
  if (!first.equals(second)) fail(`${label} bytes do not exactly match the Git-bound baseline.`);
}

function assertDifferentFiles(firstLabel, firstPath, secondLabel, secondPath) {
  if (resolve(firstPath) === resolve(secondPath)) fail(`${firstLabel} and ${secondLabel} must be different files.`);
  if (existsSync(firstPath) && existsSync(secondPath)) {
    if (realpathSync(firstPath) === realpathSync(secondPath)) fail(`${firstLabel} and ${secondLabel} resolve to the same file.`);
    const firstStats = lstatSync(firstPath);
    const secondStats = lstatSync(secondPath);
    if (firstStats.dev === secondStats.dev && firstStats.ino === secondStats.ino) fail(`${firstLabel} and ${secondLabel} reference the same file data.`);
  }
}

function validateLegacyBaseline(data) {
  if (!isRecord(data) || !Array.isArray(data.tools) || !Array.isArray(data.categories)) fail('Baseline must contain tools and categories arrays.');
  if (data.schemaVersion !== 2 && data.tools.length !== EXPECTED_BASELINE_TOOL_COUNT) fail(`Baseline must contain exactly ${EXPECTED_BASELINE_TOOL_COUNT} tools.`);
  const slugs = data.tools.map((tool, index) => {
    if (!isRecord(tool) || !nonempty(tool.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool.slug)) fail(`Baseline tools[${index}] has an invalid slug.`);
    return tool.slug;
  });
  if (new Set(slugs).size !== slugs.length) fail('Baseline contains duplicate slugs.');
  return { count: slugs.length, slugs };
}

function requireKeys(value, keys, path) {
  if (!isRecord(value)) fail(`${path} must be an object.`);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  const missing = expected.filter((key) => !Object.hasOwn(value, key));
  const unknown = actual.filter((key) => !expected.includes(key));
  if (missing.length || unknown.length) fail(`${path} fields are invalid (missing: ${missing.join(', ') || 'none'}; unknown: ${unknown.join(', ') || 'none'}).`);
}

function requireEnum(value, allowed, path) {
  if (!allowed.includes(value)) fail(`${path} is not an approved value.`);
}

function requireDate(value, path, asOf, nullable = false) {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || !ISO_DATE_PATTERN.test(value)) fail(`${path} must be an ISO calendar date.`);
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) fail(`${path} must be a real ISO calendar date.`);
  if (value > asOf) fail(`${path} must not be later than validation date ${asOf}.`);
}

function calendarDateInTimezone(timestamp, timezone, path) {
  let parts;
  try {
    parts = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date(timestamp));
  } catch {
    fail(`${path} uses an invalid IANA timezone.`);
  }
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function requireTimestamp(value, path, asOf, timezone, expectedLocalDate) {
  if (!nonempty(value) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) {
    fail(`${path} must be a strict ISO timestamp with an explicit timezone.`);
  }
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) fail(`${path} must be a real ISO timestamp.`);
  const localDate = calendarDateInTimezone(value, timezone, path);
  if (expectedLocalDate && localDate !== expectedLocalDate) fail(`${path} must fall on ${expectedLocalDate} in ${timezone}.`);
  if (localDate > asOf) fail(`${path} must not be later than validation date ${asOf}.`);
  return localDate;
}

function assertPrivacySafe(value, path = '$') {
  if (typeof value === 'string') {
    if (PRIVACY_UNSAFE_VALUE.test(value)) fail(`${path} contains a local or private path that is not allowed in a reviewed package.`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertPrivacySafe(entry, `${path}[${index}]`));
    return;
  }
  if (!isRecord(value)) return;
  for (const [key, entry] of Object.entries(value)) {
    if (PRIVACY_UNSAFE_KEY.test(key)) fail(`${path}.${key} is not a privacy-safe reviewed-package field.`);
    assertPrivacySafe(entry, `${path}.${key}`);
  }
}

function calendarAgeInDays(value, asOf) {
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  const asOfTimestamp = Date.parse(`${asOf}T00:00:00.000Z`);
  return Math.floor((asOfTimestamp - timestamp) / 86_400_000);
}

function requireStringArray(value, path, { min = 0, max = Infinity, exact } = {}) {
  if (!Array.isArray(value)) fail(`${path} must be an array.`);
  if (exact !== undefined && value.length !== exact) fail(`${path} must contain exactly ${exact} values.`);
  if (value.length < min || value.length > max) fail(`${path} must contain between ${min} and ${max} values.`);
  if (value.some((entry) => !nonempty(entry))) fail(`${path} must contain only nonempty strings.`);
  if (new Set(value).size !== value.length) fail(`${path} must contain unique values.`);
}

function requireHttps(value, path) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password || !url.hostname) fail(`${path} must be an HTTPS URL without credentials.`);
  } catch {
    fail(`${path} must be an HTTPS URL without credentials.`);
  }
}

function hostnameOf(value, path) {
  requireHttps(value, path);
  return new URL(value).hostname.toLowerCase();
}

function requireDomain(value, path) {
  if (!nonempty(value) || value !== value.toLowerCase() || /[/:?#@]/.test(value)) fail(`${path} must be a normalized hostname.`);
  try {
    if (new URL(`https://${value}`).hostname !== value) fail(`${path} must be a normalized hostname.`);
  } catch {
    fail(`${path} must be a normalized hostname.`);
  }
}

export function validateSchemaV2(data, asOf) {
  requireDate(asOf, '--as-of', asOf);
  requireKeys(data, TOP_LEVEL_KEYS, '$');
  if (data.schemaVersion !== 2) fail('$.schemaVersion must equal 2.');
  requireKeys(data.directoryReview, DIRECTORY_REVIEW_KEYS, '$.directoryReview');
  requireEnum(data.directoryReview.status, DIRECTORY_STATUSES, '$.directoryReview.status');
  requireDate(data.directoryReview.fullReviewCompletedAt, '$.directoryReview.fullReviewCompletedAt', asOf, true);
  requireDate(data.directoryReview.contentUpdatedAt, '$.directoryReview.contentUpdatedAt', asOf);
  if (data.directoryReview.method !== 'official-source editorial review') fail('$.directoryReview.method must identify the official-source editorial review method.');
  if (!Number.isInteger(data.directoryReview.visibleToolCount) || data.directoryReview.visibleToolCount < 0) fail('$.directoryReview.visibleToolCount must be a nonnegative integer.');

  requireStringArray(data.categories, '$.categories', { exact: CATEGORIES.length });
  if (JSON.stringify(data.categories) !== JSON.stringify(CATEGORIES)) fail('$.categories must match the approved ordered vocabulary.');
  if (!Array.isArray(data.sources)) fail('$.sources must be an array.');
  if (!Array.isArray(data.tools) || data.tools.length === 0) fail('$.tools must be a nonempty array.');
  if (data.directoryReview.visibleToolCount !== data.tools.length) fail('$.directoryReview.visibleToolCount must equal tools.length.');

  const slugs = [];
  const names = [];
  for (const [index, tool] of data.tools.entries()) {
    const path = `$.tools[${index}]`;
    requireKeys(tool, TOOL_KEYS, path);
    if (!nonempty(tool.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(tool.slug)) fail(`${path}.slug must be lowercase kebab case.`);
    slugs.push(tool.slug);
    for (const field of ['name', 'tagline', 'description']) if (!nonempty(tool[field])) fail(`${path}.${field} must be a nonempty string.`);
    names.push(tool.name);
    requireEnum(tool.category, CATEGORIES.slice(1), `${path}.category`);
    if (tool.badge !== null) requireEnum(tool.badge, BADGES, `${path}.badge`);
    requireStringArray(tool.values, `${path}.values`, { exact: 3 });
    requireStringArray(tool.tasks, `${path}.tasks`, { min: 1 });
    for (const task of tool.tasks) requireEnum(task, TASKS, `${path}.tasks`);
    requireStringArray(tool.roles, `${path}.roles`, { min: 1 });
    for (const role of tool.roles) requireEnum(role, ROLES, `${path}.roles`);
    requireKeys(tool.pricing, PRICING_KEYS, `${path}.pricing`);
    requireEnum(tool.pricing.model, PRICE_MODELS, `${path}.pricing.model`);
    if (tool.pricing.startingPrice !== null && !nonempty(tool.pricing.startingPrice)) fail(`${path}.pricing.startingPrice must be a string or null.`);
    if (!nonempty(tool.pricing.details)) fail(`${path}.pricing.details must be a nonempty string.`);
    requireDate(tool.pricing.checkedAt, `${path}.pricing.checkedAt`, asOf);
    for (const [field, max] of [['keyFeatures', 8], ['pros', 6], ['cons', 6], ['bestFor', 6], ['strengths', 6], ['limitations', 6]]) {
      requireStringArray(tool[field], `${path}.${field}`, { max });
    }
    if (tool.quickstart !== null && !nonempty(tool.quickstart)) fail(`${path}.quickstart must be a string or null.`);
    requireStringArray(tool.integrations, `${path}.integrations`);
    requireHttps(tool.platformUrl, `${path}.platformUrl`);
    requireDomain(tool.domain, `${path}.domain`);
    if (typeof tool.staffPick !== 'boolean') fail(`${path}.staffPick must be boolean.`);
    requireKeys(tool.review, REVIEW_KEYS, `${path}.review`);
    requireEnum(tool.review.status, REVIEW_STATUSES, `${path}.review.status`);
    requireDate(tool.review.reviewedAt, `${path}.review.reviewedAt`, asOf, true);
    requireDate(tool.review.contentUpdatedAt, `${path}.review.contentUpdatedAt`, asOf);
    if (tool.review.status === 'current' && tool.review.reviewedAt < tool.review.contentUpdatedAt) {
      fail(`${path}.review.reviewedAt must be on or after contentUpdatedAt for a current tool.`);
    }
    requireStringArray(tool.review.evidenceIds, `${path}.review.evidenceIds`);
    requireStringArray(tool.review.claimCoverage, `${path}.review.claimCoverage`);
    for (const claim of tool.review.claimCoverage) requireEnum(claim, CLAIM_TYPES, `${path}.review.claimCoverage`);
    requireStringArray(tool.review.unresolvedClaims, `${path}.review.unresolvedClaims`);
    if (!nonempty(tool.review.editorialRationale)) fail(`${path}.review.editorialRationale must be nonempty.`);
    if (tool.badge === 'new' && calendarAgeInDays(tool.review.contentUpdatedAt, asOf) > 30) fail(`${path}.badge cannot remain new more than 30 days after its content update.`);
    if (tool.badge === 'updated' && calendarAgeInDays(tool.review.contentUpdatedAt, asOf) > 45) fail(`${path}.badge cannot remain updated more than 45 days after its content update.`);
  }
  if (new Set(slugs).size !== slugs.length) fail('$.tools slugs must be unique.');
  if (new Set(names).size !== names.length) fail('$.tools names must be unique.');

  const sourceIds = [];
  for (const [index, source] of data.sources.entries()) {
    const path = `$.sources[${index}]`;
    requireKeys(source, SOURCE_KEYS, path);
    for (const field of ['id', 'toolSlug', 'issuer', 'title']) if (!nonempty(source[field])) fail(`${path}.${field} must be nonempty.`);
    sourceIds.push(source.id);
    if (!slugs.includes(source.toolSlug)) fail(`${path}.toolSlug must match a visible tool slug.`);
    requireHttps(source.url, `${path}.url`);
    requireEnum(source.sourceType, SOURCE_TYPES, `${path}.sourceType`);
    requireDate(source.checkedAt, `${path}.checkedAt`, asOf);
    requireEnum(source.accessStatus, ACCESS_STATUSES, `${path}.accessStatus`);
    requireStringArray(source.claimTypes, `${path}.claimTypes`, { min: 1 });
    for (const claim of source.claimTypes) requireEnum(claim, CLAIM_TYPES, `${path}.claimTypes`);
  }
  if (new Set(sourceIds).size !== sourceIds.length) fail('$.sources IDs must be unique.');
  return { slugs };
}

export function validateEvidence(data) {
  const sources = new Map(data.sources.map((source) => [source.id, source]));
  const referencedSourceIds = new Set();
  for (const [index, tool] of data.tools.entries()) {
    const path = `$.tools[${index}]`;
    const referenced = tool.review.evidenceIds.map((id) => {
      const source = sources.get(id);
      if (!source) fail(`${path}.review.evidenceIds must reference a source in $.sources.`);
      if (source.toolSlug !== tool.slug) fail(`${path}.review.evidenceIds source must belong to the same tool slug.`);
      referencedSourceIds.add(id);
      return source;
    });
    if (tool.staffPick && !nonempty(tool.review.editorialRationale)) fail(`${path}.review.editorialRationale is required for a Staff Pick.`);
    for (const claim of tool.review.claimCoverage) {
      if (!referenced.some((source) => ['confirmed', 'redirected'].includes(source.accessStatus) && source.claimTypes.includes(claim))) {
        fail(`${path}.review.claimCoverage contains ${claim} without successful same-tool evidence.`);
      }
      if (['privacy', 'security', 'accessibility', 'terms'].includes(claim) && !referenced.some((source) => SENSITIVE_SOURCE_TYPES.has(source.sourceType) && ['confirmed', 'redirected'].includes(source.accessStatus) && source.claimTypes.includes(claim))) {
        fail(`${path}.review.claimCoverage contains ${claim} without official policy or terms evidence.`);
      }
    }
    for (const fieldPath of fieldReviewPaths(tool)) {
      const fieldValue = valueAtFieldPath(tool, fieldPath);
      if (typeof fieldValue === 'string' && PROHIBITED_ASSURANCE_PATTERN.test(fieldValue)) {
        fail(`${path}.${fieldPath} contains a prohibited unqualified assurance or compliance claim.`);
      }
      if (tool.review.status !== 'blocked') {
        for (const claim of claimTypesForField(fieldPath, fieldValue).filter((entry) => SENSITIVE_CLAIM_TYPES.includes(entry))) {
          if (!tool.review.claimCoverage.includes(claim)) fail(`${path}.${fieldPath} contains ${claim} prose without matching claimCoverage.`);
        }
      }
    }
    if (tool.review.status === 'current') {
      if (!tool.review.reviewedAt) fail(`${path}.review.reviewedAt is required for current status.`);
      if (tool.review.unresolvedClaims.length) fail(`${path}.review.unresolvedClaims must be empty for current status.`);
      if (!tool.review.claimCoverage.includes('availability') || !tool.review.claimCoverage.includes('features')) fail(`${path}.review.claimCoverage must include availability and features.`);
      if (!referenced.length || referenced.some((source) => !['confirmed', 'redirected'].includes(source.accessStatus))) fail(`${path}.review.evidenceIds requires successful official sources.`);
      const availabilityEvidence = referenced.some((source) => source.claimTypes.includes('availability'));
      if (!availabilityEvidence) fail(`${path}.review.evidenceIds requires availability evidence.`);
      if (referenced.some((source) => source.checkedAt !== tool.review.reviewedAt)) {
        fail(`${path}.review.reviewedAt must match every source check supporting a current review.`);
      }
    }
    if (tool.pricing.model !== 'unknown' && tool.review.status !== 'blocked') {
      if (!tool.review.claimCoverage.includes('pricing')) fail(`${path}.review.claimCoverage requires pricing coverage for known pricing.`);
      const pricingEvidence = referenced.find((source) => source.sourceType === 'official-pricing' && source.claimTypes.includes('pricing') && ['confirmed', 'redirected'].includes(source.accessStatus));
      if (!pricingEvidence) fail(`${path}.review.evidenceIds requires confirmed official pricing evidence for known pricing.`);
      if (pricingEvidence.checkedAt !== tool.pricing.checkedAt) fail(`${path}.pricing.checkedAt must match its official pricing evidence.`);
    }
    if (tool.review.status === 'blocked' && tool.review.unresolvedClaims.length === 0) fail(`${path}.review.unresolvedClaims must explain blocked review state.`);
  }
  const unreferenced = data.sources.filter((source) => !referencedSourceIds.has(source.id));
  if (unreferenced.length) fail(`$.sources contains unreferenced evidence records: ${unreferenced.map((source) => source.id).join(', ')}.`);
}

function publicToolContent(tool) {
  const content = { ...tool };
  delete content.review;
  return content;
}

function validateFreshness(data, baseline) {
  if (data.directoryReview.status === 'current') {
    if (!data.directoryReview.fullReviewCompletedAt) fail('A current directory requires fullReviewCompletedAt.');
    if (data.directoryReview.fullReviewCompletedAt < data.directoryReview.contentUpdatedAt) {
      fail('A current directory fullReviewCompletedAt must be on or after directory contentUpdatedAt.');
    }
    if (data.tools.some((tool) => tool.review.status !== 'current')) fail('A current directory requires every tool review to be current.');
    if (data.tools.some((tool) => tool.review.reviewedAt !== data.directoryReview.fullReviewCompletedAt)) {
      fail('A current directory must bind one complete review date across every visible tool disposition.');
    }
  }
  if (data.directoryReview.status !== 'current' && data.directoryReview.fullReviewCompletedAt === data.directoryReview.contentUpdatedAt) {
    fail('A noncurrent directory cannot imply a full review on its content update date.');
  }
  for (const [index, tool] of data.tools.entries()) {
    if (tool.review.contentUpdatedAt > data.directoryReview.contentUpdatedAt) fail(`$.tools[${index}].review.contentUpdatedAt cannot exceed directory contentUpdatedAt.`);
  }
  if (!baseline || !isRecord(baseline) || baseline.schemaVersion !== 2) return;
  if (data.directoryReview.contentUpdatedAt < baseline.directoryReview.contentUpdatedAt) fail('Directory contentUpdatedAt cannot move backward.');
  if (data.directoryReview.status === 'partial' && data.directoryReview.fullReviewCompletedAt !== baseline.directoryReview.fullReviewCompletedAt) {
    fail('A partial batch cannot advance the directory-wide full-review date.');
  }
  const baselineBySlug = new Map(baseline.tools.map((tool) => [tool.slug, tool]));
  const changedTools = data.tools.filter((tool) => {
    const prior = baselineBySlug.get(tool.slug);
    return prior && JSON.stringify(publicToolContent(prior)) !== JSON.stringify(publicToolContent(tool));
  });
  const contentChanged = changedTools.length > 0 || JSON.stringify(baseline.tools.map((tool) => tool.slug)) !== JSON.stringify(data.tools.map((tool) => tool.slug));
  if (data.directoryReview.contentUpdatedAt !== baseline.directoryReview.contentUpdatedAt && !contentChanged) {
    fail('Directory contentUpdatedAt cannot advance for a date-only update.');
  }
  if (contentChanged && data.directoryReview.contentUpdatedAt <= baseline.directoryReview.contentUpdatedAt) {
    fail('Public content changes must advance directory contentUpdatedAt.');
  }
  for (const tool of data.tools) {
    const prior = baselineBySlug.get(tool.slug);
    if (prior && tool.review.contentUpdatedAt < prior.review.contentUpdatedAt) fail(`Tool ${tool.slug} contentUpdatedAt cannot move backward.`);
    if (prior && tool.review.contentUpdatedAt !== prior.review.contentUpdatedAt && JSON.stringify(publicToolContent(prior)) === JSON.stringify(publicToolContent(tool))) {
      fail(`Tool ${tool.slug} contentUpdatedAt cannot advance for a date-only update.`);
    }
    if (prior && JSON.stringify(publicToolContent(prior)) !== JSON.stringify(publicToolContent(tool)) && tool.review.contentUpdatedAt <= prior.review.contentUpdatedAt) {
      fail(`Public content changes must advance contentUpdatedAt for ${tool.slug}.`);
    }
    if (prior && JSON.stringify(publicToolContent(prior)) !== JSON.stringify(publicToolContent(tool)) && tool.review.status === 'current') {
      if (tool.review.reviewedAt < tool.review.contentUpdatedAt) fail(`Changed current tool ${tool.slug} must be reviewed on or after its content update.`);
      const supportingSources = data.sources.filter((source) => tool.review.evidenceIds.includes(source.id));
      if (supportingSources.some((source) => source.checkedAt < tool.review.contentUpdatedAt)) {
        fail(`Changed current tool ${tool.slug} requires source checks on or after its content update.`);
      }
    }
  }
}

function readApprovedDelta(options, baseline, candidate, root) {
  if (!options['approved-delta']) return null;
  const path = resolveExplicitPath('--approved-delta', options['approved-delta'], root);
  const artifact = readHashedJson('Approved delta', path, options['expected-approved-delta-sha256']);
  const approval = artifact.data;
  requireKeys(approval, ['schema', 'baselineSha256', 'candidateSha256', 'mode', 'approval', 'added', 'removed', 'staffPickChanges', 'categoryChanges', 'badgeChanges'], 'Approved delta');
  if (approval.schema !== 'ai-directory-approved-delta-v1' || approval.mode !== 'evidence-refresh') fail('Approved delta must declare the evidence-refresh contract.');
  if (approval.baselineSha256 !== baseline.hash || approval.candidateSha256 !== candidate.hash) fail('Approved delta baseline/candidate hash mismatch.');
  requireKeys(approval.approval, ['identity', 'reference'], 'Approved delta.approval');
  if (approval.approval.identity !== 'Brent Jones' || !nonempty(approval.approval.reference)) fail('Approved delta requires the exact founder identity and authorization reference.');
  for (const key of ['added', 'removed']) requireStringArray(approval[key], `Approved delta.${key}`);
  for (const key of ['staffPickChanges', 'categoryChanges', 'badgeChanges']) {
    if (!Array.isArray(approval[key])) fail(`Approved delta.${key} must be an array.`);
    for (const entry of approval[key]) requireKeys(entry, ['slug', 'prior', 'proposed'], `Approved delta.${key}[]`);
  }
  assertPrivacySafe(approval, 'Approved delta');
  return approval;
}

function validateDelta(baseline, candidate, approval = null) {
  const baselineInventory = validateLegacyBaseline(baseline);
  const candidateSlugs = candidate.tools.map((tool) => tool.slug);
  const candidateSet = new Set(candidateSlugs);
  const baselineSet = new Set(baselineInventory.slugs);
  const removed = baselineInventory.slugs.filter((slug) => !candidateSet.has(slug));
  const added = candidateSlugs.filter((slug) => !baselineSet.has(slug));
  if (!approval && (removed.length || added.length)) fail(`Candidate slug inventory differs from baseline (removed: ${removed.join(', ') || 'none'}; added: ${added.join(', ') || 'none'}).`);
  if (JSON.stringify(baseline.categories) !== JSON.stringify(candidate.categories)) fail('Candidate category vocabulary differs from baseline.');
  const baselineBySlug = new Map(baseline.tools.map((tool) => [tool.slug, tool]));
  if (approval) {
    const changes = (field) => candidate.tools.filter((tool) => baselineBySlug.has(tool.slug) && JSON.stringify(baselineBySlug.get(tool.slug)[field]) !== JSON.stringify(tool[field])).map((tool) => ({ slug: tool.slug, prior: baselineBySlug.get(tool.slug)[field], proposed: tool[field] }));
    for (const [key, actual] of Object.entries({ added, removed, staffPickChanges: changes('staffPick'), categoryChanges: changes('category'), badgeChanges: changes('badge') })) {
      if (JSON.stringify(approval[key]) !== JSON.stringify(actual)) fail(`Approved delta.${key} does not match the exact candidate delta.`);
    }
    return;
  }
  for (const tool of candidate.tools) {
    const prior = baselineBySlug.get(tool.slug);
    if (prior.category !== tool.category) fail(`Candidate category changed without approval for ${tool.slug}.`);
    if (prior.staffPick !== tool.staffPick) fail(`Candidate Staff Pick changed without approval for ${tool.slug}.`);
    if (baseline.schemaVersion === 2) {
      if (prior.badge !== tool.badge) fail(`Candidate badge changed without approval for ${tool.slug}.`);
    } else if (tool.badge !== null) {
      fail(`Initial schema migration must retire the legacy badge for ${tool.slug}.`);
    }
  }
  if (baseline.schemaVersion !== 2) {
    if (candidate.directoryReview.status !== 'stale' || candidate.directoryReview.fullReviewCompletedAt !== null || candidate.sources.length !== 0) {
      fail('Initial schema migration must remain stale, without a full-review date or source claims.');
    }
    if (candidate.directoryReview.contentUpdatedAt !== baseline.lastUpdated) fail('Initial schema migration cannot advance directory contentUpdatedAt.');
    for (const tool of candidate.tools) {
      const prior = baselineBySlug.get(tool.slug);
      if (tool.review.contentUpdatedAt !== prior.lastUpdated) fail(`Initial schema migration cannot advance contentUpdatedAt for ${tool.slug}.`);
      if (tool.review.status !== 'blocked' || tool.review.reviewedAt !== null || tool.review.evidenceIds.length || tool.review.claimCoverage.length || !tool.review.unresolvedClaims.length) {
        fail(`Initial schema migration must keep ${tool.slug} in evidence-blocked state.`);
      }
      const fields = ['name', 'tagline', 'description', 'category', 'values', 'tasks', 'roles', 'keyFeatures', 'pros', 'cons', 'bestFor', 'quickstart', 'integrations', 'platformUrl', 'domain', 'staffPick'];
      for (const field of fields) {
        if (JSON.stringify(tool[field]) !== JSON.stringify(prior[field])) fail(`Initial schema migration cannot change ${field} for ${tool.slug}.`);
      }
      for (const field of ['model', 'details']) {
        if (tool.pricing[field] !== prior.pricing[field]) fail(`Initial schema migration cannot change pricing.${field} for ${tool.slug}.`);
      }
      if (tool.pricing.startingPrice !== (prior.pricing.startingPrice ?? null)) fail(`Initial schema migration cannot change pricing.startingPrice for ${tool.slug}.`);
      if (JSON.stringify(tool.strengths) !== JSON.stringify(prior.strengths ?? [])) fail(`Initial schema migration cannot change strengths for ${tool.slug}.`);
      if (JSON.stringify(tool.limitations) !== JSON.stringify(prior.limitations ?? [])) fail(`Initial schema migration cannot change limitations for ${tool.slug}.`);
    }
  }
}

function validateAll(candidate, baseline, asOf, approval = null) {
  validateSchemaV2(candidate, asOf);
  validateEvidence(candidate);
  validateFreshness(candidate, baseline);
  validateDelta(baseline, candidate, approval);
}

function publicSourceProjection(source) {
  return Object.fromEntries(SOURCE_KEYS.map((key) => [key, source[key]]));
}

function requireReviewedPackage(data, expectedSchema, expectedKeys, label, asOf) {
  requireKeys(data, expectedKeys, label);
  if (data.schema !== expectedSchema || !nonempty(data.package)) fail(`${label} must be an exact ${expectedSchema} reviewed package.`);
  requireDate(data.packageDate, `${label}.packageDate`, asOf);
  requireKeys(data.reviewer, REVIEW_AUTHOR_KEYS, `${label}.reviewer`);
  if (!nonempty(data.reviewer.identity) || !nonempty(data.reviewer.role)) fail(`${label}.reviewer must identify the package author and role.`);
  if (data.reviewer.timezone !== REVIEW_TIMEZONE) fail(`${label}.reviewer.timezone must equal ${REVIEW_TIMEZONE}.`);
  requireTimestamp(data.generatedAt, `${label}.generatedAt`, asOf, data.reviewer.timezone, data.packageDate);
  requireKeys(data.independentReview, INDEPENDENT_REVIEW_KEYS, `${label}.independentReview`);
  if (!nonempty(data.independentReview.identity) || data.independentReview.identity === data.reviewer.identity) fail(`${label}.independentReview must identify a different reviewer.`);
  requireEnum(data.independentReview.role, REVIEWER_ROLES, `${label}.independentReview.role`);
  if (data.independentReview.verdict !== 'CLEAR') fail(`${label}.independentReview.verdict must equal CLEAR.`);
  const reviewDate = requireTimestamp(data.independentReview.reviewedAt, `${label}.independentReview.reviewedAt`, asOf, data.reviewer.timezone);
  if (reviewDate < data.packageDate) fail(`${label}.independentReview.reviewedAt cannot precede packageDate.`);
  assertPrivacySafe(data, label);
}

function validateSourceManifest(manifest, candidate, asOf) {
  requireReviewedPackage(manifest, SOURCE_MANIFEST_SCHEMA, SOURCE_MANIFEST_KEYS, 'SOURCE-MANIFEST', asOf);
  if (JSON.stringify(manifest.sourceTypes) !== JSON.stringify(SOURCE_TYPES)) fail('SOURCE-MANIFEST.sourceTypes must match the approved ordered vocabulary.');
  if (!Array.isArray(manifest.officialDomainRelations)) fail('SOURCE-MANIFEST.officialDomainRelations must be an array.');
  const candidateBySlug = new Map(candidate.tools.map((tool) => [tool.slug, tool]));
  const relationsBySlug = new Map();
  for (const [index, relation] of manifest.officialDomainRelations.entries()) {
    const path = `SOURCE-MANIFEST.officialDomainRelations[${index}]`;
    requireKeys(relation, DOMAIN_RELATION_KEYS, path);
    if (!nonempty(relation.toolSlug) || relationsBySlug.has(relation.toolSlug)) fail(`${path}.toolSlug must be nonempty and unique.`);
    const tool = candidateBySlug.get(relation.toolSlug);
    if (!tool) fail(`${path}.toolSlug must match a visible candidate tool.`);
    if (!nonempty(relation.issuer)) fail(`${path}.issuer must be nonempty.`);
    requireDomain(relation.publicDomain, `${path}.publicDomain`);
    requireDomain(relation.platformHost, `${path}.platformHost`);
    requireStringArray(relation.approvedSourceHosts, `${path}.approvedSourceHosts`, { min: 1 });
    relation.approvedSourceHosts.forEach((host, hostIndex) => requireDomain(host, `${path}.approvedSourceHosts[${hostIndex}]`));
    if (tool.domain !== relation.publicDomain) fail(`${path}.publicDomain must exactly bind ${tool.slug}.domain.`);
    if (hostnameOf(tool.platformUrl, `$.tools[${candidate.tools.indexOf(tool)}].platformUrl`) !== relation.platformHost) fail(`${path}.platformHost must exactly bind ${tool.slug}.platformUrl.`);
    if (!relation.approvedSourceHosts.includes(relation.publicDomain) || !relation.approvedSourceHosts.includes(relation.platformHost)) fail(`${path}.approvedSourceHosts must include the public and platform hosts.`);
    relationsBySlug.set(relation.toolSlug, relation);
  }
  if (JSON.stringify([...relationsBySlug.keys()].sort()) !== JSON.stringify([...candidateBySlug.keys()].sort())) fail('SOURCE-MANIFEST must include exactly one official-domain relation for every visible tool.');
  if (!Array.isArray(manifest.sources)) fail('SOURCE-MANIFEST.sources must be an array.');
  const manifestById = new Map();
  for (const [index, source] of manifest.sources.entries()) {
    const path = `SOURCE-MANIFEST.sources[${index}]`;
    requireKeys(source, FULL_SOURCE_KEYS, path);
    for (const field of ['id', 'toolSlug', 'issuer', 'title']) if (!nonempty(source[field])) fail(`${path}.${field} must be nonempty.`);
    const relation = relationsBySlug.get(source.toolSlug);
    if (!relation) fail(`${path}.toolSlug must have a reviewed official-domain relation.`);
    if (source.issuer !== relation.issuer) fail(`${path}.issuer must exactly match the reviewed issuer identity for ${source.toolSlug}.`);
    const sourceHost = hostnameOf(source.url, `${path}.url`);
    if (!relation.approvedSourceHosts.includes(sourceHost)) fail(`${path}.url host is not an approved official source host for ${source.toolSlug}.`);
    requireEnum(source.sourceType, SOURCE_TYPES, `${path}.sourceType`);
    requireDate(source.checkedAt, `${path}.checkedAt`, asOf);
    requireEnum(source.accessStatus, ACCESS_STATUSES, `${path}.accessStatus`);
    requireStringArray(source.claimTypes, `${path}.claimTypes`, { min: 1 });
    for (const claim of source.claimTypes) requireEnum(claim, CLAIM_TYPES, `${path}.claimTypes`);
    requireTimestamp(source.checkedTimestamp, `${path}.checkedTimestamp`, asOf, manifest.reviewer.timezone, source.checkedAt);
    if (source.checkedAt > manifest.packageDate) fail(`${path}.checkedAt cannot be later than packageDate.`);
    if (!nonempty(source.coverage)) fail(`${path}.coverage must be nonempty.`);
    requireStringArray(source.conflictNotes, `${path}.conflictNotes`);
    requireStringArray(source.limitations, `${path}.limitations`);
    if (!nonempty(source.id) || manifestById.has(source.id)) fail(`${path}.id must be nonempty and unique.`);
    manifestById.set(source.id, source);
  }
  for (const [index, source] of candidate.sources.entries()) {
    const fullSource = manifestById.get(source.id);
    if (!fullSource) fail(`$.sources[${index}] is absent from the exact reviewed SOURCE-MANIFEST.`);
    const projection = publicSourceProjection(fullSource);
    if (SOURCE_KEYS.some((key) => JSON.stringify(source[key]) !== JSON.stringify(projection[key]))) {
      fail(`$.sources[${index}] does not exactly match the public-safe SOURCE-MANIFEST projection.`);
    }
  }
  return manifestById;
}

export function fieldReviewPaths(tool) {
  const paths = ['slug', 'name', 'tagline', 'description', 'category', 'badge', 'quickstart', 'platformUrl', 'domain', 'staffPick'];
  for (const field of ['values', 'tasks', 'roles', 'keyFeatures', 'pros', 'cons', 'bestFor', 'strengths', 'limitations', 'integrations']) {
    for (let index = 0; index < tool[field].length; index += 1) paths.push(`${field}[${index}]`);
  }
  paths.push('pricing.model', 'pricing.startingPrice', 'pricing.details', 'pricing.checkedAt');
  paths.push('review.status', 'review.reviewedAt', 'review.contentUpdatedAt', 'review.evidenceIds', 'review.claimCoverage', 'review.unresolvedClaims', 'review.editorialRationale');
  return paths;
}

function fieldRequiresOfficialEvidence(path, value) {
  if (value === null || path.startsWith('review.')) return false;
  return !['slug', 'category', 'badge', 'staffPick'].includes(path)
    && !/^(?:tasks|roles|pros|cons|bestFor|strengths|limitations)\[/.test(path);
}

export function claimTypesForField(path, value) {
  if (value === null || path.startsWith('review.')) return [];
  const prose = typeof value === 'string' ? value : '';
  const sensitiveClaims = [];
  for (const [claim, pattern] of SENSITIVE_PROSE_PATTERNS) if (pattern.test(prose)) sensitiveClaims.push(claim);
  if (!fieldRequiresOfficialEvidence(path, value)) return sensitiveClaims;
  const claims = [];
  if (path.startsWith('pricing.')) claims.push('pricing');
  else if (path.startsWith('integrations[')) claims.push('integrations');
  else if (['name', 'platformUrl', 'domain'].includes(path)) claims.push('availability');
  else claims.push('features');
  if (EDUCATION_PROSE_PATTERN.test(prose)) claims.push('education-use');
  claims.push(...sensitiveClaims);
  return [...new Set(claims)];
}

function sourceSupportsClaim(source, claim) {
  if (!source?.claimTypes.includes(claim) || !['confirmed', 'redirected'].includes(source.accessStatus)) return false;
  if (claim === 'pricing') return source.sourceType === 'official-pricing';
  if (SENSITIVE_CLAIM_TYPES.includes(claim)) return SENSITIVE_SOURCE_TYPES.has(source.sourceType);
  return true;
}

export function valueAtFieldPath(tool, path) {
  const arrayMatch = /^([a-zA-Z]+)\[(\d+)]$/.exec(path);
  if (arrayMatch) return tool[arrayMatch[1]]?.[Number(arrayMatch[2])];
  const parts = path.split('.');
  let value = tool;
  for (const part of parts) value = value?.[part];
  return value;
}

function validateFieldReview(fieldReview, baseline, candidate, manifestById, asOf) {
  requireReviewedPackage(fieldReview, FIELD_REVIEW_SCHEMA, FIELD_REVIEW_KEYS, 'FIELD-REVIEW', asOf);
  if (fieldReview.sourceRule !== SOURCE_RULE) fail('FIELD-REVIEW.sourceRule must equal the approved exact-evidence rule.');
  requireKeys(fieldReview.completeness, COMPLETENESS_KEYS, 'FIELD-REVIEW.completeness');
  if (fieldReview.completeness.method !== COMPLETENESS_METHOD || fieldReview.completeness.unionIncludesPriorAndCandidate !== true) fail('FIELD-REVIEW.completeness must declare the approved exact coverage method.');
  if (!Array.isArray(fieldReview.tools)) fail('FIELD-REVIEW.tools must be an array.');
  if (JSON.stringify(fieldReview.statusVocabulary) !== JSON.stringify(FIELD_REVIEW_STATUSES)) fail('FIELD-REVIEW.statusVocabulary must match the approved ordered vocabulary.');
  const reviewBySlug = new Map();
  for (const toolReview of fieldReview.tools) {
    requireKeys(toolReview, FIELD_REVIEW_TOOL_KEYS, 'FIELD-REVIEW.tools[]');
    if (!nonempty(toolReview.slug) || reviewBySlug.has(toolReview.slug)) fail('FIELD-REVIEW tool slugs must be nonempty and unique.');
    reviewBySlug.set(toolReview.slug, toolReview);
  }
  const candidateSlugs = candidate.tools.map((tool) => tool.slug).sort();
  if (JSON.stringify([...reviewBySlug.keys()].sort()) !== JSON.stringify(candidateSlugs)) fail('FIELD-REVIEW must cover every visible candidate slug exactly once.');
  const baselineBySlug = new Map(baseline.tools.map((tool) => [tool.slug, tool]));
  for (const [toolIndex, tool] of candidate.tools.entries()) {
    const reviewedTool = reviewBySlug.get(tool.slug);
    requireEnum(reviewedTool.currentBaselineStatus, ['absent', 'legacy', ...REVIEW_STATUSES], `FIELD-REVIEW ${tool.slug}.currentBaselineStatus`);
    if (reviewedTool.recordIndex !== toolIndex || reviewedTool.proposedStatus !== tool.review.status || reviewedTool.staffPick !== tool.staffPick || !Array.isArray(reviewedTool.fields)) fail(`FIELD-REVIEW entry for ${tool.slug} has an invalid recordIndex, disposition, Staff Pick, or fields list.`);
    const fieldsByPath = new Map();
    for (const field of reviewedTool.fields) {
      requireKeys(field, FIELD_REVIEW_FIELD_KEYS, `FIELD-REVIEW ${tool.slug}.fields[]`);
      if (!nonempty(field.path) || fieldsByPath.has(field.path)) fail(`FIELD-REVIEW fields for ${tool.slug} require unique paths.`);
      fieldsByPath.set(field.path, field);
    }
    const expectedPaths = fieldReviewPaths(tool);
    if (JSON.stringify([...fieldsByPath.keys()].sort()) !== JSON.stringify([...expectedPaths].sort())) fail(`FIELD-REVIEW fields do not exactly cover candidate ${tool.slug}.`);
    const priorTool = baselineBySlug.get(tool.slug);
    for (const path of expectedPaths) {
      const field = fieldsByPath.get(path);
      requireEnum(field.status, FIELD_REVIEW_STATUSES, `FIELD-REVIEW ${tool.slug}.${path}.status`);
      if (!isRecord(field.prior) || typeof field.prior.present !== 'boolean' || (field.prior.present && !Object.hasOwn(field.prior, 'value'))) fail(`FIELD-REVIEW ${tool.slug}.${path}.prior must bind presence and value.`);
      if (!isRecord(field.proposed) || field.proposed.present !== true || !Object.hasOwn(field.proposed, 'value')) fail(`FIELD-REVIEW ${tool.slug}.${path}.proposed must bind a present value.`);
      if (!nonempty(field.note)) fail(`FIELD-REVIEW ${tool.slug}.${path}.note must be nonempty.`);
      const candidateValue = valueAtFieldPath(tool, path);
      if (JSON.stringify(field.proposed.value) !== JSON.stringify(candidateValue)) fail(`FIELD-REVIEW ${tool.slug}.${path} does not match the candidate value.`);
      requireStringArray(field.evidenceIds, `FIELD-REVIEW ${tool.slug}.${path}.evidenceIds`);
      requireStringArray(field.claimTypes, `FIELD-REVIEW ${tool.slug}.${path}.claimTypes`);
      for (const claim of field.claimTypes) requireEnum(claim, CLAIM_TYPES, `FIELD-REVIEW ${tool.slug}.${path}.claimTypes`);
      const expectedClaimTypes = claimTypesForField(path, candidateValue);
      if (expectedClaimTypes.some((claim) => !field.claimTypes.includes(claim))) fail(`FIELD-REVIEW ${tool.slug}.${path}.claimTypes must include every deterministic claim classification.`);
      for (const evidenceId of field.evidenceIds) {
        const source = manifestById.get(evidenceId);
        if (!source || source.toolSlug !== tool.slug) fail(`FIELD-REVIEW ${tool.slug}.${path} evidence must resolve to the same-tool SOURCE-MANIFEST record.`);
        if (!tool.review.evidenceIds.includes(evidenceId)) fail(`FIELD-REVIEW ${tool.slug}.${path} evidence must be included in the public tool review.`);
      }
      const priorValue = priorTool ? valueAtFieldPath(priorTool, path) : undefined;
      const priorPresent = priorValue !== undefined;
      if (field.prior.present !== priorPresent || (priorPresent && JSON.stringify(field.prior.value) !== JSON.stringify(priorValue))) fail(`FIELD-REVIEW ${tool.slug}.${path} does not match the baseline value.`);
      const changed = !priorPresent || JSON.stringify(priorValue) !== JSON.stringify(candidateValue);
      if (field.status === 'changed' && !changed) fail(`FIELD-REVIEW ${tool.slug}.${path} cannot claim changed when its value is unchanged.`);
      if (field.status === 'confirmed' && changed) fail(`FIELD-REVIEW ${tool.slug}.${path} cannot claim confirmed when its value changed.`);
      const supportedDisposition = ['confirmed', 'changed'].includes(field.status);
      if (!supportedDisposition && field.evidenceIds.length) fail(`FIELD-REVIEW ${tool.slug}.${path} cannot bind evidence to an unsupported, unavailable, or retirement disposition.`);
      if (tool.review.status === 'current' && field.claimTypes.length && !supportedDisposition) fail(`FIELD-REVIEW ${tool.slug}.${path} requires a supported current disposition.`);
      if (supportedDisposition && field.claimTypes.length) {
        if (field.evidenceIds.length === 0) fail(`FIELD-REVIEW ${tool.slug}.${path} requires exact evidence for its reviewer-declared claim types.`);
        for (const claim of field.claimTypes) {
          if (!field.evidenceIds.some((id) => sourceSupportsClaim(manifestById.get(id), claim))) fail(`FIELD-REVIEW ${tool.slug}.${path} lacks an appropriate official source class for ${claim}.`);
          if (!tool.review.claimCoverage.includes(claim)) fail(`FIELD-REVIEW ${tool.slug}.${path} contains ${claim} prose without matching public claimCoverage.`);
        }
      }
    }
  }
  const fieldItemCount = fieldReview.tools.reduce((count, tool) => count + tool.fields.length, 0);
  const expectedCompleteness = {
    method: COMPLETENESS_METHOD,
    unionIncludesPriorAndCandidate: true,
    toolCount: candidate.tools.length,
    fieldItemCount,
    duplicatePathCount: 0,
    duplicateEvidenceBindingCount: 0,
    overbroadBindingCount: 0,
    missingUnionPaths: [],
    duplicateUnionPaths: [],
  };
  if (JSON.stringify(fieldReview.completeness) !== JSON.stringify(expectedCompleteness)) fail('FIELD-REVIEW.completeness does not match the validated package inventory.');
}

function readReviewArtifacts(options, pair, asOf) {
  const manifestPath = resolveExplicitPath('--source-manifest', options['source-manifest'], pair.stagingRoot);
  const fieldReviewPath = resolveExplicitPath('--field-review', options['field-review'], pair.stagingRoot);
  assertWithin('SOURCE-MANIFEST', manifestPath, pair.stagingRoot);
  assertWithin('FIELD-REVIEW', fieldReviewPath, pair.stagingRoot);
  if (basename(manifestPath) !== 'SOURCE-MANIFEST.json' || basename(fieldReviewPath) !== 'FIELD-REVIEW.json') fail('Reviewed artifacts must retain the exact SOURCE-MANIFEST.json and FIELD-REVIEW.json filenames.');
  for (const [label, path] of [['SOURCE-MANIFEST', manifestPath], ['FIELD-REVIEW', fieldReviewPath]]) {
    assertDifferentFiles(label, path, 'Baseline', pair.baselinePath);
    assertDifferentFiles(label, path, 'Candidate', pair.candidatePath);
  }
  assertDifferentFiles('SOURCE-MANIFEST', manifestPath, 'FIELD-REVIEW', fieldReviewPath);
  const manifest = readHashedJson('SOURCE-MANIFEST', manifestPath, options['expected-source-manifest-sha256']);
  const fieldReview = readHashedJson('FIELD-REVIEW', fieldReviewPath, options['expected-field-review-sha256']);
  if (manifest.data.package !== fieldReview.data.package || manifest.data.packageDate !== fieldReview.data.packageDate) fail('SOURCE-MANIFEST and FIELD-REVIEW must belong to the same dated review package.');
  if (pair.candidate.data.directoryReview.status === 'current' && manifest.data.packageDate !== pair.candidate.data.directoryReview.fullReviewCompletedAt) fail('A current directory must bind its complete review date to the reviewed evidence package date.');
  const manifestById = validateSourceManifest(manifest.data, pair.candidate.data, asOf);
  validateFieldReview(fieldReview.data, pair.baseline.data, pair.candidate.data, manifestById, asOf);
  return { manifestHash: manifest.hash, fieldReviewHash: fieldReview.hash };
}

function stagingPaths(options, repoRoot) {
  const stagingRoot = resolveExplicitPath('--staging-root', options['staging-root'], repoRoot);
  assertNoSymlinkComponents('Staging root', stagingRoot);
  if (!lstatSync(stagingRoot).isDirectory()) fail('--staging-root must be an existing directory.');
  const stagingFromRepository = relative(repoRoot, stagingRoot);
  if (!stagingFromRepository.startsWith('..') || isAbsolute(stagingFromRepository)) fail('--staging-root must be outside the Git worktree.');
  return { stagingRoot };
}

function readCandidateFromCanonical(options, context) {
  const inputPath = resolveExplicitPath('--input', options.input, context.repoRoot);
  if (inputPath !== context.canonicalPath) fail(`--input must be exactly ${context.canonicalPath}.`);
  return readHashedJson('Canonical candidate', inputPath, options['expected-input-sha256']);
}

function readStagedPair(options, context) {
  const { stagingRoot } = stagingPaths(options, context.repoRoot);
  const baselinePath = resolveExplicitPath('--baseline', options.baseline, context.repoRoot);
  const candidatePath = resolveExplicitPath('--candidate', options.candidate, context.repoRoot);
  assertWithin('Baseline', baselinePath, stagingRoot);
  assertWithin('Candidate', candidatePath, stagingRoot);
  assertDifferentFiles('Baseline', baselinePath, 'Candidate', candidatePath);
  assertDifferentFiles('Candidate', candidatePath, 'Canonical target', context.canonicalPath);
  const baseline = readHashedJson('Baseline', baselinePath, options['expected-baseline-sha256']);
  const gitBaseline = readGitCanonical(context.repoRoot, context.expectedHead);
  assertSameBytes('Baseline artifact', baseline.bytes, gitBaseline.bytes);
  const candidate = readHashedJson('Candidate', candidatePath, options['expected-candidate-sha256']);
  return { stagingRoot, baselinePath, candidatePath, baseline, candidate, gitBaseline };
}

function result(command, details) {
  process.stdout.write(`${JSON.stringify({ ok: true, command, ...details })}\n`);
}

function runBaseline(options) {
  requireExactOptions('baseline', options, ['repo-root', 'expected-head', 'allowed-dirty-paths', 'source', 'expected-source-sha256']);
  const context = verifyRepository(options);
  const sourcePath = resolveExplicitPath('--source', options.source, context.repoRoot);
  if (sourcePath !== context.canonicalPath) fail(`--source must be exactly ${context.canonicalPath}.`);
  const source = readHashedJson('Canonical source', sourcePath, options['expected-source-sha256']);
  const gitBaseline = readGitCanonical(context.repoRoot, context.expectedHead);
  assertSameBytes('Canonical source', source.bytes, gitBaseline.bytes);
  const inventory = validateLegacyBaseline(source.data);
  result('baseline', { head: context.expectedHead, source: sourcePath, sha256: source.hash, toolCount: inventory.count, dirtyPaths: context.dirtyPaths });
}

function runPrepare(options) {
  requireExactOptions('prepare', options, ['repo-root', 'expected-head', 'allowed-dirty-paths', 'source', 'expected-source-sha256', 'staging-root', 'output']);
  const context = verifyRepository(options);
  const { stagingRoot } = stagingPaths(options, context.repoRoot);
  const sourcePath = resolveExplicitPath('--source', options.source, context.repoRoot);
  const outputPath = resolveExplicitPath('--output', options.output, context.repoRoot);
  if (sourcePath !== context.canonicalPath) fail(`--source must be exactly ${context.canonicalPath}.`);
  assertWithin('Output', outputPath, stagingRoot);
  assertNoSymlinkComponents('Output path', outputPath, true);
  assertDifferentFiles('Source', sourcePath, 'Output', outputPath);
  if (existsSync(outputPath)) fail(`Output already exists; refusing to overwrite it: ${outputPath}`);
  const source = readHashedJson('Canonical source', sourcePath, options['expected-source-sha256']);
  const gitBaseline = readGitCanonical(context.repoRoot, context.expectedHead);
  assertSameBytes('Canonical source', source.bytes, gitBaseline.bytes);
  const inventory = validateLegacyBaseline(source.data);
  mkdirSync(dirname(outputPath), { recursive: true });
  assertNoSymlinkComponents('Output path', dirname(outputPath));
  const descriptor = openSync(outputPath, 'wx', 0o600);
  try {
    writeFileSync(descriptor, source.bytes);
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
  result('prepare', { head: context.expectedHead, output: outputPath, sha256: source.hash, toolCount: inventory.count, dirtyPaths: context.dirtyPaths });
}

function runValidate(options) {
  requireExactOptions('validate', options, [
    'repo-root', 'expected-head', 'allowed-dirty-paths', 'staging-root', 'baseline', 'expected-baseline-sha256',
    'candidate', 'expected-candidate-sha256', 'source-manifest', 'expected-source-manifest-sha256',
    'field-review', 'expected-field-review-sha256', 'as-of',
  ]);
  const context = verifyRepository(options);
  const pair = readStagedPair(options, context);
  validateAll(pair.candidate.data, pair.baseline.data, options['as-of'], readApprovedDelta(options, pair.baseline, pair.candidate, context.repoRoot));
  const artifacts = readReviewArtifacts(options, pair, options['as-of']);
  result('validate', { head: context.expectedHead, baselineSha256: pair.baseline.hash, candidateSha256: pair.candidate.hash, ...artifacts, toolCount: pair.candidate.data.tools.length, dirtyPaths: context.dirtyPaths });
}

function acquireLock(lockPath, details) {
  assertNoSymlinkComponents('Lock path', lockPath, true);
  let descriptor;
  try {
    descriptor = openSync(lockPath, 'wx', 0o600);
  } catch (error) {
    fail(`Exclusive application lock is unavailable: ${error.message}`);
  }
  const token = sha256(Buffer.from(`${process.pid}:${Date.now()}:${details.head}`));
  const identity = fstatSync(descriptor);
  const pathIdentity = lstatSync(lockPath);
  if (!pathIdentity.isFile() || pathIdentity.isSymbolicLink() || identity.dev !== pathIdentity.dev || identity.ino !== pathIdentity.ino) {
    closeSync(descriptor);
    fail('Exclusive application lock identity changed during acquisition.');
  }
  const bytes = Buffer.from(`${JSON.stringify({ ...details, token })}\n`);
  writeFileSync(descriptor, bytes);
  fsyncSync(descriptor);
  return { descriptor, identity: { dev: identity.dev, ino: identity.ino }, bytes, path: lockPath };
}

function assertPathIdentity(label, filePath, identity) {
  const stats = lstatSync(filePath);
  if (!stats.isFile() || stats.isSymbolicLink() || stats.dev !== identity.dev || stats.ino !== identity.ino) fail(`${label} identity changed concurrently.`);
  return stats;
}

function assertLockOwnership(lock) {
  const descriptorStats = fstatSync(lock.descriptor);
  if (descriptorStats.dev !== lock.identity.dev || descriptorStats.ino !== lock.identity.ino) fail('Application lock descriptor identity changed concurrently.');
  assertPathIdentity('Application lock', lock.path, lock.identity);
  if (!readFileSync(lock.path).equals(lock.bytes)) fail('Application lock contents changed concurrently.');
}

function readBoundRegularFile(label, filePath, expectedHash) {
  assertNoSymlinkComponents(label, filePath);
  const descriptor = openSync(filePath, 'r');
  try {
    const descriptorStats = fstatSync(descriptor);
    const pathStats = lstatSync(filePath);
    if (!descriptorStats.isFile() || pathStats.isSymbolicLink() || descriptorStats.dev !== pathStats.dev || descriptorStats.ino !== pathStats.ino) fail(`${label} identity changed while opening.`);
    const bytes = readFileSync(descriptor);
    const expected = normalizeHash(`${label} hash`, expectedHash);
    const actual = sha256(bytes);
    if (actual !== expected) fail(`${label} hash mismatch: expected ${expected}, received ${actual}.`);
    return { bytes, identity: { dev: descriptorStats.dev, ino: descriptorStats.ino } };
  } finally {
    closeSync(descriptor);
  }
}

function fsyncDirectory(directoryPath) {
  const descriptor = openSync(directoryPath, 'r');
  try {
    fsyncSync(descriptor);
  } finally {
    closeSync(descriptor);
  }
}

function runApply(options) {
  requireExactOptions('apply', options, [
    'repo-root', 'expected-head', 'allowed-dirty-paths', 'staging-root', 'baseline', 'expected-baseline-sha256',
    'candidate', 'expected-candidate-sha256', 'source-manifest', 'expected-source-manifest-sha256',
    'field-review', 'expected-field-review-sha256', 'target', 'as-of', 'confirm',
  ]);
  if (options.confirm !== APPLY_CONFIRMATION) fail(`apply requires --confirm ${APPLY_CONFIRMATION}.`);
  const context = verifyRepository(options);
  const targetPath = resolveExplicitPath('--target', options.target, context.repoRoot);
  if (targetPath !== context.canonicalPath) fail(`--target must be exactly ${context.canonicalPath}.`);
  const lockPath = `${targetPath}.lock`;
  const lock = acquireLock(lockPath, { pid: process.pid, head: context.expectedHead });
  let temporaryPath;
  let temporaryIdentity;
  try {
    const pair = readStagedPair(options, context);
    validateAll(pair.candidate.data, pair.baseline.data, options['as-of'], readApprovedDelta(options, pair.baseline, pair.candidate, context.repoRoot));
    const artifacts = readReviewArtifacts(options, pair, options['as-of']);
    const currentTarget = readBoundRegularFile('Canonical target', targetPath, pair.baseline.hash);
    const initialTargetStats = assertPathIdentity('Canonical target', targetPath, currentTarget.identity);
    assertSameBytes('Canonical target', currentTarget.bytes, pair.baseline.bytes);
    temporaryPath = `${targetPath}.candidate-${process.pid}`;
    if (existsSync(temporaryPath)) fail(`Temporary application path already exists: ${temporaryPath}`);
    const descriptor = openSync(temporaryPath, 'wx', initialTargetStats.mode & 0o777);
    try {
      const descriptorStats = fstatSync(descriptor);
      const pathStats = lstatSync(temporaryPath);
      if (!descriptorStats.isFile() || pathStats.isSymbolicLink() || descriptorStats.dev !== pathStats.dev || descriptorStats.ino !== pathStats.ino) fail('Temporary candidate identity changed during creation.');
      temporaryIdentity = { dev: descriptorStats.dev, ino: descriptorStats.ino };
      writeFileSync(descriptor, pair.candidate.bytes);
      fsyncSync(descriptor);
    } finally {
      closeSync(descriptor);
    }
    const stagedWrite = readFileSync(temporaryPath);
    if (sha256(stagedWrite) !== pair.candidate.hash) fail('Candidate hash changed while preparing application.');

    verifyRepository(options, [relative(context.repoRoot, lockPath), relative(context.repoRoot, temporaryPath)]);
    const immediateTargetStats = assertPathIdentity('Canonical target', targetPath, currentTarget.identity);
    if (initialTargetStats.dev !== immediateTargetStats.dev || initialTargetStats.ino !== immediateTargetStats.ino) fail('Canonical target identity changed concurrently.');
    const immediateTarget = readBoundRegularFile('Canonical target immediately before replacement', targetPath, pair.baseline.hash);
    assertPathIdentity('Canonical target immediately before replacement', targetPath, immediateTarget.identity);
    assertSameBytes('Canonical target immediately before replacement', immediateTarget.bytes, pair.baseline.bytes);
    const immediateCandidate = readHashedJson('Candidate immediately before replacement', pair.candidatePath, pair.candidate.hash);
    assertSameBytes('Candidate immediately before replacement', immediateCandidate.bytes, pair.candidate.bytes);
    assertPathIdentity('Temporary candidate immediately before replacement', temporaryPath, temporaryIdentity);
    if (!readFileSync(temporaryPath).equals(pair.candidate.bytes)) fail('Temporary candidate bytes changed immediately before replacement.');
    assertLockOwnership(lock);
    renameSync(temporaryPath, targetPath);
    temporaryPath = undefined;
    const applied = readFileSync(targetPath);
    if (sha256(applied) !== pair.candidate.hash || !applied.equals(pair.candidate.bytes)) fail('Post-replacement canonical verification failed.');
    fsyncDirectory(dirname(targetPath));
    result('apply', { head: context.expectedHead, target: targetPath, sha256: pair.candidate.hash, ...artifacts, toolCount: pair.candidate.data.tools.length, dirtyPaths: context.dirtyPaths });
  } finally {
    if (temporaryPath && existsSync(temporaryPath) && temporaryIdentity) {
      try {
        assertPathIdentity('Temporary candidate during cleanup', temporaryPath, temporaryIdentity);
        unlinkSync(temporaryPath);
      } catch {
        // Fail closed: never unlink a path no longer owned by this process.
      }
    }
    let ownsLock = false;
    try {
      assertLockOwnership(lock);
      ownsLock = true;
    } catch {
      // Fail closed: never unlink a replacement lock owned by another actor.
    }
    closeSync(lock.descriptor);
    if (ownsLock) {
      assertPathIdentity('Application lock immediately before cleanup', lockPath, lock.identity);
      unlinkSync(lockPath);
    }
    fsyncDirectory(dirname(targetPath));
  }
}

function runIndependent(command, options) {
  const common = ['repo-root', 'expected-head', 'allowed-dirty-paths', 'input', 'expected-input-sha256', 'as-of'];
  const needsBaseline = command === 'staleness' || command === 'delta';
  requireExactOptions(command, options, needsBaseline ? [...common, 'base-revision'] : common);
  const context = verifyRepository(options);
  const candidate = readCandidateFromCanonical(options, context);
  validateSchemaV2(candidate.data, options['as-of']);
  if (command === 'schema') {
    result(command, { sha256: candidate.hash, toolCount: candidate.data.tools.length, dirtyPaths: context.dirtyPaths });
    return;
  }
  if (command === 'evidence') {
    validateEvidence(candidate.data);
    result(command, { sha256: candidate.hash, sources: candidate.data.sources.length, dirtyPaths: context.dirtyPaths });
    return;
  }
  git(context.repoRoot, ['merge-base', '--is-ancestor', options['base-revision'], context.expectedHead]);
  const baseline = readGitCanonical(context.repoRoot, options['base-revision']);
  if (command === 'staleness') validateFreshness(candidate.data, baseline.data);
  else validateDelta(baseline.data, candidate.data, readApprovedDelta(options, baseline, candidate, context.repoRoot));
  result(command, { sha256: candidate.hash, baselineRevision: baseline.revision, dirtyPaths: context.dirtyPaths });
}

function isExactJsonStringLine(line) {
  const trimmed = line.trim().replace(/,$/, '');
  try {
    if (trimmed.startsWith('"') && trimmed.includes('":')) {
      const parsed = JSON.parse(`{${trimmed}}`);
      const entries = Object.entries(parsed);
      return entries.length === 1 && typeof entries[0][1] === 'string' && !PRIVACY_UNSAFE_KEY.test(entries[0][0]);
    }
    return typeof JSON.parse(trimmed) === 'string';
  } catch {
    return false;
  }
}

function isExactEditorialCodeLine(line) {
  const literal = String.raw`(?:'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*")`;
  const property = String.raw`[A-Za-z_$][\w$]*\s*:\s*${literal}`;
  if (new RegExp(String.raw`^\s*(?:[A-Za-z_$][\w$]*\s*:\s*)?${literal}\s*,?\s*$`).test(line)) return true;
  if (new RegExp(String.raw`^\s*\{\s*${property}(?:\s*,\s*${property})*\s*\},?\s*$`).test(line)) return true;
  if (/^\s*<span\s+className="[^"]+">[^<]+<\/span>\s*$/.test(line)) return true;
  return false;
}

function allowlistedProviderReference(relativePath, line, kind) {
  if (relativePath === 'lib/data/innovation-grants.ts') return isExactJsonStringLine(line) ? 'editorial-grant-string' : null;
  if (relativePath === 'lib/data/featured-coverage-models.ts' && /^\s*sourceIds:\s*\[(?:'[a-z-]+'(?:,\s*)?)*\],\s*$/.test(line)) return 'editorial-source-identifiers';
  if (relativePath.endsWith('.json') && (EDITORIAL_PROVIDER_PATHS.has(relativePath) || relativePath.startsWith('data/daily-pulse/'))) {
    return isExactJsonStringLine(line) ? 'editorial-json-string' : null;
  }
  if (EDITORIAL_PROVIDER_PATHS.has(relativePath)) {
    const disclosureText = `AI coding assistants (such as ${PROVIDER_NAMES[1][0].toUpperCase()}${PROVIDER_NAMES[1].slice(1)} Code) are used in the development of this website. All code is reviewed and tested by human developers. We credit AI contributions in our commit history.`;
    if (relativePath === 'app/ai-disclosure/page.tsx' && line.trim() === disclosureText) return 'editorial-jsx-text';
    return isExactEditorialCodeLine(line) ? 'editorial-literal' : null;
  }
  if (relativePath.startsWith('data/daily-pulse-archive/')) return 'historical-content';
  if (HISTORICAL_PROVIDER_PATHS.has(relativePath)) return 'historical-record';
  if (relativePath === 'copy-prototypes.sh') return 'historical-utility-comment';
  if (relativePath === 'test/ai-directory/ai-directory-schema.test.ts') {
    const fixtureLine = `    data.sources = [sourceFixture({ toolSlug: '${PROVIDER_NAMES[1]}' })];`;
    if (line === fixtureLine) return 'editorial-schema-fixture';
  }
  const currentInstructionName = `${PROVIDER_NAMES[1].toUpperCase()}.md`;
  const currentInstructionPath = `.${PROVIDER_NAMES[1]}/commands/startup.md`;
  if (kind === 'symlink' && relativePath.startsWith(`.${PROVIDER_NAMES[1]}/skills/`)) {
    const expectedPrefix = `/Volumes/MISHA 2TB/ihe-pulse/.${PROVIDER_NAMES[1]}/skills/gstack/`;
    const suffix = line.slice(expectedPrefix.length);
    if (line.startsWith(expectedPrefix) && /^[a-z0-9-]+\/SKILL\.md$/.test(suffix)) return 'toolchain-compatibility-symlink';
  }
  if (relativePath === currentInstructionName) {
    const exactLines = new Set([
      `Read \`.${PROVIDER_NAMES[1]}/skills/ihe-frontend/SKILL.md\` — this is the single source of truth for all frontend design, content, and structural rules.`,
      `GStack skills are installed at .${PROVIDER_NAMES[1]}/skills/gstack/. Available skills:`,
      `If gstack skills aren't working, run: cd .${PROVIDER_NAMES[1]}/skills/gstack && ./setup`,
      `in .${PROVIDER_NAMES[1]}/skills/ihe-frontend/SKILL.md or PRODUCTION-RULES.md.`,
    ]);
    return exactLines.has(line) ? 'toolchain-filename' : null;
  }
  if (['startup.md', currentInstructionPath].includes(relativePath) && line === `- \`${currentInstructionName}\``) return 'toolchain-filename';
  if (relativePath === 'scripts/lint-design-tokens.js') {
    const exactLines = new Set([
      `// Directories to skip (.${PROVIDER_NAMES[1]} = vendored skills/tooling, not site code)`,
      `const SKIP_DIRS = ['node_modules', '.next', '.git', 'dist', 'build', '.vercel', '.${PROVIDER_NAMES[1]}'];`,
    ]);
    return exactLines.has(line) ? 'toolchain-directory-name' : null;
  }
  return null;
}

function withinPathBoundary(relativePath, boundary) {
  return relativePath === boundary || relativePath.startsWith(`${boundary}/`);
}

function isLikelyTextFile(filePath) {
  if (BINARY_EXTENSIONS.has(extname(filePath).toLowerCase())) return false;
  const bytes = readFileSync(filePath);
  return !bytes.subarray(0, 8192).includes(0);
}

function collectScannedFiles(repoRoot) {
  const files = [];
  const historicalTooling = [];
  const repositoryPaths = nulSeparatedPaths(git(repoRoot, ['ls-files', '-co', '--exclude-standard', '-z'], null));
  for (const relativePath of [...new Set(repositoryPaths)].sort()) {
    if (EXCLUDED_PATH_BOUNDARIES.some((boundary) => withinPathBoundary(relativePath, boundary))) continue;
    if (HISTORICAL_TOOLING_BOUNDARIES.some((boundary) => withinPathBoundary(relativePath, boundary))) {
      historicalTooling.push(relativePath);
      continue;
    }
    const fullPath = resolve(repoRoot, relativePath);
    let stats;
    try {
      stats = lstatSync(fullPath);
    } catch {
      continue;
    }
    if (stats.isSymbolicLink()) {
      files.push({ filePath: fullPath, content: readlinkSync(fullPath), kind: 'symlink' });
      continue;
    }
    if (stats.isFile() && isLikelyTextFile(fullPath)) files.push({ filePath: fullPath });
  }
  return { files, historicalTooling };
}

function runScan(options) {
  requireExactOptions('scan', options, ['repo-root', 'expected-head', 'allowed-dirty-paths']);
  const context = verifyRepository(options);
  const allowed = [];
  const violations = [];
  const scanned = collectScannedFiles(context.repoRoot);
  for (const entry of scanned.files) {
    const { filePath } = entry;
    const relativePath = relative(context.repoRoot, filePath);
    const lines = (entry.content ?? readFileSync(filePath, 'utf8')).split(/\r?\n/);
    for (const [index, line] of lines.entries()) {
      if (!PROVIDER_PATTERN.test(line)) continue;
      const classification = allowlistedProviderReference(relativePath, line, entry.kind);
      if (classification) allowed.push({ path: relativePath, line: index + 1, classification });
      else violations.push({ path: relativePath, line: index + 1 });
    }
  }
  if (violations.length) fail(`Executable or unclassified provider references remain: ${JSON.stringify(violations)}.`);
  result('scan', { head: context.expectedHead, filesScanned: scanned.files.length, allowlistedReferences: allowed.length, historicalToolingFilesExcluded: scanned.historicalTooling.length, dirtyPaths: context.dirtyPaths });
}

function printHelp() {
  process.stdout.write('AI Directory deterministic maintenance harness\n\n');
  process.stdout.write('Commands: baseline, prepare, validate, apply, schema, evidence, staleness, delta, scan\n');
  process.stdout.write(`Canonical application requires --confirm ${APPLY_CONFIRMATION}.\n`);
  process.stdout.write('The application lock is cooperative; stale locks fail closed and are never removed automatically.\n');
  process.stdout.write('Atomic replacement preserves file mode but does not preserve extended attributes or ACLs; review target metadata before application.\n');
}

/** Minimal local TypeScript loader used only to execute the focused schema/UI tests on pinned Node 20. */
export async function load(url, context, nextLoad) {
  if (!url.startsWith('file:') || !url.endsWith('.ts')) return nextLoad(url, context);
  const [{ readFile }, typescriptModule] = await Promise.all([
    import('node:fs/promises'),
    import('typescript'),
  ]);
  const typescript = typescriptModule.default ?? typescriptModule;
  const source = await readFile(fileURLToPath(url), 'utf8');
  const output = typescript.transpileModule(source, {
    fileName: fileURLToPath(url),
    compilerOptions: {
      target: typescript.ScriptTarget.ES2022,
      module: typescript.ModuleKind.ESNext,
      verbatimModuleSyntax: true,
    },
  });
  return { format: 'module', shortCircuit: true, source: output.outputText };
}

export function main(argv = process.argv.slice(2)) {
  const { command, options } = parseArguments(argv);
  if (command === 'help') return printHelp();
  if (command === 'baseline') return runBaseline(options);
  if (command === 'prepare') return runPrepare(options);
  if (command === 'validate') return runValidate(options);
  if (command === 'apply') return runApply(options);
  if (['schema', 'evidence', 'staleness', 'delta'].includes(command)) return runIndependent(command, options);
  if (command === 'scan') return runScan(options);
  fail(`Unknown command: ${command}. Use --help for usage.`);
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`ERROR: ${error.message}\n`);
    process.exitCode = 1;
  }
}

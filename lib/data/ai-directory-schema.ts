/**
 * The public AI Directory contract.
 *
 * This module deliberately contains no I/O, network access, provider code, or
 * date-now calls. It is shared by the runtime pages and the deterministic
 * repository tests so that the JSON file has one executable contract.
 */

export const AI_DIRECTORY_SCHEMA_VERSION = 2 as const;

export const AI_DIRECTORY_CATEGORIES = [
  'All',
  'General LLMs',
  'Lesson Planning',
  'Grading & Assessment',
  'Research',
  'Writing & Feedback',
  'Presentations',
  'Image & Video',
  'Productivity',
  'Student Tools',
  'Gamification',
  'Avatars',
  'Music',
  'Text to Speech',
] as const;

export const AI_DIRECTORY_TASKS = [
  'Administration',
  'Assessment',
  'Content Creation',
  'General LLM',
  'Grading',
  'Lesson Planning',
  'Note-Taking',
  'Presentations',
  'Research',
  'Student Engagement',
  'Video & Media',
  'Writing Feedback',
] as const;

export const AI_DIRECTORY_ROLES = ['faculty', 'administrator', 'student'] as const;
export const AI_DIRECTORY_PRICING_MODELS = [
  'free',
  'freemium',
  'paid',
  'institutional-quote',
  'unknown',
] as const;
export const AI_DIRECTORY_BADGES = ['new', 'updated'] as const;
export const AI_DIRECTORY_REVIEW_STATUSES = [
  'current',
  'limited',
  'retire-candidate',
  'blocked',
] as const;
export const AI_DIRECTORY_DIRECTORY_STATUSES = ['current', 'partial', 'stale'] as const;
export const AI_DIRECTORY_SOURCE_TYPES = [
  'official-product',
  'official-pricing',
  'official-education',
  'official-documentation',
  'official-policy',
  'official-status',
  'official-terms',
] as const;
export const AI_DIRECTORY_ACCESS_STATUSES = [
  'confirmed',
  'redirected',
  'blocked',
  'not-found',
] as const;

export type AiDirectoryCategory = (typeof AI_DIRECTORY_CATEGORIES)[number];
export type AiDirectoryTask = (typeof AI_DIRECTORY_TASKS)[number];
export type AiDirectoryRole = (typeof AI_DIRECTORY_ROLES)[number];
export type AiDirectoryPricingModel = (typeof AI_DIRECTORY_PRICING_MODELS)[number];
export type AiDirectoryBadge = (typeof AI_DIRECTORY_BADGES)[number];
export type AiDirectoryReviewStatus = (typeof AI_DIRECTORY_REVIEW_STATUSES)[number];
export type AiDirectoryDirectoryStatus = (typeof AI_DIRECTORY_DIRECTORY_STATUSES)[number];
export type AiDirectorySourceType = (typeof AI_DIRECTORY_SOURCE_TYPES)[number];
export type AiDirectoryAccessStatus = (typeof AI_DIRECTORY_ACCESS_STATUSES)[number];

export interface AiDirectoryReview {
  status: AiDirectoryReviewStatus;
  reviewedAt: string | null;
  contentUpdatedAt: string;
  evidenceIds: string[];
  claimCoverage: string[];
  unresolvedClaims: string[];
  editorialRationale: string;
}

export interface AiDirectoryPricing {
  model: AiDirectoryPricingModel;
  startingPrice: string | null;
  details: string;
  checkedAt: string;
}

export interface AiDirectoryTool {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: Exclude<AiDirectoryCategory, 'All'>;
  badge: AiDirectoryBadge | null;
  values: [string, string, string];
  tasks: AiDirectoryTask[];
  roles: AiDirectoryRole[];
  pricing: AiDirectoryPricing;
  keyFeatures: string[];
  pros: string[];
  cons: string[];
  bestFor: string[];
  strengths: string[];
  limitations: string[];
  quickstart: string | null;
  integrations: string[];
  platformUrl: string;
  domain: string;
  staffPick: boolean;
  review: AiDirectoryReview;
}

export interface AiDirectorySource {
  id: string;
  toolSlug: string;
  issuer: string;
  title: string;
  url: string;
  sourceType: AiDirectorySourceType;
  checkedAt: string;
  accessStatus: AiDirectoryAccessStatus;
  claimTypes: string[];
}

export interface AiDirectoryData {
  schemaVersion: typeof AI_DIRECTORY_SCHEMA_VERSION;
  directoryReview: {
    status: AiDirectoryDirectoryStatus;
    fullReviewCompletedAt: string | null;
    contentUpdatedAt: string;
    method: string;
    visibleToolCount: number;
  };
  categories: string[];
  sources: AiDirectorySource[];
  tools: AiDirectoryTool[];
}

export interface AiDirectoryValidationIssue {
  path: string;
  message: string;
}

export interface AiDirectoryValidationResult {
  valid: boolean;
  issues: AiDirectoryValidationIssue[];
}

export interface AiDirectoryValidationOptions {
  /**
   * Optional fixed as-of date for deterministic future-date checks. Callers
   * that need reproducible validation should always provide this value.
   */
  asOfDate?: string;
}

const TOP_LEVEL_KEYS = [
  'schemaVersion',
  'directoryReview',
  'categories',
  'sources',
  'tools',
] as const;

const DIRECTORY_REVIEW_KEYS = [
  'status',
  'fullReviewCompletedAt',
  'contentUpdatedAt',
  'method',
  'visibleToolCount',
] as const;

const SOURCE_KEYS = [
  'id',
  'toolSlug',
  'issuer',
  'title',
  'url',
  'sourceType',
  'checkedAt',
  'accessStatus',
  'claimTypes',
] as const;

const TOOL_KEYS = [
  'slug',
  'name',
  'tagline',
  'description',
  'category',
  'badge',
  'values',
  'tasks',
  'roles',
  'pricing',
  'keyFeatures',
  'pros',
  'cons',
  'bestFor',
  'strengths',
  'limitations',
  'quickstart',
  'integrations',
  'platformUrl',
  'domain',
  'staffPick',
  'review',
] as const;

const PRICING_KEYS = ['model', 'startingPrice', 'details', 'checkedAt'] as const;
const REVIEW_KEYS = [
  'status',
  'reviewedAt',
  'contentUpdatedAt',
  'evidenceIds',
  'claimCoverage',
  'unresolvedClaims',
  'editorialRationale',
] as const;

const CURRENTLY_SUPPORTED_CLAIM_TYPES = new Set([
  'availability',
  'pricing',
  'features',
  'education-use',
  'integrations',
  'privacy',
  'security',
  'accessibility',
  'terms',
  'status',
]);
const SENSITIVE_CLAIM_TYPES = new Set(['privacy', 'security', 'accessibility', 'terms']);
const SENSITIVE_SOURCE_TYPES = new Set<AiDirectorySourceType>(['official-policy', 'official-terms']);
const SENSITIVE_PROSE_PATTERNS = new Map([
  ['privacy', /\b(?:privacy|private data|data retention|data sharing|personal data|FERPA|GDPR|COPPA)\b/i],
  ['security', /\b(?:security|secure|encrypted|encryption|SOC\s*2|HIPAA|compliance)\b/i],
  ['accessibility', /\b(?:accessibility|accessible|WCAG|screen reader)\b/i],
  ['terms', /\b(?:terms of (?:service|use)|legal(?:ly)?|license agreement|copyright)\b/i],
] as const);
const PROHIBITED_ASSURANCE_PATTERN = /(?:\b(?:FERPA|GDPR|COPPA|HIPAA|SOC\s*2|WCAG)\s+(?:compliant|certified)\b|\b(?:fully|guaranteed)\s+(?:secure|accessible|compliant)\b|\bguarantees?\s+compliance\b)/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[], path: string, issues: AiDirectoryValidationIssue[]) {
  const allowed = new Set(keys);
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) {
      issues.push({ path: `${path}.${key}`, message: 'unknown field is not allowed' });
    }
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function isHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password;
  } catch {
    return false;
  }
}

function isNormalizedDomain(value: unknown): value is string {
  if (typeof value !== 'string' || value.trim() !== value || value.length === 0) return false;
  try {
    const url = new URL(`https://${value}`);
    return url.hostname === value.toLowerCase() && !url.pathname.slice(1) && !url.search && !url.hash;
  } catch {
    return false;
  }
}

function isOneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && values.includes(value as T);
}

function validateStringArray(
  value: unknown,
  path: string,
  issues: AiDirectoryValidationIssue[],
  options: { min?: number; max?: number; exact?: number; unique?: boolean } = {},
): value is string[] {
  if (!Array.isArray(value)) {
    issues.push({ path, message: 'must be an array' });
    return false;
  }
  if (options.exact !== undefined && value.length !== options.exact) {
    issues.push({ path, message: `must contain exactly ${options.exact} values` });
  }
  if (options.min !== undefined && value.length < options.min) {
    issues.push({ path, message: `must contain at least ${options.min} values` });
  }
  if (options.max !== undefined && value.length > options.max) {
    issues.push({ path, message: `must contain no more than ${options.max} values` });
  }
  value.forEach((entry, index) => {
    if (!isNonEmptyString(entry)) {
      issues.push({ path: `${path}[${index}]`, message: 'must be a non-empty string' });
    }
  });
  if (options.unique !== false && new Set(value).size !== value.length) {
    issues.push({ path, message: 'must contain unique values' });
  }
  return true;
}

function addDateIssueIfNeeded(
  value: unknown,
  path: string,
  issues: AiDirectoryValidationIssue[],
  asOfDate: string | undefined,
) {
  if (!isIsoDate(value)) {
    issues.push({ path, message: 'must be a valid ISO calendar date (YYYY-MM-DD)' });
    return;
  }
  if (asOfDate && isIsoDate(asOfDate) && value > asOfDate) {
    issues.push({ path, message: `must not be later than validation date ${asOfDate}` });
  }
}

function validateSource(
  value: unknown,
  index: number,
  toolSlugs: Set<string>,
  sourcesById: Map<string, AiDirectorySource>,
  options: AiDirectoryValidationOptions,
  issues: AiDirectoryValidationIssue[],
) {
  const path = `sources[${index}]`;
  if (!isRecord(value)) {
    issues.push({ path, message: 'must be an object' });
    return;
  }
  hasOnlyKeys(value, SOURCE_KEYS, path, issues);
  for (const key of SOURCE_KEYS) {
    if (!(key in value)) issues.push({ path: `${path}.${key}`, message: 'is required' });
  }
  const source = value as Partial<AiDirectorySource>;
  if (!isNonEmptyString(source.id)) issues.push({ path: `${path}.id`, message: 'must be a non-empty string' });
  if (isNonEmptyString(source.id)) {
    if (sourcesById.has(source.id)) issues.push({ path: `${path}.id`, message: 'must be unique' });
    else sourcesById.set(source.id, source as AiDirectorySource);
  }
  if (!isNonEmptyString(source.toolSlug) || !toolSlugs.has(source.toolSlug)) {
    issues.push({ path: `${path}.toolSlug`, message: 'must match a visible tool slug' });
  }
  for (const field of ['issuer', 'title'] as const) {
    if (!isNonEmptyString(source[field])) issues.push({ path: `${path}.${field}`, message: 'must be a non-empty string' });
  }
  if (!isHttpsUrl(source.url)) issues.push({ path: `${path}.url`, message: 'must be an HTTPS URL' });
  if (!isOneOf(AI_DIRECTORY_SOURCE_TYPES, source.sourceType)) {
    issues.push({ path: `${path}.sourceType`, message: 'is not an approved source type' });
  }
  addDateIssueIfNeeded(source.checkedAt, `${path}.checkedAt`, issues, options.asOfDate);
  if (!isOneOf(AI_DIRECTORY_ACCESS_STATUSES, source.accessStatus)) {
    issues.push({ path: `${path}.accessStatus`, message: 'is not an approved access status' });
  }
  if (validateStringArray(source.claimTypes, `${path}.claimTypes`, issues, { min: 1 })) {
    source.claimTypes.forEach((claimType, claimIndex) => {
      if (!CURRENTLY_SUPPORTED_CLAIM_TYPES.has(claimType)) {
        issues.push({ path: `${path}.claimTypes[${claimIndex}]`, message: 'is not an approved claim type' });
      }
    });
  }
}

function validatePricing(
  value: unknown,
  path: string,
  options: AiDirectoryValidationOptions,
  issues: AiDirectoryValidationIssue[],
) {
  if (!isRecord(value)) {
    issues.push({ path, message: 'must be an object' });
    return;
  }
  hasOnlyKeys(value, PRICING_KEYS, path, issues);
  for (const key of PRICING_KEYS) {
    if (!(key in value)) issues.push({ path: `${path}.${key}`, message: 'is required' });
  }
  const pricing = value as Partial<AiDirectoryPricing>;
  if (!isOneOf(AI_DIRECTORY_PRICING_MODELS, pricing.model)) {
    issues.push({ path: `${path}.model`, message: 'is not an approved pricing model' });
  }
  if (pricing.startingPrice !== null && !isNonEmptyString(pricing.startingPrice)) {
    issues.push({ path: `${path}.startingPrice`, message: 'must be a string or null' });
  }
  if (!isNonEmptyString(pricing.details)) issues.push({ path: `${path}.details`, message: 'must be a non-empty string' });
  addDateIssueIfNeeded(pricing.checkedAt, `${path}.checkedAt`, issues, options.asOfDate);
}

function validateReview(
  value: unknown,
  path: string,
  sourcesById: Map<string, AiDirectorySource>,
  toolSlug: string,
  options: AiDirectoryValidationOptions,
  issues: AiDirectoryValidationIssue[],
) {
  if (!isRecord(value)) {
    issues.push({ path, message: 'must be an object' });
    return;
  }
  hasOnlyKeys(value, REVIEW_KEYS, path, issues);
  for (const key of REVIEW_KEYS) {
    if (!(key in value)) issues.push({ path: `${path}.${key}`, message: 'is required' });
  }
  const review = value as Partial<AiDirectoryReview>;
  if (!isOneOf(AI_DIRECTORY_REVIEW_STATUSES, review.status)) {
    issues.push({ path: `${path}.status`, message: 'is not an approved review status' });
  }
  if (review.reviewedAt !== null) {
    addDateIssueIfNeeded(review.reviewedAt, `${path}.reviewedAt`, issues, options.asOfDate);
  }
  addDateIssueIfNeeded(review.contentUpdatedAt, `${path}.contentUpdatedAt`, issues, options.asOfDate);
  if (validateStringArray(review.evidenceIds, `${path}.evidenceIds`, issues)) {
    for (const [index, evidenceId] of review.evidenceIds.entries()) {
      const source = sourcesById.get(evidenceId);
      if (source && source.toolSlug !== toolSlug) {
        issues.push({ path: `${path}.evidenceIds[${index}]`, message: 'source must belong to the same tool slug' });
      }
    }
  }
  if (validateStringArray(review.claimCoverage, `${path}.claimCoverage`, issues)) {
    for (const [index, claimType] of review.claimCoverage.entries()) {
      if (!CURRENTLY_SUPPORTED_CLAIM_TYPES.has(claimType)) {
        issues.push({ path: `${path}.claimCoverage[${index}]`, message: 'is not an approved claim type' });
      }
    }
  }
  if (!validateStringArray(review.unresolvedClaims, `${path}.unresolvedClaims`, issues)) return;
  if (!isNonEmptyString(review.editorialRationale)) {
    issues.push({ path: `${path}.editorialRationale`, message: 'must be a non-empty string' });
  }
  if (review.status === 'current') {
    if (review.reviewedAt === null) issues.push({ path: `${path}.reviewedAt`, message: 'is required for a current review' });
    if (review.evidenceIds?.length === 0) issues.push({ path: `${path}.evidenceIds`, message: 'current reviews require official-source evidence' });
    if (review.unresolvedClaims.length > 0) issues.push({ path: `${path}.unresolvedClaims`, message: 'current reviews cannot contain unresolved claims' });
  } else if (review.status === 'blocked' && review.unresolvedClaims.length === 0) {
    issues.push({ path: `${path}.unresolvedClaims`, message: 'blocked reviews must explain what remains unresolved' });
  }
}

function validateTool(
  value: unknown,
  index: number,
  categories: Set<string>,
  sourcesById: Map<string, AiDirectorySource>,
  options: AiDirectoryValidationOptions,
  issues: AiDirectoryValidationIssue[],
): string | null {
  const path = `tools[${index}]`;
  if (!isRecord(value)) {
    issues.push({ path, message: 'must be an object' });
    return null;
  }
  hasOnlyKeys(value, TOOL_KEYS, path, issues);
  for (const key of TOOL_KEYS) {
    if (!(key in value)) issues.push({ path: `${path}.${key}`, message: 'is required' });
  }
  const tool = value as Partial<AiDirectoryTool>;
  const slug = isNonEmptyString(tool.slug) ? tool.slug : null;
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    issues.push({ path: `${path}.slug`, message: 'must be a lowercase kebab-case slug' });
  }
  for (const field of ['name', 'tagline', 'description'] as const) {
    if (!isNonEmptyString(tool[field])) issues.push({ path: `${path}.${field}`, message: 'must be a non-empty string' });
  }
  if (!isNonEmptyString(tool.category) || (tool.category as string) === 'All' || !categories.has(tool.category)) {
    issues.push({ path: `${path}.category`, message: 'must match one non-All directory category' });
  }
  if (tool.badge !== null && !isOneOf(AI_DIRECTORY_BADGES, tool.badge)) {
    issues.push({ path: `${path}.badge`, message: 'must be new, updated, or null; trending is retired' });
  }
  validateStringArray(tool.values, `${path}.values`, issues, { exact: 3 });
  if (Array.isArray(tool.tasks)) {
    if (tool.tasks.length === 0) issues.push({ path: `${path}.tasks`, message: 'must contain at least one task' });
    if (new Set(tool.tasks).size !== tool.tasks.length) issues.push({ path: `${path}.tasks`, message: 'must contain unique values' });
    tool.tasks.forEach((task, taskIndex) => {
      if (!isOneOf(AI_DIRECTORY_TASKS, task)) issues.push({ path: `${path}.tasks[${taskIndex}]`, message: 'is not an approved task' });
    });
  } else {
    issues.push({ path: `${path}.tasks`, message: 'must be an array' });
  }
  if (Array.isArray(tool.roles)) {
    if (tool.roles.length === 0) issues.push({ path: `${path}.roles`, message: 'must contain at least one role' });
    if (new Set(tool.roles).size !== tool.roles.length) issues.push({ path: `${path}.roles`, message: 'must contain unique values' });
    tool.roles.forEach((role, roleIndex) => {
      if (!isOneOf(AI_DIRECTORY_ROLES, role)) issues.push({ path: `${path}.roles[${roleIndex}]`, message: 'is not an approved role' });
    });
  } else {
    issues.push({ path: `${path}.roles`, message: 'must be an array' });
  }
  validatePricing(tool.pricing, `${path}.pricing`, options, issues);
  for (const [field, max] of [
    ['keyFeatures', 8],
    ['pros', 6],
    ['cons', 6],
    ['bestFor', 6],
    ['strengths', 6],
    ['limitations', 6],
  ] as const) {
    validateStringArray(tool[field], `${path}.${field}`, issues, { max });
  }
  if (tool.quickstart !== null && !isNonEmptyString(tool.quickstart)) {
    issues.push({ path: `${path}.quickstart`, message: 'must be a non-empty string or null' });
  }
  validateStringArray(tool.integrations, `${path}.integrations`, issues);
  if (!isHttpsUrl(tool.platformUrl)) issues.push({ path: `${path}.platformUrl`, message: 'must be an HTTPS URL' });
  if (!isNormalizedDomain(tool.domain)) issues.push({ path: `${path}.domain`, message: 'must be a normalized hostname' });
  if (typeof tool.staffPick !== 'boolean') issues.push({ path: `${path}.staffPick`, message: 'must be a boolean' });
  if (slug) validateReview(tool.review, `${path}.review`, sourcesById, slug, options, issues);
  return slug;
}

/** Validate a parsed public directory envelope without reading files or using the network. */
export function validateAiDirectoryData(
  value: unknown,
  options: AiDirectoryValidationOptions = {},
): AiDirectoryValidationResult {
  const issues: AiDirectoryValidationIssue[] = [];
  if (!isRecord(value)) return { valid: false, issues: [{ path: '$', message: 'must be an object' }] };
  hasOnlyKeys(value, TOP_LEVEL_KEYS, '$', issues);
  for (const key of TOP_LEVEL_KEYS) {
    if (!(key in value)) issues.push({ path: `$.${key}`, message: 'is required' });
  }
  const directoryReview = isRecord(value.directoryReview)
    ? value.directoryReview as Partial<AiDirectoryData['directoryReview']>
    : null;
  if (value.schemaVersion !== AI_DIRECTORY_SCHEMA_VERSION) {
    issues.push({ path: '$.schemaVersion', message: `must equal ${AI_DIRECTORY_SCHEMA_VERSION}` });
  }
  if (!directoryReview) {
    issues.push({ path: '$.directoryReview', message: 'must be an object' });
  } else {
    hasOnlyKeys(directoryReview as Record<string, unknown>, DIRECTORY_REVIEW_KEYS, '$.directoryReview', issues);
    for (const key of DIRECTORY_REVIEW_KEYS) {
      if (!(key in directoryReview)) issues.push({ path: `$.directoryReview.${key}`, message: 'is required' });
    }
    if (!isOneOf(AI_DIRECTORY_DIRECTORY_STATUSES, directoryReview.status)) {
      issues.push({ path: '$.directoryReview.status', message: 'is not an approved directory status' });
    }
    if (directoryReview.fullReviewCompletedAt !== null) {
      addDateIssueIfNeeded(directoryReview.fullReviewCompletedAt, '$.directoryReview.fullReviewCompletedAt', issues, options.asOfDate);
    }
    addDateIssueIfNeeded(directoryReview.contentUpdatedAt, '$.directoryReview.contentUpdatedAt', issues, options.asOfDate);
    if (directoryReview.method !== 'official-source editorial review') issues.push({ path: '$.directoryReview.method', message: 'must identify the official-source editorial review method' });
    if (typeof directoryReview.visibleToolCount !== 'number' || !Number.isInteger(directoryReview.visibleToolCount) || directoryReview.visibleToolCount < 0) {
      issues.push({ path: '$.directoryReview.visibleToolCount', message: 'must be a non-negative integer' });
    }
  }
  const categories = Array.isArray(value.categories) ? value.categories : [];
  if (!Array.isArray(value.categories)) issues.push({ path: '$.categories', message: 'must be an array' });
  else {
    validateStringArray(value.categories, '$.categories', issues, { min: 1 });
    if (new Set(value.categories).size !== value.categories.length) issues.push({ path: '$.categories', message: 'must contain unique values' });
    if (value.categories[0] !== 'All') issues.push({ path: '$.categories', message: 'must start with All' });
    value.categories.forEach((category, index) => {
      if (!isOneOf(AI_DIRECTORY_CATEGORIES, category)) issues.push({ path: `$.categories[${index}]`, message: 'is not an approved category' });
    });
  }
  if (!Array.isArray(value.sources)) issues.push({ path: '$.sources', message: 'must be an array' });
  if (!Array.isArray(value.tools)) issues.push({ path: '$.tools', message: 'must be an array' });
  const tools = Array.isArray(value.tools) ? value.tools : [];
  const toolSlugs = new Set<string>();
  const sourcesById = new Map<string, AiDirectorySource>();
  const categorySet = new Set(categories.filter((category): category is string => typeof category === 'string'));
  tools.forEach((tool, index) => {
    const slug = validateTool(tool, index, categorySet, sourcesById, options, issues);
    if (slug) {
      if (toolSlugs.has(slug)) issues.push({ path: `tools[${index}].slug`, message: 'must be unique' });
      toolSlugs.add(slug);
    }
  });
  if (Array.isArray(value.sources)) {
    // Sources are validated after tools have been collected so source-to-slug
    // mismatches are deterministic and do not depend on record ordering.
    sourcesById.clear();
    value.sources.forEach((source, index) => validateSource(source, index, toolSlugs, sourcesById, options, issues));
  }
  // Re-check evidence references after all sources are known. Tool validation
  // above intentionally only checks shape and same-slug relationships.
  tools.forEach((tool, index) => {
    if (!isRecord(tool) || !isRecord(tool.review) || !Array.isArray(tool.review.evidenceIds)) return;
    for (const [evidenceIndex, evidenceId] of tool.review.evidenceIds.entries()) {
      const source = sourcesById.get(evidenceId);
      if (!source) issues.push({ path: `tools[${index}].review.evidenceIds[${evidenceIndex}]`, message: 'must reference a source in sources' });
      else if (source.toolSlug !== tool.slug) issues.push({ path: `tools[${index}].review.evidenceIds[${evidenceIndex}]`, message: 'source must belong to the same tool slug' });
    }
    const typedTool = tool as Partial<AiDirectoryTool>;
    const review = typedTool.review as Partial<AiDirectoryReview>;
    const pricing: Partial<AiDirectoryPricing> = isRecord(typedTool.pricing) ? typedTool.pricing : {};
    const referencedSources = Array.isArray(review.evidenceIds)
      ? review.evidenceIds.map((evidenceId) => sourcesById.get(evidenceId)).filter((source): source is AiDirectorySource => Boolean(source))
      : [];
    if (Array.isArray(review.claimCoverage)) {
      for (const claim of review.claimCoverage) {
        const successfulClaimSources = referencedSources.filter((source) => ['confirmed', 'redirected'].includes(source.accessStatus) && source.claimTypes.includes(claim));
        if (successfulClaimSources.length === 0) issues.push({ path: `tools[${index}].review.claimCoverage`, message: `${claim} requires successful same-tool evidence` });
        if (SENSITIVE_CLAIM_TYPES.has(claim) && !successfulClaimSources.some((source) => SENSITIVE_SOURCE_TYPES.has(source.sourceType))) {
          issues.push({ path: `tools[${index}].review.claimCoverage`, message: `${claim} requires official policy or terms evidence` });
        }
      }
    }
    const publicValues: unknown[] = [typedTool.name, typedTool.tagline, typedTool.description, typedTool.values, typedTool.keyFeatures, typedTool.pros, typedTool.cons, typedTool.bestFor, typedTool.strengths, typedTool.limitations, typedTool.quickstart, typedTool.integrations, pricing.details, review.unresolvedClaims, review.editorialRationale];
    const prose = publicValues.flatMap((value) => Array.isArray(value) ? value : [value]).filter((value): value is string => typeof value === 'string');
    for (const text of prose) {
      if (PROHIBITED_ASSURANCE_PATTERN.test(text)) issues.push({ path: `tools[${index}]`, message: 'contains a prohibited unqualified assurance or compliance claim' });
      if (review.status !== 'blocked') {
        for (const [claim, pattern] of SENSITIVE_PROSE_PATTERNS) {
          if (pattern.test(text) && (!Array.isArray(review.claimCoverage) || !review.claimCoverage.includes(claim))) {
            issues.push({ path: `tools[${index}].review.claimCoverage`, message: `${claim} prose requires matching claim coverage` });
          }
        }
      }
    }
    if (review.status === 'current') {
      if (!Array.isArray(review.claimCoverage) || !review.claimCoverage.includes('availability') || !review.claimCoverage.includes('features')) {
        issues.push({ path: `tools[${index}].review.claimCoverage`, message: 'current reviews require availability and features coverage' });
      }
      if (referencedSources.length === 0 || referencedSources.some((source) => !['confirmed', 'redirected'].includes(source.accessStatus))) {
        issues.push({ path: `tools[${index}].review.evidenceIds`, message: 'current reviews require only successful official-source evidence' });
      }
      if (isIsoDate(review.reviewedAt) && isIsoDate(review.contentUpdatedAt) && review.reviewedAt < review.contentUpdatedAt) {
        issues.push({ path: `tools[${index}].review.reviewedAt`, message: 'must be on or after contentUpdatedAt for a current review' });
      }
      if (isIsoDate(review.reviewedAt) && referencedSources.some((source) => source.checkedAt !== review.reviewedAt)) {
        issues.push({ path: `tools[${index}].review.reviewedAt`, message: 'must match every source check supporting a current review' });
      }
    }
    if (review.status !== 'blocked' && pricing.model !== 'unknown') {
      if (!Array.isArray(review.claimCoverage) || !review.claimCoverage.includes('pricing')) {
        issues.push({ path: `tools[${index}].review.claimCoverage`, message: 'current priced tools require pricing coverage' });
      }
      if (Array.isArray(review.evidenceIds)) {
        const pricingSource = referencedSources.find((source) => source.sourceType === 'official-pricing' && ['confirmed', 'redirected'].includes(source.accessStatus) && source.claimTypes.includes('pricing'));
        const hasPricingEvidence = Boolean(pricingSource);
        if (!hasPricingEvidence) {
          issues.push({ path: `tools[${index}].review.evidenceIds`, message: 'current priced tools require confirmed official pricing evidence' });
        } else if (isIsoDate(pricing.checkedAt) && pricingSource?.checkedAt !== pricing.checkedAt) {
          issues.push({ path: `tools[${index}].pricing.checkedAt`, message: 'must match its official pricing evidence' });
        }
      }
    }
  });
  const referencedSourceIds = new Set(tools.flatMap((tool) => isRecord(tool) && isRecord(tool.review) && Array.isArray(tool.review.evidenceIds)
    ? tool.review.evidenceIds.filter((id): id is string => typeof id === 'string')
    : []));
  for (const [sourceId] of sourcesById) {
    if (!referencedSourceIds.has(sourceId)) issues.push({ path: '$.sources', message: `contains unreferenced evidence record ${sourceId}` });
  }
  if (directoryReview && typeof directoryReview.visibleToolCount === 'number' && Number.isInteger(directoryReview.visibleToolCount) && directoryReview.visibleToolCount !== tools.length) {
    issues.push({ path: '$.directoryReview.visibleToolCount', message: 'must equal tools.length' });
  }
  const directoryContentUpdatedAt = directoryReview?.contentUpdatedAt;
  if (isIsoDate(directoryContentUpdatedAt)) {
    tools.forEach((tool, index) => {
      if (!isRecord(tool) || !isRecord(tool.review) || !isIsoDate(tool.review.contentUpdatedAt)) return;
      if (tool.review.contentUpdatedAt > directoryContentUpdatedAt) {
        issues.push({ path: `tools[${index}].review.contentUpdatedAt`, message: 'cannot advance beyond directory contentUpdatedAt without a directory content update' });
      }
    });
  }
  if (directoryReview && directoryReview.status === 'current') {
    if (directoryReview.fullReviewCompletedAt === null) issues.push({ path: '$.directoryReview.fullReviewCompletedAt', message: 'is required for a current directory' });
    if (isIsoDate(directoryReview.fullReviewCompletedAt) && isIsoDate(directoryReview.contentUpdatedAt) && directoryReview.fullReviewCompletedAt < directoryReview.contentUpdatedAt) {
      issues.push({ path: '$.directoryReview.fullReviewCompletedAt', message: 'must be on or after directory contentUpdatedAt' });
    }
    for (const [index, tool] of tools.entries()) {
      if (isRecord(tool) && isRecord(tool.review) && tool.review.status !== 'current') {
        issues.push({ path: `tools[${index}].review.status`, message: 'all tools must be current when directory status is current' });
      }
      if (isRecord(tool) && isRecord(tool.review) && tool.review.reviewedAt !== directoryReview.fullReviewCompletedAt) {
        issues.push({ path: `tools[${index}].review.reviewedAt`, message: 'must match the directory fullReviewCompletedAt date' });
      }
    }
  } else if (directoryReview && directoryReview.fullReviewCompletedAt === directoryReview.contentUpdatedAt) {
    issues.push({ path: '$.directoryReview.fullReviewCompletedAt', message: 'a noncurrent directory cannot imply a full review on its content update date' });
  }
  return { valid: issues.length === 0, issues };
}

export function assertValidAiDirectoryData(value: unknown, options: AiDirectoryValidationOptions = {}): asserts value is AiDirectoryData {
  const result = validateAiDirectoryData(value, options);
  if (!result.valid) {
    const details = result.issues.map((issue) => `${issue.path}: ${issue.message}`).join('\n');
    throw new Error(`AI Directory data failed schema validation:\n${details}`);
  }
}

export function formatAiDirectoryDate(value: string | null): string | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );
}

export function getAiDirectoryReviewLabel(review: Pick<AiDirectoryReview, 'status' | 'reviewedAt'>): string {
  if (review.status === 'current' && review.reviewedAt) {
    return `Reviewed ${formatAiDirectoryDate(review.reviewedAt)}`;
  }
  if (review.status === 'limited') return 'Limited review';
  if (review.status === 'retire-candidate') return 'Retire candidate';
  return 'Review pending';
}

export function compareAiDirectoryReviewDates(a: AiDirectoryTool, b: AiDirectoryTool): number {
  const aDate = a.review.reviewedAt;
  const bDate = b.review.reviewedAt;
  if (aDate === bDate) return a.name.localeCompare(b.name);
  if (!aDate) return 1;
  if (!bDate) return -1;
  return bDate.localeCompare(aDate);
}

export function compareAiDirectoryContentDates(a: AiDirectoryTool, b: AiDirectoryTool): number {
  const dateComparison = b.review.contentUpdatedAt.localeCompare(a.review.contentUpdatedAt);
  return dateComparison || a.name.localeCompare(b.name);
}

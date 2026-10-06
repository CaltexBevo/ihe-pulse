/** Local design-review state. Deliberately separate from the enrollment schema. */
export type ReviewEmailChoices = { pulse: boolean; grants: boolean };
export type ReviewCriterion = 'roles' | 'types' | 'interests' | 'locations';
export type ReviewCriteria = Record<ReviewCriterion, string[]>;

export function isSignupReviewHost(hostname: string): boolean {
  return ['localhost', '127.0.0.1', '[::1]'].includes(hostname);
}

export function reviewStepAfterIdentity(choices: ReviewEmailChoices): 'criteria' | 'complete' | null {
  if (!choices.pulse && !choices.grants) return null;
  return choices.grants ? 'criteria' : 'complete';
}

export function changeReviewSelection(current: string[], value: string, checked: boolean): string[] {
  return checked ? [...new Set([...current, value])] : current.filter((item) => item !== value);
}

export const REVIEW_GRANT_TYPES = [
  { id: 'institutional', label: 'Institutional grants', shortLabel: 'Institutional' },
  { id: 'individual-through-institution', label: 'Individual awards through an institution', shortLabel: 'Through an institution' },
  { id: 'direct-individual', label: 'Awards directly to individuals', shortLabel: 'Direct individual' },
] as const;

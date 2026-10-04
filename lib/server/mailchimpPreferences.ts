import 'server-only';
import { parseGrantAlertPreferences, type GrantAlertPreferences } from '../grantAlertPreferences.ts';

export type EmailPreferences = { pulse: boolean; grants: boolean };
export function parseEmailPreferences(value: unknown): EmailPreferences | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const p = value as Record<string, unknown>;
  return typeof p.pulse === 'boolean' && typeof p.grants === 'boolean' && (p.pulse || p.grants)
    ? { pulse: p.pulse, grants: p.grants } : null;
}

export function preferenceMergeFields(preferences: EmailPreferences, criteria: GrantAlertPreferences, now = new Date()) {
  return {
    IHEPULSE: preferences.pulse ? 'YES' : 'NO', IHEGRANTS: preferences.grants ? 'YES' : 'NO',
    IHEAUD: criteria.audiences.join(','), IHELOC: criteria.locations.join(','),
    IHEAREA: criteria.areas.join(','), IHEMIN: criteria.minimumAwardUsd === null ? '' : String(criteria.minimumAwardUsd),
    IHESTART: now.toISOString(),
  };
}

export function readStoredGrantCriteria(fields: Record<string, unknown>): GrantAlertPreferences | null {
  const list = (value: unknown) => typeof value === 'string' && Buffer.byteLength(value) <= 255
    ? (value === '' ? [] : value.split(',')) : null;
  const audiences = list(fields.IHEAUD), locations = list(fields.IHELOC), areas = list(fields.IHEAREA);
  const amount = fields.IHEMIN;
  if (!audiences || !locations || !areas || !(typeof amount === 'string' || typeof amount === 'number')) return null;
  if (typeof amount === 'string' && amount !== '' && !/^\d+$/.test(amount)) return null;
  const result = parseGrantAlertPreferences({ audiences, locations, areas, minimumAwardUsd: amount === '' ? null : Number(amount) });
  return result.ok ? result.preferences : null;
}

// Keep audience-hosted signup forms isolated. The six editable fields are
// selected separately in the secure preferences center; IHESTART stays hidden.
export const PREFERENCE_FIELDS = [
  { tag: 'IHEPULSE', name: 'Receive Innovation Pulse', type: 'dropdown', options: { choices: ['YES', 'NO'] }, public: false },
  { tag: 'IHEGRANTS', name: 'Receive weekly grant alerts', type: 'dropdown', options: { choices: ['YES', 'NO'] }, public: false },
  { tag: 'IHEAUD', name: 'Grant institution types', type: 'text', public: false },
  { tag: 'IHELOC', name: 'Grant locations', type: 'text', public: false },
  { tag: 'IHEAREA', name: 'Grant focus areas', type: 'text', public: false },
  { tag: 'IHEMIN', name: 'Minimum per-award USD (blank for any)', type: 'text', public: false },
  { tag: 'IHESTART', name: 'Website signup UTC', type: 'text', public: false },
].map(field => ({ ...field, required: false }));

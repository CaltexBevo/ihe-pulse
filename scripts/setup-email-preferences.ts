import { pathToFileURL } from 'node:url';
import { PREFERENCE_FIELDS } from '../lib/server/mailchimpPreferences.ts';
import { MailchimpMarketing } from '../lib/server/mailchimpMarketing.ts';

export async function setupEmailPreferences(client: MailchimpMarketing, apply = false) {
  const existing = await client.all(`/lists/${client.listId}/merge-fields`, 'merge_fields');
  const missing = [];
  for (const field of PREFERENCE_FIELDS) {
    const found = existing.find(item => item.tag === field.tag);
    if (found) {
      if (found.type !== field.type || found.public !== field.public || found.required !== false ||
        ('options' in field && JSON.stringify((found.options as { choices?: unknown })?.choices) !== JSON.stringify(field.options?.choices))) {
        throw new Error(`Existing ${field.tag} configuration conflicts; no existing field was overwritten.`);
      }
    } else missing.push(field);
  }
  if (apply) for (const field of missing) await client.request(`/lists/${client.listId}/merge-fields`, 'POST', field);
  return { mode: apply ? 'apply' : 'dry-run', missing: missing.map(f => f.tag), existing: PREFERENCE_FIELDS.length - missing.length };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  if (!args.length) console.log(JSON.stringify({ mode: 'offline-plan', fields: PREFERENCE_FIELDS }, null, 2));
  else if (args.length === 1 && ['--check', '--apply'].includes(args[0])) {
    setupEmailPreferences(new MailchimpMarketing(process.env), args[0] === '--apply')
      .then(result => console.log(JSON.stringify(result))).catch(() => { console.error('Email preference setup failed. No secret or subscriber details are logged.'); process.exitCode = 1; });
  } else { console.error('Usage: setup-email-preferences.ts [--check|--apply]'); process.exitCode = 1; }
}

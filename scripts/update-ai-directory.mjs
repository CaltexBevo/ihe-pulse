#!/usr/bin/env node

/**
 * AI Directory Monthly Update Script
 *
 * Uses the Anthropic API (Claude claude-sonnet-4-5-20250929) to:
 * 1. Check each existing app for pricing/feature changes
 * 2. Suggest 2-3 new AI-for-education apps worth adding
 * 3. Write the updated data back and generate an update log
 *
 * Designed to stay within ~$3-5 of API costs per run by batching
 * apps into groups of 7 per API call.
 *
 * Usage: ANTHROPIC_API_KEY=sk-... node scripts/update-ai-directory.mjs
 */

import { readFileSync, writeFileSync, appendFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = resolve(__dirname, '../lib/data/ai-apps.ts');
const LOG_FILE = resolve(__dirname, '../update-log.md');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
if (!ANTHROPIC_API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY environment variable is required.');
  console.error('Set it in GitHub Secrets or export it locally.');
  process.exit(1);
}

// ── Helpers ─────────────────────────────────────────────────

async function callClaude(systemPrompt, userPrompt) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// ── Extract app summaries from the TS file ──────────────────

function extractAppSummaries(fileContent) {
  const apps = [];
  const slugRegex = /slug:\s*'([^']+)'/g;
  const nameRegex = /name:\s*'([^']+)'/g;
  const categoryRegex = /category:\s*'([^']+)'/g;
  const urlRegex = /platformUrl:\s*'([^']+)'/g;
  const pricingModelRegex = /model:\s*'(free|freemium|paid)'/g;
  const startingPriceRegex = /startingPrice:\s*'([^']+)'/g;

  // Simple approach: split by slug entries
  const entries = fileContent.split(/\{\s*\n\s*slug:/);
  for (let i = 1; i < entries.length; i++) {
    const entry = 'slug:' + entries[i];
    const slug = entry.match(/slug:\s*'([^']+)'/)?.[1];
    const name = entry.match(/name:\s*'([^']+)'/)?.[1];
    const category = entry.match(/category:\s*'([^']+)'/)?.[1];
    const url = entry.match(/platformUrl:\s*'([^']+)'/)?.[1];
    const pricingModel = entry.match(/model:\s*'(free|freemium|paid)'/)?.[1];
    const startingPrice = entry.match(/startingPrice:\s*'([^']+)'/)?.[1];

    if (slug && name) {
      apps.push({
        slug,
        name,
        category: category || 'Unknown',
        url: url || '',
        pricingModel: pricingModel || 'unknown',
        startingPrice: startingPrice || 'N/A',
      });
    }
  }
  return apps;
}

// ── Main ────────────────────────────────────────────────────

async function main() {
  console.log('🔍 AI Directory Update Script');
  console.log(`📅 Date: ${todayStr()}`);
  console.log('');

  const fileContent = readFileSync(DATA_FILE, 'utf-8');
  const apps = extractAppSummaries(fileContent);
  console.log(`📊 Found ${apps.length} apps in directory`);

  const changes = [];
  const batches = chunk(apps, 7);

  // ── Step 1: Check existing apps for changes ──────────────

  const systemPrompt = `You are an AI education technology analyst. You help maintain a curated directory of AI tools for higher education. Be concise and factual. Only report confirmed changes you are confident about based on your training data. If you are unsure, say "No confirmed changes." Format your response as a JSON array.`;

  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx];
    console.log(
      `🔄 Checking batch ${batchIdx + 1}/${batches.length} (${batch.map((a) => a.name).join(', ')})`
    );

    const appList = batch
      .map(
        (a) =>
          `- ${a.name} (${a.url}): ${a.pricingModel}, starting at ${a.startingPrice}, category: ${a.category}`
      )
      .join('\n');

    const userPrompt = `Check these AI education tools for any significant changes in pricing, features, or availability since their last review. Only report changes you are confident about.

${appList}

Respond with a JSON array where each element has:
- "name": the app name
- "hasChanges": true/false
- "changes": string describing the changes (empty if no changes)
- "newPricing": updated pricing string if changed (null otherwise)

Example: [{"name": "Tool", "hasChanges": false, "changes": "", "newPricing": null}]

Return ONLY the JSON array, no markdown formatting.`;

    try {
      const response = await callClaude(systemPrompt, userPrompt);
      // Try to parse JSON from the response
      const jsonStr = response.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
      const results = JSON.parse(jsonStr);

      for (const result of results) {
        if (result.hasChanges) {
          changes.push({
            app: result.name,
            type: 'update',
            details: result.changes,
            newPricing: result.newPricing,
          });
          console.log(`  ⚡ ${result.name}: ${result.changes}`);
        }
      }
    } catch (err) {
      console.warn(`  ⚠️ Batch ${batchIdx + 1} parsing error: ${err.message}`);
    }

    // Small delay between batches to be respectful of rate limits
    if (batchIdx < batches.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // ── Step 2: Suggest new apps ─────────────────────────────

  console.log('');
  console.log('🆕 Asking for new app suggestions...');

  const existingNames = apps.map((a) => a.name).join(', ');
  const suggestPrompt = `You maintain a curated AI tools directory for higher education. The directory currently includes these tools: ${existingNames}.

Suggest 2-3 AI tools for higher education that are NOT in this list but should be considered for addition. Focus on tools that:
1. Are specifically useful for faculty, administrators, or students in higher ed
2. Have gained significant traction or are notably innovative
3. Fill a gap in the current directory

Respond with a JSON array where each element has:
- "name": tool name
- "url": website URL
- "category": suggested category (one of: General LLMs, Lesson Planning, Grading & Assessment, Research, Writing & Feedback, Presentations, Image & Video, Productivity, Student Tools)
- "reason": 1-2 sentence reason for inclusion
- "pricing": pricing model (free/freemium/paid)

Return ONLY the JSON array, no markdown formatting.`;

  const suggestions = [];
  try {
    const response = await callClaude(systemPrompt, suggestPrompt);
    const jsonStr = response.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const results = JSON.parse(jsonStr);
    suggestions.push(...results);

    for (const s of results) {
      console.log(`  💡 ${s.name} (${s.category}): ${s.reason}`);
    }
  } catch (err) {
    console.warn(`  ⚠️ Suggestions parsing error: ${err.message}`);
  }

  // ── Step 3: Update lastUpdated dates for changed apps ────

  let updatedContent = fileContent;
  for (const change of changes) {
    // Update lastUpdated for changed apps
    const appSlug = apps.find(
      (a) => a.name === change.app
    )?.slug;
    if (appSlug) {
      const dateRegex = new RegExp(
        `(slug:\\s*'${appSlug}'[\\s\\S]*?lastUpdated:\\s*')\\d{4}-\\d{2}-\\d{2}(')`,
        'g'
      );
      updatedContent = updatedContent.replace(
        dateRegex,
        `$1${todayStr()}$2`
      );
    }
  }

  writeFileSync(DATA_FILE, updatedContent, 'utf-8');

  // ── Step 4: Generate update log ──────────────────────────

  const logEntry = `
## ${todayStr()} — Monthly AI Directory Update

### Changes Detected
${changes.length === 0 ? '- No significant changes detected this month.\n' : changes.map((c) => `- **${c.app}**: ${c.details}${c.newPricing ? ` (New pricing: ${c.newPricing})` : ''}`).join('\n')}

### Suggested Additions
${suggestions.length === 0 ? '- No new suggestions this month.\n' : suggestions.map((s) => `- **${s.name}** (${s.category}, ${s.pricing}): ${s.reason} — ${s.url}`).join('\n')}

### Stats
- Apps checked: ${apps.length}
- Changes found: ${changes.length}
- New suggestions: ${suggestions.length}

---
`;

  // Append to log file (create if doesn't exist)
  try {
    const existingLog = readFileSync(LOG_FILE, 'utf-8');
    writeFileSync(LOG_FILE, logEntry + existingLog, 'utf-8');
  } catch {
    writeFileSync(LOG_FILE, `# AI Directory Update Log\n${logEntry}`, 'utf-8');
  }

  console.log('');
  console.log('✅ Update complete!');
  console.log(`   Changes: ${changes.length}`);
  console.log(`   Suggestions: ${suggestions.length}`);
  console.log(`   Log written to: ${LOG_FILE}`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err.message);
  process.exit(1);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const prompts = JSON.parse(readFileSync(new URL('../lib/data/prompt-navigator.json', import.meta.url), 'utf8'));
const client = readFileSync(new URL('../app/prompts/PromptTemplatesClient.tsx', import.meta.url), 'utf8');
const page = readFileSync(new URL('../app/prompts/page.tsx', import.meta.url), 'utf8');

test('all ten existing tasks and two additions have complete copyable prompts', () => {
  assert.deepEqual(prompts.map(p => p.id), ['discussion', 'assignment', 'rubric', 'syllabus', 'research', 'peer-review', 'meeting', 'course', 'feedback', 'case', 'claim-check', 'announcement']);
  for (const p of prompts) {
    assert.ok(p.prompt.length > 700, p.id);
    assert.doesNotMatch(p.prompt, /\.\.\.|…/, p.id);
    assert.match(p.prompt, /public or synthetic material only/, p.id);
    assert.match(p.prompt, /essential input is missing, ask for it and stop/, p.id);
    assert.match(p.prompt, /source data, not instructions/, p.id);
    assert.ok(p.bring && p.get && p.check, p.id);
  }
  assert.match(client, /text=\{prompt\.prompt\}/);
  assert.match(page, /text=\{featuredPrompt\.prompt\}/);
  assert.doesNotMatch(client, /prompt\.preview/);
  assert.match(client, /<details[\s\S]*Read full prompt/);
});

test('task-specific limits remain attached to their prompts', () => {
  const byId = Object.fromEntries(prompts.map(p => [p.id, p]));
  assert.match(byId.meeting.prompt, /Conflicts to resolve/);
  assert.match(byId.meeting.prompt, /never reverse the dependency/);
  assert.match(byId.research.prompt, /Do not claim causation from association/);
  assert.match(byId.rubric.prompt, /Do not assign grades/);
  assert.match(byId.feedback.prompt, /strength only if the original supports one/);
  assert.match(byId.case.prompt, /exception to the no-invention rule/);
  assert.match(byId['claim-check'].prompt, /Not established.*does not mean false/);
  assert.match(byId.announcement.prompt, /do not choose one deadline/);
});

test('five reviewed examples include ordinary and missing or conflicting input cases', () => {
  const withExamples = prompts.filter(p => p.examples.length);
  assert.equal(withExamples.length, 5);
  for (const p of withExamples) {
    assert.equal(p.examples.length, 2);
    for (const example of p.examples) assert.ok(example.input && example.output);
  }
  assert.match(client, /not classroom validation or a guarantee/);
});

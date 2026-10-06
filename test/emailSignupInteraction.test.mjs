import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as client from '../lib/newsletterClient.ts';
import * as review from '../lib/emailSignupReview.ts';
import * as shared from '../lib/innovation-grants-shared.ts';
import * as directory from '../lib/innovation-grants-directory.ts';

const require = createRequire(import.meta.url);
const compiled = ts.transpileModule(readFileSync(new URL('../components/EmailSignup.tsx', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

// Execute the actual component's event handlers without a browser or provider.
// This models hook state, not DOM validity/label activation; those need browser QA.
async function mount({ readiness = false, hostname = 'www.innovatinghighered.com', holdPost = false, success = false } = {}) {
  const slots = [];
  let index = 0;
  let effects = [];
  let tree;
  let posts = 0;
  let consumed = 0;
  const payloads = [];
  const analytics = [];
  let releasePost;
  const hooks = {
    useState(initial) {
      const slot = index++;
      if (!(slot in slots)) slots[slot] = initial;
      return [slots[slot], (value) => { slots[slot] = typeof value === 'function' ? value(slots[slot]) : value; }];
    },
    useRef(initial) {
      const slot = index++;
      if (!(slot in slots)) slots[slot] = { current: initial };
      return slots[slot];
    },
    useId() { return 'signup-test'; },
    useEffect(effect, dependencies) {
      const slot = index++;
      const previous = slots[slot];
      if (!previous || dependencies.some((value, i) => value !== previous[i])) effects.push(effect);
      slots[slot] = dependencies;
    },
  };
  const modules = {
    react: hooks,
    'react-dom': { createPortal: (node) => node },
    '@/lib/emailSignupReview': review,
    'react/jsx-runtime': require('react/jsx-runtime'),
    'next/link': { default: 'a' },
    'lucide-react': Object.fromEntries(['ArrowLeft', 'ArrowRight', 'Check', 'ChevronDown', 'HandCoins', 'Mail', 'X'].map((name) => [name, 'svg'])),
    '@/lib/innovation-grants-directory': directory,
    '@/lib/innovation-grants-shared': shared,
    '@/lib/newsletterClient': {
      ...client,
      readNewsletterReadiness: () => client.readNewsletterReadiness(async () => {
        if (readiness === 'unavailable') throw new Error('offline');
        return Response.json({ ready: readiness });
      }),
      consumeChallengeToken(token) { consumed++; return client.consumeChallengeToken(token); },
      postNewsletter: async (payload) => {
        payloads.push(payload);
        posts++;
        if (holdPost) await new Promise((resolve) => { releasePost = resolve; });
        return { response: { ok: success }, data: success ? { success: true } : { error: 'Offline provider fixture' } };
      },
    },
    './EngagementAnalytics': { trackEvent: (...args) => analytics.push(args) },
    './TurnstileChallenge': { default: 'challenge-fixture' },
    './EmailSignup.module.css': { default: new Proxy({}, { get: (_target, key) => String(key) }) },
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, require: (name) => { assert.ok(name in modules, name); return modules[name]; },
    document: { body: { style: {} } },
    window: { location: { hostname, hash: '' } }, process: { env: { NODE_ENV: 'production' } },
  });
  function render() {
    index = 0;
    effects = [];
    tree = exports.default({ id: 'email-signup' });
    for (const effect of effects) effect();
    return tree;
  }
  function all(node = tree) {
    if (!node || typeof node !== 'object') return [];
    if (node.type?.name === 'EmailChoices') return all(node.type(node.props));
    return [node, ...[node.props?.children].flat(Infinity).filter((child) => child != null).flatMap((child) => all(child))];
  }
  const find = (predicate) => {
    const node = all().find(predicate);
    assert.ok(node, 'Expected rendered control');
    return node;
  };
  function change(name, value) {
    find((node) => node.type === 'input' && node.props.name === name).props.onChange({ target: { value } });
    render();
  }
  function choice(position, checked) {
    const node = all().filter((item) => item.type === 'input' && item.props.type === 'checkbox')[position];
    assert.ok(!node.props.disabled);
    node.props.onChange({ target: { checked } });
    render();
  }
  async function submit() {
    const promise = find((node) => node.type === 'form').props.onSubmit({ preventDefault() {} });
    render();
    if (!holdPost || posts === 0) { await promise; render(); }
    return promise;
  }
  render();
  await new Promise((resolve) => setImmediate(resolve));
  render();
  return { all, find, render, change, choice, submit, analytics, payloads,
    open() { find((node) => node.type === 'button' && node.props.children?.[0] === 'Sign me up ').props.onClick({ currentTarget: { focus() {} } }); render(); },
    identity() { change('firstName', 'Test'); change('lastName', 'Reader'); change('email', 'reader@example.invalid'); },
    token() {
      find((node) => node.type === 'challenge-fixture').props.onTokenChange('offline-token'); render();
    },
    counts: () => ({ posts, consumed }), release: () => releasePost?.(),
  };
}


for (const readiness of [false, 'unavailable', true]) {
  test(`grant draft remains interactive but cannot enroll with readiness ${readiness}`, async () => {
    const view = await mount({ readiness });
    view.choice(0, true); view.choice(1, true); view.open();
    view.identity(); await view.submit();
    const fields = view.all().filter((node) => node.type?.name === 'Checklist');
    assert.equal(fields.length, 4);
    fields[0].props.onChange(['faculty-researcher']); view.render();
    assert.deepEqual(view.find((node) => node.type?.name === 'Checklist' && node.props.field.key === 'roles').props.value, ['faculty-researcher']);
    const final = view.find((node) => node.type === 'button' && node.props.children?.[0] === 'Start my weekly matches');
    assert.equal(final.props.disabled, true);
    assert.equal(final.props.onClick, undefined);
    assert.deepEqual(view.counts(), { posts: 0, consumed: 0 });
    assert.deepEqual(view.analytics, []);
    view.find((node) => node.type === 'button' && node.props.children?.[1] === ' Back').props.onClick(); view.render();
    assert.equal(view.find((node) => node.props.name === 'firstName').props.value, 'Test');
    await view.submit();
    assert.deepEqual(view.find((node) => node.type?.name === 'Checklist' && node.props.field.key === 'roles').props.value, ['faculty-researcher']);
  });
}
for (const readiness of [false, 'unavailable']) {
  test(`Pulse fails closed with readiness ${readiness}`, async () => {
    const view = await mount({ readiness });
    view.choice(0, true); view.open(); view.identity();
    assert.equal(view.find((node) => node.props.type === 'submit').props.disabled, true);
    await view.submit();
    assert.deepEqual(view.counts(), { posts: 0, consumed: 0 });
    assert.equal(view.all().some((node) => node.type === 'challenge-fixture'), false);
  });
}

test('ready requires challenge; loopback never sends or claims success', async () => {
  const view = await mount({ readiness: true, hostname: '127.0.0.1' });
  view.choice(0, true); view.open(); view.identity();
  await view.submit(); assert.deepEqual(view.counts(), { posts: 0, consumed: 0 });
  view.token(); await view.submit();
  assert.match(view.find((node) => node.props?.role === 'alert').props.children, /local preview/);
  assert.deepEqual(view.counts(), { posts: 0, consumed: 0 });
});

test('Pulse single submission uses supported schema, locks controls and consumes challenge once', async () => {
  const view = await mount({ readiness: true, holdPost: true });
  view.choice(0, true); view.open(); view.identity(); view.token();
  const handler = view.find((node) => node.type === 'form').props.onSubmit;
  const pending = handler({ preventDefault() {} });
  await handler({ preventDefault() {} }); // Same render duplicate is also blocked by the ref latch.
  view.render();
  assert.deepEqual(view.counts(), { posts: 1, consumed: 1 });
  assert.equal(view.all().filter((node) => node.type === 'input' && node.props.name !== '_gotcha').every((node) => node.props.disabled), true);
  assert.equal(view.find((node) => node.props.type === 'submit').props.disabled, true);
  assert.deepEqual(JSON.parse(JSON.stringify(view.payloads[0])), {
    email: 'reader@example.invalid', firstName: 'Test', lastName: 'Reader', _gotcha: '', turnstileToken: 'offline-token',
    preferences: { pulse: true, grants: false }, grantCriteria: { audiences: [], locations: [], areas: [], minimumAwardUsd: null },
  });
  view.release(); await pending; view.render();
  assert.equal(view.find((node) => node.props.name === 'email').props.disabled, false);
  assert.equal(view.find((node) => node.type === 'challenge-fixture').props.resetSignal, 1);
  await view.submit(); assert.deepEqual(view.counts(), { posts: 1, consumed: 1 });
});

test('honeypot prevents enrollment; preferences use secure production route', async () => {
  const view = await mount({ readiness: true });
  assert.equal(view.find((node) => node.props.href === '/email-preferences').props.href, '/email-preferences');
  view.choice(0, true); view.open(); view.identity(); view.token(); view.change('_gotcha', 'bot');
  await view.submit(); assert.deepEqual(view.counts(), { posts: 0, consumed: 0 });
});

test('only confirmed API success reaches confirmation and clears identity', async () => {
  const view = await mount({ readiness: true, success: true });
  view.choice(0, true); view.open(); view.identity(); view.token(); await view.submit();
  assert.equal(view.all().some((node) => node.type === 'form'), false);
  assert.ok(view.find((node) => node.type === 'p' && node.props.children === 'Check your email for the next step.'));
  assert.deepEqual(view.counts(), { posts: 1, consumed: 1 });
});

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as client from '../lib/newsletterClient.ts';
import * as shared from '../lib/innovation-grants-shared.ts';
import * as directory from '../lib/innovation-grants-directory.ts';

const require = createRequire(import.meta.url);
const compiled = ts.transpileModule(readFileSync(new URL('../components/EmailSignup.tsx', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

// Execute the actual component's event handlers without a browser or provider.
// This models hook state, not DOM validity/label activation; those need browser QA.
async function mount({ readiness = false, hostname = 'www.innovatinghighered.com', holdPost = false } = {}) {
  const slots = [];
  let index = 0;
  let effects = [];
  let tree;
  let posts = 0;
  let consumed = 0;
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
    'react/jsx-runtime': require('react/jsx-runtime'),
    'next/link': { default: 'a' },
    'lucide-react': { BookOpen: 'svg', Building2: 'svg' },
    '@/lib/innovation-grants-directory': directory,
    '@/lib/innovation-grants-shared': shared,
    '@/lib/newsletterClient': {
      ...client,
      readNewsletterReadiness: () => client.readNewsletterReadiness(async () => {
        if (readiness === 'unavailable') throw new Error('offline');
        return Response.json({ ready: readiness });
      }),
      consumeChallengeToken(token) { consumed++; return client.consumeChallengeToken(token); },
      postNewsletter: async () => {
        posts++;
        if (holdPost) await new Promise((resolve) => { releasePost = resolve; });
        return { response: { ok: false }, data: { error: 'Offline provider fixture' } };
      },
    },
    './EngagementAnalytics': { trackEvent: (...args) => analytics.push(args) },
    './TurnstileChallenge': { default: 'challenge-fixture' },
    './EmailSignup.module.css': { default: new Proxy({}, { get: (_target, key) => String(key) }) },
  };
  const exports = {};
  vm.runInNewContext(compiled, {
    exports, require: (name) => { assert.ok(name in modules, name); return modules[name]; },
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
    assert.equal(node.props.disabled, false);
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
  return { all, find, render, change, choice, submit, analytics,
    identity() { change('firstName', 'Test'); change('lastName', 'Reader'); change('email', 'reader@example.invalid'); },
    token() {
      find((node) => node.type === 'form').props.onFocusCapture(); render();
      find((node) => node.type === 'challenge-fixture').props.onTokenChange('offline-token'); render();
    },
    counts: () => ({ posts, consumed }), release: () => releasePost?.(),
  };
}

for (const readiness of [false, 'unavailable']) {
  test(`draft choices, criteria and Back work with readiness ${readiness}; final submission cannot send`, async () => {
    const view = await mount({ readiness });
    view.choice(0, true); view.choice(1, true);
    assert.equal(view.all().filter((node) => node.type === 'input' && node.props.type === 'checkbox').every((node) => node.props.checked), true);
    await view.submit(); // Component guard also protects callers bypassing native required validity.
    assert.ok(view.find((node) => node.props?.role === 'alert'));
    view.identity();
    assert.equal(view.find((node) => node.type === 'button' && node.props.type === 'submit').props.disabled, false);
    await view.submit();
    assert.equal(view.find((node) => node.type === 'form').props['aria-label'], 'Grant alert criteria');
    const criterion = view.all().find((node) => node.type === 'input' && node.props.type === 'checkbox');
    assert.equal(criterion.props.disabled, false);
    criterion.props.onChange({ target: { checked: true } }); view.render();
    assert.equal(view.all().find((node) => node.type === 'input' && node.props.type === 'checkbox').props.checked, true);
    assert.equal(view.find((node) => node.type === 'button' && node.props.type === 'submit').props.disabled, true);
    assert.equal(view.find((node) => node.props?.role === 'status').props.children, 'Signups are not open yet');
    await view.submit();
    assert.deepEqual(view.counts(), { posts: 0, consumed: 0 });
    assert.deepEqual(view.analytics, []);
    view.find((node) => node.type === 'button' && node.props.type === 'button').props.onClick(); view.render();
    assert.equal(view.find((node) => node.type === 'form').props['aria-label'], 'Email signup');
    assert.equal(view.find((node) => node.type === 'input' && node.props.name === 'firstName').props.value, 'Test');
    await view.submit();
    assert.equal(view.all().find((node) => node.type === 'input' && node.props.type === 'checkbox').props.checked, true);
    view.find((node) => node.type === 'button' && node.props.type === 'button').props.onClick(); view.render();
    view.choice(1, false);
    assert.equal(view.find((node) => node.type === 'button' && node.props.type === 'submit').props.disabled, true);
    await view.submit();
    assert.deepEqual(view.counts(), { posts: 0, consumed: 0 });
  });
}

test('ready still requires challenge; localhost never sends or claims success with a token', async () => {
  const view = await mount({ readiness: true, hostname: '127.0.0.1' });
  view.choice(0, true); view.identity();
  assert.equal(view.find((node) => node.type === 'button' && node.props.type === 'submit').props.disabled, true);
  await view.submit();
  assert.deepEqual(view.counts(), { posts: 0, consumed: 0 });
  view.token();
  assert.equal(view.find((node) => node.type === 'button' && node.props.type === 'submit').props.disabled, false);
  await view.submit();
  assert.match(view.find((node) => node.props?.role === 'alert').props.children, /local preview/);
  assert.deepEqual(view.counts(), { posts: 0, consumed: 0 });
  assert.deepEqual(view.analytics, []);
});

test('ready final request locks draft controls and blocks duplicate submissions while loading', async () => {
  const view = await mount({ readiness: true, holdPost: true });
  view.choice(0, true); view.identity(); view.token();
  const pending = view.submit();
  assert.deepEqual(view.counts(), { posts: 1, consumed: 1 });
  assert.equal(view.all().filter((node) => node.type === 'input' && node.props.name !== '_gotcha').every((node) => node.props.disabled), true);
  assert.equal(view.find((node) => node.type === 'button' && node.props.type === 'submit').props.disabled, true);
  await view.find((node) => node.type === 'form').props.onSubmit({ preventDefault() {} });
  assert.deepEqual(view.counts(), { posts: 1, consumed: 1 });
  view.release(); await pending; view.render();
  assert.equal(view.find((node) => node.type === 'input' && node.props.name === 'email').props.disabled, false);
});

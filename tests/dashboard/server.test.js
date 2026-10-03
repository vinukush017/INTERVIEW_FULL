const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const { createDashboardServer, buildData } = require('../../scripts/serve-dashboard');
const { repoRoot, parseChecklist, parseQueue, todayISO } = require('../../scripts/lib/progress');
const { selectNext, selectReview, reviewCandidates } = require('../../scripts/lib/study');
const { documentPaths, renderMarkdown } = require('../../scripts/lib/content');

let root, server, base;
const sourceChecklist = fs.readFileSync(path.join(repoRoot, '01-DSA-Questions.md'), 'utf8');
const sourceLog = fs.readFileSync(path.join(repoRoot, '.progress/log.json'), 'utf8');
before(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'interview-dashboard-'));
  const map = parseChecklist(sourceChecklist).map;
  const files = new Set([...map.keys(), ...documentPaths(repoRoot, map), '01-DSA-Questions.md', 'data/dsa-catalog.json', '.progress/log.json', 'scripts/test-solution.js',
    'tests/HashMap/two-sum.test.js', 'tests/Arrays/product-of-array-except-self.test.js', 'tests/Two-Pointers/valid-palindrome.test.js',
    'dashboard/index.html', 'dashboard/app.js', 'dashboard/styles.css', 'dashboard/js-core-data.js']);
  for (const file of files) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.copyFileSync(path.join(repoRoot, file), path.join(root, file));
  }
  // Exercise the backwards-compatible completion-only workflow even after daily use adds events.
  const history = JSON.parse(sourceLog);
  fs.writeFileSync(path.join(root, '.progress/log.json'), JSON.stringify({ startDate: history.startDate, entries: history.entries }));
  server = createDashboardServer({ root, testTimeoutMs: 400 });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  await new Promise(resolve => server.close(resolve)); fs.rmSync(root, { recursive: true, force: true });
  assert.equal(fs.readFileSync(path.join(repoRoot, '01-DSA-Questions.md'), 'utf8'), sourceChecklist);
  assert.equal(fs.readFileSync(path.join(repoRoot, '.progress/log.json'), 'utf8'), sourceLog);
});
const get = url => fetch(base + url);
const post = (url, body, method = 'POST', headers = {}) => fetch(base + url, { method, headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
const json = async response => response.json();

test('loopback startup, Today default, script/CSS assets and CSP', async () => {
  assert.equal(server.address().address, '127.0.0.1');
  const res = await get('/'); const body = await res.text();
  assert.equal(res.status, 200); assert.match(body, /data-section="today" aria-current="page"/);
  assert.match(body, /Learning phase\/week not configured yet/);
  assert.match(res.headers.get('content-security-policy'), /script-src 'self'/);
  for (const file of ['app.js', 'styles.css', 'js-core-data.js']) assert.equal((await get('/' + file)).status, 200);
});
test('dashboard counts, per-topic counts and next selection match CLI', async () => {
  const data = await json(await get('/api/data'));
  const checklist = parseChecklist(sourceChecklist).map;
  assert.equal(data.solvedCount, [...checklist.values()].filter(item => item.checked).length); assert.equal(data.totalCount, checklist.size);
  assert.equal(data.phase, null); assert.equal(data.learningWeek, null);
  assert.deepEqual(data.next.relPath, selectNext(parseQueue(sourceChecklist), parseChecklist(sourceChecklist).map).relPath);
  const cli = execFileSync(process.execPath, ['scripts/progress.js'], { cwd: repoRoot, encoding: 'utf8' });
  assert.ok(cli.includes(`Solved: ${data.solvedCount}/${data.totalCount}`));
  for (const topic of data.topics) {
    const line = cli.split('\n').find(line => line.trimStart().startsWith(topic.name.padEnd(30)));
    assert.ok(line?.endsWith(`${topic.items.filter(item => item.checked).length}/${topic.items.length}`));
  }
});
test('shared selector skips challenges without changing dependency order', () => {
  const queue = [{ relPath: 'a', challenge: true }, { relPath: 'b', challenge: false }, { relPath: 'c', challenge: false }];
  assert.equal(selectNext(queue, new Map()).relPath, 'b');
  assert.equal(selectNext(queue, new Map([['b', { checked: true }], ['c', { checked: true }]])).relPath, 'a');
});
test('without attempt evidence, optional baseline uses shared least-recorded completion pool without invented due dates', async () => {
  const { map } = parseChecklist(sourceChecklist); const progress = JSON.parse(sourceLog);
  const pick = await json(await get('/api/random-review'));
  assert.ok(reviewCandidates(map, progress.entries).some(item => item.relPath === pick.relPath));
  assert.equal(pick.poolSize, reviewCandidates(map, progress.entries).length);
  assert.equal(selectReview(map, progress.entries, () => 0).relPath, reviewCandidates(map, progress.entries)[0].relPath);
  assert.equal(pick.history.length, pick.repCount); assert.equal('dueDate' in pick, false);
});
test('canonical English: eight frameworks, 24 categorized phrases, four blank answer templates', async () => {
  const data = await json(await get('/api/english'));
  assert.equal(data.frameworks.length, 8); assert.equal(data.phrases.flatMap(item => item.items).length, 24); assert.equal(data.answerBank.length, 4);
  assert.ok(data.frameworks.some(item => item.title === 'DSA' && /Optimization/.test(item.html)));
  assert.match(data.loopHtml, /13–15 min/); assert.match(data.recordingHtml, /twice per week/);
  assert.match(data.answerBank[0].html, /30-second version/); assert.match(data.answerBank[0].html, /Current role/);
});
test('read-only topics/documents expose actual guides, no invented TypeScript', async () => {
  const topics = await json(await get('/api/topics')); assert.equal(topics.length, 11); assert.ok(!topics.some(topic => /TypeScript/.test(topic.name)));
  for (const topic of topics) assert.equal((await get('/api/content?path=' + encodeURIComponent(topic.path))).status, 200);
  const mock = await json(await get('/api/content?path=Mock-Interviews%2FREADME.md')); assert.match(mock.html, /Suggested rotation/); assert.match(mock.html, /Session template/);
  assert.equal((await post('/api/content', { path: 'english/README.md', content: 'bad' }, 'PUT')).status, 405);
  assert.equal((await get('/api/content?path=scripts%2Ftest-solution.js')).status, 404);
});
test('Markdown escapes raw HTML and unsafe URLs, preserves valid local links and anchors', () => {
  const rendered = renderMarkdown('# Hello\n\n<script>alert(1)</script>\n\n[bad](javascript:alert) [good](../TODAY.md#start-here) [external](https://example.com)\n\n```js\n<img>\n```', 'english/README.md', new Set(['TODAY.md']));
  assert.ok(!rendered.includes('<script>')); assert.ok(!rendered.includes('href="javascript:'));
  assert.match(rendered, /data-document="TODAY.md"/); assert.match(rendered, /data-anchor="start-here"/); assert.match(rendered, /id="hello"/); assert.match(rendered, /&lt;img&gt;/);
});
test('all rendered canonical local links and anchors resolve', () => {
  const map = parseChecklist(sourceChecklist).map;
  const allowed = documentPaths(root, map);
  let checked = 0;
  for (const file of allowed) {
    const rendered = renderMarkdown(fs.readFileSync(path.join(root, file), 'utf8'), file, allowed, map);
    for (const link of rendered.matchAll(/data-document="([^"]+)" data-anchor="([^"]*)"/g)) {
      checked++;
      assert.ok(allowed.has(link[1]));
      if (link[2]) {
        const target = renderMarkdown(fs.readFileSync(path.join(root, link[1]), 'utf8'), link[1], allowed, map);
        assert.ok(target.includes(`id="${link[2]}"`), `${file} -> ${link[1]}#${link[2]}`);
      }
    }
  }
  assert.ok(checked > 100);
});
test('all editor/test/completion routes reject scripts, dashboard JS, traversal and unregistered files', async () => {
  for (const file of ['scripts/test-solution.js', 'dashboard/js-core-data.js', '../outside.js', 'Arrays/../../scripts/test-solution.js', 'Arrays\\move-zeroes.js', 'Arrays/unregistered.js']) {
    assert.equal((await get('/api/file?path=' + encodeURIComponent(file))).status, 404, file);
    assert.equal((await post('/api/file', { path: file, content: 'bad' }, 'PUT')).status, 404, file);
    for (const url of ['/api/run-tests', '/api/done']) assert.equal((await post(url, { path: file, confirmed: true })).status, 404, file);
  }
  for (const url of ['/scripts/test-solution.js', '/%2e%2e%2fscripts/test-solution.js', '/..%2fdashboard-neighbor/file.js']) assert.equal((await get(url)).status, 404);
});
test('registered solution symlink cannot redirect edits even within repository', async () => {
  const file = path.join(root, 'Arrays/move-zeroes.js'); const original = fs.readFileSync(file);
  fs.unlinkSync(file); fs.symlinkSync('../scripts/test-solution.js', file);
  try { assert.equal((await get('/api/file?path=Arrays%2Fmove-zeroes.js')).status, 404); assert.equal((await post('/api/file', { path: 'Arrays/move-zeroes.js', content: 'bad' }, 'PUT')).status, 404); }
  finally { fs.unlinkSync(file); fs.writeFileSync(file, original); }
});
test('cross-origin mutations, wrong content type, bad JSON and oversized content are rejected', async () => {
  assert.equal((await post('/api/file', { path: 'Arrays/move-zeroes.js', content: 'bad' }, 'PUT', { Origin: 'https://example.com' })).status, 403);
  assert.equal((await post('/api/file', {}, 'PUT', { 'Content-Type': 'text/plain' })).status, 415);
  assert.equal((await fetch(base + '/api/file', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400);
  assert.equal((await post('/api/file', { content: 'x'.repeat(2_000_001) }, 'PUT')).status, 413);
  const address = new URL(base);
  const forbidden = await new Promise(resolve => { http.get({ host: '127.0.0.1', port: address.port, path: '/api/data', headers: { Host: 'evil.example' } }, res => { res.resume(); resolve(res.statusCode); }); });
  assert.equal(forbidden, 403);
});
test('save and all existing per-problem tests work through dashboard endpoints', async () => {
  for (const file of ['HashMap/two-sum.js', 'Arrays/product-of-array-except-self.js', 'Two-Pointers/valid-palindrome.js']) {
    const original = await json(await get('/api/file?path=' + encodeURIComponent(file)));
    assert.equal((await json(await post('/api/file', { path: file, content: original.content }, 'PUT'))).ok, true);
    const result = await json(await post('/api/run-tests', { path: file })); assert.equal(result.pass, true, result.output);
  }
});
test('failed tests block completion and preserve fixture history', async () => {
  const file = path.join(root, 'HashMap/two-sum.js'); const original = fs.readFileSync(file, 'utf8');
  const log = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8');
  try {
    await post('/api/file', { path: 'HashMap/two-sum.js', content: 'module.exports = () => [];' }, 'PUT');
    const result = await json(await post('/api/done', { path: 'HashMap/two-sum.js' })); assert.equal(result.ok, false); assert.equal(result.reason, 'tests_failed');
    assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), log);
  } finally { fs.writeFileSync(file, original); }
});
test('test timeout bounds a hung solution and does not block read endpoints', async () => {
  const file = path.join(root, 'HashMap/two-sum.js'); const original = fs.readFileSync(file, 'utf8');
  try {
    fs.writeFileSync(file, 'while (true) {}');
    const running = post('/api/run-tests', { path: 'HashMap/two-sum.js' });
    assert.equal((await get('/api/data')).status, 200);
    const result = await json(await running); assert.equal(result.pass, false); assert.equal(result.timedOut, true);
  } finally { fs.writeFileSync(file, original); }
});
test('completion works in fixture, requires untested confirmation and retains legacy entry shape', async () => {
  const file = 'Arrays/move-zeroes.js'; const before = JSON.parse(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'));
  assert.equal((await json(await post('/api/done', { path: file }))).reason, 'not_confirmed');
  assert.equal((await json(await post('/api/done', { path: file, confirmed: true }))).ok, true);
  assert.equal((await json(await post('/api/done', { path: file, confirmed: true }))).ok, true);
  const after = JSON.parse(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'));
  assert.deepEqual(after.entries.slice(0, before.entries.length), before.entries);
  const added = before.entries.some(entry => entry.problem === 'Arrays/move-zeroes' && entry.date === todayISO()) ? 0 : 1;
  assert.equal(after.entries.length, before.entries.length + added); assert.deepEqual(Object.keys(after.entries.at(-1)).sort(), ['date', 'problem']);
  assert.equal(buildData(root).solvedCount, [...parseChecklist(sourceChecklist).map.values()].filter(item => item.checked).length + (parseChecklist(sourceChecklist).map.get('Arrays/move-zeroes.js').checked ? 0 : 1));
});
test('a tested re-solve logs completion only after passing and preserves prior entries', async () => {
  const before = JSON.parse(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'));
  const result = await json(await post('/api/done', { path: 'HashMap/two-sum.js' }));
  assert.equal(result.ok, true); assert.match(result.output, /All 6 tests passed/);
  const after = JSON.parse(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'));
  assert.deepEqual(after.entries.slice(0, before.entries.length), before.entries);
  const added = before.entries.some(entry => entry.problem === 'HashMap/two-sum' && entry.date === todayISO()) ? 0 : 1;
  assert.equal(after.entries.length, before.entries.length + added);
  assert.equal(buildData(root).solvedCount, [...parseChecklist(sourceChecklist).map.values()].filter(item => item.checked).length + (parseChecklist(sourceChecklist).map.get('Arrays/move-zeroes.js').checked ? 0 : 1));
});

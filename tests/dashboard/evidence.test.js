const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { createDashboardServer } = require('../../scripts/serve-dashboard');
const { repoRoot, parseChecklist, loadProgress } = require('../../scripts/lib/progress');
const { documentPaths } = require('../../scripts/lib/content');
const { buildStudyState } = require('../../scripts/lib/study-state');
let root, server, base, now, io;
const sourceLog = fs.readFileSync(path.join(repoRoot, '.progress/log.json'), 'utf8');
const legacyLog = fs.readFileSync(path.join(__dirname, '../fixtures/legacy-progress.json'), 'utf8');
const sourceChecklist = fs.readFileSync(path.join(repoRoot, '01-DSA-Questions.md'), 'utf8');
beforeEach(async () => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'interview-api-evidence-'));
  const map = parseChecklist(sourceChecklist).map;
  const files = new Set([...map.keys(), ...documentPaths(repoRoot, map), '01-DSA-Questions.md', '.progress/log.json', 'dashboard/js-core-data.js',
    'scripts/test-solution.js', 'tests/HashMap/two-sum.test.js', 'tests/Arrays/product-of-array-except-self.test.js', 'tests/Two-Pointers/valid-palindrome.test.js']);
  for (const file of files) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.copyFileSync(path.join(repoRoot, file), path.join(root, file));
  }
  fs.writeFileSync(path.join(root, '.progress/log.json'), legacyLog);
  fs.writeFileSync(path.join(root, '01-DSA-Questions.md'), sourceChecklist.replace('- [x] [Move Zeroes]', '- [ ] [Move Zeroes]'));
  now = new Date('2026-10-02T19:00:00Z'); // 12:30 AM India, October 3.
  io = { ...fs };
  server = createDashboardServer({ root, clock: () => now, progressIO: io });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); base = `http://127.0.0.1:${server.address().port}`;
});
afterEach(async () => {
  await new Promise(resolve => server.close(resolve)); fs.rmSync(root, { recursive: true, force: true });
  assert.equal(fs.readFileSync(path.join(repoRoot, '.progress/log.json'), 'utf8'), sourceLog);
  assert.equal(fs.readFileSync(path.join(repoRoot, '01-DSA-Questions.md'), 'utf8'), sourceChecklist);
});
const get = async url => (await fetch(base + url)).json();
const post = (url, body) => fetch(base + url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const attempt = (outcome, extra = {}) => ({ id: randomUUID(), track: 'dsa', itemId: 'HashMap/two-sum.js', attemptType: 'first_attempt', outcome, ...extra });
const speak = (extra = {}) => ({ id: randomUUID(), track: 'speaking', itemId: 'js:question:what-is-a-closure', attemptType: 'js_core', explanation: 'partial', ...extra });
for (const outcome of ['independent', 'hinted', 'studied_solution', 'failed']) test(`API persists ${outcome} without changing checklist/completion history`, async () => {
  const response = await post('/api/attempts', attempt(outcome, { explanation: 'partial', minutes: 25, confidence: 3 }));
  assert.equal(response.status, 201); const { event } = await response.json();
  assert.equal(event.outcome, outcome); assert.equal(event.date, '2026-10-03'); assert.equal(event.explanation, 'partial');
  assert.equal(event.verification, ['independent', 'hinted'].includes(outcome) ? 'tests_passed' : 'unknown');
  const progress = loadProgress(root); assert.equal(progress.version, 2); assert.deepEqual(progress.entries, JSON.parse(legacyLog).entries);
  assert.equal(fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8'), sourceChecklist.replace('- [x] [Move Zeroes]', '- [ ] [Move Zeroes]'));
  assert.equal((await get('/api/progress')).summary.attempts[outcome], 1);
});
test('English/custom and JS Core evidence survive reload and server restart with stable IDs', async () => {
  const jsResponse = await post('/api/attempts', speak({ communicationGap: 'Could not start clearly' })); assert.equal(jsResponse.status, 201);
  const english = { ...speak(), itemId: 'custom:' + randomUUID(), attemptType: 'project', question: 'Explain my real project architecture', explanation: 'yes' };
  assert.equal((await post('/api/attempts', english)).status, 201);
  await new Promise(resolve => server.close(resolve));
  server = createDashboardServer({ root, clock: () => now }); await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); base = `http://127.0.0.1:${server.address().port}`;
  const data = await get('/api/data');
  assert.equal(data.evidence.latest['speaking:js:question:what-is-a-closure'].explanation, 'partial');
  assert.equal(data.evidence.latest['speaking:' + english.itemId].explanation, 'yes');
  assert.equal(data.evidence.summary.explanations.yes, 1); assert.equal(data.evidence.summary.explanations.partial, 1);
  assert.equal(data.evidence.today.weakPoint.channel, 'speaking');
});
test('Topics persist retrieval/practical evidence with shared summaries, no invented completion', async () => {
  const body = { id: randomUUID(), track: 'technical', itemId: 'topic:03-React.md', attemptType: 'practical_task', outcome: 'hinted', explanation: 'partial', technicalGap: 'Dependency reasoning', minutes: 35 };
  assert.equal((await post('/api/attempts', body)).status, 201);
  const evidence = await get('/api/progress'); assert.equal(evidence.latest['technical:' + body.itemId].outcome, 'hinted');
  assert.equal(evidence.readiness.tracks.find(item => item.topic === 'React').practicalAttempts, 1);
  assert.equal(evidence.summary.minutes, 35); assert.equal(evidence.weekly.recurringTechnicalGaps[0].count, 1);
  assert.deepEqual(evidence.completion, buildStudyState(root, now).completion);
});
test('Today, Revision and Progress share date-based states and bounded reviews', async () => {
  for (const file of ['Arrays/move-zeroes.js', 'HashMap/two-sum.js', 'Two-Pointers/valid-palindrome.js']) {
    assert.equal((await post('/api/attempts', attempt('failed', { itemId: file }))).status, 201);
  }
  assert.equal((await post('/api/attempts', speak())).status, 201);
  assert.equal((await get('/api/review')).due.length, 0);
  now = new Date('2026-10-03T19:00:00Z');
  const revision = await get('/api/review'); const today = await get('/api/today'); const data = await get('/api/data');
  assert.equal(today.date, '2026-10-04'); assert.equal(revision.due.length, 1); assert.equal(revision.dueCount, 4);
  assert.deepEqual(today.revision, revision.due); assert.deepEqual(data.evidence.review, revision);
  assert.ok(today.speaking); assert.ok(today.weakPoint); assert.equal(data.evidence.summary.attempts.failed, 3);
  assert.deepEqual(revision, buildStudyState(root, now).review);
});
test('successful saved attempt can be completed separately; failed attempt cannot', async () => {
  const file = 'Arrays/move-zeroes.js';
  const failed = await (await post('/api/attempts', attempt('failed', { itemId: file }))).json();
  assert.equal((await post('/api/done', { path: file, eventId: failed.event.id, confirmed: true })).status, 400);
  assert.equal(parseChecklist(fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8')).map.get(file).checked, false);
  const body = attempt('independent'); const success = await (await post('/api/attempts', body)).json();
  assert.equal((await (await post('/api/done', { path: body.itemId, eventId: success.event.id })).json()).ok, true);
  assert.deepEqual(loadProgress(root).entries.slice(0, 8), JSON.parse(legacyLog).entries.slice(0, 8));
  assert.equal(loadProgress(root).events.length, 2);
});
test('untested success requires explicit self-certification, including completion afterwards', async () => {
  const file = 'Arrays/move-zeroes.js'; const body = attempt('hinted', { itemId: file });
  assert.equal((await post('/api/attempts', body)).status, 409); assert.equal(loadProgress(root).events.length, 0);
  const success = await (await post('/api/attempts', { ...body, confirmed: true })).json();
  assert.equal(success.event.verification, 'self_certified');
  assert.equal((await (await post('/api/done', { path: file, eventId: success.event.id, confirmed: true })).json()).ok, true);
  assert.equal(parseChecklist(fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8')).map.get(file).checked, true);
});
test('broken solution cannot save independent success or alter history', async () => {
  fs.writeFileSync(path.join(root, 'HashMap/two-sum.js'), 'module.exports = () => [];');
  const response = await post('/api/attempts', attempt('independent')); assert.equal(response.status, 409);
  assert.match((await response.json()).error, /Tests failed/); assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), legacyLog);
});
test('idempotent acknowledgement retry creates no duplicate, even after code changes', async () => {
  const body = attempt('independent'); const first = await (await post('/api/attempts', body)).json();
  fs.writeFileSync(path.join(root, 'HashMap/two-sum.js'), 'module.exports = () => [];');
  const retry = await post('/api/attempts', body); assert.equal(retry.status, 200); assert.deepEqual((await retry.json()).event, first.event);
  assert.equal(loadProgress(root).events.length, 1);
  assert.equal((await post('/api/attempts', { ...body, outcome: 'failed' })).status, 409);
});
test('malformed fields, injection and arbitrary JS IDs are rejected without migration', async () => {
  for (const body of [attempt('mastered'), attempt('failed', { confidence: 0 }), attempt('failed', { minutes: -2 }),
    speak({ communicationGap: 'x'.repeat(241) }), speak({ date: '1999-01-01' }), attempt('failed', { itemId: 'scripts/today.js' }),
    speak({ itemId: 'js:unknown' }), { ...attempt('failed'), confirmed: 'yes' }]) assert.equal((await post('/api/attempts', body)).status, 400);
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), legacyLog);
});
test('write failure reports error, preserves bytes and does not advance Today/progress', async () => {
  io.renameSync = () => { throw new Error('Injected disk failure'); };
  const response = await post('/api/attempts', attempt('failed')); assert.equal(response.status, 500);
  const body = await response.json(); assert.equal(body.ok, undefined); assert.match(body.error, /disk failure/);
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), legacyLog);
  assert.equal((await get('/api/progress')).summary.attempts.failed, 0); assert.equal((await get('/api/today')).weakPoint, null);
  assert.ok(!fs.readdirSync(path.join(root, '.progress')).some(file => file.endsWith('.tmp') || file === '.write.lock'));
});
test('malformed existing JSON is never treated as empty progress', async () => {
  fs.writeFileSync(path.join(root, '.progress/log.json'), '{malformed');
  const response = await post('/api/attempts', speak()); assert.equal(response.status, 500);
  assert.match((await response.json()).error, /original file has not been changed/);
  assert.equal((await fetch(base + '/api/progress')).status, 500);
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), '{malformed');
});
test('cross-origin/malformed requests cannot save evidence', async () => {
  assert.equal((await fetch(base + '/api/attempts', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.com' }, body: JSON.stringify(speak()) })).status, 403);
  assert.equal((await fetch(base + '/api/attempts', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: '{}' })).status, 415);
  assert.equal((await fetch(base + '/api/attempts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400);
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), legacyLog);
});

test('CLI tools run on migrated evidence and match shared dashboard due/progress selection', async () => {
  const { execFileSync } = require('node:child_process');
  fs.cpSync(path.join(repoRoot, 'scripts'), path.join(root, 'scripts'), { recursive: true });
  now = new Date();
  const run = (file, args = []) => execFileSync(process.execPath, [file, ...args], { cwd: root, encoding: 'utf8' });
  const done = run('scripts/done.js', ['Arrays/move-zeroes', '--outcome', 'failed', '--explanation', 'partial']);
  assert.match(done, /Checklist not changed/);
  assert.equal(parseChecklist(fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8')).map.get('Arrays/move-zeroes.js').checked, false);
  assert.equal(loadProgress(root).events.at(-1).outcome, 'failed');
  run('scripts/done.js', ['HashMap/two-sum', '--outcome', 'independent', '--type', 'review', '--explanation', 'yes']);
  const evidence = buildStudyState(root, now);
  const today = run('scripts/today.js'); const progress = run('scripts/progress.js'); const review = run('scripts/review.js');
  assert.ok(today.includes(evidence.today.main.title)); assert.match(progress, /independent: 1/); assert.match(progress, /failed: 1/);
  const dashboard = await get('/api/progress'); assert.deepEqual(dashboard.summary, evidence.summary);
  assert.deepEqual((await get('/api/review')), evidence.review);
  if (evidence.review.baseline) assert.ok(review.includes(evidence.review.baseline.title));
  const file = path.join(root, '.progress/log.json'); const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const event of raw.events) { event.date = '2000-01-01'; event.timestamp = '2000-01-01T00:00:00.000Z'; }
  fs.writeFileSync(file, JSON.stringify(raw));
  const due = buildStudyState(root, now).review;
  assert.ok(run('scripts/review.js').includes(due.due[0].title)); assert.ok(run('scripts/today.js').includes(due.due[0].title));
  assert.deepEqual(await get('/api/review'), due);
});

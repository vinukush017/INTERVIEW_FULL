const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { workspace } = require('../fixtures/planning-workspace');
const { createDashboardServer } = require('../../scripts/serve-dashboard');
const { loadProgress, repoRoot } = require('../../scripts/lib/progress');
const { buildStudyState } = require('../../scripts/lib/study-state');
let root, server, base, now, io;
const sourceHistory = fs.readFileSync(path.join(repoRoot, '.progress/log.json'), 'utf8');
const sourceChecklist = fs.readFileSync(path.join(repoRoot, '01-DSA-Questions.md'), 'utf8');
beforeEach(async () => {
  root = workspace(); now = new Date('2026-10-03T12:00Z'); io = { ...fs };
  server = createDashboardServer({ root, clock: () => now, progressIO: io });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); }); base = `http://127.0.0.1:${server.address().port}`;
});
afterEach(async () => {
  if (server.listening) await new Promise(resolve => server.close(resolve)); fs.rmSync(root, { recursive: true, force: true });
  assert.equal(fs.readFileSync(path.join(repoRoot, '.progress/log.json'), 'utf8'), sourceHistory);
  assert.equal(fs.readFileSync(path.join(repoRoot, '01-DSA-Questions.md'), 'utf8'), sourceChecklist);
});
const get = async url => (await fetch(base + url)).json();
const post = (url, body, headers = {}) => fetch(base + url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
const setup = async (body = {}) => { const response = await post('/api/planning', body); assert.equal(response.status, 201); return response.json(); };
async function review(overrides = {}) {
  const p = (await get('/api/planning')).state;
  return post('/api/weekly-reviews', { id: randomUUID(), expectedRevision: p.revision, availableHours: p.availableHours, busyWeek: false,
    nextFocus: p.weeklyFocus, carryForward: [], deprioritize: '', reflection: '', firstTask: 'Explain the invariant.', decision: 'continue', ...overrides });
}
const attempt = (outcome, extra = {}) => ({ track: 'dsa', itemId: 'HashMap/two-sum.js', attemptType: 'first_attempt', outcome, ...extra });

test('planning is explicitly uninitialized on all read endpoints until user saves setup', async () => {
  const original = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8');
  assert.equal((await get('/api/planning')).initialized, false); assert.equal((await get('/api/data')).phase, null);
  assert.equal((await get('/api/today')).planning.initialized, false);
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), original);
  const page = await (await fetch(base + '/')).text(); assert.match(page, /id="planningSetup"/); assert.match(page, /Save Weekly Review/); assert.ok(!page.includes('Weekly review — upcoming'));
});
test('saved setup survives reload/server restart and Today/Progress display explicit phase/week', async () => {
  await setup({ phaseId: 'phase-2', learningWeek: 6, availableHours: 10 });
  await new Promise(resolve => server.close(resolve)); server = createDashboardServer({ root, clock: () => now });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); base = `http://127.0.0.1:${server.address().port}`;
  const data = await get('/api/data'); assert.equal(data.phase, 'phase-2'); assert.equal(data.learningWeek, 6);
  assert.equal((await get('/api/today')).planning.state.availableHours, 10); assert.equal((await get('/api/progress')).planning.state.learningWeek, 6);
  assert.deepEqual(loadProgress(root).entries, JSON.parse(sourceHistory).entries);
});
test('calendar delay does not auto-advance dashboard phase/week', async () => {
  await setup(); now = new Date('2026-10-17T12:00Z'); const data = await get('/api/data'); assert.equal(data.learningWeek, 1);
  assert.equal(data.evidence.planning.reviewRecommended, true); assert.equal(data.phase, 'phase-1');
});
test('weekly review aggregates existing evidence and persists decisions/snapshot without modifying events', async () => {
  await setup(); assert.equal((await post('/api/attempts', attempt('independent', { explanation: 'partial', minutes: 25, communicationGap: 'Long opening' }))).status, 201);
  const before = loadProgress(root).events;
  const response = await review({ nextFocus: { technical: 'React rendering', dsa: 'Sliding Window', speaking: 'Use a shorter opening' }, reflection: 'One completed output; clarify the tradeoff.' }); assert.equal(response.status, 201);
  const saved = (await response.json()).saved; assert.equal(saved.summary.attempts.independent, 1); assert.equal(saved.summary.explanations.partial, 1); assert.equal(saved.summary.minutes, 25);
  const data = await get('/api/data'); assert.equal(data.learningWeek, 2); assert.equal(data.next.topic, 'Sliding Window');
  assert.deepEqual(data.evidence.planning.lastReview, saved); assert.deepEqual(loadProgress(root).events, before);
  assert.equal((await get('/api/weekly-review')).state.weeklyFocus.speaking, 'Use a shorter opening');
});
test('consolidate preserves phase/week and respects reduced capacity with bounded revision', async () => {
  await setup(); await post('/api/attempts', attempt('failed', { explanation: 'partial' }));
  now = new Date('2026-10-10T12:00Z'); const response = await review({ decision: 'consolidate', availableHours: 6, busyWeek: true }); assert.equal(response.status, 201);
  const data = await get('/api/data'); assert.equal(data.learningWeek, 1); assert.equal(data.phase, 'phase-1'); assert.equal(data.evidence.planning.budget.maxNewProblems, 0);
  assert.equal(data.next.itemId, 'HashMap/two-sum.js'); assert.match(data.next.reason, /revision is due/); assert.equal(data.evidence.review.due.length, 1);
});
test('advance API returns evidence warnings, then saves explicit manual confirmation', async () => {
  await setup(); const first = await review({ decision: 'advance' }); assert.equal(first.status, 409);
  const warning = await first.json(); assert.equal(warning.needsConfirmation, true); assert.ok(warning.warnings.length >= 3);
  assert.equal(loadProgress(root).planning.phaseId, 'phase-1'); assert.equal(loadProgress(root).weeklyReviews.length, 0);
  const response = await review({ decision: 'advance', confirmAdvance: true }); assert.equal(response.status, 201);
  assert.equal((await get('/api/data')).phase, 'phase-2');
});
test('essential carry-forward comes before focus and secondary stays a small explicit item', async () => {
  await setup(); const response = await review({ carryForward: [
    { role: 'essential', text: 'Review Valid Palindrome', itemId: 'Two-Pointers/valid-palindrome.js' }, { role: 'secondary', text: 'One short phrase' },
  ] }); assert.equal(response.status, 201);
  const today = await get('/api/today'); assert.equal(today.main.itemId, 'Two-Pointers/valid-palindrome.js'); assert.equal(today.carryForward.length, 2);
  const next = await review({ carryForward: [] }); assert.equal(next.status, 201); assert.deepEqual((await get('/api/today')).carryForward, []);
});
test('validation rejects unknown fields, invalid hours and excessive carry without changes', async () => {
  const before = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8');
  for (const body of [{ availableHours: -1 }, { learningWeek: 0 }, { phaseId: 'fake' }, { planning: {} }]) assert.equal((await post('/api/planning', body)).status, 400);
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), before); await setup();
  const initialized = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8');
  for (const overrides of [{ availableHours: 100 }, { carryForward: [{ role: 'essential', text: 'a' }, { role: 'essential', text: 'b' }] },
    { nextFocus: { technical: '', speaking: 'Explain' } }, { firstTask: '' }, { summary: { mastered: true } }]) assert.equal((await review(overrides)).status, 400);
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), initialized);
});
test('stale review is rejected and idempotent retries cannot advance twice', async () => {
  await setup(); const p = (await get('/api/planning')).state;
  const body = { id: randomUUID(), expectedRevision: 0, availableHours: 12, busyWeek: false, nextFocus: p.weeklyFocus, carryForward: [], firstTask: 'One small step', decision: 'continue' };
  assert.equal((await post('/api/weekly-reviews', body)).status, 201); assert.equal((await post('/api/weekly-reviews', body)).status, 201);
  assert.equal((await get('/api/data')).learningWeek, 2); assert.equal(loadProgress(root).weeklyReviews.length, 1);
  assert.equal((await post('/api/weekly-reviews', { ...body, id: randomUUID() })).status, 409);
});
test('planning write failure cannot report success or erase legacy bytes', async () => {
  const before = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'); io.renameSync = () => { throw new Error('Injected setup disk failure'); };
  const response = await post('/api/planning', {}); assert.equal(response.status, 500); assert.ok(!(await response.json()).ok);
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), before); assert.equal((await get('/api/data')).phase, null);
});
test('review write failure leaves state, history and Today unchanged; user can retry', async () => {
  await setup(); const before = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'); io.renameSync = () => { throw new Error('Injected review disk failure'); };
  const response = await review(); assert.equal(response.status, 500); assert.ok(!(await response.json()).ok); assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), before);
  assert.equal((await get('/api/data')).learningWeek, 1); assert.equal(loadProgress(root).weeklyReviews.length, 0); io.renameSync = fs.renameSync;
  assert.equal((await review()).status, 201);
});
test('loopback/origin/JSON protection also applies to planning and review mutation routes', async () => {
  for (const url of ['/api/planning', '/api/weekly-reviews']) {
    assert.equal((await post(url, {}, { Origin: 'https://example.com' })).status, 403);
    assert.equal((await post(url, {}, { 'Content-Type': 'text/plain' })).status, 415);
    assert.equal((await fetch(base + url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })).status, 400);
  }
});
test('CLI and dashboard share explicit phase/week/focus, review and planning summaries', async () => {
  now = new Date(); await setup({ phaseId: 'phase-2', learningWeek: 6, availableHours: 8 });
  const run = file => execFileSync(process.execPath, [file], { cwd: root, encoding: 'utf8' });
  for (const file of ['today', 'review', 'progress']) {
    const output = run(`scripts/${file}.js`); assert.match(output, /Learning week 6/); assert.match(output, /Core Patterns & Full-Stack Practice/); assert.match(output, /React rendering \+ effects/);
  }
  const state = buildStudyState(root, now); assert.ok(run('scripts/today.js').includes(state.today.main.title));
  assert.deepEqual((await get('/api/review')), state.review); assert.deepEqual((await get('/api/today')).planning, state.planning);
});
test('a late missed week does not double workload, and review history persists across reload', async () => {
  await setup({ availableHours: 6 }); now = new Date('2026-11-03T12:00Z');
  assert.equal((await get('/api/planning')).state.learningWeek, 1); assert.equal((await get('/api/planning')).budget.maxNewProblems, 0);
  const response = await review({ decision: 'consolidate', availableHours: 6, busyWeek: true }); assert.equal(response.status, 201);
  const view = await get('/api/weekly-review'); assert.equal(view.history.length, 1); assert.equal(view.state.learningWeek, 1); assert.equal(view.budget.maxNewProblems, 0);
  assert.deepEqual(view.history[0], loadProgress(root).weeklyReviews[0]); assert.equal(view.state.carryForward.length, 0);
});

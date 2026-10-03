const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { workspace } = require('../fixtures/planning-workspace');
const { createDashboardServer } = require('../../scripts/serve-dashboard');
const { loadProgress } = require('../../scripts/lib/progress');
const { buildStudyState } = require('../../scripts/lib/study-state');
const { recordAttempt, validateAttempt } = require('../../scripts/lib/evidence');
const { itemRegistry } = require('../../scripts/lib/items');
let root, server, base, now;
beforeEach(async () => {
  root = workspace(); now = new Date('2026-10-03T12:00Z');
  server = createDashboardServer({ root, clock: () => now });
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  base = `http://127.0.0.1:${server.address().port}`;
});
afterEach(async () => { if (server.listening) await new Promise(resolve => server.close(resolve)); fs.rmSync(root, { recursive: true, force: true }); });
const get = async url => (await fetch(base + url)).json();
const post = (url, body) => fetch(base + url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const body = (file, outcome, extra = {}) => ({ id: randomUUID(), itemId: file, track: 'dsa', attemptType: 'first_attempt', outcome, explanation: 'yes', ...extra });
const core = 'Trees/binary-tree-level-order-traversal.js', transfer = 'Trees/binary-tree-right-side-view.js';
function seed(file, date, extra = {}) {
  now = new Date(date + 'T12:00Z');
  recordAttempt(root, validateAttempt(body(file, 'independent', extra), itemRegistry(root)), { now, verification: 'self_certified' });
}
test('API reconciles every problem and exposes canonical roles, patterns and unknown legacy evidence', async () => {
  const data = await get('/api/data'), items = data.topics.flatMap(topic => topic.items);
  assert.equal(items.length, 210); assert.equal(data.flatQueue.length, 210); assert.equal(data.solvedCount, 8);
  assert.deepEqual(data.evidence.dsa.roles, { CORE: 73, SUPPORTING: 66, TRANSFER: 36, OPTIONAL: 35 });
  assert.equal(data.evidence.dsa.patterns.length, 38);
  const old = items.find(item => item.path === 'HashMap/two-sum.js'); assert.equal(old.checked, true);
  assert.equal(old.evidence.latestOutcome, 'unknown'); assert.equal(old.readiness, 'Not Started');
});
test('initial DSA view offers Core, all roles, pattern/evidence/due/weak filters and All Problems', async () => {
  const page = await (await fetch(base + '/')).text();
  assert.match(page, /id="roleFilter"><option value="CORE">/);
  for (const id of ['roleFilter','patternFilter','attemptFilter','readinessFilter','dueFilter','weakFilter','allProblems','patternsView','patternDetail']) assert.ok(page.includes(`id="${id}"`));
});
test('pattern detail reuses an allowlisted canonical README rather than copied full guidance', async () => {
  const data = await get('/api/data'), p = data.evidence.dsa.patterns.find(item => item.id === 'tree-bfs');
  assert.equal(p.source, 'Trees/README.md'); assert.ok(p.cue.length > 0); assert.ok(p.members.includes(core)); assert.ok(p.members.includes(transfer));
  const doc = await get('/api/content?path=' + encodeURIComponent(p.source)); assert.ok(doc.html.includes('Trees'));
  assert.equal((await get('/api/content?path=Trie/README.md')).path, 'Trie/README.md');
});
test('failed core evidence survives restart, updates weak filter context, Progress and next-day Revision', async () => {
  assert.equal((await post('/api/attempts', body(core, 'failed', { explanation: 'partial', communicationGap: 'Skipped level boundaries' }))).status, 201);
  await new Promise(resolve => server.close(resolve)); server = createDashboardServer({ root, clock: () => now });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve)); base = `http://127.0.0.1:${server.address().port}`;
  let data = await get('/api/data'); const item = data.topics.flatMap(topic => topic.items).find(item => item.path === core);
  assert.equal(item.evidence.weak, true); assert.equal(item.readiness, 'Learning'); assert.equal(item.evidence.explanation, 'partial');
  assert.equal((await get('/api/progress')).dsa.patterns.find(item => item.id === 'tree-bfs').communicationWeakness, true);
  now = new Date('2026-10-04T12:00Z'); assert.equal((await get('/api/review')).due[0].itemId, core); assert.equal((await get('/api/today')).main.itemId, core);
});
test('Today honors initialized granular focus; transfer is unavailable after a first solve', async () => {
  assert.equal((await post('/api/planning', { phaseId: 'phase-2', learningWeek: 5 })).status, 201);
  const p = loadProgress(root).planning;
  assert.equal((await post('/api/weekly-reviews', { id: randomUUID(), expectedRevision: p.revision, availableHours: 12, busyWeek: false, carryForward: [], nextFocus: { ...p.weeklyFocus, dsa: 'Trees: BFS levels' }, decision: 'consolidate', firstTask: 'Explain levels' })).status, 201);
  seed(core, '2026-10-03'); const data = await get('/api/data');
  assert.equal(data.evidence.dsa.patterns.find(item => item.id === 'tree-bfs').transferCandidate, null);
  assert.notEqual(data.next.role, 'TRANSFER'); assert.notEqual(data.next.role, 'OPTIONAL');
});
test('qualified transfer question includes recognition clue and persisted speaking evidence uses the same ID', async () => {
  seed(core, '2026-10-03'); seed(core, '2026-10-04', { attemptType: 'review' });
  const data = await get('/api/data'), item = data.topics.flatMap(topic => topic.items).find(item => item.path === transfer);
  assert.equal(data.evidence.dsa.patterns.find(item => item.id === 'tree-bfs').transferCandidate, transfer);
  assert.match(item.question, /What clue made you recognize this pattern/);
  const response = await post('/api/attempts', { track: 'speaking', itemId: transfer, attemptType: 'dsa_explanation', question: item.question, explanation: 'partial', communicationGap: 'No recognition clue' });
  assert.equal(response.status, 201); assert.equal(loadProgress(root).events.at(-1).question, item.question);
  assert.equal((await get('/api/progress')).dsa.evidence[transfer].explanation, 'partial');
});
test('catalog refresh picks up a newly registered Supporting problem without restarting server', async () => {
  const { addProblem } = await import('../../scripts/add-problem.mjs');
  addProblem({ root, folder: 'Arrays', title: 'Registered Refresh Exercise', pattern: 'traversal' });
  const data = await get('/api/data'); assert.equal(data.totalCount, 211);
  assert.equal(data.flatQueue.filter(item => item.relPath === 'Arrays/registered-refresh-exercise.js').length, 1);
  assert.equal(data.topics.flatMap(topic => topic.items).find(item => item.path === 'Arrays/registered-refresh-exercise.js').role, 'SUPPORTING');
});
test('optional challenge remains accessible in editor and saves evidence without erasing core proof', async () => {
  seed(core, '2026-10-03'); seed(core, '2026-10-04', { attemptType: 'review' }); const file = 'Binary-Search/median-of-two-sorted-arrays.js';
  assert.equal((await fetch(base + '/api/file?path=' + encodeURIComponent(file))).status, 200);
  assert.equal((await post('/api/attempts', body(file, 'failed'))).status, 201);
  const data = await get('/api/data'); assert.equal(data.topics.flatMap(topic => topic.items).find(item => item.path === file).role, 'OPTIONAL');
  assert.equal(data.evidence.dsa.patterns.find(item => item.id === 'tree-bfs').state, 'Transfer Needed');
});
test('existing events and planning/review history remain byte-equivalent projections on read', async () => {
  await post('/api/planning', {}); seed(core, '2026-10-03'); const p = loadProgress(root).planning;
  await post('/api/weekly-reviews', { id: randomUUID(), expectedRevision: p.revision, availableHours: 10, busyWeek: false, carryForward: [], nextFocus: p.weeklyFocus, decision: 'consolidate', firstTask: 'Explain the level boundary' });
  const before = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8');
  for (const route of ['/api/data','/api/progress','/api/today','/api/review','/api/weekly-review']) await get(route);
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), before);
  const state = buildStudyState(root, now); assert.equal(state.legacyCount, 8); assert.equal(state.events.length, 1); assert.equal(state.planning.history.length, 1);
});
test('dashboard and shared CLI model expose identical pattern projections and selected task', async () => {
  await post('/api/attempts', body('HashMap/two-sum.js', 'hinted', { explanation: 'partial' }));
  const shared = buildStudyState(root, now); assert.deepEqual((await get('/api/progress')).dsa, shared.dsa);
  assert.deepEqual((await get('/api/today')).main, shared.today.main);
});

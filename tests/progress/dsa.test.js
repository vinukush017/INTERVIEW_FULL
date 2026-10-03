const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { workspace } = require('../fixtures/planning-workspace');
const { repoRoot, loadProgress, parseChecklist, parseQueue } = require('../../scripts/lib/progress');
const { loadCatalog, validateCatalog, validateLibrary } = require('../../scripts/lib/dsa-catalog');
const { itemRegistry } = require('../../scripts/lib/items');
const { deriveReviewStates, dueReviews, boundedReviews } = require('../../scripts/lib/revision');
const { derivePatterns, selectDSA } = require('../../scripts/lib/dsa-patterns');
const { validateAttempt, recordAttempt } = require('../../scripts/lib/evidence');
const { buildStudyState } = require('../../scripts/lib/study-state');
const { initializePlanning, saveWeeklyReview } = require('../../scripts/lib/planning');
let root, now;
beforeEach(() => { root = workspace(); now = new Date('2026-10-03T12:00Z'); });
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));
const core = 'Trees/binary-tree-level-order-traversal.js'; const transfer = 'Trees/binary-tree-right-side-view.js';
function attempt(file = core, outcome = 'independent', date = '2026-10-03', extra = {}) {
  now = new Date(date + 'T12:00Z');
  const values = validateAttempt({ track: 'dsa', itemId: file, attemptType: 'first_attempt', outcome, explanation: 'yes', ...extra }, itemRegistry(root));
  return recordAttempt(root, values, { now, verification: ['independent','hinted'].includes(outcome) ? 'self_certified' : 'unknown' });
}
const view = () => buildStudyState(root, now).dsa;
const pattern = id => view().patterns.find(item => item.id === id);
function qualify() { attempt(); attempt(core, 'independent', '2026-10-04', { attemptType: 'review' }); }
function choose(focus = 'Trees', phase = 'phase-2') {
  const text = fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8'); const v = view();
  return selectDSA(loadProgress(root), itemRegistry(root), parseQueue(text), parseChecklist(text).map, v.patterns, v.evidence, focus, phase);
}
test('all 206 original paths remain with four targeted gap contracts; catalog/checklist/queue/files reconcile', () => {
  // No test dependency on a developer snapshot: canonical fixed folder counts preserve the original library.
  const result = validateLibrary(repoRoot); assert.equal(result.total, 210); assert.equal(result.folders.Trie, 1); assert.equal(result.folders.Arrays, 12); assert.equal(result.folders['Sliding-Window'], 7);
  assert.deepEqual(result.roles, { CORE: 73, SUPPORTING: 66, TRANSFER: 36, OPTIONAL: 35 });
  assert.equal(loadCatalog(repoRoot).problems.filter(item => !['Arrays/range-sum-query-immutable.js','Arrays/subarray-sum-equals-k.js','Sliding-Window/maximum-average-subarray-i.js','Trie/implement-trie-prefix-tree.js'].includes(item.path)).length, 206);
});
test('every catalog path is unique, every role/pattern/transfer reference valid and core count coverage-based', () => {
  const catalog = loadCatalog(root); assert.equal(new Set(catalog.problems.map(item => item.path)).size, catalog.problems.length);
  assert.ok(catalog.problems.filter(item => item.role === 'CORE').length >= 60 && catalog.problems.filter(item => item.role === 'CORE').length <= 80);
  for (const item of catalog.problems) { assert.ok(catalog.byPattern.has(item.pattern)); assert.equal(item.difficulty, 'unknown'); if (item.role === 'TRANSFER') assert.equal(item.transferFor, item.pattern); }
});
for (const name of ['duplicate path','invalid role','invalid pattern','invalid transfer','duplicate pattern','invalid source','missing core']) test(`catalog rejects ${name}`, () => {
  const value = JSON.parse(fs.readFileSync(path.join(root, 'data/dsa-catalog.json')));
  if (name === 'duplicate path') value.problems.push(value.problems[0]);
  if (name === 'invalid role') value.problems[0].role = 'MASTERED';
  if (name === 'invalid pattern') value.problems[0].pattern = 'fake';
  if (name === 'invalid transfer') value.problems.find(item => item.role === 'TRANSFER').transferFor = 'fake';
  if (name === 'duplicate pattern') value.patterns.push(value.patterns[0]);
  if (name === 'invalid source') value.patterns[0].source = '../README.md';
  if (name === 'missing core') value.problems.filter(item => item.pattern === 'tree-bfs' && item.role === 'CORE').forEach(item => item.role = 'SUPPORTING');
  assert.throws(() => validateCatalog(value));
});
test('catalog/library validation detects an orphan queue/checklist or missing file', () => {
  const master = path.join(root, '01-DSA-Questions.md'); fs.appendFileSync(master, '\n- [ ] [Orphan](./Arrays/orphan.js)\n'); assert.throws(() => validateLibrary(root), /register/);
});
test('all named challenge problems remain Optional and accessible; textbook sorts/warm-ups do not block core', () => {
  const catalog = loadCatalog(root);
  for (const file of ['Binary-Search/median-of-two-sorted-arrays.js','Backtracking/n-queens.js','Dynamic-Programming/edit-distance.js','Stack/largest-rectangle-in-histogram.js','Intervals/minimum-interval-to-include-each-query.js','Sorting/bubble-sort.js','Sorting/selection-sort.js','Sorting/insertion-sort.js','Math/fizzbuzz.js','Stack/baseball-game.js']) assert.equal(catalog.byPath.get(file).role, 'OPTIONAL', file);
});
for (const [file, id] of [['Arrays/range-sum-query-immutable.js','prefix-sum'],['Arrays/subarray-sum-equals-k.js','prefix-sum'],['Sliding-Window/maximum-average-subarray-i.js','fixed-window'],['Trie/implement-trie-prefix-tree.js','trie']]) test(`targeted gap ${id}: ${file} is registered and intentionally unsolved`, () => {
  const catalog = loadCatalog(root); assert.equal(catalog.byPath.get(file).pattern, id); assert.equal(parseChecklist(fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8')).map.get(file).checked, false);
  const solution = require(path.join(root, file)); assert.equal(typeof solution, 'function');
  assert.match(fs.readFileSync(path.join(root, file), 'utf8'), /Constraints:|contract/); assert.match(fs.readFileSync(path.join(root, file), 'utf8'), /Practice not implemented yet/);
});
test('legacy completion projects to unknown pattern evidence without new attempts or dates', () => {
  const before = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'); const v = view();
  assert.equal(pattern('hashing').state, 'Not Started'); assert.equal(v.evidence['HashMap/two-sum.js'].latestOutcome, 'unknown'); assert.equal(v.evidence['HashMap/two-sum.js'].lastIndependent, null);
  assert.deepEqual(loadProgress(root).entries, JSON.parse(before).entries); assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), before);
});
test('one independent solve is Practicing, not demonstrated or eligible transfer', () => {
  attempt(); assert.equal(pattern('tree-bfs').state, 'Practicing'); assert.equal(pattern('tree-bfs').transferEligible, false); assert.notEqual(choose().role, 'TRANSFER');
});
test('same-day independent retries cannot manufacture delayed core evidence', () => {
  attempt(); attempt(); assert.equal(pattern('tree-bfs').delayedCore, 0); assert.equal(pattern('tree-bfs').transferCandidate, null);
});
test('hinted core stays Learning; studied solution retains next-day review and does not unlock transfer', () => {
  attempt(core, 'hinted'); assert.equal(pattern('tree-bfs').state, 'Learning'); assert.equal(pattern('tree-bfs').transferEligible, false);
  attempt(core, 'studied_solution'); const state = buildStudyState(root, now); assert.equal(state.reviewStates.find(item => item.itemId === core && item.channel === 'coding').nextDue, '2026-10-04');
});
test('delayed independent recall with clear explanation unlocks a transfer candidate', () => {
  qualify(); assert.equal(pattern('tree-bfs').state, 'Transfer Needed'); assert.equal(pattern('tree-bfs').transferCandidate, transfer); assert.equal(choose('Trees: BFS levels').itemId, transfer);
});
test('partial explanation after correct delayed core code is a communication weakness and blocks transfer', () => {
  attempt(); attempt(core, 'independent', '2026-10-04', { attemptType: 'review', explanation: 'partial', communicationGap: 'Skipped the level boundary' });
  assert.equal(pattern('tree-bfs').communicationWeakness, true); assert.equal(pattern('tree-bfs').transferCandidate, null); assert.equal(pattern('tree-bfs').state, 'Needs Review');
});
test('successful transfer and notes-free explanation create Strong Recent Evidence, preserving separate attempts', () => {
  qualify(); attempt(transfer, 'independent', '2026-10-04'); assert.equal(pattern('tree-bfs').state, 'Strong Recent Evidence'); assert.equal(loadProgress(root).events.length, 3);
});
test('failed transfer recommends review without erasing independent/delayed core proof', () => {
  qualify(); attempt(transfer, 'failed', '2026-10-04'); const p = pattern('tree-bfs'); assert.equal(p.state, 'Needs Review'); assert.equal(p.independentCore, 1); assert.equal(p.delayedCore, 1); assert.match(p.nextAction, /Review/);
});
test('older evidence is not strong recent mastery; return to recall after 30 days', () => {
  qualify(); attempt(transfer, 'independent', '2026-10-04'); now = new Date('2026-12-01T12:00Z'); assert.notEqual(pattern('tree-bfs').state, 'Strong Recent Evidence'); assert.equal(pattern('tree-bfs').transferEligible, false);
});
test('optional failure does not erase the demonstrated core pattern', () => {
  attempt('Stack/daily-temperatures.js'); attempt('Stack/daily-temperatures.js', 'independent', '2026-10-04', { attemptType: 'review' });
  attempt('Stack/largest-rectangle-in-histogram.js', 'failed', '2026-10-04'); assert.equal(pattern('monotonic-stack').state, 'Demonstrated');
});
test('transfer candidates exclude any prior recorded attempt or historical completion without claiming unseen', () => {
  qualify(); attempt(transfer, 'failed', '2026-10-04'); assert.equal(pattern('tree-bfs').transferCandidate, null);
  const item = itemRegistry(root).get(transfer); assert.match(item.question, /What clue made you recognize/); assert.ok(!item.question.includes('unseen'));
});
test('core hinted review precedes optional failed review even when optional is more overdue', () => {
  const due = dueReviews([{ key:'a', role:'OPTIONAL', priority:'optional', channel:'coding', latestOutcome:'failed', nextDue:'2026-09-01' }, { key:'b', role:'CORE', priority:'core', channel:'coding', latestOutcome:'hinted', nextDue:'2026-10-03' }], '2026-10-03');
  assert.deepEqual(due.map(item => item.key), ['b','a']); assert.equal(boundedReviews(due).length, 1);
});
test('Today leads with due Core before optional depth, while essential carry remains first', () => {
  initializePlanning(root, {}, { now }); attempt('HashMap/two-sum.js', 'failed'); attempt('Backtracking/n-queens.js', 'failed'); now = new Date('2026-10-04T12:00Z');
  assert.equal(buildStudyState(root, now).today.main.role, 'CORE'); assert.match(buildStudyState(root, now).today.main.reason, /revision is due/);
  const p = loadProgress(root).planning;
  saveWeeklyReview(root, { id:randomUUID(), expectedRevision:p.revision, availableHours:12, busyWeek:false, nextFocus:p.weeklyFocus, carryForward:[{role:'essential',text:'Manually selected challenge',itemId:'Backtracking/n-queens.js'}], decision:'continue',firstTask:'One selected task' }, { now });
  assert.equal(buildStudyState(root, now).today.main.role, 'OPTIONAL');
});
test('weekly focus matches granular pattern names and phase guidance is a default, not a prohibition', () => {
  assert.equal(choose('Sliding Window: fixed size', 'phase-1').itemId, 'Sliding-Window/maximum-average-subarray-i.js');
  assert.equal(choose('Trees: BFS levels', 'phase-1').itemId, core);
});
test('repeated weak core attempts can select Supporting practice without making all supporting items mandatory', () => {
  attempt('Stack/daily-temperatures.js', 'hinted'); attempt('Stack/daily-temperatures.js', 'hinted'); assert.equal(choose('Monotonic stack').role, 'SUPPORTING');
});
test('optional problems are never automatic fallback even with core checkboxes complete', () => {
  const text = fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8').replaceAll('- [ ]', '- [x]'); fs.writeFileSync(path.join(root, '01-DSA-Questions.md'), text);
  assert.notEqual(choose('', 'phase-1')?.role, 'OPTIONAL');
});
test('weekly snapshots include core/transfer and pattern explanation signals without rewriting prior history', () => {
  initializePlanning(root, {}, { now }); qualify(); attempt(transfer, 'failed', '2026-10-04', { explanation: 'partial' });
  const before = loadProgress(root); const p = before.planning;
  const saved = saveWeeklyReview(root, { id:randomUUID(), expectedRevision:p.revision, availableHours:12, busyWeek:false, nextFocus:p.weeklyFocus, carryForward:[],decision:'consolidate',firstTask:'One recall' }, { now });
  assert.equal(saved.summary.dsaPatterns.independentCoreAttempts, 2); assert.equal(saved.summary.dsaPatterns.transferAttempts, 1); assert.ok(saved.summary.dsaPatterns.patternsPracticed.includes('Trees: BFS levels'));
  assert.ok(saved.summary.dsaPatterns.patternsWithExplanationWeakness.includes('Trees: BFS levels')); assert.deepEqual(loadProgress(root).events,before.events); assert.deepEqual(loadProgress(root).entries,before.entries);
  const stored = loadProgress(root); buildStudyState(root, now); assert.deepEqual(loadProgress(root).weeklyReviews, stored.weeklyReviews); assert.deepEqual(loadProgress(root).planning, stored.planning);
});
test('manual additions register catalog, queue and correct folder atomically, default Supporting', async () => {
  const { addProblem } = await import('../../scripts/add-problem.mjs'); const before = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8');
  const added = addProblem({ root, folder:'Arrays', title:'Range Check Practice',pattern:'prefix-sum' }); assert.equal(added.role,'SUPPORTING'); assert.equal(validateLibrary(root).total,211);
  assert.ok(parseQueue(fs.readFileSync(path.join(root,'01-DSA-Questions.md'),'utf8')).some(item => item.relPath === added.path)); assert.ok(itemRegistry(root).has(added.path));
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'),before);
});
for (const [label, change] of [['invalid pattern',{pattern:'fake'}],['invalid role',{role:'MASTERED'}],['traversal',{folder:'../scripts'}],['missing pattern',{pattern:undefined}],['duplicate',{title:'Move Zeroes'}]]) test(`add workflow rejects ${label} before writes`, async () => {
  const { addProblem } = await import('../../scripts/add-problem.mjs'); const before = fs.readFileSync(path.join(root,'01-DSA-Questions.md'),'utf8');
  assert.throws(() => addProblem({root,folder:'Arrays',title:'New Practice',pattern:'prefix-sum',...change})); assert.equal(fs.readFileSync(path.join(root,'01-DSA-Questions.md'),'utf8'),before); assert.equal(validateLibrary(root).total,210);
});
test('registration write failure rolls back all files and cannot leave an orphan checklist entry', async () => {
  const { addProblem } = await import('../../scripts/add-problem.mjs'); const files = ['data/dsa-catalog.json','01-DSA-Questions.md','Arrays/README.md']; const before = files.map(file => fs.readFileSync(path.join(root,file),'utf8'));
  const io = {...fs,renameSync(from,to){if(to.endsWith('dsa-catalog.json')) throw new Error('Injected registration disk failure');fs.renameSync(from,to);}};
  assert.throws(() => addProblem({root,folder:'Arrays',title:'Rollback Practice',pattern:'prefix-sum',io}),/disk failure/);
  files.forEach((file,index)=>assert.equal(fs.readFileSync(path.join(root,file),'utf8'),before[index])); assert.equal(fs.existsSync(path.join(root,'Arrays/rollback-practice.js')),false); assert.equal(validateLibrary(root).total,210);
});

test('early transfer cannot become generalization proof retroactively after core learning', () => {
  attempt(transfer); qualify(); assert.notEqual(pattern('tree-bfs').state, 'Strong Recent Evidence');
  assert.equal(pattern('tree-bfs').transferCandidate, null);
});
test('later core maintenance does not invalidate transfer performed after qualified recall', () => {
  qualify(); attempt(transfer, 'independent', '2026-10-04');
  attempt(core, 'independent', '2026-10-07', { attemptType: 'review' });
  assert.equal(pattern('tree-bfs').state, 'Strong Recent Evidence');
});
test('studied transfer followed by independent recall is recovery, not fresh transfer proof', () => {
  qualify(); attempt(transfer, 'studied_solution', '2026-10-04');
  attempt(transfer, 'independent', '2026-10-05', { attemptType: 'review' });
  attempt(transfer, 'independent', '2026-10-08', { attemptType: 'review' });
  assert.notEqual(pattern('tree-bfs').state, 'Strong Recent Evidence');
});
test('broad patterns require multiple independent representatives with clear explanations', () => {
  attempt('HashMap/two-sum.js'); attempt('HashMap/two-sum.js', 'independent', '2026-10-04', { attemptType: 'review' });
  assert.equal(pattern('hashing').transferEligible, false);
  attempt('HashMap/group-anagrams.js', 'independent', '2026-10-04');
  assert.equal(pattern('hashing').transferEligible, true);
});
test('transfer correctness with partial speech retains a communication weakness', () => {
  qualify(); attempt(transfer, 'independent', '2026-10-04', { explanation: 'partial', communicationGap: 'Did not explain recognition clue' });
  assert.equal(pattern('tree-bfs').state, 'Needs Review'); assert.equal(pattern('tree-bfs').communicationWeakness, true);
});
test('separate speaking evidence can make a technically successful pattern need review', () => {
  qualify(); const values = validateAttempt({ track: 'speaking', itemId: core, attemptType: 'dsa_explanation', explanation: 'partial', communicationGap: 'Skipped invariant' }, itemRegistry(root));
  recordAttempt(root, values, { now }); assert.equal(pattern('tree-bfs').state, 'Needs Review'); assert.equal(pattern('tree-bfs').transferEligible, false);
});
test('duplicate checklist records are rejected instead of disappearing in a Map', () => {
  fs.appendFileSync(path.join(root, '01-DSA-Questions.md'), '\n- [ ] [Two Sum](./HashMap/two-sum.js)\n');
  assert.throws(() => validateLibrary(root), /unique/);
});

test('unvalidated independent claims are rejected before they can unlock a transfer gate', () => {
  const values = validateAttempt({ track: 'dsa', itemId: core, attemptType: 'review', outcome: 'independent', explanation: 'yes' }, itemRegistry(root));
  const before = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8');
  assert.throws(() => recordAttempt(root, values, { now, verification: 'unknown' }), /Invalid stored event/);
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), before);
  assert.equal(pattern('tree-bfs').transferEligible, false);
});

test('optional coding review cannot displace a due Core speaking review', () => {
  const coreSpeech = { key: 'speaking:core', itemId: core, role: 'CORE', priority: 'core', channel: 'speaking', latestOutcome: 'partial', nextDue: '2026-10-03' };
  const optionalCode = { key: 'coding:optional', role: 'OPTIONAL', priority: 'optional', channel: 'coding', latestOutcome: 'failed', nextDue: '2026-10-01' };
  assert.deepEqual(boundedReviews(dueReviews([optionalCode, coreSpeech], '2026-10-03')), [coreSpeech]);
});

test('old clear speech cannot qualify current code evidence without recent explanation', () => {
  attempt(); attempt(core, 'independent', '2026-11-10', { attemptType: 'review', explanation: 'unknown' });
  attempt(core, 'independent', '2026-11-13', { attemptType: 'review', explanation: 'unknown' });
  assert.equal(view().evidence[core].explanation, 'yes'); assert.equal(view().evidence[core].clear, false);
  assert.equal(pattern('tree-bfs').transferEligible, false);
});

test('new Phase 2 defaults start trees/heap while existing saved focus remains untouched', () => {
  initializePlanning(root, { phaseId: 'phase-2', learningWeek: 5 }, { now });
  assert.equal(loadProgress(root).planning.weeklyFocus.dsa, 'Trees + Heap');
  const raw = JSON.parse(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'));
  raw.planning.weeklyFocus.dsa = 'Binary Search + LinkedList'; fs.writeFileSync(path.join(root, '.progress/log.json'), JSON.stringify(raw));
  const before = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8');
  assert.equal(buildStudyState(root, now).planning.state.weeklyFocus.dsa, 'Binary Search + LinkedList');
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), before);
});

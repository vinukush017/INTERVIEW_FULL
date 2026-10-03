const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { workspace } = require('../fixtures/planning-workspace');
const { PHASES, initializePlanning, saveWeeklyReview, planningView, loadBudget } = require('../../scripts/lib/planning');
const { loadProgress, saveProgress, repoRoot } = require('../../scripts/lib/progress');
const { validateAttempt, recordAttempt } = require('../../scripts/lib/evidence');
const { itemRegistry } = require('../../scripts/lib/items');
const { deriveReviewStates } = require('../../scripts/lib/revision');
const { buildStudyState } = require('../../scripts/lib/study-state');
let root, now, legacy, original;
beforeEach(() => { root = workspace(); now = new Date('2026-10-03T12:00:00Z'); original = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'); legacy = JSON.parse(original); });
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));
const init = (body = {}) => initializePlanning(root, body, { now });
const view = () => buildStudyState(root, now).planning;
function decision(overrides = {}) {
  const p = loadProgress(root).planning;
  return { id: randomUUID(), expectedRevision: p.revision, availableHours: p.availableHours, busyWeek: false,
    nextFocus: { ...p.weeklyFocus }, carryForward: [], deprioritize: '', reflection: '', firstTask: 'Review the invariant, then explain it.', decision: 'continue', ...overrides };
}
const review = body => saveWeeklyReview(root, body || decision(), { now });
function event(outcome = 'independent', extra = {}) {
  const body = { track: 'dsa', itemId: 'HashMap/two-sum.js', attemptType: 'first_attempt', outcome, ...extra };
  return recordAttempt(root, validateAttempt(body, itemRegistry(root)), { now, verification: body.track === 'dsa' && ['independent', 'hinted'].includes(body.outcome) ? 'tests_passed' : 'unknown' });
}
const speaking = (explanation, extra = {}) => event(null, { track: 'speaking', itemId: 'js:question:what-is-a-closure', attemptType: 'js_core', explanation, ...extra });

test('legacy reads do not initialize a guessed learning week or write bytes', () => {
  const state = buildStudyState(root, new Date('2030-01-01T12:00Z'));
  assert.equal(state.planning.initialized, false); assert.equal(state.planning.state, null);
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), original);
});
test('default setup explicitly persists Phase 1 / Week 1, planning v1 within progress v2', () => {
  const p = init(); assert.equal(p.phaseId, 'phase-1'); assert.equal(p.learningWeek, 1); assert.equal(p.version, 1);
  assert.equal(p.availableHours, 12); assert.equal(p.weekStartedOn, '2026-10-03'); assert.equal(p.status, 'initialized');
  const stored = loadProgress(root); assert.equal(stored.version, 2); assert.deepEqual(stored.entries, legacy.entries); assert.equal(stored.startDate, legacy.startDate); assert.deepEqual(stored.events, []);
  assert.throws(() => init(), error => error.status === 409);
});
test('manual setup respects deliberate phase and week; baseline numbers only describe phase position', () => {
  const p = init({ phaseId: 'phase-2', learningWeek: 7, availableHours: 10 });
  assert.equal(p.learningWeek, 7); assert.equal(p.phaseId, 'phase-2'); assert.equal(view().phaseWeek, 3);
});
for (const [name, body] of [
  ['negative hours', { availableHours: -1 }], ['zero hours', { availableHours: 0 }], ['excess hours', { availableHours: 41 }],
  ['text hours', { availableHours: '12' }], ['unknown phase', { phaseId: 'phase-99' }], ['fractional week', { learningWeek: 1.5 }],
  ['zero week', { learningWeek: 0 }], ['unknown property', { events: [] }],
]) test(`setup rejects ${name} without changing history`, () => {
  assert.throws(() => init(body), error => error.status === 400); assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), original);
});
test('14 calendar days cause a review recommendation, never a learning-week advance', () => {
  init(); now = new Date('2026-10-17T12:00Z'); assert.equal(view().state.learningWeek, 1); assert.equal(view().reviewRecommended, true);
  assert.equal(view().reviewRecommendedOn, '2026-10-10'); assert.equal(loadProgress(root).planning.learningWeek, 1);
});
test('continue advances only learning week within phase, including after baseline duration', () => {
  init({ learningWeek: 4 }); review(); assert.equal(view().state.learningWeek, 5); assert.equal(view().state.phaseId, 'phase-1');
  assert.equal(view().state.revision, 1); assert.equal(view().state.status, 'continue');
});
test('consolidate keeps week/phase and starts a fresh evidence window with reduced new scope', () => {
  init(); event('hinted'); const saved = review(decision({ decision: 'consolidate' }));
  assert.equal(saved.summary.attempts.hinted, 1); assert.equal(view().summary.attempts.hinted, 0);
  assert.equal(view().state.learningWeek, 1); assert.equal(view().state.phaseId, 'phase-1'); assert.equal(view().budget.maxNewProblems, 0);
  // Same timestamp after review is new evidence, not swallowed by a date cutoff.
  event('failed'); assert.equal(view().summary.attempts.failed, 1);
});
test('advance warns then permits an explicit confirmation and records warning evidence', () => {
  init(); const body = decision({ decision: 'advance' });
  assert.throws(() => review(body), error => error.status === 409 && error.needsConfirmation && error.warnings.length >= 3);
  assert.equal(loadProgress(root).weeklyReviews.length, 0);
  const saved = review({ ...body, confirmAdvance: true }); assert.equal(saved.to.phaseId, 'phase-2'); assert.equal(saved.to.learningWeek, 2); assert.equal(view().phaseWeek, 1); assert.ok(saved.warnings.length);
});
test('recent independent delayed, notes-free evidence removes generic warnings but does not auto-advance', () => {
  init(); event('independent', { explanation: 'yes' }); now = new Date('2026-10-04T12:00Z'); event('independent', { attemptType: 'review', explanation: 'yes' });
  assert.deepEqual(view().warnings, []); assert.ok(view().suggestions.some(text => /considering advance/.test(text))); assert.equal(view().state.phaseId, 'phase-1');
  review(decision({ decision: 'advance' })); assert.equal(view().state.phaseId, 'phase-2');
});
test('practical phases warn when independent practical evidence is missing', () => {
  init({ phaseId: 'phase-2' }); assert.ok(view().warnings.some(text => /practical evidence/.test(text)));
  event('independent', { track: 'technical', itemId: 'topic:03-React.md', attemptType: 'practical_task' });
  assert.ok(!view().warnings.some(text => /practical evidence/.test(text)));
});
test('final phase continues/consolidates instead of advancing to a nonexistent phase', () => {
  init({ phaseId: 'phase-5' }); assert.throws(() => review(decision({ decision: 'advance', confirmAdvance: true })), /final phase/); review(); assert.equal(view().state.phaseId, 'phase-5');
});
test('generated review snapshot contains DSA, delayed reviews, speaking, practical, mock, gaps and recorded minutes', () => {
  init(); event('hinted', { explanation: 'partial', minutes: 30, communicationGap: 'Implementation before definition' });
  event('failed', { attemptType: 'mock' }); speaking('no', { communicationGap: 'Implementation before definition' });
  event('independent', { attemptType: 'review', explanation: 'yes', minutes: 20 });
  event('independent', { track: 'technical', itemId: 'topic:07-SQL.md', attemptType: 'practical_task', minutes: 40 });
  const saved = review(); const s = saved.summary;
  assert.deepEqual(s.attempts, { independent: 1, hinted: 1, studied_solution: 0, failed: 1 }); assert.equal(s.reviewsCompleted, 1);
  assert.equal(s.explanations.total, 3); assert.equal(s.explanations.partial, 1); assert.equal(s.minutes, 90); assert.equal(s.unknownTime, 2);
  assert.equal(s.practical, 1); assert.equal(s.mocks, 1); assert.equal(s.knewButCouldNotExplain, 1); assert.equal(s.recurringCommunicationGaps[0].count, 2);
  assert.deepEqual(loadProgress(root).weeklyReviews[0], saved);
});
test('review accepts at most one essential and one small secondary, replaces old carry instead of accumulating', () => {
  init(); const carryForward = [{ role: 'essential', text: 'Fix one boundary', itemId: 'Two-Pointers/valid-palindrome.js' }, { role: 'secondary', text: 'Practise one phrase' }];
  review(decision({ carryForward })); assert.deepEqual(view().state.carryForward, carryForward);
  review(decision({ carryForward: [] })); assert.deepEqual(view().state.carryForward, []);
});
for (const [name, override] of [
  ['three carry items', { carryForward: [{ role: 'essential', text: 'a' }, { role: 'secondary', text: 'b' }, { role: 'secondary', text: 'c' }] }],
  ['two essential items', { carryForward: [{ role: 'essential', text: 'a' }, { role: 'essential', text: 'b' }] }],
  ['unregistered carry', { carryForward: [{ role: 'essential', text: 'a', itemId: 'scripts/today.js' }] }],
  ['oversized reflection', { reflection: 'x'.repeat(241) }], ['missing primary focus', { nextFocus: { technical: '', speaking: 'Explain' } }],
  ['missing first step', { firstTask: '' }], ['bad decision', { decision: 'autoadvance' }], ['client summary injection', { summary: {} }],
]) test(`review rejects ${name} atomically`, () => {
  init(); const before = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'); assert.throws(() => review(decision(override)), error => error.status === 400);
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), before);
});
test('idempotent review acknowledgement and stale-tab conflict cannot double-advance', () => {
  init(); const a = decision(); const stale = decision(); const saved = review(a); assert.deepEqual(review(a), saved);
  assert.deepEqual(review(Object.fromEntries(Object.entries(a).reverse())), saved);
  assert.equal(loadProgress(root).weeklyReviews.length, 1); assert.equal(view().state.learningWeek, 2);
  assert.throws(() => review(stale), error => error.status === 409); assert.throws(() => review({ ...a, decision: 'consolidate' }), /different decisions/);
});
test('low-capacity/missed weeks never increase new problem load or carry old work automatically', () => {
  init({ availableHours: 6 }); const budget = view().budget; assert.equal(budget.maxNewProblems, 0);
  assert.notEqual(buildStudyState(root, now).today.main.kind, 'dsa');
  now = new Date('2026-11-03T12:00Z'); assert.deepEqual(view().budget, budget); assert.deepEqual(view().state.carryForward, []);
  review(decision({ decision: 'consolidate', availableHours: 8, busyWeek: true })); assert.equal(view().budget.maxNewProblems, 0);
  assert.equal(view().state.learningWeek, 1);
});
test('Today prioritizes registered essential carry-forward and explains why', () => {
  init(); review(decision({ carryForward: [{ role: 'essential', text: 'One existing problem', itemId: 'Two-Pointers/valid-palindrome.js' }] }));
  const today = buildStudyState(root, now).today; assert.equal(today.main.itemId, 'Two-Pointers/valid-palindrome.js'); assert.match(today.main.reason, /essential carry-forward/); assert.equal(today.planning.state.learningWeek, 2);
});
test('Today supports a manual carry-forward without inventing a registered problem or evidence', () => {
  init(); review(decision({ carryForward: [{ role: 'essential', text: 'Clarify my project contribution' }] }));
  assert.equal(buildStudyState(root, now).today.main.kind, 'manual'); assert.equal(loadProgress(root).events.length, 0);
});
test('Today respects chosen DSA focus and preserves existing relative queue order', () => {
  init(); review(decision({ nextFocus: { technical: 'React rendering', dsa: 'Sliding Window', speaking: 'State the invariant' } }));
  const main = buildStudyState(root, now).today.main; assert.equal(main.topic, 'Sliding Window'); assert.match(main.reason, /current DSA focus/);
});
test('Today respects technical focus when DSA focus is blank and shows a topic action', () => {
  init(); review(decision({ nextFocus: { technical: 'React rendering + effects', dsa: '', speaking: 'Explain the render trigger' } }));
  assert.equal(buildStudyState(root, now).today.main.itemId, 'topic:03-React.md');
});
test('Today reduces new scope after its ceiling and still prioritizes due review', () => {
  init({ availableHours: 6 }); event('failed'); now = new Date('2026-10-04T12:00Z');
  const state = buildStudyState(root, now); assert.equal(state.today.main.itemId, 'HashMap/two-sum.js'); assert.match(state.today.main.reason, /revision is due/); assert.equal(state.review.due.length, 1);
});
test('factual hint/failure-heavy, partial-speaking, overdue and repeated-gap suggestions have traceable counts', () => {
  init(); for (let i = 0; i < 6; i++) event(i < 4 ? 'hinted' : 'independent');
  for (let i = 0; i < 5; i++) speaking(i < 3 ? 'partial' : 'yes', { communicationGap: 'Long opening' });
  for (const itemId of ['Arrays/move-zeroes.js', 'Two-Pointers/valid-palindrome.js', 'Sliding-Window/best-time-to-buy-and-sell-stock.js']) event('failed', { itemId });
  now = new Date('2026-10-11T12:00Z'); const s = view().suggestions.join('\n');
  assert.match(s, /4 of your last 6 DSA/); assert.match(s, /3 of your last 5 explanations/); assert.match(s, /overdue revision channels/); assert.match(s, /repeated 5 times/); assert.match(s, /Recorded 0 of 12 planned hours/);
});
test('recorded-time recommendation treats unknown time as unknown, not a proven missed session', () => {
  init(); event('failed', { minutes: 300 }); speaking('partial'); now = new Date('2026-10-11T12:00Z');
  assert.ok(view().suggestions.some(text => /Recorded 5 of 12 planned hours \(1 events have unknown time\)/.test(text)));
});
test('planning and reviews preserve all eight legacy records, PR4 events, old dates and start date', () => {
  const first = event('independent', { minutes: 25, explanation: 'partial' }); const second = speaking('no');
  init(); review(); event('failed'); const after = loadProgress(root);
  assert.deepEqual(after.entries, legacy.entries); assert.equal(after.startDate, legacy.startDate); assert.deepEqual(after.events.slice(0, 2), [first, second]); assert.equal(after.events.length, 3);
});
test('atomic setup/review failures preserve previous bytes, evidence, phase/week and release locks', () => {
  const io = { ...fs, renameSync() { throw new Error('Injected planning write failure'); } };
  assert.throws(() => initializePlanning(root, {}, { now, io }), /write failure/); assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), original);
  init(); event('failed'); const before = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8');
  assert.throws(() => saveWeeklyReview(root, decision(), { now, io }), /write failure/); assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), before);
  assert.deepEqual(fs.readdirSync(path.join(root, '.progress')), ['log.json']);
});
test('malformed planning is refused without clearing or overwriting existing data', () => {
  init(); const p = loadProgress(root); p.planning.learningWeek = '20'; fs.writeFileSync(path.join(root, '.progress/log.json'), JSON.stringify(p));
  const before = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'); assert.throws(() => loadProgress(root), /Invalid planning/); assert.throws(() => review({}), /Invalid planning|Review ID/);
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), before);
});
test('generic progress saves cannot discard weekly review history', () => {
  init(); review(); const current = loadProgress(root); assert.throws(() => saveProgress({ ...current, weeklyReviews: [], planning: { ...current.planning, lastReviewId: null } }, root), /Refusing to overwrite/);
  assert.deepEqual(loadProgress(root).weeklyReviews, current.weeklyReviews);
});
test('phase metadata and canonical policy agree on five phases and 4/6/4/4/2 baseline', () => {
  assert.deepEqual(PHASES.map(phase => phase.weeks), [4, 6, 4, 4, 2]); assert.equal(PHASES.reduce((n, phase) => n + phase.weeks, 0), 20);
  const roadmap = fs.readFileSync(path.join(repoRoot, '00-Roadmap.md'), 'utf8');
  for (const phase of PHASES) { assert.ok(roadmap.includes(phase.name)); assert.ok(phase.exit.length >= 3); assert.equal(loadBudget({ availableHours: 12, status: 'continue', busyWeek: false }).maxNewProblems, 4); }
});
test('new-problem ceiling counts unique items and never grows after calendar delay', () => {
  init(); for (let i = 0; i < 4; i++) event('independent');
  assert.equal(buildStudyState(root, now).today.main.kind, 'dsa');
  for (const itemId of ['Arrays/move-zeroes.js', 'HashMap/contains-duplicate.js', 'HashMap/valid-anagram.js']) event('independent', { itemId });
  assert.equal(buildStudyState(root, now).today.main.kind, 'topic');
  now = new Date('2026-10-17T12:00Z'); assert.match(buildStudyState(root, now).today.main.reason, /revision is due/);
  assert.equal(view().state.learningWeek, 1); review(); assert.equal(view().state.learningWeek, 2);
});
test('review snapshot lists actual successful outputs, not fabricated completed artifacts', () => {
  init(); event('independent'); speaking('yes'); event('failed');
  const outputs = review().summary.outputs; assert.equal(outputs.length, 2); assert.equal(outputs[0].itemId, 'HashMap/two-sum.js');
  assert.equal(outputs[1].explanation, 'yes'); assert.ok(!outputs.some(item => item.outcome === 'failed'));
});

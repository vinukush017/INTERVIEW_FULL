const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { randomUUID } = require('node:crypto');
const { loadProgress, normalizeProgress, todayISO, computeStreak, repoRoot, saveProgress } = require('../../scripts/lib/progress');
const { validateAttempt, recordAttempt, legacyEvidence, completeProblem } = require('../../scripts/lib/evidence');
const { atomicWrite } = require('../../scripts/lib/atomic');
const { deriveReviewStates, dueReviews, boundedReviews } = require('../../scripts/lib/revision');
const { itemRegistry } = require('../../scripts/lib/items');
const { buildStudyState } = require('../../scripts/lib/study-state');
let root, legacy, registry;
const dsa = 'HashMap/two-sum.js'; const js = 'js:question:what-is-a-closure';
beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), 'interview-evidence-'));
  legacy = JSON.parse(fs.readFileSync(path.join(__dirname, '../fixtures/legacy-progress.json'), 'utf8'));
  for (const file of ['data/dsa-catalog.json', '.progress/log.json', '01-DSA-Questions.md', 'dashboard/js-core-data.js']) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.copyFileSync(path.join(repoRoot, file), path.join(root, file));
  }
  fs.writeFileSync(path.join(root, '.progress/log.json'), JSON.stringify(legacy, null, 2) + '\n');
  registry = itemRegistry(root);
});
afterEach(() => fs.rmSync(root, { recursive: true, force: true }));
function save(body, date = '2026-10-03', options = {}) {
  const values = validateAttempt(body, registry);
  return recordAttempt(root, values, { now: new Date(date + 'T12:00:00Z'), verification: body.track === 'dsa' && ['independent','hinted'].includes(body.outcome) ? 'tests_passed' : 'unknown', ...options });
}
const attempt = (outcome, extra = {}) => ({ track: 'dsa', itemId: dsa, attemptType: 'first_attempt', outcome, ...extra });
const speak = (explanation, extra = {}) => ({ track: 'speaking', itemId: js, attemptType: 'js_core', explanation, ...extra });

test('actual history and the eight-record legacy fixture load without writes or inferred success', () => {
  const actual = fs.readFileSync(path.join(repoRoot, '.progress/log.json'), 'utf8');
  assert.deepEqual(loadProgress(repoRoot).entries, JSON.parse(actual).entries);
  assert.equal(fs.readFileSync(path.join(repoRoot, '.progress/log.json'), 'utf8'), actual);
  const original = fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8');
  const loaded = loadProgress(root); assert.equal(loaded.version, 2); assert.deepEqual(loaded.entries, legacy.entries); assert.deepEqual(loaded.events, legacy.events || []);
  for (const event of legacyEvidence(loaded)) { assert.equal(event.outcome, 'unknown'); assert.equal(event.explanation, 'unknown'); assert.equal(event.minutes, null); assert.equal(event.confidence, null); }
  assert.equal(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'), original);
});
test('first event migrates schema while retaining every completion record and date', () => {
  save(attempt('independent', { explanation: 'partial', minutes: 28, confidence: 3 }));
  const stored = JSON.parse(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8'));
  assert.equal(stored.version, 2); assert.equal(stored.studyTimezone, 'Asia/Kolkata'); assert.deepEqual(stored.entries, legacy.entries); assert.equal(stored.startDate, legacy.startDate);
  assert.equal(stored.events.at(-1).outcome, 'independent'); assert.equal(stored.events.at(-1).explanation, 'partial');
});
for (const outcome of ['independent', 'hinted', 'studied_solution', 'failed']) test(`persists distinct ${outcome} attempt without altering checklist`, () => {
  const before = fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8');
  const event = save(attempt(outcome, { mistakeOrInsight: 'One actual lesson' }));
  assert.equal(loadProgress(root).events.at(-1).outcome, outcome); assert.equal(event.explanation, 'unknown'); assert.equal(event.confidence, null);
  assert.equal(fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8'), before);
});
test('English technical and stable JS Core evidence persist with independent gaps', () => {
  save(speak('partial', { technicalGap: 'Forgot retained bindings', communicationGap: 'Unclear opening', confidence: 2 }));
  const customId = 'custom:' + randomUUID();
  save({ track: 'speaking', itemId: customId, question: 'Explain a real debugging process', attemptType: 'technical_explanation', explanation: 'yes' });
  const events = loadProgress(root).events;
  assert.equal(events.at(-2).itemId, js); assert.equal(events.at(-2).outcome, null); assert.equal(events.at(-1).itemId, customId);
});
test('technical retrieval/practical events support existing topics without inventing completion', () => {
  const topics = [{ itemId: 'topic:07-SQL.md', kind: 'topic', title: 'SQL', question: 'Explain indexes', topic: 'SQL' }];
  const values = validateAttempt({ track: 'technical', itemId: topics[0].itemId, attemptType: 'practical_task', outcome: 'hinted', minutes: 40 }, new Map(topics.map(item => [item.itemId, item])));
  const event = recordAttempt(root, values); assert.equal(event.verification, 'unknown'); assert.equal(loadProgress(root).entries.length, legacy.entries.length);
});
for (const [name, body] of [
  ['outcome', attempt('mastered')], ['confidence', attempt('failed', { confidence: 6 })], ['fractional confidence', attempt('failed', { confidence: 2.5 })],
  ['negative time', attempt('failed', { minutes: -1 })], ['excess time', attempt('failed', { minutes: 721 })], ['NaN time', attempt('failed', { minutes: NaN })],
  ['oversized note', attempt('failed', { communicationGap: 'x'.repeat(241) })], ['unknown path', { ...attempt('failed'), itemId: 'scripts/today.js' }],
  ['unknown JS ID', { ...speak('yes'), itemId: 'js:nonexistent' }], ['explanation', speak('good')], ['client date injection', { ...speak('yes'), date: '1999-01-01' }],
  ['prototype track', { ...speak('yes'), track: '__proto__' }], ['numeric string time', attempt('failed', { minutes: '20' })],
]) test(`validation rejects ${name}`, () => assert.throws(() => validateAttempt(body, registry), error => error.status === 400));
test('IDs are unique and title changes do not change a registered identity', () => {
  assert.equal([...registry.values()].filter(item => item.kind === 'js_core').length, 44);
  const before = validateAttempt(speak('yes'), registry); registry.set(js, { ...registry.get(js), title: 'New wording', question: 'A clearer closure question' });
  const after = validateAttempt(speak('yes'), registry); assert.equal(before.itemId, after.itemId);
});
test('idempotent retry saves one event; conflicting reuse is rejected', () => {
  const body = attempt('failed', { id: randomUUID() }); const a = save(body); const b = save(body);
  assert.equal(a.id, b.id); assert.equal(loadProgress(root).events.filter(event => event.id === a.id).length, 1);
  assert.throws(() => save({ ...body, outcome: 'hinted' }), /different evidence/);
});
test('separate same-day attempts are retained; missing fields stay unknown', () => {
  const a = save(attempt('studied_solution')); const b = save(attempt('independent'));
  assert.notEqual(a.id, b.id); assert.deepEqual(loadProgress(root).events.slice(-2).map(event => event.outcome), ['studied_solution', 'independent']);
  assert.equal(b.minutes, null); assert.equal(b.explanation, 'unknown');
});
test('12:30 AM India uses the new local study date; historical dates stay unchanged', () => {
  const instant = new Date('2026-10-02T19:00:00Z'); assert.equal(todayISO(instant, 'Asia/Kolkata'), '2026-10-03'); assert.equal(todayISO(instant, 'UTC'), '2026-10-02');
  const event = save(attempt('failed'), '2026-10-03', { now: instant }); assert.equal(event.date, '2026-10-03'); assert.deepEqual(loadProgress(root).entries, legacy.entries);
});
test('timezone configuration is centralized and invalid timezone does not silently fall back', () => {
  const previous = process.env.STUDY_TIMEZONE;
  try { process.env.STUDY_TIMEZONE = 'UTC'; assert.equal(normalizeProgress(legacy).studyTimezone, 'UTC'); process.env.STUDY_TIMEZONE = 'Not/AZone'; assert.throws(() => normalizeProgress(legacy), /Invalid study timezone/); }
  finally { if (previous === undefined) delete process.env.STUDY_TIMEZONE; else process.env.STUDY_TIMEZONE = previous; }
});
function reviewStates() { return deriveReviewStates(loadProgress(root).events, registry); }
test('failed/studied attempts schedule next day; hinted is sooner than delayed independent', () => {
  save(attempt('failed')); assert.equal(reviewStates().find(item => item.channel === 'coding').nextDue, '2026-10-04');
  save(attempt('studied_solution'), '2026-10-04'); assert.equal(reviewStates().find(item => item.channel === 'coding').nextDue, '2026-10-05');
  save(attempt('hinted'), '2026-10-05'); assert.equal(reviewStates().find(item => item.channel === 'coding').nextDue, '2026-10-07');
});
test('independent delayed retrieval advances 1/3/7/14/30; same-day/early success does not', () => {
  save(attempt('independent')); save(attempt('independent')); assert.equal(reviewStates()[0].stage, 0); assert.equal(reviewStates()[0].nextDue, '2026-10-04');
  save(attempt('independent', { attemptType: 'review' }), '2026-10-04'); assert.equal(reviewStates()[0].nextDue, '2026-10-07');
  save(attempt('independent', { attemptType: 'review' }), '2026-10-05'); assert.equal(reviewStates()[0].nextDue, '2026-10-07');
  save(attempt('independent', { attemptType: 'review' }), '2026-10-07'); assert.equal(reviewStates()[0].nextDue, '2026-10-14');
  save(attempt('independent', { attemptType: 'review' }), '2026-10-14'); assert.equal(reviewStates()[0].nextDue, '2026-10-28');
  save(attempt('independent', { attemptType: 'review' }), '2026-10-28'); assert.equal(reviewStates()[0].nextDue, '2026-11-27');
  save(attempt('independent', { attemptType: 'review' }), '2026-11-27'); assert.equal(reviewStates()[0].maintenance, true); assert.equal(reviewStates()[0].nextDue, null);
});
test('speaking partial schedules soon; yes advances only after delay', () => {
  save(speak('partial')); save(speak('yes')); assert.equal(reviewStates()[0].nextDue, '2026-10-04'); assert.equal(reviewStates()[0].weak, true);
  save(speak('yes'), '2026-10-04'); assert.equal(reviewStates()[0].nextDue, '2026-10-07');
  save(speak('yes'), '2026-10-07'); assert.equal(reviewStates()[0].weak, false); assert.equal(reviewStates()[0].nextDue, '2026-10-14');
});
test('failed coding plus clear explanation stay separate', () => {
  save(attempt('failed', { explanation: 'yes' })); const states = reviewStates();
  assert.equal(states.find(item => item.channel === 'coding').weak, true); assert.equal(states.find(item => item.channel === 'speaking').latestOutcome, 'yes');
});
test('overdue/core failed items precede non-due items; selection remains bounded', () => {
  const due = dueReviews([
    { key: 'a', channel: 'coding', priority: 'core', latestOutcome: 'failed', nextDue: '2026-10-01' },
    { key: 'b', channel: 'speaking', nextDue: '2026-10-02' }, { key: 'c', channel: 'coding', nextDue: '2026-10-10' },
  ], '2026-10-03'); assert.deepEqual(due.map(item => item.key), ['a', 'b']); assert.equal(boundedReviews(due).length, 1);
  assert.equal(boundedReviews(Array.from({ length: 20 }, (_, i) => ({ channel: 'speaking', key: String(i) }))).length, 3);
});
test('weaknesses require separated successes; repeated hints and gaps remain visible', () => {
  save(attempt('hinted', { technicalGap: 'Forgot the invariant' })); save(attempt('independent')); assert.equal(reviewStates()[0].weak, true);
  save(attempt('independent'), '2026-10-04'); assert.equal(reviewStates()[0].weak, true);
  save(attempt('independent'), '2026-10-07'); assert.equal(reviewStates()[0].weak, false);
  save(attempt('failed'), '2026-10-08'); assert.equal(reviewStates()[0].weak, true); assert.equal(reviewStates()[0].stage, 0);
});
test('future activity does not manufacture a current streak', () => {
  assert.equal(computeStreak(['2026-10-04'], '2026-10-03').current, 0);
  assert.equal(computeStreak(['2026-10-02', '2026-10-03'], '2026-10-03').current, 2);
});
test('atomic rename failure preserves all existing bytes and removes temporary files/lock', () => {
  const file = path.join(root, '.progress/log.json'); const original = fs.readFileSync(file, 'utf8');
  const failing = { ...fs, renameSync() { throw new Error('Injected rename failure'); } };
  assert.throws(() => save(attempt('failed'), '2026-10-03', { io: failing }), /Injected rename failure/);
  assert.equal(fs.readFileSync(file, 'utf8'), original); assert.deepEqual(fs.readdirSync(path.dirname(file)), ['log.json']);
});
test('temporary file is fully written before the atomic rename', () => {
  const file = path.join(root, '.progress/log.json'); const original = fs.readFileSync(file, 'utf8'); let checked = false;
  const observing = { ...fs, renameSync(from, to) { assert.equal(fs.readFileSync(to, 'utf8'), original); assert.doesNotThrow(() => JSON.parse(fs.readFileSync(from, 'utf8'))); checked = true; fs.renameSync(from, to); } };
  save(attempt('failed'), '2026-10-03', { io: observing }); assert.equal(checked, true);
});
test('malformed JSON, missing v2 events and malformed stored events are refused without writes', () => {
  const file = path.join(root, '.progress/log.json');
  for (const content of ['{oops', JSON.stringify({ ...legacy, version: 2 }), JSON.stringify({ ...legacy, version: 2, events: [{ id: 'fake' }] })]) {
    fs.writeFileSync(file, content); assert.throws(() => loadProgress(root)); assert.throws(() => save(attempt('failed'))); assert.equal(fs.readFileSync(file, 'utf8'), content);
  }
});
test('a competing writer is refused rather than losing history', () => {
  fs.writeFileSync(path.join(root, '.progress/.write.lock'), 'other writer'); assert.throws(() => save(attempt('failed')), error => error.status === 409);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, '.progress/log.json'), 'utf8')), legacy);
});
test('saveProgress refuses dropping or rewriting previous history', () => {
  save(attempt('failed')); const current = loadProgress(root);
  assert.throws(() => saveProgress({ ...current, events: [] }, root), /Refusing to overwrite/);
  assert.deepEqual(loadProgress(root).events, current.events);
});
test('failed/studied event cannot be attached to completion; validated independent can', () => {
  const failed = save({ ...attempt('failed'), itemId: 'Arrays/move-zeroes.js' });
  assert.throws(() => completeProblem(root, failed.itemId, { eventId: failed.id }), /successful validated attempt/);
  const independent = save({ ...attempt('independent'), itemId: failed.itemId });
  completeProblem(root, failed.itemId, { eventId: independent.id, now: new Date('2026-10-03T12:00Z') });
  assert.ok(fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8').includes('- [x] [Move Zeroes]'));
  assert.deepEqual(loadProgress(root).entries.slice(0, legacy.entries.length), legacy.entries);
});
test('completion write failure rolls back the checklist and leaves original progress intact', () => {
  const file = path.join(root, '.progress/log.json'); const questions = path.join(root, '01-DSA-Questions.md');
  const original = fs.readFileSync(file, 'utf8'); const text = fs.readFileSync(questions, 'utf8');
  const failing = { ...fs, renameSync(from, to) { if (to === file) throw new Error('Progress rename failed'); fs.renameSync(from, to); } };
  assert.throws(() => completeProblem(root, 'Arrays/move-zeroes.js', { io: failing }), /Progress rename failed/);
  assert.equal(fs.readFileSync(file, 'utf8'), original); assert.equal(fs.readFileSync(questions, 'utf8'), text);
});

test('a claimed successful DSA event cannot be saved without correctness verification', () => {
  const values = validateAttempt(attempt('independent'), registry);
  assert.throws(() => recordAttempt(root, values), /Invalid stored event/);
  assert.equal(loadProgress(root).events.length, 0);
});
test('communication gap schedules speaking retrieval without fabricating an explanation result', () => {
  save(attempt('independent', { communicationGap: 'Unclear opening', explanation: 'unknown' }));
  const speaking = reviewStates().find(item => item.channel === 'speaking');
  assert.equal(speaking.latestOutcome, 'unknown'); assert.equal(speaking.weak, true); assert.equal(speaking.nextDue, '2026-10-04');
  assert.equal(buildStudyState(root, new Date('2026-10-04T12:00:00Z')).summary.explanations.total, 0);
});

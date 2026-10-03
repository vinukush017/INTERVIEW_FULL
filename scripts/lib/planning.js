// Explicit learning progress. Dates prompt a review; only decisions advance weeks.
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { loadProgress, todayISO, validDate } = require('./progress');
const { atomicWrite, withProgressLock } = require('./atomic');
const { aggregate } = require('./study-summary');
const { itemRegistry } = require('./items');
const { deriveReviewStates, dueReviews, addDays } = require('./revision');
const { selectNext } = require('./study');

// Executable metadata mirrors the policy in 00-Roadmap.md; no new curriculum.
const PHASES = [
  { id: 'phase-1', name: 'Baseline & Foundations', weeks: 4, startWeek: 1,
    purpose: 'Establish a baseline and a sustainable solve/explain/review habit.',
    outputs: 'Core JavaScript retrieval, linear-pattern solutions and an honest introduction.',
    dsa: 'Arrays + HashMap + Two Pointers + Sliding Window',
    communication: 'Start with a definition, then an example; introduce yourself naturally.',
    practical: 'Small JavaScript exercises and one real-work explanation.',
    mocks: 'Short spoken answers; one weekly 30–45 minute communication session.',
    exit: ['Core JS explanations without notes', 'Independent linear-pattern attempts and delayed recall', 'Self-introduction practised with true experience'],
    defaults: { technical: 'JavaScript foundations', dsa: 'Arrays + HashMap', speaking: 'Start with a definition before implementation details', practical: 'One small JavaScript exercise', mock: 'Short communication practice' }, requiresPractical: false },
  { id: 'phase-2', name: 'Core Patterns & Full-Stack Practice', weeks: 6, startWeek: 5,
    purpose: 'Apply core patterns and demonstrate existing full-stack skills.',
    outputs: 'React/API/SQL practical slices and delayed independent retrieval.',
    dsa: 'Binary Search, LinkedList, Trees, Heap, Backtracking, Graph, basic Dynamic Programming, Intervals',
    communication: 'Explain invariants, component/API decisions and tradeoffs while working.',
    practical: 'One focused UI, API or SQL task at a time.',
    mocks: 'Weekly communication session plus a timed coding or technical round every 1–2 weeks.',
    exit: ['Independent and delayed recall across core patterns', 'Working React/API/SQL examples', 'Notes-free explanations integrated with practical work'],
    defaults: { technical: 'React rendering + effects', dsa: 'Binary Search + LinkedList', speaking: 'Explain tradeoffs before implementation details', practical: 'One focused UI or API slice', mock: 'Timed DSA or technical discussion' }, requiresPractical: true },
  { id: 'phase-3', name: 'Applied Backend & System Design', weeks: 4, startWeek: 11,
    purpose: 'Connect backend fundamentals to real designs and engineering experience.',
    outputs: 'API/database/cache/queue decisions, structured designs and project explanations.',
    dsa: 'Mixed recall of weak core patterns; avoid broad new problem collecting.',
    communication: 'Clarify requirements, explain request flow and justify alternatives.',
    practical: 'A backend/database slice and a design using existing guides.',
    mocks: 'Weekly communication session and a 45-minute design/backend round every 1–2 weeks.',
    exit: ['Backend/database practical evidence', 'Structured design discussion with failure/scaling tradeoffs', 'Project decisions explained at several depths'],
    defaults: { technical: 'Node.js API reliability', dsa: 'Mixed weak patterns', speaking: 'Explain request flow and one tradeoff', practical: 'One API/database or design slice', mock: '45-minute backend/design discussion' }, requiresPractical: true },
  { id: 'phase-4', name: 'Interview Simulation', weeks: 4, startWeek: 15,
    purpose: 'Expose and repair blockers under realistic interview conditions.',
    outputs: 'Repeated timed coding, machine coding, design and behavioral practice.',
    dsa: 'Timed mixed rounds and targeted repairs.',
    communication: 'Think aloud, clarify your contribution and handle follow-up questions.',
    practical: 'Timed practical tasks and repair of recurring failures.',
    mocks: 'Weekly communication session; 1–2 technical rounds weekly, occasional full loop within capacity.',
    exit: ['Repeated timed rounds with no recurring major blockers', 'Practical and behavioral explanations with follow-ups', 'Recent delayed independent and notes-free evidence'],
    defaults: { technical: 'Mixed interview simulation', dsa: 'Mixed weak patterns', speaking: 'Think aloud and handle follow-up questions', practical: 'One timed machine-coding task', mock: 'Timed round and targeted repair' }, requiresPractical: true },
  { id: 'phase-5', name: 'Revision & Applications', weeks: 2, startWeek: 19,
    purpose: 'Maintain strengths and apply when technical and communication evidence supports it.',
    outputs: 'Targeted revision, verified resume claims and role-specific interview preparation.',
    dsa: 'Targeted weak-pattern recall rather than a fresh checklist.',
    communication: 'Natural introduction, project deep dives and concise tradeoff answers.',
    practical: 'Repair actual interview gaps and verify project/resume claims.',
    mocks: 'A focused mock as useful around real interviews; retain weekly communication review.',
    exit: ['Sustained recent technical and communication evidence', 'Resume/project claims explainable honestly', 'Continue revision during applications; no finish-all-files gate'],
    defaults: { technical: 'Targeted revision + resume/project explanations', dsa: 'Mixed weak patterns', speaking: 'Explain your contribution and decisions clearly', practical: 'Repair one demonstrated interview gap', mock: 'Role-relevant focused mock' }, requiresPractical: false },
];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const FOCUS_KEYS = ['technical', 'dsa', 'speaking', 'practical', 'mock'];
function reject(message, status = 400, extra = {}) { throw Object.assign(new Error(message), { status, ...extra }); }
function object(value, fields) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !fields.includes(key))) reject('Invalid planning fields');
}
function text(value, label, required = false) {
  if (value == null) value = '';
  if (typeof value !== 'string' || value.length > 240 || /[\u0000-\u001f]/.test(value)) reject(`${label}: use one short line (max 240 characters)`);
  value = value.trim(); if (required && !value) reject(`${label} is required`); return value;
}
function hours(value) { if (typeof value !== 'number' || !Number.isFinite(value) || value < 1 || value > 40) reject('Available hours must be a number from 1 to 40'); return value; }
function focus(value) {
  object(value, FOCUS_KEYS);
  return Object.fromEntries(FOCUS_KEYS.map(key => [key, text(value[key], `${key} focus`, ['technical', 'speaking'].includes(key))]));
}
function carry(value, registry) {
  if (!Array.isArray(value) || value.length > 2) reject('Carry at most one essential and one small secondary item');
  const roles = new Set();
  return value.map(item => {
    object(item, ['role', 'text', 'itemId']);
    if (!['essential', 'secondary'].includes(item.role) || roles.has(item.role)) reject('Carry at most one item per role'); roles.add(item.role);
    if (item.itemId != null && (typeof item.itemId !== 'string' || !registry?.has(item.itemId))) reject('Carry-forward item must be registered');
    return { role: item.role, text: text(item.text, 'Carry-forward', true), ...(item.itemId ? { itemId: item.itemId } : {}) };
  });
}
function validatePlanningData(progress) {
  const p = progress.planning; const reviews = progress.weeklyReviews ?? [];
  if (!Array.isArray(reviews)) throw new Error('Invalid weekly review history; original file has not been changed');
  try {
    if (p != null) {
      object(p, ['version', 'phaseId', 'learningWeek', 'phaseStartedWeek', 'weekStartedOn', 'availableHours', 'weeklyFocus', 'carryForward', 'status', 'lastReviewId', 'busyWeek', 'firstTask', 'revision']);
      if (p.version !== 1 || !PHASES.some(phase => phase.id === p.phaseId) || !Number.isInteger(p.learningWeek) || p.learningWeek < 1 || p.learningWeek > 104 || !Number.isInteger(p.phaseStartedWeek) || p.phaseStartedWeek < 1 || p.phaseStartedWeek > p.learningWeek || !validDate(p.weekStartedOn) || !['initialized', 'continue', 'consolidate', 'advance'].includes(p.status) || typeof p.busyWeek !== 'boolean' || !Number.isInteger(p.revision) || p.revision < 0) reject('Invalid stored planning state');
      hours(p.availableHours); focus(p.weeklyFocus); text(p.firstTask, 'First task');
      // IDs were registry-checked on entry; don't invalidate history after library edits.
      if (!Array.isArray(p.carryForward) || p.carryForward.some(item => item.itemId != null && (typeof item.itemId !== 'string' || item.itemId.length > 180))) reject('Invalid stored carry-forward identity');
      carry(p.carryForward.map(item => ({ ...item, itemId: undefined })), new Map());
    }
    const ids = new Set();
    for (const review of reviews) {
      if (!review || !UUID.test(review.id || '') || ids.has(review.id) || !validDate(review.date) || !Number.isFinite(Date.parse(review.timestamp)) || !review.from || !review.to || !review.summary || !review.submission || !Number.isInteger(review.eventCount) || review.eventCount < 0 || review.eventCount > (progress.events || []).length || !['continue', 'consolidate', 'advance'].includes(review.decision)) reject('Invalid stored weekly review');
      ids.add(review.id);
    }
    if (p && ((p.lastReviewId === null && reviews.length) || (p.lastReviewId !== null && reviews.at(-1)?.id !== p.lastReviewId))) reject('Planning/review history reference mismatch');
    if (!p && reviews.length) reject('Weekly review history requires planning state');
  } catch (error) { throw new Error(`Invalid planning history; original file has not been changed: ${error.message}`); }
}
function weekEvents(progress, now) {
  const date = todayISO(now, progress.studyTimezone); const p = progress.planning;
  if (!p) return [];
  const cutoff = progress.weeklyReviews?.find(review => review.id === p.lastReviewId)?.eventCount || 0;
  // Append-only index avoids double-counting, including saves in the same millisecond.
  return progress.events.slice(cutoff).filter(event => event.date >= p.weekStartedOn && event.date <= date && Date.parse(event.timestamp) <= now.valueOf());
}
function loadBudget(p) {
  const reduced = p.busyWeek || p.status === 'consolidate' || p.availableHours <= 8;
  return { reduced, maxNewProblems: reduced ? (p.availableHours <= 6 || p.status === 'consolidate' ? 0 : 2) : p.availableHours < 12 ? 3 : 4,
    message: reduced ? 'Reduced scope: review and speaking first; no catch-up work. New problems are optional.' : 'One primary focus, alongside review and speaking. The new-problem ceiling is not a quota.' };
}
function planningView(progress, states, now) {
  const p = progress.planning || null; const date = todayISO(now, progress.studyTimezone);
  if (!p) return { initialized: false, state: null, phases: PHASES, summary: null, suggestions: [], warnings: [] };
  const events = weekEvents(progress, now); const summary = aggregate(events);
  summary.practical = events.filter(event => event.track === 'technical' && event.attemptType === 'practical_task').length;
  summary.successfulPractical = events.filter(event => event.track === 'technical' && event.attemptType === 'practical_task' && event.outcome === 'independent').length;
  summary.mocks = events.filter(event => event.attemptType === 'mock').length;
  summary.outputs = events.filter(event => event.outcome === 'independent' || event.explanation === 'yes').slice(-8).map(event => ({ itemId: event.itemId, title: event.title, date: event.date, track: event.track, attemptType: event.attemptType, outcome: event.outcome, explanation: event.explanation }));
  summary.knewButCouldNotExplain = events.filter(event => ['independent', 'hinted'].includes(event.outcome) && ['partial', 'no'].includes(event.explanation)).length;
  const due = dueReviews(states, date); summary.overdue = due.filter(item => item.nextDue < date).length;
  summary.weakItems = states.filter(item => item.weak).slice(0, 8).map(item => ({ itemId: item.itemId, topic: item.topic, title: item.title, channel: item.channel, reason: item.reason }));
  const phase = PHASES.find(phase => phase.id === p.phaseId);
  // Use recent evidence for warnings, not checkboxes or time elapsed. Phase-specific
  // exit bullets remain visible for manual judgment beyond the limited event model.
  const recent = progress.events.filter(event => event.date >= addDays(date, -29) && event.date <= date && Date.parse(event.timestamp) <= now.valueOf());
  const dsa = recent.filter(event => event.track === 'dsa').slice(-6);
  const explanations = recent.filter(event => event.explanation !== 'unknown').slice(-5);
  const warnings = [];
  if (!dsa.length) warnings.push('No recent DSA attempt evidence.');
  else if (dsa.filter(event => ['failed', 'studied_solution', 'hinted'].includes(event.outcome)).length > dsa.length / 2) warnings.push('Most recent DSA attempts required help or failed.');
  if (!states.some(item => item.delayedSuccesses > 0 && item.lastDate >= addDays(date, -29))) warnings.push('No recent successful delayed retrieval evidence.');
  if (!explanations.length || explanations.filter(event => event.explanation !== 'yes').length > explanations.length / 2) warnings.push('Recent explanations are missing or mostly partial/no.');
  if (phase.requiresPractical && !recent.some(event => event.track === 'technical' && event.attemptType === 'practical_task' && event.outcome === 'independent')) warnings.push('No recent independent practical evidence for this phase.');
  if (phase.id === 'phase-4' && !recent.some(event => event.attemptType === 'mock')) warnings.push('No recent recorded timed DSA mock; other mock evidence is not stored yet.');
  const suggestions = [];
  const difficult = dsa.filter(event => event.outcome !== 'independent').length;
  if (dsa.length >= 3 && difficult > dsa.length / 2) suggestions.push(`${difficult} of your last ${dsa.length} DSA attempts needed help or failed. Reduce new problems and repeat weak patterns.`);
  const unclear = explanations.filter(event => event.explanation !== 'yes').length;
  if (explanations.length >= 3 && unclear > 0) suggestions.push(`${unclear} of your last ${explanations.length} explanations were partial/no. Reuse these same topics for speaking before adding scope.`);
  if (summary.overdue >= 4) suggestions.push(`${summary.overdue} overdue revision channels. Reduce new content; keep the daily selection bounded.`);
  if (summary.minutes / 60 < p.availableHours / 2 && date >= addDays(p.weekStartedOn, 7)) suggestions.push(`Recorded ${Number((summary.minutes / 60).toFixed(1))} of ${p.availableHours} planned hours (${summary.unknownTime} events have unknown time). Check capacity before advancing; unrecorded time is unknown.`);
  const recurring = summary.recurringCommunicationGaps.find(gap => gap.count >= 2);
  if (recurring) suggestions.push(`Communication gap repeated ${recurring.count} times: ${recurring.text}. Consider this as next week's speaking focus.`);
  if (!warnings.length) suggestions.push('Recent evidence supports considering advance. Check the phase exit bullets; advancement is your decision.');
  const lastReview = progress.weeklyReviews?.at(-1) || null;
  return { initialized: true, state: p, phases: PHASES, phase, phaseWeek: p.learningWeek - p.phaseStartedWeek + 1,
    summary, suggestions, warnings, budget: loadBudget(p), lastReview, reviewRecommendedOn: addDays(p.weekStartedOn, 7), reviewRecommended: date >= addDays(p.weekStartedOn, 7),
    history: (progress.weeklyReviews || []).slice(-8).reverse() };
}
function initializePlanning(root, body, { now = new Date(), io = fs } = {}) {
  object(body, ['phaseId', 'learningWeek', 'availableHours']);
  const phase = PHASES.find(phase => phase.id === (body.phaseId || 'phase-1'));
  if (!phase) reject('Unknown phase');
  const week = body.learningWeek ?? phase.startWeek;
  if (!Number.isInteger(week) || week < 1 || week > 104) reject('Learning week must be an integer from 1 to 104');
  const availableHours = hours(body.availableHours ?? 12);
  return withProgressLock(root, () => {
    const progress = loadProgress(root); if (progress.planning) reject('Planning is already initialized. Use Weekly Review to change focus or phase.', 409);
    progress.planning = { version: 1, phaseId: phase.id, learningWeek: week, phaseStartedWeek: Math.min(week, phase.startWeek), weekStartedOn: todayISO(now, progress.studyTimezone), availableHours,
      weeklyFocus: { ...phase.defaults }, carryForward: [], status: 'initialized', lastReviewId: null, busyWeek: availableHours <= 8, firstTask: '', revision: 0 };
    progress.weeklyReviews = []; validatePlanningData(progress);
    atomicWrite(path.join(root, '.progress', 'log.json'), JSON.stringify(progress, null, 2) + '\n', io);
    return progress.planning;
  });
}
function saveWeeklyReview(root, body, { now = new Date(), io = fs } = {}) {
  object(body, ['id', 'expectedRevision', 'availableHours', 'busyWeek', 'carryForward', 'deprioritize', 'nextFocus', 'decision', 'reflection', 'firstTask', 'confirmAdvance']);
  if (!UUID.test(body.id || '')) reject('Review ID must be a UUID');
  if (!Number.isInteger(body.expectedRevision) || body.expectedRevision < 0) reject('Missing planning revision; refresh the review');
  if (!['continue', 'consolidate', 'advance'].includes(body.decision)) reject('Choose continue, consolidate or advance');
  if (typeof body.busyWeek !== 'boolean' || (body.confirmAdvance !== undefined && typeof body.confirmAdvance !== 'boolean')) reject('Busy week/confirmation must be boolean');
  // Canonical key order also makes acknowledgement retries insensitive to JSON ordering.
  const submission = { id: body.id, expectedRevision: body.expectedRevision, availableHours: hours(body.availableHours), busyWeek: body.busyWeek,
    carryForward: carry(body.carryForward, itemRegistry(root)), deprioritize: text(body.deprioritize, 'Deprioritize'), nextFocus: focus(body.nextFocus),
    decision: body.decision, reflection: text(body.reflection, 'Reflection'), firstTask: text(body.firstTask, 'First task', true), confirmAdvance: body.confirmAdvance === true };
  return withProgressLock(root, () => {
    const progress = loadProgress(root); const p = progress.planning;
    if (!p) reject('Initialize planning first', 409);
    const existing = progress.weeklyReviews.find(review => review.id === body.id);
    if (existing) { if (JSON.stringify(existing.submission) !== JSON.stringify(submission)) reject('Review ID already saved with different decisions', 409); return existing; }
    if (p.revision !== body.expectedRevision) reject('Planning changed in another session. Refresh before saving your decisions.', 409);
    const date = todayISO(now, progress.studyTimezone); if (date < p.weekStartedOn) reject('Review date cannot precede the current study week');
    const states = deriveReviewStates(progress.events.filter(event => event.date <= date), itemRegistry(root)); const view = planningView(progress, states, now);
    if (body.decision === 'advance' && p.phaseId === 'phase-5') reject('Already in the final phase. Continue or consolidate.');
    if (body.decision === 'advance' && view.warnings.length && !submission.confirmAdvance) reject('Review the evidence warnings and confirm manual phase advance.', 409, { warnings: view.warnings, needsConfirmation: true });
    const nextWeek = p.learningWeek + (body.decision === 'consolidate' ? 0 : 1);
    if (nextWeek > 104) reject('Learning week limit reached; consolidate rather than overflowing state.');
    const nextPhase = body.decision === 'advance' ? PHASES[PHASES.findIndex(phase => phase.id === p.phaseId) + 1].id : p.phaseId;
    const next = { ...p, phaseId: nextPhase, learningWeek: nextWeek, phaseStartedWeek: body.decision === 'advance' ? nextWeek : p.phaseStartedWeek,
      weekStartedOn: date, availableHours: submission.availableHours, weeklyFocus: submission.nextFocus, carryForward: submission.carryForward,
      status: body.decision, busyWeek: body.busyWeek || submission.availableHours <= 8, firstTask: submission.firstTask, lastReviewId: body.id, revision: p.revision + 1 };
    const review = { id: body.id, date, timestamp: now.toISOString(), from: { phaseId: p.phaseId, learningWeek: p.learningWeek, weekStartedOn: p.weekStartedOn, availableHours: p.availableHours, weeklyFocus: p.weeklyFocus },
      summary: view.summary, warnings: view.warnings, decision: body.decision, eventCount: progress.events.length, submission, to: next };
    progress.weeklyReviews.push(review); progress.planning = next; validatePlanningData(progress);
    atomicWrite(path.join(root, '.progress', 'log.json'), JSON.stringify(progress, null, 2) + '\n', io); return review;
  });
}
const normalized = value => value.toLowerCase().replace(/[^a-z0-9]/g, '');
function matchingTopics(focusText, candidates) {
  const parts = focusText.split(/\+|,|\/|\band\b/i).map(normalized).filter(Boolean);
  return candidates.filter(item => parts.some(part => part.includes(normalized(item.topic)) || normalized(item.topic).includes(part)));
}
function selectPlannedTask(progress, registry, queue, checklist, review, states, now) {
  const p = progress.planning;
  const enrich = (item, reason) => item ? { ...item, ...(item.kind === 'dsa' ? { relPath: item.itemId, checked: !!checklist.get(item.itemId)?.checked } : {}), reason } : null;
  const fallback = () => { const next = selectNext(queue, checklist); return next ? enrich({ ...next, ...registry.get(next.relPath) }, 'Next unfinished item in the existing dependency queue.') : null; };
  if (!p) return fallback();
  const essential = p.carryForward.find(item => item.role === 'essential');
  if (essential) {
    const registered = essential.itemId && registry.get(essential.itemId);
    return enrich(registered || { kind: 'manual', title: essential.text, question: `Explain the key idea and tradeoff in: ${essential.text}` }, 'Your one essential carry-forward item. It stays here until you intentionally replace/drop it at review.');
  }
  const budget = loadBudget(p);
  const due = review[0];
  const dueTask = () => due && enrich(registry.get(due.itemId) || due, `Selected because ${due.channel} revision is due ${due.nextDue}.`);
  const newCount = new Set(weekEvents(progress, now).filter(event => event.track === 'dsa' && event.attemptType === 'first_attempt').map(event => event.itemId)).size;
  if (budget.reduced || newCount >= budget.maxNewProblems) {
    if (due) return dueTask();
    const weak = states.find(item => item.weak); if (weak) return enrich(registry.get(weak.itemId) || weak, 'Reduced scope: retrieve one recent weak point, then explain it.');
    const technical = matchingTopics(p.weeklyFocus.technical, [...registry.values()].filter(item => item.kind === 'topic'))[0];
    return enrich(technical || registry.get('js:question:what-is-a-closure'), 'Reduced scope/new-problem ceiling: one short retrieval and speaking loop; no new coding quota.');
  }
  const unchecked = queue.filter(item => !checklist.get(item.relPath)?.checked && !item.challenge).map(item => ({ ...item, ...registry.get(item.relPath) }));
  const focused = matchingTopics(p.weeklyFocus.dsa, unchecked)[0];
  if (focused) return enrich(focused, 'Selected because this is your current DSA focus; original order is retained within that focus.');
  const technical = matchingTopics(p.weeklyFocus.technical, [...registry.values()].filter(item => item.kind === 'topic'))[0];
  if (technical) return enrich(technical, 'Selected because this matches your primary technical focus.');
  if (due) return dueTask();
  const weak = states.find(item => item.weak);
  if (weak) return enrich(registry.get(weak.itemId) || weak, 'Selected because this is a recent weakness and no unfinished focus item matched.');
  return fallback();
}
function planningLabel(view) {
  return view?.initialized ? `${view.phase.name} (${view.phase.id}) · Learning week ${view.state.learningWeek} · This week: ${view.state.weeklyFocus.technical}\nDSA: ${view.state.weeklyFocus.dsa || 'No new DSA focus'} · Speaking: ${view.state.weeklyFocus.speaking}\n${view.summary.minutes} recorded minutes / ${view.state.availableHours} available hours${view.reviewRecommended ? '\nWeekly review recommended (no automatic advancement).' : ''}` : 'Learning phase/week not configured yet. Initialize planning in the dashboard.';
}
module.exports = { PHASES, validatePlanningData, initializePlanning, saveWeeklyReview, planningView, selectPlannedTask, loadBudget, weekEvents, planningLabel };

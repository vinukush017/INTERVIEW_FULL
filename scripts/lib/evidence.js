const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { loadProgress, normalizeProgress, todayISO, validDate, parseChecklist } = require('./progress');
const { atomicWrite, withProgressLock } = require('./atomic');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TYPES = { dsa: ['first_attempt', 'review', 'mock'], speaking: ['technical_explanation', 'dsa_explanation', 'js_core', 'project', 'behavioral', 'system_design'], technical: ['retrieval', 'practical_task'] };
const OUTCOMES = ['independent', 'hinted', 'studied_solution', 'failed'];
const EXPLANATIONS = ['yes', 'partial', 'no', 'unknown'];
const FIELDS = new Set(['id', 'track', 'itemId', 'attemptType', 'outcome', 'minutes', 'confidence', 'explanation', 'technicalGap', 'communicationGap', 'mistakeOrInsight', 'question', 'usefulPhrase']);
function invalid(message) { throw Object.assign(new Error(message), { status: 400 }); }
function shortText(value, name, limit = 240) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || value.length > limit || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) invalid(`${name} must be short text (max ${limit} characters)`);
  return value.trim() || null;
}
function inputFields(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) invalid('Expected an event object');
  if (Object.keys(body).some(key => !FIELDS.has(key))) invalid('Unknown event field');
  if (body.id !== undefined && (typeof body.id !== 'string' || !UUID.test(body.id))) invalid('Event id must be a UUID');
  if (!Object.hasOwn(TYPES, body.track) || !TYPES[body.track].includes(body.attemptType)) invalid('Unknown track/attempt type');
  if (typeof body.itemId !== 'string' || body.itemId.length > 180) invalid('Missing/invalid item ID');
  if (body.track === 'speaking') { if (body.outcome != null) invalid('Speaking has no technical outcome'); }
  else if (!OUTCOMES.includes(body.outcome)) invalid('Unknown attempt outcome');
  const explanation = body.explanation ?? 'unknown';
  if (!EXPLANATIONS.includes(explanation)) invalid('Unknown explanation outcome');
  const minutes = body.minutes ?? null; const confidence = body.confidence ?? null;
  if (minutes !== null && (typeof minutes !== 'number' || !Number.isFinite(minutes) || minutes < 0 || minutes > 720)) invalid('Minutes must be a number from 0 to 720, or unknown');
  if (confidence !== null && (!Number.isInteger(confidence) || confidence < 1 || confidence > 5)) invalid('Confidence must be an integer from 1 to 5, or unknown');
  return { track: body.track, itemId: body.itemId, attemptType: body.attemptType, outcome: body.outcome ?? null, minutes, confidence, explanation,
    technicalGap: shortText(body.technicalGap, 'Technical gap'), communicationGap: shortText(body.communicationGap, 'Communication gap'),
    mistakeOrInsight: shortText(body.mistakeOrInsight, 'Mistake/insight'), question: shortText(body.question, 'Question', 400), usefulPhrase: shortText(body.usefulPhrase, 'Useful phrase', 120) };
}
function validateAttempt(body, registry) {
  const values = inputFields(body); let item = registry.get(values.itemId);
  const custom = values.itemId.startsWith('custom:') && UUID.test(values.itemId.slice(7));
  if (!item && !(custom && values.track !== 'dsa' && values.question)) invalid('Unknown/unregistered item ID');
  if (values.track === 'dsa' && item?.kind !== 'dsa') invalid('DSA attempts require a registered problem path');
  if (values.track === 'technical' && item?.kind === 'dsa') invalid('Use the DSA track for coding problems');
  if (values.attemptType === 'js_core' && item?.kind !== 'js_core') invalid('JS Core requires a registered question ID');
  item ||= { title: values.question, question: values.question, topic: values.attemptType, kind: 'custom' };
  return { ...values, ...(body.id ? { id: body.id } : {}), question: values.question || item.question, topic: item.topic, title: item.title };
}
function validateStoredEvents(events) {
  const seen = new Set();
  for (const event of events) {
    if (!event || typeof event !== 'object' || !UUID.test(event.id || '') || seen.has(event.id) || !validDate(event.date) ||
        typeof event.timestamp !== 'string' || Number.isNaN(Date.parse(event.timestamp)) || typeof event.timezone !== 'string' ||
        typeof event.topic !== 'string' || typeof event.title !== 'string' || !['tests_passed', 'self_certified', 'unknown'].includes(event.verification) ||
        (event.track === 'dsa' && ['independent', 'hinted'].includes(event.outcome) && event.verification === 'unknown')) throw new Error('Invalid stored event; original history has not been changed');
    const body = Object.fromEntries(Object.entries(event).filter(([key]) => FIELDS.has(key)));
    try { inputFields(body); new Intl.DateTimeFormat('en', { timeZone: event.timezone }); }
    catch (error) { throw new Error(`Invalid stored evidence; original history has not been changed: ${error.message}`); }
    seen.add(event.id);
  }
}
function sameSubmission(existing, candidate) {
  return [...FIELDS].filter(key => key !== 'id').every(key => (existing[key] ?? null) === (candidate[key] ?? null));
}
function existingSubmission(progress, values) {
  const existing = values.id && progress.events.find(event => event.id === values.id);
  if (existing && !sameSubmission(existing, values)) throw Object.assign(new Error('Event ID already saved with different evidence. Start a new attempt.'), { status: 409 });
  return existing || null;
}
function recordAttempt(root, values, { now = new Date(), verification = 'unknown', io = fs } = {}) {
  return withProgressLock(root, () => {
    const progress = loadProgress(root); const id = values.id || randomUUID();
    const existing = existingSubmission(progress, { ...values, id });
    if (existing) return existing;
    const event = { ...values, id, date: todayISO(now, progress.studyTimezone), timestamp: now.toISOString(), timezone: progress.studyTimezone, verification };
    validateStoredEvents([event]);
    progress.events.push(event);
    atomicWrite(path.join(root, '.progress', 'log.json'), JSON.stringify(progress, null, 2) + '\n', io);
    return event;
  });
}
function completeProblem(root, relPath, { eventId, now = new Date(), io = fs } = {}) {
  return withProgressLock(root, () => {
    const progress = loadProgress(root);
    if (eventId !== undefined) {
      const event = progress.events.find(event => event.id === eventId);
      if (!event || event.itemId !== relPath || event.track !== 'dsa' || !['independent', 'hinted'].includes(event.outcome) || event.verification === 'unknown') invalid('Completion requires a matching successful validated attempt');
    }
    const file = path.join(root, '01-DSA-Questions.md'); const text = fs.readFileSync(file, 'utf8'); const { map, lines } = parseChecklist(text);
    const item = map.get(relPath); if (!item) invalid('Problem not registered');
    lines[item.line] = lines[item.line].replace('- [ ]', '- [x]');
    const date = todayISO(now, progress.studyTimezone); const problem = relPath.replace(/\.js$/, '');
    if (!progress.entries.some(entry => entry.date === date && entry.problem === problem)) progress.entries.push({ date, problem });
    const checklist = lines.join(text.includes('\r\n') ? '\r\n' : '\n');
    if (checklist !== text) atomicWrite(file, checklist, io);
    try { atomicWrite(path.join(root, '.progress', 'log.json'), JSON.stringify(normalizeProgress(progress), null, 2) + '\n', io); }
    catch (error) { if (checklist !== text) atomicWrite(file, text); throw error; }
    return progress;
  });
}
function legacyEvidence(progress) {
  return progress.entries.map((entry, index) => ({ ...entry, id: `legacy-completion:${index}`, track: 'dsa', itemId: entry.problem + '.js',
    outcome: 'unknown', minutes: null, confidence: null, explanation: 'unknown' }));
}
module.exports = { TYPES, OUTCOMES, EXPLANATIONS, validateAttempt, validateStoredEvents, existingSubmission, recordAttempt, completeProblem, legacyEvidence };

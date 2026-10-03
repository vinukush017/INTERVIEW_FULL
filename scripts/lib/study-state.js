const fs = require('node:fs');
const path = require('node:path');
const { repoRoot, loadProgress, todayISO, parseChecklist, parseQueue, computeStreak } = require('./progress');
const { selectReview, parseTopics } = require('./study');
const { itemRegistry } = require('./items');
const { legacyEvidence } = require('./evidence');
const { addDays, deriveReviewStates, dueReviews, boundedReviews } = require('./revision');

const { aggregate } = require('./study-summary');
const { derivePatterns } = require('./dsa-patterns');
const { planningView, selectPlannedTask } = require('./planning');
function buildStudyState(root = repoRoot, now = new Date()) {
  const progress = loadProgress(root); const date = todayISO(now, progress.studyTimezone);
  const text = fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8'); const { map } = parseChecklist(text);
  const registry = itemRegistry(root); const states = deriveReviewStates(progress.events.filter(event => event.date <= date), registry); const due = dueReviews(states, date);
  const selected = boundedReviews(due);
  const knownCoding = new Set(states.filter(item => item.channel === 'coding').map(item => item.itemId));
  const baselineMap = new Map([...map].filter(([file]) => !knownCoding.has(file)));
  const baseline = !selected.length ? selectReview(baselineMap, progress.entries, () => 0) : null;
  const queue = parseQueue(text);
  const dsa = derivePatterns(progress, registry, states, date);
  const planning = planningView(progress, states, now, registry, dsa);
  const next = selectPlannedTask(progress, registry, queue, map, selected, states, now, dsa);
  const recent = progress.events.filter(event => event.date >= addDays(date, -29) && event.date <= date);
  const weekly = progress.events.filter(event => event.date >= addDays(date, -6) && event.date <= date);
  const recentExplanations = recent.filter(event => event.explanation !== 'unknown').slice(-10);
  const latest = {};
  for (const event of progress.events) latest[`${event.track}:${event.itemId}`] = event;
  const weaknesses = states.filter(item => item.weak).sort((a, b) => a.nextDue.localeCompare(b.nextDue) || a.key.localeCompare(b.key));
  const recentActivity = [
    ...progress.entries.map(entry => ({ date: entry.date, label: `Completion recorded: ${registry.get(entry.problem + '.js')?.title || entry.problem} (independence/explanation unknown)` })),
    ...progress.events.map(event => ({ date: event.date, timestamp: event.timestamp, label: event.track === 'speaking' ? `${event.title}: explanation ${event.explanation}` : `${event.attemptType === 'review' ? 'Reviewed' : 'Attempted'} ${event.title}: ${event.outcome}${event.explanation !== 'unknown' ? ` · explanation ${event.explanation}` : ''}` })),
  ].sort((a, b) => b.date.localeCompare(a.date) || (b.timestamp || '').localeCompare(a.timestamp || '')).slice(0, 20);
  const speaking = due.find(item => item.channel === 'speaking' && item.itemId === selected[0]?.itemId) || due.find(item => item.channel === 'speaking') || null;
  return { date, timezone: progress.studyTimezone, schemaVersion: 2, legacyCount: progress.entries.length, planning,
    dsa, legacy: legacyEvidence(progress), events: progress.events, latest, reviewStates: states,
    review: { date, due: selected, dueCount: due.length, deferredCount: Math.max(0, due.length - selected.length), baseline, planning },
    today: { date, timezone: progress.studyTimezone, main: next, planning,
      revision: selected, baseline, speaking, speakingFocus: planning.state?.weeklyFocus.speaking || null, carryForward: planning.state?.carryForward || [], firstTask: planning.state?.firstTask || '', weakPoint: weaknesses[0] || null },
    weaknesses, recentActivity, summary: aggregate(progress.events), weekly: aggregate(weekly),
    readiness: { recentIndependent: recent.filter(event => event.track === 'dsa' && event.outcome === 'independent' && event.verification !== 'unknown').length,
      explanationSample: { total: recentExplanations.length, yes: recentExplanations.filter(event => event.explanation === 'yes').length },
      tracks: ['React', 'Next.js', 'Node.js', 'Express', 'SQL', 'System Design'].map(topic => ({ topic, practicalAttempts: recent.filter(event => event.track === 'technical' && event.topic === topic && event.attemptType === 'practical_task').length })) },
    completion: { solved: [...map.values()].filter(item => item.checked).length, total: map.size, topics: parseTopics(text).map(topic => ({ name: topic.name, solved: topic.items.filter(item => item.checked).length, total: topic.items.length })) },
    streak: computeStreak([...progress.entries.map(entry => entry.date), ...progress.events.map(event => event.date)], date) };
}
module.exports = { buildStudyState, aggregate };

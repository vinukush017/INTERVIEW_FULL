const INTERVALS = [1, 3, 7, 14, 30];
function addDays(date, days) { const value = new Date(`${date}T00:00:00Z`); value.setUTCDate(value.getUTCDate() + days); return value.toISOString().slice(0, 10); }

// Replay append-only evidence. Same-day/early retries never grow an interval.
function deriveReviewStates(events, registry) {
  const states = new Map();
  function observe(event, channel, value, gap) {
    const key = `${channel}:${event.itemId}`;
    const item = registry.get(event.itemId) || { itemId: event.itemId, title: event.title, question: event.question, topic: event.topic, priority: 'core', kind: 'custom' };
    const state = states.get(key) || { key, ...item, channel, stage: 0, nextDue: null, weak: false, delayedSuccesses: 0, lastIndependentDate: null };
    gap = gap && !/^(none|no gap|n\/a)$/i.test(gap.trim()) ? gap : null;
    const success = channel === 'speaking' ? value === 'yes' : value === 'independent';
    const delayed = state.nextDue && event.date >= state.nextDue && event.date > state.lastDate;
    if (!success) {
      state.maintenance = false; state.stage = 0; state.nextDue = addDays(event.date, value === 'hinted' ? 2 : 1);
      state.weak = true; state.delayedSuccesses = 0; state.reason = value;
    } else {
      if (state.maintenance && !gap) { /* consolidated items stay optional */ }
      else if (!state.nextDue) state.nextDue = addDays(event.date, 1);
      else if (delayed) {
        const consolidate = state.stage === 4 && !state.weak && !gap;
        state.stage = Math.min(4, state.stage + 1); state.nextDue = consolidate ? null : addDays(event.date, INTERVALS[state.stage]); state.maintenance = consolidate; state.delayedSuccesses++;
      }
      if (state.delayedSuccesses >= 2 && !gap) { state.weak = false; state.reason = null; }
      if (channel !== 'speaking') state.lastIndependentDate = event.date;
    }
    if (gap) { state.maintenance = false; state.weak = true; state.reason = gap; state.gap = gap; state.delayedSuccesses = 0; state.nextDue = [state.nextDue, addDays(event.date, 1)].filter(Boolean).sort()[0]; }
    state.lastDate = event.date; state.latestOutcome = value; state.lastEventId = event.id;
    // Preserve the actual practiced question, even when the display title changes.
    state.question = event.question || item.question; state.lastAttempt = event;
    states.set(key, state);
  }
  for (const event of events) {
    if (event.track === 'dsa' || event.track === 'technical') observe(event, event.track === 'dsa' ? 'coding' : 'technical', event.outcome, event.technicalGap);
    if (event.explanation !== 'unknown' || event.communicationGap) observe(event, 'speaking', event.explanation, event.communicationGap || event.technicalGap);
  }
  return [...states.values()];
}
function dueReviews(states, date) {
  const priority = item => item.channel === 'coding' && item.priority === 'core' && ['failed', 'studied_solution'].includes(item.latestOutcome) ? 0 :
    item.nextDue < date ? 1 : item.channel === 'speaking' && ['partial', 'no'].includes(item.latestOutcome) ? 2 : item.weak ? 3 : 4;
  return states.filter(item => item.nextDue && item.nextDue <= date).sort((a, b) => priority(a) - priority(b) || a.nextDue.localeCompare(b.nextDue) || a.key.localeCompare(b.key));
}
function boundedReviews(due) {
  const coding = due.find(item => item.channel === 'coding');
  return coding ? [coding] : due.filter(item => item.channel !== 'coding').slice(0, 3);
}
module.exports = { INTERVALS, addDays, deriveReviewStates, dueReviews, boundedReviews };

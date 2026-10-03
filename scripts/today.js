#!/usr/bin/env node
const { buildStudyState } = require('./lib/study-state');
const { planningLabel } = require('./lib/planning');
function main() {
  const state = buildStudyState();
  console.log(`\nToday: ${state.date} (${state.timezone})\n${planningLabel(state.planning)}`);
  console.log(`Solved: ${state.completion.solved}/${state.completion.total}`);
  console.log(`Main task: ${state.today.main?.title || 'Choose a review/topic'}${state.today.main ? '\n  Source: ' + (state.today.main.relPath || state.today.main.document || state.today.main.itemId || 'Manual carry-forward') : ''}`);
  if (state.today.main?.reason) console.log(state.today.main.reason);
  if (state.today.firstTask) console.log('First session step: ' + state.today.firstTask);
  console.log('Due revision:');
  if (!state.review.due.length) console.log('  None from recorded attempt evidence.');
  for (const item of state.review.due) console.log(`  ${item.title} (${item.channel}, due ${item.nextDue}) — ${item.itemId}`);
  if (state.review.baseline) console.log(`Optional baseline retrieval (evidence unknown): ${state.review.baseline.title}`);
  console.log(`Speaking: ${state.today.speaking?.question || state.today.main?.question || 'Choose one question from your current technical task.'}`);
  if (state.today.weakPoint) console.log(`Weak point: ${state.today.weakPoint.title} — ${state.today.weakPoint.reason}`);
  console.log('Open npm run dev to record an attempt/explanation.\n');
}
try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }

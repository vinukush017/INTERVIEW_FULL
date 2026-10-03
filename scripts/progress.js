#!/usr/bin/env node
const { buildStudyState } = require('./lib/study-state');
const { planningLabel } = require('./lib/planning');
try {
  const state = buildStudyState(); const { completion, summary, readiness } = state;
  console.log(planningLabel(state.planning));
  console.log(`\nCompletion\nSolved: ${completion.solved}/${completion.total}`);
  console.log(`Current streak: ${state.streak.current} day(s)   Longest streak: ${state.streak.longest} day(s)`);
  for (const topic of completion.topics) console.log(`  ${topic.name.padEnd(30)} ${topic.solved}/${topic.total}`);
  console.log(`\nEvidence (schema v${state.schemaVersion})\nCompletion-only records (missing evidence stays unknown): ${state.legacyCount}`);
  for (const [outcome, count] of Object.entries(summary.attempts)) console.log(`  ${outcome}: ${count}`);
  console.log(`Reviews recorded: ${summary.reviewsCompleted}; independent reviews: ${summary.reviewSuccesses}`);
  console.log(`Explanations without notes: ${summary.explanations.yes}/${summary.explanations.total}; approximate recorded minutes: ${summary.minutes}`);
  console.log('\nCurrent weaknesses');
  for (const item of state.weaknesses.slice(0, 5)) console.log(`  ${item.title} (${item.channel}): ${item.reason}; next review ${item.nextDue}`);
  if (!state.weaknesses.length) console.log('  No weakness evidence recorded; this does not prove readiness.');
  console.log(`\nReadiness evidence, last 30 study dates\n${readiness.recentIndependent} validated independent DSA attempts recorded.`);
  console.log(`${readiness.explanationSample.yes}/${readiness.explanationSample.total} of the latest up to 10 explanations were notes-free.`);
  for (const track of readiness.tracks) console.log(`${track.topic}: ${track.practicalAttempts ? track.practicalAttempts + ' self-reported practical attempts' : 'No demonstrated practical evidence yet'}.`);
  console.log('\nDSA pattern observations');
  for (const pattern of state.dsa.patterns.filter(item => item.coreTotal)) console.log(`  ${pattern.name}: ${pattern.state} — ${pattern.nextAction}`);
  console.log('No readiness score; difficulty, coverage and external interview evaluation remain unknown.\n');
} catch (error) { console.error(error.message); process.exitCode = 1; }

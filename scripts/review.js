#!/usr/bin/env node
const { buildStudyState } = require('./lib/study-state');
const { planningLabel } = require('./lib/planning');
try {
  const { review, planning } = buildStudyState();
  console.log(planningLabel(planning));
  console.log(`\nDue revision — ${review.date}`);
  for (const item of review.due) console.log(`  ${item.title}: ${item.channel}, due ${item.nextDue}, latest ${item.latestOutcome}\n  ${item.itemId}`);
  if (!review.due.length) console.log('  No date-based review is due from recorded evidence.');
  if (review.baseline) console.log(`Optional baseline retrieval: ${review.baseline.title}\n  ${review.baseline.relPath} — independence/explanation unknown.`);
  console.log(`Other due channels: ${review.deferredCount}. Keep today's review bounded; no catch-up obligation.\n`);
} catch (error) { console.error(error.message); process.exitCode = 1; }

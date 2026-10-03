#!/usr/bin/env node
// Legacy completion remains available; it never invents independence or speaking evidence.
const { repoRoot, loadProgress } = require('./lib/progress');
const { registeredSolution, runTest } = require('./serve-dashboard');
const { completeProblem, validateAttempt, recordAttempt } = require('./lib/evidence');
const { itemRegistry } = require('./lib/items');
async function main() {
  const argument = process.argv[2];
  if (!argument) throw new Error('Usage: npm run done -- Folder/problem-file [--outcome independent|hinted|studied_solution|failed] [--minutes N] [--confidence 1-5] [--explanation yes|partial|no|unknown]');
  const file = argument.replace(/\.js$/, '') + '.js';
  if (!registeredSolution(repoRoot, file)) throw new Error('Unknown or unsafe practice file');
  const options = {}; const names = { '--outcome': 'outcome', '--minutes': 'minutes', '--confidence': 'confidence', '--explanation': 'explanation', '--type': 'attemptType' };
  for (let i = 3; i < process.argv.length; i += 2) {
    const key = names[process.argv[i]]; const value = process.argv[i + 1]; if (!key || value === undefined) throw new Error('Unknown/missing CLI option');
    options[key] = ['minutes', 'confidence'].includes(key) ? Number(value) : value;
  }
  const progress = loadProgress();
  const known = progress.entries.some(entry => entry.problem + '.js' === file) || progress.events.some(event => event.track === 'dsa' && event.itemId === file);
  const values = options.outcome ? validateAttempt({ track: 'dsa', itemId: file, attemptType: known ? 'review' : 'first_attempt', ...options }, itemRegistry(repoRoot)) : null;
  if (!values && Object.keys(options).length) throw new Error('Evidence options require --outcome');
  if (values && ['failed', 'studied_solution'].includes(values.outcome)) {
    const event = recordAttempt(repoRoot, values); console.log(`Attempt saved: ${event.outcome}. Checklist not changed.`); return;
  }
  const tested = await runTest(repoRoot, file, 10_000);
  if (tested.hasTest && !tested.pass) throw new Error('Tests failed; completion not recorded.\n' + tested.output);
  if (tested.hasTest) console.log(tested.output);
  else console.log('No automated tests: invoking done explicitly self-certifies the solution. Independence/explanation remain unknown unless supplied.');
  const event = values ? recordAttempt(repoRoot, values, { verification: tested.hasTest ? 'tests_passed' : 'self_certified' }) : null;
  completeProblem(repoRoot, file, { eventId: event?.id });
  console.log(`Done: ${file}${event ? '\nAttempt evidence: ' + event.outcome : '\nCompletion only; independence/explanation unknown.'}\nRun npm run today for the next task.`);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });

#!/usr/bin/env node
// Suggests one solved problem to re-solve, for spaced-repetition memory
// reinforcement. Run: npm run review
//
// Always picks from the solved problems with the FEWEST recorded solves so
// far (ties broken randomly). That means every solved problem reaches N
// reps before any of them reaches N+1 -- once everything has been solved
// twice, the next review naturally pushes toward a third pass. No hardcoded
// target count; it just always chases the least-practiced group.
const fs = require("node:fs");
const { questionsPath, loadProgress, parseChecklist } = require("./lib/progress");

function main() {
  const text = fs.readFileSync(questionsPath, "utf8");
  const { map } = parseChecklist(text);
  const progress = loadProgress();

  const repCounts = new Map();
  for (const e of progress.entries) repCounts.set(e.problem, (repCounts.get(e.problem) || 0) + 1);

  const solved = [...map.entries()].filter(([, v]) => v.checked);

  console.log("");
  if (solved.length === 0) {
    console.log("Nothing solved yet -- solve a problem first, then come back here to review it later.");
    console.log("");
    return;
  }

  let minRep = Infinity;
  for (const [relPath] of solved) {
    const key = relPath.replace(/\.js$/, "");
    minRep = Math.min(minRep, repCounts.get(key) || 0);
  }
  const candidates = solved.filter(([relPath]) => {
    const key = relPath.replace(/\.js$/, "");
    return (repCounts.get(key) || 0) === minRep;
  });
  const [relPath, entry] = candidates[Math.floor(Math.random() * candidates.length)];
  const relPathArg = relPath.replace(/\.js$/, "");

  console.log(`Review: ${entry.title}`);
  console.log(`  File: ${relPath}`);
  console.log(`  Solved ${minRep} time${minRep === 1 ? "" : "s"} so far -- ${candidates.length} problem${candidates.length === 1 ? " is" : "s are"} tied for least-practiced right now.`);
  console.log(`  Re-solve it from scratch, then: npm run done -- ${relPathArg}`);
  console.log("");
}

main();

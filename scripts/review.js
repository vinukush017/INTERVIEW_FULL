#!/usr/bin/env node
// Suggests one solved problem to re-solve, using recorded solve counts
// (not date-based spaced repetition). Run: npm run review
//
// Always picks from the solved problems with the FEWEST recorded solves so
// far (ties broken randomly). That means every solved problem reaches N
// reps before any of them reaches N+1 -- once everything has been solved
// twice, the next review naturally pushes toward a third pass. No hardcoded
// target count; it just always chases the least-practiced group.
const fs = require("node:fs");
const { questionsPath, loadProgress, parseChecklist } = require("./lib/progress");

const { selectReview } = require("./lib/study");

function main() {
  const text = fs.readFileSync(questionsPath, "utf8");
  const { map } = parseChecklist(text);
  const progress = loadProgress();

  const pick = selectReview(map, progress.entries);

  console.log("");
  if (!pick) {
    console.log("Nothing solved yet -- solve a problem first, then come back here to review it later.");
    console.log("");
    return;
  }

  const { relPath, title, repCount: minRep, poolSize } = pick;
  const relPathArg = relPath.replace(/\.js$/, "");

  console.log(`Review: ${title}`);
  console.log(`  File: ${relPath}`);
  console.log(`  Solved ${minRep} time${minRep === 1 ? "" : "s"} so far -- ${poolSize} problem${poolSize === 1 ? " is" : "s are"} tied for least-practiced right now.`);
  console.log(`  Re-solve it from scratch, then: npm run done -- ${relPathArg}`);
  console.log("");
}

main();

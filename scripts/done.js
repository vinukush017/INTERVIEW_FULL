#!/usr/bin/env node
// Marks a problem solved: runs its test (if one exists), flips its checkbox
// in 01-DSA-Questions.md, logs it for the streak, and prints what's next.
// Usage: npm run done -- <Folder/problem-file>   e.g. npm run done -- HashMap/two-sum
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  repoRoot,
  loadProgress,
  saveProgress,
  todayISO,
  markDone,
  computeStreak,
} = require("./lib/progress");

function main() {
  const rawArg = process.argv[2];
  if (!rawArg) {
    console.error("Usage: npm run done -- <Folder/problem-file>");
    console.error("Example: npm run done -- HashMap/two-sum");
    process.exit(1);
  }

  const relPathArg = rawArg.replace(/\\/g, "/").replace(/\.js$/, "");
  const relPath = `${relPathArg}.js`;
  const solutionAbs = path.join(repoRoot, relPath);

  if (!fs.existsSync(solutionAbs)) {
    console.error(`No solution file at ${relPath}`);
    process.exit(1);
  }

  const testAbs = path.join(repoRoot, "tests", `${relPathArg}.test.js`);
  if (fs.existsSync(testAbs)) {
    console.log(`Running tests for ${relPathArg} ...`);
    const result = spawnSync(
      process.execPath,
      [path.join("scripts", "test-solution.js"), relPathArg],
      { cwd: repoRoot, stdio: "inherit" }
    );
    if (result.status !== 0) {
      console.error("\nTests failed -- fix the solution before marking it done.");
      process.exit(1);
    }
  } else {
    console.log(
      "No automated test for this problem -- self-certify: can you explain the approach, " +
        "code it without copying, and state time/space complexity? If yes, it counts."
    );
  }

  const wasFound = markDone(relPath);
  if (!wasFound) {
    console.error(`Could not find "${relPath}" in the 01-DSA-Questions.md checklist.`);
    process.exit(1);
  }

  const progress = loadProgress();
  const today = todayISO();
  const alreadyLoggedToday = progress.entries.some(
    (e) => e.problem === relPathArg && e.date === today
  );
  if (!alreadyLoggedToday) {
    progress.entries.push({ date: today, problem: relPathArg });
  }
  saveProgress(progress);

  const dates = progress.entries.map((e) => e.date);
  const streak = computeStreak(dates);

  const uniqueSolved = new Set(progress.entries.map((e) => e.problem)).size;

  console.log("");
  console.log(`Done: ${relPath}`);
  console.log(`Streak: ${streak.current} day(s) (longest: ${streak.longest})`);
  console.log(`Total solved: ${uniqueSolved}`);
  console.log("");
  console.log("Run `npm run today` to see what's next.");
}

main();

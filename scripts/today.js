#!/usr/bin/env node
// The single "what do I do right now" entry point. Run: npm run today
const fs = require("node:fs");
const {
  questionsPath,
  loadProgress,
  todayISO,
  parseQueue,
  parseChecklist,
  computeStreak,
} = require("./lib/progress");

const FULLSTACK_TOPICS = [
  "JavaScript -- scope, hoisting, closures (02-JavaScript.md)",
  "JavaScript -- types, coercion, equality (02-JavaScript.md)",
  "React -- components, props, state (03-React.md)",
  "React -- hooks: useEffect, useMemo, useCallback (03-React.md)",
  "JavaScript -- promises, async/await (02-JavaScript.md)",
  "Node.js -- event loop, streams (05-NodeJS.md)",
  "Express -- middleware, error handling (06-Express.md)",
  "SQL -- joins, indexes, query plans (07-SQL.md)",
  "System design -- one component per day (08-System-Design.md)",
  "Next.js -- rendering strategies (04-NextJS.md)",
];

function main() {
  const text = fs.readFileSync(questionsPath, "utf8");
  const queue = parseQueue(text);
  const { map } = parseChecklist(text);
  const progress = loadProgress();
  const dates = progress.entries.map((e) => e.date);
  const streak = computeStreak(dates);

  const totalCount = map.size;
  const solvedCount = [...map.values()].filter((v) => v.checked).length;

  const daysSinceStart = Math.max(
    0,
    Math.round((new Date(todayISO()) - new Date(progress.startDate)) / 86400000)
  );
  const week = Math.floor(daysSinceStart / 7) + 1;
  // Matches the ramp you asked for: ~60 min for the first two weeks, then grows.
  const suggestedMinutes = week <= 2 ? 60 : week <= 4 ? 75 : week <= 8 ? 90 : 120;

  // Challenge problems are meant to be skipped on a first pass through a
  // level (per 01-DSA-Questions.md), so prefer the first unsolved non-challenge
  // problem; only fall back to a challenge one if nothing else is left.
  let next = null;
  let firstUnsolvedChallenge = null;
  for (const item of queue) {
    const entry = map.get(item.relPath);
    if (entry && entry.checked) continue;
    if (item.challenge) {
      if (!firstUnsolvedChallenge) firstUnsolvedChallenge = item;
      continue;
    }
    next = item;
    break;
  }
  if (!next) next = firstUnsolvedChallenge;

  console.log("");
  console.log(
    streak.current > 0
      ? `Streak: ${streak.current} day(s) in a row (longest: ${streak.longest})`
      : streak.lastDate
      ? `Streak reset -- last solved ${streak.lastDate}. Today restarts it. (longest: ${streak.longest})`
      : "No streak yet -- today is day 1."
  );
  console.log(`Solved: ${solvedCount}/${totalCount} (${Math.round((solvedCount / totalCount) * 100)}%)`);
  console.log(`Week ${week} of your plan -- suggested focus time today: ~${suggestedMinutes} min`);
  console.log("");

  if (next) {
    const flag = next.challenge ? "  (challenge -- everything easier in its level is already done)" : "";
    console.log(`Next problem: ${next.title}${flag}`);
    console.log(`  File: ${next.relPath}`);
    console.log(`  1. Open the file and read the prompt.`);
    console.log(`  2. Attempt it for 25 min, take one hint if stuck, then 10 more min.`);
    console.log(`  3. When it works: npm run done -- ${next.relPath.replace(/\.js$/, "")}`);
  } else {
    console.log("Every queued problem is checked off. Time for revision, mocks, or harder problems.");
  }

  console.log("");
  const topic = FULLSTACK_TOPICS[daysSinceStart % FULLSTACK_TOPICS.length];
  console.log(`Full-stack topic for today: ${topic}`);
  console.log("");
}

main();

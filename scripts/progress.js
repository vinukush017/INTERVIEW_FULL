#!/usr/bin/env node
// Full progress dashboard. Run: npm run progress
const fs = require("node:fs");
const { questionsPath, loadProgress, computeStreak } = require("./lib/progress");

const { parseTopics } = require("./lib/study");

function main() {
  const text = fs.readFileSync(questionsPath, "utf8");
  const topics = parseTopics(text).map(topic => ({
    name: topic.name, total: topic.items.length,
    solved: topic.items.filter(item => item.checked).length,
  }));

  const totalCount = topics.reduce((sum, t) => sum + t.total, 0);
  const solvedCount = topics.reduce((sum, t) => sum + t.solved, 0);

  const progress = loadProgress();
  const dates = progress.entries.map((e) => e.date);
  const streak = computeStreak(dates);

  console.log("");
  console.log("=== Progress Dashboard ===");
  console.log(`Solved: ${solvedCount}/${totalCount} (${Math.round((solvedCount / totalCount) * 100)}%)`);
  console.log(`Current streak: ${streak.current} day(s)   Longest streak: ${streak.longest} day(s)`);
  console.log(`Started: ${progress.startDate}   Last solved: ${streak.lastDate || "never"}`);
  console.log("");
  console.log("By topic:");
  topics
    .filter((t) => t.total > 0)
    .forEach((t) => {
      const filled = Math.round((t.solved / t.total) * 10);
      const bar = "#".repeat(filled) + "-".repeat(10 - filled);
      console.log(`  ${t.name.padEnd(30)} [${bar}] ${t.solved}/${t.total}`);
    });

  const notStarted = topics.filter((t) => t.total > 0 && t.solved === 0).map((t) => t.name);
  if (notStarted.length) {
    console.log("");
    console.log(`Not started yet: ${notStarted.join(", ")}`);
  }
  console.log("");
}

main();

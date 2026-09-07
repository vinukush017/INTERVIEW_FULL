const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..", "..");
const progressPath = path.join(repoRoot, ".progress", "log.json");
const questionsPath = path.join(repoRoot, "01-DSA-Questions.md");

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function loadProgress() {
  if (!fs.existsSync(progressPath)) {
    return { startDate: todayISO(), entries: [] };
  }
  return JSON.parse(fs.readFileSync(progressPath, "utf8"));
}

function saveProgress(data) {
  fs.mkdirSync(path.dirname(progressPath), { recursive: true });
  fs.writeFileSync(progressPath, JSON.stringify(data, null, 2) + "\n");
}

// Parses the "Dependency-ordered practice queue" section: numbered links in
// the order they should be attempted, spanning every "### Level N" block.
function parseQueue(questionsText) {
  const lines = questionsText.split(/\r?\n/);
  const start = lines.findIndex((l) => l.startsWith("## Dependency-ordered practice queue"));
  const end = lines.findIndex((l) => l.startsWith("## Problems"));
  const queue = [];
  for (let i = start; i >= 0 && i < end; i++) {
    const m = lines[i].match(/^\d+\.\s+\[(.+?)\]\(\.\/(.+?\.js)\)(.*)$/);
    if (m) {
      queue.push({ title: m[1], relPath: m[2], challenge: /challenge/i.test(m[3]) });
    }
  }
  return queue;
}

// Parses the "## Problems" checklist section into path -> {checked, title, line}.
function parseChecklist(questionsText) {
  const lines = questionsText.split(/\r?\n/);
  const problemsStart = lines.findIndex((l) => l.trim() === "## Problems");
  const map = new Map();
  lines.forEach((line, idx) => {
    if (idx < problemsStart) return;
    const m = line.match(/^- \[([ x])\] \[(.+?)\]\(\.\/(.+?\.js)\)/);
    if (m) {
      map.set(m[3], { checked: m[1] === "x", title: m[2], line: idx });
    }
  });
  return { map, lines, problemsStart };
}

// Flips a checklist checkbox to [x]. Returns false if the path has no entry.
function markDone(relPath) {
  const text = fs.readFileSync(questionsPath, "utf8");
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const { map, lines } = parseChecklist(text);
  const entry = map.get(relPath);
  if (!entry) return false;
  if (!entry.checked) {
    lines[entry.line] = lines[entry.line].replace("- [ ]", "- [x]");
    fs.writeFileSync(questionsPath, lines.join(eol));
  }
  return true;
}

// Streak over distinct solve-dates, with a one-day grace period so the
// streak still displays as "alive" before today's problem is done.
function computeStreak(dates) {
  const uniqueDays = [...new Set(dates)].sort();
  if (uniqueDays.length === 0) return { current: 0, longest: 0, lastDate: null };

  const dayMs = 86400000;
  let longest = 1;
  let run = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const diff = Math.round((new Date(uniqueDays[i]) - new Date(uniqueDays[i - 1])) / dayMs);
    run = diff === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const last = uniqueDays[uniqueDays.length - 1];
  const diffFromToday = Math.round((new Date(todayISO()) - new Date(last)) / dayMs);
  const current = diffFromToday <= 1 ? run : 0;

  return { current, longest, lastDate: last };
}

module.exports = {
  repoRoot,
  progressPath,
  questionsPath,
  todayISO,
  loadProgress,
  saveProgress,
  parseQueue,
  parseChecklist,
  markDone,
  computeStreak,
};

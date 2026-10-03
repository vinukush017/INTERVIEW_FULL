const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..", "..");
const progressPath = path.join(repoRoot, ".progress", "log.json");
const questionsPath = path.join(repoRoot, "01-DSA-Questions.md");

const { atomicWrite, withProgressLock } = require("./atomic");
const DEFAULT_TIMEZONE = "Asia/Kolkata";
function studyTimezone(stored) {
  const zone = process.env.STUDY_TIMEZONE || stored || DEFAULT_TIMEZONE;
  try { new Intl.DateTimeFormat("en", { timeZone: zone }).format(); }
  catch { throw new Error(`Invalid study timezone: ${zone}`); }
  return zone;
}
function todayISO(now = new Date(), timeZone = studyTimezone()) {
  const parts = new Intl.DateTimeFormat("en", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const get = type => parts.find(part => part.type === type).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}
function normalizeProgress(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw) || !validDate(raw.startDate) || !Array.isArray(raw.entries) ||
      raw.entries.some(entry => !entry || !validDate(entry.date) || typeof entry.problem !== "string")) throw new Error("Invalid progress format; original file has not been changed.");
  if (raw.version !== undefined && ![1, 2].includes(raw.version)) throw new Error("Unsupported progress version; original file has not been changed.");
  if (raw.version === 2 && !Array.isArray(raw.events)) throw new Error("Missing v2 events array; original file has not been changed.");
  const events = raw.events ?? [];
  if (!Array.isArray(events)) throw new Error("Invalid events array; original file has not been changed.");
  require('./planning').validatePlanningData(raw);
  return { ...raw, version: 2, studyTimezone: studyTimezone(raw.studyTimezone), events };
}
function loadProgress(root = repoRoot) {
  const file = path.join(root, ".progress", "log.json");
  if (!fs.existsSync(file)) return normalizeProgress({ startDate: todayISO(), entries: [] });
  let raw;
  try { raw = JSON.parse(fs.readFileSync(file, "utf8")); }
  catch (error) { throw new Error(`Cannot read progress JSON; original file has not been changed: ${error.message}`); }
  const result = normalizeProgress(raw);
  // Stored events are validated as well: corruption must never become empty history.
  const { validateStoredEvents } = require("./evidence");
  validateStoredEvents(result.events);
  return result;
}
function saveProgress(data, root = repoRoot) {
  return withProgressLock(root, () => {
    const current = loadProgress(root); // Refuse to overwrite malformed existing history.
    const normalized = normalizeProgress(data);
    require("./evidence").validateStoredEvents(normalized.events);
    if (!current.entries.every((entry, i) => JSON.stringify(entry) === JSON.stringify(normalized.entries[i])) || !current.events.every((event, i) => JSON.stringify(event) === JSON.stringify(normalized.events[i])) || !(current.weeklyReviews || []).every((review, i) => JSON.stringify(review) === JSON.stringify(normalized.weeklyReviews?.[i]))) throw new Error("Refusing to overwrite existing completion/attempt/review history");
    atomicWrite(path.join(root, ".progress", "log.json"), JSON.stringify(normalized, null, 2) + "\n");
  });
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
    atomicWrite(questionsPath, lines.join(eol));
  }
  return true;
}

// Streak over distinct study dates, with a one-day grace period.
// Completion and study events use the same local calendar date.
function computeStreak(dates, referenceDate = todayISO()) {
  const uniqueDays = [...new Set(dates)].filter(date => validDate(date) && date <= referenceDate).sort();
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
  const diffFromToday = Math.round((new Date(referenceDate) - new Date(last)) / dayMs);
  const current = diffFromToday <= 1 ? run : 0;

  return { current, longest, lastDate: last };
}

module.exports = {
  repoRoot,
  progressPath,
  questionsPath,
  todayISO,
  studyTimezone,
  validDate,
  normalizeProgress,
  loadProgress,
  saveProgress,
  parseQueue,
  parseChecklist,
  markDone,
  computeStreak,
};

#!/usr/bin/env node
// Local, interactive progress dashboard. Run: npm run dashboard
// Serves dashboard/index.html plus a small JSON API so you can read a
// problem, edit it, run its test, and mark it done — all from the browser.
// Every endpoint reuses the same checklist + progress log the terminal
// commands (today/done/progress) use, so there is only one source of truth.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync, exec } = require("node:child_process");
const {
  repoRoot,
  questionsPath,
  loadProgress,
  saveProgress,
  todayISO,
  parseQueue,
  parseChecklist,
  markDone,
  computeStreak,
} = require("./lib/progress");

const PORT = process.env.PORT ? Number(process.env.PORT) : 4173;
const DASHBOARD_DIR = path.join(repoRoot, "dashboard");

// Most checklist topic names match their folder name 1:1 once spaces become
// hyphens (e.g. "Two Pointers" -> "Two-Pointers"). "Strings" is the one
// exception — its folder is the singular "String".
const TOPIC_FOLDER_OVERRIDES = { Strings: "String" };
function topicFolder(name) {
  return TOPIC_FOLDER_OVERRIDES[name] || name.replace(/ /g, "-");
}
const FOLDER_TOPIC_OVERRIDES = { String: "Strings" };
function topicHeading(folder) {
  return FOLDER_TOPIC_OVERRIDES[folder] || folder.replace(/-/g, " ");
}

function leetcodeSearchUrl(title) {
  return `https://leetcode.com/search/?q=${encodeURIComponent(title)}`;
}

// Number of times a problem has been logged as solved (first solve + every
// later re-solve). Keyed the same way progress log entries are: "Folder/slug"
// with no extension.
function computeRepCounts(entries) {
  const counts = new Map();
  for (const e of entries) counts.set(e.problem, (counts.get(e.problem) || 0) + 1);
  return counts;
}

// Small, purpose-built markdown-to-HTML converter for the "## Pattern"
// section of our own topic READMEs (static, developer-authored content —
// not derived from anything editable through this API, so trusting it as
// HTML on the way to the browser is safe).
function renderMiniMarkdown(md) {
  const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const blocks = [];
  const withoutFences = md.replace(/```[a-z]*\n([\s\S]*?)```/g, (_, code) => {
    blocks.push(`<pre><code>${escapeHtml(code.trim())}</code></pre>`);
    return `@@BLOCK${blocks.length - 1}@@`;
  });

  let html = withoutFences
    .split(/\n\n+/)
    .map((para) => {
      const trimmed = para.trim();
      if (/^@@BLOCK\d+@@$/.test(trimmed)) return trimmed;
      let inner = escapeHtml(trimmed)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\n/g, "<br>");
      return `<p>${inner}</p>`;
    })
    .join("\n");

  blocks.forEach((block, i) => {
    html = html.replace(`@@BLOCK${i}@@`, block);
  });
  return html;
}

// Extracts the "## Pattern" ... "---" section from a topic's README.md.
function readTopicConcept(folder) {
  const readmePath = path.join(repoRoot, folder, "README.md");
  if (!fs.existsSync(readmePath)) return null;
  const text = fs.readFileSync(readmePath, "utf8").replace(/\r\n/g, "\n");
  const match = text.match(/## Pattern\n([\s\S]*?)\n---/);
  if (!match) return null;
  return renderMiniMarkdown(match[1].trim());
}

// Only accepts "Folder/sub/file.js"-shaped relative paths with no ".." —
// this guards the /api/file and /api/run-tests endpoints from writing or
// reading anything outside a real solution file.
function resolveSolutionPath(relPathArg) {
  if (typeof relPathArg !== "string" || !relPathArg) return null;
  const relPath = relPathArg.replace(/\\/g, "/");
  if (!/^[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*\.js$/.test(relPath)) return null;
  if (relPath.split("/").includes("..")) return null;
  const abs = path.join(repoRoot, relPath);
  if (!abs.startsWith(repoRoot + path.sep) && abs !== repoRoot) return null;
  return { relPath, abs };
}

function buildData() {
  const text = fs.readFileSync(questionsPath, "utf8");
  const lines = text.split(/\r?\n/);
  const problemsStart = lines.findIndex((l) => l.trim() === "## Problems");

  const progress = loadProgress();
  const repCounts = computeRepCounts(progress.entries);

  const topics = [];
  let currentTopic = null;
  lines.forEach((line, idx) => {
    if (idx < problemsStart) return;
    const heading = line.match(/^### (.+)$/);
    if (heading) {
      currentTopic = {
        name: heading[1],
        conceptHtml: readTopicConcept(topicFolder(heading[1])),
        items: [],
      };
      topics.push(currentTopic);
      return;
    }
    const item = line.match(/^- \[([ x])\] \[(.+?)\]\(\.\/(.+?\.js)\)/);
    if (item && currentTopic) {
      const hasTest = fs.existsSync(
        path.join(repoRoot, "tests", item[3].replace(/\.js$/, ".test.js"))
      );
      const relPathArg = item[3].replace(/\.js$/, "");
      currentTopic.items.push({
        checked: item[1] === "x",
        title: item[2],
        path: item[3],
        hasTest,
        leetcodeUrl: leetcodeSearchUrl(item[2]),
        repCount: repCounts.get(relPathArg) || 0,
      });
    }
  });

  const queue = parseQueue(text);
  const { map } = parseChecklist(text);

  let next = null;
  let firstUnsolvedChallenge = null;
  for (const q of queue) {
    const entry = map.get(q.relPath);
    if (entry && entry.checked) continue;
    if (q.challenge) {
      if (!firstUnsolvedChallenge) firstUnsolvedChallenge = q;
      continue;
    }
    next = q;
    break;
  }
  if (!next) next = firstUnsolvedChallenge;

  const dates = progress.entries.map((e) => e.date);
  const streak = computeStreak(dates);

  const totalCount = topics.reduce((sum, t) => sum + t.items.length, 0);
  const solvedCount = topics.reduce((sum, t) => sum + t.items.filter((i) => i.checked).length, 0);

  const daysSinceStart = Math.max(
    0,
    Math.round((new Date(todayISO()) - new Date(progress.startDate)) / 86400000)
  );
  const week = Math.floor(daysSinceStart / 7) + 1;
  const suggestedMinutes = week <= 2 ? 60 : week <= 4 ? 75 : week <= 8 ? 90 : 120;

  // Full study order: every problem in strict dependency-queue order,
  // spanning topics, so it can be reviewed as one flat list before starting.
  const flatQueue = queue.map((q) => {
    const entry = map.get(q.relPath);
    const folder = q.relPath.split("/")[0];
    return {
      title: q.title,
      relPath: q.relPath,
      topic: topicHeading(folder),
      challenge: q.challenge,
      checked: !!(entry && entry.checked),
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    totalCount,
    solvedCount,
    streak,
    week,
    suggestedMinutes,
    next,
    topics,
    flatQueue,
  };
}

// Picks a problem to review: among SOLVED problems, always from the group
// with the fewest recorded solves so far (ties broken randomly). This makes
// every solved problem reach N reps before any of them reaches N+1 — once
// everything has been solved twice, the next review naturally pushes toward
// a third pass, automatically, with no hardcoded target count.
function pickRandomReview() {
  const text = fs.readFileSync(questionsPath, "utf8");
  const { map } = parseChecklist(text);
  const progress = loadProgress();
  const repCounts = computeRepCounts(progress.entries);

  const solved = [...map.entries()].filter(([, v]) => v.checked);
  if (solved.length === 0) return null;

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
  return {
    relPath,
    title: entry.title,
    repCount: minRep,
    poolSize: candidates.length,
  };
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 2_000_000) req.destroy(); // 2MB guard, plenty for a solution file
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

// Runs a problem's test file (if one exists) via the existing CLI runner.
function runTest(relPath) {
  const relPathArg = relPath.replace(/\.js$/, "");
  const testAbs = path.join(repoRoot, "tests", `${relPathArg}.test.js`);
  if (!fs.existsSync(testAbs)) return { hasTest: false, pass: null, output: "" };
  const result = spawnSync(
    process.execPath,
    [path.join("scripts", "test-solution.js"), relPathArg],
    { cwd: repoRoot, encoding: "utf8" }
  );
  return {
    hasTest: true,
    pass: result.status === 0,
    output: `${result.stdout || ""}${result.stderr || ""}`,
  };
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  const [urlPath, query] = req.url.split("?");
  const params = new URLSearchParams(query || "");

  try {
    if (req.method === "GET" && urlPath === "/api/data") {
      return sendJson(res, 200, buildData());
    }

    if (req.method === "GET" && urlPath === "/api/random-review") {
      const pick = pickRandomReview();
      if (!pick) return sendJson(res, 200, { none: true });
      return sendJson(res, 200, pick);
    }

    if (req.method === "GET" && urlPath === "/api/file") {
      const solved = resolveSolutionPath(params.get("path"));
      if (!solved || !fs.existsSync(solved.abs)) return sendJson(res, 404, { error: "Not found" });
      const content = fs.readFileSync(solved.abs, "utf8");
      return sendJson(res, 200, { path: solved.relPath, content });
    }

    if (req.method === "PUT" && urlPath === "/api/file") {
      const body = await readJsonBody(req);
      const solved = resolveSolutionPath(body.path);
      if (!solved || !fs.existsSync(solved.abs)) return sendJson(res, 404, { error: "Not found" });
      if (typeof body.content !== "string") return sendJson(res, 400, { error: "Missing content" });
      fs.writeFileSync(solved.abs, body.content);
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === "POST" && urlPath === "/api/run-tests") {
      const body = await readJsonBody(req);
      const solved = resolveSolutionPath(body.path);
      if (!solved || !fs.existsSync(solved.abs)) return sendJson(res, 404, { error: "Not found" });
      return sendJson(res, 200, runTest(solved.relPath));
    }

    if (req.method === "POST" && urlPath === "/api/done") {
      const body = await readJsonBody(req);
      const solved = resolveSolutionPath(body.path);
      if (!solved || !fs.existsSync(solved.abs)) return sendJson(res, 404, { error: "Not found" });

      const testResult = runTest(solved.relPath);
      if (testResult.hasTest && !testResult.pass) {
        return sendJson(res, 200, { ok: false, reason: "tests_failed", output: testResult.output });
      }
      if (!testResult.hasTest && !body.confirmed) {
        return sendJson(res, 200, { ok: false, reason: "not_confirmed" });
      }

      const wasFound = markDone(solved.relPath);
      if (!wasFound) return sendJson(res, 200, { ok: false, reason: "not_in_checklist" });

      const progress = loadProgress();
      const today = todayISO();
      const relPathArg = solved.relPath.replace(/\.js$/, "");
      const alreadyLoggedToday = progress.entries.some(
        (e) => e.problem === relPathArg && e.date === today
      );
      if (!alreadyLoggedToday) progress.entries.push({ date: today, problem: relPathArg });
      saveProgress(progress);

      return sendJson(res, 200, { ok: true, output: testResult.output });
    }

    if (req.method !== "GET") {
      return sendJson(res, 405, { error: "Method not allowed" });
    }

    // Static file serving for everything else under dashboard/.
    const relStatic = urlPath === "/" ? "/index.html" : urlPath;
    const filePath = path.join(DASHBOARD_DIR, decodeURIComponent(relStatic));
    if (!filePath.startsWith(DASHBOARD_DIR)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(404);
        return res.end("Not found");
      }
      res.writeHead(200, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" });
      res.end(content);
    });
  } catch (err) {
    sendJson(res, 500, { error: String((err && err.message) || err) });
  }
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Dashboard running at ${url}`);
  console.log("Press Ctrl+C to stop.");
  const cmd =
    process.platform === "win32"
      ? `start "" "${url}"`
      : process.platform === "darwin"
      ? `open "${url}"`
      : `xdg-open "${url}"`;
  exec(cmd, () => {});
});

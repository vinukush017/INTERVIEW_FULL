#!/usr/bin/env node
// Local command center. Markdown/checklist/log remain canonical; no new store.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { repoRoot, loadProgress, parseQueue, parseChecklist } = require('./lib/progress');
const { parseTopics, repCounts } = require('./lib/study');
const { inside, renderMarkdown, documentPaths, loadEnglish, topicIndex } = require('./lib/content');
const { buildStudyState } = require('./lib/study-state');
const { itemRegistry } = require('./lib/items');
const { validateAttempt, existingSubmission, recordAttempt, completeProblem } = require('./lib/evidence');
const { initializePlanning, saveWeeklyReview } = require('./lib/planning');

function repository(root) {
  const text = fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8');
  const { map } = parseChecklist(text);
  const logFile = path.join(root, '.progress', 'log.json');
  const progress = loadProgress(root);
  return { text, map, progress, logFile };
}

function registeredSolution(root, relPath) {
  // Exact registry membership, not merely a .js suffix or a repository prefix.
  if (typeof relPath !== 'string' || !/^[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_.-]+)*\.js$/.test(relPath) || relPath.split('/').includes('..')) return null;
  if (!relPath.includes('/') || ['scripts', 'dashboard', 'tests'].includes(relPath.split('/')[0])) return null;
  if (!repository(root).map.has(relPath)) return null;
  const abs = path.join(root, relPath);
  if (!fs.existsSync(abs) || !fs.statSync(abs).isFile() || !inside(root, abs)) return null;
  // No symlinks in an editable path, even to another file within this repo.
  let part = root;
  for (const segment of relPath.split('/')) {
    part = path.join(part, segment);
    if (fs.lstatSync(part).isSymbolicLink()) return null;
  }
  return { relPath, abs };
}

function testPath(root, relPath) {
  const file = path.join(root, 'tests', relPath.replace(/\.js$/, '.test.js'));
  return fs.existsSync(file) && inside(root, file) ? file : null;
}

function buildData(root, now = new Date()) {
  const { text, map, progress } = repository(root);
  const allowed = documentPaths(root, map);
  const counts = repCounts(progress.entries);
  const evidence = buildStudyState(root, now); const registry = itemRegistry(root);
  const topics = parseTopics(text).map(topic => {
    const folder = topic.name === 'Strings' ? 'String' : topic.name.replace(/ /g, '-');
    const source = `${folder}/README.md`;
    const pattern = allowed.has(source) ? fs.readFileSync(path.join(root, source), 'utf8').replace(/\r\n/g, '\n').match(/## Pattern\n([\s\S]*?)\n---/) : null;
    return { ...topic, conceptHtml: pattern ? renderMarkdown(pattern[1], source, allowed, map) : null,
      items: topic.items.map(item => ({ ...item, ...registry.get(item.path), evidence: evidence.dsa.evidence[item.path], readiness: evidence.dsa.patterns.find(pattern => pattern.id === registry.get(item.path).patternId).state, hasTest: !!testPath(root, item.path), repCount: counts.get(item.path.replace(/\.js$/, '')) || 0,
        leetcodeUrl: `https://leetcode.com/search/?q=${encodeURIComponent(item.title)}` })) };
  });
  const queue = parseQueue(text);
  const next = evidence.today.main;
  return { generatedAt: new Date().toISOString(), phase: evidence.planning.state?.phaseId || null, learningWeek: evidence.planning.state?.learningWeek || null,
    totalCount: map.size, solvedCount: [...map.values()].filter(item => item.checked).length,
    streak: evidence.streak, startDate: progress.startDate, evidence,
    next,
    topics, recentActivity: evidence.recentActivity,
    flatQueue: queue.map(item => ({ ...item, role: registry.get(item.relPath).role, patternId: registry.get(item.relPath).patternId, checked: !!map.get(item.relPath)?.checked, topic: topics.find(topic => topic.items.some(problem => problem.path === item.relPath))?.name || item.relPath.split('/')[0] })) };
}

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = ''; let bytes = 0; let failed = false;
    req.on('data', chunk => {
      bytes += chunk.length;
      if (bytes > 2_000_000) { if (!failed) reject(Object.assign(new Error('Body exceeds 2 MB'), { status: 413 })); failed = true; return; }
      raw += chunk;
    });
    req.on('end', () => {
      if (failed) return;
      try { const parsed = JSON.parse(raw || '{}'); if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error(); resolve(parsed); }
      catch { reject(Object.assign(new Error('Invalid JSON object'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}

function runTest(root, relPath, timeout) {
  if (!testPath(root, relPath)) return Promise.resolve({ hasTest: false, pass: null, output: '' });
  const runner = path.join(root, 'scripts', 'test-solution.js');
  if (!inside(root, runner)) throw new Error('Test runner must remain inside the repository');
  return new Promise(resolve => execFile(process.execPath, [runner, relPath.replace(/\.js$/, '')],
    { cwd: root, timeout, killSignal: 'SIGKILL', maxBuffer: 1_000_000, encoding: 'utf8' }, (error, stdout, stderr) => {
      const timedOut = !!error?.killed;
      resolve({ hasTest: true, pass: !error, timedOut,
        output: `${stdout || ''}${stderr || ''}${timedOut ? '\nTest execution stopped (timeout/output limit).' : ''}` });
    }));
}

function createDashboardServer({ root = repoRoot, testTimeoutMs = 10_000, clock = () => new Date(), progressIO = fs } = {}) {
  const assets = new Set(['index.html', 'app.js', 'styles.css', 'js-core-data.js']);
  const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'");
    try {
      const port = server.address().port;
      const localHosts = [`127.0.0.1:${port}`, `localhost:${port}`];
      if (!localHosts.includes(req.headers.host)) return sendJson(res, 403, { error: 'Local host required' });
      if (req.headers.origin && !localHosts.some(host => req.headers.origin === `http://${host}`)) return sendJson(res, 403, { error: 'Cross-origin request rejected' });
      const url = new URL(req.url, `http://127.0.0.1:${port}`);
      if (req.method === 'GET' && url.pathname === '/favicon.ico') { res.writeHead(204); return res.end(); }
      if (req.method === 'GET' && url.pathname === '/api/data') return sendJson(res, 200, buildData(root, clock()));
      if (req.method === 'GET' && ['/api/planning', '/api/weekly-review'].includes(url.pathname)) return sendJson(res, 200, buildStudyState(root, clock()).planning);
      if (req.method === 'POST' && ['/api/planning', '/api/weekly-reviews'].includes(url.pathname)) {
        if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return sendJson(res, 415, { error: 'JSON content type required' });
        const body = await readJson(req);
        const saved = url.pathname === '/api/planning' ? initializePlanning(root, body, { now: clock(), io: progressIO }) : saveWeeklyReview(root, body, { now: clock(), io: progressIO });
        return sendJson(res, 201, { ok: true, saved });
      }
      if (req.method === 'GET' && url.pathname === '/api/random-review') {
        const { map, progress } = repository(root);
        const evidence = buildStudyState(root, clock());
        const due = evidence.review.due[0];
        if (due) return sendJson(res, 200, { ...due, relPath: due.problem, label: 'Due revision', history: progress.events.filter(event => event.itemId === due.itemId) });
        const pick = evidence.review.baseline;
        return sendJson(res, 200, pick ? { ...pick, label: 'Optional baseline retrieval (evidence unknown)', history: progress.entries.filter(entry => entry.problem === pick.relPath.replace(/\.js$/, '')) } : { none: true });
      }
      if (req.method === 'GET' && ['/api/progress', '/api/review', '/api/today'].includes(url.pathname)) {
        const evidence = buildStudyState(root, clock());
        return sendJson(res, 200, url.pathname === '/api/review' ? evidence.review : url.pathname === '/api/today' ? evidence.today : evidence);
      }
      if (req.method === 'POST' && url.pathname === '/api/attempts') {
        if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return sendJson(res, 415, { error: 'JSON content type required' });
        const body = await readJson(req);
        if (body.confirmed !== undefined && typeof body.confirmed !== 'boolean') return sendJson(res, 400, { error: 'Confirmation must be boolean' });
        const { confirmed, ...input } = body;
        const values = validateAttempt(input, itemRegistry(root));
        // Retrying a lost acknowledgement returns the saved evidence, even if the
        // working file has since changed. It cannot manufacture a second attempt.
        const existing = existingSubmission(loadProgress(root), values);
        if (existing) return sendJson(res, 200, { ok: true, event: existing });
        let verification = 'unknown';
        if (values.track === 'dsa') {
          if (!registeredSolution(root, values.itemId)) return sendJson(res, 400, { error: 'Practice file unsafe or missing' });
          if (['independent', 'hinted'].includes(values.outcome)) {
            const tested = await runTest(root, values.itemId, testTimeoutMs);
            if (tested.hasTest && !tested.pass) return sendJson(res, 409, { error: 'Tests failed. Record a failed/studied attempt or fix the solution first.', output: tested.output });
            if (!tested.hasTest && confirmed !== true) return sendJson(res, 409, { error: 'Self-certify the working solution before recording independent/hinted success.' });
            verification = tested.hasTest ? 'tests_passed' : 'self_certified';
          }
        }
        const event = recordAttempt(root, values, { now: clock(), verification, io: progressIO });
        return sendJson(res, 201, { ok: true, event });
      }
      if (req.method === 'GET' && ['/api/english', '/api/topics', '/api/content'].includes(url.pathname)) {
        const { map } = repository(root); const allowed = documentPaths(root, map);
        if (url.pathname === '/api/english') return sendJson(res, 200, loadEnglish(root, allowed, map));
        if (url.pathname === '/api/topics') { const registry = itemRegistry(root); return sendJson(res, 200, topicIndex(root, allowed).map(topic => ({ ...topic, practice: registry.get(`topic:${topic.path}`) }))); }
        const file = url.searchParams.get('path');
        if (!allowed.has(file)) return sendJson(res, 404, { error: 'Document not registered' });
        const markdown = fs.readFileSync(path.join(root, file), 'utf8');
        if (url.searchParams.get('format') === 'raw') { res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end(markdown); }
        return sendJson(res, 200, { path: file, html: renderMarkdown(markdown, file, allowed, map) });
      }
      if (req.method === 'GET' && url.pathname === '/api/file') {
        const solution = registeredSolution(root, url.searchParams.get('path'));
        if (!solution) return sendJson(res, 404, { error: 'Practice file not registered or unsafe' });
        return sendJson(res, 200, { path: solution.relPath, content: fs.readFileSync(solution.abs, 'utf8') });
      }
      if (['PUT', 'POST'].includes(req.method) && ['/api/file', '/api/run-tests', '/api/done'].includes(url.pathname)) {
        if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) return sendJson(res, 415, { error: 'JSON content type required' });
        const body = await readJson(req);
        const solution = registeredSolution(root, body.path);
        if (!solution) return sendJson(res, 404, { error: 'Practice file not registered or unsafe' });
        if (req.method === 'PUT' && url.pathname === '/api/file') {
          if (typeof body.content !== 'string') return sendJson(res, 400, { error: 'Missing content' });
          fs.writeFileSync(solution.abs, body.content);
          return sendJson(res, 200, { ok: true });
        }
        if (req.method !== 'POST' || url.pathname === '/api/file') return sendJson(res, 405, { error: 'Method not allowed' });
        const result = await runTest(root, solution.relPath, testTimeoutMs);
        if (url.pathname === '/api/run-tests') return sendJson(res, 200, result);
        if (result.hasTest && !result.pass) return sendJson(res, 200, { ok: false, reason: 'tests_failed', output: result.output });
        if (!result.hasTest && body.confirmed !== true) return sendJson(res, 200, { ok: false, reason: 'not_confirmed' });
        if (!registeredSolution(root, solution.relPath)) return sendJson(res, 404, { error: 'Practice file changed during testing' });
        completeProblem(root, solution.relPath, { eventId: body.eventId, now: clock(), io: progressIO });
        return sendJson(res, 200, { ok: true, output: result.output });
      }
      if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
      const asset = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      const file = path.join(root, 'dashboard', asset);
      if (!assets.has(asset) || !fs.existsSync(file) || !inside(path.join(root, 'dashboard'), file)) return sendJson(res, 404, { error: 'Not found' });
      res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' }[path.extname(file)] + '; charset=utf-8' });
      res.end(fs.readFileSync(file));
    } catch (error) { sendJson(res, error.status || 500, { error: error.message, ...(error.needsConfirmation ? { needsConfirmation: true, warnings: error.warnings } : {}) }); }
  });
  return server;
}

if (require.main === module) {
  const server = createDashboardServer();
  server.on('error', error => { console.error(`Dashboard could not start: ${error.message}`); process.exitCode = 1; });
  server.listen(Number(process.env.PORT || 4173), '127.0.0.1', () => {
    const url = `http://127.0.0.1:${server.address().port}`;
    console.log(`Dashboard running at ${url}\nPress Ctrl+C to stop.`);
    if (process.env.DASHBOARD_NO_OPEN !== '1') {
      const command = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'cmd' : 'xdg-open';
      const args = process.platform === 'win32' ? ['/c', 'start', '', url] : [url];
      execFile(command, args, error => { if (error) console.log(`Open ${url} in your browser.`); });
    }
  });
}
module.exports = { createDashboardServer, buildData, registeredSolution, runTest };

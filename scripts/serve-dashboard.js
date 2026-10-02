#!/usr/bin/env node
// Local command center. Markdown/checklist/log remain canonical; no new store.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { execFile } = require('node:child_process');
const { repoRoot, todayISO, parseQueue, parseChecklist, computeStreak } = require('./lib/progress');
const { selectNext, selectReview, parseTopics, repCounts } = require('./lib/study');
const { inside, renderMarkdown, documentPaths, loadEnglish, topicIndex } = require('./lib/content');

function repository(root) {
  const text = fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8');
  const { map } = parseChecklist(text);
  const logFile = path.join(root, '.progress', 'log.json');
  const progress = fs.existsSync(logFile) ? JSON.parse(fs.readFileSync(logFile, 'utf8')) : { startDate: todayISO(), entries: [] };
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

function buildData(root) {
  const { text, map, progress } = repository(root);
  const allowed = documentPaths(root, map);
  const counts = repCounts(progress.entries);
  const topics = parseTopics(text).map(topic => {
    const folder = topic.name === 'Strings' ? 'String' : topic.name.replace(/ /g, '-');
    const source = `${folder}/README.md`;
    const pattern = allowed.has(source) ? fs.readFileSync(path.join(root, source), 'utf8').replace(/\r\n/g, '\n').match(/## Pattern\n([\s\S]*?)\n---/) : null;
    return { ...topic, conceptHtml: pattern ? renderMarkdown(pattern[1], source, allowed, map) : null,
      items: topic.items.map(item => ({ ...item, hasTest: !!testPath(root, item.path), repCount: counts.get(item.path.replace(/\.js$/, '')) || 0,
        leetcodeUrl: `https://leetcode.com/search/?q=${encodeURIComponent(item.title)}` })) };
  });
  const queue = parseQueue(text);
  const next = selectNext(queue, map);
  return { generatedAt: new Date().toISOString(), phase: null, learningWeek: null,
    totalCount: map.size, solvedCount: [...map.values()].filter(item => item.checked).length,
    streak: computeStreak(progress.entries.map(entry => entry.date)), startDate: progress.startDate,
    next: next ? { ...next, checked: !!map.get(next.relPath)?.checked, topic: topics.find(topic => topic.items.some(item => item.path === next.relPath))?.name || next.relPath.split('/')[0] } : null,
    topics, recentActivity: progress.entries.slice(-20).reverse(),
    flatQueue: queue.map(item => ({ ...item, checked: !!map.get(item.relPath)?.checked, topic: topics.find(topic => topic.items.some(problem => problem.path === item.relPath))?.name || item.relPath.split('/')[0] })) };
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

function complete(root, relPath) {
  // Re-read after testing. Keep the legacy shape and same-day deduplication.
  const { text, map, progress, logFile } = repository(root);
  const item = map.get(relPath);
  if (!item) throw new Error('Problem no longer registered');
  const originalLog = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : null;
  const lines = text.split(/\r?\n/); const eol = text.includes('\r\n') ? '\r\n' : '\n';
  lines[item.line] = lines[item.line].replace('- [ ]', '- [x]');
  const problem = relPath.replace(/\.js$/, ''); const date = todayISO();
  if (!progress.entries.some(entry => entry.problem === problem && entry.date === date)) progress.entries.push({ date, problem });
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  try {
    fs.writeFileSync(logFile, JSON.stringify(progress, null, 2) + '\n');
    fs.writeFileSync(path.join(root, '01-DSA-Questions.md'), lines.join(eol));
  } catch (error) {
    // Best effort rollback of the first write; never report successful completion.
    try { if (originalLog === null) fs.unlinkSync(logFile); else fs.writeFileSync(logFile, originalLog); } catch { /* Original error remains visible. */ }
    throw error;
  }
}

function createDashboardServer({ root = repoRoot, testTimeoutMs = 10_000 } = {}) {
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
      if (req.method === 'GET' && url.pathname === '/api/data') return sendJson(res, 200, buildData(root));
      if (req.method === 'GET' && url.pathname === '/api/random-review') {
        const { map, progress } = repository(root);
        const pick = selectReview(map, progress.entries);
        return sendJson(res, 200, pick ? { ...pick, history: progress.entries.filter(entry => entry.problem === pick.relPath.replace(/\.js$/, '')) } : { none: true });
      }
      if (req.method === 'GET' && ['/api/english', '/api/topics', '/api/content'].includes(url.pathname)) {
        const { map } = repository(root); const allowed = documentPaths(root, map);
        if (url.pathname === '/api/english') return sendJson(res, 200, loadEnglish(root, allowed, map));
        if (url.pathname === '/api/topics') return sendJson(res, 200, topicIndex(root, allowed));
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
        complete(root, solution.relPath);
        return sendJson(res, 200, { ok: true, output: result.output });
      }
      if (req.method !== 'GET') return sendJson(res, 405, { error: 'Method not allowed' });
      const asset = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      const file = path.join(root, 'dashboard', asset);
      if (!assets.has(asset) || !fs.existsSync(file) || !inside(path.join(root, 'dashboard'), file)) return sendJson(res, 404, { error: 'Not found' });
      res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' }[path.extname(file)] + '; charset=utf-8' });
      res.end(fs.readFileSync(file));
    } catch (error) { sendJson(res, error.status || 500, { error: error.message }); }
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
module.exports = { createDashboardServer, buildData, registeredSolution };

// Static role/pattern metadata is canonical here; prompts and solutions stay in JS files.
const fs = require('node:fs');
const path = require('node:path');
const ROLES = ['CORE', 'SUPPORTING', 'TRANSFER', 'OPTIONAL'];
const cache = new Map();
function validateCatalog(catalog) {
  if (catalog?.version !== 1 || !Array.isArray(catalog.patterns) || !Array.isArray(catalog.problems)) throw new Error('Invalid DSA catalog version/shape');
  const patterns = new Map(); const problems = new Map();
  for (const pattern of catalog.patterns) {
    if (!/^[a-z][a-z0-9-]+$/.test(pattern.id) || patterns.has(pattern.id) || typeof pattern.name !== 'string' || !pattern.name ||
        !/^[A-Za-z0-9-]+\/README\.md$/.test(pattern.source) || !['phase-1','phase-2'].includes(pattern.defaultPhase) ||
        !Number.isInteger(pattern.minIndependentCore) || pattern.minIndependentCore < 1 || pattern.minIndependentCore > 4 || typeof pattern.cue !== 'string') throw new Error('Invalid/duplicate DSA pattern');
    patterns.set(pattern.id, pattern);
  }
  for (const item of catalog.problems) {
    if (!/^[A-Za-z0-9-]+\/[a-z0-9-]+\.js$/.test(item.path) || ['scripts','tests','dashboard'].includes(item.path.split('/')[0]) || problems.has(item.path) ||
        !patterns.has(item.pattern) || !ROLES.includes(item.role) || typeof item.title !== 'string' || !item.title || item.difficulty !== 'unknown') throw new Error('Invalid/duplicate DSA problem classification');
    if (item.role === 'TRANSFER' ? item.transferFor !== item.pattern : item.transferFor != null) throw new Error('Invalid transfer pattern reference');
    problems.set(item.path, item);
  }
  for (const pattern of patterns.values()) {
    const members = [...problems.values()].filter(item => item.pattern === pattern.id);
    if (!members.length || members.some(item => item.role === 'TRANSFER') && !members.some(item => item.role === 'CORE')) throw new Error('Transfer pattern requires a core representative');
    if (members.some(item => item.role === 'CORE') && members.filter(item => item.role === 'CORE').length < pattern.minIndependentCore) throw new Error('Pattern gate exceeds its core set');
  }
  return { ...catalog, byPath: problems, byPattern: patterns };
}
function loadCatalog(root) {
  const file = path.join(root, 'data/dsa-catalog.json'); const stat = fs.statSync(file);
  const signature = `${stat.mtimeMs}:${stat.ctimeMs}:${stat.size}`;
  if (cache.get(root)?.signature === signature) return cache.get(root).catalog;
  const catalog = validateCatalog(JSON.parse(fs.readFileSync(file, 'utf8')));
  cache.set(root, { signature, catalog }); return catalog;
}
// Explicit consistency check; avoid scanning solution files on each browser action.
function validateLibrary(root, catalog = loadCatalog(root)) {
  const { parseChecklist, parseQueue } = require('./progress');
  const text = fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8'); const checklist = parseChecklist(text).map; const queue = parseQueue(text);
  const paths = new Set(catalog.problems.map(item => item.path)); const queuePaths = new Set(queue.map(item => item.relPath));
  const checklistCount = text.slice(text.indexOf('## Problems')).split(/\r?\n/).filter(line => /^- \[[ x]\] \[.+?\]\(\.\/.+?\.js\)/.test(line)).length;
  if (checklistCount !== checklist.size || queuePaths.size !== queue.length || paths.size !== checklist.size || paths.size !== queuePaths.size || [...paths].some(file => !checklist.has(file) || !queuePaths.has(file))) throw new Error('Catalog, queue and checklist must register the same unique paths');
  const folders = new Set([...paths].map(file => file.split('/')[0])); const library = [];
  for (const folder of folders) for (const file of fs.readdirSync(path.join(root, folder))) if (file.endsWith('.js')) library.push(`${folder}/${file}`);
  if (library.length !== paths.size || library.some(file => !paths.has(file))) throw new Error('Unregistered/missing library file');
  for (const file of paths) if (!fs.statSync(path.join(root, file)).isFile() || fs.lstatSync(path.join(root, file)).isSymbolicLink()) throw new Error('Unsafe catalog path');
  for (const pattern of catalog.patterns) if (!fs.existsSync(path.join(root, pattern.source))) throw new Error('Missing pattern reference');
  return { total: paths.size, roles: Object.fromEntries(ROLES.map(role => [role, catalog.problems.filter(item => item.role === role).length])), folders: Object.fromEntries([...folders].map(folder => [folder, library.filter(file => file.startsWith(folder + '/')).length])) };
}
module.exports = { ROLES, loadCatalog, validateCatalog, validateLibrary };

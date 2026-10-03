import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import catalogLib from './lib/dsa-catalog.js';
import atomicLib from './lib/atomic.js';
const { loadCatalog, validateCatalog, validateLibrary, ROLES } = catalogLib;
const { atomicWrite, withProgressLock } = atomicLib;

// An explicit pattern avoids guessing the algorithm from a display title.
export function addProblem({ root = process.cwd(), folder, title, pattern, role = 'SUPPORTING', io = fs }) {
  if (!/^[A-Za-z0-9-]+$/.test(folder || '') || ['scripts','tests','dashboard','data'].includes(folder) || typeof title !== 'string' || !title.trim() || title.length > 120 || /[\r\n\[\]()*\u0000-\u001f]/.test(title)) throw new Error('Use a registered practice folder and a short plain title');
  if (!ROLES.includes(role)) throw new Error('Invalid role; default is SUPPORTING');
  return withProgressLock(root, () => {
    const catalog = loadCatalog(root); validateLibrary(root, catalog);
    if (!catalog.byPattern.has(pattern)) throw new Error('Choose an existing pattern with --pattern <id>');
    if (!catalog.problems.some(item => item.path.startsWith(folder + '/'))) throw new Error('Folder must already be registered; curate new pattern folders explicitly');
    title = title.trim();
    const slug = title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) throw new Error('Title needs letters/numbers');
    const itemPath = `${folder}/${slug}.js`;
    if (catalog.byPath.has(itemPath) || fs.existsSync(path.join(root, itemPath))) throw new Error('Problem path already exists; no file was overwritten');
    const files = ['01-DSA-Questions.md', `${folder}/README.md`, 'data/dsa-catalog.json'];
    for (const file of [...files, folder]) if (fs.lstatSync(path.join(root, file)).isSymbolicLink()) throw new Error('Registration cannot write through symlinks');
    const originals = new Map(files.map(file => [file, fs.readFileSync(path.join(root, file), 'utf8')]));
    const nextCatalog = { version: catalog.version, patterns: catalog.patterns, problems: [...catalog.problems, { path: itemPath, title, pattern, role, difficulty: 'unknown', ...(role === 'TRANSFER' ? { transferFor: pattern } : {}), notes: 'Manual registration; fill the spoiler-free prompt and curate learning value before treating this as evidence.' }] };
    validateCatalog(nextCatalog);
    let master = originals.get('01-DSA-Questions.md');
    const queueHeading = '### Manual registered additions'; const problemHeading = '\n## Problems\n';
    const pos = master.indexOf(problemHeading); if (pos < 0) throw new Error('Missing canonical checklist boundary');
    const queue = master.slice(0, pos); master = queue + (queue.includes(queueHeading) ? '' : '\n' + queueHeading + '\n\n') + `1. [${title}](./${itemPath})\n` + master.slice(pos);
    // Use the actual folder's existing heading; no orphan or last-topic attribution.
    const headings = [...master.matchAll(/^### (.+)$/gm)].filter(match => match.index > master.indexOf(problemHeading));
    const topic = headings.find((match, index) => master.slice(match.index, headings[index + 1]?.index).includes(`](./${folder}/`));
    if (!topic) throw new Error('Missing registered checklist topic');
    const index = headings.indexOf(topic); const end = headings[index + 1]?.index ?? master.length;
    master = master.slice(0, end).trimEnd() + `\n- [ ] [${title}](./${itemPath})\n\n` + master.slice(end);
    const solution = `/**\n * Problem: ${title}\n * Topic: ${folder}\n * Description: Add the spoiler-free prompt, examples and input contract before practice.\n * Do not record success for this unimplemented scaffold.\n */\nfunction solve(...args) {\n  throw new Error("Practice not implemented yet");\n}\n/*\n * Approach:\n * Time complexity:\n * Space complexity:\n * Mistake or insight:\n */\nmodule.exports = solve;\n`;
    const updates = new Map([[itemPath, solution], ['01-DSA-Questions.md', master], [`${folder}/README.md`, originals.get(`${folder}/README.md`).trimEnd() + `\n\n- [${title}](./${slug}.js)\n`], ['data/dsa-catalog.json', JSON.stringify(nextCatalog, null, 2) + '\n']]);
    const written = [];
    try {
      for (const [file, content] of updates) { atomicWrite(path.join(root, file), content, io); written.push(file); }
      validateLibrary(root);
    } catch (error) {
      // Roll back only files this operation wrote. Never touch progress/evidence.
      for (const file of written.reverse()) {
        if (originals.has(file)) atomicWrite(path.join(root, file), originals.get(file));
        else fs.unlinkSync(path.join(root, file));
      }
      throw error;
    }
    return { path: itemPath, role, pattern };
  });
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2); const folder = args.shift(); const titleParts = []; let pattern, role;
    while (args.length) { const arg = args.shift(); if (arg === '--pattern') pattern = args.shift(); else if (arg === '--role') role = args.shift(); else if (arg.startsWith('--')) throw new Error('Unknown option'); else titleParts.push(arg); }
    const result = addProblem({ folder, title: titleParts.join(' '), pattern, role });
    console.log(`Created and registered ${result.path}: ${result.role}, ${result.pattern}`);
  } catch (error) { console.error(`${error.message}\nUsage: npm run add -- <Folder> "Problem Name" --pattern <pattern-id> [--role SUPPORTING]`); process.exitCode = 1; }
}

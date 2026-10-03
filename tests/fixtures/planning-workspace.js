const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { repoRoot, parseChecklist } = require('../../scripts/lib/progress');
const { documentPaths } = require('../../scripts/lib/content');
function workspace() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'interview-planning-'));
  const checklist = fs.readFileSync(path.join(repoRoot, '01-DSA-Questions.md'), 'utf8');
  const map = parseChecklist(checklist).map;
  const files = new Set([...map.keys(), ...documentPaths(repoRoot, map), '01-DSA-Questions.md',
    'dashboard/js-core-data.js', 'dashboard/app.js', 'dashboard/index.html', 'dashboard/styles.css',
    'tests/HashMap/two-sum.test.js']);
  for (const file of files) { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.copyFileSync(path.join(repoRoot, file), path.join(root, file)); }
  fs.cpSync(path.join(repoRoot, 'scripts'), path.join(root, 'scripts'), { recursive: true });
  fs.mkdirSync(path.join(root, '.progress'), { recursive: true });
  fs.copyFileSync(path.join(__dirname, 'legacy-progress.json'), path.join(root, '.progress/log.json'));
  return root;
}
module.exports = { workspace };

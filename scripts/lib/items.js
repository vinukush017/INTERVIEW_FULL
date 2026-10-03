const fs = require('node:fs');
const path = require('node:path');
const { parseChecklist, parseQueue } = require('./progress');
const { parseTopics } = require('./study');
const { documentPaths, topicIndex } = require('./content');
const { loadCatalog } = require('./dsa-catalog');

function itemRegistry(root) {
  const text = fs.readFileSync(path.join(root, '01-DSA-Questions.md'), 'utf8');
  const { map } = parseChecklist(text); const queue = parseQueue(text); const topics = parseTopics(text);
  const items = new Map(); const catalog = loadCatalog(root);
  if (catalog.problems.length !== map.size || catalog.problems.some(item => !map.has(item.path))) throw new Error("Catalog/checklist registration mismatch");
  for (const [file, entry] of map) {
    if (!file.includes('/') || ['scripts', 'dashboard', 'tests'].includes(file.split('/')[0])) continue;
    const metadata = catalog.byPath.get(file); const definition = catalog.byPattern.get(metadata.pattern);
    items.set(file, { itemId: file, title: entry.title, topic: topics.find(topic => topic.items.some(item => item.path === file))?.name || file.split('/')[0],
      kind: 'dsa', problem: file, role: metadata.role, patternId: metadata.pattern, pattern: definition.name, patternDefinition: definition, difficulty: metadata.difficulty, priority: metadata.role === 'CORE' ? 'core' : metadata.role.toLowerCase(),
      question: `Explain ${entry.title}: clarify, compare brute force, recognize the pattern, justify the invariant/data structure, walk through an example, state time/space, and test edge cases aloud.${metadata.role === "TRANSFER" ? " What clue made you recognize this pattern?" : ""}` });
  }
  const data = require(path.join(root, 'dashboard', 'js-core-data.js'));
  for (const [group, category] of [[data.FUNCTION_FORMS, 'Function forms'], [data.ASYNC_TIMER_FORMS, 'Timers & async patterns'], [data.THEORY_CARDS, null]]) {
    for (const card of group) {
      if (!card.id || items.has(card.id)) throw new Error('Missing or duplicate JS Core question ID');
      items.set(card.id, { itemId: card.id, title: card.q || card.title, question: card.q || `Explain ${card.title}.`, topic: category || card.category, kind: 'js_core', priority: 'core' });
    }
  }
  const prompts = { '07-SQL.md': 'Why can an index improve reads but make writes more expensive?', '03-React.md': 'Why might React.memo fail to prevent a rerender?', '05-NodeJS.md': 'What happens when an HTTP request reaches an Express API?', '08-System-Design.md': 'Explain one architecture decision, an alternative, and its tradeoff.' };
  for (const topic of topicIndex(root, documentPaths(root, map))) {
    const itemId = `topic:${topic.path}`;
    items.set(itemId, { itemId, title: topic.name, question: prompts[topic.path] || `Explain one concept from today's ${topic.name} task with an example and tradeoff.`, topic: topic.name, document: topic.path, kind: 'topic', priority: 'core' });
  }
  return items;
}
module.exports = { itemRegistry };

// Shared selectors: retain the existing queue and least-recorded-solves policy.
function selectNext(queue, checklist) {
  const unchecked = queue.filter(item => !checklist.get(item.relPath)?.checked);
  return unchecked.find(item => !item.challenge) || unchecked[0] || null;
}

function repCounts(entries) {
  const counts = new Map();
  for (const entry of entries) counts.set(entry.problem, (counts.get(entry.problem) || 0) + 1);
  return counts;
}

function reviewCandidates(checklist, entries) {
  const counts = repCounts(entries);
  const solved = [...checklist].filter(([, item]) => item.checked).map(([relPath, item]) => ({
    relPath, title: item.title, repCount: counts.get(relPath.replace(/\.js$/, "")) || 0,
  }));
  const min = Math.min(...solved.map(item => item.repCount));
  return solved.filter(item => item.repCount === min);
}

function selectReview(checklist, entries, random = Math.random) {
  const candidates = reviewCandidates(checklist, entries);
  if (!candidates.length) return null;
  return { ...candidates[Math.floor(random() * candidates.length)], poolSize: candidates.length };
}

function parseTopics(text) {
  const topics = [];
  let active = false;
  let topic;
  for (const line of text.split(/\r?\n/)) {
    if (line.trim() === "## Problems") { active = true; continue; }
    if (!active) continue;
    const heading = line.match(/^### (.+)$/);
    if (heading) { topic = { name: heading[1], items: [] }; topics.push(topic); continue; }
    const item = line.match(/^- \[([ x])\] \[(.+?)\]\(\.\/(.+?\.js)\)/);
    if (item && topic) topic.items.push({ checked: item[1] === "x", title: item[2], path: item[3] });
  }
  return topics;
}

module.exports = { selectNext, repCounts, reviewCandidates, selectReview, parseTopics };

const fs = require('node:fs');
const path = require('node:path');

const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const slug = value => value.toLowerCase().replace(/[^\p{L}\p{N} _-]/gu, '').trim().replace(/\s+/g, '-');
const GUIDES = [
  ['JavaScript', '02-JavaScript.md'], ['React', '03-React.md'], ['Next.js', '04-NextJS.md'],
  ['Node.js', '05-NodeJS.md'], ['Express', '06-Express.md'], ['SQL', '07-SQL.md'],
  ['System Design', '08-System-Design.md'], ['HR', '09-HR-Interview.md'],
  ['Projects', '10-Projects.md'], ['Resume', '11-Resume-Notes.md'], ['Behavioral', '12-Behavioral.md'],
];

function inside(root, file) {
  const relative = path.relative(fs.realpathSync(root), fs.realpathSync(file));
  return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

function documentPaths(root, checklist) {
  const result = new Set(['README.md', 'TODAY.md', '00-Roadmap.md', '01-DSA-Questions.md',
    '13-Daily-Study-Plan.md', '14-Job-Search-and-Negotiation.md', 'Mock-Interviews/README.md',
    'english/README.md', 'english/TECHNICAL_PHRASES.md', 'english/INTERVIEW_ANSWER_BANK.md',
    ...GUIDES.map(([, file]) => file)]);
  const jsFolder = path.join(root, 'JavaScript');
  if (fs.existsSync(jsFolder)) for (const name of fs.readdirSync(jsFolder)) {
    if (name.endsWith('.md')) result.add(`JavaScript/${name}`);
  }
  for (const file of checklist.keys()) result.add(`${path.posix.dirname(file)}/README.md`);
  return new Set([...result].filter(file => fs.existsSync(path.join(root, file)) && inside(root, path.join(root, file))));
}

// Deliberately small Markdown subset: headings, lists, tables, fenced code,
// emphasis and links. Raw HTML is escaped; local links are allowlisted.
function renderMarkdown(markdown, source, allowed, problems = new Set()) {
  function inline(text) {
    const tokens = [];
    const token = html => { tokens.push(html); return `\u0000${tokens.length - 1}\u0000`; };
    text = text.replace(/`([^`]+)`/g, (_, code) => token(`<code>${escapeHtml(code)}</code>`));
    text = text.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_, label, href) => {
      const escapedLabel = escapeHtml(label);
      if (/^https?:\/\//i.test(href)) return token(`<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapedLabel}</a>`);
      const [file, fragment] = href.split('#');
      let decoded;
      try { decoded = decodeURIComponent(file); } catch { return escapedLabel; }
      const target = file ? path.posix.normalize(path.posix.join(path.posix.dirname(source), decoded)) : source;
      if (allowed.has(target)) return token(`<a href="/?doc=${encodeURIComponent(target)}${fragment ? '#' + encodeURIComponent(fragment) : ''}" data-document="${escapeHtml(target)}" data-anchor="${escapeHtml(fragment || '')}">${escapedLabel}</a>`);
      if (problems.has(target)) return token(`<a href="/?problem=${encodeURIComponent(target)}" data-problem="${escapeHtml(target)}">${escapedLabel}</a>`);
      return escapedLabel;
    });
    return escapeHtml(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\u0000(\d+)\u0000/g, (_, i) => tokens[Number(i)]);
  }
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const output = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (line.startsWith('```')) {
      const code = [];
      while (++i < lines.length && !lines[i].startsWith('```')) code.push(lines[i]);
      output.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`); continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) { const n = heading[1].length; output.push(`<h${n} id="${escapeHtml(slug(heading[2]))}">${inline(heading[2])}</h${n}>`); continue; }
    if (/^\s*---+\s*$/.test(line)) { output.push('<hr>'); continue; }
    if (line.trim().startsWith('|') && /^\s*\|?\s*:?-+/.test(lines[i + 1] || '')) {
      const cells = row => row.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
      output.push('<div class="table-scroll"><table><thead><tr>' + cells(line).map(cell => `<th>${inline(cell)}</th>`).join('') + '</tr></thead><tbody>');
      i++;
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('|')) output.push('<tr>' + cells(lines[++i]).map(cell => `<td>${inline(cell)}</td>`).join('') + '</tr>');
      output.push('</tbody></table></div>'); continue;
    }
    const list = line.match(/^\s*(?:([-*])\s+|\d+\.\s+)(.*)$/);
    if (list) {
      const ordered = !list[1]; const tag = ordered ? 'ol' : 'ul'; output.push(`<${tag}>`);
      do {
        const content = lines[i].replace(/^\s*(?:[-*]|\d+\.)\s+/, '').replace(/^\[([ x])\]\s+/, (_, checked) => checked === 'x' ? '☑ ' : '☐ ');
        output.push(`<li>${inline(content)}</li>`);
        if (!/^\s*(?:[-*]\s+|\d+\.\s+)/.test(lines[i + 1] || '')) break;
        i++;
      } while (i < lines.length);
      output.push(`</${tag}>`); continue;
    }
    const para = [line];
    while (i + 1 < lines.length && lines[i + 1].trim() && !/^(?:#|```|\s*[-*]\s|\s*\d+\.\s|\s*\|)/.test(lines[i + 1])) para.push(lines[++i]);
    output.push(`<p>${inline(para.join(' '))}</p>`);
  }
  return output.join('\n');
}

function sections(markdown, level) {
  const re = new RegExp(`^${'#'.repeat(level)} (.+)$`, 'gm');
  const matches = [...markdown.matchAll(re)];
  return matches.map((match, i) => ({ title: match[1], body: markdown.slice(match.index + match[0].length, matches[i + 1]?.index ?? markdown.length).trim() }));
}

function loadEnglish(root, allowed, problems) {
  const source = 'english/README.md';
  const read = file => {
    if (!allowed.has(file)) throw new Error(`Missing canonical content: ${file}`);
    return fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n');
  };
  const guide = sections(read(source), 2);
  const frameworkSection = guide.find(section => section.title === 'Explanation frameworks');
  if (!frameworkSection) throw new Error('English explanation frameworks section is missing');
  return {
    frameworks: sections(frameworkSection.body, 3).map(section => ({ title: section.title, html: renderMarkdown(section.body, source, allowed, problems) })),
    loopHtml: renderMarkdown(guide.find(section => section.title === 'Daily 15-minute speaking loop')?.body || '', source, allowed, problems),
    metricsHtml: renderMarkdown(guide.find(section => section.title === 'Communication metrics')?.body || '', source, allowed, problems),
    recordingHtml: renderMarkdown(guide.find(section => section.title === 'Recording practice')?.body || '', source, allowed, problems),
    phrases: sections(read('english/TECHNICAL_PHRASES.md'), 2).map(section => ({ title: section.title, items: section.body.split('\n').filter(line => line.startsWith('- ')).map(line => line.slice(2)) })),
    answerBank: sections(read('english/INTERVIEW_ANSWER_BANK.md'), 2).map(section => ({ title: section.title, html: renderMarkdown(section.body, 'english/INTERVIEW_ANSWER_BANK.md', allowed, problems) })),
  };
}

function topicIndex(root, allowed) {
  return GUIDES.filter(([, file]) => allowed.has(file)).map(([name, file]) => {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    const paragraph = text.split(/\r?\n\s*\r?\n/).find(block => block.trim() && !/^[#\-|]/.test(block.trim()));
    const bullets = text.split(/\r?\n/).filter(line => /^- /.test(line)).slice(0, 2).join(' · ');
    return { name, path: file, description: (paragraph || bullets || name).replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#*`]|^- \[[ x]\] /g, '').replace(/\s+/g, ' ').slice(0, 180),
      chapters: name === 'JavaScript' ? [...allowed].filter(file => file.startsWith('JavaScript/')) : [] };
  });
}

module.exports = { inside, renderMarkdown, documentPaths, loadEnglish, topicIndex, escapeHtml };

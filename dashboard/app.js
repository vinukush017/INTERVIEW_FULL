/* Vanilla DOM controller. Learning history only goes through the legacy API;
   in-memory practice fields are deliberately not a second progress database. */
'use strict';
const $ = id => document.getElementById(id);
const html = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const state = { data: null, review: null, english: null, practice: null, editors: new Map(), jsOutcomes: new Map(), active: 'today' };

async function api(url, options = {}) {
  const response = await fetch(url, { cache: 'no-store', ...options });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}
const post = (url, body, method = 'POST') => api(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
function status(message, error = false) { $('status').textContent = message; $('status').classList.toggle('error', error); }
function actionButton(text, dataset, primary = false) {
  const button = document.createElement('button'); button.textContent = text; Object.assign(button.dataset, dataset);
  if (primary) button.className = 'primary'; return button;
}
function switchSection(section, focus = true) {
  if (!document.querySelector(`#${section}.page`)) return;
  state.active = section;
  document.querySelectorAll('.page').forEach(page => { page.hidden = page.id !== section; });
  document.querySelectorAll('[data-section]').forEach(button => {
    if (button.dataset.section === section) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
  });
  document.title = `Interview Prep — ${document.querySelector(`#${section} h2`).textContent}`;
  if (focus) document.querySelector(`#${section} h2`).focus();
}
function readPreference(key, fallback) { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } }
function savePreference(key, value) { try { localStorage.setItem(key, value); } catch { /* UI still works without storage. */ } }
$('studyMode').value = readPreference('interviewStudyMode', '120 min');
function modeAdvice() {
  const mode = $('studyMode').value;
  $('modeAdvice').textContent = mode === 'Minimum' ? 'Busy day: one small retrieval and a short speaking loop. Resume the queue when time returns; no catch-up debt.' : 'Choose one main task, one revision, and 15 minutes of speaking. Extend a task only if time remains.';
}
$('studyMode').addEventListener('change', () => { savePreference('interviewStudyMode', $('studyMode').value); modeAdvice(); });
modeAdvice();
$('todayDate').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

function renderToday() {
  const next = state.data.next; const container = $('todayTask'); container.replaceChildren();
  if (next) {
    container.innerHTML = `<p><strong>${html(next.title)}</strong></p><p class="muted">${html(next.topic)} · ${next.checked ? 'Checked complete' : 'Not checked complete'}${next.challenge ? ' · Challenge' : ''}</p>`;
    container.append(actionButton('Open problem', { problem: next.relPath }, true));
    $('dsaTarget').placeholder = next.title;
  } else container.textContent = 'Every queued problem is checked. Choose a review, topic or mock.';
  if (!state.practice) useProblemForSpeaking(next, false);
  renderReview();
  renderProgress();
}
function renderReview() {
  const review = state.review;
  for (const id of ['todayReview', 'revisionCard']) {
    const container = $(id); container.replaceChildren();
    if (!review || review.none) { container.textContent = 'No checked problems yet. Complete one before selecting a review.'; continue; }
    container.innerHTML = `<p><strong>${html(review.title)}</strong></p><p class="muted">${review.repCount} recorded solve${review.repCount === 1 ? '' : 's'} · ${review.poolSize} tied for least practiced</p>`;
    container.append(actionButton(id === 'todayReview' ? 'Start review' : 'Open / start review', { problem: review.relPath }));
    if (id === 'revisionCard') {
      const history = document.createElement('p'); history.className = 'muted';
      history.textContent = review.history?.length ? 'Recorded history: ' + review.history.map(entry => entry.date).join(', ') : 'No dated completion entry exists for this checked problem.';
      container.append(history);
    }
  }
}
async function chooseReview() {
  state.review = await api('/api/random-review'); renderReview();
}
$('anotherReview').addEventListener('click', () => chooseReview().catch(error => status(error.message, true)));
function renderProgress() {
  const data = state.data;
  $('progressSummary').innerHTML = `<p><strong>${data.solvedCount} / ${data.totalCount}</strong> DSA problems checked complete. Historical entries are completion records, not proof of independent solving.</p><p>Current streak: ${data.streak.current} day(s) · Longest: ${data.streak.longest} · Last recorded solve: ${html(data.streak.lastDate || 'none')}</p>`;
  $('topicProgress').innerHTML = data.topics.map(topic => {
    const solved = topic.items.filter(item => item.checked).length;
    return `<div class="topic-progress"><span>${html(topic.name)}</span><progress max="${topic.items.length || 1}" value="${solved}" aria-label="${html(topic.name)} completion"></progress><span>${solved}/${topic.items.length}</span></div>`;
  }).join('');
  $('recentActivity').innerHTML = data.recentActivity.length ? '<ul>' + data.recentActivity.map(entry => `<li>${html(entry.date)} — ${html(entry.problem)}</li>`).join('') + '</ul>' : '<p>No recorded activity yet.</p>';
}
function findItem(file) { return state.data.topics.flatMap(topic => topic.items).find(item => item.path === file); }
function renderDSA() {
  const container = $('problemTopics');
  // Build once. Navigation, filtering and refresh never destroy editor drafts.
  if (!container.children.length) {
    for (const topic of state.data.topics) {
      const group = document.createElement('details'); group.className = 'topic'; group.dataset.topic = topic.name;
      group.innerHTML = `<summary>${html(topic.name)} <span class="topic-count"></span></summary>`;
      if (topic.conceptHtml) {
        const concept = document.createElement('details'); concept.innerHTML = `<summary>Pattern reference — read after attempting</summary><div class="markdown">${topic.conceptHtml}</div>`; group.append(concept);
      }
      for (const item of topic.items) {
        const block = document.createElement('details'); block.className = 'problem-block'; block.dataset.path = item.path;
        block.innerHTML = `<summary>${html(item.title)} <span class="problem-meta"></span></summary><div class="problem-panel"></div>`;
        block.addEventListener('toggle', () => { if (block.open) loadEditor(block).catch(error => status(error.message, true)); });
        group.append(block);
      }
      container.append(group);
    }
  }
  document.querySelectorAll('.topic').forEach(group => {
    const topic = state.data.topics.find(item => item.name === group.dataset.topic);
    group.querySelector('.topic-count').textContent = `${topic.items.filter(item => item.checked).length}/${topic.items.length}`;
    group.querySelectorAll('.problem-block').forEach(block => {
      const item = findItem(block.dataset.path);
      const meta = block.querySelector('.problem-meta'); meta.textContent = ` · ${item.checked ? 'Checked' : 'Not checked'} · ${item.repCount} recorded solves${item.hasTest ? ' · Tests available' : ''}`;
      meta.classList.toggle('completed', item.checked);
    });
  });
  $('orderList').innerHTML = '<ol class="queue-list">' + state.data.flatQueue.map(item => `<li><button data-problem="${html(item.relPath)}">${html(item.title)} — ${html(item.topic)}${item.challenge ? ' · Challenge' : ''}${item.checked ? ' · Checked' : ''}</button></li>`).join('') + '</ol>';
  filterProblems();
}
function filterProblems() {
  const query = $('problemFilter').value.trim().toLowerCase();
  document.querySelectorAll('.topic').forEach(group => {
    let visible = 0;
    group.querySelectorAll('.problem-block').forEach(block => {
      const match = (findItem(block.dataset.path).title + ' ' + block.dataset.path + ' ' + group.dataset.topic).toLowerCase().includes(query);
      block.hidden = !match; if (match) visible++;
    });
    group.hidden = visible === 0;
    if (query && visible) group.open = true;
  });
}
$('problemFilter').addEventListener('input', filterProblems);
async function openProblem(file) {
  switchSection('dsa'); $('problemFilter').value = ''; filterProblems();
  const block = [...document.querySelectorAll('.problem-block')].find(block => block.dataset.path === file);
  if (!block) throw new Error('Problem is not in the checklist workspace');
  block.closest('.topic').open = true; block.open = true;
  await loadEditor(block); block.scrollIntoView({ block: 'start' }); block.querySelector('summary').focus();
}
function selectMarkup(label, choices, name) {
  return `<label>${label}<select name="${name}"><option value="">Choose</option>${choices.map(choice => `<option>${html(choice)}</option>`).join('')}</select></label>`;
}
async function loadEditor(block) {
  const file = block.dataset.path;
  if (state.editors.has(file)) return state.editors.get(file).ready;
  const editor = { dirty: false, ready: null, busy: false }; state.editors.set(file, editor);
  editor.ready = (async () => {
    const panel = block.querySelector('.problem-panel'); panel.textContent = 'Loading practice file…';
    const data = await api('/api/file?path=' + encodeURIComponent(file)); const item = findItem(file);
    panel.innerHTML = `<div class="problem-header"><code>${html(file)}</code><a href="${html(item.leetcodeUrl)}" target="_blank" rel="noopener noreferrer">Find original prompt</a></div>
      <label>Solution editor<textarea class="solution" spellcheck="false" aria-label="Solution for ${html(item.title)}"></textarea></label>
      <div class="actions"><button data-editor-action="save">Save solution</button>${item.hasTest ? '<button data-editor-action="test">Save &amp; run tests</button>' : '<span class="muted">No automated tests registered for this problem.</span>'}<button data-editor-action="explain">Explain aloud</button><button data-editor-action="done">Mark Complete</button></div>
      ${!item.hasTest ? '<label class="checkline"><input type="checkbox" class="confirm-box">I tested the solution and reviewed its approach and complexity (self-certification).</label>' : ''}
      <pre class="output" role="status" hidden></pre>
      <details class="attempt" open><summary>Record attempt outcome — temporary</summary><p class="notice">These fields are not saved. Mark Complete saves only the existing completion/date record; it does not save independence, hints, time, confidence or speaking evidence. Repository-backed attempt storage comes in the next data-model PR.</p><div class="fields">
        ${selectMarkup('Attempt result', ['Solved independently', 'Needed hint', 'Studied solution', 'Failed / revisit'], 'attempt')}
        <label>Time spent (minutes, optional)<input type="number" min="0" name="minutes"></label>
        ${selectMarkup('Confidence (1–5)', ['1', '2', '3', '4', '5'], 'confidence')}
        ${selectMarkup('Could explain without notes?', ['Yes', 'Partially', 'No'], 'explanation')}
      </div></details>`;
    editor.textarea = panel.querySelector('textarea'); editor.original = data.content; editor.textarea.value = data.content;
    editor.textarea.addEventListener('input', () => { editor.dirty = editor.textarea.value !== editor.original; });
    panel.querySelectorAll('[data-editor-action]').forEach(button => button.addEventListener('click', () => editorAction(button.dataset.editorAction, file, panel, editor)));
  })().catch(error => { state.editors.delete(file); block.querySelector('.problem-panel').textContent = `Could not load: ${error.message}`; throw error; });
  return editor.ready;
}
async function editorAction(action, file, panel, editor) {
  if (action === 'explain') { useProblemForSpeaking({ relPath: file, title: findItem(file).title }, true); return; }
  if (editor.busy) return;
  editor.busy = true; const buttons = panel.querySelectorAll('[data-editor-action]'); buttons.forEach(button => { button.disabled = true; });
  const output = panel.querySelector('.output'); output.hidden = false; output.className = 'output'; output.textContent = 'Saving solution…';
  try {
    const submitted = editor.textarea.value;
    const saved = await post('/api/file', { path: file, content: submitted }, 'PUT');
    if (!saved.ok) throw new Error('Save was not confirmed; no tests/completion were requested.');
    editor.original = submitted; editor.dirty = editor.textarea.value !== submitted;
    if (action === 'save') { output.textContent = 'Solution saved to the repository.'; return; }
    const result = await post(action === 'test' ? '/api/run-tests' : '/api/done', { path: file, confirmed: !!panel.querySelector('.confirm-box')?.checked });
    const pass = action === 'test' ? result.pass : result.ok;
    output.className = 'output ' + (pass ? 'output-pass' : 'output-fail');
    if (action === 'test') output.textContent = result.hasTest ? result.output || (pass ? 'Tests passed.' : 'Tests failed.') : 'No tests available.';
    else if (result.ok) { output.textContent = 'Completion recorded using the existing checklist/log. Attempt and speaking fields remain temporary.\n' + (result.output || ''); await refreshData(); await chooseReview(); }
    else output.textContent = result.reason === 'not_confirmed' ? 'Self-certify after testing/reviewing this untested problem before marking complete.' : 'Completion was not recorded: ' + result.reason + '\n' + (result.output || '');
  } catch (error) { output.className = 'output output-fail'; output.textContent = `Action failed: ${error.message}`; }
  finally { editor.busy = false; buttons.forEach(button => { button.disabled = false; }); }
}
window.addEventListener('beforeunload', event => {
  if ([...state.editors.values()].some(editor => editor.dirty || editor.busy)) { event.preventDefault(); event.returnValue = ''; }
});

// Speaking is session-only. No answers, media or learning history go into localStorage.
function useProblemForSpeaking(problem, navigate = true) {
  setPractice(problem ? { question: `Explain your approach to ${problem.title} before coding: clarify the problem, compare brute force with your optimization, and walk through an example.`, framework: 'DSA', problem: problem.relPath, followUp: 'Why is the invariant safe? What are the time/space complexity and edge cases?' } : { question: 'Choose a technical question from JS Core or a topic you are studying.', framework: 'Technical concept' }, navigate);
}
function setPractice(practice, navigate) {
  // Do not silently replace pending gaps from a previous speaking question.
  if (state.practice && state.practice.question !== practice.question && ['technicalGap', 'communicationGap', 'nextSpeakingReview'].some(id => $(id).value.trim())) {
    if (!confirm('Switch speaking question? Copy any pending gaps/review to TODAY.md first. The current temporary fields will be cleared.')) return;
  }
  state.practice = practice;
  for (const id of ['technicalGap', 'communicationGap', 'usefulPhrase', 'nextSpeakingReview', 'notesFree', 'speakingConfidence']) $(id).value = '';
  $('firstAttempt').checked = false; $('secondAttempt').checked = false;
  $('speakingQuestion').value = practice.question; $('todayQuestion').textContent = practice.question;
  $('followUp').value = practice.followUp || '';
  $('speakingReference').hidden = true; $('speakingReference').replaceChildren();
  $('speakingSource').replaceChildren();
  if (practice.problem) $('speakingSource').append(actionButton('Back to problem workspace', { problem: practice.problem }));
  if (practice.document) $('speakingSource').append(actionButton('Read technical source after speaking', { document: practice.document }));
  chooseFramework(practice.framework || 'Technical concept');
  if (navigate) switchSection('english');
}
$('speakingQuestion').addEventListener('input', () => {
  // A manually changed question no longer inherits a potentially unrelated reference.
  state.practice = { question: $('speakingQuestion').value, framework: state.practice?.framework };
  $('todayQuestion').textContent = $('speakingQuestion').value;
  $('speakingSource').replaceChildren(); $('speakingReference').hidden = true;
});
$('startSpeaking').addEventListener('click', () => switchSection('english'));
function chooseFramework(title) {
  if (!state.english) return;
  const framework = state.english.frameworks.find(item => item.title === title) || state.english.frameworks[0];
  $('frameworkContent').innerHTML = framework.html;
  $('frameworkHint').textContent = 'Framework: ' + framework.title;
  if (state.practice) state.practice.framework = framework.title;
  document.querySelectorAll('[data-framework]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.framework === framework.title)));
}
$('reviewReference').addEventListener('click', async () => {
  const practice = state.practice;
  try {
    if (practice?.reference) { $('speakingReference').innerHTML = practice.reference; $('speakingReference').hidden = false; }
    else if (practice?.problem) {
      const data = await api('/api/file?path=' + encodeURIComponent(practice.problem));
      // Prefer the current editor draft, if present, over an older saved version.
      const content = state.editors.get(practice.problem)?.textarea?.value ?? data.content;
      $('speakingReference').innerHTML = `<p class="muted">Current practice file; scaffolds may not contain a complete answer. Review the material you actually used.</p><pre><code>${html(content)}</code></pre>`;
      $('speakingReference').hidden = false;
    } else if (practice?.document) await openDocument(practice.document);
    else { $('speakingReference').textContent = 'Choose the reference you studied from Topics or JS Core. A topic checklist is a pointer, not a complete reference answer.'; $('speakingReference').hidden = false; }
  } catch (error) { status(error.message, true); }
});
function renderEnglish(data) {
  state.english = data;
  $('frameworkButtons').replaceChildren(...data.frameworks.map(framework => actionButton(framework.title, { framework: framework.title })));
  chooseFramework(state.practice?.framework || 'Technical concept');
  $('phrasePreview').innerHTML = '<ul>' + data.phrases.flatMap(category => category.items).slice(0, 4).map(phrase => `<li>${html(phrase)}</li>`).join('') + '</ul>';
  $('phrases').innerHTML = data.phrases.map(category => `<h4>${html(category.title)}</h4><ul>${category.items.map(phrase => `<li>${html(phrase)}</li>`).join('')}</ul>`).join('');
  $('speakingLoop').innerHTML = data.loopHtml; $('recordingGuide').innerHTML = data.recordingHtml; $('speakingMetrics').innerHTML = data.metricsHtml;
  $('answerBank').innerHTML = data.answerBank.map(section => `<details><summary>${html(section.title)}</summary><div class="markdown">${section.html}</div></details>`).join('');
}

const jsQuestions = [
  ...FUNCTION_FORMS.map(item => ({ category: 'Function forms', q: `Explain ${item.title}.`, answer: `<p>${html(item.note)}</p><pre><code>${html(item.code)}</code></pre>` })),
  ...ASYNC_TIMER_FORMS.map(item => ({ category: 'Timers & async patterns', q: `Explain ${item.title}.`, answer: `<p>${html(item.note)}</p><pre><code>${html(item.code)}</code></pre>` })),
  ...THEORY_CARDS.map(item => ({ category: item.category, q: item.q, answer: `<p>${html(item.a)}</p>` })),
];
$('jsCategory').innerHTML = '<option value="">All categories</option>' + [...new Set(jsQuestions.map(item => item.category))].map(category => `<option>${html(category)}</option>`).join('');
function renderJS() {
  const query = $('jsSearch').value.toLowerCase(); const category = $('jsCategory').value;
  const filtered = jsQuestions.filter(item => (!category || item.category === category) && item.q.toLowerCase().includes(query));
  $('jsQuestions').replaceChildren();
  for (const item of filtered) {
    const card = document.createElement('article'); card.className = 'card js-question';
    card.innerHTML = `<small>${html(item.category)}</small><h3>${html(item.q)}</h3><p class="muted">Answer aloud first, without notes.</p><div class="actions"><button class="reveal">Reveal Answer</button><button class="speak-js">Use for daily speaking</button></div><div class="js-answer" hidden>${item.answer}${selectMarkup('Could explain without notes? (temporary)', ['Yes', 'Partially', 'No'], 'js-explanation')}</div>`;
    const answer = card.querySelector('.js-answer');
    card.querySelector('.reveal').addEventListener('click', event => { answer.hidden = !answer.hidden; event.target.textContent = answer.hidden ? 'Reveal Answer' : 'Hide Answer'; event.target.setAttribute('aria-expanded', String(!answer.hidden)); });
    const outcome = card.querySelector('select'); outcome.value = state.jsOutcomes.get(item.q) || '';
    outcome.addEventListener('change', () => state.jsOutcomes.set(item.q, outcome.value));
    card.querySelector('.speak-js').addEventListener('click', () => setPractice({ question: item.q, framework: / vs |difference/i.test(item.q) ? 'X vs Y' : 'Technical concept', reference: item.answer, followUp: 'Give an example and one limitation. How would you use this in an application?' }, true));
    $('jsQuestions').append(card);
  }
  if (!filtered.length) $('jsQuestions').textContent = 'No questions match this filter.';
}
$('jsSearch').addEventListener('input', renderJS); $('jsCategory').addEventListener('change', renderJS);

async function openDocument(file, anchor = '') {
  const documentData = await api('/api/content?path=' + encodeURIComponent(file));
  $('readerTitle').textContent = file; $('readerContent').innerHTML = documentData.html;
  $('rawDocument').href = '/api/content?format=raw&path=' + encodeURIComponent(file);
  if (!$('reader').open) $('reader').showModal();
  $('reader').scrollTop = 0;
  if (anchor) {
    let decoded = anchor; try { decoded = decodeURIComponent(anchor); } catch { /* Keep original anchor. */ }
    const target = [...$('readerContent').querySelectorAll('[id]')].find(element => element.id === decoded);
    if (target) target.scrollIntoView();
  }
}
$('closeReader').addEventListener('click', () => $('reader').close());
function renderTopics(topics) {
  $('topicIndex').replaceChildren();
  for (const topic of topics) {
    const card = document.createElement('article'); card.className = 'card';
    card.innerHTML = `<h3>${html(topic.name)}</h3><p>${html(topic.description)}</p>`;
    card.append(actionButton('Read existing guide', { document: topic.path }));
    card.append(actionButton('Practice explaining this topic', { topicQuestion: topic.path, topicName: topic.name }));
    if (topic.chapters.length) {
      const chapters = document.createElement('details'); chapters.innerHTML = '<summary>JavaScript chapter notes</summary>';
      for (const chapter of topic.chapters) chapters.append(actionButton(chapter.replace('JavaScript/', ''), { document: chapter }));
      card.append(chapters);
    }
    $('topicIndex').append(card);
  }
}
document.addEventListener('click', event => {
  const element = event.target.closest('button, a'); if (!element) return;
  if (element.dataset.section) switchSection(element.dataset.section);
  if (element.dataset.framework) chooseFramework(element.dataset.framework);
  if (element.dataset.document) { event.preventDefault(); openDocument(element.dataset.document, element.dataset.anchor).catch(error => status(error.message, true)); }
  if (element.dataset.problem) {
    event.preventDefault(); if ($('reader').open) $('reader').close();
    openProblem(element.dataset.problem).catch(error => status(error.message, true));
  }
  if (element.dataset.topicQuestion) {
    const questions = { '07-SQL.md': 'Why can an index improve reads but make writes more expensive?', '03-React.md': 'Why might React.memo fail to prevent a rerender?', '05-NodeJS.md': 'What happens when an HTTP request reaches an Express API?', '08-System-Design.md': 'Explain one architecture decision, an alternative, and its tradeoff.' };
    setPractice({ question: questions[element.dataset.topicQuestion] || `Explain one concept from today's ${element.dataset.topicName} task with an example and tradeoff.`, document: element.dataset.topicQuestion, framework: element.dataset.topicQuestion === '08-System-Design.md' ? 'System Design' : 'Technical concept' }, true);
  }
});

async function refreshData() {
  state.data = await api('/api/data'); renderDSA(); renderToday();
}
$('refresh').addEventListener('click', async () => {
  try { await refreshData(); await chooseReview(); status('Repository data refreshed. Editor drafts and temporary speaking fields were kept.'); }
  catch (error) { status(error.message, true); }
});
async function start() {
  switchSection('today', false); // A normal launch always starts with Today, not a stale saved tab.
  try {
    const [data, review, english, topics, mocks] = await Promise.all([api('/api/data'), api('/api/random-review'), api('/api/english'), api('/api/topics'), api('/api/content?path=Mock-Interviews%2FREADME.md')]);
    state.data = data; state.review = review; renderEnglish(english); renderDSA(); renderToday(); renderTopics(topics); renderJS(); $('mockContent').innerHTML = mocks.html;
    status('Ready. Start with the main task or a small review.');
    const params = new URLSearchParams(location.search);
    if (params.has('doc')) await openDocument(params.get('doc'), location.hash.slice(1));
    else if (params.has('problem')) await openProblem(params.get('problem'));
  } catch (error) { status(`Could not load preparation data: ${error.message}. Check the server terminal, then Refresh data or reload.`, true); }
}
start();

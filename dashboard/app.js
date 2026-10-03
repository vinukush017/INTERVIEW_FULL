/* Vanilla DOM controller. Explicit saves record evidence in the repository;
   localStorage holds UI preferences only. */
'use strict';
const $ = id => document.getElementById(id);
const html = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const state = { data: null, english: null, practice: null, editors: new Map(), jsOutcomes: new Map(), active: 'today' };

async function api(url, options = {}) {
  const response = await fetch(url, { cache: 'no-store', ...options });
  const data = await response.json();
  if (!response.ok || data.error) throw Object.assign(new Error(data.error || `Request failed (${response.status})`), { data });
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
    container.innerHTML = `<p><strong>${html(next.title)}</strong></p><p class="muted">${html(next.topic || 'Weekly decision')}${next.kind === 'dsa' ? ' · ' + (next.checked ? 'Checked complete' : 'Not checked complete') : ''}${next.challenge ? ' · Challenge' : ''}</p><p>${html(next.reason)}</p>`;
    if (next.relPath) container.append(actionButton('Open problem', { problem: next.relPath }, true));
    else if (next.document) { container.append(actionButton('Open technical guide', { document: next.document }, true)); container.append(actionButton('Record topic evidence', { openTopic: next.itemId })); }
    else if (next.itemId) container.append(actionButton('Practise this question aloud', { mainSpeaking: next.itemId }, true));
    else container.append(actionButton('Review / adjust this task', { section: 'weekly' }));
    $('dsaTarget').placeholder = next.title;
  } else container.textContent = 'Every queued problem is checked. Choose a review, topic or mock.';
  $('todayDate').textContent = `${state.data.evidence.date} · study timezone ${state.data.evidence.timezone}`;
  const weak = state.data.evidence.today.weakPoint;
  $('todayWeakPoint').hidden = !weak;
  $('todayWeakPoint').textContent = weak ? `Recent weak point: ${weak.title} (${weak.channel}) — ${weak.reason}` : '';
  if (!state.practice) {
    const due = state.data.evidence.today.speaking;
    const recent = state.data.evidence.events.filter(event => event.track === 'speaking' && event.date === state.data.evidence.date).at(-1);
    if (due || recent) practiceFromEvidence(due || recent, false);
    else if (next?.kind === 'dsa') useProblemForSpeaking(next, false);
    else if (next?.itemId) practiceFromEvidence(next, false);
    else setPractice({ itemId: 'custom:' + crypto.randomUUID(), question: next?.question || 'Explain one idea from your current technical task.', framework: 'Technical concept' }, false);
  }
  renderPlanning();
  renderReview();
  renderProgress();
}
function renderReview() {
  const evidence = state.data?.evidence; if (!evidence) return;
  for (const id of ['todayReview', 'revisionCard']) {
    const container = $(id); container.replaceChildren();
    for (const item of evidence.review.due) {
      const card = document.createElement('div');
      card.innerHTML = `<p><strong>${html(item.title)}</strong></p><p class="muted">${html(item.channel)} · due ${html(item.nextDue)} · latest ${html(item.latestOutcome)}</p>`;
      card.append(actionButton(item.channel === 'coding' ? 'Start coding review' : 'Start retrieval / speaking', { reviewKey: item.key }));
      container.append(card);
    }
    if (!evidence.review.due.length) {
      const note = document.createElement('p'); note.textContent = 'No date-based revision due from recorded evidence.'; container.append(note);
      if (evidence.review.baseline) {
        const baseline = evidence.review.baseline;
        container.append(actionButton('Optional baseline retrieval: ' + baseline.title, { problem: baseline.relPath }));
        const unknown = document.createElement('p'); unknown.className = 'muted'; unknown.textContent = 'Historical completion; independence and explanation unknown. This is not overdue.'; container.append(unknown);
      }
    }
    if (id === 'revisionCard') {
      const count = document.createElement('p'); count.className = 'muted'; count.textContent = `${evidence.review.deferredCount} other due channels deferred. Keep the daily workload bounded.`; container.append(count);
    }
  }
}
async function chooseReview() { await refreshData(); }
$('anotherReview').addEventListener('click', () => chooseReview().catch(error => status(error.message, true)));
function evidenceText(summary) {
  return `<p>DSA attempts: ${summary.attempts.independent} independent · ${summary.attempts.hinted} hinted · ${summary.attempts.studied_solution} studied solution · ${summary.attempts.failed} failed.</p><p>Reviews: ${summary.reviewSuccesses}/${summary.reviewsCompleted} independent. Notes-free explanations: ${summary.explanations.yes}/${summary.explanations.total}. Recorded time: ${summary.minutes} minutes (${summary.unknownTime} events with unknown time).</p>`;
}
function renderProgress() {
  const data = state.data; const evidence = data.evidence;
  $('progressSummary').innerHTML = `<p><strong>${data.solvedCount} / ${data.totalCount}</strong> DSA problems checked complete. ${evidence.legacyCount} completion records; missing independence/explanation stays unknown.</p><p>Study activity streak: ${data.streak.current} day(s) · Longest: ${data.streak.longest} · Last activity: ${html(data.streak.lastDate || 'none')}</p>`;
  const core = data.topics.flatMap(topic => topic.items).filter(item => item.role === 'CORE');
  $('progressSummary').insertAdjacentHTML('beforeend', `<p>Curated core: ${core.filter(item => item.checked).length}/${core.length} checked complete; ${core.filter(item => item.evidence.attempted).length}/${core.length} have actual attempt evidence. Neither count is readiness.</p>`);
  $('topicProgress').innerHTML = data.topics.map(topic => {
    const solved = topic.items.filter(item => item.checked).length;
    return `<div class="topic-progress"><span>${html(topic.name)}</span><progress max="${topic.items.length || 1}" value="${solved}" aria-label="${html(topic.name)} completion"></progress><span>${solved}/${topic.items.length}</span></div>`;
  }).join('');
  $('evidenceSummary').innerHTML = evidenceText(evidence.summary);
  $('weeklyEvidence').innerHTML = evidenceText(evidence.weekly) + ['recurringTechnicalGaps', 'recurringCommunicationGaps'].map(key => `<h4>${key === 'recurringTechnicalGaps' ? 'Technical' : 'Communication'} gaps</h4><ul>${evidence.weekly[key].map(gap => `<li>${html(gap.text)} (${gap.count} records)</li>`).join('') || '<li>No gap evidence recorded.</li>'}</ul>`).join('');
  $('weaknessSummary').innerHTML = evidence.weaknesses.length ? '<ul>' + evidence.weaknesses.slice(0, 8).map(item => `<li>${html(item.title)} · ${html(item.channel)}: ${html(item.reason)} · review ${html(item.nextDue)}</li>`).join('') + '</ul>' : '<p>No weakness evidence recorded; this does not establish readiness.</p>';
  const overdue = evidence.reviewStates.filter(item => item.nextDue && item.nextDue < evidence.date).length;
  $('weaknessSummary').insertAdjacentHTML('beforeend', `<p>${overdue} overdue review channels. The daily selection remains bounded.</p>`);
  $('recentActivity').innerHTML = data.recentActivity.length ? '<ul>' + data.recentActivity.map(entry => `<li>${html(entry.date)} — ${html(entry.label)}</li>`).join('') + '</ul>' : '<p>No recorded activity yet.</p>';
  const readiness = evidence.readiness;
  $('readinessEvidence').innerHTML = `<p>Last 30 study dates: ${readiness.recentIndependent} validated independent DSA attempts recorded.</p><p>${readiness.explanationSample.yes}/${readiness.explanationSample.total} of the latest up to 10 recorded explanations were notes-free.</p><ul>${readiness.tracks.map(track => `<li>${html(track.topic)}: ${track.practicalAttempts ? track.practicalAttempts + ' self-reported practical attempts' : 'No demonstrated practical evidence yet'}.</li>`).join('')}</ul>`;
}
function findItem(file) { return state.data.topics.flatMap(topic => topic.items).find(item => item.path === file); }
function renderDSA() {
  const container = $('problemTopics');
  // Append newly registered problems on refresh without destroying editor drafts.
  for (const topic of state.data.topics) {
    let group = [...container.children].find(group => group.dataset.topic === topic.name);
    if (!group) {
      group = document.createElement('details'); group.className = 'topic'; group.dataset.topic = topic.name;
      group.innerHTML = `<summary>${html(topic.name)} <span class="topic-count"></span></summary>`;
      if (topic.conceptHtml) {
        const concept = document.createElement('details'); concept.innerHTML = `<summary>Pattern reference — read after attempting</summary><div class="markdown">${topic.conceptHtml}</div>`; group.append(concept);
      }
      container.append(group);
    }
    for (const item of topic.items) {
      if (![...group.querySelectorAll('.problem-block')].some(block => block.dataset.path === item.path)) {
        const block = document.createElement('details'); block.className = 'problem-block'; block.dataset.path = item.path;
        block.innerHTML = `<summary>${html(item.title)} <span class="problem-meta"></span></summary><div class="problem-panel"></div>`;
        block.addEventListener('toggle', () => { if (block.open) loadEditor(block).catch(error => status(error.message, true)); });
        group.append(block);
      }
    }
  }
  document.querySelectorAll('.topic').forEach(group => {
    const topic = state.data.topics.find(item => item.name === group.dataset.topic);
    group.querySelector('.topic-count').textContent = `${topic.items.filter(item => item.checked).length}/${topic.items.length}`;
    group.querySelectorAll('.problem-block').forEach(block => {
      const item = findItem(block.dataset.path);
      const meta = block.querySelector('.problem-meta'); meta.textContent = ` · ${item.role} · ${item.pattern} · ${item.checked ? 'Checked' : 'Not checked'} · latest ${item.evidence.latestOutcome} · independent ${item.evidence.lastIndependent || 'unknown'} · explanation ${item.evidence.explanation}${item.evidence.nextDue && item.evidence.nextDue <= state.data.evidence.date ? ' · review due ' + item.evidence.nextDue : ''}${item.hasTest ? ' · Tests available' : ''}`;
      meta.classList.toggle('completed', item.checked);
    });
  });
  $('orderList').innerHTML = '<ol class="queue-list">' + state.data.flatQueue.map(item => `<li><button data-problem="${html(item.relPath)}">${html(item.title)} — ${html(item.topic)} · ${html(item.role)}${item.challenge ? ' · Challenge' : ''}${item.checked ? ' · Checked' : ''}</button></li>`).join('') + '</ol>';
  renderPatterns(); filterProblems();
}
function filterProblems() {
  if (!state.data) return;
  const query = $('problemFilter').value.trim().toLowerCase(); let total = 0;
  document.querySelectorAll('.topic').forEach(group => {
    let visible = 0;
    group.querySelectorAll('.problem-block').forEach(block => {
      const item = findItem(block.dataset.path); const e = item.evidence;
      const due = [e.nextDue, e.speakingDue].some(date => date && date <= state.data.evidence.date);
      const match = (!query || `${item.title} ${item.path} ${item.topic} ${item.pattern}`.toLowerCase().includes(query)) &&
        (!$('roleFilter').value || item.role === $('roleFilter').value) && (!$('patternFilter').value || item.patternId === $('patternFilter').value) &&
        (!$('attemptFilter').value || e.latestOutcome === $('attemptFilter').value) && (!$('readinessFilter').value || item.readiness === $('readinessFilter').value) &&
        (!$('dueFilter').checked || due) && (!$('weakFilter').checked || e.weak);
      block.hidden = !match; if (match) visible++;
    });
    group.hidden = visible === 0; total += visible;
    if (query && visible) group.open = true;
  });
  $('filterCount').textContent = `${total} matching problems / ${state.data.totalCount} library items. Evidence remains separate from completion.`;
}
for (const id of ['roleFilter','patternFilter','attemptFilter','readinessFilter','dueFilter','weakFilter']) $(id).addEventListener('change', filterProblems);
$('problemFilter').addEventListener('input', filterProblems);
function dsaView(patterns) {
  $('patternWorkspace').hidden = !patterns; $('problemTopics').hidden = patterns; $('dsaFilters').hidden = patterns; $('filterCount').hidden = patterns;
  $('problemsView').setAttribute('aria-pressed', String(!patterns)); $('patternsView').setAttribute('aria-pressed', String(patterns));
}
$('problemsView').addEventListener('click', () => dsaView(false));
$('patternsView').addEventListener('click', () => dsaView(true));
$('allProblems').addEventListener('click', () => { resetDSAFilters(); dsaView(false); filterProblems(); });
function resetDSAFilters() {
  for (const id of ['problemFilter','roleFilter','patternFilter','attemptFilter','readinessFilter']) $(id).value = '';
  $('dueFilter').checked = false; $('weakFilter').checked = false;
}
async function openProblem(file) {
  switchSection('dsa'); resetDSAFilters(); dsaView(false); filterProblems();
  const block = [...document.querySelectorAll('.problem-block')].find(block => block.dataset.path === file);
  if (!block) throw new Error('Problem is not in the checklist workspace');
  block.closest('.topic').open = true; block.open = true;
  await loadEditor(block); block.scrollIntoView({ block: 'start' }); block.querySelector('summary').focus();
}
function renderPatterns() {
  const patterns = state.data.evidence.dsa.patterns;
  const selected = $('patternFilter').value;
  $('patternFilter').innerHTML = '<option value="">All patterns</option>' + patterns.map(p => `<option value="${p.id}">${html(p.name)}</option>`).join(''); $('patternFilter').value = selected;
  const readiness = $('readinessFilter').value;
  $('readinessFilter').innerHTML = '<option value="">Any evidence state</option>' + ['Not Started','Learning','Practicing','Demonstrated','Transfer Needed','Strong Recent Evidence','Needs Review'].map(value => `<option>${value}</option>`).join(''); $('readinessFilter').value = readiness;
  $('patternList').innerHTML = patterns.map(p => `<article class="card"><h3><button data-pattern="${p.id}">${html(p.name)}</button></h3><p>${p.coreAttempted}/${p.coreTotal} core items attempted · ${html(p.state)}</p><p class="muted">${html(p.recentEvidence)}</p><p>${html(p.nextAction)}</p>${!p.coreTotal ? '<p class="muted">Supporting warm-ups only; not a readiness gate.</p>' : ''}</article>`).join('');
  $('patternObservations').innerHTML = '<ul>' + patterns.filter(p => p.coreTotal).map(p => `<li><button data-pattern="${p.id}">${html(p.name)}</button>: ${html(p.state)}${p.communicationWeakness ? ' · explanation needs practice' : ''}</li>`).join('') + '</ul>';
  if (state.selectedPattern) showPattern(state.selectedPattern, false);
}
function showPattern(id, navigate = true) {
  const p = state.data.evidence.dsa.patterns.find(p => p.id === id); if (!p) return;
  state.selectedPattern = id;
  const detail = $('patternDetail'); detail.hidden = false;
  detail.innerHTML = `<h3>${html(p.name)} — ${html(p.state)}</h3><p>${html(p.cue)}</p><p class="muted">Default guidance: ${p.defaultPhase}. Evidence may justify earlier practice.</p><p>${html(p.recentEvidence)}</p><p>Current weakness: ${html(p.weakness || (p.communicationWeakness ? 'Explanation needs practice' : 'No recent weakness recorded; missing evidence is unknown'))}</p><p><strong>Next action:</strong> ${html(p.nextAction)}</p><div class="actions">${p.nextItem ? `<button data-problem="${html(p.nextItem)}">Open next practice item</button><button data-pattern-speak="${html(p.nextItem)}">Explain the invariant</button>` : ''}<button data-document="${html(p.source)}">Read canonical recognition guidance after attempting</button></div>` +
    ['CORE','SUPPORTING','TRANSFER','OPTIONAL'].map(role => `<h4>${role[0] + role.slice(1).toLowerCase()}</h4><ul>` + (p.members.map(findItem).filter(item => item.role === role).map(item => `<li><button data-problem="${html(item.path)}">${html(item.title)}</button> · ${html(item.evidence.latestOutcome)} · explanation ${html(item.evidence.explanation)}${role === 'TRANSFER' ? ' · candidate, external familiarity unknown' : ''}</li>`).join('') || '<li>No items in this role; a meaningful variation can be chosen manually.</li>') + '</ul>').join('') +
    '<h4>Recent attempts / explanations</h4><ul>' + (p.recentAttempts.map(event => `<li>${event.date} — ${html(event.title)}: ${html(event.outcome || event.track)} · explanation ${html(event.explanation)}</li>`).join('') || '<li>No recorded evidence.</li>') + '</ul>';
  if (navigate) { switchSection('dsa'); dsaView(true); detail.scrollIntoView({ block: 'start' }); detail.focus(); }
}
function defaultAttemptType(file) {
  return findItem(file)?.checked || state.data.evidence.events.some(event => event.track === 'dsa' && event.itemId === file) ? 'review' : 'first_attempt';
}
function selectMarkup(label, choices, name) {
  return `<label>${label}<select name="${name}"><option value="">Choose</option>${choices.map(choice => `<option>${html(choice)}</option>`).join('')}</select></label>`;
}
async function loadEditor(block) {
  const file = block.dataset.path;
  if (state.editors.has(file)) return state.editors.get(file).ready;
  const editor = { dirty: false, ready: null, busy: false, submissionId: crypto.randomUUID() }; state.editors.set(file, editor);
  editor.ready = (async () => {
    const panel = block.querySelector('.problem-panel'); panel.textContent = 'Loading practice file…';
    const data = await api('/api/file?path=' + encodeURIComponent(file)); const item = findItem(file);
    panel.innerHTML = `<div class="problem-header"><code>${html(file)}</code><a href="${html(item.leetcodeUrl)}" target="_blank" rel="noopener noreferrer">Find original prompt</a></div>
      <label>Solution editor<textarea class="solution" spellcheck="false" aria-label="Solution for ${html(item.title)}"></textarea></label>
      <div class="actions"><button data-editor-action="save">Save solution</button>${item.hasTest ? '<button data-editor-action="test">Save &amp; run tests</button>' : '<span class="muted">No automated tests registered for this problem.</span>'}<button data-editor-action="explain">Explain aloud</button><button data-editor-action="done">Mark Complete</button></div>
      ${!item.hasTest ? '<label class="checkline"><input type="checkbox" class="confirm-box">I tested the solution and reviewed its approach and complexity (self-certification).</label>' : ''}
      <pre class="output" role="status" hidden></pre>
      <section class="attempt"><h4>Record attempt evidence</h4><p class="muted">Save attempt records evidence only. Mark Complete is separate and requires validation. Independent means no hints/solution help; hinted means partial guidance; studied means reviewed the approach; failed means no working solution.</p><div class="fields">
        ${selectMarkup('Attempt result', ['Solved independently', 'Needed hint', 'Studied solution', 'Failed / revisit'], 'attempt')}
        ${selectMarkup('Could explain without notes?', ['Yes', 'Partially', 'No'], 'explanation')}
        ${selectMarkup('Confidence (1–5, optional)', ['1', '2', '3', '4', '5'], 'confidence')}
        ${selectMarkup('Attempt type', ['first_attempt', 'review', 'mock'], 'attemptType')}
      </div><details><summary>Optional time and one-line gaps</summary><div class="fields">
        <label>Time spent (minutes)<input type="number" min="0" max="720" name="minutes"></label>
        <label>Technical gap<input name="technicalGap" maxlength="240"></label><label>Communication gap<input name="communicationGap" maxlength="240"></label><label>Mistake / insight<input name="mistakeOrInsight" maxlength="240"></label>
      </div></details><div class="actions"><button data-editor-action="attempt" class="primary">Save attempt</button><button data-new-attempt>New attempt</button></div><p class="saved-evidence" role="status"></p></section>`;
    panel.querySelector('[name=attemptType]').value = defaultAttemptType(file);
    showLastAttempt(file, panel);
    panel.querySelector('[data-new-attempt]').addEventListener('click', () => { panel.querySelectorAll('.attempt input, .attempt select').forEach(input => { input.disabled = false; input.value = ''; }); panel.querySelector('[name=attemptType]').value = defaultAttemptType(file); editor.submissionId = crypto.randomUUID(); editor.savedEvent = null; panel.querySelector('[data-editor-action=attempt]').disabled = false; });
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
    const chosen = panel.querySelector('[name=attempt]').value;
    if (action === 'done' && ['Failed / revisit', 'Studied solution'].includes(chosen)) throw new Error('This outcome records learning, not completion. Save the attempt and revisit.');
    if (action === 'done' && chosen && !editor.savedEvent) throw new Error('Save this attempt first, then mark complete after validation.');
    const submitted = editor.textarea.value;
    const saved = await post('/api/file', { path: file, content: submitted }, 'PUT');
    if (!saved.ok) throw new Error('Save was not confirmed; no tests/completion were requested.');
    editor.original = submitted; editor.dirty = editor.textarea.value !== submitted;
    if (action === 'save') { output.textContent = 'Solution saved to the repository.'; return; }
    if (action === 'attempt') {
      const values = attemptForm(panel, file, editor.submissionId);
      const saved = await post('/api/attempts', { ...values, confirmed: !!panel.querySelector('.confirm-box')?.checked });
      editor.savedEvent = saved.event;
      panel.querySelectorAll('.attempt input, .attempt select').forEach(input => { input.disabled = true; });
      output.textContent = `Attempt saved: ${saved.event.outcome}; explanation ${saved.event.explanation}. Checklist unchanged.`;
      await refreshData(); showLastAttempt(file, panel); return;
    }
    const result = await post(action === 'test' ? '/api/run-tests' : '/api/done', { path: file, confirmed: !!panel.querySelector('.confirm-box')?.checked, ...(editor.savedEvent ? { eventId: editor.savedEvent.id } : {}) });
    const pass = action === 'test' ? result.pass : result.ok;
    output.className = 'output ' + (pass ? 'output-pass' : 'output-fail');
    if (action === 'test') output.textContent = result.hasTest ? result.output || (pass ? 'Tests passed.' : 'Tests failed.') : 'No tests available.';
    else if (result.ok) { output.textContent = 'Completion recorded. Saved attempt and speaking evidence remain distinct from checklist completion.\n' + (result.output || ''); await refreshData(); }
    else output.textContent = result.reason === 'not_confirmed' ? 'Self-certify after testing/reviewing this untested problem before marking complete.' : 'Completion was not recorded: ' + result.reason + '\n' + (result.output || '');
  } catch (error) { output.className = 'output output-fail'; output.textContent = `Action failed: ${error.message}`; }
  finally { editor.busy = false; buttons.forEach(button => { button.disabled = button.dataset.editorAction === 'attempt' && !!editor.savedEvent; }); }
}
window.addEventListener('beforeunload', event => {
  if ([...state.editors.values()].some(editor => editor.dirty || editor.busy)) { event.preventDefault(); event.returnValue = ''; }
});

// Speaking evidence is explicitly repository-backed. Drafts and reveal controls are not history.
function useProblemForSpeaking(problem, navigate = true) {
  const item = problem && findItem(problem.relPath);
  setPractice(problem ? { question: item?.question || problem.question || `Explain your approach to ${problem.title} before coding.`, framework: 'DSA', itemId: problem.relPath, attemptType: 'dsa_explanation', problem: problem.relPath, followUp: item?.role === 'TRANSFER' ? 'What clue made you recognize this pattern? Why does the invariant still work?' : 'Why is the invariant safe? What are the time/space complexity and edge cases?'  } : { question: 'Choose a technical question from JS Core or a topic you are studying.', framework: 'Technical concept' }, navigate);
}
function setPractice(practice, navigate) {
  // Do not silently replace pending gaps from a previous speaking question.
  if (state.practice && state.practice.question !== practice.question && ['technicalGap', 'communicationGap'].some(id => $(id).value.trim())) {
    if (!confirm('Switch speaking question? Save any pending speaking evidence first; unsaved fields will be cleared.')) return;
  }
  state.practice = { ...practice, submissionId: crypto.randomUUID() };
  $('saveSpeaking').disabled = false;
  for (const id of ['technicalGap', 'communicationGap', 'usefulPhrase', 'nextSpeakingReview', 'notesFree', 'speakingConfidence']) $(id).value = '';
  $('firstAttempt').checked = false; $('secondAttempt').checked = false;
  $('speakingQuestion').value = practice.question; $('todayQuestion').textContent = practice.question;
  $('followUp').value = practice.followUp || '';
  $('speakingReference').hidden = true; $('speakingReference').replaceChildren();
  $('speakingSource').replaceChildren();
  if (practice.problem) $('speakingSource').append(actionButton('Back to problem workspace', { problem: practice.problem }));
  if (practice.document) $('speakingSource').append(actionButton('Read technical source after speaking', { document: practice.document }));
  chooseFramework(practice.framework || 'Technical concept');
  showSpeakingHistory();
  if (navigate) switchSection('english');
}
$('speakingQuestion').addEventListener('input', () => {
  // A manually changed question no longer inherits a potentially unrelated reference.
  state.practice = { question: $('speakingQuestion').value, framework: state.practice?.framework, itemId: state.practice?.itemId?.startsWith('custom:') ? state.practice.itemId : 'custom:' + crypto.randomUUID(), submissionId: crypto.randomUUID() };
  $('saveSpeaking').disabled = false;
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
  ...FUNCTION_FORMS.map(item => ({ itemId: item.id, category: 'Function forms', q: `Explain ${item.title}.`, answer: `<p>${html(item.note)}</p><pre><code>${html(item.code)}</code></pre>` })),
  ...ASYNC_TIMER_FORMS.map(item => ({ itemId: item.id, category: 'Timers & async patterns', q: `Explain ${item.title}.`, answer: `<p>${html(item.note)}</p><pre><code>${html(item.code)}</code></pre>` })),
  ...THEORY_CARDS.map(item => ({ itemId: item.id, category: item.category, q: item.q, answer: `<p>${html(item.a)}</p>` })),
];
$('jsCategory').innerHTML = '<option value="">All categories</option>' + [...new Set(jsQuestions.map(item => item.category))].map(category => `<option>${html(category)}</option>`).join('');
function renderJS() {
  const query = $('jsSearch').value.toLowerCase(); const category = $('jsCategory').value;
  const filtered = jsQuestions.filter(item => (!category || item.category === category) && item.q.toLowerCase().includes(query));
  $('jsQuestions').replaceChildren();
  for (const item of filtered) {
    const card = document.createElement('article'); card.className = 'card js-question'; card.dataset.itemId = item.itemId;
    card.innerHTML = `<small>${html(item.category)}</small><h3>${html(item.q)}</h3><p class="muted">Answer aloud first, without notes.</p><div class="actions"><button class="reveal">Reveal Answer</button><button class="speak-js">Use for daily speaking</button></div><div class="js-answer" hidden>${item.answer}${selectMarkup('Could explain without notes?', ['Yes', 'Partially', 'No'], 'js-explanation')}<details><summary>Optional confidence and gaps</summary>${selectMarkup('Confidence', ['1', '2', '3', '4', '5'], 'confidence')}<label>Technical gap<input name=technicalGap maxlength=240></label><label>Communication gap<input name=communicationGap maxlength=240></label></details><button class=save-js>Save explanation</button><p class=js-saved role=status></p></div>`;
    const answer = card.querySelector('.js-answer');
    card.querySelector('.reveal').addEventListener('click', event => { answer.hidden = !answer.hidden; event.target.textContent = answer.hidden ? 'Reveal Answer' : 'Hide Answer'; event.target.setAttribute('aria-expanded', String(!answer.hidden)); });
    const outcome = card.querySelector('select'); outcome.value = state.jsOutcomes.get(item.itemId) || '';
    const previous = state.data?.evidence.latest['speaking:' + item.itemId];
    card.querySelector('.js-saved').textContent = previous ? `Last saved ${previous.date}: explanation ${previous.explanation}${previous.communicationGap ? ' · ' + previous.communicationGap : ''}` : 'No explanation evidence yet.';
    outcome.addEventListener('change', () => state.jsOutcomes.set(item.itemId, outcome.value));
    card.querySelector('.speak-js').addEventListener('click', () => setPractice({ itemId: item.itemId, attemptType: 'js_core', question: item.q, framework: / vs |difference/i.test(item.q) ? 'X vs Y' : 'Technical concept', reference: item.answer, followUp: 'Give an example and one limitation. How would you use this in an application?' }, true));
    setupJSSave(card, item);
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
    if (topic.practice) addTechnicalForm(card, topic.practice);
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
  if (element.dataset.pattern) showPattern(element.dataset.pattern);
  if (element.dataset.patternSpeak) { const item = findItem(element.dataset.patternSpeak); useProblemForSpeaking({ relPath: item.path, title: item.title }); }
  if (element.dataset.section) switchSection(element.dataset.section);
  if (element.dataset.mainSpeaking) practiceFromEvidence(state.data.evidence.today.main, true);
  if (element.dataset.openTopic) {
    switchSection('topics'); const card = [...$('topicIndex').children].find(item => item.dataset.itemId === element.dataset.openTopic);
    if (card) { card.querySelector('.technical-form').open = true; card.scrollIntoView({ block: 'start' }); card.querySelector('[name=outcome]').focus(); }
  }
  if (element.dataset.framework) chooseFramework(element.dataset.framework);
  if (element.dataset.reviewKey) {
    const review = state.data.evidence.reviewStates.find(item => item.key === element.dataset.reviewKey);
    if (review?.channel === 'coding') openProblem(review.itemId).catch(error => status(error.message, true));
    else if (review?.channel === 'technical') {
      switchSection('topics');
      const card = [...$('topicIndex').children].find(card => card.dataset.itemId === review.itemId);
      if (card) { card.querySelector('.technical-form').open = true; card.scrollIntoView({ block: 'start' }); card.querySelector('[name=outcome]').focus(); }
      else practiceFromEvidence(review, true);
    } else if (review) practiceFromEvidence(review, true);
  }
  if (element.dataset.document) { event.preventDefault(); openDocument(element.dataset.document, element.dataset.anchor).catch(error => status(error.message, true)); }
  if (element.dataset.problem) {
    event.preventDefault(); if ($('reader').open) $('reader').close();
    openProblem(element.dataset.problem).catch(error => status(error.message, true));
  }
  if (element.dataset.topicQuestion) {
    const topic = state.topicData.find(topic => topic.path === element.dataset.topicQuestion);
    setPractice({ itemId: topic.practice.itemId, question: topic.practice.question, document: topic.path, framework: topic.name === 'System Design' ? 'System Design' : 'Technical concept' }, true);
  }
});

async function refreshData() {
  state.data = await api('/api/data'); renderDSA(); renderToday(); showSpeakingHistory();
  for (const card of document.querySelectorAll('.js-question')) {
    const latest = state.data.evidence.latest['speaking:' + card.dataset.itemId];
    if (latest) card.querySelector('.js-saved').textContent = `Last saved ${latest.date}: explanation ${latest.explanation}${latest.communicationGap ? ' · ' + latest.communicationGap : ''}`;
  }
  for (const card of $('topicIndex').children) {
    const latest = state.data.evidence.latest['technical:' + card.dataset.itemId];
    if (latest) card.querySelector('.technical-saved').textContent = `Last saved ${latest.date}: ${latest.outcome} · explanation ${latest.explanation}`;
  }
  for (const [file] of state.editors) { const block = [...document.querySelectorAll('.problem-block')].find(block => block.dataset.path === file); if (block?.querySelector('.saved-evidence')) showLastAttempt(file, block); }
}
$('refresh').addEventListener('click', async () => {
  try { await refreshData(); status('Repository data refreshed. Editor drafts and temporary speaking fields were kept.'); }
  catch (error) { status(error.message, true); }
});
function evidenceChoices(value) { return ({ Yes: 'yes', Partially: 'partial', No: 'no' })[value] || 'unknown'; }
function attemptForm(panel, file, id) {
  const read = name => panel.querySelector(`[name=${name}]`).value;
  const outcome = ({ 'Solved independently': 'independent', 'Needed hint': 'hinted', 'Studied solution': 'studied_solution', 'Failed / revisit': 'failed' })[read('attempt')];
  if (!outcome) throw new Error('Choose the actual attempt result first.');
  return { id, track: 'dsa', itemId: file, attemptType: read('attemptType') || 'first_attempt', outcome,
    minutes: read('minutes') === '' ? null : Number(read('minutes')), confidence: read('confidence') === '' ? null : Number(read('confidence')),
    explanation: evidenceChoices(read('explanation')), technicalGap: read('technicalGap'), communicationGap: read('communicationGap'), mistakeOrInsight: read('mistakeOrInsight'), question: findItem(file).question };
}
function showLastAttempt(file, panel) {
  const previous = state.data?.evidence.latest['dsa:' + file];
  const summary = panel.querySelector('.saved-evidence'); if (!summary) return;
  summary.textContent = previous ? `Last saved ${previous.date}: ${previous.outcome} · explanation ${previous.explanation} · ${previous.minutes ?? 'unknown'} minutes · confidence ${previous.confidence ?? 'unknown'}${previous.technicalGap ? ' · technical gap: ' + previous.technicalGap : ''}${previous.communicationGap ? ' · communication gap: ' + previous.communicationGap : ''}` : 'No attempt evidence yet; historical completion is separate.';
}
function showSpeakingHistory() {
  const itemId = state.practice?.itemId;
  const latest = state.data?.evidence.events.filter(event => event.itemId === itemId && event.explanation !== 'unknown').at(-1);
  const review = state.data?.evidence.reviewStates.find(item => item.itemId === itemId && item.channel === 'speaking');
  $('speakingSaved').textContent = latest ? `Last saved ${latest.date}: explanation ${latest.explanation} · confidence ${latest.confidence ?? 'unknown'}${latest.communicationGap ? ' · ' + latest.communicationGap : ''}` : 'No saved explanation evidence for this question.';
  $('nextSpeakingReview').value = review?.nextDue || (review?.maintenance ? 'Consolidated — optional maintenance' : 'No recorded schedule yet');
}
function practiceFromEvidence(item, navigate = true) {
  const itemId = item.itemId;
  const js = jsQuestions.find(question => question.itemId === itemId);
  const document = itemId.startsWith('topic:') ? itemId.slice(6) : null;
  const problem = findItem(itemId) ? itemId : null;
  const attemptType = item.lastAttempt?.attemptType || item.attemptType;
  const frameworks = { project: 'Project explanation', behavioral: 'Behavioral', system_design: 'System Design' };
  const framework = problem ? 'DSA' : document === '08-System-Design.md' ? 'System Design' : frameworks[attemptType] || 'Technical concept';
  setPractice({ itemId, question: item.question || js?.q || item.title, framework,
    ...(problem ? { problem } : {}), ...(document ? { document } : {}), ...(js ? { reference: js.answer, attemptType: 'js_core' } : {}) }, navigate);
}
$('saveSpeaking').addEventListener('click', async () => {
  const button = $('saveSpeaking'); button.disabled = true;
  try {
    if (!$('notesFree').value) throw new Error('Choose Yes, Partially or No after checking the reference.');
    if (!state.practice?.itemId || !$('speakingQuestion').value.trim()) throw new Error('Choose or enter a real practice question first.');
    const types = { DSA: 'dsa_explanation', 'Project explanation': 'project', Behavioral: 'behavioral', 'System Design': 'system_design' };
    const body = { id: state.practice.submissionId, track: 'speaking', itemId: state.practice.itemId,
      attemptType: state.practice.attemptType || types[state.practice.framework] || 'technical_explanation', question: $('speakingQuestion').value,
      explanation: evidenceChoices($('notesFree').value), confidence: $('speakingConfidence').value === '' ? null : Number($('speakingConfidence').value),
      technicalGap: $('technicalGap').value, communicationGap: $('communicationGap').value, usefulPhrase: $('usefulPhrase').value };
    const result = await post('/api/attempts', body);
    // Clear saved gaps to avoid treating them as unsaved work on navigation.
    $('technicalGap').value = ''; $('communicationGap').value = ''; $('usefulPhrase').value = '';
    await refreshData(); $('speakingSaved').textContent += ' · Evidence saved to repository.';
    status(`Speaking evidence saved: ${result.event.explanation}.`);
  } catch (error) { button.disabled = false; status('Speaking save failed: ' + error.message, true); }
});
$('newSpeakingQuestion').addEventListener('click', () => {
  if (['technicalGap', 'communicationGap'].some(id => $(id).value.trim()) && !confirm('Start a new question? Unsaved gaps will be cleared.')) return;
  setPractice({ itemId: 'custom:' + crypto.randomUUID(), question: '', framework: state.practice?.framework || 'Technical concept' }, false);
  $('speakingQuestion').focus();
});
$('newSpeakingAttempt').addEventListener('click', () => {
  if (!state.practice) return;
  const practice = { ...state.practice }; setPractice(practice, false);
});
function setupJSSave(card, item) {
  let submissionId = crypto.randomUUID();
  const save = card.querySelector('.save-js');
  save.addEventListener('click', async () => {
    save.disabled = true;
    try {
      const outcome = card.querySelector('[name=js-explanation]').value;
      if (!outcome) throw new Error('Choose a notes-free outcome after checking the answer.');
      const result = await post('/api/attempts', { id: submissionId, track: 'speaking', itemId: item.itemId, attemptType: 'js_core', explanation: evidenceChoices(outcome),
        confidence: card.querySelector('[name=confidence]').value === '' ? null : Number(card.querySelector('[name=confidence]').value),
        technicalGap: card.querySelector('[name=technicalGap]').value, communicationGap: card.querySelector('[name=communicationGap]').value });
      await refreshData(); card.querySelector('.js-saved').textContent = `Saved ${result.event.date}: explanation ${result.event.explanation}. Reload preserves this evidence.`;
      state.jsOutcomes.delete(item.itemId);
      // Explicit save again after a new choice records a new attempt, not a mastery toggle.
    } catch (error) { save.disabled = false; card.querySelector('.js-saved').textContent = 'Save failed: ' + error.message; }
  });
  const again = document.createElement('button'); again.textContent = 'New speaking attempt';
  again.addEventListener('click', () => { submissionId = crypto.randomUUID(); save.disabled = false; card.querySelectorAll('input, select').forEach(input => { input.value = ''; }); card.querySelector('.js-answer').hidden = true; card.querySelector('.reveal').textContent = 'Reveal Answer'; });
  card.querySelector('.js-answer').append(again);
}
function addTechnicalForm(card, item) {
  card.dataset.itemId = item.itemId;
  const form = document.createElement('details'); form.className = 'technical-form'; form.innerHTML = `<summary>Record retrieval / practical evidence</summary><p class="muted">Self-reported technical evidence; this does not automatically complete or certify a topic.</p>${selectMarkup('Task type', ['retrieval', 'practical_task'], 'type')}${selectMarkup('Outcome', ['independent', 'hinted', 'studied_solution', 'failed'], 'outcome')}${selectMarkup('Explanation', ['Yes', 'Partially', 'No'], 'explanation')}<details><summary>Optional details</summary>${selectMarkup('Confidence', ['1', '2', '3', '4', '5'], 'confidence')}<label>Minutes<input name=minutes type=number min=0 max=720></label><label>Technical gap<input name=technicalGap maxlength=240></label><label>Communication gap<input name=communicationGap maxlength=240></label><label>Mistake / insight<input name=mistakeOrInsight maxlength=240></label></details><button class=save-technical>Save technical evidence</button><button class=new-technical>New attempt</button><p class=technical-saved role=status></p>`;
  const previous = state.data.evidence.latest['technical:' + item.itemId];
  form.querySelector('.technical-saved').textContent = previous ? `Last saved ${previous.date}: ${previous.outcome} · explanation ${previous.explanation}` : 'No technical attempt evidence yet.';
  let submissionId = crypto.randomUUID();
  form.querySelector('.new-technical').addEventListener('click', () => { submissionId = crypto.randomUUID(); form.querySelectorAll('input, select').forEach(input => { input.value = ''; }); form.querySelector('.save-technical').disabled = false; });
  form.querySelector('.save-technical').addEventListener('click', async event => {
    const button = event.target; button.disabled = true;
    const read = name => form.querySelector(`[name=${name}]`).value;
    try {
      if (!read('outcome')) throw new Error('Choose the actual outcome.');
      const result = await post('/api/attempts', { id: submissionId, track: 'technical', itemId: item.itemId, attemptType: read('type') || 'retrieval', outcome: read('outcome'),
        explanation: evidenceChoices(read('explanation')), confidence: read('confidence') === '' ? null : Number(read('confidence')), minutes: read('minutes') === '' ? null : Number(read('minutes')),
        technicalGap: read('technicalGap'), communicationGap: read('communicationGap'), mistakeOrInsight: read('mistakeOrInsight') });
      await refreshData(); form.querySelector('.technical-saved').textContent = `Saved ${result.event.date}: ${result.event.outcome} · explanation ${result.event.explanation}.`;
    } catch (error) { button.disabled = false; form.querySelector('.technical-saved').textContent = 'Save failed: ' + error.message; }
  });
  card.append(form);
}

function focusFields(focus) {
  for (const [key, id] of Object.entries({ technical: 'nextTechnical', dsa: 'nextDSA', speaking: 'nextSpeaking', practical: 'nextPractical', mock: 'nextMock' })) $(id).value = focus[key] || '';
}
function renderAdvanceGuard() {
  const view = state.data.evidence.planning; const advance = $('phaseDecision').value === 'advance';
  $('advanceGuard').hidden = !advance || !view.warnings.length;
  $('advanceWarnings').innerHTML = '<p>Evidence to consider before phase advance:</p><ul>' + view.warnings.map(warning => `<li>${html(warning)}</li>`).join('') + '</ul>';
}
function renderPlanning() {
  const view = state.data.evidence.planning; const p = view.state;
  $('planningSetup').hidden = view.initialized; $('weeklyReviewForm').hidden = !view.initialized;
  $('openWeeklyReview').hidden = !view.initialized;
  if (!$('setupPhase').options.length) $('setupPhase').innerHTML = view.phases.map(phase => `<option value="${phase.id}">${html(phase.name)}</option>`).join('');
  $('dsaFocusOptions').innerHTML = state.data.evidence.dsa.patterns.filter(pattern => pattern.coreTotal).map(pattern => `<option value="${html(pattern.name)}">${html(pattern.state)}</option>`).join('') + state.data.topics.map(topic => `<option value="${html(topic.name)}"></option>`).join('');
  $('reviewReminder').hidden = !view.reviewRecommended;
  if (!view.initialized) {
    $('planningHeader').textContent = 'Learning phase/week not configured yet.';
    $('planningFocus').textContent = ''; $('planningBudget').hidden = true; $('carrySummary').textContent = '';
    $('progressPlanning').textContent = 'Initialize an explicit phase/week in Today. No phase is inferred from calendar dates.';
    $('weekOverview').innerHTML = '<p>Set your starting plan in Today first. Historical completions remain unchanged.</p>';
    $('weekOverview').append(actionButton('Open planning setup', { section: 'today' })); return;
  }
  const header = `Phase ${p.phaseId.split('-')[1]} — ${view.phase.name} · Learning week ${p.learningWeek}`;
  $('planningHeader').textContent = header;
  $('planningFocus').textContent = `This week: ${p.weeklyFocus.technical} · DSA: ${p.weeklyFocus.dsa || 'No new focus'} · Speaking: ${p.weeklyFocus.speaking}`;
  $('planningBudget').hidden = false; $('planningBudget').textContent = `${p.availableHours} available hours · ${view.budget.message} Ceiling: ${view.budget.maxNewProblems} new problems.`;
  $('carrySummary').textContent = [...p.carryForward.map(item => `${item.role === 'essential' ? 'Essential' : 'Small secondary'} carry-forward: ${item.text}`), ...(p.firstTask ? [`First session step: ${p.firstTask}`] : [])].join(' · ');
  const planSummary = `<p><strong>${html(header)}</strong></p><p>Primary: ${html(p.weeklyFocus.technical)} · DSA: ${html(p.weeklyFocus.dsa || 'None')} · Speaking: ${html(p.weeklyFocus.speaking)}</p><p>Practical: ${html(p.weeklyFocus.practical || 'None')} · Mock: ${html(p.weeklyFocus.mock || 'None')}</p><p>${Number((view.summary.minutes / 60).toFixed(1))} recorded hours / ${p.availableHours} available hours (${view.summary.unknownTime} events with unknown time). Status: ${html(p.status)}.</p><p>Last weekly review: ${html(view.lastReview?.date || 'Not reviewed yet')} · Next review recommended: ${view.reviewRecommendedOn}. Calendar dates do not advance learning weeks.</p>`;
  $('progressPlanning').innerHTML = planSummary + `<p>Due revision: ${state.data.evidence.review.dueCount} channels; ${view.summary.overdue} overdue. Daily selection stays bounded.</p>`;
  $('weekOverview').innerHTML = '<h3>This week</h3>' + planSummary;
  $('reviewEvidence').innerHTML = '<h3>What happened?</h3><h4>Recent demonstrated outputs (recorded, not permanent mastery)</h4><ul>' + (view.summary.outputs.map(item => `<li>${html(item.title)} · ${html(item.track)} / ${html(item.attemptType)} · ${html(item.outcome || 'explanation ' + item.explanation)}</li>`).join('') || '<li>No successful output evidence in this review window.</li>') + '</ul>' + evidenceText(view.summary) + `<p>Practical attempts: ${view.summary.practical} (${view.summary.successfulPractical} independent). Recorded timed DSA mocks: ${view.summary.mocks}; other mock history is unknown.</p><p>Technically successful but explanation partial/no: ${view.summary.knewButCouldNotExplain} paired events. This is a proxy; private understanding is not measurable.</p>` + ['recurringTechnicalGaps', 'recurringCommunicationGaps'].map(key => `<h4>${key === 'recurringTechnicalGaps' ? 'Technical gaps / forgotten points' : 'English communication gaps'}</h4><ul>${view.summary[key].map(gap => `<li>${html(gap.text)} — ${gap.count} records</li>`).join('') || '<li>No gap evidence recorded.</li>'}</ul>`).join('') + '<h4>Current weak items</h4><ul>' + (view.summary.weakItems.map(item => `<li>${html(item.title)} (${html(item.topic)}, ${html(item.channel)}) — ${html(item.reason)}</li>`).join('') || '<li>No recorded weakness; this does not prove readiness.</li>') + '</ul>';
  const patterns = view.summary.dsaPatterns;
  if (patterns) $('reviewEvidence').insertAdjacentHTML('beforeend', `<h4>DSA pattern evidence</h4><p>${patterns.independentCoreAttempts} independent core attempts · ${patterns.transferAttempts} transfer attempts.</p>` + [['Patterns practiced', patterns.patternsPracticed], ['Need review', patterns.patternsNeedingReview], ['Ready for transfer candidate', patterns.patternsReadyForTransfer], ['Explanation weakness', patterns.patternsWithExplanationWeakness]].map(([label, values]) => `<p>${label}: ${html(values.join(' · ') || 'None recorded')}</p>`).join(''));
  $('planningSuggestions').innerHTML = '<h3>Planning suggestions</h3><ul>' + (view.suggestions.map(suggestion => `<li>${html(suggestion)}</li>`).join('') || '<li>Not enough evidence for a change recommendation. Keep scope small.</li>') + '</ul>';
  $('phaseExit').innerHTML = `<details><summary>Phase purpose and exit evidence</summary><p>${html(view.phase.purpose)}</p><p>Outputs: ${html(view.phase.outputs)}</p><p>DSA: ${html(view.phase.dsa)}</p><p>Communication: ${html(view.phase.communication)}</p><p>Practical: ${html(view.phase.practical)}</p><p>Mocks: ${html(view.phase.mocks)}</p><ul>${view.phase.exit.map(item => `<li>${html(item)}</li>`).join('')}</ul><p>Phase learning weeks so far: ${view.phaseWeek}; baseline ${view.phase.weeks}. Baselines are not deadlines. Continue stays in this phase; Advance is intentional.</p></details>`;
  // Refresh evidence without destroying unsaved decisions in an open review.
  if (state.reviewDraftRevision !== p.revision) {
    state.reviewDraftRevision = p.revision; state.reviewSubmissionId = crypto.randomUUID();
    $('reviewHours').value = p.availableHours; $('busyWeek').checked = p.busyWeek;
    $('carryEssential').value = ''; $('carrySecondary').value = ''; $('deprioritize').value = ''; $('reviewReflection').value = '';
    focusFields(p.weeklyFocus); $('nextFirstTask').value = p.firstTask || 'Start with one due retrieval, then the main focus.';
    $('phaseDecision').value = 'continue'; $('confirmAdvance').checked = false;
    $('phaseDecision').querySelector('[value=advance]').disabled = p.phaseId === 'phase-5';
    renderAdvanceGuard();
  }
  $('weeklyHistory').innerHTML = '<h3>Saved weekly reviews</h3>' + (view.history.map(review => `<details><summary>${html(review.date)} · Week ${review.from.learningWeek} · ${html(review.decision)}</summary><p>${html(review.from.phaseId)} → ${html(review.to.phaseId)} · Learning week ${review.to.learningWeek}</p>${evidenceText(review.summary)}<p>Next focus: ${html(review.to.weeklyFocus.technical)} · Speaking: ${html(review.to.weeklyFocus.speaking)}</p><p>Carry-forward: ${html(review.to.carryForward.map(item => item.text).join(' · ') || 'None')}</p><p>Stopped/deprioritized: ${html(review.submission.deprioritize || 'None recorded')}</p><p>Reflection: ${html(review.submission.reflection || 'None recorded')}</p><p>First task: ${html(review.to.firstTask)}</p>${review.warnings.length ? `<p>Warnings acknowledged: ${html(review.warnings.join(' · '))}</p>` : ''}</details>`).join('') || '<p>No weekly decisions saved yet.</p>');
}
$('setupPath').addEventListener('change', () => { $('manualSetup').hidden = $('setupPath').value !== 'manual'; });
$('setupPhase').addEventListener('change', () => { $('setupWeek').value = state.data.evidence.planning.phases.find(phase => phase.id === $('setupPhase').value).startWeek; });
$('planningSetup').addEventListener('submit', async event => {
  event.preventDefault(); const button = event.target.querySelector('[type=submit]'); button.disabled = true;
  try {
    const manual = $('setupPath').value === 'manual';
    await post('/api/planning', { phaseId: manual ? $('setupPhase').value : 'phase-1', learningWeek: manual ? Number($('setupWeek').value) : 1, availableHours: Number($('setupHours').value) });
    state.practice = null; await refreshData(); status('Starting plan saved. Learning week changes only through Weekly Review.');
  } catch (error) { $('setupResult').textContent = 'Setup save failed: ' + error.message; status(error.message, true); }
  finally { button.disabled = false; }
});
$('phaseDecision').addEventListener('change', () => {
  const view = state.data.evidence.planning;
  if ($('phaseDecision').value === 'advance') {
    const phase = view.phases[view.phases.findIndex(phase => phase.id === view.state.phaseId) + 1];
    if (phase) focusFields(phase.defaults);
  }
  $('confirmAdvance').checked = false; renderAdvanceGuard();
});
$('weeklyReviewForm').addEventListener('submit', async event => {
  event.preventDefault(); const button = event.target.querySelector('[type=submit]'); button.disabled = true;
  const carryForward = [['essential', 'carryEssential'], ['secondary', 'carrySecondary']].filter(([, id]) => $(id).value.trim()).map(([role, id]) => {
    const value = $(id).value.trim(); const item = state.data.flatQueue.find(item => item.relPath === value);
    const topic = state.topicData.find(item => item.practice.itemId === value || item.path === value);
    return { role, text: value, ...(item ? { itemId: item.relPath } : topic ? { itemId: topic.practice.itemId } : {}) };
  });
  try {
    await post('/api/weekly-reviews', { id: state.reviewSubmissionId, expectedRevision: state.reviewDraftRevision,
      availableHours: Number($('reviewHours').value), busyWeek: $('busyWeek').checked, carryForward, deprioritize: $('deprioritize').value,
      nextFocus: { technical: $('nextTechnical').value, dsa: $('nextDSA').value, speaking: $('nextSpeaking').value, practical: $('nextPractical').value, mock: $('nextMock').value },
      decision: $('phaseDecision').value, reflection: $('reviewReflection').value, firstTask: $('nextFirstTask').value, confirmAdvance: $('confirmAdvance').checked });
    // Next suggestion can change after review; saved speaking history stays intact.
    state.practice = null; await refreshData(); $('reviewSaveResult').textContent = 'Weekly review saved. Today and Progress now use these decisions.';
    status('Weekly review saved. No backlog was added automatically.');
  } catch (error) { $('reviewSaveResult').textContent = 'Review not saved: ' + error.message; if (error.data?.needsConfirmation) { $('advanceGuard').hidden = false; $('advanceWarnings').textContent = error.data.warnings.join(' · '); } }
  finally { button.disabled = false; }
});

async function start() {
  switchSection('today', false); // A normal launch always starts with Today, not a stale saved tab.
  try {
    const [data, english, topics, mocks] = await Promise.all([api('/api/data'), api('/api/english'), api('/api/topics'), api('/api/content?path=Mock-Interviews%2FREADME.md')]);
    state.data = data; state.topicData = topics; renderEnglish(english); renderDSA(); renderToday(); renderTopics(topics); renderJS(); $('mockContent').innerHTML = mocks.html;
    status('Ready. Start with the main task or a small review.');
    const params = new URLSearchParams(location.search);
    if (params.has('doc')) await openDocument(params.get('doc'), location.hash.slice(1));
    else if (params.has('problem')) await openProblem(params.get('problem'));
  } catch (error) { status(`Could not load preparation data: ${error.message}. Check the server terminal, then Refresh data or reload.`, true); }
}
start();

const { addDays, deriveReviewStates } = require('./revision');
const STATES = ['Not Started', 'Learning', 'Practicing', 'Demonstrated', 'Transfer Needed', 'Strong Recent Evidence', 'Needs Review'];
const meaningful = gap => gap && !/^(none|no gap|n\/a)$/i.test(gap.trim());
const verified = state => ['tests_passed', 'self_certified'].includes(state?.lastAttempt?.verification);
function derivePatterns(progress, registry, reviewStates, date) {
  const items = [...registry.values()].filter(item => item.kind === 'dsa');
  const recentFrom = addDays(date, -29);
  const events = progress.events.filter(event => event.date <= date && registry.get(event.itemId)?.kind === 'dsa');
  const coding = new Map(reviewStates.filter(item => item.channel === 'coding').map(item => [item.itemId, item]));
  const speaking = new Map(reviewStates.filter(item => item.channel === 'speaking').map(item => [item.itemId, item]));
  const known = new Set([...events.map(event => event.itemId), ...progress.entries.map(entry => entry.problem + '.js')]);
  const evidence = {};
  for (const item of items) {
    const attempts = events.filter(event => event.itemId === item.itemId && event.track === 'dsa');
    const code = coding.get(item.itemId); const speech = speaking.get(item.itemId);
    evidence[item.itemId] = { latestOutcome: attempts.at(-1)?.outcome || 'unknown', lastIndependent: attempts.filter(event => event.outcome === 'independent').at(-1)?.date || null,
      explanation: speech?.latestOutcome || 'unknown', nextDue: code?.nextDue || null, speakingDue: speech?.nextDue || null,
      weak: !!(code?.weak || speech?.weak), attempted: attempts.length > 0, delayed: !!code?.delayedSuccesses,
      clear: speech?.latestOutcome === 'yes' && speech.lastDate >= recentFrom && !speech.weak && !meaningful(speech.lastAttempt?.technicalGap),
      recent: !!code && code.lastDate >= recentFrom, known: known.has(item.itemId) };
  }
  const definitions = new Map(items.map(item => [item.patternId, item.patternDefinition]));
  const patterns = [...definitions.values()].map(def => {
    const members = items.filter(item => item.patternId === def.id);
    const core = members.filter(item => item.role === 'CORE');
    const transfers = members.filter(item => item.role === 'TRANSFER');
    const relevant = events.filter(event => members.some(item => item.itemId === event.itemId));
    const attempts = relevant.filter(event => event.track === 'dsa' && registry.get(event.itemId).role !== 'OPTIONAL');
    const independent = core.filter(item => evidence[item.itemId].latestOutcome === 'independent' && evidence[item.itemId].recent && !coding.get(item.itemId)?.weak && verified(coding.get(item.itemId)));
    const recalled = independent.filter(item => evidence[item.itemId].delayed && evidence[item.itemId].clear);
    const ready = independent.filter(item => evidence[item.itemId].clear).length >= def.minIndependentCore && recalled.length > 0;
    const transferCandidate = ready ? transfers.find(item => !known.has(item.itemId)) : null;
    // A solution studied before core recall is later retrieval, not transfer proof.
    // Replay the prefix before the first recorded transfer attempt so later core
    // reviews cannot retroactively qualify an early attempt or invalidate valid proof.
    function eligibleAtFirstAttempt(item) {
      const firstIndex = events.findIndex(event => event.itemId === item.itemId);
      if (firstIndex < 0 || events[firstIndex].track !== 'dsa' || events[firstIndex].outcome !== 'independent' || !['tests_passed', 'self_certified'].includes(events[firstIndex].verification) ||
          progress.entries.some(entry => entry.problem + '.js' === item.itemId)) return false;
      const first = events[firstIndex];
      const before = deriveReviewStates(events.slice(0, firstIndex), registry);
      const codes = new Map(before.filter(value => value.channel === 'coding').map(value => [value.itemId, value]));
      const speeches = new Map(before.filter(value => value.channel === 'speaking').map(value => [value.itemId, value]));
      const clearCore = core.filter(value => {
        const code = codes.get(value.itemId), speech = speeches.get(value.itemId);
        return code?.latestOutcome === 'independent' && verified(code) && !code.weak && code.lastDate >= addDays(first.date, -29) &&
          speech?.latestOutcome === 'yes' && speech.lastDate >= addDays(first.date, -29) && !speech.weak && !meaningful(speech.lastAttempt?.technicalGap);
      });
      return clearCore.length >= def.minIndependentCore && clearCore.some(value => codes.get(value.itemId).delayedSuccesses > 0);
    }
    const successfulTransfer = ready && transfers.some(item => evidence[item.itemId].latestOutcome === 'independent' && evidence[item.itemId].recent && evidence[item.itemId].clear && !coding.get(item.itemId)?.weak && verified(coding.get(item.itemId)) && eligibleAtFirstAttempt(item));
    const communicationWeakness = members.some(item => item.role !== 'OPTIONAL' && speaking.get(item.itemId)?.weak && speaking.get(item.itemId).lastDate >= recentFrom);
    const weakness = members.find(item => item.role !== 'OPTIONAL' &&
      (coding.get(item.itemId)?.weak && coding.get(item.itemId).lastDate >= recentFrom ||
       speaking.get(item.itemId)?.weak && speaking.get(item.itemId).lastDate >= recentFrom));
    const last = attempts.at(-1); let state;
    if (weakness) state = attempts.some(event => event.outcome === 'independent') ? 'Needs Review' : 'Learning';
    else if (!attempts.length) state = 'Not Started';
    else if (successfulTransfer || ready && !transfers.length && recalled.some(item => coding.get(item.itemId).delayedSuccesses >= 2)) state = 'Strong Recent Evidence';
    else if (ready) state = transfers.length ? 'Transfer Needed' : 'Demonstrated';
    else state = attempts.some(event => event.outcome === 'independent') ? 'Practicing' : 'Learning';
    const reviewItem = weakness || core.find(item => evidence[item.itemId].attempted && !evidence[item.itemId].delayed);
    const nextItem = reviewItem || transferCandidate || core.find(item => !evidence[item.itemId].attempted) || core[0] || members.find(item => item.role === 'SUPPORTING');
    const action = weakness ? `Review ${weakness.title}${communicationWeakness ? ' and explain the invariant without notes' : ''}` : transferCandidate ? `Solve transfer candidate: ${transferCandidate.title}` : nextItem ? `${evidence[nextItem.itemId].attempted ? 'Retrieve / explain' : 'Attempt'} ${nextItem.title}` : 'Choose a variation or maintain recall.';
    return { ...def, state, coreTotal: core.length, coreAttempted: core.filter(item => evidence[item.itemId].attempted).length,
      independentCore: independent.length, delayedCore: recalled.length, transferEligible: ready, transferCandidate: transferCandidate?.itemId || null,
      communicationWeakness, weakness: weakness ? coding.get(weakness.itemId)?.reason || speaking.get(weakness.itemId)?.reason : null,
      recentEvidence: last ? `${last.date}: ${last.outcome}; explanation ${evidence[last.itemId].explanation}` : 'No recorded solving evidence; completion alone leaves readiness unknown.',
      nextAction: action, nextItem: nextItem?.itemId || null, members: members.map(item => item.itemId),
      recentAttempts: relevant.slice(-6).reverse().map(event => ({ id: event.id, date: event.date, title: event.title, itemId: event.itemId, track: event.track, outcome: event.outcome, explanation: event.explanation })) };
  });
  return { patterns, evidence, roles: Object.fromEntries(['CORE','SUPPORTING','TRANSFER','OPTIONAL'].map(role => [role, items.filter(item => item.role === role).length])), total: items.length };
}
function patternWeeklySummary(events, registry, patterns) {
  const dsa = events.filter(event => event.track === 'dsa' && registry.get(event.itemId)?.kind === 'dsa');
  const practiced = new Set(dsa.map(event => registry.get(event.itemId).patternId));
  const names = selected => patterns.filter(selected).map(pattern => pattern.name);
  return { patternsPracticed: names(pattern => practiced.has(pattern.id)), independentCoreAttempts: dsa.filter(event => event.outcome === 'independent' && registry.get(event.itemId).role === 'CORE').length,
    transferAttempts: dsa.filter(event => registry.get(event.itemId).role === 'TRANSFER').length,
    patternsNeedingReview: names(pattern => ['Needs Review','Learning'].includes(pattern.state)),
    patternsReadyForTransfer: names(pattern => !!pattern.transferCandidate), patternsWithExplanationWeakness: names(pattern => pattern.communicationWeakness) };
}
function matchesFocus(text, item) {
  const norm = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return text.split(/\+|,|\/|\band\b/i).map(norm).filter(Boolean).some(part => [item.topic, item.pattern, item.patternId].some(value => value && (norm(value).includes(part) || part.includes(norm(value)))));
}
function selectDSA(progress, registry, queue, checklist, patterns, evidence, focus = '', phaseId = 'phase-1') {
  const ordered = queue.map(entry => ({ ...entry, ...registry.get(entry.relPath) })).filter(item => item.kind === 'dsa');
  const phase = phaseId === 'phase-1' ? 'phase-1' : 'phase-2';
  const norm = value => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const exact = patterns.find(pattern => norm(pattern.name) === norm(focus) || norm(pattern.id) === norm(focus));
  const applicable = ordered.filter(item => exact ? item.patternId === exact.id : !focus || matchesFocus(focus, item));
  const pools = focus ? [applicable] : [applicable.filter(item => item.patternDefinition.defaultPhase === phase), applicable];
  for (const pool of pools) {
    const weakCore = pool.find(item => item.role === 'CORE' && evidence[item.itemId]?.weak);
    if (weakCore) {
      const attempts = progress.events.filter(event => event.track === 'dsa' && event.itemId === weakCore.itemId);
      const support = pool.find(item => item.role === 'SUPPORTING' && item.patternId === weakCore.patternId && !evidence[item.itemId].known);
      if (attempts.length >= 2 && support) return { ...support, reason: 'Supporting practice selected because repeated core attempts still need help; return to delayed core recall afterward.' };
      return { ...weakCore, reason: 'Selected because this core pattern needs practice and explanation.' };
    }
    const transfer = pool.find(item => item.role === 'TRANSFER' && patterns.some(pattern => pattern.transferCandidate === item.itemId));
    if (transfer) return { ...transfer, reason: 'Transfer candidate: delayed independent core recall and clear explanation support applying the pattern to a different contract. No prior recorded attempt; novelty outside this repo is unknown.' };
    // Checked legacy completion is known, not readiness. Offer it as baseline retrieval,
    // while starting the new core path with unchecked representatives in relative queue order.
    const core = pool.find(item => item.role === 'CORE' && !checklist.get(item.itemId)?.checked && !evidence[item.itemId].attempted && !item.challenge)
      || pool.find(item => item.role === 'CORE' && !checklist.get(item.itemId)?.checked && !evidence[item.itemId].attempted)
      || pool.find(item => item.role === 'CORE' && (!evidence[item.itemId].delayed || !evidence[item.itemId].recent || !evidence[item.itemId].clear));
    if (core) return { ...core, reason: focus ? 'Selected because this is your current DSA focus; curated core order is retained within that focus.' : 'Next core representative in the phase guidance; checklist completion alone is not readiness.' };
  }
  return null; // Optional/challenge depth is manual; no finish-all-library fallback.
}
module.exports = { STATES, derivePatterns, patternWeeklySummary, matchesFocus, selectDSA };

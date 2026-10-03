function aggregate(events) {
  const dsa = events.filter(event => event.track === 'dsa');
  const explanations = events.filter(event => event.explanation !== 'unknown');
  const count = outcome => dsa.filter(event => event.outcome === outcome).length;
  const gaps = name => {
    const counts = new Map();
    for (const event of events) if (event[name] && !/^(none|no gap|n\/a)$/i.test(event[name])) { const key = event[name].trim().toLowerCase(); const item = counts.get(key) || { text: event[name], count: 0 }; item.count++; counts.set(key, item); }
    return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  };
  return { attempts: { independent: count('independent'), hinted: count('hinted'), studied_solution: count('studied_solution'), failed: count('failed') },
    reviewsCompleted: dsa.filter(event => event.attemptType === 'review').length,
    reviewSuccesses: dsa.filter(event => event.attemptType === 'review' && event.outcome === 'independent').length,
    explanations: { total: explanations.length, yes: explanations.filter(event => event.explanation === 'yes').length, partial: explanations.filter(event => event.explanation === 'partial').length, no: explanations.filter(event => event.explanation === 'no').length },
    minutes: events.reduce((sum, event) => sum + (event.minutes || 0), 0), unknownTime: events.filter(event => event.minutes === null).length,
    recurringTechnicalGaps: gaps('technicalGap'), recurringCommunicationGaps: gaps('communicationGap') };
}
module.exports = { aggregate };

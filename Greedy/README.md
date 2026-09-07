# Greedy

## Pattern

Make the locally best choice at every step, and trust (or prove) that never
backtracking still reaches a globally optimal answer. Almost always starts
with sorting by some key, then a single pass making the obvious choice.

**Recognize it when:** "maximize/minimize given intervals or resources",
"activity selection", "can I always safely take the best option available
right now".

**Template:**
```js
items.sort((a, b) => a.end - b.end);
let count = 0, lastEnd = -Infinity;
for (const item of items) {
  if (item.start >= lastEnd) { count++; lastEnd = item.end; }
}
```

**Complexity:** O(n log n), dominated by the initial sort.

**Watch out for:** a greedy choice you can't explain *why* is safe is
usually a guess, not a proof — if you can't articulate the exchange
argument (why swapping in a different choice never helps), the problem is
probably DP instead, not greedy.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Jump Game](./jump-game.js)
- [Jump Game II](./jump-game-ii.js)
- [Gas Station](./gas-station.js)
- [Hand of Straights](./hand-of-straights.js)
- [Merge Triplets to Form Target Triplet](./merge-triplets-to-form-target-triplet.js)
- [Partition Labels](./partition-labels.js)
- [Valid Parenthesis String](./valid-parenthesis-string.js)
- [Best Time to Buy and Sell Stock II](./best-time-to-buy-and-sell-stock-ii.js)
- [Assign Cookies](./assign-cookies.js)
- [Lemonade Change](./lemonade-change.js)

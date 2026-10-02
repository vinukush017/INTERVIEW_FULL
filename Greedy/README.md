# Greedy

## Pattern

Make a locally optimal choice at each step and justify why it preserves a
globally optimal solution. Sorting is common in interval/resource problems,
but is not required for every greedy algorithm. The important part is why
the choice is safe, not whether the code starts with a sort.

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

**Complexity:** O(n log n) for the interval-selection template above,
dominated by sorting. Other greedy algorithms have different costs.

**Watch out for:** an intuitive choice still needs justification, such as
an exchange argument, a stays-ahead argument, or an invariant. Try small
counterexamples first. Not finding a proof immediately does not mean the
problem is DP. Consider DP when alternatives require exploring subproblem
states/history rather than safely committing to one local choice.

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

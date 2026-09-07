# Dynamic Programming

## Pattern

A problem has overlapping subproblems and optimal substructure — the answer
to a bigger case is built from answers to smaller cases, and those smaller
cases get asked more than once. Write the brute-force recursion first, spot
which calls repeat, then cache them (memoization = top-down) or build them
up in a table (tabulation = bottom-up).

**Recognize it when:** "count the number of ways", "minimum/maximum cost to
reach X", "can you partition/reach a target", or you notice your recursion
tree re-asking the same question with the same arguments.

**Template (top-down with memoization):**
```js
const memo = new Map();
function solve(state) {
  if (isBase(state)) return baseValue(state);
  if (memo.has(state)) return memo.get(state);
  const result = combine(solve(smaller1), solve(smaller2));
  memo.set(state, result);
  return result;
}
```

**Complexity:** O(number of distinct states x work per state) — usually far
less than the brute-force recursion's exponential blowup.

**Watch out for:** an incomplete state definition (missing a dimension the
answer actually depends on, like "remaining capacity" alongside "index");
in tabulation, get the base-case row/column right first — everything else
is built from it.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Climbing Stairs](./climbing-stairs.js)
- [Min Cost Climbing Stairs](./min-cost-climbing-stairs.js)
- [House Robber](./house-robber.js)
- [House Robber II](./house-robber-ii.js)
- [Coin Change](./coin-change.js)
- [Word Break](./word-break.js)
- [Longest Increasing Subsequence](./longest-increasing-subsequence.js)
- [Partition Equal Subset Sum](./partition-equal-subset-sum.js)
- [Decode Ways](./decode-ways.js)
- [Longest Common Subsequence](./longest-common-subsequence.js)
- [Edit Distance](./edit-distance.js)
- [N-th Tribonacci Number](./n-th-tribonacci-number.js)
- [Unique Paths](./unique-paths.js)
- [Unique Paths II](./unique-paths-ii.js)
- [Triangle](./triangle.js)

# Backtracking

## Pattern

Recursive DFS over a decision tree: choose an option, recurse into the rest
of the problem, then undo the choice before trying the next option. Pruning
(stopping early on an obviously invalid branch) is what keeps it fast enough
to run in an interview.

**Recognize it when:** "all subsets/permutations/combinations", "N-Queens",
"word search on a grid", "generate every valid X".

**Template:**
```js
function backtrack(path, choices) {
  if (isComplete(path)) { results.push([...path]); return; }
  for (const choice of choices) {
    if (!isValid(choice, path)) continue;
    path.push(choice);          // choose
    backtrack(path, choices);   // explore
    path.pop();                 // undo
  }
}
```

**Complexity:** Exponential in the worst case — the whole point of pruning
is cutting branches before you recurse into them, not after.

**Watch out for:** forgetting the `path.pop()` undo step, which silently
corrupts every later branch; "II" variants (Subsets II, Combination Sum II)
have duplicate input values, so sort first and skip a choice equal to the
previous sibling to avoid duplicate results.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Subsets](./subsets.js)
- [Combination Sum](./combination-sum.js)
- [Combination Sum II](./combination-sum-ii.js)
- [Permutations](./permutations.js)
- [Subsets II](./subsets-ii.js)
- [Word Search](./word-search.js)
- [Palindrome Partitioning](./palindrome-partitioning.js)
- [N-Queens](./n-queens.js)
- [Letter Combinations of a Phone Number](./letter-combinations-of-a-phone-number.js)
- [Generate Parentheses](./generate-parentheses.js)
- [Combinations](./combinations.js)
- [Letter Case Permutation](./letter-case-permutation.js)

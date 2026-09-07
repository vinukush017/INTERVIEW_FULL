# HashMap

## Pattern

Trade space for time: a `Map`/`Set` gives O(1) average lookup, so any "have I
seen this before" or "what's the complement I need" question collapses a
nested O(n^2) loop into a single pass.

**Recognize it when:** "count occurrences", "pair/group that matches a
condition", "does a duplicate exist", "two values that sum to a target".

**Template:**
```js
const seen = new Map();
for (const x of nums) {
  const complement = target - x;
  if (seen.has(complement)) return [seen.get(complement), i];
  seen.set(x, i);
}
```

**Complexity:** O(n) time, O(n) space.

**Watch out for:** grouping keys need a canonical form (e.g. sort the letters
for an anagram group); prefer `Map`/`Set` over plain objects — object keys
silently coerce to strings, which breaks for non-string keys.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Two Sum](./two-sum.js)
- [Contains Duplicate](./contains-duplicate.js)
- [Valid Anagram](./valid-anagram.js)
- [Group Anagrams](./group-anagrams.js)
- [Top K Frequent Elements](./top-k-frequent-elements.js)

## Test workflow

1. Write your solution directly in the problem's `.js` file and keep its `module.exports` line.
2. Run `node scripts/test-solution.js <folder>/<problem>` from the repository root.
3. The script reports every passing test or stops at the first failure. Your solution remains in the original file so you can continue editing it.

For example: `node scripts/test-solution.js HashMap/two-sum`.
- [Contains Duplicate II](./contains-duplicate-ii.js)
- [Intersection of Two Arrays](./intersection-of-two-arrays.js)
- [Ransom Note](./ransom-note.js)
- [Word Pattern](./word-pattern.js)

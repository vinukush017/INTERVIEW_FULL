# Two Pointers

## Pattern

Two indices move through the data — toward each other from both ends, or
together in the same direction — replacing an O(n^2) pair check with a single
O(n) pass. Usually needs sorted data (or the array/string's own symmetry) to
know which pointer should move.

**Recognize it when:** "sorted array", "pair/triplet that sums to a target",
"reverse in place", "compare from both ends".

**Template:**
```js
let left = 0, right = nums.length - 1;
while (left < right) {
  const sum = nums[left] + nums[right];
  if (sum === target) return [left, right];
  if (sum < target) left++; else right--;
}
```

**Complexity:** O(n) for the scan, or O(n log n) if you sort first; O(1)
extra space.

**Watch out for:** knowing *why* each pointer moves — if you can't justify it,
you don't have the invariant yet; 3Sum-style problems need explicit
duplicate-skipping after sorting or you'll return the same triplet twice.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Valid Palindrome](./valid-palindrome.js)
- [Two Sum II - Input Array Is Sorted](./two-sum-ii-input-array-is-sorted.js)
- [3Sum](./3sum.js)
- [Container With Most Water](./container-with-most-water.js)
- [Trapping Rain Water](./trapping-rain-water.js)
- [Valid Palindrome II](./valid-palindrome-ii.js)
- [Is Subsequence](./is-subsequence.js)
- [Squares of a Sorted Array](./squares-of-a-sorted-array.js)
- [Reverse Vowels of a String](./reverse-vowels-of-a-string.js)

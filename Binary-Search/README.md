# Binary Search

## Pattern

Any time the search space is monotonic — sorted data, or a yes/no question
whose answer flips exactly once as a parameter increases ("can I finish in
X days?") — you can halve the space every step instead of scanning linearly.

**Recognize it when:** "sorted array", "minimize the maximum / maximize the
minimum", "find a boundary or insertion point", "search on the answer"
(binary search over a range of possible answers, not over the array itself).

**Template:**
```js
let lo = 0, hi = nums.length - 1;
while (lo <= hi) {
  const mid = lo + Math.floor((hi - lo) / 2);
  if (nums[mid] === target) return mid;
  if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
}
```

**Complexity:** O(log n).

**Watch out for:** an infinite loop from an update that doesn't shrink the
range (always move past `mid`, i.e. `mid + 1` / `mid - 1`, unless your
condition explicitly needs to keep `mid` in play); for "search on the
answer", write the yes/no feasibility check first and confirm it's actually
monotonic before binary searching over it.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Binary Search](./binary-search.js)
- [Search Insert Position](./search-insert-position.js)
- [Guess Number Higher or Lower](./guess-number-higher-or-lower.js)
- [Search in Rotated Sorted Array](./search-in-rotated-sorted-array.js)
- [Find Minimum in Rotated Sorted Array](./find-minimum-in-rotated-sorted-array.js)
- [Koko Eating Bananas](./koko-eating-bananas.js)
- [Time Based Key-Value Store](./time-based-key-value-store.js)
- [Median of Two Sorted Arrays](./median-of-two-sorted-arrays.js)
- [Sqrt(x)](./sqrtx.js)
- [First Bad Version](./first-bad-version.js)
- [Find Peak Element](./find-peak-element.js)
- [Find First and Last Position of Element in Sorted Array](./find-first-and-last-position-of-element-in-sorted-array.js)

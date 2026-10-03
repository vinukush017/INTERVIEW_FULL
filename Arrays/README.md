# Arrays

## Pattern

Index-based traversal, usually with a single pass tracking running state (a
max, a sum, a product) or two passes building prefix/suffix results. Most
later patterns (two pointers, sliding window, DP) are specializations of
plain array traversal.

**Recognize it when:** "contiguous subarray", "without extra space", "product
or sum ending at index i", "in place".

**Template:**
```js
let best = nums[0];
let running = nums[0];
for (let i = 1; i < nums.length; i++) {
  running = Math.max(nums[i], running + nums[i]); // Kadane-style
  best = Math.max(best, running);
}
```

**Complexity:** O(n) time; O(1) extra space if you avoid a second array, O(n)
if you build prefix/suffix arrays.

**Watch out for:** off-by-one errors at the array boundaries, and negative
numbers flipping which running value is actually the max (product subarray
needs both a running max and a running min).

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Product of Array Except Self](./product-of-array-except-self.js)
- [Longest Consecutive Sequence](./longest-consecutive-sequence.js)
- [Maximum Product Subarray](./maximum-product-subarray.js)
- [Move Zeroes](./move-zeroes.js)
- [Remove Duplicates from Sorted Array](./remove-duplicates-from-sorted-array.js)
- [Remove Element](./remove-element.js)
- [Majority Element](./majority-element.js)
- [Find All Numbers Disappeared in an Array](./find-all-numbers-disappeared-in-an-array.js)
- [Pascal's Triangle](./pascals-triangle.js)
- [Third Maximum Number](./third-maximum-number.js)

- [Range Sum Query - Immutable](./range-sum-query-immutable.js)

- [Subarray Sum Equals K](./subarray-sum-equals-k.js)

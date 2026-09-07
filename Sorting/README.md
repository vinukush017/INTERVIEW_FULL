# Sorting

## Pattern

A comparison sort can't beat O(n log n) in the worst case — that's the
theoretical floor, and it's why merge sort and quicksort show up everywhere.
Beyond implementing them from memory, most "sorting" interview questions are
really about *using* a sort (or a sort-like invariant) to turn an O(n^2)
brute force into something faster: sort first, then a single pass or two
pointers finishes the job.

**Recognize it when:** "sort an array without a library function", "in
place", "custom comparator" (e.g. build the largest number from digits), or
any problem that gets easy once the input is ordered.

**Template (merge sort skeleton):**
```js
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const merged = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    merged.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return [...merged, ...left.slice(i), ...right.slice(j)];
}
```

**Complexity:** O(n log n) time for merge sort/quicksort/heapsort; O(n)
extra space for merge sort (quicksort can sort in place, O(log n) stack).
Counting sort / bucket sort beat O(n log n) but only work for bounded or
structured inputs (small integer ranges, for example).

**Watch out for:** `Array.prototype.sort()` in JS sorts by string comparison
by default — always pass a comparator (`(a, b) => a - b`) for numbers;
quicksort's worst case degrades to O(n^2) on already-sorted input unless you
randomize the pivot; a "stable" sort matters whenever equal elements'
relative order needs to be preserved (e.g. sorting by one field after
already sorting by another).

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).
- [Sort an Array](./sort-an-array.js)
- [Sort Colors](./sort-colors.js)
- [Merge Sorted Array](./merge-sorted-array.js)
- [Largest Number](./largest-number.js)
- [Wiggle Sort](./wiggle-sort.js)
- [H-Index](./h-index.js)
- [Relative Sort Array](./relative-sort-array.js)
- [Sort List](./sort-list.js)
- [Bubble Sort](./bubble-sort.js)
- [Selection Sort](./selection-sort.js)
- [Insertion Sort](./insertion-sort.js)
- [Merge Sort (Implementation)](./merge-sort-implementation.js)
- [Quick Sort (Implementation)](./quick-sort-implementation.js)
- [Heap Sort (Implementation)](./heap-sort-implementation.js)

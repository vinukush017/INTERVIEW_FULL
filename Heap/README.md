# Heap

## Pattern

A binary-heap priority queue exposes its root (min or max) in O(1), without
sorting everything. Insertion and root removal take O(log n), where n is
the heap size. The recurring trick for "top k" problems is to keep a
heap of size k and pop whenever it grows past that — you never hold more
than k items in memory.

**Recognize it when:** "kth largest/smallest", "top k frequent", "merge k
sorted lists", "running median of a stream".

**Template (top-k with a min-heap of size k):**
```js
// push each candidate, then pop the smallest whenever size exceeds k;
// whatever remains is the k largest.
if (heap.size() < k) heap.push(x);
else if (x > heap.peek()) { heap.pop(); heap.push(x); }
```

**Complexity:** For a binary heap:

- Peek/top: O(1).
- Insert/push: O(log n).
- Remove/pop root: O(log n).
- Bottom-up heapify/build heap: O(n); building by repeated pushes is O(n log n).

Finding the top k among n elements takes O(n log k) for k >= 2, and O(n)
for k = 1, with O(k) space (versus O(n log n) for a full sort).

**Watch out for:** JavaScript has no built-in heap — either implement a
small binary-heap class once and reuse it, or fall back to a sorted
insertion for small k under interview time pressure, but say out loud that
you know the real complexity difference.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Kth Largest Element in an Array](./kth-largest-element-in-an-array.js)
- [Last Stone Weight](./last-stone-weight.js)
- [Top K Frequent Words](./top-k-frequent-words.js)
- [Task Scheduler](./task-scheduler.js)
- [Find Median from Data Stream](./find-median-from-data-stream.js)
- [Merge K Sorted Lists](./merge-k-sorted-lists.js)
- [Relative Ranks](./relative-ranks.js)
- [K Closest Points to Origin](./k-closest-points-to-origin.js)

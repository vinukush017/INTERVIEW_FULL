# Intervals

## Pattern

Sort by start time (occasionally by end time), then sweep left to right
comparing each interval to the running "current" one — merge, count, or
insert as the problem requires. This is the interval-specific flavor of the
greedy pattern.

**Recognize it when:** "meeting rooms", "merge overlapping ranges", "insert
a new interval", "minimum arrows/removals to eliminate overlaps".

**Template:**
```js
intervals.sort((a, b) => a[0] - b[0]);
const merged = [intervals[0]];
for (const [start, end] of intervals.slice(1)) {
  const last = merged[merged.length - 1];
  if (start <= last[1]) last[1] = Math.max(last[1], end);
  else merged.push([start, end]);
}
```

**Complexity:** O(n log n) for the sort, O(n) for the sweep.

**Watch out for:** deciding up front whether touching-but-not-overlapping
intervals like `[1,2]` and `[2,3]` should merge — the problem statement
tells you whether the boundary comparison should be `<` or `<=`, and it
changes the answer.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Merge Intervals](./merge-intervals.js)
- [Insert Interval](./insert-interval.js)
- [Non-overlapping Intervals](./non-overlapping-intervals.js)
- [Meeting Rooms](./meeting-rooms.js)
- [Meeting Rooms II](./meeting-rooms-ii.js)
- [Minimum Interval to Include Each Query](./minimum-interval-to-include-each-query.js)
- [Summary Ranges](./summary-ranges.js)
- [Interval List Intersections](./interval-list-intersections.js)

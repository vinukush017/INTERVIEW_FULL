# Queue

## Pattern

FIFO (first in, first out). The main reason to reach for a queue is BFS —
level-by-level or shortest-path-in-unweighted-graph problems — plus any
"process requests in the order they arrived" simulation.

**Recognize it when:** "level order traversal", "shortest path with equal
edge weights", "process in arrival order", "circular buffer".

**Template:**
```js
const queue = [start];
const visited = new Set([start]);
let head = 0;
while (head < queue.length) {
  const node = queue[head++];
  for (const next of neighbors(node)) {
    if (!visited.has(next)) {
      visited.add(next); // Mark when enqueuing to avoid repeats and cycles.
      queue.push(next);
    }
  }
}
```

**Complexity:** O(1) amortized per enqueue/dequeue with the head-pointer
trick above. For a tree, full BFS takes O(n), where n is the number of nodes.
For a graph represented by adjacency lists, it takes O(V + E): visit each
vertex once and scan its edges. A single-source BFS visits only the reachable
part; use an outer loop over unvisited vertices to cover a disconnected graph.
The queue and visited set use O(V) space. In a rooted tree traversed only
through children, the visited set can be omitted.

**Watch out for:** `Array.prototype.shift()` is O(n) in JS because every
remaining element re-indexes — use a head pointer (as above) or a linked
list for a queue you actually dequeue from repeatedly.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Implement Queue Using Stacks](./implement-queue-using-stacks.js)
- [Design Circular Queue](./design-circular-queue.js)
- [Number of Recent Calls](./number-of-recent-calls.js)
- [Dota2 Senate](./dota2-senate.js)
- [Moving Average from Data Stream](./moving-average-from-data-stream.js)
- [Number of Students Unable to Eat Lunch](./number-of-students-unable-to-eat-lunch.js)
- [Time Needed to Buy Tickets](./time-needed-to-buy-tickets.js)

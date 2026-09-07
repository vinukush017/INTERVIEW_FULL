# Graph

## Pattern

Nodes and edges, usually represented as an adjacency list (or an implicit
grid, where each cell's neighbors are computed on the fly). DFS/BFS with a
`visited` set is the workhorse; topological sort (via DFS post-order or
in-degree counting) handles dependency/ordering questions.

**Recognize it when:** "grid of islands/regions", "course prerequisites",
"connected components", "shortest path with equal edge weights" (BFS).

**Template:**
```js
const visited = new Set();
function dfs(node) {
  if (visited.has(node)) return;
  visited.add(node);
  for (const next of adjacency[node]) dfs(next);
}
```

**Complexity:** O(V + E) — every vertex and edge is visited a constant
number of times.

**Watch out for:** marking a node visited *before* recursing into it, not
after (otherwise you can revisit it and loop forever); a directed graph's
cycle check needs to track the current recursion path, not just a global
visited set, since a node can be "visited but not currently on the path".

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Number of Islands](./number-of-islands.js)
- [Clone Graph](./clone-graph.js)
- [Max Area of Island](./max-area-of-island.js)
- [Pacific Atlantic Water Flow](./pacific-atlantic-water-flow.js)
- [Surrounded Regions](./surrounded-regions.js)
- [Rotting Oranges](./rotting-oranges.js)
- [Walls and Gates](./walls-and-gates.js)
- [Course Schedule](./course-schedule.js)
- [Course Schedule II](./course-schedule-ii.js)
- [Graph Valid Tree](./graph-valid-tree.js)
- [Number of Connected Components in an Undirected Graph](./number-of-connected-components-in-an-undirected-graph.js)
- [Word Ladder](./word-ladder.js)
- [Flood Fill](./flood-fill.js)
- [Keys and Rooms](./keys-and-rooms.js)
- [Find if Path Exists in Graph](./find-if-path-exists-in-graph.js)
- [Is Graph Bipartite](./is-graph-bipartite.js)

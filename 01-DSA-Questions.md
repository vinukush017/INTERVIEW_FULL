# DSA Interview Questions

This is the single progress checklist. Every question opens its JavaScript practice file.

## Completion rule

Mark a problem `[x]` only when you can:

- explain the approach before coding;
- write the solution without copying;
- test important edge cases; and
- state the time and space complexity.

If you needed the solution, leave it unchecked and repeat it after 1, 3, 7, and 14 days. The topic-folder READMEs are navigation pages; update progress only here.

## Concept-first learning order

Do not choose topics randomly. Learn them in the following dependency order. A later topic intentionally reuses concepts and data structures from earlier topics.

| Stage | Learn first | Then practise | Why it comes here |
| --- | --- | --- | --- |
| 0 | JavaScript basics, loops, functions, and Big-O | Very small coding exercises | These are prerequisites for all DSA practice. |
| 1 | Indexes, traversal, mutation, and sorting | Arrays | Arrays are the base for most interview patterns. |
| 2 | Character traversal, comparison, and counting | Strings | Strings use the same traversal skills as arrays. |
| 3 | `Set`, `Map`, lookup, and frequency counting | HashMap | Hashing improves many array and string solutions. |
| 4 | Left/right pointers and pointer invariants | Two Pointers | This builds on array/string traversal and sorting. |
| 5 | Fixed and variable windows with frequency maps | Sliding Window | This combines arrays, two pointers, and HashMaps. |
| 6 | LIFO, FIFO, and monotonic structures | Stack, then Queue | Stacks model nested work; queues are needed for BFS. |
| 7 | Sorted-search invariants and boundary handling | Binary Search | This requires confident array indexing. |
| 8 | Nodes, references, and fast/slow pointers | LinkedList | This introduces pointer-based structures. |
| 9 | Base cases, recursive calls, and the call stack | Recursion exercises | Recursion must be comfortable before recursive structures. |
| 10 | DFS, BFS, and BST ordering | Trees | Trees apply recursion, stacks, and queues. |
| 11 | Priority queues and retaining the best `k` values | Heap | Heaps support ranking, scheduling, and graph algorithms. |
| 12 | Choose, explore, undo, and pruning | Backtracking | Backtracking extends recursion by managing choices. |
| 13 | Adjacency lists, visited sets, DFS, BFS, and topological sort | Graph | Graphs reuse HashMaps, Sets, recursion, and queues. |
| 14 | State, recurrence, memoization, and tabulation | Dynamic Programming | DP builds on recursion and repeated subproblems. |
| 15 | Local choices and proof of correctness | Greedy | Comparing greedy with DP clarifies when local choices work. |
| 16 | Sorting by start/end and overlap rules | Intervals | Interval problems reuse sorting, greedy, heaps, and arrays. |
| 17 | XOR, bit operations, and numeric simulation | Bit Manipulation, then Math | Learn these independent techniques after the core patterns. |

The short version is:

**Arrays → Strings → HashMap → Two Pointers → Sliding Window → Stack/Queue → Binary Search → LinkedList → Recursion → Trees → Heap → Backtracking → Graph → Dynamic Programming → Greedy → Intervals → Bits/Math**

## Dependency-ordered practice queue

This is the actual problem-solving order. Follow it from top to bottom, including across topic folders. A problem is placed only after the main concepts it needs. Problems marked **challenge** should be skipped on the first pass and attempted after the rest of that level feels comfortable.

### Level 1 — Loops, arrays, strings, Set, and Map

1. [Contains Duplicate](./HashMap/contains-duplicate.js)
2. [Valid Anagram](./HashMap/valid-anagram.js)
3. [Two Sum](./HashMap/two-sum.js)
4. [Group Anagrams](./HashMap/group-anagrams.js) — **challenge on the first pass**
5. [Encode and Decode Strings](./String/encode-and-decode-strings.js) — **challenge on the first pass**
6. [Product of Array Except Self](./Arrays/product-of-array-except-self.js) — **challenge on the first pass**
7. [Longest Consecutive Sequence](./Arrays/longest-consecutive-sequence.js) — **challenge on the first pass**
8. [Top K Frequent Elements](./HashMap/top-k-frequent-elements.js) — **challenge on the first pass**

### Level 2 — Two pointers on arrays and strings

Learn left/right pointers and why each pointer moves before starting.

1. [Valid Palindrome](./Two-Pointers/valid-palindrome.js)
2. [Two Sum II](./Two-Pointers/two-sum-ii-input-array-is-sorted.js)
3. [Valid Palindrome II](./Two-Pointers/valid-palindrome-ii.js)
4. [String Compression](./String/string-compression.js)
5. [Container With Most Water](./Two-Pointers/container-with-most-water.js)
6. [3Sum](./Two-Pointers/3sum.js)
7. [Trapping Rain Water](./Two-Pointers/trapping-rain-water.js) — **challenge**
8. [Palindromic Substrings](./String/palindromic-substrings.js)
9. [Longest Palindromic Substring](./String/longest-palindromic-substring.js)

### Level 3 — Sliding window

Learn window boundaries and reuse the Set/Map knowledge from Level 1.

1. [Best Time to Buy and Sell Stock](./Sliding-Window/best-time-to-buy-and-sell-stock.js)
2. [Longest Substring Without Repeating Characters](./Sliding-Window/longest-substring-without-repeating-characters.js)
3. [Permutation in String](./Sliding-Window/permutation-in-string.js)
4. [Longest Repeating Character Replacement](./Sliding-Window/longest-repeating-character-replacement.js)
5. [Minimum Window Substring](./Sliding-Window/minimum-window-substring.js) — **challenge**

### Level 4 — Stack, queue, and monotonic structures

Learn ordinary Stack and Queue operations before monotonic-stack/deque questions.

1. [Valid Parentheses](./Stack/valid-parentheses.js)
2. [Evaluate Reverse Polish Notation](./Stack/evaluate-reverse-polish-notation.js)
3. [Min Stack](./Stack/min-stack.js)
4. [Number of Recent Calls](./Queue/number-of-recent-calls.js)
5. [Implement Queue Using Stacks](./Queue/implement-queue-using-stacks.js)
6. [Design Circular Queue](./Queue/design-circular-queue.js)
7. [Dota2 Senate](./Queue/dota2-senate.js)
8. [Daily Temperatures](./Stack/daily-temperatures.js)
9. [Car Fleet](./Stack/car-fleet.js)
10. [Sliding Window Maximum](./Sliding-Window/sliding-window-maximum.js)
11. [Largest Rectangle in Histogram](./Stack/largest-rectangle-in-histogram.js) — **challenge**

### Level 5 — Binary search

1. [Binary Search](./Binary-Search/binary-search.js)
2. [Search Insert Position](./Binary-Search/search-insert-position.js)
3. [Guess Number Higher or Lower](./Binary-Search/guess-number-higher-or-lower.js)
4. [Find Minimum in Rotated Sorted Array](./Binary-Search/find-minimum-in-rotated-sorted-array.js)
5. [Search in Rotated Sorted Array](./Binary-Search/search-in-rotated-sorted-array.js)
6. [Koko Eating Bananas](./Binary-Search/koko-eating-bananas.js)
7. [Time Based Key-Value Store](./Binary-Search/time-based-key-value-store.js)
8. [Median of Two Sorted Arrays](./Binary-Search/median-of-two-sorted-arrays.js) — **challenge**

### Level 6 — Linked lists

1. [Reverse Linked List](./LinkedList/reverse-linked-list.js)
2. [Merge Two Sorted Lists](./LinkedList/merge-two-sorted-lists.js)
3. [Linked List Cycle](./LinkedList/linked-list-cycle.js)
4. [Remove Nth Node From End](./LinkedList/remove-nth-node-from-end-of-list.js)
5. [Add Two Numbers](./LinkedList/add-two-numbers.js)
6. [Reorder List](./LinkedList/reorder-list.js)
7. [Copy List With Random Pointer](./LinkedList/copy-list-with-random-pointer.js)
8. [LRU Cache](./LinkedList/lru-cache.js) — **challenge; requires HashMap too**

### Level 7 — Recursion, trees, and BSTs

First practise base cases, recursive calls, and tracing the call stack on tiny examples. Then continue:

1. [Maximum Depth of Binary Tree](./Trees/maximum-depth-of-binary-tree.js)
2. [Invert Binary Tree](./Trees/invert-binary-tree.js)
3. [Same Tree](./Trees/same-tree.js)
4. [Binary Tree Level Order Traversal](./Trees/binary-tree-level-order-traversal.js)
5. [Diameter of Binary Tree](./Trees/diameter-of-binary-tree.js)
6. [Balanced Binary Tree](./Trees/balanced-binary-tree.js)
7. [Binary Tree Right Side View](./Trees/binary-tree-right-side-view.js)
8. [Count Good Nodes in Binary Tree](./Trees/count-good-nodes-in-binary-tree.js)
9. [Lowest Common Ancestor of BST](./Trees/lowest-common-ancestor-of-bst.js)
10. [Validate Binary Search Tree](./Trees/validate-binary-search-tree.js)
11. [Kth Smallest Element in BST](./Trees/kth-smallest-element-in-bst.js)
12. [Subtree of Another Tree](./Trees/subtree-of-another-tree.js)
13. [Construct Binary Tree from Preorder and Inorder](./Trees/construct-binary-tree-from-preorder-and-inorder-traversal.js) — **challenge**

### Level 8 — Heap and priority queue

1. [Last Stone Weight](./Heap/last-stone-weight.js)
2. [Kth Largest Element in an Array](./Heap/kth-largest-element-in-an-array.js)
3. [Top K Frequent Words](./Heap/top-k-frequent-words.js)
4. [Merge K Sorted Lists](./Heap/merge-k-sorted-lists.js) — requires Linked Lists
5. [Task Scheduler](./Heap/task-scheduler.js)
6. [Find Median from Data Stream](./Heap/find-median-from-data-stream.js) — **challenge**

### Level 9 — Backtracking

Learn choose → explore → undo. Do not begin with grid or constraint problems.

1. [Subsets](./Backtracking/subsets.js)
2. [Permutations](./Backtracking/permutations.js)
3. [Letter Combinations of a Phone Number](./Backtracking/letter-combinations-of-a-phone-number.js)
4. [Combination Sum](./Backtracking/combination-sum.js)
5. [Subsets II](./Backtracking/subsets-ii.js)
6. [Combination Sum II](./Backtracking/combination-sum-ii.js)
7. [Palindrome Partitioning](./Backtracking/palindrome-partitioning.js) — requires palindrome work from Level 2
8. [Word Search](./Backtracking/word-search.js)
9. [N-Queens](./Backtracking/n-queens.js) — **challenge**

### Level 10 — Graphs

Start only after recursion, Set/Map, Stack/Queue, trees, and basic backtracking.

1. [Number of Islands](./Graph/number-of-islands.js)
2. [Max Area of Island](./Graph/max-area-of-island.js)
3. [Clone Graph](./Graph/clone-graph.js)
4. [Rotting Oranges](./Graph/rotting-oranges.js)
5. [Walls and Gates](./Graph/walls-and-gates.js)
6. [Surrounded Regions](./Graph/surrounded-regions.js)
7. [Pacific Atlantic Water Flow](./Graph/pacific-atlantic-water-flow.js)
8. [Graph Valid Tree](./Graph/graph-valid-tree.js)
9. [Number of Connected Components](./Graph/number-of-connected-components-in-an-undirected-graph.js)
10. [Course Schedule](./Graph/course-schedule.js)
11. [Course Schedule II](./Graph/course-schedule-ii.js)
12. [Word Ladder](./Graph/word-ladder.js) — **challenge**

### Level 11 — Dynamic programming

Learn brute-force recursion first, identify repeated states, then add memoization and tabulation.

1. [Climbing Stairs](./Dynamic-Programming/climbing-stairs.js)
2. [Min Cost Climbing Stairs](./Dynamic-Programming/min-cost-climbing-stairs.js)
3. [House Robber](./Dynamic-Programming/house-robber.js)
4. [House Robber II](./Dynamic-Programming/house-robber-ii.js)
5. [Maximum Product Subarray](./Arrays/maximum-product-subarray.js)
6. [Decode Ways](./Dynamic-Programming/decode-ways.js)
7. [Coin Change](./Dynamic-Programming/coin-change.js)
8. [Word Break](./Dynamic-Programming/word-break.js)
9. [Longest Increasing Subsequence](./Dynamic-Programming/longest-increasing-subsequence.js)
10. [Partition Equal Subset Sum](./Dynamic-Programming/partition-equal-subset-sum.js)
11. [Longest Common Subsequence](./Dynamic-Programming/longest-common-subsequence.js)
12. [Edit Distance](./Dynamic-Programming/edit-distance.js) — **challenge**

### Level 12 — Greedy and intervals

1. [Jump Game](./Greedy/jump-game.js)
2. [Merge Triplets to Form Target Triplet](./Greedy/merge-triplets-to-form-target-triplet.js)
3. [Partition Labels](./Greedy/partition-labels.js)
4. [Jump Game II](./Greedy/jump-game-ii.js)
5. [Gas Station](./Greedy/gas-station.js)
6. [Valid Parenthesis String](./Greedy/valid-parenthesis-string.js)
7. [Hand of Straights](./Greedy/hand-of-straights.js)
8. [Meeting Rooms](./Intervals/meeting-rooms.js)
9. [Merge Intervals](./Intervals/merge-intervals.js)
10. [Insert Interval](./Intervals/insert-interval.js)
11. [Non-overlapping Intervals](./Intervals/non-overlapping-intervals.js)
12. [Meeting Rooms II](./Intervals/meeting-rooms-ii.js) — requires Heap
13. [Minimum Interval to Include Each Query](./Intervals/minimum-interval-to-include-each-query.js) — **challenge; requires Heap**

### Level 13 — Bits, math, and remaining simulations

1. [Plus One](./Math/plus-one.js)
2. [Happy Number](./Math/happy-number.js)
3. [Single Number](./Bit-Manipulation/single-number.js)
4. [Missing Number](./Bit-Manipulation/missing-number.js)
5. [Number of 1 Bits](./Bit-Manipulation/number-of-1-bits.js)
6. [Counting Bits](./Bit-Manipulation/counting-bits.js)
7. [Reverse Bits](./Bit-Manipulation/reverse-bits.js)
8. [Rotate Image](./Math/rotate-image.js)
9. [Pow(x, n)](./Math/pow-x-n.js) — requires Recursion
10. [Multiply Strings](./Math/multiply-strings.js)
11. [Sum of Two Integers](./Bit-Manipulation/sum-of-two-integers.js) — **challenge**

## Problems

The sections below are the single progress checklist. They are grouped by folder only for tracking; **do not use their position as the learning order**. Use the dependency-ordered queue above to choose the next problem.

### Arrays

- [ ] [Product of Array Except Self](./Arrays/product-of-array-except-self.js)
- [ ] [Longest Consecutive Sequence](./Arrays/longest-consecutive-sequence.js)
- [ ] [Maximum Product Subarray](./Arrays/maximum-product-subarray.js)

### Strings

Learn basic string traversal here near the start of the roadmap. The first beginner string questions are listed under their main solution patterns: [Valid Anagram](./HashMap/valid-anagram.js) under HashMap and [Valid Palindrome](./Two-Pointers/valid-palindrome.js) under Two Pointers. Practise the standalone questions below later because they require additional patterns.

- [ ] [String Compression](./String/string-compression.js) — after Two Pointers
- [ ] [Encode and Decode Strings](./String/encode-and-decode-strings.js) — after basic string traversal
- [ ] [Palindromic Substrings](./String/palindromic-substrings.js) — after Two Pointers or Dynamic Programming
- [ ] [Longest Palindromic Substring](./String/longest-palindromic-substring.js) — after Palindromic Substrings

### HashMap

- [x] [Two Sum](./HashMap/two-sum.js)
- [x] [Contains Duplicate](./HashMap/contains-duplicate.js)
- [x] [Valid Anagram](./HashMap/valid-anagram.js)
- [x] [Group Anagrams](./HashMap/group-anagrams.js)
- [x] [Top K Frequent Elements](./HashMap/top-k-frequent-elements.js)

### Two Pointers

- [ ] [Valid Palindrome](./Two-Pointers/valid-palindrome.js)
- [ ] [Two Sum II - Input Array Is Sorted](./Two-Pointers/two-sum-ii-input-array-is-sorted.js)
- [ ] [3Sum](./Two-Pointers/3sum.js)
- [ ] [Container With Most Water](./Two-Pointers/container-with-most-water.js)
- [ ] [Trapping Rain Water](./Two-Pointers/trapping-rain-water.js)
- [ ] [Valid Palindrome II](./Two-Pointers/valid-palindrome-ii.js)

### Sliding Window

- [ ] [Best Time to Buy and Sell Stock](./Sliding-Window/best-time-to-buy-and-sell-stock.js)
- [ ] [Longest Substring Without Repeating Characters](./Sliding-Window/longest-substring-without-repeating-characters.js)
- [ ] [Longest Repeating Character Replacement](./Sliding-Window/longest-repeating-character-replacement.js)
- [ ] [Permutation in String](./Sliding-Window/permutation-in-string.js)
- [ ] [Minimum Window Substring](./Sliding-Window/minimum-window-substring.js)
- [ ] [Sliding Window Maximum](./Sliding-Window/sliding-window-maximum.js)

### Stack

- [ ] [Valid Parentheses](./Stack/valid-parentheses.js)
- [ ] [Min Stack](./Stack/min-stack.js)
- [ ] [Evaluate Reverse Polish Notation](./Stack/evaluate-reverse-polish-notation.js)
- [ ] [Daily Temperatures](./Stack/daily-temperatures.js)
- [ ] [Car Fleet](./Stack/car-fleet.js)
- [ ] [Largest Rectangle in Histogram](./Stack/largest-rectangle-in-histogram.js)

### Queue

- [ ] [Implement Queue Using Stacks](./Queue/implement-queue-using-stacks.js)
- [ ] [Design Circular Queue](./Queue/design-circular-queue.js)
- [ ] [Number of Recent Calls](./Queue/number-of-recent-calls.js)
- [ ] [Dota2 Senate](./Queue/dota2-senate.js)

### LinkedList

- [ ] [Reverse Linked List](./LinkedList/reverse-linked-list.js)
- [ ] [Merge Two Sorted Lists](./LinkedList/merge-two-sorted-lists.js)
- [ ] [Linked List Cycle](./LinkedList/linked-list-cycle.js)
- [ ] [Remove Nth Node From End of List](./LinkedList/remove-nth-node-from-end-of-list.js)
- [ ] [Reorder List](./LinkedList/reorder-list.js)
- [ ] [Copy List With Random Pointer](./LinkedList/copy-list-with-random-pointer.js)
- [ ] [Add Two Numbers](./LinkedList/add-two-numbers.js)
- [ ] [LRU Cache](./LinkedList/lru-cache.js)

### Binary Search

- [ ] [Binary Search](./Binary-Search/binary-search.js)
- [ ] [Search Insert Position](./Binary-Search/search-insert-position.js)
- [ ] [Guess Number Higher or Lower](./Binary-Search/guess-number-higher-or-lower.js)
- [ ] [Search in Rotated Sorted Array](./Binary-Search/search-in-rotated-sorted-array.js)
- [ ] [Find Minimum in Rotated Sorted Array](./Binary-Search/find-minimum-in-rotated-sorted-array.js)
- [ ] [Koko Eating Bananas](./Binary-Search/koko-eating-bananas.js)
- [ ] [Time Based Key-Value Store](./Binary-Search/time-based-key-value-store.js)
- [ ] [Median of Two Sorted Arrays](./Binary-Search/median-of-two-sorted-arrays.js)

### Trees

- [ ] [Invert Binary Tree](./Trees/invert-binary-tree.js)
- [ ] [Maximum Depth of Binary Tree](./Trees/maximum-depth-of-binary-tree.js)
- [ ] [Diameter of Binary Tree](./Trees/diameter-of-binary-tree.js)
- [ ] [Balanced Binary Tree](./Trees/balanced-binary-tree.js)
- [ ] [Same Tree](./Trees/same-tree.js)
- [ ] [Subtree of Another Tree](./Trees/subtree-of-another-tree.js)
- [ ] [Lowest Common Ancestor of BST](./Trees/lowest-common-ancestor-of-bst.js)
- [ ] [Binary Tree Level Order Traversal](./Trees/binary-tree-level-order-traversal.js)
- [ ] [Binary Tree Right Side View](./Trees/binary-tree-right-side-view.js)
- [ ] [Count Good Nodes in Binary Tree](./Trees/count-good-nodes-in-binary-tree.js)
- [ ] [Validate Binary Search Tree](./Trees/validate-binary-search-tree.js)
- [ ] [Kth Smallest Element in BST](./Trees/kth-smallest-element-in-bst.js)
- [ ] [Construct Binary Tree from Preorder and Inorder Traversal](./Trees/construct-binary-tree-from-preorder-and-inorder-traversal.js)

### Heap

- [ ] [Kth Largest Element in an Array](./Heap/kth-largest-element-in-an-array.js)
- [ ] [Last Stone Weight](./Heap/last-stone-weight.js)
- [ ] [Top K Frequent Words](./Heap/top-k-frequent-words.js)
- [ ] [Task Scheduler](./Heap/task-scheduler.js)
- [ ] [Find Median from Data Stream](./Heap/find-median-from-data-stream.js)
- [ ] [Merge K Sorted Lists](./Heap/merge-k-sorted-lists.js)

### Graph

- [ ] [Number of Islands](./Graph/number-of-islands.js)
- [ ] [Clone Graph](./Graph/clone-graph.js)
- [ ] [Max Area of Island](./Graph/max-area-of-island.js)
- [ ] [Pacific Atlantic Water Flow](./Graph/pacific-atlantic-water-flow.js)
- [ ] [Surrounded Regions](./Graph/surrounded-regions.js)
- [ ] [Rotting Oranges](./Graph/rotting-oranges.js)
- [ ] [Walls and Gates](./Graph/walls-and-gates.js)
- [ ] [Course Schedule](./Graph/course-schedule.js)
- [ ] [Course Schedule II](./Graph/course-schedule-ii.js)
- [ ] [Graph Valid Tree](./Graph/graph-valid-tree.js)
- [ ] [Number of Connected Components in an Undirected Graph](./Graph/number-of-connected-components-in-an-undirected-graph.js)
- [ ] [Word Ladder](./Graph/word-ladder.js)

### Backtracking

- [ ] [Subsets](./Backtracking/subsets.js)
- [ ] [Combination Sum](./Backtracking/combination-sum.js)
- [ ] [Combination Sum II](./Backtracking/combination-sum-ii.js)
- [ ] [Permutations](./Backtracking/permutations.js)
- [ ] [Subsets II](./Backtracking/subsets-ii.js)
- [ ] [Word Search](./Backtracking/word-search.js)
- [ ] [Palindrome Partitioning](./Backtracking/palindrome-partitioning.js)
- [ ] [N-Queens](./Backtracking/n-queens.js)
- [ ] [Letter Combinations of a Phone Number](./Backtracking/letter-combinations-of-a-phone-number.js)

### Dynamic Programming

- [ ] [Climbing Stairs](./Dynamic-Programming/climbing-stairs.js)
- [ ] [Min Cost Climbing Stairs](./Dynamic-Programming/min-cost-climbing-stairs.js)
- [ ] [House Robber](./Dynamic-Programming/house-robber.js)
- [ ] [House Robber II](./Dynamic-Programming/house-robber-ii.js)
- [ ] [Coin Change](./Dynamic-Programming/coin-change.js)
- [ ] [Word Break](./Dynamic-Programming/word-break.js)
- [ ] [Longest Increasing Subsequence](./Dynamic-Programming/longest-increasing-subsequence.js)
- [ ] [Partition Equal Subset Sum](./Dynamic-Programming/partition-equal-subset-sum.js)
- [ ] [Decode Ways](./Dynamic-Programming/decode-ways.js)
- [ ] [Longest Common Subsequence](./Dynamic-Programming/longest-common-subsequence.js)
- [ ] [Edit Distance](./Dynamic-Programming/edit-distance.js)

### Greedy

- [ ] [Jump Game](./Greedy/jump-game.js)
- [ ] [Jump Game II](./Greedy/jump-game-ii.js)
- [ ] [Gas Station](./Greedy/gas-station.js)
- [ ] [Hand of Straights](./Greedy/hand-of-straights.js)
- [ ] [Merge Triplets to Form Target Triplet](./Greedy/merge-triplets-to-form-target-triplet.js)
- [ ] [Partition Labels](./Greedy/partition-labels.js)
- [ ] [Valid Parenthesis String](./Greedy/valid-parenthesis-string.js)

### Bit Manipulation

- [ ] [Single Number](./Bit-Manipulation/single-number.js)
- [ ] [Number of 1 Bits](./Bit-Manipulation/number-of-1-bits.js)
- [ ] [Counting Bits](./Bit-Manipulation/counting-bits.js)
- [ ] [Reverse Bits](./Bit-Manipulation/reverse-bits.js)
- [ ] [Missing Number](./Bit-Manipulation/missing-number.js)
- [ ] [Sum of Two Integers](./Bit-Manipulation/sum-of-two-integers.js)

### Intervals

- [ ] [Merge Intervals](./Intervals/merge-intervals.js)
- [ ] [Insert Interval](./Intervals/insert-interval.js)
- [ ] [Non-overlapping Intervals](./Intervals/non-overlapping-intervals.js)
- [ ] [Meeting Rooms](./Intervals/meeting-rooms.js)
- [ ] [Meeting Rooms II](./Intervals/meeting-rooms-ii.js)
- [ ] [Minimum Interval to Include Each Query](./Intervals/minimum-interval-to-include-each-query.js)

### Math

- [ ] [Happy Number](./Math/happy-number.js)
- [ ] [Plus One](./Math/plus-one.js)
- [ ] [Rotate Image](./Math/rotate-image.js)
- [ ] [Pow(x, n)](./Math/pow-x-n.js)
- [ ] [Multiply Strings](./Math/multiply-strings.js)

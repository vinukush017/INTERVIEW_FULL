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

## Problems

The sections below are topic checklists. Use the concept-first order above when deciding which section to practise next.

### Arrays

- [ ] [Product of Array Except Self](./Arrays/product-of-array-except-self.js)
- [ ] [Longest Consecutive Sequence](./Arrays/longest-consecutive-sequence.js)
- [ ] [Maximum Product Subarray](./Arrays/maximum-product-subarray.js)

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

### String

- [ ] [Longest Palindromic Substring](./String/longest-palindromic-substring.js)
- [ ] [Palindromic Substrings](./String/palindromic-substrings.js)
- [ ] [Encode and Decode Strings](./String/encode-and-decode-strings.js)
- [ ] [String Compression](./String/string-compression.js)

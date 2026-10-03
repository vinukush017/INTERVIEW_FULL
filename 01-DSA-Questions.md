# DSA Interview Questions

This is the single completion checklist for the full retained library. Use the
**dashboard DSA core path** for daily preparation. Every question still opens its
original JavaScript practice file. Roles/patterns live in
`data/dsa-catalog.json`; the dashboard generates role and pattern views from it.
Do not maintain a second core checklist.

## Curated path and pattern evidence

- **CORE:** representative interview patterns; the default daily path.
- **SUPPORTING:** another slice when a pattern still needs practice.
- **TRANSFER:** a materially different contract/constraint after delayed core
  recall and clear explanation. It is a candidate, not a claim of being unseen.
- **OPTIONAL:** depth, niche variants, overlapping sorts and warm-ups. They never
  block interview readiness. Select them manually through All Problems.

The catalog currently has 73 core problems among 210 library files (206 original
files plus four targeted gaps). These are coverage choices, not a quota or a
requirement to finish every core item before interviewing. The live catalog and
validated dashboard counts are authoritative as the library grows.

For a pattern, default evidence is independent core solving, a successful
**delayed** retrieval, a notes-free explanation, and a different transfer/variation
where available. Broad families require two independent core representatives;
simple families may need one. No single problem proves every variant. Same-day
retries do not prove retention. Recency matters: older evidence leads back to
practice rather than permanent mastery. Checked legacy items have completion
known and readiness unknown.

States are Not Started, Learning, Practicing, Demonstrated, Transfer Needed,
Strong Recent Evidence and Needs Review. Pattern details show the supporting
attempts and next action; these are observations, not readiness percentages.
Transfer candidates are suggested only after recent delayed independent core
recall with clear explanation. A failed transfer keeps prior core evidence and
adds a practice/review recommendation.

Phase 1 defaults to linear patterns, stack/queue, binary search and linked-list
basics; Phase 2 adds trees/BST, heaps, graphs, backtracking, basic DP, greedy and
intervals. Later phases maintain recall, transfer and timed reasoning. Phase is
default guidance, not a prohibition on earlier practice.

## Completion rule

Completion and evidence are separate. For a genuine independent completion, be able to:

- explain the approach before coding;
- write the solution without copying;
- test important edge cases; and
- state the time and space complexity.

Save the actual independent/hinted/studied/failed outcome, even if unchecked.
Failed/studied attempts do not complete a problem. A working hinted solution can
be marked complete under the existing validated workflow, but the evidence still
says hinted. The old checkboxes are preserved; they do not manufacture independence.
Reviews adapt through 1 → 3 → 7 → 14 → 30 days and stay bounded. Folder READMEs
remain canonical recognition references; this file is the completion authority.

For core and transfer practice, use [the DSA speaking framework](./english/README.md#dsa):
clarify → brute force → recognize the pattern → optimized invariant/data structure
→ example → time/space → edges → test aloud. On transfer, ask **“What clue made
you recognize this pattern?”** Save that question with your explanation outcome.

The four new files are intentionally unsolved practice contracts, not completed
reference solutions. Their notes are blank until a genuine attempt.

## Concept-first learning order

Use this conceptual order as guidance. It is not an all-problems prerequisite chain; the dashboard selects curated core work, due recall and eligible transfer within your weekly focus.

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
| 18 | Comparison sorts, their complexity, and custom comparators | Sorting | You've been using `.sort()` since Stage 1 — this is dedicated practice implementing and reasoning about it directly, once every other pattern is comfortable. |

The short version is:

**Arrays → Strings → HashMap → Two Pointers → Sliding Window → Stack/Queue → Binary Search → LinkedList → Recursion → Trees → Heap → Backtracking → Graph → Dynamic Programming → Greedy → Intervals → Bits/Math → Sorting**

## Dependency-ordered practice queue

This is the full library ordering, retained for navigation and relative tie-breaking. It does not make every file mandatory. Catalog roles determine the default path; older **challenge** annotations are historical pacing hints, not difficulty labels. Open All Problems to choose any item deliberately.

### Level 1 — Loops, arrays, strings, Set, and Map

1. [Contains Duplicate](./HashMap/contains-duplicate.js)
2. [Valid Anagram](./HashMap/valid-anagram.js)
3. [Two Sum](./HashMap/two-sum.js)
4. [Group Anagrams](./HashMap/group-anagrams.js) — **challenge on the first pass**
5. [Encode and Decode Strings](./String/encode-and-decode-strings.js) — **challenge on the first pass**
6. [Product of Array Except Self](./Arrays/product-of-array-except-self.js) — **challenge on the first pass**
7. [Longest Consecutive Sequence](./Arrays/longest-consecutive-sequence.js) — **challenge on the first pass**
8. [Top K Frequent Elements](./HashMap/top-k-frequent-elements.js) — **challenge on the first pass**
9. [Move Zeroes](./Arrays/move-zeroes.js)
10. [Remove Duplicates from Sorted Array](./Arrays/remove-duplicates-from-sorted-array.js)
11. [Remove Element](./Arrays/remove-element.js)
12. [Majority Element](./Arrays/majority-element.js)
13. [Find All Numbers Disappeared in an Array](./Arrays/find-all-numbers-disappeared-in-an-array.js)
14. [Pascal's Triangle](./Arrays/pascals-triangle.js)
15. [Third Maximum Number](./Arrays/third-maximum-number.js)
16. [Reverse String](./String/reverse-string.js)
17. [Reverse Words in a String](./String/reverse-words-in-a-string.js)
18. [Find the Index of the First Occurrence in a String](./String/find-the-index-of-the-first-occurrence-in-a-string.js)
19. [Longest Common Prefix](./String/longest-common-prefix.js)
20. [Roman to Integer](./String/roman-to-integer.js)
21. [Isomorphic Strings](./String/isomorphic-strings.js)
22. [Contains Duplicate II](./HashMap/contains-duplicate-ii.js)
23. [Intersection of Two Arrays](./HashMap/intersection-of-two-arrays.js)
24. [Ransom Note](./HashMap/ransom-note.js)
25. [Word Pattern](./HashMap/word-pattern.js)

26. [Range Sum Query - Immutable](./Arrays/range-sum-query-immutable.js)
27. [Subarray Sum Equals K](./Arrays/subarray-sum-equals-k.js)

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
10. [Is Subsequence](./Two-Pointers/is-subsequence.js)
11. [Squares of a Sorted Array](./Two-Pointers/squares-of-a-sorted-array.js)
12. [Reverse Vowels of a String](./Two-Pointers/reverse-vowels-of-a-string.js)

### Level 3 — Sliding window

Learn window boundaries and reuse the Set/Map knowledge from Level 1.

1. [Maximum Average Subarray I](./Sliding-Window/maximum-average-subarray-i.js)
2. [Best Time to Buy and Sell Stock](./Sliding-Window/best-time-to-buy-and-sell-stock.js)
3. [Longest Substring Without Repeating Characters](./Sliding-Window/longest-substring-without-repeating-characters.js)
4. [Permutation in String](./Sliding-Window/permutation-in-string.js)
5. [Longest Repeating Character Replacement](./Sliding-Window/longest-repeating-character-replacement.js)
6. [Minimum Window Substring](./Sliding-Window/minimum-window-substring.js) — **challenge**

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
12. [Baseball Game](./Stack/baseball-game.js)
13. [Remove All Adjacent Duplicates In String](./Stack/remove-all-adjacent-duplicates-in-string.js)
14. [Implement Stack using Queues](./Stack/implement-stack-using-queues.js)
15. [Moving Average from Data Stream](./Queue/moving-average-from-data-stream.js)
16. [Number of Students Unable to Eat Lunch](./Queue/number-of-students-unable-to-eat-lunch.js)
17. [Time Needed to Buy Tickets](./Queue/time-needed-to-buy-tickets.js)

### Level 5 — Binary search

1. [Binary Search](./Binary-Search/binary-search.js)
2. [Search Insert Position](./Binary-Search/search-insert-position.js)
3. [Guess Number Higher or Lower](./Binary-Search/guess-number-higher-or-lower.js)
4. [Find Minimum in Rotated Sorted Array](./Binary-Search/find-minimum-in-rotated-sorted-array.js)
5. [Search in Rotated Sorted Array](./Binary-Search/search-in-rotated-sorted-array.js)
6. [Koko Eating Bananas](./Binary-Search/koko-eating-bananas.js)
7. [Time Based Key-Value Store](./Binary-Search/time-based-key-value-store.js)
8. [Median of Two Sorted Arrays](./Binary-Search/median-of-two-sorted-arrays.js) — **challenge**
9. [Sqrt(x)](./Binary-Search/sqrtx.js)
10. [First Bad Version](./Binary-Search/first-bad-version.js)
11. [Find Peak Element](./Binary-Search/find-peak-element.js)
12. [Find First and Last Position of Element in Sorted Array](./Binary-Search/find-first-and-last-position-of-element-in-sorted-array.js)

### Level 6 — Linked lists

1. [Reverse Linked List](./LinkedList/reverse-linked-list.js)
2. [Merge Two Sorted Lists](./LinkedList/merge-two-sorted-lists.js)
3. [Linked List Cycle](./LinkedList/linked-list-cycle.js)
4. [Remove Nth Node From End](./LinkedList/remove-nth-node-from-end-of-list.js)
5. [Add Two Numbers](./LinkedList/add-two-numbers.js)
6. [Reorder List](./LinkedList/reorder-list.js)
7. [Copy List With Random Pointer](./LinkedList/copy-list-with-random-pointer.js)
8. [LRU Cache](./LinkedList/lru-cache.js) — **challenge; requires HashMap too**
9. [Middle of the Linked List](./LinkedList/middle-of-the-linked-list.js)
10. [Palindrome Linked List](./LinkedList/palindrome-linked-list.js)
11. [Intersection of Two Linked Lists](./LinkedList/intersection-of-two-linked-lists.js)
12. [Remove Duplicates from Sorted List](./LinkedList/remove-duplicates-from-sorted-list.js)

### Level 7 — Recursion, trees, and BSTs

Review base cases and the call stack. The three recursion warm-ups are supporting practice when needed; their completion is not required before attempting a tree.

1. [Factorial](./Recursion/factorial.js)
2. [Fibonacci Number](./Recursion/fibonacci.js)
3. [Sum of Array (Recursive)](./Recursion/sum-of-array.js)
4. [Maximum Depth of Binary Tree](./Trees/maximum-depth-of-binary-tree.js)
5. [Invert Binary Tree](./Trees/invert-binary-tree.js)
6. [Same Tree](./Trees/same-tree.js)
7. [Binary Tree Level Order Traversal](./Trees/binary-tree-level-order-traversal.js)
8. [Diameter of Binary Tree](./Trees/diameter-of-binary-tree.js)
9. [Balanced Binary Tree](./Trees/balanced-binary-tree.js)
10. [Binary Tree Right Side View](./Trees/binary-tree-right-side-view.js)
11. [Count Good Nodes in Binary Tree](./Trees/count-good-nodes-in-binary-tree.js)
12. [Lowest Common Ancestor of BST](./Trees/lowest-common-ancestor-of-bst.js)
13. [Validate Binary Search Tree](./Trees/validate-binary-search-tree.js)
14. [Kth Smallest Element in BST](./Trees/kth-smallest-element-in-bst.js)
15. [Subtree of Another Tree](./Trees/subtree-of-another-tree.js)
16. [Construct Binary Tree from Preorder and Inorder](./Trees/construct-binary-tree-from-preorder-and-inorder-traversal.js) — **challenge**
17. [Symmetric Tree](./Trees/symmetric-tree.js)
18. [Path Sum](./Trees/path-sum.js)
19. [Minimum Depth of Binary Tree](./Trees/minimum-depth-of-binary-tree.js)
20. [Convert Sorted Array to Binary Search Tree](./Trees/convert-sorted-array-to-binary-search-tree.js)

### Level 8 — Heap and priority queue

1. [Last Stone Weight](./Heap/last-stone-weight.js)
2. [Kth Largest Element in an Array](./Heap/kth-largest-element-in-an-array.js)
3. [Top K Frequent Words](./Heap/top-k-frequent-words.js)
4. [Merge K Sorted Lists](./Heap/merge-k-sorted-lists.js) — requires Linked Lists
5. [Task Scheduler](./Heap/task-scheduler.js)
6. [Find Median from Data Stream](./Heap/find-median-from-data-stream.js) — **challenge**
7. [Relative Ranks](./Heap/relative-ranks.js)
8. [K Closest Points to Origin](./Heap/k-closest-points-to-origin.js)

9. [Implement Trie (Prefix Tree)](./Trie/implement-trie-prefix-tree.js)

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
10. [Generate Parentheses](./Backtracking/generate-parentheses.js)
11. [Combinations](./Backtracking/combinations.js)
12. [Letter Case Permutation](./Backtracking/letter-case-permutation.js)

### Level 10 — Graphs

Use Set/Map and a visited frontier; recursive DFS needs recursion, while BFS needs a queue. Backtracking is not a prerequisite for ordinary graph traversal.

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
13. [Flood Fill](./Graph/flood-fill.js)
14. [Keys and Rooms](./Graph/keys-and-rooms.js)
15. [Find if Path Exists in Graph](./Graph/find-if-path-exists-in-graph.js)
16. [Is Graph Bipartite](./Graph/is-graph-bipartite.js)

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
13. [N-th Tribonacci Number](./Dynamic-Programming/n-th-tribonacci-number.js)
14. [Unique Paths](./Dynamic-Programming/unique-paths.js)
15. [Unique Paths II](./Dynamic-Programming/unique-paths-ii.js)
16. [Triangle](./Dynamic-Programming/triangle.js)

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
14. [Best Time to Buy and Sell Stock II](./Greedy/best-time-to-buy-and-sell-stock-ii.js)
15. [Assign Cookies](./Greedy/assign-cookies.js)
16. [Lemonade Change](./Greedy/lemonade-change.js)
17. [Summary Ranges](./Intervals/summary-ranges.js)
18. [Interval List Intersections](./Intervals/interval-list-intersections.js)

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
12. [Hamming Distance](./Bit-Manipulation/hamming-distance.js)
13. [Binary Number with Alternating Bits](./Bit-Manipulation/binary-number-with-alternating-bits.js)
14. [Complement of Base 10 Integer](./Bit-Manipulation/complement-of-base-10-integer.js)
15. [Reverse Integer](./Math/reverse-integer.js)
16. [Palindrome Number](./Math/palindrome-number.js)
17. [FizzBuzz](./Math/fizzbuzz.js)
18. [Excel Sheet Column Number](./Math/excel-sheet-column-number.js)
19. [Add Digits](./Math/add-digits.js)


### Level 14 — Sorting

Sorting algorithms and the problems that lean on them. Most items here only need Arrays; **Sort List** additionally needs Linked List and Recursion, so save it for last in this level.

1. [Sort an Array](./Sorting/sort-an-array.js)
2. [Sort Colors](./Sorting/sort-colors.js)
3. [Merge Sorted Array](./Sorting/merge-sorted-array.js)
4. [Largest Number](./Sorting/largest-number.js)
5. [Wiggle Sort](./Sorting/wiggle-sort.js)
6. [H-Index](./Sorting/h-index.js)
7. [Relative Sort Array](./Sorting/relative-sort-array.js)
8. [Sort List](./Sorting/sort-list.js) — requires Linked List and Recursion
9. [Bubble Sort](./Sorting/bubble-sort.js)
10. [Selection Sort](./Sorting/selection-sort.js)
11. [Insertion Sort](./Sorting/insertion-sort.js)
12. [Merge Sort (Implementation)](./Sorting/merge-sort-implementation.js)
13. [Quick Sort (Implementation)](./Sorting/quick-sort-implementation.js)
14. [Heap Sort (Implementation)](./Sorting/heap-sort-implementation.js)

## Problems

The sections below are the single progress checklist. They are grouped by folder only for tracking; **do not use their position as the learning order**. Use the dashboard core/pattern selection for the next task; the full queue above remains a library view.

### Arrays

- [x] [Product of Array Except Self](./Arrays/product-of-array-except-self.js)
- [ ] [Longest Consecutive Sequence](./Arrays/longest-consecutive-sequence.js)
- [ ] [Maximum Product Subarray](./Arrays/maximum-product-subarray.js)
- [ ] [Move Zeroes](./Arrays/move-zeroes.js)
- [ ] [Remove Duplicates from Sorted Array](./Arrays/remove-duplicates-from-sorted-array.js)
- [ ] [Remove Element](./Arrays/remove-element.js)
- [ ] [Majority Element](./Arrays/majority-element.js)
- [ ] [Find All Numbers Disappeared in an Array](./Arrays/find-all-numbers-disappeared-in-an-array.js)
- [ ] [Pascal's Triangle](./Arrays/pascals-triangle.js)
- [ ] [Third Maximum Number](./Arrays/third-maximum-number.js)

- [ ] [Range Sum Query - Immutable](./Arrays/range-sum-query-immutable.js)
- [ ] [Subarray Sum Equals K](./Arrays/subarray-sum-equals-k.js)

### Strings

Learn basic string traversal here near the start of the roadmap. The first beginner string questions are listed under their main solution patterns: [Valid Anagram](./HashMap/valid-anagram.js) under HashMap and [Valid Palindrome](./Two-Pointers/valid-palindrome.js) under Two Pointers. Practise the standalone questions below later because they require additional patterns.

- [ ] [String Compression](./String/string-compression.js) — after Two Pointers
- [ ] [Encode and Decode Strings](./String/encode-and-decode-strings.js) — after basic string traversal
- [ ] [Palindromic Substrings](./String/palindromic-substrings.js) — after Two Pointers or Dynamic Programming
- [ ] [Longest Palindromic Substring](./String/longest-palindromic-substring.js) — after Palindromic Substrings
- [ ] [Reverse String](./String/reverse-string.js)
- [ ] [Reverse Words in a String](./String/reverse-words-in-a-string.js)
- [ ] [Find the Index of the First Occurrence in a String](./String/find-the-index-of-the-first-occurrence-in-a-string.js)
- [ ] [Longest Common Prefix](./String/longest-common-prefix.js)
- [ ] [Roman to Integer](./String/roman-to-integer.js)
- [ ] [Isomorphic Strings](./String/isomorphic-strings.js)

### HashMap

- [x] [Two Sum](./HashMap/two-sum.js)
- [x] [Contains Duplicate](./HashMap/contains-duplicate.js)
- [x] [Valid Anagram](./HashMap/valid-anagram.js)
- [x] [Group Anagrams](./HashMap/group-anagrams.js)
- [x] [Top K Frequent Elements](./HashMap/top-k-frequent-elements.js)
- [ ] [Contains Duplicate II](./HashMap/contains-duplicate-ii.js)
- [ ] [Intersection of Two Arrays](./HashMap/intersection-of-two-arrays.js)
- [ ] [Ransom Note](./HashMap/ransom-note.js)
- [ ] [Word Pattern](./HashMap/word-pattern.js)

### Two Pointers

- [x] [Valid Palindrome](./Two-Pointers/valid-palindrome.js)
- [x] [Two Sum II - Input Array Is Sorted](./Two-Pointers/two-sum-ii-input-array-is-sorted.js)
- [ ] [3Sum](./Two-Pointers/3sum.js)
- [ ] [Container With Most Water](./Two-Pointers/container-with-most-water.js)
- [ ] [Trapping Rain Water](./Two-Pointers/trapping-rain-water.js)
- [ ] [Valid Palindrome II](./Two-Pointers/valid-palindrome-ii.js)
- [ ] [Is Subsequence](./Two-Pointers/is-subsequence.js)
- [ ] [Squares of a Sorted Array](./Two-Pointers/squares-of-a-sorted-array.js)
- [ ] [Reverse Vowels of a String](./Two-Pointers/reverse-vowels-of-a-string.js)

### Sliding Window

- [ ] [Best Time to Buy and Sell Stock](./Sliding-Window/best-time-to-buy-and-sell-stock.js)
- [ ] [Longest Substring Without Repeating Characters](./Sliding-Window/longest-substring-without-repeating-characters.js)
- [ ] [Longest Repeating Character Replacement](./Sliding-Window/longest-repeating-character-replacement.js)
- [ ] [Permutation in String](./Sliding-Window/permutation-in-string.js)
- [ ] [Minimum Window Substring](./Sliding-Window/minimum-window-substring.js)
- [ ] [Sliding Window Maximum](./Sliding-Window/sliding-window-maximum.js)

- [ ] [Maximum Average Subarray I](./Sliding-Window/maximum-average-subarray-i.js)

### Stack

- [ ] [Valid Parentheses](./Stack/valid-parentheses.js)
- [ ] [Min Stack](./Stack/min-stack.js)
- [ ] [Evaluate Reverse Polish Notation](./Stack/evaluate-reverse-polish-notation.js)
- [ ] [Daily Temperatures](./Stack/daily-temperatures.js)
- [ ] [Car Fleet](./Stack/car-fleet.js)
- [ ] [Largest Rectangle in Histogram](./Stack/largest-rectangle-in-histogram.js)
- [ ] [Baseball Game](./Stack/baseball-game.js)
- [ ] [Remove All Adjacent Duplicates In String](./Stack/remove-all-adjacent-duplicates-in-string.js)
- [ ] [Implement Stack using Queues](./Stack/implement-stack-using-queues.js)

### Queue

- [ ] [Implement Queue Using Stacks](./Queue/implement-queue-using-stacks.js)
- [ ] [Design Circular Queue](./Queue/design-circular-queue.js)
- [ ] [Number of Recent Calls](./Queue/number-of-recent-calls.js)
- [ ] [Dota2 Senate](./Queue/dota2-senate.js)
- [ ] [Moving Average from Data Stream](./Queue/moving-average-from-data-stream.js)
- [ ] [Number of Students Unable to Eat Lunch](./Queue/number-of-students-unable-to-eat-lunch.js)
- [ ] [Time Needed to Buy Tickets](./Queue/time-needed-to-buy-tickets.js)

### LinkedList

- [ ] [Reverse Linked List](./LinkedList/reverse-linked-list.js)
- [ ] [Merge Two Sorted Lists](./LinkedList/merge-two-sorted-lists.js)
- [ ] [Linked List Cycle](./LinkedList/linked-list-cycle.js)
- [ ] [Remove Nth Node From End of List](./LinkedList/remove-nth-node-from-end-of-list.js)
- [ ] [Reorder List](./LinkedList/reorder-list.js)
- [ ] [Copy List With Random Pointer](./LinkedList/copy-list-with-random-pointer.js)
- [ ] [Add Two Numbers](./LinkedList/add-two-numbers.js)
- [ ] [LRU Cache](./LinkedList/lru-cache.js)
- [ ] [Middle of the Linked List](./LinkedList/middle-of-the-linked-list.js)
- [ ] [Palindrome Linked List](./LinkedList/palindrome-linked-list.js)
- [ ] [Intersection of Two Linked Lists](./LinkedList/intersection-of-two-linked-lists.js)
- [ ] [Remove Duplicates from Sorted List](./LinkedList/remove-duplicates-from-sorted-list.js)

### Recursion

- [ ] [Factorial](./Recursion/factorial.js)
- [ ] [Fibonacci Number](./Recursion/fibonacci.js)
- [ ] [Sum of Array (Recursive)](./Recursion/sum-of-array.js)


### Sorting

- [ ] [Sort an Array](./Sorting/sort-an-array.js)
- [ ] [Sort Colors](./Sorting/sort-colors.js)
- [ ] [Merge Sorted Array](./Sorting/merge-sorted-array.js)
- [ ] [Largest Number](./Sorting/largest-number.js)
- [ ] [Wiggle Sort](./Sorting/wiggle-sort.js)
- [ ] [H-Index](./Sorting/h-index.js)
- [ ] [Relative Sort Array](./Sorting/relative-sort-array.js)
- [ ] [Sort List](./Sorting/sort-list.js)
- [ ] [Bubble Sort](./Sorting/bubble-sort.js)
- [ ] [Selection Sort](./Sorting/selection-sort.js)
- [ ] [Insertion Sort](./Sorting/insertion-sort.js)
- [ ] [Merge Sort (Implementation)](./Sorting/merge-sort-implementation.js)
- [ ] [Quick Sort (Implementation)](./Sorting/quick-sort-implementation.js)
- [ ] [Heap Sort (Implementation)](./Sorting/heap-sort-implementation.js)

### Binary Search

- [ ] [Binary Search](./Binary-Search/binary-search.js)
- [ ] [Search Insert Position](./Binary-Search/search-insert-position.js)
- [ ] [Guess Number Higher or Lower](./Binary-Search/guess-number-higher-or-lower.js)
- [ ] [Search in Rotated Sorted Array](./Binary-Search/search-in-rotated-sorted-array.js)
- [ ] [Find Minimum in Rotated Sorted Array](./Binary-Search/find-minimum-in-rotated-sorted-array.js)
- [ ] [Koko Eating Bananas](./Binary-Search/koko-eating-bananas.js)
- [ ] [Time Based Key-Value Store](./Binary-Search/time-based-key-value-store.js)
- [ ] [Median of Two Sorted Arrays](./Binary-Search/median-of-two-sorted-arrays.js)
- [ ] [Sqrt(x)](./Binary-Search/sqrtx.js)
- [ ] [First Bad Version](./Binary-Search/first-bad-version.js)
- [ ] [Find Peak Element](./Binary-Search/find-peak-element.js)
- [ ] [Find First and Last Position of Element in Sorted Array](./Binary-Search/find-first-and-last-position-of-element-in-sorted-array.js)

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
- [ ] [Symmetric Tree](./Trees/symmetric-tree.js)
- [ ] [Path Sum](./Trees/path-sum.js)
- [ ] [Minimum Depth of Binary Tree](./Trees/minimum-depth-of-binary-tree.js)
- [ ] [Convert Sorted Array to Binary Search Tree](./Trees/convert-sorted-array-to-binary-search-tree.js)

### Heap

- [ ] [Kth Largest Element in an Array](./Heap/kth-largest-element-in-an-array.js)
- [ ] [Last Stone Weight](./Heap/last-stone-weight.js)
- [ ] [Top K Frequent Words](./Heap/top-k-frequent-words.js)
- [ ] [Task Scheduler](./Heap/task-scheduler.js)
- [ ] [Find Median from Data Stream](./Heap/find-median-from-data-stream.js)
- [ ] [Merge K Sorted Lists](./Heap/merge-k-sorted-lists.js)
- [ ] [Relative Ranks](./Heap/relative-ranks.js)
- [ ] [K Closest Points to Origin](./Heap/k-closest-points-to-origin.js)

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
- [ ] [Flood Fill](./Graph/flood-fill.js)
- [ ] [Keys and Rooms](./Graph/keys-and-rooms.js)
- [ ] [Find if Path Exists in Graph](./Graph/find-if-path-exists-in-graph.js)
- [ ] [Is Graph Bipartite](./Graph/is-graph-bipartite.js)

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
- [ ] [Generate Parentheses](./Backtracking/generate-parentheses.js)
- [ ] [Combinations](./Backtracking/combinations.js)
- [ ] [Letter Case Permutation](./Backtracking/letter-case-permutation.js)

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
- [ ] [N-th Tribonacci Number](./Dynamic-Programming/n-th-tribonacci-number.js)
- [ ] [Unique Paths](./Dynamic-Programming/unique-paths.js)
- [ ] [Unique Paths II](./Dynamic-Programming/unique-paths-ii.js)
- [ ] [Triangle](./Dynamic-Programming/triangle.js)

### Greedy

- [ ] [Jump Game](./Greedy/jump-game.js)
- [ ] [Jump Game II](./Greedy/jump-game-ii.js)
- [ ] [Gas Station](./Greedy/gas-station.js)
- [ ] [Hand of Straights](./Greedy/hand-of-straights.js)
- [ ] [Merge Triplets to Form Target Triplet](./Greedy/merge-triplets-to-form-target-triplet.js)
- [ ] [Partition Labels](./Greedy/partition-labels.js)
- [ ] [Valid Parenthesis String](./Greedy/valid-parenthesis-string.js)
- [ ] [Best Time to Buy and Sell Stock II](./Greedy/best-time-to-buy-and-sell-stock-ii.js)
- [ ] [Assign Cookies](./Greedy/assign-cookies.js)
- [ ] [Lemonade Change](./Greedy/lemonade-change.js)

### Bit Manipulation

- [ ] [Single Number](./Bit-Manipulation/single-number.js)
- [ ] [Number of 1 Bits](./Bit-Manipulation/number-of-1-bits.js)
- [ ] [Counting Bits](./Bit-Manipulation/counting-bits.js)
- [ ] [Reverse Bits](./Bit-Manipulation/reverse-bits.js)
- [ ] [Missing Number](./Bit-Manipulation/missing-number.js)
- [ ] [Sum of Two Integers](./Bit-Manipulation/sum-of-two-integers.js)
- [ ] [Hamming Distance](./Bit-Manipulation/hamming-distance.js)
- [ ] [Binary Number with Alternating Bits](./Bit-Manipulation/binary-number-with-alternating-bits.js)
- [ ] [Complement of Base 10 Integer](./Bit-Manipulation/complement-of-base-10-integer.js)

### Intervals

- [ ] [Merge Intervals](./Intervals/merge-intervals.js)
- [ ] [Insert Interval](./Intervals/insert-interval.js)
- [ ] [Non-overlapping Intervals](./Intervals/non-overlapping-intervals.js)
- [ ] [Meeting Rooms](./Intervals/meeting-rooms.js)
- [ ] [Meeting Rooms II](./Intervals/meeting-rooms-ii.js)
- [ ] [Minimum Interval to Include Each Query](./Intervals/minimum-interval-to-include-each-query.js)
- [ ] [Summary Ranges](./Intervals/summary-ranges.js)
- [ ] [Interval List Intersections](./Intervals/interval-list-intersections.js)

### Math

- [ ] [Happy Number](./Math/happy-number.js)
- [ ] [Plus One](./Math/plus-one.js)
- [ ] [Rotate Image](./Math/rotate-image.js)
- [ ] [Pow(x, n)](./Math/pow-x-n.js)
- [ ] [Multiply Strings](./Math/multiply-strings.js)
- [ ] [Reverse Integer](./Math/reverse-integer.js)
- [ ] [Palindrome Number](./Math/palindrome-number.js)
- [ ] [FizzBuzz](./Math/fizzbuzz.js)
- [ ] [Excel Sheet Column Number](./Math/excel-sheet-column-number.js)
- [ ] [Add Digits](./Math/add-digits.js)

### Trie

- [ ] [Implement Trie (Prefix Tree)](./Trie/implement-trie-prefix-tree.js)

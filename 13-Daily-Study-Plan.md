# 8-Week Daily Interview Study Plan

Use this file every day. The plan assumes 90 minutes to 3 hours daily. If you miss a day, continue with the next unfinished day instead of trying to complete two days at once.

## Daily rules

1. Start with the DSA problem before reading any solution.
2. Spend at most 35 minutes on one problem before studying a hint or approach.
3. Write the approach, time complexity, space complexity, and test cases in the JavaScript file.
4. Mark a problem complete only in [01-DSA-Questions.md](./01-DSA-Questions.md).
5. End the session by explaining one concept aloud for five minutes.
6. Repeat difficult problems after 1, 3, 7, and 14 days.

## Standard session

- 45-90 minutes: new DSA problems
- 20-30 minutes: repeat an older problem
- 30-45 minutes: full-stack study
- 10-15 minutes: notes or interview explanation

---

## Week 1 — Arrays, HashMap, and JavaScript Foundations

### Day 1 — Setup and baseline

- [ ] Read [README.md](./README.md) and [00-Roadmap.md](./00-Roadmap.md).
- [ ] Solve [Two Sum](./HashMap/two-sum.js).
- [ ] Study scope, `var`, `let`, `const`, and hoisting in [JavaScript](./02-JavaScript.md).
- [ ] Write and practise your 60-90 second introduction.

### Day 2 — Frequency counting

- [ ] Solve [Contains Duplicate](./HashMap/contains-duplicate.js).
- [ ] Solve [Valid Anagram](./HashMap/valid-anagram.js).
- [ ] Review JavaScript objects, `Map`, and `Set`.
- [ ] Repeat Two Sum without looking at yesterday's code.

### Day 3 — HashMap patterns

- [ ] Solve [Group Anagrams](./HashMap/group-anagrams.js).
- [ ] Review your completed [Top K Frequent Elements](./HashMap/top-k-frequent-elements.js) solution.
- [ ] Study array methods: `map`, `filter`, `reduce`, `sort`, and `find`.
- [ ] Explain when a `Map` is preferable to an object.

### Day 4 — Prefix and suffix technique

- [ ] Solve [Product of Array Except Self](./Arrays/product-of-array-except-self.js).
- [ ] Repeat Contains Duplicate and Valid Anagram.
- [ ] Study functions, arrow functions, and the `this` keyword.
- [ ] Add edge-case tests to the problems completed this week.

### Day 5 — Set-based array reasoning

- [ ] Solve [Longest Consecutive Sequence](./Arrays/longest-consecutive-sequence.js).
- [ ] Repeat Group Anagrams.
- [ ] Study closures with two small code examples.
- [ ] Explain the brute-force and optimized approaches aloud.

### Day 6 — JavaScript practice day

- [ ] Re-solve Two Sum and Product of Array Except Self under a timer.
- [ ] Implement a simple `map` or `filter` polyfill.
- [ ] Review shallow copy, deep copy, destructuring, spread, and rest.
- [ ] Review one project using [Projects](./10-Projects.md).

### Day 7 — Weekly review

- [ ] Re-solve two problems you found difficult without notes.
- [ ] Check that every completed JavaScript file includes complexity and tests.
- [ ] Review all Week 1 JavaScript topics.
- [ ] Record strengths, mistakes, and next review dates.
- [ ] Practise your introduction and one project explanation aloud.

---

## Week 2 — Two Pointers, Sliding Window, Stack, Queue, and Async JavaScript

### Day 8 — Two pointers basics

- [ ] Solve [Valid Palindrome](./Two-Pointers/valid-palindrome.js).
- [ ] Solve [Two Sum II](./Two-Pointers/two-sum-ii-input-array-is-sorted.js).
- [ ] Study promises in [JavaScript](./02-JavaScript.md).
- [ ] Repeat Longest Consecutive Sequence.

### Day 9 — Moving two boundaries

- [ ] Solve [Container With Most Water](./Two-Pointers/container-with-most-water.js).
- [ ] Attempt [3Sum](./Two-Pointers/3sum.js).
- [ ] Study `async`/`await` and promise error handling.
- [ ] Explain why sorting helps the 3Sum approach.

### Day 10 — Sliding-window basics

- [ ] Solve [Best Time to Buy and Sell Stock](./Sliding-Window/best-time-to-buy-and-sell-stock.js).
- [ ] Solve [Longest Substring Without Repeating Characters](./Sliding-Window/longest-substring-without-repeating-characters.js).
- [ ] Study the call stack and event loop.
- [ ] Repeat Valid Palindrome.

### Day 11 — Variable windows

- [ ] Solve [Longest Repeating Character Replacement](./Sliding-Window/longest-repeating-character-replacement.js).
- [ ] Attempt [Permutation in String](./Sliding-Window/permutation-in-string.js).
- [ ] Study microtasks versus macrotasks.
- [ ] Predict the output of three event-loop examples.

### Day 12 — Stack patterns

- [ ] Solve [Valid Parentheses](./Stack/valid-parentheses.js).
- [ ] Solve [Min Stack](./Stack/min-stack.js).
- [ ] Begin [React](./03-React.md): components, props, state, and rendering.
- [ ] Repeat Container With Most Water.

### Day 13 — Stack and queue practice

- [ ] Solve [Daily Temperatures](./Stack/daily-temperatures.js).
- [ ] Solve [Implement Queue Using Stacks](./Queue/implement-queue-using-stacks.js).
- [ ] Study React controlled and uncontrolled inputs.
- [ ] Review 3Sum and write the approach without code.

### Day 14 — Weekly review

- [ ] Re-solve one two-pointer and one sliding-window problem under a timer.
- [ ] Repeat Valid Parentheses without notes.
- [ ] Review promises, `async`/`await`, and the event loop aloud.
- [ ] Complete a 45-minute DSA mock and record it in [Mock Interviews](./Mock-Interviews/README.md).

---

## Week 3 — Binary Search, Linked Lists, and React

### Day 15 — Binary-search template

- [ ] Solve [Binary Search](./Binary-Search/binary-search.js).
- [ ] Solve [Search Insert Position](./Binary-Search/search-insert-position.js).
- [ ] Study React reconciliation and keys.
- [ ] Repeat Longest Substring Without Repeating Characters.

### Day 16 — Rotated arrays

- [ ] Solve [Search in Rotated Sorted Array](./Binary-Search/search-in-rotated-sorted-array.js).
- [ ] Solve [Find Minimum in Rotated Sorted Array](./Binary-Search/find-minimum-in-rotated-sorted-array.js).
- [ ] Study `useState` and state update behavior.
- [ ] Explain the binary-search invariants aloud.

### Day 17 — Search on the answer

- [ ] Solve [Koko Eating Bananas](./Binary-Search/koko-eating-bananas.js).
- [ ] Attempt [Time Based Key-Value Store](./Binary-Search/time-based-key-value-store.js).
- [ ] Study `useEffect`, dependencies, and cleanup.
- [ ] Repeat Binary Search from memory.

### Day 18 — Linked-list basics

- [ ] Solve [Reverse Linked List](./LinkedList/reverse-linked-list.js).
- [ ] Solve [Merge Two Sorted Lists](./LinkedList/merge-two-sorted-lists.js).
- [ ] Study `useRef` and DOM references.
- [ ] Draw pointer changes before writing code.

### Day 19 — Fast and slow pointers

- [ ] Solve [Linked List Cycle](./LinkedList/linked-list-cycle.js).
- [ ] Solve [Remove Nth Node From End](./LinkedList/remove-nth-node-from-end-of-list.js).
- [ ] Study `useMemo` and `useCallback` trade-offs.
- [ ] Repeat Reverse Linked List.

### Day 20 — Linked-list transformations

- [ ] Attempt [Reorder List](./LinkedList/reorder-list.js).
- [ ] Solve [Add Two Numbers](./LinkedList/add-two-numbers.js).
- [ ] Study React Context and reducers.
- [ ] Explain a React component from one of your projects.

### Day 21 — Weekly review and React mock

- [ ] Re-solve one binary-search and one linked-list problem under a timer.
- [ ] Build a small controlled form or searchable list in React.
- [ ] Review common `useEffect` mistakes.
- [ ] Complete a React question mock and record feedback.

---

## Week 4 — Trees, Heap, Next.js, and Frontend Performance

### Day 22 — Tree recursion

- [ ] Solve [Invert Binary Tree](./Trees/invert-binary-tree.js).
- [ ] Solve [Maximum Depth of Binary Tree](./Trees/maximum-depth-of-binary-tree.js).
- [ ] Begin [Next.js](./04-NextJS.md): routing, layouts, and rendering.
- [ ] Repeat Search in Rotated Sorted Array.

### Day 23 — Tree properties

- [ ] Solve [Diameter of Binary Tree](./Trees/diameter-of-binary-tree.js).
- [ ] Solve [Balanced Binary Tree](./Trees/balanced-binary-tree.js).
- [ ] Study Server Components versus Client Components.
- [ ] Draw the recursion tree for one solution.

### Day 24 — Comparing trees

- [ ] Solve [Same Tree](./Trees/same-tree.js).
- [ ] Solve [Subtree of Another Tree](./Trees/subtree-of-another-tree.js).
- [ ] Study static rendering, dynamic rendering, SSR, and ISR.
- [ ] Repeat Maximum Depth of Binary Tree.

### Day 25 — BST patterns

- [ ] Solve [Lowest Common Ancestor of BST](./Trees/lowest-common-ancestor-of-bst.js).
- [ ] Solve [Validate Binary Search Tree](./Trees/validate-binary-search-tree.js).
- [ ] Study Next.js caching and revalidation.
- [ ] Explain BST ordering and boundary handling.

### Day 26 — Breadth-first traversal

- [ ] Solve [Binary Tree Level Order Traversal](./Trees/binary-tree-level-order-traversal.js).
- [ ] Solve [Binary Tree Right Side View](./Trees/binary-tree-right-side-view.js).
- [ ] Study frontend performance: memoization, lazy loading, images, and bundle size.
- [ ] Repeat Diameter of Binary Tree.

### Day 27 — Heap fundamentals

- [ ] Solve [Kth Largest Element](./Heap/kth-largest-element-in-an-array.js).
- [ ] Solve [Last Stone Weight](./Heap/last-stone-weight.js).
- [ ] Study route handlers, middleware, loading, and error states in Next.js.
- [ ] Explain when a heap is preferable to sorting.

### Day 28 — Weekly review

- [ ] Re-solve two tree problems without notes.
- [ ] Repeat one heap problem under a timer.
- [ ] Explain the rendering strategy used in one of your Next.js pages.
- [ ] Complete a project deep-dive mock and record feedback.

---

## Week 5 — Graphs, Backtracking, Node.js, and Express

### Day 29 — Grid traversal

- [ ] Solve [Number of Islands](./Graph/number-of-islands.js).
- [ ] Solve [Max Area of Island](./Graph/max-area-of-island.js).
- [ ] Begin [Node.js](./05-NodeJS.md): runtime, modules, and event loop.
- [ ] Repeat Binary Tree Level Order Traversal.

### Day 30 — Graph representation

- [ ] Solve [Clone Graph](./Graph/clone-graph.js).
- [ ] Solve [Rotting Oranges](./Graph/rotting-oranges.js).
- [ ] Study Node.js events, buffers, and streams.
- [ ] Explain BFS versus DFS and their complexity.

### Day 31 — Dependencies and cycles

- [ ] Solve [Course Schedule](./Graph/course-schedule.js).
- [ ] Attempt [Course Schedule II](./Graph/course-schedule-ii.js).
- [ ] Begin [Express](./06-Express.md): routing and middleware order.
- [ ] Repeat Number of Islands.

### Day 32 — Backtracking template

- [ ] Solve [Subsets](./Backtracking/subsets.js).
- [ ] Solve [Permutations](./Backtracking/permutations.js).
- [ ] Study Express validation and centralized error handling.
- [ ] Draw the decision tree before coding.

### Day 33 — Choice and pruning

- [ ] Solve [Combination Sum](./Backtracking/combination-sum.js).
- [ ] Solve [Combination Sum II](./Backtracking/combination-sum-ii.js).
- [ ] Study authentication versus authorization.
- [ ] Repeat Clone Graph.

### Day 34 — Backend interview practice

- [ ] Attempt [Word Search](./Backtracking/word-search.js).
- [ ] Review one unfinished graph problem.
- [ ] Study CORS, secure cookies, rate limiting, Helmet, and input sanitization.
- [ ] Explain an API from one of your projects, including errors and security.

### Day 35 — Weekly review

- [ ] Re-solve one graph and one backtracking problem under a timer.
- [ ] Design a small REST API with routes, validation, and error responses.
- [ ] Review Node.js event loop and Express middleware aloud.
- [ ] Complete a backend/API mock and record feedback.

---

## Week 6 — Dynamic Programming, Greedy, and SQL

### Day 36 — One-dimensional DP

- [ ] Solve [Climbing Stairs](./Dynamic-Programming/climbing-stairs.js).
- [ ] Solve [Min Cost Climbing Stairs](./Dynamic-Programming/min-cost-climbing-stairs.js).
- [ ] Begin [SQL](./07-SQL.md): SELECT, filtering, sorting, and grouping.
- [ ] Repeat Subsets.

### Day 37 — Recurrence decisions

- [ ] Solve [House Robber](./Dynamic-Programming/house-robber.js).
- [ ] Solve [House Robber II](./Dynamic-Programming/house-robber-ii.js).
- [ ] Study INNER JOIN and LEFT JOIN.
- [ ] Write the recurrence before writing code.

### Day 38 — Unbounded choices

- [ ] Solve [Coin Change](./Dynamic-Programming/coin-change.js).
- [ ] Solve [Word Break](./Dynamic-Programming/word-break.js).
- [ ] Practise GROUP BY, HAVING, and aggregate queries.
- [ ] Repeat Climbing Stairs and explain the space optimization.

### Day 39 — Sequence DP

- [ ] Solve [Longest Increasing Subsequence](./Dynamic-Programming/longest-increasing-subsequence.js).
- [ ] Attempt [Longest Common Subsequence](./Dynamic-Programming/longest-common-subsequence.js).
- [ ] Study CTEs and subqueries.
- [ ] Draw the DP state and transitions.

### Day 40 — Greedy decisions

- [ ] Solve [Jump Game](./Greedy/jump-game.js).
- [ ] Solve [Partition Labels](./Greedy/partition-labels.js).
- [ ] Study indexes and query plans.
- [ ] Explain why the greedy choice is safe.

### Day 41 — More greedy practice

- [ ] Solve [Jump Game II](./Greedy/jump-game-ii.js).
- [ ] Attempt [Gas Station](./Greedy/gas-station.js).
- [ ] Study transactions, isolation, and ACID.
- [ ] Repeat House Robber.

### Day 42 — Weekly review and SQL mock

- [ ] Re-solve one DP and one greedy problem under a timer.
- [ ] Write queries for second-highest salary and top salaries per department.
- [ ] Review joins, indexes, transactions, and normalization.
- [ ] Complete a combined SQL and DSA mock.

---

## Week 7 — Intervals, Strings, Math, Bits, and System Design

### Day 43 — Interval patterns

- [ ] Solve [Merge Intervals](./Intervals/merge-intervals.js).
- [ ] Solve [Insert Interval](./Intervals/insert-interval.js).
- [ ] Begin [System Design](./08-System-Design.md): requirements and estimations.
- [ ] Repeat Coin Change.

### Day 44 — Scheduling intervals

- [ ] Solve [Non-overlapping Intervals](./Intervals/non-overlapping-intervals.js).
- [ ] Solve [Meeting Rooms](./Intervals/meeting-rooms.js).
- [ ] Study APIs, data models, and high-level components.
- [ ] Explain why sorting is used in interval problems.

### Day 45 — String patterns

- [ ] Solve [Longest Palindromic Substring](./String/longest-palindromic-substring.js).
- [ ] Solve [Palindromic Substrings](./String/palindromic-substrings.js).
- [ ] Study load balancing, caching, CDNs, and queues.
- [ ] Repeat Merge Intervals.

### Day 46 — Matrix and number problems

- [ ] Solve [Happy Number](./Math/happy-number.js).
- [ ] Solve [Rotate Image](./Math/rotate-image.js).
- [ ] Study SQL versus NoSQL and database partitioning.
- [ ] Explain all matrix boundaries before coding.

### Day 47 — Bit manipulation

- [ ] Solve [Single Number](./Bit-Manipulation/single-number.js).
- [ ] Solve [Counting Bits](./Bit-Manipulation/counting-bits.js).
- [ ] Study replication, consistency, and availability.
- [ ] Review XOR and common bit operations.

### Day 48 — Design practice

- [ ] Solve [Missing Number](./Bit-Manipulation/missing-number.js).
- [ ] Repeat one weak interval or string problem.
- [ ] Design a URL shortener using the order in [System Design](./08-System-Design.md).
- [ ] Record requirements, APIs, schema, components, and trade-offs.

### Day 49 — Weekly review

- [ ] Re-solve two Week 7 problems under a timer.
- [ ] Design a notification service or chat application in 45 minutes.
- [ ] Review caching, databases, queues, reliability, and security.
- [ ] Complete a system-design mock and record feedback.

---

## Week 8 — Mixed Revision, Projects, Resume, Behavioral, and Final Mocks

### Day 50 — Weak-area audit

- [ ] Review [01-DSA-Questions.md](./01-DSA-Questions.md) and select your five weakest problems.
- [ ] Re-solve two weak problems without notes.
- [ ] Review [Resume Notes](./11-Resume-Notes.md) and correct unclear claims.
- [ ] Verify every resume link, date, skill, and project claim.

### Day 51 — Project deep dive

- [ ] Re-solve one medium array, HashMap, or sliding-window problem.
- [ ] Complete the template in [Projects](./10-Projects.md) for your strongest project.
- [ ] Explain its architecture, hardest decision, production issue, and measurable result.
- [ ] Prepare answers for likely follow-up questions.

### Day 52 — Behavioral stories

- [ ] Re-solve one tree or graph problem.
- [ ] Prepare three STAR stories using [Behavioral](./12-Behavioral.md).
- [ ] Cover conflict, failure, ownership, and ambiguity.
- [ ] Keep each spoken answer under two minutes.

### Day 53 — HR preparation

- [ ] Re-solve one DP or greedy problem.
- [ ] Prepare answers from [HR Interview](./09-HR-Interview.md).
- [ ] Research the target company, product, role, and recent work.
- [ ] Prepare five thoughtful questions for the interviewer.

### Day 54 — Full technical mock

- [ ] Complete a 60-minute DSA mock with no notes.
- [ ] Complete a 30-minute JavaScript, React, Node.js, and SQL discussion.
- [ ] Record mistakes immediately in [Mock Interviews](./Mock-Interviews/README.md).
- [ ] Schedule the failed questions for tomorrow and three days later.

### Day 55 — Full communication mock

- [ ] Repeat the problems missed in yesterday's mock.
- [ ] Complete a project deep dive or system-design mock.
- [ ] Complete a behavioral and HR mock.
- [ ] Improve answers that were vague, long, or missing measurable results.

### Day 56 — Final review

- [ ] Re-solve two familiar problems to build confidence; do not learn a new topic.
- [ ] Review your introduction, project summaries, STAR stories, and interviewer questions.
- [ ] Check the interview time, format, meeting link, environment, and resume.
- [ ] Stop heavy study early, rest, and sleep properly.

---

## After eight weeks

If interviews have not started yet, repeat Weeks 7 and 8 with different problems. Focus on unchecked questions, failed mocks, and topics appearing most often in your target job descriptions. Do not restart from Day 1 unless fundamentals are still weak.

# Archived study calendar — historical reference only

This previous plan is retained for its exercises and historical checkboxes.
Its calendar deadlines, quotas, compensation assumptions and automatic pacing
are superseded by [the current roadmap](../00-Roadmap.md) and
[day modes](../13-Daily-Study-Plan.md). These checkboxes are not current progress;
use the dashboard/checklist and recorded evidence. Relative links were adjusted
for this archive location; the original content below is otherwise preserved.

---

# 16-Week Interview Study and Job-Search Plan

Weeks 1-8 build the skill (DSA, JavaScript, React, Next.js, Node, Express, SQL,
system design). Weeks 9-16 turn that skill into offers: applications,
referrals, a live interview loop, and negotiation. Total span is roughly
3-4 months depending on how many weeks you repeat.

## How this plan actually runs day to day

The calendar below (Day 1, Day 2, ...) is a **pacing reference**, not a hard
gate. In practice:

- Run `npm run today` every day. It tells you the next DSA problem in
  dependency order automatically — it does not care what "Day" you are on.
  Skip a day, and it just continues from where the checklist actually is.
- Use the "Day N" text below for two things only: which **full-stack topic**
  to study that day, and when a **mock interview or weekly review** is due.
- If you fall behind the calendar, that's fine — full-stack topics and mocks
  shift forward with you. Never try to cram two days into one to "catch up";
  that's what breaks the habit.

## Time ramp (matches a 60-minute-first start)

- **Weeks 1-2:** ~60 minutes/day. One core problem, or half of one if it's
  unfamiliar territory. This is deliberately light — the goal is to rebuild
  the daily habit, not to maximize problems solved.
- **Weeks 3-4:** ~75 minutes/day. Add the 15-minute repeat-an-older-problem
  block back in.
- **Weeks 5-8:** ~90 minutes/day. Full standard session below.
- **Weeks 9-16:** ~2 hours/day, split between continued DSA/full-stack
  revision and job-search work (applications, mocks, outreach). `npm run
  today` keeps suggesting a time budget for the week you're in.

If you only have the shorter time on a given day, do the core problem and
skip the rest — a short session that happens beats a long session that gets
postponed and never does.

Use this file every day. If you miss a day, continue with the next unfinished
DSA problem via `npm run today` instead of trying to complete two days at once.

## Daily rules

1. Complete only one new **core problem** per day. A second problem marked **optional stretch** is only for days when you have extra time and the core problem felt comfortable.
2. Try the problem for 25 minutes. Then read one hint, try for 10 more minutes, and only then study the full approach.
3. Write the approach, time complexity, space complexity, and test cases in the JavaScript file.
4. Mark a problem complete by running `npm run done -- Folder/problem-file`. It checks it off in [01-DSA-Questions.md](../01-DSA-Questions.md) and logs it for you — never hand-edit that checklist.
5. End the session by explaining one concept aloud for five minutes.
6. Repeat difficult problems after 1, 3, 7, and 14 days.
7. A calendar day never overrides prerequisites. If its problem is still locked, solve the next unlocked problem in the [dependency-ordered practice queue](../01-DSA-Questions.md#dependency-ordered-practice-queue) and shift the calendar forward.
8. Skip a problem marked **challenge** on your first pass if it feels overwhelming. Complete the easier questions in the next level, then return with more pattern experience.
9. Optional stretch problems are never prerequisites for the next day's core problem. Skipping them does not put you behind.

## Standard session

- 35 minutes: learn one pattern and solve its core problem
- 15 minutes: repeat one older problem
- 30 minutes: full-stack study
- 10 minutes: tests, notes, complexity, and spoken explanation

If you have three hours and the core problem was comfortable, use the remaining time for the optional stretch problem. Speed comes from recognizing patterns and remembering them, not from rushing through more new questions.

## Readiness gate

Move to the next pattern only when you can:

- explain when the current pattern should be used;
- solve its easiest core problem again without notes;
- state the time and space complexity; and
- describe one common mistake or edge case.

If any item is missing, repeat the current pattern tomorrow. This changes the calendar date, not the learning order.

## DSA topic order

Before following the daily problem schedule, be comfortable with JavaScript variables, loops, functions, arrays, strings, and basic Big-O. The recommended DSA topic path is:

**Arrays → Strings → HashMap → Two Pointers → Sliding Window → Stack/Queue → Binary Search → LinkedList → Recursion → Trees → Heap → Backtracking → Graph → Dynamic Programming → Greedy → Intervals → Bits/Math → Sorting**

Sorting is listed last because you'll already be using `.sort()` informally from Week 1 — the dedicated Sorting problems (implementing merge sort, custom comparators, etc.) are a focused set best tackled once the core patterns feel comfortable, not a blocker for anything earlier. `npm run today` will surface them in their turn regardless of where you are in this plan.

Arrays and Strings come first because nearly every later pattern uses their traversal skills. Advanced string patterns such as palindrome expansion can still be practised later. Do not begin with Recursion; study it after the linear data structures and immediately before Trees, Backtracking, Graphs, and Dynamic Programming. See [01-DSA-Questions.md](../01-DSA-Questions.md#concept-first-learning-order) for what each stage teaches and why it comes in that position.

---

## Week 1 — Arrays, Strings, HashMap, and JavaScript Foundations

### Day 1 — Array traversal and Set lookup

- [ ] Read [README.md](../README.md) and [00-Roadmap.md](../00-Roadmap.md).
- [x] Solve [Contains Duplicate](../HashMap/contains-duplicate.js).
- [ ] Study scope, `var`, `let`, `const`, and hoisting in [JavaScript](../02-JavaScript.md).
- [ ] Write and practise your 60-90 second introduction.

### Day 2 — String traversal and frequency counting

- [x] Solve [Valid Anagram](../HashMap/valid-anagram.js).
- [x] Solve [Two Sum](../HashMap/two-sum.js).
- [ ] Review JavaScript objects, `Map`, and `Set`.
- [ ] Repeat Contains Duplicate without looking at yesterday's code.

### Day 3 — HashMap patterns

- [x] Solve [Group Anagrams](../HashMap/group-anagrams.js).
- [x] Review your completed [Top K Frequent Elements](../HashMap/top-k-frequent-elements.js) solution.
- [ ] Study array methods: `map`, `filter`, `reduce`, `sort`, and `find`.
- [ ] Explain when a `Map` is preferable to an object.

### Day 4 — Two-pointer foundation

- [x] Solve [Valid Palindrome](../Two-Pointers/valid-palindrome.js) as today's core problem.
- [ ] Optional stretch: [Product of Array Except Self](../Arrays/product-of-array-except-self.js).
- [ ] Repeat Contains Duplicate and Valid Anagram.
- [ ] Study functions, arrow functions, and the `this` keyword.
- [ ] Add edge-case tests to the problems completed this week.

### Day 5 — Two pointers on a sorted array

- [x] Solve [Two Sum II](../Two-Pointers/two-sum-ii-input-array-is-sorted.js) as today's core problem.
- [ ] Optional stretch: [Longest Consecutive Sequence](../Arrays/longest-consecutive-sequence.js).
- [ ] Repeat Group Anagrams.
- [ ] Study closures with two small code examples.
- [ ] Explain the brute-force and optimized approaches aloud.

### Day 6 — JavaScript practice day

- [ ] Re-solve Two Sum and Valid Palindrome under a timer.
- [ ] Implement a simple `map` or `filter` polyfill.
- [ ] Review shallow copy, deep copy, destructuring, spread, and rest.
- [ ] Review one project using [Projects](../10-Projects.md).

### Day 7 — Weekly review

- [ ] Re-solve two problems you found difficult without notes.
- [ ] Check that every completed JavaScript file includes complexity and tests.
- [ ] Review all Week 1 JavaScript topics.
- [ ] Record strengths, mistakes, and next review dates.
- [ ] Practise your introduction and one project explanation aloud.

---

## Week 2 — Two Pointers, Sliding Window, Stack, Queue, and Async JavaScript

### Day 8 — Two pointers basics

- [ ] Solve [Valid Palindrome II](../Two-Pointers/valid-palindrome-ii.js).
- [ ] Optional stretch: [String Compression](../String/string-compression.js).
- [ ] Study promises in [JavaScript](../02-JavaScript.md).
- [ ] Repeat Two Sum II.

### Day 9 — Moving two boundaries

- [ ] Solve [Container With Most Water](../Two-Pointers/container-with-most-water.js).
- [ ] Optional stretch: attempt [3Sum](../Two-Pointers/3sum.js).
- [ ] Study `async`/`await` and promise error handling.
- [ ] Explain why sorting helps the 3Sum approach.

### Day 10 — Sliding-window basics

- [ ] Solve [Best Time to Buy and Sell Stock](../Sliding-Window/best-time-to-buy-and-sell-stock.js).
- [ ] Optional stretch: [Longest Substring Without Repeating Characters](../Sliding-Window/longest-substring-without-repeating-characters.js).
- [ ] Study the call stack and event loop.
- [ ] Repeat Valid Palindrome.

### Day 11 — Variable windows

- [ ] Solve [Longest Substring Without Repeating Characters](../Sliding-Window/longest-substring-without-repeating-characters.js).
- [ ] Optional stretch: [Permutation in String](../Sliding-Window/permutation-in-string.js).
- [ ] Study microtasks versus macrotasks.
- [ ] Predict the output of three event-loop examples.

### Day 12 — Stack patterns

- [ ] Solve [Valid Parentheses](../Stack/valid-parentheses.js).
- [ ] Optional stretch: [Evaluate Reverse Polish Notation](../Stack/evaluate-reverse-polish-notation.js).
- [ ] Begin [React](../03-React.md): components, props, state, and rendering.
- [ ] Repeat Container With Most Water.

### Day 13 — Stack and queue practice

- [ ] Solve [Min Stack](../Stack/min-stack.js).
- [ ] Optional stretch: [Number of Recent Calls](../Queue/number-of-recent-calls.js).
- [ ] Study React controlled and uncontrolled inputs.
- [ ] Review Container With Most Water and write the approach without code.

### Day 14 — Weekly review

- [ ] Re-solve one two-pointer and one sliding-window problem under a timer.
- [ ] Repeat Valid Parentheses without notes.
- [ ] Review promises, `async`/`await`, and the event loop aloud.
- [ ] Complete a 45-minute DSA mock and record it in [Mock Interviews](../Mock-Interviews/README.md).

---

## Week 3 — Binary Search, Linked Lists, and React

### Day 15 — Binary-search template

- [ ] Solve [Binary Search](../Binary-Search/binary-search.js).
- [ ] Optional stretch: [Search Insert Position](../Binary-Search/search-insert-position.js).
- [ ] Study React reconciliation and keys.
- [ ] Repeat Longest Substring Without Repeating Characters.

### Day 16 — Rotated arrays

- [ ] Solve [Find Minimum in Rotated Sorted Array](../Binary-Search/find-minimum-in-rotated-sorted-array.js).
- [ ] Optional stretch: [Search in Rotated Sorted Array](../Binary-Search/search-in-rotated-sorted-array.js).
- [ ] Study `useState` and state update behavior.
- [ ] Explain the binary-search invariants aloud.

### Day 17 — Search on the answer

- [ ] Solve [Koko Eating Bananas](../Binary-Search/koko-eating-bananas.js).
- [ ] Optional stretch: [Time Based Key-Value Store](../Binary-Search/time-based-key-value-store.js).
- [ ] Study `useEffect`, dependencies, and cleanup.
- [ ] Repeat Binary Search from memory.

### Day 18 — Linked-list basics

- [ ] Solve [Reverse Linked List](../LinkedList/reverse-linked-list.js).
- [ ] Optional stretch: [Merge Two Sorted Lists](../LinkedList/merge-two-sorted-lists.js).
- [ ] Study `useRef` and DOM references.
- [ ] Draw pointer changes before writing code.

### Day 19 — Fast and slow pointers

- [ ] Solve [Linked List Cycle](../LinkedList/linked-list-cycle.js).
- [ ] Optional stretch: [Remove Nth Node From End](../LinkedList/remove-nth-node-from-end-of-list.js).
- [ ] Study `useMemo` and `useCallback` trade-offs.
- [ ] Repeat Reverse Linked List.

### Day 20 — Linked-list transformations

- [ ] Solve [Add Two Numbers](../LinkedList/add-two-numbers.js).
- [ ] Optional stretch: attempt [Reorder List](../LinkedList/reorder-list.js).
- [ ] Study React Context and reducers.
- [ ] Explain a React component from one of your projects.

### Day 21 — Weekly review and React mock

- [ ] Re-solve one binary-search and one linked-list problem under a timer.
- [ ] Build a small controlled form or searchable list in React.
- [ ] Review common `useEffect` mistakes.
- [ ] Complete a React question mock and record feedback.

---

## Week 4 — Trees, Heap, Next.js, and Frontend Performance

### Day 22 — Recursion, then tree recursion

- [ ] Learn the recursion base case, recursive case, call stack, and return value — see [Recursion](../Recursion/README.md) for the pattern.
- [ ] Solve [Factorial](../Recursion/factorial.js) and [Sum of Array (Recursive)](../Recursion/sum-of-array.js) — both are small on purpose.
- [ ] Solve [Maximum Depth of Binary Tree](../Trees/maximum-depth-of-binary-tree.js) once the two warm-ups feel easy.
- [ ] Optional stretch: [Invert Binary Tree](../Trees/invert-binary-tree.js) or [Fibonacci Number](../Recursion/fibonacci.js).
- [ ] Begin [Next.js](../04-NextJS.md): routing, layouts, and rendering.
- [ ] Repeat Search in Rotated Sorted Array.

### Day 23 — Comparing trees

- [ ] Solve [Same Tree](../Trees/same-tree.js).
- [ ] Optional stretch: [Diameter of Binary Tree](../Trees/diameter-of-binary-tree.js).
- [ ] Study Server Components versus Client Components.
- [ ] Draw the recursion tree for one solution.

### Day 24 — Returning tree properties

- [ ] Solve [Balanced Binary Tree](../Trees/balanced-binary-tree.js).
- [ ] Optional stretch: [Binary Tree Level Order Traversal](../Trees/binary-tree-level-order-traversal.js).
- [ ] Study static rendering, dynamic rendering, SSR, and ISR.
- [ ] Repeat Maximum Depth of Binary Tree.

### Day 25 — BST patterns

- [ ] Solve [Lowest Common Ancestor of BST](../Trees/lowest-common-ancestor-of-bst.js).
- [ ] Optional stretch: [Validate Binary Search Tree](../Trees/validate-binary-search-tree.js).
- [ ] Study Next.js caching and revalidation.
- [ ] Explain BST ordering and boundary handling.

### Day 26 — Breadth-first traversal

- [ ] Solve [Binary Tree Right Side View](../Trees/binary-tree-right-side-view.js).
- [ ] Optional stretch: [Count Good Nodes in Binary Tree](../Trees/count-good-nodes-in-binary-tree.js).
- [ ] Study frontend performance: memoization, lazy loading, images, and bundle size.
- [ ] Repeat Same Tree.

### Day 27 — Heap fundamentals

- [ ] Solve [Last Stone Weight](../Heap/last-stone-weight.js).
- [ ] Optional stretch: [Kth Largest Element](../Heap/kth-largest-element-in-an-array.js).
- [ ] Study route handlers, middleware, loading, and error states in Next.js.
- [ ] Explain when a heap is preferable to sorting.

### Day 28 — Weekly review

- [ ] Re-solve two tree problems without notes.
- [ ] Repeat one heap problem under a timer.
- [ ] Explain the rendering strategy used in one of your Next.js pages.
- [ ] Complete a project deep-dive mock and record feedback.

---

## Week 5 — Backtracking, Graphs, Node.js, and Express

### Day 29 — Backtracking template

- [ ] Solve [Subsets](../Backtracking/subsets.js).
- [ ] Optional stretch: [Permutations](../Backtracking/permutations.js).
- [ ] Begin [Node.js](../05-NodeJS.md): runtime, modules, and event loop.
- [ ] Repeat Binary Tree Level Order Traversal.

### Day 30 — Backtracking choices and pruning

- [ ] Solve [Combination Sum](../Backtracking/combination-sum.js).
- [ ] Optional stretch: [Combination Sum II](../Backtracking/combination-sum-ii.js).
- [ ] Study Node.js events, buffers, and streams.
- [ ] Repeat Subsets and draw its decision tree.

### Day 31 — Duplicate choices and grid backtracking

- [ ] Solve [Subsets II](../Backtracking/subsets-ii.js).
- [ ] Optional stretch: attempt [Word Search](../Backtracking/word-search.js).
- [ ] Review choose, explore, undo, and pruning.
- [ ] Begin [Express](../06-Express.md): routing and middleware order.
- [ ] Repeat Permutations.

### Day 32 — Graph grid traversal

- [ ] Solve [Number of Islands](../Graph/number-of-islands.js).
- [ ] Optional stretch: [Max Area of Island](../Graph/max-area-of-island.js).
- [ ] Study Express validation and centralized error handling.
- [ ] Explain DFS versus BFS and their complexity.

### Day 33 — Graph representation and BFS

- [ ] Solve [Clone Graph](../Graph/clone-graph.js).
- [ ] Optional stretch: [Rotting Oranges](../Graph/rotting-oranges.js).
- [ ] Study authentication versus authorization.
- [ ] Repeat Number of Islands.

### Day 34 — Graph dependencies and cycles

- [ ] Solve [Course Schedule](../Graph/course-schedule.js).
- [ ] Optional stretch: attempt [Course Schedule II](../Graph/course-schedule-ii.js).
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

- [ ] Solve [Climbing Stairs](../Dynamic-Programming/climbing-stairs.js).
- [ ] Optional stretch: [Min Cost Climbing Stairs](../Dynamic-Programming/min-cost-climbing-stairs.js).
- [ ] Begin [SQL](../07-SQL.md): SELECT, filtering, sorting, and grouping.
- [ ] Repeat Subsets.

### Day 37 — Recurrence decisions

- [ ] Solve [House Robber](../Dynamic-Programming/house-robber.js).
- [ ] Optional stretch: [House Robber II](../Dynamic-Programming/house-robber-ii.js).
- [ ] Study INNER JOIN and LEFT JOIN.
- [ ] Write the recurrence before writing code.

### Day 38 — Unbounded choices

- [ ] Solve [Coin Change](../Dynamic-Programming/coin-change.js).
- [ ] Optional stretch: [Word Break](../Dynamic-Programming/word-break.js).
- [ ] Practise GROUP BY, HAVING, and aggregate queries.
- [ ] Repeat Climbing Stairs and explain the space optimization.

### Day 39 — Sequence DP

- [ ] Solve [Longest Increasing Subsequence](../Dynamic-Programming/longest-increasing-subsequence.js).
- [ ] Optional stretch: attempt [Longest Common Subsequence](../Dynamic-Programming/longest-common-subsequence.js).
- [ ] Study CTEs and subqueries.
- [ ] Draw the DP state and transitions.

### Day 40 — Greedy decisions

- [ ] Solve [Jump Game](../Greedy/jump-game.js).
- [ ] Optional stretch: [Partition Labels](../Greedy/partition-labels.js).
- [ ] Study indexes and query plans.
- [ ] Explain why the greedy choice is safe.

### Day 41 — More greedy practice

- [ ] Solve [Jump Game II](../Greedy/jump-game-ii.js).
- [ ] Optional stretch: attempt [Gas Station](../Greedy/gas-station.js).
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

- [ ] Solve [Meeting Rooms](../Intervals/meeting-rooms.js).
- [ ] Optional stretch: [Merge Intervals](../Intervals/merge-intervals.js).
- [ ] Begin [System Design](../08-System-Design.md): requirements and estimations.
- [ ] Repeat Coin Change.

### Day 44 — Scheduling intervals

- [ ] Solve [Non-overlapping Intervals](../Intervals/non-overlapping-intervals.js).
- [ ] Optional stretch: [Insert Interval](../Intervals/insert-interval.js).
- [ ] Study APIs, data models, and high-level components.
- [ ] Explain why sorting is used in interval problems.

### Day 45 — Advanced string pattern: palindrome expansion

- [ ] Solve [Palindromic Substrings](../String/palindromic-substrings.js).
- [ ] Optional stretch: [Longest Palindromic Substring](../String/longest-palindromic-substring.js).
- [ ] Study load balancing, caching, CDNs, and queues.
- [ ] Repeat Meeting Rooms.

### Day 46 — Matrix and number problems

- [ ] Solve [Plus One](../Math/plus-one.js).
- [ ] Optional stretch: [Happy Number](../Math/happy-number.js).
- [ ] Study SQL versus NoSQL and database partitioning.
- [ ] Explain all matrix boundaries before coding.

### Day 47 — Bit manipulation

- [ ] Solve [Single Number](../Bit-Manipulation/single-number.js).
- [ ] Optional stretch: [Missing Number](../Bit-Manipulation/missing-number.js).
- [ ] Study replication, consistency, and availability.
- [ ] Review XOR and common bit operations.

### Day 48 — Design practice

- [ ] Solve [Counting Bits](../Bit-Manipulation/counting-bits.js).
- [ ] Repeat one weak interval or string problem.
- [ ] Design a URL shortener using the order in [System Design](../08-System-Design.md).
- [ ] Record requirements, APIs, schema, components, and trade-offs.

### Day 49 — Weekly review

- [ ] Re-solve two Week 7 problems under a timer.
- [ ] Design a notification service or chat application in 45 minutes.
- [ ] Review caching, databases, queues, reliability, and security.
- [ ] Complete a system-design mock and record feedback.

---

## Week 8 — Mixed Revision, Projects, Resume, Behavioral, and Final Mocks

### Day 50 — Weak-area audit

- [ ] Review [01-DSA-Questions.md](../01-DSA-Questions.md) and select your five weakest problems.
- [ ] Re-solve two weak problems without notes.
- [ ] Review [Resume Notes](../11-Resume-Notes.md) and correct unclear claims.
- [ ] Verify every resume link, date, skill, and project claim.

### Day 51 — Project deep dive

- [ ] Re-solve one medium array, HashMap, or sliding-window problem.
- [ ] Complete the template in [Projects](../10-Projects.md) for your strongest project.
- [ ] Explain its architecture, hardest decision, production issue, and measurable result.
- [ ] Prepare answers for likely follow-up questions.

### Day 52 — Behavioral stories

- [ ] Re-solve one tree or graph problem.
- [ ] Prepare three STAR stories using [Behavioral](../12-Behavioral.md).
- [ ] Cover conflict, failure, ownership, and ambiguity.
- [ ] Keep each spoken answer under two minutes.

### Day 53 — HR preparation

- [ ] Re-solve one DP or greedy problem.
- [ ] Prepare answers from [HR Interview](../09-HR-Interview.md).
- [ ] Research the target company, product, role, and recent work.
- [ ] Prepare five thoughtful questions for the interviewer.

### Day 54 — Full technical mock

- [ ] Complete a 60-minute DSA mock with no notes.
- [ ] Complete a 30-minute JavaScript, React, Node.js, and SQL discussion.
- [ ] Record mistakes immediately in [Mock Interviews](../Mock-Interviews/README.md).
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

## Week 9 — Launch the search

By now you should be past the readiness checklist in
[00-Roadmap.md](../00-Roadmap.md). If not, stay in Week 7/8 material another
week before adding applications on top — a shaky foundation under interview
pressure burns motivation fast.

### Day 57 — Resume and profile pass

- [ ] Rewrite every resume bullet using Action + task + technology + measurable result. See [Resume Notes](../11-Resume-Notes.md).
- [ ] Update LinkedIn headline, About section, and skills to match your target role, not your current title.
- [ ] Set up the tracker in [14-Job-Search-and-Negotiation.md](../14-Job-Search-and-Negotiation.md).
- [ ] Continue via `npm run today`.

### Day 58 — First applications

- [ ] Apply to 8-10 roles. Prioritize referrals over cold applications wherever possible.
- [ ] Message two former colleagues for referrals; use the template in [14-Job-Search-and-Negotiation.md](../14-Job-Search-and-Negotiation.md).
- [ ] Continue via `npm run today`.

### Day 59 — Applications and DSA revision

- [ ] Apply to 5-8 more roles.
- [ ] Re-solve one problem from each of your three weakest topics in [progress](#) (`npm run progress` shows them).
- [ ] Continue via `npm run today`.

### Day 60 — System design depth

- [ ] Design one system end to end in 45 minutes, written out, from [System Design](../08-System-Design.md).
- [ ] Apply to 5 more roles.
- [ ] Continue via `npm run today`.

### Day 61 — Project polish

- [ ] Rehearse your two strongest project deep dives out loud, timed at 5 minutes each.
- [ ] Apply to 5 more roles; follow up on any referral requests sent Day 58.
- [ ] Continue via `npm run today`.

### Day 62 — Mock day

- [ ] Complete one full DSA mock and one behavioral mock; record both in [Mock Interviews](../Mock-Interviews/README.md).
- [ ] Continue via `npm run today`.

### Day 63 — Weekly review

- [ ] Update the tracker: applications sent, responses, next actions.
- [ ] Re-solve two problems you struggled with this week.
- [ ] Adjust which companies/roles you're targeting based on response rate so far.

## Week 10 — Referrals and pipeline building

### Day 64-70 — Repeat the Week 9 rhythm

- [ ] Daily: `npm run today` for the DSA/full-stack problem.
- [ ] Daily: 5-10 applications, prioritizing referrals; message 2 new contacts for referrals.
- [ ] Twice this week: a timed DSA or system-design mock, logged in [Mock Interviews](../Mock-Interviews/README.md).
- [ ] Once this week: re-solve three older problems without notes.
- [ ] Day 70: weekly review — update the tracker, note which application channels are converting to responses.

## Week 11 — First interview loops

Screens and first rounds typically start landing around now if the pipeline from Weeks 9-10 was consistent. If nothing has landed yet, increase applications to 10-12/day and tighten referral outreach rather than stalling.

### Day 71-77 — Interview-loop rhythm

- [ ] Daily: `npm run today`, but shift toward **medium/hard revision** over brand-new problems once most topics are checked off.
- [ ] Before each real interview: 30 minutes of company-specific research (product, tech stack, recent news) and a review of the matching topic guide (React/Node/SQL/System Design).
- [ ] After each real interview: write down every question asked and your answer quality in [Mock Interviews](../Mock-Interviews/README.md) — real interviews are your best mock data now.
- [ ] Continue 5+ applications/day even while interviewing; a pipeline with only one company is fragile.
- [ ] Day 77: weekly review — which round (screen, DSA, system design, behavioral) is losing you candidates? Focus next week there.

## Week 12 — Depth on your weak round

Use Day 77's answer to choose this week's emphasis.

- [ ] If DSA rounds are the leak: two problems/day from your weakest topics via `npm run progress`, plus a timed mock every other day.
- [ ] If system design is the leak: one full design write-up/day, alternating with a mock explaining it aloud in 45 minutes.
- [ ] If behavioral/culture rounds are the leak: rewrite three STAR stories in [Behavioral](../12-Behavioral.md) and rehearse them daily.
- [ ] Keep applying and interviewing throughout — do not pause the pipeline to "study more" first.
- [ ] Day 84: weekly review and tracker update.

## Week 13 — Mid-search audit

### Day 85 — Full audit

- [ ] Count: applications sent, screens obtained, onsite/final rounds obtained, offers. Compute each conversion rate.
- [ ] If applications-to-screens is low: resume/targeting problem — revisit Day 57 and retarget roles.
- [ ] If screens-to-onsite is low: DSA/technical-round problem — add a mock every other day.
- [ ] If onsite-to-offer is low: system design or behavioral problem, or role-level mismatch — reconsider target seniority.

### Day 86-91 — Continue the interview-loop rhythm from Week 11

- [ ] Apply the Day 85 diagnosis: extra practice time goes to the weakest stage specifically, not evenly across everything.
- [ ] Keep `npm run today` running daily for baseline DSA maintenance.
- [ ] Day 91: weekly review.

## Week 14 — Push week

By now you likely have overlapping interview loops. Protect focus.

### Day 92-98

- [ ] Daily: `npm run today`, kept short (30-45 min) if interview loops are heavy this week — consistency over volume now.
- [ ] Prioritize scheduled interviews and their specific prep over new applications this week.
- [ ] Read [14-Job-Search-and-Negotiation.md](../14-Job-Search-and-Negotiation.md) negotiation section before your first expected offer conversation, not after the offer call.
- [ ] Day 98: weekly review — are any offers close? Start comparing against your target range (12-15 LPA) and non-salary factors.

## Week 15 — Offer and negotiation stage

### Day 99-105

- [ ] On any offer call: thank them, ask for it in writing, and ask for time to respond — never negotiate live on the first call.
- [ ] Use the negotiation script in [14-Job-Search-and-Negotiation.md](../14-Job-Search-and-Negotiation.md) once you have a written offer.
- [ ] Keep interviewing elsewhere until you have a signed offer — a verbal offer is not a offer.
- [ ] Continue light daily DSA (`npm run today`) to stay sharp for any loops still in progress.
- [ ] Day 105: weekly review — offer comparison if multiple are in flight.

## Week 16 — Close or repeat

### Day 106-112

- [ ] If you have an acceptable offer: confirm in writing, plan resignation/notice period, stop new applications.
- [ ] If not: repeat Weeks 11-14's rhythm with fresh companies. Re-audit using Day 85's method before choosing what to emphasize.
- [ ] Either way: re-solve two familiar problems for confidence rather than learning new topics under interview pressure.
- [ ] Day 112: final review — introduction, project summaries, STAR stories, and interviewer questions, all rehearsed once more.

---

## After sixteen weeks

If you have not accepted an offer yet, that is a pipeline problem, not a
failure — repeat Weeks 9-14 with a wider net (more companies, more referral
outreach) and use the Day 85 audit method every two weeks to keep aiming
practice at whichever round is actually losing you offers. Do not restart
DSA from Day 1 unless a mock genuinely shows fundamentals slipping;
`npm run progress` will show you exactly which topics need it.

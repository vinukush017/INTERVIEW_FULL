# PR 6 — DSA Core, Pattern Evidence & Transfer

## Goal

Make the existing DSA library practical alongside the PR 5 adaptive plan. The
primary path is curated core practice, weakness-driven support, delayed retrieval,
clear English explanation and transfer to a different contract. Completion of
all files, or even every core file, is not an interview prerequisite.

## Files Changed

Git status at implementation completion: 19 modified files and 11 added files.
No existing problem implementation, history file, dependency or English file changed.

```text
 M 00-Roadmap.md
 M 01-DSA-Questions.md
 M Arrays/README.md
 M README.md
 M Sliding-Window/README.md
 M dashboard/app.js
 M dashboard/index.html
 M dashboard/styles.css
 M scripts/add-problem.mjs
 M scripts/lib/items.js
 M scripts/lib/planning.js
 M scripts/lib/revision.js
 M scripts/lib/study-state.js
 M scripts/progress.js
 M scripts/serve-dashboard.js
 M tests/dashboard/evidence.test.js
 M tests/dashboard/server.test.js
 M tests/fixtures/planning-workspace.js
 M tests/progress/evidence.test.js
?? Arrays/range-sum-query-immutable.js
?? Arrays/subarray-sum-equals-k.js
?? PR6_DSA_CORE_PATTERN_TRANSFER_REPORT.md
?? Sliding-Window/maximum-average-subarray-i.js
?? Trie/README.md
?? Trie/implement-trie-prefix-tree.js
?? data/dsa-catalog.json
?? scripts/lib/dsa-catalog.js
?? scripts/lib/dsa-patterns.js
?? tests/dashboard/dsa.test.js
?? tests/progress/dsa.test.js
```

## Previous DSA Model

The queue and single checklist registered 206 files. Today chose an unfinished
item by folder focus/order; challenge annotations provided pacing hints, but
there was no authoritative role catalog or pattern-level evidence. PR 4 already
separated completion, attempts, explanation and date-based review; PR 5 added
explicit phase/week and weekly decisions. Those foundations remain in place.

The old add script created a file and appended a checklist entry outside the
queue, potentially assigning it to the last checklist topic. It could therefore
create a problem that daily selection never reached.

## Full Library Audit

Read the audit and all five previous reports before implementation. Inspected
every original prompt/example, the topic recognition READMEs, the eight checked
implementations and their notes, and the common unsolved scaffold used by the
remaining 198 original files. Classification uses the actual contracts and
existing implementation where present, rather than filename alone.

The eight checked files are Product of Array Except Self, Valid Palindrome,
Two Sum II, and the five HashMap files Two Sum, Contains Duplicate, Valid Anagram,
Group Anagrams and Top K Frequent Elements. Original solution bytes and their
completion flags are preserved, including their existing notes limitations.

| Folder | Original | Added | Current | Core | Supporting | Transfer | Optional |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Arrays | 10 | 2 | 12 | 6 | 6 | 0 | 0 |
| String | 10 | 0 | 10 | 2 | 4 | 3 | 1 |
| HashMap | 9 | 0 | 9 | 5 | 2 | 2 | 0 |
| Two-Pointers | 9 | 0 | 9 | 4 | 2 | 2 | 1 |
| Sliding-Window | 6 | 1 | 7 | 4 | 0 | 2 | 1 |
| Stack | 9 | 0 | 9 | 4 | 1 | 1 | 3 |
| Queue | 7 | 0 | 7 | 1 | 3 | 0 | 3 |
| Binary-Search | 12 | 0 | 12 | 4 | 5 | 2 | 1 |
| LinkedList | 12 | 0 | 12 | 4 | 4 | 3 | 1 |
| Recursion | 3 | 0 | 3 | 0 | 3 | 0 | 0 |
| Trees | 17 | 0 | 17 | 7 | 5 | 4 | 1 |
| Heap | 8 | 0 | 8 | 2 | 2 | 2 | 2 |
| Backtracking | 12 | 0 | 12 | 4 | 5 | 2 | 1 |
| Graph | 16 | 0 | 16 | 6 | 4 | 4 | 2 |
| Dynamic-Programming | 15 | 0 | 15 | 6 | 4 | 3 | 2 |
| Greedy | 10 | 0 | 10 | 2 | 5 | 1 | 2 |
| Intervals | 8 | 0 | 8 | 4 | 2 | 1 | 1 |
| Bit-Manipulation | 9 | 0 | 9 | 2 | 2 | 1 | 4 |
| Math | 10 | 0 | 10 | 2 | 3 | 1 | 4 |
| Sorting | 14 | 0 | 14 | 3 | 4 | 2 | 5 |
| Trie | 0 | 1 | 1 | 1 | 0 | 0 | 0 |
| **Total** | **206** | **4** | **210** | **73** | **66** | **36** | **35** |

Repeated learning value is retained but made selective: Queue/tree/graph breadth
first exercises share frontiers; adjacent palindrome variants share scans;
Math/Stack syntax warm-ups and six textbook sorting implementations add little
new evidence after representative practice. Heap top-K and the checked HashMap
Top K Frequent Elements are not automatically interchangeable: that checked
implementation sorts counted entries, so its catalog pattern is sorting, not
proof of heap proficiency. Stock's running-minimum contract is iteration, not a
variable-window representative merely because it lives in Sliding-Window.

## New DSA Catalog

Canonical source: [data/dsa-catalog.json](./data/dsa-catalog.json), metadata
**version 1**. Fields are `path`, `title`, `pattern`, `role`, `difficulty`, optional
`transferFor`, and a short selection note. Pattern definitions contain recognition
cues, a canonical README path, default phase guidance and the number of distinct
independent core representatives required for the default gate.

Problem files remain canonical for prompts/code/notes; 01-DSA-Questions.md remains
the single completion checklist. The catalog owns roles and pattern membership.
Its generated dashboard views do not create another manually maintained checklist.
All difficulty values are `unknown`; no external difficulty was guessed or fetched.

[scripts/lib/dsa-catalog.js](./scripts/lib/dsa-catalog.js) validates identity,
roles, patterns, transfer references, files and equal catalog/checklist/queue
sets. It rejects duplicate checklist rows rather than hiding them in a Map.
Metadata is cached by file stat signature; registration changes invalidate it.
Full filesystem reconciliation runs explicitly and during registration, not on
every browser filter click.

## Role Definitions

| Role | Use |
| --- | --- |
| CORE | Representative contract for an important interview pattern; default path. |
| SUPPORTING | Additional practice when a pattern still needs work. |
| TRANSFER | Different constraints/output/state that test application after core recall. |
| OPTIONAL | Niche depth, challenge, redundant implementation or syntax warm-up; manual choice. |

## Core Set

**73 core problems**, chosen for coverage rather than a solve-count target.
The table is a report snapshot, not a second progress checklist; the live catalog
is authoritative. No representative proves every variation in a broad family.

| Pattern | Core representatives | Transfer candidates | Recognition / coverage reason |
| --- | --- | --- | --- |
| Array iteration / running state | [Majority Element](./Arrays/majority-element.js); [Best Time to Buy and Sell Stock](./Sliding-Window/best-time-to-buy-and-sell-stock.js) | None; use meaningful variation/recall | Track a running value while scanning; distinguish one transaction from many. |
| Prefix / suffix products | [Product of Array Except Self](./Arrays/product-of-array-except-self.js) | None; use meaningful variation/recall | Output excludes its own position; combine work before and after it. |
| Prefix sum / subarray sum | [Subarray Sum Equals K](./Arrays/subarray-sum-equals-k.js) | None; use meaningful variation/recall | Repeated ranges or contiguous sums, including negatives; subtract prefix sums. |
| Hashing: lookup, counting & grouping | [Longest Consecutive Sequence](./Arrays/longest-consecutive-sequence.js); [Two Sum](./HashMap/two-sum.js); [Contains Duplicate](./HashMap/contains-duplicate.js); [Valid Anagram](./HashMap/valid-anagram.js); [Group Anagrams](./HashMap/group-anagrams.js) | [Isomorphic Strings](./String/isomorphic-strings.js); [Contains Duplicate II](./HashMap/contains-duplicate-ii.js); [Word Pattern](./HashMap/word-pattern.js) | Need membership, complementary values, frequencies or a canonical grouping key. |
| Two pointers inward | [Valid Palindrome](./Two-Pointers/valid-palindrome.js); [Two Sum II - Input Array Is Sorted](./Two-Pointers/two-sum-ii-input-array-is-sorted.js); [Container With Most Water](./Two-Pointers/container-with-most-water.js); [3Sum](./Two-Pointers/3sum.js) | [Valid Palindrome II](./Two-Pointers/valid-palindrome-ii.js); [Squares of a Sorted Array](./Two-Pointers/squares-of-a-sorted-array.js) | Ordered or symmetric data permits excluding one end safely. |
| Same-direction / write pointers | [Move Zeroes](./Arrays/move-zeroes.js); [Remove Duplicates from Sorted Array](./Arrays/remove-duplicates-from-sorted-array.js); [Sort Colors](./Sorting/sort-colors.js) | [String Compression](./String/string-compression.js); [Merge Sorted Array](./Sorting/merge-sorted-array.js) | Preserve a processed prefix while scanning or writing in place. |
| String traversal / encoding | [Encode and Decode Strings](./String/encode-and-decode-strings.js) | None; use meaningful variation/recall | Scan characters or frame strings without ambiguous delimiters. |
| Palindrome expansion | [Palindromic Substrings](./String/palindromic-substrings.js) | [Longest Palindromic Substring](./String/longest-palindromic-substring.js) | Contiguous palindrome; odd and even centers both matter. |
| Sliding Window: fixed size | [Maximum Average Subarray I](./Sliding-Window/maximum-average-subarray-i.js) | [Permutation in String](./Sliding-Window/permutation-in-string.js) | Every candidate has exactly k elements; update only entering/leaving values. |
| Sliding Window: variable size | [Longest Substring Without Repeating Characters](./Sliding-Window/longest-substring-without-repeating-characters.js) | [Longest Repeating Character Replacement](./Sliding-Window/longest-repeating-character-replacement.js) | A contiguous region has a constraint; define when it must shrink. |
| Stack: matching & state | [Valid Parentheses](./Stack/valid-parentheses.js); [Min Stack](./Stack/min-stack.js); [Evaluate Reverse Polish Notation](./Stack/evaluate-reverse-polish-notation.js) | [Remove All Adjacent Duplicates In String](./Stack/remove-all-adjacent-duplicates-in-string.js) | Nested matching or most recent unfinished operation; retain needed state. |
| Monotonic stack | [Daily Temperatures](./Stack/daily-temperatures.js) | None; use meaningful variation/recall | Next greater/smaller position; unresolved indices wait for an answer. |
| Monotonic deque / window maximum | [Sliding Window Maximum](./Sliding-Window/sliding-window-maximum.js) | None; use meaningful variation/recall | Window extremes need expiry at the front and dominated-value removal at the back. |
| Queue / FIFO | [Implement Queue Using Stacks](./Queue/implement-queue-using-stacks.js) | None; use meaningful variation/recall | Arrival order, amortized operations or a BFS frontier. |
| Binary Search: sorted / rotated | [Binary Search](./Binary-Search/binary-search.js); [Search in Rotated Sorted Array](./Binary-Search/search-in-rotated-sorted-array.js) | [Find Minimum in Rotated Sorted Array](./Binary-Search/find-minimum-in-rotated-sorted-array.js) | An ordered half can be excluded; state the search interval invariant. |
| Binary Search: boundaries | [Search Insert Position](./Binary-Search/search-insert-position.js) | [Time Based Key-Value Store](./Binary-Search/time-based-key-value-store.js) | First/last valid index or timestamp; define the boundary predicate. |
| Binary Search: answer space | [Koko Eating Bananas](./Binary-Search/koko-eating-bananas.js) | None; use meaningful variation/recall | A feasibility predicate changes once as an answer parameter increases. |
| Linked list pointer manipulation | [Reverse Linked List](./LinkedList/reverse-linked-list.js); [Merge Two Sorted Lists](./LinkedList/merge-two-sorted-lists.js); [Remove Nth Node From End of List](./LinkedList/remove-nth-node-from-end-of-list.js) | [Add Two Numbers](./LinkedList/add-two-numbers.js); [Reorder List](./LinkedList/reorder-list.js) | Rewire links safely; save the next reference before overwriting. |
| Fast / slow pointers | [Linked List Cycle](./LinkedList/linked-list-cycle.js) | [Palindrome Linked List](./LinkedList/palindrome-linked-list.js); [Happy Number](./Math/happy-number.js) | Cycle or midpoint in a repeated successor relation. |
| Recursion warm-ups | None; use meaningful variation/recall | None; use meaningful variation/recall | A smaller subproblem and a terminating base case; use only if needed. |
| Trees: DFS / recursive reasoning | [Maximum Depth of Binary Tree](./Trees/maximum-depth-of-binary-tree.js); [Invert Binary Tree](./Trees/invert-binary-tree.js); [Diameter of Binary Tree](./Trees/diameter-of-binary-tree.js); [Balanced Binary Tree](./Trees/balanced-binary-tree.js) | [Path Sum](./Trees/path-sum.js); [Count Good Nodes in Binary Tree](./Trees/count-good-nodes-in-binary-tree.js) | Combine subtree results or carry path context through recursive calls. |
| Trees: BFS levels | [Binary Tree Level Order Traversal](./Trees/binary-tree-level-order-traversal.js) | [Binary Tree Right Side View](./Trees/binary-tree-right-side-view.js) | Depth groups or one representative per level; process frontier boundaries. |
| BST ordering | [Validate Binary Search Tree](./Trees/validate-binary-search-tree.js); [Kth Smallest Element in a BST](./Trees/kth-smallest-element-in-bst.js) | [Lowest Common Ancestor of BST](./Trees/lowest-common-ancestor-of-bst.js) | Ancestor-wide ordering bounds or sorted inorder traversal. |
| Heap: top K / ordered streams | [Kth Largest Element in an Array](./Heap/kth-largest-element-in-an-array.js); [Merge K Sorted Lists](./Heap/merge-k-sorted-lists.js) | [K Closest Points to Origin](./Heap/k-closest-points-to-origin.js); [Top K Frequent Words](./Heap/top-k-frequent-words.js) | Keep a bounded best-k frontier or merge ordered streams; justify heap vs sort. |
| Backtracking decision trees | [Subsets](./Backtracking/subsets.js); [Permutations](./Backtracking/permutations.js); [Combination Sum](./Backtracking/combination-sum.js); [Word Search](./Backtracking/word-search.js) | [Subsets II](./Backtracking/subsets-ii.js); [Generate Parentheses](./Backtracking/generate-parentheses.js) | Enumerate choices, prune invalid branches and undo local changes. |
| Graphs: traversal / components | [Number of Islands](./Graph/number-of-islands.js); [Clone Graph](./Graph/clone-graph.js); [Number of Connected Components in an Undirected Graph](./Graph/number-of-connected-components-in-an-undirected-graph.js) | [Surrounded Regions](./Graph/surrounded-regions.js) | Adjacency or grid reachability; mark visited and cover disconnected components. |
| Graphs: unweighted / multi-source BFS | [Rotting Oranges](./Graph/rotting-oranges.js) | [Walls and Gates](./Graph/walls-and-gates.js) | Shortest unweighted distance or simultaneous spread from multiple sources. |
| Graphs: cycle / coloring | [Graph Valid Tree](./Graph/graph-valid-tree.js) | [Is Graph Bipartite](./Graph/is-graph-bipartite.js) | Track parent/path or consistent coloring; visited alone is not enough. |
| Graphs: topological ordering | [Course Schedule](./Graph/course-schedule.js) | [Course Schedule II](./Graph/course-schedule-ii.js) | Dependencies must precede dependents; detect cycles in a directed graph. |
| DP: 1D / take-skip | [Climbing Stairs](./Dynamic-Programming/climbing-stairs.js); [House Robber](./Dynamic-Programming/house-robber.js); [Coin Change](./Dynamic-Programming/coin-change.js) | [House Robber II](./Dynamic-Programming/house-robber-ii.js); [Min Cost Climbing Stairs](./Dynamic-Programming/min-cost-climbing-stairs.js) | Repeated state choices; define transition and base cases before storage. |
| DP: grid states | [Unique Paths](./Dynamic-Programming/unique-paths.js) | [Unique Paths II](./Dynamic-Programming/unique-paths-ii.js) | Two coordinates determine the subproblem; obstacles change base transitions. |
| DP: subsequence transitions | [Longest Common Subsequence](./Dynamic-Programming/longest-common-subsequence.js); [Longest Increasing Subsequence](./Dynamic-Programming/longest-increasing-subsequence.js) | None; use meaningful variation/recall | Ordered choices need state over an index or a pair of indices. |
| Greedy justified local choices | [Jump Game](./Greedy/jump-game.js); [Partition Labels](./Greedy/partition-labels.js) | [Jump Game II](./Greedy/jump-game-ii.js) | Prove a local choice preserves a global solution; test counterexamples. |
| Intervals: merge / overlap / scheduling | [Merge Intervals](./Intervals/merge-intervals.js); [Insert Interval](./Intervals/insert-interval.js); [Non-overlapping Intervals](./Intervals/non-overlapping-intervals.js); [Meeting Rooms II](./Intervals/meeting-rooms-ii.js) | [Interval List Intersections](./Intervals/interval-list-intersections.js) | Ranges overlap or consume resources; clarify touching endpoints and ordering. |
| Sorting usage / comparators | [Top K Frequent Elements](./HashMap/top-k-frequent-elements.js); [Sort an Array](./Sorting/sort-an-array.js); [Largest Number](./Sorting/largest-number.js) | [Relative Sort Array](./Sorting/relative-sort-array.js) | Order simplifies later work; compare values according to the actual objective. |
| High-value bit basics | [Single Number](./Bit-Manipulation/single-number.js); [Number of 1 Bits](./Bit-Manipulation/number-of-1-bits.js) | [Missing Number](./Bit-Manipulation/missing-number.js) | Pairs cancel under XOR or counting set bits; respect JS integer width. |
| Common numeric / matrix reasoning | [Plus One](./Math/plus-one.js); [Rotate Image](./Math/rotate-image.js) | None; use meaningful variation/recall | Carry propagation or in-place coordinate changes; clarify numeric limits. |
| Trie prefix lookup | [Implement Trie (Prefix Tree)](./Trie/implement-trie-prefix-tree.js) | None; use meaningful variation/recall | Exact words and shared prefixes must be distinguished. |

## Supporting Set

**66 supporting problems.** Examples include numeric/string traversal practice,
Minimum Depth of Binary Tree, additional linked-list operations, the three
recursion warm-ups and Find Median from Data Stream. Repeated weak core attempts
can select a previously unrecorded supporting contract in the same pattern.
Support supplements practice; it does not become another mandatory completion list.

## Transfer Set

**36 transfer candidates.** Examples include Right Side View after level-order
reasoning, Permutation in String after a fixed-size numeric window, Time Based
Key-Value Store after boundary search, and Unique Paths II after grid DP.
They change what must be tracked, returned or justified; these are not merely
variable-renaming exercises. Transfer labels do not assert external novelty.

## Optional / Challenge Set

**35 optional problems.** Median of Two Sorted Arrays, N-Queens, Edit Distance,
Largest Rectangle, Minimum Interval Queries and the retained textbook sorting
implementations remain accessible. FizzBuzz and Baseball Game remain useful
warm-ups without blocking core work. Optional failure does not erase core proof;
optional work is not an automatic fallback while core evidence needs attention.

## Missing Patterns Added

Only four unsolved practice contracts were added:

| File | Role / gap |
| --- | --- |
| [Arrays/range-sum-query-immutable.js](./Arrays/range-sum-query-immutable.js) | Supporting: prefix construction and inclusive range lookup. |
| [Arrays/subarray-sum-equals-k.js](./Arrays/subarray-sum-equals-k.js) | Core: prefix-frequency reasoning with negative values and repeated sums. |
| [Sliding-Window/maximum-average-subarray-i.js](./Sliding-Window/maximum-average-subarray-i.js) | Core: simple fixed-size numeric window. |
| [Trie/implement-trie-prefix-tree.js](./Trie/implement-trie-prefix-tree.js) | Core: insert/search/prefix distinction. |

Existing Permutation in String already covers a fixed-size counting variation;
no second fixed-window baseline was needed. Existing Sliding Window Maximum
covers deque reasoning. One basic trie contract is sufficient for this PR.

The four files intentionally throw `Practice not implemented yet`, have explicit
contracts/examples/exports and blank learning notes, and remain unchecked. Tests
validate their registration and scaffold contracts, not solved algorithms. They
do not receive fabricated solutions or attempt evidence. Learners can add focused
solution tests after their genuine attempt, consistent with the current library.

## Pattern Definitions

**38 patterns**, including separate fixed/variable windows, prefix sums,
monotonic stack/deque, standard/boundary/answer-space binary search, DFS/BFS/BST,
traversal/cycle/topological graphs and 1D/grid/subsequence DP. Recursion warm-ups
have no core gate. Short recognition cues stay in the catalog; full explanations
are read from existing READMEs through the safe document viewer.

## Pattern Evidence Model

[scripts/lib/dsa-patterns.js](./scripts/lib/dsa-patterns.js) projects existing
append-only events through stable problem paths. It considers latest actual
outcome, validated/self-certified independent evidence, delayed successes,
separate explanation state, gaps, transfer attempts and a 30-study-date recency
window. Confidence and checkboxes cannot unlock a gate.

Default eligibility requires one clear independent core representative (two for
broad families such as hashing, DFS, backtracking, traversal, 1D DP and intervals),
and at least one successful delayed core review. Same-day retries cannot create
delayed evidence. No exact sequence is imposed on every pattern: families without
transfer candidates can demonstrate recall and seek a materially different
variation manually. Two clean delayed retrievals can supply strong recent recall
there; that does not claim observed transfer.

Existing PR 4 weakness/recovery behavior is retained: after a hint, failure or
gap, two clean delayed successes clear the weakness, preventing one immediately
rehearsed answer from implying recovery.

## Pattern States

| State | Interpretation |
| --- | --- |
| Not Started | No recorded solving evidence; historical completion leaves readiness unknown. |
| Learning | Recorded help/solution/failure, without independent proof yet. |
| Practicing | Some independent evidence; recall, breadth, clarity or recency is insufficient. |
| Demonstrated | Default core gate met in a family without a catalog transfer candidate. |
| Transfer Needed | Default core gate met; another contract can test generalization. |
| Strong Recent Evidence | Qualified transfer plus clear recent explanation, or repeated delayed recall where no transfer exists. |
| Needs Review | Recent technical/speaking weakness following independent evidence; prior events remain intact. |

States are reversible observations, not permanent mastery or readiness scores.
Core attempted counts appear separately and are never a readiness percentage.

## Transfer Logic

Automatic candidates require sufficient recent core evidence and no prior recorded
attempt, speaking event or legacy completion for that item. The display says
**Transfer candidate / no prior recorded attempt**; familiarity outside this
repository is unknown.

Strong transfer evidence requires an independent first recorded transfer attempt
with the core gate already established **before that attempt**, and current clear
explanation/technical evidence. The event prefix is replayed to check this. Later
core learning cannot retroactively qualify an earlier attempt; later valid core
maintenance cannot invalidate a properly qualified transfer. Studying a transfer
solution and later recalling it proves recovery, not fresh generalization.

Transfer failure creates a practice/review recommendation and retains earlier
core independent and delayed proof. Another candidate/variation can be selected
manually after recovery when no unrecorded catalog candidate remains.

## Speaking Integration

Core and transfer questions reuse the canonical PR 1 DSA framework: clarify,
brute force, pattern clue, optimization/invariant, data structure, example,
time/space, edges and test aloud. Transfer also asks **“What clue made you
recognize this pattern?”** The question is saved with DSA/speaking events using
the same stable problem ID. Technical failure and clear explanation remain
separate evidence. No new English curriculum or files were introduced.

## Dashboard DSA Changes

[dashboard/app.js](./dashboard/app.js), [index.html](./dashboard/index.html) and
[styles.css](./dashboard/styles.css) preserve inline editing, save/test, completion
and outcome entry. Default role is Core. Filters combine role, pattern, latest
attempt, pattern evidence state, due coding/speaking review, weak item and search.
**All Problems** clears filters so the full library and optional challenges remain
accessible. Problem summaries show role/pattern, latest outcome, last independent
date, explanation and review due context.

Refresh appends newly registered cards without destroying dirty editor drafts.
Content references stay read-only. Role/pattern editing is an intentional catalog
change rather than broad filesystem editing through the dashboard.

## Pattern View

38 cards show core attempted counts separately from state, recent evidence and
next action. Detail exposes recognition cue, canonical README action, all four
role groups, latest evidence, current weakness and next open/speaking action.
Progress links back to those details. Recursion is explicitly supporting-only,
not a hidden prerequisite gate.

## Today Selection Changes

Deterministic shared selection honors the essential carry-forward first, then
bounded non-optional due review. Within available scope it considers weak core
practice, current weekly DSA focus, qualified transfer and remaining core practice.
A repeated weak core can receive supporting practice. Phase defaults guide a
focus-free core choice; explicit focus/evidence may select later patterns earlier.

Within an established pattern, an eligible transfer may precede another unattempted
core variant; this avoids demanding all core checkboxes before generalization.
Optional depth is not an automatic finish-all fallback. Reduced capacity/new-item
ceilings retain PR 5 short retrieval/speaking behavior. Every task supplies a reason.
Calendar dates still do not advance learning week.

## Revision Changes

[scripts/lib/revision.js](./scripts/lib/revision.js) recognizes actual catalog
roles: core failed/studied/hinted review takes priority over optional depth.
Optional coding cannot displace an essential speaking review. Daily output stays
one coding review OR up to three short retrievals. Previously attempted optional
items retain their review states and can be reviewed manually; their weakness
alone does not invalidate a core pattern.

The PR 4 date/interval algorithm remains unchanged: 1/3/7/14/30 days after delayed
success, shorter return after help/failure/unclear explanation. This PR changes
selection priority and pattern interpretation, not stored dates/history.

## Weekly Review Integration

The live review and new saved snapshots include patterns practiced, independent
core attempts, transfer attempts, patterns needing review, eligible transfer
candidates and explanation weaknesses. These are generated from the same events
and current projections. Next DSA focus offers pattern names/states as suggestions;
input remains editable. New Phase 2 setup defaults to Trees + Heap; existing saved
focus remains untouched. Prior review snapshots are not rewritten and may lack
this optional summary field.

## Add Problem Workflow

[scripts/add-problem.mjs](./scripts/add-problem.mjs) now requires a known pattern:

```sh
npm run add -- Arrays "Problem Name" --pattern prefix-sum
# Explicit curation, when justified:
npm run add -- Arrays "Problem Name" --pattern prefix-sum --role TRANSFER
```

Supporting is the safe default. Registration validates the folder/title/pattern/
role, rejects duplicate/traversal/symlink paths, creates an honest unsolved file,
adds the README link, inserts a queue entry and checkbox under the correct folder,
and updates the catalog. It uses the existing write lock and atomic per-file
writes. Caught write failures roll back only registration-owned changes; tests
verify no orphan checklist entry remains. It never writes progress history.

New pattern folders require deliberate curation, not a guessed pattern from a
title. After registration, Refresh data exposes the new item without restarting.
Multi-file registration is not a crash-proof database transaction; see limitations.

## Legacy Compatibility

No existing path was moved/renamed. All **206 original solution files**, their
relative queue order and all original checkbox flags are preserved. The real
`.progress/log.json` is **byte-identical** to its pre-PR snapshot, preserving all
**eight completion records** and original dates.

The repository inspected in this turn has **zero PR 4 evidence events** and no
initialized PR 5 planning/review records. None were fabricated. Populated fixtures
verify that existing events, planning and weekly-review records remain equivalent
on read and through new projections. The progress model stays **version 2** and
planning **version 1**; there is no data migration. Existing English files and
PR 1–5 reports are unchanged.

## Tests Added

50 progress tests plus 10 dashboard API tests: **60 new tests**. Coverage includes
catalog/path/set integrity, role/pattern/transfer validation, optional/warm-up
classification, four gap registrations, honest legacy readiness, independent
versus hint/studied/failed proof, same-day versus delayed recall, explanation
weakness, eligible/early/studied transfer, transfer recovery, recency, optional
isolation, granular focus, supporting selection, role-aware bounded review,
weekly snapshots, CLI/shared-model parity, registration cache refresh, rollback,
server restart persistence and preserved populated history.

Existing temporary test workspaces now copy the canonical catalog. Their old
assertions and progress data were retained.

## Full Test Results

**217 tests passed, zero failed:**

- 192 progress/dashboard tests via `node --test tests/progress/*.test.js tests/dashboard/*.test.js`.
- Two Sum: 6 cases via `npm test -- HashMap/two-sum`.
- Product of Array Except Self: 8 cases via `npm test -- Arrays/product-of-array-except-self`.
- Valid Palindrome: 11 cases via `npm test -- Two-Pointers/valid-palindrome`.

The previous 157-test baseline is retained. Bare `npm test` remains the existing
per-problem runner and requires a path; no new runner/dependency was introduced.
Loopback tests required sandbox permission, not changes to server safety.

`npm run today`, `npm run review`, `npm run progress` succeed and agree on
8/210 completion, uninitialized learning phase, no evidenced due review and
Move Zeroes as the next core task. Optional baseline retrieval is still honestly
labeled evidence unknown. `git diff --check` and JavaScript syntax checks pass. Checked 591 local Markdown
links/anchors in changed/added documentation with no missing target.

`DASHBOARD_NO_OPEN=1 PORT=0 npm run dev` started successfully on
`http://127.0.0.1:61280`; its API returned 210 items, the correct role counts,
eight legacy records and zero evidence events. An ephemeral port and disabled
OS auto-open avoid interfering with an already running dashboard; the ordinary
`npm run dev` entry point remains unchanged. The validation server was stopped.

## Browser Validation

Installed Chrome was used against a disposable repository because this session
has no in-app browser execution tool. Desktop (1280×960) and mobile (390×844)
checks passed with no console exceptions:

- Today remains default; setup and PR 5 workflow remain available.
- Core filter shows 73; role filters show 66/36/35; All Problems exposes 210.
- Prefix-sum filter and all 38 pattern cards/details work.
- Canonical README opens in the safe read-only reader.
- Existing tested editor saves independent/partial evidence; weak filter and
  Progress reflect it after reload.
- Qualified core recall enables the recognition-clue speaking prompt; all eight
  canonical English frameworks remain available.
- Saved transfer explanation persists and its actual communication gap appears
  after reload; weekly summary shows core/transfer signals.
- New Supporting registration appears on Refresh while a dirty editor draft stays
  intact; no horizontal overflow across Today/DSA/Progress/Weekly/English.
- Original legacy records are preserved in the disposable fixture; the real
  repository receives no test evidence or planning initialization.

Screenshots are local validation artifacts outside Git:
`/tmp/interview-pr6-patterns.png`, `/tmp/interview-pr6-today.png`,
`/tmp/interview-pr6-mobile.png`.

## Known Limitations

- Most original exercises and the four new contracts are intentionally unsolved.
  This PR validates curation/selection/evidence, not every algorithm in the library.
- Automated solution tests still exist for three original solved files only.
  Other independent/hinted success requires explicit self-certification as in PR 4.
- External prior exposure is unknown; a first recorded transfer success is useful
  evidence, not proof that a problem was never seen before.
- Pattern families and 30-date recency are practical heuristics. Broad-family
  representatives do not establish every variant or replace timed interview judgment.
- No-transfer families report strong recall without claiming an observed transfer.
  A materially different variation can be selected manually when useful.
- Roles can be curated by changing validated JSON; there is no dashboard catalog
  editor. Problem content remains canonical and topic references stay read-only.
- Registration rolls back caught failures but cannot guarantee whole-operation
  recovery from process/power loss between four atomic file replacements. Explicit
  library validation detects mismatches instead of silently hiding them.
- Saved old weekly snapshots do not retroactively gain pattern fields. Existing
  user weekly focus is never overwritten by new phase defaults.
- Warm shared-state calculation measured about 5 ms median over 20 reads of this
  210-item repository; this is local evidence, not a general performance guarantee.

## What Was Intentionally Not Implemented

No PR 7 curriculum work; no TypeScript/React/Next/backend/SQL/design expansion,
machine-coding workspace, full mock history, job/application tracking, AI,
speech/audio analysis, recordings, cloud/accounts/authentication or dependencies.
No readiness percentage, new schema migration, fabricated attempts/solutions,
problem deletion/move or demand to finish all core items before interviews.
The PR 5 roadmap architecture and PR 1 English system remain intact.

## Recommended PR 7 Scope

Add a practical TypeScript foundation and canonical technical retrieval questions;
repair targeted JavaScript modules/memory/runtime-context gaps; integrate the
canonical sources into Topics. Reuse the existing speaking/evidence/review model
and keep each technical task explainable in English. Do not begin a separate
English syllabus or a new application.

# PR 2 — Correctness & Teaching Quality Report

## Summary

Repaired the two demonstrated DSA failures, added regression coverage using the existing runner, and corrected the scoped algorithm/JavaScript teaching defects. Reviewed all eight checked solutions without treating completion marks as mastery. PR 1's daily English workflow remains intact.

Before editing, read the full [audit](INTERVIEW_PREP_REPO_AUDIT.md) and [PR 1 report](PR1_ENGLISH_DAILY_WORKFLOW_REPORT.md), inspected the existing diff/history, and read the affected code, notes, templates, and test runner. The starting HEAD was `5ded1ac`; the audit and PR 1 were already uncommitted working-tree changes. This report distinguishes PR 2 additions from those existing changes. No remote PR or commit was created.

## Files Changed

| Existing file changed in PR 2 | Change |
| --- | --- |
| [Arrays/product-of-array-except-self.js](Arrays/product-of-array-except-self.js) | Prefix/suffix implementation and honest post-solve notes |
| [Two-Pointers/valid-palindrome.js](Two-Pointers/valid-palindrome.js) | Bounded skipping and edge-case notes |
| [HashMap/README.md](HashMap/README.md) | Executable indexed pair-finding template |
| [Heap/README.md](Heap/README.md) | Separate binary-heap operation complexities |
| [Queue/README.md](Queue/README.md) | Tree/graph complexity distinction and cycle-safe BFS template |
| [Greedy/README.md](Greedy/README.md) | Qualified sorting/proof/DP guidance |
| [dashboard/js-core-data.js](dashboard/js-core-data.js) | Seven reference descriptions/answers corrected; same card structures and examples |
| [JavaScript/05-arrays-collections-copying.md](JavaScript/05-arrays-collections-copying.md) | WeakSet value-type correction |

Added:

- [tests/Arrays/product-of-array-except-self.test.js](tests/Arrays/product-of-array-except-self.test.js): eight cases.
- [tests/Two-Pointers/valid-palindrome.test.js](tests/Two-Pointers/valid-palindrome.test.js): eleven cases.
- This report, `PR2_CORRECTNESS_TEACHING_REPORT.md`.

## Product of Array Except Self

### Previous problem

The checked/logged function returned `arr` unchanged. Before repair, direct execution returned `[1,2,3,4]`, and the new regression test failed expecting `[24,12,8,6]`. The failure was reproduced before replacing the code.

### Fix

The first pass stores the product strictly before each index in the returned array. The backward pass multiplies that value by the product strictly after the index. Each running product is updated after using it, excluding the current value. No division or additional prefix/suffix arrays are needed; input is unchanged. O(n) time, O(1) auxiliary space excluding O(n) output. These bounds follow from the two loops and constant scalar state in the implementation.

Zero and negative inputs work with the same invariant. Zero outputs are normalized to `0` so strict comparisons do not distinguish JavaScript's signed zero. Empty and singleton inputs have explicit tests: `[]` and `[1]`, respectively. These are small defensive extensions; a fresh LeetCode attempt should still clarify the question's input constraints. Arithmetic assumes intermediate integer products fit JavaScript's safe-integer range.

The existing post-solve comment now contains approach, example, key insight, complexities, and the lesson that a completion mark cannot substitute for checking expected output. The pre-solve checklist remains; a new reminder says to hide the repaired code/notes for a fresh attempt. This is a tested repair/reference, not a claim that the user independently re-solved or mastered the problem.

### Tests

| Input | Expected |
| --- | --- |
| `[1,2,3,4]` | `[24,12,8,6]` |
| `[-1,1,0,-3,3]` | `[0,0,9,0,0]` |
| `[0,0]` | `[0,0]` |
| `[2,3]` | `[3,2]` |
| `[-1,2,-3,4]` | `[-24,12,-8,6]` |
| `[1,1,1]` | `[1,1,1]` |
| `[]` | `[]` |
| `[5]` | `[1]` |

Every case also checks input preservation. All eight pass through the unchanged repository runner.

### Interview explanation

Use the existing [DSA speaking framework](english/README.md#dsa), with bullet cues rather than a memorized answer:

1. **Clarify:** product of other positions; no division; clarify zeros and numeric limits.
2. **Brute force:** multiply all other values separately for each index, O(n²).
3. **Optimization/invariant:** left product × right product; exclude self by updating after use.
4. **Data structure:** returned array holds left products; two scalar running products.
5. **Example:** `[1,1,2,6]` left products become `[24,12,8,6]` after the backward pass.
6. **Complexity:** O(n) time; O(1) auxiliary/O(n) output.
7. **Edges/code/test:** one zero, two zeros, negatives; explain each pass while coding and run regressions.

Select this question on [TODAY.md](TODAY.md), speak without notes, check the post-solve comments, and answer again. No new English files or automation are involved.

## Valid Palindrome

### Previous problem

For `".,"`, the unbounded skip loops moved past valid characters before `toUpperCase()` was called on `undefined`. Direct execution and the new regression test both reproduced the TypeError before the fix. The outer `left < right` check alone did not protect the inner loops.

### Fix

Both skip loops now check `left < right`. After skipping, the function returns true if the pointers meet; otherwise it compares the two valid characters and moves inward. The existing ASCII letters/digits and case-insensitive comparison behavior is retained. There is no cleaned or reversed copy of the input. Each pointer moves in one direction: O(n) time and O(1) auxiliary space.

Post-solve notes document the invariant, an allocating alternative, the boundary failure, and its lesson. The repair does not establish independent mastery.

### Tests

Eleven cases cover `".,"`, the Panama example, `"race a car"`, empty input, spaces/punctuation only, punctuation around one letter, a mismatch before trailing punctuation, mixed digits/case/punctuation, unequal digits, `"0P"`, and `"12:21"`. All pass using the existing runner.

### Interview explanation

1. **Clarify:** ignore ASCII non-alphanumerics/case; digits still count; empty filtered content is a palindrome.
2. **Straightforward approach:** clean and reverse/compare a string, O(n) extra space.
3. **Optimization/invariant:** already-processed outer pairs match; shrink the unexamined window.
4. **Data structure:** two indexes into the original string.
5. **Example:** `".,"` reaches a meeting point during skipping and safely returns true.
6. **Complexity:** O(n) time/O(1) auxiliary space.
7. **Edges/code/test:** guard inside each skip loop; handle pointer meeting before character comparison; run punctuation/numeric regressions.

Practice these cues through the same PR 1 speak–review–retry loop.

## Checked Solution Review

Reviewed every currently checked file from [01-DSA-Questions.md](01-DSA-Questions.md), not just filenames. “Implemented” describes inspected code and limited checks, not proven mastery. No file contains reliable independent-attempt, duration, hint-use, or notes-free explanation evidence. **None of the eight can be confidently certified as mastered from repository evidence alone.**

| File | Current implementation status | Notes status | Action in PR 2 |
| --- | --- | --- | --- |
| `Arrays/product-of-array-except-self.js` | Previously returned input; now prefix/suffix implementation passes eight cases | Previously empty; now approach, key insight, complexity, repair lesson | Repaired code; added regression tests and honest notes |
| `HashMap/two-sum.js` | Implemented complement lookup; existing six tests pass | Approach/complexity/lessons blank | Inspected; preserved code and notes |
| `HashMap/contains-duplicate.js` | Implemented membership lookup; three smoke assertions pass | Approach/complexity/lessons blank | Inspected; unchanged |
| `HashMap/valid-anagram.js` | Implemented frequency counting for expected ASCII interview inputs; four smoke assertions pass | Blank notes; stale “Write your solution here” comment despite implementation | Inspected; unchanged; leave personal recall/lessons for a real reattempt |
| `HashMap/group-anagrams.js` | Implemented sorted-key grouping; three smoke assertions pass; spread-copying an existing group adds avoidable cost | Approach/complexity/lessons blank | Inspected; no performance rewrite |
| `HashMap/top-k-frequent-elements.js` | Implemented count + sort; two smoke assertions pass; import still prints its existing example | Existing approach and O(n + m log m)/O(m) notes match sorting strategy | Inspected; preserved strategy, notes, and example |
| `Two-Pointers/valid-palindrome.js` | Previously crashed on punctuation-only input; now eleven regressions pass | Previously empty; now approach, complexity, boundary lesson | Repaired code; added tests and honest notes |
| `Two-Pointers/two-sum-ii-input-array-is-sorted.js` | Implemented two pointers/1-based result for sorted input with a valid pair; three smoke assertions pass | Blank notes; stale scaffold comment | Inspected; unchanged; no new no-solution contract |

The other six checked files were not silently rewritten or filled with generated personal lessons. The five additional smoke checks were read-only, in-memory validation; only the two requested regression suites were added to Git.

## HashMap Guidance Fix

**Old issue:** the `for (const x of nums)` example referenced undefined `i` and had an unwrapped `return`.

**Correction:** `findPair(nums, target)` uses `nums.entries()` to obtain both index and value, checks before inserting (so a value cannot pair with itself), and returns `[]` when no pair exists. The snippet parses as standalone JavaScript and executes for an ordinary pair, duplicate pair, and no pair. The nearby README has no other JavaScript template with this undefined-index defect. Reference: [MDN Array.prototype.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries).

## Heap Guidance Fix

**Old claim:** the min/max is available in O(log n), conflating reading the root with modifying the heap.

**Correction:** explicitly scope the guidance to a binary heap: peek O(1), insert/root-pop O(log n), bottom-up build O(n), repeated-insertion build O(n log n). Top-k guidance distinguishes k = 1 from k >= 2. Reference: [Princeton priority queues and heap construction](https://algs4.cs.princeton.edu/24pq/).

## Queue/BFS Guidance Fix

**Old issue:** O(n) BFS wording ignored general graph edges; the example repeatedly enqueued neighbors without a visited guard.

**Correction:** tree traversal O(n); adjacency-list graph BFS O(V + E), with O(V) queue/visited storage. Mark on enqueue to avoid cycles/repeated discoveries. Explain reachable components and when a children-only tree walk can omit visited. Executed the template on a cyclic triangle; each vertex was enqueued once. Reference: [Princeton BFS implementation and analysis](https://algs4.cs.princeton.edu/41graph/).

## Greedy Guidance Fix

**Old claims:** greedy almost always begins with sorting, an obvious choice can be trusted, and inability to state an exchange argument implies DP. Complexity was presented as universally O(n log n).

**Correction:** sorting is common but optional; justify safety through a proof/invariant and test counterexamples. Compare DP by the need to explore alternative subproblem states/history. Missing a proof is not evidence for a different algorithm category. O(n log n) applies to the shown sorted interval template, not every greedy algorithm.

References: [Princeton greedy MST/cut-property reasoning and Prim's algorithm](https://algs4.cs.princeton.edu/43mst/) demonstrates justified choices without sorting all input first; [MIT dynamic programming lecture notes](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/9eb3e9a51a7b5b60b0f67c2277f8b0ee_MIT6_006S20_lec15.pdf) explain subproblems and exploring choices. The interview guidance is an application of those principles, not a rule that identifies DP automatically.

## JavaScript / Hoisting Corrections

**Old claim:** the dashboard Function Declaration card said both declaration and implementation move to the top, contradicting its own hoisting answer and [canonical scope notes](JavaScript/01-scope-hoisting-closures.md).

**Correction:** declarations' bindings are prepared before execution; function declarations receive callable values, while expressions become callable when assigned. Source is not physically relocated. Block scoping is qualified for strict mode/modules. The already-accurate canonical chapter and dashboard hoisting theory answer were preserved. Reference: [MDN hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting).

## Other JavaScript Accuracy Corrections

Reviewed the canonical functions, scope, collections, and event-loop chapters alongside the dashboard descriptions. Corrections are scoped to demonstrated statements, not a full JS syllabus rewrite.

| Old claim or issue | Corrected interpretation | Authoritative reference |
| --- | --- | --- |
| `bind` always permanently locks `this` | Ordinary calls use bound `this`; construction ignores it but retains bound arguments. Binding an arrow cannot replace lexical `this`. | [MDN bind/constructors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind), [MDN arrows](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) |
| `clearTimeout` must run before the delay expires | Cancellation concerns a callback that has not started, even after its threshold elapsed. It cannot undo execution. Browser numeric ID and Node `Timeout` are distinguished. | [MDN clearTimeout](https://developer.mozilla.org/en-US/docs/Web/API/Window/clearTimeout), [HTML timer cancellation checks](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers), [Node timers](https://nodejs.org/api/timers.html#cleartimeouttimeout) |
| Shorthand methods equal function-valued properties except anonymous stack names | Shorthand methods are not constructors and support `super` property access. Both forms can have inferred names; stack naming is not the defining distinction. | [MDN method definitions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions), [MDN function names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name) |
| WeakSet note omitted non-registered symbols | Current WeakSet accepts objects and non-registered symbols, not `Symbol.for` symbols. Check target runtime support. | [MDN WeakSet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet) |
| Timer queueing follows promises; one universal sync/microtask/timer priority predicts all variations | Preserve A,D,C,B for the shown fulfilled-promise snippet. Explain browser checkpoints, pending promises, delay normalization, and label Node phases/nextTick/module context explicitly. | [MDN microtasks](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide), [HTML timers](https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers), [Node event loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick), [Node CommonJS/ESM example](https://nodejs.org/en/learn/asynchronous-work/understanding-setimmediate) |

The canonical [functions/this](JavaScript/03-functions-and-this.md) and [event-loop](JavaScript/06-event-loop.md) chapters did not contain the dashboard's absolute claims and remain unchanged. No Node phase/version ordering table was introduced.

## Tests Performed

Runtime: Node.js `v20.19.0`. The package's existing `test` command takes one problem path; there is no aggregate command. Located every test file and invoked all three suites through that workflow:

| Command | Result |
| --- | --- |
| `npm test -- HashMap/two-sum` | 6/6 pass |
| `npm test -- Arrays/product-of-array-except-self` | 8/8 pass |
| `npm test -- Two-Pointers/valid-palindrome` | 11/11 pass |

Before code repair, each new suite failed on its first reported regression. After repair, **all 25 persistent test cases pass**. No testing framework or dependency was introduced.

Additional focused validation:

- Fifteen in-memory smoke assertions for the five other checked implementations listed above; all pass. Top-k's existing console output remains unchanged.
- Parsed all six JavaScript code blocks in modified Markdown; executed HashMap pair cases, cyclic BFS, and interval selection. Heap template parses; its external heap API remains a teaching assumption rather than a new implementation.
- Parsed dashboard data and confirmed the existing counts: 15 function cards, 9 async/timer cards, 20 theory cards. Card shapes/code examples are unchanged; no browser interaction redesign was needed or tested.
- Executed bound ordinary/constructor calls, arrow binding, shorthand constructor rejection/function-property construction, inferred property naming, accepted/rejected WeakSet symbols, and cancellation after a 5 ms timer threshold elapsed during 15 ms of synchronous work. All assertions pass.
- Checked local Markdown links/anchors in the report and affected guides. Consulted the linked external JavaScript/algorithm references; search-style LeetCode problem URLs were not exhaustively checked.
- Reviewed every PR 2 changed/new file, plus the pre-existing README diff; `git diff --check` passes. Hash comparison against the start of PR 2 confirms eight existing files changed, three files added, no deletions, and 264 of 272 existing files preserved byte-for-byte.

## Progress History Preservation

**Historical completion exists, but current correctness was repaired in PR 2.**

The checklist still has eight checked problems and `.progress/log.json` still has the same eight historical entries, including the product and palindrome entries. No entry, date, queue position, or schema was changed; no completion checkbox was cleared. No `done` command was run. These records are historical activity, not newly verified independent attempts.

Repaired comments state this distinction. A fresh user attempt should hide solution/notes, solve and explain through TODAY, then record only the actual outcome. Richer evidence capture belongs to later PRs; this PR does not manufacture it.

## What Was Intentionally Not Changed

- `TODAY.md`, all `english/` files, root README's PR 1 links/commands, and the PR 1 report are unchanged from the start of PR 2.
- No `00-Roadmap.md` or `13-Daily-Study-Plan.md` rewrite, 20-week plan, weekly review, weak-area file, TypeScript track, or PR 3 implementation.
- No progress/schema/revision/selection/queue changes, dashboard architecture changes, script edits, daily generation, dependencies, folder moves, or deletions.
- No generated mastery statements, independent-solve claims, durations, hint counts, or fabricated work experience.
- Group-anagram copying overhead, top-k's sorting strategy, and the remaining blank/stale completed-file notes were documented rather than rewritten. The first is a performance reattempt opportunity; the second is honestly described already; personal notes should come from actual recall and reattempts.
- Other audit findings about roadmap load, revision policy, progress evidence, duplicated JavaScript ownership, and dashboard server behavior remain assigned to their later PRs. The original audit is preserved as the pre-repair assessment.

## Remaining Risks / Questions

Correct code and passing examples cannot establish whether the user can independently solve or explain these problems. All eight checked items still require that evidence. Tests are deliberately focused, not an exhaustive certification of all repository scaffolds or every JavaScript reference card.

Palindrome remains ASCII-oriented; Unicode normalization is outside the existing predicate's scope. Product uses Number arithmetic within safe-integer limits rather than BigInt. Clarify those contracts in an interview. Group-anagram group copying can add quadratic reference-copy work for one large group; top-k sorting does not meet a separately required linear-time variant. Neither is silently represented as optimized mastery here.

PR 1/audit changes remain uncommitted alongside PR 2. When preparing commits, select this report, the eight changed existing files, and two new test files for PR 2; retain the earlier work separately.

## Recommended PR 3 Scope

Follow the audit's next step: realistic 16–24-week phases and weekly adjustment in `00-Roadmap.md` and `13-Daily-Study-Plan.md`, README workload alignment, a weekly-review template, and `WEAK_AREAS.md`. Carry PR 1 English practice into phase gates and missed-day rules; keep technical correctness/mastery evidence distinct. Validate time arithmetic, links, and a missed-week scenario. Do not replace selection scripts or progress schema as part of that planning PR.

PR 3 has not been implemented.

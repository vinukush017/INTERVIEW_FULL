# Interview Preparation Repository Audit

## Executive Summary

**The repository has a useful DSA practice system and substantial JavaScript notes, but it does not yet support your complete goal: technical interview readiness plus confident English explanation over 16–24 weeks.** Preserve its existing files, problem folders, CLI, dashboard, and question-first flashcards. Change the preparation model from finishing a queue to demonstrating independent problem solving, retention, practical implementation, and clear spoken answers.

Audit scope: the working tree at commit `5ded1ac`, including the latest pull that added the JS Core dashboard tab. The tree was clean before this report. Inspected all 266 existing non-Git files: 47 Markdown files, 215 JavaScript files, one MJS script, two JSON files, and one HTML file. Read the guides, plans, topic READMEs, scripts, dashboard content, progress data, and problem prompts/scaffolds; examined the implemented solutions. Git internals and unrelated neighboring repositories are outside scope. No applicable repository `AGENTS.md` was found. Only this report is being added; all implementation proposals below are future work.

Key findings:

1. **Daily startup already exists.** `README.md` directs you to `npm run dev`, with terminal alternatives. The dashboard edits solutions, runs available tests, and records completion. Build on this instead of replacing it with a large application.
2. **Preparation is strongly skewed toward DSA inventory.** There are 206 problem files across 20 folders, but React, Next.js, Node, Express, SQL, and system design are mostly short topic checklists. TypeScript is absent.
3. **Completion is unreliable evidence of readiness.** Eight problems are checked off; `Arrays/product-of-array-except-self.js` still returns its input. `Two-Pointers/valid-palindrome.js` crashes on punctuation-only input. Most completed files still lack approach, complexity, and lessons.
4. **English is acknowledged but not trained systematically.** The roadmap asks for spoken explanations, and JS Core now hides flashcard answers. There is no repeatable speaking loop, explanation framework, speaking feedback, or communication readiness gate.
5. **The plan and tools disagree.** Documents prescribe reviews after 1/3/7/14 days; tools pick the least-repeated checked problem. Calendar-derived weeks and rotating full-stack topics advance even when study stops.
6. **The first eight weeks are too compressed for durable full-stack mastery.** Weeks 9–16 assume a job-search pipeline. The current application quotas and salary assumptions are not established by your present requirements.

Recommended direction: use a 20-week baseline, compress to 16 weeks only after a baseline assessment, and allow up to 24 weeks through buffer and targeted revision. Allocate daily speaking inside the available study time. Start with one manageable technical output and one explanation each day; measure whether you can explain without notes.

Assumptions and limits:

- You work full time and target JavaScript/TypeScript full-stack engineering. Your exact seniority, companies, interview formats, current proficiency, resume, and projects are not supplied. Treat mid-level depth as a provisional starting point; calibrate with job descriptions and baseline mocks.
- The 8 checked problems and existing log describe recorded repository activity, not everything you know or have studied elsewhere. Missing artifacts do not prove missing ability.
- `14-Job-Search-and-Negotiation.md` assumes an 8 LPA starting point, 12–15 LPA target, India-specific notice periods, and a product-company move. Do not carry these forward as verified personal facts.
- Existing external resources are predominantly LeetCode search links, not curated/versioned references. Local Markdown file targets were checked; live availability and exact destination of every LeetCode search were not verified.
- CLI and focused solution checks were run without modifying content. Dashboard behavior was assessed from source, including the newly pulled tab; no browser interaction or write endpoint was exercised.
- Audit date uses the supplied context, 2026-10-02. CLI week/date output comes from the execution environment clock and is reported as observed output, not as an authoritative study phase.

## Current Repository Structure

```text
/
  README.md
  00-Roadmap.md                  # 8-week skills block + job-search extension
  01-DSA-Questions.md            # 206-item queue and master completion checklist
  02-JavaScript.md               # links to substantial chapters
  03-React.md ... 08-System-Design.md
  09-HR-Interview.md ... 12-Behavioral.md
  13-Daily-Study-Plan.md          # 650-line, 16-week calendar/reference
  14-Job-Search-and-Negotiation.md
  JavaScript/                   # 8 chapters, README, 856-line DSA cheat sheet
  Arrays/, String/, HashMap/, Two-Pointers/, Sliding-Window/
  Stack/, Queue/, Binary-Search/, LinkedList/, Recursion/
  Trees/, Heap/, Backtracking/, Graph/, Dynamic-Programming/
  Greedy/, Intervals/, Bit-Manipulation/, Math/, Sorting/
  Mock-Interviews/README.md      # rotation and empty session template
  .progress/log.json            # startDate + date/problem events
  scripts/                      # today, done, review, progress, add, test, server
  scripts/lib/progress.js       # shared parsing, persistence, streak helpers
  dashboard/index.html          # Problems and JS Core tabs
  dashboard/js-core-data.js     # static snippets and 20 theory flashcards
  tests/HashMap/two-sum.test.js  # only automated problem test file
  package.json                  # Node scripts; no external dependencies
```

Problem inventory:

| Folder | Files | Folder | Files |
| --- | ---: | --- | ---: |
| Arrays | 10 | String | 10 |
| HashMap | 9 | Two-Pointers | 9 |
| Sliding-Window | 6 | Stack | 9 |
| Queue | 7 | Binary-Search | 12 |
| LinkedList | 12 | Recursion | 3 |
| Trees | 17 | Heap | 8 |
| Backtracking | 12 | Graph | 16 |
| Dynamic-Programming | 15 | Greedy | 10 |
| Intervals | 8 | Bit-Manipulation | 9 |
| Math | 10 | Sorting | 14 |

Actual intended workflow:

1. Read `00-Roadmap.md`; use `13-Daily-Study-Plan.md` for pacing, other subjects, and mocks.
2. Run the dashboard or `scripts/today.js` to choose the first unchecked non-challenge item in the queue in `01-DSA-Questions.md`.
3. Read the local prompt/example; implement in the existing `.js` file and fill in notes afterward.
4. Mark done through the CLI/dashboard; this updates the master checklist and `.progress/log.json`.
5. Re-solve a least-repeated checked item through `scripts/review.js`; view topic totals through `scripts/progress.js`.
6. Read JavaScript chapters or the new JS Core reference/flashcards; manually follow the remaining guides and record mocks.

The repository is already more than a collection of notes. Its operational coverage, however, mainly concerns DSA. The new JS Core tab is reference-only and does not write learning or speaking progress.

## What Is Already Good

- `01-DSA-Questions.md` requires explaining the approach, independent coding, edge cases, and complexity. Preserve that standard.
- The dependency queue and all 206 checklist entries match one another without duplicate queue paths. Local problem files exist.
- Topic READMEs contain recognition cues, templates, complexity, and common mistakes. For example, `Binary-Search/README.md` teaches monotonicity, and `Graph/README.md` distinguishes a global visited set from the active recursion path.
- Most problem files contain a concise prompt and example without revealing a solution. The 198 repeated `solve(...args) { return args; }` scaffolds are intentional practice slots, not 198 completed implementations.
- `JavaScript/01-scope-hoisting-closures.md` through `JavaScript/08-interview-practice.md` contain explanations, code, interview checks, and practical tasks. They are the best model for expanding other tracks.
- `JavaScript/07-promises-async-await.md` covers concurrency, rejection propagation, combinators, and cancellation limitations.
- `JavaScript/DSA-JAVASCRIPT-CHEATSHEET.md` supports syntax lookup and encourages recall before lookup. Keep it as a reference, not a syllabus to memorize.
- `dashboard/index.html` now supports hidden-answer JS flashcards, filtering, and tab persistence. This is a good foundation for speak-before-reading.
- `13-Daily-Study-Plan.md` explicitly rejects catch-up cramming and allows optional stretch work. Preserve this resilience principle.
- `10-Projects.md` asks for personal contribution, decisions, production issues, and outcomes. `12-Behavioral.md` uses STAR, and `Mock-Interviews/README.md` supplies a feedback template.
- The tools use Node built-ins with no dependency installation. This is appropriate for a low-maintenance personal workspace.

## Problems With the Current Approach

| Finding | Evidence | Consequence | Recommended change |
| --- | --- | --- | --- |
| Eight-week technical compression | `00-Roadmap.md`; weeks 1–8 of `13-Daily-Study-Plan.md` | Graphs/backtracking/backend in one week; SQL/DP/greedy in one week; system design mostly week 7 | Spread learning across 16–24 weeks with output gates and concurrent speaking |
| Conflicting daily loads | README: 8–10 new DSA/week; daily plan: one core/day and lighter opening weeks | New work, revisions, practical tasks, and English cannot reliably fit | Start with 4–6 new representative problems/week, fewer during mocks or demanding topics |
| Calendar mistaken for learning progress | `scripts/today.js`, `scripts/serve-dashboard.js` derive week from start date | Travel or incidents advance the displayed plan regardless of mastery | Store current learning week/phase explicitly; retain elapsed weeks only as context |
| Full-stack topic disconnected from completion | `scripts/today.js` rotates ten labels by elapsed days | React/backend/SQL can appear before prerequisites or repeat without progress | Select from the current weekly focus and pending task |
| Dashboard/CLI parity is incomplete | Dashboard API lacks the CLI full-stack topic | README's claimed equivalent daily loop does not cover the same tasks | Share one daily selection function and output |
| Queue is an order, not a dependency engine | `parseQueue` and next-item selection | No prerequisite or readiness checks; challenge items are deferred across the whole queue | Keep metadata and manual gates simple; do not claim automatic prerequisite enforcement |
| Binary completion hides evidence | `.progress/log.json`, checklist, checked solutions | Hint dependence, failures, forgotten answers, and communication failures disappear | Record attempts and explanation outcomes separately |
| Speaking is too small and irregular | Five-minute ending in daily plan; 15-minute speaking only in roadmap's 3-hour option | Your primary bottleneck receives leftover time | Reserve 15–30 minutes daily and one weekly communication session |
| Revision policy is inconsistent | 1/3/7/14-day docs versus rep-count selection | Review can ignore urgency and never include failed unchecked attempts | Use due dates, outcomes, and a review time cap |
| Search assumptions dominate later weeks | Weeks 9–16; `14-Job-Search-and-Negotiation.md` | Application volume may crowd out preparation; funnel diagnosis is overconfident | Use readiness and actual pipeline evidence; start a small search when ready |

The closing claim in `13-Daily-Study-Plan.md` that no offer after sixteen weeks is a pipeline problem is too strong. Technical gaps, communication, targeting, hiring conditions, availability, and compensation can all matter. Similarly, `npm run progress` identifies unchecked folders, not your weakest interview skills.

## Content Gaps

“Listed” means named in a checklist; “developed” means explanation/examples/practice exist. These are different levels of coverage.

| Area | Current state and paths | Missing interview outputs |
| --- | --- | --- |
| DSA | Broad queue and folder notes in `01-DSA-Questions.md` | Tries; prefix-sum problem practice; fixed-window baseline; transfer problems; attempt evidence; think-aloud rubric |
| JavaScript | Developed chapters and JS Core cards | Focused modules/memory chapters; version/context-aware output questions; retained implementations and results |
| TypeScript | No track, TS files, or practical checklist | Types/interfaces, unions/intersections, generics, utility types, narrowing, inference, safe API/component typing |
| React | 17-line `03-React.md` with four build suggestions | Rendering/effect reasoning, architecture decisions, forms, async races, profiling evidence, tested tasks |
| Next.js | 10-line `04-NextJS.md` | Versioned cache behavior, server/client boundaries, auth flow, deployed request flow, performance reasoning |
| Backend | `05-NodeJS.md` and `06-Express.md` list basics | Complete request lifecycle; bounded concurrency; backpressure; queues/retries; caching; robust API exercises |
| Database | 17-line `07-SQL.md` | PostgreSQL-specific plans, locking/deadlocks, concurrent updates, cursor pagination, constraints, schema exercises |
| Redis | Generic caching in `08-System-Design.md` | Cache-aside, TTL/invalidation, stale reads, stampede, eviction, atomic rate limiting and failure behavior |
| System design | 24-line `08-System-Design.md`; four systems listed | Progressive component lessons and actual designs; WebSockets; feed/orders/rate limiter/analytics cases |
| Machine coding | JS implementation prompts; React suggestions | Timed task specs, starter workspace policy, acceptance criteria, debugging/performance tasks, result review |
| Behavioral/projects | Templates in `09`–`12`; no filled stories | 8–10 real stories; self-introduction variants; deployment/scaling/security follow-ups; resume claim mapping |
| English | Occasional aloud instructions; no dedicated section | Daily two-attempt loop, frameworks, phrases, notes-free outcomes, recorded samples, communication weakness revision |
| Reviews/mocks | Weekly checklists; one mock README | Weekly review history, objective rubrics, cross-track revision, adaptation rules |
| Resources | LeetCode searches and internal links | Small authoritative source index, version/date notes, expected use rather than resource collection |

### English communication assessment

Communication should become a P0 outcome in every track, not a separate grammar curriculum. Existing instructions in `02-JavaScript.md`, `JavaScript/README.md`, `00-Roadmap.md`, and `13-Daily-Study-Plan.md` already provide entry points. The JS Core flashcards provide question-first presentation. None captures the distinction between “I did not know” and “I knew but could not explain.”

Use this 15-minute daily loop, extending to 30 minutes only when time permits:

| Minutes | Action |
| --- | --- |
| 0–1 | Select one question from today's technical task or due speaking revision; see only the question |
| 1–4 | Explain aloud without notes; allow a short pause to choose a structure |
| 4–7 | Read reference bullets; find one technical omission and one communication obstacle |
| 7–10 | Speak again using keywords, then put those keywords away |
| 10–13 | Answer one follow-up or connect the idea to your own work |
| 13–15 | Log notes-free outcome, one useful phrase, and the next revision if needed |

For a 20–30-minute session, add a short DSA walkthrough or project explanation rather than more grammar reading. Use fresh wording each time.

Reusable structures, to be housed in a compact `english/README.md`:

| Question type | Spoken structure | Useful opening |
| --- | --- | --- |
| Technical concept | Definition → purpose → mechanism → example → limitation → experience if real | “At a high level, this is…” |
| X versus Y | Shared purpose → comparison along 2–3 dimensions → example → when to choose each | “Both solve…, but they differ in…” |
| Architecture | Goal/constraints → components → request flow → decision → alternatives → failure/scaling | “The main requirement was…” |
| Debugging | Scope/impact → evidence → hypotheses → isolate → mitigate/fix → verify → prevent | “First, I would establish the impact…” |
| Project | Context → problem → investigation → decision → implementation → result → learning | “My contribution was…” |
| Behavioral | Situation → task → your actions → result → lesson | “The situation was…, and my responsibility was…” |
| System design | Requirements → relevant scale → APIs → data → architecture → request flow → bottlenecks → reliability → tradeoffs | “I would first clarify the requirements…” |
| DSA | Clarify → brute force → optimization/invariant → data structure → example → complexity/edges → code and test aloud | “The straightforward approach would be…” |

These are flexible scaffolds. A one-minute answer need not mechanically recite every step. Give the main answer first; expand when invited. Do not invent work experience to fill the final step.

Keep `english/TECHNICAL_PHRASES.md` to roughly 20–30 phrases. Practice a few in actual answers: “The bottleneck was…”, “We chose this because it reduced database queries…”, “Another option we considered was…”, “After investigating the logs…”, “One tradeoff is…”, “To prevent a recurrence…”, “If traffic increased tenfold…”, and “Internally, this works by…”. Favor precise causal statements over elaborate vocabulary.

Recording: two sessions/week initially, optionally three later. Record 2–5 minutes, listen once, identify at most two or three improvements, and re-answer. Cap playback/analysis at about five minutes. Use a local phone/computer recorder; store a date and private reference in the log, not media in Git.

Grammar priority: clarity, accurate terminology, structure, confidence, fluency, then polish. Address tense when it obscures past work, missing subjects when they obscure ownership, or long sentences when they obscure causality. Do not schedule a grammar textbook or score accent conformity.

## Duplicate / Low-Value Content

No byte-identical existing files were found. Most duplication is semantic or procedural.

- **Keep useful navigation duplication:** `02-JavaScript.md` is a checklist, `JavaScript/README.md` is an index, and the chapters teach. Their different jobs justify retaining them.
- **Preserve one completion authority:** the queue, checklist, and folder links in `01-DSA-Questions.md` and topic READMEs serve different purposes. However, `13-Daily-Study-Plan.md` contains independently checked DSA tasks that scripts do not synchronize. Replace those completion indicators with links/status views in a later PR.
- **Reduce policy duplication:** time budgets, learning order, readiness rules, and revision instructions appear in `README.md`, `00-Roadmap.md`, and `13-Daily-Study-Plan.md`; selection/time logic also appears in both `scripts/today.js` and `scripts/serve-dashboard.js`.
- **Resolve new content drift:** `dashboard/js-core-data.js` duplicates explanations from JavaScript chapters. Its function-declaration note says implementation moves to the top, while its hoisting flashcard and `JavaScript/01-scope-hoisting-closures.md` correctly say source is not physically moved. Prefer canonical reference bullets with chapter links.
- **Practice one sort implementation first:** `Sorting/sort-an-array.js` overlaps `Sorting/merge-sort-implementation.js` and `Sorting/quick-sort-implementation.js`. Bubble/selection/insertion/heap sort are optional depth, not mandatory daily queue milestones.
- **Use easy variants selectively:** `Math/fizzbuzz.js`, `Math/add-digits.js`, `Math/excel-sheet-column-number.js`, `Stack/baseball-game.js`, and several queue simulations are useful warm-ups, but should not delay trees/graphs, practical work, and speaking once traversal is established.
- **Avoid repeating syntax study indefinitely:** the 856-line cheat sheet and numerous function forms in JS Core are references. Generator/async-generator syntax deserves role-specific time rather than equal time with closures/promises.
- **Retain challenge files as a library:** median of two sorted arrays, N-Queens, edit distance, largest rectangle, and minimum interval queries need not block readiness.

There is no political-content evaluation here. Priorities below apply only to interview preparation. No deletion is necessary to improve daily use.

## Interview Priority Analysis

These priorities assume a general full-stack role and must be adjusted to actual interview formats. They determine practice emphasis, not permanent file removal.

### P0

- Daily English retrieval/re-answer loop and thinking aloud during coding, debugging, and designs.
- Arrays/strings/hashing, two pointers, sliding window, stack/queue, binary search, linked lists, recursion, tree/BST traversal, core graph traversal, intervals, and basic DP/greedy. Select representative problems from existing folders.
- JS scope/closures/`this`/prototypes/coercion, async flow/event loop/errors, collections, modules, memory fundamentals, debounce and practical data transformations.
- Practical TS types, interfaces, unions, narrowing, generics, utility types, inference; add this missing track.
- React rendering/state/hooks/effects/forms/component design, context tradeoffs, basic profiling and practical UI tasks from `03-React.md`.
- Node/Express request flow, validation, auth/authz, errors, logging, rate limiting, SQL joins/indexes/transactions, race prevention, and database-backed APIs.
- System design discussion structure, APIs/data modeling, caching/queues/reliability basics, and several complete relevant designs.
- Two project deep dives, resume claim verification, 8–10 adaptable STAR stories, self-introduction, regular feedback and revision.

### P1

- Heaps/top-k, monotonic structures, backtracking, topological sort, core 2D DP, prefix sums, and a basic trie. Promote particular patterns to P0 when targets test them regularly.
- Next.js App Router, rendering/cache boundaries, authentication, performance, deployment, and version-aware middleware/proxy understanding; P0 for explicitly Next.js roles.
- PostgreSQL isolation/locks/deadlocks, query plans, cursor pagination, Redis TTL/invalidation/stampede and atomic operations.
- Node streams/backpressure, worker threads versus I/O concurrency, queues/retries/idempotency, observability, deployment/CI/CD explanation.
- Error boundaries, component tests, accessible reusable components, frontend architecture, system design replication/partitioning/CDN/WebSockets/storage.

### P2

- Hard DSA variants after core transfer succeeds: `Two-Pointers/trapping-rain-water.js`, `Heap/find-median-from-data-stream.js`, advanced sequence DP.
- Additional design variants: feed and analytics/logging after URL shortener, notification, chat, upload, orders, and rate limiting fundamentals.
- Advanced practical TS conditional/mapped types when needed; basic generator/async-generator usage.
- Broader sorting implementations, deeper Redis operations, and Pages Router depth for legacy-role relevance.

### P3

- Mandatory completion of every one of the 206 files or all textbook sorts.
- Highly specialized algorithms such as Manacher's, elaborate DP/graph theory beyond target interviews, or advanced type puzzles without application relevance.
- Exhaustive browser/engine internals, distributed-consensus implementation, large infrastructure builds, and a new interview-prep platform.
- Collecting multiple overlapping courses/resources or memorizing full answer scripts.

## DSA Assessment

Breadth is strong: all requested groups except tries are represented. BST questions live under `Trees/`. Arrays include maximum-product DP, and the queue correctly places it in the DP level. The cheat sheet contains prefix sums, but no dedicated range-sum/subarray-sum problem set exists. Add only a few targeted gaps, not another hundred questions.

Important corrections and evidence:

- Eight of 206 checklist entries are checked, about 3.9%. `.progress/log.json` contains eight date/problem entries for the same unique problems; no recorded re-solves.
- `Arrays/product-of-array-except-self.js` returns `[1,2,3,4]` for `[1,2,3,4]`; its prompt expects `[24,12,8,6]`. It is checked and logged but not implemented correctly.
- `Two-Pointers/valid-palindrome.js` throws `TypeError` for `".,"` because inner skip loops can move beyond valid indexes before calling `toUpperCase`. This is a meaningful edge case allowed by the local description.
- `HashMap/two-sum.js` passes all six tests in `tests/HashMap/two-sum.test.js`. Passing does not establish independent recall or English explanation.
- `HashMap/top-k-frequent-elements.js` records its approach and complexity and includes one console example. The other checked files retain largely empty notes.
- `HashMap/group-anagrams.js` repeatedly copies an existing group with spread. Discuss the extra cost on large same-key groups instead of assuming grouping is linear apart from sorting.
- `HashMap/README.md` uses `i` inside a `for (const x of nums)` template without defining it. `Heap/README.md` conflates O(1) peek with O(log n) insertion/removal. `Queue/README.md`'s O(n) BFS shorthand needs a tree versus general O(V+E) graph distinction. `Greedy/README.md` overstates that most greedy work starts with sorting and implies inability to explain a greedy choice means the problem is probably DP. Fix these as teaching quality issues.
- Many files have a generic function signature even when the question requires a class/API or linked/tree nodes, such as `Stack/min-stack.js`, `Queue/design-circular-queue.js`, and `Trees/maximum-depth-of-binary-tree.js`. Define contracts, example conversions, and fixtures for selected core problems.

Recommendation: select roughly 60–80 representative core problems from the existing library, with optional targeted expansion toward 90–110 if evidence warrants. These are planning ceilings, not readiness quotas. Learn a pattern through one guided example if needed, one independent canonical attempt, and a fresh transfer variant. Move intervals and sorting applications earlier; backtracking is not a prerequisite for ordinary graph traversal. Allow advancement when a failed optional problem does not invalidate the foundational pattern.

DSA communication progression: first narrate a finished solution; then explain the approach before coding; then speak decisions and checks during timed coding. For important problems cover clarification, brute force, optimization, data structure, worked example, time/space, edge cases, and tests. Do not narrate every keystroke.

## JavaScript / TypeScript Assessment

JavaScript is the most developed technical track. `02-JavaScript.md` links all eight chapters and sets a sensible notes-free completion standard. The implementation chapter includes debounce/throttle, simplified `Promise.all`, cloning, output questions, event emitter, and a concurrency limiter. Keep and practice these tasks rather than replacing the notes.

Missing: a focused modules section, garbage collection/retained closures/listeners/timers, practical memory investigation, and runtime-specific Node output exercises. JS Core contains 15 function/parameter cards, nine timer/async cards, and 20 theory cards, but its reference answers should not become memorized speeches.

Accuracy/staleness examples:

- Correct the new physical-hoisting claim and avoid treating shorthand methods as fully equivalent to function-valued properties. The cards also overgeneralize `.bind` locking `this` without mentioning construction and timer cancellation needing to occur before the delay expires rather than before execution. Verify these using primary language documentation when editing.
- `JavaScript/05-arrays-collections-copying.md` says WeakSet stores objects only. Current documentation includes non-registered symbols. This is a small accuracy correction, not a reason to prioritize symbol trivia. See [MDN WeakSet reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet).
- Keep browser and Node event-loop contexts explicit; `JavaScript/06-event-loop.md` already cautions about runtime differences. Do not turn JS Core's simplified microtask explanation into a universal Node ordering rule.

TypeScript needs a new compact track: model an API response with a discriminated union, narrow unknown input safely, type a reusable React component, implement a generic helper, and explain compile-time versus runtime validation. Start with one guide and a few exercises; postpone advanced type puzzles.

For each chapter, answer one question aloud before reading, predict or write code, then answer again with a concrete production-style example.

## React / Next.js Assessment

`03-React.md` covers the right labels and suggests search with debounce, a paginated table, accessible modal, and optimistic todo list. It does not provide lessons, specs, completed exercises, debugging scenarios, or output evidence. Expand incrementally around actual tasks: rendering triggers, state identity, effects/cleanup, stale closures, async response races, stable keys, context scope, profiling, memoization, forms, and error handling.

Practice explaining why `React.memo` may not prevent a render, how state updates affect a component tree, and why a measured bottleneck deserves optimization. Add architecture reasoning and accessibility to the existing build exercises rather than building a new large project.

`04-NextJS.md` lists App/Pages Router, Server/Client Components, rendering, caching, middleware, auth, and deployment. These are unexpanded topics, not outdated implementation examples. Version context is missing. Current Next.js documentation names the convention `proxy` starting in v16 and deprecates `middleware`; retain understanding of both for existing applications. See [official Next.js migration guide](https://nextjs.org/docs/messages/middleware-to-proxy).

For future notes, record the actual study/project version and source beside caching claims. Trace a request through server rendering, data access, caching/revalidation, client hydration/interactivity, authorization, and deployment. Practice the same flow in a two-minute English explanation. Do not study App Router and Pages Router equally unless your targets require both.

## Node.js / Backend Assessment

`05-NodeJS.md` names runtime/event-loop phases, modules, buffers/streams, events, file APIs, workers/processes, errors, and security. `06-Express.md` complements it with routes/middleware, validation, auth, CORS, rate limiting, pagination, and testing. Both are ten-line checklists; no backend project is implemented here.

Develop through small exercises: validated paginated API, ownership/role authorization, structured errors/logging, transactional updates, cache-aside reads, queued work with retry/idempotency, and a debugging incident. Cover concurrency limits, backpressure, graceful shutdown, timeout/cancellation, and CPU-bound work versus overlapping I/O.

Use one reusable small workspace for machine coding. Discuss auth/token/session choices and failure behavior, not just JWT definitions. Explain what happens from HTTP request arrival through route middleware, database call, error handling, and response. A production-500 scenario should include impact, recent changes, logs/correlation, dependency checks, narrowing hypotheses, safe mitigation, fix, validation, and prevention. Use “First…”, “If that looks normal…”, “I would narrow this down by…”, and “Finally…” as speaking aids.

## Database Assessment

`07-SQL.md` includes queries/joins/aggregates, CTEs, windows, indexes/plans, transactions/isolation/ACID, normalization, and four query prompts. Preserve these as a starting checklist. No SQL scripts, schema, PostgreSQL fixtures, execution-plan notes, or query results exist.

Add one small users/orders/items schema and exercises for joins, uniqueness/foreign keys, indexes, `EXPLAIN`, cursor versus offset pagination, transactional stock/order updates, locking/race conditions/deadlocks, and normalization tradeoffs. Teach isolation with a two-session example. Discuss why index maintenance can increase write cost and when a query still scans many rows.

Redis coverage should stay tied to APIs and system design: cache-aside request flow, TTL and invalidation, stale values, eviction, cache outages, stampede prevention, and atomic counters. Reuse one caching exercise across backend, design, and speaking. Explain concurrency bugs from anonymized real work where available.

## System Design Assessment

`08-System-Design.md` has a good five-step discussion order and names useful fundamentals. It lists URL shortener, chat, notifications, and file storage, but none has a worked design or recorded discussion. The topic list mentions retries/idempotency and observability; these need examples rather than replacement.

Learn components early through APIs/databases, then assemble designs. Begin with requirements, availability/consistency, load balancing, caches, queues, data modeling, replication/partitioning, CDN/storage, rate limiting, observability, and WebSockets. Estimate scale when it changes decisions, not as ritual arithmetic.

Suggested design progression: URL shortener → notification delivery → file upload/storage → chat → rate limiter → order/e-commerce workflow. Feed and analytics/logging are later variants if targets/time justify them. Keep all eight requested systems in the optional catalog; require depth on a representative subset.

Speaking flow and phrase prompts:

| Stage | Phrase |
| --- | --- |
| Requirements | “Which operations and guarantees are most important?” |
| Scale | “This estimate affects whether we need…” |
| APIs/data | “The core entities are…, and this endpoint…” |
| Architecture/request flow | “At a high level…; when a request arrives…” |
| Bottlenecks | “The likely bottleneck is…, because…” |
| Scaling | “If traffic grew tenfold, I would first…” |
| Reliability | “If this dependency fails, the system would…” |
| Tradeoffs | “This improves…, at the cost of…” |

Practice explaining an architecture from a simple diagram and adapting when the interviewer changes a constraint. No distributed-system implementation project is required.

## Machine Coding Assessment

Practical coding exists as prompts in `JavaScript/08-interview-practice.md`, four UI ideas in `03-React.md`, and the day-35 REST design task in `13-Daily-Study-Plan.md`. There is no dedicated task catalog, executable practice workspace, acceptance rubric, or timed result history.

Add a compact catalog with task, time limit, requirements, edge cases, acceptance checks, discussion questions, and result link. Suggested initial six tasks:

1. Debounced search with loading/error/empty states and out-of-order response handling.
2. Paginated/filterable table with reusable accessible controls.
3. API with validation, error handling, filtering/pagination, and authorization.
4. Database-backed order update with a concurrent-request scenario.
5. Cached API plus queued notification, demonstrating invalidation and duplicate work handling.
6. Debug a broken UI/API and show a measured performance improvement.

Use 45–90-minute slices; larger exercises can span sessions. Practice data transformations and JS polyfills in smaller slices. Require working behavior, meaningful tests/manual cases, and an English walkthrough of choices and limitations. Reuse a small workspace rather than creating six polished products.

## Behavioral Assessment

`12-Behavioral.md` has eight valuable prompts and STAR guidance; `09-HR-Interview.md` has standard screening questions. No filled stories or practice evidence exist. Leadership, production incidents, deadline negotiation, optimization, and cross-team communication should be made explicit without inventing management experience.

Build 8–10 reusable real stories, not one memorized paragraph per possible question. Tag stories for ownership, disagreement, failure, ambiguity, incidents, performance, deadlines, feedback, and leadership. Be clear about your own actions versus team actions. Practice 90–120-second versions and follow-ups, using bullet cues first and then no notes.

## Resume / Project Story Assessment

`10-Projects.md` already asks good deep-dive questions, but its template is empty and narrower than its checklist. `11-Resume-Notes.md` gives a bullet formula but there is no resume or verified claim inventory. Expand the existing project guide rather than creating a disconnected duplicate project folder.

Recommended `PROJECT_STORIES.md` record:

```markdown
### Story/project ID and neutral title
- Related resume claim / interview prompts:
- Context and constraints:
- Problem and impact:
- My responsibility and exact contribution:
- Investigation: evidence, hypotheses, root cause:
- Decision: alternatives, tradeoffs, why chosen:
- Implementation: request flow, data model, tests:
- Result: measured evidence, or honest qualitative result:
- Failure/limitation and lesson:
- 30-second summary: 2–3 bullets
- 2-minute explanation: context, action, result bullets
- 5-minute deep dive: architecture, decision, failure, scaling bullets
- Follow-ups: database, auth/security, deployment, 10x traffic, redesign
- Last spoken attempt: without notes? weak point? next review?
```

Use work involving migrations, API design, race conditions, roles/permissions, scheduled jobs, caches, CI/CD, frontend architecture, database performance, deployment problems, and cross-team decisions where you actually participated. Capture one small work observation weekly and develop it into a story when useful.

Sanitize company/customer names, identifiers, endpoints, logs, code, credentials, business-sensitive scale and architecture details. Use neutral labels and permitted approximate figures; do not invent precise impact or claim confidential implementation as public work. Recording references stay local/private.

Self-introduction: store bullet variants in `english/INTERVIEW_ANSWER_BANK.md`: 30 seconds for current work, strongest skills, target role; 60 seconds adds one feature/system and strength; 90 seconds adds relevant experience/impact and motivation. Experience duration and personal claims must come from you. Practice natural retellings rather than writing a script.

## Daily Workflow Assessment

The existing dashboard/CLI makes DSA startup quick. It does not answer a complete daily plan containing technical focus, revision, speaking, weak points, and carry-forward. Add a small `TODAY.md` working card while keeping `npm run dev`/`npm run today` as entry points.

Proposed template, not an additional file created in this audit:

```markdown
# Today — YYYY-MM-DD
Learning week / phase:
Available time / mode: minimum | standard | extended
Weekly focus:

## Start here
1. Due revision: one item/link (or none)
2. Main task: DSA OR practical/technical task, with link and stop condition
3. Speaking question: tied to that task or a due explanation

## Targets
- [ ] DSA: problem/pattern + success criterion (when selected)
- [ ] Core topic / backend / design / build: one concrete output
- [ ] Revision: one due problem or retrieval question

## English / Communication — 15–30 minutes
Question / framework:
- [ ] First attempt aloud without notes
- [ ] Check reference; identify one technical and one speaking gap
- [ ] Second attempt; answer a follow-up
Could explain without notes: Yes / Partially / No
Words/phrase struggled with:
Communication weakness / next due date:

## Close — 2 minutes
Completed / result links:
Attempt outcome: independent | hinted | studied solution | failed
Time spent: approximate minutes
Confidence: 1–5
Tomorrow's first step / carry-forward: maximum one main item
```

Backend/system design belong inside the selected main focus rather than mandatory additional tracks every day. A technical reading block should produce a tiny implementation, retrieval answer, diagram, or debugging explanation.

Startup target: open the same entry point, choose available time, and follow the preselected first task within two minutes. Weekly review selects the backlog; daily startup should not require browsing a 650-line calendar.

Resilient time modes:

- **Minimum, 20–30 minutes:** 5–10 minutes of retrieval/one edge case plus 15 minutes speaking. An actual emergency/rest day may be skipped with no penalty.
- **Standard, 90 minutes:** 35 minutes main task, 15 revision, 20 core/practical work, 15 speaking, 5 setup/logging. Use a practical task in the main block on designated build days.
- **Standard, 120 minutes:** 45 minutes main task, 15 revision, 35 technical/build work, 20 speaking, 5 setup/logging.
- **Extended, 150 minutes:** add a 30-minute exercise/deep dive to the 120-minute mode.
- **Weekend, 3–5 hours when available:** build/mock plus review and breaks; speaking inside mock time counts. Keep one flexible block instead of promising two long weekend sessions every week.

Never make up missed days by doubling tasks. Retain the current learning phase, carry one essential item, and reduce new work when revision or office demands increase.

## Progress Tracking Assessment

`.progress/log.json` records only successful date/problem events. `scripts/progress.js` displays checklist totals and streaks. It cannot tell whether a problem required hints, failed later, or was explainable. The supplied log start date is 2026-09-07, while all eight existing events are in August; preserve history and distinguish program start from earlier practice.

Use one compact event store, extending the existing JSON rather than adding a separate database or spreadsheet. Existing events migrate as `legacy`, with independence, duration, and explanation unknown; do not manufacture those facts. Keep `01-DSA-Questions.md` as a compatible completion view. `PROGRESS.md` should summarize/reference canonical records, not require another manual copy of all scores.

Recommended DSA metadata and attempt fields:

| Static per problem | Per attempt | Derived summary |
| --- | --- | --- |
| Stable path, pattern, verified difficulty or unknown, priority | Date, kind (first/review/mock), outcome, minutes, hint used, one mistake/insight, confidence, explanation yes/partial/no | First attempt, latest result, last independent solve, due date, spaced-review stage |

`hint used` can be derived from the outcome unless more detail is needed. Keep mistake/insight to one sentence. A first independent solve after previously reading a solution is not equivalent to an unseen solve; retain both events. Same-day speaking reattempts do not count as independent delayed DSA reviews.

Weekly summary should show:

- Current learning week/phase and primary focus; elapsed time separately.
- Unique problems with an independent successful solve; attempted problems; attempt counts by independent/hinted/studied/failed; legacy records separately.
- DSA pattern status based on recent retrieval/transfer, not percentage of folder files.
- Technical tracks: not started / practicing / demonstrated / revision due, with a result link and explanation outcome.
- System designs, behavioral stories, project deep dives, mocks completed and next due.
- Revision due, top three technical weaknesses, top two speaking weaknesses.
- Approximate weekly hours, active study days, and notes-free speaking success rate over a recent window.

Keep daily entry under two minutes and weekly review under 20–30 minutes. Track broader study activity so speaking/build-only days count; de-emphasize streak resets.

English metrics: daily record only notes-free outcome, confidence, and one obstacle. Twice weekly recordings and weekly mocks use clarity, structure, technical accuracy, fluency, confidence (1–5), filler level low/medium/high, and needed notes yes/no. Anchor 1 as unable to convey the main idea, 3 as understandable with gaps, and 5 as clear, accurate, structured and responsive to follow-ups. Confidence is self-report and must not override observable accuracy/clarity.

## Revision System Assessment

The current review command balances repetition counts among checked problems; it is not spaced repetition. It may pick a recently solved easy problem, cannot select failed unchecked attempts, and does not prioritize forgetting or English difficulty. `scripts/done.js` de-duplicates the same problem/date, so repeat counts represent logged solve-days rather than every attempt. `scripts/lib/progress.js` uses UTC dates, which can assign early-morning India practice to the previous local date.

Recommended bounded revision:

1. After first learning or failure, schedule a next-day independent attempt or question retrieval.
2. After successful retrieval, expand approximate intervals to 3, 7, 14, and 30 days. Treat these as adaptive intervals from actual review, not five compulsory calendar appointments for every problem.
3. A hinted/failed/unclear explanation returns soon (roughly 1–3 days); successful easy recall can skip an early stage.
4. Prioritize weak P0 items, then overdue items, then mixed transfer. Include unchecked attempts and spoken questions.
5. Cap normal revision at 15–25 minutes/day: one coding review or two/three brief question answers. Defer remaining due work without treating it as debt to repay tomorrow.
6. If overload persists for a week, reduce new problems, remove low-priority review obligations, and adjust focus. Do not grow a permanent overdue backlog.

Do not add separate Revision 1/2/3 manual columns when dated attempts and the current interval stage provide the same information.

Active recall structures:

- `revision/QUESTIONS.md`: ID, track/topic, question, expected key points under a hidden answer, source link, likely follow-up. Seed from existing chapter checks and JS Core cards.
- `revision/FLASHCARDS.md`: initially a short index/filter view of those same questions, not copied answers. Add standalone atomic cards only when repeatedly forgotten facts justify them; creating this file is optional.
- `WEAK_AREAS.md`: item/question ID, technical versus communication gap (or both), evidence, next action, due date, exit criterion. Resolve a weakness after two separated successful retrievals or a successful transfer plus explanation.

Example questions to seed: why indexes can slow writes; Node nextTick/promise/setImmediate ordering with an explicit runtime/module context; when Redis produces stale data; when React memoization does not avoid rendering; and the lifecycle of an HTTP request in a Node API. Answer aloud before revealing reference bullets.

## Mock Interview Assessment

`Mock-Interviews/README.md` already rotates six round types and records feedback. No actual mock records exist. Its generic score out of ten does not distinguish reasoning, correctness, time management, and English explanation.

Recommended cadence across the architecture:

| Stage | Technical simulation | Communication session |
| --- | --- | --- |
| Foundation | Weekly 15–25-minute timed problem slice; brief concept explanations | Weekly 30-minute speaking mock; solo/peer acceptable |
| Core patterns | One 45-minute technical mock/week, alternating DSA and JS/React/backend | One 30–45-minute speaking mock/week; may be a combined longer session |
| Applied/design | One round/week rotating design, machine coding, backend/SQL and DSA | Weekly communication mock plus two short recordings |
| Simulation | Two rounds/week; one full loop every 2–3 weeks replacing other rounds | Communication rubric applied to every round |
| Revision/applications | One or two rounds/week depending on live interviews; real rounds replace practice | Target failed explanations and maintain one speaking-focused session |

Weekly 35-minute communication mock: introduction 2 minutes; project and follow-up 7; five technical questions 10; debugging 6; behavioral 5; feedback 5. Shorten to 30 or extend to 45 as needed. Log “knew it but could not explain” separately from knowledge errors.

Every mock ends with at most three repair items. Any explanation marked partial/no becomes a linked speaking revision, normally within 1–3 days; repeat with a follow-up later in the week. Once automation exists, saving that outcome should enqueue the revision automatically. A mock replaces that day's main study block, not an extra obligation.

## Recommended 4–6 Month Architecture

Use a **20-week baseline**, with the following flexible allocations. This is phase architecture, not a final day-by-day schedule.

| Phase | 16-week version | 20-week baseline | 24-week version | Main outputs / gate |
| --- | ---: | ---: | ---: | --- |
| 1. Baseline and foundations | 3 | 4 | 4 | Target-role evidence, JS/TS foundations, linear DSA, introduction and first real stories; explain core concepts and solve baseline tasks |
| 2. Core patterns and full-stack practice | 5 | 6 | 7 | Trees/graphs/basic DP/heaps/intervals; React/API/SQL exercises; delayed independent recall plus fresh variants |
| 3. Applied backend and system design | 3 | 4 | 5 | Transactions/caches/queues/security/deployment; progressive designs; explain decisions/failures in work stories |
| 4. Interview simulation | 3 | 4 | 4 | Timed coding, machine coding, design and behavioral rounds; repair observed weaknesses |
| 5. Revision and applications | 2 | 2 | 2 | Maintain skills, targeted company preparation, small application pipeline guided by readiness |
| Flexible buffer | 0 | 0 | 2 | Travel/incidents, delayed phase gate or weakest round; do not fill with extra topics |
| Total | 16 | 20 | 24 | Speaking and revision run through every phase |

The 16-week path assumes the baseline demonstrates existing strength; it removes optional scope rather than increasing daily intensity. The 24-week path adds consolidation and buffer. Phase gates may move calendar boundaries; entering system design does not end DSA/JS practice.

Your stated availability is approximately 13.5–22.5 hours/week when both weekend days are available. Commit initially to roughly 11–14 planned hours, reserving the rest for office variability and recovery. Daily 15–30-minute speaking is included in that budget; mocks count as speaking/technical practice, not a second independent block to add afterward.

Sample weekly budget, adjustable rather than a schedule: 4 hours DSA including revision, 3 hours technical/practical work, 1.5 hours design/database depth, 2 hours explicit speaking/story practice, 1 hour mock, 0.5 hour review = 12 hours. Track actual elapsed time once even where a mock serves several learning goals. Early phases can shift design time into fundamentals; later phases shift new DSA time into simulations.

Begin with 4–6 new problems and several short reviews per normal week; allow 2–4 new problems during difficult DP, busy work, or simulation weeks. Practice one main full-stack focus per week plus retrieval from earlier tracks. Applications can begin when baseline gates are met, before every optional topic is studied. Replace fixed 5–12/day quotas with a small number of well-matched applications and adjust from actual response evidence.

### Weekly review proposal

`weekly-reviews/WEEKLY_REVIEW.md` should be a template copied to one dated review per week:

```markdown
# Weekly review — YYYY-MM-DD
Learning week / phase:
Available hours next week:
Completed outputs and actual time:
DSA: independent attempts / hinted / failed; weakest patterns:
Technical topics forgotten or not demonstrated:
Design / coding / project / behavioral evidence:
Mocks: round, result, top repair items:
English: notes-free answers / attempted; recurring speaking obstacle:
Questions I knew but could not explain:
Recordings: top two improvements only:
Revision due: select a bounded set:
Carry forward: maximum two essentials:
Deprioritize / stop:
Next week's main technical focus and speaking focus:
Phase gate: continue / consolidate / advance, with evidence:
First task for the next session:
```

Adaptation rules: if most new attempts need hints, reduce new scope; if technical correctness is strong but explanation is weak, replace optional new content with speaking on those same topics; if due revision exceeds budget, prune P2/P3 items; if office workload is high, choose minimum days and preserve phase position. Do not interpret a missed streak as lost readiness.

## Recommended Repository Structure

Preserve current names and folders because scripts parse paths and headings. Do not introduce parallel `ROADMAP.md` or lowercase copies of existing DSA tracks.

```text
/
  README.md                      # daily entry + goals + how the system works
  00-Roadmap.md                   # one phase/priorities/readiness authority
  01-DSA-Questions.md             # library/queue and compatible status view
  02-JavaScript.md ... 12-Behavioral.md  # retain and deepen existing guides
  13-Daily-Study-Plan.md           # reusable session/weekly policies, shorter later
  14-Job-Search-and-Negotiation.md # configurable search reference
  TODAY.md                       # one current working card
  PROGRESS.md                    # short cross-track summary/view
  WEAK_AREAS.md                   # technical and communication repair queue
  PROJECT_STORIES.md              # real, sanitized evidence and depth variants
  JavaScript/                    # preserve developed chapters
  Arrays/ ... Sorting/           # preserve all existing problem files
  TypeScript/README.md            # compact missing guide + exercises later
  english/
    README.md                    # routine, frameworks, rubrics
    TECHNICAL_PHRASES.md          # small reusable phrase collection
    INTERVIEW_ANSWER_BANK.md      # bullet cues, intro variants, follow-ups
    RECORDING_LOG.md              # dates/private references + top improvements
  revision/QUESTIONS.md           # canonical question-only/reveal references
  weekly-reviews/
    WEEKLY_REVIEW.md              # template
    YYYY-MM-DD.md                # actual weekly decisions
  machine-coding/README.md        # small task catalog and acceptance rubrics
  resources/README.md             # concise authoritative/versioned references
  Mock-Interviews/                # retain current casing and log location
  .progress/                     # existing log; minimal compatible extension
  scripts/, dashboard/, tests/   # extend existing tools incrementally
```

Do not add nine English files immediately. `english/README.md` covers daily speaking; the answer bank covers introduction and project pointers; `WEAK_AREAS.md` filters communication weaknesses; mock/recording logs hold scores. `english/DAILY_SPEAKING.md`, `english/SELF_INTRODUCTION.md`, `english/PROJECT_EXPLANATIONS.md`, `english/WEAK_ENGLISH_AREAS.md`, and a second English question bank would duplicate those responsibilities. Split only after actual use demonstrates a navigation problem.

Likewise, expand existing React/Next/backend/database/system design guides before creating a deep folder tree. Add focused exercise artifacts as needed, not empty directories for appearances.

## Automation Opportunities

The existing tools are enough to extend. Use Node built-ins and small shared helpers; prioritize study use over tool-building.

| Opportunity | Smallest change | Existing anchor / safeguard |
| --- | --- | --- |
| Unified daily selection | Shared selector for learning phase, task, due review, speaking question | `scripts/today.js`, `scripts/serve-dashboard.js`; both use same result |
| Generate current day card | Explicit option to write `TODAY.md`; default command remains read-only | Do not overwrite unfinished notes; preserve same-day edits and show carry-forward |
| Attempt capture | Small outcome/minutes/explanation inputs in CLI/dashboard | Extend `scripts/done.js` and JSON compatibly; failures must be recordable without checking completion |
| Due revision | Date/outcome-based selection with cap and priority | Replace duplicated least-rep logic in `scripts/review.js` and server |
| Speaking repair enqueue | Partial/no explanation creates a linked due item | Same event store; no separate reminder service |
| Progress summary | Cross-track aggregates and recent activity | Extend `scripts/progress.js`; never count missing legacy fields as independent successes |
| Weekly review | Create a dated skeleton from events and pending weaknesses | Explicit command, preserve existing dated review |
| Question selection | Due question first; random relevant question only if none due | Reuse JS Core question IDs; expose prompt before answer |
| Archive day | Explicit archive on close, once daily records prove useful | Optional; weekly summaries may make daily archives unnecessary |
| Lightweight consistency check | Validate queue/checklist/files, IDs, links, JSON schema | Report discrepancies read-only; never silently change learning history |

Implementation-quality findings to include in small tool PRs:

- `scripts/add-problem.mjs` appends under `## Added Problems`, not the dependency queue; such items can enter checklist totals while never being chosen by `today`. `scripts/progress.js`/server also retain the last `###` topic and can misattribute appended items. Add explicit registration or make uncategorized status visible.
- CLI without a test prints a self-certification sentence but does not collect an answer; dashboard asks for confirmation only on untested problems. Tested problems still need explanation/independence evidence.
- `scripts/lib/progress.js` uses UTC calendar dates. Support an explicit local study timezone/date and preserve historical dates without reinterpreting them.
- Server next/review logic duplicates CLI logic; progress sources can drift. Centralize decisions before adding more features.
- `scripts/serve-dashboard.js` calls `server.listen(PORT)` without a loopback host, and its solution-path check permits any existing repository `.js` path, including scripts. The local editor should bind to loopback and allow only registered practice files. This is relevant to the existing file-writing/test-running tool, not a reason to build a security platform.
- Synchronous test execution has no timeout; an accidental infinite-loop solution can block the server. Add a bounded timeout and clear failure result.
- Dashboard saves before testing/marking done without consistently checking save success; CLI/checklist/log writes are separate. Handle write errors and avoid reporting success or advancing progress after a failed save. Preserve user edits/history.
- New flashcards/snippet headers use clickable `div` elements. Use keyboard-accessible buttons/reveal controls when revisiting the UI.

Keep the dashboard optional. Do not add cloud accounts, a framework migration, authentication UI, background notifications, AI scoring, or GitHub automation merely to manage personal study.

## Interview Readiness Metrics

Assess over recent, varied attempts, including unfamiliar questions and delayed recall. These are personal gates, not hiring guarantees. Readiness requires both technical and communication evidence; total solved and streak are secondary.

| Area | Proposed measurable evidence |
| --- | --- |
| DSA | At least 7 of the latest 10 representative unseen/transfer medium attempts solved independently in roughly 25–35 minutes, with valid edges and time/space explanation; coverage across linear patterns, trees/graphs, and basic DP/greedy, rather than ten of one pattern |
| Retention | At least 80% of a bounded recent delayed-review sample succeeds without hints; explain the invariant instead of reproducing remembered code |
| JavaScript | At least 8/10 randomly selected core questions answered accurately without notes in 1–3 minutes, with an example/follow-up; implement several practical tasks under time limits |
| TypeScript | Complete three practical typing tasks and explain narrowing, generics, unions and runtime-validation limits without unsafe workarounds masking gaps |
| React | Complete two 60–90-minute UI slices with loading/error/edge handling; explain rendering, effects, state placement and a measured performance decision without notes |
| Next.js | For relevant roles, explain one application's server/client flow, rendering/cache/auth/deployment decisions and version assumptions; handle at least two follow-ups |
| Backend/database | Implement a robust API slice and explain validation, authz, errors/logging, pagination, index choice, transaction/race prevention and failure behavior; demonstrate one concurrency or query-plan exercise |
| System design | Complete three distinct 45-minute designs, including requirements, APIs/data, request flow, bottlenecks, reliability and justified tradeoffs; respond coherently to changed constraints |
| Projects/resume | Two projects explainable at 30 seconds/2 minutes/5 minutes; every substantial resume claim maps to evidence and personal contribution; handle five relevant follow-ups each |
| Behavioral | 8–10 real flexible stories; deliver six randomly selected prompts within about two minutes using STAR and handle follow-ups without scripts |
| English | In three consecutive weekly speaking mocks, at least 80% of sampled answers are clearly explainable without notes; clarity/structure/accuracy typically ≥4/5, fluency ≥3/5; listener can restate the point, example and tradeoff |
| Mocks | Recent evidence across DSA, JS/React, backend/SQL, design, machine coding and behavioral; at least three consecutive relevant rounds without a repeated blocking gap, and repair items are retested |

Use paired ratings: “technical answer sound?” and “clear English explanation without notes?”. A correct implementation with an unclear explanation requires communication revision. A fluent but technically wrong answer requires technical revision. Self-rated confidence alone cannot clear either gate.

Start selective applications once core role-relevant gates are met; optional P2/P3 coverage need not delay interviews. Set a review checkpoint instead of indefinitely postponing applications for perfect scores.

## Files That Should Be Added

Only `INTERVIEW_PREP_REPO_AUDIT.md` is added now. Future additions, in order of practical value:

| Proposed path | Purpose |
| --- | --- |
| `TODAY.md` | One daily card with task, revision and speaking loop |
| `english/README.md` | Communication routine, frameworks, rubrics and recording policy |
| `english/TECHNICAL_PHRASES.md` | Small list used inside actual technical answers |
| `english/INTERVIEW_ANSWER_BANK.md` | Bullet-only outlines, introduction variants, project pointers and follow-ups |
| `WEAK_AREAS.md` | Unified technical/speaking repair queue |
| `weekly-reviews/WEEKLY_REVIEW.md` | Template; dated records follow during actual use |
| `PROGRESS.md` | Compact cross-track view and evidence links |
| `PROJECT_STORIES.md` | Sanitized real-work stories and depth variants |
| `TypeScript/README.md` | Missing practical TS track |
| `revision/QUESTIONS.md` | Canonical retrieval questions and references |
| `english/RECORDING_LOG.md` | Lightweight sampled feedback and private recording pointers |
| `machine-coding/README.md` | Task catalog, timeboxes and acceptance rubric |
| `resources/README.md` | Small versioned source index |

Add a basic trie exercise and prefix-sum/subarray-sum exercises only after the core-set decision. Add regression test files for the two demonstrated checked-solution failures when implementing repairs. Do not create 206 test files before study begins. Optional flashcard index/day archive/helper scripts should follow demonstrated need.

## Files That Should Be Changed

| Existing path | Recommended future change |
| --- | --- |
| `README.md` | State technical + English goal, 16–24-week horizon, daily modes, speaking loop, revision/review links, readiness; document JS Core and supported Node version |
| `00-Roadmap.md` | Replace compressed eight-week assumption with phases, priorities and evidence gates; central policy authority |
| `13-Daily-Study-Plan.md` | Convert lengthy rigid calendar into reusable weekly/session policies later; remove duplicate DSA status, arbitrary application escalation and unverified salary assumptions |
| `01-DSA-Questions.md` | Distinguish core subset/library; keep stable paths; resolve checked evidence via review; add targeted gaps and speaking criterion |
| `Arrays/product-of-array-except-self.js` | Revisit incomplete implementation; add meaningful checks and genuine notes |
| `Two-Pointers/valid-palindrome.js` | Repair boundary failure with regression cases; record learning |
| `HashMap/README.md`, `Heap/README.md`, `Queue/README.md`, `Greedy/README.md` | Correct invalid template/overgeneralized algorithm guidance |
| Checked solution files in `HashMap/` and `Two-Pointers/` | Fill approach/complexity/lessons through genuine reattempts, not generated mastery claims |
| `02-JavaScript.md`, `JavaScript/README.md` | Speak-before-reading flow; links to modules/memory practice and canonical retrieval questions |
| `JavaScript/05-arrays-collections-copying.md` | Small WeakSet accuracy update |
| `03-React.md`, `04-NextJS.md` | Focused explanation/debugging/build outputs, Next version references |
| `05-NodeJS.md`, `06-Express.md` | Request-flow/concurrency/cache/queue/API exercises and spoken tradeoffs |
| `07-SQL.md` | PostgreSQL schemas/plans/locking/races/pagination plus retrieval questions |
| `08-System-Design.md` | Progressive fundamentals and representative designs with discussion rubric |
| `09-HR-Interview.md`, `10-Projects.md`, `11-Resume-Notes.md`, `12-Behavioral.md` | Introduction variants, story mapping, verified claims, spoken depth and follow-ups |
| `14-Job-Search-and-Negotiation.md` | Make compensation/notice/role assumptions configurable; soften unsupported funnel and negotiation absolutes |
| `Mock-Interviews/README.md` | Phase cadence, separate technical/communication scoring, bounded repair queue |
| `.progress/log.json`, `scripts/lib/progress.js` | Compatible attempt metadata, local date handling, explicit phase/week; preserve legacy unknowns |
| `scripts/today.js`, `scripts/review.js`, `scripts/progress.js`, `scripts/done.js` | Shared daily selection, due review, attempt capture, broader activity/evidence |
| `scripts/add-problem.mjs` | Register new problems consistently in queue/topic views |
| `scripts/serve-dashboard.js`, `dashboard/index.html` | Shared selectors, safe local file scope, bounded tests, full daily card and speaking outcomes |
| `dashboard/js-core-data.js` | Fix factual drift; canonical question IDs/source links rather than a separate answer syllabus |
| `package.json` | Add only necessary helper commands and supported Node declaration in relevant tooling PRs |

## Files That Should Be Merged or Removed

**No immediate file removal is recommended.** Retain all existing solutions, scaffolds, logs, and useful notes.

- Consolidate repeated time/revision/readiness policy into `00-Roadmap.md`; keep `README.md` as entry and `13-Daily-Study-Plan.md` as daily/weekly operating guidance. Merge responsibilities without requiring deletion of either file.
- Consolidate duplicated JS explanations/questions from `dashboard/js-core-data.js` with canonical chapter/question content. Keep the file as a dashboard data/view adapter if useful.
- Retain sorting variants as optional library items; flag the overlap between `Sorting/sort-an-array.js` and implementation exercises rather than deleting personal practice.
- Do not add parallel HR/behavioral/project guides or a second complete roadmap. Link existing `09`–`12` files to answer/story records.
- Do not add standalone English daily/intro/weakness/project/question files when the four proposed English files plus shared records already cover them.

If old calendar text is shortened later, preserve historical material through Git or an explicitly named reference archive. Do not treat archival migration as a prerequisite for starting daily practice.

## Proposed Implementation Phases

Each PR should be independently reviewable and leave the daily workflow usable. Scope below is a proposal, not authorization to implement it during this audit.

### PR 1

**Make speaking part of today's work.** Add `TODAY.md`, `english/README.md`, a small phrases file and bullet-only answer bank. Add minimal README links. Include 15-minute routine, all explanation frameworks, intro variants and notes-free outcome. Validate by walking through one existing JS question and one DSA explanation in under the time budget. No data migration or roadmap rewrite.

### PR 2

**Repair proven correctness and teaching defects.** Revisit the checked product/palindrome solutions, add focused regression tests, correct undefined `i` in HashMap and misleading heap/queue/greedy guidance, fix the JS Core hoisting contradiction and small JS inaccuracies. Preserve user solution history; do not declare all checked problems mastered. Run existing Two Sum tests and new regression checks.

### PR 3

**Adopt realistic phases and weekly adjustment.** Update `00-Roadmap.md`, shorten/align the policies in `13-Daily-Study-Plan.md`, revise README load expectations, add weekly-review template and `WEAK_AREAS.md`. English appears in phase gates and adaptation rules. Validate time arithmetic, links and a missed-week scenario. Do not yet replace selection scripts.

### PR 4

**Record attempts and explanations honestly.** Extend progress schema and CLI capture; retain eight legacy entries as unknown-evidence history. Add a compact cross-track view. Define independent/hinted/studied/failed outcomes and local study dates. Test legacy loading, failed attempts, separate reviews, invalid data and write errors. Keep checklist compatibility.

### PR 5

**Select due revision and a unified daily plan.** Share selectors across CLI/server; select current-phase work and bounded due technical/speaking revision; support optional non-destructive `TODAY.md` generation. Fix newly added problem registration. Test missed days, deferred challenge items, due failed attempts, partial speaking, exhausted queues and preservation of unfinished notes.

### PR 6

**Make the local dashboard reflect the same daily system.** Add task/revision/speaking fields from shared data, outcome capture and recent activity; constrain writes to registered practice files, bind to loopback, add test timeout/save failure handling and accessible reveal controls. Preserve Problems/JS Core tabs and inline editing. Validate CLI/dashboard agreement and editor preservation using the browser workflow at implementation time.

### PR 7

**Curate the DSA core set and close small pattern gaps.** Label representative P0/P1 problems; retain all optional files; add minimal prefix-sum/fixed-window/trie exercises if absent. Define contracts for selected class/node problems. Add transfer and think-aloud checks. Validate queue/checklist/file consistency and a first-pass path that does not force every warm-up.

### PR 8

**Add practical TypeScript and canonical recall questions.** Add a compact TS guide and a few typing tasks; seed `revision/QUESTIONS.md` from existing JS checks/cards; add modules/memory practice. Ensure dashboard questions link to canonical notes and encourage speaking before reveal. Validate TS tasks in the chosen version and avoid duplicated answer scripts.

### PR 9

**Develop frontend practice.** Expand `03-React.md` and `04-NextJS.md` around rendering, effects, architecture, versioned caching/auth/deployment; add two small machine-coding specs. Each includes an English walkthrough and follow-ups. Validate acceptance cases and source/version references; retain existing useful exercise ideas.

### PR 10

**Develop backend and database practice.** Expand Node/Express/SQL guides with request flow, concurrency, transactions/locks, pagination, caching and queues. Add a small schema and two focused exercise specs. Require explanation of failures/tradeoffs. Validate query/API/race scenarios in the eventual practice workspace.

### PR 11

**Develop system design through reusable components.** Extend `08-System-Design.md` with learning progression and first two design briefs/rubrics; list later requested systems as variants. Reuse backend/cache/database work and English design structure. Validate two timed 45-minute discussions before adding more write-ups.

### PR 12

**Turn experience into stories and calibrated mocks.** Add `PROJECT_STORIES.md` and recording log, connect `09`–`12`, improve `Mock-Interviews/README.md`, and define measurable technical/English gates. Keep personal story entries blank until supplied; no invented resume facts. Validate a weekly communication mock, anonymization checklist and revision handoff.

### PR 13

**Align resources and application preparation with evidence.** Add a small versioned resource index; update `14-Job-Search-and-Negotiation.md` and remaining search references to remove unverified personal assumptions and rigid outcome promises. Do a final README consistency pass. Validate that the full daily/weekly cycle stays below maintenance limits. Archive helpers or additional designs remain optional follow-ups driven by actual use.

## Final Recommendations

Keep the existing repository and its useful operating tools. The improvement is a smaller selected workload, better evidence, and English explanation practice embedded into every task.

Prioritize: one clear daily card; 15–30 minutes speaking from the day's actual subject; honest attempt outcomes; bounded due revision; one weekly communication mock and review; practical outputs and sanitized project stories. Correct misleading completed statuses and teaching defects before trusting progress summaries.

Use twenty weeks as the default planning horizon and sixteen to twenty-four as an adaptive range. Reserve capacity for your job. Do not require all 206 problems, all eight designs, perfect grammar, or every optional framework topic before interviewing.

Success means you can solve and explain: what you know, what you built, why you chose an approach, how a request or algorithm works, how you diagnose failures, and what tradeoffs remain. The repository should make that evidence visible every week. Implement through the small PR sequence above; no existing content has been rewritten, moved, or deleted in this audit.

# PR 5 — Adaptive Roadmap & Weekly Review

## Goal

Add explicit learning position, adaptive weekly focus and saved weekly reviews to
PR 4's evidence model. The existing dashboard remains the primary interface.
No curriculum expansion or PR 6 work is included.

PR 5 changes relative to the initial working tree (21 files):

| Area | Files |
| --- | --- |
| Policy / entry points | `00-Roadmap.md`, `13-Daily-Study-Plan.md`, `14-Job-Search-and-Negotiation.md`, `README.md` |
| Dashboard | `dashboard/app.js`, `dashboard/index.html`, `dashboard/styles.css` |
| Shared state / sources | `scripts/lib/planning.js` (new), `scripts/lib/study-summary.js` (new), `scripts/lib/study-state.js`, `scripts/lib/progress.js`, `scripts/lib/content.js` |
| Server / CLI | `scripts/serve-dashboard.js`, `scripts/today.js`, `scripts/review.js`, `scripts/progress.js` |
| Tests | `tests/progress/planning.test.js` (new), `tests/dashboard/planning.test.js` (new), `tests/fixtures/planning-workspace.js` (new) |
| Preserved reference / report | `archive/LEGACY_16_WEEK_STUDY_PLAN.md` (new), `PR5_ADAPTIVE_ROADMAP_WEEKLY_REVIEW_REPORT.md` (new) |

## Previous Planning Model

PR 4 had safe completion/attempt history, separate coding/speaking review dates,
weaknesses and temporary Today notes. Phase/week were explicitly unconfigured.
Weekly Review was a placeholder. Written guidance still mixed an eight-week
technical roadmap with a rigid sixteen-week study/job-search calendar, quotas
and unverified personal assumptions.

The working tree already contained uncommitted PR 4 changes. A before-state
snapshot was taken; changes in this report are relative to that snapshot,
not an assertion that the entire current Git diff belongs to PR 5.

## New Planning State

Root progress schema remains **v2**. Optional planning has its own **v1**:

```json
{
  "version": 2,
  "startDate": "existing value preserved",
  "studyTimezone": "Asia/Kolkata",
  "entries": [],
  "events": [],
  "planning": {
    "version": 1,
    "phaseId": "phase-1",
    "learningWeek": 1,
    "phaseStartedWeek": 1,
    "weekStartedOn": "2026-10-03",
    "availableHours": 12,
    "weeklyFocus": {
      "technical": "JavaScript foundations",
      "dsa": "Arrays + HashMap",
      "speaking": "Start with a definition before implementation details",
      "practical": "One small JavaScript exercise",
      "mock": "Short communication practice"
    },
    "carryForward": [],
    "status": "initialized",
    "lastReviewId": null,
    "busyWeek": false,
    "firstTask": "",
    "revision": 0
  },
  "weeklyReviews": []
}
```

This is an illustrative shape, **not the actual repository history**. Actual
`entries` retain eight records; actual `events` remain empty. Setup is left for
the user. `phaseStartedWeek` supports phase position without deriving elapsed
learning time from dates. `revision` detects stale tabs.

## 16–24 Week Architecture

Twenty weeks is the baseline. Demonstrated existing strength permits earlier
intentional phase advance toward a sixteen-week path; consolidation and buffers
extend toward twenty-four calendar weeks. These are flexible planning ranges,
not automatically generated calendars, enforced deadlines or offer guarantees.
There is no separate compressed-path curriculum or twenty-step setup form.

## 20-Week Baseline

| Phase | Baseline duration | Reference positions |
| --- | --- | --- |
| Baseline & Foundations | 4 weeks | 1–4 |
| Core Patterns & Full-Stack Practice | 6 weeks | 5–10 |
| Applied Backend & System Design | 4 weeks | 11–14 |
| Interview Simulation | 4 weeks | 15–18 |
| Revision & Applications | 2 weeks | 19–20 |

## Phase Definitions

`00-Roadmap.md` is the canonical human policy. `PHASES` in
`scripts/lib/planning.js` provides executable metadata: names, baseline duration,
purpose, technical outputs, DSA/communication/practical/mock focus, defaults
and exit bullets. The dashboard reads this shared metadata through its API.
Tests check names and the 4/6/4/4/2 duration table against the policy.

Phase defaults identify a starting focus rather than prescribing all weeks.
For example, Phase 3 starts with Node.js API reliability; future weekly decisions
can choose SQL/design using existing guides. No TypeScript track is fabricated.

## Phase Exit Evidence

Phase 1: foundations explained, linear-pattern independence, delayed recall and
an honest introduction. Phase 2: core-pattern recall and React/API/SQL practical
examples explained. Phase 3: backend/database/design decisions, request flow and
project deep dives. Phase 4: repeated timed rounds and repaired blockers. Phase 5:
sustained revision, verified resume claims and readiness-based applications.

The dashboard shows these bullets plus recent evidence warnings. Missing/recently
weak DSA, delayed recall, explanations, practical work in Phases 2–4 and recorded
DSA mocks in Phase 4 are surfaced. Warnings are partial evidence, not proof that
all phase goals are complete. Manual advance requires explicit acknowledgement
when warnings exist. Required decision fields must be valid before saving.

## Planning Initialization

A missing plan remains missing on reads, irrespective of `startDate` or old
completion dates. Today offers Phase 1 / Week 1 by default or manual phase/week
and available hours. Selecting a manual phase suggests its baseline starting
position, but the user can deliberately change it. Setup persists only on Save.
A second setup is refused; subsequent focus/phase changes use Weekly Review.

## Learning Week Advancement

- Continue increments learning week and stays in the same phase, including
  beyond a baseline duration. There is no automatic phase boundary transition.
- Consolidate keeps phase/week, reduces new scope and opens a fresh evidence window.
- Advance increments learning week and enters the next phase; phase position
  restarts at one. In the final phase choose Continue or Consolidate.

Fourteen elapsed days do not alter the stored week. Seven days only recommend
review. Review is not tied to a weekday. Study dates use PR 4's configured
study timezone, default Asia/Kolkata; old dates remain unchanged.

## Weekly Focus

Persistent technical, DSA, speaking and optional practical/mock fields replace
the temporary Today weekly-focus input. One primary technical focus is the anchor.
Topic matching is deliberately simple: normalized existing topic names separated
by `+`, commas, slash or “and”. The DSA input offers existing pattern names.
Free-text focus is allowed; unmatched text uses a transparent fallback rather
than pretending it was understood.

## Weekly Review Workflow

This Week shows phase/week/focus/capacity, recorded time and review timing.
What Happened automatically provides DSA outcomes, DSA reviews, notes-free
explanations, approximate minutes/unknown time, successful recorded outputs,
practical attempts, recorded DSA mocks, recurring gaps, weak items and overdue
channels. Successful outputs are event observations, not certified artifacts.

The user supplies only decisions: next hours/capacity, at most two carry items,
what to stop, next focus, Continue/Consolidate/Advance, optional short reflection
and the first next-session task. Advance preloads the next phase's defaults in
the UI; they remain editable. Evidence refresh preserves unsaved review decisions.

## Weekly Review Storage

Structured `weeklyReviews` in `.progress/log.json` are canonical. No second
Markdown review tracker is created. Each record stores UUID, local review date,
timestamp, source phase/week/focus/hours, generated summary snapshot, warning
snapshot, normalized decisions and resulting state. `planning` is the active
state; historical `to` snapshots are immutable records, not editable alternatives.

A review records the event count at save. The next window uses the append-only
cursor plus local dates, so same-millisecond new saves are retained and previous
review-window evidence is not counted twice. History displays the latest eight
reviews but retains all records in JSON.

## Carry-Forward Rules

At most one essential and one small secondary item; role duplication or more
than two items is rejected. Saving replaces the old list instead of appending.
The essential item leads Today. Exact registered problem paths or topic IDs/paths
entered in the UI can link to their existing workspace; free-text items remain
manual tasks. Carry-forward is not a completion event. Finished items must be
intentionally dropped/replaced at review; the tool does not guess completion.

## Busy Week Behavior

Hours are approximate (validated 1–40). Busy mode, eight hours or less, or
consolidation reduces scope. Suggestion ceilings are four new unique problems
at 12+ hours, three at 9–11, at most two in reduced mode, and zero at six hours
or less/consolidation. In reduced mode Today leads with revision/weak retrieval;
optional new work remains accessible in DSA. Ceilings are not mandatory quotas.
Missed weeks never increase the budget or duplicate carry-forward. No hourly
calendar or streak-based advancement is introduced.

## Adaptive Recommendations

Factual suggestions use the latest up to six DSA attempts, up to five recent
explanations, current overdue channels, weekly recorded minutes/capacity and
repeated exact normalized communication-gap text. They recommend reducing new
scope, reusing topics for speaking, reviewing or considering advance.
Counts are displayed and traceable; missing time is explicitly unknown. They
never change the phase automatically or claim causal insight from small samples.

## English Weekly Review

Shows Yes/Partial/No evidence, recurring communication gaps and the next speaking
focus. “Technically successful but explanation partial/no” counts only paired
independent/hinted events; it is a proxy, not proof of private understanding.
Unpaired speaking attempts are not assigned technical correctness. Phrase/structure
issues are surfaced when recorded as repeated communication gaps. No grammar
lessons or automatic speech grading are added.

## Today Integration

Displays explicit phase/week, technical/DSA/speaking focus, carry-forward and the
next session step. Main task priority: essential carry; in normal mode an
unfinished focused DSA item or matching technical guide; otherwise due revision,
weak retrieval and existing queue fallback. Reduced mode/new-problem ceiling
prioritizes due/weak retrieval. Every main selection has a reason.

Revision remains independently visible and bounded, including when a focus task
is main. Due speaking can take priority over same-topic new speaking. Problem,
topic and JS speaking tasks have usable actions. The action cards precede longer
mode/capacity guidance. Daily scratch fields remain temporary; Today does not
depend on a static Markdown card.

## Progress Integration

Adds phase/week/focus, recorded hours versus available capacity, last review,
recommended review date and phase status. Existing completion, attempt evidence,
weaknesses, revision and notes-free observations remain distinct. No readiness
score is introduced; confidence and checkboxes still cannot prove readiness.

## Roadmap Changes

Replaced compressed eight-week assumptions in `00-Roadmap.md` with the adaptive
five-phase policy, exit evidence, explicit advancement, English P0, capacity,
carry-forward, busy-day behavior and readiness principles. No daily calendar or
technical lessons were added.

## Daily Study Plan Changes

`13-Daily-Study-Plan.md` is now reusable operating guidance: minimum, 90/120/150
minutes, weekend, mock/revision/review days and no-cramming rules. Preserved the
entire previous calendar in `archive/LEGACY_16_WEEK_STUDY_PLAN.md`, clearly labeled
historical/superseded. Only relative link destinations changed for its location.
Verified the archived original body matches the before-state after undoing that
link adjustment. Historical checkboxes are not current evidence.

## Job Search File Changes

Removed unverified personal salary figures/multipliers, notice assumptions,
Week 9/Day 63 gates, quotas, guaranteed funnel diagnoses and absolute negotiation
rules. Retained the blank manual pipeline table, referral cues, offer comparison
and practical discussion guidance. Application timing follows demonstrated
technical/English readiness. No compensation target or application tracker was built.

## CLI Compatibility

`npm run today`, `npm run review`, `npm run progress` work through shared study
state and show phase/week/focus when initialized, otherwise explicit unconfigured
state. Fixture CLI/API comparison tests verify agreement. `npm run done`, problem
tests and scaffolding remain unchanged by PR 5. Daily operation needs only dev.

## API Changes

| Route | Purpose |
| --- | --- |
| GET `/api/planning` | Explicit state, phases, evidence summary, suggestions, guards/history |
| POST `/api/planning` | One-time explicit setup |
| GET `/api/weekly-review` | Same generated weekly planning view |
| POST `/api/weekly-reviews` | Validated decisions, atomic review/state save |
| Existing data/today/review/progress routes | Include the shared planning context |

JSON-only mutation, local host/origin checks, field allowlists, enum/number/text
validation and registered carry IDs apply. Text fields are one line up to 240
characters. Reviews use UUID acknowledgement retries and optimistic revisions;
stale tabs/conflicting UUID reuse return errors rather than double-advance.
Explicit advance warnings return 409 with `needsConfirmation` and warning text.

Writes reuse PR 4's lock and fsynced temporary-file/rename strategy. A failed
write cannot advance state or report success. Progress loading validates planning
and history references; generic saves cannot discard prior weekly reviews.
No dependencies, database or unrestricted filesystem endpoint was introduced.

## Backward Compatibility

All **eight legacy completion records**, old date strings and `startDate` are
preserved. The actual repository contains **zero evidence events**; none was
fabricated. Tests additionally preserve real PR 4-shaped events byte-for-value
through setup, review and later attempts. Actual `.progress/log.json` and the
completion checklist remained byte-for-byte unchanged during implementation.
First user setup writes the additive v2 planning extension; reads do not migrate
on disk. Subsequent PR 4 attempt/completion writes preserve planning/reviews.

## Tests Added

- `tests/progress/planning.test.js`: 44 planning tests, including legacy reads,
  default/manual setup, validation, no calendar progression, all decisions,
  guards, generated snapshots, bounded carry, reduced capacity, focus/carry/due
  selection, suggestions, idempotency/stale tabs, cursor windows, workload ceilings,
  history preservation, malformed state and injected atomic-write failures.
- `tests/dashboard/planning.test.js`: 14 API/CLI tests, including reload/restart,
  current state, generated summary, persistence, consolidation/advance, carry,
  malformed/cross-origin requests, retry safety and save-failure behavior.
- `tests/fixtures/planning-workspace.js`: isolated repository workspace helper.

## Full Test Results

**157 tests passed**: 86 progress/evidence/planning, 46 dashboard/API and 25
existing DSA cases (6 Two Sum, 8 Product Except Self, 11 Valid Palindrome).
The prior 99 tests remain passing; 58 PR 5 tests were added. No skipped tests.
Commands: `node --test --test-reporter=spec tests/progress/*.test.js tests/dashboard/*.test.js`
and the three existing `npm test Folder/problem-file` runs. Also checked JS syntax,
`git diff --check` and canonical local links/anchors through existing tests.

`DASHBOARD_NO_OPEN=1 PORT=0 npm run dev` started successfully on loopback;
GET `/api/data` returned the actual 206-problem/eight-record/uninitialized state.
Default port 4173 was already occupied by a pre-existing process, which was not
stopped. The verification server was stopped after checking.

## Browser Validation

Installed headless Chrome used isolated temporary data because the in-app browser
execution tool was unavailable. Exercised setup, saved JS evidence, auto summary,
consolidation, carry, reload, Today/Progress updates, fourteen-day review reminder,
manual advance warnings/confirmation, topic actions, draft preservation,
simulated failed review write and successful retry/continue. Desktop/mobile
screenshots checked for overflow; no unexpected runtime/CSP errors.
The earlier PR 4 browser flow also passed: editors/drafts, tests, separate
completion, English/JS/Topics saves, due revision, error UI and eight frameworks.
Browser test data was discarded; real history was not used for fabricated attempts.
Screenshots: [Today](/tmp/interview-pr5-today.png), [Weekly Review](/tmp/interview-pr5-weekly.png), [Mobile](/tmp/interview-pr5-mobile.png).

## What Was Intentionally Not Implemented

No curriculum expansion, final DSA core curation, transfer-problem logic,
per-pattern readiness scoring, application tracking, AI recommendations,
recording/speech analysis, notifications, auth/accounts/cloud sync, company
calendars or new framework. No full non-DSA mock history. Existing English files,
TODAY fallback, solution files and queue/checklist are preserved.

## Risks / Limitations

- Topic matching is transparent string matching, not semantic interpretation or
  prerequisite certification; unusual labels can fall back to the existing queue.
- Phase warnings are recent generic evidence checks. Track breadth, true project
  depth, TS and non-DSA mock quality still require judgment.
- Practical outcomes are self-reported under the PR 4 model; recorded time can
  be incomplete. Successful event titles are not artifact verification.
- Carry-forward is intentionally replaced manually at review, not automatically
  cleared by checklist state. Daily mode is a UI preference; weekly capacity is saved.
- Recent historical evidence/gaps can remain visible across phases. No recording
  transcript/grammar analysis or exact phrase-error detection exists.
- Phase metadata mirrors the human policy instead of parsing prose; names/durations
  are checked by tests, and future policy edits must update both intentionally.
- PR 4's JSON/lock design remains a local personal store, not Git-merge conflict
  resolution or a multiuser database. Large histories are not paginated.

## Recommended PR 6 Scope

Curate a small representative DSA core set without requiring all 206 library
problems; target proven missing patterns, add transfer-problem selection and
better per-pattern independence/delayed recall/explanation evidence. Preserve
existing library paths/history, avoid a new problem quota, and keep English
reasoning integrated. **PR 6 was not implemented.**

## Git Status at Completion

This includes the pre-existing uncommitted PR 4 files. No commit was created.

```text
 M 00-Roadmap.md
 M 13-Daily-Study-Plan.md
 M 14-Job-Search-and-Negotiation.md
 M README.md
 M dashboard/app.js
 M dashboard/index.html
 M dashboard/js-core-data.js
 M dashboard/styles.css
 M package.json
 M scripts/done.js
 M scripts/lib/content.js
 M scripts/lib/progress.js
 M scripts/progress.js
 M scripts/review.js
 M scripts/serve-dashboard.js
 M scripts/today.js
 M tests/dashboard/server.test.js
?? PR4_PROGRESS_EVIDENCE_MODEL_REPORT.md
?? PR5_ADAPTIVE_ROADMAP_WEEKLY_REVIEW_REPORT.md
?? archive/
?? scripts/lib/atomic.js
?? scripts/lib/evidence.js
?? scripts/lib/items.js
?? scripts/lib/planning.js
?? scripts/lib/revision.js
?? scripts/lib/study-state.js
?? scripts/lib/study-summary.js
?? tests/dashboard/evidence.test.js
?? tests/dashboard/planning.test.js
?? tests/fixtures/
?? tests/progress/
```

# PR 4 — Progress & Evidence Model

## Goal

Persist evidence of solving, retrieval and clear English explanation through the existing dashboard and CLI. Separate checklist completion, technical performance and communication performance. Preserve historical information and implement bounded, date-based revision without changing curriculum or implementing PR 5.

Before editing, read the full repository audit and PR 1–3 reports, the requested dashboard/progress implementation, package scripts and existing tests. The initial working tree was clean at `aed644b`. The real progress file contained eight completion records and no attempt/explanation events.

## Previous Progress Model

`.progress/log.json` contained `startDate` and `entries`, each with `date` and a problem path without `.js`. Completion was also represented by checkboxes in `01-DSA-Questions.md`.

The CLI and dashboard could record completion but could not establish independence, hint usage, time, confidence or notes-free explanation. PR 3 outcome controls were temporary. Reviews balanced historical repetition counts; they were not scheduled by date. New completion dates used UTC.

## New Progress Schema

Version 2 retains `entries` as completion-only records and adds an append-only `events` array and `studyTimezone`. There is no database, dependency, second history file or migration command. Learning phase/week are intentionally absent until PR 5.

The following shows the schema and an **illustrative new event**, not evidence of a real user attempt. The example has not been inserted into the real log:

```json
{
  "version": 2,
  "startDate": "2026-09-07",
  "studyTimezone": "Asia/Kolkata",
  "entries": [
    { "date": "2026-08-10", "problem": "HashMap/two-sum" },
    { "date": "2026-08-10", "problem": "HashMap/top-k-frequent-elements" },
    { "date": "2026-08-11", "problem": "HashMap/contains-duplicate" },
    { "date": "2026-08-11", "problem": "HashMap/valid-anagram" },
    { "date": "2026-08-11", "problem": "HashMap/group-anagrams" },
    { "date": "2026-08-12", "problem": "Two-Pointers/valid-palindrome" },
    { "date": "2026-08-12", "problem": "Two-Pointers/two-sum-ii-input-array-is-sorted" },
    { "date": "2026-08-31", "problem": "Arrays/product-of-array-except-self" }
  ],
  "events": [
    {
      "id": "bde1ee67-a07c-40cd-a791-7e05adf7625d",
      "date": "2026-10-03",
      "timestamp": "2026-10-02T19:00:00.000Z",
      "timezone": "Asia/Kolkata",
      "track": "dsa",
      "itemId": "Arrays/product-of-array-except-self.js",
      "topic": "Arrays",
      "title": "Product of Array Except Self",
      "question": "Explain the prefix/suffix product approach and its tradeoff.",
      "attemptType": "review",
      "outcome": "independent",
      "minutes": 28,
      "confidence": 3,
      "explanation": "partial",
      "technicalGap": null,
      "communicationGap": "Started with code before explaining the main idea",
      "mistakeOrInsight": "Combine products strictly before and after each position",
      "usefulPhrase": null,
      "verification": "tests_passed"
    }
  ]
}
```

Optional evidence uses `null` for unknown time/confidence/notes and `unknown` for an unrecorded explanation. Speaking events have `outcome: null`; they do not fabricate a technical solve. `verification` records tests passed, self-certification, or unknown; it does not prove independence externally. Timestamp, study date, timezone, title and topic come from the server/shared registry.

Review state is derived by replaying events, including last attempt, latest outcome, last independent date, stage, coding/technical due date and separate speaking due date. These are API views, not redundant mutable columns in JSON.

## Backward Compatibility

- Load unversioned/version-1 history and normalize it to version 2 **in memory**.
- Preserve all eight original objects, date strings, problem identifiers and `startDate` unchanged. Preserve unknown extra legacy fields as well.
- Represent legacy completion evidence as unknown outcome/explanation and unknown minutes/confidence. Do not insert invented attempts or label old completions independent.
- Write version 2 only on an explicit successful new event/completion save. Simply starting the server, reading progress, or running the read-only CLI commands does not migrate the file.
- Existing `entries` remain supported by completion counts/repetition fallback. Each new attempt is a separate event, including multiple attempts on one day.
- Reject malformed JSON, unsupported versions and invalid stored events without overwriting the original file or substituting empty history.

**Actual repository state after implementation:** the real `.progress/log.json` remains byte-for-byte unchanged, with all eight historical records. It contains no manufactured demonstration events. Migration was exercised only in temporary fixtures.

## Event Types

| Track | Supported attempt types | Current input surface |
| --- | --- | --- |
| DSA | `first_attempt`, `review`, `mock` | DSA attempt form; `done` CLI flags |
| Speaking | `technical_explanation`, `dsa_explanation`, `js_core`, `project`, `behavioral`, `system_design` | English question/framework; JS Core reveal flow |
| Technical | `retrieval`, `practical_task` | Existing Topics cards |

DSA identity is its registered repository path. All 44 existing JS Core cards have fixed explicit IDs, read by both Node and the browser from `dashboard/js-core-data.js`; question wording is unchanged. Existing guide identities use `topic:<path>`. User-entered speaking questions use `custom:<UUID>` plus the real entered question. A new speaking attempt preserves that item ID; **New question** creates a different identity. Saved question text is a snapshot, not the identifier.

## DSA Attempt Outcomes

| Outcome | Meaning | Automatic checklist change when saving an attempt |
| --- | --- | --- |
| `independent` | Working solution derived without hints/solution help beyond the statement | None |
| `hinted` | Working solution required partial guidance | None |
| `studied_solution` | Reviewed the approach/solution rather than deriving it independently | None |
| `failed` | Ended without a working solution; revisit | None |

Independent/hinted DSA saves rerun available tests. Failed tests reject a successful claim. Untested successes require explicit self-certification. Failures/studied attempts can be saved without passing tests. An independent later review remains a separate event; prior hints/study are retained.

The dashboard defaults known/checked problems to `review`, otherwise `first_attempt`; the user can choose another supported type. The CLI uses known completion/attempt history similarly. No duration, hint status or unseen-problem claim is inferred from legacy entries.

## English Explanation Evidence

`yes` means the important idea was explained clearly without notes; `partial` means notes, missing structure or unclear explanation; `no` means an inadequate explanation; `unknown` means unrecorded evidence.

Technical outcome and explanation are separate. Independent code with a partial explanation retains a speaking weakness. Failed code can coexist with a clear explanation of the attempted approach. Confidence remains a separate optional self-rating, never a readiness gate.

English and JS Core saves require only the notes-free result; confidence and one-line gaps are optional. English additionally preserves an optional useful phrase. The existing speak-before-reading loop, all eight canonical frameworks, 24 phrases and blank answer-bank templates remain intact. No English syllabus or fabricated story was added.

## Review Scheduling

Coding, technical retrieval and speaking are scheduled separately from recorded evidence:

| Evidence | Next review behavior |
| --- | --- |
| First independent/clear explanation | About 1 day |
| Failed or studied solution | Reset to about 1 day |
| Hinted | Reset to about 2 days |
| Partial/no explanation or meaningful gap | About 1 day |
| Clean success on/after the due date, on a later study date | Advance through 1 → 3 → 7 → 14 → 30 days |
| Same-day/early retry | Keep the existing interval; do not manufacture delayed retrieval |
| Clean delayed success after an established 30-day interval | Consolidated; optional maintenance instead of perpetual compulsory reviews |

A meaningful gap pulls the relevant channel forward. Weakness clears only after two separate clean delayed successes, not one same-day Yes. Failure or a new gap reactivates consolidated items.

Due ranking uses existing non-challenge queue items as provisional **core**, then overdue channels, unclear speaking and weak items. This is not a new P0/core-set curation. One coding review is selected if any coding review is due; otherwise select at most three short retrieval/speaking items. Today can use a related due speaking question inside its normal speaking block. Deferred counts are informational, not a catch-up obligation.

Legacy completions acquire **no invented due dates**. When no evidence-based revision is due, an optional deterministic least-recorded historical retrieval is shown, labeled unknown/not overdue. The existing queue ordering and challenge behavior are preserved.

## Timezone Handling

`studyTimezone()` centralizes the choice: `STUDY_TIMEZONE` environment override → stored timezone → `Asia/Kolkata`. Invalid IANA timezones fail explicitly.

`todayISO()` uses `Intl.DateTimeFormat` calendar parts in that timezone. At `2026-10-02T19:00:00Z` (12:30 AM India), new study evidence is dated `2026-10-03`. Timestamp remains the real UTC instant. Interval arithmetic adds calendar days to the stored study date. CLI, dashboard, completion and activity streak use the same calendar handling.

Existing historical dates are never shifted or relabeled. A timezone change applies to new saves and is stored then; it does not rewrite prior events.

## Completion vs Evidence

**Dashboard:** Save attempt only appends evidence. Mark Complete remains separate, reruns available tests or requires untested self-certification, updates the existing checkbox and retains same-day completion deduplication. When linked to a saved event, completion accepts only the matching registered DSA independent/hinted event with known verification; failed/studied events cannot satisfy it. Hinted completion is still distinguishable from independence in evidence.

The completion-only legacy route remains usable without an event and makes no independence/explanation claim. Checked historical items are not silently unchecked. A failed reattempt of an already-checked problem adds weakness evidence without deleting prior completion.

**CLI:** Plain `done` preserves validated completion-only behavior. With `--outcome independent|hinted`, it records validated evidence and explicitly completes the problem; with `failed|studied_solution`, it records evidence only. Evidence and completion remain separate saves: an acknowledged attempt can remain saved if a subsequent completion action fails.

## Weakness Derivation

Weakness is derived per item/channel from failed/studied attempts, hints, partial/no explanation, relevant short gaps and failed delayed reviews. Repeated attempts/gaps remain in history. Recurring gap counts ignore case/outer whitespace and ignore `none`/`no gap`/`n/a`; no semantic/AI interpretation is claimed.

Progress shows current weak items and overdue channels; Today shows one relevant weak point. No manually maintained `WEAK_AREAS.md` was created: the dashboard/shared API already provide the summary, avoiding a conflicting source of truth.

## Dashboard Persistence

DSA records outcome, explanation and optional confidence quickly; minutes, technical gap, communication gap and mistake/insight are under optional details. Available tests/self-certification validate successful claims. Saved outcomes are displayed after reload without prefilling them as a new successful attempt.

English and JS Core have explicit saves, stable item IDs, last-saved summaries and new-attempt actions. Topics can record retrieval/practical evidence, labeled self-reported. Saved evidence refreshes completion/evidence/weakness/revision views while preserving mounted DSA editor drafts.

Server confirmation is checked before reporting success. Validation/write errors remain visible and do not advance checklist/progress. Submission UUIDs make lost-acknowledgement retries idempotent; conflicting reuse is rejected. An identical retry returns the original event even if the working solution has since changed.

Only UI study-mode preference is kept in localStorage. Unsaved drafts, speaking checkboxes, follow-up scratch text and Today planning notes remain temporary; useful phrase and evidence gaps are saved explicitly. No recording/media storage was added.

## Today Integration

Today uses shared repository-backed state for the next existing DSA task, bounded due revision, speaking retrieval and a weak point. Normal startup still selects Today. English initializes from a due speaking item, otherwise the latest saved speaking question today, otherwise the main DSA task. Existing in-progress speaking/editor drafts are preserved during refresh.

`TODAY.md` remains an unchanged manual fallback. Phase/week remain explicitly unconfigured. No calendar-derived phase, generated daily file, automatic carry-forward or curriculum expansion was implemented.

## Revision Integration

Revision now accurately says **Due revision**. It displays actual dates/outcomes and starts the appropriate coding, topic retrieval or speaking workspace. No due evidence produces an explicit empty state and optional historical baseline retrieval. The old `/api/random-review` route remains a compatibility adapter to the shared due/baseline selection.

## Progress Dashboard

Four distinct areas:

1. **Completion:** unchanged DSA checklist totals and topic counts; completion-only history with missing evidence unknown.
2. **Evidence:** independent/hinted/studied/failed attempt counts, independent reviews, notes-free explanation counts and entered minutes/unknown time.
3. **Current weaknesses:** derived item/channel weaknesses and overdue count, with bounded daily selection.
4. **Readiness observations:** last 30 study dates' validated independent DSA attempts; notes-free results among the latest up to 10 recorded explanations; self-reported practical evidence for existing technical tracks or an explicit absence of evidence.

No score, mastery percentage, medium-problem count or unseen-transfer claim is invented. Recent activity uses readable attempt/review/explanation/completion descriptions. A last-seven-calendar-study-dates aggregate exposes outcomes, review success, explanation success, repeated gaps and recorded time as a foundation for PR 5, without implementing weekly reviews.

## CLI Compatibility

Verified `npm run today`, `npm run review` and `npm run progress` against the real read-only repository. All use `buildStudyState()`; they do not have separate scheduling/progress calculations.

Tested `done` in isolated fixtures, including failed evidence without completion, independent reviewed evidence with tests/completion, and CLI/dashboard agreement with migrated and overdue history. Existing problem test commands remain unchanged. Explicitly invoking `done` for an untested working solution continues to act as CLI self-certification; it does not infer independence when no outcome is supplied.

README documents the dashboard saves, legacy behavior, due revision, CLI flags and timezone configuration. Roadmap and study-plan pacing have not been rewritten.

## API Changes

| Endpoint | Behavior |
| --- | --- |
| `POST /api/attempts` | Validate and append a study event; return saved event; identical UUID retry returns the existing event |
| `GET /api/progress` | Shared completion/evidence/weakness/review/readiness observations |
| `GET /api/review` | Bounded due selection, deferred counts and optional unknown-evidence baseline |
| `GET /api/today` | Shared main task, revision, speaking and weak point |
| `GET /api/data` | Preserve existing dashboard data, add the shared evidence view |
| `POST /api/done` | Preserve validation/completion behavior; optionally validate a linked successful event |
| `GET /api/topics` | Existing guides plus stable identities for recording evidence |
| `GET /api/random-review` | Compatibility adapter; use shared due selection or optional baseline |

`confirmed` is a transient boolean for untested self-certification, not arbitrary stored JSON. Existing loopback binding, host/origin checks, practice allowlist, symlink rejection, Markdown escaping, CSP and test timeout protections remain.

## Atomic Write Strategy

Progress mutation acquires an exclusive `.progress/.write.lock`, rereads current history, writes a unique same-directory temporary file, flushes it with `fsync`, then atomically renames it over the destination. Cleanup removes incomplete temporary files and releases the lock. This avoids lost updates between dashboard/CLI saves. Existing history cannot be dropped/rewritten through `saveProgress()`.

A competing writer receives an explicit retry error. A crash-left lock is not silently deleted; its PID must be inspected before manual removal. Normal write/rename failures report failure and preserve original progress bytes.

Completion updates both checklist and log with atomic per-file writes, rolling the checklist back on a caught progress-write failure. This is not a multi-file transaction: a process/power crash between the renames can leave a checkbox needing reconciliation. Attempt history remains separately acknowledged. Directory metadata is not fsynced, so this does not claim protection against every power-loss scenario.

## Validation Rules

- Small known track/type/outcome/explanation enums; UUID event identities; registered DSA/JS/topic identities or explicit custom questions.
- Successful DSA evidence requires tests passed/self-certification; confidence cannot substitute for correctness.
- Optional numeric minutes: finite 0–720; confidence: integer 1–5. Blank remains unknown, not zero/default confidence.
- Technical/communication/mistake notes: at most 240 characters each; question: 400; useful phrase: 120. Reject unexpected fields, objects and unsafe control characters.
- Server supplies dates, timestamps, timezone, canonical title/topic and verification. Client injection of these fields is rejected.
- Validate stored events and calendar dates on loading; never discard malformed history silently.
- Reject arbitrary/script paths, unsafe files, cross-origin writes, wrong content type, malformed JSON and oversized requests. No new filesystem editing endpoint.

## Tests Added

`tests/progress/evidence.test.js`: 42 tests covering actual-history loading, exact legacy fixture migration, all DSA outcomes, speaking/custom/JS/technical evidence, enum/number/text/path validation, IDs, idempotency, same-day history, India-local dates, timezone configuration, adaptive intervals/consolidation, separate speaking state, bounded ordering, gap weaknesses, unknown evidence, write/lock failures, append preservation and completion rollback.

`tests/dashboard/evidence.test.js`: 16 API/CLI integration tests covering persistence, restart restoration, Today/Revision/Progress agreement, tested and self-certified success, failed/studied completion rejection, malformed requests/history, failed writes, idempotent retry and shared CLI calculations.

`tests/fixtures/legacy-progress.json`: fixed copy of the original eight records so model/migration tests do not depend on subsequent real study events. Existing 16 dashboard tests are retained; their completion-date expectations now use the local-date helper and their fixture explicitly exercises the legacy completion-only workflow.

No testing framework or dependency was introduced. `npm run test:progress` is the new runner entry; `test:dashboard` includes both dashboard suites.

## Full Test Results

| Command | Passed |
| --- | ---: |
| `npm test HashMap/two-sum` | 6 |
| `npm test Arrays/product-of-array-except-self` | 8 |
| `npm test Two-Pointers/valid-palindrome` | 11 |
| `npm run test:dashboard` | 32 (16 existing + 16 new) |
| `npm run test:progress` | 42 |
| **Total** | **99** |

Also checked Node syntax, `git diff --check`, modified Markdown/local links and existing rendered local links/anchors. Independent browser checks used installed Chrome with temporary copies of repository data; no browser test wrote to real history.

`npm run dev` reached the existing server entry point but port 4173 was occupied by an already-running Node process. It was left untouched. **`PORT=4174 npm run dev` started successfully on loopback** and its real read-only progress endpoint returned HTTP 200, schema 2 in memory, eight legacy records, zero new events and completion `8/206`. Normal default startup uses 4173 once the existing listener is stopped/restarted. Sandbox port restrictions required running localhost tests/startup outside the sandbox.

## Legacy Migration Test

The first fixture save writes version 2 and appends a validated event. Assertions compare every original entry, including dates/path strings, and `startDate`; legacy projection stays unknown for all missing attributes. Failures/malformed input produce no migration. Tests additionally compare the real log/checklist against their original bytes after integration checks.

A final SHA-256 comparison confirms the real progress file, checklist, roadmaps, PR 1 English files, `TODAY.md`, canonical content loaders/selectors and all earlier audit/reports are unchanged. JS Core content is unchanged except fixed identifiers and a guarded shared Node export.

## UX Validation

Verified in an isolated Chrome session:

- Today default/local date, existing main task and editor navigation; editor drafts survive navigation/refresh.
- Failed DSA attempt with short gaps/time saves without completion; marking that failed attempt complete is blocked.
- Saved DSA result reappears after reload; Progress counts and Today weakness update.
- JS Core remains question-first; reveal → partial save → reload retains its stable question ID/result.
- English notes-free save persists, shows a derived review date and restores the saved question after reload.
- Topic practical evidence persists and is explicitly self-reported; blank templates remain blank.
- Moving the fixture clock forward produces real due revision in Today; opening it reaches the correct workspace.
- Simulated evidence-save failure shows an error, leaves history unchanged and allows retry.
- Existing Two Sum tests work through the dashboard; validated independent attempt and separate completion both succeed.
- Custom project-question reattempt retains its item ID without inventing project facts; all eight frameworks remain available.
- No runtime/CSP errors; no important learning data in localStorage; no horizontal page overflow at 1280px or 390px.

Normal entry is outcome + optional explanation/confidence + save; optional gaps are collapsed. This is designed for under 30 seconds of recording, not a measured guarantee of the user's typing speed. Saved summaries are read-only; new attempts start with blank outcomes rather than inheriting a previous Yes.

## Data That Is Still Unknown

The eight old completions still have unknown independence, hints, durations, confidence and explanation. Existing `startDate` is not treated as a learning-phase baseline. No difficulty, unseen/transfer status or externally calibrated interview performance has been added.

Untested coding correctness and practical-topic performance are self-certified/self-reported. English clarity is self-assessed. No recording, automatic correctness grading, topic completion percentage or permanent mastery claim is inferred.

## What Was Intentionally Not Implemented

No PR 5 phase/week storage, 16–24-week roadmap rewrite, weekly-review template/history, cross-track focus policy, carry-forward automation or daily-file generation. No curriculum expansion, TypeScript track, project-story store, full mock-history system, readiness score, AI/audio/speech features, cloud sync, account/authentication or notifications.

No source file was deleted/moved. Existing `TODAY.md`, English Markdown workflows and mock templates remain. Markdown/template editing is still read-only in the dashboard. The old progress file was not proactively migrated; the queue/core-set selection was not redesigned.

## Risks / Limitations

1. Evidence relies on honest self-report; passing existing tests validates their covered cases, not independence or every edge case. Most registered problems still lack automated tests.
2. Per-file atomic writes and caught-error rollback protect normal saves; checklist/log updates are not crash-atomic together. Crash-left locks require inspection rather than automatic removal.
3. Scheduling is a conservative deterministic foundation. Core/challenge priority uses existing queue labels; it does not invent an audit-curated P0 set. Old history is not automatically overdue. Bounded presentation reduces daily debt but does not automatically prune all stored due items.
4. Existing topic IDs are guide-level; different exercises within one topic share a broad item identity. Narrower curriculum/question IDs can be added when real content is introduced. Custom question wording changes retain the chosen ID; use New question for a distinct subject.
5. JSON is loaded/replayed locally; suitable for this personal repository, not a high-volume multi-user system. No semantic merging of gap text or readiness score exists.
6. Drafts/follow-up scratch text/Today plans are not automatically saved. Evidence requires an explicit save. An event-save acknowledgement followed by a refresh error can require an idempotent retry; it does not imply the earlier durable event was lost.
7. An existing listener occupies default port 4173 in this workspace; restart it to load the new server code, or use the documented existing PORT override.

## Recommended PR 5 Scope

Build a realistic 16–24-week phase architecture around this evidence, with explicit current learning phase/week, one cross-track weekly focus, a lightweight saved weekly review and adaptive roadmap decisions. Use review success, hinted/failed attempts, notes-free explanations, recurring gaps and known time to adjust scope. Limit carry-forward to one essential task and preserve minimum-day/busy-work-week behavior. Review the README/roadmap/study-plan pacing contradictions together then.

**PR 5 is recommended only; none of that work is implemented here.**

Files added: `scripts/lib/atomic.js`, `scripts/lib/evidence.js`, `scripts/lib/items.js`, `scripts/lib/revision.js`, `scripts/lib/study-state.js`, `tests/progress/evidence.test.js`, `tests/dashboard/evidence.test.js`, `tests/fixtures/legacy-progress.json`, and this report.

Files changed: `README.md`, `package.json`, `scripts/lib/progress.js`, `scripts/done.js`, `scripts/today.js`, `scripts/review.js`, `scripts/progress.js`, `scripts/serve-dashboard.js`, `dashboard/app.js`, `dashboard/index.html`, `dashboard/js-core-data.js`, `dashboard/styles.css`, `tests/dashboard/server.test.js`.

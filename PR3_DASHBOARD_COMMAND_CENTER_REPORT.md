# PR 3 — Dashboard Command Center

## Goal

Make the existing lightweight dashboard the primary daily interface for technical preparation **and explaining it in English**. Run `npm run dev`, start on Today, and use repository-backed material without a framework migration or new dependencies.

This follows the user's revised PR 3 direction, not the original audit's roadmap-rewrite PR. The audit, both implementation reports, the dashboard/server, CLI scripts, progress library, TODAY card, English sources, README and package manifest were inspected before editing.

## Previous Dashboard Architecture

`dashboard/index.html` contained styling and a single inline controller for Problems and JS Core. It restored a saved tab, browsed the checklist, opened solution textareas, saved files, ran tests synchronously on the server, and recorded completion. The server duplicated CLI queue/review selection. JS Core reference content lived in `dashboard/js-core-data.js`.

The editor's server path guard accepted arbitrary repository JavaScript, rather than registered solutions. The server listened without an explicit loopback address. Test/completion handlers did not check a preceding save response; reopening/rebuilding editors could discard unsaved text.

## New Dashboard Architecture

Keep vanilla HTML/CSS/JavaScript and Node built-ins:

| File | Responsibility / change |
| --- | --- |
| `dashboard/index.html` | Nine navigation sections, daily and speaking forms, document-reader dialog. |
| `dashboard/app.js` (added) | DOM controller, shared navigation, API requests, preserved editors, temporary practice state, reference reveal and document reading. |
| `dashboard/styles.css` (added) | Extracted presentation responsibility; readable responsive layout, visible keyboard focus, light/dark preferences. |
| `scripts/serve-dashboard.js` | Local server, allowlisted content/solution endpoints, asynchronous bounded tests, legacy completion writes. |
| `scripts/lib/study.js` (added) | Shared next-task selector, least-recorded-solves review selector/pool, topic parser and repetition counts. |
| `scripts/lib/content.js` (added) | Allowlisted document manifest, small escaped Markdown renderer, canonical English loaders and topic index. |
| `scripts/today.js` | Uses the shared next-task selector; existing output/policy retained. |
| `scripts/review.js` | Uses the shared review selector; comment accurately describes count-based review. |
| `scripts/progress.js` | Uses the shared topic parser; existing totals/output retained. |
| `README.md` | Dashboard-first startup, workflow and temporary-field limitations. |
| `package.json` | Adds `test:dashboard` using Node's built-in test runner; existing commands remain. |
| `tests/dashboard/server.test.js` (added) | Isolated API, completion, safety, timeout, content and CLI consistency tests. |
| `PR3_DASHBOARD_COMMAND_CENTER_REPORT.md` (added) | Implementation and validation record. |

JSON APIs expose repository content; the browser does not carry copied English chapters. The application controller keeps important learning history out of localStorage. Solution editing remains inline, rather than becoming a general repository file manager.

## Navigation

**Today** is the default on every normal launch, regardless of the old saved tab. Working sections: Today, DSA, Revision, JS Core, English, Topics, Progress and Mock Interviews. Weekly Review is an explicitly labeled upcoming workflow with useful existing-document links.

Navigation preserves mounted editors and temporary speaking fields. Explicit document/problem deep links can open their requested destination. Only the selected study mode is stored as a UI preference. No learning history is stored in localStorage.

## Today Screen

- Local browser date; **“Learning phase/week not configured yet”** instead of a calendar-derived learning phase.
- Minimum, 90 min, 120 min, 150 min and Weekend / Extended modes. The mode is a preference, not a saved plan or generated schedule.
- Optional temporary weekly focus.
- Current review suggestion, next DSA task with topic/status/open action, and a speaking question tied to that task.
- A compact disclosure for technical/DSA/revision targets, result, attempt outcome, approximate time, confidence and tomorrow's first step.

Today and Revision display the same selected review. Random ties mean separate CLI/server requests can choose different members of the same valid pool. The review is never labeled “due.” Busy-day guidance avoids catch-up debt. On small screens the main task is shown first among the start cards.

The Today working card is modeled on `TODAY.md`, not a parser or automatic editor of that file. Its notes are temporary; the existing manual card remains the place to retain pending reviews until the next progress-model PR.

## DSA Integration

Preserved problem browsing, topic pattern references, LeetCode search links, the full dependency queue, inline editing, save, available tests and legacy completion. Added a title/topic/path filter and an **Explain aloud** action into English with the DSA framework and a problem-specific question.

Editors load once and remain mounted. Closing/reopening a problem, changing sections, filtering and refreshing counts do not discard drafts. Unsaved edits warn before leaving/reloading. Refresh updates counts without reconstructing textareas. Save acknowledgements are checked before test/completion requests; failures stop the action and show an error.

Each problem has temporary controls for independent/hinted/studied/failed outcome, minutes, confidence and notes-free explanation. **Mark Complete** still saves only the existing solution/checklist/date record. These richer controls are visibly not persisted and are not reported as mastery.

Tested problems must pass; untested problems retain explicit self-certification. Re-solving preserves same-day log deduplication. Successful completion refreshes counts and the review suggestion.

## English Integration

`/api/english` reads all eight framework sections, the 15-minute loop, recording instructions and occasional rubric from `english/README.md`. All 24 phrases are loaded by their existing categories from `english/TECHNICAL_PHRASES.md`. Four answer-bank sections are rendered from `english/INTERVIEW_ANSWER_BANK.md` without populating personal facts.

The daily form includes question, framework, first attempt, reference review, one technical gap, one communication gap, second attempt, follow-up/work connection, notes-free outcome, confidence, phrase/word and obstacle/next review. References remain hidden until requested. Changing a question with pending gap notes asks the user to copy them before clearing temporary fields. Manually changing the question detaches its old reference.

DSA explanations use the current editor draft when available. JS Core questions can become the daily question with their existing answer as a revealable reference. Topics offer prompts connected to the current subject; topic checklists are explicitly described as pointers, not complete reference answers.

A short phrase preview expands into the categorized list. The daily loop, twice-weekly recording guidance and occasional communication rubric are disclosures, not extra daily tracking forms. No audio storage or grammar syllabus was added.

## JS Core Integration

Preserved all existing function forms, timer/async examples and theory questions in `dashboard/js-core-data.js`, grouped through the category filter. Each card shows **“Answer aloud first, without notes”**, a separate **Reveal Answer** control and **Use for daily speaking**.

After revealing, a temporary notes-free outcome can be selected. It survives filtering during the current page session but is not saved. Questions/answers remain separate from DSA completion and streaks. PR 2's corrected runtime explanations remain unchanged.

## Revision Integration

`/api/random-review` uses the exact selector shared with `npm run review`: checked problems with the fewest logged solves, random ties. It returns the selected problem, count, pool size and existing dated history. Users can open/start a review or request another suggestion.

The screen states that date/outcome-based revision scheduling comes later. No revision dates, extra solves, or inferred independence were added to the log.

## Topics Navigation

Read existing JavaScript, React, Next.js, Node.js, Express, SQL, System Design, HR, Projects, Resume and Behavioral guides in the document dialog. Descriptions come from existing paragraphs/checklist bullets. JavaScript also exposes its existing chapter notes.

There is no TypeScript material in the inspected repository, so no TypeScript entry/content was invented. No topic completion percentages are shown.

## Progress Integration

Checklist completion totals, completion by topic, existing streak and up to 20 recent log entries are visible. At validation, actual repository totals were **8 / 206**, matching `npm run progress`. The entry history was unchanged by validation.

**Completion** and **Readiness** are explicitly distinct. Readiness has no score: attempt/explanation evidence is required before metrics can be established. The existing legacy UTC date/streak behavior is retained; it is not used to infer a learning phase.

## Weekly Review Placeholder

Useful but explicitly upcoming: explains completed work, weak patterns, forgotten concepts, English gaps, mocks and next-week focus. Links to `13-Daily-Study-Plan.md` and `TODAY.md`. No fake review, new template, storage or scoring history.

## Mock Interview Integration

Renders the actual `Mock-Interviews/README.md`, including six round types, rotation instructions and blank session template. Available as an embedded guide and in the reader. No mock results, scores or histories were fabricated or persisted.

## Server / File Safety Changes

- Main server explicitly binds `127.0.0.1`; startup uses the actual bound port.
- Exact checklist membership is required for solution reads, saves, tests and completion. Administrative folders (`scripts`, `dashboard`, `tests`) and root JavaScript are excluded even if accidentally registered.
- Relative path validation plus real-path containment; editable paths cannot contain symlinks. Static assets and readable Markdown are separately allowlisted.
- Host and Origin checks reject foreign hosts/origins; writes require JSON. Bodies over 2 MB and malformed objects are rejected.
- Asynchronous test execution with a 10-second limit, forced termination and 1 MB output cap keeps a hung solution from blocking read endpoints.
- Failed tests cannot record completion. Save failures cannot trigger tests/completion from the UI. Completion writes retain the legacy shape, with best-effort log rollback if the checklist write fails.
- Escaped Markdown, safe link handling, content-type protection and a restrictive Content Security Policy avoid raw HTML/script execution in the reader. No inline scripts/handlers or new authentication system.

This is a local personal tool. Solution tests intentionally execute the user's JavaScript with Node; the timeout is not a code sandbox. Do not treat it as a service for executing untrusted submissions. Two-file completion updates are not crash-atomic transactions; redesigning storage is later work.

## Data Sources

| Dashboard section | Canonical source |
| --- | --- |
| Today workflow | `TODAY.md` / PR 1 human workflow; temporary UI card, not file generation. |
| Today main task / DSA queue | `01-DSA-Questions.md` dependency queue/checklist and `scripts/lib/study.js` selector shared with CLI. |
| DSA editor / pattern reference | Registered problem `.js` files and topic-folder `README.md` Pattern sections. |
| Tests / completion | Existing `scripts/test-solution.js`, `tests/<problem>.test.js`, checklist and legacy `.progress/log.json`. |
| English frameworks / loop / rubric / recordings | `english/README.md`. |
| Technical phrases | `english/TECHNICAL_PHRASES.md`. |
| Answer-bank templates | `english/INTERVIEW_ANSWER_BANK.md`. |
| JS Core | Unchanged `dashboard/js-core-data.js`; canonical JavaScript chapters are accessible through Topics. |
| Topic directory | Existing `02-JavaScript.md` through `12-Behavioral.md` and `JavaScript/*.md`. |
| Progress | Checklist, `.progress/log.json`, shared topic parser and existing streak helper. |
| Revision | Checklist/log plus `scripts/lib/study.js` review selector shared with CLI. |
| Weekly Review | Explicit upcoming workflow; links to existing daily plan/card only. |
| Mock Interviews | `Mock-Interviews/README.md`. |

New read endpoints: `/api/english`, `/api/topics`, `/api/content?path=<registered-md>`; the latter also offers `format=raw` as read-only plain text. Existing data/review/file/test/done endpoints remain compatible. The content loader uses a purpose-built Markdown subset, not full CommonMark; raw HTML is escaped and unknown local links render as text. English extraction depends on the canonical section headings, covered by tests.

## CLI Compatibility

Verified:

- `npm run today`: same next task, **Move Zeroes**, and 8/206 completion.
- `npm run review`: member of the same eight-problem least-recorded-solves pool; random ties are intentional.
- `npm run progress`: same total, per-topic counts and streak.
- Existing per-problem `npm test` commands remain unchanged.

`npm run done` and `scripts/lib/progress.js` were not rewritten. CLI Today still retains its legacy calendar-based week/topic rotation; the dashboard does not present that week as learning progress.

## Tests Performed

- `npm test HashMap/two-sum`: **6 passed**.
- `npm test Arrays/product-of-array-except-self`: **8 passed**.
- `npm test Two-Pointers/valid-palindrome`: **11 passed**. All **25 existing tests** pass.
- `npm run test:dashboard`: **16 passed**, using temporary repository fixtures for mutations; no dependency added.
- Syntax checks for dashboard controller, server, loaders and modified CLI scripts; `git diff --check`.
- Canonical Markdown link validation: **51 registered documents / 152 rendered local links**, with no unresolved anchors.
- `npm run dev`: successfully starts at `http://127.0.0.1:4173` and requests browser opening. This environment blocks local port binding inside the sandbox, so integration/startup/browser runs used approved execution outside it.

## Security / Scope Validation

Tested rejection of scripts, dashboard JavaScript, unregistered solutions, traversal, backslash paths, symlink redirection, foreign Origin/Host, wrong content type, invalid JSON, oversized bodies and non-allowlisted static/document paths. A hung test was terminated while read endpoints continued responding. Failing tests preserved fixture history. Tested and self-certified completion worked with original entries retained and same-day deduplication.

Browser fault injection returned a failed save and confirmed **zero subsequent test/completion requests**. All completion-write/browser tests used copies, not real progress. A before/after file-hash comparison confirms PR 1 English/TODAY content, PR 2 fixes/tests, roadmap/daily plan, checklist and real progress log remain unchanged by PR 3.

Git status for PR 3 is seven modified files and six added/untracked files, including this report. The worktree also contains the pre-existing, uncommitted audit/PR 1/PR 2 changes; they were preserved. No commit, file deletion or remote PR was created.

## UX Validation

Used installed headless Chrome because the in-app browser execution tools were unavailable. Verified default Today, opening the main task, editing/saving, completion, tests, explaining, draft preservation across navigation/refresh, JS question-first reveal, all eight framework selectors, phrases, answer-bank templates, read-only document reading, Escape closing the dialog, mock guide and completion counts.

Desktop and 390 px mobile screenshots were inspected. No horizontal page overflow on Today/English; small-screen navigation scrolls horizontally and the main task leads the start cards. Buttons, labels, native disclosures/selects/dialog and visible focus support keyboard use. No runtime/CSP errors remained after adding a no-content favicon response. Routine logging uses short fields; no transcript or mandatory answer-bank entry is required.

## Known Limitations

- **Not persisted:** Today notes/focus/targets/close fields, attempt outcome/time/confidence, speaking checkboxes/gaps/phrase/review/outcome, JS notes-free outcomes and chosen framework/question. They survive section navigation, not reload/closing. Copy important notes to the existing manual card before leaving.
- **Persisted:** existing solution edits and legacy checklist/date completion. Study mode alone is a local UI preference.
- No trustworthy learning-phase/week configuration; no readiness scores or independence/hint evidence can be inferred from old completion entries.
- Review is repetition-count-based, not date/outcome-based scheduling. Separate random requests need not select the same tied candidate.
- Answer bank, topic notes and mock templates are read-only in the dashboard. Structured editing is future work.
- Reader implements the Markdown subset used here; nested/complex Markdown may be flattened. Unknown local files are not exposed through a general filesystem endpoint.
- Use Refresh data for external edits. Existing editor drafts stay authoritative until explicitly saved/reloaded; no merge/conflict-resolution system was added.

## What Was Intentionally Not Implemented

No roadmap/daily-plan rewrite, phase persistence, revision dates, progress schema migration, full attempt history, weak-area tracker, new curricula, project-story storage, weekly-review storage, mock scoring history, TODAY generation, recordings, speech recognition, AI scoring, cloud sync, accounts, authentication or notifications. No React/Next.js application or external dependency. No real learning history was created by tests.

## Recommended Next PR

Design one repository-backed, backwards-compatible attempt model before enabling persistence of the new controls. Preserve every existing completion entry and distinguish legacy completion from unknown independence/explanation evidence.

Add independent/hinted/studied/failed outcomes, optional time/confidence, English notes-free explanation outcomes and knowledge-versus-communication gaps. Use those records for genuine date-based revision and weak-area tracking shared by dashboard and CLI. Then wire the temporary UI controls to explicit validated saves. Keep roadmap/curriculum expansion separate; this report does not implement that next PR.

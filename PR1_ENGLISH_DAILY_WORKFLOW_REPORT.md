# PR 1 — English + Daily Workflow Report

PR 1 adds a manual daily speaking workflow alongside the existing technical
practice. The full [repository audit](./INTERVIEW_PREP_REPO_AUDIT.md) and the
existing README, plans, completion rules, relevant guides, example solutions,
and CLI behavior were inspected before editing. Implementation is limited
to Markdown content; this report describes the local changes.

## Files Added

- [TODAY.md](./TODAY.md): reusable daily card with task selection, speaking loop,
  brief results, and manual carry-forward.
- [english/README.md](./english/README.md): main communication guide, eight
  frameworks, integrated technical prompts, recording practice, and metrics.
- [english/TECHNICAL_PHRASES.md](./english/TECHNICAL_PHRASES.md): 24 natural phrases
  grouped by use case.
- [english/INTERVIEW_ANSWER_BANK.md](./english/INTERVIEW_ANSWER_BANK.md): blank
  bullet templates for introductions, concepts, projects, and behavioral stories.
- [PR1_ENGLISH_DAILY_WORKFLOW_REPORT.md](./PR1_ENGLISH_DAILY_WORKFLOW_REPORT.md):
  implementation and validation record.

The audit file already existed and was untracked before PR 1. It was read
and left unchanged; it is not a new PR 1 implementation artifact.

## Files Changed

Only the root [README.md](./README.md) was changed: the opening goal now includes
English explanation, and one paragraph makes TODAY the manual daily entry point
and links the communication guide. Existing commands and later sections remain.

## Daily Workflow

1. Open TODAY, update the date, available time, learning week/phase and focus.
2. Select one revision, one main task, and a speaking question about that task.
   Use the existing dashboard or `npm run today` to select the next DSA problem.
3. Study/code with the existing files and tools; do applicable targets only.
4. Use the 15-minute speaking loop inside the day's time budget.
5. Log short results and retain one next main step plus any pending speaking
   review before reusing the card tomorrow.

The card includes minimum (20–30 minutes), standard (90–120), and extended
(150+) modes. A minimum day uses a short retrieval plus speaking. Missed days
resume unfinished work without doubling tasks. Learning week/phase is a manual
label; this PR does not add phase automation.

Maintenance budget: roughly 30 seconds selecting tasks plus 60–90 seconds
closing, with checkboxes ticked during practice. One-line fields, no transcripts,
no mandatory daily bank entry, and no separate score tracker keep the intended
overhead around two minutes. This is a walkthrough-based estimate; actual typing
and speaking pace should be checked during your first week of use.

## English Speaking System

The six timed steps total 15 minutes: select a question; speak without notes;
review one technical and one communication gap; re-answer using keywords and
then put them away; answer a follow-up; log the outcome and next review.

Daily practice normally uses the same JS, React, Node/API, PostgreSQL, DSA,
or design topic already being studied. The guide links existing topic material
and explains that short checklists are starting points rather than complete
reference answers. The new loop replaces the old short aloud ending within
the available budget rather than adding a second speaking obligation.

Daily tracking is notes-free outcome (Yes/Partially/No), one obstacle, and
confidence (1–5), with brief phrase/gap/review fields in TODAY. Partial or
unsuccessful explanations receive a manual review in 1–3 days. This does not
claim to integrate with the current DSA review command.

Recording starts twice weekly using a daily question: record 2–5 minutes,
listen once, choose at most two or three improvements, and answer again.
Analysis is capped at about five minutes; media stays outside the repository
and out of Git. Occasional recordings/mocks use clarity, structure, technical
accuracy, fluency, confidence, filler level, and needed-notes ratings.

## Explanation Frameworks

The guide contains all eight requested scaffolds:

- Technical concept: definition, purpose, mechanism, example, limitation,
  genuine experience when applicable.
- X vs Y: shared purpose, two or three differences, example, appropriate choice.
- Architecture: goal/constraints, components, request flow, decision,
  alternatives, failure/scaling.
- Debugging: impact, evidence, hypotheses, isolation, mitigation/fix,
  verification, prevention.
- Project: context, problem, investigation, decision, implementation, result,
  learning.
- Behavioral: Situation, Task, Action, Result.
- System design: requirements, relevant scale, APIs, data, architecture,
  request flow, bottlenecks, reliability, tradeoffs.
- DSA: clarify, brute force, optimization/invariant, data structure, example,
  time/space, edges, code/test while communicating.

They guide answer order and depth; they are not memorized scripts. The DSA
guidance progresses from explaining finished code to thinking aloud during
coding. Grammar work is limited to issues affecting understanding.

## Answer Bank Design

Introduction templates offer 30-, 60-, and 90-second variants with blank
experience, skill, contribution, strength, and target-role prompts. Technical
templates include key points, example, tradeoff, real-work connection,
reference, follow-ups, and the last speaking weakness.

Project templates use 30-second, two-minute, and five-minute bullet cues, with
all requested architecture/database/auth/security/deployment/redesign/scale
and personal-contribution follow-ups. Behavioral templates use STAR plus lesson
and follow-ups. No personal facts, stories, metrics, scores, or results were
invented or populated. The bank links existing guides rather than replacing them.

## README Integration

The root README now opens with both technical skills and English explanation
as goals. Its Start Here paragraph points to TODAY and the English guide and
reserves 15 minutes daily. `npm run dev`, terminal alternatives, DSA checklist
ownership, coding-file conventions, and the existing command list are preserved.

## Example JavaScript Walkthrough

This is a desk walkthrough using an existing question, not a completed speaking
session or evidence of the user's fluency. Personal TODAY fields remain blank.

Question: **“Explain closure using a real application example.”** It appears in
the interview checks in [the scope/closure chapter](./JavaScript/01-scope-hoisting-closures.md#interview-checks).

1. **0–1:** Put the question in TODAY. Choose the technical-concept framework;
   leave the reference closed for the first answer.
2. **1–4:** Attempt the definition, purpose, mechanism, and example aloud.
3. **4–7:** Check [the existing closure notes](./JavaScript/01-scope-hoisting-closures.md#closures).
   Reference cues: lexical environment; retained outer-variable access; private
   counter state; retained memory as a limitation. Identify only one actual
   technical omission and one actual communication obstacle from the attempt.
4. **7–10:** Retell with cues such as “lexical scope / counter / retained state,”
   then put them away. Use “Internally, this works by…” if helpful.
5. **10–13:** Follow-up: “Do two calls to createCounter share the same count?”
   Use the chapter's counter to explain independent closure state. Connect to
   real work only if it is true; otherwise label the counter as an example.
6. **13–15:** Record the actual outcome, obstacle and confidence; choose a review
   date if necessary. No JavaScript topic checkbox changes solely from speaking.

Validation executed the chapter's existing counter example in memory. Its first
two calls produce 1 and 2; the next produces 3; a separate counter starts at 1.
The reference file was not modified. The workflow uses existing chapter checks
and requires no new question-selection script.

## Example DSA Walkthrough

This is a desk walkthrough of [Two Sum](./HashMap/two-sum.js), an existing
implemented problem. It is an illustration of a review session, not a change
to the next-problem queue or a recorded independent user solve.

1. Read only the prompt/example and attempt the problem through the normal
   workflow. For a re-solve, hide the existing implementation first.
2. During the speaking loop, clarify that the result is two distinct indices.
   Explain brute-force pair checking before the optimization.
3. After the first spoken attempt, check the existing implementation. Reference
   cues: a Map of previously seen values to indices; lookup of `target - value`;
   checking before insertion to avoid reusing the current element.
4. Walk through `[2, 7, 11, 15]`, target `9`: store 2 at index 0; at index 1,
   find complement 2 and return `[0, 1]`.
5. Re-answer with keywords, then put them away. Explain average O(n) time and
   O(n) extra space, compared with brute-force O(n²) time and O(1) extra space.
   Discuss duplicate values and negative/zero values under the problem's contract.
6. Follow-up: “Why must lookup happen before insertion?” Test `[3, 3]`, target
   `6`, and explain why the answer uses two indices rather than one twice.
7. Log the speaking result manually. Actual independent coding/re-solve completion
   still uses the existing completion rule and `npm run done -- HashMap/two-sum`.
   Speaking alone does not qualify as a new solve or revision solve.

All six existing Two Sum tests passed via `npm test -- HashMap/two-sum`.
The walkthrough also checked the standard example and duplicate-value example
in memory. No solution, checklist or progress record was changed by validation.

## Validation Performed

- Read the full audit and inspected all existing material directly referenced
  by this change before editing.
- Checked relative Markdown file targets and heading anchors in the new files
  and root README; all resolved. Checked paired code fences and whitespace.
- Confirmed the phrase file contains exactly 24 phrases.
- Ran `npm run today`, `npm run review`, and `npm run progress` successfully.
  The current next problem remains Move Zeroes; completion remains 8/206.
- Ran the existing Two Sum test command: six tests passed.
- Executed the existing closure example in memory and verified the two DSA
  walkthrough cases. No test files or dependencies were added.
- Reviewed `git diff` and `git diff --check`. Compared hashes of all pre-existing
  files against a before-edit baseline: README is the only existing file changed.
- Kept daily record fields blank and reviewed the manual startup/close path,
  including minimum days, pending speaking review, and missed-day carry-forward.

Dashboard/write commands were inspected rather than invoked: no new solve or
progress history should be recorded by documentation validation. A live browser
test was unnecessary for unchanged dashboard code.

## What Was Intentionally Not Changed

`00-Roadmap.md`, `13-Daily-Study-Plan.md`, DSA ordering/checklists/solutions,
JavaScript chapters, progress JSON/schema, scripts, dashboard, package metadata,
and existing mock/project/behavioral guides remain unchanged. No dependencies,
automatic TODAY generation, extra English trackers, grammar syllabus, media,
file deletion/move, or PR 2 repairs were introduced.

## Risks / Questions

- Speaking review dates and learning week/phase are manual. The existing CLI
  week remains calendar-derived and is not proof of learning progress.
- TODAY is a reusable current card, not a history tracker. Keep pending review
  questions/dates visible before resetting it; durable tracking is future work.
- The timing budget is a practical target, not a measured user result. If logging
  takes longer, shorten entries rather than add more tracking fields.
- Existing roadmap/session budgets and weekly quotas have not been reconciled.
  Reserve speaking inside available time and skip optional stretch work to fit;
  phase/load changes belong to the audit's later PRs.
- Known technical defects identified by the audit remain. The examples here use
  the existing closure chapter and tested Two Sum implementation; no user mastery
  or comprehensive content correctness is inferred from those checks.
- There are no missing personal facts blocking this workflow. Introduction and
  story fields should be filled by the user from verified, sanitized experience.

## Recommended PR 2 Scope

Follow the audit's correctness-focused PR 2: revisit checked Product of Array
Except Self and Valid Palindrome, add focused regression cases, correct the
undefined index in the HashMap teaching template and heap/queue/greedy guidance,
and repair the JS Core hoisting contradiction and small JavaScript inaccuracies.
Preserve solution history and avoid generating claims of independent mastery.
Do not broaden PR 2 into progress-schema, roadmap, or dashboard-feature work.
PR 2 has not been implemented.

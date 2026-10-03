# Interview Preparation

Daily full-stack software engineering interview preparation over **16–24 weeks**:
technical skill **and clear English communication**. English is P0.
Evidence matters more than checklist completion.

## Start here — every single day

```sh
git pull
npm run dev
```

The local dashboard opens **Today** at http://127.0.0.1:4173 (Ctrl+C to stop).
First use: choose Phase 1 / Week 1 or manually choose phase/week and available
hours. Old dates never decide your learning position.

- **Daily — Today:** main task, bounded due revision, same-topic speaking and
  selection reasons. DSA retains the inline editor/tests.
- **Weekly — Weekly Review:** generated evidence summary; choose capacity,
  technical/DSA/speaking focus, one essential carry-forward (optionally one small
  secondary) and Continue / Consolidate / Advance. Decisions persist.
- **Long-term — [Roadmap](./00-Roadmap.md):** 20-week baseline across five phases;
  adapt toward 16–24 weeks. Learning week **does not advance automatically** after
  seven days. No catch-up cramming or fixed daily quota.

Save real attempts in **DSA/Topics** and explanations in **English/JS Core**.
**Save attempt** records independent / hinted / studied / failed evidence;
**Mark Complete** is separate and validated. Old completion has unknown
independence/explanation. Progress shows observations, not a readiness score.
Only daily scratch fields remain temporary.

[English communication](./english/README.md) uses a daily 15-minute
speak-before-reading loop with the same topic. Frameworks, 24 phrases and blank
answer templates are in the dashboard. No grammar course. [Day modes](./13-Daily-Study-Plan.md)
cover minimum/normal/busy days; [TODAY.md](./TODAY.md) is the manual fallback.
[Mock instructions](./Mock-Interviews/README.md) remain available.

## Full-stack interview guides

Use **Topics**, or read directly:

- [JavaScript](./02-JavaScript.md), [React](./03-React.md), [Next.js](./04-NextJS.md)
- [Node.js](./05-NodeJS.md), [Express](./06-Express.md), [SQL](./07-SQL.md)
- [System design](./08-System-Design.md), [HR](./09-HR-Interview.md)
- [Projects](./10-Projects.md), [Resume](./11-Resume-Notes.md), [Behavioral](./12-Behavioral.md)
- [Job search and negotiation](./14-Job-Search-and-Negotiation.md)

## Daily commands

CLI fallbacks use the same planning/evidence/revision functions:

- `npm run today` — explicit phase/week/focus, main task, revision and speaking.
- `npm run review` — one due coding review or up to three short retrievals.
- `npm run progress` — planning, checklist counts, evidence and weaknesses.
- `npm run done -- Folder/problem-file` — validated completion; missing evidence
  stays unknown. Optional `--outcome independent|hinted|studied_solution|failed`,
  `--type review`, `--minutes 25`, `--confidence 3`, `--explanation yes|partial|no`
  records evidence. Failed/studied only record attempts; independent/hinted
  require tests or explicit self-certification.
- `npm test Folder/problem-file` — existing per-problem tests.
- `npm run add -- Folder "Problem Name" --pattern pattern-id` — registered scaffolder; Supporting by default.
- `npm run test:progress` / `npm run test:dashboard` — evidence/planning/API tests.

`npm run dashboard` aliases dev. If the default port is occupied, use
`PORT=4174 npm run dev`. No dependencies or separate daily commands needed.

## Evidence and revision

JSON schema v2 retains completion `entries` and append-only `events`, adding
optional planning v1 and structured weekly reviews. Setup/new saves preserve
history. Coding and speaking dates are separate: failures/unclear answers return
soon; delayed recall expands through 1 → 3 → 7 → 14 → 30 days. Daily selection
stays bounded; confidence is subjective.

Dates default to **Asia/Kolkata**, including after midnight. Override with
`STUDY_TIMEZONE=Europe/London npm run dev` if needed; old dates stay unchanged.
Planning/reviews are repository-backed; browser storage holds UI preferences only.
Full mock history and application tracking are not implemented.

## Coding-file convention

[01-DSA-Questions.md](./01-DSA-Questions.md) is the single completion checklist;
topic READMEs are navigation. Read the prompt, attempt first, then add approach,
complexity, tests and lessons. Checked files are not proof of independent readiness.
DSA defaults to a **curated core path**, with weakness-driven supporting practice,
delayed recall and transfer candidates. **All Problems** retains the entire library.
Core completion alone is not readiness: independent solving, delayed recall,
applying the pattern to a different contract and explaining it without notes matter.
Use the **Patterns** view for evidence and the next action.

[DSA guide](./01-DSA-Questions.md) documents the roles and evidence gates.
`npm run add -- Arrays "Problem Name" --pattern prefix-sum` registers a practice
file in the catalog, queue and checklist together (Supporting by default).
Choose a real pattern ID from the catalog; registration does not invent a prompt,
solution, difficulty or mastery.

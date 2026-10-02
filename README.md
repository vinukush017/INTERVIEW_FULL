# Interview Preparation

A focused interview-preparation workspace for full-stack JavaScript roles,
building both technical interview skills and clear English explanations.

## Start here — every single day

After pulling the latest repository, start the daily command center:

```sh
git pull
npm run dev
```

The server opens **Today** at http://127.0.0.1:4173. Start with its main DSA task
or current review suggestion, then spend 15 minutes explaining the same topic
aloud. **DSA** keeps the inline editor, save, tests and completion actions;
**JS Core**, **English**, **Topics**, **Revision**, **Progress**, and **Mock
Interviews** bring existing material into the dashboard. Weekly Review explains
the upcoming workflow. Ctrl+C stops the server.

Solutions, checklist and completion dates remain repository-backed. Attempt
outcomes, speaking gaps and Today notes are **temporary** in this PR; copy
important pending reviews to [TODAY.md](./TODAY.md) before closing/reloading.
The manual card remains a fallback. The [English communication guide](./english/README.md)
is the canonical daily speaking system; its frameworks, phrases and blank
answer templates are viewable in the dashboard. No separate English syllabus.

Prefer the terminal for the daily loop instead? `npm run today` /
`npm run done -- Folder/problem-file` / `npm run progress` do the same three
things without a browser — see [Daily commands](#daily-commands) below.

## Longer-term structure

1. Read [00 - Roadmap](./00-Roadmap.md) once, at the start.
2. Use the [Daily Study Plan](./13-Daily-Study-Plan.md) for pacing, full-stack
   topics, and the mock-interview cadence — but let `npm run today` choose the
   actual next DSA problem, not the calendar date. See its preface for why.
3. From week 9 onward, follow the same file into the job-search phase:
   applications, referrals, and negotiation — see
   [14 - Job Search and Negotiation](./14-Job-Search-and-Negotiation.md).
4. Practise project, system-design, and behavioral explanations every week.
5. Record timed practice in [Mock Interviews](./Mock-Interviews/README.md).

## Weekly minimum

- 8-10 new DSA problems
- 4-6 previously solved problems repeated without notes
- 3 full-stack study sessions
- 1 project or system-design explanation
- 1 behavioral story practised aloud
- 1 timed mock interview from week 3 onward

Consistency matters more than completing a very large number of questions.

## Full-stack interview guides

- [JavaScript](./02-JavaScript.md)
- [React](./03-React.md)
- [Next.js](./04-NextJS.md)
- [Node.js](./05-NodeJS.md)
- [Express](./06-Express.md)
- [SQL](./07-SQL.md)
- [System design](./08-System-Design.md)
- [HR interview](./09-HR-Interview.md)
- [Projects](./10-Projects.md)
- [Resume notes](./11-Resume-Notes.md)
- [Behavioral interview](./12-Behavioral.md)
- [Job search and negotiation](./14-Job-Search-and-Negotiation.md)

## Daily commands

- `npm run dev` (alias: `npm run dashboard`) — the local webpage at http://127.0.0.1:4173. In **DSA**, open a problem, write your solution, **Save & run tests** (where available), then **Mark Complete** — it saves the file, checks the box in [01-DSA-Questions.md](./01-DSA-Questions.md), and updates the existing completion log/streak. Untested problems require self-certification. Every problem also links to a LeetCode search. Ctrl+C to stop it.
- `npm run today` — the terminal equivalent: streak, percent solved, next problem, today's full-stack topic.
- `npm run done -- Folder/problem-file` — the terminal equivalent of the Mark Done button. Works on an already-solved problem too — that's how you log a re-solve.
- `npm run progress` — the terminal equivalent of the dashboard's stats, as plain text.
- `npm run review` — suggests one already-solved problem to re-solve from memory, always picking from whichever solved problems you've practiced the *fewest* times. Nothing gets a 3rd rep until everything solved has 2, nothing gets a 4th until everything has 3, and so on — no fixed target, it just keeps chasing the least-practiced group. In the dashboard, this is the **Revision** section and Today’s **Current review suggestion** card.
- `npm test Folder/problem-file` — run a problem's test file directly, without marking it done.
- `npm run add Folder "Problem Name"` — scaffold a new problem file, README entry, and checklist line.

The **DSA** section also has a **Full dependency-ordered queue** disclosure — the complete existing queue as one flat, numbered list across every topic. Open any entry to go straight to its editor. `npm run review` remains a CLI fallback; it uses repetition counts, not scheduled due dates.

## Coding-file convention

Use [01-DSA-Questions.md](./01-DSA-Questions.md) as the single progress checklist. Topic-folder READMEs are navigation pages only, so completion never needs to be updated in two places. Each question links to a JavaScript file containing a spoiler-free description and example. Read those first, solve the problem, and only then complete the approach, complexity, tests, and lessons sections.

Run a solution with Node, for example:

    node Arrays/product-of-array-except-self.js

To add another linked problem later, run:

    node scripts/add-problem.mjs Arrays "Maximum Subarray"

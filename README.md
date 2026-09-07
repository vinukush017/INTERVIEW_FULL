# Interview Preparation

A focused interview-preparation workspace for full-stack JavaScript roles.

## Start here — every single day

    npm run dev

That's the only command you need to remember. It starts a local server and
opens the dashboard in your browser at http://localhost:4173 — from there you
can see your streak and progress, open the next problem in dependency order,
write your solution in the inline editor, run its tests, and mark it done.
Everything writes to the same files this repo has always used, so your editor
and terminal stay usable too if you'd rather work there for a given problem.
Ctrl+C in that terminal stops the server when you're done for the day.

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

- `npm run dev` (alias: `npm run dashboard`) — the local webpage at http://localhost:4173. Click any problem to expand an inline editor: write your solution right there, **Run Tests** (for problems that have one), and **Mark Done** — it saves the file, checks the box in [01-DSA-Questions.md](./01-DSA-Questions.md), and updates your streak. Every problem row also links out to a LeetCode search for that exact title. Ctrl+C to stop it.
- `npm run today` — the terminal equivalent: streak, percent solved, next problem, today's full-stack topic.
- `npm run done -- Folder/problem-file` — the terminal equivalent of the Mark Done button. Works on an already-solved problem too — that's how you log a re-solve.
- `npm run progress` — the terminal equivalent of the dashboard's stats, as plain text.
- `npm run review` — suggests one already-solved problem to re-solve from memory, always picking from whichever solved problems you've practiced the *fewest* times. Nothing gets a 3rd rep until everything solved has 2, nothing gets a 4th until everything has 3, and so on — no fixed target, it just keeps chasing the least-practiced group. In the dashboard, this is the **Random Review** card near the top.
- `npm test Folder/problem-file` — run a problem's test file directly, without marking it done.
- `npm run add Folder "Problem Name"` — scaffold a new problem file, README entry, and checklist line.

The dashboard also has a **"Show the full study order"** toggle near the top — the complete 206-problem queue as one flat, numbered list across every topic, so you can review the whole sequence before committing to it. Click any row to jump straight to that problem's editor.

## Coding-file convention

Use [01-DSA-Questions.md](./01-DSA-Questions.md) as the single progress checklist. Topic-folder READMEs are navigation pages only, so completion never needs to be updated in two places. Each question links to a JavaScript file containing a spoiler-free description and example. Read those first, solve the problem, and only then complete the approach, complexity, tests, and lessons sections.

Run a solution with Node, for example:

    node Arrays/product-of-array-except-self.js

To add another linked problem later, run:

    node scripts/add-problem.mjs Arrays "Maximum Subarray"

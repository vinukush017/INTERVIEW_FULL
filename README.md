# Interview Preparation

A focused interview-preparation workspace for full-stack JavaScript roles.

## Start here

1. Follow [00 - Roadmap](./00-Roadmap.md).
2. Execute the exact tasks in the [8-Week Daily Study Plan](./13-Daily-Study-Plan.md).
3. Track coding work in [01 - DSA Questions](./01-DSA-Questions.md).
4. Study one full-stack topic alongside DSA each day.
5. Practise project, system-design, and behavioral explanations every week.
6. Record timed practice in [Mock Interviews](./Mock-Interviews/README.md).

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

## Coding-file convention

Use [01-DSA-Questions.md](./01-DSA-Questions.md) as the single progress checklist. Topic-folder READMEs are navigation pages only, so completion never needs to be updated in two places. Each question links to a JavaScript file containing a spoiler-free description and example. Read those first, solve the problem, and only then complete the approach, complexity, tests, and lessons sections.

Run a solution with Node, for example:

    node Arrays/product-of-array-except-self.js

To add another linked problem later, run:

    node scripts/add-problem.mjs Arrays "Maximum Subarray"

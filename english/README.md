# English for Technical Interviews

The goal is to explain what you know, built, chose, and debugged in clear English.
Practice retrieving and structuring an answer even when the concept is familiar.
Use [TODAY.md](../TODAY.md) for the daily card; keep the existing DSA/dashboard
workflow and [JavaScript chapters](../JavaScript/README.md) for technical practice.

## Daily 15-minute speaking loop

| Time | Action |
| --- | --- |
| 0–1 min | Choose one question from today's technical task or a pending speaking review. Read only the question. |
| 1–4 min | Explain aloud without notes for 1–3 minutes. Take a short pause to choose a structure, then start with the main point. |
| 4–7 min | Check reference material. Identify one missing technical point and one communication problem: unclear opening, missing word, jumping between points, or an overly long sentence. If no gap is apparent, record none. |
| 7–10 min | Answer again with only a few keywords; put them away and finish without notes. Use fresh wording. |
| 10–13 min | Answer one follow-up, or connect the concept to real work you actually did. Use a hypothetical example if you have no relevant experience and label it as such. |
| 13–15 min | Record the notes-free outcome, one useful phrase, a short obstacle, confidence, and the next review if needed. |

Extend to 20–30 minutes when a follow-up, project explanation, or DSA walkthrough
needs it. Keep this inside the day's study budget. It replaces the short aloud
ending in the existing study plan; do not add both speaking blocks. On a busy
day, a short retrieval plus this loop is enough; resume after missed days.

If the outcome is **Partially** or **No**, keep the question and a review date
1–3 days away in TODAY. Distinguish a knowledge gap from “I knew it but could
not explain it.” Re-answer before reading next time. Review dates are manual;
the existing `npm run review` selects DSA problems by repetition count.

## Use today's technical topic

| Today's work | Speaking question or action | Existing starting point |
| --- | --- | --- |
| JavaScript closures | “What is a closure? Explain it with an application example.” | [Closure notes](../JavaScript/01-scope-hoisting-closures.md#closures) |
| PostgreSQL/indexes | “Why can an index improve reads but make writes more expensive?” | [SQL checklist](../07-SQL.md) |
| React rendering | “Why might React.memo fail to prevent a rerender?” | [React checklist](../03-React.md) |
| Node.js/Express | “What happens when an HTTP request reaches an Express API?” | [Node.js](../05-NodeJS.md) and [Express](../06-Express.md) checklists |
| DSA | After solving, explain the approach, invariant, complexity, edge cases, and tradeoff. | [Existing problem queue](../01-DSA-Questions.md#dependency-ordered-practice-queue) |
| System design | Explain one architecture decision, its alternative, and its tradeoff. | [Design discussion order](../08-System-Design.md#discussion-order) |

The short checklists are topic pointers, not complete reference answers. Review
the technical material you used for the task when checking your explanation.
For the dashboard's JS Core flashcards, speak before revealing the answer.
Choose one question; this table is not a separate syllabus.

## Explanation frameworks

These are scaffolds, not scripts to memorize. Pick one, start with the answer,
and expand where useful. A brief question may need only a few steps. Store
keywords in the [answer bank](./INTERVIEW_ANSWER_BANK.md), then practice without them.

### Technical concept

Definition → Why it exists → How it works → Example → Tradeoff/limitation →
Real experience when applicable.

Lead with one simple definition. Show the mechanism through an example; include
personal experience only when it is true.

### X vs Y

Shared purpose → 2–3 important differences → Example → When each is appropriate.

Compare along the same dimensions, such as cost, behavior, or consistency.
Finish with a choice and the condition that makes it suitable.

### Architecture

Goal/constraints → Components → Request flow → Decision → Alternatives →
Failure/scaling considerations.

Explain one request through the components before listing implementation details.
Make the reason for each important choice clear.

### Debugging

Scope/impact → Evidence → Hypotheses → Isolation → Fix/mitigation → Verification →
Prevention.

Separate what you observed from what you suspected. For a hypothetical incident,
explain what you would check; for past work, explain what you actually checked.

### Project explanation

Context → Problem → Investigation → Decision → Implementation → Result → Learning.

State your own contribution and the evidence for the result. Use
[existing project prompts](../10-Projects.md) for deeper follow-ups.

### Behavioral

Situation → Task → Action → Result (STAR).

Keep context brief, spend most time on your actions, and add a lesson if relevant.
Choose a real prompt from [behavioral preparation](../12-Behavioral.md).

### System Design

Requirements → Scale where relevant → APIs → Data model → Architecture →
Request flow → Bottlenecks → Reliability → Tradeoffs.

Ask clarifying questions, state assumptions, and explain how a changed constraint
would affect the design. Estimate scale when it changes a decision.

### DSA

Clarify → Brute force → Optimization/invariant → Data structure → Example →
Time/space complexity → Edge cases → Code/test while communicating.

Start by explaining a finished solution; progress to explaining before coding,
then thinking aloud while solving. Say why an operation is safe, what remains
true, and what you will test. Narrate decisions rather than every keystroke.

## Useful phrases and answer cues

Use one or two [technical phrases](./TECHNICAL_PHRASES.md) in an actual answer.
Keep [answer-bank entries](./INTERVIEW_ANSWER_BANK.md) to short bullets with an
example, tradeoff, follow-ups, and the last speaking weakness. Rephrase on each
attempt rather than rehearsing a paragraph word for word.

For your introduction, practice 30-, 60-, and 90-second variants from verified
facts. For each project, practice a 30-second summary, two-minute explanation,
and five-minute deep dive. No need to write all variants during daily logging.

## Recording practice

Start **twice per week**, using a question already selected for daily speaking:

1. Record one 2–5-minute answer on a phone or local computer.
2. Listen once; identify no more than two or three improvements.
3. Answer again, concentrating on those improvements.

Cap listening and analysis at about five minutes. Use the longer 20–30-minute
mode if needed. Keep media outside the repository and out of Git. A short
feedback note in TODAY or an existing [mock record](../Mock-Interviews/README.md)
is enough; no new recording tracker is required.

## Communication metrics

For normal daily practice, record just:

- **Could explain without notes:** Yes / Partially / No.
- **Communication obstacle:** one short note, or none.
- **Confidence:** 1–5.

“Yes” means the main idea and example were clear after putting keywords away.
“Partially” means you explained some points but needed prompts or lost structure.
“No” means you could not give a coherent explanation without notes. Check
technical accuracy against the reference before choosing the outcome.
TODAY also has brief gap/phrase/review fields; do not write a transcript.

Use the following rubric only for occasional recordings or mocks:

| Metric | Scale | What to observe |
| --- | --- | --- |
| Clarity | 1–5 | Can a listener restate the main point and example? |
| Structure | 1–5 | Is the answer easy to follow from opening to conclusion? |
| Technical Accuracy | 1–5 | Are the mechanism, example, and limitations correct? |
| Fluency | 1–5 | Can you continue with understandable sentences and reasonable pauses? |
| Confidence | 1–5 | How comfortable do you feel starting and handling follow-ups? |
| Filler Words | Low / Medium / High | Do repeated fillers distract from the explanation? |
| Needed Notes | Yes / No | Did you depend on reference material or keyword prompts? |

For the 1–5 scales, 1 indicates a blocking difficulty, 3 means usable with gaps,
and 5 means consistently strong for that metric. Confidence is a self-rating;
it does not prove accuracy. Track clarity, not accent or perfect grammar.

## Keep maintenance small

Choose tasks in about 30 seconds and log results in 60–90 seconds; tick boxes
during the practice. Reuse TODAY, retaining any pending speaking review before
clearing old fields. No daily answer-bank entry or recording is required.

Focus on clear explanation, correct technical words, logical structure,
confidence, and fluency. Fix grammar when it obscures meaning, ownership, or
the sequence of events. A brief pause and a short sentence are useful tools.
Use only true personal facts; anonymize work examples and avoid confidential details.

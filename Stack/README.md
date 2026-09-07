# Stack

## Pattern

LIFO (last in, first out). Use it for anything with nesting or matching
(parentheses, expression evaluation), and for the "monotonic stack" trick —
keep the stack strictly increasing or decreasing to answer "next greater/
smaller element" style questions in one pass.

**Recognize it when:** "valid parentheses/brackets", "next greater element",
"evaluate an expression", "undo the last operation".

**Template:**
```js
const stack = [];
for (let i = 0; i < nums.length; i++) {
  while (stack.length && nums[stack[stack.length - 1]] < nums[i]) {
    const idx = stack.pop();
    // nums[i] is the next greater element for index `idx`
  }
  stack.push(i);
}
```

**Complexity:** O(n) — even with the inner while loop, each index is pushed
and popped at most once across the whole run.

**Watch out for:** deciding whether to store values or indices on the stack
(indices let you compute distances/positions afterward); an empty-stack pop
usually signals invalid input (e.g. unmatched closing bracket).

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Valid Parentheses](./valid-parentheses.js)
- [Min Stack](./min-stack.js)
- [Evaluate Reverse Polish Notation](./evaluate-reverse-polish-notation.js)
- [Daily Temperatures](./daily-temperatures.js)
- [Car Fleet](./car-fleet.js)
- [Largest Rectangle in Histogram](./largest-rectangle-in-histogram.js)
- [Baseball Game](./baseball-game.js)
- [Remove All Adjacent Duplicates In String](./remove-all-adjacent-duplicates-in-string.js)
- [Implement Stack using Queues](./implement-stack-using-queues.js)

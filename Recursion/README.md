# Recursion

## Pattern

A function that calls itself on a smaller version of the same problem, with
a base case that stops the recursion. This is the foundation Trees,
Backtracking, Graph DFS, and Dynamic Programming are all built on — get
comfortable here on tiny examples before those topics add extra structure
on top.

**Recognize it when:** the problem can be restated as "the answer for n,
given the answer for a smaller n"; traversing a structure that contains
smaller versions of itself (a tree, nested lists, a graph).

**Template:**
```js
function solve(n) {
  if (n <= 1) return n;          // base case — stops the recursion
  return solve(n - 1) + solve(n - 2); // recursive case — smaller subproblem
}
```

**Complexity:** depends entirely on the branching factor and depth — a
single recursive call per step is O(n); two calls per step (like naive
Fibonacci) is O(2^n) unless memoized.

**Watch out for:** a missing or wrong base case causes infinite recursion
until the call stack overflows (Node throws a `RangeError` around 10-15k
frames deep); redoing the same subproblem repeatedly without caching is
the exact problem Dynamic Programming's memoization solves — trace through
naive Fibonacci by hand for n = 5 and count the repeated calls.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Factorial](./factorial.js)
- [Fibonacci Number](./fibonacci.js)
- [Sum of Array (Recursive)](./sum-of-array.js)

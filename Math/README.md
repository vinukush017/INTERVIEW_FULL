# Math

## Pattern

A catch-all for number-theory and simulation problems that don't fit a
bigger pattern: in-place matrix rotation (rotate layer by layer), digit
manipulation, and cycle detection on a sequence of computed values (reuse
the fast/slow pointer idea from LinkedList, applied to numbers instead of
nodes).

**Recognize it when:** "rotate a matrix in place", "multiply large numbers
represented as strings", "does this sequence of digit operations cycle or
reach 1" (Happy Number).

**Template (in-place matrix rotation, one layer):**
```js
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]]; // transpose
  }
}
matrix.forEach((row) => row.reverse()); // then reverse each row
```

**Complexity:** usually O(n) or O(n^2) for matrix-sized problems.

**Watch out for:** JS numbers are IEEE-754 doubles — they don't overflow the
way fixed-width integers do, but they lose precision past 2^53, which is
exactly why "Multiply Strings" avoids native multiplication and simulates
grade-school long multiplication with digit arrays instead.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Happy Number](./happy-number.js)
- [Plus One](./plus-one.js)
- [Rotate Image](./rotate-image.js)
- [Pow(x, n)](./pow-x-n.js)
- [Multiply Strings](./multiply-strings.js)
- [Reverse Integer](./reverse-integer.js)
- [Palindrome Number](./palindrome-number.js)
- [FizzBuzz](./fizzbuzz.js)
- [Excel Sheet Column Number](./excel-sheet-column-number.js)
- [Add Digits](./add-digits.js)

# Bit Manipulation

## Pattern

Use XOR/AND/OR/shifts to do in O(1) extra space what a hash set would do in
O(n). XOR cancels identical pairs to zero (useful for "find the single/
missing number"); `x & (x - 1)` clears the lowest set bit, which is the core
trick behind most "count the bits" problems.

**Recognize it when:** "without using extra space", "find the single/
missing number among duplicates", "count set bits", "is it a power of two".

**Template:**
```js
let result = 0;
for (const n of nums) result ^= n; // pairs cancel, one value survives
```

**Complexity:** O(n) for a single pass, or O(log(max value)) for anything
that walks bit by bit.

**Watch out for:** JavaScript's bitwise operators (`&`, `|`, `^`, `<<`,
`>>`) work on 32-bit signed integers — numbers outside that range silently
wrap, so bit tricks aren't safe for arbitrarily large values without extra
care (`>>>` for unsigned shifts, or `BigInt` beyond 32 bits).

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Single Number](./single-number.js)
- [Number of 1 Bits](./number-of-1-bits.js)
- [Counting Bits](./counting-bits.js)
- [Reverse Bits](./reverse-bits.js)
- [Missing Number](./missing-number.js)
- [Sum of Two Integers](./sum-of-two-integers.js)
- [Hamming Distance](./hamming-distance.js)
- [Binary Number with Alternating Bits](./binary-number-with-alternating-bits.js)
- [Complement of Base 10 Integer](./complement-of-base-10-integer.js)

# String

## Pattern

Treat a string as an array of characters. Most string problems reuse array
traversal, two pointers, or a frequency map; palindrome problems add
"expand around center" (grow outward from each possible middle).

**Recognize it when:** "substring", "palindrome", "encode/decode a list of
strings", "compress repeated characters".

**Template:**
```js
function expand(s, left, right) {
  while (left >= 0 && right < s.length && s[left] === s[right]) {
    left--; right++;
  }
  return s.slice(left + 1, right);
}
```

**Complexity:** O(n) for a single traversal; O(n^2) for palindrome expansion
across every center (O(n) with Manacher's algorithm, rarely needed at this
level).

**Watch out for:** JS strings are immutable — build results with an array and
`.join("")` rather than repeated concatenation in a hot loop; a palindrome
has two possible centers (odd-length and even-length), so expand from both.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Longest Palindromic Substring](./longest-palindromic-substring.js)
- [Palindromic Substrings](./palindromic-substrings.js)
- [Encode and Decode Strings](./encode-and-decode-strings.js)
- [String Compression](./string-compression.js)
- [Reverse String](./reverse-string.js)
- [Reverse Words in a String](./reverse-words-in-a-string.js)
- [Find the Index of the First Occurrence in a String](./find-the-index-of-the-first-occurrence-in-a-string.js)
- [Longest Common Prefix](./longest-common-prefix.js)
- [Roman to Integer](./roman-to-integer.js)
- [Isomorphic Strings](./isomorphic-strings.js)

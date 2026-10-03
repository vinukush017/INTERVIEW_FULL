# Sliding Window

## Pattern

Maintain a window `[left, right]` over the array/string. Expand `right` every
step; shrink `left` only while the window breaks some condition. This turns
"best contiguous range" problems from O(n^2) into O(n), since each pointer
only moves forward.

**Recognize it when:** "longest/shortest substring or subarray with a
condition", "at most k distinct characters", "max/sum in every window of
size k".

**Template:**
```js
let left = 0, best = 0;
const freq = new Map();
for (let right = 0; right < s.length; right++) {
  freq.set(s[right], (freq.get(s[right]) || 0) + 1);
  while (/* window invalid */ false) {
    freq.set(s[left], freq.get(s[left]) - 1);
    left++;
  }
  best = Math.max(best, right - left + 1);
}
```

**Complexity:** O(n) — each index enters and leaves the window at most once,
so it's amortized linear even though there's a nested-looking loop.

**Watch out for:** stating the shrink condition precisely before coding
(what exactly makes the window invalid?); fixed-size windows need `right -
left + 1 === k`, not a while-loop shrink.

---

Open a question, write the solution, add test cases, and record time and space complexity. Track completion only in [01-DSA-Questions.md](../01-DSA-Questions.md).

- [Best Time to Buy and Sell Stock](./best-time-to-buy-and-sell-stock.js)
- [Longest Substring Without Repeating Characters](./longest-substring-without-repeating-characters.js)
- [Longest Repeating Character Replacement](./longest-repeating-character-replacement.js)
- [Permutation in String](./permutation-in-string.js)
- [Minimum Window Substring](./minimum-window-substring.js)
- [Sliding Window Maximum](./sliding-window-maximum.js)

- [Maximum Average Subarray I](./maximum-average-subarray-i.js)

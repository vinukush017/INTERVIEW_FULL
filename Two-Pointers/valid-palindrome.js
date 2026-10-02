/**
 * Problem: Valid Palindrome
 * Topic: Two Pointers
 * LeetCode search: https://leetcode.com/search/?q=Valid%20Palindrome
 *
 * Description:
 * Given a string, ignore non-alphanumeric characters and letter case, then determine whether it reads the same forward and backward.
 *
 * Example:
 * Input: s = "A man, a plan, a canal: Panama"
 * Output: true
 *
 * Before coding:
 * - Identify the exact value or structure that must be returned.
 * - Consider empty, smallest, duplicate, and boundary inputs when valid.
 * - Do not fill in the notes below until you finish your first attempt.
 * - For a fresh reattempt, hide the repaired code and post-solve notes first.
 */

function solve(string) {
  let left = 0;
  let right = string.length - 1;

  const isAlphanumeric = (char) => /[a-zA-Z0-9]/.test(char);

  while (left < right) {
    while (left < right && !isAlphanumeric(string[left])) {
      left++;
    }
    while (left < right && !isAlphanumeric(string[right])) {
      right--;
    }

    if (left >= right) return true;

    if (string[left].toUpperCase() === string[right].toUpperCase()) {
      left++;
      right--;
    } else {
      return false;
    }
  }
  return true;
}

/*
 * Complete only after solving:
 *
 * Approach:
 * Move inward from both ends, skipping non-ASCII-alphanumeric characters.
 * Compare remaining characters without regard to case; reject a mismatch.
 * Invariant: every pair outside the remaining window has already matched.
 * Guard every skip with left < right, then stop if the pointers meet.
 * A cleaned/reversed-string approach also works but allocates O(n) space;
 * this approach uses indexes and only converts individual characters.
 * Example: ".," skips to a meeting point and returns true without comparing.
 *
 * Time complexity:
 * O(n); each pointer moves in only one direction across n characters.
 *
 * Space complexity:
 * O(1) auxiliary space, with no cleaned copy of the input.
 *
 * Mistakes or lessons:
 * PR 2 repair: punctuation-only input previously ran beyond valid indexes
 * and called toUpperCase() on undefined. Check bounds inside skip loops,
 * not just the outer loop. Empty/punctuation-only strings are palindromes.
 * The character predicate follows the existing ASCII letters/digits scope.
 * Repair/tests do not establish an independent user re-solve or mastery.
 */

// Tests: npm test -- Two-Pointers/valid-palindrome

module.exports = solve;

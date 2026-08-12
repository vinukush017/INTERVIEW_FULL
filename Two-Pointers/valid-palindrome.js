/**
 * Problem: Valid Palindrome
 * Topic: Two Pointers
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
 */

function solve(string) {
  // Write your solution here.
  let left = 0;
  let right = string.length - 1;

  const checkChar = (char) => /[^a-zA-Z0-9]/.test(char);

  while (left < right) {
    while (checkChar(string[left])) {
      left++;
    }
    while (checkChar(string[right])) {
      right--;
    }

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
 *
 * Time complexity:
 *
 * Space complexity:
 *
 * Mistakes or lessons:
 */

// Add test cases after solving.

module.exports = solve;

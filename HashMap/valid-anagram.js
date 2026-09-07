/**
 * Problem: Valid Anagram
 * Topic: HashMap
 * LeetCode search: https://leetcode.com/search/?q=Valid%20Anagram
 *
 * Description:
 * Given two strings, return true when one string can be rearranged to form the other using every character exactly once.
 *
 * Example:
 * Input: s = "anagram", t = "nagaram"
 * Output: true
 *
 * Before coding:
 * - Identify the exact value or structure that must be returned.
 * - Consider empty, smallest, duplicate, and boundary inputs when valid.
 * - Do not fill in the notes below until you finish your first attempt.
 */

function solve(string1, string2) {
  // Write your solution here.
  if (string1.length !== string2.length) {
    return false;
  }

  const count = new Map();
  for (let i = 0; i < string1.length; i++) {
    count.set(string1[i], (count.get(string1[i]) || 0) + 1);
  }

  for (let j = 0; j < string2.length; j++) {
    if (count.get(string2[j]) > 0) {
      count.set(string2[j], count.get(string2[j]) - 1);
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

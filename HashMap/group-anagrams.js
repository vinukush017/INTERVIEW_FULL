/**
 * Problem: Group Anagrams
 * Topic: HashMap
 * LeetCode search: https://leetcode.com/search/?q=Group%20Anagrams
 *
 * Description:
 * Given an array of strings, group together strings that contain the same characters with the same frequencies. Group order does not matter.
 *
 * Example:
 * Input: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
 * Output: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]]
 *
 * Before coding:
 * - Identify the exact value or structure that must be returned.
 * - Consider empty, smallest, duplicate, and boundary inputs when valid.
 * - Do not fill in the notes below until you finish your first attempt.
 */

function solve(array) {
  const labelMap = new Map();

  for (let word of array) {
    let label = [];
    for (let char of word) {
      label.push(char);
    }

    const labelKey = label.sort().join("");
    const existing = labelMap.get(labelKey);

    if (existing) {
      labelMap.set(labelKey, [...existing, word]);
    } else {
      labelMap.set(labelKey, [word]);
    }
  }
  return [...labelMap.values()];
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

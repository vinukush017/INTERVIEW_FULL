/**
 * Problem: Two Sum II - Input Array Is Sorted
 * Topic: Two Pointers
 * LeetCode search: https://leetcode.com/search/?q=Two%20Sum%20II%20-%20Input%20Array%20Is%20Sorted
 *
 * Description:
 * Given a 1-indexed array sorted in non-decreasing order and a target, return the positions of two different values whose sum is the target.
 *
 * Example:
 * Input: numbers = [2, 7, 11, 15], target = 9
 * Output: [1, 2]
 *
 * Before coding:
 * - Identify the exact value or structure that must be returned.
 * - Consider empty, smallest, duplicate, and boundary inputs when valid.
 * - Do not fill in the notes below until you finish your first attempt.
 */

function solve(arr, target) {
  // Write your solution here.
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    let sum = arr[left] + arr[right];
    if (sum > target) {
      right--;
    } else if (sum < target) {
      left++;
    } else {
      return [left + 1, right + 1];
    }
  }
  return false;
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

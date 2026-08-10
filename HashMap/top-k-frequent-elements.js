/**
 * Problem: Top K Frequent Elements
 * Topic: HashMap
 *
 * Description:
 * Given an integer array and k, return the k values that occur most frequently. The answer is guaranteed to be unique.
 *
 * Example:
 * Input: nums = [1, 1, 1, 2, 2, 3], k = 2
 * Output: [1, 2]
 *
 * Before coding:
 * - Identify the exact value or structure that must be returned.
 * - Consider empty, smallest, duplicate, and boundary inputs when valid.
 * - Do not fill in the notes below until you finish your first attempt.
 */

function topKFrequent(nums, k) {
  const frequency = new Map();

  for (const num of nums) {
    frequency.set(num, (frequency.get(num) || 0) + 1);
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => num);
}

// Test case
const nums = [1, 1, 1, 2, 2, 3, 3, 3, 3];
const k = 2;

console.log(topKFrequent(nums, k)); // [3, 1]

/*
 * Completed approach:
 * 1. Count each number using a Map.
 * 2. Sort entries by decreasing frequency.
 * 3. Return the first k numbers.
 *
 * Time complexity: O(n + m log m)
 * Space complexity: O(m)
 * m = number of unique values
 */

module.exports = topKFrequent;

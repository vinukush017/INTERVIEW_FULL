/**
 * Problem: Product of Array Except Self
 * Topic: Arrays
 * LeetCode search: https://leetcode.com/search/?q=Product%20of%20Array%20Except%20Self
 *
 * Description:
 * Given an integer array, return an array where each position contains the product of every other value. Do not use division.
 *
 * Example:
 * Input: nums = [1, 2, 3, 4]
 * Output: [24, 12, 8, 6]
 *
 * Before coding:
 * - Identify the exact value or structure that must be returned.
 * - Consider empty, smallest, duplicate, and boundary inputs when valid.
 * - Do not fill in the notes below until you finish your first attempt.
 * - For a fresh reattempt, hide the repaired code and post-solve notes first.
 */

function solve(arr) {
  const products = new Array(arr.length);
  let prefix = 1;

  for (let i = 0; i < arr.length; i++) {
    products[i] = prefix;
    prefix *= arr[i];
  }

  let suffix = 1;
  for (let i = arr.length - 1; i >= 0; i--) {
    const product = products[i] * suffix;
    products[i] = product === 0 ? 0 : product; // Normalize JavaScript's -0.
    suffix *= arr[i];
  }

  return products;
}

/*
 * Complete only after solving:
 *
 * Approach:
 * Store the product strictly to the left of each index in the output array.
 * Walk backward, multiplying by the product strictly to its right.
 * Update each running product AFTER using it, so arr[i] is excluded.
 * Unlike the O(n^2) approach of multiplying all other values for each index,
 * these two passes reuse work without division or special zero handling.
 * For [1,2,3,4], left products [1,1,2,6] become [24,12,8,6].
 * Key insight: everything except self = left product * right product.
 *
 * Time complexity:
 * O(n), two passes over n values.
 *
 * Space complexity:
 * O(1) auxiliary space excluding the O(n) returned array; input is unchanged.
 *
 * Mistakes or lessons:
 * PR 2 repair: the previously checked implementation returned the input.
 * A completion mark is not correctness evidence; test expected output first.
 * This repair is not evidence of an independent user re-solve or mastery.
 * Check one zero, multiple zeros, and negative values. Empty input returns [];
 * a singleton returns [1] using the empty-product convention. Arithmetic
 * assumes integer products remain within JavaScript's safe-integer range.
 */

// Tests: npm test -- Arrays/product-of-array-except-self

module.exports = solve;

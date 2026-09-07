/**
 * Problem: Contains Duplicate
 * Topic: HashMap
 * LeetCode search: https://leetcode.com/search/?q=Contains%20Duplicate
 *
 * Description:
 * Given an integer array, return true when any value appears more than once; otherwise return false.
 *
 * Example:
 * Input: nums = [1, 2, 3, 1]
 * Output: true
 *
 * Before coding:
 * - Identify the exact value or structure that must be returned.
 * - Consider empty, smallest, duplicate, and boundary inputs when valid.
 * - Do not fill in the notes below until you finish your first attempt.
 */

function solve(arr) {
  const seen = new Map()
    
    for(let i = 0; i < arr.length ; i++){
        if(seen.has(arr[i])){
            return true
        }else{
            seen.set(arr[i], 0)
        }
    }
    return false
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

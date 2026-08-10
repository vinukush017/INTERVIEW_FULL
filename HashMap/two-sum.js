/**
 * Problem: Two Sum
 * Topic: HashMap
 *
 * Description:
 * Given an integer array and a target, return the indices of two different elements whose sum equals the target. Exactly one valid answer exists.
 *
 * Example:
 * Input: nums = [2, 7, 11, 15], target = 9
 * Output: [0, 1]
 *
 * Before coding:
 * - Identify the exact value or structure that must be returned.
 * - Consider empty, smallest, duplicate, and boundary inputs when valid.
 * - Do not fill in the notes below until you finish your first attempt.
 */

function solve(arr, target) {
  const dict = new Map()
   for (let i =0 ; i < arr.length; i++){
       let req = target - arr[i]
       if(dict.has(req)){
           return [dict.get(req),i]
       }
       dict.set(arr[i],i)
   }
  return [];

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

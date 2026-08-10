module.exports = async function runTwoSumTests({ solution: twoSum, test, assert }) {
  assert.equal(
    typeof twoSum,
    "function",
    "two-sum.js must export the Two Sum function"
  );

  const cases = [
    { nums: [2, 7, 11, 15], target: 22 },
    { nums: [2, 7, 11, 15], target: 9 },
    { nums: [3, 2, 4], target: 6 },
    { nums: [3, 3], target: 6 },
    { nums: [-3, 4, 3, 90], target: 0 },
    { nums: [0, 4, 3, 0], target: 0 },
  ];

  for (const { nums, target } of cases) {
    await test(`nums=${JSON.stringify(nums)}, target=${target}`, () => {
      const input = [...nums];
      const answer = twoSum(input, target);

      assert.deepEqual(input, nums, "The input array must not be changed");
      assert.ok(Array.isArray(answer), "The answer must be an array");
      assert.equal(answer.length, 2, "The answer must contain two indices");

      const [firstIndex, secondIndex] = answer;
      assert.ok(Number.isInteger(firstIndex), "The first index must be an integer");
      assert.ok(Number.isInteger(secondIndex), "The second index must be an integer");
      assert.notEqual(firstIndex, secondIndex, "The indices must be different");
      assert.ok(firstIndex >= 0 && firstIndex < nums.length, "The first index is invalid");
      assert.ok(secondIndex >= 0 && secondIndex < nums.length, "The second index is invalid");
      assert.equal(
        nums[firstIndex] + nums[secondIndex],
        target,
        "The values at the returned indices do not equal the target"
      );
    });
  }
};

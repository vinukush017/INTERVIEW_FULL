module.exports = async function runProductTests({ solution: productExceptSelf, test, assert }) {
  assert.equal(typeof productExceptSelf, "function");

  const cases = [
    { nums: [1, 2, 3, 4], expected: [24, 12, 8, 6] },
    { nums: [-1, 1, 0, -3, 3], expected: [0, 0, 9, 0, 0] },
    { nums: [0, 0], expected: [0, 0] },
    { nums: [2, 3], expected: [3, 2] },
    { nums: [-1, 2, -3, 4], expected: [-24, 12, -8, 6] },
    { nums: [1, 1, 1], expected: [1, 1, 1] },
    { nums: [], expected: [] },
    { nums: [5], expected: [1] },
  ];

  for (const { nums, expected } of cases) {
    await test(`nums=${JSON.stringify(nums)}`, () => {
      const input = [...nums];
      assert.deepEqual(productExceptSelf(input), expected);
      assert.deepEqual(input, nums, "The input array must not be changed");
    });
  }
};

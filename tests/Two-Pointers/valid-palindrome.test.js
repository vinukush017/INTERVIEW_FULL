module.exports = async function runPalindromeTests({ solution: isPalindrome, test, assert }) {
  assert.equal(typeof isPalindrome, "function");

  const cases = [
    { input: ".,", expected: true },
    { input: "A man, a plan, a canal: Panama", expected: true },
    { input: "race a car", expected: false },
    { input: "", expected: true },
    { input: "   !!!", expected: true },
    { input: "...a...", expected: true },
    { input: "ab@", expected: false },
    { input: "1a2,2A1", expected: true },
    { input: "1,2", expected: false },
    { input: "0P", expected: false },
    { input: "12:21", expected: true },
  ];

  for (const { input, expected } of cases) {
    await test(`input=${JSON.stringify(input)}`, () => {
      assert.equal(isPalindrome(input), expected);
    });
  }
};

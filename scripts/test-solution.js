const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const repositoryRoot = path.resolve(__dirname, "..");

function fail(message) {
  throw new Error(message);
}

function getProblemPaths(problemArgument) {
  if (!problemArgument) {
    fail("Missing problem path. Example: node scripts/test-solution.js HashMap/two-sum");
  }

  const problemName = problemArgument.replace(/\.js$/, "");
  const solutionBase = path.resolve(repositoryRoot, problemName);
  const relativeBase = path.relative(repositoryRoot, solutionBase);

  if (
    relativeBase === "" ||
    relativeBase.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeBase)
  ) {
    fail("The problem path must be inside this repository.");
  }

  return {
    solutionPath: `${solutionBase}.js`,
    testPath: path.join(repositoryRoot, "tests", `${relativeBase}.test.js`),
    displayName: relativeBase,
  };
}

function requireExisting(filePath, description) {
  if (!fs.existsSync(filePath)) {
    fail(`${description} not found: ${path.relative(repositoryRoot, filePath)}`);
  }

  delete require.cache[require.resolve(filePath)];
  return require(filePath);
}

async function main() {
  const paths = getProblemPaths(process.argv[2]);
  const solution = requireExisting(paths.solutionPath, "Solution file");
  const runTests = requireExisting(paths.testPath, "Test file");

  if (typeof runTests !== "function") {
    fail("The test file must export a test function.");
  }

  let passedTests = 0;
  const test = async (name, testFunction) => {
    try {
      await testFunction();
      passedTests += 1;
      console.log(`PASS: ${name}`);
    } catch (error) {
      throw new Error(`FAIL: ${name}\n${error.message}`, { cause: error });
    }
  };

  await runTests({ solution, test, assert });

  if (passedTests === 0) {
    fail("The test file did not run any tests.");
  }

  console.log(`\nAll ${passedTests} tests passed for ${paths.displayName}.js.`);
}

main().catch((error) => {
  console.error(`\n${error.message}`);
  process.exitCode = 1;
});

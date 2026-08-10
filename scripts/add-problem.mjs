import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [, , folder, ...titleParts] = process.argv;
const title = titleParts.join(" ").trim();
if (!folder || !title) {
  console.error('Usage: node scripts/add-problem.mjs <Folder> "Problem name"');
  process.exit(1);
}
const slug = title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const directory = join(process.cwd(), folder);
const solution = join(directory, slug + ".js");
const readme = join(directory, "README.md");
const master = join(process.cwd(), "01-DSA-Questions.md");
mkdirSync(directory, { recursive: true });
if (!existsSync(solution)) {
  writeFileSync(solution, '/**\n * Problem: ' + title + '\n * Topic: ' + folder.replaceAll('-', ' ') + '\n *\n * Description:\n * Add a spoiler-free description of what the problem asks.\n *\n * Example:\n * Input:\n * Output:\n *\n * Constraints:\n * Add the important input rules and boundaries.\n */\n\nfunction solve(...args) {\n  // Write your solution here.\n  return args;\n}\n\n/*\n * Complete only after solving:\n *\n * Approach:\n *\n * Time complexity:\n *\n * Space complexity:\n *\n * Mistakes or lessons:\n */\n\n// Add test cases after solving.\n\nmodule.exports = solve;\n');
}
if (!existsSync(readme)) writeFileSync(readme, '# ' + folder.replaceAll('-', ' ') + '\n');
const line = '- [' + title + '](./' + slug + '.js)';
const current = await import("node:fs").then(({ readFileSync }) => readFileSync(readme, "utf8"));
if (!current.includes(line)) appendFileSync(readme, '\n' + line + '\n');
const masterLine = '- [ ] [' + title + '](./' + folder + '/' + slug + '.js)';
if (existsSync(master)) {
  const masterContent = await import("node:fs").then(({ readFileSync }) => readFileSync(master, "utf8"));
  if (!masterContent.includes(masterLine)) {
    const heading = masterContent.includes('## Added Problems') ? '' : '\n## Added Problems\n';
    appendFileSync(master, heading + '\n' + masterLine + '\n');
  }
}
console.log('Created ' + solution);

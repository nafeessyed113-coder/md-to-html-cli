import fs from "fs";
import { parseMarkdown } from "./parser.js";

const args = process.argv.slice(2);
const inputFile = args[0];
const outIndex = args.indexOf("-o");
const outputFile = outIndex !== -1 ? args[outIndex + 1] : null;

if (!inputFile) {
  console.error("Usage: node src/cli.js input.md -o output.html");
  process.exit(1);
}

const markdown = fs.readFileSync(inputFile, "utf-8");
const html = parseMarkdown(markdown);

if (outputFile) {
  fs.writeFileSync(outputFile, html);
  console.log(`Written to ${outputFile}`);
} else {
  console.log(html);
}
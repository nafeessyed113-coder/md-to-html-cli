import fs from "fs";
import { parseMarkdown, wrapStyled } from "./parser.js";

const args = process.argv.slice(2);
const inputFile = args[0];
const outIndex = args.indexOf("-o");
const outputFile = outIndex !== -1 ? args[outIndex + 1] : null;

if (!inputFile) {
  console.error("Usage: node src/cli.js input.md -o output.html");
  process.exit(1);
}

const markdown = fs.readFileSync(inputFile, "utf-8");
const bodyHtml = parseMarkdown(markdown);
const fullHtml = wrapStyled(bodyHtml);

if (outputFile) {
  fs.writeFileSync(outputFile, fullHtml);
  console.log(`Written to ${outputFile}`);
} else {
  console.log(fullHtml);
}
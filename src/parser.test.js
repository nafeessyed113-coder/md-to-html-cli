import { parseMarkdown } from "./parser.js";

const sample = `# Hello World

This is a **bold** and *italic* test.

## Subheading
Another paragraph here.`;

console.log(parseMarkdown(sample));
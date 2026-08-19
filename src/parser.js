export function parseMarkdown(markdown) {
  const lines = markdown.split("\n");
  const htmlLines = [];

  for (let line of lines) {
    // Headings: # H1, ## H2, ### H3
    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = inlineFormat(headingMatch[2]);
      htmlLines.push(`<h${level}>${text}</h${level}>`);
      continue;
    }

    // Empty line = paragraph break, skip
    if (line.trim() === "") {
      continue;
    }

    // Regular paragraph
    htmlLines.push(`<p>${inlineFormat(line)}</p>`);
  }

  return htmlLines.join("\n");
}

function inlineFormat(text) {
  // Bold: **text**
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic: *text*
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  return text;
}
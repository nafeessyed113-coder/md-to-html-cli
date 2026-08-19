export function parseMarkdown(markdown) {
  const lines = markdown.split("\n");
  const htmlLines = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        htmlLines.push(`<pre><code>${codeBuffer.join("\n")}</code></pre>`);
      }
      i++;
      continue;
    }
    if (inCodeBlock) {
      codeBuffer.push(escapeHtml(line));
      i++;
      continue;
    }

    // Table: header row, separator row, then data rows
    if (line.includes("|") && lines[i + 1] && /^[\s|:-]+$/.test(lines[i + 1])) {
      const headerCells = line.split("|").map(c => c.trim()).filter(Boolean);
      let tableHtml = "<table>\n<thead><tr>";
      tableHtml += headerCells.map(c => `<th>${inlineFormat(c)}</th>`).join("");
      tableHtml += "</tr></thead>\n<tbody>\n";
      i += 2;
      while (i < lines.length && lines[i].includes("|")) {
        const rowCells = lines[i].split("|").map(c => c.trim()).filter(Boolean);
        tableHtml += "<tr>" + rowCells.map(c => `<td>${inlineFormat(c)}</td>`).join("") + "</tr>\n";
        i++;
      }
      tableHtml += "</tbody>\n</table>";
      htmlLines.push(tableHtml);
      continue;
    }

    const headingMatch = line.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      htmlLines.push(`<h${level}>${inlineFormat(headingMatch[2])}</h${level}>`);
      i++;
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    htmlLines.push(`<p>${inlineFormat(line)}</p>`);
    i++;
  }

  return htmlLines.join("\n");
}

export function wrapStyled(bodyHtml) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: system-ui, sans-serif; max-width: 720px; margin: 40px auto; line-height: 1.6; color: #222; }
  pre { background: #f4f4f4; padding: 12px; border-radius: 6px; overflow-x: auto; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
  th { background: #f4f4f4; }
</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;
}

function inlineFormat(text) {
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  return text;
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
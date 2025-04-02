/**
 * Utility functions for text processing and encoding
 */

/**
 * Encodes HTML entities to prevent XSS attacks
 * @param text Input text to encode
 * @returns HTML-encoded string
 */
export function encodeHtml(text: string): string {
  if (!text) return "";

  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Converts basic markdown to HTML
 * @param markdown Input markdown text
 * @returns HTML string
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  let html = markdown;

  // Handle code blocks
  html = html.replace(/```([^`]*?)```/gs, "<pre><code>$1</code></pre>");

  // Handle inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Handle tables
  html = html.replace(
    /^\|(.*)\|\r?\n\|([-:\|\s]+)\|\r?\n((?:\|.*\|\r?\n?)+)/gm,
    (match, header, separator, rows) => {
      const headerCells = header
        .split("|")
        .map((cell) => cell.trim())
        .filter(Boolean)
        .map((cell) => `<th>${cell}</th>`)
        .join("");

      const bodyRows = rows
        .trim()
        .split(/\r?\n/)
        .map((row) => {
          const cells = row
            .split("|")
            .map((cell) => cell.trim())
            .filter(Boolean)
            .map((cell) => `<td>${cell}</td>`)
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");

      return `<table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>`;
    }
  );

  // Convert headers: # Header -> <h1>Header</h1>
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^###### (.+)$/gm, "<h6>$1</h6>");

  // Convert blockquotes
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

  // Convert bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Convert italic: *text* -> <em>text</em>
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Convert strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Convert images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

  // Convert horizontal rules
  html = html.replace(/^([-*_])\1{2,}$/gm, "<hr>");

  // Convert ordered lists
  let hasOrderedList = false;
  html = html.replace(/^(\d+\.\s.+)$/gm, (match) => {
    hasOrderedList = true;
    return "<li>" + match.replace(/^\d+\.\s/, "") + "</li>";
  });
  if (hasOrderedList) {
    html = html.replace(/(<li>.*<\/li>)/s, "<ol>$1</ol>");
  }

  // Convert unordered lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  if (html.includes("<li>") && !hasOrderedList) {
    html = html.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");
  }

  // Convert newlines to <br> tags
  html = html.replace(/\n/g, "<br>");

  return html;
}

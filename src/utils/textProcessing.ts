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

  // Convert headers: # Header -> <h1>Header</h1>
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");

  // Convert bold: **text** -> <strong>text</strong>
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Convert italic: *text* -> <em>text</em>
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Convert lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");

  // Wrap list items in <ul> tags (simplistic approach)
  if (html.includes("<li>")) {
    html = "<ul>" + html + "</ul>";
  }

  // Convert newlines to <br> tags
  html = html.replace(/\n/g, "<br>");

  return html;
}

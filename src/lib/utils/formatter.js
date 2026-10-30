// A custom formatter for Markdown that works with textarea components.
export function createTextFormatter(element, value) {
  // Handles cursor placement based on whether text was selected or not.
  function formatText(prefix, suffix = "", placeholder = "", cursorOffset = 0) {
    if (!element) return value;

    const start = element.selectionStart;
    const end = element.selectionEnd;
    const selectedText = value.substring(start, end);
    const content = selectedText || placeholder;
    const formatted = `${prefix}${content}${suffix}`;
    const newText = value.substring(0, start) + formatted + value.substring(end);

    let newCursorPos;

    if (selectedText) {
      newCursorPos = start + formatted.length + cursorOffset;
    } else {
      newCursorPos = start + prefix.length + cursorOffset;
    }

    element.setSelectionRange(newCursorPos, newCursorPos);
    element.focus();

    return newText;
  }

  return {
    // Direct access to the base formatter for custom operations
    format: formatText,

    // General Markdown
    bold: () => formatText("**", "**", ""),
    italic: () => formatText("*", "*", ""),
    strikethrough: () => formatText("~~", "~~", ""),
    code: () => formatText("`", "`", ""),
    codeBlock: (language = "html") => formatText(`\`\`\`${language}\n`, "\n\`\`\`", ""),
    heading: (level = 1) => {
      const hashes = "#".repeat(Math.min(Math.max(level, 1), 6));
      return formatText(`${hashes} `, "", "");
    },
    bulletList: () => formatText("- ", "", ""),
    numberedList: () => formatText("1. ", "", ""),
    blockquote: () => formatText("> ", "", ""),
    hr: () => formatText("\n---\n", "", "", 0),

    // HTML
    underline: () => formatText("<u>", "</u>", ""),
    mark: () => formatText("<mark>", "</mark>", ""),

    // Links
    link: (url = "") => formatText("[", `](${url})`, "", -1),

    // Media
    imageMd: (url = "", alt = "") => formatText(`![${alt}](`, ")", url),
    imageHtml: (url = "", alt = "") => formatText(`<img src="${url}" alt="${alt}" />`),
    audio: (src = "") => formatText(`<audio src="${src}">`, "</audio>", src),
  };
}

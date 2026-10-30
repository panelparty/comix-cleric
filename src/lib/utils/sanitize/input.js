// -- Utilities for cleaning up raw user input before storing or displaying it -- //
// TODO: Check if still needed

// Replaces HTML special characters with safe equivalents
export const sanitizeInput = (str) => {
  if (typeof str !== "string") return "";

  return str.replace(
    /[&<>"'/]/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "/": "&#x2F;",
      })[char],
  );
};

// Replaces every non-space character with a bullet dot useful for hiding sensitive text in the UI.
export function redact(str) {
  return str.replace(/[^\s]/g, "•");
}

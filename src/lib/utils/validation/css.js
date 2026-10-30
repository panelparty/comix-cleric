// -- This file contains CSS sanitization methods, utilities, and helpers. -- //

// CSS Tree (sanitizer) import
import * as csstree from "css-tree";

// Formatter for the output
import prettier from "prettier";
import { consoleError } from "../debug";

// Helper to add newlines between blocks
function addSpacing(css) {
  const lines = css.split("\n");
  const result = [];
  let depth = 0;

  for (const line of lines) {
    const opens = (line.match(/{/g) || []).length;
    const closes = (line.match(/}/g) || []).length;
    const prevDepth = depth;
    depth += opens - closes;

    result.push(line);

    const closesFirstLevel = prevDepth === 1 && depth === 0;
    const isFirstLevel = depth === 0 && /^\s*@\w+.*;\s*$/.test(line);

    if (closesFirstLevel || isFirstLevel) {
      result.push("");
    }
  }

  return result.join("\n");
}

// Exported function that sanitizes CSS input by parsing and removing dangerous patterns
export async function sanitizeCSS(cssInput) {
  if (!cssInput || typeof cssInput !== "string") {
    return "";
  }

  try {
    // Parse the CSS
    const ast = csstree.parse(cssInput);

    // Allowed font import domains
    const allowedFontDomains = [
      "fonts.googleapis.com",
      "fonts.gstatic.com",
      "use.typekit.net",
      "fonts.bunny.net",
      "api.fonts.coollabs.io",
      "use.fontawesome.com",
    ];

    // Walk through the AST and validate/remove dangerous nodes
    csstree.walk(ast, {
      visit: "Atrule",
      enter(node, item, list) {
        const ruleName = node.name.toLowerCase();

        if (ruleName === "import") {
          // Extract the URL from @import
          let importUrl = "";

          csstree.walk(node, {
            visit: "String",
            enter(stringNode) {
              importUrl = stringNode.value.toLowerCase();
            },
          });

          csstree.walk(node, {
            visit: "Url",
            enter(urlNode) {
              importUrl = urlNode.value.toLowerCase();
            },
          });

          let importHostname = "";
          try {
            importHostname = new URL(importUrl).hostname;
          } catch {
            // Malformed URL block it
            if (list) list.remove(item);
            return;
          }

          // Check if the import URL is from an allowed domain
          const isAllowedDomain = allowedFontDomains.some((domain) =>
            importHostname === domain || importHostname.endsWith(`.${domain}`)
          );

          if (!isAllowedDomain) {
            // Remove @import if not from trusted font provider
            if (list) list.remove(item);
          }
        }

        // Block other potentially dangerous at-rules
        const blockedAtRules = ["charset", "namespace"];
        if (blockedAtRules.includes(ruleName)) {
          if (list) list.remove(item);
        }
      },
    });

    csstree.walk(ast, {
      visit: "Url",
      enter(node, item, list) {
        const urlValue = node.value.toLowerCase();

        // Safe data sources
        const safeData =
          urlValue.startsWith("data:image/") ||
          urlValue.startsWith("data:font/") ||
          urlValue.startsWith("data:application/font") ||
          urlValue.startsWith("data:application/x-font") ||
          urlValue.startsWith("data:application/vnd.ms-fontobject");

        if (urlValue.startsWith("data:") && !safeData) {
          if (list) list.remove(item);
        }

        // Block javascript: and vbscript: URLs
        if (
          urlValue.includes("javascript:") ||
          urlValue.includes("vbscript:")
        ) {
          if (list) list.remove(item);
          return;
        }

        // Block data: URLs except safe images
        if (
          urlValue.startsWith("data:") &&
          !urlValue.startsWith("data:image/")
        ) {
          if (list) list.remove(item);
        }
      },
    });

    csstree.walk(ast, {
      visit: "Function",
      enter(node, item, list) {
        const funcName = node.name.toLowerCase();

        // Block dangerous functions
        const blockedFunctions = ["expression"];

        if (blockedFunctions.includes(funcName)) {
          if (list) list.remove(item);
        }
      },
    });

    csstree.walk(ast, {
      visit: "Declaration",
      enter(node, item, list) {
        const propName = node.property.toLowerCase();

        const blockedProperties = ["behavior", "-moz-binding"];

        if (blockedProperties.includes(propName)) {
          if (list) list.remove(item);
        }
      },
    });

    // Generated final clean CSS tree.
    const generated = csstree.generate(ast, { sourceMap: false });

    // Uses `prettier` to reformat the code.
    const prettified = await prettier.format(generated, {
      parser: "css",
    });

    // Adds newlines between code blocks
    const lineSpace = addSpacing(prettified);

    // Return final formatted CSS
    return lineSpace.trim();
  } catch (e) {
    consoleError("CSS parsing error:", e);
    return "";
  }
}

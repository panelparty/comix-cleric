// Functions and utilities for sanitizing Markdown/HTML
// WARNING: When modifying this file, be sure to use you best judgement when allowing certain HTML to be rendered.
// Read documentation about XSS attacks and their common vectors.

// Utilities
import { marked } from 'marked';
import slugify from "@sindresorhus/slugify";
import DOMPurify from "isomorphic-dompurify";
import { highlighterPromise } from '$lib/utils/highlighter.js';
import { consoleError } from '../debug';

// Comment formats
// TODO: Do we actually need this?
const commentSyntax = {
  javascript: '//',
  js: '//',
  typescript: '//',
  ts: '//',
  svelte: '<!--',
  html: '<!--',
  css: '/*',
  json: '//'
};

// Tags listed will not be stripped when parsing
const allowedTags = [
  // Basic
  "div", "colgroup", "col", "aside",
  "section", "article", "figure", "figcaption",
  "header", "hgroup", "footer", "details", "summary",
  // Typography
  "p", "a", "i", "br", "strong", "em", "u", "strike", "s",
  "h1", "h2", "h3", "h4", "h5", "h6", "sub", "sup",
  "span", "small", "ul", "ol", "li", "hr", "abbr",
  "blockquote", "del", "samp", "var",
  "acronym", "cite", "fieldset", "legend",
  // Code
  "code", "pre",
  // Media
  "img", "audio", "video", "iframe",
  // Tables
  "table", "thead", "tbody", "tfoot", "tr", "th", "td",
  // Accessibility
  "caption",
  // Button (for code blocks)
  // TODO: Vet the security of this.
  "button",
  // Add any other tags we need to allow
];

// Attributes listed will not be stripped from HTML tags when parsing
const allowedAttributes = [
  "href",
  "title",
  "target",
  "rel",
  "src",
  "alt",
  "width",
  "height",
  "frameborder",
  "allowfullscreen",
  "allow",
  "class",
  "id",
  "controls",
  "style",
  "data-code",
  "data-theme",
  "data-lang",
  "aria",
  "aria-label",
  "aria-labelledby",
];

// Limits the external URLs that can be used in embed elements
const allowedHostnames = [
  "www.youtube.com",
  "player.vimeo.com",
  "codepen.io",
  "figma.com",
];

// Spoiler tags
const spoilerExtension = {
  name: 'spoiler',
  level: 'inline',
  start(src) {
    return src.indexOf('||');
  },
  tokenizer(src) {
    const rule = /^\s*?\|\|(.+?)\|\|/s;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'spoiler',
        raw: match[0],
        text: match[1],
        tokens: this.lexer.inlineTokens(match[1]),
      };
    }
  },
  renderer(token) {
    return `<span class="blog-spoiler">${this.parser.parseInline(token.tokens)}</span>`;
  },
};

// Render subscript
const subtextExtension = {
  name: 'subtext',
  level: 'block',
  start(src) {
    return src.match(/^-#/) ? 0 : src.indexOf('-#');
  },
  tokenizer(src) {
    const rule = /^\s*?-# (.+?)(?:\n|$)/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: 'subtext',
        raw: match[0],
        text: match[1].trim(),
        tokens: this.lexer.inlineTokens(match[1].trim()),
      };
    }
  },
  renderer(token) {
    return `<p class="subtext">${this.parser.parseInline(token.tokens)}</p>\n`;
  },
};

const htmlWrappers = ['p', 'div', 'span', 'li', 'td', 'th', 'blockquote', 'small'];

const htmlWrapperExtension = {
  name: 'htmlWrapper',
  level: 'block',
  start(src) {
    const match = src.match(new RegExp(`^<(${htmlWrappers.join('|')})(\\s[^>]*)?>`, 'i'));
    return match ? match.index : undefined;
  },
  tokenizer(src) {
    const rule = new RegExp(`^<(${htmlWrappers.join('|')})(\\s[^>]*)?>([\\s\\S]*?)<\\/\\1>`, 'i');
    const match = rule.exec(src);
    if (match) {
      const [raw, tag, attrs = '', inner] = match;
      return {
        type: 'htmlWrapper',
        raw,
        tag: tag.toLowerCase(),
        attrs,
        tokens: this.lexer.inlineTokens(inner.trim())
      };
    }
  },
  renderer(token) {
    return `<${token.tag}${token.attrs}>${this.parser.parseInline(token.tokens)}</${token.tag}>`;
  }
};

marked.use({ extensions: [htmlWrapperExtension, spoilerExtension, subtextExtension] });

const renderer = new marked.Renderer();

// Sets what the renderer should do with link token (tags)
renderer.link = function (token) {
  const { href, title, tokens } = token;

  const text = this.parser.parseInline(tokens);

  // Check if the link is to an external site
  const isExternal = /^https?:\/\//i.test(href) || /^\/\//i.test(href);
  // Set the title attribute
  const titleAttr = title ? `title="${title}"` : "";
  // Set the target attribute (open new tab)
  const targetAttr = isExternal
    ? 'target="_blank" rel="noopener noreferrer"'
    : "";

  // Return the modified link
  return `<a href="${href}" ${titleAttr} ${targetAttr} >${text}</a>`;
};

function tokensToPlainText(tokens) {
  return tokens
    .map((t) => {
      if (t.type === "text" || t.type === "codespan") return t.text;
      if (t.tokens) return tokensToPlainText(t.tokens);
      return t.raw || "";
    })
    .join("");
}

// Sets what the renderer should do with the headings (h2, h2, h3, etc.)
renderer.heading = function (token) {
  const { depth, tokens } = token;

  const html = this.parser.parseInline(tokens);

  const id = slugify(tokensToPlainText(tokens));

  return `<h${depth} id="${id}">${html}</h${depth}>`;
};

// Process blockquote styles (GFM)
function processBlockquoteStyles(html) {
  return html.replace(/<blockquote>\s*<p>\s*\[\!(.*?)\]/g, (match, style) => {
    const cleanedMatch = match.replace(`[!${style}]`, '').trim();
    return `<blockquote class="blockquote-${style.toLowerCase()}">${cleanedMatch.slice(12)}`;
  });
}

let highlighterInstance;
highlighterPromise.then((h) => { highlighterInstance = h; });
// Configure marked
renderer.code = function (token) {
  const { text, lang } = token;
  const language = lang || 'text';

  let code = text;
  let fileName = '';

  const commentPrefix = commentSyntax[language];
  if (commentPrefix) {
    const lines = code.split('\n');
    const firstLine = lines[0].trim();
    if (firstLine.startsWith(commentPrefix)) {
      fileName = firstLine
        .replace(commentPrefix, '')
        .replace('-->', '')
        .replace('*/', '')
        .trim();
      code = lines.slice(1).join('\n').trim();
    }
  }

  if (!fileName && language !== 'text') {
    fileName = language.charAt(0).toUpperCase() + language.slice(1);
  }

  let highlighted;
  try {
    highlighted = highlighterInstance.codeToHtml(code, {
      lang: language,
      theme: 'aurora-x'
    });
  } catch (e) {
    consoleError(e);
    highlighted = `<pre><code>${code}</code></pre>`;
  }

  const encoded = encodeURIComponent(code);

  return `<div class="code-block-wrapper" data-lang="${language}">
    <div class="code-block-header">
      <span>${fileName}</span>
      <button class="copy-button" data-code="${encoded}" aria-label="Copy code"><i class="ph-bold ph-copy"></i> Copy</button>
    </div>
    ${highlighted}
  </div>`;

};

function addCopyButtonsAndHeaders() {
  document.querySelectorAll('.copy-button').forEach(button => {
    if (button.dataset.bound) return;
    button.dataset.bound = 'true';

    button.addEventListener('click', () => {
      const code = decodeURIComponent(button.dataset.code);
      navigator.clipboard.writeText(code)
        .then(() => {
          button.innerText = 'Copied!';
          setTimeout(() => { button.innerText = 'Copy'; }, 2000);
        })
        .catch(e => {
          consoleError('Failed to copy:', e);
          button.innerText = 'Error';
        });
    });
  });
}

function addColorDisplays(html) {
  return html.replace(/<code>#([0-9a-f]{6}|[0-9a-f]{3})\b<\/code>/ig, (match) => {
    const hex = match.replace(/<code>|<\/code>/g, '');
    return `<span class="color-display" style="background-color: ${hex};"></span><code>${hex}</code>`;
  });
};

// Set new renderer as the main renderer
marked.setOptions({ renderer });

// Main render function
export function renderMarkdown(markdown) {
  if (!markdown) return '';
  
  try {
    let html = marked.parse(markdown.replace(/\t/g, '  '));
    html = processBlockquoteStyles(html);
    html = addColorDisplays(html);

		const purified = DOMPurify.sanitize(html, {
			ALLOWED_TAGS: allowedTags,
			ALLOWED_ATTR: allowedAttributes,
			ALLOWED_IFRAME_HOSTNAME: allowedHostnames,
		});
    
    return {
      html: purified,
      highlight: () => {
        requestAnimationFrame(() => {
          addCopyButtonsAndHeaders();
        });
      }
    };
  } catch (e) {
    consoleError('Error in renderMarkdown:', e);
    return { 
      html: marked.parse(markdown),
      highlight: () => {}
    };
  }
}

// Strips disallowed tags/attributes from a Markdown or HTML string, returns "safe" HTML.
export function sanitizeMarkdown(markdown) {
  const config = {
    ALLOWED_TAGS: allowedTags,
    ALLOWED_ATTR: allowedAttributes,
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    ALLOWED_IFRAME_HOSTNAME: allowedHostnames,
  };

  return DOMPurify.sanitize(markdown, {
    ...config,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
  });
}

// Sanitizes every string value in a plain object using sanitizeMarkdown.
export function sanitizeFields(arr) {
  return Object.fromEntries(
    Object.entries(arr).map(([k, v]) => [k, sanitizeMarkdown(v)])
  );
}
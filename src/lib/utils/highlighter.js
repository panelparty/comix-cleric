// -- Syntax highlighter (for Markdown codeblocks) -- //

// Shiki imports
import { createHighlighter } from 'shiki';

// Allows Shiki to work with SvelteKit SSR
export const highlighterPromise = createHighlighter({
  themes: ['github-dark', 'aurora-x', 'tokyo-night'],
  langs: ['html', 'javascript', 'css', 'svelte']
});
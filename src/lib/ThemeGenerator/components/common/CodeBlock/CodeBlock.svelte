<!-- @component Code Block based on: https://shiki.style/ -->

<script module>
	import { createHighlighter } from 'shiki';

	// https://shiki.style/guide/sync-usage
	const shiki = await createHighlighter({
		// Implement your import theme.
		themes: ["aurora-x"],
		// Implement your imported and supported languages.
		langs: ["console", "html", "css", "js", "ts"]
	});
</script>

<script lang="ts">
	import type { CodeBlockProps } from './types';

	let {
		code = '',
		lang = 'css',
		theme = 'aurora-x',
		// Base Style Props
		base = ' overflow-hidden',
		rounded = 'rounded-container',
		shadow = '',
		classes = '',
		// Pre Style Props
		preBase = 'border border-surface-200-800 text-xs',
		prePadding = '[&>pre]:p-4',
		preClasses = ''
	}: CodeBlockProps = $props();

	const generatedHtml = $derived(shiki?.codeToHtml(code, { lang, theme }));
</script>

<div class="{base} {rounded} {shadow} {classes} {preBase} {prePadding} {preClasses}">
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html generatedHtml}
</div>

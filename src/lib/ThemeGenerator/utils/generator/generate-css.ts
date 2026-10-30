// Utility: Generate CSS
// Generates the theme CSS for live previews.

import { formageEdges, formatBackgrounds, formatColors, formatSpacing, formatTypography } from '$lib/ThemeGenerator/utils/generator/format-output';
import {
	// settingsCore,
	settingsColors,
	settingsBackgrounds,
	settingsTypography,
	settingsSpacing,
	settingsEdges
} from '$lib/ThemeGenerator/state/generator.svelte';

export function generatePreviewCss() {
	const themeCss = `
${formatTypography(settingsTypography)}
${formatSpacing(settingsSpacing)}
${formageEdges(settingsEdges)}
${formatBackgrounds(settingsBackgrounds)}
${formatColors(settingsColors)}
`.trim();
	// See root +layout.svelte to reference where this attribute is used
	return `[data-theme="generated"] {\n${themeCss}\n}`;
}

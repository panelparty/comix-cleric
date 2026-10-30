<script lang="ts">
	// State
	import { globals } from '$lib/ThemeGenerator/state/generator.svelte';
	// Components (Skeleton)
	import { Accordion, Segment } from '@skeletonlabs/skeleton-svelte';
	// Components (Settings)
	import ControlsCore from './ControlsCore.svelte';
	import ControlsColors from './ControlsColors.svelte';
	import ControlsBackgrounds from './ControlsBackgrounds.svelte';
	import ControlsTypography from './ControlsTypography.svelte';
	import ControlsSpacing from './ControlsSpacing.svelte';
	import ControlsEdges from './ControlsEdges.svelte';

	// Local
	const accordionItemProps = {
		controlPadding: 'px-5 py-3',
		controlRounded: 'rounded-none',
		controlHover: 'hover:preset-tonal',
		panelPadding: 'p-5'
	};

	// State
	let settings: string[] = $state([]);
</script>

<section class="relative w-full h-screen bg-surface-100-900 overflow-y-auto">
	<!-- Header -->
	<header
		class="sticky top-0 z-10 bg-surface-100/50 dark:bg-surface-900/50 backdrop-blur-xl p-5 flex justify-between items-center gap-4 shadow-lg"
	>
		<Segment name="display" value={globals.panel} onValueChange={(e) => (globals.panel = e.value as typeof globals.panel)} classes="w-full">
			<Segment.Item value="preview" classes="w-full">Preview</Segment.Item>
			<Segment.Item value="code" classes="w-full">Code</Segment.Item>
		</Segment>
	</header>
	<!-- Controls: Core -->
	<ControlsCore />
	<!-- Settings Accordion -->
	<div class="space-y-10">
		<Accordion value={settings} onValueChange={(e) => (settings = e.value)} collapsible spaceY="space-y-0">
			{#snippet iconOpen()}<i class="ph-bold ph-chevron-up size-16"></i>{/snippet}
			{#snippet iconClosed()}<i class="ph-bold ph-chevron-down size-16"></i>{/snippet}
			<hr class="hr" />
			<!-- Controls: Colors -->
			<Accordion.Item value="colors" {...accordionItemProps}>
				{#snippet lead()}<span class="btn-icon preset-tonal" title="Color Palette" aria-label="Color Palette"><i class="ph-bold ph-palette text-lg"></i></span
					>{/snippet}
				{#snippet control()}<span class="h4">Color Palette</span>{/snippet}
				{#snippet panel()}<ControlsColors />{/snippet}
			</Accordion.Item>
			<hr class="hr" />
			<!-- Controls: Backgrounds -->
			<Accordion.Item value="backgrounds" {...accordionItemProps}>
				{#snippet lead()}<span class="btn-icon preset-tonal" title="Backgrounds" aria-label="Backgrounds"
						><i class="ph-bold ph-paint-brush text-lg"></i></span
					>{/snippet}
				{#snippet control()}<span class="h4">Backgrounds</span>{/snippet}
				{#snippet panel()}<ControlsBackgrounds />{/snippet}
			</Accordion.Item>
			<hr class="hr" />
			<!-- Controls: Spacing -->
			<Accordion.Item value="spacing" {...accordionItemProps}>
				{#snippet lead()}<span class="btn-icon preset-tonal" title="Spacing" aria-label="Spacing"><i class="ph-bold ph-arrows-out-line-vertical text-lg"></i></span>{/snippet}
				{#snippet control()}<span class="h4">Spacing</span>{/snippet}
				{#snippet panel()}<ControlsSpacing />{/snippet}
			</Accordion.Item>
			<hr class="hr" />
			<!-- Controls: Edges -->
			<Accordion.Item value="edges" {...accordionItemProps}>
				{#snippet lead()}<span class="btn-icon preset-tonal" title="Edges" aria-label="Edges"><i class="ph-bold ph-rectangle-dashed text-lg"></i></span>{/snippet}
				{#snippet control()}<span class="h4">Edges</span>{/snippet}
				{#snippet panel()}<ControlsEdges />{/snippet}
			</Accordion.Item>
			<hr class="hr" />
			<!-- Controls: Typography -->
			<Accordion.Item value="typography" {...accordionItemProps}>
				{#snippet lead()}<span class="btn-icon preset-tonal" title="Typography" aria-label="Typography"><i class="ph-bold ph-text-t text-lg"></i></span
					>{/snippet}
				{#snippet control()}<span class="h4">Typography</span>{/snippet}
				{#snippet panel()}<ControlsTypography />{/snippet}
			</Accordion.Item>
			<hr class="hr" />
		</Accordion>
	</div>
	<!-- Footer -->
	<!-- <footer class="p-5">
		<p class="text-xs opacity-50">When ready, tap the <strong>Code</strong> button to obtain your theme.</p>
	</footer> -->
</section>

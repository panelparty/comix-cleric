<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	// Components (generator)
	import Logo from '$lib/ThemeGenerator/components/common/Logo/Logo.svelte';
	import Preview from '$lib/ThemeGenerator/components/generator/Preview/Preview.svelte';
	import Controls from '$lib/ThemeGenerator/components/generator/Controls/Controls.svelte';
	// Utilities
	import { generatePreviewCss } from '$lib/ThemeGenerator/utils/generator/generate-css';
	import { screen } from '$lib/utils/breakpoints';

	onMount(()=>{
		if (browser && document) {
			document.documentElement?.setAttribute("data-theme", "generated");
		}
	});

	$effect(()=>{
		if (browser && document) {
			document.documentElement?.setAttribute("data-theme", "generated");
		}
	});
</script>

<!-- Live Preview CSS -->
<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<style>${generatePreviewCss()}</style>`}
</svelte:head>

<!-- Warning: Mobile Not Supported -->
{#if !screen.lg.current}
<div class="absolute top-0 z-50 left-0 w-full h-full bg-surface-50-950 flex justify-center items-center p-4">
	<div class="card bg-surface-100-900 max-w-96 p-10 space-y-5 shadow-xl">
		<Logo />
		<h2 class="h2">Not Available.</h2>
		<p class="opacity-60">
			The theme generator is not currently available for small screen devices. We recommend using either a tablet or desktop.
		</p>
	</div>
</div>
{:else}
<main class="w-full h-full grid grid-cols-[350px_1fr]">
	<Controls />
	<Preview />
</main>
{/if}
<script>
	// Components
	import BackButton from "$lib/components/Navigation/BackButton.svelte";
	import { screen } from "$lib/utils/breakpoints";

	// Props
	let {
		data,
		title,
		titleButton,
		subtitle,
		back,
		preview,
		create,
		createURL,
		createLabel = "Add New"
	} = $props();
</script>

<!-- Main wrapper -->
<div class="w-full flex items-start justify-between gap-4 bg-inherit p-2 md:py-0">
	<!-- Left section -->
	<div class="w-full flex flex-col items-start justify-start gap-2">
		<!-- Right section -->
		<div class="w-full flex items-end justify-start gap-4">
			<!-- Back button component -->
			{#if back}
			<BackButton />
			{/if}

			<!-- Live preview link -->
			{#if preview}
			<a href={preview} target="_blank" rel="noopener noreferrer" class="button w-full h-full md:h-auto md:w-fit border border-current whitespace-nowrap">
				{#if screen.md.current}
					View on Site
				{:else}
					View
				{/if}
			</a>
			{/if}
			
			<!-- Create new update button -->
			{#if create && createURL}
			<a href={createURL} class="button w-full md:w-fit preset-filled-primary-500 border text-surface-950! flex gap-2 items-center whitespace-nowrap">
				{#if screen.md.current}
					{createLabel}
				{:else}
					Add New
				{/if}
			</a>
			{/if}
		</div>

		<!-- Section heading/title -->
		{#if title || subtitle}
		<hgroup class="w-full">
			{#if title}
			<h3 class="h3 text-center md:text-left leading-tight">{title}</h3>
			{/if}

			<!-- Section heading/title -->
			{#if subtitle}
			<p class="text-center sm:text-left">{subtitle}</p>
			{/if}
		</hgroup>
		{/if}

		{@render titleButton?.()}
	</div>
</div>
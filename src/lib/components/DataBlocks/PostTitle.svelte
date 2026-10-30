<script>
	// Components
	import ItemNumber from "./ItemNumber.svelte";

	// Props
	let {
		data,
		collection,
		showType = false,
		...restProps
	} = $props();
</script>

<!-- Container -->
<hgroup class="gap-container" style="--gap: 1;">
	<!-- Gallery type -->
	{#if showType}
		<!-- Post number -->
		{#if data?.number && data?.type?.slug === 'main-story'}
		<ItemNumber number={data?.number} class="display-type update-type {(collection ?? "base") + "-"}type" />

		<!-- Post type -->
    {:else}
		<p class="display-type update-type {(collection ?? "base") + "-"}type">{data?.type?.name}</p>
		{/if}
	{/if}
	
	<!-- Gallery title -->
	<h2 class="title {(collection ?? "base") + "-"}title">{data?.name}</h2>
</hgroup>

<style>
  :global(.update-type) {
		color: var(--color-secondary-500);
	}

	hgroup {
		line-height: 1;
	}
</style>
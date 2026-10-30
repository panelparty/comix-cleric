<script>
	// Components
	import DisplayDate from "../Display/DisplayDate.svelte";

	// Props
	let {
		data,
		created,
		published = true,
		updated,
		labelCreated = "Created:",
		labelPublished = "Published:",
		labelUpdated = "Updated:",
	} = $props();
</script>

<!-- Container -->
{#if created || published || updated}
<div class="gap-container" style="--gap: 1;">
	<!-- Created -->
	{#if created}<DisplayDate label={labelCreated} date={data?.date_created} />{/if}

	<!-- Published -->
	{#if published}<DisplayDate label={labelPublished} date={data?.date_published} />{/if}

	<!-- Updated -->
	{#if updated}<DisplayDate label={labelUpdated} date={data?.date_updated} />{/if}
</div>
{/if}
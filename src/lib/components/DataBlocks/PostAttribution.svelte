<script>
	// Components
	import Author from "../User/Author.svelte";
    import ProfileCompact from "../User/ProfileCompact.svelte";

	// Props
	let {
		data,
		label = "Posted by:",
	} = $props();
</script>

<!-- Container -->
{#if data}
<div class="post-attribution">
	<!-- Label -->
	<h6 class="title">{label}</h6>

	<!-- Author info component -->
	<ProfileCompact user={data?.user_created} role />
</div>
{/if}

<style>
	.post-attribution {
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing) * 1);
	}
</style>
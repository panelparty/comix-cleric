<script>
	// Props
	let {
		data,
		type,
		label = "this post",
		route,
		id
	} = $props();
</script>

{#if data?.isAdmin}
<!-- Wrapper -->
<div class="edit-post-wrapper">
	<!-- Link -->
	<a href="/_cc_admin/{route ? route : `${type}/edit/${id}`}" target="_blank" class="button button-edit">
		<!-- Icon -->
		<i class="ph-bold ph-pencil-simple-line"></i>
		<!-- Text -->
		Edit {label}
	</a>
</div>
{/if}

<style>
	.edit-post-wrapper {
		width: 100%;
		display: flex;
		justify-content: start;
		gap: calc(var(--spacing) * 4);
	}
</style>
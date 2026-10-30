<script>
	// Props
	let {
		children,
		label
	} = $props();
</script>

<!-- Form section -->
<div class="form-section">
	<!-- Heading -->
	{#if label}
		<h4 class="form-section-heading">{label}</h4>
	{/if}

	<!-- Child elements -->
	{@render children?.()}
</div>

<style>
	.form-section {
		padding: calc(var(--spacing) * 4);
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing) * 6);
		background: var(--color-surface-100-900);
		border-radius: var(--radius-md);
	}
</style>
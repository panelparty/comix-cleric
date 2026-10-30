<script>
	// Props
	let {
		label = "Coming Soon!"
	} = $props();
</script>

<!-- Wrapper (for styling) -->
<div class="coming-soon-container">
	<!-- Label text -->
	<h3 class="coming-soon-label">{label}</h3>
</div>

<style>
	:global(.coming-soon-container) {
		width: 100%;
	}

	:global(.coming-soon-label) {
		width: 100%;
		text-align: center;
		color: var(--color-primary-500);
	}
</style>
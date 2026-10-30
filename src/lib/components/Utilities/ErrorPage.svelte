<script>
	// Svelte utilities
  import { page } from '$app/state';
</script>

<!-- Container -->
<div class="error-container">
	<!-- Card -->
	<div class="error-card">
		<!-- Status & message -->
		<h2 class="error-heading">{page.status} - {page.error.message}</h2>
		
		<!-- Controls -->
		<div class="error-controls" data-sveltekit-reload>
			<!-- Back button -->
			<button onclick={()=>{history.back()}} class="button back-button">Go Back</button>
			
			<!-- Home button -->
			<button onclick={()=>{window.location.href = '/'}} class="button home-button">Go to Home</button>
		</div>
	</div>
</div>

<style>
	.error-container {
		width: 100%;
		height: 100%;
		display: grid;
		place-content: center;
	}

	.error-card {
		border-radius: var(--radius-container);
		width: min-content;
		background-color: var(--color-surface-100-900);
  	color: var(--color-surface-contrast-100-900);
		padding: calc(var(--spacing) * 8);
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing) * 8);
		justify-content: center;
	}

	.error-heading {
		white-space: nowrap;
	}

	.error-controls {
		display: flex;
		gap: calc(var(--spacing) * 2);
	}

	.back-button,
	.home-button {
		width: 100%;
		padding: calc(var(--spacing) * 3) calc(var(--spacing) * 8);
		font-weight: 600;
		border-radius: var(--radius-lg);
	}
	.back-button {
		background-color: var(--color-surface-500);
  	color: var(--color-surface-contrast-500);
	}
	.home-button {
		background-color: var(--color-surface-300-700);
  	color: var(--color-surface-contrast-300-700);
		border-width: var(--default-border-width);
		border-color: var(--color-surface-500);
	}
</style>
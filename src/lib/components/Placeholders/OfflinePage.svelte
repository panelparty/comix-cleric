<script>
	// Assets
  import offline_logo from '$lib/assets/branding/logo-full.svg';
</script>

<!-- Offline page container -->
<div class="offline-container">
	<!-- Background decoration -->
	<div class="offline-backdrop">
		<!-- Panelope graphic -->
		<img src={offline_logo} alt="" class="backdrop-image">
	</div>

	<!-- Information -->
	<div class="offline-info">
		<h1 class="offline-info-heading">Server Connection Lost</h1>
		<p class="offline-info-message">Please try again in a few seconds.</p>
	</div>

	<!-- Simple "reload page" button -->
	<button class="btn-lg preset-filled-primary-500 rounded-md" onclick={location.reload()}><i class="ph-bold ph-arrow-clockwise"></i> Try Again</button>
	
	<!-- Troubleshooting -->
	<p class="offline-docs">If the issue persists, please refer to the <a href="https://comixcleric.com/docs/comix-cleric/troubleshooting" target="_blank" class="anchor">troubleshooting</a> documentation.</p>
</div>

<!-- Local styles -->
<style>

	.offline-container {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing) * 8);
		align-items: center;
		justify-content: center;
	}

	.offline-backdrop {
		position: absolute;
		inset: 0;
		display: grid;
		place-content: center;
		padding: calc(var(--spacing) * 4);
		z-index: -1;

		@media (width >= 48rem) {
			padding: calc(var(--spacing) * 8);
		}
	}

	.backdrop-image {
		display: block;
		width: 100%;
		height: auto;
		margin: 0 auto;
		opacity: 20%;
	}

	.offline-info {
		text-align: center;
	}

	.offline-info-message {
		font-size: var(--text-xl);
		font-weight: 500;
	}

	.offline-docs {
		font-weight: 500;
	}

</style>
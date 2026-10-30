<script>
	// Utilities
	import { page } from '$app/stores';

	// Components
	import CopyButton from '../Functional/CopyButton.svelte';

	// Props
	let {
		data,
		origin
	} = $props();
</script>

<!-- Share container -->
<div class="section-card share-container">
	<!-- Share heading -->
	<p class="label">Share</p>

	<!-- Share links -->
	<div class="gap-container" style="--gap: 2; --dir: row;">
		<!-- Direct link -->
		<CopyButton class="button button-share" value={$page?.url}>
			Copy link
		</CopyButton>

		<!-- Permalink (Main Story only) -->
		{#if data?.type?.slug === "main-story" && origin}
		<CopyButton class="button button-share" value={origin + "/rd/" + data?.number}>
			Copy permalink
		</CopyButton>
		{/if}
	</div>
</div>
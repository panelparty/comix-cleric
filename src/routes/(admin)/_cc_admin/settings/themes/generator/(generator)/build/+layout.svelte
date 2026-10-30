<script lang="ts">
	// Components (common)
	import AppHeader from '$lib/ThemeGenerator/components/common/AppHeader/AppHeader.svelte';

	// Props
	let { children } = $props();
</script>

<!-- Wrapper -->
<div class="h-full grid grid-rows-[auto_1fr] grid-cols-1 overflow-hidden">
	<!-- Page Header -->
	<AppHeader />
	<!-- Page Content -->
	{@render children?.()}
</div>

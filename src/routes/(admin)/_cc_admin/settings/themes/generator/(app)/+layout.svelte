<script lang="ts">
	// Components (common)
	import AppHeader from '$lib/ThemeGenerator/components/common/AppHeader/AppHeader.svelte';
	import AppFooter from '$lib/ThemeGenerator/components/common/AppFooter/AppFooter.svelte';

	let { children } = $props();
</script>

<main class="h-[100cqb] grid grid-rows-[auto_1fr_auto] grid-cols-1 gap-10">
	<!-- Page Header -->
	<AppHeader />
	<!-- Page Content -->
	<section class="container mx-auto p-4">{@render children?.()}</section>
	<!-- Page Footer -->
	<AppFooter />
</main>

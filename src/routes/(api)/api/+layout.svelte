<script>
	import NoIndex from "$lib/components/SEO/NoIndex.svelte";

	let { children } = $props();
</script>

<NoIndex />

{@render children?.()}
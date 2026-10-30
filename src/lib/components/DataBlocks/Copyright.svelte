<script>
	// Components
	import ProseContainer from "./ProseContainer.svelte";

	// Props
	let {
		data
	} = $props();
</script>

<!-- Copyright notice -->
<ProseContainer {data} class="footer-copyright" />

<style>
	:global(.footer-copyright) {
    text-align: center;
    line-height: var(--leading-tight);
    margin: 0 auto;
    text-wrap: pretty;
  }
</style>
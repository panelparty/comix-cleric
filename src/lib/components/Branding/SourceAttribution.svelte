<script>
	// Props
	let {
		data
	} = $props();
</script>

<!-- Attribution -->
{#if data?.settings?.source_branding}
<p class="source-attribution">Made with <a href="https://comixcleric.com" target="_blank" class="font-semibold text-primary-500">Comix Cleric</a> by Panel Party!</p>
{/if}

<style>
	.source-attribution {
    font-size: calc(0.875rem * var(--text-scaling));
    line-height: var(--tw-leading, calc(calc(1.25 / 0.875) * var(--text-scaling)));
    text-align: center;
    font-weight: 500;
    margin: 0 auto;
    text-wrap: pretty;
    line-height: 1;
  }
</style>
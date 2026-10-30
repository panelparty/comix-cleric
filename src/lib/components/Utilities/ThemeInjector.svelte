<script>
	// Props
  let {
		theme,
		settings
	} = $props();
</script>

<!-- Injected into the HTML <head> tag -->
<svelte:head>
  <!-- Import custom fonts from active theme. -->
  {@html `<style> ${theme?.custom_font_base ?? ''}` + theme?.code + `</style>`}
</svelte:head>
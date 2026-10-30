<script>
	// Props
	let {
		children,
		class: className,
		...restProps
	} = $props();
</script>

<!-- Fills the width and height of the browser viewport -->
<!-- Anything larger overflows (adds scrolling) automatically -->
<div class="wrapper {className}" {...restProps}>
	{@render children?.()}
</div>

<style>
	.wrapper {
		height: 100dvh;
		overflow-y: auto;
		container-type: size;
	}
</style>
<script>
	// Props
	let {
		class: className
	} = $props();
</script>

<!-- A basic button that emulates the browser back functionality -->
<!-- TODO: Make customizable. -->
<button
	type="button"
	class="button back-button {className}"
	onclick={()=>{window.history.back()}}
>
	<i class="ph-bold ph-arrow-left"></i>
	Back
</button>

<style>
	.back-button {
		border-width: var(--default-border-width);
		color: var(--color-primary-500);
	}
</style>
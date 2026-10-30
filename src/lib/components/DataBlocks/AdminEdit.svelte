<script>
	let {
		data,
		label = "post",
		collection,
		id,
		...restProps
	} = $props();
</script>

{#if data?.isAdmin === true && collection && id}
	<a href="/_cc_admin/{collection}/edit/{id}" target="_blank" class="button-edit btn-sm" {...restProps}>
		<i class="ph-bold ph-pencil-simple-line"></i>
		Edit this {label ?? collection}
	</a>
{/if}
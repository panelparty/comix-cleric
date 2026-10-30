<script>
	
	import FeatureLabel from "./FeatureLabel.svelte";

	let {
		...restProps
	} = $props();

</script>

<FeatureLabel
	label="Beta"
	background="bg-primary-50-950"
	color="text-primary-700-300"
	{...restProps}
/>
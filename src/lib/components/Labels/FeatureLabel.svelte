<script>

	let {
		label,
		background = "bg-surface-100-900",
		color = "text-surface-700-300",
		class: className,
		...restProps } = $props();

</script>

<small
	class="{background} w-fit h-fit uppercase text-sm font-semibold -mt-1 {color} px-1 rounded-md {className}"
	{...restProps}
>
	{label}
</small>
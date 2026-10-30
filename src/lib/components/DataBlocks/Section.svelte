<script>
    import SectionHeading from "./SectionHeading.svelte";

	// Props
	let {
		heading,
		subtitle,
		children,
		class: className,
		width,
		wrapperWidth,
		wrapperClasses,
		...restProps
	} = $props();
</script>

<!-- Native HTML section -->
<section
	class="section-container {className}"
	style="{width ? `max-width: ${width};` : ''} {restProps?.style}"
	{...restProps}
>
	<!-- Inner wrapper -->
	<div
		class="section-wrapper {wrapperClasses}"
		style={wrapperWidth ? `max-width: ${wrapperWidth};` : ''}
	>
		<!-- Optional title -->
		{#if heading}
			<SectionHeading {heading} />
		{/if}

		<!-- Optional subtitle -->
		{#if subtitle}
			<p class="section-subtitle">{subtitle}</p>
		{/if}

		<!-- Render any provided elements -->
		{@render children?.()}
	</div>
</section>
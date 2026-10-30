<script>
	let {
		heading,
		children,
		color,
		...restProps
	} = $props();
</script>

<!-- Heading -->
<h2 class="section-heading {restProps?.class}" data-color={color} {...restProps}>
	{heading}
	{@render children?.()}
</h2>

<!-- Local styles -->
<style>
	.section-heading {
		text-align: center;
		text-decoration: underline;
		text-decoration-color: transparent;
		line-height: 1;
		display: inline-flex;
		align-items: center;
		gap: calc(var(--spacing) * 2);

		@media (width >= 48rem) {
			text-align: left;
			line-height: 1;
		}
	}
	.section-heading[data-color="primary"] {
		text-decoration-color: var(--color-primary-500);
	}
	.section-heading[data-color="secondary"] {
		text-decoration-color: var(--color-secondary-500);
	}
	.section-heading[data-color="tertiary"] {
		text-decoration-color: var(--color-tertiary-500);
	}
	.section-heading[data-color="success"] {
		text-decoration-color: var(--color-success-500);
	}
	.section-heading[data-color="warning"] {
		text-decoration-color: var(--color-warning-500);
	}
	.section-heading[data-color="error"] {
		text-decoration-color: var(--color-error-500);
	}
	.section-heading[data-color="surface"] {
		text-decoration-color: var(--color-surface-500);
	}
</style>
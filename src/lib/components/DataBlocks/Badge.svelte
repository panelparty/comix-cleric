<script>

	let {
		label,
		children,
		class: className,
		...restProps
	} = $props();

</script>

<!-- Badge -->
{#if label || children}
<p class="badge {className}" {...restProps}>
	{label}
	{@render children?.()}
</p>
{/if}

<style>
	:global(.badge) {
		line-height: 1;
		padding: calc(var(--spacing) * 1) calc(var(--spacing) * 2);
		font-weight: 600;
		font-size: var(--text-sm);

		&[data-preset="new"] {
			background: var(--color-warning-500);
			color: var(--color-warning-950);
		}

		&[data-preset="warning"] {
			background: var(--color-warning-500);
			color: var(--color-warning-contrast-500);
		}
	}
</style>
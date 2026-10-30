<script>
	// Skeleton UI components
	import { Modal } from "@skeletonlabs/skeleton-svelte";

	// Props
	let {
		open = $bindable(),
		title,
		close = true,
		triggerClasses,
		contentClasses,
		trigger,
		content,
		...restProps
	} = $props();
</script>

<Modal
	{open}
	onOpenChange={(e) => (open = e.open)}
	triggerClasses="modal-trigger {triggerClasses}"
	contentClasses="section-card modal-contents {contentClasses}"
	{trigger}
	{...restProps}
>
	{#snippet content()}
		{#if close || title}
			<div class="modal-header">
				<h5 class="title truncate modal-title">{title}</h5>
				{#if close}
				<button type="button" aria-label="Close modal" onclick={()=>{open = false}} class="button size-8 preset-filled-surface-300-700 self-end"><i class="ph-bold ph-x"></i></button>
				{/if}
			</div>
		{/if}
		{@render content?.()}
	{/snippet}
</Modal>

<style>
	:global(.modal-trigger) {
		width: auto;
	}

	:global(.modal-contents) {
		background-color: var(--color-surface-100-900);
		width: 100%;
		max-width: calc(100vw - 2rem);
		max-height: calc(100dvh - 2rem);
		padding: calc(var(--spacing) * 4);
		display: flex;
		flex-direction: column;
		gap: calc(var(--spacing) * 2);
		overflow-y: auto;

		@media (width >= 48rem) {
			width: fit-content;
			min-width: var(--container-sm);
		}
	}

	.modal-header {
		width: 100%;
		display: flex;
		flex-direction: row-reverse;
		justify-content: space-between;
	}
</style>
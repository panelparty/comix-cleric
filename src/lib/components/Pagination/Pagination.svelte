<script>
	// Utilities
	import { screen } from "$lib/utils/breakpoints";
	
	// Components
	import { Pagination } from "@skeletonlabs/skeleton-svelte";
	import PageLimit from "./PageLimit.svelte";

	// Props
	let {
		data,
		value,
		count,
		onPageChange = (e) => {currentPage = e.page;},
		page,
		pageSize = $bindable(),
		alternative,
		classes
	} = $props();
</script>

<!-- Wrapper -->
<div class="pagination-container {classes}">
	<!-- Hide pagination until it is required -->
	{#if count > pageSize}
		<!-- Skeleton UI Pagination component -->
		<Pagination
			{data}
			{count}
			{onPageChange}
			{page}
			{pageSize}
			alternative={!screen.md.current}
			classes="pagination"
			buttonClasses="pagination-button"
		>
			<!-- Custom icons -->
			{#snippet labelEllipsis()}<i class="ph-bold ph-dots-three"></i>{/snippet}
			{#snippet labelNext()}<i class="ph-bold ph-arrow-right"></i>{/snippet}
			{#snippet labelPrevious()}<i class="ph-bold ph-arrow-left"></i>{/snippet}
			{#snippet labelFirst()}<i class="ph-bold ph-caret-line-left"></i>{/snippet}
			{#snippet labelLast()}<i class="ph-bold ph-caret-line-right"></i>{/snippet}
		</Pagination>
	{:else}
		<div class="pagination-placeholder"></div>
	{/if}

	<!-- Page limit should always be visible -->
	<PageLimit bind:value={pageSize} />
</div>

<style>
	.pagination-container {
		position: sticky;
		z-index: 50;
		bottom: 0;
		padding-block: calc(var(--spacing) * 4);
		display: grid;
		grid-template-columns: auto min-content;
		gap: calc(var(--spacing) * 2);
		align-items: center;
	}

	:global(.pagination) {
		width: 100%;
		border-width: 0px !important;
		padding: 0px !important;
		border-radius: 0px !important;
	}
	
	:global(.pagination-button) {
		font-size: var(--text-sm);
		line-height: var(--text-sm--line-height);
		border-radius: var(--radius-sm);

		&:hover {
			background: var(--color-primary-200-800);
			color: var(--color-primary-contrast-200-800);
		}
		&[data-selected] {
			background: var(--color-primary-500);
			color: var(--color-primary-contrast-500);
		}

		@media (width >= 48rem) {
			font-size: calc(1rem * var(--text-scaling));
			line-height: var(--tw-leading, calc(calc(1.5 / 1) * var(--text-scaling)));
		}
	}

	.pagination-placeholder {
		width: 100%;
	}
</style>
<script>
	// Components
	import Alert from "./Alert.svelte";

	// Props
	let {
		data,
		status = "draft",
	} = $props();

	// Notice types
	const type = {
		draft: {
			icon: "info",
			preset: "surface",
		},
		archived: {
			icon: "warning",
			preset: "warning",
		},
		scheduled: {
			icon: "checkbox",
			preset: "success",
		},
	};
</script>

<!-- Alert component -->
{#if status != 'published' && data?.isAdmin}
<Alert class="status-notice-alert" preset={type[status]?.preset}>
	<!-- Icon -->
	<i class="status-notice-icon ph-bold ph-{type[status]?.icon}"></i>

	<!-- Message -->
	<p class="status-notice-message">This post is set as <strong>{status}</strong> and is only visible to admin.</p>
</Alert>
{/if}

<style>
	:global(.alert-container.status-notice-alert) {
		max-width: var(--container-xl);
		flex-direction: row;
		align-items: center;
		gap: calc(var(--spacing) * 2);
	}

	.status-notice-message {
		line-height: 1;
	}
	.status-notice-message strong {
		font-weight: 700;
	}
</style>
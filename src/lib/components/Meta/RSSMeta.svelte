<script>
	// Props
	let {
		data
	} = $props();
</script>

<!-- Injected into HTML <head> -->
<svelte:head>
	<!-- List of all RSS links -->
	<link rel="alternate" type="application/rss+xml" title="{data?.settings?.name} - All Posts" href="/api/rss" />
	<link rel="alternate" type="application/rss+xml" title="{data?.settings?.name} - Updates" href="/api/rss/updates" />
	<link rel="alternate" type="application/rss+xml" title="{data?.settings?.name} - Blogs" href="/api/rss/blogs" />
	<link rel="alternate" type="application/rss+xml" title="{data?.settings?.name} - Cast" href="/api/rss/cast" />
	<link rel="alternate" type="application/rss+xml" title="{data?.settings?.name} - Gallery" href="/api/rss/gallery" />
</svelte:head>
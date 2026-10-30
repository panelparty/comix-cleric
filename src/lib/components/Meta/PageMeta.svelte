<script>
	// Svelte utilities
	import { page } from '$app/state';

	// Utilities
	import { fallback } from '$lib/utils/utils';
	
	// Props
	let {
		data,
		type = "about"
	} = $props();

	// Destructure data
	let settings = $derived(data?.settings);
	let fallbacks = $derived({
		about: {
			preview: [
				data?.series?.cover?.filename_disk,
				settings?.logo?.filename_disk
			],
			title: [
				data?.series?.name,
				settings?.name
			],
			description: [
				data?.series?.description,
				data?.currentPage?.blurb,
				data?.currentPage?.description,
				settings?.description
			],
		},
		update: {
			preview: [
				data?.update?.cover?.filename_disk,
				data?.update?.chapter?.cover?.filename_disk,
				data?.update?.volume?.cover?.filename_disk,
				data?.update?.series?.cover?.filename_disk,
				settings?.logo?.filename_disk
			],
			title: [
				data?.update?.name,
				data?.update?.slug,
				settings?.name
			],
			description: [
				data?.update?.blurb,
				settings?.description
			],
		},
		chapter: {
			preview: [
				data?.chapter?.cover?.filename_disk,
				data?.chapter?.volume?.cover?.filename_disk,
				data?.chapter?.series?.cover?.filename_disk,
				settings?.logo?.filename_disk
			],
			title: [
				data?.chapter?.name,
				data?.chapter?.slug,
				settings?.name
			],
			description: [
				data?.chapter?.blurb,
				data?.currentPage?.blurb,
				data?.currentPage?.description,
				settings?.description
			],
		},
		volume: {
			preview: [
				data?.volume?.cover?.filename_disk,
				data?.volume?.series?.cover?.filename_disk,
				settings?.logo?.filename_disk
			],
			title: [
				data?.volume?.name,
				data?.volume?.slug,
				settings?.name
			],
			description: [
				data?.volume?.blurb,
				data?.currentPage?.blurb,
				data?.currentPage?.description,
				settings?.description
			],
		},
		blog: {
			preview: [
				data?.blog?.cover?.filename_disk,
				settings?.logo?.filename_disk
			],
			title: [
				data?.blog?.name,
				data?.blog?.slug,
				settings?.name
			],
			description: [
				data?.blog?.blurb,
				data?.currentPage?.blurb,
				data?.currentPage?.description,
				settings?.description
			],
		},
		cast: {
			preview: [
				data?.cast?.cover?.filename_disk,
				settings?.logo?.filename_disk
			],
			title: [
				data?.cast?.name,
				data?.cast?.slug,
				settings?.name
			],
			description: [
				data?.cast?.blurb,
				data?.currentPage?.blurb,
				data?.currentPage?.description,
				settings?.description
			],
		},
		gallery: {
			preview: [
				data?.gallery?.cover?.filename_disk,
				settings?.logo?.filename_disk
			],
			title: [
				data?.gallery?.name,
				data?.gallery?.slug,
				settings?.name
			],
			description: [
				data?.gallery?.blurb,
				data?.currentPage?.blurb,
				data?.currentPage?.description,
				settings?.description
			],
		},
	});
	let preview = $derived(fallback(getFallback(fallbacks, type)?.preview));
	let title = $derived(fallback(getFallback(fallbacks, type)?.title));
	let description = $derived(fallback(getFallback(fallbacks, type)?.description));

	// Get current fallback
	const getFallback = (obj, val) => {
		const key = Object.keys(obj).find(key => key.includes(val));

    if (key) {
        return obj[key];
    }

		return {
			preview: [
				settings?.logo?.filename_disk
			],
			title: [
				settings?.name
			],
			description: [
				settings?.description
			],
		};
	};
</script>

<!-- Injected into page <head> element -->
<svelte:head>
  <!-- Custom page title -->
  <title>{title && title != data?.series?.name ? data?.series?.name + " | " + title : data?.series?.name}</title>

  <!-- Custom metadata (for social media link previews) -->
  <meta name="msapplication-TileColor" content="#8ac3e9">
  <meta name="theme-color" content="#8ac3e9">
  <meta name="keywords" content="comic, comics, {title}, {settings?.keywords}">
  <meta name="author" content="{title}">
  <meta name="description" content={description}>

  <meta property="og:locale" content={settings?.locale ?? "en_US"}>
  <meta property="og:site_name" content="{settings?.name}">
  <meta property="og:title" content="{title}" />
  <meta property="og:image" content='/api/media/{preview}' />
  <meta property="og:image:secure_url" content='/api/media/{preview}'>
  <meta property="og:image:width" content="800">
  <meta property="og:image:height" content="600">
  <meta property="og:url" content={page?.url} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="article">

  <meta name="twitter:description" content={description}>
  <meta name="twitter:site" content={page?.url}>
  <meta name="twitter:title" content={title}>
  <meta name="twitter:image" content='/api/media/{preview}'>
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:creator" content="{title}">
</svelte:head>
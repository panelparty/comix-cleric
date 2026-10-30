<script>
  // Svelte utilities
  import { page } from '$app/state';

  // Utilities
  import { screen } from '$lib/utils/breakpoints';

  // Global CSS
	import '../app.css';

	// Icons
	import "@phosphor-icons/web/bold";
	import "@phosphor-icons/web/fill";

  // Components
  import SkipToMain from '$lib/components/Accessibility/SkipToMain.svelte';
  import ThemeInjector from '$lib/components/Utilities/ThemeInjector.svelte';
  import OfflinePage from '$lib/components/Placeholders/OfflinePage.svelte';
  import AppContainer from '$lib/components/Layout/AppContainer.svelte';
  import RSSMeta from '$lib/components/Meta/RSSMeta.svelte';
	
  // Providers
  import ToastProvider from '$lib/components/Notifications/ToastProvider.svelte';

	// Props
	let {
    data,
    children
  } = $props();

  // Check if server data is available
  let isOnline = $derived(Object.entries(data?.settings).length > 0);
</script>

<!-- Injects theme CSS -->
<ThemeInjector theme={data?.theme} settings={data?.settings} />

<!-- RSS links always available -->
<RSSMeta />

<!-- Added to app <head> tag. -->
<svelte:head>
  <!-- If there is no custom metadata from the server, use the default title. -->
  {#if !data?.customMeta}
    <title>{data?.settings?.name}</title>
  {/if}

  <!-- Global App favicon -->
  <link rel="icon" href="{`/api/media/${data?.settings?.series_branding ? data?.series?.favicon?.filename_disk : data?.settings?.favicon?.filename_disk}`}" />
</svelte:head>

<!-- Toast provider with custom styles -->
<ToastProvider position={screen.lg.current ? 'top-right' : 'top'} />

<!-- Accessibility link for skipping to the main page contents. Must be the first interactive item. -->
<SkipToMain />

<!-- The actual app container -->
<AppContainer>
  <!-- Check for a server connection by checking for global settings entries from the database. -->
  <!-- Bypass the offline screen if on an `/api` route to not block important actions. -->
  {#if isOnline || page?.url?.pathname.startsWith("/api")}
    <!-- If settings are found, render the app as usual. -->
    {@render children()}

  <!-- If settings are not found or the app was never set up -->
  {:else}
    <OfflinePage />
  {/if}
</AppContainer>

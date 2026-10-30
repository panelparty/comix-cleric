<script>
  // Svelte utilities
	import { onNavigate } from '$app/navigation';

	// Utilities
	import { screen } from '$lib/utils/breakpoints';
	import { appVer } from '$lib/utils/utils.js';

	// Components
  import ProfileButton from '$lib/components/User/ProfileButton.svelte';
  import Logout from '$lib/components/Auth/Logout.svelte';
  import Login from '$lib/components/Auth/Login.svelte';
  import Navigation from '$lib/components/Admin/Layout/Navigation.svelte';
	import NoIndex from '$lib/components/SEO/NoIndex.svelte';

  // Props
	let {
		children,
		data
	} = $props();

	// Setup sidebar menu toggle
	let menuState = $state(false);

	// Comix Cleric help links
	let links = [
		{label: 'Panel Party Bluesky', icon: 'butterfly', url: 'https://bsky.app/profile/panelparty.net'},
		{label: 'Comix Cleric GitHub repo', icon: 'github-logo', url: 'https://github.com/panelparty'},
		{label: 'Comix Cleric main site', icon: 'globe', url: 'https://comixcleric.com'},
	];

	// Effect that will update the menu state reactively based on screen size
	$effect(()=>{
		if (!screen.lg.current) {
			menuState = false;
		} else {
			menuState = true;
		}
	});

	// If we are on mobile, close menu when navigating to new page
	onNavigate(()=>{
		if (!screen.lg.current) {
			menuState = false;
		} else {
			menuState = true;
		}
	});
</script>

<!-- Block indexing -->
<NoIndex />

<!-- Layout wrapper -->
<div class="wrapper mx-auto h-dvh overflow-hidden grid {data?.isAdmin ? 'grid-rows-[min-content_minmax(0,1fr)]' : 'place-content-center'}">
  <!-- Only show this dashboard if the user is an admin -->
	{#if data?.isAdmin}
	<!-- Dashboard header -->
	<header class="relative py-2 p-4 2xl:px-8 grid grid-cols-[auto] md:grid-cols-[auto_auto] gap-4 2xl:gap-8">
	  <!-- TODO: Future loading bar for admin pages. -->
		<!-- <div class="absolute top-0 left-0 right-0 h-1 loading-bar bg-primary-500"></div> -->
		<div class="logo flex items-center gap-4 2xl:gap-8">
		  <!-- Menu button (toggles the sidebar) -->
			<button onclick={()=>{menuState = !menuState}} aria-label="Toggle Menu: {menuState ? 'Closed' : 'Open'}" class="menu-toggle size-8 flex items-center justify-center preset-filled-surface-50-950 dark:preset-filled-surface-100-900 hover:preset-filled-surface-200-800 rounded-md {menuState ? '!bg-primary-500 !text-primary-contrast-500' : ''}">
				<i class="text-xl ph-bold ph-list"></i>
			</button>
			<!-- Admin panel logo button (returns to main site) -->
			<a href="/" target="_blank"><img alt="{data?.settings?.name} logo" src="/api/media/{data?.settings?.logo?.filename_disk}" class="block max-w-full h-screen max-h-12"></a>
		</div>
		<!-- If we are not on mobile, show these Comix Cleric info links -->
		{#if screen.md.current}
		<div class="links text-xl h-full flex items-center justify-end gap-4">
		  {#each links as item}
			<a href={item?.url} aria-label={item?.label} title={item?.label} target="_blank" class="hover:text-primary-500"><i class="ph-fill ph-{item?.icon}"></i></a>
			{/each}
		</div>
		{/if}
	</header>
	<div class="relative overflow-hidden grid grid-rows-1 grid-cols-1 {menuState ? 'md:grid-cols-[auto_1fr]' : ''}">
		{#if menuState}
		<aside class="absolute z-50 inset-0 py-4 md:py-0 md:relative bg-surface-50-950 md:bg-transparent px-4 2xl:px-8 h-full min-w-screen md:min-w-[250px] grid grid-rows-[auto_min-content] gap-2">
		  
			<!-- Navigation component -->
			<!-- TODO: Make links customizable -->
			<Navigation data={data} />
			<div class="grid items-end h-full w-full sm:pb-4">
			  <!-- If we are on mobile, show these Comix Cleric info links -->
				{#if !screen.md.current}
				<div class="links text-xl flex items-center gap-4 mt-4">
    		  {#each links as item}
     			<a href={item?.url} aria-label={item?.label} title={item?.label} target="_blank" class="hover:text-primary-500"><i class="ph-fill ph-{item?.icon}"></i></a>
     			{/each}
				</div>
				{/if}


				<!-- If we have user data, show the profile button -->
				{#if data?.user}
					<ProfileButton data={data}>
						{#snippet profileOptions()}
						  <!-- Profile menu -->
						  <!-- TODO: Add more options -->
							<div class="space-y-2 flex flex-col">
								<a href="/_cc_admin/users/profile/{data?.user?.id}" class="btn w-full preset-filled-surface-300-700">Account Details</a>
								<a href="/_cc_admin/users/edit/{data?.user?.id}" class="btn w-full preset-filled-surface-300-700">Account Settings</a>
								<Logout class="w-full" />
							</div>
						{/snippet}
					</ProfileButton>
				{/if}
				<!-- Current app version -->
				<p class="app-version mx-auto mt-2">App Version: <a href="https://comixcleric.com/docs/changelogs#{appVer}" target="_blank" class="anchor">{appVer}</a></p>
			</div>
		</aside>
		{/if}
		<!-- Main page contents -->
		<main class="relative grid min-h-0 w-full overflow-hidden md:pb-4 md:pr-4 {menuState ? '' : 'md:pl-4 2xl:pl-8'} 2xl:pr-8" id="main-content">
		  <!-- Scroll container -->
			<!-- TODO: Make sure that scroll-to-top on navigation is active for this container -->
			<div class="@container-size grid min-h-0 grid-cols-1 gap-4 w-full overflow-y-auto bg-surface-50-950 md:rounded-xl p-2 md:p-4 xl:p-8">
				<!-- Render what we're given by the page -->
			  {@render children()}
			</div>
		</main>
	</div>
	{:else}
	<!-- If the user is not an admin (or not logged-in), display login screen -->
	<div class="w-dvw h-dvh overflow-y-auto p-2 md:px-4 md:py-12 grid">
	  <!-- Login card -->
		<div class="flex flex-col items-center space-y-8 preset-filled-surface-50-950 max-w-80 md:max-w-sm p-4 md:p-8 rounded-2xl place-self-center">
		  <!-- Site logo + home link -->
			<a href="/" class="w-full grid place-content-center hover:opacity-60">
				<img src="/api/media/{data?.settings?.logo?.filename_disk}" alt="" class="h-auto">
			</a>
			<!-- Login request message -->
			<h4 class="h4 text-center leading-none">Please log in to continue</h4>
			<!-- Login form modal -->
			<div class="w-full">
				<Login {data} demo={data?.settings?.demo_mode} class="w-full" />
			</div>
		</div>
	</div>
	{/if}
</div>

<script>
  // Utility imports
  import {
		accountRoutes,
		assetRoutes,
		comicRoutes,
		helpRoutes,
		mainRoutes,
		siteRoutes
	} from "./navigation";

  // Component imports
  import NavigationSection from "./NavigationSection.svelte";
  
	// Export props
  let { data } = $props();
</script>

<!-- Semantic HTML navigation element -->
<nav class="overflow-y-auto space-y-2">
  <!-- Main section -->
	<NavigationSection {data} routes={mainRoutes} />
  <!-- Manage Comic section -->
	<NavigationSection {data} label="Manage Comic" routes={comicRoutes} />
	<!-- Asset Management section -->
	<NavigationSection {data} label="Asset Management" routes={assetRoutes} />
	<!-- Moderation section -->
	<!-- <NavigationSection {data} label="Moderation" routes={moderationRoutes} /> -->
	<!-- Site Settings section -->
	<NavigationSection {data} label="Site Settings" routes={siteRoutes} />
	<!-- User Accounts section -->
	<NavigationSection {data} label="User Accounts" routes={accountRoutes} />
	<!-- Helpful Links section -->
	<NavigationSection {data} label="Helpful Links" routes={helpRoutes} />
</nav>

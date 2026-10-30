<script>
  import { page } from "$app/state";

  // Utility imports
  import { getActiveState } from "./navigation";

  // Component imports
  import NavigationLabel from "./NavigationLabel.svelte";
  import NavigationLink from "./NavigationLink.svelte";

  // Export props
  let { data, label, routes } = $props()

</script>

<!-- Component wrapper -->
<div class="">
  <!-- Navigation label component -->
  <NavigationLabel {label} />
  <!-- Navigation list -->
  <ul class="">
	  {#each routes as item}
		<!-- Navigation link component -->
		<NavigationLink label={item?.label} url="{item?.url}{item?.slug === 'account' || item?.slug === 'account-settings' ? `/${data?.user?.id}` : ''}" icon={item?.icon} external={item?.external} active={getActiveState((item?.url + (item?.slug === 'account' || item?.slug === 'account-settings' ? `/${data?.user?.id}` : '')), page, item?.match)} />
		{/each}
	</ul>
</div>

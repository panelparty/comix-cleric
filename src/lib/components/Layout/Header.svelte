<script>
  // Utilities
  import { screen } from '$lib/utils/breakpoints';
  import { createLookup } from '$lib/utils/utils';
  import { headerLayouts } from '$lib/utils/validation/style';

  // Components
  import Logo from "$lib/components/Branding/Logo.svelte";
  import HeaderNavigation from '../Navigation/HeaderNavigation.svelte';

  // Props
  let {
    data
  } = $props();

  // Get header layout presets
  let getLayout = createLookup(headerLayouts, 'value');
  let headerLayout = $derived(getLayout(data?.settings?.header_layout));
</script>

<!-- Semantic HTML header element -->
<header class="header-container header-bg {headerLayouts[headerLayout]?.styles}">
  <!-- Logo component -->
  <Logo {data} />
  <!-- Header navigation (only displayed on large screens) -->
  {#if screen.lg.current}
		<HeaderNavigation {data} />
	{/if}
</header>

<style>
  .header-container {
    padding: calc(var(--spacing) * 2);
    display: flex;
    gap: calc(var(--spacing) * 4);

    @media (width >= 48rem) {
      padding: calc(var(--spacing) * 4);
    }
  }
</style>
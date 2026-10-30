<script>
  // Svelte utilities
  import { afterNavigate } from '$app/navigation';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';

  // Utilities
	import { screen } from '$lib/utils/breakpoints';
  import { capitalizeString } from '$lib/utils/generate/string.js';

  // Components
	import Header from '$lib/components/Layout/Header.svelte';
  import Footer from '$lib/components/Layout/Footer.svelte';
  import MobileNav from '$lib/components/Navigation/MobileNav.svelte';
  import PageMeta from '$lib/components/Meta/PageMeta.svelte';
  import WelcomeNotice from '$lib/components/Alerts/WelcomeNotice.svelte';

  // Props
	let {
    children,
    data
  } = $props();

	// Check if we are inside a subroute (boolean)
  let isSubroute = $derived.by(() => {
    // Current URL path
    const url = String($page?.url?.pathname) ?? '';

    // Create array from current path
    const strippedUrl = url.split('/');

    // A subroute exists if there's more than just '/' after the base URL
    return strippedUrl.length > 1;
  });

  // Check if layout expects custom <head> metadata
  let hasCustomMeta = $derived($page?.data?.customMeta);

  // If we need to set a background image, set its position as well
  let siteBGPos = $derived.by(()=>{
    if (data?.settings?.bg_position && data?.settings?.bg_position != '') {
      return data?.settings?.bg_position;
    }
    return 'center';
  })

  // If we need to set a background image, do that
  let siteBGImg = $derived.by(()=>{
    if (data?.settings?.bg_img && data?.settings?.bg_img != '') {
      return data?.settings?.bg_img;
    }
    return '';
  })

  // Setup scroll-to-top functionality
  let wrapper = $state();
  afterNavigate(() => {
    if (wrapper) {
      wrapper.scrollTo(0, 0);
    }
  });

  // Mobile nav state
  let navEl = $state();
  let navHeight = $state(0);
  $effect(() => {
    if (navState.show && navEl) {
      navHeight = navEl.offsetHeight;
    }
  });

  // Setup scroll detection for showing/hiding thumb menu on mobile devices
  let lastScroll = $state(0);
  let navState = $state({ show: true });

  let scrollLock = false;
  let scrollLockTimer;

  function handleScroll(e) {
    if (!browser) return;

    const el = e?.target;
    const currentScroll = el?.scrollTop;

    if (scrollLock) {
      lastScroll = currentScroll ?? lastScroll;
      return;
    }

    const scrollDiff = currentScroll - lastScroll;

    if (Math.abs(scrollDiff) > 10) {
      const nextShow = scrollDiff < 0;
      lastScroll = currentScroll;

      const maxScroll = (el?.scrollHeight ?? 0) - (el?.clientHeight ?? 0);
      if (!nextShow && maxScroll - navHeight <= 1) return;

      if (nextShow !== navState.show) {
        navState.show = nextShow;

        scrollLock = true;
        clearTimeout(scrollLockTimer);
        scrollLockTimer = setTimeout(() => { scrollLock = false; }, 250);
      }
    }
  }
</script>

<!-- Injected into page <head> element -->
{#if !data?.customMeta}
  <PageMeta {data} />
{/if}

<!-- Injected into the page <head> element -->
<svelte:head>
  {#if !data?.customMeta}
  <!-- If we're not expecting custom metadata -->
    <title>{data?.settings?.name + " | " + data?.settings?.description + " | " + (capitalizeString($page?.url?.pathname.split('/').reverse()[0]) ?? 'Home')}</title>
  {/if}
</svelte:head>

<!-- Ensures the mobile menu can appear and take up its own space -->
<div class="mobile-nav-wrapper">
  <!-- Allows a non-global background image -->
  <div class="page-wrapper app-bg" onscroll={handleScroll} bind:this={wrapper}>
    <!-- Layout wrapper (custom max-width) -->
    <div style="max-width: {data?.settings?.width};" class="page-container page-bg">
      <!-- Main page layout -->
      <div class="page-layout">
        <!-- Page header -->
        <Header {data} />

        <!-- Page contents -->
        <main class="page-main" id="main-content">
          <!-- Render elements from any +page.svelte file.  -->
          {@render children()}
        </main>
        
        <!-- Page footer -->
        <Footer {data} />
      </div>
    </div>
  </div>

  <!-- Mobile thumb-bar navigation -->
  {#if !screen.lg.current}
    <div bind:this={navEl}>
      <MobileNav {data} showNav={navState?.show} />
    </div>
  {/if}
</div>

<!-- Warning pop-up message -->
{#if data?.settings?.warning_popup}
  <WelcomeNotice
    title={data?.settings?.warning_title}
    content={data?.settings?.warning_message}
  />
{/if}

<!-- Styles -->
<style>
  .mobile-nav-wrapper {
    width: 100cqi;
    height: 100cqb;
    display: grid;
    grid-template-rows: auto min-content;

    @media (width >= 64rem) {
      grid-template-rows: repeat(1, minmax(0, 1fr));
    }
  }

  .page-wrapper {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .page-container {
    height: fit-content;
    min-height: 100dvh;
    width: 100%;
    margin: 0 auto;
    background: var(--color-surface-50-950);
    display: grid;
  }

  .page-layout {
    height: 100%;
    display: grid;
    grid-template-rows: min-content auto min-content;
  }

  .page-main {
    position: relative;
    height: 100%;
  }
</style>
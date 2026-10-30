<script>
  // Svelte utility imports
  import { page } from '$app/stores';

  // Utilities
  import { checkNull } from '$lib/utils/detectTypes';
  import { filter } from 'lodash-es';
  
  // Components
  import { Popover } from '@skeletonlabs/skeleton-svelte';

  // Export props
  let {
    data,
    showNav
  } = $props();

  // Reassign server data
  let pages = $derived(data?.pages);
  let thumbCount = $derived.by(()=>{
    return filter(pages, { show_thumb: true })?.length;
  });

  // Setup menu and button states
  let active = $state(false);
  let openMore = $state(false);

  function modalClose() {
    openMore = false;
  }

  // Updates `active` to reflect the current url path.
  $effect(()=>{
    if ($page) {
      active = $page.url.pathname;
    }
  });

  // Reactively opens/closes the navigation bar.
  $effect(()=>{
    if (!showNav) {
      modalClose();
    }
  });

</script>

<!-- Navigation container -->
<nav class="mobile-nav shadow-xl" data-show={showNav} style="grid-template-columns: repeat({thumbCount + 1}, auto);">
  {#each pages as item, i}
    {#if item?.show_thumb && item?.status === 'published'}
      <a
        class="button mobile-nav-button"
        data-active={item.url === active}
        href={item?.url}
      >
        <i class='mobile-nav-button-icon ph-{item.url === active ? 'fill' : 'bold'} ph-{item?.icon}'></i>
        {item?.label ?? item?.name}
      </a>
    {/if}
  {/each}
  <!-- All links menu -->
  <Popover
    open={openMore}
    onOpenChange={(e) => (openMore = e.open)}
    close={false}
    data-active={openMore}
    triggerClasses="button mobile-nav-button"
    contentClasses="mobile-nav-menu"
    positioning={{ placement: "top" }}
  >
    {#snippet trigger()}
      <i class='text-2xl ph-{openMore === true ? 'fill' : 'bold'} ph-dots-three'></i>
      More
    {/snippet}
    {#snippet content()}
      <nav class="mobile-nav-menu-wrapper">
        {#each pages as item, i}
          {#if item?.show_mobile && item?.status === 'published'}
            <a
              class="button mobile-menu-button"
              disabled={item?.disabled}
              data-active={item.url === active}
              href={item?.url}
              onclick={modalClose}
            >
              <i class='mobile-menu-button-icon ph-{item.url === active ? 'fill' : 'bold'} ph-{item?.icon}'></i>
              {item?.label ?? item?.name}
            </a>
          {/if}
        {/each}
      </nav>
    {/snippet}
  </Popover>
</nav>

<style>
  .mobile-nav {
    background: var(--color-tertiary-500);
    width: 100%;
    max-width: 100vw;
    max-height: fit-content;
    bottom: -1px;
    display: grid;
    grid-template-rows: repeat(1, minmax(0, 1fr));
    overflow: hidden;
    transition: all 150ms ease;
    
    &[data-show="false"] {
      max-height: 0;
    }
  }

  :global(.mobile-nav-button) {
    position: relative;
    z-index: 80;
    background: var(--color-surface-100-900);
    width: 100%;
    height: 100%;
    padding-block: calc(var(--spacing) * 3);
    color: var(--color-surface-contrast-100-900);
    font-size: var(--text-xs);
    font-weight: 700;
    line-height: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: calc(var(--spacing) * 2);
    border-radius: 0;

    &[data-active="true"],
    &[data-state="open"] {
      background: var(--color-primary-500) !important;
      color: var(--color-surface-950) !important;
    }
  }

  .mobile-nav-button-icon,
  .mobile-menu-button-icon {
    font-size: var(--text-xl);
  }

  :global(.mobile-nav-menu) {
    background: var(--color-surface-100-900);
    min-width: var(--container-xs);
    width: 100%;
    height: fit-content;
    max-height: 100%;
    padding: calc(var(--spacing) * 4);
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 4);
    overflow-y: auto;
  }

  .mobile-nav-menu-wrapper {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 2);
    align-items: center;
    justify-content: end;
  }

  .mobile-menu-button {
    background: var(--color-surface-50-950);
    width: 100%;
    padding: calc(var(--spacing) * 2) calc(var(--spacing) * 4);
    color: var(--color-surface-contrast-100-900);
    justify-content: start;

    &[data-active="true"] {
      background: var(--color-primary-500) !important;
      color: var(--color-surface-950) !important;
    }
  }
</style>
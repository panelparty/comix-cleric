<script>

  // Svelte utility imports
  import { page } from '$app/state';
  import { fallback } from '$lib/utils/utils';

  
  // Props
  let { data } = $props();


  // Setup component state
  let active = $derived(page.url.pathname);

</script>


<!-- Semantic HTML navigation element -->
<nav class="header-nav-container">
  <!-- Navigation link list -->
  <ul class="header-nav-list">
    {#each data?.pages as item, i}
      {#if item?.show_header && item?.status === 'published'}
      <li class="header-nav-item">
        <!-- Navigation link -->
        <a
          class="header-nav-link button"
          class:active={item?.url === active}
          disabled={item?.disabled === true}
          href={item?.url}
        >
          <!-- Icon (Phosphor icons) -->
          {#if item?.icon}
          <span class="header-nav-icon">
            <i class='ph-{item?.url === active ? 'fill' : 'bold'} ph-{item?.icon}'></i>
          </span>
          {/if}


          <!-- Link title/label -->
          <span class="header-nav-label">{fallback([item?.label, item?.name])}</span>
        </a>
      </li>
      {/if}
    {/each}
  </ul>
</nav>


<style>

  .header-nav-list {
    width: 100%;
    display: grid;
    grid-template-rows: repeat(1, minmax(0, 1fr));
    grid-auto-flow: column;
    gap: calc(var(--spacing) * 2);
  }


  .header-nav-item {
    height: 100%;
  }


  .header-nav-link {
    height: 100%;
    display: flex;
    align-items: center;
    gap: calc(var(--spacing) * 2);
    background: var(--color-surface-100);
    color: var(--color-surface-950-50);
    font-weight: bold;
    line-height: .8;

    @media (prefers-color-scheme: dark) {
      background: var(--color-surface-950);
    }

    &:not(:disabled) {
      &:hover {
        background: var(--color-surface-50);
        @media (prefers-color-scheme: dark) {
          background: var(--color-surface-900);
        }
      }
    }

    &.active {
      background-color: var(--color-primary-500) !important;
      color: var(--color-primary-contrast-500);
    }
  }


  .header-nav-icon {
    font-size: calc(1.25rem * var(--text-scaling));
  }

</style>
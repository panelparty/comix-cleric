<script>
  // Utilities
  import { fallback } from "$lib/utils/utils";

  // Props
  let { data } = $props();
</script>

<!-- Component container -->
<div class="sitemap-container px-4">
  <!-- Heading/title -->
  <h5 class="title">Sitemap</h5>
  <!-- Route/link list -->
  <ul class="sitemap-list">
    <!-- Optional link to a "main site" -->
    {#if data?.settings?.main_site_enabled === true}
    <li>
      <a class="link sitemap-link" href={data?.settings?.main_site_url}>{data?.settings?.main_site_label}</a>
    </li>
    {/if}
    {#each data?.pages as item, i}
      {#if item?.show_footer && item?.status === 'published'}
      <li>
        <a class="link sitemap-link" href={item?.url}>{fallback([item?.label, item?.name])}</a>
      </li>
      {/if}
    {/each}
    <li>
      <a class="link sitemap-link" href="/api/rss" target="_blank">RSS</a>
    </li>
  </ul>
</div>

<style>
  .sitemap-container {
    width: 100%;
    margin-inline: auto;
    padding-inline: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--spacing) * 1);

    @media (width >= 48rem) {
      margin-bottom: 0;
    }
  }

  .sitemap-list {
    max-width: var(--container-3xs);
    display: inline-flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0 calc(var(--spacing) * 2);
  }

  .sitemap-link {
    color: var(--color-surface-950-50);
    
    &:hover {
      color: var(--color-primary-500);
    }
  }
</style>

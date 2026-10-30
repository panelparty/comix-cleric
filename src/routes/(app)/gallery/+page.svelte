<script>
  // Svelte utilities
  import { page } from '$app/stores';

  // Utilities
  import { createPageState } from '$lib/utils/page/pageState.svelte.js';
  
  // Components
  import ComingSoon from '$lib/components/Placeholders/ComingSoon.svelte';
  import PageHeading from '$lib/components/DataBlocks/PageHeading.svelte';
  import Pagination from '$lib/components/Pagination/Pagination.svelte';
  import Section from '$lib/components/DataBlocks/Section.svelte';
  import DisplayDate from '$lib/components/Display/DisplayDate.svelte';
  import PageStatus from '$lib/components/Alerts/PageStatus.svelte';
    
  // Props
  let { data } = $props();

  // Reassign server data
  let currentPage = $derived(data?.currentPage);
  let gallery = $derived(data?.gallery);
  let galleryCount = $derived(data?.galleryCount);
  let galleryCountTotal = $derived(data?.galleryTotalCount);

  // Pagination paramters
  let searchParams = createPageState($page.url,
    {
      page: 1,
      limit: data?.settings?.page_limit ?? 25,
    }
  );

  // Filtering
  let openFilters = $state(false);

  // Create pagination boundary
  let maxPage = $derived(Math.ceil(galleryCount / searchParams.state.limit));

  // Effect to ensure currentPage stays within bounds
  $effect(() => {
    if (maxPage > 0 && searchParams.state.page > maxPage) {
      searchParams.state.page = maxPage;
    }
  });
</script>

<!-- Page container -->
<Section class="gallery-section" width="var(--container-5xl)">
  <!-- Page heading/title component -->
  <PageHeading heading="Gallery" class="gallery-page-heading" />

  <!-- If we have gallery items, display them -->
  {#if gallery?.length > 0}
  <div class="gallery-container">
    <ul class="gallery-list">
      {#each gallery as item}
      <li class="">
        <a href="/gallery/{item?.slug}" class="gallery-item" layout="card">
          <div class="gallery-item-preview">
            <img src="api/media/{item?.cover?.filename_disk}" alt={item?.cover?.description}>
          </div>
          <div class="gallery-item-info">
            <div class="gallery-item-header">
              {#if item?.type}
              <p class="display-type gallery-item-type">{item?.type?.name}</p>
              {/if}
              <p class="gallery-item-title" title={item?.name}>{item?.name}</p>
            </div>
            <DisplayDate label="Posted:" date={item?.date_published} />
          </div>
        </a>
      </li>
      {/each}
    </ul>

    <!-- Pagination -->
    <Pagination
      data={gallery}
      count={galleryCount}
      onPageChange={(e) => searchParams.state.page = e.page}
      page={searchParams.state.page}
      bind:pageSize={searchParams.state.limit}
    />
  </div>
  {:else}
  <!-- Gallery items not found -->
  <ComingSoon />

  <!-- Disable page -->
  <PageStatus {data} />
  {/if}
</Section>

<style>
  :global(.gallery-section) {
    padding: calc(var(--spacing) * 2);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 2);

    @media (width >= 48rem) {
      max-width: var(--container-5xl);
    }
  }

  .gallery-container {
    height: 100%;
    display: grid;
    grid-template-rows: 1fr min-content;
  }

  .gallery-list {
    --columns: 1;

    width: 100%;
    display: grid;
    grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
    gap: calc(var(--spacing) * 2);

    @media (width >= 40rem) {
      --columns: 2;
    }
    @media (width >= 48rem) {
      --columns: 3;
    }
    @media (width >= 64rem) {
      --columns: 4;
    }
  }

  .gallery-item {
    background: var(--color-surface-100-900);
    overflow: hidden;
    border-radius: var(--radius-lg);
    
    &:hover {
      background: var(--color-surface-200-800);
    }
  }
  .gallery-item[layout="card"] {
    display: grid;
    grid-template-rows: auto min-content;
  }

  .gallery-item-preview {
    display: flex;
    align-items: center;
    aspect-ratio: 1;
    overflow: hidden;
    background: var(--color-surface-100-900);
  }
  .gallery-item-preview img {
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
  }

  .gallery-item-info {
    padding: calc(var(--spacing) * 2);
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 2);
  }
  
  .gallery-item-header {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .gallery-item-type {
    font-size: var(--text-sm);
  }

  .gallery-item-title {
    font-weight: 700;
    font-size: var(--text-lg);
    line-height: var(--leading-tight);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
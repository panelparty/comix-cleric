<script>
  // Svelte utilities
  import { page } from "$app/stores";

  // Utilities
  import { createPageState } from "$lib/utils/page/pageState.svelte.js";
  import { adminRoute } from "$lib/components/Admin/Layout/navigation.js";

  // Components
  import ComingSoon from "$lib/components/Placeholders/ComingSoon.svelte";
  import PageHeading from "$lib/components/DataBlocks/PageHeading.svelte";
  import Pagination from "$lib/components/Pagination/Pagination.svelte";
  import ItemCard from "$lib/components/DataBlocks/ItemCard.svelte";
  import Section from "$lib/components/DataBlocks/Section.svelte";
  import PageStatus from "$lib/components/Alerts/PageStatus.svelte";

  // Props
  let {
    data
  } = $props();

  // Destructure server data
  let cast = $derived(data?.cast);
  let castCount = $derived(data?.castFilteredCount);
  let castCountTotal = $derived(data?.castTotalCount);

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
  let maxPage = $derived(Math.ceil(castCount / searchParams.state.limit));

  // Effect to ensure stays within bounds
  $effect(() => {
    if (maxPage > 0 && searchParams.state.page > maxPage) {
      searchParams.state.page = maxPage;
    }
  });
</script>

<!-- Page container -->
<Section class="cast-section" wrapperWidth="var(--container-5xl)">
  <!-- Page heading component -->
  <PageHeading heading="Cast" />

  <!-- If cast posts exist -->
  {#if cast?.length > 0}
    <!-- Cast list -->
    <ul class="post-grid">
      {#each cast as item}
      <ItemCard
        data={item}
        href="/cast/{item?.slug}"
      />
      {/each}
    </ul>

    <!-- Pagination -->
    <Pagination
      data={cast}
      count={castCountTotal}
      onPageChange={(e) => searchParams.state.page = e.page}
      page={searchParams.state.page}
      bind:pageSize={searchParams.state.limit}
      classes="w-full"
    />

  {:else}
  <!-- No cast found -->
  <ComingSoon />

  <!-- Disable page -->
  <PageStatus {data} />
  {/if}
</Section>

<style>
  :global(.cast-section) {
    padding: calc(var(--spacing) * 2);
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: calc(var(--spacing) * 2);
  }

  .post-grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: calc(var(--spacing) * 2);

    @media (width >= 40rem) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    @media (width >= 48rem) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    @media (width >= 64rem) {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
</style>
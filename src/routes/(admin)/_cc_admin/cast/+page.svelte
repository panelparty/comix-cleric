<script>

  // Svelte utility imports
  import { page } from "$app/stores";

  // Utility imports
  import { screen } from "$lib/utils/breakpoints.js";
  
// Component imports
  import Table from "$lib/components/Admin/Table.svelte";
  

// Skeleton UI component imports
  import { Modal } from '@skeletonlabs/skeleton-svelte';
  import { createPageState } from "$lib/utils/page/pageState.svelte.js";
  import Pagination from "$lib/components/Pagination/Pagination.svelte";
  

// Export props
  let { data } = $props();


  // Reassign server data
  let cast = $derived(data?.cast);
  let castCount = $derived(data?.filtered_cast_count);
  let castCountTotal = $derived(data?.cast_count);
  let castTypes = $derived(data?.castTypes);


  // Pagination paramters
  let searchParams = createPageState($page.url,
    {
      sort: '-date_published',
      type: '*',
      status: '*',
      page: 1,
      limit: data?.settings?.page_limit ?? 25,
    }
  );


  // Sorting
  let sortDir = $derived(searchParams.state.sort.startsWith('-') ? '-' : '');
  let sortField = $derived(searchParams.state.sort.replace(/^-/, ''));

  function setSort(field, dir) {
    searchParams.state.sort = `${dir}${field}`;
  }


  // Filtering
  let openFilters = $state(false);


  // Create pagination boundary
  let maxPage = $derived(Math.ceil(castCount / searchParams.state.limit));

  // Effect to ensure currentPage stays within bounds
  $effect(() => {
    if (maxPage > 0 && searchParams.state.page > maxPage) {
      searchParams.state.page = maxPage;
    }
  });

  // Reset all filters
  function clearFilters() {
    searchParams.state.status = '*'
    searchParams.state.type = '*'
  }

</script>

<!-- Page container -->
<section class="w-full max-w-5xl mx-auto h-fit space-y-4">
  <!-- Page heading -->
  <div class="flex gap-4">
    <!-- Page title + item count -->
    <h3 class="h3 leading-none! w-full flex items-center gap-2">Cast <span class="font-medium text-surface-700-300 text-base mt-1">• Total: {castCount}</span></h3>
    <!-- Create new cast button -->
    <a href="/_cc_admin/cast/create" class="btn px-3 py-2 preset-filled-primary-500 text-surface-950! leading-none flex gap-2 items-center whitespace-nowrap"><i class="ph-bold ph-plus"></i>Add New Cast Member</a>
  </div>
  <!-- Sorting and filter options -->
  <div class="bg-surface-50-950  px-4 pt-2 pb-4 min-h-16 space-y-2">
    <!-- Sorting menu -->
    <div class="text-base md:text-sm grid grid-cols-[max-content_auto] gap-2 items-end">
      <div class="w-full">
        <p class="">Sort:</p>
        <div class="input-group w-auto grid grid-cols-[1fr_min-content_min-content]">
          <select class="ig-select w-full md:w-fit rounded-l-md" value={sortField} onchange={(e) => setSort(e.currentTarget.value, sortDir)}>
            <option value="date_published" selected>Debut Date</option>
            <option value="name">Name</option>
            <option value="date_created">Date Created</option>
            <option value="date_updated">Date Updated</option>
          </select>
          <button class="ig-btn aspect-square text-xs p-1 md:w-auto grid place-content-center {sortDir === '' ? 'bg-primary-500 text-surface-950' : ''}" onclick={() => setSort(sortField, '')}><i class="ph-bold ph-plus"></i></button>
          <button class="ig-btn aspect-square text-xs p-1 md:w-auto grid place-content-center {sortDir === '-' ? 'bg-primary-500 text-surface-950' : ''}" onclick={() => setSort(sortField, '-')}><i class="ph-bold ph-minus"></i></button>
        </div>
      </div>
      <!-- Filter menu -->
      {#if screen.md.current}
      <!-- Desktop filter menu -->
      <div class="w-full">
        <p class="">Filter:</p>
        <div class="flex gap-2">
          <select class="select w-full md:w-fit" bind:value={searchParams.state.type}>
            <option value="*" selected>Character Role</option>
            {#each castTypes as item}
            <option value="{item?.slug}">{item?.name}</option>
            {/each}
          </select>
          <select class="select w-full md:w-fit" bind:value={searchParams.state.status}>
            <option value="*" selected>Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button aria-label="Reset filters" class="btn grid place-content-center preset-outlined-surface-200-800 " onclick={()=>{clearFilters()}}><i class="ph-bold ph-arrows-clockwise"></i></button>
        </div>
      </div>
      {:else}
      <!-- Mobile filter menu -->
      <div class="grid grid-cols-[auto_min-content] gap-2">
        <Modal
          {openFilters}
          onOpenChange={(e) => (openFilters = e.open)}
          triggerClasses="btn  w-full preset-filled-surface-500 "
          contentClasses="max-h-[calc(100dvh-2rem)] w-full overflow-y-auto shadow-xl shadow-surface-950/10 w-[calc(100vw-2rem)] md:max-w-sm bg-surface-50-950 p-6 "
        >
          {#snippet trigger()}
            Filters
          {/snippet}
          {#snippet content()}
            <div class="w-full space-y-2">
              <div class="grid grid-cols-[auto_min-content]">
                <h4 class="h4">Filters</h4>
                <button aria-label="Close filters" class="btn  size-10 aspect-square grid place-content-center preset-filled-error-500 " onclick={()=>{closeFilters()}}><i class="ph-bold ph-x"></i></button>
              </div>
              <div class="flex flex-col gap-2">
                <select class="select w-full md:w-fit" bind:value={searchParams.state.type}>
                  <option value="*" selected>Character Role</option>
                  {#each castTypes as item}
                  <option value="{item?.slug}">{item?.name}</option>
                  {/each}
                </select>
                <select class="select w-full md:w-fit" bind:value={searchParams.state.status}>
                  <option value="*" selected>Status</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          {/snippet}
        </Modal>
        <button aria-label="Reset filters" class="btn  grid place-content-center preset-outlined-surface-200-800 " onclick={()=>{clearFilters()}}><i class="ph-bold ph-arrows-clockwise"></i></button>
      </div>
      {/if}
    </div>
    <!-- Item table -->
    <Table data={data} dataType="cast" canView canEdit canShare canDelete deleteAction="/api/actions/cast?/delete" />
    <!-- If there are cast items, show pagination -->
    {#if cast.length > 0}
    <div class="sticky -ml-2 bottom-0 grid grid-cols-[auto_min-content] gap-2 items-center fg-color">
      <!-- Pagination component -->
      <Pagination
        data={cast}
        count={castCountTotal}
        onPageChange={(e) => searchParams.state.page = e.page}
        page={searchParams.state.page}
        bind:pageSize={searchParams.state.limit}
      >
        {#snippet labelEllipsis()}<i class="ph-bold ph-dots-three"></i>{/snippet}
        {#snippet labelNext()}<i class="ph-bold ph-arrow-right"></i>{/snippet}
        {#snippet labelPrevious()}<i class="ph-bold ph-arrow-left"></i>{/snippet}
        {#snippet labelFirst()}<i class="ph-bold ph-caret-line-left"></i>{/snippet}
        {#snippet labelLast()}<i class="ph-bold ph-caret-line-right"></i>{/snippet}
      </Pagination>
    </div>
    {:else if castCountTotal > 0}
    <!-- If cast exist in the server, but no filtered results exist -->
    <div class="w-fit mx-auto flex flex-col items-center">
      <p class="text-xl md:text-2xl font-semibold">No cast found.</p>
      <p class="text-sm opacity-80">(Try resetting your filters)</p>
    </div>
    {:else}
    <!-- If no cast items exist in the database -->
    <div class="w-fit mx-auto space-y-2 flex flex-col items-center">
      <p class="text-xl md:text-2xl font-semibold">No cast found...</p>
      <a href="/_cc_admin/cast/create" class="btn w-fit px-3 py-2 preset-filled-primary-500 text-surface-950! leading-none flex gap-2 items-center whitespace-nowrap"><i class="ph-bold ph-plus"></i>Add New Cast Member</a>
    </div>
    {/if}
  </div>
</section>
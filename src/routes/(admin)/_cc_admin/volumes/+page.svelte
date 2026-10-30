<script>

  import Table from "$lib/components/Admin/Table.svelte";

  import { Modal } from '@skeletonlabs/skeleton-svelte';

  
  import { page } from "$app/stores";
  import { screen } from "$lib/utils/breakpoints.js";
  import { createPageState } from "$lib/utils/page/pageState.svelte.js";
  import Pagination from "$lib/components/Pagination/Pagination.svelte";

  let { data } = $props();

  let volumes = $derived(data?.volumes);
  let volumesCount = $derived(data?.filtered_volumes_count);
  let volumesCountTotal = $derived(data?.volumes_count);

  // Pagination paramters
  let searchParams = createPageState($page.url,
    {
      sort: '-date_published',
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
  let maxPage = $derived(Math.ceil(volumesCount / searchParams.state.limit));

  // Effect to ensure currentPage stays within bounds
  $effect(() => {
    if (maxPage > 0 && searchParams.state.page > maxPage) {
      searchParams.state.page = maxPage;
    }
  });

  // Reset all filters
  function clearFilters() {
    searchParams.state.status = '*'
  }

</script>

<section class="w-full max-w-5xl mx-auto h-fit space-y-4">
  <div class="flex gap-4">
    <h3 class="h3 leading-none! w-full flex items-center gap-2">Volumes <span class="font-medium text-surface-700-300 text-base mt-1">• Total: {volumesCount}</span></h3>
    <a href="/_cc_admin/volumes/create" class="btn px-3 py-2 preset-filled-primary-500 text-surface-950! leading-none flex gap-2 items-center whitespace-nowrap"><i class="ph-bold ph-plus"></i>Add New Volume</a>
  </div>
  <hr class="hr my-4">
  <div class="bg-surface-50-950  px-4 pt-2 pb-4 min-h-16 space-y-2">
    <div class="text-base md:text-sm grid grid-cols-[max-content_auto] gap-2 items-end">
      <div class="w-full">
        <p class="">Sort:</p>
        <div class="input-group w-auto grid grid-cols-[1fr_min-content_min-content]">
          <select class="ig-select w-full md:w-fit rounded-l-md" value={sortField} onchange={(e) => setSort(e.currentTarget.value, sortDir)}>
            <option value="date_published" selected>Date Published</option>
            <option value="name">Title</option>
            <option value="date_created">Date Created</option>
            <option value="date_updated">Date Updated</option>
          </select>
          <button class="ig-btn aspect-square text-xs p-1 md:w-auto grid place-content-center {sortDir === '' ? 'bg-primary-500 text-surface-950' : ''}" onclick={() => setSort(sortField, '')}><i class="ph-bold ph-plus"></i></button>
          <button class="ig-btn aspect-square text-xs p-1 md:w-auto grid place-content-center {sortDir === '-' ? 'bg-primary-500 text-surface-950' : ''}" onclick={() => setSort(sortField, '-')}><i class="ph-bold ph-minus"></i></button>
        </div>
      </div>
      {#if screen.md.current}
      <div class="w-full">
        <p class="">Filter:</p>
        <div class="flex gap-2">
          <select class="select w-full md:w-fit max-w-32" bind:value={searchParams.state.status}>
            <option value="*" selected>Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button aria-label="Reset filters" class="btn btn-sm size-8 grid place-content-center preset-outlined-surface-200-800 " onclick={()=>{clearFilters()}}><i class="ph-bold ph-arrows-clockwise"></i></button>
        </div>
      </div>
      {:else}
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
                <select class="select w-full" bind:value={searchParams.state.status}>
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

    <Table data={data} dataType="volumes" canView canEdit canShare canDelete deleteAction="/api/actions/volumes?/delete" />

    {#if volumes.length > 0}
    <Pagination
      data={volumes}
      count={volumesCount}
      onPageChange={(e) => searchParams.state.page = e.page}
      page={searchParams.state.page}
      bind:pageSize={searchParams.state.limit}
    />
    {:else if volumesCountTotal > 0}
    <div class="w-fit mx-auto flex flex-col items-center">
      <p class="text-xl md:text-2xl font-semibold">No volumes found.</p>
      <p class="text-sm opacity-80">(Try resetting your filters)</p>
    </div>
    {:else}
    <div class="w-fit mx-auto space-y-2 flex flex-col items-center">
      <p class="text-xl md:text-2xl font-semibold">No volumes found...</p>
      <a href="/_cc_admin/volumes/create" class="btn w-fit px-3 py-2 preset-filled-primary-500 text-surface-950! leading-none flex gap-2 items-center whitespace-nowrap"><i class="ph-bold ph-plus"></i>Add New Volume</a>
    </div>
    {/if}
  </div>
</section>

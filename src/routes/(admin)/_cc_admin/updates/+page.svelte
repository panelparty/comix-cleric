<script>

  // Svelte utility imports
  import { page } from "$app/stores";


  // Utility imports
  import { screen } from "$lib/utils/breakpoints.js";
  import { createPageState } from "$lib/utils/page/pageState.svelte.js";


  // Component imports
  import Table from "$lib/components/Admin/Table.svelte";
  

// Skeleton UI component imports
  import { Modal } from '@skeletonlabs/skeleton-svelte';
  import Pagination from "$lib/components/Pagination/Pagination.svelte";
  


  // Export props
  let { data } = $props();


  // Reassign server data
  let updates = $derived(data.updates);
  let updateTypes = $derived(data.updateTypes);
  let chapters = $derived(data.chapters);
  let volumes = $derived(data.volumes);
  let updateCount = $derived(data.updateCount);
  let updateCountTotal = $derived(data.updateCountTotal);


  // Pagination paramters
  let searchParams = createPageState($page.url,
    {
      type: '*',
      chapter: '*',
      volume: '*',
      status: '*',
      sort: '-date_published',
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
  let maxPage = $derived(Math.ceil(updateCount / searchParams.state.limit));

  // Effect to ensure currentPage stays within bounds
  $effect(() => {
    if (maxPage > 0 && searchParams.state.page > maxPage) {
      searchParams.state.page = maxPage;
    }
  });

  // Reset all filters
  function clearFilters() {
    searchParams.state.chapter = '*'
    searchParams.state.volume = '*'
    searchParams.state.status = '*'
    searchParams.state.type = '*'
  }

</script>

<!-- Section container -->
<section class="w-full max-w-5xl mx-auto h-fit space-y-4">
  <!-- Section header -->
  <div class="w-full flex flex-col md:flex-row gap-2 md:gap-4">
    <!-- Section heading/title -->
    <h3 class="h3 leading-none! w-fit mx-auto md:w-full flex items-center gap-2 whitespace-nowrap">Updates <span class="font-medium text-surface-700-300 text-base mt-1">• Total: {updateCount}</span></h3>
    <!-- Create new update button -->
    <a href="/_cc_admin/updates/create" class="px-3 py-3 md:py-2 btn preset-filled-primary-500 text-surface-950! leading-none flex gap-2 items-center whitespace-nowrap"><i class="ph-bold ph-plus"></i>Add New Update</a>
  </div>
  <!-- Existing items -->
  <div class="w-full bg-surface-50-950 md:px-4 pt-2 pb-4 min-h-16 space-y-2">
    <!-- Search component -->
    <!-- <div class="w-full">
      <p class="">Search:</p>
      <Search collection="Updates" href="/_cc_admin/updates/edit/" />
    </div> -->
    <!-- Sorting and filter options -->
    <!-- TODO: Move to a flexible component -->
    <div class="text-base md:text-sm grid grid-cols-[max-content_auto] gap-2 items-end">
      <!-- Sorting options (reordering) -->
      <div class="w-full">
        <p class="">Sort:</p>
        <div class="input-group w-auto grid grid-cols-[1fr_min-content_min-content]">
          <select class="ig-select w-full md:w-fit rounded-l-md" value={sortField} onchange={(e) => setSort(e.currentTarget.value, sortDir)}>
            <option value="date_published">Date Published</option>
            <option value="name">Update Title</option>
            <option value="slug">Update Slug</option>
            <option value="date_created">Date Created</option>
            <option value="date_updated">Date Updated</option>
          </select>
          <button class="ig-btn aspect-square text-xs p-1 md:w-auto grid place-content-center {sortDir === '' ? 'bg-primary-500 text-surface-950' : ''}" onclick={() => setSort(sortField, '')}><i class="ph-bold ph-plus"></i></button>
          <button class="ig-btn aspect-square text-xs p-1 md:w-auto grid place-content-center {sortDir === '-' ? 'bg-primary-500 text-surface-950' : ''}" onclick={() => setSort(sortField, '-')}><i class="ph-bold ph-minus"></i></button>
        </div>
      </div>
      <!-- Filter options (limiting) -->
      {#if screen.md.current}
      <!-- Display if not on mobile -->
      <div class="w-full">
        <p class="">Filter:</p>
        <div class="flex gap-2">
          <select class="select w-full md:w-fit max-w-32" bind:value={searchParams.state.type}>
            <option value="*" selected class="opacity-60">Update Type</option>
            {#each updateTypes as type}
            <option value={type?.slug}>{type?.name}</option>
            {/each}
          </select>
          <select class="select w-full md:w-fit max-w-32" bind:value={searchParams.state.chapter}>
            <option value="*" selected class="opacity-60">Chapter</option>
            {#each chapters as item}
            <option value="{item?.slug}">{item?.name}</option>
            {/each}
          </select>
          <select class="select w-full md:w-fit max-w-32" bind:value={searchParams.state.volume}>
            <option value="*" selected>Volume</option>
            {#each volumes as item}
            <option value="{item?.slug}">{item?.name}</option>
            {/each}
          </select>
          <select class="select w-full md:w-fit max-w-32" bind:value={searchParams.state.status}>
            <option value="*" selected class="opacity-60">Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button aria-label="Reset filters" class="btn grid place-content-center preset-outlined-surface-200-800" onclick={()=>{clearFilters()}}><i class="ph-bold ph-arrows-clockwise"></i></button>
        </div>
      </div>
      {:else}
      <!-- Display if on mobile -->
      <div class="grid grid-cols-[auto_min-content] gap-2">
        <Modal
          {openFilters}
          onOpenChange={(e) => (openFilters = e.open)}
          triggerClasses="btn w-full preset-filled-surface-500 "
          contentClasses="max-h-[calc(100dvh-2rem)] w-full overflow-y-auto shadow-xl shadow-surface-950/10 w-[calc(100vw-2rem)] md:max-w-sm bg-surface-50-950 p-6 "
        >
          {#snippet trigger()}
            Filters
          {/snippet}
          {#snippet content()}
            <div class="w-full space-y-2">
              <div class="grid grid-cols-[auto_min-content]">
                <h4 class="h4">Filters</h4>
                <!-- <button aria-label="Close filters" class="btn  size-10 aspect-square grid place-content-center preset-filled-error-500 " onclick={()=>{openFilters = false}}><i class="ph-bold ph-x"></i></button> -->
              </div>
              <div class="flex flex-col gap-2">
                <select class="select w-full" bind:value={searchParams.state.type}>
                  <option value="*" selected class="opacity-60">Update Type</option>
                  {#each updateTypes as type}
                  <option value={type?.slug}>{type?.name}</option>
                  {/each}
                </select>
                <select class="select w-full" bind:value={searchParams.state.chapter}>
                  <option value="*" selected class="opacity-60">Chapter</option>
                  {#each chapters as item}
                  <option value="{item?.slug}">{item?.name}</option>
                  {/each}
                </select>
                <select class="select w-full" bind:value={searchParams.state.volume}>
                  <option value="*" selected>Volume</option>
                  {#each volumes as item}
                  <option value="{item?.slug}">{item?.title}</option>
                  {/each}
                </select>
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
        <button aria-label="Reset filters" class="btn grid place-content-center preset-outlined-surface-200-800" onclick={()=>{clearFilters()}}><i class="ph-bold ph-arrows-clockwise"></i></button>
      </div>
      {/if}
    </div>
    <!-- Update item table -->
    <!-- TODO: Improve this component to work with any other data type -->
    <Table data={data} dataType="updates" canView canEdit canShare canDelete deleteAction="/api/actions/updates?/delete" />
    <!-- If updates exist, show pagination -->
    {#if updates?.length > 0}
    <!-- Pagination (sticky) -->
    <div class="sticky py-2 -bottom-2 md:-bottom-8 grid grid-cols-[auto_min-content] gap-2 items-center preset-filled-surface-50-950">
      <!-- Pagination component (Skeleton UI) -->
      <Pagination
        data={updates}
        count={updateCount}
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
    {:else if updateCountTotal > 0}
      <!-- If updates exist, but there are no results (filtering issue) -->
      <div class="w-fit mx-auto flex flex-col items-center">
        <p class="text-xl md:text-2xl font-semibold">No pages found.</p>
        <p class="text-sm opacity-80">(Try resetting your filters)</p>
      </div>
    {:else}
    <!-- If no updates exist in the database -->
    <div class="w-fit mx-auto space-y-2 flex flex-col items-center">
      <p class="text-xl md:text-2xl font-semibold">No updates found...</p>
      <a href="/_cc_admin/updates/create" class="btn w-fit px-3 py-2 preset-filled-primary-500 text-surface-950! leading-none flex gap-2 items-center whitespace-nowrap"><i class="ph-bold ph-plus"></i>Add New Update</a>
    </div>
    {/if}
  </div>
</section>
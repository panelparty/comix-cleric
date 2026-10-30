<script>

  // Svelte utility imports
  import { page } from "$app/stores";

  // Utility imports
  import { screen } from "$lib/utils/breakpoints.js";

  // Component imports
  import Table from "$lib/components/Admin/Table.svelte";
  
// Skeleton UI component imports
  import { Modal } from '@skeletonlabs/skeleton-svelte';
  import Pagination from "$lib/components/Pagination/Pagination.svelte";
  import { createPageState } from "$lib/utils/page/pageState.svelte.js";

  // Export props
  let { data } = $props();

  let blogs = $derived(data?.blogs);
  let blogsCount = $derived(data?.blogsCount);
  let blogsCountTotal = $derived(data?.blogsCountTotal);
  let categories = $derived(data?.categories);

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
  let maxPage = $derived(Math.ceil(blogsCount / searchParams.state.limit));

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
    <h3 class="h3 leading-none! w-full flex items-center gap-2">Blog Posts <span class="font-medium text-surface-700-300 text-base mt-1">• Total: {blogsCount}</span></h3>
    <a href="/_cc_admin/blogs/create" class="btn px-3 py-2 preset-filled-primary-500 text-surface-950! leading-none flex gap-2 items-center whitespace-nowrap"><i class="ph-bold ph-plus"></i>Add New Blog Post</a>
  </div>
  <!-- Filters and sorting -->
  <div class="bg-surface-50-950  px-4 pt-2 pb-4 min-h-16 space-y-2">
    <div class="text-base md:text-sm grid grid-cols-[max-content_auto] gap-2 items-end">
      <!-- Sorting menu (reorders results) -->
      <div class="w-full">
        <p class="">Sort:</p>
        <div class="input-group w-auto grid grid-cols-[1fr_min-content_min-content]">
          <select class="ig-select w-full md:w-fit rounded-l-md" value={sortField} onchange={(e) => setSort(e.currentTarget.value, sortDir)}>
            <option value="date_published" selected>Release Date</option>
            <option value="name">Title</option>
            <option value="slug">Slug</option>
            <option value="date_created">Date Created</option>
            <option value="date_updated">Date Updated</option>
          </select>
          <button class="ig-btn aspect-square text-xs p-1 md:w-auto grid place-content-center {sortDir === '' ? 'bg-primary-500 text-surface-950' : ''}" onclick={() => setSort(sortField, '')}><i class="ph-bold ph-plus"></i></button>
          <button class="ig-btn aspect-square text-xs p-1 md:w-auto grid place-content-center {sortDir === '-' ? 'bg-primary-500 text-surface-950' : ''}" onclick={() => setSort(sortField, '-')}><i class="ph-bold ph-minus"></i></button>
        </div>
      </div>
      <!-- Filter menu (limits results) -->
      {#if screen.md.current}
      <!-- Desktop filter menu -->
      <div class="w-full">
        <p class="">Filter:</p>
        <div class="flex gap-2">
          <select class="select w-full md:w-fit" bind:value={searchParams.state.type}>
            <option value="*" selected>Category</option>
            {#each categories as item}
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
                  <option value="*" selected>Category</option>
                  {#each categories as item}
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
        <button aria-label="Reset filters" class="btn grid place-content-center preset-outlined-surface-200-800 " onclick={()=>{clearFilters()}}><i class="ph-bold ph-arrows-clockwise"></i></button>
      </div>
      {/if}
    </div>
    <!-- Item list table -->
    <Table data={data} dataType="blogs" canView canEdit canShare canDelete deleteAction="/api/actions/blogs?/delete" />
    <!-- Pagination, only visible if blogs exist -->
    {#if blogs.length > 0}
    <!-- Pagination component -->
    <Pagination
      data={blogs}
      count={blogsCountTotal}
      onPageChange={(e) => searchParams.state.page = e.page}
      page={searchParams.state.page}
      bind:pageSize={searchParams.state.limit}
    />
    {:else if blogsCountTotal > 0}
    <!-- If we have blogs in the database, but not in the filtered results -->
    <div class="w-fit mx-auto flex flex-col items-center">
      <p class="text-xl md:text-2xl font-semibold">No blog posts found.</p>
      <p class="text-sm opacity-80">(Try resetting your filters)</p>
    </div>
    {:else}
    <!-- If no blog posts exist in the server -->
    <div class="w-fit mx-auto space-y-2 flex flex-col items-center">
      <p class="text-xl md:text-2xl font-semibold">No blog posts found...</p>
      <a href="/_cc_admin/blogs/create" class="btn not-first-of-type:w-fit px-3 py-2 preset-filled-primary-500 text-surface-950! leading-none flex gap-2 items-center whitespace-nowrap"><i class="ph-bold ph-plus"></i>Add New Blog Post</a>
    </div>
    {/if}
  </div>
</section>

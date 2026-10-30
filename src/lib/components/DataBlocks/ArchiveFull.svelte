<script>
	// Svelte imports
  import { page } from "$app/stores";

  // Utility imports
  import { isNew } from "$lib/utils/date";
  import { createPageState } from "$lib/utils/page/pageState.svelte.js";
  
  // Component imports
  import ItemCard from "$lib/components/Cards/ItemCard.svelte";
  import ItemChapter from "$lib/components/Cards/ItemChapter.svelte";
  import ItemUpdate from "$lib/components/Cards/ItemUpdate.svelte";
  import ItemVolume from "$lib/components/Cards/ItemVolume.svelte";
  import JumpToPage from "$lib/components/Archive/JumpToPage.svelte";
  import NotFound from "$lib/components/Placeholders/NotFound.svelte";
  import Pagination from "$lib/components/Pagination/Pagination.svelte";
  import Input from "../Admin/Inputs/Input.svelte";

  // Export props
  let { data } = $props();

  // Destructure server data
  let updates = $derived(data.updates);
  let updateCount = $derived(data.updateCount);
  let updateCountTotal = $derived(data.updateCountTotal);
  let chapters = $derived(data?.chapters);
  let chapterCount = $derived(data?.chapterCount);
  let volumes = $derived(data?.volumes);
  let volumeCount = $derived(data?.volumeCount);
  let years = $derived.by(() => {
    const base = data?.years ?? [];
    return sortDir !== '-' ? [...base].reverse() : base;
  });

  // Pagination
  let pageLimit = $derived(data?.settings?.page_limit);
	let searchParams = createPageState($page.url,
    {
      tab: 'updates',
      sort: '-date_published',
      page: 1,
      limit: pageLimit ?? 25,
      type: '*',
    }
  );

  let sortDir = $derived(searchParams.state.sort.startsWith('-') ? '-' : '');
  let sortField = $derived(searchParams.state.sort.replace(/^-/, ''));
  let filterUpdates = $state(false);

  $effect(() => {
    searchParams.state.type = filterUpdates && searchParams.state.tab === 'updates' ? 'main-story' : '*';
  });

  // Derive the maximum page number to validate currentPage
  let maxPage = $derived.by(()=>{
    if (searchParams.state.tab === 'updates') return Math.ceil(updateCount / searchParams.state.limit);
    if (searchParams.state.tab === 'chapters') return Math.ceil(chapterCount / searchParams.state.limit);
    if (searchParams.state.tab === 'volumes') return Math.ceil(volumeCount / searchParams.state.limit);
    if (searchParams.state.tab === 'years') return Math.ceil(years?.length ?? 1 / searchParams.state.limit);
  });
  
  // Effect to ensure currentPage stays within bounds
  $effect(() => {
    if (maxPage > 0 && searchParams.state.page > maxPage) {
      searchParams.state.page = maxPage;
    }
  });

  // Tab setup
  const tabs = $derived([
    {label: 'Updates', value: 'updates', visible: updates.length > 0},
    {label: 'Volumes', value: 'volumes', visible: volumes.length > 0},
    {label: 'Chapters', value: 'chapters', visible: chapters.length > 0},
    {label: 'Years', value: 'years', visible: years.length > 0}
  ]);

  // Mobile menu toggle
  let openFilters = $state(false);
</script>

{#if updateCountTotal > 0}
<div class="archive-full-container">
  <!-- Jump-to component -->
  <div class="archive-full-jump-container">
    <JumpToPage />
  </div>

  <!-- Tab button group -->
  <nav class="archive-full-tab-button-container">
  {#each tabs as item}
    {#if item?.visible} 
    <button
      class="button archive-full-tab-button"
      data-active={searchParams.state.tab === item?.value}
      onclick={()=>{searchParams.state.tab = item.value; searchParams.state.page = 1}}
    >
      {item?.label}
    </button>
    {/if}
  {/each}
  </nav>
  <div class="archive-full-sort-container">
    <button
      onclick={() => searchParams.state.sort = '-' + sortField}
      class="button archive-full-sort-button"
      data-active={sortDir === '-'}
    >Newest First</button>
    <button
      onclick={() => searchParams.state.sort = sortField}
      class="button archive-full-sort-button"
      data-active={sortDir != '-'}
    >Oldest First</button>
  </div>
  {#if searchParams.state.tab === 'updates'}
  <Input type="checkbox" name="filter updates" id="filter-updates" label="Only story updates" class="archive-full-filter-checkbox" bind:value={filterUpdates}/>
  {/if}
</div>
{/if}

<!-- Tab contents container -->
<div class="archive-full-tab-container">
  <!-- Tab contents list -->
  {#if updates.length > 0}
  <ul class="archive-full-tab-list">
    <!-- Updates tab -->
    {#if searchParams.state.tab === 'updates'}
      {#each updates as item, i}
      <!-- Updates item card -->
      <ItemCard href="/comic/{item?.slug}" data={item} updateNumber thumb layout="full" isNew={isNew(item?.date_published)}>
        <!-- Update-specific layout component -->
        <ItemUpdate data={item} />
      </ItemCard>
      {/each}

      <Pagination
        data={updates}
        count={updateCount}
        onPageChange={(e) => searchParams.state.page = e.page}
        page={searchParams.state.page}
        bind:pageSize={searchParams.state.limit}
      />
    <!-- Chapters tab -->
    {:else if searchParams.state.tab === 'chapters'}
      <!-- Chapters item card -->
      {#each chapters as item, i}
        <ItemCard label href="/archive/chapters/{item?.slug}" data={item} thumb thumbBook isNew={isNew(item?.date_created)}>
          <ItemChapter data={item} />
        </ItemCard>
      {/each}

      <Pagination
        data={chapters}
        count={chapterCount}
        onPageChange={(e) => searchParams.state.page = e.page}
        page={searchParams.state.page}
        bind:pageSize={searchParams.state.limit}
      />
    <!-- Volumes tab -->
    {:else if searchParams.state.tab === 'volumes'}
      {#each volumes as volume, i}
        <ItemCard href="/archive/volumes/{volume?.slug}" data={volume} thumb thumbBook isNew={isNew(volume?.date_created)}>
          <ItemVolume data={volume} />
        </ItemCard>
      {/each}

      <Pagination
        data={volumes}
        count={volumeCount}
        onPageChange={(e) => searchParams.state.page = e.page}
        page={searchParams.state.page}
        bind:pageSize={searchParams.state.limit}
      />
    <!-- Years tab -->
    {:else if searchParams.state.tab === 'years'}
      {#each years as item, i}
        <ItemCard href="/archive/years/{item}" class="p-2">
          <h3>{item}</h3>
        </ItemCard>
      {/each}

      <Pagination
        data={years}
        count={years?.length}
        onPageChange={(e) => searchParams.state.page = e.page}
        page={searchParams.state.page}
        bind:pageSize={searchParams.state.limit}
      />
    <!-- Invalid tab -->
    {:else}
      <NotFound label="Something went wrong." style="color: var(--color-error-700-300);" />
    {/if}
    </ul>
  <!-- No updates found -->
  {:else}
    <NotFound label="There are no updates to this series... yet!" />
  {/if}
</div>

<style>
  .archive-full-container {
    width: 100%;
    margin: 0 auto;

    @media (width >= 64rem) {
      width: fit-content;
    }
  }

  .archive-full-jump-container {
    margin: 0 auto;
    width: fit-content;
    grid-column: span 2 / span 2;
    margin-bottom: calc(var(--spacing) * 4);
  }

  .archive-full-tab-button-container {
    width: 100%;
    margin: 0 auto;
    padding: calc(var(--spacing) * 1);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: calc(var(--spacing) * 1);
    border-width: var(--default-border-width);
    border-radius: var(--radius-lg);

    @media (width >= 40rem) {
      width: fit-content;
    }
  }

  .archive-full-tab-button {
    background: light-dark(var(--color-surface-100), var(--color-surface-900));
    width: 100%;
    padding-block: calc(var(--spacing) * 2);
    color: light-dark(var(--color-surface-900), var(--color-surface-100));
    display: flex;
    font-weight: 700;
    align-items: center;
    justify-content: center;
    line-height: 1;

    @media (width >= 40rem) {
      width: fit-content;
    }

    &[data-active="true"] {
      background-color: var(--color-primary-700-300) !important;
      color: var(--color-primary-contrast-700-300) !important;
    }
  }

  .archive-full-sort-container {
    width: max-content;
    margin: calc(var(--spacing) * 4) auto;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: calc(var(--spacing) * 1);
  }

  .archive-full-sort-button {
    background: light-dark(var(--color-surface-100), var(--color-surface-900));
    padding-block: calc(var(--spacing) * 1);
    color: light-dark(var(--color-surface-900), var(--color-surface-100));
    display: flex;
    font-weight: 700;
    align-items: center;
    justify-content: center;
    line-height: 1;

    &[data-active="true"] {
      background-color: var(--color-primary-700-300) !important;
      color: var(--color-primary-contrast-700-300) !important;
    }
  }

  :global(.archive-full-filter-checkbox) {
    justify-content: center;
  }
  
  .archive-full-tab-container {
    max-width: var(--container-3xl);
    width: 100%;
    margin: 0 auto;
    min-height: calc(var(--spacing) * 96);
    padding-block: calc(var(--spacing) * 4);
  }

  .archive-full-tab-list {
    margin-top: calc(var(--spacing) * 2);
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: calc(var(--spacing) * 2);
  }
</style>
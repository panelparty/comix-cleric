<script>
  // Svelte Utilities
  import { page } from '$app/stores';

  // Utilities
  import { createPageState } from '$lib/utils/page/pageState.svelte';

  // Componenta
  import BackButton from '$lib/components/Navigation/BackButton.svelte';
  import ItemCard from '$lib/components/Cards/ItemCard.svelte';
  import ItemChapter from '$lib/components/Cards/ItemChapter.svelte';
  import TextToggle from '$lib/components/DataBlocks/TextToggle.svelte';
  import DisplayDate from '$lib/components/Display/DisplayDate.svelte';
  import Section from '$lib/components/DataBlocks/Section.svelte';
  import NotFound from '$lib/components/Placeholders/NotFound.svelte';
  import EditLink from '$lib/components/Admin/EditLink.svelte';
  import Pagination from '$lib/components/Pagination/Pagination.svelte';
  
  // Export props
  let { data } = $props();

  // Destructure server data
  let volume = $derived(data?.volume);
  let chapters = $derived(data?.chapters);
  let chapterCount = $derived(data?.chapterCount);

  // Pagination
	let searchParams = createPageState($page.url,
    {
      page: 1,
      limit: data?.settings?.page_limit ?? 25,
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
    return Math.ceil(chapterCount / searchParams.state.limit);
  });
  
  // Effect to ensure currentPage stays within bounds
  $effect(() => {
    if (maxPage > 0 && searchParams.state.page > maxPage) {
      searchParams.state.page = maxPage;
    }
  });

  // Toggles
  let showMore = $state(false);
</script>

<!-- Page container -->
<Section data-style="archive" wrapperWidth="var(--container-3xl)">
  <!-- Link back to archive -->
  <div class="gap-container" style="--gap: 2; --dir: row; align-items: center;">
    <BackButton />
    <a href="/archive" class="button button-return">Return to Archive</a>
  </div>

  <!-- Page heading -->
  <div class="archive-volume-header">
    <!-- Admin edit link -->
    <EditLink label="volume" type="volumes" id={volume?.id} {data} />

    <!-- Page heading -->
    <h3 class="archive-volume-heading">{volume?.name}</h3>

    <!-- Date published -->
    {#if volume?.date_published}
      <DisplayDate label="Released:" date={volume?.date_published} />
    {/if}

    <!-- Volume description -->
    {#if volume?.description}
      <TextToggle src={volume?.description} />
    {/if}
  </div>

  <!-- Seperator -->
  <hr class="hr">

  <!-- List label -->
  <h5 class="label">Chapters:</h5>

  <!-- Chapters list -->
  {#if chapters.length > 0}
    <ul class="archive-volume-post-list">
      {#each chapters.reverse() as item, i}
      <ItemCard label layout={data?.settings?.archive_list_style} href="/archive/chapters/{item?.slug}" data={item} pageNumber={item} thumb>
        <ItemChapter data={item} />
      </ItemCard>
      {/each}
    </ul>

    <Pagination
      data={chapters.reverse()}
      count={chapterCount}
      onPageChange={(e) => searchParams.state.page = e.page}
      page={searchParams.state.page}
      bind:pageSize={searchParams.state.limit}
    />
  <!-- No chapters found -->
  {:else}
    <NotFound label="There are no chapters in this volume... yet!" />
  {/if}
</Section>

<style>
  .archive-volume-header {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 2);
  }
  
  .archive-volume-heading {
    font-weight: 900;
    color: var(--color-tertiary-500);
  }
  
  .archive-volume-post-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: calc(var(--spacing) * 2);
  }
</style>
<script>
  // Utilities
  import { isNew } from "$lib/utils/date";

  // Components
  import ItemCard from '$lib/components/Cards/ItemCard.svelte';
  import ItemUpdate from '$lib/components/Cards/ItemUpdate.svelte';
  import PageHeading from '$lib/components/DataBlocks/PageHeading.svelte';
  import Section from '$lib/components/DataBlocks/Section.svelte';
  import BackButton from '$lib/components/Navigation/BackButton.svelte';

  // Props
  let { data } = $props();

  // Destructure data
  let year = $derived(data?.year);
  let updates = $derived(data?.updates);
</script>

<!-- Page container -->
<Section data-style="archive" wrapperWidth="var(--container-3xl)">
  <!-- Link back to archive -->
  <div class="gap-container" style="--gap: 2; --dir: row; align-items: center;">
    <BackButton />
    <a href="/archive" class="button button-return">Return to Archive</a>
  </div>

  <!-- Page heading (title) component -->
  <PageHeading heading="Updates from {data?.year}" />
  
  <div class="archive-year-container">    
    <!-- If we have updates -->
    {#if updates.length > 0}
      <ul class="year-post-list">
        {#each updates.reverse() as item, i}
        <!-- Updates item card -->
        <ItemCard href="/comic/{item?.slug}" data={item} updateNumber thumb layout="full" isNew={isNew(item?.date_published)}>
          <!-- Update-specific layout component -->
          <ItemUpdate data={item} />
        </ItemCard>
        {/each}
      </ul>

    <!-- No updates found -->
    {:else}
      <p class="">There are no updates this year.</p>
    {/if}
  </div>
</Section>

<style>
  .archive-year-container {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 4);
  }

  .year-post-list {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: calc(var(--spacing) * 2);
  }
</style>
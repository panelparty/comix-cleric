<script>
  // Utilities
  import { isNew } from '$lib/utils/date.js';

  // Component imports
  import BackButton from '$lib/components/Navigation/BackButton.svelte';
  import ItemCard from '$lib/components/Cards/ItemCard.svelte';
  import ItemUpdate from '$lib/components/Cards/ItemUpdate.svelte';
  import TextToggle from '$lib/components/DataBlocks/TextToggle.svelte';
  import Section from '$lib/components/DataBlocks/Section.svelte';
  import NotFound from '$lib/components/Placeholders/NotFound.svelte';
  import DisplayDate from '$lib/components/Display/DisplayDate.svelte';
  import EditLink from '$lib/components/Admin/EditLink.svelte';
    import { consoleLog } from '$lib/utils/debug.js';
  
  // Export props
  let { data } = $props();

  // Reassign server data
  let chapter = $derived(data?.chapter);
  let updates = $derived(data?.updates);
  let updateCount = $derived(data?.updateCount);
</script>

<!-- Page container -->
<Section data-style="archive" wrapperWidth="var(--container-3xl)">
  <!-- Link back to archive -->
  <div class="gap-container" style="--gap: 2; --dir: row; align-items: center;">
    <BackButton />
    <a href="/archive" class="button button-return">Return to Archive</a>
  </div>
  
  <!-- Page header -->
  <div class="archive-chapter-header">
    <EditLink label="chapter" type="chapters" id={chapter?.id} {data} />

    <!-- Page heading -->
    <h3 class="archive-chapter-heading">{chapter?.name}</h3>
    <p class="label">From Volume: <a href="/archive/volumes/{chapter?.volume?.slug}" class="anchor">{chapter?.volume?.name}</a></p>
    
    <!-- Date published -->
    {#if chapter?.date_published}
    <DisplayDate label="Released:" date={chapter?.date_published} />
    {/if}
    
    <!-- Description -->
    {#if chapter?.description}
    <TextToggle src={chapter?.description} />
    {/if}
  </div>
  
  <!-- Seperator -->
  <hr class="hr">

  <!-- List label -->
  <h5 class="label">Updates:</h5>
  
  <!-- If updates were returned, show this -->
  {#if updates.length > 0}
    <!-- List of all available updates in this chapter -->
    <ul class="archive-chapter-post-list">
      {#each updates.reverse() as item, i}
      <ItemCard href="/comic/{item?.slug}" data={item} updateNumber thumb layout="full" isNew={isNew(item?.date_published)}>
        <!-- Update-specific layout component -->
        <ItemUpdate data={item} />
      </ItemCard>
      {/each}
    </ul>
  {:else}
    <!-- No updates found -->
    <NotFound label="There are no updates in this chapter... yet!" />
  {/if}
</Section>

<style>
  .archive-chapter-header {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 2);
  }
  
  .archive-chapter-heading {
    font-weight: 900;
    color: var(--color-tertiary-500);
  }
  
  .archive-chapter-post-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: calc(var(--spacing) * 2);
  }
</style>
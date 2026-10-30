<script>
  // Utilities
  import { isNew } from "$lib/utils/date";

  // Components
  import ItemCard from "../Cards/ItemCard.svelte";
  import ItemUpdate from "../Cards/ItemUpdate.svelte";
  import Section from "./Section.svelte";
  import SectionHeading from "./SectionHeading.svelte";
  
  // Props
  let { data } = $props();
</script>

<!-- Archive preview -->
{#if data?.update_count > 0}
<Section class="archive-preview-section" wrapperWidth="var(--container-3xl)">
  <!-- Section heading and info -->
  <div class="archive-preview-header">
    <!-- Section heading -->
    <SectionHeading heading="Recent Updates" color="tertiary" />

    <!-- Archive info -->
    <div class="archive-preview-info">
      <!-- Update count + link -->
      <a class="anchor archive-preview-link" href="/archive?tab=updates">
        {data?.update_count} update{data?.update_count === 1 ? '' : 's'}
      </a>
      <!-- Chapter count + link -->
      {#if data?.chapter_count}
      •
      <a class="anchor archive-preview-link" href="/archive?tab=chapters">
        {data?.chapter_count} chapter{data?.chapter_count === 1 ? '' : 's'}
      </a>
      {/if}
      <!-- Volume count + link -->
      {#if data?.volume_count}
      •
      <a class="anchor archive-preview-link" href="/archive?tab=volumes">
        {data?.volume_count} volume{data?.volume_count === 1 ? '' : 's'}
      </a>
      {/if}
    </div>
  </div>

  <!-- Short archive list -->
  <ul class="archive-preview-list">
  {#each data?.updates as item, i}
    <!-- Generic item card wrapper component -->
    <ItemCard href="/comic/{item?.slug}" data={item} updateNumber thumb layout="full" isNew={isNew(item?.date_published)}>
      <!-- Update-specific layout component -->
      <ItemUpdate data={item} />
    </ItemCard>
  {/each}
  </ul>

  <!-- Full archive link -->
  <a class="button archive-link" href="/archive">View Archive</a>
</Section>
{/if}

<style>
  :global(.archive-preview-section) {
    background: var(--color-tertiary-300-700);
    padding: calc(var(--spacing) * 8) calc(var(--spacing) * 4);
  }

  .archive-preview-header {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (width >= 48rem) {
      flex-direction: row;
      align-items: baseline;
      gap: calc(var(--spacing) * 4);
    }
  }

  .archive-preview-link {
    color: var(--color-surface-50);

    &:hover {
      color: var(--color-tertiary-500);
    }
  }

  .archive-preview-list {
    width: 100%;
    margin: 0 auto;
    gap: calc(var(--spacing) * 2);
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .archive-link {
    background: var(--color-tertiary-500);
    color: var(--color-tertiary-contrast-500);
  }
</style>
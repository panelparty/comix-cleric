<script>
  // Utilities
  import { fallback } from "$lib/utils/utils";

  // Components
  import DisplayDate from "../Display/DisplayDate.svelte";

  // Export props
  let { data } = $props()
</script>

<!-- Chapter item container -->
<div title={data?.name ?? 'Chapter Title'} class="item-chapter-container">
  <!-- Chapter info -->
  <div class="item-chapter-details">
    <!-- Parent volume label -->
    <!-- TODO: Make customizable. -->
    {#if data?.volume}
    <p class="item-chapter-volume">{fallback([data?.volume?.name, data?.volume?.slug])}</p>
    {/if}

    <!-- Chapter heading/title -->
    <h5 class="item-chapter-title">{fallback([data?.name, data?.slug])}</h5>

    <!-- Update count -->
    <p class="item-chapter-update-count">Updates: {data?.updates?.length}</p>
  </div>

  <!-- Date Published -->
  <DisplayDate date={data?.date_published} />
</div>

<style>
  .item-chapter-container {
    width: 100%;
    padding-right: calc(var(--spacing) * 4);
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: calc(var(--spacing) * 1);
    
    @media (width >= 48rem) {
      flex-direction: row;
      align-items: center;
      font-size: var(--text-lg);
    }
  }

  .item-chapter-details {
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .item-chapter-volume {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing) * 1);
    font-size: var(--text-sm);
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .item-chapter-title {
    font-size: var(--text-lg);
    font-weight: 600;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .item-chapter-update-count {
    font-size: var(--text-sm);
    color: var(--color-primary-500);
  }
</style>
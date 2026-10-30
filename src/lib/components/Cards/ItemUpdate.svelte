<script>
  // Utilities
  import { formatDate } from "$lib/utils/date";
  
  // Components
  import DisplayDate from "../Display/DisplayDate.svelte";

  // Props
  let {
    data,
    layout,
    delimiter = "/"
  } = $props();

  // Destructure data
  let volume = $derived(data?.volume);
  let chapter = $derived(data?.chapter);
</script>

<!-- Update item container -->
<div class="item-update-container" data-layout={layout} title={data?.name}>
  <!-- Update info container -->
  <div class="item-update-details">
    <!-- Update parent volume/chapter label -->
    {#if volume?.name || chapter?.name}
    <p class="item-update-groups">
      <span class="item-update-volume" title={volume?.name}>{volume?.name}</span>
      {volume?.name && chapter?.name ? delimiter : ''}
      <span class="item-update-chapter" title={chapter?.name}>{chapter?.name}</span>
    </p>
    {/if}

    <!-- Update heading/title -->
    <h6 class="item-update-title">{data?.name}</h6>
  </div>

  <!-- Date Published -->
  <DisplayDate date={data?.date_published} />
</div>

<style>
  .item-update-container {
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

    &[data-layout="full"] {
      display: grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      align-items: center;

      @media (width >= 48rem) {
        grid-template-columns: 1fr auto;
      }
    }
  }

  .item-update-details {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 1);
    overflow: hidden;
  }

  .item-update-groups {
    display: flex;
    align-items: center;
    font-size: var(--text-sm);
    gap: calc(var(--spacing) * 1);
    line-height: 1;

    span {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .item-update-title {
    font-size: var(--text-lg);
    font-weight: 600;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
</style>
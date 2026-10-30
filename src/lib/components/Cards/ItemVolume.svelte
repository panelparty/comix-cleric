<script>

  import { fallback } from "$lib/utils/utils";
    import DisplayDate from "../Display/DisplayDate.svelte";

  // Export props
  let { data } = $props()

</script>

<!-- Volume item container -->
<div class="item-volume-container">
  <!-- Volume data -->
  <div class="item-volume-details">
    <!-- Volume heading/title -->
    <h5 class="item-volume-title" title={fallback([data?.name, data?.slug])}>{fallback([data?.name, data?.slug])}</h5>
    
    <!-- Item counts -->
    <div class="item-volume-item-counts">
      <!-- Chapter -->
      <p class="item-volume-chapter-count">Chapters: {data?.chapters?.length}</p>
      •
      <!-- Update count -->
      <p class="item-volume-update-count">Updates: {data?.updates?.length}</p>
    </div>
  </div>

  <!-- Date Published -->
  <DisplayDate date={data?.date_published} />
</div>

<style>
  .item-volume-container {
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

  .item-volume-details {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 1);
    overflow: hidden;
  }

  .item-volume-title {
    font-size: var(--text-lg);
    font-weight: 600;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .item-volume-item-counts {
    line-height: 1;
    display: flex;
    align-items: center;
    gap: calc(var(--spacing) * 2);
    color: var(--color-primary-500);
  }

  .item-volume-update-count,
  .item-volume-chapter-count {
    font-size: var(--text-sm);
  }
</style>
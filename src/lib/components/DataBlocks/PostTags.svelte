<script>
  // Components
  import Tag from "./Tag.svelte";

  // Props
  let {
    data
  } = $props();
</script>

<!-- Container -->
<div class="section-card tags-container">
  <!-- Section Label -->
  <p class="label tags-label">Tags:</p>

  <!-- Tags list -->
  <ul class="tags-list">
    {#each data as tag}
      <Tag label={tag?.label} href={tag?.href} />
    {/each}
  </ul>
</div>

<style>
  .tags-list {
    display: flex;
    flex-wrap: wrap;
    gap: calc(var(--spacing) * 2);
  }
</style>
<script>
  // Utilities
  
// Components
  import ProseContainer from './ProseContainer.svelte';

  // Props
  let {
    data,
    label = "Creator Notes:"
  } = $props();
</script>

{#if data}
<!-- Container -->
<aside class="page-summary-container">
  <!-- Label -->
  <p class="label">{label}</p>

  <!-- Prose -->
  <ProseContainer {data} />
</aside>
{/if}

<style>
  .page-summary-container {
    width: 100%;
    background: var(--color-surface-200-800);
    padding: calc(var(--spacing) * 4);
    border-radius: var(--radius-md);
  }
</style>
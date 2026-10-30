<script>

  let {
    label = "Not found",
    children,
    class: className
  } = $props();

</script>

<h6 class="not-found {className}">
  {#if children}
    {@render children?.()}
  {:else}
    {label}
  {/if}
</h6>

<style>
  :global(.not-found) {
    width: fit-content;
    margin: 0 auto;
    color: var(--color-surface-700-300);
    font-size: var(--text-lg);
    font-weight: 700;
    text-align: center;
    text-wrap: pretty;
  }
</style>
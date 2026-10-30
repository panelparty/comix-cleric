<script>

  // Export props
  let {
    children,
    class: className,
    handle = true,
    handleClasses,
    containerClasses,
    ...restProps
  } = $props();

</script>

<!-- Semantic HTML list item element -->
<li class="sortable-item {containerClasses}" {...restProps}>
  {#if handle}
    <div class="sortable-handle w-fit h-full flex items-center">
      <i class="ph-bold ph-dots-six-vertical {handleClasses}"></i>
    </div>
  {/if}
  <!-- Display anything we place into the component -->
  <div class="w-auto {className}">
    {@render children?.()}
  </div>
</li>

<!-- Local CSS styles -->
<style>
  .sortable-item {
    width: 100%;
    user-select: none;
    display: flex;
    align-items: center;
    gap: .5rem;
  }

  .sortable-item:active {
    outline: 0.125rem solid var(--color-primary-500);
  }

  .sortable-ghost {
    opacity: 0.2;
  }

  .sortable-handle {
    cursor: move;
  }
</style>

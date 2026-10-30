<script>
  // Uility imports
  import { screen } from "$lib/utils/breakpoints";

  // Skeleton UI component imports
  import { Popover, Tooltip } from "@skeletonlabs/skeleton-svelte";

  // Export components
  let {
    content,
    children,
    zIndex = 5,
    positioning = { placement: 'top' },
    class: className,
    ...restProps
  } = $props();
</script>

<!-- If device is not desktop -->
<!-- TODO: Check touch support instead. -->
{#if screen.md.current}
<!-- Display a clickable tooltip -->
<!-- Tooltip component (Skeleton UI) -->
<Tooltip
  triggerBase="tooltip-trigger {className}"
  contentBase="tooltip-content"
  openDelay={200}
  {positioning}
  {zIndex}
  {...restProps}
>
  <!-- Tooltip contents -->
  {#snippet content()}
    <!-- Render provided child elements -->
    {@render children?.()}
    {@render content?.()}
  {/snippet}
</Tooltip>
{:else}
<!-- Display a clickable tooltip -->
<!-- Popover component (Skeleton UI) -->
<Popover
  triggerBase="tooltip-trigger {className}"
  contentBase="tooltip-content"
  {positioning}
  {zIndex}
  {...restProps}
>
  <!-- Tooltip contents -->
  {#snippet content()}
  <!-- Render provided child elements -->
    {@render children?.()}
    {@render content?.()}
  {/snippet}
</Popover>
{/if}

<style>
  :global(.tooltip-trigger) {
    cursor: help;
  }

  :global(.tooltip-content) {
    max-width: 32ch;
    padding: calc(var(--spacing) * 1) calc(var(--spacing) * 2);
    background: var(--color-surface-50-950);
    color: var(--color-surface-contrast-50-950);
    border-width: var(--default-border-width);
    border-color: var(--color-surface-400-600);
    font-size: var(--text-sm);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 2);
  }
</style>
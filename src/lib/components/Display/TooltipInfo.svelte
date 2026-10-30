<script>

  // Utilities
  

  // Components
  import Tooltip from "./Tooltip.svelte";
  

  // Export components
  let {
    ...restProps
  } = $props();

</script>


<Tooltip
  class="tooltip-info"
  contentClasses="tooltip-info-content"
  {...restProps}
>
{#snippet trigger()}
  <span>?</span>
{/snippet}
</Tooltip>


<style>

  :global(.tooltip-info) {
    width: calc(var(--spacing) * 4);
    height: calc(var(--spacing) * 4);
    display: grid;
    place-content: center;
    border-style: var(--tw-border-style);
    border-width: 1px;
    border-color: light-dark(var(--color-primary-600), var(--color-primary-400));
    border-radius: calc(infinity * 1px);
    font-weight: var(--font-weight-bold);
    color: light-dark(var(--color-primary-600), var(--color-primary-400));
    font-size: var(--text-xs);
    line-height: var(--leading-tight);
    cursor: help;


    & > * + * {
      line-height: 1.125;
    }


    &:hover {
      opacity: 60%;
    }
  }


  :global(.tooltip-info-content) {
    padding: calc(var(--spacing) * 1.5);
  }

</style>
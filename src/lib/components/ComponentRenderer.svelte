<script>
  // Registry of component blocks
  import { registry } from "./registry";

  // Props
  let {
    data
  } = $props();

  // Gets a reference to the page components.
  let components = $derived(JSON.parse(data?.currentPage?.body ?? `[{"component":"coming_soon"}]`));
</script>

<!-- Builds a list of (potentially nested) components -->
{#snippet renderNodes(nodes)}
  {#each nodes as { component, props, children }}
    {@const Component = registry[component]}
    {#if Component}
      {#if children?.length}
        <Component {data} {...props}>
          {@render renderNodes(children)}
        </Component>
      {:else}
        <Component {data} {...props} />
      {/if}
    {/if}
  {/each}
{/snippet}

<!-- Render built components -->
{@render renderNodes(components)}
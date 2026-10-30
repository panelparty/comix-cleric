<script>
  import { onMount, tick } from "svelte";
  import Sortable from "sortablejs";

  let {
    value = $bindable([]),
    itemSnippet,
    handle = ".sortable-handle",
    animation = 150,
    group,
    class: className,
    ...restProps
  } = $props();

  let container = $state();
  let sortableInstance;

  onMount(() => {
    let originalNextSibling = null;

    sortableInstance = new Sortable(container, {
      animation,
      group,
      ghostClass: "sortable-ghost",
      handle,
      onStart: (evt) => {
        // Capture the next sibling in the original position
        originalNextSibling = evt.item.nextSibling;
      },
      onEnd: async (evt) => {
        const { oldIndex, newIndex } = evt;
        if (oldIndex === newIndex) return;

        // Restore using the captured sibling reference, not an index
        evt.item.remove();
        container.insertBefore(evt.item, originalNextSibling);

        await tick();

        const new_items = [...value];
        const [movedItem] = new_items.splice(oldIndex, 1);
        new_items.splice(newIndex, 0, movedItem);
        value = new_items.map((item, i) => ({ ...item, order_id: i }));
      },
      ...restProps,
    });

    return () => sortableInstance?.destroy();
  });

  $effect(() => {
    if (sortableInstance) {
      sortableInstance.option("disabled", value.length === 0);
    }
  });
</script>

<ul bind:this={container} class="sortable-container h-fit grid grid-cols-1 {className}">
  {#each value as item, i (item.id)}
    {@render itemSnippet?.(item, i)}
  {/each}
</ul>

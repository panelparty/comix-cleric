<script>

  import { generateString } from '$lib/utils/generate/string';

  import UserBlock from './UserBlock.svelte';
  import DnDContainer from '$lib/components/DnD/DnDContainer.svelte';
  import DnDItem from '$lib/components/DnD/DnDItem.svelte';
  import UserSelector from '$lib/components/Admin/UserSelector.svelte';
  import UserCreator from '$lib/components/Admin/UserCreator.svelte';
  import UserBlockPreviewer from './UserBlockPreviewer.svelte';

  let { id, name, initialValue, multiple, preview, dragGroup, maxFiles = 1, accept, maxHeight = "max-h-128", value = $bindable() } = $props();

  let items = $state(multiple ? (initialValue ?? []) : (initialValue ?? null));

  let new_item = (obj) => {
    return {
      id: obj?.id ?? generateString("media_"),
      type: obj?.type ?? 'media',
      media: obj?.media ?? '',
      hoverText: obj?.hoverText ?? '',
      css: obj?.css ?? '',
    }
  };

  function createItem() {
    if (!multiple) {
      items = new_item();
      
    } else {
      items = [...items, new_item()];
      
    }
  }

  function addItem(e) {
    if (!multiple) {
      items = new_item({
        type: 'media',
        media: {
          id: e?.id,
        },
      });
      
    } else {
      if (e && e?.length && e?.length > 0) {
        let new_items = [];

        for (let i = 0; i < e?.length; i++) {
          new_items.push(new_item({
            type: 'media',
            media: {
              id: e?.id,
            },
          }))
        }

        items = [...items, ...new_items];
      } else {
        items = [...items, new_item({
          type: 'media',
          media: {
            id: e?.id,
          },
        })];
      }
      
    }
  }

  function removeItem(id) {
    if (!multiple) {
      items = null;
      listKey++;
      
    } else {
      items = items.filter(item => item.id !== id);
      listKey++;
      
    }
  }

  // -- Item sorting controls -- //
  // Base movement function.
  function moveItem(array, fromIndex, toIndex) {
    const newArray = cloneDeep(array);
    const [item] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, item);
    return newArray;
  }

  function moveUp(array, index) {
    const newIndex = index - 1
    selectedMediaFile = newIndex
    return moveItem(array, index, newIndex);
  }

  function moveDown(array, index) {
    const newIndex = index + 1
    selectedMediaFile = newIndex
    return moveItem(array, index, newIndex);
  }

  function moveTop(array, index) {
    const newIndex = 0
    selectedMediaFile = newIndex
    return moveItem(array, index, newIndex);
  }

  function moveBottom(array, index) {
    const newIndex = array.length - 1
    selectedMediaFile = newIndex
    return moveItem(array, index, newIndex);
  }

</script>

<div class="grid grid-rows-[min-content_auto] gap-2 overflow-hidden {maxHeight}">
  <input type="hidden" {name} id={id ?? name} value={JSON.stringify(items)} />
  <div class="flex gap-2">
    <button type="button" onclick={createItem} class="btn preset-filled-surface-300-700">New Item</button>
    <UserSelector {accept} {maxFiles} onAddFile={(e) => addItem(e)} />
    <UserCreator {accept} {maxFiles} onUploadComplete={(e) => addItem(e)} />
  </div>

  {#if items}
    <div class="h-full overflow-hidden grid grid-cols-2 gap-2">
      {#if !multiple}
      <UserBlock
        item={items}
        onChange={(updated) => items = updated}
        onRemove={() => removeItem(item.id)}
        {multiple}
      />
      {:else if items?.length > 0}
      <DnDContainer bind:value={items} group={dragGroup} class="max-h-full overflow-y-auto gap-2">
      {#snippet itemSnippet(item, i)}
        <DnDItem>
          <UserBlock
            item={item}
            onChange={(updated) => items[i] = updated}
            onRemove={() => removeItem(item.id)}
            {multiple}
          />
        </DnDItem>
      {/snippet}
      </DnDContainer>
      {/if}
      {#if preview}
        <UserBlockPreviewer media={items} />
      {/if}
    </div>
  {:else}
    No items created.
  {/if}
</div>

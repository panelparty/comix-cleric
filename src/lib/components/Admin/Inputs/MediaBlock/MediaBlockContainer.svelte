<script>
  // Utilities
  import { generateString } from '$lib/utils/generate/string';
  import { screen } from '$lib/utils/breakpoints';

  // Components
  import MediaBlock from './MediaBlock.svelte';
  import DnDContainer from '$lib/components/DnD/DnDContainer.svelte';
  import DnDItem from '$lib/components/DnD/DnDItem.svelte';
  import FileSelector from '../FileSelector.svelte';
  import FileUploader from '../FileUploader.svelte';
  import MediaBlockPreviewer from './MediaBlockPreviewer.svelte';
  import Reader from '$lib/components/Reader/Reader.svelte';

  // Props
  let {
    id,
    name,
    initialValue,
    format_strip,
    previewer,
    multiple,
    preview,
    blocks,
    dragGroup,
    maxFiles = 1,
    accept,
    fetchTypes,
    maxHeight = "max-h-140",
    value = $bindable()
  } = $props();

  // Set initial selection state
  let items = $state(multiple ? (initialValue ?? []) : (initialValue ?? null));

  // Item template
  let new_item = (obj) => {
    return {
      id: obj?.id ?? generateString("media_"),
      type: obj?.type ?? 'media',
      media: obj?.media ?? '',
      hoverText: obj?.hoverText ?? '',
      css: obj?.css ?? '',
    }
  };

  // Create item
  function createItem() {
    if (!multiple) {
      items = new_item();
    } else {
      items = [...items, new_item()];
    }
  }

  // Add item
  function addItem(e) {
    if (!multiple) {
      items = new_item({
        type: 'media',
        media: {
          ...e,
        },
      });
    } else {
      if (e && e?.length && e?.length > 0) {
        let new_items = [];

        for (let i = 0; i < e?.length; i++) {
          new_items.push(new_item({
            type: 'media',
            media: {
              ...e[i],
            },
          }))
        }

        items = [...items, ...new_items];
      } else {
        items = [...items, new_item({
          type: 'media',
          media: {
            ...e,
          },
        })];
      }
    }
  }

  // Remove item
  function removeItem(id) {
    if (!multiple) {
      items = null;
    } else {
      items = items.filter(item => item.id !== id);
    }
  }
</script>

<div class="grid grid-rows-[min-content_auto] gap-2 overflow-hidden h-screen {screen.lg.current ? maxHeight : ''}">
  <input type="hidden" {name} id={id ?? name} value={JSON.stringify(items)} />
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-2">
    <FileSelector {fetchTypes} {maxFiles} onAddFile={(e) => addItem(e)} />
    <FileUploader {accept} {maxFiles} onUploadComplete={(e) => addItem(e)} />
    {#if blocks}
    <button type="button" onclick={createItem} class="btn preset-filled-surface-300-700">New Block</button>
    {/if}
  </div>

  {#if items}
    <div class="{!screen.lg.current ? 'h-fit' : 'max-h-full'} overflow-hidden grid grid-cols-1 grid-rows-[auto_max-content] lg:grid-cols-2 gap-2">
      {#if !multiple}
      <MediaBlock
        {accept}
        item={items}
        onChange={(e) => items = e}
        onRemove={() => removeItem(items.id)}
        {multiple}
      />
      {:else if items?.length > 0}
      <DnDContainer bind:value={items} group={dragGroup} class="{!screen.lg.current ? 'h-fit max-h-96' : 'max-h-full'} overflow-y-auto gap-2 border p-2 rounded-lg">
      {#snippet itemSnippet(item, i)}
        <DnDItem containerClasses="border rounded-lg pl-2" class="grid overflow-hidden w-full">
          <MediaBlock
            {accept}
            item={item}
            onChange={(e) => items[i] = e}
            onRemove={() => removeItem(item.id)}
            previewClasses="max-w-auto"
            {multiple}
          />
        </DnDItem>
      {/snippet}
      </DnDContainer>
      {/if}
      {#if preview}
        <MediaBlockPreviewer>
          <Reader
            media={items}
            sticky={false}
            {format_strip}
            maxHeight="100%"
            preview
          />
        </MediaBlockPreviewer>
      {/if}
    </div>
  {:else}
    No items created.
  {/if}
</div>

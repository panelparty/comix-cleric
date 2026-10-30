<script>
  // Utility imports
  import { fallback } from '$lib/utils/utils';
  
  // Components
  import Badge from '../DataBlocks/Badge.svelte';
  import ItemNumber from '../DataBlocks/ItemNumber.svelte';
  import Image from '../Media/Image.svelte';

	// Props
  let {
    children,
    label,
    href,
    data,
    updateNumber = false,
    id,
    thumb = false,
    thumbBook = false,
    isNew = false,
    itemCount,
    class: className
  } = $props();
</script>

<!-- Semantic HTML list item element -->
<li class="item-card-container" {id} data-new={isNew}>
  <!-- Item link -->
  <a href={href} class="{updateNumber ? 'pl-4' : ''} preset-filled-surface-100-900 flex items-center gap-2 md:gap-4 hover:preset-filled-surface-200-800 rounded-lg {className}">
    <!-- Display update number or type icon -->
    {#if updateNumber}
      <!-- Display a formatted number -->
      {#if data?.number}
        <ItemNumber number={data?.number} pad {itemCount} />
      {:else}
        <p class="item-card-icon">
          <i class="ph-fill ph-newspaper"></i>
        </p>
      {/if}
    {/if}
    <!-- If we should display a thumbnail and it's set to full layout -->
    {#if thumb}
    <div class="item-preview">
      <!-- Thumnail image -->
      <Image
        src={`/api/media/${fallback([data?.cover?.filename_disk, data?.chapter?.cover?.filename_disk, data?.volume?.cover?.filename_disk, data?.series?.cover?.filename_disk, data?.settings?.logo?.filename_disk])}`}
        alt="{data?.name} thumbnail"
        wrapperClasses="square item-preview-image"
        class="item-preview-image"
      />
    </div>
    {/if}

    <!-- Card info wrapper -->
    <div class="info w-full truncate">
      <!-- Render any provided child elements -->
      {@render children?.()}
    </div>

    <!-- Display new update indicator -->
    {#if isNew}
      <Badge class="badge-new" label="New!" data-preset="new" />
    {/if}
  </a>
</li>

<style>
  .item-card-container {
    position: relative;
    width: 100%;

    &[data-new="true"] {
      border-width: 2px;
      border-color: var(--color-warning-500);
    }
  }

  .item-preview {
    padding: calc(var(--spacing));
  }

  .item-card-icon {
    width: 5ch;
    font-size: var(--text-base);
    white-space: nowrap;
    display: flex;
    justify-content: center;
  }

  :global(.item-preview-image) {
    width: 4rem;
    border-radius: var(--radius-md);
    overflow: hidden;
  }

  :global(.badge-new) {
    position: absolute;
    z-index: 5;
    margin-inline: auto;
    right: 0;
    top: 0;
  }
</style>
<script>
  // Utilities
  import { screen } from "$lib/utils/breakpoints";
  
  // Components
  import Image from "$lib/components/Media/Image.svelte";
  import FileSelector from "./FileSelector.svelte";
  import FileUploader from "./FileUploader.svelte";
  import MobilePreview from "../MobilePreview.svelte";

  // Props
  let {
    label,
    value = $bindable(),
    onChange = () => {},
    accept,
    fetchTypes,
    inputClasses,
    preview,
    canImport = true,
    canUpload = true,
    aspect = "aspect-auto",
    ...restProps
  } = $props();

  // Remove button functionality
  function removeMedia() {
    value = null;
  };
</script>

<div class="w-fit {inputClasses}">
  <div class="space-y-2">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    {#if canImport}
      <!-- File import component -->
      <FileSelector
        {fetchTypes}
        onAddFile={onChange}
      />
    {/if}
    {#if canUpload}
      <!-- File uploader component (self-contained) -->
      <FileUploader
        {accept}
        subtext=""
        onUploadComplete={onChange}
      />
    {/if}
    </div>
    <!-- Display preview if an image exists -->
    {#if value}
      {#if screen.sm.current}
      <div class="flex gap-2">
      <!-- Show this on desktop -->
      {#if preview}
        {@render preview?.()}
      {:else}
      <!-- Image preview -->
        <div class="w-full max-w-sm overflow-hidden flex items-center bg-surface-200-800 rounded-md pattern-checker border">
          <Image src="/api/media/{value?.filename_disk}" alt="" class="h-auto w-full object-cover {aspect}" />
        </div>
        {/if}
        <button type="button" class="btn size-8 preset-filled-error-500" aria-label="Remove media" onclick={removeMedia}><i class="ph-bold ph-trash"></i></button>
      </div>
      {:else}
      <!-- Show this on mobile -->
      <MobilePreview
        title="{label} Preview"
      >
        <!-- Modal trigger -->
        {#snippet trigger()}
          Preview {label}
        {/snippet}
        <!-- Modal contents -->
        {#snippet children()}
        <div class="space-y-2">
          {#if preview}
            {@render preview?.()}
          {:else}
          <!-- Image preview -->
            <div class="overflow-hidden flex items-center bg-surface-200-800 rounded-md pattern-checker border">
              <Image src="/api/media/{value?.filename_disk}" alt="" class="min-h-full w-auto object-cover {aspect}" />
            </div>
            <button type="button" class="btn btn-sm text-base preset-filled-error-500" onclick={removeMedia}>Remove Media</button>
          {/if}
        </div>
        {/snippet}
      </MobilePreview>
      {/if}
    {:else}
    <p class="">Please select media to preview.</p>
    {/if}
  </div>
</div>

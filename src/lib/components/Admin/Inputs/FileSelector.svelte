<script>
  // Svelte utilities
  import { onMount } from 'svelte';

  // Utilities
  import { isArray, toString } from 'lodash-es';

  // Components
  import Pagination from '$lib/components/Pagination/Pagination.svelte';
  import Image from '$lib/components/Media/Image.svelte';

  // Skeleton UI components
  import { Modal } from '@skeletonlabs/skeleton-svelte';

  // Props
  let {
    onAddFile = () => {}, // Callback prop from parent
    label = 'Add from Library',
    fetchTypes,
    open = false,
    maxFiles = 1,
    limit = 25,
    sort = 'uploaded_on',
    sortDir = '-'
  } = $props();

  // Setup component states
  let selected = $state();
  let loading = $state(false);
  let data = $state();
  let files = $state([]);
  let fileCount = $state([]);
  let currentPage = $state(1);
  
  // Initialize selected based on maxFiles
  $effect(() => {
    selected = maxFiles === 1 ? null : [];
  });

  let types = $derived.by(()=>{
    let str = "";
    if (isArray(fetchTypes)) {
      for (let i = 0; i < fetchTypes?.length; i++) {
        str += toString(fetchTypes[i]) + (i != fetchTypes?.length - 1 ? "," : '');
      }
    } else {
     str = toString(fetchTypes);
    }
    return str;
  });

  // When component loads
  onMount(async () => {
    // If the component is open
    if (open) {
      // Fetch media with parameters
      fetchMedia(currentPage, limit, sortDir, sort, types);
    }
  });

  // Triggers fetch request wehn parameters change
  $effect(()=>{
    // If the component is open
    if (open) {
      // Fetch media with parameters
      fetchMedia(currentPage, limit, sortDir, sort, types);
    }
  });

  // Fetches media files from the media library based on input parameters
  async function fetchMedia(page, limit, dir, sort, type) {
    // Prepare to fetch data
    let json;

    // Set component loading state
    loading = true;

    // Attempt to fetch data
    try {
      // Await a response from the media fetch api
      const res = await fetch(`/api/media?page=${page}&limit=${limit}&sort=${dir}${sort}&type=${type ?? '*'}`);

      // Get the actual response object
      json = await res.json()
    } catch (e) {
      // ...
    } finally {
      // Update available files
      updateFiles(json);
      // Set the loading state
      loading = false;
    }
  }

  // Updates list of available files on the current page
  function updateFiles(data) {
    // If files exist
    if (data?.media_files?.length > 0) {
      // Set the existing files
      files = data?.media_files;
      // Set the existing file count
      fileCount = data?.media_count;
    } else {
      // No files
      files = [];
      // No file count
      fileCount = null;
    }
  };

  // Closes the modal
  function closeModal() {
    // Set modal state
    open = false;
    // Clear selected files
    selected = maxFiles === 1 ? null : [];
  };

  // Handles discard
  function handleCancel() {
    // Close/reset the modal
    closeModal();
  };

  // Handles when files are selected
  function handleFileSelect(file) {
    if (maxFiles === 1) {
      selected = file;
    } else {
      if (!selected.includes(file)) {
        selected.push(file);
      } else {
        const i = selected.indexOf(file);
        if (i > -1) {
          selected.splice(i, 1);
        }
      }
    }
  }

  // Finalize selection (submit)
  function handleAdd() {
    // If we only allow one selection
    if (maxFiles === 1) {
      // If a selection exists
      if (selected) {
        // Update the parent component with the value
        onAddFile(selected);
        // Close/reset the modal
        closeModal();
      }
    } else {
      // If there is a selection and there is at least one item
      if (selected && selected.length > 0) {
        // Update the parent component with the value
        onAddFile(selected);
        // Close/reset the modal
        closeModal();
      }
    }
  }

  // Checks item selection status
  function isSelected(file) {
    // If we only allow one selection
    if (maxFiles === 1) {
      // Return if the selected file ID matches the checked file ID
      return selected?.id === file.id;
    } else {
      // Check for the ID in the array
      return selected?.some(f => f.id === file.id) || false;
    }
  }

  // Why did I even make this?
  function getSelectedCount() {
    if (maxFiles === 1) {
      // If a value exists, return one
      return selected ? 1 : 0;
    } else {
      // If the array has values, return length
      return selected?.length || 0;
    }
  }

  // Oh, that's why. Still, check validity of my dumbness.
  function canAdd() {
    return getSelectedCount() > 0;
  }
</script>

<Modal
  {open}
  onOpenChange={(e) => (open = e.open)}
  triggerClasses="btn w-full preset-outlined-primary-500!"
  contentClasses="w-full relative grid grid-cols-1 grid-rows-[min-content_1fr_min-content] gap-4 max-h-[calc(100dvh-2rem)] overflow-hidden border shadow-xl shadow-surface-950/10 w-[calc(100vw-2rem)] md:max-w-3xl bg-surface-50-950 p-4 md:p-6 rounded-xl"
>
  {#snippet trigger()}
    {label}
  {/snippet}

  {#snippet content()}
    <div class="space-y-4">
      <!-- Header -->
      <header class="flex items-center gap-2 mb-4">
        <h4 class="h4 leading-none!">Select File{maxFiles > 1 ? 's' : ''}</h4>
        <p class="leading-none!">• {maxFiles === 1 ? (selected ? 'File' : 'No File') : selected?.length} Selected</p>
      </header>

      <!-- Sorting -->
      <div class="flex gap-2 items-center">
        <p class="">Sort:</p>
        <div class="input-group grid grid-cols-[auto_auto_auto] ">
          <select class="ig-select text-sm px-2 py-1 leading-none min-w-36 rounded-l-md" bind:value={sort}>
            <option value="uploaded_on">Date Uploaded</option>
            <option value="date_updated">Last Modified</option>
            <option value="title">Title</option>
          </select>
          <button class="ig-btn text-xs p-1 h-6 grid place-content-center {sortDir === '' ? 'bg-primary-500 text-surface-950' : ''}" onclick={()=>{sortDir = ''}} aria-label="Sort ascending"><i class="ph-bold ph-plus"></i></button>
          <button class="ig-btn text-xs p-1 h-6 grid place-content-center {sortDir === '-' ? 'bg-primary-500 text-surface-950' : ''}" onclick={()=>{sortDir = '-'}} aria-label="Sort descending"><i class="ph-bold ph-minus"></i></button>
        </div>
      </div>
    </div>

    <!-- Files -->
    {#if loading}
    <p>Loading files...</p>
    {:else}
    <ul class="relative h-full list-none! p-2 border grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 overflow-y-auto rounded-lg">
      {#each files as file, i}
      <button
        type="button"
        class="relative group border p-2 transition-all rounded-lg {isSelected(file) ? 'bg-primary-200-800' : 'hover:bg-surface-200-800'}"
        onclick={() => handleFileSelect(file)}
        disabled={!isSelected(file) && maxFiles > 1 && getSelectedCount() >= maxFiles}
      >
      {#if file.type?.startsWith('image/')}
        <Image
          src="/api/media/{file?.filename_disk}"
          alt={file?.desc || 'Media file'}
          class="w-full aspect-square object-cover rounded"
          loading="lazy"
        />
      {:else if file?.type?.startsWith('video/')}
        <div class="w-full aspect-square bg-surface-200-800 rounded flex items-center justify-center">
          <svg class="w-8 h-8 text-surface-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM10 9a1 1 0 000 2v3a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 000-2h-3a1 1 0 00-1 1v1z"/>
          </svg>
        </div>
      {:else if file?.type?.startsWith('audio/')}
        <div class="w-full aspect-square bg-surface-200-800 rounded flex items-center justify-center text-2xl">
          <i class="ph-bold ph-music-notes"></i>
        </div>
      {:else}
        <div class="w-full aspect-square bg-surface-200-800 rounded flex items-center justify-center">
          <svg class="w-8 h-8 text-surface-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"/>
          </svg>
        </div>
      {/if}

      <p class="text-sm mt-2 truncate font-bold" title={file?.title}>
        {file?.title || 'Unnamed file'}
      </p>

      {#if isSelected(file)}
        <div class="absolute top-4 right-4 size-5 border preset-filled-primary-500 rounded-full flex items-center justify-center text-xs">
          <i class="ph-bold ph-check"></i>
        </div>
      {/if}

      {#if !isSelected(file) && maxFiles > 1 && getSelectedCount() >= maxFiles}
        <div class="absolute inset-0 bg-surface-500/20 "></div>
      {/if}
    </button>
      <!-- <li
        class="flex border border-surface-300-700  cursor-pointer hover:brightness-125 hover:dark:brightness-75"
        onclick={() => handleFileSelect(file)}
      >
        <div class="">
          <div class="relative aspect-square w-full overflow-hidden rounded-t-md border-b border-surface-300-700">
            <img src="/api/media/{file?.filename_disk}" alt="" class="min-h-full w-auto object-cover">
            <input type="checkbox" class="input">
            <p class="absolute top-2 right-2 text-xs font-semibold uppercase tracking-wide p-1 leading-none bg-primary-500 text-surface-950 ">
              {file?.type}
            </p>
          </div>
          <div class="p-2 grid grid-cols-[auto_min-content] items-center">
            <p class="-my-1 truncate text-sm font-bold">{file?.title}</p>
            <p class="leading-none border-l border-surface-300-700 px-2 text-xs flex items-center gap-1 capitalize"><i class="ph-bold ph-folder"></i>{file?.folder?.name}</p>
          </div>
        </div>
      </li> -->
      {/each}
    </ul>
    {/if}

    <div class="space-y-2">
      <Pagination
        data={files}
        count={fileCount}
        onPageChange={(e) => {currentPage = e.page;}}
        page={currentPage}
        bind:pageSize={limit}
      />

      <!-- Footer -->
      <footer class="flex justify-between gap-2 md:gap-4 bg-surface-50-950">
        <button class="btn preset-tonal-error w-full md:w-fit" onclick={handleCancel} disabled={loading}>Cancel</button>
        <button class="btn preset-tonal-success w-full md:w-fit" disabled={loading || !selected || selected?.length < 1} onclick={handleAdd}>Add File{selected?.length > 1 ? 's' : ''}</button>
      </footer>
    </div>
  {/snippet}
</Modal>

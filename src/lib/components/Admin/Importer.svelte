<script>
  // Utilities
  import { consoleError } from '$lib/utils/debug';

  // Skeleton UI component imports
  import { Avatar, Modal, Pagination } from '@skeletonlabs/skeleton-svelte';
  import { onMount } from 'svelte';

  // Export props
  let {
    onAddItem = () => {}, // Callback prop from parent
    label = 'Add Existing',
    open = false,
    maxItems = 1,
    limit = 12,
    sort,
    sortDir = '-'
  } = $props();

  // Setup form states
  let selected = $state(maxItems === 1 ? null : []);
  let loading = $state(false);
  let data = $state();
  let users = $state([]);
  let userCount = $state([]);
  let currentPage = $state(1);

  // On component load
  onMount(async () => {
    // If the modal is open
    if (open) {
      // Trigger fetch request
      fetchUsers(`/api/users?page=${currentPage}&limit=${limit}&sort=${sortDir}${sort}`);
    }
  });

  // Keeps fetch data in-sync with parameters
  $effect(()=>{
    if (open) {
      fetchUsers(`/api/users?page=${currentPage}&limit=${limit}&sort=${sortDir}${sort}`);
    }
  });

  // Gets a paginated list of users
  async function fetchUsers(url) {
    let json;
    loading = true;
    try {
      const res = await fetch(url);

      json = await res.json()
    } catch (error) {
      consoleError('Failed to fetch:', error);
    } finally {
      updateItems(json);
      loading = false;
    }
  }


  function updateItems(data) {
    if (data?.users?.length > 0) {
      items = data?.users;
      itemCount = data?.user_count[0]?.count;
    } else {
      items = [];
      userCount = null;
    }
  };

  function closeModal() {
    open = false;
    selected = maxItems === 1 ? null : [];
  };

  function handleCancel() {
    selected = [];
    closeModal();
  };

  function handleSelect(item) {
    if (maxItems === 1) {
      selected = item;
    } else {
      if (!selected.includes(item)) {
        selected.push(item);
      } else {
        const i = selected.indexOf(item);
        if (i > -1) {
          selected.splice(i, 1);
        }
      }
    }
  }

  function handleAdd() {
    if (maxItems === 1) {
      if (selected) {
        onAddItem(selected);
        closeModal();
      }
    } else {
      if (selected && selected.length > 0) {
        onAddItem(selected);
        closeModal();
      }
    }
  }

  function isSelected(item) {
    if (maxItems === 1) {
      return selected?.id === item.id;
    } else {
      return selected?.some(f => f.id === item.id) || false;
    }
  }

  function getSelectedCount() {
    if (maxItems === 1) {
      return selected ? 1 : 0;
    } else {
      return selected?.length || 0;
    }
  }

  function canAdd() {
    return getSelectedCount() > 0;
  }

</script>

<Modal
  {open}
  onOpenChange={(e) => (open = e.open)}
  triggerClasses="btn  w-full preset-outlined-surface-500 "
  contentClasses="max-h-[calc(100dvh-2rem)] overflow-y-auto shadow-xl shadow-surface-950/10 w-[calc(100vw-2rem)] md:max-w-prose bg-surface-50-950 p-6 "
>
  {#snippet trigger()}
    {label}
  {/snippet}

  {#snippet content()}
    <div class="w-full relative">

      <header class="flex items-center gap-2 mb-4">
        <h4 class="h4 leading-none!">Select User{maxItems > 1 ? 's' : ''}</h4>
        <p class="leading-none!">• {maxItems === 1 ? (selected ? 'File' : 'No File') : selected?.length} Selected</p>
      </header>

      <main>
        <div class="space-y-4">
          <div class="flex gap-2 items-center">
            <p class="">Sort:</p>
            <div class="input-group grid grid-cols-[auto_auto_auto] ">
              <select class="ig-select text-sm px-2 py-1 leading-none min-w-36 rounded-l-md" bind:value={sort}>
                <option value="uploaded_on">Date Uploaded</option>
                <option value="modified_on">Last Modified</option>
                <option value="title">Title</option>
                <option value="created_on">Date Created</option>
              </select>
              <button class="ig-btn text-xs p-1 h-6 grid place-content-center {sortDir === '' ? 'bg-primary-500 text-surface-950' : ''}" onclick={()=>{sortDir = ''}}><i class="ph-bold ph-plus"></i></button>
              <button class="ig-btn text-xs p-1 h-6 grid place-content-center {sortDir === '-' ? 'bg-primary-500 text-surface-950' : ''}" onclick={()=>{sortDir = '-'}}><i class="ph-bold ph-minus"></i></button>
            </div>
          </div>
          <div class="">
            {#if loading}
            <p>Loading files...</p>
            {:else}
            <div class="h-full">
              <ul class="relative h-full list-none! p-2 border border-surface-300-700  grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto">
                {#each users as item, i}
                <button
                class="relative group  p-2 transition-all hover:shadow-md {isSelected(item) ? 'border-primary-500 bg-primary-50' : 'border-surface-300 hover:border-surface-400'}"
                onclick={() => handleUserSelect(item)}
                disabled={!isSelected(item) && maxItems > 1 && getSelectedCount() >= maxItems}
              >
                {item?.avatar}
                <Avatar src="/api/media/{item?.avatar?.filename_disk}" name={item?.displayname ?? item?.username} size="size-12" background="preset-filled-primary-500" rounded="rounded-md" />

                <p class="text-xs mt-2 truncate" title={item?.name}>
                  {item?.name || 'Unnamed user'}
                </p>

                {#if isSelected(item)}
                  <div class="absolute top-1 right-1 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs">
                    <i class="ph-bold ph-check"></i>
                  </div>
                {/if}

                {#if !isSelected(item) && maxItems > 1 && getSelectedCount() >= maxItems}
                  <div class="absolute inset-0 bg-surface-500/20 "></div>
                {/if}
              </button>
                <!-- <li
                  class="flex border border-surface-300-700  cursor-pointer hover:brightness-125 hover:dark:brightness-75"
                  onclick={() => handleUserSelect(file)}
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
              <div class="sticky w-full col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 -left-4 -right-4 -bottom-8 mt-2 border-t border-surface-300-700 bg-surface-50-950 p-4 z-10">
                <Pagination
                  data={users}
                  count={userCount}
                  onPageChange={(e) => {currentPage = e.page;}}
                  page={currentPage}
                  pageSize={limit}

                >
                  {#snippet labelEllipsis()}<i class="ph-bold ph-dots-three"></i>{/snippet}
                  {#snippet labelNext()}<i class="ph-bold ph-arrow-right"></i>{/snippet}
                  {#snippet labelPrevious()}<i class="ph-bold ph-arrow-left"></i>{/snippet}
                  {#snippet labelFirst()}<i class="ph-bold ph-caret-line-left"></i>{/snippet}
                  {#snippet labelLast()}<i class="ph-bold ph-caret-line-right"></i>{/snippet}
                </Pagination>
              </div>
            </div>
            {/if}
          </div>
          <footer class="flex justify-between bg-surface-50-950">
            <button class="btn  preset-tonal-error " onclick={handleCancel} disabled={loading}>Cancel</button>
            <button class="btn  preset-tonal-success " disabled={loading || !selected || selected?.length < 1} onclick={handleAdd}>Add File{selected?.length > 1 ? 's' : ''}</button>
          </footer>
        </div>
      </main>
    </div>
  {/snippet}
</Modal>

<script>
  // Svelte imports
  import { onMount } from 'svelte';

  // Skeleton UI component imports
  import { Modal, Pagination } from '@skeletonlabs/skeleton-svelte';
  import { toastError, toastSuccess } from '$lib/utils/toast';
  import Loader from '../Placeholders/Loader.svelte';
  import Author from '../User/Author.svelte';
  import NotFound from '../Placeholders/NotFound.svelte';
  import ProfileCompact from '../User/ProfileCompact.svelte';

  // Export props
  let {
    onAddUser = () => {}, // Callback prop from parent (data/event passing)
    label = 'Select User',
    open = false,
    maxUsers = 1,
    limit = 12,
    sort = 'username',
    sortDir = '-',
    guest = true
  } = $props();

  // Setup component states
  let selected = $state(maxUsers === 1 ? null : []);
  let loading = $state(false);

  // Setup data management
  let data = $state();
  let users = $state([]);
  let userCount = $state([]);

  // Setup pagination
  let currentPage = $state(1);

  // On page load
  onMount(async () => {
    // If modal state is open
    if (open) {
      // Get first page of users
      fetchUsers(`/api/${guest ? 'guests' : 'users'}?page=${currentPage}&limit=${limit}&sort=${sortDir}${sort}`);
    }
  });

  // Keep pagination in-sync with
  $effect(()=>{
    // If modal state is open
    if (open) {
      // Get first page of users
      fetchUsers(`/api/${guest ? 'guests' : 'users'}?page=${currentPage}&limit=${limit}&sort=${sortDir}${sort}`);
    }
  });

  // Fetch call handler
  async function fetchUsers(url) {
    let json;
    loading = true;
    try {
      const res = await fetch(url);

      json = await res.json();
    } catch (error) {
      toastError('Failed to fetch users:', error);
    } finally {
      updateUsers(json);
      loading = false;
    }
  }

  function updateUsers(data) {
    if (data?.users?.length > 0) {
      users = data?.users;
      userCount = data?.user_count[0]?.count;
    } else {
      users = [];
      userCount = null;
    }
  };

  function closeModal() {
    open = false;
    selected = maxUsers === 1 ? null : [];
  };

  function handleCancel() {
    closeModal();
  };

  function handleSelect(user) {
    if (maxUsers === 1) {
      selected = user;
    } else {
      if (!selected.includes(user)) {
        const userObj = {
          ...user,
          guest: guest
        }
        selected.push(userObj);
      } else {
        const i = selected.indexOf(user);
        if (i > -1) {
          selected.splice(i, 1);
        }
      }
    }
  }

  // Add selected user data to parent component
  function handleAdd() {
    // If we limited the max users to one
    if (maxUsers === 1) {
      // If a value exists in selected
      if (selected) {
        // Only add the first selected user in the array
        onAddUser(selected);
        // Close the modal
        closeModal();
        // Display success toast
        toastSuccess(`${guest ? 'Guest' : 'User'} added!`)
      } else {
        // Something went wrong
        toastError(`Failed to add ${guest ? 'guest' : 'user'}!`)
      }
    } else {
      if (selected && selected.length > 0) {
        // Only add the first selected user in the array
        onAddUser(selected);
        // Close the modal
        closeModal();
        // Display success toast
        toastSuccess(`${guest ? 'Guest' : 'User'}${selected.length > 1 ? 's' : ''} added!`)
      } else {
        // Something went wrong
        toastError(`Failed to add ${guest ? 'guest' : 'user'}${selected.length > 1 ? 's' : ''}!`)
      }
    }
  }

  // Checks if the user is already selected
  function isSelected(user) {
    // If we have limited the users to one
    if (maxUsers === 1) {
      // Return if there is a direct value match
      return selected?.id === user.id;
    } else if (maxUsers > 1) {
      // Return if the id is found in the array
      return selected?.some(f => f.id === user.id) || false;
    }
  }

  // TODO: Why did I even make this?
  const selectedCount = () => {
    if (maxUsers === 1) {
      // If a value exists, return one
      return selected ? 1 : 0;
    } else {
      // If the array has values, return length
      return selected?.length || 0;
    }
  }

  // TODO: Oh, that's why. Still, check validity of my dumbness.
  function canAdd() {
    return selectedCount > 0;
  }
</script>

<!-- Modal component (Skeleton UI) -->
<Modal
  {open}
  onOpenChange={(e) => (open = e.open)}
  triggerClasses="btn w-full preset-outlined-surface-500 "
  contentClasses="max-h-[calc(100dvh-2rem)] overflow-y-auto shadow-xl shadow-surface-950/10 w-[calc(100vw-2rem)] md:max-w-3xl bg-surface-50-950 p-6 "
>
  <!-- Trigger -->
  {#snippet trigger()}
    {label}
  {/snippet}
  <!-- Contents -->
  {#snippet content()}
    <div class="w-full relative">
      <!-- Modal header -->
      <div class="flex items-center gap-2 mb-4">
        <!-- Modal heading/title -->
        <h4 class="h4 leading-none!">Select User{maxUsers > 1 ? 's' : ''}</h4>
        <!-- Selected count -->
        <p class="leading-none!">• {maxUsers === 1 ? (selected ? 'User' : 'No User') : selected?.length} Selected</p>
      </div>

      <!-- Select container -->
      <div>
        <!-- User sorting and filter options -->
        <!-- TODO: Add filter options and later full-search -->
        <div class="space-y-4">
          <!-- Sorting options -->
          <div class="flex gap-2 items-center">
            <p class="">Sort:</p>
            <div class="input-group grid grid-cols-[auto_auto_auto] ">
              <select class="ig-select text-sm px-2 py-1 leading-none min-w-36 rounded-l-md" bind:value={sort}>
                <option value="username">Username</option>
                <option value="displayname">Displayname</option>
                <option value="date_created">Date Created</option>
                <option value="project_role">Role</option>
              </select>
              <button class="ig-btn text-xs p-1 h-6 grid place-content-center {sortDir === '' ? 'bg-primary-500 text-surface-950' : ''}" onclick={()=>{sortDir = ''}}><i class="ph-bold ph-plus"></i></button>
              <button class="ig-btn text-xs p-1 h-6 grid place-content-center {sortDir === '-' ? 'bg-primary-500 text-surface-950' : ''}" onclick={()=>{sortDir = '-'}}><i class="ph-bold ph-minus"></i></button>
            </div>
          </div>
          <div class="">
            <div class="">
              User Type
            </div>
            <div class="btn-group">
              <button type="button" class="btn {guest ? 'preset-filled-primary-500' : 'preset-filled-surface-300-700'}" onclick={()=>{guest = true}}>Guest</button>
              <button type="button" class="btn {!guest ? 'preset-filled-primary-500' : 'preset-filled-surface-300-700'}" onclick={()=>{guest = false}}>Staff</button>
            </div>
          </div>
          <!-- Results wrapper -->
          <div class="relative">
            {#if loading}
              <!-- If we are still awaiting results -->
              <Loader />
            {:else if users?.length > 0}
              <!-- Results container -->
              <div class="h-full">
                <!-- User list (grid) -->
                <ul class="relative h-full list-none! p-2 border border-surface-300-700 grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 overflow-y-auto">
                  {#each users as item, i}
                  <!-- Select button -->
                  <button
                    class="relative group p-2 rounded-lg border flex flex-col items-center transition-all hover:preset-filled-surface-300-700 {isSelected(item) ? ' preset-filled-primary-500' : ''}"
                    onclick={() => handleSelect(item)}
                    disabled={!isSelected(item) && maxUsers > 1 && selectedCount >= maxUsers}
                  >
                    <ProfileCompact user={item} role class="w-full" />

                    <!-- Decorative checkbox -->
                    {#if isSelected(item)}
                      <div class="absolute top-1 right-1 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs">
                        <i class="ph-bold ph-check"></i>
                      </div>
                    {/if}

                    <!-- ??? -->
                    {#if !isSelected(item) && maxUsers > 1 && selectedCount >= maxUsers}
                      <div class="absolute inset-0 bg-surface-500/20 "></div>
                    {/if}
                  </button>
                  {/each}
                </ul>
                <!-- Pagination container (sticky) -->
                <div class="sticky w-full col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 -left-4 -right-4 -bottom-8 mt-2 border-t border-surface-300-700 bg-surface-50-950 p-4 z-10">
                  <!-- Pagination component (Skeleton UI) -->
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
            {:else}
              <NotFound />
            {/if}
          </div>
          <!-- Modal footer -->
          <div class="flex justify-between bg-surface-50-950">
            <!-- Cancel button (close modal) -->
            <button class="btn preset-tonal-error " onclick={handleCancel} disabled={loading}>Cancel</button>
            <!-- Add button (submit) -->
            <button class="btn preset-tonal-success " disabled={loading || !selected || selected?.length < 1} onclick={handleAdd}>Add User{selected?.length > 1 ? 's' : ''}</button>
          </div>
        </div>
      </div>
    </div>
  {/snippet}
</Modal>

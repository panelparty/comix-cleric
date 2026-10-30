<script>
  // Utilities
  import { isArray } from "lodash-es";
  
  // Components
  import TooltipInfo from "../../../Display/TooltipInfo.svelte";
  import UserCreator from "../../UserCreator.svelte";
  import UserSelector from "../../UserSelector.svelte";
  import DnDContainer from "$lib/components/DnD/DnDContainer.svelte";
  import DnDItem from "$lib/components/DnD/DnDItem.svelte";
  import Modal from "$lib/components/Floating/Modal.svelte";
  import StaffForm from "../StaffForm.svelte";
  import NotFound from "$lib/components/Placeholders/NotFound.svelte";
  import GuestForm from "../GuestForm.svelte";
    import ProfileCompact from "$lib/components/User/ProfileCompact.svelte";
  
  // Props
  let {
    id,
    name,
    initialValue,
    multiple,
    preview,
    dragGroup,
    maxUsers = 1,
    maxHeight = "max-h-128",
    value = $bindable()
  } = $props();

  // Component state
  let items = $derived(multiple ? (initialValue ?? []) : (initialValue ?? null));
  let selectedUser = $state();

  // Return resturctured user data
  function handleUsers(res) {
    if (!isArray(res)) res = [res];
    const startIndex = items?.length ?? 0;
    const normalized = res.map((u, i) => normalizeContributor(u, startIndex + i));
    items = [...(items ?? []), ...normalized];
  }

  // Restructure the selected users to the format we expect
  function normalizeContributor(u, i) {
    // We're using a single table that can contain both guest IDs and user IDs.
    if ('user_id' in u || 'guest_id' in u) {
      return {
        id: u.id,
        user_id: u.user_id,
        guest_id: u.guest_id,
        order_id: i,
      };
    }
    // Raw object from picker
    return {
      id: u.id,
      user_id: u?.email ? {...u} : null,
      guest_id: !u?.email ? {...u} : null,
      order_id: i,
    };
  }

  // Remove a user from the list of selected users.
  function removeItem(id) {
    if (!multiple) {
      items = null;
    } else {
      items = items.filter(item => item.id !== id);
    }
  }
</script>

<!-- Contributors List -->
<div class="space-y-1">
  <!-- Header -->
  <div class="flex items-center gap-1">
    <label for="media_files" class="text-sm ml-1">Contributors</label>
    <TooltipInfo ariaLabel="Comic Image Field Information">
      <p class="">These are the folks that helped make this possible!</p>
      <p class="">Add up to 64 users.</p>
      <p class="text-surface-700-300">Guest accounts are a way for you to add someone's information to your app without giving them access to the site.</p>
    </TooltipInfo>
  </div>
  <!-- Main -->
  <div class="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
    <div class="grid grid-rows-[min-content_auto]">
      <input type="hidden" {name} id={id ?? name} value={JSON.stringify(items)} />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
        <UserSelector
          label="Select Contributor"
          onAddUser={handleUsers}
          {maxUsers}
        />
        <UserCreator
          label="Create Contributor"
          onAddUser={handleUsers}
          create
          navigate={false}
        />
      </div>
      {#if items?.length > 0}
      <div class="relative h-full max-h-[360px] md:max-h-[512px] border border-surface-300-700 p-2 grid grid-rows-[auto_min-content] overflow-y-auto rounded-md">
        <div class="flex flex-col gap-2">
        {#if !multiple}
          <div
            class="grid grid-cols-[1fr_auto] items-center gap-2 border border-surface-300-700 pr-4 cursor-pointer hover:bg-surface-300-700/20 rounded-md"
          >
            <ProfileCompact user={item?.guest_id ?? item?.user_id} role size="large" class="w-full" />
            <div class="flex gap-2">
              <Modal triggerClasses="btn-icon preset-filled-surface-500">
                {#snippet trigger()}
                  <i class="ph-bold ph-pencil-line"></i>
                {/snippet}
                {#snippet content()}
                  {#if item?.guest_id}
                    <GuestForm data={{guest: item?.guest_id}} />
                  {:else if item?.user_id}
                    <StaffForm data={{userData: item?.user_id}} />
                  {:else}
                    <NotFound label="An unexpected error occurred" />
                  {/if}
                {/snippet}
              </Modal>
              <button aria-label="Remove item from list" type="button" onclick={()=>{removeItem(items.id);}} class="btn-icon preset-filled-error-500 "><i class="ph-bold ph-trash"></i></button>
            </div>
          </div>
          {:else if items?.length > 0}
          <DnDContainer bind:value={items} group={dragGroup} class="max-h-full overflow-y-auto gap-2">
          {#snippet itemSnippet(item, i)}
            <DnDItem class="w-full">
              <div
                class="w-full grid grid-cols-[1fr_auto] items-center gap-2 border border-surface-300-700 pr-4 cursor-pointer hover:bg-surface-300-700/20 {selectedUser === i ? 'text-primary-500 border-current! bg-current/20!' : ''} rounded-md"
              >
                <ProfileCompact user={item?.guest_id ?? item?.user_id} role size="large" class="w-full" />
                <div class="flex gap-2">
                  <Modal triggerClasses="btn-icon preset-filled-surface-500">
                    {#snippet trigger()}
                      <i class="ph-bold ph-pencil-line"></i>
                    {/snippet}
                    {#snippet content()}
                      {#if item?.guest_id}
                        <GuestForm data={{guest: item?.guest_id}} />
                      {:else if item?.user_id}
                        <StaffForm data={{userData: item?.user_id}} />
                      {:else}
                        <NotFound label="An unexpected error occurred" />
                      {/if}
                    {/snippet}
                  </Modal>
                  <button aria-label="Remove item from list" type="button" onclick={()=>{removeItem(item.id);}} class="btn-icon preset-filled-error-500 "><i class="ph-bold ph-trash"></i></button>
                </div>
              </div>
            </DnDItem>
          {/snippet}
          </DnDContainer>
          {/if}
        </div>
      </div>
      {:else}
      <p class="">No users selected.</p>
      {/if}
    </div>
  </div>
</div>
<script>

  // Utilities
  import { isArray } from "lodash-es";
  
// Components
  import TooltipInfo from "../../../Display/TooltipInfo.svelte";
  
import DnDContainer from "$lib/components/DnD/DnDContainer.svelte";
  import DnDItem from "$lib/components/DnD/DnDItem.svelte";

  // Props
  let { id, name, initialValue, multiple, preview, dragGroup, maxUsers = 1, maxHeight = "max-h-128", value = $bindable() } = $props();

  let items = $state(multiple ? (initialValue ?? []) : (initialValue ?? null));

  let selectedLink = $state(); // Stores the index of the selected/highlighted media item.

  function handleLinks(res) {
    if (!isArray(res)) res = [res];
    const startIndex = items?.length ?? 0;
    const normalized = res.map((u, i) => normalizeContributor(u, startIndex + i));
    items = [...(items ?? []), ...normalized];
  }

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
    <label for="links" class="text-sm ml-1">Links</label>
    <TooltipInfo ariaLabel="Comic Image Field Information">
      <p class="leading-tight font-bold">This is a simple way to track and update internal links!</p>
      <p class="leading-tight font-bold">You are totally free to still use normal links throughout your site, but these are more easily editable.</p>
      <p class="leading-tight font-bold">Creating a link here will store it, similar to your posts, so you can go back and edit or delete them!</p>
			<p class="leading-tight font-bold">This is very useful for things like social media links or other links you post often that might change!</p>
    </TooltipInfo>
  </div>
  <!-- Main -->
  <div class="grid grid-cols-1 lg:grid-cols-2 md:gap-4">
    <div class="grid grid-rows-[min-content_auto]">
      <input type="hidden" {name} id={id ?? name} value={JSON.stringify(items)} />
      <div class="grid grid-cols-2 gap-2 mb-2">
        <LinkSelector
          label="Select Contributor"
          onAddUser={handleUsers}
          {maxUsers}
        />
        <LinkCreator
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
            class="grid grid-cols-[max-content_auto] items-center gap-2 border border-surface-300-700 pr-4 cursor-pointer hover:bg-surface-300-700/20 rounded-md"
          >
            <div class="aspect-square w-16 overflow-hidden rounded-l-md">
              <img class="block min-h-full w-auto object-cover" src="/api/media/{items?.guest_id?.avatar?.filename_disk ?? items?.user_id?.avatar?.filename_disk}" alt="">
            </div>
            <div class="w-full grid grid-cols-[auto_max-content] items-center">
              <div class="">
                <p class="leading-tight text-surface-950-50 text-sm font-medium">{items?.guest_id?.project_role ?? items?.user_id?.project_role ?? "--"}</p>
                <p class="leading-tight text-surface-950-50 font-bold">{items?.guest_id?.displayname ?? items?.user_id?.displayname ?? "--"}</p>
                <p class="leading-tight text-surface-950-50 text-sm font-medium">@{items?.guest_id?.name ?? items?.user_id?.name ?? "--"}</p>
              </div>
              <button aria-label="Remove item from list" type="button" onclick={()=>{removeItem(items.id);}} class="btn size-8 preset-filled-surface-500 "><i class="ph-bold ph-x"></i></button>
            </div>
          </div>
          {:else if items?.length > 0}
          <DnDContainer bind:value={items} group={dragGroup} class="max-h-full overflow-y-auto gap-2">
          {#snippet itemSnippet(item, i)}
            <DnDItem>
              <div
                class="grid grid-cols-[max-content_auto] items-center gap-2 border border-surface-300-700 pr-4 cursor-pointer hover:bg-surface-300-700/20 {selectedUser === i ? 'text-primary-500 border-current! bg-current/20!' : ''} rounded-md"
              >
                <div class="aspect-square w-16 overflow-hidden rounded-l-md">
                  <img class="block min-h-full w-auto object-cover" src="/api/media/{item?.guest_id?.avatar?.filename_disk ?? item?.user_id?.avatar?.filename_disk}" alt="">
                </div>
                <div class="w-full grid grid-cols-[auto_max-content] items-center">
                  <div class="">
                    <p class="leading-tight text-surface-950-50 text-sm font-medium">{item?.guest_id?.project_role ?? item?.user_id?.project_role ?? "--"}</p>
                    <p class="leading-tight text-surface-950-50 font-bold">{item?.guest_id?.displayname ?? item?.user_id?.displayname ?? "--"}</p>
                    <p class="leading-tight text-surface-950-50 text-sm font-medium">@{item?.guest_id?.name ?? item?.user_id?.name ?? "--"}</p>
                  </div>
                  <button aria-label="Remove item from list" type="button" onclick={()=>{removeItem(item.id);}} class="btn size-8 preset-filled-surface-500 "><i class="ph-bold ph-x"></i></button>
                </div>
              </div>
            </DnDItem>
          {/snippet}
          </DnDContainer>
          {/if}
        </div>
      </div>
      {:else}
      <p class="">Please add at least one user.</p>
      {/if}
    </div>
  </div>
</div>

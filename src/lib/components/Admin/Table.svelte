<script>
  // Svelte imports
  import { page } from "$app/state";

  // Utility imports
  import { formatDate, formatDateLonger } from "$lib/utils/date";
  import { pick } from "lodash-es";
  import { fallback, getLabels } from "$lib/utils/utils";
  import { getPermalink } from "$lib/utils/generate/permalink.js";

  // Component imports
  import DeleteConfirm from "./DeleteConfirm.svelte";
  import Status from "./Status.svelte";
  import Input from "./Inputs/Input.svelte";
  import ShareButton from "../Functional/ShareButton.svelte";
  import Image from "../Media/Image.svelte";
  import Modal from "../Floating/Modal.svelte";
  
  // Export props
  let {
    data,
    dataType,
    canSelect = false,
    canView,
    canEdit,
    canShare,
    canDelete,
    deleteAction
  } = $props();

  let filteredData = $derived.by(()=>{
    return data.map((obj) => pick(obj, displayedLabels));
  });

  // Setup component states
  let labels = $derived.by(()=>{
    return getLabels(data?.updates[0]) || [];
  });

  let displayedLabels = $derived.by(()=>{
    return getDefaultColumns();
  });

  function getDefaultColumns() {
    switch (dataType) {
      case "updates":
        return [
          'cover',
          'number',
          'name',
          'chapter',
          'volume',
          'date_published',
          'status',
        ];
      case "chapters":
        return [
          'cover',
          'name',
          'updates',
          'volume',
          'date_published',
          'status',
        ];
      case "volumes":
        return [
          'cover',
          'name',
          'chapters',
          'updates',
          'date_published',
          'status',
        ];
      case "cast":
        return [
          'cover',
          'name',
          'nickname',
          'type',
          'date_published',
          'status',
        ];
      case "blogs":
        return [
          'cover',
          'name',
          'blurb',
          'type',
          'date_published',
          'status',
        ];
      case "gallery":
        return [
          'cover',
          'name',
          'type',
          'date_published',
          'status',
        ];
      case "admin":
        return [
          'avatar',
          'displayname',
          'username',
          'project_role',
          'status',
        ];
      case "users":
        return [
          'avatar',
          'displayname',
          'username',
          'project_role',
          'status',
        ];
      case "guests":
        return [
          'avatar',
          'displayname',
          'username',
          'project_role',
          'status',
        ];
      default:
        return [
          'id',
          'name',
          'slug',
        ];
    }
  }

  function cellType(key) {
    switch (key) {
      case 'cover':
      case 'thumbnail':
      case 'preview':
      case 'featured_media':
      case 'avatar':
        return 'image';
      case 'status':
        return 'status';
      case 'date_create':
      case 'date_updated':
      case 'date_published':
        return 'date';
      case 'updates':
      case 'volumes':
      case 'chapters':
      case 'contributors':
        return 'count';
      default:
        return 'auto';
    }
  }

  // Select/De-select for multi-edit
  let selectedItems = $state([]);

  function selectItem(id) {
    if (!id) return

    if (isSelected(id)) {
      const index = selectedItems.indexOf(id);
      selectedItems.splice(index, 1);
    } else {
      selectedItems.push(id);
    }
  }
  
  // Select/De-select for multi-edit
  function selectAllItems() {
    if (data?.length < 1) return;

    if (!isSelectedAll()) {
      for (const item of data) {
        if (!isSelected(item?.id)) {
          selectedItems.push(item?.id);
        }
      }
    } else {
      selectedItems = [];
    }
  }

  const isSelected = (id) => {
    return selectedItems.includes(id);
  }

  const isSelectedAll = () => {
    return selectedItems?.length === data?.length;
  }

  const getKeyName = () => {
    return Object.keys(object)
  };

</script>


<div class="table-wrap overflow-x-auto max-w-full">
  <table class="table">
    <thead>
      <tr class="uppercase text-xs tracking-wide">
        {#if canSelect}
          <th class="sticky left-0 top-0 bg-surface-50-950">
            <Input type="checkbox" onchange={()=>{selectAllItems()}} value={isSelectedAll()} />
          </th>
        {/if}
        {#each displayedLabels as item}
          <th class="text-center">{item.replaceAll("_", " ")}</th>
        {/each}
        {#if canView || canEdit || canDelete || canShare}
          <th class="sticky right-0 top-0 w-fit bg-surface-50-950 h-full text-center">
            Actions
            {#if canEdit && selectedItems?.length > 0}
              <Modal triggerClasses="btn btn-sm inline-flex preset-filled-surface-200-800 ">
                {#snippet trigger()}
                  Edit ({selectedItems?.length})
                {/snippet}
                {#snippet content()}
                  Form! :)
                {/snippet}
              </Modal>
            {/if}
          </th>
        {/if}
      </tr>
    </thead>
    <tbody class="[&>tr]:hover:bg-surface-100-900/40 overflow-x-auto">
      {#each data?.[dataType] as item}
      <tr class="font-medium">
        {#if canSelect}
          <td class="sticky left-0 top-0 bg-surface-50-950">
            <Input type="checkbox" value={isSelected(item?.id)} onchange={()=>{selectItem(item?.id)}} />
          </td>
        {/if}
        {#each displayedLabels as key}
          <td class="truncate max-w-40">
            {#if cellType(key) === 'image'}
              <Image
                src="/api/media/{item?.[key]?.filename_disk}"
                wrapperClasses="aspect-1 size-16! bg-surface-500 overflow-hidden border pattern-checker rounded-md"
                class="min-h-full w-auto object-cover {item?.[key]?.filename_disk ? '' : 'hidden'}"
              />
            {:else if cellType(key) === 'status'}
              <Status status={item?.[key]} />
            {:else if cellType(key) === 'date'}
              <span class="text-nowrap" title={formatDateLonger(item?.[key])}>
                {formatDate(item?.[key])}
              </span>
            {:else if cellType(key) === 'count'}
              {fallback([item?.[key]?.length, "0"])}
            {:else if item?.[key] !== null && typeof item?.[key] === 'object'}
              <span class="text-nowrap" title={fallback([item?.[key]?.name, item?.[key]?.slug, item?.[key]?.id, 'N/A'])}>
                {fallback([item?.[key]?.name, item?.[key]?.slug, item?.[key]?.id, 'N/A'])}
              </span>
            {:else}
              <span class="text-nowrap" title={fallback([item?.[key], 'N/A'])}>
                {fallback([item?.[key], 'N/A'])}
              </span>
            {/if}
          </td>
        {/each}
        {#if canView || canEdit || canDelete || canShare}
          <td class="sticky right-0 top-0 w-fit bg-surface-50-950">
            <div class="flex h-full gap-1 items-center">
              {#if canView}
              <a aria-label="View {item?.name}" title="View {item?.name}" href={getPermalink(dataType, item, page.url.origin)?.view} target="_blank" class="size-8 flex items-center justify-center bg-surface-200-800 hover:bg-surface-300-700 rounded-md"><i class="ph-bold ph-eye"></i></a>
              {/if}
              {#if canEdit}
              <a aria-label="Edit {item?.name}" title="Edit {item?.name}" href={getPermalink(dataType, item, page.url.origin)?.edit} class="size-8 flex items-center justify-center bg-surface-200-800 hover:bg-surface-300-700 rounded-md"><i class="ph-bold ph-pencil"></i></a>
              {/if}
              {#if canShare}
              <ShareButton label={item?.name} title="Share {item?.name}" value={getPermalink(dataType, item, page.url.origin)?.share} />
              {/if}
              {#if canDelete}
              <DeleteConfirm
                id={item?.id}
                title={item?.name}
                name={item?.name}
                formAction={deleteAction}
                class="size-8! flex items-center justify-center"
                small
              />
              {/if}
            </div>
          </td>
        {/if}
      </tr>
      {/each}
    </tbody>
  </table>
</div>
<script>
  import MediaBlockEditor from "./MediaBlockEditor.svelte";

  let {
    item,
    accept,
    onChange,
    onRemove,
    multiple,
    previewClasses
  } = $props();

  const types = [
    'media',
    // 'text',
    'video-embed'
  ];

  let styles = $derived.by(()=>{
    let css = `<style>
    .${item?.id} {
      ${item?.css}
    } </style>`;

    return css;
  });

</script>

<svelte:head>
  {@html styles}
</svelte:head>

<div class="overflow-hidden grid grid-cols-[auto_2fr_max-content] items-center gap-1">

  <div class="aspect-2/1 max-w-32 overflow-hidden grid place-content-center {item?.type === 'text' || item?.type === 'video-embed' ? 'bg-surface-100-900' : 'pattern-checker'} {previewClasses}">
    {#if item.type === 'text'}
      <i class="ph-bold ph-text-aa text-xl {previewClasses}"></i>
    {:else if item.type === 'video-embed'}
      <i class="ph-bold ph-video text-xl"></i>
    {:else}
      {#if item?.media && item?.media != '' ? item?.media?.type?.startsWith('image/') : false}
        <img src="/api/media/{item?.media && item?.media != '' ? item?.media?.filename_disk : ''}" alt={item?.media && item?.media != '' ? item?.media?.alt : ''} title={item?.hoverText} class="block max-w-full max-h-full {item?.id}">
      {/if}
    {/if}
  </div>

  <div class="w-full h-fit p-2 grid grid-cols-1 *:leading-none overflow-hidden">
    <p class="text-xs font-medium uppercase text-primary-500">{item?.type}</p>
    <p class="font-bold truncate" title={item?.media?.title ?? ''}>{item?.media && item?.media != '' ? item?.media?.title : ''}</p>
    {#if item?.hoverText}
    <p class="text-sm italic truncate" title={item?.hoverText ?? ''}>Hover text: {item?.hoverText}</p>
    {/if}
    <p class="font-mono font-semibold text-xs truncate inline-flex items-center gap-2">Custom CSS: <i class="text-base ph-bold ph-{item?.css && item?.css != '' ? 'check text-success-500' : 'x text-error-500'}"></i></p>
  </div>


  <div class="flex gap-2 p-4">
    <MediaBlockEditor {accept} {item} {onChange} triggerClasses="size-8" />
    <button type="button" aria-label="Remove {item.title}" class="btn size-8 preset-filled-error-300-700" onclick={onRemove}><i class="ph-bold ph-trash"></i></button>
  </div>

</div>

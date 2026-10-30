<script>
  // Components
  import FileSelector from "$lib/components/Admin/Inputs/FileSelector.svelte";
  import FileUploader from "$lib/components/Admin/FileUploader.svelte";
  import NotFound from "$lib/components/Placeholders/NotFound.svelte";
  import Input from "../Input.svelte";
  import VideoEmbed from "../VideoEmbed.svelte";
  import MarkdownEditor from "../MarkdownEditor.svelte";

  // Skeleton UI components
  import { Modal } from "@skeletonlabs/skeleton-svelte";

  // Props
  let {
    item,
    onChange,
    triggerClasses
  } = $props();

  // Block type options
  const types = ['media', 'text', 'video-embed'];

  // Modal state
  let open = $state(false);

  // Build media type
  function setMedia(media) {
    return {
      alt: media?.alt,
      filename_download: media?.filename_download,
      filename_disk: media?.filename_disk,
      type: media?.type,
      width: media?.width,
      height: media?.height,
    }
  }

  // Build embed type
  function setEmbed(url, autoplay) {
    return {
      url,
      autoplay: autoplay === 'on'
    }
  }

  // Build prose type
  function setProse(media) {
    return {
      body: media
    }
  }
</script>

<Modal
  {open}
  onOpenChange={(e)=>{open = !open}}
  triggerClasses="btn preset-filled-surface-500 {triggerClasses}"
  triggerAriaLabel="Edit {item?.name}"
  contentClasses="max-h-[calc(100dvh-2rem)] border border-surface-300-700 w-full max-w-[calc(100vw-2rem)] md:max-w-3xl shadow-xl shadow-surface-950/10 bg-surface-50-950 p-6 rounded-lg overflow-y-auto space-y-2"
>
  {#snippet trigger()}
    <i class="ph-bold ph-pencil-line"></i>
  {/snippet}
  {#snippet content()}
    <label>
      Type
      <select value={item.type} onchange={e => onChange({ ...item, type: e.target.value, media: "" })} class="select">
        {#each types as t}
          <option value={t}>{t}</option>
        {/each}
      </select>
    </label>

    {#if item.type === 'text'}
      <MarkdownEditor label="Prose Text" maxHeight="max-h-80" value={item?.media?.body} onChange={e => onChange({ ...item, media: setProse(e.target.value) })} />
    {:else if item.type === 'video-embed'}
      <Input type="text" label="Embed URL" value={item?.media?.url} onchange={e => onChange({ ...item, media: setEmbed(e.target.value, item?.media?.autoplay) })} />
      <Input type="checkbox" label="Autoplay" value={item?.media?.autoplay} class="flex items-center gap-2" onchange={e => onChange({ ...item, media: setEmbed(item?.media?.url, e.target.checked) })} />
      <VideoEmbed src={item?.media?.url} class={item?.id} />
    {:else}
      <label>
        Media
        <div class="flex">
          <FileSelector onAddFile={(e) => onChange({ ...item, media: setMedia(e)})} />
          <FileUploader onUploadComplete={(e) => onChange({ ...item, media: setMedia(e)})} />
        </div>
        {#if item?.media}
          {#if item?.media?.type?.startsWith('image/')}
            <img src="/api/media/{item?.media?.filename_disk}" alt={item?.media && item?.media != '' ? item?.media?.alt : ''} title={item?.hoverText} class="block max-w-full max-h-full {item?.id}">
          {/if}
        {:else}
        <NotFound label="No media added." />
        {/if}
      </label>
    {/if}

    <Input type="text" label="Hover Text" value={item.hoverText} onchange={e => onChange({ ...item, hoverText: e.target.value })} />

    <Input type="textarea" label="Custom CSS" placeholder="filter: blur(1rem);" inputClasses="max-h-80!" value={item.css} onchange={e => onChange({ ...item, css: e.target.value })} />

    <!-- Controls (don't really do anything, just less confusing than having people click outside the modal.) -->
    <div class="">
      <button class="btn preset-filled-surface-300-700" onclick={open = !open}>Close</button>
    </div>
  {/snippet}
</Modal>

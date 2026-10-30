<script>

  // Svelte utility imports
	import { invalidateAll } from "$app/navigation";

  // Utility imports
  import { toastError, toastSuccess } from "$lib/utils/toast.js";
  import prettyBytes from 'pretty-bytes';

  // Component imports
  import BackButton from "$lib/components/Navigation/BackButton.svelte";
  import Form from '$lib/components/Forms/Form.svelte';
  import FormControls from '$lib/components/Forms/FormControls.svelte';
    import Input from "$lib/components/Admin/Inputs/Input.svelte";

  // Export props
  let { data } = $props();

  // Destructure server data
  let file = $derived(data?.file);
  let title = $derived(file?.title);
  let desc = $derived(file?.description);
  let filenameDownload = $derived(file?.filename_download);
  
  // Setup page loading state
  let loading = $state(false);

  // Detect changes in data to unlock buttons
  let changesExist = $derived(
    title != data?.file?.title ||
    desc != data?.file?.description ||
    filenameDownload != data?.file?.filename_download
  );

  // Keep data in sync
  $effect(()=>{
    title = data?.file?.title;
    desc = data?.file?.description;
    filenameDownload = data?.file?.filename_download;
  });

  // Handle form submission
  const handleSubmit = ({ formData }) => {
    // Addtional form data
    formData.append('id', data?.file?.id); // Append media files to the submitted form data.

    // Set loading state to prevent further form edits/submissions
    loading = true;

    // Await the server response
    return async ({ result }) => {
      // If we used the 'update' action
      if (result?.data?.success === true) {
        // If response contains success state return a success toast
        toastSuccess("File updated!");
        // Refresh all page data without reloading
        invalidateAll();
      } else {
        // Return error toast if response contains a fail state
        toastError("Error updating file:", result?.data?.error);
      }
      // Regardless of the result, set loading state to false to allow editing again.
      loading = false;
    };
  };

  // Discord all changes
  async function handleDiscard() {
    // Quickly set loading state
    loading = true;
    // Refresh page data to match server
    invalidateAll();
    // Unset loading state
    loading = false;
  }

</script>

<!-- Page container -->
<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto gap-2 sm:gap-4 grid grid-rows-[35vh_min-content_auto] overflow-hidden">
  <div class="gap-4 grid grid-rows-[min-content_auto]">
    <!-- Back button (same as browser back button) -->
    <BackButton class="md:w-fit" />
    <!-- Media preview and info -->
    <div class="gap-2 grid grid-rows-1 place-items-center relative border pattern-checker rounded-lg overflow-hidden">
      <!-- If media is an image -->
      {#if file?.type?.startsWith('image/')}
      <!-- Image Preview -->
      <img src="/api/media/{file?.filename_disk}" alt={desc} class="max-h-full max-w-full">
      
      <!-- If media is audio -->
      {:else if file?.type?.startsWith('audio/')}
      <!-- Audio Preview -->
      <audio src="/api/media/{file?.filename_disk}" preload="auto" controls></audio>

      <!-- If media is video -->
      {:else if file?.type?.startsWith('video/')}
      <!-- Video Preview -->
      <video src="/api/media/{file?.filename_disk}" controls></video>

      <!-- If media is anything else -->
      {:else}
      <p class="">Media type is unknown</p>

      {/if}
      <div class="absolute left-2 bottom-2 px-2 py-1 bg-surface-50-950 rounded-md">
        <p class="text-sm italic leading-none text-surface-700-300">{desc ?? 'No description provided...'}</p>
      </div>
    </div>
  </div>
  <!-- Info panel -->
  <div class="border border-surface-300-700 p-2 flex items-center gap-2 rounded-md">
    <!-- File name -->
    <p class="text-xs text-surface-700-300" title="File name (generated): {file?.filename_disk}"><i class="ph-bold ph-floppy-disk"></i> {file?.filename_disk}</p>
    <span class="vr min-h-4"></span>
    <!-- File mime type -->
    <p class="text-xs text-surface-700-300" title="File type: {file?.type}"><i class="ph-bold ph-file"></i> {file?.type}</p>
    <span class="vr min-h-4"></span>
    <!-- File size -->
    <p class="text-xs text-surface-700-300 flex items-center gap-1" title="File size: {prettyBytes(file?.filesize ?? 0)}"><i class="ph-bold ph-hard-drives"></i> {prettyBytes(file?.filesize ?? 0)}</p>
  </div>

  <!-- Update media form -->
  <!-- TODO: Create form component -->
  <Form
    action="/api/actions/media?/update"
    method="POST"
    enctype="multipart/form-data"
    onSubmit={handleSubmit}
    class="space-y-2 overflow-y-auto"
  >
    <!-- Input group -->
    <div class="grid md:grid-rows-1 md:grid-cols-[auto_auto_min-content] gap-4">
      <!-- Title (string/text) -->
      <Input type="text" label="Title" name="title" desc="A custom label." bind:value={title} />
      <!-- File name download (string/text) -->
      <Input type="readonly" label="Filename Download" name="filename_download" desc="A custom cosmetic name." bind:value={filenameDownload}>
        {#snippet tooltip()}
          <p class="">Eventually, you will be able to rename the file.</p>
        {/snippet}
      </Input>
    </div>

    <!-- Decription (string/text) -->
    <Input type="textarea" label="Alt Text" name="desc" desc="Accessibility text/description for images." bind:value={desc}>
      {#snippet tooltip()}
        <p class="">This text assists visually-impaired viewers by describing what the image contains.</p>
        <p class="text-warning-700-300">Avoid words like "image" in your alt text as screen readers already announce that the element is an image.</p>
        <p class="">Example (an image of...): <span class="font-semibold italic">"A butterfly landing on the soft petals of a sunflower."</span></p>
      {/snippet}
    </Input>

    {#snippet controls()}
      <FormControls id={data?.file?.id} title={title} canDelete deleteAction="/api?/deleteMedia" deleteUrl="/_cc_admin/media" {handleDiscard} />
    {/snippet}
  </Form>
</section>

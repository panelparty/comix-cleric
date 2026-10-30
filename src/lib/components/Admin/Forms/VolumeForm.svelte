<script>
  // Svelte utilities
  import { goto, invalidateAll } from '$app/navigation';

  // Utilities
  import { toastError, toastSuccess } from '$lib/utils/toast.js';
  import { appendData } from '$lib/utils/data/transform';
  import slugify from '@sindresorhus/slugify';
  import { dateHasPassed } from '$lib/utils/date';
  import { acceptedFileTypes, createZodValidator, slugSchema } from '$lib/utils/validation/schema';
  import { statusPost } from '$lib/utils/validation/options';

  // Components
  import Status from '$lib/components/Admin/Status.svelte';
  import DatePicker from '$lib/components/Admin/Inputs/DatePicker.svelte';
  import Form from '../../Forms/Form.svelte';
  import FormControls from '../../Forms/FormControls.svelte';
  import Input from '../Inputs/Input.svelte';
  import KeyboardControls from '$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte';
  import MarkdownEditor from '../Inputs/MarkdownEditor.svelte';

  // Props
  let {
    create,
    data
  } = $props();

  // Reactive data/variable assignment
  let id = $derived(data?.volume?.id);
  let status = $derived(data?.volume?.status ?? 'draft');
  let name = $derived(data?.volume?.name);
  let slug = $derived(data?.volume?.slug);
  let blurb = $derived(data?.volume?.blurb);
  let desc = $derived(data?.volume?.description);
  let cover = $derived(data?.volume?.cover);
  let dateReleased = $derived(data?.volume?.date_published ?? undefined);

  // Slug validation
  const validateSlug = createZodValidator(slugSchema);

  // Setup reactive variables to set schedule/update states.
  let canSchedule = $derived.by(()=>{return !dateHasPassed(dateReleased) ?? false});

  // Generate file previews
  function generatePreview(event) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = event.target.result;
    };
    reader.readAsDataURL(event.details.acceptedFiles[0]);
  }

  // Form submission logic
  const handleSubmit = ({ formData }) => { 
    appendData(formData, 'id', id);
    appendData(formData, 'status', cover?.id ?? cover);
    appendData(formData, 'cover', cover?.id ?? cover);

    return async ({ result, cookies }) => {
      if (result?.data?.success === true) {
        if (create) {
          const new_item = result?.data?.new_item;
          goto(`/_cc_admin/volumes/edit/${new_item?.id}`);
        } else {
          invalidateAll();
        }

        const actionUsed = result?.data?.action;

        if (actionUsed === 'draft') {
          toastSuccess(`Volume set as draft!`);
        } else if (actionUsed === 'scheduled') {
          toastSuccess(`Volume scheduled for ${dateReleased}!`);
        } else if (actionUsed === 'published') {
          toastSuccess(`Volume published!`);
        } else if (actionUsed === 'archived') {
          toastSuccess(`Volume archived!`);
        } else {
          toastSuccess(`Volume ${create ? 'created' : 'updated'}!`);
        }

      } else {
        toastError("Failed to update volume!", result?.data?.error);
      }
    };
  };

  // -- File handlers -- //
  // Set preview when uploading a new image.
  function handleCoverFile(file) {
    cover = file;
  };

  // Handles changing the date within the form when the DatePicker is updated.
  function handleChangeDate(newDate) {
    dateReleased = newDate;
  }

  // Reset changes
  function handleCancel() {
    invalidateAll();
  }

  // Allows the accordion to track which panels are open.
  // TODO: Rename to fit the section better.
  let value = $state([]);

  let formElement = $state();
</script>

<!-- Captures key events for the entire window instead of a focused element. -->
<KeyboardControls
  {formElement}
  save
/>

<Form
  action="/api/actions/volumes?/{create ? 'create' : 'update'}"
  method="POST"
  enctype="multipart/form-data"
  onSubmit={handleSubmit}
  class="relative px-4 pt-4  border border-surface-200-800 space-y-2 overflow-y-auto"
  bind:element={formElement}
>
  {#if !create}
  <!-- Status Select -->
  <Input type="select" name="status" label="Status" bind:value={status} options={statusPost} selected={0} inputClasses="w-full hidden">
    {#snippet tooltip()}
      <p class="leading-tight mb-4 font-bold">Status will deterimine the visibility of this update in your site.</p>
      <div class="space-y-2">
        <div class="text-surface-950-50 p-2 rounded-md bg-surface-100-900">
          <p class="font-black leading-none mb-1">Draft:</p>
          <p class="font-medium text-surface-800-200 leading-none">The item still needs editing or is awaiting manual publishing. Hidden from site.</p>
        </div>
        <div class="text-success-950-50 p-2 rounded-md bg-success-100-900">
          <p class="font-black leading-none mb-1 flex items-center gap-1">Scheduled:</p>
          <p class="font-medium text-success-800-200 leading-none">The item has a set publishing date in the future. Hidden from site.</p>
        </div>
        <div class="text-primary-950-50 p-2 rounded-md bg-primary-100-900">
          <p class="font-black leading-none mb-1">Published:</p>
          <p class="font-medium text-primary-800-200 leading-none">The item is available to be viewed on your site.</p>
        </div>
        <div class="text-warning-950-50 p-2 rounded-md bg-warning-100-900">
          <p class="font-black leading-none mb-1">Archived:</p>
          <p class="font-medium text-warning-800-200 leading-none">A non-draft item that needs to be removed from viewing, but kept for later use. Hidden from site.</p>
        </div>
      </div>
    {/snippet}
    <Status {status} />
  </Input>
  {/if}

  <!-- Update Title & Slug -->
  <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
    <!-- Update title input -->
    <Input type="text" required name="name" label="Title" bind:value={name} inputClasses="w-full" >
      {#snippet tooltip()}
        <p class="leading-tight font-bold">The canonical title of the update. Can contain spaces and special characters.</p>
      {/snippet}
    </Input>
    <!-- Slug input -->
    <Input type="text" required name="slug" label="Slug" bind:value={slug} class inputClasses="ig-input" wrapperClasses="input-group grid grid-cols-[auto_min-content]" oninput={validateSlug}>
      {#snippet tooltip()}
        <p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required and must be unique.</p>
        <p class="leading-tight font-bold">A slugified (URL-safe) unique identifier (generally of the title) used to look up a specific page, but you can choose any pattern you want, as long as it does not contain capital letters or special characters.</p>
        <p class="leading-tight font-bold">The attached button will generate or regenerate the slug from the provided Update Title.</p>
      {/snippet}
      <button aria-label="{slug ? 'Regenerate' : 'Generate'} slug" title="{slug ? 'Regenerate' : 'Generate'} slug" type="button" class="ig-btn h-full aspect-square preset-filled-surface-200-800 grid place-content-center p-0" onclick={()=>{slug = slugify(name ?? '')}}><i class="text-lg ph-bold ph-{slug ? 'arrows-clockwise' : 'magic-wand'}"></i></button>
    </Input>
  </div>

  <!-- Chapter Short Description + Preview -->
  <Input type="textarea" name="blurb" label="Blurb" rows={2} bind:value={blurb} inputClasses="w-full">
    {#snippet tooltip()}
      <p class="leading-tight font-bold text-warning-700-300">Markdown can be used to style this, but be aware that it will <span class="font-bold underline">not</span> render correctly on external link previews.</p>
      <p class="leading-tight font-bold">This is a shortened description of the update, or just to say something fun and silly! Usually no more than 2-3 sentences.</p>
    {/snippet}
  </Input>

  <!-- Full Description + Preview -->
  <MarkdownEditor bind:value={desc} label="Full Description" name="desc">
    {#snippet tooltip()}
      <p class="leading-tight font-bold text-warning-700-300">Image insertion, links, and styling controls will be available at launch. These currently have to be added by-hand.</p>
      <p class="leading-tight font-bold">This is a full description or "Creator Notes". It can contain Markdown formatted text and basically just be a full blog post if you want!</p>
    {/snippet}
  </MarkdownEditor>

  <!-- Preview Image Upload + Preview -->
  <Input type="media-import-simple" name="cover" label="Cover/Thumbnail" fetchTypes={["image"]} accept={[...acceptedFileTypes?.image]} bind:value={cover} inputClasses="w-full">
    {#snippet tooltip()}
      <p class="leading-tight font-bold">A single image in square or 4:5 aspect ratio (1800 x 2250px). Will be cropped to fit in the center automatically. The image is not altered.</p>
      <p class="text-warning-700-300 font-black underline">Max image size is 10,000 x 10,000 pixels.</p>
    {/snippet}
  </Input>

  <DatePicker
    name="date_published"
    bind:value={dateReleased}
    onValueChange={handleChangeDate}
  />

  {#snippet controls()}
    <FormControls
      useStatus
      {status}
      {canSchedule}
      canDelete={!create}
      deleteAction="/api/actions/volumes?/delete"
      deleteUrl="/_cc_admin/volumes"
      {id}
      title={name}
    />
  {/snippet}
</Form>

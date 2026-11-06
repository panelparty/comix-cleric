<script>
  // Svelte utilities
  import { goto, invalidateAll } from '$app/navigation';

  // Utilities
  import { toastError, toastSuccess } from '$lib/utils/toast.js';

  // Components
  import Status from '$lib/components/Admin/Status.svelte';
  import DatePicker from '$lib/components/Admin/Inputs/DatePicker.svelte';

  // Utilities
  import slugify from '@sindresorhus/slugify'; 
  import { dateHasPassed, formatDateLong } from '$lib/utils/date';
  import { fallback } from '$lib/utils/utils';
  import { acceptedFileTypes, createZodValidator, slugSchema } from '$lib/utils/validation/schema';
  import { statusPost } from '$lib/utils/validation/options';

  // Components
  import Form from '../../Forms/Form.svelte';
  import Input from '../Inputs/Input.svelte';
  import FormControls from '../../Forms/FormControls.svelte';
  import Loader from '$lib/components/Placeholders/Loader.svelte';
  import KeyboardControls from '$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte';
  import MarkdownEditor from '../Inputs/MarkdownEditor.svelte';

  // Props
  let {
    create,
    data
  } = $props();

  // Destructure server data
  let id = $derived(data?.chapter?.id); // Page ID - int (nullable)
  let status = $derived(data?.chapter?.status ?? 'draft'); // Page status - string - default `draft` - required
  let name = $derived(data?.chapter?.name); // Page title - string - nullable
  let slug = $derived(data?.chapter?.slug);  // Page URL slug - string(slug) - required
  let blurb = $derived(data?.chapter?.blurb); // Blurb (short description) - string(plaintext/Markdown)
  let desc = $derived(data?.chapter?.description); // Description - string(plaintext/Markdown)
  let cover = $derived(data?.chapter?.cover); // Cover Image/Preview - string(UUID/filename+ext)
  let date_published = $derived(data?.chapter?.date_published ?? undefined); // Date Published - string(Date)
  let series = $derived(data?.chapter?.series); // Parent Series - object
  let volume = $derived(data?.chapter?.volume?.id ?? (create ? data?.volumes[0]?.id : null)); // Parent Volume - string(UUID)
  let pages = $derived(data?.chapter?.pages); // Child Pages - array(relation object)

  // Loading state
  let loading = $state(false);

  // Slug validation
  const validateSlug = createZodValidator(slugSchema);

  // Sync `slug` with `title`
  $effect(()=>{
    if (slug === null) {// If the slug is null.
      slug = slugify(name ?? ''); // If `title` is `null`, replace with an empty string.
    }
  });

  // Setup reactive variables to set schedule/update states.
  let canSchedule = $derived.by(()=>{return !dateHasPassed(date_published) ?? false});

  // Generate file previews, code provided by Skeleton UI: https://www.skeleton.dev/docs/components/file-upload/svelte#image-previews
  function generatePreview(event) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = event.target.result;
    };
    reader.readAsDataURL(event.details.acceptedFiles[0]);
  }

  // Form submission logic
  const handleSubmit = ({ formData }) => { // `formData` is passed by the `use:enhance` attribute on the form element.
    // Set loading state
    loading = true;
    
    // Append missing form data
    formData.append('id', id);
    formData.append('cover', cover?.id);

    // Handle response
    return async ({ result }) => {
      if (result?.data?.success === true) {
        if (create) {
          const new_item = result?.data?.new_item;
          goto(`/_cc_admin/chapters/edit/${new_item?.id}`);
        } else {
          invalidateAll();
        }

        const actionUsed = result?.data?.action;
        let successMessage;

        switch (actionUsed) {
          case 'draft':
            successMessage = `Chapter set as draft!`;
            break;
          case 'scheduled':
            successMessage = `Chapter scheduled for ${formatDateLong(date_published)}!`;
            break;
          case 'published':
            successMessage = `Chapter published!`;
            break;
          case 'archived':
            successMessage = `Chapter archived!`;
            break;
          default:
            successMessage = `Chapter saved!`;
        }

        toastSuccess(successMessage);
      } else {
        toastError("Failed to update chapter!", result?.data?.error);
      }
      loading = false;
    };
  };

  // -- File handlers -- //
  // Set preview when uploading a new image.
  function handleCoverFile (file) {
    cover = file;
  };

  // Handles changing the date within the form when the DatePicker is updated.
  function handleChangeDate(newDate) {
    date_published = newDate; // Make sure we're updating the Date Published to the newly-chosen date.
  }

  // Force-reset back to original server copy. Almost like refreshing the page, but only reloading the data.
  async function handleCancel() {
    loading = true;
    await invalidateAll();
    loading = false;
  }

  // Allows the accordion to track which panels are open.
  // TODO: Rename to fit the section better.
  let value = $state([]);

  // Reference form
  let formElement = $state();
</script>

<!-- Captures key events for the entire window instead of a focused element. -->
<KeyboardControls
  {formElement}
  save
/>

<Form
  action="/api/actions/chapters?/{create ? 'create' : 'update'}"
  method="POST"
  enctype="multipart/form-data"
  onSubmit={handleSubmit}
  class="relative px-4 pt-4  border border-surface-200-800 space-y-2 overflow-y-auto"
  bind:element={formElement}
>
  <Loader {loading} />

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

  <Input type="select" name="volume" label="Volume" bind:value={volume} options={data?.volumes} optionValues="id" inputClasses="w-full">
    {#snippet tooltip()}
      <p class="leading-tight font-bold">Defaults to the most recent volume in the series. Mainly for categorizing.</p>
    {/snippet}
  </Input>

  <!-- Chapter Title & Slug -->
  <div class="w-full flex gap-2">
    <Input type="text" name="name" label="Title" required bind:value={name} >
      {#snippet tooltip()}
        <p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required.</p>
        <p class="leading-tight font-bold">The canonical title of the chapter. Can contain spaces and special characters.</p>
      {/snippet}
    </Input>

    <!-- Slug input -->
    <Input type="text" name="slug" label="Slug" required bind:value={slug} inputClasses="ig-input" wrapperClasses="input-group grid grid-cols-[auto_min-content]" oninput={validateSlug}>
      {#snippet tooltip()}
        <p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required and must be unique.</p>
        <p class="leading-tight font-bold">A slugified (URL-safe) unique identifier, generally of the title, used to look up a specific chapter, but you can choose any pattern you want, as long as it does not contain capital letters or special characters.</p>
        <p class="leading-tight font-bold">The attached button will generate or regenerate the slug from the provided Title.</p>
      {/snippet}
      <button aria-label="{slug ? 'Regenerate' : 'Generate'} slug" title="{slug ? 'Regenerate' : 'Generate'} slug" type="button" class="ig-btn h-full aspect-square preset-filled-surface-200-800 grid place-content-center p-0" onclick={()=>{slug = slugify(name ?? '')}}><i class="text-lg ph-bold ph-{slug ? 'arrows-clockwise' : 'magic-wand'}"></i></button>
    </Input>
  </div>

  <!-- Chapter Short Description + Preview -->
  <Input type="textarea" name="blurb" label="Blurb" rows={2} bind:value={blurb} inputClasses="w-full">
    {#snippet tooltip()}
      <p class="leading-tight font-bold">This is a shortened description of the chapter, or just to say something fun and silly! Usually no more than 2-3 sentences.</p>
      <p class="leading-tight font-bold text-warning-700-300">Markdown can be used to style this, but be aware that it will <span class="font-bold underline">not</span> render correctly on external link previews.</p>
    {/snippet}
  </Input>

  <!-- Chapter Main Description + Preview -->
  <MarkdownEditor bind:value={desc} label="Description" name="description" maxHeight="max-h-screen">
    {#snippet tooltip()}
      <p class="leading-tight font-bold">This is a full description or "Creator Notes". It can contain Markdown formatted text and basically just be a full blog post if you want!</p>
    {/snippet}
  </MarkdownEditor>

  <!-- Cover Image Upload + Preview -->
  <Input type="media-import-simple" name="cover" label="Cover/Thumbnail" fetchTypes={["image"]} accept={[...acceptedFileTypes?.image]} bind:value={cover} inputClasses="w-full">
    {#snippet tooltip()}
      <p class="leading-tight font-bold">A single image in square or 4:5 aspect ratio (1800 x 2250px). Will be cropped to fit in the center automatically. The image is not altered.</p>
      <p class="text-warning-700-300 font-black underline">Max image size is 10,000 x 10,000 pixels.</p>
    {/snippet}
  </Input>

  <div class="space-y-1">
    <DatePicker
      name="date_published"
      bind:value={date_published}
      onValueChange={handleChangeDate}
    >
      {#snippet tooltip()}
        <p class="leading-tight font-bold">The date the post was originally published or the date it should be published.</p>
        <p class="leading-tight font-bold">You can back-date old posts or schedule new ones!</p>
      {/snippet}
    </DatePicker>
  </div>

  {#snippet controls()}
    <FormControls
      useStatus
      {status}
      {canSchedule}
      canDelete={!create}
      deleteAction="/api/actions/chapters?/delete"
      deleteUrl="/_cc_admin/chapters"
      {id}
      title={fallback([name, slug])}
      name={fallback([name, slug])}
    />
  {/snippet}
</Form>

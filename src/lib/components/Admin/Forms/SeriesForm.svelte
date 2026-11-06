<script>
  // Svelte built-in utility imports
  import { invalidateAll } from '$app/navigation';

  // Utilities
  import { toastError, toastSuccess } from '$lib/utils/toast.js';
  import { acceptedFileTypes, createZodValidator, slugSchema } from '$lib/utils/validation/schema';
  import { appendData } from '$lib/utils/data/transform';
  import slugify from '@sindresorhus/slugify';
  import { dateHasPassed } from '$lib/utils/date';
  import { statusPost } from '$lib/utils/validation/options';
  
  // Components
  import Loader from '$lib/components/Placeholders/Loader.svelte';
  import Form from '../../Forms/Form.svelte';
  import Input from '../Inputs/Input.svelte';
  import KeyboardControls from '$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte';
  import FormControls from '../../Forms/FormControls.svelte';
  import ContributorManager from './ContributorSelect/ContributorManager.svelte';
  import FaviconPreview from '../FaviconPreview.svelte';
  import Status from '$lib/components/Admin/Status.svelte';
  import DatePicker from '$lib/components/Admin/Inputs/DatePicker.svelte';
  import MarkdownEditor from '../Inputs/MarkdownEditor.svelte';

  // Props
  let {
    create,
    data
  } = $props();

  // Reactive data/variable assignment
  let id = $derived(data?.series?.id);
  let status = $derived(data?.series?.status ?? 'draft');
  let name = $derived(data?.series?.name);
  let slug = $derived(data?.series?.slug);
  let blurb = $derived(data?.series?.blurb);
  let desc = $derived(data?.series?.description);
  let logo = $derived(data?.series?.logo);
  let cover = $derived(data?.series?.cover);
  let favicon = $derived(data?.series?.favicon);
  let contributors =  $derived(data?.contributors ?? "[]");
  let dateReleased = $derived(data.series.date_published ?? undefined);
  let seriesCount = $derived(data?.seriesCount);
  
  // Slug validation
  const validateSlug = createZodValidator(slugSchema);
  
  // Loading state
  let loading = $state(false);

  // Check for changes
  let hasChanged = $derived.by(() => {
    if ( // If any of these values do not match...
      name != data?.series?.name || // string (plaintext)
      slug != data?.series?.slug || // type string (slug)
      blurb != data?.series?.blurb || // string (Markdown)
      desc != data?.series?.description || // string (Markdown)
      logo != data?.series?.logo || // string (filename)
      cover != data?.series?.cover ||
      favicon != data?.series?.favicon ||
      contributors != data?.contributors ||
      dateReleased != data?.series?.date_published // string (Date)
    ) {
      return true; // Changes exist.
    } else { // Otherwise...
      return false; // Changes do not exist.
    }
  });

  // Setup reactive variables to set schedule/update states.
  let canSchedule = $derived.by(()=>{return !dateHasPassed(dateReleased) ?? false});
  let canUpdate = $derived.by(()=>{ hasChanged ?? false });

  // Form submission logic
  const handleSubmit = ({ formData }) => { // `formData` is passed by the `use:enhance` attribute on the form element.
    loading = true;

    appendData(formData, 'id', id);
    appendData(formData, 'logo', logo?.id ?? logo);
    appendData(formData, 'favicon', favicon?.id ?? favicon);
    appendData(formData, 'cover', cover?.id ?? cover);

    // Send contributor IDs only server handles the diff against Blog_Contributors
    appendData(formData, 'contributors', contributors);

    // Once we get a response from the server...
    return async ({ result, cookies }) => {
      if (result?.data?.success === true) { // If the result did not return an `error` in the response object...
        invalidateAll(); // Force-refresh all page data to ensure we are getting the latest server data.
        toastSuccess(`Series ${create ? 'created' : 'updated'}!`); // ...display a generic success toast for creating/updating the page.
      } else { // Otherwise...
        toastError("Failed to update series details!", result?.data?.error); // ...display an error toast with the error from the response.
      }
      loading = false;
    };
  };

  // -- File handlers -- //
  // Generate file previews, code provided by Skeleton UI: https://www.skeleton.dev/docs/components/file-upload/svelte#image-previews
  function generatePreview(event) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = event.target.result;
    };
    reader.readAsDataURL(event.details.acceptedFiles[0]);
  }

  // Set preview when uploading a new image.
  function handleLogoFile(file) {
    logo = file;
  };

  // Set preview when selecting a new image from the media library.
  function handleCoverFile(file) {
    cover = file; // Replace our preview image with the selected file.
  }

  // Handles changing the date within the form when the DatePicker is updated.
  // TODO: Probably redundant, but it exists.
  function handleChangeDate(newDate) {
    dateReleased = newDate; // Make sure we're updating the Date Published to the newly-chosen date.
  }

  // Force-reset back to original server copy. Almost like refreshing the page, but only reloading the data.
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
  action="/api/actions/series?/{create ? 'create' : 'update'}"
  method="POST"
  enctype="multipart/form-data"
  onSubmit={handleSubmit}
  bind:element={formElement}
  class="space-y-2 overflow-y-auto"
>
  {#if !create}
  <!-- Status Select -->
  <Input type="select" name="status" label="Status" bind:value={status} options={statusPost} selected={0} inputClasses="hidden">
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

  <!-- Logo Image Upload + Preview -->
  <Input
    type="media-import-simple"
    name="logo"
    label="Logo"
    bind:value={logo}
    fetchTypes={["image"]}
    accept={[...acceptedFileTypes?.image]}
  >
    {#snippet tooltip()}
      <p class="">The series logo. If an image is present, it is used as the main app logo when this series is active.</p>
      <p class="text-warning-700-300">Max image size is 10,000 x 10,000 pixels.</p>
    {/snippet}
  </Input>

  <!-- Favicon Image Upload + Preview -->
  <Input
    type="media-import-simple"
    name="favicon"
    label="Favicon"
    bind:value={favicon}
    fetchTypes={["image"]}
    accept={[...acceptedFileTypes?.image]}
  >
    {#snippet tooltip()}
      <p class="">A custom favicon that will display when this series is active. If you don't want your favicon to change based on series, do not set this field.</p>
      <p class="text-warning-700-300">Max image size is 10,000 x 10,000 pixels.</p>
    {/snippet}
    {#snippet preview()}
      <!-- Custom previews for Favicon -->
      <FaviconPreview img={favicon} />
    {/snippet}
  </Input>

  <!-- Cover Image Upload + Preview -->
  <Input
    type="media-import-simple"
    name="cover"
    label="Cover/Thumbnail"
    bind:value={cover}
    fetchTypes={["image"]}
    accept={[...acceptedFileTypes?.image]}
  >
    {#snippet tooltip()}
      <p class="">The series cover/thumbnail. If present, it is used as a fallback image for any updates in the series.</p>
      <p class="text-warning-700-300">Max image size is 10,000 x 10,000 pixels.</p>
    {/snippet}
  </Input>

  <!-- Series Title & Slug -->
  <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
    <!-- Series title input -->
    <Input type="text" name="name" label="Title" bind:value={name} required inputClasses="w-full" >
      {#snippet tooltip()}
        <p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required.</p>
        <p class="leading-tight font-bold">The canonical title of the series. Can contain spaces and special characters.</p>
      {/snippet}
    </Input>

    <!-- Slug input -->
    <Input type="text" name="slug" label="Slug" bind:value={slug} required class inputClasses="ig-input" wrapperClasses="input-group grid grid-cols-[auto_min-content]" oninput={validateSlug}>
      {#snippet tooltip()}
        <p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required and must be unique.</p>
        <p class="leading-tight font-bold">A slugified (URL-safe) unique identifier (generally of the title) used to look up this item. You can choose any pattern you want, but it must only contain letters, numbers, and hyphens.</p>
        <p class="leading-tight font-bold">The attached button will generate or regenerate the slug from the provided Title.</p>
      {/snippet}
      <button aria-label="{slug ? 'Regenerate' : 'Generate'} slug" title="{slug ? 'Regenerate' : 'Generate'} slug" type="button" class="ig-btn h-full aspect-square preset-filled-surface-200-800 grid place-content-center p-0" onclick={()=>{slug = slugify(name ?? '')}}><i class="text-lg ph-bold ph-{slug ? 'arrows-clockwise' : 'magic-wand'}"></i></button>
    </Input>
  </div>

  <!-- Page Short Description + Preview -->
  <Input type="textarea"  name="blurb" label="Blurb" bind:value={blurb}>
    {#snippet tooltip()}
      <p class="leading-tight font-bold text-warning-700-300">Markdown can be used to style this, but be aware that it will <span class="font-bold underline">not</span> render correctly on external link previews.</p>
      <p class="leading-tight font-bold">This is a shortened description, or just to say something fun and silly! Usually no more than 2-3 sentences.</p>
    {/snippet}
  </Input>

  <!-- Page Main Description + Preview -->
  <MarkdownEditor bind:value={desc} label="Description" name="desc">
    {#snippet tooltip()}
      <p class="leading-tight font-bold text-warning-700-300">Image insertion, links, and styling controls will be available at launch. These currently have to be added by-hand.</p>
      <p class="leading-tight font-bold">This is a full description or "Creator Notes". It can contain Markdown formatted text and basically just be a full blog post if you want!</p>
    {/snippet}
  </MarkdownEditor>

  <ContributorManager name="contributors" initialValue={contributors} multiple maxUsers={128} />

  <DatePicker
    name="date_published"
    bind:value={dateReleased}
    onValueChange={handleChangeDate}
  >
    {#snippet tooltip()}
      <p class="leading-tight font-bold">The date the series was originally published or the date it should be published.</p>
      <p class="leading-tight font-bold">You can back-date old series!</p>
    {/snippet}
  </DatePicker>

  <Loader {loading} />

  {#snippet controls()}
    <FormControls
      useStatus
      {status}
      {canSchedule}
      canDelete={!create && seriesCount > 1}
      deleteAction="/api/actions/series?/delete"
      {id}
      title={name}
      {name}
    />
  {/snippet}
</Form>
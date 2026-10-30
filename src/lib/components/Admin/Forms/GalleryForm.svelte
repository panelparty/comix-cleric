<script>
  // Svelte utilities
  import { goto, invalidateAll } from '$app/navigation';
  
  // Utilities
  import { toastError, toastSuccess } from '$lib/utils/toast.js'; // Import toast presets so you don't need to rebuild the internal functionality each time.
  import { acceptedFileTypes, createZodValidator, slugSchema } from '$lib/utils/validation/schema';
  import { fromPairs, toPairs, orderBy, cloneDeep } from 'lodash-es'; // For advanced object manipulation.
  import { appendData } from '$lib/utils/data/transform';
  import { dateHasPassed } from '$lib/utils/date';
  import { statusPost } from '$lib/utils/validation/options';
  import slugify from '@sindresorhus/slugify';
  
  // Components
  import Status from '$lib/components/Admin/Status.svelte';
  import DatePicker from '../Inputs/DatePicker.svelte';
  import TooltipInfo from '../../Display/TooltipInfo.svelte';
  import Form from '../../Forms/Form.svelte';
  import FormControls from '../../Forms/FormControls.svelte';
  import Input from '../Inputs/Input.svelte';
  import MediaBlockContainer from '../Inputs/MediaBlock/MediaBlockContainer.svelte';
  import ContributorManager from './ContributorSelect/ContributorManager.svelte';
  import KeyboardControls from '$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte';
  import MarkdownEditor from '../Inputs/MarkdownEditor.svelte';

  // Props
  let {
    create,
    data
  } = $props();

  // Reactive data/variable assignment
  let id = $derived(data?.gallery?.id); // Page ID - int (nullable)
  let status = $derived(data?.gallery?.status ?? 'draft'); // Page status - string - default `draft` - required
  let type = $derived(data?.gallery?.type ?? null); // Page title - string - nullable
  let name = $derived(data?.gallery?.name ?? ''); // Page title - string - nullable
  let slug = $derived(data?.gallery?.slug ?? '');  // Page URL slug - string(slug) - required
  let blurb = $derived(data?.gallery?.blurb ?? ''); // Blurb (short description) - string(plaintext/Markdown)
  let desc = $derived(data?.gallery?.description ?? ''); // Description - string(plaintext/Markdown)
  let cover = $derived(data?.gallery?.cover); // Cover Image/Preview - string(UUID/filename+ext)
  let featuredMedia = $derived(data?.gallery?.featured_media ?? "[]"); // Cover Image/Preview - string(UUID/filename+ext)
  let additionalMedia = $derived(data?.gallery?.additional_media ?? "[]"); // Comic Page Images/Media - array(relation object)
  let contributors = $derived(data?.contributors ?? []); // Page title - string - nullable
  let creditLink = $derived(data?.gallery?.credit_link ?? ''); // Page title - string - nullable
  let dateReleased = $derived(data?.gallery?.date_published ?? undefined); // Date Published - string(Date)

  // Gallery Categories
  let categories = $derived(data?.categories);

  // Media files
  let mediaFiles = $state([]); // Stores all media files for the page.
  let newFiles = $state([]); // Stores new media files imported/uploaded.
  let selectedMediaFile = $state(); // Stores the index of the selected/highlighted media item.

  // Slug validation
  const validateSlug = createZodValidator(slugSchema);

  // Sync `slug` with `title`
  $effect(()=>{
    if (slug === null) {// If the slug is null.
      slug = slugify(name ?? ''); // If `title` is `null`, replace with an empty string.
    }
  });

  // Setup reactive variables to set schedule/update states.
  let canSchedule = $derived.by(()=>{return !dateHasPassed(dateReleased) ?? false});

  // Allows easier sorting of objects, defaults to ascending order.
  // TODO: Should be moved to a utility file.
  function sortObject(obj, key, order = 'asc') {
    return fromPairs(
      orderBy(toPairs(obj), pair => pair[1][key], [order])
    );
  }

  // -- Item sorting controls -- //
  // Base movement function.
  function moveItem(array, fromIndex, toIndex) {
    const newArray = cloneDeep(array);
    const [item] = newArray.splice(fromIndex, 1);
    newArray.splice(toIndex, 0, item);
    return newArray;
  }

  function moveUp(array, index) {
    const newIndex = index - 1
    selectedMediaFile = newIndex
    return moveItem(array, index, newIndex);
  }

  function moveDown(array, index) {
    const newIndex = index + 1
    selectedMediaFile = newIndex
    return moveItem(array, index, newIndex);
  }

  function moveTop(array, index) {
    const newIndex = 0
    selectedMediaFile = newIndex
    return moveItem(array, index, newIndex);
  }

  function moveBottom(array, index) {
    const newIndex = array.length - 1
    selectedMediaFile = newIndex
    return moveItem(array, index, newIndex);
  }

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
    formData.append('id', id); // Append preview file to submitted form data.
    formData.append('cover', cover?.id); // Append preview file to submitted form data.

    appendData(formData, 'contributors', contributors);

    // Once we get a response from the server...
    return async ({ result, cookies }) => {
      if (result?.data?.success === true) { // If the result did not return an `error` in the response object...
        if (create) { // ...and, if the component is set to `create` mode...
          const new_item = result?.data?.new_item; // ...set a constant equal to the new page data.
          goto(`/_cc_admin/gallery/edit/${new_item?.id}`); // Then, take us to the `edit` page for the page we just created.
        } else { // Otherwise...
          invalidateAll(); // Force-refresh all page data to ensure we are getting the latest server data.
        }

        const actionUsed = result?.data?.action; // Assign a constant to whatever "action" was used to submit the form.

        if (actionUsed === 'draft') { // If the action was `draft`...
          toastSuccess(`Gallery item set as draft!`); // ...display a success toast for `draft`.
        } else if (actionUsed === 'scheduled') { // If the action was otherwise `scheduled`...
          toastSuccess(`Gallery item scheduled for ${dateReleased}!`); // ...display a success toast for `scheduled` with the scheduled date.
        } else if (actionUsed === 'published') { // If the action was otherwise `published`...
          toastSuccess(`Gallery item published!`); // ...display a success toast for `published`.
        } else if (actionUsed === 'archived') { // If the action was otherwise `archived`...
          toastSuccess(`Gallery item archived!`); // ...display a success toast for `archived`.
        } else { // Otherwise...
          toastSuccess(`Gallery item ${create ? 'created' : 'updated'}!`); // ...display a generic success toast for creating/updating the page.
        }

      } else { // Otherwise...
        toastError("Failed to update gallery item!", result?.data?.error); // ...display an error toast with the error from the response.
      }
    };
  };

  // Set preview when selecting a new image from the media library.
  function handleCoverFile(selectedFile) {
    cover = selectedFile; // Replace our preview image with the selected file.
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
  action="/api/actions/gallery?/{create ? 'create' : 'update'}"
  method="POST"
  enctype="multipart/form-data"
  onSubmit={handleSubmit}
  bind:element={formElement}
  class="space-y-2 overflow-y-auto"
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

  <Input type="select" name="type" label="Category" bind:value={type} options={categories} optionValues="id" >
    {#snippet tooltip()}
      <p class="">Please add info.</p>
    {/snippet}
  </Input>

  <!-- Update Title & Slug -->
  <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
    <!-- Update title input -->
    <Input type="text" name="name" label="Title" required bind:value={name} inputClasses="w-full" >
      {#snippet tooltip()}
        <p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required.</p>
        <p class="leading-tight font-bold">The canonical title of the update. Can contain spaces and special characters.</p>
      {/snippet}
    </Input>
    <!-- Slug input -->
    <Input type="text" name="slug" label="Slug" required bind:value={slug} class inputClasses="ig-input" wrapperClasses="input-group grid grid-cols-[auto_min-content]" oninput={validateSlug}>
      {#snippet tooltip()}
        <p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required and must be unique.</p>
        <p class="leading-tight font-bold">A slugified (URL-safe) unique identifier (generally of the title) used to look up a specific page, but you can choose any pattern you want, as long as it does not contain capital letters or special characters.</p>
        <p class="leading-tight font-bold">The attached button will generate or regenerate the slug from the provided Update Title.</p>
      {/snippet}
      <button aria-label="{slug ? 'Regenerate' : 'Generate'} slug" title="{slug ? 'Regenerate' : 'Generate'} slug" type="button" class="ig-btn h-full aspect-square preset-filled-surface-200-800 grid place-content-center p-0" onclick={()=>{slug = slugify(name ?? '')}}><i class="text-lg ph-bold ph-{slug ? 'arrows-clockwise' : 'magic-wand'}"></i></button>
    </Input>
  </div>

  <!-- Gallery Short Description + Preview -->
  <Input type="textarea" name="blurb" label="Blurb" rows={2} bind:value={blurb} inputClasses="w-full">
    {#snippet tooltip()}
      <p class="leading-tight font-bold">This is a shortened description of the update, or just to say something fun and silly! Usually no more than 2-3 sentences.</p>
    {/snippet}
  </Input>

  <!-- Gallery Description + Preview -->
  <MarkdownEditor bind:value={desc} label="Description" name="desc">
    {#snippet tooltip()}
      <p class="leading-tight font-bold">This is a full description or "Creator Notes". It can contain Markdown formatted text and basically just be a full blog post if you want!</p>
    {/snippet}
  </MarkdownEditor>

  <!-- Preview Image Upload + Preview -->
  <Input type="media-import-simple" fetchTypes={["image"]} accept={[...acceptedFileTypes?.image]} bind:value={cover} label="Thumbnail">
    {#snippet tooltip()}
      <p class="">A preview image for this gallery item.</p>
      <p class="text-warning-700-300 font-black underline">Max image size is 10,000 x 10,000 pixels.</p>
    {/snippet}
  </Input>

  <!-- Featured Media -->
  <div class="space-y-1">
    <div class="flex items-center gap-1">
      <label for="featured-media" class="text-sm ml-1">Featured Media</label>
      <TooltipInfo ariaLabel="Featured Media Field Information">
        <p class="leading-tight font-bold">Up to 999 images. Will automatically scale to the same width as other images without altering the file.</p>
        <p class="text-warning-700-300 font-black underline">Max image size is 10,000 x 10,000 pixels.</p>
      </TooltipInfo>
    </div>
    <div class="grid grid-cols-1">
      <MediaBlockContainer name="featured-media" initialValue={JSON.parse(featuredMedia)} multiple maxFiles={999} accept={'image/*'} preview />
    </div>
  </div>

  <!-- Additional Media -->
  <!-- <div class="space-y-1">
    <div class="flex items-center gap-1">
      <label for="additional-media" class="text-sm ml-1">Additional Media</label>
      <TooltipInfo ariaLabel="Featured Media Field Information">
        <p class="leading-tight font-bold">Up to 128 images, any size. Will automatically scale to the same width as other images without altering the file.</p>
      </TooltipInfo>
    </div>
    <div class="grid grid-cols-1">
      <MediaBlockContainer name="additional-media" initialValue={JSON.parse(additionalMedia)} multiple maxFiles={128} accept={'image/*'} preview />
    </div>
  </div> -->

  <ContributorManager name="contributors" initialValue={contributors} multiple maxUsers={128} />

  <hr class="hr">

  <div class="space-y-1">
    <DatePicker
      name="date-released"
      bind:value={dateReleased}
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
      deleteAction="/api/actions/gallery?/delete"
      deleteUrl="/_cc_admin/gallery"
      {id}
      title={name}
    />
  {/snippet}

</Form>

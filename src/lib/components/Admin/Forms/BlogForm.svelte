<script>
  // Svelte utility imports
  import { goto, invalidateAll } from '$app/navigation';
  
  // Utilities
  import { toastError, toastSuccess } from '$lib/utils/toast.js';
  import slugify from '@sindresorhus/slugify';
  import { dateHasPassed } from '$lib/utils/date';
  import { acceptedFileTypes, createZodValidator, slugSchema } from '$lib/utils/validation/schema';
  import { statusPost } from '$lib/utils/validation/options';

  // Component imports
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
  
  // Data destructuring
  let blog = $derived(data?.blog);
  let types = $derived(data?.types);
  let id = $derived(blog?.id);
  let status = $derived(blog?.status ?? statusPost?.[0]?.value);
  let type = $derived(types[0]?.id ?? blog?.type?.id);
  let title = $derived(blog?.name ?? '');
  let slug = $derived(blog?.slug ?? '');
  let blurb = $derived(blog?.blurb ?? '');
  let body = $derived(blog?.body ?? '');
  let cover = $derived(blog?.cover);
  let date_published = $derived(blog?.date_published ?? undefined);

  // Slug validation
  const validateSlug = createZodValidator(slugSchema);

  // State management
  let canSchedule = $derived.by(()=>{return !dateHasPassed(date_published) ?? false});

  // Form submit handler
  const handleSubmit = ({ formData }) => {
    // Append fields
    formData.append('id', id);
    formData.append('cover', cover?.id);

    // Once we get a response from the server...
    return async ({ result, cookies }) => {
      if (result?.data?.success === true) { // If the result did not return an `error` in the response object...
        if (create) { // ...and, if the component is set to `create` mode...
          const new_item = result?.data?.new_item; // ...set a constant equal to the new page data.
          goto(`/_cc_admin/blogs/edit/${new_item?.id}`); // Then, take us to the `edit` page for the page we just created.
        } else { // Otherwise...
          invalidateAll(); // Force-refresh all page data to ensure we are getting the latest server data.
        }

        const actionUsed = result?.data?.action; // Assign a constant to whatever "action" was used to submit the form.

        if (actionUsed === 'draft') { // If the action was `draft`...
          toastSuccess(`Blog post set as draft!`); // ...display a success toast for `draft`.
        } else if (actionUsed === 'scheduled') { // If the action was otherwise `scheduled`...
          toastSuccess(`Blog post scheduled for ${date_published}!`); // ...display a success toast for `scheduled` with the scheduled date.
        } else if (actionUsed === 'published') { // If the action was otherwise `published`...
          toastSuccess(`Blog post published!`); // ...display a success toast for `published`.
        } else if (actionUsed === 'archived') { // If the action was otherwise `archived`...
          toastSuccess(`Blog post archived!`); // ...display a success toast for `archived`.
        } else { // Otherwise...
          toastSuccess(`Blog post ${create ? 'created' : 'updated'}!`); // ...display a generic success toast for creating/updating the page.
        }

      } else { // Otherwise...
        toastError("Failed to update blog post!", result?.data?.error); // ...display an error toast with the error from the response.
      }
    };
  };

  // Set preview when selecting a new image from the media library.
  function handleCoverFile(file) {
    cover = file;
  }

  // Handles changing the date within the form when the DatePicker is updated.
  // TODO: Probably redundant, but it exists.
  function handleChangeDate(newDate) {
    date_published = newDate;
  }

  // Force-reset back to original server copy. Almost like refreshing the page, but only reloading the data.
  function handleCancel() {
    invalidateAll();
  }

  // Allows the accordion to track which panels are open.
  // TODO: Rename to fit the section better.
  let value = $state([]);

  let formElement = $state();

  const hasChanges = () => {
    if (
      id != blog?.id ||
      status != blog?.status ||
      type != blog?.type?.id ||
      title != blog?.title ||
      slug != blog?.slug ||
      blurb != blog?.blurb ||
      body != blog?.body ||
      cover?.id != blog?.cover ||
      date_published != blog?.date_published
    ) return true;
    return false;
  };
</script>

<!-- Captures key events for the entire window instead of a focused element. -->
<KeyboardControls
  {formElement}
  save
/>

<!-- //// THE MAIN FORM //// -->
<!-- `action` allows us to use a custom endpoint for data submission on the server. -->
<!-- `method` must be provided. GET or POST. -->
<!-- `enctype` is required for the form to properly transfer the media files during submission. -->
<!-- `use:enhance` allows us to submit forms and process related data before/after without reloading the page. -->
<Form
  action="/api/actions/blogs?/{create ? 'create' : 'update'}"
  method="POST"
  enctype="multipart/form-data"
  onSubmit={handleSubmit}
  class="relative px-4 pt-4 border border-surface-200-800 space-y-2 overflow-y-auto"
  bind:element={formElement}
>

  {#if !create}
  <!-- Status Select -->
  <Input type="select" name="status" label="Status" bind:value={status} options={statusPost} selected={0} inputClasses="w-full hidden">
    {#snippet tooltip()}
      <p class="">Status will deterimine the visibility of this update in your site.</p>
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


  <!-- Type -->
  <div class="w-fit flex items-end gap-2">
    <Input type="select" name="type" label="Category" options={data?.types} optionValues="id" bind:value={type} inputClasses="w-full" >
      {#snippet tooltip()}
        <p class="">This is the main category for the post. Mainly for sorting.</p>
        <p class=" text-success-700-300 italic">Tags will be added in the future for better sorting.</p>
      {/snippet}
    </Input>
    <!-- <AddType type="blog" create /> -->
  </div>


  <!-- Title & Slug -->
  <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
    <!-- Title input -->
    <Input type="text" required name="title" label="Title" bind:value={title} inputClasses="w-full" >
      {#snippet tooltip()}
        <p class="text-required">This field is required.</p>
        <p class="">The canonical title of the post. Can contain spaces and special characters.</p>
      {/snippet}
    </Input>


    <!-- Slug input -->
    <Input
      type="text"
      required
      name="slug"
      label="Slug"
      bind:value={slug}
      class
      inputClasses="ig-input"
      wrapperClasses="input-group grid grid-cols-[auto_min-content]"
      oninput={validateSlug}
    >
      {#snippet tooltip()}
        <p class="text-required">This field is required and must be unique.</p>
        <p class="">A slugified (URL-safe) unique identifier (generally of the title) used to look up a specific post, but you can choose any pattern you want, as long as it does not contain capital letters or special characters.</p>
        <p class="">The attached button will generate or regenerate the slug from the provided Title.</p>
      {/snippet}
      <button aria-label="{slug ? 'Regenerate' : 'Generate'} slug" title="{slug ? 'Regenerate' : 'Generate'} slug" type="button" class="ig-btn h-full aspect-square preset-filled-surface-200-800 grid place-content-center p-0" onclick={()=>{slug = slugify(title ?? '')}}><i class="text-lg ph-bold ph-{slug ? 'arrows-clockwise' : 'magic-wand'}"></i></button>
    </Input>
  </div>


  <!-- Blurb + Preview -->
  <Input type="textarea" name="blurb" label="Blurb" rows={2} bind:value={blurb} inputClasses="w-full">
    {#snippet tooltip()}
      <p class="">This is a shortened description, or just to say something fun and silly! Usually no more than 2-3 sentences.</p>
    {/snippet}
  </Input>


  <!-- Post Body + Preview -->
  <MarkdownEditor bind:value={body} label="Body" name="body">
    {#snippet tooltip()}
      <p class="">This is the main body of your blog post!</p>
    {/snippet}
  </MarkdownEditor>
  <!-- TODO: Finish proper editor component -->
  <!-- <MarkdownEditor
    name="body"
    label="Body"
    bind:value={body}
  /> -->


  <!-- Thumbnail + Preview -->
  <Input type="media-import-simple" name="cover" label="Cover/Thumbnail" fetchTypes={["image"]} accept={[...acceptedFileTypes?.image]} bind:value={cover} inputClasses="w-full">
    {#snippet tooltip()}
      <p class="">A single image in 16:9 aspect ratio (1920 x 1080 px). Will be cropped to fit in the center automatically. The image is not altered.</p>
      <p class="text-warning-700-300 font-black underline">Max image size is 10,000 x 10,000 pixels.</p>
    {/snippet}
  </Input>


  <!-- Date Published container -->
  <div class="space-y-1">
    <!-- Date Published input component -->
    <DatePicker
      name="date_published"
      bind:value={date_published}
      onValueChange={handleChangeDate}
    >
      {#snippet tooltip()}
        <p class="">The date the post was originally published or the date it should be published.</p>
        <p class="">You can back-date old posts or schedule new ones!</p>
      {/snippet}
    </DatePicker>
  </div>


  <!-- Form controls (sticky) -->
  {#snippet controls()}
    <FormControls
      {id}
      {title}
      useStatus
      {status}
      {canSchedule}
      canDelete={!create}
      deleteAction="/api/actions/blogs?/delete"
      deleteUrl="/_cc_admin/blogs"
      disabled={!hasChanges()}
    />
  {/snippet}
</Form>

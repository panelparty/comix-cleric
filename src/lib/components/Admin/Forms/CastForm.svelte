<script>
  // Svelte utilities
  import { goto, invalidateAll } from '$app/navigation';

  // Utilities
  import { toastError, toastSuccess } from '$lib/utils/toast.js';
  import { dateHasPassed } from '$lib/utils/date';
  import slugify from '@sindresorhus/slugify';
  import { acceptedFileTypes, createZodValidator, slugSchema } from '$lib/utils/validation/schema';
  import { statusPost } from '$lib/utils/validation/options';

  // Components
  import Status from '$lib/components/Admin/Status.svelte';
  import DatePicker from '$lib/components/Admin/Inputs/DatePicker.svelte';
  import Input from '../Inputs/Input.svelte';
  import Form from '../../Forms/Form.svelte';
  import FormControls from '../../Forms/FormControls.svelte';
  import KeyboardControls from '$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte';
  import MarkdownEditor from '../Inputs/MarkdownEditor.svelte';

  // Export props
  let {
    create,
    data
  } = $props();

  // Reactive data/variable assignment
  let id = $derived(data?.cast?.id); // Page ID - int (nullable)
  let status = $derived(data?.cast?.status ?? 'draft'); // Page status - string - default `draft` - required
  let type = $derived(data?.cast?.type?.id ?? (create ? data?.types?.[0]?.id : null)); // Page status - string - default `draft` - required
  let name = $derived(data?.cast?.name); // Page name - string - nullable
  let slug = $derived(data?.cast?.slug);  // Page URL slug - string(slug) - required
  let nickname = $derived(data?.cast?.nickname); // Page name - string - nullable
  let blurb = $derived(data?.cast?.blurb); // Blurb (short description) - string(plaintext/Markdown)
  let appearance = $derived(data?.cast?.appearance); // Description - string(plaintext/Markdown)
  let desc = $derived(data?.cast?.description); // Description - string(plaintext/Markdown)
  let age = $derived(data?.cast?.age); // Description - string(plaintext/Markdown)
  let height = $derived(data?.cast?.height); // Description - string(plaintext/Markdown)
  let weight = $derived(data?.cast?.weight); // Description - string(plaintext/Markdown)
  let pronouns = $derived(data?.cast?.pronouns); // Description - string(plaintext/Markdown)
  let bio = $derived(data?.cast?.bio); // Description - string(plaintext/Markdown)
  let spoilers = $derived(data?.cast?.spoilers); // Description - string(plaintext/Markdown)
  let cover = $derived(data?.cast?.cover); // Cover Image/Preview - string(UUID/filename+ext)
  let sheet = $derived(data?.cast?.sheet); // Cover Image/Preview - string(UUID/filename+ext)
  let dateReleased = $derived(data?.cast?.date_published ?? undefined); // Date Published - string(Date)

  // Slug validation
  const validateSlug = createZodValidator(slugSchema);

  // Setup reactive variables to set schedule/update states.
  let canSchedule = $derived.by(()=>{return !dateHasPassed(dateReleased) ?? false});

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
    formData.append('cover', JSON.stringify(cover?.id ?? cover)); // Append preview file to submitted form data.

    // Once we get a response from the server...
    return async ({ result, cookies }) => {
      if (result?.data?.success === true) { // If the result did not return an `error` in the response object...
        if (create) { // ...and, if the component is set to `create` mode...
          const new_item = result?.data?.new_item; // ...set a constant equal to the new page data.
          goto(`/_cc_admin/cast/edit/${new_item?.id}`); // Then, take us to the `edit` page for the page we just created.
        } else { // Otherwise...
          invalidateAll(); // Force-refresh all page data to ensure we are getting the latest server data.
        }

        const actionUsed = result?.data?.action; // Assign a constant to whatever "action" was used to submit the form.

        if (actionUsed === 'draft') { // If the action was `draft`...
          toastSuccess(`Cast member set as draft!`); // ...display a success toast for `draft`.
        } else if (actionUsed === 'scheduled') { // If the action was otherwise `scheduled`...
          toastSuccess(`Cast member scheduled for ${dateReleased}!`); // ...display a success toast for `scheduled` with the scheduled date.
        } else if (actionUsed === 'published') { // If the action was otherwise `published`...
          toastSuccess(`Cast member published!`); // ...display a success toast for `published`.
        } else if (actionUsed === 'archived') { // If the action was otherwise `archived`...
          toastSuccess(`Cast member archived!`); // ...display a success toast for `archived`.
        } else { // Otherwise...
          toastSuccess(`Cast member ${create ? 'created' : 'updated'}!`); // ...display a generic success toast for creating/updating the page.
        }

      } else { // Otherwise...
        toastError("Failed to update cast member!", result?.data?.error); // ...display an error toast with the error from the response.
      }
    };
  };

  // -- File handlers -- //
  // Set preview when uploading a new image.
  function handleCoverFile(file) {
    cover = file;
  };

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

<!-- //// THE MAIN FORM //// -->
<!-- `action` allows us to use a custom endpoint for data submission on the server. -->
<!-- `method` must be provided. GET or POST. -->
<!-- `enctype` is required for the form to properly transfer the media files during submission. -->
<!-- `use:enhance` allows us to submit forms and process related data before/after without reloading the page. -->
<Form
  action="/api/actions/cast?/{create ? 'create' : 'update'}"
  method="POST"
  enctype="multipart/form-data"
  onSubmit={handleSubmit}
  class="space-y-2 overflow-y-auto"
  bind:element={formElement}
>
  {#if !create}
  <!-- Status Select -->
  <Input type="select" name="status" label="Status" bind:value={status} options={statusPost} selected={0} inputClasses="w-full hidden">
    {#snippet tooltip()}
      <p class="mb-4">Status will deterimine the visibility of this update in your site.</p>
      <div class="space-y-2">
        <div class="text-surface-950-50 p-2 rounded-md bg-surface-100-900">
          <p class="font-black">Draft:</p>
          <p class="font-medium text-surface-800-200 leading-none">The item still needs editing or is awaiting manual publishing. Hidden from site.</p>
        </div>
        <div class="text-success-950-50 p-2 rounded-md bg-success-100-900">
          <p class="font-black flex items-center gap-1">Scheduled:</p>
          <p class="font-medium text-success-800-200 leading-none">The item has a set publishing date in the future. Hidden from site.</p>
        </div>
        <div class="text-primary-950-50 p-2 rounded-md bg-primary-100-900">
          <p class="font-black">Published:</p>
          <p class="font-medium text-primary-800-200 leading-none">The item is available to be viewed on your site.</p>
        </div>
        <div class="text-warning-950-50 p-2 rounded-md bg-warning-100-900">
          <p class="font-black">Archived:</p>
          <p class="font-medium text-warning-800-200 leading-none">A non-draft item that needs to be removed from viewing, but kept for later use. Hidden from site.</p>
        </div>
      </div>
    {/snippet}
    <Status {status} />
  </Input>
  {/if}

  <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
    <!-- Type Select -->
    <Input type="select" name="type" label="Role" bind:value={type} options={data?.types} optionValues="id" selected={0} inputClasses="w-full">
      {#snippet tooltip()}
        <p class="">Type determines the story role this character played.</p>
        <p class="">We have included many presets:</p>
        <div class="space-y-2">
          {#each data?.types as item, i}
          <div class="p-1">
            <p class="font-black leading-none mb-1">{item?.name}</p>
            <p class="text-xs font-medium leading-none">{item?.description}</p>
          </div>
          {/each}
        </div>
      {/snippet}
    </Input>
  </div>

  <!-- Cast Title & Slug -->
  <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
    <!-- Cast title input -->
    <Input type="text" name="name" label="Name" required bind:value={name} inputClasses="w-full" >
      {#snippet tooltip()}
        <p class="text-xs  text-error-700-300 italic">This field is required.</p>
        <p class="">The canonical name of the cast member. Can contain spaces and special characters.</p>
      {/snippet}
    </Input>
    <!-- Slug input -->
    <Input type="text" name="slug" label="Slug" required bind:value={slug} class inputClasses="ig-input" wrapperClasses="input-group grid grid-cols-[auto_min-content]" oninput={validateSlug}>
      {#snippet tooltip()}
        <p class="text-xs  text-error-700-300 italic">This field is required and must be unique.</p>
        <p class="">A slugified (URL-safe) unique identifier, generally of the name, used to look up a specific cast member, but you can choose any pattern you want, as long as it does not contain capital letters or special characters.</p>
        <p class="">The attached button will generate or regenerate the slug from the provided Cast Name.</p>
      {/snippet}
      <button aria-label="{slug ? 'Regenerate' : 'Generate'} slug" title="{slug ? 'Regenerate' : 'Generate'} slug" type="button" class="ig-btn h-full aspect-square preset-filled-surface-200-800 grid place-content-center p-0" onclick={()=>{slug = slugify(name ?? '')}}><i class="text-lg ph-bold ph-{slug ? 'arrows-clockwise' : 'magic-wand'}"></i></button>
    </Input>
  </div>

  <!-- Input group (half-width) -->
  <div class="w-full lg:w-[50%] grid grid-cols-1">
    <!-- Input container -->
    <Input type="textarea" label="Nickname(s)" name="nickname" bind:value={nickname} inputClasses="w-full">
      {#snippet tooltip()}
        <p class="">Use commas to separate multiple nicknames.</p>
        <p class="">The first option will be used in previews.</p>
      {/snippet}
    </Input>
  </div>

  <!-- Input group (half-width) -->
  <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-2">
    <!-- Input container -->
    <Input type="text" label="Age" name="age" bind:value={age}>
      {#snippet tooltip()}
        <p class="">The canonical age of the character.</p>
      {/snippet}
    </Input>
    <!-- Input container -->
    <Input type="text" label="Height" name="height" bind:value={height}>
      {#snippet tooltip()}
        <p class="">The canonical height of the character.</p>
      {/snippet}
    </Input>
    <!-- Input container -->
    <Input type="text" label="Weight" name="weight" bind:value={weight}>
      {#snippet tooltip()}
        <p class="">The canonical weight of the character.</p>
      {/snippet}
    </Input>
  </div>

  <!-- Input group (half-width) -->
  <div class="w-full lg:w-[50%] grid grid-cols-1 md:grid-cols-2 gap-2">
    <!-- Input container -->
    <Input type="text" label="Pronouns" name="pronouns" bind:value={pronouns}>
    {#snippet tooltip()}
      <p class="">The pronouns the cast member prefers when referenced (if applicable).</p>
      {/snippet}
    </Input>
  </div>

  <!-- Physical Description -->
  <Input type="textarea" name="appearance" label="Physical Description" rows={2} bind:value={appearance} inputClasses="w-full">
    {#snippet tooltip()}
      <p class="">This is for describing the cast member's physical appearance. Also helps visually-impared readers!</p>
    {/snippet}
  </Input>

  <!-- Blurb -->
  <Input type="textarea" name="blurb" label="Blurb" rows={2} bind:value={blurb} inputClasses="w-full">
    {#snippet tooltip()}
      <p class="">This is a shortened description, or just to say something fun and silly! Usually no more than 2-3 sentences.</p>
    {/snippet}
  </Input>

  <!-- Bio -->
  <MarkdownEditor bind:value={bio} label="Bio" name="bio">
    {#snippet tooltip()}
      <p class="">This is a full bio or about section of the cast member. It can contain Markdown formatted text and basically just be a full blog post if you want!</p>
    {/snippet}
  </MarkdownEditor>

  <!-- Full Description -->
  <MarkdownEditor bind:value={desc} label="Description" name="desc">
    {#snippet tooltip()}
      <p class="">This is a full description or "Creator Notes". It can contain Markdown formatted text and basically just be a full blog post if you want!</p>
    {/snippet}
  </MarkdownEditor>

  <!-- Spoilers -->
  <MarkdownEditor bind:value={spoilers} label="Spoilers" name="spoilers">
    {#snippet tooltip()}
      <p class="">This is a place to house spoilers about the cast member. It can contain Markdown formatted text and basically just be a full blog post if you want!</p>
      <p class="text-warning">This field is no longer in-use, replaced by the "spoiler tag" syntax: || Hidden text ||</p>
    {/snippet}
  </MarkdownEditor>

  <!-- Preview Image Upload + Preview -->
  <Input type="media-import-simple" name="cover" label="Portrait" fetchTypes={["image"]} accept={[...acceptedFileTypes?.image]} bind:value={cover}>
    {#snippet tooltip()}
      <p class="">This is a preview and profile image for the cast member.</p>
      <p class="text-warning-700-300 font-black underline">Max image size is 10,000 x 10,000 pixels.</p>
    {/snippet}
  </Input>

  <!-- Sheet Image Upload + Preview -->
  <Input type="media-import-simple" name="sheet" label="Reference Sheet" fetchTypes={["image"]} accept={[...acceptedFileTypes?.image]} bind:value={sheet}>
    {#snippet tooltip()}
      <p class="">This is a slot to display a full character sheet.</p>
      <p class="text-warning-700-300 font-black underline">Max image size is 10,000 x 10,000 pixels.</p>
    {/snippet}
  </Input>

  <div class="space-y-1">
    <DatePicker
      name="date_published"
      bind:value={dateReleased}
      onValueChange={handleChangeDate}
    >
      {#snippet tooltip()}
        <p class="">The date the post was originally published or the date it should be published.</p>
        <p class="">You can back-date old posts or schedule new ones!</p>
      {/snippet}
    </DatePicker>
  </div>

  {#snippet controls()}
    <FormControls
      useStatus
      {status}
      {canSchedule}
      canDelete={!create}
      deleteAction="/api/actions/cast?/delete"
      deleteUrl="/_cc_admin/cast"
      {id}
      title={name}
    />
  {/snippet}

</Form>

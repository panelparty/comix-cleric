<script>
  // Svelte utilities
  import { goto, invalidate, invalidateAll } from '$app/navigation';
  
  // Utilities
  import { toastError, toastSuccess } from '$lib/utils/toast.js';
  import { find, filter } from 'lodash-es';
  import { dateHasPassed, formatDateLong } from '$lib/utils/date';
  import slugify from '@sindresorhus/slugify';
  import { acceptedFileTypes, createZodValidator, slugSchema } from '$lib/utils/validation/schema';
  import { fallback } from '$lib/utils/utils';
  import { appendData } from '$lib/utils/data/transform';
  import { checkNull } from '$lib/utils/detectTypes';
  import { statusPost } from '$lib/utils/validation/options';

  // Components
  import Status from '$lib/components/Admin/Status.svelte';
  import DatePicker from '$lib/components/Admin/Inputs/DatePicker.svelte';
  import FileUploader from '$lib/components/Admin/Inputs/FileUploader.svelte';
  import AudioPlayer from '../AudioPlayer.svelte';
  import FileSelector from '../Inputs/FileSelector.svelte';
  import TooltipInfo from '../../Display/TooltipInfo.svelte';
  import Form from '../../Forms/Form.svelte';
  import FormControls from '../../Forms/FormControls.svelte';
  import ContributorManager from './ContributorSelect/ContributorManager.svelte';
  import Loader from '$lib/components/Placeholders/Loader.svelte';
  import MediaBlockContainer from '../Inputs/MediaBlock/MediaBlockContainer.svelte';
  import Input from '../Inputs/Input.svelte';
  import KeyboardControls from '$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte';
  import MarkdownEditor from '../Inputs/MarkdownEditor.svelte';
  
  // Skeleton UI components
  import { Accordion } from '@skeletonlabs/skeleton-svelte';
    
// Export props (`export` is not required.)
  let {
    create,
    data,
  } = $props();

  // Slug validation
  const validateSlug = createZodValidator(slugSchema);

  // Destructure server data
  let id = $derived(data?.update?.id);
  let status = $derived(data?.update?.status ?? 'draft');
  let number = $derived(checkNull(data?.update?.number) ?? (checkNull(data?.prevUpdate?.number) ? data?.prevUpdate?.number + 1 : 1));
  let type = $derived(data?.update?.type ?? find(data?.types, { slug: "main-story" })?.id);
  let name = $derived(data?.update?.name);
  let slug = $derived(data?.update?.slug);
  let blurb = $derived(data?.update?.blurb);
  let desc = $derived(data?.update?.description);
  let transcript = $derived(data?.update?.transcript);
  let cover = $derived(data?.update?.cover ?? null);
  let format_strip = $derived(data?.update?.format_strip ?? data?.settings?.format_strip ?? false);
  let media = $derived(data?.update?.featured_media ?? null);
  let date_published = $derived(data?.update?.date_published ?? undefined);
  let contributors = $derived(data?.contributors ?? []);
  let series = $derived(data?.update?.series);
  let volume = $derived(data?.update?.volume?.id ?? (create ? data?.volumes?.[0]?.id : null));
  let chapter = $derived(data?.update?.chapter?.id ?? (create ? data?.volumes?.[0]?.chapters?.[0]?.id : null));
  let audio = $derived(data?.update?.audio);
  let audio_autoplay = $derived(data?.update?.audio_autoplay ?? false);
  let audio_volume = $derived(data?.update?.audio_volume ?? .7);
  let audio_autoforward = $derived(data?.update?.audio_autoforward ?? true);
  let audio_loop = $derived(data?.update?.audio_loop ?? false);
  let warning_popup = $derived(data?.update?.warning_popup ?? false);
  let warning_message = $derived(data?.update?.warning_message ?? "This update may feature mature themes, images, and/or text. Viewer discretion is advised.");

  // Form state
  let loading = $state(false);
  let canSchedule = $derived.by(()=>{return !dateHasPassed(date_published) ?? false});

  // Form submission logic
  const handleSubmit = ({ formData }) => {
    // Set loading state
    loading = true;

    // Append missing data during submission
    appendData(formData, 'id', id);
    appendData(formData, 'cover', cover?.id);
    appendData(formData, 'contributors', contributors);
    appendData(formData, 'type_slug', find(data?.types, {id: type})?.slug);

    // Handle response
    return async ({ result }) => {
      if (result?.data?.success === true) {
        if (create) {
          const new_item = result?.data?.new_item;
          goto(`/_cc_admin/updates/edit/${new_item?.id}`);
        } else {
          invalidateAll();
        }

        const actionUsed = result?.data?.action;
        let successMessage;

        switch (actionUsed) {
          case 'draft':
            successMessage = `Page set as draft!`;
            break;
          case 'scheduled':
            successMessage = `Page scheduled for ${formatDateLong(date_published)}!`;
            break;
          case 'published':
            successMessage = `Page published!`;
            break;
          case 'archived':
            successMessage = `Page archived!`;
            break;
          default:
            successMessage = `Page saved!`;
        }

        toastSuccess(successMessage);
      } else {
        toastError("Failed to update page!", result?.data?.error);
      }
      loading = false;
    };
  };

  // Set the audio file reference and replace the file data when uploading new audio.
  function handleAudioFile (uploadResponse) {
    audio = Array.isArray(uploadResponse) ? uploadResponse[0] : uploadResponse;
    invalidate(`/api/media/${audio?.filename_disk}`);
  };

  // Force-reset back to original server copy. Almost like refreshing the page, but only reloading the data.
  async function handleCancel() {
    loading = true;
    await invalidateAll();
    loading = false;
  }

  // Handles changing the date within the form when the DatePicker is updated.
  function handleChangeDate(newDate) {
    date_published = newDate;
  }

  // Allows the accordion to track which panels are open.
  let optionsOpen = $state([]);

  // Form element reference
  let formElement = $state();

</script>


<!-- Captures key events for the entire window instead of a focused element. -->
<KeyboardControls
  {formElement}
  save
/>

<Form
  action="/api/actions/updates?/{create ? 'create' : 'update'}"
  method="POST"
  enctype="multipart/form-data"
  onSubmit={handleSubmit}
  bind:element={formElement}
  class="space-y-4 overflow-y-auto"
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

  <div class="w-full lg:w-[50%] grid grid-cols-2 justify-center gap-2">
    <!-- Update Type Select -->
    <Input type="select" name="type" label="Update Type" bind:value={type} options={data?.types} optionValues="id" selected={0} class="w-full" inputClasses="w-full!">
      {#snippet tooltip()}
        <p class="leading-tight font-bold">Update Type determines if this update is part of the main series or not.</p>
        <p class="text-sm">We have included many presets:</p>
        <div class="space-y-2">
          <div class="p-1">
            <p class="font-black leading-none mb-1">Main Story</p>
            <p class="text-xs font-medium leading-none">Default. Allows the update to be part of the numbered story set.</p>
          </div>
          <div class="p-1">
            <p class="font-black leading-none mb-1 flex items-center gap-1">Intermission</p>
            <p class="text-xs font-medium leading-none">For small, usually 1 update, breaks in the story to prepare for a return.</p>
          </div>
          <div class="p-1">
            <p class="font-black leading-none mb-1">Hiatus</p>
            <p class="text-xs font-medium leading-none">For notifying users of a long, potentially indefinite break from the comic.</p>
          </div>
          <div class="p-1">
            <p class="font-black leading-none mb-1">Notice</p>
            <p class="text-xs font-medium leading-none">For general notices, such as providing warnings or context.</p>
          </div>
          <div class="p-1">
            <p class="font-black leading-none mb-1">Snippet</p>
            <p class="text-xs font-medium leading-none">For showing off a teaser (might be a more apt name), basically a longer "preview".</p>
          </div>
          <div class="p-1">
            <p class="font-black leading-none mb-1">Preview</p>
            <p class="text-xs font-medium leading-none">For giving a very brief look at an upcoming update.</p>
          </div>
          <div class="p-1">
            <p class="font-black leading-none mb-1">Misc.</p>
            <p class="text-xs font-medium leading-none">For anything else that doesn't have a category.</p>
          </div>
        </div>
      {/snippet}
    </Input>

    <!-- Page Number Input -->
    {#if type === find(data?.types, { slug: "main-story" })?.id}
    <Input type="number" name="number" label="Number" bind:value={number} inputClasses="max-w-full">
      {#snippet tooltip()}
        <p class="text-xs leading-tight font-bold text-warning-700-300">This field is only available for "Main Story" updates.<br>We highly recommend numbering your main story updates so they can be found in the "Jump To" fields.</p>
        <p class="leading-tight font-bold">Expected page number will be added as a placeholder value.</p>
        <p class="leading-tight font-bold">Page number will serve as an easy way to look up updates. Numbers should not be repeated.</p>
      {/snippet}
    </Input>
    {/if}
  </div>

  <div class="w-full lg:w-[50%] grid grid-cols-1 md:grid-cols-2 gap-2">
    <Input type="select" name="volume" label="Volume" bind:value={volume} options={data?.volumes} optionValues="id" inputClasses="w-full">
      {#snippet tooltip()}
        <p class="leading-tight font-bold">Defaults to the most recent volume in the series. Mainly for categorizing.</p>
      {/snippet}
    </Input>
    <!-- Parent Chapter Select -->
    <Input type="select" name="chapter" label="Chapter" bind:value={chapter} options={volume ? filter(data?.chapters, { volume: volume }) : data?.chapters} optionValues="id" inputClasses="w-full">
      {#snippet tooltip()}
        <p class="leading-tight font-bold">Defaults to the most recent chapter in the series. Mainly for categorizing.</p>
      {/snippet}
    </Input>
  </div>

  <!-- Update Title & Slug -->
  <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
    <!-- Update title input -->
    <Input type="text" required name="name" label="Title" bind:value={name} inputClasses="w-full" >
      {#snippet tooltip()}
        <p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required.</p>
        <p class="leading-tight font-bold">The canonical title of the update. Can contain spaces and special characters.</p>
      {/snippet}
    </Input>
    <!-- Slug input -->
    <Input type="text" required name="slug" label="Slug" bind:value={slug} inputClasses="ig-input rounded-r-none" wrapperClasses="input-group grid grid-cols-[auto_min-content]" oninput={validateSlug}>
      {#snippet tooltip()}
        <p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required and must be unique.</p>
        <p class="leading-tight font-bold">A slugified (URL-safe) unique identifier (generally of the title) used to look up a specific page, but you can choose any pattern you want, as long as it does not contain capital letters or special characters.</p>
        <p class="leading-tight font-bold">The attached button will generate or regenerate the slug from the provided Update Title.</p>
      {/snippet}
      <button aria-label="{slug ? 'Regenerate' : 'Generate'} slug" title="{slug ? 'Regenerate' : 'Generate'} slug" type="button" class="ig-btn h-full aspect-square preset-filled-surface-200-800 grid place-content-center p-0" onclick={()=>{slug = slugify(name ?? '')}}><i class="text-lg ph-bold ph-arrows-clockwise"></i></button>
    </Input>
  </div>

  <!-- Page Short Description + Preview -->
  <Input type="textarea" name="blurb" label="Blurb" rows={2} bind:value={blurb} inputClasses="w-full">
    {#snippet tooltip()}
      <p class="leading-tight font-bold">This is a shortened description of the update, or just to say something fun and silly! Usually no more than 2-3 sentences.</p>
    {/snippet}
  </Input>

  <!-- Page Main Description + Preview -->
  <MarkdownEditor bind:value={desc} label="Description" name="desc">
    {#snippet tooltip()}
      <p class="leading-tight font-bold text-warning-700-300">Image insertion, links, and styling controls will be available at launch. These currently have to be added by-hand.</p>
      <p class="leading-tight font-bold">This is a full description or "Creator Notes". It can contain Markdown formatted text and basically just be a full blog post if you want!</p>
    {/snippet}
  </MarkdownEditor>

  <!-- Preview Image Upload + Preview -->
  <Input type="media-import-simple" label="Cover/Thumbnail" fetchTypes={["image"]} accept={[...acceptedFileTypes?.image]} bind:value={cover} inputClasses="w-full">
    {#snippet tooltip()}
      <p class="leading-tight font-bold">A single image in square or 4:5 aspect ratio (1800 x 2250px). Will be cropped to fit in the center automatically. The image is not altered.</p>
      <p class="text-warning-700-300 font-medium underline">Max image size is 10,000 x 10,000 pixels.</p>
    {/snippet}
  </Input>

  <div class="w-full p-3 space-y-3 bg-surface-100-900 rounded-lg">
    <h5 class="h5">Formatting</h5>
    <Input type="checkbox" name="format_strip" label="Comic Strip" class="flex items-center gap-2 flex-row-reverse" bind:value={format_strip}>
      {#snippet tooltip()}
        <p class="leading-tight font-bold">Changes the comic reader to flow horizontally for comic strips!</p>
        <p class="leading-tight font-bold">This ensures any images that are <span class="italic">very</span> wide don't become unreadable on narrow screens!</p>
      {/snippet}
    </Input>
  </div>

  <!-- Featured Media + Preview List -->
  <div class="space-y-1">
    <div class="flex items-center gap-1">
      <label class="text-sm ml-1" for="media">Featured Media</label>
      <TooltipInfo ariaLabel="Comic Image Field Information">
        {#snippet content()}
        <p class="leading-tight font-bold">Up to 999 images. Will automatically scale to the same width as other images without altering the file.</p>
        <p class="text-warning-700-300 font-medium underline">Max image size is 10,000 x 10,000 pixels.</p>
        {/snippet}
      </TooltipInfo>
    </div>
    <div class="grid grid-cols-1">
      <MediaBlockContainer name="media" initialValue={JSON.parse(media)} multiple maxFiles={999} fetchTypes={["image"]} accept={[...acceptedFileTypes?.image]} preview blocks {format_strip} />
    </div>
  </div>

  <!-- Transcript + Preview -->
  <MarkdownEditor bind:value={transcript} label="Transcript" name="transcript">
    {#snippet tooltip()}
      <p class="leading-tight font-bold">This is a transcription (or text-based version) of your comic for visually-impaired readers or for adding accessibility to otherwise difficult-to-read styles of lettering. You could temporarily include translations here while we work on a full translation feature.</p>
    {/snippet}
  </MarkdownEditor>

  <!-- Audio + Previews -->
  <Accordion value={optionsOpen} onValueChange={(e) => (optionsOpen = e.value)} collapsible>
    <Accordion.Item
      controlClasses="text-base font-normal preset-filled-surface-200-800 hover:preset-filled-surface-100-900! {optionsOpen.includes('audio') ? 'rounded-t-md rounded-b-none!' : ''}"
      panelClasses="preset-filled-surface-100-900 rounded-b-md px-2! md:px-4"
      value="audio"
    >
      {#snippet control()}Audio Track{/snippet}
      {#snippet panel()}
      <div class="space-y-1">
        <div class="space-y-2">
          <div class="space-y-2">
            <div class="flex items-center gap-1">
              <label for="audio" class="text-sm ml-1">Audio File</label>
              <TooltipInfo ariaLabel="Audio File Field Information">
                {#snippet content()}
                <p class="leading-tight font-bold">Here, you can add or upload an audio track to include with your comic!</p>
                <p class="leading-tight font-bold">Auto-play: Allows you to set if the audio should play immediately when the page loads. <span class="text-xs text-warning-700-300">Browser security may block this feature. There's nothing we can do about it.</span></p>
                <p class="leading-tight font-bold">Loop: Allows you to choose if the audio should loop after it ends.</p>
                <p class="leading-tight font-bold">Volume: Allows you to set the default playback volume if the source is too loud.</p>
                {/snippet}
              </TooltipInfo>
            </div>
            <input type="text" name="audio" class="hidden" value={audio?.id}>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FileSelector
                fetchTypes={["audio"]}
                accept={[...acceptedFileTypes?.audio]}
                onAddFile={handleAudioFile}
              />
              <FileUploader {data}
                subtext="Audio files only. Max 256MB"
                accept={acceptedFileTypes?.audio}
                onUploadComplete={handleAudioFile}
              />
            </div>
          </div>
          {#if audio}
          <div class="flex flex-col gap-2">
            <p class="text-sm ml-1">Preview</p>
            <div class="grid grid-cols-[auto_min-content] items-center gap-2">
              <AudioPlayer src={audio} volume={audio_volume} />
              <button
                aria-label="Remove item from list"
                type="button"
                onclick={()=>{audio = null}}
                class="btn size-8 preset-filled-surface-500 "
              >
                <i class="ph-bold ph-x"></i>
              </button>
            </div>
            <div class="flex flex-col md:flex-row gap-2 md:items-center">
              <Input type="checkbox" name="audio_autoplay" label="Autoplay" class="flex items-center gap-2 flex-row-reverse" bind:value={audio_autoplay}>
                {#snippet tooltip()}
                  <p class="leading-tight font-bold text-warning-700-300">There are MANY cases where this will not work. Due to modern browser security, all sites on the web, except a very select few (like YouTube) are disallowed from playing audio on page load.</p>
                  <p class="leading-tight font-bold text-success-700-300">Going page-to-page in the reader should always work, just not from external links.</p>
                  <p class="leading-tight font-bold">This tells the audio player if it should start immediately on page load.</p>
                {/snippet}
              </Input>
              <!-- Becomes important when allowing playlists -->
              <!-- <Input type="checkbox" name="audio_autoforward" label="Autoplay" class="flex items-center gap-2 flex-row-reverse" bind:value={audio_autoforward} /> -->
              <Input type="checkbox" name="audio_loop" label="Loop Playback" class="flex items-center gap-2 flex-row-reverse" bind:value={audio_loop} />
              <div class="w-full flex items-center gap-2">
                <label for="audio_volume" class="text-sm">Volume</label>
                <div class="w-full flex items-center gap-2">
                  <input type="range" name="audio_volume" min={0} max={1} step={0.01} bind:value={audio_volume} class="range w-full">
                  <div class="min-w-12 flex justify-end preset-filled-surface-50-950 px-1 rounded-sm">
                    <p class="">{Math.trunc(audio_volume * 100)}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/if}
        </div>
      </div>
      {/snippet}
    </Accordion.Item>
  </Accordion>

  <ContributorManager name="contributors" initialValue={contributors} multiple maxUsers={128} />

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

  {#snippet controls()}
    <FormControls
      useStatus
      {status}
      {canSchedule}
      canDelete={!create}
      deleteAction="/api/actions/updates?/delete"
      deleteUrl="/_cc_admin/updates"
      handleDiscard={handleCancel}
      {id}
      title={fallback([name, slug])}
      name={fallback([name, slug])}
    />
  {/snippet}
</Form>

<!--
@component
## PageForm
Displays a form for creating a `Page` item in the database.

### Prop Definitions
- create - Tells the form if it should create a new page or edit an existing page.
- data - Inserts existing API data for editing.

> We can still pass in `data` for `create` by fetching the previous page data to pre-populate fields.

@example
``` html
<PageForm create {data} />
or
<PageForm {data} >
```

> `data` is in curly braces here because were are using a +page.svelte prop by the same name.
> It's shorthand for `data={data}`.

-->

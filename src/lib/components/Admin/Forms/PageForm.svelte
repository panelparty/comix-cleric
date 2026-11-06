<script>
  // Svelte utilities
  import { goto, invalidateAll } from '$app/navigation';
  
  // Utilities
  import { toastError, toastSuccess } from '$lib/utils/toast.js';
  import { phosphorIcons } from '$lib/utils/icons';
  import { createZodValidator, slugSchema } from '$lib/utils/validation/schema';
  import slugify from '@sindresorhus/slugify';
  import { dateHasPassed, formatDateLong } from '$lib/utils/date';
  import { statusPost } from '$lib/utils/validation/options';
  
  // Components
  import Status from '$lib/components/Admin/Status.svelte';
  import DatePicker from '$lib/components/Admin/Inputs/DatePicker.svelte';
  import Form from '../../Forms/Form.svelte';
  import FormControls from '../../Forms/FormControls.svelte';
  import Input from '../Inputs/Input.svelte';
  import KeyboardControls from '$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte';
  import Loader from '$lib/components/Placeholders/Loader.svelte';
  import MarkdownEditor from '../Inputs/MarkdownEditor.svelte';
  
  // Props
  let {
    create,
    data
  } = $props();

  // Reactive data/variable assignment
  let id = $derived(data?.page?.id);
  let status = $derived(data?.page?.status ?? 'draft');
  let type = $derived(data?.page?.type ?? null);
  let name = $derived(data?.page?.name ?? '');
  let slug = $derived(data?.page?.slug ?? '');
  let url = $derived(data?.page?.url ?? '');
  let subtitle = $derived(data?.page?.subtitle ?? '');
  let label = $derived(data?.page?.label ?? '');
  let icon = $derived(data?.page?.icon ?? '');
  let color = $derived(data?.page?.color ?? '');
  let theme = $derived(data?.page?.theme ?? '');
  let page_body = $derived(JSON.parse(data?.page?.body ?? '[]'));
  let collection = $derived(data?.page?.collection);
  let homepage = $derived(data?.page?.homepage);
  let show_header = $derived(data?.page?.show_header);
  let show_footer = $derived(data?.page?.show_footer);
  let show_mobile = $derived(data?.page?.show_mobile);
  let show_thumb = $derived(data?.page?.show_thumb);
  let show_reader = $derived(data?.page?.show_reader);
  let show_hero = $derived(data?.page?.show_hero);
  let blurb = $derived(data?.page?.blurb ?? '');
  let desc = $derived(data?.page?.description ?? '');
  let date_published = $derived(data?.page?.date_published ?? undefined);
  let themes = $derived(data?.themes ?? []);
  
  // Loading state
  let loading = $state(false);

  // Slug validation
  const validateSlug = createZodValidator(slugSchema);

  // Sync `slug` with `title`
  $effect(()=>{
    if (slug === null) {
      slug = slugify(name ?? '');
    }
  });

  // Setup reactive variables to set schedule/update states.
  let canSchedule = $derived.by(()=>{ return !dateHasPassed(date_published) ?? false });

  // Form submission logic
  const handleSubmit = ({ formData }) => {
    formData.append('id', id);
    formData.append('body', JSON.stringify(page_body));

    return async ({ result, cookies }) => {
      if (result?.data?.success === true) {
        if (create) {
          const new_item = result?.data?.new_item;
          goto(`/_cc_admin/settings/layout/edit/${new_item?.id}`);
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
      } else { // Otherwise...
        toastError("Failed to update page!", result?.data?.error);
      }
    };
  };

  // Set preview when selecting a new image from the media library.
  function handleCoverFile(selectedFile) {
    cover = selectedFile; // Replace our preview image with the selected file.
  }

  // Handles changing the date within the form when the DatePicker is updated.
  function handleChangeDate(newDate) {
    date_published = newDate; // Make sure we're updating the Date Published to the newly-chosen date.
  }

  // Force-reset back to original server copy. Almost like refreshing the page, but only reloading the data.
  function handleCancel() {
    loading = true;
    invalidateAll();
    loading = false;
  }

  // Allows the accordion to track which panels are open.
  // TODO: Rename to fit the section better.
  let value = $state([]);

  // Form reference
  let formElement = $state();
</script>

<!-- Captures key events for the entire window instead of a focused element. -->
<KeyboardControls
  {formElement}
  save
/>

<!-- Main form -->
<Form
  action="/api/actions/pages?/{create ? 'create' : 'update'}"
  method="POST"
  enctype="multipart/form-data"
  onSubmit={handleSubmit}
  bind:element={formElement}
  class="space-y-2 overflow-y-auto"
>
  <Loader {loading} />

  {#if !create}
  <!-- Status Select -->
  <Input type="select" name="status" label="Status" bind:value={status} options={statusPost} selected={0} inputClasses="w-full hidden">
    {#snippet tooltip()}
      <p class="leading-tight mb-4 font-bold">Status will deterimine the public visibility of this page in your site.</p>
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

  <!-- Title, Slug, & URL/Path inputs -->
  <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-2">
    <!-- Title input -->
    <Input type="text" name="name" label="Title" required bind:value={name} inputClasses="w-full" >
      {#snippet tooltip()}
        <p class="text-xs  text-error-700-300 italic">This field is required.</p>
        <p class="">The canonical title of the page. Can contain spaces and special characters.</p>
      {/snippet}
    </Input>

    <!-- Slug input -->
    <Input type="text" name="slug" label="Slug" required bind:value={slug} class inputClasses="ig-input" wrapperClasses="input-group grid grid-cols-[auto_min-content]" oninput={validateSlug}>
      {#snippet tooltip()}
        <p class="text-xs  text-error-700-300 italic">This field is required and must be unique.</p>
        <p class="">A slugified (URL-safe) unique identifier (generally of the title) used to look up a specific page, but you can choose any pattern you want, as long as it does not contain capital letters or special characters.</p>
        <p class="">The attached button will generate or regenerate the slug from the provided Title.</p>
      {/snippet}
      <button aria-label="{slug ? 'Regenerate' : 'Generate'} slug" title="{slug ? 'Regenerate' : 'Generate'} slug" type="button" class="ig-btn h-full aspect-square preset-filled-surface-200-800 grid place-content-center p-0" onclick={()=>{slug = slugify(title ?? '')}}><i class="text-lg ph-bold ph-{slug ? 'arrows-clockwise' : 'magic-wand'}"></i></button>
    </Input>

    <!-- Path input -->
    <Input type="readonly" name="url" label="Path" bind:value={url} inputClasses="w-full" >
      {#snippet tooltip()}
        <p class="text-warning-700-300">Path editing coming soon!</p>
        <p class="">The path to the page you are creating, relative to your app domain.</p>
        <p class="">You may also use this to create links to other websites.</p>
      {/snippet}
    </Input>
  </div>

  <!-- Subtitle & Button Label inputs -->
  <div class="w-full grid grid-cols-1 lg:grid-cols-2 gap-2">
    <!-- Subtitle input -->
    <Input type="text" name="subtitle" label="Subtitle" bind:value={subtitle} inputClasses="w-full" >
      {#snippet tooltip()}
        <p class="">A custom meta description, used is SEO.</p>
      {/snippet}
    </Input>

    <!-- Label input -->
    <Input type="text" name="label" label="Button Label" bind:value={label} inputClasses="w-full" >
      {#snippet tooltip()}
        <p class="">A custom label that will be used on buttons. If unset, the title will be used.</p>
      {/snippet}
    </Input>
  </div>

  <!-- Icon, Color, & Theme inputs -->
  <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-2">
    <!-- Icon input -->
    <div class="inline-flex items-end gap-2">
      <div class="size-12 border rounded-md flex items-center justify-center pattern-checker">
        <i class="ph-bold ph-{icon} text-2xl"></i>
      </div>


      <Input type="select" name="icon" label="Icon" options={phosphorIcons} optionValues="name" bind:value={icon} inputClasses="w-full" >
        {#snippet tooltip()}
          <p class="">An icon to associate with this page. Typically used on buttons.</p>
        {/snippet}
      </Input>
    </div>
  </div>

  <div class="w-fit border rounded-2xl p-4 space-y-2">
    <h5 class="h5 leading-tight">Navigation Links</h5>

    <Input type="checkbox" name="show-header" label="Show in Header" bind:value={show_header} class="w-full">
      {#snippet tooltip()}
        <p class="">If enabled, shows as a link in the main header navigation menu.</p>
      {/snippet}
    </Input>

    <Input type="checkbox" name="show-footer" label="Show in Footer" bind:value={show_footer} class="w-full">
      {#snippet tooltip()}
        <p class="">If enabled, shows as a link in the footer sitemap navigation menu.</p>
        <p class="text-warning-500 font-bold ">We highly recommend you leave this enabled. Sitemaps are for accessibility and should display all site links.</p>
      {/snippet}
    </Input>

    <Input type="checkbox" name="show-mobile" label="Show in Mobile" bind:value={show_mobile} class="w-full">
      {#snippet tooltip()}
        <p class="">If enabled, shows as a link in the full mobile navigation menu. (More)</p>
        <p class="text-warning-500 font-bold ">We highly recommend you leave this enabled. Links that do not appear in the mobile thumb navigation should appear here.</p>
      {/snippet}
    </Input>

    <Input type="checkbox" name="show-thumb" label="Show in Thumb" bind:value={show_thumb} class="w-full">
      {#snippet tooltip()}
        <p class="">If enabled, shows as a button in the mobile thumb navigation menu.</p>
        <p class="text-warning-500 font-bold ">We suggest keeping the number of links on the mobile thumb navigation low. There is very limited space.</p>
      {/snippet}
    </Input>

    <Input type="checkbox" name="show-reader" label="Show in Reader" bind:value={show_reader} class="w-full">
      {#snippet tooltip()}
        <p class="">If enabled, shows as a button in the reader navigation menu.</p>
        <p class="text-warning-500 font-bold ">We suggest keeping the number of links on the reader navigation low. There is very limited space.</p>
      {/snippet}
    </Input>

    <Input type="checkbox" name="show-hero" label="Show in Hero Section" bind:value={show_hero} class="w-full">
      {#snippet tooltip()}
        <p class="">If enabled, shows as a button in the home page hero section.</p>
      {/snippet}
    </Input>
  </div>

  <!-- Page Short Description + Preview -->
  <Input type="textarea" name="blurb" label="Blurb" rows={3} bind:value={blurb} inputClasses="w-full">
    {#snippet tooltip()}
      <p class="">This is a shortened description of the page, or just to say something fun and silly! Usually no more than 2-3 sentences.</p>
    {/snippet}
  </Input>

  <!-- Page Main Description + Preview -->
  <MarkdownEditor bind:value={desc} label="Description" name="desc">
    {#snippet tooltip()}
      <p class="">This is a full description for better SEO. Please describe in detail what is on this page. It can contain Markdown formatted text and basically just be a full blog post if you want!</p>
    {/snippet}
  </MarkdownEditor>

  <div class="space-y-1">
    <DatePicker
      name="date-released"
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
      canDelete
      deleteAction="/api/actions/pages?/delete"
      deleteUrl="/_cc_admin/settings/pages"
      handleDiscard={handleCancel}
      {id}
      {name}
      title={name}
    />
  {/snippet}
</Form>

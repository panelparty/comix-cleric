<script>

  // Svelte utility imports
  import { browser } from '$app/environment';
  import { beforeNavigate, invalidateAll } from '$app/navigation';
  import { onDestroy } from 'svelte';


  // Utility imports
  import { fallback } from '$lib/utils/utils';
  import { find } from 'lodash-es';
  import { toastError, toastSuccess } from '$lib/utils/toast.js';
  import { capitalizeString } from '$lib/utils/generate/string.js';
  import { themesCC, themesSkeleton } from '$lib/utils/defaultThemes.js';

  
  // Component imports
  import Input from '$lib/components/Admin/Inputs/Input.svelte';
  import Form from '$lib/components/Forms/Form.svelte';
  import FormControls from '$lib/components/Forms/FormControls.svelte';
  import DeleteConfirm from '$lib/components/Admin/DeleteConfirm.svelte';
  import FormPageHeader from '$lib/components/Admin/Forms/FormPageHeader.svelte';


  // Export props
  let { data } = $props();


  // Reassign server data for form inputs
  let activeTheme = $derived(data?.settings?.theme ?? 'default');
  let siteBGCol = $derived(data?.settings?.bg_color);
  let siteFGCol = $derived(data?.settings?.fg_color);
  let siteHeadingCol = $derived(data?.settings?.heading_color);
  let siteLinkCol = $derived(data?.settings?.link_color);
  let siteHeaderCol = $derived(data?.settings?.header_color);
  let readerBGCol = $derived(data?.settings?.reader_bg_color);
  let customThemes = $derived(data?.themes ?? []);


  let themeCode = $derived.by(()=>{
    return find(customThemes, {slug: activeTheme})?.code;
  });


  // Variable that automatically stays in-sync with the available colors in the theme code
  let themeColors = $derived.by(() => {
    let colors = themeCode.split('{')[1].split('}')[0].split(';\n');
    let colorList = [];

    for (let i = 0; i < colors.length; i++) {
      if (colors[i].startsWith('\t--color') && !colors[i].includes('contrast')) {
        let cssProp = colors[i].replace('\t', '').split(': ')[0];
        let value = cssProp.replace('--color-', '');
        let valueContrast = value.split('-').toSpliced(1, 0, 'contrast');
        let label = value.split('-');

        valueContrast = `${valueContrast[0]}-${valueContrast[1]}-${valueContrast[2]}`
        label = `${capitalizeString(label[0])} ${label[1]}`

        colorList.push({value: value, label: label, prop: cssProp, value_contrast: valueContrast });
      }
    };

    return colorList;
  });


  // Gets the name of the theme from the theme code [data-theme='<theme-name>'] selector
  // TODO: Improve this to target the [data-theme] text chunk directly and then pull the name regardless if single or double quotes.
  function getThemeName(code) {
    const name = code?.split(`'`)[1];
    return name;
  }


  // Resets edits made on the current page
  function handleCancel(e) {
    // Refresh all page data without relaoding
    invalidateAll();
    // Set the active theme to original state
    activeTheme = data?.settings?.theme ?? 'default';
  };


  // Checks for changes against server data
  let hasChanged = $derived.by(()=>{
    if (
      activeTheme != data?.settings?.theme
    ) {
      return true;
    }
    return false;
  });


  // Preview theme when changin selection
  function previewTheme(theme) {
    // If we are in the browser context and can access the DOM
    if (browser && document) {
      // Directly change the data-theme attribute to the selected theme
      document?.documentElement.setAttribute('data-theme', activeTheme);
    };
  };


  // Keep preview in-sync automatically
  // TODO: $effect is an escape-hatch. See if we can improve this.
  $effect(()=>{
    previewTheme();
  });


  // Handle form submission
  const handleSubmit = ({ formData }) => {
    // Append additional form data
    formData.append('id', data?.themes[0]?.id?.toString());

    // Wehn we get a response from the server
    return async ({ result, cookies }) => {
      // If the result contains a success state
      if (result?.data?.success === true) {
        // Refresh all page data without reloading
        invalidateAll();
        // Display success toast message
        toastSuccess("Settings updated!");
      } else {
        // Display error toast message
        toastError("Failed to update!", result?.data?.error);
      }
    };
  };

  // Packages theme code as a text file
  function downloadTextFile(text) {
    const blob = new Blob([text], { type: 'text/plain' });
    return URL.createObjectURL(blob);
  }

  // When leaving the page
  onDestroy(()=>{
    // Reset the active theme
    activeTheme = data?.settings?.theme?.name ?? 'default';
    // Re-run the preview to immediately change it back
    previewTheme();
  });

  // Before leaving the page
  beforeNavigate(({ cancel })=>{
    // If the page data has changes
    if (hasChanged) {
      // Prompt the user to cancel navigation
      if (!confirm('Are you sure you want to leave this page? You have unsaved changes that will be lost.')) {
        // If the user chooses to stay, cancel the navigation.
        cancel();
      }
    }
  });

</script>

<!-- Injected into page <head> element -->
<svelte:head>
  <!-- Inject edited theme code -->
  <!-- TODO: Move this to an edit page -->
  {@html `<style>` + (data?.settings?.theme?.custom_fonts?.import_url ?? '') + themeCode + `</style>`}
</svelte:head>

<!-- Page header -->
<!-- TODO: Create component -->
<section class="w-full h-full max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_min-content_1fr]">
  <FormPageHeader
    {data}
    title="Themes & Branding"
    subtitle="These settings change the appearance of your application!"
    back
  />


  <!-- Settings form -->
  <Form
    action="?/updateTheme"
    method="POST"
    onSubmit={handleSubmit}
  >
    <!-- Theme settings section label -->
    <h4 class="h4 leading-none! w-full flex items-center gap-2">Site Theme</h4>
    <!-- Select active theme -->
    <Input type="select" name="theme" label="Active Theme" allowNull={false} options={[...customThemes, ...themesSkeleton, ...themesCC]} bind:value={activeTheme}>
      {#snippet tooltip()}
        <p class="">Changing this option will only preview the theme for you until you click "Save".</p>
      {/snippet}
    </Input>
    <!-- Footer controls (sticky) -->
    {#snippet controls()}
      <FormControls disabled={!hasChanged} />
    {/snippet}
  </Form>


  <!-- Themes list. -->
  <div class="space-y-2 mt-4">
    <div class="flex items-center gap-2">
      <h4 class="h4">Custom Themes</h4>
      <a href="/_cc_admin/settings/themes/create" class="btn btn-sm preset-filled-primary-500 font-medium"><i class="ph-bold ph-plus"></i> Add Theme</a>
      <a href="/_cc_admin/settings/themes/generator/build" class="btn btn-sm preset-filled-secondary-500 font-medium"><i class="ph-bold ph-plus"></i> Open Generator</a>
    </div>
    <div class="border p-2 rounded-lg space-y-2">
      {#if data?.themes?.length > 0}
      {#each data?.themes as item}
        <div class="px-4 py-2 bg-surface-100-900 rounded-md grid grid-cols-[auto_max-content] items-center">
          <p class="text-lg font-bold">{fallback([item?.name, item?.slug])}</p>
          <div class="grid grid-cols-[repeat(3,auto)] items-center gap-2">
            <a href={downloadTextFile(item?.code)} download="{item?.slug}.css" class="btn preset-filled-success-500" aria-label="Download {fallback([item?.name, item?.slug])} CSS File"><i class="ph-bold ph-arrow-line-down"></i></a>
            <a href="/_cc_admin/settings/themes/edit/{item?.id}" class="btn preset-filled-surface-500" aria-label="Edit {fallback([item?.name, item?.slug])}"><i class="ph-bold ph-pencil-line"></i></a>
            <DeleteConfirm
              id={item?.id}
              title={fallback([item?.name, item?.slug])}
              formAction="/api/actions/themes?/delete"
              small
            />
          </div>
        </div>
      {/each}
      {/if}
    </div>
  </div>
</section>

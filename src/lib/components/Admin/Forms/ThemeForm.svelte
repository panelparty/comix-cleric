<script>
  import { onDestroy } from "svelte";
  import { beforeNavigate, goto, invalidateAll } from "$app/navigation";
  import { toastError, toastSuccess } from "$lib/utils/toast";
  import { browser } from "$app/environment";
  import { fallback } from "$lib/utils/utils";
  import { capitalizeString } from "$lib/utils/generate/string";

  import Form from "../../Forms/Form.svelte";
	import Input from "../Inputs/Input.svelte";
	import FormControls from "../../Forms/FormControls.svelte";
  import KeyboardControls from "$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte";
  import slugify from "@sindresorhus/slugify";
  
  let {
    data,
    create
  } = $props();

	let currentTheme = $derived(data?.settings?.theme);
	let themeName = $derived(data?.currentTheme?.name ?? '');
  let themeSlug = $derived(data?.currentTheme?.slug ?? '');
  let themeCode = $derived(data?.currentTheme?.code ?? '');

  let formElement = $state();

	let preview = $state(false);
	let activeTheme = $derived.by(()=>{
		return preview ? themeSlug : currentTheme;
 	});

	let hasChanged = $derived.by(()=>{
    if (create) return false;
    if (
      themeName != data?.currentTheme?.name ||
      themeSlug != data?.currentTheme?.slug ||
      themeCode != data?.currentTheme?.code
    ) {
      return true;
    }
    return false;
  });

	// Keeps theme slug in-sync with the current theme name
  // TODO: Remove when changing to multiple custom theme support
  $effect(()=>{
    if (getThemeName(themeCode) != themeSlug) {
      themeSlug = getThemeName(themeCode)
    }
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
    const regex = /\[data-theme=(['"])((?:(?!\1)[^])*)\1\]/;
    const dataBlock = code.match(regex)?.[2];
    if (dataBlock) {
      const name = dataBlock.replace(regex, '$2');
      return name;
    }
  }


  // Resets edits made on the current page
  function handleCancel(e) {
    // Refresh all page data without relaoding
    invalidateAll();
    // Set the active theme to original state
    activeTheme = data?.settings?.theme ?? 'default';
  };

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
    formData.append('id', data?.currentTheme?.id);
    formData.append('slug', themeSlug);

    // Wehn we get a response from the server
    return async ({ result, cookies }) => {
      // If the result contains a success state
      if (result?.data?.success === true) {
        if (create) {
          // Go to edit page for new theme
          goto("/_cc_admin/settings/themes/edit/" + result?.data?.new_item?.id);
        } else {
          // Refresh all page data without reloading
          invalidateAll();
        }
        // Display success toast message
        toastSuccess(`Theme ${create ? 'created' : 'updated'}!`);
      } else {
        toastError(`Failed to ${create ? 'create' : 'update'} theme!`, result?.data?.error);
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
    activeTheme = data?.settings?.currentTheme?.name ?? 'default';
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

  function handleChange(newValue) {
    themeCode = newValue;
  }

</script>

<svelte:head>
  <!-- Inject edited theme code -->
  {@html `<style>` + (data?.settings?.currentTheme?.custom_fonts?.import_url ?? '') + themeCode + `</style>`}
</svelte:head>

<KeyboardControls {formElement} save />

<Form
	action="/api/actions/themes?/{create ? 'create' : 'update'}"
	method="POST"
	onSubmit={handleSubmit}
	class="space-y-2 overflow-y-auto"
  bind:element={formElement}
>
  {#if create}
    <div class="p-4 border border-warning-500 rounded-lg bg-warning-50-950 text-warning-700-300 font-medium">
      <p class="text-xl font-bold ">Before creating a new theme:</p>
      <p class="">Be sure to visit the <a href="/_cc_admin/settings/themes/generator/build" target="_blank" class="anchor font-bold">Theme Generator</a> to get a base theme first!</p>
      <p class="">Due to changes in Skeleton UI's codebase, we've had to merge the old generator into Comix Cleric. This generator will have better intergrations in the near future.</p>
    </div>
  {/if}
	<!-- Custom theme section label -->
  <a href="../" class="anchor"><i class="ph-bold ph-arrow-left"></i> Back to Themes</a>
	<div class="flex items-center gap-2">
		<h4 class="h4 leading-none! w-fit flex items-center gap-2">Custom Theme</h4>
		<button type="button" class="btn btn-sm preset-filled-surface-700-300 font-medium" onclick={()=>{preview = !preview}}>{preview ? 'Stop Previewing' : 'Preview'}</button>
	</div>
	<!-- Input group -->
	<div class="flex flex-col md:flex-row items-start gap-4">
		<!-- Theme name input -->
		<Input type="text" name="name" label="Theme Name" required bind:value={themeName}>
			{#snippet tooltip()}
        <p class="">A name for your custom theme.</p>
			{/snippet}
		</Input>
	</div>
	<!-- Theme CSS code editor -->
	<div class="w-full">
		<Input type="textarea" name="code" label="Code" bind:value={themeCode} inputClasses="sm:max-w-full! max-h-128! font-mono tracking-tight" style="font-size: 16px; line-height: 1.25;" oninput={()=>{themeSlug = slugify(themeName)}}>
			{#snippet tooltip()}
        <p class="">The main code for your theme.</p>
			{/snippet}
		</Input>
    <!-- <CodeEditor
      value={themeCode}
      language="css"
      onChange={handleChange}
    /> -->
		{#if !create}
    <div class="space-y-2">
			<p class="text-xs text-surface-700-300 max-w-prose">This theme can be edited in better detail by downloading this file, importing it in the <a href="/_cc_admin/settings/themes/generator/import" target="_blank" class="anchor font-bold">Theme Generator</a>, making your changes, and pasting the resulting code here again.</p>
			<a href={downloadTextFile(themeCode)} download="{themeSlug}.css" class="btn-sm rounded-sm preset-filled-primary-500 font-semibold">Download Theme CSS File</a>
		</div>
    {/if}
	</div>

	<!-- Footer controls (sticky) -->
	{#snippet controls()}
		<FormControls
			disabled={!hasChanged}
			canDelete
			id={data?.currentTheme?.id}
			title={fallback([themeName, themeSlug])}
			name={fallback([themeName, themeSlug])}
			deleteAction="/api/actions/themes?/delete"
			deleteUrl="/_cc_admin/settings/themes"
		/>
	{/snippet}
</Form>
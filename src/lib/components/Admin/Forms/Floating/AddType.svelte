<script>
	//Svelte utilities 
	import { invalidateAll } from "$app/navigation";

	// Utilities
	import { toastError, toastSuccess } from "$lib/utils/toast";
	import slugify from "@sindresorhus/slugify";

	// Skeleton UI components
	import { Modal } from "@skeletonlabs/skeleton-svelte";

	// Components
	import Form from "../../../Forms/Form.svelte";
	import Input from ".../Inputs/Input.svelte";
	import FormControls from "../../../Forms/FormControls.svelte";
	import KeyboardControls from "$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte";
    import { acceptedFileTypes } from "$lib/utils/validation/schema";

	// Props
	let {
		data,
		type,
		open = $bindable(false),
		create
	} = $props();

	// Data destructuring
	let id = $derived(data?.id); // Page ID - int (nullable)
	let status = $derived(data?.status ?? 'draft'); // Page status - string - default `draft` - required
  let title = $derived(data?.name ?? ''); // Page title - string - nullable
  let slug = $derived(data?.slug ?? '');  // Page URL slug - string(slug) - required
  let blurb = $derived(data?.blurb ?? ''); // Blurb (short description) - string(plaintext/Markdown)
  let description = $derived(data?.description ?? ''); // Description - string(plaintext/Markdown)
  let cover = $derived(data?.cover); // Cover Image/Preview - string(UUID/filename+ext)

	// Form element reference
	let formElement = $state();

	// Form submission logic
  const handleSubmit = ({ formData }) => { // `formData` is passed by the `use:enhance` attribute on the form element.
    formData.append('id', id); // Append preview file to submitted form data.
    formData.append('cover', JSON.stringify(cover?.id ?? cover)); // Append preview file to submitted form data.
    formData.append('type', type); // Append preview file to submitted form data.

    // Once we get a response from the server...
    return async ({ result, cookies }) => {
      if (result?.data?.success === true) { // If the result did not return an `error` in the response object...
				invalidateAll(); // Force-refresh all page data to ensure we are getting the latest server data.
				open = false;

        const actionUsed = result?.data?.action; // Assign a constant to whatever "action" was used to submit the form.

        if (actionUsed === 'draft') { // If the action was `draft`...
          toastSuccess(`Category set as draft!`); // ...display a success toast for `draft`.
        } else if (actionUsed === 'published') { // If the action was otherwise `published`...
          toastSuccess(`Category published!`); // ...display a success toast for `published`.
        } else if (actionUsed === 'archived') { // If the action was otherwise `archived`...
          toastSuccess(`Category archived!`); // ...display a success toast for `archived`.
        } else { // Otherwise...
          toastSuccess(`Category ${create ? 'created' : 'updated'}!`); // ...display a generic success toast for creating/updating the page.
        }

      } else { // Otherwise...
        toastError("Failed to update cast member!", result?.data?.error); // ...display an error toast with the error from the response.
      }
    };
  };

	// Discard handler
	function handleDiscard() {
		status = data?.status ?? 'draft';
		title = data?.name ?? '';
		slug = data?.slug ?? '';
		blurb = data?.blurb ?? '';
		description = data?.description ?? '';
		cover = data?.cover ?? null;
		open = false;
	};

</script>

<KeyboardControls {formElement} save />

<!-- Modal component (Skeleton UI) -->
<Modal
  {open}
  onOpenChange={(e) => (open = e.open)}
  triggerClasses="btn preset-filled-primary-500 capitalize"
  backdropClasses="backdrop-blur-sm"
>
  <!-- Trigger -->
  {#snippet trigger()}
		<!-- Modal button label -->
		<i class="ph-bold ph-plus"></i> {create ? 'New' : 'Edit'} Category
	{/snippet}
  <!-- Contents -->
  {#snippet content()}
    <!-- Authentication form component -->
    <Form
			action={create ? `/api/actions/types?/create` : `/api/actions/types?/update`}
			method="POST"
			enctype="multipart/form-data"
			onSubmit={handleSubmit}
			class="relative px-4 pt-4 border bg-surface-50-950 space-y-2 overflow-y-auto"
			bind:this={formElement}
		>
			<!-- Form heading -->
			<h4 class="h4 capitalize">{create ? 'Add' : 'Update'} {type} Category</h4>

			<!-- Page Title & Slug -->
			<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
				<!-- Title input -->
				<Input type="text" required name="title" label="Title" bind:value={title} inputClasses="w-full" >
					{#snippet tooltip()}
						<p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required.</p>
						<p class="leading-tight font-bold">The canonical title of the update. Can contain spaces and special characters.</p>
					{/snippet}
				</Input>

				<!-- Slug input -->
				<Input type="text" required name="slug" label="Slug" bind:value={slug} class inputClasses="ig-input" wrapperClasses="input-group grid grid-cols-[auto_min-content]">
					{#snippet tooltip()}
						<p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required and must be unique.</p>
						<p class="leading-tight font-bold">A slugified (URL-safe) unique identifier (generally of the title) used to look up a specific page, but you can choose any pattern you want, as long as it does not contain capital letters or special characters.</p>
						<p class="leading-tight font-bold">The attached button will generate or regenerate the slug from the provided Update Title.</p>
					{/snippet}
					<button aria-label="{slug ? 'Regenerate' : 'Generate'} slug" title="{slug ? 'Regenerate' : 'Generate'} slug" type="button" class="ig-btn h-full aspect-square preset-filled-surface-200-800 grid place-content-center p-0" onclick={()=>{slug = slugify(title ?? '')}}><i class="text-lg ph-bold ph-{slug ? 'arrows-clockwise' : 'magic-wand'}"></i></button>
				</Input>
			</div>

			<!-- Page Short Description + Preview -->
			<Input type="textarea" name="blurb" label="Blurb" rows={1} bind:value={blurb} inputClasses="w-full">
				{#snippet tooltip()}
					<p class="leading-tight font-bold">This is a shortened description of the update, or just to say something fun and silly! Usually no more than 2-3 sentences.</p>
				{/snippet}
			</Input>

			<!-- Page Short Description + Preview -->
			<Input type="textarea" name="description" label="Description" rows={2} bind:value={description} inputClasses="w-full">
				{#snippet tooltip()}
					<p class="leading-tight font-bold">This is a shortened description of the update, or just to say something fun and silly! Usually no more than 2-3 sentences.</p>
				{/snippet}
			</Input>

			<!-- Cover image -->
			<Input type="media-import-simple" name="cover" label="Cover/Thumbnail" fetchTypes={["image"]} accept={[...acceptedFileTypes?.image]} bind:value={cover} inputClasses="w-full">
				{#snippet tooltip()}
					<p class="leading-tight font-bold">A single image in square or 4:5 aspect ratio (1800 x 2250px). Will be cropped to fit in the center automatically. The image is not altered.</p>
					<p class="text-warning-700-300 font-black underline">Max image size is 10,000 x 10,000 pixels.</p>
				{/snippet}
			</Input>

			{#snippet controls()}
				<FormControls
					useStatus
					{handleDiscard}
					{status}
				/>
			{/snippet}
		</Form>
  {/snippet}
</Modal>
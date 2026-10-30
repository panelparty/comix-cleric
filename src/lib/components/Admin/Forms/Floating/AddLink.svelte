<script>
	// Svelte utilities
	import { invalidateAll } from "$app/navigation";

	// Utilities
	import slugify from "@sindresorhus/slugify";
	import { toastError, toastSuccess } from "$lib/utils/toast";
	import { phosphorIcons } from "$lib/utils/icons";

	// Components
	import Form from "../../../Forms/Form.svelte";
	import Input from ".../Inputs/Input.svelte";
	import FormControls from "../../../Forms/FormControls.svelte";
	import KeyboardControls from "$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte";

	// Skeleton UI components
	import { Modal } from "@skeletonlabs/skeleton-svelte";

	// Props
	let {
		data,
		type,
		open = $bindable(false),
		create,
		onSubmit = () => {}
	} = $props();

	// Data destructuring
	let id = $derived(data?.id);
	let status = $derived(data?.status ?? 'draft');
  let label = $derived(data?.name ?? '');
  let slug = $derived(data?.slug ?? '');
  let url = $derived(data?.url ?? '');
  let icon = $derived(data?.icon ?? '');
  let color = $derived(data?.color ?? '');
  let new_tab = $derived(data?.new_tab ?? '');
  let custom_css = $derived(data?.custom_css ?? '');

	// Form element reference
	let formElement = $state();

	// Form submission logic
  const handleSubmit = ({ formData }) => {
    formData.append('id', id);
    
    // Once we get a response from the server...
    return async ({ result, cookies }) => {
      if (result?.data?.success === true) {
				open = false;
				invalidateAll();

        const actionUsed = result?.data?.action;

        if (actionUsed === 'draft') {
          toastSuccess(`Link set as draft!`);
        } else if (actionUsed === 'published') {
          toastSuccess(`Link published!`);
        } else if (actionUsed === 'archived') {
          toastSuccess(`Link archived!`);
        } else {
          toastSuccess(`Link ${create ? 'created' : 'updated'}!`);
        }

      } else {
        toastError("Failed to update cast member!", result?.data?.error);
      }
    };
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
  {#snippet trigger()}<i class="ph-bold ph-plus"></i> {create ? 'Add' : 'Update'} Category{/snippet}
  <!-- Contents -->
  {#snippet content()}
		<!-- Modla heading -->
		<h4 class="h4">{create ? 'Add' : 'Update'} Link</h4>
    <!-- Authentication form component -->
    <Form
			action={create ? `/api/actions/links?/create` : `/api/actions/links?/update`}
			method="POST"
			enctype="multipart/form-data"
			onSubmit={handleSubmit}
			class="relative px-4 pt-4 border bg-surface-50-950 space-y-2 overflow-y-auto"
			bind:this={formElement}
		>
			<!-- Page Title & Slug -->
			<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-2">
				<!-- Title input -->
				<Input type="text" required name="label" label="Label" bind:value={label} inputClasses="w-full" >
					{#snippet tooltip()}
						<p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required.</p>
						<p class="leading-tight font-bold">The canonical title of the update. Can contain spaces and special characters.</p>
					{/snippet}
				</Input>

				<!-- Slug input -->
				<Input type="text" required name="slug" label="Slug" bind:value={slug} class inputClasses="ig-input" wrapperClasses="input-group grid grid-cols-[auto_min-content]">
					{#snippet tooltip()}
						<p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required and must be unique.</p>
						<p class="leading-tight font-bold">A slugified (URL-safe) unique identifier (generally of the Label) used to look up a specific link.</p>
						<p class="leading-tight font-bold">The attached button will generate or regenerate the slug from the provided Label.</p>
					{/snippet}
					<button aria-label="{slug ? 'Regenerate' : 'Generate'} slug" title="{slug ? 'Regenerate' : 'Generate'} slug" type="button" class="ig-btn h-full aspect-square preset-filled-surface-200-800 grid place-content-center p-0" onclick={()=>{slug = slugify(title ?? '')}}><i class="text-lg ph-bold ph-{slug ? 'arrows-clockwise' : 'magic-wand'}"></i></button>
				</Input>
			</div>

			<!-- Link URL -->
			<Input type="text" required name="url" label="URL/Path" bind:value={url} inputClasses="w-full" >
				{#snippet tooltip()}
					<p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required.</p>
					<p class="leading-tight font-bold">The canonical title of the update. Can contain spaces and special characters.</p>
				{/snippet}
			</Input>
			
			<!-- External link -->
			<Input type="checkbox" name="new_tab" label="Open New Tab" bind:value={new_tab} inputClasses="w-full" >
				{#snippet tooltip()}
					<p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required.</p>
					<p class="leading-tight font-bold">The canonical title of the update. Can contain spaces and special characters.</p>
				{/snippet}
			</Input>

			<div class="grid grid-cols-1 md:grid-cols-3">
				<!-- Icon select -->
				<div class="inline-flex items-end gap-2">
					<!-- Icon preview -->
					<div class="size-12 border rounded-md flex items-center justify-center pattern-checker">
						<i class="ph-bold ph-{icon} text-2xl"></i>
					</div>
					
					<!-- Icon select -->
					<Input type="select" name="icon" label="Icon" options={phosphorIcons} optionValues="name" bind:value={icon} inputClasses="w-full" >
						{#snippet tooltip()}
							<p class="">An icon to associate with this link. Typically used on buttons.</p>
						{/snippet}
					</Input>
				</div>
				<!-- Color input -->
				<!-- <Input type="text" name="color" label="Color" bind:value={color} inputClasses="w-full" >
					{#snippet tooltip()}
						<p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required.</p>
						<p class="leading-tight font-bold">The canonical title of the update. Can contain spaces and special characters.</p>
					{/snippet}
				</Input> -->
				<!-- Custom CSS -->
				<!-- <Input type="text" name="custom_css" label="Custom CSS" bind:value={custom_css} inputClasses="w-full" >
					{#snippet tooltip()}
						<p class="text-xs leading-tight font-bold text-error-700-300 italic">This field is required.</p>
						<p class="leading-tight font-bold">The canonical title of the update. Can contain spaces and special characters.</p>
					{/snippet}
				</Input> -->
			</div>

			{#snippet controls()}
				<FormControls
					useStatus
					{status}
				/>
			{/snippet}
		</Form>
  {/snippet}
</Modal>
<script>
  // Svelte utilities
	import { invalidateAll } from "$app/navigation";
  
  // Utilities
	import { pages } from "$lib/ComixClericLib/data/default";
	import { toastError, toastSuccess } from "$lib/utils/toast";
	import { statusPost } from "$lib/utils/validation/options";
  
  // Skeleton UI components
	import { Modal } from "@skeletonlabs/skeleton-svelte";
  
  // Components
	import Form from "$lib/components/Forms/Form.svelte";
  import Input from "../../Inputs/Input.svelte";
	
// Props
  let {
		triggerClasses,
	} = $props();

  // Form data
	let status = $state();
	let new_page = $state();
	let slug_override = $state();

  // Form element reference
	let formElement;

  // Modal state
	let open = $state(false);

  // Cancel action
	function cancel() {
    status = null;
    new_page = null;
    slug_override = null;
		open = !open;
	}

  // Form submission handler
	const handleSubmit = ({ formData }) => {
		return async ({ result }) => {
      if (result?.data?.success === true) {
        // Reload page data
        invalidateAll();
        // Display success toast message
        toastSuccess("Page added!");
      } else {
        // Display error toast message
        toastError("Failed to add page!", result?.data?.error);
      }
    };
	}

  // Submit button state
	const canUpdate = $derived.by(() => {
    if (
      new_page && status
    ) return true
    return false
  });
</script>

<!-- Skeleton UI Modal component -->
<Modal
  {open}
  onOpenChange={(e)=>{open = !open}}
  triggerClasses="btn preset-filled-surface-500 {triggerClasses}"
  triggerAriaLabel="Add default page"
  contentClasses="max-h-[calc(100dvh-2rem)] border border-surface-300-700 w-full max-w-[calc(100vw-2rem)] md:max-w-3xl shadow-xl shadow-surface-950/10 bg-surface-50-950 p-6 rounded-lg overflow-y-auto space-y-2"
>
  {#snippet trigger()}
    <!-- Modal button label -->
    <i class="ph-bold ph-plus"></i> Add Default Page
  {/snippet}
  {#snippet content()}
    <!-- Modal heading -->
    <h3 class="h3 capitalize">Add Default Page</h3>
    <!-- Main form -->
    <Form
			class="space-y-8 overflow-y-auto"
			action="/api/actions/pages?/createDefault"
			method="POST"
			enctype="multipart/form-data"
			onSubmit={handleSubmit}
			bind:this={formElement}
		>
      <!-- New page status -->
      <Input type="select" name="status" label="Status" selected={4} options={statusPost} bind:value={status}>
        {#snippet tooltip()}
          <p class="">This option sets the status value of the page when it is created.</p>
        {/snippet}
      </Input>

      <!-- New page template -->
      <Input type="select" name="slug" label="Selected Page" options={pages} bind:value={new_page}>
        {#snippet tooltip()}
          <p class="">This chooses the default page you'd like to create.</p>
        {/snippet}
      </Input>

      <!-- New page slug override -->
      <Input type="text" name="slug-override" label="Override Slug" bind:value={slug_override}>
        {#snippet tooltip()}
          <p class="">If the slug of the default page will collide with another (slugs must be unique), you can use this field to override the default page slug.</p>
        {/snippet}
      </Input>

      <!-- Form controls -->
      {#snippet controls()}
        <button type="submit" class="btn preset-filled-success-300-700" disabled={!canUpdate}>Add Page</button>
        <button type="button" class="btn preset-filled-surface-300-700" onclick={cancel}>Cancel</button>
      {/snippet}
		</Form>
  {/snippet}
</Modal>

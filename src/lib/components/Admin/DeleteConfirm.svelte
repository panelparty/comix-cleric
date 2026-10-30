<script>

  // Svelte utility imports
  import { goto, invalidateAll } from "$app/navigation";
  import { enhance } from "$app/forms";

  // Utility imports
  import { Modal } from "@skeletonlabs/skeleton-svelte";
    import { toastError, toastSuccess } from "$lib/utils/toast";

  // Export props
  let {
    id,
    type,
    name = "this item",
    label = "Delete",
    formAction,
    href,
    open,
    class: className,
    small,
    ...restProps
  } = $props()

  // Setup loading state
  let loading = $state(false);

  // Closes modal
  function closeModal() {
    open = false;
  };

  // Handles form submission
  const handleSubmit = (event) => {
    // Add new form data
    event.formData.append('id', id);
    event.formData.append('type', type);

    // Set loading state
    loading = true;

    // Await a response from the request
    return async ({ result }) => {
      // If the response contains a success state
      if (result?.data?.success === true) {
        // Display a success toast message
        toastSuccess("Item deleted!");
        // If a redirect url was provided
        if (href) {
          // Go to the new url
          goto(href);
        } else {
          // Refresh the current page data without reloading
          invalidateAll();
        }
        // Close the modal
        closeModal();
      } else {
        // Display an error toast message
        toastError("Error deleting item:", result?.data?.error);
      }

      // Regardless of the result, set loading state
      loading = false;
    };
  };

  // Discard changes
  function handleCancel() {
    // Close the modal
    closeModal();
  };

</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="" onclick={(e) => { e.preventDefault();}} {...restProps}>
  <!-- Modal component (Skeleton UI) -->
  <Modal
    {open}
    onOpenChange={(e) => (open = e.open)}
    classes="flex items-center"
    triggerClasses="button w-full preset-filled-error-500 text-error-50 {className}"
    contentClasses="max-h-[calc(100dvh-2rem)] w-full overflow-y-auto shadow-xl shadow-surface-950/10 w-[calc(100vw-2rem)] md:max-w-sm bg-surface-50-950 p-6 "
  >
    <!-- Modal trigger -->
    {#snippet trigger()}
      <i class="ph-bold ph-trash"></i> {!small && label ? label : ''}
    {/snippet}
    <!-- Modal contents -->
    {#snippet content()}
      <div class="w-full relative">
        <!-- Header -->
        <div class="mb-4">
          <!-- Delete heading -->
          <h5 class="h5 leading-none! text-center text-pretty">Are you sure you would like to permanently delete <mark class="mark">"{name}"</mark>?</h5>
          <!-- Delete disclaimer -->
          <p>This action cannot be undone.</p>
        </div>
        <!-- Form container -->
        <div>
          <!-- Deletion form -->
          <form
            class="space-y-4"
            method="POST"
            action={formAction}
            use:enhance={handleSubmit}
            enctype="multipart/form-data"
          >
            <!-- Form controls -->
            <div class="flex justify-between bg-surface-50-950">
              <!-- Cancel/discard button -->
              <button class="btn preset-filled-surface-500 " type="button" onclick={()=>{handleCancel()}} disabled={loading}>Cancel</button>
              <!-- Delete button (submit) -->
              <button class="btn preset-filled-error-500 " type="submit" disabled={loading}>Confirm Deletion</button>
            </div>
          </form>
        </div>
      </div>
    {/snippet}
  </Modal>
</div>

<!--
@component
## DeleteConfirm
Displays a delete button that will prompt the user to confirm they meant to perform this action.

### Prop Definitions
- `id` - The id of the item to be deleted.
- `type` - The type of item to be deleted. (Types/categories only)
- `title` - The title of the item for visual confirmation. *Default: `this item`*
- `formAction` - The form action triggered when confirming the deletion.
- `href` - If a URL or path is provided, it will redirect there after success.
- `open` - Allows the parent component to control the open state.
- `class` - Allows for arbitrary Tailwind classes to be used to modify the trigger button styling.
- `small` - Will display only the icon on the trigger button.

@example
``` html
<DeleteConfirm
  id={item?.id}
  title={item?.title}
  formAction="?/deleteItem"
  href="/"
  open={false}
  class="hover:bg-red-500 hover:text-white"
  small
/>
```
-->

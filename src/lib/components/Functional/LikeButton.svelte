<!-- TODO: Imported from old project. Fix for new project. -->
<script>

  import { enhance } from "$app/forms";

  let { postId, isLiked } = $props()

  let isLoading = $state(false)

  const handleSubmit = ({ formData }) => { // `formData` is passed by the `use:enhance` attribute on the form element.
    appendData(formData, 'id', id);

    // Once we get a response from the server...
    return async ({ result, cookies }) => {
      if (result?.data?.success === true) { // If the result did not return an `error` in the response object...
        if (create) { // ...and, if the component is set to `create` mode...
          const new_item = result?.data?.new_item; // ...set a constant equal to the new page data.
          goto(`/_cc_admin/updates/edit/${new_item?.id}`); // Then, take us to the `edit` page for the page we just created.
        } else { // Otherwise...
          invalidateAll(); // Force-refresh all page data to ensure we are getting the latest server data.
        }

        const actionUsed = result?.data?.action; // Assign a constant to whatever "action" was used to submit the form.

        if (actionUsed === 'draft') { // If the action was `draft`...
          toastSuccess(`Page set as draft!`); // ...display a success toast for `draft`.
        } else if (actionUsed === 'scheduled') { // If the action was otherwise `scheduled`...
          toastSuccess(`Page scheduled for ${formatDateLong(dateReleased)}!`); // ...display a success toast for `scheduled` with the scheduled date.
        } else if (actionUsed === 'published') { // If the action was otherwise `published`...
          toastSuccess(`Page published!`); // ...display a success toast for `published`.
        } else if (actionUsed === 'archived') { // If the action was otherwise `archived`...
          toastSuccess(`Page archived!`); // ...display a success toast for `archived`.
        } else { // Otherwise...
          toastSuccess(`Page ${create ? 'created' : 'updated'}!`); // ...display a generic success toast for creating/updating the page.
        }

      } else { // Otherwise...
        toastError("Failed to update page!", result?.data?.error); // ...display an error toast with the error from the response.
      }
    };
  };
</script>

<form method="POST" {action} use:enhance={handleSubmit}>
  <button
    disabled={isLoading}
    aria-label="{isLiked ? 'unlike' : 'like'} post"
    onclick={handleLike}
    class="btn preset-outlined-surface-300-700"
  >
    <i class="bx {isLiked ? 'bxs' : 'bx'}-heart {isLiked ? 'text-error-500' : 'text-surface-300-700'}"></i>
  </button>
</form>

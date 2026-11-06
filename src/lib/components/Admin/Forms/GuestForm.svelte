<script>
  // Svelte built-in utility imports
  import { goto, invalidateAll } from '$app/navigation';
  
  // Utilities
  import { toastError, toastSuccess } from '$lib/utils/toast.js';
  import { acceptedFileTypes, createZodValidator, usernameSchema } from '$lib/utils/validation/schema';
  
  // Components
  import Loader from '$lib/components/Placeholders/Loader.svelte';
  import Input from '../Inputs/Input.svelte';
  import Form from '../../Forms/Form.svelte';
  import FormControls from '../../Forms/FormControls.svelte';
  import KeyboardControls from '$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte';
  import MarkdownEditor from '../Inputs/MarkdownEditor.svelte';

  // Props
  let {
    create,
    navigate = true,
    data
  } = $props();

  // Page state
  let loading = $state(false);

  // Reactive data/variable assignment
  let id = $derived(data?.guest?.id ?? null); // User ID - UUID (nullable for `create` mode (will auto-generate))
  let avatar = $derived(data?.guest?.avatar ?? null); // User avatar - string - nullable
  let displayname = $derived(data?.guest?.displayname ?? null); // User display name - string - nullable
  let username = $derived(data?.guest?.username ?? data?.guest?.name ?? null); // User username - string (URL-friendly) - nullable
  let projectRole = $derived(data?.guest?.project_role ?? null); // User username - string (URL-friendly) - nullable
  let description = $derived(data?.guest?.description ?? null); // User username - string (URL-friendly) - nullable
  let title = $derived(displayname ?? username ?? 'User'); // Title for FormControls

  // Input validation
  const validateUsername = createZodValidator(usernameSchema);


  // Check for changes between current values and server data
  let hasChanges = $derived.by(() => {
    if (
      avatar != data?.guest?.avatar ||
      displayname != data?.guest?.displayname ||
      username != data?.guest?.username ||
      projectRole != data?.guest?.project_role ||
      description != data?.guest?.description
    ) {
      return true;
    } else {
      return false;
    }
  });


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
    loading = true;
    formData.append('id', id); // Append preview file to submitted form data.
    formData.append('avatar', avatar?.id ?? avatar); // Append preview file to submitted form data.

    // Once we get a response from the server...
    return async ({ result, cookies }) => {
      if (result?.data?.success) { // If the result did not return an `error` in the response object...
        toastSuccess(`User ${create ? 'created' : 'updated'}!`); // ...display a generic success toast for creating/updating the page.
        if (create && navigate) {
          goto(`/_cc_admin/users/edit-guest/${result?.data?.new_item?.id}`);
        } else {
          invalidateAll(); // Force-refresh all page data to ensure we are getting the latest server data.
        }
      } else { // Otherwise...
        toastError(`Failed to ${create ? 'create account' : 'update account details'}!`, result?.data?.error); // ...display an error toast with the error from the response.
      }
      loading = false;
    };
  };


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
  action="/api/actions/guests?/{create ? 'create' : 'update'}"
  method="POST"
  enctype="multipart/form-data"
  onSubmit={handleSubmit}
  class="relative px-4 pt-4 border border-surface-200-800 space-y-2 overflow-y-auto"
  bind:element={formElement}
>
  <!-- Avatar Image Upload + Preview -->
  <Input
    type="media-import-simple"
    name="avatar"
    label="Avatar"
    bind:value={avatar}
    fetchTypes={["image"]}
    accept={[...acceptedFileTypes?.image]}
    aspect="aspect-square"
  >
    {#snippet tooltip()}
      <p class="">The image used to represent the user publicly.</p>
      <p class="text-warning-700-300 font-black underline">Max image size is 10,000 x 10,000 pixels.</p>
    {/snippet}
  </Input>


  <!-- Displayname & Username -->
  <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input type="text" name="displayname" label="Displayname" inputClasses="w-full" bind:value={displayname}>
      {#snippet tooltip()}
        <p class="">Please add info.</p>
      {/snippet}
    </Input>
    <Input type="text" name="username" label="Username" required inputClasses="w-full" bind:value={username} oninput={validateUsername}>
      {#snippet tooltip()}
        <p class="">Please add info.</p>
      {/snippet}
    </Input>
  </div>


  <Input type="text" name="project_role" label="Project Role" inputClasses="w-full" bind:value={projectRole}>
    {#snippet tooltip()}
      <p class="">Please add info.</p>
    {/snippet}
  </Input>


  <MarkdownEditor bind:value={description} label="Bio" name="desc">
    {#snippet tooltip()}
      <p class="leading-tight font-bold">This is a user's biography/description. It can contain Markdown formatted text and basically just be a full blog post if you want!</p>
    {/snippet}
  </MarkdownEditor>


  {#snippet controls()}
    <FormControls
      canDelete={!create}
      {id}
      title={username}
      name={username}
      deleteAction="/api/actions/guests?/delete"
      deleteUrl="/_cc_admin/users"
      handleDiscard={handleCancel}
    />
  {/snippet}
</Form>


{#if loading === true}
  <Loader />
{/if}

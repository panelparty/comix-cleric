<script>
  // Svelte utilities
  import { goto, invalidateAll } from '$app/navigation';

  // Utilities
  import { find } from 'lodash-es';
  import { toastError, toastSuccess } from '$lib/utils/toast.js';
  import { acceptedFileTypes, createZodValidator, emailSchema, passSchema, usernameSchema } from '$lib/utils/validation/schema';
  
  // Skeleton UI components
  import { Modal } from '@skeletonlabs/skeleton-svelte';

  // Components
  import Loader from '$lib/components/Placeholders/Loader.svelte';
  import Form from '../../Forms/Form.svelte';
  import FormControls from '../../Forms/FormControls.svelte';
  import Input from '../Inputs/Input.svelte';
  import Image from '$lib/components/Media/Image.svelte';
  import KeyboardControls from '$lib/components/Accessibility/KeyboardControls/KeyboardControls.svelte';
  import ChangeEmailForm from './ChangeEmailForm.svelte';
  import ResetPassForm from './ResetPassForm.svelte';
  import MarkdownEditor from '../Inputs/MarkdownEditor.svelte';

  // Props
  let {
    create,
    data,
  } = $props();

  // Destructure data
  let userData = $derived(data?.userData ?? null);
  let id = $derived(userData?.id ?? null);
  let avatar = $derived(userData?.avatar ?? null);
  let email = $derived(userData?.email ?? null);
  let displayname = $derived(userData?.displayname ?? null);
  let username = $derived(userData?.username ?? userData?.name ?? null);
  let description = $derived(userData?.description ?? null);
  let projectRole = $derived(userData?.project_role ?? null);
  let isCurrentUser = $derived(userData?.id === data?.user?.id);
  let isOwner = $derived(userData?.owner);
  let isCurrentUserOwner = $derived(data?.user?.owner);
  let isLastOwner = $derived(data?.ownerCount < 2);
  let title = $derived(displayname || username || 'User');
  let password = $state(null);
  
  // Form state
  let loading = $state(false);
  let showEmail = $state(false);
  let openDetails = $state(false);
  let openEmail = $state(false);
  let openPass = $state(false);
  let formElement = $state();
  
  // Roles
  const roles = [
    {label: "User", value: "user"},
    {label: "Admin", value: "admin"},
  ];
  let currentRole = $derived.by(()=>{return find(roles, { value: userData?.role ?? "admin" })});
  let selectedRole = $derived(isOwner ? "admin" : currentRole?.value);

  // Input validation
  const validateEmail = createZodValidator(emailSchema);
  const validatePassword = createZodValidator(passSchema);
  const validateUsername = createZodValidator(usernameSchema);

  // Check for changes between the current variable states and their original dataset from the server.
  // Used in disabling the save/discard buttons if nothing has changed.
  //-- Currently, there is a glaring issue in that some data is immediately modified on page load, so you will ALWAYS be able to save/discard changes.
  //-- Not to mention many of these conditions cannot apply to the data types we're comparing.
  //-- We have the option to use `zod` (already installed) both on the front/back end for type-checking and validation.
  let hasChanged = $derived.by(() => {
    if ( // If any of these values do not match...
      avatar != userData?.avatar || // string (plaintext)
      email != userData?.email || // string
      password != userData?.password || // string
      displayname != userData?.displayname || // string
      username != (userData?.username ?? userData?.name) || // string
      description != userData?.description || // string
      projectRole != userData?.project_role || // string
      selectedRole != currentRole?.value
    ) {
      return true; // Changes exist.
    } else { // Otherwise...
      return false; // Changes do not exist.
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
  const handleSubmit = ({ formData }) => {
    loading = true;
    formData.append('id', id);
    formData.append('avatar', avatar?.id ?? avatar);
    formData.append('owner', isOwner);
    formData.append('role', selectedRole);

    return async ({ result, cookies }) => {
      if (result?.data?.success === true) {
        toastSuccess(`User ${create === true ? 'created' : 'updated'}!`);
        if (create === true) {
          goto(`/_cc_admin/users/edit/${result?.data?.new_item?.user?.id}`);
        } else {
          invalidateAll();
        }
      } else {
        toastError(`Failed to ${create ? 'create staff account' : 'update staff details'}!`, result?.data?.error || 'Unknown error');
      }
      loading = false;
    };
  };

  // -- File handlers -- //
  // Set preview when uploading a new image.
  function handleUploadedAvatar (uploadResponse) {
    avatar = uploadResponse?.id;
  };

  // Set preview when selecting a new image from the media library.
  function handleLibraryAvatar(selectedFile) {
    avatar = selectedFile?.id; // Replace our preview image with the selected file.
  }

  // Force-reset back to original server copy. Almost like refreshing the page, but only reloading the data.
  function handleCancel() {
    invalidateAll();
  }

  // Allows the accordion to track which panels are open.
  // TODO: Rename to fit the section better.
  let value = $state([]);
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
<!-- `onSubmit` allows us to submit forms and process related data before/after without reloading the page. -->
<Form
  action="/api/actions/staff?/{create ? 'create' : 'update'}"
  method="POST"
  enctype="multipart/form-data"
  onSubmit={handleSubmit}
  class="relative px-4 pt-4 border border-surface-200-800 space-y-2 overflow-y-auto"
  bind:element={formElement}
>

  {#if !create && data?.user?.id === userData?.id}
    <div class="w-full grid gris-rows-3 sm:grid-rows-1 sm:grid-cols-3 gap-2">
      <button
      type="button"
        class="w-full leading-none! text-sm font-medium btn preset-filled-primary-500 gap-1 px-6 py-3 xl:px-3 xl:py-2 rounded-md"
        onclick={() => {
          openEmail = !openEmail;
        }}><i class="ph-bold ph-arrow-clockwise"></i>Change Email</button
      >
      <button
      type="button"
        class="w-full leading-none! text-sm font-medium btn preset-filled-primary-500 gap-1 px-6 py-3 xl:px-3 xl:py-2 rounded-md"
        onclick={() => {
          openPass = !openPass;
        }}><i class="ph-bold ph-arrow-clockwise"></i>Change Password</button
      >
    </div>
  {/if}

  {#if !create && (data?.isAdmin || data?.user?.id === id)}
    <Input
      type="readonly"
      label="Current Email Address"
      value={email}
      canHide
      inputClasses="sm:w-fit"
      bind:show={showEmail}
    />
  {/if}

  {#if create}
  <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
    <Input type="text" name="email" label="Email" required inputClasses="w-full" bind:value={email} oninput={validateEmail}>
      {#snippet tooltip()}
        <p class="">Must be a valid, accessible email address.</p>
      {/snippet}
    </Input>
    <Input type="password" name="password" label="Password" required inputClasses="w-full" bind:value={password} oninput={validatePassword}>
      {#snippet tooltip()}
        <p class="">Min length: 8. Must contain 1 uppercase, lowercase, number, & special character.</p>
      {/snippet}
    </Input>
  </div>
  {/if}

  <!-- Avatar Image Upload + Preview -->
  <Input type="media-import-simple" name="avatar" label="Avatar" fetchTypes={["image"]} accept={[...acceptedFileTypes?.image]} aspect="aspect-square" bind:value={avatar}>
    {#snippet tooltip()}
      <p class="">A custom image used to easily visually identify an account.</p>
      <p class="text-warning-700-300 font-black underline">Max image size is 10,000 x 10,000 pixels.</p>
    {/snippet}
    {#snippet preview()}
      <Image src="/api/media/{avatar?.filename_disk}" wrapperClasses="avatar-preview square pattern-checker" />
    {/snippet}
  </Input>

  <!-- Input group -->
  <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Display Name -->
    <Input type="text" name="displayname" label="Display Name" bind:value={displayname} inputClasses="w-full" placeholder="Panelope">
      {#snippet tooltip()}
        <p class="">This is a custom cosmetic name to be displayed in place of the name.</p>
        <p class="">This can be a full legal name, a first or last name only, the name with different capitlization, or whatever you're feeling in the moment!</p>
        <p class="">There are no character limitations to this field.</p>
      {/snippet}
    </Input>

    <!-- Username -->
    <Input type="text" name="username" label="Username" required bind:value={username} inputClasses="w-full" placeholder="panelope" oninput={validateUsername}>
      {#snippet tooltip()}
        <p class="">This is a unique username to be used as the main profile identifier.</p>
        <p class="">Must be unique (cannot already exist in the database).</p>
        <p class="">Only letters, numbers, hypens, underscores, periods are allowed.</p>
      {/snippet}
    </Input>
  </div>

  <!-- Role -->
  <Input type="text" name="project_role" label="Project Role" bind:value={projectRole} inputClasses="w-full" placeholder="Creator, Artist, Writer, etc...">
    {#snippet tooltip()}
      <p class="">A custom label that specifies the user's role in the project.</p>
    {/snippet}
  </Input>

  <!-- Description/Bio -->
  <MarkdownEditor bind:value={description} label="Bio" name="desc">
    {#snippet tooltip()}
      <p class="leading-tight font-bold">This is a user's biography/description. It can contain Markdown formatted text and basically just be a full blog post if you want!</p>
    {/snippet}
  </MarkdownEditor>

  <!-- Controls -->
  {#snippet controls()}
    <FormControls
      canDelete={!create && !isCurrentUser}
      {id}
      {title}
      name={title}
      deleteAction="/api/actions/staff?/delete"
      deleteUrl="/_cc_admin/users"
      handleDiscard={handleCancel}
    />
  {/snippet}
</Form>

<!-- Loading -->
{#if loading === true}
  <Loader />
{/if}

<!-- Change email -->
<Modal
  open={openEmail}
  contentClasses="bg-surface-50-950 p-2 md:p-4 rounded-lg"
>
  {#snippet content()}
    <ChangeEmailForm bind:open={openEmail} />
  {/snippet}
</Modal>

<!-- Change pass -->
<Modal open={openPass} contentClasses="bg-surface-50-950 p-2 md:p-4 rounded-lg">
  {#snippet content()}
    <ResetPassForm bind:open={openPass} />
  {/snippet}
</Modal>

<style>
  :global(.avatar-preview) {
    max-width: calc(var(--spacing) * 48);
    border-radius: var(--radius-lg);
  }
</style>
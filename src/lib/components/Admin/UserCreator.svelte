<script>  
  // Utilities
  import { toastError, toastSuccess } from '$lib/utils/toast';
  import { acceptedFileTypes, createZodValidator, usernameSchema } from '$lib/utils/validation/schema';
  
  // Component imports
  import Form from '../Forms/Form.svelte';
  import FormControls from '../Forms/FormControls.svelte';
  import Input from './Inputs/Input.svelte';
  
  // Skeleton UI component imports
  import { Modal } from '@skeletonlabs/skeleton-svelte';

  // Props
  let {
    data,
    updateID,
    label = "Create User",
    onAddUser = () => {}, // Callback prop from parent (data/event passing)
    uploadEndpoint = '/api?/createUser',
    open = false,
    required,
    subtext,
    accept,
    validate,
    guest = true
  } = $props();

  // Form state
  let loading = $state(false);
  let id = $state(null);
  let status = $state('draft');
  let email = $state("");
  let password = $state("");
  let avatar = $state("");
  let username = $state("");
  let displayname = $state("");
  let projectRole = $state("");
  let description = $state("");
  let links = $state([]);

  // Input validation
  let validateUsername = createZodValidator(usernameSchema);

  function closeModal() {
    open = false;
  };

  // Handle form sumbission
  async function handleSubmit({ formData }) {
    formData.append('avatar', avatar?.id ?? avatar);
    // Set form loading state
    loading = true;

    // Return the result of the request
    return async ({ result }) => {
      // If the request was sucessful
      if (result?.data?.success) {
        // Display success toast message
        toastSuccess("Upload successful!");
        // Update parent component with new data
        onAddUser(result?.data?.new_item);
        // Close the uploader modal
        closeModal();
      } else {
        // If app is in demo mode
        if (data?.settings?.demo_mode) {
          // Display custom error toast message
          toastError("Error during uploading:", "Uploading is disabled in demo mode! Apologies for the inconvenience.");
        } else {
          // Display error toast message
          toastError("Error during uploading:", result?.data?.error);
        }
      }
      // Regardless of the result, set loading state
      loading = false;
    };
  };

  function handleAdd() {
    if (maxUsers === 1) {
      if (selected && selected.length > 0 && selected.length < 2) {
        // Only add the first selected user in the array
        onAddUser(selected[0]);
        // Close the modal
        closeModal();
        // Display success toast
        toastSuccess(`${guest ? 'Guest' : 'User'} added!`)
      } else {
        // Something went wrong
        toastError("Failed to add ${guest ? 'guest' : 'user'}!")
      }
    } else {
      if (selected && selected.length > 0) {
        // Only add the first selected user in the array
        onAddUser(selected);
        // Close the modal
        closeModal();
        // Display success toast
        toastSuccess(`User${selected.length > 1 ? 's' : ''} added!`)
      } else {
        // Something went wrong
        toastError(`Failed to add user${selected.length > 1 ? 's' : ''}!`)
      }
    }
  }

  function resetValues() {
    id = null;
    status = 'draft';
    avatar = "";
    username = "";
    displayname = "";
    description = "";
    links = [];
  }

  // Close modal on cancel
  function handleCancel() {
    resetValues();
    closeModal();
  };

</script>

<!-- // TODO: This component is incomplete. // -->

<Modal
  {open}
  onOpenChange={(e) => (open = e.open)}
  triggerClasses="btn w-full preset-outlined-primary-500 "
  contentClasses="max-h-[calc(100dvh-2rem)] w-full overflow-y-auto shadow-xl shadow-surface-950/10 w-[calc(100vw-2rem)] md:max-w-2xl bg-surface-50-950 p-6 "
>
  {#snippet trigger()}
    {label}
  {/snippet}

  {#snippet content()}
    <div class="w-full relative">
      <div>
        <h4 class="h4 leading-none! mb-4">Create {guest ? 'Guest' : 'User'}</h4>
      </div>
      <!-- Type Select -->
      <!-- <div class="">
        <div class="">
          User Type
        </div>
        <div class="btn-group">
          <button type="button" class="btn {guest ? 'preset-filled-primary-500' : 'preset-filled-surface-300-700'}" onclick={()=>{guest = true}}>New Guest</button>
          <button type="button" class="btn {!guest ? 'preset-filled-primary-500' : 'preset-filled-surface-300-700'}" onclick={()=>{guest = false}}>New Account</button>
        </div>
      </div> -->
      <div>
        <Form
          action="/api/actions/{guest ? 'guests' : 'users'}?/create"
          method="POST"
          onSubmit={handleSubmit}
        >
          <Input type="media-import-simple" fetchTypes={["image"]} accept={[...acceptedFileTypes?.image]} name="avatar" label="Avatar" bind:value={avatar} />
          {#if !guest}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input type="text" name="email" label="Email" inputClasses="w-full" bind:value={email} />
            <Input type="password" name="password" label="Password" inputClasses="w-full" bind:value={password} />
          </div>
          {/if}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input type="text" name="displayname" label="Name/Displayname" inputClasses="w-full" bind:value={displayname} />
            <Input type="text" name="username" label="Username" inputClasses="w-full" bind:value={username} oninput={validateUsername} />
          </div>
          <Input type="text" name="project_role" label="Project Role" bind:value={projectRole} />
          <Input type="textarea" name="description" label="Description" inputClasses="w-full min-h-24 max-h-32!" bind:value={description} />

          {#snippet controls()}
            <FormControls handleDiscard={()=>{handleCancel()}} />
          {/snippet}
        </Form>
      </div>
    </div>
  {/snippet}
</Modal>

<script>

  // Svelte utilities
  import { enhance } from '$app/forms';

  // Utilities
  import { toastError, toastSuccess } from '$lib/utils/toast';
  
  // Skeleton UI components
  import { FileUpload, Modal } from '@skeletonlabs/skeleton-svelte';

  // Components
  import Loader from '$lib/components/Placeholders/Loader.svelte';

  // Export props
  let {
    data,
    onUploadComplete = () => {}, // Callback prop from parent
    uploadEndpoint = '/api/actions/media?/upload',
    open = false,
    required,
    maxFiles,
    subtext,
    accept,
    validate,
    triggerClasses
  } = $props();

  // Setup form state
  let loading = $state(false);
  let fileCount = $state(0);

  // Closes the modal
  function closeModal() {
    open = false;
  };

  // Handles form submission
  async function handleSubmit({ formData }) {
    // Set form state
    loading = true;

    // Await a response from the request
    return async ({ result }) => {
      // If the result contains a success state
      if (result?.data?.success === true) {
        // Display success toast message
        toastSuccess("Upload successful!");
        // Update the parent component with the new data
        onUploadComplete(result?.data?.new_files);
        // Close the modal
        closeModal();
      } else {
        // If the app is in demo mode
        if (data?.settings?.demo_mode) {
          // Display error toast message
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

  // Discard changes
  function handleCancel() {
    closeModal();
  };

  // Handles file upload errors with the component (from Skeleton UI docs)
  function handleAdd(e) {
    fileCount = 0;
    // We must check for errors in each uploaded file.
    if (e?.acceptedFiles?.length > 0) {
      fileCount = e?.acceptedFiles?.length;
    }
  }

  // Handles file upload errors with the component (from Skeleton UI docs)
  function handleError(e) {
    // We must check for errors in each uploaded file.
    for (let i = 0; i < e?.files?.length; i++) {
      // Assign those errors to a constant for easy reference.
      const errors = e?.files[i]?.errors
      // If errors do exist...
      if (errors?.length > 0) {
        // Turn array into a readable string
        let msg = '';
        for (let j = 0; j < errors.length; j++) {
          msg = msg + `${errors[j]}. `
        };
        const title = errors.length > 1 ? 'Error' : 'Errors';
        // Display toast error message
        toastError(title, ': ' + msg);
      }
    }
  }

</script>

<Loader {loading} />

<!-- Modal component (Skeleton UI) -->
<Modal
  {open}
  onOpenChange={(e) => (open = e.open)}
  triggerClasses="btn w-full preset-filled-primary-500 {triggerClasses}"
  contentClasses="max-h-[calc(100dvh-2rem)] w-full overflow-y-auto shadow-xl shadow-surface-950/10 w-[calc(100vw-2rem)] md:max-w-sm bg-surface-50-950 p-6 "
>
  <!-- Modal trigger -->
  {#snippet trigger()}
    Upload File{maxFiles > 1 ? 's' : ''}
  {/snippet}
  <!-- Modal contents -->
  {#snippet content()}
    <!-- Container -->
    <div class="w-full relative">
      <!-- Heading/title -->
      <h4 class="h4 leading-none! mb-4">Upload File{maxFiles > 1 ? 's' : ''}</h4>
      <!-- File upload form -->
      <form
        class="space-y-4"
        method="POST"
        action={uploadEndpoint}
        enctype="multipart/form-data"
        use:enhance={handleSubmit}
      >
        <!-- File upload component (Skeleton UI) -->
        <FileUpload
          name="file-uploader"
          {required}
          allowDrop
          {maxFiles}
          {subtext}
          {accept}
          {validate}
          disabled={loading}
          onFileChange={(e)=>{handleAdd(e)}}
          onFileReject={(e)=>{handleError(e)}}
        >
        </FileUpload>

        <!-- Form controls -->
        <div class="flex justify-between bg-surface-50-950">
          <!-- Cancel button -->
          <button class="btn preset-tonal-error" type="button" onclick={()=>{handleCancel()}} disabled={loading}>Cancel</button>
          <!-- Upload button (submit) -->
          <button class="btn preset-tonal-success" type="submit" disabled={loading || fileCount < 1}>Upload</button>
        </div>
      </form>
    </div>
  {/snippet}
</Modal>

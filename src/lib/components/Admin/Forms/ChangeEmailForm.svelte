<script>
  // Svelte utilities
  import { invalidateAll } from "$app/navigation";

  // Utilities
  import { toastError, toastSuccess } from "$lib/utils/toast";
  import { sleep } from "$lib/utils/delay.js";
  import { createZodValidator, emailSchema } from "$lib/utils/validation/schema";

  // Components
  import Form from "$lib/components/Forms/Form.svelte";
  import Input from "../Inputs/Input.svelte";

  // Props
  let {
    open = $bindable()
  } = $props();

  // Email validation
  const validateEmail = createZodValidator(emailSchema);

  // Component state
  let loading = $state(false);

  // Submit handler  
  async function handleSubmit() {
    loading = true;

    return async ({ result }) => {
      try {
        if (result?.data?.success === true) {
          open = false;
          toastSuccess(
            "Email change request sent!",
            "Check your inbox for instructions.",
          );
          sleep(100);
          invalidateAll();
        } else {
          toastError("Failed to send request!", result?.data?.error);
        }
      } catch (error) {
        toastError("An unexpected error occurred.", error);
      } finally {
        loading = false;
      }
    };
  }
</script>

<!-- Form -->
<Form
  method="POST"
  action="/api/auth/changeEmail?"
  onSubmit={handleSubmit}
  class="space-y-2 md:space-y-4 p-2 rounded-lg"
  controlClasses="grid grid-cols-2 gap-2"
>
  <!-- New email input -->
  <Input name="newEmail" label="New Email" oninput={validateEmail} />

  <!-- Form controls -->
  {#snippet controls()}
    <button
      type="button"
      class="btn preset-filled-surface-500"
      onclick={() => {
        open = !open;
      }}>Cancel</button
    >
    <button type="submit" class="btn preset-filled-success-500">Submit</button>
  {/snippet}
</Form>
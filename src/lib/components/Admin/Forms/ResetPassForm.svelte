<script>
  import { invalidateAll } from "$app/navigation";
  import { sleep } from "$lib/utils/delay";
  import { toastError, toastSuccess } from "$lib/utils/toast";
  import Form from "../../Forms/Form.svelte";

  let { open = $bindable() } = $props();

  let loading = $state(false);

  async function handleSubmit() {
    loading = true;
  
    return async ({ result }) => {
      try {
        if (result?.data?.success === true) {
          open = false;
          toastSuccess(
            "Password reset request sent!",
            "Check your email inbox for instructions.",
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

<Form
  method="POST"
  action="/api/auth/resetPassword?/request"
  onSubmit={handleSubmit}
  class="space-y-2 md:space-y-4 p-2 rounded-lg"
  controlClasses="grid grid-cols-2 gap-2"
>
  <h3 class="h3">Send password reset request</h3>
  <p class="">Are you sure you want to reset your password?</p>
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

<script>
  // Svelte utilities
  import { goto } from "$app/navigation"
	import { page } from '$app/state';

  // Utilities
  import { toastError, toastSuccess } from '$lib/utils/toast';
  import { passSchema } from '$lib/utils/validation/schema.js';

  // Components
  import Form from '$lib/components/Forms/Form.svelte';
  import Input from '$lib/components/Admin/Inputs/Input.svelte';

  // Form state
  let loading = $state(false);
	let password = $state(null);
	let passwordConfirm = $state(null);
  let showPass = $state(false)
  function handlePass(e) {
    showPass = !showPass
  }

  // Submit handler
  async function handleSubmit({ formData }) {
    // Enable loading state
    loading = true;

    // Pull verification token from URL
    formData.append("token", page?.url?.searchParams.get("token"));

    // When we get a response
    return async ({ result }) => {
      // On success
      if (result?.data?.success) {
        // Display success toast
        toastSuccess("Password has been changed!");
        // Redirect to home page
				goto('/');
      } else {
        // Display error toast
				toastError("Error resetting password:", result?.data?.error);
			}
      
      // Disable loading state
      loading = false
    }
  }

  // Client form validator
  // TODO: Move to utility file
  function createZodValidator(schema) {
    return (event) => {
      const input = event.target
      try {
        schema.parse(input.value)
        input.setCustomValidity('')
      } catch (err) {
        input.setCustomValidity(err.errors[0].message)
      }
    };
  }

  // Form validators
  const validatePassword = createZodValidator(passSchema)
  const validatePassConf = createZodValidator(passSchema)
</script>

<!-- Form -->
<Form
  method="POST"
  action="/api/auth/resetPassword?/reset"
  onSubmit={handleSubmit}
  class="w-fit h-fit"
  controlClasses="grid grid-cols-2 gap-2"
>
  <!-- New password -->
  <Input
    type="password"
    name="password"
    label="New Password" 
    bind:show={showPass}
    disabled={loading}
    oninput={validatePassword}
  >
    <p class="text-xs text-current/40 mt-1">
      Min: 8, Max: 64, Must contain at least 1 uppercase and lowercase
      letter, number, and special character !@#$%^&*
    </p>
  </Input>

  <!-- Confirm new password -->
  <Input
    type="password"
    name="passwordConfirm"
    label="Confirm New Password" 
    bind:show={showPass}
    disabled={loading}
    oninput={validatePassConf}
  >
    <p class="text-xs text-current/40 mt-1">
      Must match the password entered above.
    </p>
  </Input>

  <!-- Cancel -->
  <button
    type="button"
    class="btn preset-filled-surface-500"
    onclick={() => { goto("/"); }}
  >
    Cancel
  </button>

  <!-- Submit -->
  <button type="submit" class="btn preset-filled-success-500">Submit</button>
</Form>

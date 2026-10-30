<script>

  // Svelte utility imports
  import { invalidateAll } from '$app/navigation';

  // Better Auth client
  import { authClient } from '$lib/ComixClericLib/auth-client.js';

  // Utility imports
  import { toastError, toastSuccess } from '$lib/utils/toast';

  // Setup loading state
	let loading = $state(false)

	// Handle logout request
  async function handleLogout() {
		loading = true;

    try {
      await authClient.signOut();
      toastSuccess("You have successfully logged out!", "See you around!");
      invalidateAll();
    } catch {
      toastError("Failed to logout!", "Something went wrong.");
    }

		loading = false;
	}

</script>

<!-- Logout button -->
<button onclick={handleLogout} disabled={loading} class="btn preset-filled-warning-300-700">Logout</button>

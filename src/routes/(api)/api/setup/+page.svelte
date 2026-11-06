<script>
  // Svelte utilities
  import { goto, invalidateAll } from "$app/navigation";

  // Utilities
  import { toastError, toastSuccess } from "$lib/utils/toast";
  import { sleep } from "$lib/utils/delay";
  
  // Components
  import Form from "$lib/components/Forms/Form.svelte";
  import Input from "$lib/components/Admin/Inputs/Input.svelte";
  import Loader from "$lib/components/Placeholders/Loader.svelte";

  // Props
  let {
    data
  } = $props();
  
  // Form values
  let email = $state(null);
  let username = $state(null);
  let displayname = $state(null);
  let password = $state(null);
  let passwordConfirm = $state(null);
  
  // Form state
  let loading = $state(false);
  let showPass = $state(false);

  // Form submit handler
  const handleSubmit = ({ formData }) => { // `formData` is passed by the `use:enhance` attribute on the form element.
    loading = true;

    // Once we get a response from the server...
    return async ({ result, cookies }) => {
      if (result?.data?.success) {
        invalidateAll();
        await sleep(1000);
        toastSuccess("App setup was successful!", "Welcome to your new site!");
        goto('/_cc_admin');
      } else {
        toastError("Failed to setup!", result?.data?.error);
      }
      loading = false;
    };
  };

  // Discard all data
  function handleDiscard() {
    email = null;
    username = null;
    displayname = null;
    password = null;
    passwordConfirm = null;
  }
</script>

<!-- Page section -->
<section class="h-svh p-4 grid place-content-center gap-8">
  <!-- Page title -->
  <h3 class="h3 text-center">Setup Wizard</h3>
  
  <!-- Form -->
  {#if !data?.settings?.setup_complete}
    <Form
      action="?/setup"
      method="POST"
      enctype="multipart/form-data"
      onSubmit={handleSubmit}
      class="space-y-6 bg-surface-50-950 max-w-2xl! rounded-2xl"
    >
      <Loader {loading} />

      <!-- Input group -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 w-full">
        <!-- Email -->
        <Input
          type="email"
          name="email"
          label="Email"
          required
          autocomplete="email"
          desc="Must be a valid email address."
          placeholder="admin@example.com"
          class="w-full"
          inputClasses="w-full"
        >
          {#snippet tooltip()}
            <p class="">Provide a valid email address.</p>
          {/snippet}
        </Input>

        <!-- Username -->
        <Input
          type="text"
          name="username"
          label="Username"
          desc="A unique username for your account. (Restrictions apply)"
          placeholder="my.username76"
          class="w-full"
          inputClasses="w-full"
        >
          {#snippet tooltip()}
            <p class="">No special characters or spaces are allowed. Only lower case letters, numbers, and periods.</p>
          {/snippet}
        </Input>

        <!-- Display Name -->
        <Input
          type="text"
          name="displayname"
          label="Display Name"
          desc="A cosmetic name that will be displayed on your profile."
          placeholder="My Display Name!"
          class="w-full"
          inputClasses="w-full"
        >
          {#snippet tooltip()}
            <p class="">This can contain special characters, spaces, pretty much anything you want.</p>
          {/snippet}
        </Input>
      </div>

      <!-- Input group -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <!-- Password -->
        <Input
          type="password"
          name="password"
          label="Password"
          desc="Min: 8, Max: 64, Must contain one uppercase & lowercase character, one number, and one special character."
          class="w-full"
          bind:show={showPass}
        >
          {#snippet tooltip()}
            <p class="">Password must be:<br>At least 8 characters long<br>Contain at least one upper and lower case letter, one number, and one special character !@#$%^&*</p>
          {/snippet}
        </Input>

        <!-- Password confirm -->
        <Input
          type="password"
          name="passwordConfirm"
          label="Confirm Password"
          desc="Must match the previously entered password."
          class="w-full"
          bind:show={showPass}
        >
          {#snippet tooltip()}
            <p class="">Must match the previous password input.</p>
          {/snippet}
        </Input>
      </div>

      <!-- Submit -->
      <button type="submit" class="btn w-full text-lg font-semibold preset-filled-success-500">Setup App</button>
    </Form>

  <!-- If setup has complete -->
  {:else}
    <h3 class="h3">Page unavailable.</h3>
  {/if}
</section>

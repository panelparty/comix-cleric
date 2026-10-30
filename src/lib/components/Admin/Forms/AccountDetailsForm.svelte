<script>
  // Svelte utilities
  import { invalidateAll } from "$app/navigation";
  import { toastError, toastSuccess } from "$lib/utils/toast.js";
  
  // Components
  import Input from "../Inputs/Input.svelte";
  import Form from "$lib/components/Forms/Form.svelte";

  // Utilities
  import { Debounced } from "runed";
  import { sleep } from "$lib/utils/delay";
  import {
    createZodValidator,
    displaynameSchema,
    usernameSchema
  } from "$lib/utils/validation/schema";

  // Props
  let {
    data,
    open = $bindable(false)
  } = $props();

  // Destructure data
  let avatar = $state(data?.avatar);
  let username = $state(data?.username);
  let displayname = $state(data?.displayname);
  let inUse = $state(null);

  // Page state
  let loading = $state(false);

  // Form state
  const validateUsername = createZodValidator(usernameSchema);
  const validateDisplayname = createZodValidator(displaynameSchema);

  // Username check
  const debouncedUsername = new Debounced(() => username, 500);

  async function usernameExists() {
    if (
      debouncedUsername.current &&
      debouncedUsername.current != "" &&
      debouncedUsername.current?.length > 2
    ) {
      let res;
      try {
        res = await authClient.isUsernameAvailable({
          username: debouncedUsername
        });
      } catch (e) {}
      if (res?.username) {
        return (inUse = true);
      } else {
        return (inUse = false);
      }
    } else {
      inUse = null;
    }
  }

  $effect(() => {
    usernameExists();
  });

  // Form handlers
  async function handleSubmit() {
    loading = true;

    return async ({ result }) => {
      try {
        if (result?.data?.success === true) {
          open = false;
          toastSuccess("Account details updated!");
          sleep(100);
          invalidateAll();
        } else {
          toastError("Failed to update account details!", result?.data?.error);
        }
      } catch (error) {
        toastError("An unexpected error occurred.", error);
      } finally {
        loading = false;
      }
    };
  }

  function resetForm() {
    invalidateAll();
    open = false;
    username = data?.username;
    displayname = data?.displayname;
  }

  const hasChanges = () => {
    if (
      avatar !== null ||
      username != data?.username ||
      displayname != data?.displayname
    ) {
      return true;
    }

    return false;
  };
</script>

<Form
  action="/api?/updateUser"
  method="POST"
  enctype="multipart/form-data"
  onSubmit={handleSubmit}
  class="space-y-2 md:space-y-4 p-2 rounded-lg"
  controlClasses="grid grid-cols-2 gap-2"
>
  <Input
    type="text"
    name="displayname"
    label="Change Display Name"
    class="input rounded-lg px-4 py-3 user-valid:ring-success-500 user-invalid:ring-error-500"
    maxlength={32}
    bind:value={displayname}
    disabled={loading}
    oninput={validateDisplayname}
  >
    {#snippet tooltip()}
      <p class="">This is the display name of your account. It can contain any characters you want, and must be between 3 and 32 characters.</p>
      <p class="text-warning-700-300">Note: Do not use Markdwon or HTML here, it is not rendered and will show exactly as it is entered.</p>
    {/snippet}
    {#snippet after()}
      <p class="text-xs text-current/40 mt-1">Min: 3, Max: 32</p>
    {/snippet}
  </Input>

  <div class="">
    <div class="input-group grid grid-cols-[min-content_auto] rounded-lg">
      <div
        class="ig-cell h-full rounded-l-lg {inUse === null
          ? 'text-surface-700-300 bg-surface-100-900 border-current'
          : inUse
            ? 'text-error-500 bg-error-100-900! border-current!'
            : 'text-success-500 bg-success-100-900! border-current!'}"
        title="Username is {inUse === null
          ? 'invalid.'
          : inUse
            ? 'already in use.'
            : 'available!'}"
      >
        <i
          aria-label="Username is {inUse ? 'already in use.' : 'available!'}"
          class="text-lg ph-fill {inUse === null
            ? 'ph-minus-circle'
            : inUse
              ? 'ph-x-circle'
              : 'ph-check-circle'}"
        ></i>
      </div>
      <input
        class="ig-input rounded-r-lg px-4 py-3 user-valid:ring-success-500 user-invalid:ring-error-500"
        type="text"
        name="username"
        maxlength={24}
        bind:value={username}
        disabled={loading}
        oninput={validateUsername}
      />
    </div>
    <p class="text-xs text-current/40 mt-1">
      Min: 3, Max: 24, only letters, numbers, periods, underscores, and hyphens
      are allowed.
    </p>
  </div>

  {#snippet controls()}
    <button
      class="btn preset-filled-surface-300-700 rounded-md"
      type="button"
      onclick={() => resetForm()}>Cancel</button
    >
    <button
      class="btn preset-filled-success-300-700 rounded-md"
      type="submit"
      disabled={loading || !hasChanges()}>Update</button
    >
  {/snippet}
</Form>

<script>
  // Components
  import AuthForm from '$lib/components/Forms/AuthForm.svelte';

  // Skeleton UI components
  import { Modal } from '@skeletonlabs/skeleton-svelte';

  // Props
  let {
    open = $bindable(),
    data,
    register,
    demo,
    class: classname
  } = $props();

  // Modal state
  let authFormState = $state(false);
  function modalClose() {
    authFormState = false;
  }
</script>

<!-- Modal component (Skeleton UI) -->
<Modal
  bind:open
  onOpenChange={(e) => (authFormState = e.open)}
  triggerClasses="btn preset-filled-primary-500 {classname}"
  contentClasses=""
  backdropClasses="backdrop-blur-sm"
>
  <!-- Trigger -->
  {#snippet trigger()}
    Log In{!register || !data?.settings?.user_register ? '' : ' / Register'}
  {/snippet}
  
  <!-- Contents -->
  {#snippet content()}
    <!-- Authentication form component -->
    <AuthForm {data} {register} {demo} />
  {/snippet}
</Modal>

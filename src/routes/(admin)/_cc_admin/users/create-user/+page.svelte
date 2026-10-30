<script>

  // Component imports
  import UserForm from "$lib/components/Admin/Forms/UserForm.svelte";
  import FormPageHeader from "$lib/components/Admin/Forms/FormPageHeader.svelte";


  // Export props
  let {data} = $props();

</script>

<!-- Section container -->
<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_1fr] overflow-hidden">

  <FormPageHeader
    title="Create New Reader Account"
    back
  />

  <!-- Section title -->
  <!-- TODO: Move into form component -->
  <h3 class="h3 leading-none!">Create New Reader Account</h3>
  <!-- User form component -->
  <UserForm {data} create />

</section>

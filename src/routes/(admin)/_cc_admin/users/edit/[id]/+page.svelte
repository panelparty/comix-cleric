<script>

  // Component imports
  import StaffForm from "$lib/components/Admin/Forms/StaffForm.svelte";
  import UserForm from "$lib/components/Admin/Forms/UserForm.svelte";
  import FormPageHeader from "$lib/components/Admin/Forms/FormPageHeader.svelte";


  // Export props
  let { data } = $props();

  
  // Reassign server data
  let isStaff = $derived(data?.isStaff);

</script>

<!-- Section container -->
<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_1fr] overflow-hidden">

  <FormPageHeader
    title="Editing {isStaff ? "Staff" : "User"} Account"
    back
  />

  <!-- Display appropriate form -->
  {#if isStaff}
  <!-- Staff form component -->
  <StaffForm data={data} />
  {:else}
  <!-- User form component -->
  <UserForm data={data} />
  {/if}
</section>

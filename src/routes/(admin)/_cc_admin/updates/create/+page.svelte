<script>

  // Components
  import FormPageHeader from "$lib/components/Admin/Forms/FormPageHeader.svelte";
  import UpdateForm from "$lib/components/Admin/Forms/UpdateForm.svelte";


  // Export props
  let { data } = $props();

</script>

<!-- Section container -->
<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_1fr] overflow-hidden">
  <FormPageHeader
    title="Create New Update"
    back
  />

  <!-- Update form component (create mode) -->
  <UpdateForm create {data} />
</section>

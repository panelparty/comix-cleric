<script>

  // Component imports
  import UpdateForm from "$lib/components/Admin/Forms/UpdateForm.svelte";
  import FormPageHeader from "$lib/components/Admin/Forms/FormPageHeader.svelte";


  // Export props
  let { data } = $props();

</script>

<!-- Section container -->
<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_1fr] overflow-hidden">

  <FormPageHeader
    title="Editing Update"
    back
    preview="/comic/{data?.update?.slug}"
    create
    createLabel="Add New Update"
    createURL="/_cc_admin/updates/create"
  />

  <!-- Update form -->
  <UpdateForm {data} />

</section>

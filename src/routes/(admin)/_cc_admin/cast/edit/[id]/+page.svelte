<script>

  // Component imports
  import CastForm from "$lib/components/Admin/Forms/CastForm.svelte";
  import FormPageHeader from "$lib/components/Admin/Forms/FormPageHeader.svelte";

  
  // Export props
  let { data } = $props();

</script>

<!-- Page wrapper -->
<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_1fr] overflow-hidden">
  <FormPageHeader
    title="Editing Cast"
    back
    preview="/cast/{data?.cast?.slug}"
    create
    createLabel="Add New Cast"
    createURL="/_cc_admin/cast/create"
  />


  <!-- Cast form (self-contained) -->
  <CastForm {data} />
</section>

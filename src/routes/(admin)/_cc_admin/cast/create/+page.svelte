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
    title="Create New Cast"
    back
  />

  <!-- Cast form (self-contained) -->
  <CastForm create {data} />
</section>

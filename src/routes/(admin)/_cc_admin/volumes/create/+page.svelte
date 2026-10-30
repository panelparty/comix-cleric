<script>

  // Components
  import VolumeForm from "$lib/components/Admin/Forms/VolumeForm.svelte";
  import FormPageHeader from "$lib/components/Admin/Forms/FormPageHeader.svelte";


  // Props
  let { data } = $props();

</script>

<!-- Section container -->
<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_1fr] overflow-hidden">

  <FormPageHeader
    title="Create New Volume"
    back
  />

  <VolumeForm create {data} />
</section>

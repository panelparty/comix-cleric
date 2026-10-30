<script>

  // Component imports
  import GalleryForm from "$lib/components/Admin/Forms/GalleryForm.svelte";
  import FormPageHeader from "$lib/components/Admin/Forms/FormPageHeader.svelte";


  // Export props
  let { data } = $props();

</script>

<!-- Section container -->
<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_1fr] overflow-hidden">

  <FormPageHeader
    title="Create New Gallery Item"
    back
  />
  
  <!-- Gallery form (self-contained) -->
  <GalleryForm create {data} />
</section>

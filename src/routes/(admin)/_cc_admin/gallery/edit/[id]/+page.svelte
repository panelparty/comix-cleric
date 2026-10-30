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
    title="Editing Gallery Item"
    back
    preview="/gallery/{data?.gallery?.slug}"
    create
    createLabel="Add New Gallery Item"
    createURL="/_cc_admin/gallery/create"
  />

  <!-- Gallery form (self-contained) -->
  <GalleryForm {data} />
</section>

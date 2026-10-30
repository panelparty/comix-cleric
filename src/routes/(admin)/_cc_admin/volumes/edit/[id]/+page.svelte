<script>
    import FormPageHeader from "$lib/components/Admin/Forms/FormPageHeader.svelte";


  import VolumeForm from "$lib/components/Admin/Forms/VolumeForm.svelte";
  
let { data } = $props();

</script>

<!-- Section container -->
<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_1fr] overflow-hidden">

  <FormPageHeader
    title="Editing Volume"
    back
    preview="/archive/volumes/{data?.volume?.slug}"
    create
    createLabel="Add New Volume"
    createURL="/_cc_admin/volumes/create"
  />

  <VolumeForm {data} />
</section>

<script>

  // Components
  import PageForm from '$lib/components/Admin/Forms/PageForm.svelte';
  import FormPageHeader from '$lib/components/Admin/Forms/FormPageHeader.svelte';


  // Props
  let { data } = $props();

</script>


<!-- Page section -->
<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_1fr] overflow-hidden">
  <!-- Header -->
  <FormPageHeader
    title="Editing {data?.page?.name} Page"
    preview={data?.page?.url}
    back
  />

  <!-- Form -->
  <PageForm {data} />
</section>

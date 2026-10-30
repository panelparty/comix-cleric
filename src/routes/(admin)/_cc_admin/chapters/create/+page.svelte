<script>

  // Component imports
  import ChapterForm from "$lib/components/Admin/Forms/ChapterForm.svelte";
  import FormPageHeader from "$lib/components/Admin/Forms/FormPageHeader.svelte";


  // Export props
  let { data } = $props();

</script>

<!-- Section container -->
<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_1fr] overflow-hidden">

  <FormPageHeader
    title="Create New Chapter"
    back
  />

  <!-- Chapter form component (self-contained) -->
  <ChapterForm create {data} />
</section>

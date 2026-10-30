<script>

  // Component imports
  import SeriesForm from '$lib/components/Admin/Forms/SeriesForm.svelte';
  import FormPageHeader from '$lib/components/Admin/Forms/FormPageHeader.svelte';


  // Export props
  let { data } = $props();

</script>

<!-- Section container -->
<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_1fr] overflow-hidden">

  <FormPageHeader
    title="Editing Series"
    back
  />

  <!-- Series form (self-contained) -->
  <SeriesForm {data} />

</section>

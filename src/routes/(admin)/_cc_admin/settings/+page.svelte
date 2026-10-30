<script>
  // Svelte utilities
  

// Utilities
  

// Skeleton UI components
  

// Components
  import FormPageHeader from '$lib/components/Admin/Forms/FormPageHeader.svelte';
  import GlobalsForm from '$lib/components/Admin/Forms/GlobalsForm.svelte';


  // Props
  let {
    data
  } = $props();
</script>


<!-- Page header -->
<section class="w-[100cqi] h-[100cqb] max-w-5xl mx-auto space-y-2 sm:space-y-4 grid grid-rows-[min-content_1fr] overflow-hidden">
  <!-- Section heading -->
  <FormPageHeader
    {data}
    title="Global Settings"
    subtitle="These settings apply to your entire site!"
    back
  />

  <GlobalsForm {data} />
</section>

<script>
  // Component imports
  import Section from "$lib/components/DataBlocks/Section.svelte";
  import PageHeading from "$lib/components/DataBlocks/PageHeading.svelte";
  import ArchiveFull from "$lib/components/DataBlocks/ArchiveFull.svelte";

  // Props
  let { data } = $props();
</script>

<!-- Section wrapper -->
<Section wrapperWidth="var(--max-w-prose)">
  <!-- Page heading (title) component -->
  <PageHeading heading="Archive" />
  
  <!-- Archive component -->
  <ArchiveFull {data} />
</Section>

<script>
  // Components
  import Hero from "$lib/components/DataBlocks/Hero.svelte";
  import Section from "$lib/components/DataBlocks/Section.svelte";
  import ArchivePreview from "$lib/components/DataBlocks/ArchivePreview.svelte";
  import BlogPreview from "$lib/components/DataBlocks/BlogPreview.svelte";
  import BlueskyFeed from "$lib/components/Integrations/BlueskyFeed.svelte";
  import DataPreview from "$lib/components/Debug/DataPreview.svelte";
  import Reader from "$lib/components/Reader/Reader.svelte";

  // Props
  let { data } = $props();

  // Destructure data
  let mainSection = $derived(data?.main_section);

</script>

<!-- Injected into this pages <head> element -->
<svelte:head>
  <!-- Custom page title -->
  <title>{data?.settings?.name} | Home</title>
</svelte:head>

<!-- TODO: Use in ComponentRenderer -->
<!-- Hero component -->
{#if data?.settings?.main_section === "hero"}
  <Hero {data} />

<!-- Reader component -->
{:else if mainSection?.update}
  <Reader
    data={mainSection?.update}
    media={mainSection?.update?.featured_media}
    firstUpdate={mainSection?.firstUpdate}
    prevUpdate={mainSection?.prevUpdate}
    currentUpdate={mainSection?.update}
    nextUpdate={mainSection?.nextUpdate}
    lastUpdate={mainSection?.lastUpdate}
    format_strip={mainSection?.update?.format_strip ?? data?.settings?.format_strip ?? false}
    readerWidth={data?.settings?.reader_width ?? "var(--container-5xl)"}
    maxHeight={data?.settings?.reader_height ?? "var(--container-5xl)"}
  />
{/if}

<!-- Archive Preview -->
<!-- TODO: Use in ComponentRenderer -->
<ArchivePreview {data} />

<!-- Blog Preview -->
<!-- TODO: Use in ComponentRenderer -->
<BlogPreview {data} />

<!-- Blog Preview -->
<!-- TODO: Use in ComponentRenderer -->
{#if data?.settings?.bsky_feed}
<Section class="section-bsky-feed" wrapperWidth="var(--container-xl)">
  <BlueskyFeed {data} />
</Section>
{/if}

<style>
  :global(.section-bsky-feed) {
    background: var(--color-primary-300-700);
    padding: calc(var(--spacing) * 8) calc(var(--spacing) * 4);
  }
</style>
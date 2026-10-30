<script>
  // Utilities
  import { renderMarkdown } from '$lib/utils/sanitize/output.js';
  
  // Components
  import Author from "$lib/components/User/Author.svelte";
  import Image from "$lib/components/Media/Image.svelte";
  import Section from "$lib/components/DataBlocks/Section.svelte";
  import DisplayDate from '$lib/components/Display/DisplayDate.svelte';
  import EditLink from '$lib/components/Admin/EditLink.svelte';
    import PostContributors from '$lib/components/DataBlocks/PostContributors.svelte';

  // Props
  let { data } = $props();

  // Destructure server data
  const series = $derived(data?.series);
  const contributors = $derived(data?.contributors);
</script>


<!-- About series -->
<Section class="about-series-section" wrapperWidth="var(--container-3xl)" data-style="about">
  <!-- If `series` contains data -->
  {#if series}
    <!-- Edit details -->
    <EditLink {data} type="series" id={series?.id} label="series details" />
    
    <!-- Site info -->
    <div class="about-series-details gap-container">
      <!-- Site name -->
      {#if series?.logo}
      <Image
        src="/api/media/{series?.logo?.filename_disk}"
        alt="{series?.name} logo"
        fit="contain"
        class="about-series-logo"
      />
      {/if}
    
      <!-- If the series has a description -->
      {#if series?.description}
      <div class="about-series-details gap-container">
        <!-- Series heading -->
        <h2 class="title">About {series?.name}</h2>

        <!-- Info about the authors -->
        {#if contributors}
          <PostContributors {contributors} />
        {/if}
        <!-- Date published -->
        <DisplayDate data-style="about" label="Released:" date={series?.date_published} />
        <!-- Description -->
        <div class="about-series-description prose-override">
          <!-- Safely render description -->
          {@html renderMarkdown(series?.description)?.html}
        </div>
      </div>
      {/if}
    </div>
  {/if}
</Section>

<!-- About app -->
<Section class="about-app-section" wrapperWidth="var(--container-3xl)" data-style="about">
  <!-- Edit details -->
  <EditLink {data} route="settings" label="app details" />

  <!-- Description heading -->
  {#if data?.settings?.description}
  <div class="about-app-details gap-container">
    {#if data?.settings?.logo}
    <Image
      src="/api/media/{data?.settings?.logo?.filename_disk}"
      alt="{data?.settings?.name} logo"
      fit="contain"
      class="about-app-logo"
    />
    {/if}
    <!-- Heading/Title -->
    <h2 class="about-app-heading title">About {data?.settings?.name}</h2>
    <!-- Description -->
    <div class="about-app-description prose-override">
      <!-- Safely render description -->
      {@html renderMarkdown(data?.settings?.description)?.html}
    </div>
  </div>
  {/if}
</Section>

<style>
  :global(.display-date[data-style="about"]) {
    font-size: var(--text-base);
    color: var(--color-secondary-700-300);
  }

  :global(.section-container[data-style="about"]) {
		padding: calc(var(--spacing) * 8) calc(var(--spacing) * 4);
	}

  :global(.about-series-section) {
    background: var(--color-primary-100-900);
  }

  :global(.about-app-section) {
    background: var(--color-surface-200-800);
  }
</style>
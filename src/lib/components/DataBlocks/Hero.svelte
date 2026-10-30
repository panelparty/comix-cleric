<script>
  // Components
  import Section from "./Section.svelte";

  // Props
  let {
    data,
    img = "latest"
  } = $props()
</script>


{#if data?.update_count > 0}
<!-- Section container -->
<Section class="hero-container" wrapperClasses="hero-wrapper" wrapperWidth="var(--container-5xl)">
  <!-- Header container -->
  <div class="hero-title-container">
    <!-- Heading/title -->
    <h1 class="hero-title">{data?.settings?.hero_title}</h1>
    
    <!-- Subtitle -->
    <p class="hero-subtitle">{data?.settings?.hero_subtitle}</p>
  </div>

  <!-- Link container -->
  <div class="hero-button-container">
  {#if data?.settings?.hero_links?.length > 0}
    {#each data?.settings?.hero_links as link}
    <a href={link?.url} class="button hero-button">{link?.label}</a>
    {/each}

  {:else}
    <!-- If no links were found, show a link to the latest update -->
    <!-- TODO: Make this fallback customizable. -->
    <a href="/api/latest" class="button hero-button" data-preset="primary">First Update</a>
    <a href="/api/latest" class="button hero-button" data-preset="secondary">Latest Update</a>
  {/if}
  </div>
</Section>
{/if}

<style>
  :global(.hero-container) {
    position: relative;
    background: var(--color-primary-300-700);
    width: 100%;
    aspect-ratio: 4/5;
    padding: 0;
    display: flex;
    align-items: center;
    background-position: center;
    background-size: cover;
    overflow: hidden;

    @media (width >= 32rem) {
      aspect-ratio: 1;
    }

    @media (width >= 48rem) {
      aspect-ratio: 2/1;
    }
  }
  
  :global(.hero-wrapper) {
    width: 100%;
    height: 100%;
    display: flex;
    padding: calc(var(--spacing) * 4);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: calc(var(--spacing) * 8);
  }

  .hero-title-container {
    --tw-shadow-color: color-mix(in oklab, var(--color-surface-950) 10%, transparent);
    color: light-dark(var(--base-font-color), var(--color-white));
    text-align: center;
    text-shadow:
      0px 1px 0px var(--tw-text-shadow-color),
      0px 1px 1px var(--tw-text-shadow-color),
      0px 2px 2px var(--tw-text-shadow-color)
    ;
    display: flex;
    flex-direction: column;
  }

  .hero-subtitle {
    font-size: var(--text-2xl);
    font-weight: 500;
  }

  .hero-button-container {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--spacing) * 2);
    
    @media (width >= 48rem) {
      width: fit-content;
      flex-direction: row;
    }
  }

  .hero-button {
    width: 100%;
    padding: calc(var(--spacing) * 3) calc(var(--spacing) * 4);
    margin: 0 auto;
    font-size: var(--text-lg);
    border-width: var(--default-border-width);
    
    @media (width >= 48rem) {
      width: fit-content;
      margin: 0;
    }
    
    &[data-preset="primary"] {
      color: var(--color-primary-contrast-500);
      background-color: var(--color-primary-500);
      border-color: var(--color-primary-950);
    }
    
    &[data-preset="secondary"] {
      color: var(--color-secondary-contrast-500);
      background-color: var(--color-secondary-500);
      border-color: var(--color-secondary-950);
    }
  }
</style>

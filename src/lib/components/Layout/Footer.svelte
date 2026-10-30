<script>
  // Utilities
  import { parseCustomTags } from '$lib/utils/data/customTags';

  // Components
  import Logo from '$lib/components/Branding/Logo.svelte';
  import JumpToPage from '$lib/components/Archive/JumpToPage.svelte';
  import Sitemap from '$lib/components/Navigation/Sitemap.svelte';
  import SocialCTA from '$lib/components/DataBlocks/SocialCTA.svelte';
  import Copyright from '../DataBlocks/Copyright.svelte';
  import SourceAttribution from '../Branding/SourceAttribution.svelte';
  import AuthBanner from '../Auth/AuthBanner.svelte';

  // Props
  let { data } = $props();

  // Destructure server data
  let socials = $derived(data?.settings?.social_links);
  let copyright = $derived(parseCustomTags(data, data?.settings?.copyright));
</script>

<!-- Semantic HTML footer element -->
<footer class="page-footer">
  <!-- Site info -->
  <!-- TODO: Update to optionally show active series info. -->
  <div class="footer-info">
    <!-- Logo component -->
    <Logo {data} />

    <!-- Site copyright -->
    <Copyright data={copyright} />
    
    <!-- Codebase attribution -->
    <SourceAttribution {data} />
  </div>

  <!-- Site controls -->
  <!-- TODO: Make customizable. -->
  <div class="footer-social gap-container">
    <AuthBanner {data} />

    <!-- Social media links (if available) -->
    <SocialCTA data={socials} />
  </div>

  <!-- Site map and accessibility options -->
  <!-- TODO: make customizable -->
  <div class="footer-a11y gap-container">
    <!-- Sitemap component -->
    <Sitemap {data} />

    <!-- Jump to page component -->
    <div class="footer-a11y-jump">
      <JumpToPage {data} />
    </div>
  </div>
</footer>

<style>
  .page-footer {
    width: 100%;
    max-width: 100vw;
    margin: 0 auto;
    padding: calc(var(--spacing) * 4);
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: center;
    gap: calc(var(--spacing) * 4);

    @media (width >= 48rem) {
      flex-direction: row;
    }
  }

  .footer-info {
    width: 100%;
    gap: calc(var(--spacing) * 2);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer-a11y {
    align-items: center;
  }

  .footer-a11y-jump {
    min-width: max-content;
    display: grid;
    place-content: center;
  }
</style>
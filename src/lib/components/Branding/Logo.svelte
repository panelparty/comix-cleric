<script>
  // Components
  import Image from "../Media/Image.svelte";

  // Props
  let {
    data,
    href = "/",
    aria_label = "Go to home page"
  } = $props();
</script>

<!-- Link element -->
<a {href} aria-label={aria_label} class="app-logo-link">
  <!-- Logo image -->
  <Image
    alt="{data?.settings?.series_branding ? data?.series?.name : data?.settings?.name} logo"
    src="/api/media/{data?.settings?.series_branding ? data?.series?.logo?.filename_disk : data?.settings?.logo?.filename_disk}"
    class="app-logo"
    style="height: {data?.settings?.logo_height};"
  />
</a>

<style>
  .app-logo-link {
    display: block;
    width: fit-content;
    
    &:hover {
      opacity: .6;
    }
  }
</style>
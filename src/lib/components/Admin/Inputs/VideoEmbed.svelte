<script>

  import { setEmbed } from "$lib/utils/media";
  
let { src, autoplay, aspect = 16/9, class: className } = $props();

  async function videoAspect(url) {
    if (url?.has('youtube')) {
      const res = await fetch(`https://www.youtube.com/oembed?url=${url}&format=json`);

      const json = await res.json();
      const w = json?.width;
      const h = json?.height;
      const ratio = w / h;
      return ratio;
    }
  }
</script>

<iframe
  class="w-full h-auto {className}"
  style="aspect-ratio: {aspect};"
  src="{setEmbed(src)}{autoplay ? '?autoplay=1' : ''}"
  title="Video embed"
  frameborder="0"
  allow="accelerometer; {autoplay ? 'autoplay;' : ''} clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>

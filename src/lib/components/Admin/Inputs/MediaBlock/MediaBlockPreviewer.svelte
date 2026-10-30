<script>
  let { children } = $props();
</script>

<div class="media-previewer">
  {@render children?.()}
</div>

<style>
  .media-previewer {
    background: var(--color-surface-100-900);
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-template-rows: repeat(1, minmax(0, 1fr));
    aspect-ratio: 1;
    border-radius: var(--radius-xl);
    overflow: hidden;

    @media (width >= 48rem) {
      aspect-ratio: var(--aspect-video);
    }
    @media (width >= 48rem) {
      aspect-ratio: var(--aspect-video);
    }
  }
</style>
<script>
  // Props
  let {
    wrapperClasses,
    class: className,
    ...restProps
  } = $props();

</script>

<!-- Image container -->
<div class="image-wrapper {wrapperClasses}">
  <!-- Image -->
  <img class="image {className}" {...restProps}>
</div>

<style>
  .image-wrapper {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-template-rows: repeat(1, minmax(0, 1fr));
    place-items: center;
  }
  .image-wrapper.square {
    aspect-ratio: 1;
  }

  .image {
    min-width: 100%;
    min-height: 100%;
    display: block;
    object-fit: cover;
  }
</style>
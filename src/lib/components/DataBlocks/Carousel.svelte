<script>
  let {
    images,
    thumbs = true,
    selectedImage = 0,
    ...restProps
  } = $props();

  // Previous image
  function navPrev() {
    if (selectedImage > 0) {
      selectedImage--;
    }
  }

  // Next image
  function navNext() {
    if (selectedImage < images?.length - 1) {
      selectedImage++;
    }
  }
</script>

<!-- Carousel container -->
<div class="carousel-container {restProps?.class}" {...restProps}>
  <!-- Current image -->
  <img
    src="/api/media/{images[selectedImage]?.media?.filename_disk}"
    alt={images[selectedImage]?.media?.description}
    class="carousel-image"
  />
  <!-- Carousel navigation controls -->
  {#if images?.length > 1}
    <div class="carousel-controls">
      <!-- Previous button -->
      <button
        type="button"
        aria-label="Previous image"
        onclick={()=>navPrev()}
        disabled={selectedImage === 0}
        class="carousel-nav-main"
      >
        <!-- Previous (visual) button -->
        <div class="carousel-nav-button">
          <i class="ph-bold ph-caret-left"></i>
        </div>
      </button>

      <!-- Next button -->
      <button
        type="button"
        aria-label="Next image"
        onclick={()=>navNext()}
        disabled={selectedImage === images?.length - 1}
        class="carousel-nav-main"
      >
        <!-- Next (visual) button -->
        <div class="carousel-nav-button">
          <i class="ph-bold ph-caret-right"></i>
        </div>
      </button>
    </div>
  {/if}
</div>

<!-- Carousel previews -->
{#if thumbs && images.length > 1}
  <ul class="carousel-preview-list">
    <!-- Carousel buttons -->
    {#each images as image, i}
      <li>
        <button
          aria-label="Open gallery item"
          class="carousel-preview-button"
          data-active={selectedImage === i}
          onclick={() => {
            selectedImage = i;
          }}
        >
          <!-- Carousel images -->
          <img
            src="/api/media/{image?.media?.filename_disk}"
            alt="{images[selectedImage]?.media?.description} preview"
            class="carousel-preview-image"
          />
        </button>
      </li>
    {/each}
  </ul>
{/if}

<!-- Local styles -->
<style>
  .carousel-container {
    --max-height: var(--container-xl);

    position: relative;
    max-width: var(--container-5xl);
    max-height: var(--max-height);
    margin: 0 auto;
    border-radius: var(--radius-xl);
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    grid-template-rows: repeat(1, minmax(0, 1fr));
    place-items: center;
  }

  .carousel-image {
    display: block;
    height: 100%;
    width: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .carousel-controls {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: space-between;
  }

  .carousel-nav-main {
    width: fit-content;
    height: 100%;
    padding: calc(var(--spacing) * 2);
    cursor: pointer;

    &:hover * {
      background-color: var(--color-surface-50-950);
    }
    &:disabled {
      pointer-events: none;
    }
  }

  .carousel-nav-button {
    border-radius: var(--radius-md);
    padding: calc(var(--spacing) * 4) calc(var(--spacing) * 2);
    background-color: color-mix(in oklab, light-dark(var(--color-surface-50), var(--color-surface-950)) 40%, transparent);
    display: flex;
    justify-content: center;
  }
  
  .carousel-preview-list {
    max-width: var(--container-5xl);
    display: grid;
    gap: calc(var(--spacing) * 2);
    grid-template-columns: repeat(4, minmax(0, 1fr));
    padding-top: calc(var(--spacing) * 2);

    @media (width >= 48rem) {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }
    @media (width >= 64rem) {
      grid-template-columns: repeat(8, minmax(0, 1fr));
    }
  }

  .carousel-preview-button {
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
    border-color: var(--color-secondary-500);

    &[data-active="true"] {
      border-width: 2px;
    }
  }

  .carousel-preview-image {
    width: auto;
    min-width: 100%;
    height: 100%;
    min-height: 100%;
    object-fit: cover;
  }
</style>
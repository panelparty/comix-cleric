<script>
  // Components
  import Section from "./Section.svelte";
  import SectionHeading from "./SectionHeading.svelte";
  import PostDate from "./PostDate.svelte";
  import Image from "../Media/Image.svelte";
  import ProseContainer from "./ProseContainer.svelte";

  // Props
	let {
		data
	} = $props();

  // Destructure server data
	let blogs = $derived(data?.blogs);
  let latest = $derived(blogs?.[0]);
  let older = $derived(blogs?.slice(1));
</script>

<!-- Blog posts -->
{#if blogs?.length > 0}
<Section class="blog-preview-section" wrapperWidth="var(--container-3xl)">
  <!-- Main heading -->
  <SectionHeading heading="Latest Blog Post" color="surface" />

  <!-- Link to blog post -->
  <a href="/blog/{latest?.slug}" class="button blog-post-link">
    <!-- TODO: Check validity of this sematic element -->
    <article class="blog-post-container">
      <!-- Blog post thumbnail -->
      <Image
        src="/api/media/{latest?.cover?.filename_disk ?? data?.settings?.logo?.filename_disk}"
        alt="{latest?.name} thumbnail"
        wrapperClasses="blog-post-thumb-wrapper"
        class="blog-post-thumb"
      />
      
      <!-- Blog post details -->
      <div class="blog-post-details">
        <div class="gap-container" style="--gap: 1;">
          <!-- Blog post category label -->
          <p class="display-type">{latest?.type?.name ?? "Category"}</p>
          <!-- Blog post title heading -->
          <h4 class="truncate">{latest?.name ?? "Blog Post Title"}</h4>
        </div>

        <!-- Blog post blurb (short description) -->
        <ProseContainer data={latest?.blurb ?? "No description provided."} />

        <!-- Post dates -->
        <PostDate data={latest} updated />
      </div>
    </article>
  </a>

  <!-- If there is more than one blog, show a small list of older posts -->
  {#if older?.length > 0}
  <div class="gap-container">
    <!-- Older posts heading -->
    <h4 class="blog-older-heading">Older Blog Posts</h4>

    <!-- Short list of older blog posts -->
    <ul class="blog-older-list">
    {#each older as blog, i}
      <li>
        <!-- Link to blog post -->
        <a href="/blog/{blog?.slug}" class="button blog-post-link" data-layout="small">
          <!-- TODO: Check validity of this sematic element -->
          <article class="blog-post-container">
            <!-- Blog post thumbnail -->
            <Image
              src="/api/media/{blog?.cover?.filename_disk ?? data?.settings?.logo?.filename_disk}"
              alt="{blog?.name} thumbnail"
              wrapperClasses="blog-post-thumb-wrapper"
              class="blog-post-thumb"
            />
            <!-- Blog post details -->
            <div class="blog-post-details">
              <div class="gap-container" style="--gap: 1;">
                <!-- Blog post category label -->
                <p class="display-type">{blogs[0]?.type?.name ?? "Category"}</p>
                <!-- Blog post title heading -->
                <h4 class="truncate">{blog?.name ?? "Blog Post Title"}</h4>
              </div>

              <!-- Blog post blurb (short description) -->
              <ProseContainer data={blog?.blurb ?? "No description provided."} class="line-clamp-3" />

              <!-- Post dates -->
              <PostDate data={blogs[0]} updated />
            </div>
          </article>
        </a>
      </li>
    {/each}
    </ul>
    {#if data?.blog_count > 0}
      <a href="/blog" class="button archive-link">View Blog Archive</a>
    {/if}
  </div>
  {/if}
</Section>
{/if}

<style>
  :global(.blog-preview-section) {
    background: var(--color-surface-300-700);
    padding: calc(var(--spacing) * 8) calc(var(--spacing) * 4);
  }

  .blog-post-link {
    width: 100%;
    display: block;
    padding: 0 !important;
    background: light-dark(var(--color-surface-100), var(--color-surface-800));
    overflow: hidden;
  }

  .blog-post-container {
    width: 100%;
    display: grid;
    grid-template-rows: auto min-content;
    align-items: center;
  }

  :global(.blog-post-thumb-wrapper) {
    width: 100%;
    height: auto;
    background: var(--color-surface-500);
    aspect-ratio: var(--aspect-video);
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .blog-post-details {
    width: 100%;
    padding: calc(var(--spacing) * 4);
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 4);
  }

  .blog-older-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: calc(var(--spacing) * 2);

    @media (width >= 48rem) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
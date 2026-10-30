<script>
  // Svelte utilities
  import { page } from "$app/stores";

  // Utilities
  import { createPageState } from "$lib/utils/page/pageState.svelte.js";
  import { adminRoute } from "$lib/components/Admin/Layout/navigation.js";
  
  // Components
  import PageHeading from "$lib/components/DataBlocks/PageHeading.svelte";
  import ComingSoon from "$lib/components/Placeholders/ComingSoon.svelte";
  import Pagination from "$lib/components/Pagination/Pagination.svelte";
  import Section from "$lib/components/DataBlocks/Section.svelte";
  import DisplayDate from "$lib/components/Display/DisplayDate.svelte";
  import PageStatus from "$lib/components/Alerts/PageStatus.svelte";

  // Props
  let { data } = $props();

  // Months
  // TODO: Find a better way to handle this.
  const monthRef = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Destructure server data
  let blogs = $derived(data?.blogs ?? []);
  let blogsCount = $derived(data.blogs_filtered_count);
  let blogsCountTotal = $derived(data.blogs_count);
  let years = $derived(data?.years);
  let months = $derived(data?.months);

  // Page state
  let selectedTab = $state('blogs');
  let tab = $derived(selectedTab);
  let category = $state('*');

  // Pagination state
  let searchParams = createPageState($page.url,
    {
      page: 1,
      limit: data?.settings?.page_limit ?? 25,
    }
  );
  let openFilters = $state(false);
  let maxPage = $derived(Math.ceil(blogsCount / searchParams.state.limit));

  // Effect to ensure currentPage stays within bounds
  $effect(() => {
    if (maxPage > 0 && searchParams.state.page > maxPage) {
      searchParams.state.page = maxPage;
    }
  });
</script>

<!-- Page section -->
<Section class="blog-section" wrapperWidth="var(--container-5xl)">
  <!-- Page Heading -->
  <PageHeading heading="Blog" />

  {#if blogs.length > 0}
    <!-- Post list -->
    <ul class="blog-post-list">
      {#each blogs as item, i}
        <!-- Post item -->
        <li class="">
          <a href="/blog/{item?.slug}" class="post-card blog-post-item">
            <div class="blog-post-preview">
              <img src="/api/media/{item?.cover?.filename_disk ?? data?.settings?.logo?.filename_disk}" alt="Blog preview" class="preview-image">
            </div>

            <div class="blog-post-details-container">
              <div class="blog-post-details gap-container" style="--gap: 2;">
                <div class="">
                  <p class="display-type" title={item?.type?.name ?? 'Category'}>{item?.type?.name ?? 'Category'}</p>
                  
                  <h5 class="title" title={item?.name ?? 'Blog Title'}>{item?.name ?? 'Blog Title'}</h5>
                </div>

                <div class="blog-post-blurb-container">
                  <p class="blog-post-blurb" title="{item?.blurb}">{item?.blurb}</p>
                </div>
              </div>
              
              <DisplayDate date={item?.date_published} />
            </div>
          </a>
        </li>
      {/each}

      <Pagination
        data={blogs}
        count={blogsCount}
        onPageChange={(e) => searchParams.state.page = e.page}
        page={searchParams.state.page}
        bind:pageSize={searchParams.state.limit}
      />
    </ul>

  <!-- No posts found -->
  {:else}
    <ComingSoon />

    <!-- Disable page -->
    <PageStatus {data} />
  {/if}
</Section>

<style>
  :global(.blog-section) {
    padding: calc(var(--spacing) * 2);
  }

  .blog-post-list {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: calc(var(--spacing) * 2);
  }

  .blog-post-item {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    align-items: center;

    @media (width >= 48rem) {
      grid-template-columns: min-content auto;
    }
  }

  .blog-post-preview {
    width: 100%;
    aspect-ratio: 16/9;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--color-primary-300-700);

    @media (width >= 48rem) {
      height: calc(var(--spacing) * 32);
    }
  }
  .blog-post-preview img {
    min-width: 100%;
    min-height: 100%;
    display: block;
    object-fit: cover;
  }

  .blog-post-details-container {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    align-items: center;
    gap: calc(var(--spacing) * 2);
    padding: calc(var(--spacing) * 2);

    @media (width >= 48rem) {
      grid-template-columns: auto max-content;
      gap: calc(var(--spacing) * 3);
      padding: calc(var(--spacing) * 3);
    }
  }

  .blog-post-details {
    height: 100%;
  }

  .blog-post-blurb-container {
    height: 100%;
  }
  
  .blog-post-blurb {
    height: 100%;
    line-height: var(--leading-tight);
    overflow: hidden;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
</style>